import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Birthday from "@/models/Birthday";
import { getAuthUser } from "@/lib/auth";

export async function DELETE(request, { params }) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, replyId } = await params;

    await dbConnect();
    const birthday = await Birthday.findById(id);

    if (!birthday) {
      return NextResponse.json({ error: "Birthday not found" }, { status: 404 });
    }

    if (birthday.createdBy?.toString() !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized to delete replies for this birthday" }, { status: 403 });
    }

    birthday.replies = (birthday.replies || []).filter((r) => r._id?.toString() !== replyId);
    await birthday.save();

    return NextResponse.json({ success: true, message: "Reply deleted successfully" });
  } catch (error) {
    console.error("Delete reply error:", error);
    return NextResponse.json({ error: "Failed to delete reply" }, { status: 500 });
  }
}
