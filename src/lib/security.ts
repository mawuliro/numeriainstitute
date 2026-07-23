/**
 * Password validation — strict rules
 * Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
 */

import { createHash } from "crypto";
import { db } from "@/lib/db";

export interface PasswordValidation {
  valid: boolean;
  errors: string[];
  strength: "weak" | "medium" | "strong";
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Au moins 8 caractères");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Au moins 1 majuscule");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Au moins 1 minuscule");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Au moins 1 chiffre");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) {
    errors.push("Au moins 1 caractère spécial (!@#$...)");
  }

  // Calculate strength
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  if (password.length >= 16) score++;

  const strength = score < 3 ? "weak" : score < 5 ? "medium" : "strong";

  return {
    valid: errors.length === 0,
    errors,
    strength,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Rate limiting
// ─────────────────────────────────────────────────────────────────────────────
// Strategy: DB-backed rate limiting using the User model fields for login
// (failedLoginAttempts, lockedUntil). For non-user-keyed limits (IP, search),
// we fall back to an in-memory Map that works correctly within a single
// instance and degrades gracefully in serverless multi-instance setups.
// For production-grade multi-instance, integrate @upstash/redis or similar.

export const MAX_ATTEMPTS = 5;
export const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const LOCKOUT_MS = 30 * 60 * 1000; // 30 minutes lockout

const ipRateBuckets = new Map<string, { count: number; resetAt: number }>();

/**
 * Per-IP rate limit. Returns true if the request is allowed, false otherwise.
 * `maxRequests` per `windowMs`. Resets after windowMs of inactivity.
 */
export function checkIpRateLimit(
  key: string,
  maxRequests = 30,
  windowMs = 60_000,
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const bucket = ipRateBuckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    ipRateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }
  if (bucket.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }
  bucket.count += 1;
  return { allowed: true, remaining: maxRequests - bucket.count, resetAt: bucket.resetAt };
}

/**
 * Login rate limiter — uses the in-memory Map as the first line of defense,
 * combined with DB-backed `failedLoginAttempts`/`lockedUntil` (updated in
 * the auth action). The DB fields survive instance restarts and are checked
 * in `authorize()` directly.
 */
export function checkRateLimit(key: string): {
  allowed: boolean;
  remaining: number;
  lockedUntil: number | null;
} {
  const now = Date.now();
  const record = loginAttempts.get(key);

  if (!record) {
    return { allowed: true, remaining: MAX_ATTEMPTS, lockedUntil: null };
  }

  // Reset if window expired
  if (now - record.lastAttempt > WINDOW_MS) {
    loginAttempts.delete(key);
    return { allowed: true, remaining: MAX_ATTEMPTS, lockedUntil: null };
  }

  // Check lockout
  if (record.count >= MAX_ATTEMPTS) {
    const lockedUntil = record.lastAttempt + LOCKOUT_MS;
    if (now < lockedUntil) {
      return { allowed: false, remaining: 0, lockedUntil };
    }
    // Lockout expired, reset
    loginAttempts.delete(key);
    return { allowed: true, remaining: MAX_ATTEMPTS, lockedUntil: null };
  }

  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - record.count,
    lockedUntil: null,
  };
}

const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export function recordFailedAttempt(key: string): {
  remaining: number;
  locked: boolean;
} {
  const now = Date.now();
  const record = loginAttempts.get(key);

  if (!record || now - record.lastAttempt > WINDOW_MS) {
    loginAttempts.set(key, { count: 1, lastAttempt: now });
    return { remaining: MAX_ATTEMPTS - 1, locked: false };
  }

  record.count++;
  record.lastAttempt = now;

  if (record.count >= MAX_ATTEMPTS) {
    return { remaining: 0, locked: true };
  }

  return { remaining: MAX_ATTEMPTS - record.count, locked: false };
}

export function clearAttempts(key: string) {
  loginAttempts.delete(key);
}

// ─────────────────────────────────────────────────────────────────────────────
// Token generation + hashing
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a secure random token for email verification / password reset.
 * Returned to the user (email link) but stored only as a SHA-256 hash.
 */
export function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Hash a token with SHA-256 before storing it in the database.
 * This way a DB dump does not leak valid tokens.
 */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Admin auth helper — throws redirect if not authorized.
 * Usage in server actions: `await requireAdmin();`
 */
export async function requireAdmin(): Promise<{ id: string; role: string }> {
  const { auth } = await import("@/lib/auth");
  const session = await auth();
  if (!session?.user) {
    const { redirect } = await import("next/navigation");
    redirect("/login");
  }
  // Role is in JWT (post-fix), no DB hit needed
  const role = session!.user.role;
  if (role !== "STAFF" && role !== "ADMIN") {
    const { redirect } = await import("next/navigation");
    redirect("/dashboard");
  }
  return { id: session!.user.id, role };
}
