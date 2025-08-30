import Link from "next/link";
import { Calendar, MapPin, Users, Trophy, Clock, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    if (diffDays < 7) return `${diffDays} days left`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks left`;
    return `${Math.ceil(diffDays / 30)} months left`;
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
        "group hover:shadow-lg transition-all duration-300 border-0 shadow-sm hover:shadow-xl hover:-translate-y-1",
        isFeatured && "ring-2 ring-orange-200 bg-orange-50/30",
        className
      )}
    >
      {bannerUrl && (
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img
            src={bannerUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isFeatured && (
            <Badge className="absolute top-3 left-3 bg-orange-500 hover:bg-orange-600">
              Featured
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white transition-colors",
              isBookmarked && "text-orange-600"
            )}
            onClick={e => {
              e.preventDefault();
              onBookmark?.(opportunity._id);
            }}
          >
            <Bookmark className="h-4 w-4" fill={isBookmarked ? "currentColor" : "none"} />
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
              <h3 className="font-semibold text-lg leading-tight group-hover:text-orange-600 transition-colors line-clamp-2">
                {title}
              </h3>
            </Link>
            <p className="text-sm text-gray-600 mt-1">{organizerName}</p>
          </div>
          {logoUrl && (
            <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border bg-white">
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

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className={cn("font-medium", getUrgencyColor(daysUntilDeadline))}>
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
            <div className="flex items-center gap-2 text-green-700">
              <Trophy className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs font-medium truncate">
                {topPrize.amount
                  ? `${currency || "USD"} ${topPrize.amount.toLocaleString()}`
                  : topPrize.description}
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
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
            Apply Now
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
