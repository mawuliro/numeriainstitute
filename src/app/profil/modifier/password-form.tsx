"use client";

import { useActionState } from "react";

type Locale = string;
type FormState = { error?: string; success?: string } | null;

export function PasswordForm({
  action,
  locale,
  error,
  success,
}: {
  action: (formData: FormData) => Promise<{ error?: string; success?: string } | void>;
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
          {locale === "fr" ? "Mot de passe actuel" : "Current password"}
        </label>
        <input
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">
          {locale === "fr" ? "Nouveau mot de passe" : "New password"}
        </label>
        <input
          name="newPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">
          {locale === "fr" ? "Confirmer" : "Confirm"}
        </label>
        <input
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-muted disabled:opacity-50"
      >
        {pending ? "..." : (locale === "fr" ? "Changer le mot de passe" : "Change password")}
      </button>
    </form>
  );
}
