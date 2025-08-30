"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Clock,
  Bookmark,
  Share2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Globe,
  Building,
  Mail,
  Phone,
  Download,
  ArrowLeft,
  Confetti,
  PartyPopper,
  Copy,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ApplicationWizard } from "./ApplicationWizard";
import { OpportunityCard } from "./OpportunityCard";
import { useBookmark } from "@/hooks/useBookmark";
import { cn } from "@/lib/utils";

interface OpportunityDetailClientProps {
  opportunity: any;
  relatedOpportunities: any[];
  searchParams: { [key: string]: string | string[] | undefined };
}

export function OpportunityDetailClient({
  opportunity,
  relatedOpportunities,
  searchParams,
}: OpportunityDetailClientProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { isBookmarked, isLoading: bookmarkLoading, toggleBookmark } = useBookmark(opportunity._id);
  const [showApplicationWizard, setShowApplicationWizard] = useState(
    searchParams.apply === "true"
  );
  const [showBookmarkAnimation, setShowBookmarkAnimation] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const {
    _id,
    title,
    description,
    category,
    subCategory,
    organizerName,
    organizerEmail,
    organizerWebsite,
    country,
    city,
    location,
    isOnline,
    timezone,
    applicationDeadline,
    startDate,
    endDate,
    announcementDate,
    eligibility,
    requirements,
    applicationProcess,
    fee,
    currency,
    isFree,
    prizes,
    difficulty,
    teamSize,
    isTeamBased,
    maxParticipants,
    website,
    applicationUrl,
    socialLinks,
    logoUrl,
    bannerUrl,
    images,
    tags,
    status,
    submissionCount,
    viewCount,
    bookmarkCount,
    isVerified,
    isFeatured,
    daysUntilDeadline,
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

  const getUrgencyColor = (daysLeft: number) => {
    if (daysLeft < 0) return "text-red-600";
    if (daysLeft <= 3) return "text-red-600";
    if (daysLeft <= 7) return "text-orange-600";
    if (daysLeft <= 14) return "text-yellow-600";
    return "text-gray-600";
  };

  const handleBookmark = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    if (!isBookmarked) {
      setShowBookmarkAnimation(true);
      setTimeout(() => setShowBookmarkAnimation(false), 1000);
    }
    await toggleBookmark();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this amazing ${category}: ${title} - This looks incredible! 🚀`,
          url: window.location.href,
        });
        setShareMessage("🎉 Thanks for sharing!");
        setTimeout(() => setShareMessage(null), 3000);
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setShareMessage("📋 Link copied! Share away!");
        setTimeout(() => {
          setCopiedLink(false);
          setShareMessage(null);
        }, 3000);
      } catch (error) {
        console.error("Error copying to clipboard:", error);
        setShareMessage("⚠️ Oops! Couldn't copy link");
        setTimeout(() => setShareMessage(null), 3000);
      }
    }
  };

  const fullLocation = isOnline
    ? "Online"
    : city && country
    ? `${city}, ${country}`
    : country || location || "Location TBD";

  const daysLeft = Math.ceil(
    (new Date(applicationDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const isApplicationOpen = daysLeft >= 0 && status === "published";

  if (showApplicationWizard) {
    return (
      <ApplicationWizard
        opportunity={opportunity}
        onClose={() => setShowApplicationWizard(false)}
        onBack={() => setShowApplicationWizard(false)}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto relative">
      {/* Success messages overlay */}
      {shareMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-lg">
            <p className="font-medium">{shareMessage}</p>
          </div>
        </div>
      )}
      
      {/* Bookmark celebration */}
      {showBookmarkAnimation && (
        <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
          <div className="relative">
            <PartyPopper className="h-16 w-16 text-orange-500 animate-bounce" />
            <div className="absolute -top-2 -right-2 animate-ping">
              <div className="h-4 w-4 bg-pink-400 rounded-full" />
            </div>
            <div className="absolute -bottom-2 -left-2 animate-ping delay-200">
              <div className="h-3 w-3 bg-blue-400 rounded-full" />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-2xl font-bold text-orange-600 animate-pulse">
              Bookmarked! 🎉
            </p>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Opportunities
        </Link>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {bannerUrl && (
            <div className="relative h-64 rounded-lg overflow-hidden mb-6">
              <Image
                src={bannerUrl}
                alt={title}
                fill
                className="object-cover"
                priority
              />
              {isFeatured && (
                <Badge className="absolute top-4 left-4 bg-orange-500 hover:bg-orange-600">
                  Featured
                </Badge>
              )}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={cn("text-sm font-medium border", getCategoryColor(category))}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Badge>
              <Badge variant="outline" className={cn("text-sm", getDifficultyColor(difficulty))}>
                {difficulty}
              </Badge>
              {isVerified && (
                <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700 border-blue-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
              {subCategory && (
                <Badge variant="secondary" className="text-sm">
                  {subCategory}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight group hover:text-orange-600 transition-colors cursor-default">
              {title}
              <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity animate-bounce inline-block">
                ✨
              </span>
            </h1>

            <div className="flex items-center gap-4 text-gray-600">
              {logoUrl && (
                <div className="w-12 h-12 rounded-lg overflow-hidden border bg-white flex-shrink-0">
                  <Image
                    src={logoUrl}
                    alt={`${organizerName} logo`}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">{organizerName}</p>
                <p className="text-sm">{viewCount.toLocaleString()} views</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">{fullLocation}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Deadline</p>
                  <p className={cn("text-sm font-medium", getUrgencyColor(daysLeft))}>
                    {formatDeadline(applicationDeadline)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Team</p>
                  <p className="text-sm text-gray-600">
                    {isTeamBased ? `${teamSize?.min || 1}-${teamSize?.max || 1} members` : "Individual"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Cost</p>
                  <p className="text-sm text-gray-600">
                    {isFree ? "Free" : fee ? `${currency || "USD"} ${fee}` : "Fee TBD"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {isApplicationOpen ? (
                  <>
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white hover:scale-105 hover:shadow-xl transition-all duration-300 group/apply font-semibold"
                      onClick={() => setShowApplicationWizard(true)}
                    >
                      <span className="group-hover/apply:animate-pulse">🚀 Apply Now</span>
                      <span className="ml-2 opacity-0 group-hover/apply:opacity-100 transition-opacity">✨</span>
                    </Button>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        {submissionCount} {submissionCount === 1 ? 'application' : 'applications'} submitted 📈
                      </p>
                      {maxParticipants && (
                        <Progress
                          value={(submissionCount / maxParticipants) * 100}
                          className="mt-2"
                        />
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2 animate-pulse" />
                    <p className="font-medium text-red-600">Applications Closed 🚪</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Oops! The deadline has passed, but don't worry - there are more opportunities waiting! 🌟
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "flex-1 transition-all duration-200 hover:scale-105",
                      isBookmarked && "bg-orange-50 border-orange-200 text-orange-700",
                      bookmarkLoading && "animate-pulse"
                    )}
                    onClick={handleBookmark}
                    disabled={bookmarkLoading}
                  >
                    {bookmarkLoading ? (
                      <div className="h-4 w-4 mr-2 animate-spin border-2 border-current border-t-transparent rounded-full" />
                    ) : (
                      <Bookmark
                        className={cn(
                          "h-4 w-4 mr-2 transition-all duration-200",
                          isBookmarked && "fill-current animate-bounce"
                        )}
                      />
                    )}
                    {bookmarkLoading ? "Saving..." : isBookmarked ? "Saved 💫" : "Save"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={cn(
                      "flex-1 hover:scale-105 transition-all duration-200 group/share",
                      copiedLink && "bg-green-50 border-green-200 text-green-700"
                    )} 
                    onClick={handleShare}
                  >
                    {copiedLink ? (
                      <Check className="h-4 w-4 mr-2 animate-bounce" />
                    ) : (
                      <Share2 className="h-4 w-4 mr-2 group-hover/share:animate-pulse" />
                    )}
                    {copiedLink ? "Copied! ✓" : "Share"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {prizes && prizes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Prizes & Awards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prizes.map((prize, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium">{prize.position}</span>
                      <span className="text-green-600 font-semibold">
                        {prize.amount
                          ? `${currency || "USD"} ${prize.amount.toLocaleString()}`
                          : prize.description}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Organizer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                {logoUrl && (
                  <div className="w-10 h-10 rounded-lg overflow-hidden border bg-white">
                    <Image
                      src={logoUrl}
                      alt={`${organizerName} logo`}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="font-medium">{organizerName}</p>
                  {isVerified && (
                    <p className="text-sm text-blue-600 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Verified Organizer
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {organizerEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <a
                      href={`mailto:${organizerEmail}`}
                      className="text-blue-600 hover:underline"
                    >
                      {organizerEmail}
                    </a>
                  </div>
                )}
                {organizerWebsite && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a
                      href={organizerWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="application">How to Apply</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>About This Opportunity</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                {description}
              </p>

              {tags.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Related Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Eligibility Criteria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {eligibility.minAge && (
                  <div>
                    <p className="font-medium">Age Requirements</p>
                    <p className="text-sm text-gray-600">
                      {eligibility.minAge}
                      {eligibility.maxAge ? `-${eligibility.maxAge}` : "+"} years old
                    </p>
                  </div>
                )}

                {eligibility.educationLevel && eligibility.educationLevel.length > 0 && (
                  <div>
                    <p className="font-medium">Education Level</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {eligibility.educationLevel.map((level) => (
                        <Badge key={level} variant="outline" className="text-xs">
                          {level}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {eligibility.nationality && eligibility.nationality.length > 0 && (
                  <div>
                    <p className="font-medium">Nationality</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {eligibility.nationality.map((nat) => (
                        <Badge key={nat} variant="outline" className="text-xs">
                          {nat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {eligibility.skills && eligibility.skills.length > 0 && (
                  <div>
                    <p className="font-medium">Required Skills</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {eligibility.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {eligibility.experience && (
                  <div>
                    <p className="font-medium">Experience</p>
                    <p className="text-sm text-gray-600">{eligibility.experience}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                {requirements.length > 0 ? (
                  <ul className="space-y-2">
                    {requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No specific requirements listed.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Important Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-red-800">Application Deadline</p>
                    <p className="text-sm text-red-600">
                      {new Date(applicationDeadline).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    {formatDeadline(applicationDeadline)}
                  </Badge>
                </div>

                {startDate && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-800">Start Date</p>
                      <p className="text-sm text-blue-600">
                        {new Date(startDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {endDate && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-800">End Date</p>
                      <p className="text-sm text-green-600">
                        {new Date(endDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {announcementDate && (
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium text-purple-800">Results Announcement</p>
                      <p className="text-sm text-purple-600">
                        {new Date(announcementDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="application" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {applicationProcess}
                </p>
              </div>

              <Separator className="my-6" />

              <div className="flex flex-col sm:flex-row gap-4">
                {website && (
                  <Button asChild variant="outline">
                    <a href={website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Official Website
                    </a>
                  </Button>
                )}

                {applicationUrl && (
                  <Button asChild>
                    <a href={applicationUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      External Application
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Related Opportunities */}
      {relatedOpportunities.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedOpportunities.map((related) => (
              <OpportunityCard
                key={related._id}
                opportunity={{
                  ...related,
                  daysUntilDeadline: Math.ceil(
                    (new Date(related.applicationDeadline).getTime() - Date.now()) /
                      (1000 * 60 * 60 * 24)
                  ),
                  bookmarkCount: 0,
                  slug: related._id,
                  fee: related.isFree ? 0 : undefined,
                  currency: "USD",
                  isVerified: false,
                  isFeatured: false,
                }}
                onBookmark={(id) => console.log("Bookmark:", id)}
                isBookmarked={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}