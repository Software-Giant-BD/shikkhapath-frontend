import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = 
    pathname === "/admin/login" || 
    pathname === "/admin/forgot-password" || 
    pathname.startsWith("/admin/reset-password");

  if (isAdminRoute) {
    // If accessing a protected admin route without a token, redirect to login
    if (!token && !isAuthRoute) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // If accessing login page with a token, redirect to dashboard
    if (token && pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
