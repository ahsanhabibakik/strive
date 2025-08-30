import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose-simple";
import User from "@/lib/models/User";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { avatarUrl } = body;

    if (!avatarUrl) {
      return NextResponse.json({ error: "Avatar URL is required" }, { status: 400 });
    }

    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          image: avatarUrl,
          updatedAt: new Date(),
        },
      },
      { new: true, select: "-password -__v" }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Avatar updated successfully",
      avatarUrl: updatedUser.image 
    });
  } catch (error) {
    console.error("Error updating avatar:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}