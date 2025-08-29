import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/mongoose";
import { User } from "@/lib/models/User";
import { RBAC } from "@/lib/rbac";
import { EmailTemplatePreview } from "@/components/email/EmailTemplatePreview";

export const metadata = {
  title: "Email Management - Admin",
  description: "Manage email templates and monitor email delivery",
};

export default async function AdminEmailsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  await connectToDatabase();
  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    redirect("/auth/signin");
  }

  // Check if user has email management access
  if (!RBAC.hasPermission(user, "emails:read")) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<EmailManagementSkeleton />}>
        <EmailTemplatePreview />
      </Suspense>
    </div>
  );
}

function EmailManagementSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-24"></div>
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="h-5 w-5 bg-gray-200 rounded mr-2"></div>
                <div className="h-6 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="space-y-3">
                {[...Array(2)].map((_, j) => (
                  <div key={j} className="p-3 border rounded-lg">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Preview Area Skeleton */}
        <div className="lg:col-span-2">
          <div className="border rounded-lg p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-200 rounded w-40"></div>
              <div className="h-6 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <div className="h-10 bg-gray-200 rounded w-32"></div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-96 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
