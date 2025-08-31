"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Star,
  ExternalLink,
  Compare,
  Trash2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

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

interface EventComparisonProps {
  events: Event[];
  onRemoveEvent: (eventId: string) => void;
  onClearAll: () => void;
}

export function EventComparison({ events, onRemoveEvent, onClearAll }: EventComparisonProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
      case "all levels":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "conference":
        return "bg-blue-100 text-blue-800";
      case "hackathon":
        return "bg-red-100 text-[#E53935]";
      case "workshop":
        return "bg-orange-100 text-[#FF7043]";
      case "networking":
        return "bg-blue-100 text-[#2196F3]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleRemove = (eventId: string, eventTitle: string) => {
    onRemoveEvent(eventId);
    toast("Event removed from comparison");
  };

  const handleClearAll = () => {
    onClearAll();
    toast("Comparison cleared");
  };

  if (events.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Compare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events to compare</h3>
          <p className="text-gray-600">
            Add events to your comparison by clicking the "+" button on event cards.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Compare className="h-6 w-6" />
            Compare Events
          </h2>
          <p className="text-gray-600 mt-1">
            Comparing {events.length} event{events.length > 1 ? "s" : ""}
          </p>
        </div>
        {events.length > 0 && (
          <Button
            variant="outline"
            onClick={handleClearAll}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Comparison Table */}
      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: `repeat(${Math.min(events.length, 3)}, 1fr)` }}
      >
        {events.slice(0, 3).map(event => (
          <Card key={event._id} className="relative">
            <CardHeader className="pb-3">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 text-gray-400 hover:text-red-600"
                onClick={() => handleRemove(event._id, event.title)}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="relative h-32 w-full mb-4 rounded-lg overflow-hidden">
                <Image src={event.logoUrl} alt={event.title} fill className="object-cover" />
              </div>

              <CardTitle className="text-lg line-clamp-2 pr-8">{event.title}</CardTitle>
              <p className="text-sm text-gray-600">by {event.organizerName}</p>

              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                <Badge className={getDifficultyColor(event.difficulty)}>{event.difficulty}</Badge>
                {event.isFree && <Badge className="bg-green-500 text-white">Free</Badge>}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Event Date */}
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Event Date</p>
                  <p className="text-gray-600">
                    {formatDate(event.eventDate)}
                    {event.eventDate !== event.endDate && ` - ${formatDate(event.endDate)}`}
                  </p>
                </div>
              </div>

              {/* Application Deadline */}
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Application Deadline</p>
                  <p className="text-gray-600">{formatDate(event.applicationDeadline)}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-gray-600">
                    {event.isOnline ? "Virtual Event" : `${event.city}, ${event.country}`}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-start gap-3">
                <DollarSign className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Price</p>
                  <p className={`${event.isFree ? "text-green-600 font-medium" : "text-gray-600"}`}>
                    {event.price}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Tags */}
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Topics</p>
                <div className="flex flex-wrap gap-1">
                  {event.tags.slice(0, 4).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {event.tags.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{event.tags.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button asChild className="flex-1" size="sm">
                  <Link href={`/events/${event.slug}`}>View Details</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Show remaining events if more than 3 */}
      {events.length > 3 && (
        <Card className="p-6 text-center bg-gray-50">
          <p className="text-gray-600">
            And {events.length - 3} more event{events.length - 3 > 1 ? "s" : ""} in your comparison.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Remove some events to view more details side by side.
          </p>
        </Card>
      )}

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Quick Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[#E53935]">
                {events.filter(e => e.isFree).length}
              </div>
              <div className="text-sm text-gray-600">Free Events</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {events.filter(e => e.isOnline).length}
              </div>
              <div className="text-sm text-gray-600">Virtual Events</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#2196F3]">
                {
                  events.filter(
                    e =>
                      e.difficulty.toLowerCase() === "beginner" ||
                      e.difficulty.toLowerCase() === "all levels"
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">Beginner Friendly</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#E53935]">
                {new Set(events.map(e => e.category)).size}
              </div>
              <div className="text-sm text-gray-600">Different Categories</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
