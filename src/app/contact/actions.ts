"use server";

import { sendEmail } from "@/lib/email";
import { checkIpRateLimit } from "@/lib/security";
import { headers } from "next/headers";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function contactAction(formData: FormData) {
  // Rate limit per IP (max 5 messages per hour)
  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip") ||
    "unknown";
  const rl = checkIpRateLimit(`contact:${ip}`, 5, 3_600_000);
  if (!rl.allowed) {
    return { error: "Trop de messages envoyés. Réessaie plus tard." };
  }

  const name = ((formData.get("name") as string) || "").trim();
  const email = ((formData.get("email") as string) || "").trim().toLowerCase();
  const org = ((formData.get("org") as string) || "").trim() || "—";
  const topic = ((formData.get("topic") as string) || "").trim() || "autre";
  const message = ((formData.get("message") as string) || "").trim();

  if (!name || !email || !message) {
    return { error: "Tous les champs obligatoires doivent être remplis." };
  }
  if (name.length > 80 || email.length > 200 || message.length > 5000) {
    return { error: "Un champ dépasse la taille maximale autorisée." };
  }
  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Adresse email invalide." };
  }

  // Escape all user-provided content before interpolating into HTML email
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #1B2A4E;">Nouveau message de contact</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Nom</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(email)}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Organisation</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(org)}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Sujet</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(topic)}</td></tr>
      </table>
      <h3 style="color: #1B2A4E; margin-top: 20px;">Message</h3>
      <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${escapeHtml(message)}</div>
    </div>
  `;

  // Send to admin
  const adminEmail = process.env.BREVO_SENDER_EMAIL || "numeriainstitute@gmail.com";
  const sent = await sendEmail({
    to: adminEmail,
    subject: `[Contact] ${topic} — ${name}`,
    html,
    replyTo: email,
  });

  if (!sent) {
    return { error: "Erreur lors de l'envoi. Réessaie plus tard." };
  }

  return { success: "Message envoyé ! Nous répondrons sous 24-48h." };
}
