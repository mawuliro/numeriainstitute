"use client";

import { useState } from "react";

type Role = "STUDENT" | "MENTOR" | "STAFF" | "ADMIN";

/**
 * Client component for the role select — needed because <select onChange>
 * cannot be passed from a Server Component.
 */
export function RoleSelect({
  userId,
  defaultRole,
  action,
}: {
  userId: string;
  defaultRole: Role;
  action: (formData: FormData) => Promise<void>;
}) {
  const [pending, setPending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const form = e.currentTarget.form;
    if (!form) return;
    setPending(true);
    // Submit the form via requestSubmit (triggers the server action)
    form.requestSubmit();
    // Reset pending after 1.5s (best-effort — server action doesn't return here)
    setTimeout(() => setPending(false), 1500);
  };

  return (
    <form action={action} className="inline">
      <input type="hidden" name="userId" value={userId} />
      <select
        name="role"
        defaultValue={defaultRole}
        onChange={handleChange}
        disabled={pending}
        className="rounded-md border border-border bg-background px-2 py-1 text-xs disabled:opacity-50"
      >
        <option value="STUDENT">Étudiant</option>
        <option value="MENTOR">Mentor</option>
        <option value="STAFF">Staff</option>
        <option value="ADMIN">Admin</option>
      </select>
    </form>
  );
}
