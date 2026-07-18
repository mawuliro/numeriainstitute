"use client";

import { useActionState, useState } from "react";
import { forgotPasswordAction } from "./actions";
import { NumeriaLogo } from "@/components/numeria-logo";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      return await forgotPasswordAction(formData);
    },
    null,
  );

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
            <CardTitle className="text-center">Mot de passe oublié</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-center text-sm text-muted-foreground">
              Entre ton email pour recevoir un lien de réinitialisation
            </p>

            <form action={formAction} className="space-y-4">
              {state && "error" in state && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                  {state.error}
                </div>
              )}
              {state && "success" in state && (
                <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-200">
                  {state.success}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="toi@exemple.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={pending}
                className="w-full bg-[#1B2A4E] hover:bg-[#1B2A4E]/90"
              >
                {pending ? "Envoi..." : "Envoyer le lien"}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              <Link href="/login" className="font-semibold text-[#2DD4BF] hover:underline">
                ← Retour à la connexion
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
