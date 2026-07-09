"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";
import { NumeriaLogo } from "@/components/numeria-logo";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await loginAction(formData);
      return result;
    },
    null,
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1B2A4E] via-[#1B2A4E] to-[#0d1530] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="flex flex-col items-center gap-3">
            <NumeriaLogo size={64} variant="light" />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">NUMERIA</h1>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                Institute
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Connexion</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              {state && "error" in state && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {state.error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="toi@exemple.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={pending}
                className="w-full bg-[#1B2A4E] hover:bg-[#1B2A4E]/90"
              >
                {pending ? "Connexion..." : "Se connecter"}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link
                href="/signup"
                className="font-semibold text-[#2DD4BF] hover:underline"
              >
                S&apos;inscrire
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-white/40">
          <Link href="/" className="hover:text-white/60">
            ← Retour à l&apos;accueil
          </Link>
        </p>
      </div>
    </div>
  );
}
