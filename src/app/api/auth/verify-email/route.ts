import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose-simple";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as { email: string };
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOneAndUpdate(
      { email: decoded.email, emailVerified: { $ne: true } },
      {
        $set: {
          emailVerified: true,
          emailVerifiedAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found or already verified" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}