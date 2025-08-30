import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose-simple";
import User from "@/lib/models/User";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

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

    // Generate secret for 2FA
    const secret = speakeasy.generateSecret({
      name: `Strive (${user.email})`,
      issuer: "Strive",
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    // Store temporary secret (not enabled yet)
    await User.findByIdAndUpdate(user._id, {
      $set: {
        twoFactorSecret: secret.base32,
        twoFactorEnabled: false,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      secret: secret.base32,
      qrCode: qrCodeUrl,
      manualEntryKey: secret.base32,
    });
  } catch (error) {
    console.error("Error setting up 2FA:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}