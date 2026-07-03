import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  const url = request.nextUrl.clone();

  // ONLY redirect Vercel or Netlify default domains to the custom domain.
  // Do NOT redirect naked to www (or vice-versa) in middleware to let Netlify handle it.
  if (host && (host.includes("vercel.app") || host.includes("netlify.app"))) {
    url.host = "bihareduconnect.online";
    url.port = ""; // Clear port for safety
    return NextResponse.redirect(url, 301); // 301 Permanent Redirect
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap.xml, robots.txt, ads.txt etc.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.xml|.*\\.txt|.*\\.html|.*\\.svg).*)",
  ],
};
