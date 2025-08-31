"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  TrendingUp,
  MapPin,
  Clock,
  Eye,
  ThumbsUp,
  Code,
  Briefcase,
  Building,
} from "lucide-react";

interface CommunityMainFeedProps {
  selectedGroup: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

interface Post {
  id: string;
  author: {
    name: string;
    title: string;
    avatar?: string;
    isAnonymous?: boolean;
  };
  content: string;
  group: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  views?: number;
  tags?: string[];
  replies?: Reply[];
}

interface Reply {
  id: string;
  author: {
    name: string;
    title: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
}

const mockPosts: Post[] = [
  {
    id: "1",
    author: {
      name: "Project Manager",
      title: "The Worklife Bowl",
      isAnonymous: true,
    },
    content:
      "I was put on a PIP last week, and I could tell from my manager's tone that it's not going to be easy for me to survive it. Now I have no clue what my next move should be. Do I just quit or fight for it...",
    group: "worklife",
    timestamp: "2mo",
    likes: 1654,
    comments: 1116,
    shares: 245,
    tags: ["PIP", "career", "advice"],
    replies: [
      {
        id: "r1",
        author: {
          name: "Director 1",
          title: "Senior Leadership",
        },
        content:
          "1) Focus on getting a new job 2) Work on meeting whatever PIP requirements they created, but don't expect them to keep you around...",
        timestamp: "2mo",
        likes: 89,
      },
    ],
  },
  {
    id: "2",
    author: {
      name: "Consulting",
      title: "works at Deloitte",
    },
    content:
      "I voted for Trump expecting the tech job market to improve - what the heck is happening? The market seems worse than ever. Anyone else feeling this?",
    group: "tech",
    timestamp: "2w",
    likes: 892,
    comments: 543,
    shares: 127,
    tags: ["tech jobs", "market", "economy"],
  },
  {
    id: "3",
    author: {
      name: "Software Engineer",
      title: "FAANG",
      isAnonymous: true,
    },
    content:
      "Just got laid off after 3 years at my company. The severance package is decent but I'm worried about finding something new in this market. Any tips for standing out?",
    group: "job-hunting",
    timestamp: "1w",
    likes: 456,
    comments: 289,
    shares: 67,
    tags: ["layoffs", "job search", "FAANG"],
  },
  {
    id: "4",
    author: {
      name: "Data Scientist",
      title: "Healthcare Tech",
    },
    content:
      "Switching from finance to tech was the best decision I ever made. 2 years later, 40% salary increase and much better work-life balance. For anyone considering the switch - go for it!",
    group: "career-advice",
    timestamp: "3d",
    likes: 723,
    comments: 234,
    shares: 156,
    tags: ["career change", "tech", "finance"],
  },
];

export function CommunityMainFeed({
  selectedGroup,
  searchQuery,
  onSearchChange,
}: CommunityMainFeedProps) {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPost, setNewPost] = useState("");
  const [showReplies, setShowReplies] = useState<string[]>([]);

  const filteredPosts = posts.filter(post => {
    const matchesGroup = selectedGroup === "all" || post.group === selectedGroup;
    const matchesSearch =
      !searchQuery ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesGroup && matchesSearch;
  });

  const toggleReplies = (postId: string) => {
    setShowReplies(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const getGroupIcon = (group: string) => {
    switch (group) {
      case "tech":
        return Code;
      case "job-hunting":
        return Briefcase;
      case "worklife":
        return Building;
      default:
        return Building;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for Bowls or conversations"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="pl-12 text-lg h-12 border-0 focus-visible:ring-0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Create Post */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Code className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Post as 'Data Scientist'"
              className="border-0 text-base focus-visible:ring-0 bg-gray-50"
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">Discover new communities</div>
            <Button size="sm">Join Bowl</Button>
          </div>
        </CardContent>
      </Card>

      {/* Featured Sections */}
      <Card className="border border-gray-200 bg-white">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Worklife Pros for you</h3>
          <p className="text-sm text-gray-600 mb-4">
            Taking charge of your worklife? Talk to the experts.
          </p>

          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="text-center">
                <Avatar className="h-16 w-16 mx-auto mb-3">
                  <AvatarImage src={`/api/placeholder/64/64?text=Pro${i}`} />
                  <AvatarFallback>P{i}</AvatarFallback>
                </Avatar>
                <h4 className="font-medium text-sm">Expert {i}</h4>
                <p className="text-xs text-gray-600 mb-3">Career Coach</p>
                <Button size="sm" variant="outline" className="text-xs">
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Job Recommendations */}
      <Card className="border border-gray-200 bg-gray-50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Make your next move</h3>

          <div className="grid grid-cols-2 gap-4">
            {[
              {
                company: "Federal Bureau of Investigation",
                salary: "$63K - $138K",
                role: "Data Scientist",
                location: "Washington, DC",
              },
              {
                company: "US Immigration and Customs Enforcement",
                salary: "$121K - $157K",
                role: "Data Scientist [Data Management]",
                location: "Washington, DC",
              },
            ].map((job, i) => (
              <div key={i} className="bg-white rounded-lg p-4 border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-600">{job.company}</span>
                  </div>
                  <Bookmark className="h-4 w-4 text-gray-400 cursor-pointer hover:text-orange-600" />
                </div>
                <h4 className="font-medium text-sm mb-2">{job.role}</h4>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{job.salary}</span>
                  <span className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {job.location}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <Button variant="link" size="sm">
              See more jobs →
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-6">
        {filteredPosts.map(post => {
          const GroupIcon = getGroupIcon(post.group);
          const showPostReplies = showReplies.includes(post.id);

          return (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>
                        {post.author.isAnonymous ? "?" : post.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <GroupIcon className="h-4 w-4 text-orange-600" />
                        <span className="font-medium text-orange-600 text-sm">
                          {post.author.title}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{post.author.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <span className="text-sm">{post.timestamp}</span>
                    <MoreHorizontal className="h-4 w-4 cursor-pointer hover:text-gray-600" />
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <p className="text-gray-900 leading-relaxed">{post.content}</p>
                  {post.content.length > 200 && (
                    <button className="text-orange-600 text-sm mt-2 hover:underline">
                      read more
                    </button>
                  )}
                </div>

                {/* Tags */}
                {post.tags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-6">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-sm">Like</span>
                    </button>
                    <button
                      onClick={() => toggleReplies(post.id)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">{formatNumber(post.comments)} Comments</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors">
                      <Share2 className="h-4 w-4" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <div className="flex -space-x-1">
                        {[1, 2, 3].map(i => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center text-xs text-white font-bold"
                          >
                            {i}
                          </div>
                        ))}
                      </div>
                      <span>{formatNumber(post.likes)}</span>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {showPostReplies && post.replies && (
                  <div className="mt-6 space-y-4 border-t border-gray-100 pt-4">
                    {post.replies.map(reply => (
                      <div key={reply.id} className="flex space-x-3">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage src={reply.author.avatar} />
                          <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              {reply.author.name}
                            </span>
                            <span className="text-xs text-gray-500">{reply.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-700">{reply.content}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <button className="text-xs text-gray-500 hover:text-orange-600">
                              {formatNumber(reply.likes)} likes
                            </button>
                            <button className="text-xs text-gray-500 hover:text-orange-600">
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Load More */}
      <div className="text-center py-8">
        <Button variant="outline" size="lg">
          Load More Posts
        </Button>
      </div>
    </div>
  );
}
