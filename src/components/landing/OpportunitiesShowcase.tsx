"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";
import {
  Search,
  Filter,
  ArrowRight,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Globe,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  Heart,
  Star,
  RefreshCw,
  Shuffle
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
  const [selectedType, setSelectedType] = useState("all");
  const [viewMode, setViewMode] = useState<"featured" | "all">("featured");
  const [isShuffling, setIsShuffling] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          limit: viewMode === "featured" ? "12" : "24",
          sortBy: "applicationDeadline",
          sortOrder: "asc",
          ...(viewMode === "featured" && { isFeatured: "true" }),
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
    return opportunities.filter((opp) => {
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

      // Type filter
      if (selectedType !== "all") {
        if (selectedType === "online" && !opp.isOnline) return false;
        if (selectedType === "offline" && opp.isOnline) return false;
        if (selectedType === "free" && !opp.isFree) return false;
        if (selectedType === "team" && !opp.isTeamBased) return false;
      }

      return true;
    });
  }, [opportunities, searchQuery, selectedCategory, selectedDifficulty, selectedType]);

  const categories = [
    "all",
    "scholarships",
    "competitions",
    "internships",
    "conferences",
    "hackathons",
    "workshops",
    "grants",
  ];

  const difficulties = ["all", "beginner", "intermediate", "advanced", "expert"];
  const types = [
    { value: "all", label: "All Types" },
    { value: "online", label: "Online" },
    { value: "offline", label: "In-Person" },
    { value: "free", label: "Free" },
    { value: "team", label: "Team-Based" },
  ];

  const getStats = () => {
    const totalOpportunities = filteredOpportunities.length;
    const onlineOpportunities = filteredOpportunities.filter(opp => opp.isOnline).length;
    const freeOpportunities = filteredOpportunities.filter(opp => opp.isFree).length;
    const deadlineSoon = filteredOpportunities.filter(opp => opp.daysUntilDeadline <= 7 && opp.daysUntilDeadline >= 0).length;
    
    return { totalOpportunities, onlineOpportunities, freeOpportunities, deadlineSoon };
  };

  const stats = getStats();

  return (
    <section id="opportunities" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 hover:bg-white hover:scale-105 transition-all duration-300 cursor-default group">
            <Sparkles className="h-3 w-3 mr-1 group-hover:text-yellow-500 group-hover:animate-spin transition-all duration-300" />
            Live Opportunities
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="inline-block animate-in slide-in-from-left duration-700">Discover Amazing </span>
            <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-in slide-in-from-right duration-700 delay-200 hover:scale-105 transition-transform duration-300">
              Opportunities
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 animate-in fade-in duration-1000 delay-400">
            From scholarships to competitions, internships to conferences - find the perfect opportunity to advance your career and achieve your goals.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            {[
              { value: stats.totalOpportunities, label: "Total Events", color: "text-blue-600", icon: Globe, bg: "bg-blue-50", delay: 600 },
              { value: stats.freeOpportunities, label: "Free Events", color: "text-green-600", icon: Heart, bg: "bg-green-50", delay: 700 },
              { value: stats.onlineOpportunities, label: "Online Events", color: "text-purple-600", icon: Zap, bg: "bg-purple-50", delay: 800 },
              { value: stats.deadlineSoon, label: "Closing Soon", color: "text-orange-600", icon: Star, bg: "bg-orange-50", delay: 900 }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index} 
                  className={cn(
                    "bg-white rounded-lg p-4 shadow-sm border group cursor-default hover:shadow-lg transition-all duration-300 hover:scale-105",
                    stat.bg,
                    "animate-in slide-in-from-bottom duration-500"
                  )}
                  style={{ animationDelay: `${stat.delay}ms` }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <Icon className={cn(
                      "h-5 w-5 mr-2 transition-all duration-300",
                      stat.color,
                      "group-hover:scale-125 group-hover:rotate-12"
                    )} />
                    <div className={cn(
                      "text-2xl font-bold transition-all duration-300",
                      stat.color,
                      "group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text"
                    )}>
                      {stat.value}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">{stat.label}</div>
                  <div className="w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-2 group-hover:w-full transition-all duration-300 rounded-full" />
                </div>
              );
            })}
          </div>
        </div>

        {/* View Mode Toggle with Shuffle Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <Button
              variant={viewMode === "featured" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("featured")}
              className={cn(
                "px-6 transition-all duration-300",
                viewMode === "featured" 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                  : "hover:bg-blue-50"
              )}
            >
              <Award className="h-4 w-4 mr-2 transition-transform duration-200 hover:rotate-12" />
              Featured
            </Button>
            <Button
              variant={viewMode === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("all")}
              className={cn(
                "px-6 transition-all duration-300",
                viewMode === "all" 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                  : "hover:bg-blue-50"
              )}
            >
              <Globe className="h-4 w-4 mr-2 transition-transform duration-200 hover:rotate-180" />
              All Opportunities
            </Button>
          </div>
          
          {/* Fun Shuffle Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsShuffling(true);
              // Shuffle the opportunities array
              setOpportunities(prev => [...prev].sort(() => Math.random() - 0.5));
              setTimeout(() => setIsShuffling(false), 1000);
            }}
            disabled={isShuffling}
            className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 transition-all duration-300 group"
          >
            <Shuffle className={cn(
              "h-4 w-4 mr-2 transition-transform duration-300",
              isShuffling ? "animate-spin" : "group-hover:rotate-180"
            )} />
            {isShuffling ? "Shuffling..." : "Surprise Me!"}
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className={cn(
          "mb-8 transition-all duration-300 hover:shadow-lg",
          searchFocused && "shadow-xl shadow-blue-100 border-blue-300"
        )}>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              {/* Search */}
              <div className="relative">
                <Search className={cn(
                  "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-all duration-300",
                  searchFocused ? "text-blue-500 scale-110" : "text-gray-400"
                )} />
                <Input
                  type="text"
                  placeholder="Search opportunities, organizations, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className={cn(
                    "pl-10 transition-all duration-300",
                    searchFocused && "ring-2 ring-blue-200 border-blue-300"
                  )}
                />
                {searchQuery && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                    </div>
                  </div>
                )}
              </div>

              {/* Filters Toggle */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFiltersExpanded(!filtersExpanded)}
                  className="hover:bg-blue-50 transition-all duration-300 group"
                >
                  <Filter className={cn(
                    "h-4 w-4 mr-2 transition-transform duration-300",
                    filtersExpanded ? "rotate-180" : "group-hover:rotate-12"
                  )} />
                  {filtersExpanded ? "Hide Filters" : "Show Filters"}
                  <ArrowRight className={cn(
                    "h-3 w-3 ml-2 transition-transform duration-300",
                    filtersExpanded ? "rotate-90" : ""
                  )} />
                </Button>
                
                {(searchQuery || selectedCategory !== "all" || selectedDifficulty !== "all" || selectedType !== "all") && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                    {[searchQuery && "search", selectedCategory !== "all" && "category", selectedDifficulty !== "all" && "difficulty", selectedType !== "all" && "type"].filter(Boolean).length} filters active
                  </Badge>
                )}
              </div>

              {/* Collapsible Filters */}
              <div className={cn(
                "transition-all duration-500 ease-out overflow-hidden",
                filtersExpanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              )}>
                <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40 hover:border-blue-300 transition-colors duration-200">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category} className="hover:bg-blue-50">
                          {category === "all" ? "All Categories" : 
                           category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="w-36 hover:border-blue-300 transition-colors duration-200">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty} className="hover:bg-blue-50">
                          {difficulty === "all" ? "All Levels" : 
                           difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-32 hover:border-blue-300 transition-colors duration-200">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="hover:bg-blue-50">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {(searchQuery || selectedCategory !== "all" || selectedDifficulty !== "all" || selectedType !== "all") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                        setSelectedDifficulty("all");
                        setSelectedType("all");
                      }}
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200 group"
                    >
                      <RefreshCw className="h-3 w-3 mr-1 group-hover:rotate-180 transition-transform duration-300" />
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Opportunities Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No opportunities found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedDifficulty("all");
                  setSelectedType("all");
                }}
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredOpportunities.map((opportunity) => (
                <OpportunityCard key={opportunity._id} opportunity={opportunity} />
              ))}
            </div>

            {/* View More */}
            {viewMode === "featured" && opportunities.length >= 12 && (
              <div className="text-center">
                <Button
                  size="lg"
                  onClick={() => setViewMode("all")}
                  className="px-8"
                >
                  View All Opportunities
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {viewMode === "all" && (
              <div className="text-center">
                <Link href="/opportunities">
                  <Button size="lg" className="px-8">
                    Browse More on Opportunities Page
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}