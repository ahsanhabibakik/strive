import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose-simple";
import mongoose from "mongoose";

// Import the notification model (same as in route.ts)
const NotificationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["info", "success", "warning", "error"], 
    default: "info" 
  },
  read: { type: Boolean, default: false },
  actionUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  readAt: { type: Date },
});

const Notification = 
  mongoose.models.Notification || 
  mongoose.model("Notification", NotificationSchema);

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const result = await Notification.updateMany(
      { 
        userId: session.user.email,
        read: false 
      },
      {
        $set: {
          read: true,
          readAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: `Marked ${result.modifiedCount} notifications as read`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}