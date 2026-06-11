import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth is handled by (app)/layout.tsx — no middleware wrapper needed.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/properties/:path*"],
};
