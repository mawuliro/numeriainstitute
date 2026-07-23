"use client";

import { useActionState, useRef, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, User } from "lucide-react";
import { toast } from "sonner";

type Locale = string;
type FormState = { error?: string; success?: string } | null;

export function ProfileForm({
  action,
  initialFirstName,
  initialLastName,
  initialBio,
  initialLanguage,
  initialAvatarUrl,
  locale,
  error,
  success,
}: {
  action: (formData: FormData) => Promise<{ error?: string; success?: string } | void>;
  initialFirstName: string;
  initialLastName: string;
  initialBio: string;
  initialLanguage: string;
  initialAvatarUrl: string | null;
  locale: Locale;
  error?: string;
  success?: string;
}) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const initial = (firstName[0] ?? lastName[0] ?? "?").toUpperCase();

  const initialState: FormState = error || success ? { error, success } : null;
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    async (_prev, formData) => {
      const res = await action(formData);
      if (!res) return null;
      return { error: res.error, success: res.success };
    },
    initialState,
  );

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
        toast.success("Photo mise à jour !");
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

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300">
          {state.success}
        </div>
      )}

      {/* Avatar */}
      <div className="flex items-center gap-4">
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
          className={`relative group cursor-pointer flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition-all ${
            dragActive
              ? "border-[#2DD4BF] bg-[#2DD4BF]/10 scale-105"
              : avatarUrl
              ? "border-transparent"
              : "border-muted-foreground/30 hover:border-[#2DD4BF]/50 hover:bg-muted/50"
          }`}
          aria-label="Changer la photo de profil"
        >
          {avatarUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
          ) : avatarUploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              {firstName || lastName ? (
                <span className="text-xl font-bold text-[#1B2A4E] dark:text-white">{initial}</span>
              ) : (
                <Camera className="h-6 w-6" />
              )}
            </div>
          )}
          {avatarUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-5 w-5 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">
            {locale === "fr" ? "Photo de profil" : "Profile photo"}
          </p>
          <div className="mt-1 flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-3.5 w-3.5" />
              {locale === "fr" ? "Changer" : "Change"}
            </Button>
            {avatarUrl && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setAvatarUrl(null)}
                className="text-red-500 hover:text-red-600"
              >
                {locale === "fr" ? "Retirer" : "Remove"}
              </Button>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {locale === "fr" ? "JPG, PNG, WEBP · max 5 Mo" : "JPG, PNG, WEBP · max 5MB"}
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleAvatarUpload(file);
          }}
          className="hidden"
        />
        <input type="hidden" name="avatarUrl" value={avatarUrl ?? ""} />
      </div>

      {/* Names */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium">
            {locale === "fr" ? "Prénom" : "First name"}
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="firstName"
              name="firstName"
              defaultValue={initialFirstName}
              maxLength={60}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium">
            {locale === "fr" ? "Nom" : "Last name"}
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="lastName"
              name="lastName"
              defaultValue={initialLastName}
              maxLength={60}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio" className="text-sm font-medium">
          {locale === "fr" ? "Bio" : "Bio"}
        </Label>
        <textarea
          name="bio"
          id="bio"
          defaultValue={initialBio}
          rows={3}
          maxLength={500}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder={locale === "fr" ? "Parle-nous de toi..." : "Tell us about you..."}
        />
      </div>

      {/* Language */}
      <div className="space-y-2">
        <Label htmlFor="preferredLanguage" className="text-sm font-medium">
          {locale === "fr" ? "Langue" : "Language"}
        </Label>
        <select
          name="preferredLanguage"
          id="preferredLanguage"
          defaultValue={initialLanguage}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[#1B2A4E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1B2A4E]/90 disabled:opacity-50"
      >
        {pending ? "..." : locale === "fr" ? "Enregistrer" : "Save"}
      </Button>
    </form>
  );
}
