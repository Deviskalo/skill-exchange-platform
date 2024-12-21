import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the user's authentication status from the session
  const session = request.cookies.get("session");

  // List of paths that require authentication
  const protectedPaths = ["/teach"];

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // If it's a protected path and user is not authenticated
  if (isProtectedPath && !session) {
    // Redirect to login page with return URL
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
