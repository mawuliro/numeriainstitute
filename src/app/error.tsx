"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Copy } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    console.error("Page error:", error);
    setMessage(error?.message ?? String(error));
  }, [error]);

  const copyDigest = () => {
    if (error?.digest) {
      navigator.clipboard.writeText(error.digest);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1B2A4E] to-[#0d1530] px-4 py-8">
      <div className="max-w-lg text-center">
        <AlertTriangle className="mx-auto mb-6 h-16 w-16 text-[#C9A227]" />
        <h1 className="text-2xl font-bold text-white">
          Oups, quelque chose s'est mal passé
        </h1>
        <p className="mt-3 text-sm text-white/60">
          Une erreur inattendue s'est produite. Ce n'est pas de ta faute —
          nos équipes ont été notifiées.
        </p>

        {/* Debug details — only show on non-production OR if message present */}
        {(message || error?.digest) && (
          <div className="mt-6 rounded-lg border border-white/10 bg-black/30 p-4 text-left">
            <p className="text-xs font-semibold uppercase text-white/40">
              Détails techniques
            </p>
            <pre className="mt-2 whitespace-pre-wrap break-all text-xs text-red-300">
              {message}
            </pre>
            {error?.digest && (
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] text-white/40">
                  digest: {error.digest}
                </span>
                <button
                  onClick={copyDigest}
                  className="flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-[10px] text-white/60 hover:bg-white/10"
                >
                  <Copy className="h-3 w-3" />
                  {copied ? "Copié !" : "Copier"}
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={reset}
            className="bg-[#2DD4BF] text-[#1B2A4E] hover:bg-[#2DD4BF]/80"
          >
            Réessayer
          </Button>
          <a
            href="/"
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}
