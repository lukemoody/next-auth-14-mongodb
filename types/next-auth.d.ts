import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      username: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: number;
    name: string;
    username: string;
    role: Role; // We don't have this data going into the database....
    // email: string; // Do we need this for the custom login?
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}
