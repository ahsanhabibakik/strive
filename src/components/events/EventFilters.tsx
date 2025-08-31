"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Filter, RotateCcw } from "lucide-react";

interface EventFiltersProps {
  onFilterChange: (filters: { category: string; difficulty: string; freeOnly: boolean }) => void;
  eventCount: number;
  totalCount: number;
}

export function EventFilters({ onFilterChange, eventCount, totalCount }: EventFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [freeOnly, setFreeOnly] = useState(false);

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

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onFilterChange({
      category,
      difficulty: selectedDifficulty,
      freeOnly,
    });
  };

  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    onFilterChange({
      category: selectedCategory,
      difficulty,
      freeOnly,
    });
  };

  const handleFreeOnlyChange = (checked: boolean) => {
    setFreeOnly(checked);
    onFilterChange({
      category: selectedCategory,
      difficulty: selectedDifficulty,
      freeOnly: checked,
    });
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedDifficulty("all");
    setFreeOnly(false);
    onFilterChange({
      category: "all",
      difficulty: "all",
      freeOnly: false,
    });
  };

  const hasActiveFilters = selectedCategory !== "all" || selectedDifficulty !== "all" || freeOnly;

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

      <Separator />

      {/* Category Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-900">Category</Label>
        <RadioGroup
          value={selectedCategory}
          onValueChange={handleCategoryChange}
          className="space-y-2"
        >
          {categories.map(category => (
            <div key={category.value} className="flex items-center space-x-2">
              <RadioGroupItem value={category.value} id={category.value} />
              <Label htmlFor={category.value} className="text-sm text-gray-700 cursor-pointer">
                {category.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator />

      {/* Difficulty Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-900">Difficulty</Label>
        <RadioGroup
          value={selectedDifficulty}
          onValueChange={handleDifficultyChange}
          className="space-y-2"
        >
          {difficulties.map(difficulty => (
            <div key={difficulty.value} className="flex items-center space-x-2">
              <RadioGroupItem value={difficulty.value} id={difficulty.value} />
              <Label htmlFor={difficulty.value} className="text-sm text-gray-700 cursor-pointer">
                {difficulty.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator />

      {/* Price Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-900">Price</Label>
        <div className="flex items-center space-x-2">
          <Checkbox id="free-only" checked={freeOnly} onCheckedChange={handleFreeOnlyChange} />
          <Label htmlFor="free-only" className="text-sm text-gray-700 cursor-pointer">
            Free events only
          </Label>
        </div>
      </div>

      <Separator />

      {/* Additional Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Event Categories</h4>
        <div className="space-y-1 text-xs text-gray-600">
          <p>
            📅 <strong>Conferences:</strong> Multi-day industry events
          </p>
          <p>
            💻 <strong>Hackathons:</strong> Coding competitions
          </p>
          <p>
            🎯 <strong>Workshops:</strong> Hands-on learning sessions
          </p>
          <p>
            🤝 <strong>Networking:</strong> Professional meetups
          </p>
        </div>
      </div>
    </div>
  );
}
