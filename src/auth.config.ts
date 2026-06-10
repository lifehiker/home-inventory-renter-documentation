import type { NextAuthConfig } from "next-auth";

// Edge-compatible config: no bcrypt, no Prisma.
// Used in middleware.ts for JWT verification before streaming starts.
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" as const },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: () => true,
  },
  providers: [],
} satisfies NextAuthConfig;
