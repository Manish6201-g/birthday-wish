import { NextResponse } from "next/server";
import crypto from "crypto";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";

export async function POST(request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Reset token and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Hash token to compare with database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    await dbConnect();
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired password reset token. Please request a new link." },
        { status: 400 }
      );
    }

    // Update password and clear reset token
    user.password = await hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Auto-login user after reset
    const jwtToken = signToken({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      canCreate: user.canCreate,
    });
    await setAuthCookie(jwtToken);

    return NextResponse.json({
      success: true,
      message: "Your password has been reset successfully! You are now logged in.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
