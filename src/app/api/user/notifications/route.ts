import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose-simple";
import User from "@/lib/models/User";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email })
      .select("notificationSettings")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Default notification settings if not set
    const defaultSettings = {
      email: {
        opportunities: true,
        applications: true,
        reminders: true,
        newsletter: true,
      },
      push: {
        opportunities: true,
        applications: true,
        reminders: false,
        newsletter: false,
      },
      frequency: "immediate", // immediate, daily, weekly
    };

    return NextResponse.json({
      notificationSettings: user.notificationSettings || defaultSettings,
    });
  } catch (error) {
    console.error("Error fetching notification settings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { notificationSettings } = body;

    if (!notificationSettings) {
      return NextResponse.json({ error: "Notification settings are required" }, { status: 400 });
    }

    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          notificationSettings,
          updatedAt: new Date(),
        },
      },
      { new: true, select: "notificationSettings" }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Notification settings updated successfully",
      notificationSettings: updatedUser.notificationSettings,
    });
  } catch (error) {
    console.error("Error updating notification settings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
