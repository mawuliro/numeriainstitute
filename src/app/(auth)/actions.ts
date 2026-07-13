"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  validatePassword,
  checkRateLimit,
  recordFailedAttempt,
  clearAttempts,
  generateToken,
} from "@/lib/security";
import { sendVerificationEmail } from "@/lib/email";

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
const VERIFY_TOKEN_EXPIRY_HOURS = 24;

// ── Signup ──
export async function signupAction(formData: FormData) {
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;
  const name = (formData.get("name") as string)?.trim();

  if (!email || !password) {
    return { error: "Email et mot de passe requis" };
  }

  // Validate password strength
  const validation = validatePassword(password);
  if (!validation.valid) {
    return {
      error: `Mot de passe invalide : ${validation.errors.join(", ")}`,
    };
  }

  // Check if user already exists
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Un compte existe déjà avec cet email" };
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Generate email verification token
  const token = generateToken();
  const tokenExpiry = new Date(Date.now() + VERIFY_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  // Create user (not verified yet)
  await db.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: "STUDENT",
      isVerified: false,
      emailVerifyToken: token,
      emailVerifyExpires: tokenExpiry,
    },
  });

  // Send verification email
  const emailSent = await sendVerificationEmail(email, name, token, BASE_URL);

  // Redirect to "check your email" page
  // Pass emailSent status so we can show the link directly if email failed
  const params = new URLSearchParams({ email });
  if (!emailSent) {
    params.set("failed", "true");
    params.set("token", token);
  }
  redirect(`/verifier-email-sent?${params.toString()}`);
}

// ── Login ──
export async function loginAction(formData: FormData) {
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email et mot de passe requis" };
  }

  // Rate limit check (by email)
  const rateLimit = checkRateLimit(`login:${email}`);
  if (!rateLimit.allowed) {
    const mins = Math.ceil((rateLimit.lockedUntil! - Date.now()) / 60000);
    return {
      error: `Trop de tentatives échouées. Réessaie dans ${mins} minute(s).`,
    };
  }

  // Find user
  const user = await db.user.findUnique({ where: { email } });

  if (!user || !user.passwordHash) {
    const result = recordFailedAttempt(`login:${email}`);
    return {
      error: `Email ou mot de passe incorrect. ${result.remaining} tentative(s) restante(s).`,
    };
  }

  // Check if locked in DB
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const mins = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    return {
      error: `Ce compte est verrouillé. Réessaie dans ${mins} minute(s).`,
    };
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    // Record failed attempt
    const result = recordFailedAttempt(`login:${email}`);

    // Update DB with failed attempts
    const newCount = user.failedLoginAttempts + 1;
    const lockUntil =
      newCount >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null; // 30 min lockout

    await db.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: newCount,
        lockedUntil: lockUntil,
      },
    });

    if (result.locked) {
      return {
        error: "Compte verrouillé après 5 tentatives échouées. Réessaie dans 30 minutes.",
      };
    }

    return {
      error: `Email ou mot de passe incorrect. ${result.remaining} tentative(s) restante(s).`,
    };
  }

  // Success — clear attempts
  clearAttempts(`login:${email}`);

  // Reset failed attempts in DB
  await db.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });

  // Check if email is verified
  if (!user.isVerified) {
    return {
      error: "Ton adresse email n'est pas vérifiée. Vérifie ta boîte mail ou renvoie le lien de vérification.",
      needsVerification: true,
      email: user.email,
    };
  }

  // Sign in
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch {
    return { error: "Erreur de connexion. Réessaie." };
  }
}

// ── Resend verification email ──
export async function resendVerificationAction(formData: FormData) {
  const email = (formData.get("email") as string)?.toLowerCase().trim();

  if (!email) {
    return { error: "Email requis" };
  }

  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    return { error: "Aucun compte trouvé avec cet email." };
  }

  if (user.isVerified) {
    return { success: "Ton email est déjà vérifié. Tu peux te connecter." };
  }

  // Generate new token
  const token = generateToken();
  const tokenExpiry = new Date(Date.now() + VERIFY_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  await db.user.update({
    where: { id: user.id },
    data: {
      emailVerifyToken: token,
      emailVerifyExpires: tokenExpiry,
    },
  });

  await sendVerificationEmail(email, user.name, token, BASE_URL);

  return { success: "Email de vérification renvoyé ! Vérifie ta boîte mail." };
}

// ── Verify email with token ──
export async function verifyEmailAction(formData: FormData) {
  const token = formData.get("token") as string;

  if (!token) {
    return { error: "Token de vérification manquant." };
  }

  const user = await db.user.findFirst({
    where: {
      emailVerifyToken: token,
      emailVerifyExpires: { gt: new Date() },
    },
  });

  if (!user) {
    return { error: "Token invalide ou expiré. Demande un nouveau lien de vérification." };
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      emailVerifyToken: null,
      emailVerifyExpires: null,
    },
  });

  return { success: "Ton adresse email a été vérifiée ! Tu peux maintenant te connecter." };
}
