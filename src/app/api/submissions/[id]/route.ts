import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Submission from "@/lib/models/Submission";
import Opportunity from "@/lib/models/Opportunity";
import { z } from "zod";
import { isValidObjectId } from "mongoose";

// Validation schema for updating submissions
const updateSubmissionSchema = z
  .object({
    applicationData: z
      .object({
        personalInfo: z
          .object({
            fullName: z.string().min(1).max(100).optional(),
            email: z.string().email().optional(),
            phone: z.string().optional(),
            university: z.string().optional(),
            graduationYear: z.number().min(1900).max(2050).optional(),
            major: z.string().optional(),
            gpa: z.number().min(0).max(4.5).optional(),
          })
          .optional(),
        responses: z
          .array(
            z.object({
              questionId: z.string(),
              question: z.string(),
              answer: z.string(),
              type: z.enum(["text", "file", "url", "select", "multi_select"]).default("text"),
            })
          )
          .optional(),
        documents: z
          .array(
            z.object({
              name: z.string(),
              url: z.string().url(),
              type: z.string(),
              size: z.number(),
            })
          )
          .optional(),
        portfolioItems: z
          .array(
            z.object({
              title: z.string().max(200),
              description: z.string().max(1000),
              url: z.string().url().optional(),
              images: z.array(z.string().url()).optional(),
              tags: z.array(z.string()).optional(),
            })
          )
          .optional(),
      })
      .optional(),
    teamInfo: z
      .object({
        teamName: z.string().max(100),
        teamMembers: z.array(
          z.object({
            userId: z.string(),
            name: z.string(),
            email: z.string().email(),
            role: z.string(),
            university: z.string().optional(),
          })
        ),
        teamDescription: z.string().max(500).optional(),
      })
      .optional(),
    status: z.enum(["draft", "submitted", "withdrawn"]).optional(),
  })
  .partial();

// Validation schema for review (organizers/admins only)
const reviewSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string().max(2000),
  reviewerNotes: z.string().max(1000).optional(),
  criteria: z
    .array(
      z.object({
        name: z.string(),
        score: z.number().min(0),
        maxScore: z.number().min(1),
        comments: z.string().optional(),
      })
    )
    .optional(),
  status: z.enum(["under_review", "accepted", "rejected"]),
});

interface RouteParams {
  params: { id: string };
}

