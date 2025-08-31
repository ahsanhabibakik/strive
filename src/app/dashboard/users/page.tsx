import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/mongoose";
import { User } from "@/lib/models/User";
import { RBAC } from "@/lib/rbac";
import { UsersTable } from "@/components/dashboard/users/UsersTable";
import { UsersStats } from "@/components/dashboard/users/UsersStats";
import { UserFilters } from "@/components/dashboard/users/UserFilters";

export const metadata = {
  title: "User Management - Dashboard",
  description: "Manage users, roles, and permissions",
};

interface SearchParams {
  page?: string;
  limit?: string;
  search?: string;
  role?: string;
  status?: string;
}

interface UsersPageProps {
  searchParams: Promise<SearchParams>;
}

async function getUsersData(searchParams: SearchParams, _currentUser: any) {
  await connectToDatabase();

  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");
  const skip = (page - 1) * limit;

  // Build filter query
  const filter: any = {};

  if (searchParams.search) {
    filter.$or = [
      { name: { $regex: searchParams.search, $options: "i" } },
      { email: { $regex: searchParams.search, $options: "i" } },
    ];
  }

  if (searchParams.role) {
    filter.role = searchParams.role;
  }

  if (searchParams.status) {
    filter.isActive = searchParams.status === "active";
  }

  // Get users with pagination
  const users = await User.find(filter)
    .select("-password")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await User.countDocuments(filter);

  // Get stats
  const stats = {
    total: await User.countDocuments(),
    active: await User.countDocuments({ isActive: true }),
    inactive: await User.countDocuments({ isActive: false }),
    admins: await User.countDocuments({ role: "admin" }),
    moderators: await User.countDocuments({ role: "moderator" }),
    users: await User.countDocuments({ role: "user" }),
    newThisMonth: await User.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
    }),
  };

  return {
    users: JSON.parse(JSON.stringify(users)),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
    stats,
  };
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  await connectToDatabase();
  const currentUser = await User.findOne({ email: session.user.email });

  if (!currentUser || !RBAC.hasPermission(currentUser, "users:read")) {
    redirect("/dashboard");
  }

  const resolvedSearchParams = await searchParams;
  const { users, pagination, stats } = await getUsersData(resolvedSearchParams, currentUser);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage users, roles, and permissions across your application.
        </p>
      </div>

      {/* Stats */}
      <UsersStats stats={stats} />

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <UserFilters searchParams={resolvedSearchParams} />

        {RBAC.hasPermission(currentUser, "users:write") && (
          <div className="flex gap-2">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-2xs ring-3 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Export Users
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-2xs hover:bg-indigo-500 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add User
            </button>
          </div>
        )}
      </div>

      {/* Users Table */}
      <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
        <UsersTable
          users={users}
          pagination={pagination}
          currentUser={currentUser}
          searchParams={resolvedSearchParams}
        />
      </Suspense>
    </div>
  );
}
