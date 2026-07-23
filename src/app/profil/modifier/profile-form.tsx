"use client";

import { useActionState } from "react";

type Locale = string;
type FormState = { error?: string; success?: string } | null;

export function ProfileForm({
  action,
  initialName,
  initialBio,
  initialLanguage,
  locale,
  error,
  success,
}: {
  action: (formData: FormData) => Promise<{ error?: string; success?: string } | void>;
  initialName: string;
  initialBio: string;
  initialLanguage: string;
  locale: Locale;
  error?: string;
  success?: string;
}) {
  const initialState: FormState = error || success ? { error, success } : null;
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    async (_prev, formData) => {
      const res = await action(formData);
      if (!res) return null;
      return { error: res.error, success: res.success };
    },
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {state.success}
        </div>
      )}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          {locale === "fr" ? "Nom" : "Name"}
        </label>
        <input
          name="name"
          defaultValue={initialName}
          maxLength={80}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">
          {locale === "fr" ? "Email (non modifiable)" : "Email (not editable)"}
        </label>
        <input
          value=""
          disabled
          placeholder="(hidden for security)"
          className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">
          {locale === "fr" ? "Bio" : "Bio"}
        </label>
        <textarea
          name="bio"
          defaultValue={initialBio}
          rows={3}
          maxLength={500}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder={locale === "fr" ? "Parle-nous de toi..." : "Tell us about you..."}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">
          {locale === "fr" ? "Langue" : "Language"}
        </label>
        <select
          name="preferredLanguage"
          defaultValue={initialLanguage}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[#1B2A4E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1B2A4E]/90 disabled:opacity-50"
      >
        {pending ? "..." : (locale === "fr" ? "Enregistrer" : "Save")}
      </button>
    </form>
  );
}
