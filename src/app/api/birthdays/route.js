import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Birthday from "@/models/Birthday";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";

const PRIMARY_ADMIN_EMAIL = "manish001yadav0@gmail.com";

export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ birthdays: [] });
    }

    const birthdays = await Birthday.find({ createdBy: user.id }).sort({ createdAt: -1 });
    return NextResponse.json({ birthdays });
  } catch (error) {
    console.error("Fetch birthdays error:", error);
    return NextResponse.json({ error: "Failed to fetch birthdays" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please log in to create a birthday website." }, { status: 401 });
    }

    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ error: "Database connection unavailable" }, { status: 500 });
    }

    // Verify creator authorization in database
    const dbUser = await User.findById(user.id);
    if (!dbUser) {
      return NextResponse.json({ error: "User account not found" }, { status: 404 });
    }

    const allowedEmailsEnv = process.env.ALLOWED_EMAILS || process.env.ADMIN_EMAIL || PRIMARY_ADMIN_EMAIL;
    const allowedList = allowedEmailsEnv.split(",").map((e) => e.trim().toLowerCase());
    const isOwnerOrAllowed = allowedList.includes(dbUser.email.toLowerCase());

    if (!isOwnerOrAllowed && !dbUser.canCreate && dbUser.role !== "admin") {
      return NextResponse.json(
        { error: "Access Denied: You do not have permission to create birthday websites. Creation is restricted to the administrator (Manish)." },
        { status: 403 }
      );
    }

    const data = await request.json();

    if (!data.name || !data.birthdayDate || !data.slug) {
      return NextResponse.json(
        { error: "Name, birthday date, and URL slug are required" },
        { status: 400 }
      );
    }

    // Clean and validate slug
    const cleanSlug = data.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");
    if (!cleanSlug) {
      return NextResponse.json({ error: "Invalid URL slug" }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await Birthday.findOne({ slug: cleanSlug });
    if (existing) {
      return NextResponse.json(
        { error: `The URL slug "/b/${cleanSlug}" is already taken. Please choose another.` },
        { status: 400 }
      );
    }

    const birthday = await Birthday.create({
      ...data,
      slug: cleanSlug,
      createdBy: dbUser._id,
    });

    return NextResponse.json({ birthday, message: "Birthday created successfully" });
  } catch (error) {
    console.error("Create birthday error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create birthday website" },
      { status: 500 }
    );
  }
}
