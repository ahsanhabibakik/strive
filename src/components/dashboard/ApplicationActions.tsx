"use client";

import { useState } from "react";
import { 
  EllipsisHorizontalIcon,
  EyeIcon,
  XMarkIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useApplication } from "@/hooks/useApplication";
import Link from "next/link";

interface ApplicationActionsProps {
  applicationId: string;
  status: string;
  opportunitySlug: string;
  onStatusUpdate?: () => void;
}

export function ApplicationActions({
  applicationId,
  status,
  opportunitySlug,
  onStatusUpdate
}: ApplicationActionsProps) {
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { updateStatus, deleteApplication, isLoading } = useApplication();

  const canWithdraw = ["submitted", "under_review"].includes(status);
  const canDelete = ["withdrawn"].includes(status);

  const handleWithdraw = async () => {
    const success = await updateStatus(applicationId, "withdrawn");
    if (success) {
      onStatusUpdate?.();
      setShowWithdrawDialog(false);
    }
  };

  const handleDelete = async () => {
    const success = await deleteApplication(applicationId);
    if (success) {
      onStatusUpdate?.();
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <EllipsisHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/opportunities/${opportunitySlug}`}>
              <EyeIcon className="h-4 w-4 mr-2" />
              View Opportunity
            </Link>
          </DropdownMenuItem>
          
          {canWithdraw && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowWithdrawDialog(true)}
                className="text-orange-600 focus:text-orange-600"
              >
                <XMarkIcon className="h-4 w-4 mr-2" />
                Withdraw Application
              </DropdownMenuItem>
            </>
          )}

          {canDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600 focus:text-red-600"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete Application
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Withdraw Confirmation Dialog */}
      <AlertDialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to withdraw this application? This action cannot be undone
              and you'll need to reapply if you change your mind.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleWithdraw}
              disabled={isLoading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isLoading ? "Withdrawing..." : "Withdraw"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this application?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}