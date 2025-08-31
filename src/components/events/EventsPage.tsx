"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/landing/Header";
import { EventCard } from "./EventCard";
import { EventFilters } from "./EventFilters";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

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
  }) => {
    setSelectedCategory(filters.category);
    setSelectedDifficulty(filters.difficulty);
    setShowFreeOnly(filters.freeOnly);
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
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search events, organizers, or topics..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </div>

            {/* Results Header */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredEvents.length} of {events.length} events
              </p>
            </div>

            {/* Events Grid */}
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
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
