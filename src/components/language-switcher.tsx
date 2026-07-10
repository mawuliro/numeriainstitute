"use client";

import { useState } from "react";
import { Globe } from "lucide-react";

export function LanguageSwitcher({ currentLocale }: { currentLocale: "fr" | "en" }) {
  const [open, setOpen] = useState(false);

  const switchTo = (locale: "fr" | "en") => {
    document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; sameSite=lax`;
    window.location.reload();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
        aria-label="Language"
      >
        <Globe className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-36 rounded-xl border border-border bg-card shadow-xl">
          <button
            onClick={() => switchTo("fr")}
            className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-muted ${
              currentLocale === "fr" ? "font-bold text-[#2DD4BF]" : ""
            }`}
          >
            🇫🇷 Français
          </button>
          <button
            onClick={() => switchTo("en")}
            className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-muted ${
              currentLocale === "en" ? "font-bold text-[#2DD4BF]" : ""
            }`}
          >
            🇬🇧 English
          </button>
        </div>
      )}
    </div>
  );
}
