import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { GoalList } from "@/components/goals/GoalList";
import { GoalCreator } from "@/components/goals/GoalCreator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon, ChartBarIcon, TargetIcon, TrophyIcon } from "@heroicons/react/24/outline";

export const metadata = {
  title: "Goals - Strive",
  description:
    "Set, track, and achieve your personal and professional goals with data-driven insights.",
};

export default async function GoalsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Goals 🎯</h1>
          <p className="text-gray-600">
            Set SMART goals, track your progress, and celebrate your achievements.
          </p>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="active" className="flex items-center gap-2">
                <TargetIcon className="h-4 w-4" />
                Active
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <TrophyIcon className="h-4 w-4" />
                Completed
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <ChartBarIcon className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <GoalCreator />
          </div>

          <TabsContent value="active" className="space-y-6">
            <Suspense fallback={<GoalListSkeleton />}>
              <GoalList status="active" />
            </Suspense>
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <Suspense fallback={<GoalListSkeleton />}>
              <GoalList status="completed" />
            </Suspense>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <TargetIcon className="h-4 w-4" />
                    Total Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-gray-500">Lifetime goals created</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <TrophyIcon className="h-4 w-4" />
                    Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <p className="text-xs text-gray-500">Goals achieved</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <ChartBarIcon className="h-4 w-4" />
                    Success Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-indigo-600">67%</div>
                  <p className="text-xs text-gray-500">Overall completion rate</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Progress Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Analytics charts and insights coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function GoalListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded-sm w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded-sm w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded-sm w-2/3 mb-4"></div>
              <div className="h-2 bg-gray-200 rounded-sm w-full mb-2"></div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded-sm w-24"></div>
                <div className="h-8 bg-gray-200 rounded-sm w-20"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
