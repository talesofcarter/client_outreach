import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("tracker_token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Authenticated User Routing

  if (token && (pathname === "/" || pathname === "/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. Unauthenticated User Routing
  // Define all routes that require a login
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/leads") ||
    pathname.startsWith("/reports");

  // If they have NO token and try to hit a protected route OR the root, send to login.
  if (!token && (isProtectedRoute || pathname === "/")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard/:path*",
    "/analytics/:path*",
    "/leads/:path*",
    "/reports/:path*",
  ],
};
