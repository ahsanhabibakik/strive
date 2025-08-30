"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";

interface UseApplicationResult {
  isLoading: boolean;
  updateStatus: (applicationId: string, status: string, notes?: string) => Promise<boolean>;
  deleteApplication: (applicationId: string) => Promise<boolean>;
  error: string | null;
}

export function useApplication(): UseApplicationResult {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = useCallback(async (
    applicationId: string,
    status: string,
    notes?: string
  ): Promise<boolean> => {
    if (!session?.user?.email) {
      setError("You must be logged in to update applications");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, reviewerNotes: notes }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update application");
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update application";
      setError(errorMessage);
      console.error("Error updating application:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const deleteApplication = useCallback(async (
    applicationId: string
  ): Promise<boolean> => {
    if (!session?.user?.email) {
      setError("You must be logged in to delete applications");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete application");
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete application";
      setError(errorMessage);
      console.error("Error deleting application:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  return {
    isLoading,
    updateStatus,
    deleteApplication,
    error,
  };
}