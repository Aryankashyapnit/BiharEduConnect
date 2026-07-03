import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  const { pathname } = request.nextUrl;

  // Exempt Google verification files from redirect to allow Search Console verification
  if (pathname.startsWith("/google") && pathname.endsWith(".html")) {
    return NextResponse.next();
  }

  if (host && (host.includes("vercel.app") || host.includes("netlify.app"))) {
    const url = request.nextUrl.clone();
    url.host = "bihareduconnect.online";
    url.port = ""; // Clear port for safety
    return NextResponse.redirect(url, 301); // 301 Permanent Redirect
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
