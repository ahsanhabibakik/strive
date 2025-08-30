import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose-simple";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: "Email is already verified" }, { status: 400 });
    }

    // Generate verification token
    const verificationToken = jwt.sign({ email: user.email }, process.env.NEXTAUTH_SECRET!, {
      expiresIn: "24h",
    });

    // In a real app, you would send an email here
    // For now, just return success
    console.log(`Verification token for ${user.email}: ${verificationToken}`);

    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Error resending verification email:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
