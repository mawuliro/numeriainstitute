"use client";

import { useSyncExternalStore } from "react";
import { type Locale, t as tShared, translations } from "./i18n-shared";

export type { Locale } from "./i18n-shared";
export { translations } from "./i18n-shared";

/**
 * Read the locale directly from the `locale` cookie on the client.
 * Returns "fr" by default when the cookie is not present.
 */
export function getLocaleClient(): Locale {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/(?:^|;\s*)locale=(fr|en)/);
    if (match) return match[1] as Locale;
  }
  return "fr";
}

const emptySubscribe = () => () => {};

/**
 * React hook that returns the current locale, kept in sync with
 * the `locale` cookie. On the server it returns "fr" (the default)
 * to match the initial client render and avoid hydration mismatches.
 */
export function useLocale(): Locale {
  return useSyncExternalStore(
    emptySubscribe,
    getLocaleClient,
    () => "fr" as Locale,
  );
}

export function t(locale: Locale, key: string): string {
  return tShared(locale, key);
}
