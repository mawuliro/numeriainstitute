"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

type SignOutFn = () => Promise<void>;

export function SignOutButton({
  label,
  signOut,
}: {
  label: string;
  signOut: SignOutFn;
}) {
  // signOut is a server action passed from the parent (server component),
  // so the form just references it directly — no inline "use server" allowed
  // in a client component.
  return (
    <form action={signOut}>
      <Button type="submit" variant="ghost" size="sm" className="text-sm">
        <span className="hidden sm:inline">{label}</span>
        <LogOut className="h-4 w-4 sm:hidden" />
      </Button>
    </form>
  );
}
