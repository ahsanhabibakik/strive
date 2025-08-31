import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Goal } from "@/lib/models/Goal";
import { User } from "@/lib/models/User";
import { connectToDatabase } from "@/lib/database";
import { rateLimit } from "@/lib/utils/rate-limit";
import { isValidObjectId } from "mongoose";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const goal = await Goal.findById(params.id);
    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    // Check update permissions
    const canUpdate =
      goal.userId.toString() === user._id.toString() ||
      goal.collaborators.some(
        c =>
          c.userId.toString() === user._id.toString() && ["editor", "contributor"].includes(c.role)
      );

    if (!canUpdate) {
      return NextResponse.json({ error: "Update permission denied" }, { status: 403 });
    }

    const body = await request.json();
    const { currentValue, notes } = body;

    if (typeof currentValue !== "number" || currentValue < 0) {
      return NextResponse.json(
        { error: "Current value must be a non-negative number" },
        { status: 400 }
      );
    }

    // Update progress
    const updates = {
      "measurable.currentValue": Math.min(currentValue, goal.measurable.targetValue),
      lastUpdated: new Date(),
    };

    // Auto-complete goal if target reached
    if (currentValue >= goal.measurable.targetValue && goal.status === "active") {
      updates.status = "completed";
    }

    const updatedGoal = await Goal.findByIdAndUpdate(params.id, updates, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({
      message: "Progress updated successfully",
      goal: updatedGoal,
      progressPercentage: updatedGoal.progressPercentage,
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
