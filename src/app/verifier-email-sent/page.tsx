export const dynamic = "force-dynamic";

import { NumeriaLogo } from "@/components/numeria-logo";
import { MailCheck, AlertCircle } from "lucide-react";
import Link from "next/link";
import { ResendForm } from "./resend-form";

export default async function VerifyEmailSentPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; failed?: string; token?: string }>;
}) {
  const { email, failed, token } = await searchParams();
  const emailFailed = failed === "true";

  const baseUrl = process.env.NEXTAUTH_URL || "https://numeriainstitute.vercel.app";
  const verifyUrl = token ? `${baseUrl}/verifier-email?token=${token}` : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1B2A4E] to-[#0d1530] px-4 py-8">
      <div className="w-full max-w-md text-center">
        <NumeriaLogo size={64} variant="light" className="mx-auto mb-6" />

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
          {emailFailed ? (
            <>
              <AlertCircle className="mx-auto mb-4 h-16 w-16 text-[#C9A227]" />
              <h1 className="text-xl font-bold text-white">Email non envoyé</h1>
              <p className="mt-3 text-sm text-white/60">
                L'email de vérification n'a pas pu être envoyé à :
              </p>
              <p className="mt-1 text-sm font-semibold text-[#C9A227]">
                {email ?? "ton adresse email"}
              </p>

              {verifyUrl && (
                <div className="mt-6 rounded-xl border border-[#2DD4BF]/30 bg-[#2DD4BF]/5 p-4">
                  <p className="text-xs text-white/60 mb-2">
                    Vérifie ton email manuellement avec ce lien :
                  </p>
                  <Link
                    href={verifyUrl}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#2DD4BF] px-4 py-2 text-sm font-semibold text-[#1B2A4E] hover:bg-[#2DD4BF]/80"
                  >
                    Vérifier mon email →
                  </Link>
                </div>
              )}

              <p className="mt-4 text-xs text-white/40">
                L'email a peut-être été envoyé mais retardé. Vérifie aussi tes spams.
              </p>
            </>
          ) : (
            <>
              <MailCheck className="mx-auto mb-4 h-16 w-16 text-[#2DD4BF]" />
              <h1 className="text-2xl font-bold text-white">Vérifie ta boîte mail</h1>
              <p className="mt-3 text-sm text-white/60">
                Nous avons envoyé un lien de vérification à :
              </p>
              <p className="mt-1 text-sm font-semibold text-[#2DD4BF]">
                {email ?? "ton adresse email"}
              </p>
              <p className="mt-4 text-xs text-white/40">
                Clique sur le lien dans l'email pour activer ton compte.
                Le lien expire dans 24 heures.
              </p>
            </>
          )}

          <div className="mt-6 space-y-3">
            <ResendForm email={email ?? ""} />
            <Link href="/login" className="block text-sm text-white/60 hover:text-white">
              ← Retour à la connexion
            </Link>
          </div>
        </div>

        <p className="mt-4 text-xs text-white/30">
          Pas reçu d'email ? Vérifie tes spams ou le dossier promotions.
        </p>
      </div>
    </div>
  );
}
