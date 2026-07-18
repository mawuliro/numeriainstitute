"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1B2A4E] to-[#0d1530] px-4">
      <div className="max-w-md text-center">
        <AlertTriangle className="mx-auto mb-6 h-16 w-16 text-[#C9A227]" />
        <h1 className="text-2xl font-bold text-white">
          Oups, quelque chose s'est mal passé
        </h1>
        <p className="mt-3 text-sm text-white/60">
          Une erreur inattendue s'est produite. Ce n'est pas de ta faute —
          nos équipes ont été notifiées.
        </p>
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
