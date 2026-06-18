import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Cookie-existence check only — no JWT verification — to avoid Edge/Node.js
// crypto mismatch. Full session verification still happens in (app)/layout.tsx.
export function middleware(request: NextRequest) {
  const hasSession =
    request.cookies.has("__Secure-authjs.session-token") ||
    request.cookies.has("authjs.session-token") ||
    request.cookies.has("__Secure-next-auth.session-token") ||
    request.cookies.has("next-auth.session-token");

  if (!hasSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/properties/:path*"],
};
