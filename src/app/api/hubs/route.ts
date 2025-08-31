import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Hub from "@/lib/models/Hub";
import { z } from "zod";

// Validation schema for creating hubs
const createHubSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  category: z.enum(["industry", "university", "location", "interest", "event"]),
  subCategory: z.string().max(50).optional(),
  avatarUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  emoji: z.string().max(10).optional(),
  rules: z.array(z.string()).max(10).default([]),
  guidelines: z.string().max(2000).optional(),
  isPrivate: z.boolean().default(false),
  requiresApproval: z.boolean().default(false),
  allowedDomains: z.array(z.string()).optional(),
  weeklyThemes: z
    .array(
      z.object({
        day: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]),
        theme: z.string().max(100),
        description: z.string().max(300).optional(),
        emoji: z.string().max(5).optional(),
        isActive: z.boolean().default(true),
      })
    )
    .optional(),
  settings: z
    .object({
      allowPolls: z.boolean().default(true),
      allowImages: z.boolean().default(true),
      allowLinks: z.boolean().default(true),
      requirePostApproval: z.boolean().default(false),
      minAccountAge: z.number().min(0).max(365).optional(),
      minKarma: z.number().min(0).optional(),
      autoModeration: z.boolean().default(false),
    })
    .optional(),
  searchKeywords: z.array(z.string()).default([]),
  externalLinks: z
    .object({
      website: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      twitter: z.string().url().optional(),
      facebook: z.string().url().optional(),
      instagram: z.string().url().optional(),
      discord: z.string().url().optional(),
      slack: z.string().url().optional(),
    })
    .optional(),
});

// Validation schema for filtering hubs
const filterSchema = z.object({
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("20"),
  category: z.enum(["industry", "university", "location", "interest", "event"]).optional(),
  search: z.string().optional(),
  sort: z.enum(["newest", "popular", "active", "alphabetical"]).default("popular"),
  isPrivate: z.string().transform(Boolean).optional(),
  featured: z.string().transform(Boolean).optional(),
});

// GET /api/hubs - List hubs with filters
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    const { page, limit, category, search, sort, isPrivate, featured } = filterSchema.parse(params);

    // Build filter query
    const filter: any = { status: "active" };

    if (category) filter.category = category;
    if (isPrivate !== undefined) filter.isPrivate = isPrivate;
    if (featured !== undefined) filter.isFeatured = featured;

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
      case "popular":
        sortQuery = { memberCount: -1, postCount: -1 };
        break;
      case "active":
        sortQuery = { activeMembers: -1, "analytics.dailyActiveUsers": -1 };
        break;
      case "alphabetical":
        sortQuery = { name: 1 };
        break;
    }

    // Add text score sorting if searching
    if (search) {
      sortQuery = { score: { $meta: "textScore" }, ...sortQuery };
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const hubs = await Hub.find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .select("-moderationNotes -bannedUserIds -suspensionReason")
      .lean();

    // Get total count for pagination
    const totalCount = await Hub.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    // Get category statistics
    const categoryStats = await Hub.aggregate([
      { $match: { status: "active" } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalMembers: { $sum: "$memberCount" },
          totalPosts: { $sum: "$postCount" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return NextResponse.json({
      success: true,
      data: hubs,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      categoryStats,
    });
  } catch (error) {
    console.error("GET /api/hubs error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/hubs - Create new hub
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
    const validatedData = createHubSchema.parse(body);

    // Check for duplicate hub name/slug
    const existingHub = await Hub.findOne({
      $or: [
        { name: validatedData.name },
        { slug: validatedData.name.toLowerCase().replace(/[^a-z0-9-]/g, "-") },
      ],
    });

    if (existingHub) {
      return NextResponse.json(
        { success: false, error: "A hub with this name already exists" },
        { status: 400 }
      );
    }

    // Create hub with user as creator and first moderator
    const hub = new Hub({
      ...validatedData,
      createdBy: session.user.id,
      memberIds: [session.user.id],
      moderatorIds: [session.user.id],
      memberCount: 1,
      settings: {
        allowPolls: true,
        allowImages: true,
        allowLinks: true,
        requirePostApproval: false,
        autoModeration: false,
        ...validatedData.settings,
      },
    });

    await hub.save();

    return NextResponse.json(
      {
        success: true,
        data: hub,
        message: "Hub created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/hubs error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/hubs - Update multiple hubs (admin only)
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

    // Update multiple hubs
    const result = await Hub.updateMany({ _id: { $in: ids } }, { $set: updates });

    return NextResponse.json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount,
      },
      message: `Updated ${result.modifiedCount} hubs`,
    });
  } catch (error) {
    console.error("PUT /api/hubs error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/hubs - Bulk suspend hubs (admin only)
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
    const reason = searchParams.get("reason") || "Policy violation";

    if (!ids || ids.length === 0) {
      return NextResponse.json({ success: false, error: "No hub IDs provided" }, { status: 400 });
    }

    // Suspend hubs instead of deleting
    const result = await Hub.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          status: "suspended",
          suspensionReason: reason,
          suspendedBy: session.user.id,
          suspendedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount,
      },
      message: `Suspended ${result.modifiedCount} hubs`,
    });
  } catch (error) {
    console.error("DELETE /api/hubs error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
