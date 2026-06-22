import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Grab the JWT token from the browser cookies
  const token = request.cookies.get("tracker_token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Prevent Logged-In Users from seeing the Login Page
  if (pathname === "/login" && token) {
    // Bounce them right back to the main dashboard
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Protect the Main Dashboard and Sub-routes
  // If they try to access /, /analytics, or /leads without a token, kick them to login
  const isProtectedRoute =
    pathname === "/" ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/leads");

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow the request to proceed normally if conditions are met
  return NextResponse.next();
}

// Optimize the middleware so it only runs on these specific paths
export const config = {
  matcher: ["/", "/login", "/analytics/:path*", "/leads/:path*"],
};
