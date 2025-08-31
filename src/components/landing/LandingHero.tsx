"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import eventsData from "@/data/events.json";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Clock,
  Users,
  BookOpen,
  Trophy,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Target,
} from "lucide-react";

interface FeaturedEvent {
  _id: string;
  title: string;
  description: string;
  organizerName: string;
  logoUrl?: string;
  country?: string;
  city?: string;
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

export function LandingHero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredEvents, setFeaturedEvents] = useState<FeaturedEvent[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    // Load events from JSON file
    const loadFeaturedEvents = () => {
      try {
        const events = eventsData.events.slice(0, 5);
        setFeaturedEvents(events);
      } catch (error) {
        console.error("Error loading events:", error);
      }
    };

    loadFeaturedEvents();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (featuredEvents.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % featuredEvents.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [featuredEvents.length]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const element = document.getElementById("opportunities");
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const categories = [
    {
      name: "Conferences",
      icon: Users,
      count: "65+",
      color: "bg-orange-50 text-orange-700 border-orange-200",
      iconColor: "text-orange-600",
    },
    {
      name: "Hackathons",
      icon: Trophy,
      count: "180+",
      color: "bg-gray-50 text-gray-700 border-gray-200",
      iconColor: "text-gray-600",
    },
    {
      name: "Workshops",
      icon: BookOpen,
      count: "42+",
      color: "bg-white text-gray-700 border-gray-200",
      iconColor: "text-gray-600",
    },
    {
      name: "Internships",
      icon: Briefcase,
      count: "95+",
      color: "bg-orange-50 text-orange-700 border-orange-200",
      iconColor: "text-orange-600",
    },
    {
      name: "Competitions",
      icon: Award,
      count: "28+",
      color: "bg-gray-50 text-gray-700 border-gray-200",
      iconColor: "text-gray-600",
    },
    {
      name: "Certifications",
      icon: GraduationCap,
      count: "120+",
      color: "bg-white text-gray-700 border-gray-200",
      iconColor: "text-gray-600",
    },
  ];

  const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <section className="relative bg-white pt-20 pb-8">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 p-1.5 bg-white rounded-lg border border-gray-200">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search events, conferences, hackathons, or workshops..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-12 border-0 text-base h-11 focus-visible:ring-0 bg-transparent"
                  onKeyPress={e => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button
                onClick={handleSearch}
                className="h-11 px-6 bg-orange-600 hover:bg-orange-700"
              >
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Opportunities Carousel */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Events</h2>
              <p className="text-gray-600">
                Discover upcoming tech conferences, hackathons, and workshops
              </p>
            </div>
            <Badge variant="outline" className="bg-white text-orange-600 border-orange-200">
              <Target className="h-3 w-3 mr-1" />
              Trending
            </Badge>
          </div>

          {loading ? (
            <Card className="h-80">
              <CardContent className="h-full flex items-center justify-center">
                <div className="text-gray-400">Loading featured events...</div>
              </CardContent>
            </Card>
          ) : featuredEvents.length > 0 ? (
            <div className="relative">
              <Card className="overflow-hidden bg-white border border-gray-200">
                <CardContent className="p-0">
                  <div className="relative h-80 flex items-center">
                    {/* Carousel Navigation */}
                    {featuredEvents.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 border border-gray-200"
                          onClick={() =>
                            setCurrentSlide(
                              prev => (prev - 1 + featuredEvents.length) % featuredEvents.length
                            )
                          }
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 border border-gray-200"
                          onClick={() =>
                            setCurrentSlide(prev => (prev + 1) % featuredEvents.length)
                          }
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </>
                    )}

                    {/* Current Slide Content */}
                    <div className="w-full px-16 py-8">
                      <div className="max-w-4xl mx-auto flex items-center gap-8">
                        {featuredEvents[currentSlide].logoUrl && (
                          <div className="flex-shrink-0">
                            <img
                              src={featuredEvents[currentSlide].logoUrl}
                              alt={featuredEvents[currentSlide].organizerName}
                              className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                            />
                          </div>
                        )}

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <Badge
                                variant="secondary"
                                className="mb-3 bg-orange-50 text-orange-700 border border-orange-200"
                              >
                                {featuredEvents[currentSlide].category}
                              </Badge>
                              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                                {featuredEvents[currentSlide].title}
                              </h3>
                              <p className="text-lg text-gray-600 mb-4 line-clamp-2">
                                {featuredEvents[currentSlide].description}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mb-6">
                            <div className="flex items-center text-gray-600">
                              <Globe className="h-4 w-4 mr-2" />
                              <span className="text-sm">
                                {featuredEvents[currentSlide].organizerName}
                              </span>
                            </div>
                            {featuredEvents[currentSlide].isOnline ? (
                              <div className="flex items-center text-orange-600">
                                <Globe className="h-4 w-4 mr-2" />
                                <span className="text-sm font-medium">Online Event</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-gray-600">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span className="text-sm">
                                  {featuredEvents[currentSlide].city},{" "}
                                  {featuredEvents[currentSlide].country}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center text-gray-600">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span className="text-sm font-medium">
                                {new Date(
                                  featuredEvents[currentSlide].eventDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center text-orange-600">
                              <span className="text-sm font-semibold">
                                {featuredEvents[currentSlide].price}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Link href={`/events/${featuredEvents[currentSlide].slug}`}>
                              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                                View Details
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="lg"
                              className="border-orange-200 text-orange-600 hover:bg-orange-50"
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              Register
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Carousel Indicators */}
              {featuredEvents.length > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                  {featuredEvents.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentSlide ? "bg-orange-600" : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Card className="h-80">
              <CardContent className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No featured events available</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Categories Grid */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Categories</h2>
            <p className="text-gray-600">
              Discover events that match your interests and career goals
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  href={`#opportunities?category=${category.name.toLowerCase()}`}
                  className="group"
                >
                  <Card
                    className={`${category.color} border transition-colors duration-200 hover:border-orange-300 cursor-pointer`}
                  >
                    <CardContent className="p-4 text-center">
                      <div className={`${category.iconColor} mb-3 flex justify-center`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="font-semibold mb-1">{category.name}</h3>
                      <p className="text-xs opacity-75">{category.count}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
