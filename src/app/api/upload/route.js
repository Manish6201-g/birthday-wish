import { NextResponse } from "next/server";
import { uploadMediaToCloudinary } from "@/lib/cloudinary";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const fileType = formData.get("type") || "auto"; // 'image', 'video' (audio), 'auto'

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Size limit check (20MB max for audio/media)
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 20MB limit" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const folder = fileType === "audio" || file.type.startsWith("audio/") ? "birthday_music" : "birthday_photos";
    const resourceType = fileType === "audio" || file.type.startsWith("audio/") ? "auto" : "image";

    const mediaUrl = await uploadMediaToCloudinary(buffer, folder, resourceType);

    return NextResponse.json({ url: mediaUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
