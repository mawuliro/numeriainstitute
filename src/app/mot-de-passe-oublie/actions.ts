"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { validatePassword, generateToken, hashToken } from "@/lib/security";
import { sendEmail } from "@/lib/email";

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
const RESET_EXPIRY_HOURS = 1;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function forgotPasswordAction(formData: FormData) {
  const email = (formData.get("email") as string)?.toLowerCase().trim();

  if (!email) {
    return { error: "Email requis." };
  }

  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    // Don't reveal whether email exists (security)
    return { success: "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé." };
  }

  const token = generateToken();
  const expiry = new Date(Date.now() + RESET_EXPIRY_HOURS * 60 * 60 * 1000);

  await db.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: hashToken(token),
      passwordResetExpires: expiry,
    },
  });

  const resetUrl = `${BASE_URL}/reinitialiser-mdp?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1B2A4E; font-size: 24px;">NUMERIA <span style="color: #2DD4BF;">Institute</span></h1>
      </div>
      <h2 style="color: #1B2A4E;">Réinitialise ton mot de passe</h2>
      <p>Bonjour ${escapeHtml(user.name ?? "")},</p>
      <p>Tu as demandé à réinitialiser ton mot de passe. Clique sur le bouton ci-dessous :</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #2DD4BF; color: #1B2A4E; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
          Réinitialiser mon mot de passe
        </a>
      </div>
      <p style="color: #666; font-size: 14px;">
        Ou copie ce lien :<br>
        <a href="${resetUrl}" style="color: #2DD4BF; word-break: break-all;">${resetUrl}</a>
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        Ce lien expire dans 1 heure. Si tu n'as pas fait cette demande, ignore cet email.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #999; font-size: 12px; text-align: center;">
        © ${new Date().getFullYear()} Numeria Institute · Lomé, Togo
      </p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: "Numeria Institute — Réinitialise ton mot de passe",
    html,
  });

  return { success: "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé." };
}

export async function resetPasswordAction(formData: FormData) {
  const token = formData.get("token") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!token) {
    redirect("/mot-de-passe-oublie?error=missing-token");
  }

  if (newPassword !== confirmPassword) {
    redirect(`/reinitialiser-mdp?token=${token}&error=mismatch`);
  }

  const validation = validatePassword(newPassword);
  if (!validation.valid) {
    redirect(`/reinitialiser-mdp?token=${token}&error=weak`);
  }

  const hashed = hashToken(token);
  const user = await db.user.findFirst({
    where: {
      passwordResetToken: hashed,
      passwordResetExpires: { gt: new Date() },
    },
  });

  if (!user) {
    redirect("/mot-de-passe-oublie?error=expired");
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await db.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });

  redirect("/login?reset=success");
}
