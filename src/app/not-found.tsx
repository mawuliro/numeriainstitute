import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1B2A4E] to-[#0d1530] px-4">
      <div className="max-w-md text-center">
        <Compass className="mx-auto mb-6 h-20 w-20 text-[#2DD4BF] animate-pulse" />
        <h1 className="text-6xl font-bold text-white">404</h1>
        <h2 className="mt-2 text-xl font-semibold text-white/80">
          Page introuvable
        </h2>
        <p className="mt-3 text-sm text-white/50">
          La page que tu cherches n'existe pas ou a été déplacée.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-xl bg-[#2DD4BF] px-6 py-3 text-sm font-semibold text-[#1B2A4E] transition-transform hover:scale-105"
          >
            ← Retour à l'accueil
          </Link>
          <Link
            href="/cours"
            className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Voir les cours
          </Link>
        </div>
      </div>
    </div>
  );
}
