"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Filter,
  RotateCcw,
  Calendar as CalendarIcon,
  MapPin,
  Users,
  DollarSign,
  ChevronDown,
  Check,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface EventFiltersProps {
  onFilterChange: (filters: {
    category: string;
    difficulty: string;
    freeOnly: boolean;
    dateRange?: { from: Date; to: Date };
    location: string[];
    priceRange: [number, number];
    tags: string[];
  }) => void;
  eventCount: number;
  totalCount: number;
}

export function EventFilters({ onFilterChange, eventCount, totalCount }: EventFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [freeOnly, setFreeOnly] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>();
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [locationSearch, setLocationSearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "conference", label: "Conferences" },
    { value: "hackathon", label: "Hackathons" },
    { value: "workshop", label: "Workshops" },
    { value: "networking", label: "Networking" },
  ];

  const difficulties = [
    { value: "all", label: "All Levels" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  const popularLocations = [
    "San Francisco, CA",
    "New York, NY",
    "London, UK",
    "Berlin, Germany",
    "Tokyo, Japan",
    "Singapore",
    "Virtual Event",
    "Toronto, Canada",
    "Sydney, Australia",
    "Amsterdam, Netherlands",
  ];

  const popularTags = [
    "JavaScript",
    "Python",
    "AI",
    "Machine Learning",
    "React",
    "Node.js",
    "DevOps",
    "Cloud",
    "Cybersecurity",
    "Blockchain",
    "Data Science",
    "Mobile Development",
    "UI/UX",
    "Startup",
    "Leadership",
    "Networking",
  ];

  const emitFilters = () => {
    onFilterChange({
      category: selectedCategory,
      difficulty: selectedDifficulty,
      freeOnly,
      dateRange,
      location: selectedLocations,
      priceRange,
      tags: selectedTags,
    });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    emitFilters();
  };

  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    emitFilters();
  };

  const handleFreeOnlyChange = (checked: boolean) => {
    setFreeOnly(checked);
    emitFilters();
  };

  const addLocation = (location: string) => {
    if (!selectedLocations.includes(location)) {
      const newLocations = [...selectedLocations, location];
      setSelectedLocations(newLocations);
      emitFilters();
    }
  };

  const removeLocation = (location: string) => {
    const newLocations = selectedLocations.filter(l => l !== location);
    setSelectedLocations(newLocations);
    emitFilters();
  };

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      emitFilters();
    }
  };

  const removeTag = (tag: string) => {
    const newTags = selectedTags.filter(t => t !== tag);
    setSelectedTags(newTags);
    emitFilters();
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedDifficulty("all");
    setFreeOnly(false);
    setDateRange(undefined);
    setSelectedLocations([]);
    setPriceRange([0, 5000]);
    setSelectedTags([]);
    onFilterChange({
      category: "all",
      difficulty: "all",
      freeOnly: false,
      dateRange: undefined,
      location: [],
      priceRange: [0, 5000],
      tags: [],
    });
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedDifficulty !== "all" ||
    freeOnly ||
    dateRange ||
    selectedLocations.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 5000 ||
    selectedTags.length > 0;

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-indigo-600 hover:text-indigo-700"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="bg-indigo-50 rounded-lg p-3">
        <p className="text-sm text-indigo-700">
          <span className="font-semibold">{eventCount}</span> of{" "}
          <span className="font-semibold">{totalCount}</span> events match your criteria
        </p>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedCategory !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {categories.find(c => c.value === selectedCategory)?.label}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleCategoryChange("all")} />
            </Badge>
          )}
          {selectedLocations.map(location => (
            <Badge key={location} variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {location}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeLocation(location)} />
            </Badge>
          ))}
          {selectedTags.map(tag => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
            </Badge>
          ))}
        </div>
      )}

      <Separator />

      {/* Category & Difficulty - Enhanced with Select */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-900">Category</Label>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-900">Difficulty</Label>
          <Select value={selectedDifficulty} onValueChange={handleDifficultyChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map(difficulty => (
                <SelectItem key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Date Range Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-900 flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          Event Dates
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Separator />

      {/* Location Filter with Command */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-900 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Locations
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {selectedLocations.length > 0
                ? `${selectedLocations.length} location${selectedLocations.length > 1 ? "s" : ""} selected`
                : "Select locations"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" side="bottom" align="start">
            <Command>
              <CommandInput
                placeholder="Search locations..."
                value={locationSearch}
                onValueChange={setLocationSearch}
              />
              <CommandList>
                <CommandEmpty>No locations found.</CommandEmpty>
                <CommandGroup>
                  {popularLocations
                    .filter(location =>
                      location.toLowerCase().includes(locationSearch.toLowerCase())
                    )
                    .map(location => (
                      <CommandItem key={location} onSelect={() => addLocation(location)}>
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedLocations.includes(location) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {location}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <Separator />

      {/* Price Range Filter */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-900 flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Price Range
        </Label>
        <div className="flex items-center space-x-2 mb-2">
          <Checkbox id="free-only" checked={freeOnly} onCheckedChange={handleFreeOnlyChange} />
          <Label htmlFor="free-only" className="text-sm text-gray-700 cursor-pointer">
            Free events only
          </Label>
        </div>
        <div className="space-y-3">
          <Slider
            value={priceRange}
            onValueChange={value => setPriceRange(value as [number, number])}
            max={5000}
            min={0}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Tags Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-900">Tags</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {selectedTags.length > 0
                ? `${selectedTags.length} tag${selectedTags.length > 1 ? "s" : ""} selected`
                : "Select tags"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" side="bottom" align="start">
            <Command>
              <CommandInput
                placeholder="Search tags..."
                value={tagSearch}
                onValueChange={setTagSearch}
              />
              <CommandList>
                <CommandEmpty>No tags found.</CommandEmpty>
                <CommandGroup>
                  {popularTags
                    .filter(tag => tag.toLowerCase().includes(tagSearch.toLowerCase()))
                    .map(tag => (
                      <CommandItem key={tag} onSelect={() => addTag(tag)}>
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedTags.includes(tag) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {tag}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <Separator />

      {/* Quick Stats */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Users className="h-4 w-4" />
          Event Statistics
        </h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="text-center">
            <div className="font-semibold text-indigo-600">65%</div>
            <div className="text-gray-600">Virtual</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-green-600">35%</div>
            <div className="text-gray-600">Free</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-blue-600">45%</div>
            <div className="text-gray-600">Tech</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-purple-600">28%</div>
            <div className="text-gray-600">Beginner</div>
          </div>
        </div>
      </div>
    </div>
  );
}
