import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { Team } from "@/lib/models/Team";
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
      return NextResponse.json({ error: "Invalid team ID" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const team = await Team.findById(params.id)
      .populate("ownerId", "name email avatar")
      .populate("members.userId", "name email avatar")
      .lean();

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Check access permissions
    const isOwner = team.ownerId._id.toString() === user._id.toString();
    const isMember = team.members.some(m => m.userId._id.toString() === user._id.toString());

    if (!isOwner && !isMember && !team.isPublic) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get team goals
    const teamGoals = await Goal.find({ teamId: team._id })
      .populate("userId", "name email avatar")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Get team statistics
    const totalGoals = await Goal.countDocuments({ teamId: team._id });
    const activeGoals = await Goal.countDocuments({ teamId: team._id, status: "active" });
    const completedGoals = await Goal.countDocuments({ teamId: team._id, status: "completed" });

    const teamStats = {
      totalMembers: team.members.length + 1, // +1 for owner
      totalGoals,
      activeGoals,
      completedGoals,
      completionRate: totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0,
    };

    return NextResponse.json({
      team: {
        ...team,
        stats: teamStats,
        recentGoals: teamGoals,
        userRole: isOwner
          ? "owner"
          : isMember
            ? team.members.find(m => m.userId._id.toString() === user._id.toString())?.role
            : "viewer",
      },
    });
  } catch (error) {
    console.error("Error fetching team:", error);
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
      return NextResponse.json({ error: "Invalid team ID" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const team = await Team.findById(params.id);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Check permissions - only owner or admin members can update team
    const isOwner = team.ownerId.toString() === user._id.toString();
    const isAdmin = team.members.some(
      m => m.userId.toString() === user._id.toString() && m.role === "admin"
    );

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    const body = await request.json();
    const allowedUpdates = ["name", "description", "isPublic", "settings"];

    const updates = {};
    for (const key of allowedUpdates) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    // Validate name uniqueness if updating name
    if (updates.name && updates.name !== team.name) {
      const existingTeam = await Team.findOne({
        name: updates.name,
        ownerId: team.ownerId,
        _id: { $ne: team._id },
      });

      if (existingTeam) {
        return NextResponse.json(
          { error: "A team with this name already exists" },
          { status: 400 }
        );
      }
    }

    const updatedTeam = await Team.findByIdAndUpdate(params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate("ownerId", "name email avatar")
      .populate("members.userId", "name email avatar");

    return NextResponse.json({
      message: "Team updated successfully",
      team: updatedTeam,
    });
  } catch (error) {
    console.error("Error updating team:", error);
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
      return NextResponse.json({ error: "Invalid team ID" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const team = await Team.findById(params.id);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Only owner can delete team
    if (team.ownerId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Only team owner can delete team" }, { status: 403 });
    }

    // Check if team has active goals
    const activeGoalsCount = await Goal.countDocuments({
      teamId: team._id,
      status: { $in: ["active", "draft"] },
    });

    if (activeGoalsCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete team with ${activeGoalsCount} active goals. Please complete or remove all active goals first.`,
        },
        { status: 400 }
      );
    }

    // Remove team reference from completed goals
    await Goal.updateMany({ teamId: team._id }, { $unset: { teamId: 1 } });

    await Team.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
