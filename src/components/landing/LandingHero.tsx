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
  ArrowRight,
  Calendar,
  Globe,
  Users,
  BookOpen,
  Trophy,
  Briefcase,
  GraduationCap,
  Award,
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
  const { data: session } = useSession();

  useEffect(() => {
    // Load featured events
    const events = eventsData.events.slice(0, 3);
    setFeaturedEvents(events);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/events?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const categories = [
    {
      name: "Conferences",
      icon: Users,
      count: "65+",
      href: "/events?category=conference",
    },
    {
      name: "Hackathons",
      icon: Trophy,
      count: "180+",
      href: "/events?category=hackathon",
    },
    {
      name: "Workshops",
      icon: BookOpen,
      count: "42+",
      href: "/events?category=workshop",
    },
    {
      name: "Networking",
      icon: Briefcase,
      count: "95+",
      href: "/events?category=networking",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section className="relative bg-white pt-16">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center pt-12 pb-16">
          <div className="mb-6">
            <Badge variant="secondary" className="bg-red-50 text-[#E53935] border-red-200">
              <Calendar className="h-3 w-3 mr-1" />
              New events added weekly
            </Badge>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Discover Your Next
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#E53935] to-[#D32F2F]">
              Professional Opportunity
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Connect with top conferences, hackathons, and networking events worldwide. Advance your
            career with curated opportunities from leading organizations.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2 p-1.5 bg-white rounded-lg border shadow-sm">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search events, conferences, or topics..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-12 border-0 text-base h-12 focus-visible:ring-0 bg-transparent"
                  onKeyPress={e => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} className="h-12 px-6 bg-[#E53935] hover:bg-[#D32F2F]">
                Search
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-12">
            <Link href="/events" className="flex-1">
              <Button size="lg" className="w-full bg-[#E53935] hover:bg-[#D32F2F]">
                Browse Events
              </Button>
            </Link>
            <Link href="/community" className="flex-1">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-[#2196F3] text-[#2196F3] hover:bg-[#2196F3] hover:text-white"
              >
                Join Community
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600">Active Events</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">50K+</div>
              <div className="text-sm text-gray-600">Professionals</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">200+</div>
              <div className="text-sm text-gray-600">Organizations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Events</h2>
              <p className="text-gray-600">Don't miss out on these upcoming opportunities</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {featuredEvents.map(event => (
                <Link key={event._id} href={`/events/${event.slug}`}>
                  <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm h-full group">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={event.logoUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-gray-700">{event.category}</Badge>
                      </div>
                      {event.isFree && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-[#E53935] text-white">Free</Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-[#E53935] transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(event.eventDate)}
                        </div>
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2" />
                          {event.isOnline ? "Virtual Event" : `${event.city}, ${event.country}`}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/events">
                <Button variant="outline" size="lg">
                  View All Events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Event Categories</h2>
            <p className="text-gray-600">Find opportunities that match your interests</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <Link key={category.name} href={category.href}>
                  <Card className="hover:shadow-md transition-all duration-200 border-0 shadow-sm group cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Icon className="h-8 w-8 mx-auto text-[#2196F3] mb-3 group-hover:scale-110 transition-transform" />
                      <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.count}</p>
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
