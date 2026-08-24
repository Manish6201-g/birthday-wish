import { NextResponse } from "next/server";
import crypto from "crypto";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

const PRIMARY_ADMIN_EMAIL = "manish001yadav0@gmail.com";

export async function POST(request) {
  try {
    const { email, adminPasscode } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    await dbConnect();
    const user = await User.findOne({ email: cleanEmail });

    // Neutral response for security if user does not exist
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account with that email exists, password reset instructions have been generated.",
      });
    }

    // Check if valid Admin Passcode was provided for emergency manual reset
    const requiredPasscode = process.env.ACCESS_PASSCODE || process.env.ADMIN_PASSCODE;
    const isValidAdminPasscode =
      adminPasscode &&
      requiredPasscode &&
      adminPasscode.trim() === requiredPasscode.trim();

    // Generate secure random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 Hour Expiration
    await user.save();

    // SECURITY: Only return resetUrl if valid Admin Passcode was supplied by owner!
    if (isValidAdminPasscode) {
      const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const resetUrl = `${origin}/reset-password?token=${resetToken}`;
      return NextResponse.json({
        success: true,
        resetUrl,
        message: "Admin Security Reset link generated successfully.",
      });
    }

    // Standard response: Do NOT leak token or resetUrl to the browser
    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, password reset instructions have been generated. Contact your site administrator for access if needed.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Failed to process forgot password request" }, { status: 500 });
  }
}
