import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Birthday from "@/models/Birthday";
import { getAuthUser } from "@/lib/auth";
import { deleteCloudinaryImage } from "@/lib/cloudinary";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const birthday = await Birthday.findById(id);

    if (!birthday) {
      return NextResponse.json({ error: "Birthday not found" }, { status: 404 });
    }

    if (birthday.createdBy && birthday.createdBy.toString() !== user.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this birthday" }, { status: 403 });
    }

    return NextResponse.json({ birthday });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch birthday" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    await dbConnect();

    const existing = await Birthday.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Birthday not found" }, { status: 404 });
    }

    if (existing.createdBy && existing.createdBy.toString() !== user.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this birthday" }, { status: 403 });
    }

    // Check slug uniqueness if slug changed
    if (data.slug && data.slug.toLowerCase() !== existing.slug) {
      const cleanSlug = data.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");
      const slugConflict = await Birthday.findOne({ slug: cleanSlug, _id: { $ne: id } });
      if (slugConflict) {
        return NextResponse.json(
          { error: `The URL slug "/b/${cleanSlug}" is already taken.` },
          { status: 400 }
        );
      }
      data.slug = cleanSlug;
    }

    const updated = await Birthday.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    return NextResponse.json({ birthday: updated, message: "Birthday updated successfully" });
  } catch (error) {
    console.error("Update birthday error:", error);
    return NextResponse.json({ error: error.message || "Failed to update birthday" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const existing = await Birthday.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Birthday not found" }, { status: 404 });
    }

    if (existing.createdBy && existing.createdBy.toString() !== user.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this birthday" }, { status: 403 });
    }

    // Clean up photos from Cloudinary if applicable
    if (existing.photos && Array.isArray(existing.photos)) {
      for (const photo of existing.photos) {
        if (photo.url && photo.url.includes("cloudinary.com")) {
          await deleteCloudinaryImage(photo.url);
        }
      }
    }

    await Birthday.findByIdAndDelete(id);
    return NextResponse.json({ message: "Birthday deleted successfully" });
  } catch (error) {
    console.error("Delete birthday error:", error);
    return NextResponse.json({ error: "Failed to delete birthday" }, { status: 500 });
  }
}
