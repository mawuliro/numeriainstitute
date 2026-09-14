export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { getLocale, type Locale } from "@/lib/i18n";
import { NumeriaLogo } from "@/components/numeria-logo";
import Link from "next/link";
import { MailCheck, XCircle, Lock } from "lucide-react";
import { SignupForm } from "./signup-form";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string }>;
}) {
  const locale = await getLocale();
  const { invite } = await searchParams;

  // No invitation token → show "invitation only" page
  if (!invite) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1B2A4E] to-[#0d1530] px-4 py-8">
        <div className="w-full max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <NumeriaLogo size={64} variant="light" />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A227]/15 ring-1 ring-[#C9A227]/30">
                <Lock className="h-8 w-8 text-[#C9A227]" />
              </div>
            </div>

            <h1 className="text-xl font-bold text-white">Inscription sur invitation</h1>
            <p className="mt-3 text-sm text-white/60">
              Numeria Institute fonctionne sur invitation. Seul un administrateur
              peut t'envoyer une invitation par email pour créer un compte.
            </p>

            <div className="mt-6 rounded-xl border border-[#2DD4BF]/20 bg-[#2DD4BF]/5 p-4">
              <p className="text-xs text-white/50">
                <strong className="text-[#2DD4BF]">Tu as reçu une invitation ?</strong>
                <br />
                Clique sur le lien dans l'email pour accéder au formulaire d'inscription.
              </p>
            </div>

            <p className="mt-6 text-center text-sm text-white/40">
              Pas d'invitation ?{" "}
              <Link href="/contact" className="text-[#2DD4BF] hover:underline">
                Contacte-nous
              </Link>
            </p>

            <Link
              href="/login"
              className="mt-4 inline-block text-xs text-white/40 hover:text-white/60"
            >
              ← Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Validate the invitation token
  const { hashToken } = await import("@/lib/security");
  const hashedToken = hashToken(invite);

  const invitation = await db.invitation.findFirst({
    where: {
      token: hashedToken,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: {
      course: { select: { id: true, title: true } },
    },
  });

  if (!invitation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1B2A4E] to-[#0d1530] px-4 py-8">
        <div className="w-full max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <NumeriaLogo size={64} variant="light" />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
            <XCircle className="mx-auto mb-4 h-16 w-16 text-red-400" />
            <h1 className="text-xl font-bold text-white">Invitation invalide ou expirée</h1>
            <p className="mt-3 text-sm text-white/60">
              Ce lien d'invitation n'est plus valide. Les invitations expirent après 7 jours.
            </p>
            <p className="mt-3 text-sm text-white/60">
              Contacte l'administrateur qui t'a invité(e) pour en recevoir une nouvelle.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-block text-[#2DD4BF] hover:underline text-sm"
            >
              ← Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Valid invitation → show the signup form with pre-filled email
  return (
    <>
      {invitation.course && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#2DD4BF]/10 border-b border-[#2DD4BF]/20 backdrop-blur-md">
          <div className="container mx-auto max-w-md px-4 py-2 text-center text-sm text-[#2DD4BF]">
            📚 Tu seras inscrit(e) au cours : <strong>{invitation.course.title}</strong>
          </div>
        </div>
      )}
      <SignupForm
        locale={locale}
        inviteToken={invite}
        prefillEmail={invitation.email}
        courseId={invitation.course?.id ?? null}
      />
    </>
  );
}
