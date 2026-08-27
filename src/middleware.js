import { NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/create", "/dashboard"];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute) {
    const token = request.cookies.get("birthday_token")?.value;

    // Server-side redirect if not logged in
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/create", "/create/:path*", "/dashboard", "/dashboard/:path*"],
};
