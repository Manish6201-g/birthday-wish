import { NextResponse } from "next/server";

const COOKIE_NAME = "birthday_token";

export async function POST() {
  try {
    const response = NextResponse.json({ message: "Logged out successfully" });

    // Delete cookie directly on the response object for reliability in Next.js 16
    response.cookies.set(COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 });
  }
}
