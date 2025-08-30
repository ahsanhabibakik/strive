"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";

interface UseBookmarkResult {
  isBookmarked: boolean;
  isLoading: boolean;
  toggleBookmark: () => Promise<void>;
  error: string | null;
}

export function useBookmark(opportunityId: string): UseBookmarkResult {
  const { data: session } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if opportunity is bookmarked on mount
  useEffect(() => {
    if (!session?.user?.email || !opportunityId) return;

    const checkBookmarkStatus = async () => {
      try {
        const response = await fetch(`/api/bookmarks?opportunityId=${opportunityId}`);
        if (response.ok) {
          const data = await response.json();
          setIsBookmarked(data.bookmarked);
        }
      } catch (err) {
        console.error("Error checking bookmark status:", err);
      }
    };

    checkBookmarkStatus();
  }, [session, opportunityId]);

  const toggleBookmark = useCallback(async () => {
    if (!session?.user?.email) {
      setError("You must be logged in to bookmark opportunities");
      return;
    }

    if (!opportunityId) {
      setError("Invalid opportunity ID");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ opportunityId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to toggle bookmark");
      }

      const data = await response.json();
      setIsBookmarked(data.bookmarked);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to toggle bookmark";
      setError(errorMessage);
      console.error("Error toggling bookmark:", err);
    } finally {
      setIsLoading(false);
    }
  }, [session, opportunityId]);

  return {
    isBookmarked,
    isLoading,
    toggleBookmark,
    error,
  };
}
