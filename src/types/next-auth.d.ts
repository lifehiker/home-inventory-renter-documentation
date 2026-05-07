import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      proUnlocked: boolean;
    };
  }

  interface User {
    id?: string;
    proUnlocked?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    proUnlocked?: boolean;
  }
}
