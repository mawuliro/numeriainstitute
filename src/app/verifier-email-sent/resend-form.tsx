"use client";

import { useState } from "react";
import { resendVerificationAction } from "@/app/(auth)/actions";

export function ResendForm({ email }: { email: string }) {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const handleResend = async () => {
    setSending(true);
    setMessage("");
    const formData = new FormData();
    formData.set("email", email);
    const result = await resendVerificationAction(formData);
    if ("success" in result) {
      setMessage(result.success);
    } else if ("error" in result) {
      setMessage(result.error);
    }
    setSending(false);
  };

  return (
    <div>
      <button
        onClick={handleResend}
        disabled={sending}
        className="text-sm text-[#2DD4BF] hover:underline disabled:opacity-50"
      >
        {sending ? "Envoi en cours..." : "Renvoyer l'email de vérification →"}
      </button>
      {message && (
        <p className="mt-2 text-xs text-white/60">{message}</p>
      )}
    </div>
  );
}
