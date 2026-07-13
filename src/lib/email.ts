/**
 * Email service — sends verification emails using Brevo (ex-Sendinblue) API.
 * Free plan: 300 emails/day.
 * Falls back to console.log if BREVO_API_KEY is not set (dev mode).
 */

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailParams): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    // Dev mode — just log the email
    console.log(`📧 Email to ${to}: ${subject}`);
    console.log(html.substring(0, 200) + "...");
    return true;
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: {
          name: "Numeria Institute",
          email: "noreply@numeria-institute.org",
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Brevo email send failed:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Email error:", error);
    return false;
  }
}

export async function sendVerificationEmail(
  email: string,
  name: string | null,
  token: string,
  baseUrl: string,
): Promise<boolean> {
  const verifyUrl = `${baseUrl}/verifier-email?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1B2A4E; font-size: 24px;">NUMERIA <span style="color: #2DD4BF;">Institute</span></h1>
      </div>

      <h2 style="color: #1B2A4E;">Vérifie ton adresse email</h2>

      <p>Bonjour ${name ?? ""},</p>

      <p>Merci de t'être inscrit sur Numeria Institute ! Pour activer ton compte, clique sur le bouton ci-dessous :</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}"
           style="background-color: #2DD4BF; color: #1B2A4E; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
          Vérifier mon email
        </a>
      </div>

      <p style="color: #666; font-size: 14px;">
        Ou copie ce lien dans ton navigateur :<br>
        <a href="${verifyUrl}" style="color: #2DD4BF; word-break: break-all;">${verifyUrl}</a>
      </p>

      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        Ce lien expire dans 24 heures. Si tu n'as pas créé de compte, ignore cet email.
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

      <p style="color: #999; font-size: 12px; text-align: center;">
        © ${new Date().getFullYear()} Numeria Institute · Lomé, Togo
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "Numeria Institute — Vérifie ton adresse email",
    html,
  });
}
