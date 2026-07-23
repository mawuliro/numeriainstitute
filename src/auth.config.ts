import type { NextAuthConfig } from "next-auth";

/**
 * Lightweight NextAuth config — no Prisma, no bcrypt.
 *
 * Used by `src/middleware.ts` which runs on the Edge runtime (size limit 1 MB
 * on Vercel's free plan). The heavy Credentials provider is added in
 * `src/lib/auth.ts` (which runs on Node.js, no size limit).
 *
 * The JWT callback captures `id` and `role` on first sign-in (when the `user`
 * object is passed). The session callback reads them from the token — no DB
 * hit, no heavy imports.
 */

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: "STUDENT" | "MENTOR" | "STAFF" | "ADMIN";
    };
  }
  interface User {
    role?: "STUDENT" | "MENTOR" | "STAFF" | "ADMIN";
  }
}

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    // No Credentials provider here — middleware doesn't need to authenticate
    // passwords, only validate JWT sessions. The Credentials provider (with
    // Prisma + bcrypt) is added in src/lib/auth.ts.
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        (token as Record<string, unknown>).role =
          user.role ?? "STUDENT";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        const role = (token as Record<string, unknown>).role as
          | "STUDENT"
          | "MENTOR"
          | "STAFF"
          | "ADMIN"
          | undefined;
        session.user.role = role ?? "STUDENT";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
