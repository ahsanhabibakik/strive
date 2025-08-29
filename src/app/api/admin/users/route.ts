import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/lib/models/User";
import { RBAC } from "@/lib/rbac";
import connectToDatabase from "@/lib/mongoose";
import { z } from "zod";

// Validation schemas
const userUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(["user", "moderator", "admin"]).optional(),
  isActive: z.boolean().optional(),
  profile: z
    .object({
      bio: z.string().optional(),
      website: z.string().url().optional(),
      location: z.string().optional(),
      company: z.string().optional(),
    })
    .optional(),
  subscription: z
    .object({
      plan: z.enum(["free", "pro", "enterprise"]).optional(),
      status: z.enum(["active", "inactive", "cancelled"]).optional(),
    })
    .optional(),
});

const bulkActionSchema = z.object({
  action: z.enum(["activate", "deactivate", "delete", "role_update"]),
  userIds: z.array(z.string()),
  data: z
    .object({
      role: z.enum(["user", "moderator", "admin"]).optional(),
    })
    .optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    await connectToDatabase();
    const currentUser = await User.findOne({ email: session.user.email });

    if (!currentUser || !RBAC.hasPermission(currentUser, "admin:users:read")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Filters
    const search = searchParams.get("search");
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const plan = searchParams.get("plan");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    // Build filter query
    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      filter.role = role;
    }

    if (status === "active") {
      filter.isActive = true;
    } else if (status === "inactive") {
      filter.isActive = false;
    }

    if (plan) {
      filter["subscription.plan"] = plan;
    }

    // Get users with pagination
    const users = await User.find(filter)
      .select("-password -passwordResetToken -passwordResetExpires")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments(filter);

    // Get summary statistics
    const stats = await getUserStats();

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
      stats,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    await connectToDatabase();
    const currentUser = await User.findOne({ email: session.user.email });

    if (!currentUser || !RBAC.hasPermission(currentUser, "admin:users:write")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = userUpdateSchema.parse(body);

    // Prevent self-demotion
    if (
      userId === currentUser._id.toString() &&
      validatedData.role &&
      validatedData.role !== currentUser.role
    ) {
      return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...validatedData,
        updatedAt: new Date(),
      },
      { new: true, select: "-password -passwordResetToken -passwordResetExpires" }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    await connectToDatabase();
    const currentUser = await User.findOne({ email: session.user.email });

    if (!currentUser || !RBAC.hasPermission(currentUser, "admin:users:delete")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Prevent self-deletion
    if (userId === currentUser._id.toString()) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // TODO: Clean up user-related data (projects, tasks, etc.)
    // This should be done in a background job for better performance

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    await connectToDatabase();
    const currentUser = await User.findOne({ email: session.user.email });

    if (!currentUser || !RBAC.hasPermission(currentUser, "admin:users:write")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const body = await request.json();

    // Check if this is a bulk action
    if (body.action && body.userIds) {
      return await handleBulkAction(body, currentUser);
    }

    // Handle single user creation (if needed)
    return NextResponse.json(
      { error: "Single user creation not implemented via admin API" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function handleBulkAction(body: any, currentUser: any) {
  try {
    const validatedData = bulkActionSchema.parse(body);
    const { action, userIds, data } = validatedData;

    // Prevent self-targeting in bulk actions
    const filteredUserIds = userIds.filter(id => id !== currentUser._id.toString());

    if (filteredUserIds.length === 0) {
      return NextResponse.json(
        { error: "No valid users selected for bulk action" },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case "activate":
        result = await User.updateMany(
          { _id: { $in: filteredUserIds } },
          { isActive: true, updatedAt: new Date() }
        );
        break;

      case "deactivate":
        result = await User.updateMany(
          { _id: { $in: filteredUserIds } },
          { isActive: false, updatedAt: new Date() }
        );
        break;

      case "role_update":
        if (!data?.role) {
          return NextResponse.json(
            { error: "Role is required for role update action" },
            { status: 400 }
          );
        }
        result = await User.updateMany(
          { _id: { $in: filteredUserIds } },
          { role: data.role, updatedAt: new Date() }
        );
        break;

      case "delete":
        result = await User.deleteMany({ _id: { $in: filteredUserIds } });
        // TODO: Clean up user-related data in background job
        break;

      default:
        return NextResponse.json({ error: "Invalid bulk action" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      action,
      affected: result.modifiedCount || result.deletedCount,
      total: filteredUserIds.length,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid bulk action data", details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function getUserStats() {
  const stats = await User.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        active: {
          $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
        },
        inactive: {
          $sum: { $cond: [{ $eq: ["$isActive", false] }, 1, 0] },
        },
        admins: {
          $sum: { $cond: [{ $eq: ["$role", "admin"] }, 1, 0] },
        },
        moderators: {
          $sum: { $cond: [{ $eq: ["$role", "moderator"] }, 1, 0] },
        },
        regularUsers: {
          $sum: { $cond: [{ $eq: ["$role", "user"] }, 1, 0] },
        },
        freePlan: {
          $sum: { $cond: [{ $eq: ["$subscription.plan", "free"] }, 1, 0] },
        },
        proPlan: {
          $sum: { $cond: [{ $eq: ["$subscription.plan", "pro"] }, 1, 0] },
        },
        enterprisePlan: {
          $sum: { $cond: [{ $eq: ["$subscription.plan", "enterprise"] }, 1, 0] },
        },
        newThisMonth: {
          $sum: {
            $cond: [
              {
                $gte: ["$createdAt", new Date(new Date().getFullYear(), new Date().getMonth(), 1)],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  return (
    stats[0] || {
      total: 0,
      active: 0,
      inactive: 0,
      admins: 0,
      moderators: 0,
      regularUsers: 0,
      freePlan: 0,
      proPlan: 0,
      enterprisePlan: 0,
      newThisMonth: 0,
    }
  );
}
