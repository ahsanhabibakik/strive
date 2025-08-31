"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Code,
  Briefcase,
  DollarSign,
  Users,
  TrendingUp,
  Globe,
  GraduationCap,
  Building,
  ChevronDown,
  Settings,
} from "lucide-react";

interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface CommunityLeftSidebarProps {
  user: User;
  selectedGroup: string;
  onGroupSelect: (groupId: string) => void;
}

export function CommunityLeftSidebar({
  user,
  selectedGroup,
  onGroupSelect,
}: CommunityLeftSidebarProps) {
  const [showAllGroups, setShowAllGroups] = useState(false);

  const groups = [
    {
      id: "tech",
      name: "Tech",
      icon: Code,
      color: "bg-orange-50 text-orange-600",
      memberCount: "12.5k",
    },
    {
      id: "job-hunting",
      name: "Job Hunting in Tech",
      icon: Briefcase,
      color: "bg-gray-100 text-gray-600",
      memberCount: "8.3k",
    },
    {
      id: "salaries",
      name: "Salaries in Tech",
      icon: DollarSign,
      color: "bg-orange-50 text-orange-600",
      memberCount: "15.2k",
    },
    {
      id: "career-advice",
      name: "Career Advice",
      icon: TrendingUp,
      color: "bg-gray-100 text-gray-600",
      memberCount: "9.7k",
    },
    {
      id: "startups",
      name: "Startup Life",
      icon: Building,
      color: "bg-orange-50 text-orange-600",
      memberCount: "6.4k",
    },
    {
      id: "remote-work",
      name: "Remote Work",
      icon: Globe,
      color: "bg-gray-100 text-gray-600",
      memberCount: "11.8k",
    },
    {
      id: "students",
      name: "Students & New Grads",
      icon: GraduationCap,
      color: "bg-orange-50 text-orange-600",
      memberCount: "7.9k",
    },
  ];

  const visibleGroups = showAllGroups ? groups : groups.slice(0, 4);

  const getUserInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-4">
      {/* User Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.image || ""} alt={user.name || ""} />
              <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Post anonymously as</p>
              <div className="flex items-center space-x-2">
                <p className="text-lg font-semibold text-gray-900 truncate">
                  {user.name || "User"}
                </p>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create post
          </Button>
        </CardContent>
      </Card>

      {/* My Groups */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My Bowls</h3>

          <div className="space-y-2 mb-4">
            {visibleGroups.map(group => {
              const Icon = group.icon;
              const isSelected = selectedGroup === group.id;

              return (
                <button
                  key={group.id}
                  onClick={() => onGroupSelect(group.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    isSelected
                      ? "bg-orange-50 border-2 border-orange-200"
                      : "hover:bg-gray-50 border-2 border-transparent"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${group.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900">{group.name}</p>
                    <p className="text-xs text-gray-500">{group.memberCount} members</p>
                  </div>
                </button>
              );
            })}
          </div>

          {groups.length > 4 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllGroups(!showAllGroups)}
              className="w-full justify-center text-orange-600 hover:text-orange-700"
            >
              {showAllGroups ? "Show Less" : `Show ${groups.length - 4} More`}
            </Button>
          )}

          <div className="mt-6">
            <Button variant="outline" size="sm" className="w-full">
              <Users className="h-4 w-4 mr-2" />
              Explore Bowls
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>

          <div className="space-y-2">
            <button className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Settings className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-700">Settings & Privacy</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-700">My Activity</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-700">Invite Friends</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
