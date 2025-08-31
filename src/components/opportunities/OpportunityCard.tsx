import Link from "next/link";
import { Calendar, MapPin, Users, Trophy, Clock, Bookmark, Heart, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useBookmark } from "@/hooks/useBookmark";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface OpportunityCardProps {
  opportunity: {
    _id: string;
    title: string;
    description: string;
    category: string;
    organizerName: string;
    country?: string;
    city?: string;
    isOnline: boolean;
    applicationDeadline: string;
    startDate?: string;
    endDate?: string;
    difficulty: string;
    isTeamBased: boolean;
    isFree: boolean;
    fee?: number;
    currency?: string;
    prizes?: Array<{
      position: string;
      amount?: number;
      description: string;
    }>;
    tags: string[];
    logoUrl?: string;
    bannerUrl?: string;
    slug: string;
    viewCount: number;
    submissionCount: number;
    bookmarkCount: number;
    daysUntilDeadline?: number;
    isVerified: boolean;
    isFeatured: boolean;
  };
  onBookmark?: (id: string) => void;
  isBookmarked?: boolean;
  className?: string;
}

export function OpportunityCard({
  opportunity,
  onBookmark,
  isBookmarked = false,
  className,
}: OpportunityCardProps) {
  const { isBookmarked: hookBookmarked, isLoading: bookmarkLoading, toggleBookmark } = useBookmark(opportunity._id);
  const [showBookmarkAnimation, setShowBookmarkAnimation] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const {
    _id,
    title,
    description,
    category,
    organizerName,
    country,
    city,
    isOnline,
    applicationDeadline,
    startDate,
    difficulty,
    isTeamBased,
    isFree,
    fee,
    currency,
    prizes,
    tags,
    logoUrl,
    bannerUrl,
    slug,
    viewCount,
    submissionCount,
    daysUntilDeadline,
    isVerified,
    isFeatured,
  } = opportunity;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      competition: "bg-red-100 text-red-800 border-red-200",
      scholarship: "bg-green-100 text-green-800 border-green-200",
      internship: "bg-blue-100 text-blue-800 border-blue-200",
      hackathon: "bg-purple-100 text-purple-800 border-purple-200",
      workshop: "bg-yellow-100 text-yellow-800 border-yellow-200",
      fellowship: "bg-indigo-100 text-indigo-800 border-indigo-200",
      conference: "bg-pink-100 text-pink-800 border-pink-200",
      other: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[category] || colors.other;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: "bg-green-50 text-green-700 border-green-200",
      intermediate: "bg-yellow-50 text-yellow-700 border-yellow-200",
      advanced: "bg-orange-50 text-orange-700 border-orange-200",
      expert: "bg-red-50 text-red-700 border-red-200",
    };
    return colors[difficulty] || colors.beginner;
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Deadline passed";
    if (diffDays === 0) return "Due today! ⚡";
    if (diffDays === 1) return "Due tomorrow! 🔥";
    if (diffDays < 3) return `${diffDays} days left 🚨`;
    if (diffDays < 7) return `${diffDays} days left ⏰`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks left 📅`;
    return `${Math.ceil(diffDays / 30)} months left 🗓️`;
  };

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!hookBookmarked) {
      setShowBookmarkAnimation(true);
      setTimeout(() => setShowBookmarkAnimation(false), 600);
    }
    await toggleBookmark();
  };

  const getUrgencyColor = (daysLeft?: number) => {
    if (!daysLeft || daysLeft < 0) return "text-red-600";
    if (daysLeft <= 3) return "text-red-600";
    if (daysLeft <= 7) return "text-orange-600";
    if (daysLeft <= 14) return "text-yellow-600";
    return "text-gray-600";
  };

  const location = isOnline
    ? "Online"
    : city && country
      ? `${city}, ${country}`
      : country || "Location TBD";

  const topPrize = prizes?.[0];

  return (
    <Card
      className={cn(
        "group hover:shadow-lg transition-all duration-300 border-0 shadow-xs hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] relative overflow-hidden",
        isFeatured && "ring-2 ring-orange-200 bg-linear-to-br from-orange-50/50 to-orange-100/30",
        isHovered && "shadow-2xl",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sparkle animation for featured */}
      {isFeatured && isHovered && (
        <div className="absolute top-2 right-2 animate-pulse">
          <Sparkles className="h-4 w-4 text-orange-400 animate-bounce" />
        </div>
      )}
      
      {/* Bookmark celebration animation */}
      {showBookmarkAnimation && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Heart className="h-8 w-8 text-red-500 animate-ping" />
          </div>
          <div className="absolute top-1/4 left-1/4 animate-bounce delay-100">
            <div className="w-2 h-2 bg-pink-400 rounded-full" />
          </div>
          <div className="absolute top-1/3 right-1/4 animate-bounce delay-200">
            <div className="w-2 h-2 bg-purple-400 rounded-full" />
          </div>
          <div className="absolute bottom-1/3 left-1/3 animate-bounce delay-300">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
          </div>
        </div>
      )}
      {bannerUrl && (
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img
            src={bannerUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {isFeatured && (
            <Badge className="absolute top-3 left-3 bg-orange-500 hover:bg-orange-600">
              Featured
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "absolute top-3 right-3 bg-white/80 backdrop-blur-xs hover:bg-white hover:scale-110 transition-all duration-200",
              hookBookmarked && "text-orange-600 bg-orange-50/90",
              bookmarkLoading && "animate-pulse"
            )}
            onClick={handleBookmarkClick}
            disabled={bookmarkLoading}
          >
            {bookmarkLoading ? (
              <div className="h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <Bookmark 
                className={cn(
                  "h-4 w-4 transition-all duration-200",
                  hookBookmarked && "fill-current animate-bounce"
                )} 
                fill={hookBookmarked ? "currentColor" : "none"} 
              />
            )}
          </Button>
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={cn("text-xs font-medium border", getCategoryColor(category))}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Badge>
              <Badge variant="outline" className={cn("text-xs", getDifficultyColor(difficulty))}>
                {difficulty}
              </Badge>
              {isVerified && (
                <Badge
                  variant="outline"
                  className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                >
                  Verified
                </Badge>
              )}
            </div>
            <Link href={`/opportunities/${slug}`} className="group">
              <h3 className="font-semibold text-lg leading-tight group-hover:text-orange-600 transition-all duration-200 group-hover:translate-x-1 line-clamp-2">
                {title}
                {isHovered && (
                  <span className="ml-1 inline-block animate-bounce">✨</span>
                )}
              </h3>
            </Link>
            <p className="text-sm text-gray-600 mt-1">{organizerName}</p>
          </div>
          {logoUrl && (
            <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden border bg-white">
              <img
                src={logoUrl}
                alt={`${organizerName} logo`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-sm text-gray-700 line-clamp-3 mb-4">{description}</p>

        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center gap-2 group/location hover:text-blue-600 transition-colors">
            <MapPin className="h-4 w-4 shrink-0 group-hover/location:animate-bounce" />
            <span className="truncate">{location}</span>
          </div>

          <div className="flex items-center gap-2 group/deadline">
            <Calendar className={cn(
              "h-4 w-4 shrink-0",
              daysUntilDeadline && daysUntilDeadline <= 3 && "animate-pulse text-red-500"
            )} />
            <span className={cn(
              "font-medium transition-all duration-200",
              getUrgencyColor(daysUntilDeadline),
              daysUntilDeadline && daysUntilDeadline <= 1 && "animate-pulse"
            )}>
              {formatDeadline(applicationDeadline)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="text-xs">{isTeamBased ? "Team" : "Individual"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span className="text-xs">
                {isFree ? "Free" : fee ? `${currency || "USD"} ${fee}` : "Fee TBD"}
              </span>
            </div>
          </div>

          {topPrize && (
            <div className="flex items-center gap-2 text-green-700 group/prize hover:text-green-600 transition-colors">
              <Trophy className="h-4 w-4 shrink-0 group-hover/prize:animate-bounce group-hover/prize:text-yellow-500" />
              <span className="text-xs font-medium truncate">
                {topPrize.amount
                  ? `${currency || "USD"} ${topPrize.amount.toLocaleString()} 💰`
                  : `${topPrize.description} 🏆`}
              </span>
            </div>
          )}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {tags.slice(0, 3).map(tag => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="secondary" className="text-xs px-2 py-1 bg-gray-100 text-gray-600">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>{viewCount} views</span>
          <span>{submissionCount} applications</span>
        </div>
        <Link href={`/opportunities/${slug}`}>
          <Button 
            size="sm" 
            className="bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white hover:scale-105 hover:shadow-lg transition-all duration-200 group/apply"
          >
            <span className="group-hover/apply:animate-pulse">Apply Now</span>
            {isHovered && (
              <span className="ml-1 animate-bounce">🚀</span>
            )}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
