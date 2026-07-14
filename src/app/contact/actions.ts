"use server";

import { sendEmail } from "@/lib/email";

export async function contactAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const org = (formData.get("org") as string) || "—";
  const topic = formData.get("topic") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { error: "Tous les champs obligatoires doivent être remplis." };
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #1B2A4E;">Nouveau message de contact</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Nom</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Organisation</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${org}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Sujet</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${topic}</td></tr>
      </table>
      <h3 style="color: #1B2A4E; margin-top: 20px;">Message</h3>
      <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${message}</div>
    </div>
  `;

  // Send to admin
  const adminEmail = process.env.BREVO_SENDER_EMAIL || "numeriainstitute@gmail.com";
  const sent = await sendEmail({
    to: adminEmail,
    subject: `[Contact] ${topic} — ${name}`,
    html,
  });

  if (!sent) {
    return { error: "Erreur lors de l'envoi. Réessaie plus tard." };
  }

  return { success: "Message envoyé ! Nous répondrons sous 24-48h." };
}
