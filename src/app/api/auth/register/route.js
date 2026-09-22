import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";

const PRIMARY_ADMIN_EMAIL = "manish001yadav0@gmail.com";

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

    // Check if user is Primary Admin or in ALLOWED_EMAILS
    const allowedEmailsEnv = process.env.ALLOWED_EMAILS || process.env.ADMIN_EMAIL || PRIMARY_ADMIN_EMAIL;
    const allowedList = allowedEmailsEnv.split(",").map((e) => e.trim().toLowerCase());
    const isOwnerOrAllowed = allowedList.includes(cleanEmail);

    // Check Access Passcode if provided
    const requiredPasscode = process.env.ACCESS_PASSCODE || process.env.ADMIN_PASSCODE;
    const hasValidPasscode = requiredPasscode && inviteCode && inviteCode.trim() === requiredPasscode.trim();

    // If restricted mode is enabled (or non-admin), require passcode or whitelist
    if (process.env.RESTRICT_REGISTRATION === "true" && !isOwnerOrAllowed && !hasValidPasscode) {
      return NextResponse.json(
        { error: "Access Restricted: Registration requires a valid Admin Passcode or authorized email." },
        { status: 403 }
      );
    }

    try {
      await dbConnect();
    } catch (dbErr) {
      return NextResponse.json(
        { error: "Database connection failed. Please check MongoDB Atlas IP Whitelist (0.0.0.0/0)." },
        { status: 503 }
      );
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Only Admin or valid Passcode holders get creation rights (canCreate: true)
    const isAdmin = isOwnerOrAllowed;
    const canCreate = isAdmin || hasValidPasscode;

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email: cleanEmail,
      password: hashedPassword,
      role: isAdmin ? "admin" : "creator",
      canCreate: canCreate,
    });

    const token = signToken({ id: user._id, email: user.email, name: user.name, role: user.role, canCreate: user.canCreate });
    await setAuthCookie(token);

    return NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, canCreate: user.canCreate },
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register user" },
      { status: 500 }
    );
  }
}
