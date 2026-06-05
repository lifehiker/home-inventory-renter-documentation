import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth is handled at the page level (Node.js runtime) to avoid Edge/JWT
// verification mismatch when the full auth.ts config (bcrypt, Credentials
// provider) is evaluated in Edge.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/properties/:path*"],
};
