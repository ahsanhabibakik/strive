"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  BookmarkIcon,
  ClipboardDocumentListIcon,
  PlusIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";
import { ApplicationActions } from "./ApplicationActions";
import { GoalCreationDialog } from "@/components/goals/GoalCreationDialog";
import { GoalList } from "@/components/goals/GoalList";
import { cn } from "@/lib/utils";

interface Application {
  _id: string;
  opportunityId: {
    _id: string;
    title: string;
    organizerName: string;
    logoUrl?: string;
    applicationDeadline: string;
    slug: string;
  };
  status: "submitted" | "under_review" | "accepted" | "rejected" | "waitlisted" | "withdrawn";
  submittedAt: string;
  responses: Record<string, any>;
}

interface Bookmark {
  _id: string;
  opportunityId: {
    _id: string;
    title: string;
    description: string;
    category: string;
    organizerName: string;
    country?: string;
    city?: string;
    isOnline: boolean;
    applicationDeadline: string;
    difficulty: string;
    isTeamBased: boolean;
    isFree: boolean;
    logoUrl?: string;
    slug: string;
    viewCount: number;
    submissionCount: number;
    tags: string[];
  };
  createdAt: string;
}

interface DashboardClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const statusConfig = {
  submitted: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: ClockIcon,
    label: "Submitted",
  },
  under_review: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: EyeIcon,
    label: "Under Review",
  },
  accepted: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircleIcon,
    label: "Accepted",
  },
  rejected: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircleIcon,
    label: "Rejected",
  },
  waitlisted: {
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: ExclamationTriangleIcon,
    label: "Waitlisted",
  },
  withdrawn: {
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: XCircleIcon,
    label: "Withdrawn",
  },
};

export function DashboardClient({ user }: DashboardClientProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [applicationsFilter, setApplicationsFilter] = useState("");
  const [bookmarksFilter, setBookmarksFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [applicationsRes, bookmarksRes] = await Promise.all([
          fetch("/api/applications"),
          fetch("/api/bookmarks"),
        ]);

        if (applicationsRes.ok) {
          const appData = await applicationsRes.json();
          setApplications(appData.applications || []);
        }

        if (bookmarksRes.ok) {
          const bookmarkData = await bookmarksRes.json();
          setBookmarks(bookmarkData.bookmarks || []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredApplications = applications.filter(
    app =>
      app.opportunityId?.title?.toLowerCase().includes(applicationsFilter.toLowerCase()) ||
      app.opportunityId?.organizerName?.toLowerCase().includes(applicationsFilter.toLowerCase())
  );

  const filteredBookmarks = bookmarks.filter(
    bookmark =>
      bookmark.opportunityId?.title?.toLowerCase().includes(bookmarksFilter.toLowerCase()) ||
      bookmark.opportunityId?.organizerName
        ?.toLowerCase()
        .includes(bookmarksFilter.toLowerCase()) ||
      bookmark.opportunityId?.category?.toLowerCase().includes(bookmarksFilter.toLowerCase())
  );

  const refreshData = async () => {
    try {
      const [applicationsRes, bookmarksRes] = await Promise.all([
        fetch("/api/applications"),
        fetch("/api/bookmarks"),
      ]);

      if (applicationsRes.ok) {
        const appData = await applicationsRes.json();
        setApplications(appData.applications || []);
      }

      if (bookmarksRes.ok) {
        const bookmarkData = await bookmarksRes.json();
        setBookmarks(bookmarkData.bookmarks || []);
      }
    } catch (error) {
      console.error("Error refreshing dashboard data:", error);
    }
  };

  const stats = {
    totalApplications: applications.length,
    pendingReview: applications.filter(
      app => app.status === "submitted" || app.status === "under_review"
    ).length,
    accepted: applications.filter(app => app.status === "accepted").length,
    bookmarked: bookmarks.length,
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded-sm w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded-sm w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded-sm w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <ClipboardDocumentListIcon className="h-4 w-4" />
              Total Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-gray-500">Opportunities applied to</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingReview}</div>
            <p className="text-xs text-gray-500">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <CheckCircleIcon className="h-4 w-4" />
              Accepted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
            <p className="text-xs text-gray-500">Successful applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <BookmarkIcon className="h-4 w-4" />
              Saved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.bookmarked}</div>
            <p className="text-xs text-gray-500">Bookmarked opportunities</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <GoalCreationDialog />
            <Button asChild>
              <Link href="/opportunities">
                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                Browse Opportunities
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/opportunities?category=scholarships">Find Scholarships</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/opportunities?difficulty=beginner">Beginner Friendly</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <ClipboardDocumentListIcon className="h-4 w-4" />
            My Applications ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            My Goals
          </TabsTrigger>
          <TabsTrigger value="bookmarks" className="flex items-center gap-2">
            <BookmarkIcon className="h-4 w-4" />
            Saved Opportunities ({bookmarks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-6">
          {/* Applications Filter */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search applications..."
                value={applicationsFilter}
                onChange={e => setApplicationsFilter(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Applications List */}
          <Card>
            <CardContent className="p-0">
              {filteredApplications.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardDocumentListIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start applying to opportunities to see them here!
                  </p>
                  <Button asChild>
                    <Link href="/opportunities">Browse Opportunities</Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredApplications.map(application => {
                    const config = statusConfig[application.status];
                    const StatusIcon = config.icon;

                    return (
                      <div key={application._id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            {application.opportunityId?.logoUrl && (
                              <img
                                src={application.opportunityId.logoUrl}
                                alt={application.opportunityId.organizerName}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {application.opportunityId?.title || "Unknown Opportunity"}
                                  </h3>
                                  <p className="text-sm text-gray-600 mb-2">
                                    {application.opportunityId?.organizerName}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Applied on{" "}
                                    {new Date(application.submittedAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Badge
                                    variant="outline"
                                    className={cn("flex items-center gap-1", config.color)}
                                  >
                                    <StatusIcon className="h-3 w-3" />
                                    {config.label}
                                  </Badge>
                                  <ApplicationActions
                                    applicationId={application._id}
                                    status={application.status}
                                    opportunitySlug={application.opportunityId?.slug || ""}
                                    onStatusUpdate={refreshData}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <GoalList status="all" />
        </TabsContent>

        <TabsContent value="bookmarks" className="space-y-6">
          {/* Bookmarks Filter */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search saved opportunities..."
                value={bookmarksFilter}
                onChange={e => setBookmarksFilter(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Bookmarks Grid */}
          {filteredBookmarks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookmarkIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No saved opportunities</h3>
                <p className="text-gray-600 mb-4">Bookmark opportunities to save them for later!</p>
                <Button asChild>
                  <Link href="/opportunities">Browse Opportunities</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBookmarks.map(bookmark => (
                <OpportunityCard
                  key={bookmark._id}
                  opportunity={{
                    ...bookmark.opportunityId,
                    daysUntilDeadline: Math.ceil(
                      (new Date(bookmark.opportunityId.applicationDeadline).getTime() -
                        Date.now()) /
                        (1000 * 60 * 60 * 24)
                    ),
                    isVerified: true,
                    isFeatured: false,
                    bookmarkCount: 0,
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
