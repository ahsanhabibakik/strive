import { Metadata } from "next";
import { Suspense } from "react";
import SearchResults from "./SearchResults";

export const metadata: Metadata = {
  title: 'Search - Strive',
  description: 'Search through our blog posts, documentation, and resources.',
};

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search</h1>
          <p className="text-gray-600">
            Find blog posts, tutorials, and resources across our entire site.
          </p>
        </div>
        
        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        }>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}