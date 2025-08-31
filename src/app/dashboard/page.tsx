import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

export const metadata = {
  title: "Dashboard - Strive",
  description: "View your applications, saved opportunities, and personalized recommendations.",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {session.user.name?.split(" ")[0] || "there"}! 👋
          </h1>
          <p className="text-gray-600">
            Track your applications, manage saved opportunities, and discover new ones.
          </p>
        </div>

        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardClient user={session.user} />
        </Suspense>
      </main>
    </div>
  );
}
