import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose-simple";
import Opportunity from "@/lib/models/Opportunity";
import Submission from "@/lib/models/Submission";
import { z } from "zod";
import { isValidObjectId } from "mongoose";

// Validation schema for updating opportunities
const updateOpportunitySchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).max(5000).optional(),
  category: z
    .enum([
      "competition",
      "scholarship",
      "internship",
      "hackathon",
      "workshop",
      "fellowship",
      "conference",
      "other",
    ])
    .optional(),
  subCategory: z.string().optional(),
  organizerName: z.string().min(1).max(100).optional(),
  organizerEmail: z.string().email().optional(),
  organizerWebsite: z.string().url().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  location: z.string().optional(),
  isOnline: z.boolean().optional(),
  timezone: z.string().optional(),
  applicationDeadline: z
    .string()
    .transform(str => new Date(str))
    .optional(),
  startDate: z
    .string()
    .transform(str => new Date(str))
    .optional(),
  endDate: z
    .string()
    .transform(str => new Date(str))
    .optional(),
  announcementDate: z
    .string()
    .transform(str => new Date(str))
    .optional(),
  eligibility: z
    .object({
      minAge: z.number().min(0).max(100).optional(),
      maxAge: z.number().min(0).max(100).optional(),
      educationLevel: z.array(z.string()).optional(),
      nationality: z.array(z.string()).optional(),
      skills: z.array(z.string()).optional(),
      experience: z.string().optional(),
    })
    .optional(),
  requirements: z.array(z.string()).optional(),
  applicationProcess: z.string().min(10).max(2000).optional(),
  fee: z.number().min(0).optional(),
  currency: z.string().length(3).optional(),
  isFree: z.boolean().optional(),
  prizes: z
    .array(
      z.object({
        position: z.string(),
        amount: z.number().optional(),
        description: z.string(),
      })
    )
    .optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
  teamSize: z
    .object({
      min: z.number().min(1).default(1),
      max: z.number().min(1).default(1),
    })
    .optional(),
  isTeamBased: z.boolean().optional(),
  maxParticipants: z.number().min(1).optional(),
  website: z.string().url().optional(),
  applicationUrl: z.string().url().optional(),
  socialLinks: z
    .object({
      linkedin: z.string().optional(),
      twitter: z.string().optional(),
      facebook: z.string().optional(),
      instagram: z.string().optional(),
    })
    .optional(),
  logoUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  status: z.enum(["draft", "published", "closed", "cancelled"]).optional(),
  isFeatured: z.boolean().optional(),
});

// Validation schema for submission
const submitOpportunitySchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(1).max(100),
    email: z.string().email(),
    phone: z.string().optional(),
    university: z.string().optional(),
    graduationYear: z.number().min(1900).max(2050).optional(),
    major: z.string().optional(),
    gpa: z.number().min(0).max(4.5).optional(),
  }),
  responses: z
    .array(
      z.object({
        questionId: z.string(),
        question: z.string(),
        answer: z.string(),
        type: z.enum(["text", "file", "url", "select", "multi_select"]).default("text"),
      })
    )
    .default([]),
  documents: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url(),
        type: z.string(),
        size: z.number(),
      })
    )
    .default([]),
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
});

interface RouteParams {
  params: { id: string };
}

