import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

const PRIMARY_ADMIN_EMAIL = "manish001yadav0@gmail.com";

export async function GET(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    await dbConnect();
    const dbUser = await User.findById(authUser.id).select("-password");

    if (!dbUser) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const allowedEmailsEnv = process.env.ALLOWED_EMAILS || process.env.ADMIN_EMAIL || PRIMARY_ADMIN_EMAIL;
    const allowedList = allowedEmailsEnv.split(",").map((e) => e.trim().toLowerCase());
    const isOwner = allowedList.includes(dbUser.email.toLowerCase());

    const userPayload = {
      id: dbUser._id,
      name: dbUser.name,
      email: dbUser.email,
      role: isOwner ? "admin" : (dbUser.role || "user"),
      canCreate: isOwner || (dbUser.canCreate ?? false),
    };

    return NextResponse.json({ authenticated: true, user: userPayload });
  } catch (error) {
    return NextResponse.json({ authenticated: false, user: null });
  }
}
