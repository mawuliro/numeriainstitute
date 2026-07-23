/**
 * POST /api/admin/bootstrap
 *
 * One-time endpoint to create the initial ADMIN account on a fresh database.
 * Protected by BOOTSTRAP_ADMIN_SECRET env var (passed via x-bootstrap-secret
 * header or ?secret= query param).
 *
 * Usage:
 *   curl -X POST https://numeriainstitute.vercel.app/api/admin/bootstrap \
 *     -H "x-bootstrap-secret: $BOOTSTRAP_ADMIN_SECRET"
 *
 * After use, DELETE this file (or rotate BOOTSTRAP_ADMIN_SECRET) for safety.
 */
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "numeriainstitute@gmail.com").toLowerCase().trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Numeria2026@";
const ADMIN_FIRST_NAME = process.env.ADMIN_FIRST_NAME || "Numeria";
const ADMIN_LAST_NAME = process.env.ADMIN_LAST_NAME || "Institute";

export async function POST(req: NextRequest) {
  const provided =
    req.headers.get("x-bootstrap-secret") ||
    req.nextUrl.searchParams.get("secret");

  const expected = process.env.BOOTSTRAP_ADMIN_SECRET;

  // Fail closed if no secret is configured
  if (!expected) {
    return NextResponse.json(
      { error: "BOOTSTRAP_ADMIN_SECRET env var is not set. Set it on Vercel first." },
      { status: 500 },
    );
  }

  if (provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    const fullName = `${ADMIN_FIRST_NAME} ${ADMIN_LAST_NAME}`.trim();

    const user = await db.user.upsert({
      where: { email: ADMIN_EMAIL },
      update: {
        firstName: ADMIN_FIRST_NAME,
        lastName: ADMIN_LAST_NAME,
        name: fullName,
        passwordHash,
        role: "ADMIN",
        isVerified: true,
        emailVerifyToken: null,
        emailVerifyExpires: null,
        passwordResetToken: null,
        passwordResetExpires: null,
        failedLoginAttempts: 0,
        lockedUntil: null,
        deletedAt: null,
      },
      create: {
        email: ADMIN_EMAIL,
        firstName: ADMIN_FIRST_NAME,
        lastName: ADMIN_LAST_NAME,
        name: fullName,
        passwordHash,
        role: "ADMIN",
        isVerified: true,
        preferredLanguage: "fr",
      },
    });

    return NextResponse.json({
      success: true,
      userId: user.id,
      email: user.email,
      role: user.role,
      verified: user.isVerified,
      message:
        "Admin account created. You can now log in at /login. IMPORTANT: delete this endpoint or rotate BOOTSTRAP_ADMIN_SECRET.",
    });
  } catch (err) {
    console.error("Bootstrap error:", err);
    return NextResponse.json(
      { error: "Failed to create admin", details: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
