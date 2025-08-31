"use client";

import { useState, useEffect } from "react";
import { CommunityLeftSidebar } from "./CommunityLeftSidebar";
import { CommunityMainFeed } from "./CommunityMainFeed";
import { CommunityRightSidebar } from "./CommunityRightSidebar";
import { Header } from "@/components/landing/Header";

interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface CommunityPageProps {
  user: User;
}

export function CommunityPage({ user }: CommunityPageProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="w-80 shrink-0 sticky top-24 self-start">
            <CommunityLeftSidebar
              user={user}
              selectedGroup={selectedGroup}
              onGroupSelect={setSelectedGroup}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <CommunityMainFeed
              selectedGroup={selectedGroup}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          {/* Right Sidebar */}
          <div className="w-80 shrink-0 sticky top-24 self-start">
            <CommunityRightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
