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

interface RouteContext {
  params: { id: string };
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { read } = body;

    await connectToDatabase();

    const notification = await Notification.findOneAndUpdate(
      { 
        _id: params.id, 
        userId: session.user.email 
      },
      {
        $set: {
          read: read !== undefined ? read : true,
          readAt: read !== false ? new Date() : null,
        },
      },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const notification = await Notification.findOneAndDelete({
      _id: params.id,
      userId: session.user.email,
    });

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}