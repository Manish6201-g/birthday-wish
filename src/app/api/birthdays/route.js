import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Birthday from "@/models/Birthday";
import { getAuthUser } from "@/lib/auth";

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

    // Check Allowed Emails Whitelist if set
    const allowedEmailsEnv = process.env.ALLOWED_EMAILS || process.env.ADMIN_EMAIL;
    if (allowedEmailsEnv && user.email) {
      const allowedList = allowedEmailsEnv.split(",").map((e) => e.trim().toLowerCase());
      if (!allowedList.includes(user.email.toLowerCase())) {
        return NextResponse.json(
          { error: "Forbidden: Your account does not have creation permissions. Access is restricted to authorized creators." },
          { status: 403 }
        );
      }
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

    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ error: "Database connection unavailable" }, { status: 500 });
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
      createdBy: user.id,
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
