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

    let dbUser = null;
    try {
      await dbConnect();
      if (authUser.id) {
        dbUser = await User.findById(authUser.id).select("-password").lean();
      }
      if (!dbUser && authUser.email) {
        dbUser = await User.findOne({ email: authUser.email.toLowerCase() }).select("-password").lean();
      }
    } catch (dbErr) {
      console.error("MongoDB check in /api/auth/me error (using JWT fallback):", dbErr);
    }

    const email = (dbUser?.email || authUser.email || "").toLowerCase().trim();
    const allowedEmailsEnv = process.env.ALLOWED_EMAILS || process.env.ADMIN_EMAIL || PRIMARY_ADMIN_EMAIL;
    const allowedList = allowedEmailsEnv.split(",").map((e) => e.trim().toLowerCase());
    const isOwner = email === PRIMARY_ADMIN_EMAIL.toLowerCase() || allowedList.includes(email);

    const userPayload = {
      id: dbUser?._id || authUser.id,
      name: dbUser?.name || authUser.name || "User",
      email: email,
      role: isOwner ? "admin" : (dbUser?.role || authUser.role || "user"),
      canCreate: isOwner || (dbUser?.canCreate ?? (authUser.canCreate ?? false)),
    };

    return NextResponse.json({ authenticated: true, user: userPayload });
  } catch (error) {
    console.error("Auth me endpoint error:", error);
    return NextResponse.json({ authenticated: false, user: null });
  }
}
