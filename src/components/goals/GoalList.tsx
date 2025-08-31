"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GoalCard } from "./GoalCard";
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Plus,
  Grid3X3,
  List,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Goal {
  _id: string;
  title: string;
  description?: string;
  category:
    | "personal"
    | "professional"
    | "health"
    | "financial"
    | "education"
    | "relationships"
    | "other";
  priority: "low" | "medium" | "high" | "critical";
  status: "draft" | "active" | "completed" | "paused" | "cancelled";
  measurable: {
    metric: string;
    targetValue: number;
    currentValue: number;
    unit: string;
  };
  timeBound: {
    startDate: string;
    endDate: string;
    milestones: any[];
  };
  progressPercentage: number;
  lastUpdated: string;
  isPublic: boolean;
  collaborators: any[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags: string[];
  createdAt: string;
  daysRemaining?: number;
  isOverdue?: boolean;
}

interface GoalListProps {
  status: "active" | "completed" | "all";
}

type SortField =
  | "title"
  | "createdAt"
  | "lastUpdated"
  | "progressPercentage"
  | "priority"
  | "daysRemaining";
type SortOrder = "asc" | "desc";
type ViewMode = "grid" | "list";

const categories = [
  "all",
  "personal",
  "professional",
  "health",
  "financial",
  "education",
  "relationships",
  "other",
];

const statuses = ["all", "draft", "active", "completed", "paused", "cancelled"];

const priorities = ["all", "low", "medium", "high", "critical"];

export function GoalList({ status }: GoalListProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [sortField, setSortField] = useState<SortField>("lastUpdated");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/goals");
        if (response.ok) {
          const data = await response.json();
          let filteredGoals = data.goals || [];

          if (status !== "all") {
            filteredGoals = filteredGoals.filter((goal: Goal) => goal.status === status);
          }

          setGoals(filteredGoals);
        }
      } catch (error) {
        console.error("Error fetching goals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, [status]);

  // Filter and sort goals
  const filteredAndSortedGoals = useMemo(() => {
    const filtered = goals.filter(goal => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          goal.title.toLowerCase().includes(searchLower) ||
          goal.description?.toLowerCase().includes(searchLower) ||
          goal.measurable.metric.toLowerCase().includes(searchLower) ||
          goal.tags.some(tag => tag.toLowerCase().includes(searchLower));

        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory !== "all" && goal.category !== selectedCategory) {
        return false;
      }

      // Priority filter
      if (selectedPriority !== "all" && goal.priority !== selectedPriority) {
        return false;
      }

      return true;
    });

    // Sort goals
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "lastUpdated":
          aValue = new Date(a.lastUpdated).getTime();
          bValue = new Date(b.lastUpdated).getTime();
          break;
        case "progressPercentage":
          aValue = a.progressPercentage;
          bValue = b.progressPercentage;
          break;
        case "priority":
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case "daysRemaining":
          aValue = a.daysRemaining ?? Infinity;
          bValue = b.daysRemaining ?? Infinity;
          break;
        default:
          aValue = a.lastUpdated;
          bValue = b.lastUpdated;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [goals, searchTerm, selectedCategory, selectedPriority, sortField, sortOrder]);

  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedPriority("all");
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategory !== "all") count++;
    if (selectedPriority !== "all") count++;
    return count;
  };

  const getSummaryStats = () => {
    const stats = {
      total: filteredAndSortedGoals.length,
      active: filteredAndSortedGoals.filter(g => g.status === "active").length,
      completed: filteredAndSortedGoals.filter(g => g.status === "completed").length,
      overdue: filteredAndSortedGoals.filter(g => g.isOverdue).length,
      averageProgress:
        filteredAndSortedGoals.length > 0
          ? Math.round(
              filteredAndSortedGoals.reduce((sum, g) => sum + g.progressPercentage, 0) /
                filteredAndSortedGoals.length
            )
          : 0,
    };
    return stats;
  };

  const stats = getSummaryStats();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded-sm animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-sm animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Summary Stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-6 w-6" />
            Goals ({stats.total})
          </h2>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              {stats.active} Active
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              {stats.completed} Completed
            </span>
            {stats.overdue > 0 && (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                {stats.overdue} Overdue
              </span>
            )}
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {stats.averageProgress}% Avg Progress
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search goals, metrics, or tags..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === "all"
                        ? "All Categories"
                        : category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map(priority => (
                    <SelectItem key={priority} value={priority}>
                      {priority === "all"
                        ? "All Priority"
                        : priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {sortOrder === "asc" ? (
                      <SortAsc className="h-4 w-4 mr-2" />
                    ) : (
                      <SortDesc className="h-4 w-4 mr-2" />
                    )}
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleSortChange("lastUpdated")}>
                    Last Updated {sortField === "lastUpdated" && (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange("createdAt")}>
                    Created Date {sortField === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange("progressPercentage")}>
                    Progress{" "}
                    {sortField === "progressPercentage" && (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange("priority")}>
                    Priority {sortField === "priority" && (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange("daysRemaining")}>
                    Days Remaining{" "}
                    {sortField === "daysRemaining" && (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange("title")}>
                    Title {sortField === "title" && (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {getActiveFiltersCount() > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-red-600 hover:text-red-700"
                >
                  Clear ({getActiveFiltersCount()})
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals Grid/List */}
      {filteredAndSortedGoals.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {goals.length === 0 ? "No goals yet" : "No goals match your filters"}
            </h3>
            <p className="text-gray-600 mb-4">
              {goals.length === 0
                ? "Get started by creating your first goal. Break down your aspirations into achievable, measurable objectives."
                : "Try adjusting your search terms or filters to find what you're looking for."}
            </p>
            {goals.length > 0 && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
              : "space-y-4"
          }
        >
          {filteredAndSortedGoals.map(goal => (
            <GoalCard key={goal._id} goal={goal} compact={viewMode === "list"} />
          ))}
        </div>
      )}
    </div>
  );
}
