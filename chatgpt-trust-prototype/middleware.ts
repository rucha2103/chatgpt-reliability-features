import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Only used when API and frontend are on different Netlify sites.
 * On the API site, set FRONTEND_ORIGIN=https://your-frontend.netlify.app
 */
export function middleware(request: NextRequest) {
  const origin = process.env.FRONTEND_ORIGIN?.trim();
  if (!origin || !request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const corsHeaders = {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  }

  const response = NextResponse.next();
  for (const [key, value] of Object.entries(corsHeaders)) {
    response.headers.set(key, value);
  }
  return response;
}

export const config = {
  matcher: "/api/:path*",
};
