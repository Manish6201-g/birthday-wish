import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Birthday from "@/models/Birthday";

export async function POST(request, { params }) {
  try {
    const { slug } = await params;
    const cleanSlug = slug.toLowerCase().trim();

    const data = await request.json();
    const { senderName, reaction, message } = data;

    if (!reaction && (!message || !message.trim())) {
      return NextResponse.json(
        { error: "Please select an emoji reaction or write a message." },
        { status: 400 }
      );
    }

    await dbConnect();
    const birthday = await Birthday.findOne({ slug: cleanSlug });

    if (!birthday) {
      return NextResponse.json({ error: "Birthday website not found" }, { status: 404 });
    }

    const newReply = {
      senderName: senderName?.trim() || birthday.name || "Birthday Guest",
      reaction: reaction || "❤️",
      message: message?.trim() || "",
      createdAt: new Date(),
    };

    birthday.replies = birthday.replies || [];
    birthday.replies.push(newReply);
    await birthday.save();

    return NextResponse.json({
      success: true,
      message: "Thank you for leaving your reaction & message! 💕",
      reply: newReply,
    });
  } catch (error) {
    console.error("Submit reply error:", error);
    return NextResponse.json(
      { error: "Failed to submit reply. Please try again." },
      { status: 500 }
    );
  }
}
