"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/landing/Header";
import { EventCard } from "./EventCard";
import { EventFilters } from "./EventFilters";
import { EventCalendarView } from "./EventCalendarView";
import { EventComparison } from "./EventComparison";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Grid3x3, Calendar, Compare, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  organizerName: string;
  logoUrl: string;
  country: string;
  city: string;
  isOnline: boolean;
  applicationDeadline: string;
  eventDate: string;
  endDate: string;
  category: string;
  difficulty: string;
  isFree: boolean;
  price: string;
  tags: string[];
  slug: string;
}

interface EventsPageProps {
  user: User;
}

export function EventsPage({ user }: EventsPageProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [comparisonEvents, setComparisonEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Load events data
    const loadEvents = async () => {
      try {
        const response = await fetch("/data/events.json");
        const data = await response.json();
        setEvents(data.events);
        setFilteredEvents(data.events);
      } catch (error) {
        console.error("Failed to load events:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        event =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.organizerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        event => event.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by difficulty
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(
        event => event.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()
      );
    }

    // Filter by free events
    if (showFreeOnly) {
      filtered = filtered.filter(event => event.isFree);
    }

    setFilteredEvents(filtered);
  }, [events, searchQuery, selectedCategory, selectedDifficulty, showFreeOnly]);

  const handleFilterChange = (filters: {
    category: string;
    difficulty: string;
    freeOnly: boolean;
    dateRange?: { from: Date; to: Date };
    location: string[];
    priceRange: [number, number];
    tags: string[];
  }) => {
    setSelectedCategory(filters.category);
    setSelectedDifficulty(filters.difficulty);
    setShowFreeOnly(filters.freeOnly);
    // Handle additional filters in the future
  };

  const handleCompareEvent = (event: Event) => {
    const isInComparison = comparisonEvents.some(e => e._id === event._id);

    if (isInComparison) {
      setComparisonEvents(prev => prev.filter(e => e._id !== event._id));
    } else {
      if (comparisonEvents.length < 5) {
        setComparisonEvents(prev => [...prev, event]);
      }
    }
  };

  const handleRemoveFromComparison = (eventId: string) => {
    setComparisonEvents(prev => prev.filter(e => e._id !== eventId));
  };

  const handleClearComparison = () => {
    setComparisonEvents([]);
  };

  const isEventInComparison = (eventId: string) => {
    return comparisonEvents.some(e => e._id === eventId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Amazing Events</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join conferences, hackathons, and networking events that will accelerate your career and
            expand your professional network.
          </p>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <EventFilters
                onFilterChange={handleFilterChange}
                eventCount={filteredEvents.length}
                totalCount={events.length}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Enhanced Search Bar with Suggestions */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
                <Input
                  type="text"
                  placeholder="Search events, organizers, or topics..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />

                {/* Search Suggestions */}
                {searchQuery.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto mt-1">
                    {/* Event matches */}
                    {filteredEvents.slice(0, 3).map((event, index) => (
                      <div
                        key={`event-${event._id}`}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => setSearchQuery(event.title)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                            <img
                              src={event.logoUrl}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{event.title}</p>
                            <p className="text-sm text-gray-500">
                              {event.organizerName} • {event.category}
                            </p>
                          </div>
                          <Badge className="text-xs bg-blue-100 text-blue-700">Event</Badge>
                        </div>
                      </div>
                    ))}

                    {/* Quick filter suggestions */}
                    {searchQuery.length > 1 && (
                      <>
                        {[
                          "JavaScript",
                          "Python",
                          "AI",
                          "React",
                          "Conference",
                          "Workshop",
                          "Free",
                        ].map(
                          suggestion =>
                            suggestion.toLowerCase().includes(searchQuery.toLowerCase()) && (
                              <div
                                key={suggestion}
                                className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                                onClick={() => setSearchQuery(suggestion)}
                              >
                                <Search className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-700">
                                  Search for "{suggestion}"
                                </span>
                                <Badge variant="outline" className="text-xs ml-auto">
                                  Tag
                                </Badge>
                              </div>
                            )
                        )}

                        {/* Popular organizers */}
                        {["Google", "Meta", "Microsoft", "AWS"].map(
                          organizer =>
                            organizer.toLowerCase().includes(searchQuery.toLowerCase()) && (
                              <div
                                key={organizer}
                                className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                                onClick={() => setSearchQuery(organizer)}
                              >
                                <Users className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-700">Events by {organizer}</span>
                                <Badge variant="outline" className="text-xs ml-auto">
                                  Organizer
                                </Badge>
                              </div>
                            )
                        )}
                      </>
                    )}

                    {/* No results */}
                    {filteredEvents.length === 0 && (
                      <div className="px-4 py-6 text-center text-gray-500">
                        <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No events found for "{searchQuery}"</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Try different keywords or check your spelling
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Search shortcuts */}
              {searchQuery.length === 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  <p className="text-xs text-gray-500 flex items-center gap-1 mr-2">Popular:</p>
                  {["JavaScript", "AI", "Free Events", "This Week"].map(shortcut => (
                    <Button
                      key={shortcut}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => setSearchQuery(shortcut)}
                    >
                      {shortcut}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Results Header with Comparison Toggle */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                Showing {filteredEvents.length} of {events.length} events
              </p>

              {comparisonEvents.length > 0 && (
                <Button variant="outline" className="flex items-center gap-2">
                  <Compare className="h-4 w-4" />
                  Compare ({comparisonEvents.length})
                  <Badge variant="secondary" className="ml-1">
                    {comparisonEvents.length}
                  </Badge>
                </Button>
              )}
            </div>

            {/* View Toggle Tabs */}
            <Tabs defaultValue="grid" className="w-full">
              <TabsList className="grid w-fit grid-cols-3 mb-6">
                <TabsTrigger value="grid" className="flex items-center gap-2">
                  <Grid3x3 className="h-4 w-4" />
                  List View
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Calendar View
                </TabsTrigger>
                <TabsTrigger value="comparison" className="flex items-center gap-2">
                  <Compare className="h-4 w-4" />
                  Compare
                  {comparisonEvents.length > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {comparisonEvents.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* List View */}
              <TabsContent value="grid" className="mt-0">
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-gray-400 mb-4">
                      <Search className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                    <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                    {filteredEvents.map(event => (
                      <EventCard
                        key={event._id}
                        event={event}
                        onCompare={handleCompareEvent}
                        isInComparison={isEventInComparison(event._id)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Calendar View */}
              <TabsContent value="calendar" className="mt-0">
                <EventCalendarView events={filteredEvents} />
              </TabsContent>

              {/* Comparison View */}
              <TabsContent value="comparison" className="mt-0">
                <EventComparison
                  events={comparisonEvents}
                  onRemoveEvent={handleRemoveFromComparison}
                  onClearAll={handleClearComparison}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
