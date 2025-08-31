"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  Code,
  Briefcase,
  DollarSign,
  Building,
  Globe,
  GraduationCap,
  Star,
  Clock,
  MessageCircle,
  Eye,
} from "lucide-react";

interface Bowl {
  id: string;
  name: string;
  description: string;
  memberCount: string;
  icon: any;
  color: string;
  recentActivity: string;
  isJoined?: boolean;
}

interface TrendingTopic {
  id: string;
  title: string;
  posts: number;
  views: number;
  category: string;
}

export function CommunityRightSidebar() {
  const bowlsForYou: Bowl[] = [
    {
      id: "worklife",
      name: "The Worklife Bowl",
      description:
        "Anonymous discussions about work culture, office politics, and career challenges",
      memberCount: "45.2k",
      icon: Building,
      color: "bg-gray-50 text-gray-600",
      recentActivity: "2h",
      isJoined: false,
    },
    {
      id: "consulting",
      name: "Consulting",
      description: "Share experiences and get advice on consulting careers and projects",
      memberCount: "28.7k",
      icon: Briefcase,
      color: "bg-white text-gray-600 border border-gray-200",
      recentActivity: "1h",
      isJoined: false,
    },
    {
      id: "data-science",
      name: "Data Science",
      description: "Connect with data professionals and discuss latest trends in analytics",
      memberCount: "34.1k",
      icon: Code,
      color: "bg-orange-50 text-orange-600",
      recentActivity: "30m",
      isJoined: true,
    },
    {
      id: "product-management",
      name: "Product Management",
      description: "Product managers sharing strategies, roadmaps, and industry insights",
      memberCount: "22.9k",
      icon: TrendingUp,
      color: "bg-gray-50 text-gray-600",
      recentActivity: "45m",
      isJoined: false,
    },
    {
      id: "startup-life",
      name: "Startup Life",
      description: "Early-stage employees and founders discussing startup culture",
      memberCount: "19.3k",
      icon: Star,
      color: "bg-white text-gray-600 border border-gray-200",
      recentActivity: "1h",
      isJoined: false,
    },
  ];

  const trendingTopics: TrendingTopic[] = [
    {
      id: "1",
      title: "Remote work productivity tips",
      posts: 127,
      views: 12400,
      category: "Remote Work",
    },
    {
      id: "2",
      title: "Negotiating salary in tech",
      posts: 89,
      views: 8900,
      category: "Salaries",
    },
    {
      id: "3",
      title: "Interview prep for FAANG",
      posts: 156,
      views: 15600,
      category: "Job Hunting",
    },
    {
      id: "4",
      title: "Work-life balance strategies",
      posts: 203,
      views: 18200,
      category: "Worklife",
    },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Bowls for you */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bowls for you</h3>

          <div className="space-y-4">
            {bowlsForYou.map(bowl => {
              const Icon = bowl.icon;

              return (
                <div
                  key={bowl.id}
                  className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-start space-x-3 mb-3">
                    <div className={`p-2 rounded-lg ${bowl.color} shrink-0`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{bowl.name}</h4>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{bowl.recentActivity}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{bowl.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Users className="h-3 w-3" />
                          <span>{bowl.memberCount} members</span>
                        </div>
                        <Button
                          size="sm"
                          variant={bowl.isJoined ? "outline-solid" : "default"}
                          className="text-xs px-3 py-1 h-7"
                        >
                          {bowl.isJoined ? "View" : "Join"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <Button variant="outline" size="sm" className="w-full">
              Discover more Bowls
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trending Topics */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Topics</h3>

          <div className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <div
                key={topic.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">#{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 mb-1 truncate">{topic.title}</h4>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{topic.posts} posts</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{formatNumber(topic.views)} views</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs mt-2">
                    {topic.category}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <Button variant="link" size="sm" className="w-full text-orange-600">
              See all trending topics →
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Community Stats */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Highlights</h3>

          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">2.5M+</div>
              <div className="text-sm text-gray-600">Active professionals</div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-gray-900">150k+</div>
                <div className="text-xs text-gray-600">Weekly posts</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">85k+</div>
                <div className="text-xs text-gray-600">Companies</div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 text-center">
                Join conversations that matter to your career
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Activity</h3>

          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>
                  You liked a post in <span className="font-medium">Tech Bowl</span>
                </span>
              </div>
              <span className="text-xs text-gray-500 ml-4">2 hours ago</span>
            </div>

            <div className="text-sm text-gray-600">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span>
                  You joined <span className="font-medium">Data Science Bowl</span>
                </span>
              </div>
              <span className="text-xs text-gray-500 ml-4">1 day ago</span>
            </div>

            <div className="text-sm text-gray-600">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>You commented on a career advice post</span>
              </div>
              <span className="text-xs text-gray-500 ml-4">3 days ago</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <Button variant="link" size="sm" className="w-full text-orange-600">
              View all activity →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
