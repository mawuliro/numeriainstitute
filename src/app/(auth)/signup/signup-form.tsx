"use client";

import { useActionState, useState, useMemo, useRef, useCallback } from "react";
import { signupAction } from "../actions";
import { NumeriaLogo } from "@/components/numeria-logo";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  Eye,
  EyeOff,
  Mail,
  User,
  Lock,
  Camera,
  Upload,
  Sparkles,
  GraduationCap,
  Rocket,
  Users,
  Loader2,
} from "lucide-react";
import { validatePassword } from "@/lib/security";
import { t, type Locale } from "@/lib/i18n-client";
import { toast } from "sonner";

type State = { error?: string } | null;

export function SignupForm({ locale }: { locale: Locale }) {
  const [state, formAction, pending] = useActionState<State, FormData>(
    async (_prev, formData) => {
      // If user uploaded an avatar, the avatarUrl is already in a hidden input
      try {
        return await signupAction(formData);
      } catch (err) {
        if (err instanceof Error && err.message === "NEXT_REDIRECT") throw err;
        return { error: "Erreur inattendue. Réessaie." };
      }
    },
    null,
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Avatar upload
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = useCallback(async (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5 Mo.");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      toast.error("Format non supporté. Utilise JPG, PNG, WEBP ou GIF.");
      return;
    }

    setAvatarUploading(true);
    try {
      const fd = new FormData();
      fd.append("photo", file);
      const res = await fetch("/api/upload-avatar", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Échec de l'upload.");
      } else {
        setAvatarUrl(data.url);
        toast.success("Photo de profil ajoutée !");
      }
    } catch {
      toast.error("Erreur réseau.");
    } finally {
      setAvatarUploading(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleAvatarUpload(file);
    },
    [handleAvatarUpload],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleAvatarUpload(file);
  };

  const validation = useMemo(() => validatePassword(password), [password]);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const nameInitial = (firstName[0] ?? lastName[0] ?? "?").toUpperCase();

  const strengthLabelKey = (strength: "weak" | "medium" | "strong") =>
    `auth.passwordStrength.${strength}` as const;

  const canSubmit =
    validation.valid && passwordsMatch && agreed && firstName.length >= 1 && lastName.length >= 1 && email.length >= 3;

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT — Brand hero panel */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#1B2A4E] via-[#1B2A4E] to-[#0d1530] p-12 xl:p-16">
        {/* Decorative orbs */}
        <div aria-hidden className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#2DD4BF]/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-[#C9A227]/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <NumeriaLogo size={44} variant="light" />
          <div className="flex flex-col leading-none">
            <span className="font-bold text-xl tracking-tight text-white">NUMERIA</span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/60">Institute</span>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 max-w-md">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 px-3 py-1 text-xs font-medium text-[#2DD4BF]">
            <Sparkles className="h-3 w-3" />
            {locale === "fr" ? "Plateforme d'apprentissage interactive" : "Interactive learning platform"}
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold tracking-tight text-white leading-tight">
            {locale === "fr"
              ? "Apprends les sciences par la pratique."
              : "Learn science by doing."}
          </h1>
          <p className="mt-4 text-lg text-white/70">
            {locale === "fr"
              ? "Cours structurés, labs interactifs, exercices corrigés. Pensé pour les apprenants francophones."
              : "Structured courses, interactive labs, graded exercises. Built for French-speaking learners."}
          </p>

          {/* Feature pills */}
          <div className="mt-8 space-y-3">
            {[
              { icon: GraduationCap, label: locale === "fr" ? "Cours de physique, maths & Python" : "Physics, math & Python courses" },
              { icon: Rocket, label: locale === "fr" ? "Labs PhET-style dans le navigateur" : "PhET-style labs in your browser" },
              { icon: Users, label: locale === "fr" ? "Communauté d'apprenants francophones" : "French-speaking learner community" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <f.icon className="h-4 w-4 text-[#2DD4BF]" />
                </div>
                <span className="text-sm text-white/80">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-white/40">
          © {new Date().getFullYear()} Numeria Institute · Lomé, Togo
        </div>
      </div>

      {/* RIGHT — Form panel */}
      <div className="flex flex-col justify-center bg-white px-4 py-10 sm:px-8 dark:bg-background">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile brand */}
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <NumeriaLogo size={40} variant="dark" />
            <div className="flex flex-col leading-none">
              <span className="font-bold text-lg tracking-tight text-[#1B2A4E] dark:text-white">NUMERIA</span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Institute</span>
            </div>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-[#1B2A4E] dark:text-white">
              {t(locale, "auth.signupTitle")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {locale === "fr"
                ? "Quelques infos et tu rejoins la communauté."
                : "A few details and you join the community."}
            </p>
          </div>

          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 border border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900">
                {state.error}
              </div>
            )}

            {/* Avatar uploader */}
            <div className="flex flex-col items-center">
              <label className="mb-2 text-sm font-medium text-foreground">
                {locale === "fr" ? "Photo de profil" : "Profile photo"}
              </label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                className={`relative group cursor-pointer flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition-all ${
                  dragActive
                    ? "border-[#2DD4BF] bg-[#2DD4BF]/10 scale-105"
                    : avatarUrl
                    ? "border-transparent"
                    : "border-muted-foreground/30 hover:border-[#2DD4BF]/50 hover:bg-muted/50"
                }`}
                aria-label={locale === "fr" ? "Téléverser une photo de profil" : "Upload profile photo"}
              >
                {avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : avatarUploading ? (
                  <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    {firstName || lastName ? (
                      <span className="text-2xl font-bold text-[#1B2A4E] dark:text-white">
                        {nameInitial}
                      </span>
                    ) : (
                      <Camera className="h-7 w-7" />
                    )}
                    <span className="text-[10px] font-medium uppercase tracking-wide">
                      {locale === "fr" ? "Ajouter" : "Add"}
                    </span>
                  </div>
                )}
                {/* Hover overlay when avatar is set */}
                {avatarUrl && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
              />
              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => setAvatarUrl(null)}
                  className="mt-2 text-xs text-muted-foreground hover:text-red-500"
                >
                  {locale === "fr" ? "Retirer la photo" : "Remove photo"}
                </button>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                {locale === "fr" ? "JPG, PNG, WEBP ou GIF · max 5 Mo" : "JPG, PNG, WEBP or GIF · max 5MB"}
              </p>
              <input type="hidden" name="avatarUrl" value={avatarUrl ?? ""} />
            </div>

            {/* First name + Last name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  {locale === "fr" ? "Prénom" : "First name"} <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder={locale === "fr" ? "Awa" : "John"}
                    required
                    maxLength={60}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  {locale === "fr" ? "Nom" : "Last name"} <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder={locale === "fr" ? "Doe" : "Doe"}
                    required
                    maxLength={60}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">{t(locale, "auth.email")} <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="toi@exemple.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">{t(locale, "auth.password")} <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t(locale, "auth.passwordPlaceholder")}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password strength + requirements */}
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

                  <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
                    {[
                      { label: t(locale, "auth.passwordMin"), check: password.length >= 8 },
                      { label: t(locale, "auth.passwordUpper"), check: /[A-Z]/.test(password) },
                      { label: t(locale, "auth.passwordLower"), check: /[a-z]/.test(password) },
                      { label: t(locale, "auth.passwordNumber"), check: /[0-9]/.test(password) },
                      { label: t(locale, "auth.passwordSpecial"), check: /[^a-zA-Z0-9]/.test(password) },
                    ].map((req) => (
                      <li
                        key={req.label}
                        className={`flex items-center gap-1 text-xs ${
                          req.check ? "text-green-600" : "text-muted-foreground"
                        }`}
                      >
                        {req.check ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        {req.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {locale === "fr" ? "Confirmer le mot de passe" : "Confirm password"} <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-10 ${
                    confirmPassword.length > 0 && !passwordsMatch
                      ? "border-red-500"
                      : confirmPassword.length > 0 && passwordsMatch
                      ? "border-green-500"
                      : ""
                  }`}
                />
                {confirmPassword.length > 0 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {passwordsMatch ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </span>
                )}
              </div>
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-xs text-red-500">
                  {locale === "fr" ? "Les mots de passe ne correspondent pas." : "Passwords do not match."}
                </p>
              )}
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreed"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#2DD4BF]"
                  required
                />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  {locale === "fr" ? (
                    <>
                      J'accepte les{" "}
                      <Link href="/contact" className="text-[#2DD4BF] hover:underline">
                        Conditions d'utilisation
                      </Link>{" "}
                      et la{" "}
                      <Link href="/contact" className="text-[#2DD4BF] hover:underline">
                        Politique de confidentialité
                      </Link>{" "}
                      de Numeria Institute.
                    </>
                  ) : (
                    <>
                      I agree to Numeria Institute&apos;s{" "}
                      <Link href="/contact" className="text-[#2DD4BF] hover:underline">
                        Terms of Use
                      </Link>{" "}
                      and{" "}
                      <Link href="/contact" className="text-[#2DD4BF] hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </>
                  )}
                </span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={pending || !canSubmit}
              className="w-full bg-[#2DD4BF] text-[#1B2A4E] hover:bg-[#2DD4BF]/90 disabled:opacity-50 h-11 font-semibold"
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {locale === "fr" ? "Création..." : "Creating..."}
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  {t(locale, "auth.signupButton")}
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t(locale, "auth.alreadyAccount")}{" "}
            <Link href="/login" className="font-semibold text-[#2DD4BF] hover:underline">
              {t(locale, "auth.login")}
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              {t(locale, "auth.backHome")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
