import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Use Edge-compatible authConfig (no bcrypt/Prisma) so JWT verification
// works in Edge runtime and the 307 redirect fires before any HTML streams.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/dashboard/:path*", "/properties/:path*"],
};
