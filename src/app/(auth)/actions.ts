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
  hashToken,
} from "@/lib/security";
import { sendVerificationEmail } from "@/lib/email";

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
const VERIFY_TOKEN_EXPIRY_HOURS = 24;

// ── Signup ──
export async function signupAction(formData: FormData) {
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();
  const avatarUrl = (formData.get("avatarUrl") as string)?.trim() || null;
  const agreed = formData.get("agreed");

  if (!email || !password) {
    return { error: "Email et mot de passe requis" };
  }

  // First and last name are now required
  if (!firstName || firstName.length < 1) {
    return { error: "Ton prénom est requis." };
  }
  if (!lastName || lastName.length < 1) {
    return { error: "Ton nom est requis." };
  }
  if (firstName.length > 60 || lastName.length > 60) {
    return { error: "Le prénom et le nom ne peuvent pas dépasser 60 caractères." };
  }

  // Validate avatar URL if provided (must be a data: URL from our upload endpoint)
  if (avatarUrl && !avatarUrl.startsWith("data:image/")) {
    return { error: "Photo de profil invalide." };
  }
  // Cap avatar size at 200 KB in DB (already resized by the upload endpoint)
  if (avatarUrl && avatarUrl.length > 200 * 1024) {
    return { error: "La photo de profil est trop lourde (max 200 Ko après compression)." };
  }

  // Check terms agreement
  if (!agreed) {
    return { error: "Tu dois accepter les conditions d'utilisation pour t'inscrire." };
  }

  // Check password confirmation
  if (password !== confirmPassword) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  // Validate password strength
  const validation = validatePassword(password);
  if (!validation.valid) {
    return {
      error: `Mot de passe invalide : ${validation.errors.join(", ")}`,
    };
  }

  const fullName = `${firstName} ${lastName}`.trim();

  // M43: don't reveal if email is already registered. Send the verification
  // email silently and redirect to the "check your email" page either way.
  const existing = await db.user.findUnique({ where: { email } });
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 12);
    const token = generateToken();
    const tokenExpiry = new Date(Date.now() + VERIFY_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    const user = await db.user.create({
      data: {
        email,
        firstName,
        lastName,
        name: fullName,
        avatarUrl,
        passwordHash,
        role: "STUDENT",
        isVerified: false,
        emailVerifyToken: hashToken(token),
        emailVerifyExpires: tokenExpiry,
      },
    });

    await db.notification.create({
      data: {
        userId: user.id,
        title: "Bienvenue sur Numeria Institute ! 🎉",
        message: `Bonjour ${firstName} ! Ton compte a été créé. Vérifie ton email pour l'activer, puis explore nos cours gratuits.`,
        link: "/cours",
      },
    });

    const emailSent = await sendVerificationEmail(email, fullName, token, BASE_URL);
    const params = new URLSearchParams({ email });
    if (!emailSent) {
      params.set("failed", "true");
      params.set("token", token);
    }
    redirect(`/verifier-email-sent?${params.toString()}`);
  }

  // Account already exists — silently redirect (no info disclosure)
  const params = new URLSearchParams({ email });
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

  if (!user || !user.passwordHash || user.deletedAt) {
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
      newCount >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null;

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
  } catch (error) {
    // NextAuth v5 throws NEXT_REDIRECT on successful redirect — re-throw it
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
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

  // Generate new token (stored hashed)
  const token = generateToken();
  const tokenExpiry = new Date(Date.now() + VERIFY_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  await db.user.update({
    where: { id: user.id },
    data: {
      emailVerifyToken: hashToken(token),
      emailVerifyExpires: tokenExpiry,
    },
  });

  await sendVerificationEmail(email, user.name, token, BASE_URL);

  return { success: "Email de vérification renvoyé ! Vérifie ta boîte mail." };
}

// ── Verify email with token (compare hashed) ──
export async function verifyEmailAction(formData: FormData) {
  const token = formData.get("token") as string;

  if (!token) {
    return { error: "Token de vérification manquant." };
  }

  const hashed = hashToken(token);

  const user = await db.user.findFirst({
    where: {
      emailVerifyToken: hashed,
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
