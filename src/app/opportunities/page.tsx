import { Suspense } from "react";
import { OpportunityListingClient } from "@/components/opportunities/OpportunityListingClient";
import { OpportunitySkeleton } from "@/components/opportunities/OpportunitySkeleton";

export const metadata = {
  title: "Discover Global Opportunities - Strive",
  description:
    "Find competitions, scholarships, internships, hackathons, and more opportunities from around the world. Filter by location, category, difficulty, and deadline.",
  keywords:
    "opportunities, competitions, scholarships, internships, hackathons, student opportunities, global opportunities, youth programs",
};

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-orange-500 to-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Discover Global Opportunities
            </h1>
            <p className="mt-4 text-xl text-orange-100">
              Competitions • Scholarships • Internships • Hackathons • Workshops
            </p>
            <div className="mt-6 flex justify-center">
              <div className="bg-white rounded-lg p-1 max-w-md w-full">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Search opportunities..."
                    className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500 rounded-l-md border-0 focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  />
                  <button className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-r-md hover:bg-orange-600 focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-xs border border-gray-200 p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">2,847</div>
              <div className="text-sm text-gray-500">Active Opportunities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">156</div>
              <div className="text-sm text-gray-500">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">45,231</div>
              <div className="text-sm text-gray-500">Students Participating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">$2.4M</div>
              <div className="text-sm text-gray-500">Total Prize Money</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Suspense fallback={<OpportunitySkeleton />}>
          <OpportunityListingClient searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
