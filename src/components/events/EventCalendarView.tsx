"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  MapPin,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format, isSameDay, parseISO, startOfMonth, endOfMonth } from "date-fns";
import Link from "next/link";

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

interface EventCalendarViewProps {
  events: Event[];
}

export function EventCalendarView({ events }: EventCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Get events for the selected date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = parseISO(event.eventDate);
      return isSameDay(eventDate, date);
    });
  };

  // Get all event dates in the current month
  const getEventDatesInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);

    return events
      .filter(event => {
        const eventDate = parseISO(event.eventDate);
        return eventDate >= start && eventDate <= end;
      })
      .map(event => parseISO(event.eventDate));
  };

  const selectedDateEvents = getEventsForDate(selectedDate);
  const eventDatesInMonth = getEventDatesInMonth();

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
        return "bg-purple-100 text-purple-800";
      case "workshop":
        return "bg-orange-100 text-orange-800";
      case "networking":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Event Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={date => date && setSelectedDate(date)}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              modifiers={{
                hasEvent: eventDatesInMonth,
              }}
              modifiersStyles={{
                hasEvent: {
                  backgroundColor: "#e0e7ff",
                  color: "#3730a3",
                  fontWeight: "bold",
                },
              }}
              className="rounded-md border shadow-sm"
            />

            {/* Legend */}
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-100 border-2 border-indigo-600"></div>
                <span className="text-gray-600">Has Events</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-100 border-2 border-gray-300"></div>
                <span className="text-gray-600">No Events</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Date Events */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Events on {format(selectedDate, "MMM dd, yyyy")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">No events scheduled for this date</p>
                <p className="text-sm text-gray-400 mt-1">
                  Select a date with events to see details
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateEvents.map(event => (
                  <div
                    key={event._id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-3 mb-3">
                      <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                      <Badge className={getDifficultyColor(event.difficulty)}>
                        {event.difficulty}
                      </Badge>
                      {event.isFree && <Badge className="bg-green-500 text-white">Free</Badge>}
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-xs text-gray-500">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{event.organizerName}</span>
                      </div>

                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>
                          {event.isOnline ? "Virtual Event" : `${event.city}, ${event.country}`}
                        </span>
                      </div>

                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          {format(parseISO(event.eventDate), "h:mm a")}
                          {event.eventDate !== event.endDate &&
                            ` - ${format(parseISO(event.endDate), "h:mm a")}`}
                        </span>
                      </div>
                    </div>

                    {/* Event Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {event.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {event.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{event.tags.length - 2} more
                        </Badge>
                      )}
                    </div>

                    <Link href={`/events/${event.slug}`}>
                      <Button size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats for Current Month */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Events</span>
                <span className="font-semibold">{eventDatesInMonth.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Free Events</span>
                <span className="font-semibold text-green-600">
                  {
                    events.filter(e => {
                      const eventDate = parseISO(e.eventDate);
                      return (
                        eventDate >= startOfMonth(currentMonth) &&
                        eventDate <= endOfMonth(currentMonth) &&
                        e.isFree
                      );
                    }).length
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Virtual Events</span>
                <span className="font-semibold text-blue-600">
                  {
                    events.filter(e => {
                      const eventDate = parseISO(e.eventDate);
                      return (
                        eventDate >= startOfMonth(currentMonth) &&
                        eventDate <= endOfMonth(currentMonth) &&
                        e.isOnline
                      );
                    }).length
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
