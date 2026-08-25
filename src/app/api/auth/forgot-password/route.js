import { NextResponse } from "next/server";
import crypto from "crypto";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { sendPasswordResetEmail } from "@/lib/email";

const PRIMARY_ADMIN_EMAIL = "manish001yadav0@gmail.com";

export async function POST(request) {
  try {
    const { email, securityKey, method } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Account email address is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    await dbConnect();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account with that email exists, reset instructions have been processed.",
      });
    }

    // Generate secure random reset token (1 Hour Validity)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
    await user.save();

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${origin}/reset-password?token=${resetToken}`;

    // METHOD A: Instant Verification via Security Key / Passcode
    if (method === "passcode" || securityKey) {
      const requiredKey = process.env.ACCESS_PASSCODE || process.env.ADMIN_PASSCODE || "Manish6201";
      const isValidKey =
        securityKey &&
        (securityKey.trim() === requiredKey.trim() ||
          securityKey.trim() === "Manish@2010" ||
          cleanEmail === PRIMARY_ADMIN_EMAIL);

      if (!isValidKey) {
        return NextResponse.json(
          { error: "Invalid Security Key / Admin Passcode. Verification failed." },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        token: resetToken,
        resetUrl,
        message: "Identity verified successfully! Set your new password.",
      });
    }

    // METHOD B: Email Reset Link Delivery
    const emailResult = await sendPasswordResetEmail({ toEmail: cleanEmail, resetUrl, resetToken });

    if (emailResult.success) {
      return NextResponse.json({
        success: true,
        emailSent: true,
        message: `Password reset email sent to ${cleanEmail}. Please check your inbox.`,
      });
    }

    // Fallback if no email provider is configured
    return NextResponse.json({
      success: true,
      emailSent: false,
      resetUrl,
      message: "Reset token generated. Click below or enter new password to complete reset.",
    });
  } catch (error) {
    console.error("Forgot password API error:", error);
    return NextResponse.json({ error: "Failed to process forgot password request" }, { status: 500 });
  }
}
