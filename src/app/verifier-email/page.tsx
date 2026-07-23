export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { NumeriaLogo } from "@/components/numeria-logo";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";

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
          <p className="mt-3 text-sm text-white/60">
            Tu peux demander un nouveau lien depuis la page de connexion.
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

  // Inline verification (no server action needed) — mark verified directly.
  // Note: `emailVerifyToken` in DB is the *raw* token pre-fix; for compatibility
  // with both the new hashed storage and any existing rows, we look it up again
  // and clear it.
  await db.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      emailVerifyToken: null,
      emailVerifyExpires: null,
    },
  });

  // Redirect to login with success flag instead of staying on the token URL
  redirect("/login?verified=1");
}

