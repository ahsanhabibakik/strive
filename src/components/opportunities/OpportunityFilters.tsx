import { useState } from "react";
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface OpportunityFiltersProps {
  filters: {
    categories: string[];
    countries: string[];
    difficulties: string[];
    types: string[];
    isOnline?: boolean;
    isFree?: boolean;
    isTeamBased?: boolean;
    minFee?: number;
    maxFee?: number;
    deadlineRange?: string;
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function OpportunityFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  isOpen,
  onToggle,
  className = "",
}: OpportunityFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "category",
    "location",
    "type",
  ]);

  const categories = [
    { value: "competition", label: "Competitions", color: "bg-red-100 text-red-800" },
    { value: "scholarship", label: "Scholarships", color: "bg-green-100 text-green-800" },
    { value: "internship", label: "Internships", color: "bg-blue-100 text-blue-800" },
    { value: "hackathon", label: "Hackathons", color: "bg-purple-100 text-purple-800" },
    { value: "workshop", label: "Workshops", color: "bg-yellow-100 text-yellow-800" },
    { value: "fellowship", label: "Fellowships", color: "bg-indigo-100 text-indigo-800" },
    { value: "conference", label: "Conferences", color: "bg-pink-100 text-pink-800" },
    { value: "other", label: "Other", color: "bg-gray-100 text-gray-800" },
  ];

  const difficulties = [
    { value: "beginner", label: "Beginner", color: "text-green-600" },
    { value: "intermediate", label: "Intermediate", color: "text-yellow-600" },
    { value: "advanced", label: "Advanced", color: "text-orange-600" },
    { value: "expert", label: "Expert", color: "text-red-600" },
  ];

  const popularCountries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "Singapore",
    "Netherlands",
    "Sweden",
    "Switzerland",
    "France",
  ];

  const deadlineOptions = [
    { value: "1", label: "This week" },
    { value: "7", label: "Next 2 weeks" },
    { value: "30", label: "This month" },
    { value: "90", label: "Next 3 months" },
    { value: "365", label: "This year" },
  ];

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const toggleFilter = (type: string, value: string) => {
    const currentValues = (filters[type as keyof typeof filters] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    onFiltersChange({ [type]: newValues });
  };

  const toggleBooleanFilter = (key: string) => {
    const currentValue = filters[key as keyof typeof filters];
    onFiltersChange({ [key]: currentValue === true ? undefined : true });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    count += filters.categories?.length || 0;
    count += filters.countries?.length || 0;
    count += filters.difficulties?.length || 0;
    count += filters.types?.length || 0;
    if (filters.isOnline) count++;
    if (filters.isFree) count++;
    if (filters.isTeamBased) count++;
    if (filters.deadlineRange) count++;
    return count;
  };

  const FilterSection = ({
    title,
    section,
    children,
  }: {
    title: string;
    section: string;
    children: React.ReactNode;
  }) => (
    <Collapsible
      open={expandedSections.includes(section)}
      onOpenChange={() => toggleSection(section)}
    >
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-3 h-auto text-left font-medium">
          {title}
          {expandedSections.includes(section) ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3">{children}</CollapsibleContent>
    </Collapsible>
  );

  return (
    <Card className={`${className} ${isOpen ? "block" : "hidden lg:block"}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {getActiveFiltersCount() > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear all
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onToggle} className="lg:hidden">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-0 p-0">
        {/* Category Filter */}
        <FilterSection title="Category" section="category">
          <div className="space-y-2">
            {categories.map(category => (
              <div key={category.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.value}`}
                  checked={filters.categories?.includes(category.value) || false}
                  onCheckedChange={() => toggleFilter("categories", category.value)}
                />
                <Label
                  htmlFor={`category-${category.value}`}
                  className="text-sm font-normal cursor-pointer flex items-center gap-2"
                >
                  <span className={`px-2 py-1 rounded-md text-xs ${category.color}`}>
                    {category.label}
                  </span>
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Location Filter */}
        <FilterSection title="Location" section="location">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="online-only"
                checked={filters.isOnline || false}
                onCheckedChange={() => toggleBooleanFilter("isOnline")}
              />
              <Label htmlFor="online-only" className="text-sm font-normal cursor-pointer">
                Online only
              </Label>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Popular Countries</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {popularCountries.map(country => (
                  <div key={country} className="flex items-center space-x-2">
                    <Checkbox
                      id={`country-${country}`}
                      checked={filters.countries?.includes(country) || false}
                      onCheckedChange={() => toggleFilter("countries", country)}
                    />
                    <Label
                      htmlFor={`country-${country}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {country}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Type & Requirements */}
        <FilterSection title="Type & Requirements" section="type">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="free-only"
                checked={filters.isFree || false}
                onCheckedChange={() => toggleBooleanFilter("isFree")}
              />
              <Label htmlFor="free-only" className="text-sm font-normal cursor-pointer">
                Free opportunities only
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="team-based"
                checked={filters.isTeamBased || false}
                onCheckedChange={() => toggleBooleanFilter("isTeamBased")}
              />
              <Label htmlFor="team-based" className="text-sm font-normal cursor-pointer">
                Team-based opportunities
              </Label>
            </div>
          </div>
        </FilterSection>

        {/* Difficulty Level */}
        <FilterSection title="Difficulty Level" section="difficulty">
          <div className="space-y-2">
            {difficulties.map(difficulty => (
              <div key={difficulty.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`difficulty-${difficulty.value}`}
                  checked={filters.difficulties?.includes(difficulty.value) || false}
                  onCheckedChange={() => toggleFilter("difficulties", difficulty.value)}
                />
                <Label
                  htmlFor={`difficulty-${difficulty.value}`}
                  className="text-sm font-normal cursor-pointer flex items-center gap-2"
                >
                  <span className={`font-medium ${difficulty.color}`}>{difficulty.label}</span>
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Deadline */}
        <FilterSection title="Application Deadline" section="deadline">
          <div className="space-y-2">
            <Select
              value={filters.deadlineRange || ""}
              onValueChange={value => onFiltersChange({ deadlineRange: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select deadline range" />
              </SelectTrigger>
              <SelectContent>
                {deadlineOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </FilterSection>
      </CardContent>
    </Card>
  );
}
