import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { OpportunityCreator } from "@/components/opportunities/OpportunityCreator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Create Opportunity - Strive",
  description: "Create a new opportunity for others to discover and apply to.",
};

export default async function CreateOpportunityPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create New Opportunity 🚀
            </h1>
            <p className="text-gray-600">
              Share an amazing opportunity with our community. Help others discover their next big break!
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Opportunity Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
                <OpportunityCreator user={session.user} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}