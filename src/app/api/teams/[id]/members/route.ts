import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { Team } from "@/lib/models/Team";
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
      .populate("ownerId", "name email avatar createdAt")
      .populate("members.userId", "name email avatar createdAt")
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

    // Format members list
    const members = [
      {
        ...team.ownerId,
        role: "owner",
        joinedAt: team.createdAt,
        isOwner: true,
      },
      ...team.members.map(member => ({
        ...member.userId,
        role: member.role,
        joinedAt: member.joinedAt,
        isOwner: false,
      })),
    ];

    return NextResponse.json({ members });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    const body = await request.json();
    const { email, role = "member" } = body;

    // Check permissions for inviting members
    const isOwner = team.ownerId.toString() === user._id.toString();
    const isAdmin = team.members.some(
      m => m.userId.toString() === user._id.toString() && m.role === "admin"
    );
    const canInvite =
      team.settings.allowMemberInvites &&
      team.members.some(m => m.userId.toString() === user._id.toString());

    if (!isOwner && !isAdmin && !canInvite) {
      return NextResponse.json({ error: "Permission denied to invite members" }, { status: 403 });
    }

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!["member", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Find user to invite
    const memberUser = await User.findOne({ email });
    if (!memberUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is already a member
    const isExistingMember = team.members.some(
      m => m.userId.toString() === memberUser._id.toString()
    );

    if (isExistingMember || team.ownerId.toString() === memberUser._id.toString()) {
      return NextResponse.json({ error: "User is already a team member" }, { status: 400 });
    }

    // Add member
    team.members.push({
      userId: memberUser._id,
      role: role,
      joinedAt: new Date(),
    });

    await team.save();

    // Populate the response
    const updatedTeam = await Team.findById(params.id)
      .populate("members.userId", "name email avatar")
      .lean();

    const newMember = updatedTeam.members.find(
      m => m.userId._id.toString() === memberUser._id.toString()
    );

    return NextResponse.json({
      message: "Member added successfully",
      member: {
        ...newMember.userId,
        role: newMember.role,
        joinedAt: newMember.joinedAt,
        isOwner: false,
      },
    });
  } catch (error) {
    console.error("Error adding team member:", error);
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

    // Only owner and admins can update member roles
    const isOwner = team.ownerId.toString() === user._id.toString();
    const isAdmin = team.members.some(
      m => m.userId.toString() === user._id.toString() && m.role === "admin"
    );

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Permission denied to update member roles" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { memberId, role } = body;

    if (!memberId || !role) {
      return NextResponse.json({ error: "Member ID and role are required" }, { status: 400 });
    }

    if (!["member", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Find and update member
    const memberIndex = team.members.findIndex(m => m.userId.toString() === memberId);

    if (memberIndex === -1) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    team.members[memberIndex].role = role;
    await team.save();

    // Populate the response
    const updatedTeam = await Team.findById(params.id)
      .populate("members.userId", "name email avatar")
      .lean();

    const updatedMember = updatedTeam.members[memberIndex];

    return NextResponse.json({
      message: "Member role updated successfully",
      member: {
        ...updatedMember.userId,
        role: updatedMember.role,
        joinedAt: updatedMember.joinedAt,
        isOwner: false,
      },
    });
  } catch (error) {
    console.error("Error updating team member:", error);
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

    const url = new URL(request.url);
    const memberId = url.searchParams.get("memberId");

    if (!memberId) {
      return NextResponse.json({ error: "Member ID is required" }, { status: 400 });
    }

    // Check permissions - owner/admin can remove any member, member can remove themselves
    const isOwner = team.ownerId.toString() === user._id.toString();
    const isAdmin = team.members.some(
      m => m.userId.toString() === user._id.toString() && m.role === "admin"
    );
    const isSelfRemoval = memberId === user._id.toString();

    if (!isOwner && !isAdmin && !isSelfRemoval) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    // Cannot remove owner
    if (memberId === team.ownerId.toString()) {
      return NextResponse.json({ error: "Cannot remove team owner" }, { status: 400 });
    }

    // Find member
    const memberIndex = team.members.findIndex(m => m.userId.toString() === memberId);

    if (memberIndex === -1) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Remove member
    team.members.splice(memberIndex, 1);
    await team.save();

    return NextResponse.json({
      message: isSelfRemoval ? "Left team successfully" : "Member removed successfully",
    });
  } catch (error) {
    console.error("Error removing team member:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
