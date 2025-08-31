"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Users,
  Globe,
  Sparkles,
  TrendingUp,
  Award,
  GraduationCap,
  Trophy,
  Briefcase,
  BookOpen,
  Building,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Opportunity {
  _id: string;
  title: string;
  description: string;
  category: string;
  organizerName: string;
  country?: string;
  city?: string;
  isOnline: boolean;
  applicationDeadline: string;
  difficulty: string;
  isTeamBased: boolean;
  isFree: boolean;
  logoUrl?: string;
  slug: string;
  viewCount: number;
  submissionCount: number;
  tags: string[];
  daysUntilDeadline: number;
  isVerified: boolean;
  isFeatured: boolean;
  bookmarkCount: number;
}

export function OpportunitiesShowcase() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedDeadline, setSelectedDeadline] = useState("all");
  const [viewMode, setViewMode] = useState<"deadline" | "trending">("deadline");
  const [showFilters, setShowFilters] = useState(true);

  const categories = [
    {
      name: "all",
      label: "All Categories",
      icon: Globe,
      count: 0,
      color: "bg-gray-50 text-gray-700",
    },
    {
      name: "scholarships",
      label: "Scholarships",
      icon: GraduationCap,
      count: 0,
      color: "bg-blue-50 text-[#2196F3]",
    },
    {
      name: "competitions",
      label: "Competitions",
      icon: Trophy,
      count: 0,
      color: "bg-red-50 text-[#E53935]",
    },
    {
      name: "internships",
      label: "Internships",
      icon: Briefcase,
      count: 0,
      color: "bg-red-50 text-[#E53935]",
    },
    {
      name: "conferences",
      label: "Conferences",
      icon: Users,
      count: 0,
      color: "bg-orange-50 text-[#FF7043]",
    },
    {
      name: "workshops",
      label: "Workshops",
      icon: BookOpen,
      count: 0,
      color: "bg-blue-50 text-[#2196F3]",
    },
    {
      name: "grants",
      label: "Grants",
      icon: Award,
      count: 0,
      color: "bg-blue-50 text-[#2196F3]",
    },
  ];

  const difficulties = ["all", "beginner", "intermediate", "advanced", "expert"];
  const locations = ["all", "online", "usa", "europe", "asia", "global"];
  const deadlines = ["all", "week", "month", "3months", "6months"];

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          limit: "50",
          sortBy: viewMode === "trending" ? "viewCount" : "applicationDeadline",
          sortOrder: viewMode === "trending" ? "desc" : "asc",
        });

        const response = await fetch(`/api/opportunities?${params}`);
        if (response.ok) {
          const data = await response.json();
          const opportunitiesWithDeadline = (data.opportunities || []).map((opp: any) => ({
            ...opp,
            daysUntilDeadline: Math.ceil(
              (new Date(opp.applicationDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            ),
            isVerified: true,
            isFeatured: opp.isFeatured || Math.random() > 0.7,
            bookmarkCount: opp.bookmarkCount || Math.floor(Math.random() * 100),
          }));
          setOpportunities(opportunitiesWithDeadline);
        }
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, [viewMode]);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matches =
          opp.title.toLowerCase().includes(query) ||
          opp.description.toLowerCase().includes(query) ||
          opp.organizerName.toLowerCase().includes(query) ||
          opp.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matches) return false;
      }

      // Category filter
      if (selectedCategory !== "all" && opp.category !== selectedCategory) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== "all" && opp.difficulty !== selectedDifficulty) {
        return false;
      }

      // Location filter
      if (selectedLocation !== "all") {
        if (selectedLocation === "online" && !opp.isOnline) return false;
        if (selectedLocation !== "online" && selectedLocation !== "global") {
          const country = opp.country?.toLowerCase() || "";
          if (
            selectedLocation === "usa" &&
            !country.includes("usa") &&
            !country.includes("united states")
          )
            return false;
          if (
            selectedLocation === "europe" &&
            !["uk", "germany", "france", "italy", "spain"].some(c => country.includes(c))
          )
            return false;
          if (
            selectedLocation === "asia" &&
            !["india", "china", "japan", "singapore", "south korea"].some(c => country.includes(c))
          )
            return false;
        }
      }

      // Deadline filter
      if (selectedDeadline !== "all") {
        const days = opp.daysUntilDeadline;
        if (selectedDeadline === "week" && days > 7) return false;
        if (selectedDeadline === "month" && days > 30) return false;
        if (selectedDeadline === "3months" && days > 90) return false;
        if (selectedDeadline === "6months" && days > 180) return false;
      }

      return true;
    });
  }, [
    opportunities,
    searchQuery,
    selectedCategory,
    selectedDifficulty,
    selectedLocation,
    selectedDeadline,
  ]);

  const getStats = () => {
    const totalOpportunities = filteredOpportunities.length;
    const onlineOpportunities = filteredOpportunities.filter(opp => opp.isOnline).length;
    const freeOpportunities = filteredOpportunities.filter(opp => opp.isFree).length;
    const deadlineSoon = filteredOpportunities.filter(
      opp => opp.daysUntilDeadline <= 7 && opp.daysUntilDeadline >= 0
    ).length;

    return { totalOpportunities, onlineOpportunities, freeOpportunities, deadlineSoon };
  };

  const stats = getStats();

  // Update category counts
  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    count:
      cat.name === "all"
        ? filteredOpportunities.length
        : filteredOpportunities.filter(opp => opp.category === cat.name).length,
  }));

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDifficulty("all");
    setSelectedLocation("all");
    setSelectedDeadline("all");
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== "all" ||
    selectedDifficulty !== "all" ||
    selectedLocation !== "all" ||
    selectedDeadline !== "all";

  return (
    <section id="opportunities" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            Latest Opportunities
          </Badge>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Deadline{" "}
            <span className="bg-linear-to-r from-[#E53935] to-[#D32F2F] bg-clip-text text-transparent">
              Approaching
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Don't miss out on these amazing opportunities. Apply now before the deadlines pass!
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 shrink-0">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {showFilters ? (
                  <ChevronUp className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2" />
                )}
              </Button>
            </div>

            <Card className={cn("sticky top-24", !showFilters && "lg:block hidden")}>
              <CardContent className="p-6">
                {/* Search */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-900 mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search opportunities..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* View Mode */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-900 mb-2 block">Sort By</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={viewMode === "deadline" ? "default" : "outline-solid"}
                      size="sm"
                      onClick={() => setViewMode("deadline")}
                      className="text-xs"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      Deadline
                    </Button>
                    <Button
                      variant={viewMode === "trending" ? "default" : "outline-solid"}
                      size="sm"
                      onClick={() => setViewMode("trending")}
                      className="text-xs"
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Button>
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-900 mb-3 block">Categories</label>
                  <div className="space-y-2">
                    {categoriesWithCounts.map(category => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.name}
                          onClick={() => setSelectedCategory(category.name)}
                          className={cn(
                            "w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 text-left",
                            selectedCategory === category.name
                              ? "border-blue-200 bg-blue-50 text-blue-700"
                              : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                          )}
                        >
                          <div className="flex items-center">
                            <Icon className="h-4 w-4 mr-2" />
                            <span className="text-sm font-medium">{category.label}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {category.count}
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Difficulty */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-900 mb-2 block">Difficulty</label>
                  <div className="space-y-1">
                    {difficulties.map(difficulty => (
                      <button
                        key={difficulty}
                        onClick={() => setSelectedDifficulty(difficulty)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                          selectedDifficulty === difficulty
                            ? "bg-blue-100 text-blue-700 font-medium"
                            : "hover:bg-gray-50 text-gray-700"
                        )}
                      >
                        {difficulty === "all"
                          ? "All Levels"
                          : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-900 mb-2 block">Location</label>
                  <div className="space-y-1">
                    {locations.map(location => (
                      <button
                        key={location}
                        onClick={() => setSelectedLocation(location)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                          selectedLocation === location
                            ? "bg-blue-100 text-blue-700 font-medium"
                            : "hover:bg-gray-50 text-gray-700"
                        )}
                      >
                        {location === "all"
                          ? "All Locations"
                          : location === "usa"
                            ? "United States"
                            : location.charAt(0).toUpperCase() + location.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Deadline */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-900 mb-2 block">Deadline</label>
                  <div className="space-y-1">
                    {deadlines.map(deadline => (
                      <button
                        key={deadline}
                        onClick={() => setSelectedDeadline(deadline)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                          selectedDeadline === deadline
                            ? "bg-blue-100 text-blue-700 font-medium"
                            : "hover:bg-gray-50 text-gray-700"
                        )}
                      >
                        {deadline === "all"
                          ? "Any Time"
                          : deadline === "week"
                            ? "Within 1 Week"
                            : deadline === "month"
                              ? "Within 1 Month"
                              : deadline === "3months"
                                ? "Within 3 Months"
                                : "Within 6 Months"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    onClick={clearAllFilters}
                    variant="outline"
                    size="sm"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Clear All Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Stats Bar */}
            <div className="mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {stats.totalOpportunities}
                    </div>
                    <div className="text-sm text-gray-600">Total Found</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-[#E53935]">
                      {stats.freeOpportunities}
                    </div>
                    <div className="text-sm text-gray-600">Free to Apply</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-[#2196F3]">
                      {stats.onlineOpportunities}
                    </div>
                    <div className="text-sm text-gray-600">Online Events</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{stats.deadlineSoon}</div>
                    <div className="text-sm text-gray-600">Closing Soon</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Opportunities Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filteredOpportunities.length === 0 ? (
              <Card>
                <CardContent className="text-center py-16">
                  <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No opportunities found
                  </h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters or search terms.</p>
                  <Button onClick={clearAllFilters}>Clear All Filters</Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredOpportunities.map(opportunity => (
                    <OpportunityCard key={opportunity._id} opportunity={opportunity} />
                  ))}
                </div>

                {/* Load More */}
                {filteredOpportunities.length >= 20 && (
                  <div className="text-center mt-12">
                    <Button size="lg" variant="outline">
                      Load More Opportunities
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
