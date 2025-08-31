"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OpportunityFilters } from "./OpportunityFilters";
import { OpportunityCard } from "./OpportunityCard";
import { OpportunityListSkeleton } from "./OpportunitySkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
// Simple debounce implementation
function debounce<T extends (...args: any[]) => any>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
}

interface Opportunity {
  _id: string;
  title: string;
  description: string;
  category: string;
  organizerName: string;
  applicationDeadline: string;
  location?: string;
  country?: string;
  city?: string;
  isOnline: boolean;
  isFree: boolean;
  difficulty: string;
  isTeamBased: boolean;
  submissionCount: number;
  viewCount: number;
  logoUrl?: string;
  tags: string[];
  prizes?: Array<{
    position: string;
    amount?: number;
    description: string;
  }>;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface OpportunityListingClientProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "deadline", label: "Deadline" },
  { value: "popular", label: "Most Popular" },
  { value: "alphabetical", label: "A-Z" },
];

export function OpportunityListingClient({ searchParams }: OpportunityListingClientProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState((searchParams.search as string) || "");
  const [filters, setFilters] = useState({
    categories: searchParams.categories ? (searchParams.categories as string).split(",") : [],
    countries: searchParams.countries ? (searchParams.countries as string).split(",") : [],
    difficulties: searchParams.difficulties ? (searchParams.difficulties as string).split(",") : [],
    types: searchParams.types ? (searchParams.types as string).split(",") : [],
    isOnline: searchParams.isOnline === "true" ? true : undefined,
    isFree: searchParams.isFree === "true" ? true : undefined,
    isTeamBased: searchParams.isTeamBased === "true" ? true : undefined,
    minFee: searchParams.minFee ? parseInt(searchParams.minFee as string) : undefined,
    maxFee: searchParams.maxFee ? parseInt(searchParams.maxFee as string) : undefined,
    deadlineRange: (searchParams.deadlineRange as string) || undefined,
  });
  const [sortBy, setSortBy] = useState((searchParams.sort as string) || "newest");

  // Debounced search function
  const debouncedFetchOpportunities = useCallback(
    debounce(async (query: string, currentFilters: typeof filters, sort: string) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (query) params.set("search", query);
        if (currentFilters.categories.length > 0)
          params.set("category", currentFilters.categories.join(","));
        if (currentFilters.countries.length > 0)
          params.set("country", currentFilters.countries.join(","));
        if (currentFilters.difficulties.length > 0)
          params.set("difficulty", currentFilters.difficulties.join(","));
        if (currentFilters.isOnline) params.set("isOnline", "true");
        if (currentFilters.isFree) params.set("isFree", "true");
        if (currentFilters.isTeamBased) params.set("isTeamBased", "true");
        if (currentFilters.deadlineRange) params.set("deadlineRange", currentFilters.deadlineRange);
        if (sort) params.set("sort", sort);

        const response = await fetch(`/api/opportunities?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setOpportunities(data.data);
          setPagination(data.pagination);
        } else {
          setError(data.error || "Failed to fetch opportunities");
        }
      } catch (err) {
        console.error("Error fetching opportunities:", err);
        setError("Failed to load opportunities");
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // Fetch opportunities when search or filters change
  useEffect(() => {
    debouncedFetchOpportunities(searchQuery, filters, sortBy);
  }, [searchQuery, filters, sortBy, debouncedFetchOpportunities]);

  // Update URL when filters change
  const updateURL = useCallback(
    (newFilters: typeof filters, newSearch: string, newSort: string) => {
      const params = new URLSearchParams();
      if (newSearch) params.set("search", newSearch);
      if (newFilters.categories.length > 0)
        params.set("categories", newFilters.categories.join(","));
      if (newFilters.countries.length > 0) params.set("countries", newFilters.countries.join(","));
      if (newFilters.difficulties.length > 0)
        params.set("difficulties", newFilters.difficulties.join(","));
      if (newFilters.isOnline) params.set("isOnline", "true");
      if (newFilters.isFree) params.set("isFree", "true");
      if (newFilters.isTeamBased) params.set("isTeamBased", "true");
      if (newFilters.deadlineRange) params.set("deadlineRange", newFilters.deadlineRange);
      if (newSort && newSort !== "newest") params.set("sort", newSort);

      const newURL = params.toString() ? `?${params.toString()}` : "";
      router.push(`/opportunities${newURL}`, { scroll: false });
    },
    [router]
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateURL(filters, value, sortBy);
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    updateURL(updatedFilters, searchQuery, sortBy);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateURL(filters, searchQuery, value);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      categories: [],
      countries: [],
      difficulties: [],
      types: [],
      isOnline: undefined,
      isFree: undefined,
      isTeamBased: undefined,
      minFee: undefined,
      maxFee: undefined,
      deadlineRange: undefined,
    };
    setFilters(clearedFilters);
    setSearchQuery("");
    setSortBy("newest");
    updateURL(clearedFilters, "", "newest");
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.countries.length > 0 ||
    filters.difficulties.length > 0 ||
    filters.types.length > 0 ||
    filters.isOnline ||
    filters.isFree ||
    filters.isTeamBased ||
    filters.deadlineRange ||
    Boolean(searchQuery) ||
    sortBy !== "newest";

  const loadMore = async () => {
    if (!pagination?.hasNext) return;

    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (filters.categories.length > 0) params.set("category", filters.categories.join(","));
      if (filters.countries.length > 0) params.set("country", filters.countries.join(","));
      if (filters.difficulties.length > 0) params.set("difficulty", filters.difficulties.join(","));
      if (filters.isOnline) params.set("isOnline", "true");
      if (filters.isFree) params.set("isFree", "true");
      if (filters.isTeamBased) params.set("isTeamBased", "true");
      if (filters.deadlineRange) params.set("deadlineRange", filters.deadlineRange);
      if (sortBy) params.set("sort", sortBy);
      params.set("page", (pagination.currentPage + 1).toString());

      const response = await fetch(`/api/opportunities?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setOpportunities(prev => [...prev, ...data.data]);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error("Error loading more opportunities:", err);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">{error}</div>
        <Button
          onClick={() => debouncedFetchOpportunities(searchQuery, filters, sortBy)}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-8">
      {/* Filters Sidebar */}
      <div className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-80 shrink-0`}>
        <OpportunityFilters
          filters={filters}
          onFiltersChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          isOpen={showFilters}
          onToggle={() => setShowFilters(!showFilters)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Search and Sort Header */}
        <div className="bg-white rounded-lg shadow-xs border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={e => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-1 bg-orange-500 text-white text-xs rounded-full px-2">
                    {
                      [
                        filters.categories.length > 0,
                        filters.countries.length > 0,
                        filters.difficulties.length > 0,
                        filters.types.length > 0,
                        filters.isOnline,
                        filters.isFree,
                        filters.isTeamBased,
                        filters.deadlineRange,
                        Boolean(searchQuery),
                        sortBy !== "newest",
                      ].filter(Boolean).length
                    }
                  </span>
                )}
              </Button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={e => handleSortChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading && opportunities.length === 0 ? (
          <OpportunityListSkeleton />
        ) : (
          <>
            {/* Results Header */}
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  {pagination ? `${pagination.totalCount} Opportunities Found` : "Opportunities"}
                </h2>

                {hasActiveFilters && <div className="text-sm text-gray-500">Filtered results</div>}
              </div>

              {searchQuery && (
                <p className="text-sm text-gray-600 mt-1">Results for &quot;{searchQuery}&quot;</p>
              )}
            </div>

            {/* Opportunity Grid */}
            {opportunities.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No opportunities found</div>
                <p className="text-gray-400 mt-2">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {opportunities.map(opportunity => (
                  <OpportunityCard
                    key={opportunity._id}
                    opportunity={{
                      ...opportunity,
                      daysUntilDeadline: Math.ceil(
                        (new Date(opportunity.applicationDeadline).getTime() - Date.now()) /
                          (1000 * 60 * 60 * 24)
                      ),
                      bookmarkCount:
                        opportunity.viewCount > 100 ? Math.floor(opportunity.viewCount * 0.1) : 0,
                      slug: opportunity._id, // Temporary until we have proper slugs
                      fee: opportunity.isFree ? 0 : undefined,
                      currency: "USD",
                      isVerified: Math.random() > 0.7, // Temporary
                      isFeatured: Math.random() > 0.9, // Temporary
                    }}
                    onBookmark={id => {
                      console.log("Bookmark opportunity:", id);
                      // TODO: Implement bookmark functionality
                    }}
                    isBookmarked={false} // TODO: Implement bookmark state
                  />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {pagination?.hasNext && (
              <div className="text-center mt-8">
                <Button onClick={loadMore} variant="outline" size="lg" disabled={loading}>
                  {loading ? "Loading..." : "Load More Opportunities"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
