"use client";

import { useActionState, useState, useMemo } from "react";
import { signupAction } from "../actions";
import { NumeriaLogo } from "@/components/numeria-logo";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, X, Eye, EyeOff } from "lucide-react";
import { validatePassword } from "@/lib/security";
import { t, type Locale } from "@/lib/i18n-client";

export function SignupForm({ locale }: { locale: Locale }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await signupAction(formData);
      return result;
    },
    null,
  );

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validation = useMemo(() => validatePassword(password), [password]);

  const strengthLabelKey = (strength: "weak" | "medium" | "strong") =>
    `auth.passwordStrength.${strength}` as const;

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
              {t(locale, "auth.signupTitle")}
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
                <Label htmlFor="name">{t(locale, "auth.nameOptional")}</Label>
                <Input id="name" name="name" type="text" placeholder={t(locale, "auth.name")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t(locale, "auth.email")}</Label>
                <Input id="email" name="email" type="email" placeholder="toi@exemple.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t(locale, "auth.password")}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t(locale, "auth.passwordPlaceholder")}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

                {/* Password strength indicator */}
                {password.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full transition-all duration-300 ${
                            validation.strength === "weak"
                              ? "w-1/3 bg-red-500"
                              : validation.strength === "medium"
                              ? "w-2/3 bg-yellow-500"
                              : "w-full bg-green-500"
                          }`}
                        />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">
                        {t(locale, strengthLabelKey(validation.strength))}
                      </span>
                    </div>

                    {/* Requirements checklist */}
                    <ul className="space-y-1">
                      {[
                        { label: t(locale, "auth.passwordMin"), check: password.length >= 8 },
                        { label: t(locale, "auth.passwordUpper"), check: /[A-Z]/.test(password) },
                        { label: t(locale, "auth.passwordLower"), check: /[a-z]/.test(password) },
                        { label: t(locale, "auth.passwordNumber"), check: /[0-9]/.test(password) },
                        { label: t(locale, "auth.passwordSpecial"), check: /[^a-zA-Z0-9]/.test(password) },
                      ].map((req) => (
                        <li
                          key={req.label}
                          className={`flex items-center gap-1.5 text-xs ${
                            req.check ? "text-green-600" : "text-muted-foreground"
                          }`}
                        >
                          {req.check ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          {req.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={pending || (password.length > 0 && !validation.valid)}
                className="w-full bg-[#2DD4BF] text-[#1B2A4E] hover:bg-[#2DD4BF]/90"
              >
                {pending ? `${t(locale, "auth.signupButton")}...` : t(locale, "auth.signupButton")}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              {t(locale, "auth.alreadyAccount")}{" "}
              <Link href="/login" className="font-semibold text-[#2DD4BF] hover:underline">
                {t(locale, "auth.login")}
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