// GET /api/submissions/[id] - Get single submission
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: "Invalid submission ID" }, { status: 400 });
    }

    // Find submission with opportunity details
    const submission = await Submission.findById(id)
      .populate({
        path: "opportunityId",
        select: "title category organizerName organizerId applicationDeadline logoUrl",
      })
      .lean();

    if (!submission) {
      return NextResponse.json({ success: false, error: "Submission not found" }, { status: 404 });
    }

    // Check permissions
    const isOwner = submission.userId.toString() === session.user.id;
    const isOrganizer = submission.opportunityId.organizerId?.toString() === session.user.id;
    const isAdmin = session.user.role === "admin";

    if (!isOwner && !isOrganizer && !isAdmin) {
      return NextResponse.json({ success: false, error: "Permission denied" }, { status: 403 });
    }

    // Filter sensitive data based on permissions
    const filteredSubmission = { ...submission };

    if (!isOrganizer && !isAdmin) {
      // Regular users can't see reviewer notes
      if (filteredSubmission.reviewData?.reviewerNotes) {
        delete filteredSubmission.reviewData.reviewerNotes;
      }
    }

    if (!isOwner && !isAdmin) {
      // Organizers can't see user's personal metadata
      delete filteredSubmission.ipAddress;
      delete filteredSubmission.userAgent;
    }

    return NextResponse.json({
      success: true,
      data: filteredSubmission,
    });
  } catch (error) {
    console.error(`GET /api/submissions/${params.id} error:`, error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/submissions/[id] - Update submission
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: "Invalid submission ID" }, { status: 400 });
    }

    // Find the submission
    const submission = await Submission.findById(id).populate("opportunityId");
    if (!submission) {
      return NextResponse.json({ success: false, error: "Submission not found" }, { status: 404 });
    }

    // Check permissions (only submission owner can update)
    const isOwner = submission.userId.toString() === session.user.id;
    if (!isOwner) {
      return NextResponse.json({ success: false, error: "Permission denied" }, { status: 403 });
    }

    // Check if submission can be updated (only draft and submitted status)
    if (!["draft", "submitted"].includes(submission.status)) {
      return NextResponse.json(
        { success: false, error: "Cannot update submission in current status" },
        { status: 400 }
      );
    }

    // Check if opportunity deadline has passed
    if (new Date() > new Date(submission.opportunityId.applicationDeadline)) {
      return NextResponse.json(
        { success: false, error: "Application deadline has passed" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateSubmissionSchema.parse(body);

    // If status is being changed to "submitted", validate required fields
    if (validatedData.status === "submitted") {
      const applicationData = validatedData.applicationData || submission.applicationData;

      if (!applicationData.personalInfo?.fullName || !applicationData.personalInfo?.email) {
        return NextResponse.json(
          { success: false, error: "Full name and email are required for submission" },
          { status: 400 }
        );
      }
    }

    // Merge the updates with existing data
    const updateData: any = {};

    if (validatedData.applicationData) {
      updateData.applicationData = {
        ...submission.applicationData,
        ...validatedData.applicationData,
        personalInfo: {
          ...submission.applicationData.personalInfo,
          ...validatedData.applicationData.personalInfo,
        },
      };
    }

    if (validatedData.teamInfo) {
      updateData.teamInfo = validatedData.teamInfo;
    }

    if (validatedData.status) {
      updateData.status = validatedData.status;
      if (validatedData.status === "submitted" && submission.status === "draft") {
        updateData.submittedAt = new Date();
        // Increment submission count on opportunity
        await Opportunity.findByIdAndUpdate(submission.opportunityId._id, {
          $inc: { submissionCount: 1 },
        });
      }
    }

    // Update submission
    const updatedSubmission = await Submission.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate({
      path: "opportunityId",
      select: "title category organizerName applicationDeadline logoUrl",
    });

    return NextResponse.json({
      success: true,
      data: updatedSubmission,
      message: "Submission updated successfully",
    });
  } catch (error) {
    console.error(`PUT /api/submissions/${params.id} error:`, error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/submissions/[id] - Withdraw submission
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: "Invalid submission ID" }, { status: 400 });
    }

    // Find the submission
    const submission = await Submission.findById(id);
    if (!submission) {
      return NextResponse.json({ success: false, error: "Submission not found" }, { status: 404 });
    }

    // Check permissions
    const isOwner = submission.userId.toString() === session.user.id;
    const isAdmin = session.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ success: false, error: "Permission denied" }, { status: 403 });
    }

    // Check if submission can be withdrawn
    if (!["draft", "submitted"].includes(submission.status)) {
      return NextResponse.json(
        { success: false, error: "Cannot withdraw submission in current status" },
        { status: 400 }
      );
    }

    // Withdraw submission
    await Submission.findByIdAndUpdate(id, {
      status: "withdrawn",
    });

    return NextResponse.json({
      success: true,
      message: "Submission withdrawn successfully",
    });
  } catch (error) {
    console.error(`DELETE /api/submissions/${params.id} error:`, error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/submissions/[id]/review - Review submission (organizer/admin only)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: "Invalid submission ID" }, { status: 400 });
    }

    // Find the submission
    const submission = await Submission.findById(id).populate("opportunityId");
    if (!submission) {
      return NextResponse.json({ success: false, error: "Submission not found" }, { status: 404 });
    }

    // Check permissions
    const isOrganizer = submission.opportunityId.organizerId?.toString() === session.user.id;
    const isAdmin = session.user.role === "admin";

    if (!isOrganizer && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Organizer or admin privileges required" },
        { status: 403 }
      );
    }

    // Check if submission is in correct status for review
    if (!["submitted", "under_review"].includes(submission.status)) {
      return NextResponse.json(
        { success: false, error: "Submission must be submitted to be reviewed" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = reviewSchema.parse(body);

    // Update submission with review data
    const updatedSubmission = await Submission.findByIdAndUpdate(
      id,
      {
        $set: {
          status: validatedData.status,
          reviewData: {
            score: validatedData.score,
            feedback: validatedData.feedback,
            reviewerId: session.user.id,
            reviewerNotes: validatedData.reviewerNotes,
            criteria: validatedData.criteria,
          },
          reviewedAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedSubmission,
      message: "Submission reviewed successfully",
    });
  } catch (error) {
    console.error(`POST /api/submissions/${params.id}/review error:`, error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid review data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
