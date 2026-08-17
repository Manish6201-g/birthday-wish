import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Birthday from "@/models/Birthday";
import { defaultBirthdayData } from "@/lib/defaultBirthdayData";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const cleanSlug = slug.toLowerCase().trim();

    try {
      await dbConnect();
      const birthday = await Birthday.findOne({ slug: cleanSlug });

      if (birthday) {
        return NextResponse.json({ birthday });
      }
    } catch (err) {
      console.warn("DB lookup error, checking default fallback:", err.message);
    }

    // Default fallback for demo slug "paaji"
    if (cleanSlug === "paaji") {
      return NextResponse.json({ birthday: defaultBirthdayData });
    }

    return NextResponse.json({ error: "Birthday not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load birthday page" }, { status: 500 });
  }
}
