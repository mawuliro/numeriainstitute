/**
 * Email service — sends verification emails using Brevo (ex-Sendinblue) API.
 * Free plan: 300 emails/day.
 * Falls back to console.log if BREVO_API_KEY is not set (dev mode).
 */

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: EmailParams): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    // Dev mode — just log the email
    console.log(`📧 [DEV] Email to ${to}: ${subject}`);
    console.log(html.substring(0, 300) + "...");
    console.log("⚠️ Set BREVO_API_KEY to send real emails");
    return true;
  }

  try {
    const senderEmail =
      process.env.BREVO_SENDER_EMAIL || "noreply@brevo.com";
    const senderName =
      process.env.BREVO_SENDER_NAME || "Numeria Institute";

    // H15: in production, refuse the default shared Brevo sender — emails would
    // land in spam. Require a verified custom domain sender.
    if (
      process.env.NODE_ENV === "production" &&
      senderEmail === "noreply@brevo.com"
    ) {
      console.error(
        "BREVO_SENDER_EMAIL is not set — emails will fail SPF/DKIM in production.",
      );
      return false;
    }

    const body: Record<string, unknown> = {
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    };
    if (replyTo) body.replyTo = [{ email: replyTo }];

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Brevo API error:", response.status, errorText);
      return false;
    }

    const data = await response.json();
    console.log("✅ Email sent:", data.messageId || "success");
    return true;
  } catch (error) {
    console.error("Email send error:", error);
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
