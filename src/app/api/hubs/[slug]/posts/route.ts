import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToMongoDB } from "@/lib/mongoose";
import Hub from "@/lib/models/Hub";
import Post from "@/lib/models/Post";
import { z } from "zod";

// Validation schema for creating posts
const createPostSchema = z.object({
  title: z.string().min(3).max(300),
  content: z.string().max(10000).optional(),
  contentType: z.enum(["text", "link", "image", "poll", "event"]).default("text"),
  contentData: z
    .object({
      // For link posts
      url: z.string().url().optional(),
      linkTitle: z.string().optional(),
      linkDescription: z.string().optional(),
      linkImage: z.string().url().optional(),

      // For image posts
      images: z
        .array(
          z.object({
            url: z.string().url(),
            caption: z.string().max(500).optional(),
            alt: z.string().max(200).optional(),
          })
        )
        .optional(),

      // For polls
      poll: z
        .object({
          question: z.string().max(500),
          options: z
            .array(
              z.object({
                id: z.string(),
                text: z.string().max(200),
              })
            )
            .min(2)
            .max(10),
          allowMultiple: z.boolean().default(false),
          expiresAt: z
            .string()
            .transform(str => new Date(str))
            .optional(),
        })
        .optional(),

      // For events
      event: z
        .object({
          eventDate: z.string().transform(str => new Date(str)),
          location: z.string().optional(),
          isOnline: z.boolean().default(false),
          registrationUrl: z.string().url().optional(),
          description: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  tags: z.array(z.string()).max(10).default([]),
  flair: z.string().max(50).optional(),
  weeklyTheme: z
    .object({
      day: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]),
      theme: z.string(),
      emoji: z.string().optional(),
    })
    .optional(),
  linkedOpportunityId: z.string().optional(),
  linkedTeamId: z.string().optional(),
  isSpoiler: z.boolean().default(false),
  isNSFW: z.boolean().default(false),
});

// Validation schema for filtering posts
const filterSchema = z.object({
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("20"),
  sort: z.enum(["hot", "new", "top", "controversial"]).default("hot"),
  contentType: z.enum(["text", "link", "image", "poll", "event"]).optional(),
  flair: z.string().optional(),
  search: z.string().optional(),
});

interface RouteParams {
  params: { slug: string };
}

// GET /api/hubs/[slug]/posts - Get posts in hub
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToMongoDB();

    const { slug } = params;
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const { page, limit, sort, contentType, flair, search } = filterSchema.parse(queryParams);

    // Find the hub
    const hub = await Hub.findOne({ slug, status: "active" }).lean();
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

    // Build filter query
    const filter: any = {
      hubId: hub._id,
      status: "published",
    };

    if (contentType) filter.contentType = contentType;
    if (flair) filter.flair = flair;

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort query
    let sortQuery: any = {};
    switch (sort) {
      case "hot":
        sortQuery = { isPinned: -1, hotScore: -1, createdAt: -1 };
        break;
      case "new":
        sortQuery = { isPinned: -1, createdAt: -1 };
        break;
      case "top":
        sortQuery = { isPinned: -1, upvotes: -1, createdAt: -1 };
        break;
      case "controversial":
        // Posts with high engagement but mixed votes
        sortQuery = { isPinned: -1, commentCount: -1, upvotes: -1, downvotes: -1 };
        break;
    }

    // Add text score sorting if searching
    if (search) {
      sortQuery = { score: { $meta: "textScore" }, ...sortQuery };
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const posts = await Post.find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .populate("authorId", "name image")
      .populate("linkedOpportunityId", "title category applicationDeadline")
      .populate("linkedTeamId", "name teamType")
      .select("-votes -analytics.clicks") // Don't expose sensitive data
      .lean();

    // Get total count for pagination
    const totalCount = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    // Get post statistics for the hub
    const postStats = await Post.aggregate([
      { $match: { hubId: hub._id, status: "published" } },
      {
        $group: {
          _id: "$contentType",
          count: { $sum: 1 },
          totalUpvotes: { $sum: "$upvotes" },
          totalComments: { $sum: "$commentCount" },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        posts,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        stats: postStats,
      },
    });
  } catch (error) {
    console.error(`GET /api/hubs/${params.slug}/posts error:`, error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/hubs/[slug]/posts - Create new post in hub
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

    // Check if user is a member
    if (!hub.memberIds.includes(session.user.id)) {
      return NextResponse.json(
        { success: false, error: "You must be a member to post in this hub" },
        { status: 403 }
      );
    }

    // Check if user is banned
    if (hub.bannedUserIds?.includes(session.user.id)) {
      return NextResponse.json(
        { success: false, error: "You are banned from posting in this hub" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = createPostSchema.parse(body);

    // Validate content type specific requirements
    if (validatedData.contentType === "link" && !validatedData.contentData?.url) {
      return NextResponse.json(
        { success: false, error: "URL is required for link posts" },
        { status: 400 }
      );
    }

    if (
      validatedData.contentType === "image" &&
      (!validatedData.contentData?.images || validatedData.contentData.images.length === 0)
    ) {
      return NextResponse.json(
        { success: false, error: "At least one image is required for image posts" },
        { status: 400 }
      );
    }

    if (validatedData.contentType === "poll" && !validatedData.contentData?.poll) {
      return NextResponse.json(
        { success: false, error: "Poll data is required for poll posts" },
        { status: 400 }
      );
    }

    if (validatedData.contentType === "event" && !validatedData.contentData?.event) {
      return NextResponse.json(
        { success: false, error: "Event data is required for event posts" },
        { status: 400 }
      );
    }

    // Check hub settings
    if (!hub.settings.allowPolls && validatedData.contentType === "poll") {
      return NextResponse.json(
        { success: false, error: "Polls are not allowed in this hub" },
        { status: 400 }
      );
    }

    if (!hub.settings.allowImages && validatedData.contentType === "image") {
      return NextResponse.json(
        { success: false, error: "Images are not allowed in this hub" },
        { status: 400 }
      );
    }

    if (!hub.settings.allowLinks && validatedData.contentType === "link") {
      return NextResponse.json(
        { success: false, error: "Links are not allowed in this hub" },
        { status: 400 }
      );
    }

    // Process poll options if it's a poll post
    if (validatedData.contentType === "poll" && validatedData.contentData?.poll) {
      validatedData.contentData.poll.options = validatedData.contentData.poll.options.map(
        (option: any) => ({
          ...option,
          votes: 0,
          voters: [],
        })
      );
    }

    // Determine post status based on hub settings
    const postStatus = hub.settings.requirePostApproval ? "pending_approval" : "published";

    // Create post
    const post = new Post({
      ...validatedData,
      authorId: session.user.id,
      hubId: hub._id,
      hubSlug: hub.slug,
      status: postStatus,
      analytics: {
        clicks: 0,
        impressions: 0,
        engagementRate: 0,
        lastEngagement: new Date(),
      },
    });

    await post.save();

    // Increment hub post count if published
    if (postStatus === "published") {
      await hub.incrementPostCount();
    }

    // Populate author info for response
    await post.populate("authorId", "name image");

    return NextResponse.json(
      {
        success: true,
        data: post,
        message:
          postStatus === "pending_approval"
            ? "Post submitted for approval"
            : "Post created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(`POST /api/hubs/${params.slug}/posts error:`, error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
