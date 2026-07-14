/**
 * Password validation — strict rules
 * Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
 */

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

/**
 * Rate limiting — in-memory store (per email + per IP)
 * 5 attempts per 15 minutes, lockout after 5 fails
 */

const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 30 * 60 * 1000; // 30 minutes lockout

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

/**
 * Generate a secure random token for email verification / password reset
 */
export function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
