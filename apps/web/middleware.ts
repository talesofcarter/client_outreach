import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("tracker_token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Handle the Root URL (/)
  if (pathname === "/") {
    return token
      ? NextResponse.redirect(new URL("/", request.url)) // Logged in? Go to dashboard.
      : NextResponse.redirect(new URL("/login", request.url)); // Logged out? Go to login.
  }

  // 2. Protect the Dashboard Routes
  // If they try to access /leads or /analytics without a token, kick them to login
  const isProtectedRoute =
    pathname.startsWith("/analytics") || pathname.startsWith("/leads");
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Prevent Logged-In Users from seeing the Login Page
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/analytics", request.url));
  }

  // Allow the request to proceed normally if none of the above conditions are met
  return NextResponse.next();
}

// Optimize the middleware so it only runs on these specific paths
export const config = {
  matcher: ["/", "/login", "/analytics/:path*", "/leads/:path*"],
};
