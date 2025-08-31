import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Submission from "@/lib/models/Submission";
import Opportunity from "@/lib/models/Opportunity";
import { z } from "zod";

// Validation schema for filtering submissions
const filterSchema = z.object({
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("20"),
  status: z
    .enum(["draft", "submitted", "under_review", "accepted", "rejected", "withdrawn"])
    .optional(),
  category: z.string().optional(),
  sort: z.enum(["newest", "oldest", "deadline", "status"]).default("newest"),
});

// GET /api/submissions - Get user's submissions
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    const { page, limit, status, category, sort } = filterSchema.parse(params);

    // Build filter query
    const filter: any = { userId: session.user.id };

    if (status) {
      filter.status = status;
    }

    // Build sort query
    let sortQuery: any = {};
    switch (sort) {
      case "newest":
        sortQuery = { createdAt: -1 };
        break;
      case "oldest":
        sortQuery = { createdAt: 1 };
        break;
      case "deadline":
        sortQuery = { submittedAt: -1 };
        break;
      case "status":
        sortQuery = { status: 1, createdAt: -1 };
        break;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;

    // Use aggregation to join with opportunities and filter by category if needed
    const pipeline: any[] = [
      { $match: filter },
      {
        $lookup: {
          from: "opportunities",
          localField: "opportunityId",
          foreignField: "_id",
          as: "opportunity",
        },
      },
      { $unwind: "$opportunity" },
    ];

    // Add category filter if specified
    if (category) {
      pipeline.push({ $match: { "opportunity.category": category } });
    }

    // Add sorting, skip, and limit
    pipeline.push(
      { $sort: sortQuery },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          status: 1,
          submittedAt: 1,
          reviewedAt: 1,
          completionPercentage: 1,
          result: 1,
          createdAt: 1,
          updatedAt: 1,
          "opportunity._id": 1,
          "opportunity.title": 1,
          "opportunity.category": 1,
          "opportunity.organizerName": 1,
          "opportunity.applicationDeadline": 1,
          "opportunity.logoUrl": 1,
        },
      }
    );

    const submissions = await Submission.aggregate(pipeline);

    // Get total count for pagination
    const countPipeline = pipeline.slice(0, -4); // Remove sort, skip, limit, project
    countPipeline.push({ $count: "total" });
    const countResult = await Submission.aggregate(countPipeline);
    const totalCount = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // Get status summary
    const statusSummary = await Submission.aggregate([
      { $match: { userId: session.user.id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusCounts = statusSummary.reduce((acc: any, item: any) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: submissions,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      statusCounts,
    });
  } catch (error) {
    console.error("GET /api/submissions error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/submissions - Create new draft submission
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { opportunityId, applicationData } = body;

    if (!opportunityId) {
      return NextResponse.json(
        { success: false, error: "Opportunity ID is required" },
        { status: 400 }
      );
    }

    // Check if opportunity exists and is open
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return NextResponse.json({ success: false, error: "Opportunity not found" }, { status: 404 });
    }

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
      opportunityId,
    });

    if (existingSubmission) {
      return NextResponse.json(
        { success: false, error: "You have already submitted to this opportunity" },
        { status: 400 }
      );
    }

    // Create draft submission
    const submission = new Submission({
      userId: session.user.id,
      opportunityId,
      applicationData: applicationData || {
        personalInfo: {
          fullName: session.user.name || "",
          email: session.user.email || "",
        },
        responses: [],
        documents: [],
      },
      status: "draft",
      submissionSource: "strive",
      ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
      userAgent: request.headers.get("user-agent"),
    });

    await submission.save();

    return NextResponse.json(
      {
        success: true,
        data: submission,
        message: "Draft submission created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/submissions error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/submissions - Bulk withdraw submissions
export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const ids = searchParams.get("ids")?.split(",");

    if (!ids || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "No submission IDs provided" },
        { status: 400 }
      );
    }

    // Only allow users to withdraw their own submissions that are in draft or submitted status
    const result = await Submission.updateMany(
      {
        _id: { $in: ids },
        userId: session.user.id,
        status: { $in: ["draft", "submitted"] },
      },
      {
        $set: {
          status: "withdrawn",
        },
      }
    );

    return NextResponse.json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount,
      },
      message: `Withdrew ${result.modifiedCount} submissions`,
    });
  } catch (error) {
    console.error("DELETE /api/submissions error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
