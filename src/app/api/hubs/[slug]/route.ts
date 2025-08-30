import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToMongoDB } from "@/lib/mongoose";
import Hub from "@/lib/models/Hub";
import Post from "@/lib/models/Post";
import { z } from "zod";

// Validation schema for updating hubs
const updateHubSchema = z
  .object({
    name: z.string().min(3).max(100).optional(),
    description: z.string().min(10).max(500).optional(),
    avatarUrl: z.string().url().optional(),
    bannerUrl: z.string().url().optional(),
    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/)
      .optional(),
    emoji: z.string().max(10).optional(),
    rules: z.array(z.string()).max(10).optional(),
    guidelines: z.string().max(2000).optional(),
    isPrivate: z.boolean().optional(),
    requiresApproval: z.boolean().optional(),
    allowedDomains: z.array(z.string()).optional(),
    weeklyThemes: z
      .array(
        z.object({
          day: z.enum([
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ]),
          theme: z.string().max(100),
          description: z.string().max(300).optional(),
          emoji: z.string().max(5).optional(),
          isActive: z.boolean().default(true),
        })
      )
      .optional(),
    settings: z
      .object({
        allowPolls: z.boolean().optional(),
        allowImages: z.boolean().optional(),
        allowLinks: z.boolean().optional(),
        requirePostApproval: z.boolean().optional(),
        minAccountAge: z.number().min(0).max(365).optional(),
        minKarma: z.number().min(0).optional(),
        autoModeration: z.boolean().optional(),
      })
      .optional(),
    searchKeywords: z.array(z.string()).optional(),
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
    pinnedPostIds: z.array(z.string()).max(5).optional(),
  })
  .partial();

// Validation schema for joining/leaving hubs
const membershipSchema = z.object({
  action: z.enum(["join", "leave"]),
});

interface RouteParams {
  params: { slug: string };
}

