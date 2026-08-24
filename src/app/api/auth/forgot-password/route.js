import { NextResponse } from "next/server";
import crypto from "crypto";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    await dbConnect();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      // Return neutral message for security
      return NextResponse.json({
        message: "If an account with that email exists, password reset instructions have been generated.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token to store in database
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Token valid for 1 hour
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
    await user.save();

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${origin}/reset-password?token=${resetToken}`;

    return NextResponse.json({
      success: true,
      resetUrl,
      message: "Password reset link generated successfully.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Failed to process forgot password request" }, { status: 500 });
  }
}
