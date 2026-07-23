"use client";

import { useActionState, useState } from "react";
import { loginAction, resendVerificationAction } from "../actions";
import { NumeriaLogo } from "@/components/numeria-logo";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { t, type Locale } from "@/lib/i18n-client";

export function LoginForm({ locale }: { locale: Locale }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await loginAction(formData);
      return result;
    },
    null,
  );

  const [showPassword, setShowPassword] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  const needsVerification =
    state && "needsVerification" in state && state.needsVerification;
  const emailForResend = state && "email" in state ? state.email : "";

  const handleResend = async () => {
    if (!emailForResend) return;
    setResending(true);
    const formData = new FormData();
    formData.set("email", emailForResend);
    const result = await resendVerificationAction(formData);
    if ("success" in result && result.success) {
      setResendMsg(result.success);
    } else if ("error" in result && result.error) {
      setResendMsg(result.error);
    }
    setResending(false);
  };

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
            <CardTitle className="text-center">
              {t(locale, "auth.loginTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              {state && "error" in state && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                  {state.error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t(locale, "auth.email")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="toi@exemple.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t(locale, "auth.password")}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link href="/mot-de-passe-oublie" className="text-xs text-[#2DD4BF] hover:underline">
                  {t(locale, "auth.forgotPassword")}
                </Link>
              </div>

              <Button
                type="submit"
                disabled={pending}
                className="w-full bg-[#1B2A4E] hover:bg-[#1B2A4E]/90"
              >
                {pending ? `${t(locale, "auth.loginButton")}...` : t(locale, "auth.loginButton")}
              </Button>
            </form>

            {/* Email verification resend */}
            {needsVerification && (
              <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm">
                <p className="text-amber-800 mb-2">
                  {t(locale, "auth.notVerified")}
                </p>
                {resendMsg ? (
                  <p className="text-amber-700 font-medium">{resendMsg}</p>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={resending}
                    className="text-amber-700 font-semibold hover:underline"
                  >
                    {resending
                      ? "..."
                      : `${t(locale, "auth.verifyResend")} →`}
                  </button>
                )}
              </div>
            )}

            <p className="mt-4 text-center text-sm text-muted-foreground">
              {t(locale, "auth.noAccount")}{" "}
              <Link href="/signup" className="font-semibold text-[#2DD4BF] hover:underline">
                {t(locale, "auth.signup")}
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-white/40">
          <Link href="/" className="hover:text-white/60">
            {t(locale, "auth.backHome")}
          </Link>
        </p>
      </div>
    </div>
  );
}
