import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function proxy(req: NextRequest) {
  const session = await auth();
  const pathname = req.nextUrl.pathname;

  const protectedRoutes = ["/dashboard", "/properties"];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !session?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|share|manifest.json|icon-192.png|icon-512.png).*)",
  ],
};
