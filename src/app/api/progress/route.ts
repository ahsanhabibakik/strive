import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Progress } from "@/lib/models/Progress";
import { Goal } from "@/lib/models/Goal";
import { User } from "@/lib/models/User";
import { connectToDatabase } from "@/lib/database";
import { rateLimit } from "@/lib/utils/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Apply rate limiting
    const rateLimitResult = await rateLimit(request, { rpm: 100 });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: rateLimitResult.headers }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 100);
    const goalId = url.searchParams.get("goalId");
    const type = url.searchParams.get("type");
    const mood = url.searchParams.get("mood");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const sortBy = url.searchParams.get("sortBy") || "dateRecorded";
    const sortOrder = url.searchParams.get("sortOrder") === "asc" ? 1 : -1;

    // Build filter query
    const filter: any = { userId: user._id };

    if (goalId) filter.goalId = goalId;
    if (type) filter.type = type;
    if (mood) filter.mood = mood;
    if (startDate || endDate) {
      filter.dateRecorded = {};
      if (startDate) filter.dateRecorded.$gte = new Date(startDate);
      if (endDate) filter.dateRecorded.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder;

    const [progressEntries, total] = await Promise.all([
      Progress.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate("goalId", "title category priority")
        .populate("comments.userId", "name avatar")
        .lean(),
      Progress.countDocuments(filter),
    ]);

    return NextResponse.json({
      progressEntries,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching progress entries:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Apply rate limiting
    const rateLimitResult = await rateLimit(request, { rpm: 50 });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: rateLimitResult.headers }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      goalId,
      title,
      currentValue,
      notes,
      difficulty,
      confidence,
      motivation,
      mood,
      timeSpent,
      attachments,
      tags,
      nextSteps,
      challenges,
      lessons,
    } = body;

    // Validate required fields
    if (!goalId || !title || typeof currentValue !== "number") {
      return NextResponse.json(
        { error: "Missing required fields: goalId, title, currentValue" },
        { status: 400 }
      );
    }

    // Check if goal exists and user has access
    const goal = await Goal.findById(goalId);
    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const hasAccess =
      goal.userId.toString() === user._id.toString() ||
      goal.collaborators.some(
        c =>
          c.userId.toString() === user._id.toString() && ["editor", "contributor"].includes(c.role)
      );

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get previous value from latest progress entry or goal's current value
    let previousValue = goal.measurable.currentValue;
    const latestProgress = await Progress.findOne({ goalId, userId: user._id }).sort({
      dateRecorded: -1,
    });

    if (latestProgress) {
      previousValue = latestProgress.currentValue;
    }

    // Create progress entry
    const progressData = {
      goalId,
      userId: user._id,
      title,
      currentValue: Math.min(currentValue, goal.measurable.targetValue),
      previousValue,
      targetValue: goal.measurable.targetValue,
      unit: goal.measurable.unit,
      notes,
      difficulty: difficulty || 3,
      confidence: confidence || 3,
      motivation: motivation || 3,
      mood: mood || "neutral",
      timeSpent,
      attachments: attachments || [],
      tags: tags || [],
      nextSteps: nextSteps || [],
      challenges,
      lessons,
    };

    const progressEntry = new Progress(progressData);
    await progressEntry.save();

    // Update goal's current value and progress percentage
    await Goal.findByIdAndUpdate(goalId, {
      "measurable.currentValue": progressData.currentValue,
      lastUpdated: new Date(),
    });

    // Populate response data
    const populatedEntry = await Progress.findById(progressEntry._id)
      .populate("goalId", "title category priority")
      .lean();

    return NextResponse.json(
      {
        message: "Progress entry created successfully",
        progressEntry: populatedEntry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating progress entry:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
