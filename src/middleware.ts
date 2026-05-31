import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth(function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const protectedRoutes = ["/dashboard", "/properties"];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !req.auth) {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|share|manifest.json|icon-192.png|icon-512.png).*)",
  ],
};
