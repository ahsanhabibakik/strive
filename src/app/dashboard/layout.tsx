import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
// import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardBreadcrumb } from "@/components/dashboard/DashboardBreadcrumb";
import connectToDatabase from "@/lib/mongoose";
import { User } from "@/lib/models/User";
import { RBAC } from "@/lib/rbac";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  let user = null;

  try {
    // Try to get user from database
    await connectToDatabase();
    user = await User.findOne({ email: session.user.email });
  } catch (error) {
    // If database fails, create mock user from session
    console.log("Database not available, using session user");
  }

  // Use mock user for testing if no database user found
  if (!user) {
    user = {
      _id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: (session.user as any).role || "user",
      image: (session.user as any).image,
      isActive: true,
      permissions:
        (session.user as any).role === "admin"
          ? [
              "users:read",
              "users:write",
              "content:read",
              "content:write",
              "analytics:read",
              "settings:read",
              "settings:write",
            ]
          : ["content:read", "analytics:read", "settings:read"],
    };
  }

  // For testing, allow all authenticated users dashboard access
  if (!user || !user.isActive) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <DashboardSidebar user={user} />

      <div className="lg:pl-72">
        <DashboardHeader user={user} />

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <DashboardBreadcrumb />

            <div className="mt-6">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
                  </div>
                }
              >
                {children}
              </Suspense>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
