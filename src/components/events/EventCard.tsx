"use client";

import { useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  ExternalLink,
  Bookmark,
  Share,
  Plus,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
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

interface EventCardProps {
  event: Event;
  onCompare?: (event: Event) => void;
  isInComparison?: boolean;
}

export function EventCard({ event, onCompare, isInComparison }: EventCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isDeadlineApproaching = () => {
    const deadline = new Date(event.applicationDeadline);
    const today = new Date();
    const daysUntilDeadline = Math.ceil(
      (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilDeadline <= 7;
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
        return "bg-purple-100 text-purple-800";
      case "workshop":
        return "bg-orange-100 text-orange-800";
      case "networking":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: `${window.location.origin}/events/${event.slug}`,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(`${window.location.origin}/events/${event.slug}`);
        toast("Link copied to clipboard!");
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/events/${event.slug}`);
      toast("Link copied to clipboard!");
    }
  };

  const handleCompare = () => {
    if (onCompare) {
      onCompare(event);
      toast(isInComparison ? "Removed from comparison" : "Added to comparison");
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image src={event.logoUrl} alt={event.title} fill className="object-cover rounded-t-lg" />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
            <Badge className={getDifficultyColor(event.difficulty)}>{event.difficulty}</Badge>
          </div>
          {isDeadlineApproaching() && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-red-500 text-white animate-pulse">
                <Clock className="w-3 h-3 mr-1" />
                Deadline Soon
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
          <p className="text-sm text-gray-600 mb-1">by {event.organizerName}</p>
          <p className="text-gray-700 line-clamp-3 mb-4">{event.description}</p>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>
              {formatDate(event.eventDate)}
              {event.eventDate !== event.endDate && ` - ${formatDate(event.endDate)}`}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{event.isOnline ? "Virtual Event" : `${event.city}, ${event.country}`}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className={event.isFree ? "text-green-600 font-medium" : ""}>{event.price}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Apply by {formatDate(event.applicationDeadline)}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {event.tags.slice(0, 4).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
              {tag}
            </Badge>
          ))}
          {event.tags.length > 4 && (
            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
              +{event.tags.length - 4} more
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex gap-3">
        <Button asChild className="flex-1 bg-indigo-600 hover:bg-indigo-700">
          <Link href={`/events/${event.slug}`}>
            <Users className="w-4 h-4 mr-2" />
            View Details
          </Link>
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleBookmark}
            className={isBookmarked ? "bg-yellow-50 border-yellow-300 text-yellow-600" : ""}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
          </Button>

          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share className="w-4 h-4" />
          </Button>

          {onCompare && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleCompare}
              className={isInComparison ? "bg-indigo-50 border-indigo-300 text-indigo-600" : ""}
            >
              {isInComparison ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </Button>
          )}

          <Button variant="outline" size="icon" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
