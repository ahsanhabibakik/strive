import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose-simple";
import Opportunity from "@/lib/models/Opportunity";
import { z } from "zod";

// Validation schema for creating opportunities
const createOpportunitySchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  category: z.enum([
    "competition",
    "scholarship",
    "internship",
    "hackathon",
    "workshop",
    "fellowship",
    "conference",
    "other",
  ]),
  subCategory: z.string().optional(),
  organizerName: z.string().min(1).max(100),
  organizerEmail: z.string().email(),
  organizerWebsite: z.string().url().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  location: z.string().optional(),
  isOnline: z.boolean().default(false),
  timezone: z.string().optional(),
  applicationDeadline: z.string().transform(str => new Date(str)),
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
  requirements: z.array(z.string()).default([]),
  applicationProcess: z.string().min(10).max(2000),
  fee: z.number().min(0).optional(),
  currency: z.string().length(3).default("USD"),
  isFree: z.boolean().default(true),
  prizes: z
    .array(
      z.object({
        position: z.string(),
        amount: z.number().optional(),
        description: z.string(),
      })
    )
    .optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  teamSize: z
    .object({
      min: z.number().min(1).default(1),
      max: z.number().min(1).default(1),
    })
    .optional(),
  isTeamBased: z.boolean().default(false),
  maxParticipants: z.number().min(1).optional(),
  website: z.string().url(),
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
  tags: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
});

// Validation schema for filtering opportunities
const filterSchema = z.object({
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("20"),
  category: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  isOnline: z.string().transform(Boolean).optional(),
  isFree: z.string().transform(Boolean).optional(),
  difficulty: z.string().optional(),
  isTeamBased: z.string().transform(Boolean).optional(),
  search: z.string().optional(),
  sort: z.enum(["newest", "deadline", "popular", "alphabetical"]).default("newest"),
  status: z.enum(["published", "draft", "closed", "cancelled"]).default("published"),
});

// GET /api/opportunities - List opportunities with filters
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    const {
      page,
      limit,
      category,
      country,
      city,
      isOnline,
      isFree,
      difficulty,
      isTeamBased,
      search,
      sort,
      status,
    } = filterSchema.parse(params);

    // Build filter query
    const filter: any = { status };

    if (category) filter.category = category;
    if (country) filter.country = new RegExp(country, "i");
    if (city) filter.city = new RegExp(city, "i");
    if (isOnline !== undefined) filter.isOnline = isOnline;
    if (isFree !== undefined) filter.isFree = isFree;
    if (difficulty) filter.difficulty = difficulty;
    if (isTeamBased !== undefined) filter.isTeamBased = isTeamBased;

    // Add deadline filter to only show opportunities that haven't expired
    filter.applicationDeadline = { $gte: new Date() };

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort query
    let sortQuery: any = {};
    switch (sort) {
      case "newest":
        sortQuery = { createdAt: -1 };
        break;
      case "deadline":
        sortQuery = { applicationDeadline: 1 };
        break;
      case "popular":
        sortQuery = { submissionCount: -1, viewCount: -1 };
        break;
      case "alphabetical":
        sortQuery = { title: 1 };
        break;
    }

    // Add text score sorting if searching
    if (search) {
      sortQuery = { score: { $meta: "textScore" }, ...sortQuery };
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const opportunities = await Opportunity.find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .select("-moderationNotes") // Exclude sensitive fields
      .lean();

    // Get total count for pagination
    const totalCount = await Opportunity.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: opportunities,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("GET /api/opportunities error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/opportunities - Create new opportunity (organizers only)
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

    // For now, allow all authenticated users to create opportunities
    // TODO: Implement proper role-based access control
    // if (session.user.role !== "admin" && session.user.role !== "organizer") {
    //   return NextResponse.json(
    //     { success: false, error: "Organizer privileges required" },
    //     { status: 403 }
    //   );
    // }

    const body = await request.json();
    const validatedData = createOpportunitySchema.parse(body);

    // Create opportunity with user as organizer
    const opportunity = new Opportunity({
      ...validatedData,
      organizerId: session.user.id || session.user.email, // Use email as fallback if no id
      status: validatedData.status || "draft", // Use provided status or default to draft
    });

    await opportunity.save();

    return NextResponse.json(
      {
        success: true,
        opportunity: opportunity, // Match what the frontend expects
        data: opportunity,
        message: "Opportunity created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/opportunities error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/opportunities - Update multiple opportunities (admin only)
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Admin privileges required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { ids, updates } = body;

    if (!Array.isArray(ids) || !updates || typeof updates !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request format" },
        { status: 400 }
      );
    }

    // Update multiple opportunities
    const result = await Opportunity.updateMany({ _id: { $in: ids } }, { $set: updates });

    return NextResponse.json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount,
      },
      message: `Updated ${result.modifiedCount} opportunities`,
    });
  } catch (error) {
    console.error("PUT /api/opportunities error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/opportunities - Bulk delete opportunities (admin only)
export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Admin privileges required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const ids = searchParams.get("ids")?.split(",");

    if (!ids || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "No opportunity IDs provided" },
        { status: 400 }
      );
    }

    // Soft delete by updating status
    const result = await Opportunity.updateMany(
      { _id: { $in: ids } },
      { $set: { status: "cancelled" } }
    );

    return NextResponse.json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount,
      },
      message: `Cancelled ${result.modifiedCount} opportunities`,
    });
  } catch (error) {
    console.error("DELETE /api/opportunities error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
