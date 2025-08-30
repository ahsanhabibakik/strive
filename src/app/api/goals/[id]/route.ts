import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { Goal } from "@/lib/models/Goal";
import { User } from "@/lib/models/User";
import { connectToDatabase } from "@/lib/database";
import { rateLimit } from "@/lib/utils/rate-limit";
import { isValidObjectId } from "mongoose";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ error: "Invalid goal ID" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const goal = await Goal.findById(params.id)
      .populate("collaborators.userId", "name email avatar")
      .populate("userId", "name email avatar")
      .lean();

    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    // Check access permissions
    const hasAccess =
      goal.userId._id.toString() === user._id.toString() ||
      goal.isPublic ||
      goal.collaborators.some(c => c.userId._id.toString() === user._id.toString());

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Increment view count if not the owner
    if (goal.userId._id.toString() !== user._id.toString()) {
      await Goal.findByIdAndUpdate(params.id, { $inc: { viewCount: 1 } });
    }

    return NextResponse.json({ goal });
  } catch (error) {
    console.error("Error fetching goal:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ error: "Invalid goal ID" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const goal = await Goal.findById(params.id);
    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    // Check edit permissions
    const canEdit =
      goal.userId.toString() === user._id.toString() ||
      goal.collaborators.some(
        c =>
          c.userId.toString() === user._id.toString() && ["editor", "contributor"].includes(c.role)
      );

    if (!canEdit) {
      return NextResponse.json({ error: "Edit permission denied" }, { status: 403 });
    }

    const body = await request.json();
    const allowedUpdates = [
      "title",
      "description",
      "category",
      "priority",
      "status",
      "specific",
      "measurable",
      "achievable",
      "relevant",
      "timeBound",
      "isPublic",
      "tags",
    ];

    const updates = {};
    for (const key of allowedUpdates) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    // Validate dates if provided
    if (updates.timeBound) {
      const startDate = new Date(updates.timeBound.startDate);
      const endDate = new Date(updates.timeBound.endDate);
      if (startDate >= endDate) {
        return NextResponse.json({ error: "End date must be after start date" }, { status: 400 });
      }
      updates.timeBound.startDate = startDate;
      updates.timeBound.endDate = endDate;
    }

    const updatedGoal = await Goal.findByIdAndUpdate(
      params.id,
      { ...updates, lastUpdated: new Date() },
      { new: true, runValidators: true }
    ).populate("collaborators.userId", "name email avatar");

    return NextResponse.json({
      message: "Goal updated successfully",
      goal: updatedGoal,
    });
  } catch (error) {
    console.error("Error updating goal:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Apply rate limiting
    const rateLimitResult = await rateLimit(request, { rpm: 30 });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: rateLimitResult.headers }
      );
    }

    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ error: "Invalid goal ID" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const goal = await Goal.findById(params.id);
    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    // Only owner can delete the goal
    if (goal.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Delete permission denied" }, { status: 403 });
    }

    await Goal.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Goal deleted successfully" });
  } catch (error) {
    console.error("Error deleting goal:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
