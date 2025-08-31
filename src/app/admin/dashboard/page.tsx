import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/mongoose";
import { User } from "@/lib/models/User";
import { RBAC } from "@/lib/rbac";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata = {
  title: "Admin Dashboard - Strive",
  description: "System administration and monitoring dashboard",
};

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  await connectToDatabase();
  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    redirect("/auth/signin");
  }

  // Check if user has admin dashboard access
  if (!RBAC.hasPermission(user, "admin:dashboard:read")) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<AdminDashboardSkeleton />}>
        <AdminDashboard />
      </Suspense>
    </div>
  );
}

function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 bg-gray-200 rounded-sm w-64 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded-sm w-96"></div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="h-6 bg-gray-200 rounded-sm w-24"></div>
          <div className="h-9 bg-gray-200 rounded-sm w-20"></div>
        </div>
      </div>

      {/* Overview Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 bg-gray-200 rounded-sm w-16"></div>
              <div className="h-4 w-4 bg-gray-200 rounded-sm"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded-sm w-20 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded-sm w-32 mb-2"></div>
            <div className="flex space-x-2">
              <div className="h-5 bg-gray-200 rounded-sm w-16"></div>
              <div className="h-5 bg-gray-200 rounded-sm w-16"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="border rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="h-5 w-5 bg-gray-200 rounded-sm mr-2"></div>
              <div className="h-6 bg-gray-200 rounded-sm w-32"></div>
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-4 w-4 bg-gray-200 rounded-sm mr-2"></div>
                    <div className="h-4 bg-gray-200 rounded-sm w-24"></div>
                  </div>
                  <div className="h-5 bg-gray-200 rounded-sm w-16"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Activity Card Skeleton */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="h-5 w-5 bg-gray-200 rounded-sm mr-2"></div>
          <div className="h-6 bg-gray-200 rounded-sm w-32"></div>
        </div>
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-gray-200 rounded-sm w-20 mb-2"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-gray-200 rounded-full mr-3"></div>
                      <div className="h-4 bg-gray-200 rounded-sm w-32"></div>
                      <div className="h-4 bg-gray-200 rounded-sm w-12 ml-2"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-sm w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
