export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { verifyEmailAction } from "@/app/(auth)/actions";
import { NumeriaLogo } from "@/components/numeria-logo";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1B2A4E] to-[#0d1530] px-4">
        <div className="w-full max-w-md text-center">
          <NumeriaLogo size={64} variant="light" className="mx-auto mb-6" />
          <XCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
          <h1 className="text-xl font-bold text-white">Token manquant</h1>
          <p className="mt-2 text-sm text-white/60">
            Le lien de vérification est incomplet. Vérifie ton email.
          </p>
          <Link href="/login" className="mt-4 inline-block text-[#2DD4BF] hover:underline">
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  // Check if token is valid before showing the form
  const user = await db.user.findFirst({
    where: {
      emailVerifyToken: token,
      emailVerifyExpires: { gt: new Date() },
    },
  });

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1B2A4E] to-[#0d1530] px-4">
        <div className="w-full max-w-md text-center">
          <NumeriaLogo size={64} variant="light" className="mx-auto mb-6" />
          <XCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
          <h1 className="text-xl font-bold text-white">Lien expiré ou invalide</h1>
          <p className="mt-2 text-sm text-white/60">
            Ce lien de vérification a expiré (validité: 24h) ou est invalide.
          </p>
          <Link href="/login" className="mt-4 inline-block text-[#2DD4BF] hover:underline">
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  // If user is already verified
  if (user.isVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1B2A4E] to-[#0d1530] px-4">
        <div className="w-full max-w-md text-center">
          <NumeriaLogo size={64} variant="light" className="mx-auto mb-6" />
          <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-[#2DD4BF]" />
          <h1 className="text-xl font-bold text-white">Email déjà vérifié !</h1>
          <p className="mt-2 text-sm text-white/60">
            Ton adresse email est déjà vérifiée. Tu peux te connecter.
          </p>
          <Link href="/login" className="mt-4 inline-block text-[#2DD4BF] hover:underline">
            ← Se connecter
          </Link>
        </div>
      </div>
    );
  }

  // Verify the email
  const result = await verifyEmailAction(new FormData() as FormData & { get: (key: string) => string });
  // Actually call with token
  const formData = new FormData();
  formData.set("token", token);
  const verifyResult = await verifyEmailAction(formData);

  const success = verifyResult && "success" in verifyResult;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1B2A4E] to-[#0d1530] px-4">
      <div className="w-full max-w-md text-center">
        <NumeriaLogo size={64} variant="light" className="mx-auto mb-6" />

        {success ? (
          <>
            <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-[#2DD4BF]" />
            <h1 className="text-2xl font-bold text-white">Email vérifié ! 🎉</h1>
            <p className="mt-3 text-sm text-white/60">
              Ton adresse email a été vérifiée avec succès. Tu peux maintenant
              te connecter à ton compte.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2DD4BF] px-6 py-3 text-sm font-semibold text-[#1B2A4E] transition-transform hover:scale-105"
            >
              Se connecter →
            </Link>
          </>
        ) : (
          <>
            <XCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
            <h1 className="text-xl font-bold text-white">Erreur de vérification</h1>
            <p className="mt-2 text-sm text-white/60">
              Une erreur est survenue. Réessaie ou demande un nouveau lien.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
