import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

// Fail fast at boot if AUTH_SECRET is missing in production.
if (process.env.NODE_ENV === "production" && !process.env.AUTH_SECRET) {
  throw new Error(
    "AUTH_SECRET environment variable is required in production. Generate one with `openssl rand -base64 32`.",
  );
}

// Augment NextAuth types so `session.user.role` is typed.
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

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        // Refuse login for soft-deleted accounts
        if (user.deletedAt) {
          return null;
        }

        // Check if account is locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          return null;
        }

        // Check if email is verified
        if (!user.isVerified) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash,
        );

        if (!isValid) {
          return null;
        }

        // Return user with role so the JWT callback can capture it
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On first sign-in, capture user.id and role into the JWT
      if (user) {
        token.id = user.id;
        (token as Record<string, unknown>).role =
          user.role ?? "STUDENT";
      }
      return token;
    },
    async session({ session, token }) {
      // Read role from JWT (no DB hit per request)
      if (session.user && token.id) {
        session.user.id = token.id as string;
        // token is untyped (JWT module augmentation is finicky); cast safely.
        const role = (token as Record<string, unknown>).role as
          | "STUDENT"
          | "MENTOR"
          | "STAFF"
          | "ADMIN"
          | undefined;
        if (role) {
          session.user.role = role;
        } else {
          // Fallback for sessions created before role was added to JWT
          session.user.role = "STUDENT";
        }
      }
      return session;
    },
  },
});