// GET /api/opportunities/[id] - Get single opportunity
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid opportunity ID" },
        { status: 400 }
      );
    }

    const opportunity = await Opportunity.findById(id)
      .select("-moderationNotes") // Exclude sensitive fields
      .lean();

    if (!opportunity) {
      return NextResponse.json({ success: false, error: "Opportunity not found" }, { status: 404 });
    }

    // Increment view count (fire and forget)
    Opportunity.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }).exec();

    // Get related opportunities (same category, different opportunity)
    const relatedOpportunities = await Opportunity.find({
      category: opportunity.category,
      _id: { $ne: id },
      status: "published",
      applicationDeadline: { $gte: new Date() },
    })
      .limit(4)
      .select(
        "title category organizerName applicationDeadline location isOnline difficulty submissionCount"
      )
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        opportunity,
        related: relatedOpportunities,
      },
    });
  } catch (error) {
    console.error(`GET /api/opportunities/${params.id} error:`, error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/opportunities/[id] - Update opportunity (organizer/admin only)
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
      return NextResponse.json(
        { success: false, error: "Invalid opportunity ID" },
        { status: 400 }
      );
    }

    // Find the opportunity
    const opportunity = await Opportunity.findById(id);
    if (!opportunity) {
      return NextResponse.json({ success: false, error: "Opportunity not found" }, { status: 404 });
    }

    // Check permissions
    const isOwner = opportunity.organizerId.toString() === session.user.id;
    const isAdmin = session.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ success: false, error: "Permission denied" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateOpportunitySchema.parse(body);

    // Update opportunity
    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
      id,
      { $set: validatedData },
      { new: true, runValidators: true }
    ).select("-moderationNotes");

    return NextResponse.json({
      success: true,
      data: updatedOpportunity,
      message: "Opportunity updated successfully",
    });
  } catch (error) {
    console.error(`PUT /api/opportunities/${params.id} error:`, error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/opportunities/[id] - Delete opportunity (organizer/admin only)
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
      return NextResponse.json(
        { success: false, error: "Invalid opportunity ID" },
        { status: 400 }
      );
    }

    // Find the opportunity
    const opportunity = await Opportunity.findById(id);
    if (!opportunity) {
      return NextResponse.json({ success: false, error: "Opportunity not found" }, { status: 404 });
    }

    // Check permissions
    const isOwner = opportunity.organizerId.toString() === session.user.id;
    const isAdmin = session.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ success: false, error: "Permission denied" }, { status: 403 });
    }

    // Check if there are existing submissions
    const submissionCount = await Submission.countDocuments({ opportunityId: id });

    if (submissionCount > 0) {
      // Soft delete by changing status to cancelled
      await Opportunity.findByIdAndUpdate(id, {
        status: "cancelled",
        cancelledAt: new Date(),
        cancelledBy: session.user.id,
      });

      return NextResponse.json({
        success: true,
        message: "Opportunity cancelled due to existing submissions",
      });
    } else {
      // Hard delete if no submissions
      await Opportunity.findByIdAndDelete(id);

      return NextResponse.json({
        success: true,
        message: "Opportunity deleted successfully",
      });
    }
  } catch (error) {
    console.error(`DELETE /api/opportunities/${params.id} error:`, error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/opportunities/[id]/submit - Submit to opportunity
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
      return NextResponse.json(
        { success: false, error: "Invalid opportunity ID" },
        { status: 400 }
      );
    }

    // Find the opportunity
    const opportunity = await Opportunity.findById(id);
    if (!opportunity) {
      return NextResponse.json({ success: false, error: "Opportunity not found" }, { status: 404 });
    }

    // Check if opportunity is still open
    if (opportunity.status !== "published") {
      return NextResponse.json(
        { success: false, error: "Opportunity is not accepting submissions" },
        { status: 400 }
      );
    }

    if (new Date() > new Date(opportunity.applicationDeadline)) {
      return NextResponse.json(
        { success: false, error: "Application deadline has passed" },
        { status: 400 }
      );
    }

    // Check if user has already submitted
    const existingSubmission = await Submission.findOne({
      userId: session.user.id,
      opportunityId: id,
    });

    if (existingSubmission) {
      return NextResponse.json(
        { success: false, error: "You have already submitted to this opportunity" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = submitOpportunitySchema.parse(body);

    // Create submission
    const submission = new Submission({
      userId: session.user.id,
      opportunityId: id,
      applicationData: validatedData,
      submissionSource: "strive",
      ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
      userAgent: request.headers.get("user-agent"),
    });

    await submission.save();

    // Increment submission count on opportunity
    await opportunity.incrementSubmission();

    return NextResponse.json(
      {
        success: true,
        data: submission,
        message: "Submission created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(`POST /api/opportunities/${params.id}/submit error:`, error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid submission data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
