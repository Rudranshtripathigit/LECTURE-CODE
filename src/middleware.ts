import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ----------------------------------------------------------------------
// Route protection: /dashboard and /workspace require an authenticated
// session. All other routes (landing page, auth pages, API routes)
// pass through untouched — API-level rate limiting is handled
// separately inside each /api/ai/* route handler via src/lib/redis.ts.
// ----------------------------------------------------------------------
export default withAuth(
  function middleware(req: NextRequest) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/workspace/:path*"],
};
