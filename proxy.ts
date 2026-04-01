import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  const { pathname } = request.nextUrl;

  console.log(token);

  console.log("--- Proxy Check ---");
  console.log(`Path: ${pathname}`);
  console.log(`Token from cookies.get: ${token}`);
  console.log(`All Cookies: ${request.headers.get("cookie")}`);
  console.log("-------------------");

  const isLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    if (!token && !isLoginPage) {
      console.log("Redirecting to /login: No token found");
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // If there is a token and the user is on the login page, redirect to dashboard
    if (token && isLoginPage) {
      console.log("Redirecting to /: Token found on login page");
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

// Config to exclude static files and API routes from middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/admin/:path*",
  ],
};