// GET /api/hubs/[slug] - Get hub details with posts
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToMongoDB();

    const { slug } = params;
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "hot";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Find the hub
    const hub = await Hub.findOne({ slug, status: "active" })
      .populate("moderatorIds", "name image")
      .select("-bannedUserIds -suspensionReason")
      .lean();

    if (!hub) {
      return NextResponse.json({ success: false, error: "Hub not found" }, { status: 404 });
    }

    // Check if user has access to private hub
    const session = await getServerSession(authOptions);
    if (hub.isPrivate && (!session?.user || !hub.memberIds.includes(session.user.id))) {
      return NextResponse.json(
        { success: false, error: "Access denied to private hub" },
        { status: 403 }
      );
    }

    // Build post query
    const postFilter: any = { hubId: hub._id, status: "published" };

    // Build sort query for posts
    let postSort: any = {};
    switch (sort) {
      case "hot":
        // Reddit-style hot algorithm
        postSort = { hotScore: -1, createdAt: -1 };
        break;
      case "new":
        postSort = { createdAt: -1 };
        break;
      case "top":
        postSort = { score: -1, createdAt: -1 };
        break;
      case "controversial":
        // Posts with similar upvotes and downvotes
        postSort = { upvotes: -1, downvotes: -1 };
        break;
    }

    // Get posts with pagination
    const skip = (page - 1) * limit;
    const posts = await Post.find(postFilter)
      .sort(postSort)
      .skip(skip)
      .limit(limit)
      .populate("authorId", "name image")
      .select("-votes") // Don't expose individual votes
      .lean();

    // Get pinned posts separately
    let pinnedPosts = [];
    if (page === 1 && hub.pinnedPostIds && hub.pinnedPostIds.length > 0) {
      pinnedPosts = await Post.find({
        _id: { $in: hub.pinnedPostIds },
        status: "published",
      })
        .populate("authorId", "name image")
        .select("-votes")
        .lean();
    }

    // Get total post count for pagination
    const totalPosts = await Post.countDocuments(postFilter);
    const totalPages = Math.ceil(totalPosts / limit);

    // Check if user is a member
    const isMember = session?.user ? hub.memberIds.includes(session.user.id) : false;
    const isModerator = session?.user
      ? hub.moderatorIds.some((mod: any) => mod._id.toString() === session.user.id)
      : false;

    return NextResponse.json({
      success: true,
      data: {
        hub: {
          ...hub,
          isMember,
          isModerator,
        },
        posts: {
          pinned: pinnedPosts,
          regular: posts,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount: totalPosts,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
        },
      },
    });
  } catch (error) {
    console.error(`GET /api/hubs/${params.slug} error:`, error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/hubs/[slug] - Update hub (moderators/admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToMongoDB();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { slug } = params;

    // Find the hub
    const hub = await Hub.findOne({ slug, status: "active" });
    if (!hub) {
      return NextResponse.json({ success: false, error: "Hub not found" }, { status: 404 });
    }

    // Check permissions
    const isModerator = hub.moderatorIds.includes(session.user.id);
    const isAdmin = session.user.role === "admin";

    if (!isModerator && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Moderator privileges required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = updateHubSchema.parse(body);

    // Update hub
    const updatedHub = await Hub.findByIdAndUpdate(
      hub._id,
      { $set: validatedData },
      { new: true, runValidators: true }
    ).select("-bannedUserIds -suspensionReason");

    return NextResponse.json({
      success: true,
      data: updatedHub,
      message: "Hub updated successfully",
    });
  } catch (error) {
    console.error(`PUT /api/hubs/${params.slug} error:`, error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/hubs/[slug] - Join/Leave hub
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToMongoDB();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { slug } = params;

    // Find the hub
    const hub = await Hub.findOne({ slug, status: "active" });
    if (!hub) {
      return NextResponse.json({ success: false, error: "Hub not found" }, { status: 404 });
    }

    const body = await request.json();
    const { action } = membershipSchema.parse(body);

    const userId = session.user.id;
    const isMember = hub.memberIds.includes(userId);
    const isBanned = hub.bannedUserIds?.includes(userId);

    if (isBanned) {
      return NextResponse.json(
        { success: false, error: "You are banned from this hub" },
        { status: 403 }
      );
    }

    if (action === "join") {
      if (isMember) {
        return NextResponse.json(
          { success: false, error: "You are already a member of this hub" },
          { status: 400 }
        );
      }

      // Check if hub requires approval
      if (hub.requiresApproval) {
        // TODO: Implement approval system
        return NextResponse.json(
          { success: false, error: "This hub requires approval to join. Feature coming soon!" },
          { status: 400 }
        );
      }

      // Check domain restrictions for university hubs
      if (hub.category === "university" && hub.allowedDomains && hub.allowedDomains.length > 0) {
        const userEmail = session.user.email;
        const userDomain = userEmail?.split("@")[1];
        if (!userDomain || !hub.allowedDomains.includes(userDomain)) {
          return NextResponse.json(
            { success: false, error: "You must have a valid university email to join this hub" },
            { status: 403 }
          );
        }
      }

      await hub.addMember(userId);

      return NextResponse.json({
        success: true,
        message: "Successfully joined the hub",
      });
    } else if (action === "leave") {
      if (!isMember) {
        return NextResponse.json(
          { success: false, error: "You are not a member of this hub" },
          { status: 400 }
        );
      }

      // Cannot leave if you're the creator
      if (hub.createdBy.toString() === userId) {
        return NextResponse.json(
          { success: false, error: "Hub creators cannot leave their own hub" },
          { status: 400 }
        );
      }

      await hub.removeMember(userId);

      return NextResponse.json({
        success: true,
        message: "Successfully left the hub",
      });
    }
  } catch (error) {
    console.error(`POST /api/hubs/${params.slug} error:`, error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/hubs/[slug] - Delete hub (creator/admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToMongoDB();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { slug } = params;

    // Find the hub
    const hub = await Hub.findOne({ slug });
    if (!hub) {
      return NextResponse.json({ success: false, error: "Hub not found" }, { status: 404 });
    }

    // Check permissions (only creator or admin can delete)
    const isCreator = hub.createdBy.toString() === session.user.id;
    const isAdmin = session.user.role === "admin";

    if (!isCreator && !isAdmin) {
      return NextResponse.json({ success: false, error: "Permission denied" }, { status: 403 });
    }

    // Check if hub has posts
    const postCount = await Post.countDocuments({ hubId: hub._id });

    if (postCount > 0) {
      // Archive hub instead of deleting if it has content
      await Hub.findByIdAndUpdate(hub._id, {
        status: "archived",
      });

      return NextResponse.json({
        success: true,
        message: "Hub archived due to existing content",
      });
    } else {
      // Delete hub if no content
      await Hub.findByIdAndDelete(hub._id);

      return NextResponse.json({
        success: true,
        message: "Hub deleted successfully",
      });
    }
  } catch (error) {
    console.error(`DELETE /api/hubs/${params.slug} error:`, error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
