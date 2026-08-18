import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";

export async function POST(request) {
  try {
    const { name, email, password, inviteCode } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check Allowed Emails Whitelist if set
    const allowedEmailsEnv = process.env.ALLOWED_EMAILS || process.env.ADMIN_EMAIL;
    if (allowedEmailsEnv) {
      const allowedList = allowedEmailsEnv.split(",").map((e) => e.trim().toLowerCase());
      if (!allowedList.includes(cleanEmail)) {
        return NextResponse.json(
          { error: "Access Restricted: Your email is not authorized to create birthday websites. Please contact the owner for access." },
          { status: 403 }
        );
      }
    }

    // Check Access Passcode if set
    const accessPasscodeEnv = process.env.ACCESS_PASSCODE || process.env.INVITE_CODE;
    if (accessPasscodeEnv) {
      if (!inviteCode || inviteCode.trim() !== accessPasscodeEnv.trim()) {
        return NextResponse.json(
          { error: "Invalid Access Passcode / Invite Code. Registration is restricted to authorized users." },
          { status: 403 }
        );
      }
    }

    await dbConnect();

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email: cleanEmail,
      password: hashedPassword,
      role: allowedEmailsEnv && allowedEmailsEnv.includes(cleanEmail) ? "admin" : "creator",
      canCreate: true,
    });

    const token = signToken({ id: user._id, email: user.email, name: user.name, role: user.role });
    await setAuthCookie(token);

    return NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
