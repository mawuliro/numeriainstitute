export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { resetPasswordAction } from "../mot-de-passe-oublie/actions";
import { NumeriaLogo } from "@/components/numeria-logo";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1B2A4E] to-[#0d1530] px-4">
        <div className="max-w-md text-center">
          <NumeriaLogo size={64} variant="light" className="mx-auto mb-6" />
          <XCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
          <h1 className="text-xl font-bold text-white">Lien invalide</h1>
          <p className="mt-2 text-sm text-white/60">
            Le lien de réinitialisation est incomplet.
          </p>
          <Link href="/mot-de-passe-oublie" className="mt-4 inline-block text-[#2DD4BF] hover:underline">
            Demander un nouveau lien
          </Link>
        </div>
      </div>
    );
  }

  // Check if token is valid
  const user = await db.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetExpires: { gt: new Date() },
    },
  });

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1B2A4E] to-[#0d1530] px-4">
        <div className="max-w-md text-center">
          <NumeriaLogo size={64} variant="light" className="mx-auto mb-6" />
          <XCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
          <h1 className="text-xl font-bold text-white">Lien expiré</h1>
          <p className="mt-2 text-sm text-white/60">
            Ce lien a expiré (validité: 1 heure) ou est invalide.
          </p>
          <Link href="/mot-de-passe-oublie" className="mt-4 inline-block text-[#2DD4BF] hover:underline">
            Demander un nouveau lien
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1B2A4E] via-[#1B2A4E] to-[#0d1530] px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="flex flex-col items-center gap-3">
            <NumeriaLogo size={64} variant="light" />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">NUMERIA</h1>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Institute</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Réinitialiser le mot de passe</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={resetPasswordAction} className="space-y-4">
              <input type="hidden" name="token" value={token} />

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial.
              </p>

              <Button
                type="submit"
                className="w-full bg-[#2DD4BF] text-[#1B2A4E] hover:bg-[#2DD4BF]/90"
              >
                Changer le mot de passe
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
