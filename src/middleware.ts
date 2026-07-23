import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

// H13: protect routes via NextAuth middleware.
// IMPORTANT: this file imports ONLY from `@/auth.config` (no Prisma, no bcrypt)
// because the Edge runtime has a 1 MB size limit on Vercel's free plan.
// The heavy Credentials provider lives in `src/lib/auth.ts` (Node.js runtime).
//
// Note: in Next.js 16 the file should be `proxy.ts`, but `middleware.ts`
// still works as a deprecated alias. When you upgrade, rename to `src/proxy.ts`.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Routes that require authentication
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profil") ||
    pathname.startsWith("/admin") ||
    pathname === "/communaute/nouveau" ||
    (pathname.startsWith("/visioconference") && pathname !== "/visioconference");

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.url),
    );
  }

  // Admin-only routes — even logged-in students get redirected
  if (pathname.startsWith("/admin") && isLoggedIn) {
    const role = req.auth?.user?.role;
    if (role !== "STAFF" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profil/:path*",
    "/communaute/nouveau",
    "/admin/:path*",
    "/visioconference/:path*",
  ],
};
