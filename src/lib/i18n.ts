import { cookies } from "next/headers";
import type { Locale } from "./i18n-shared";

// Re-export everything that is safe for both server and client use.
export { type Locale, translations, t } from "./i18n-shared";

/**
 * Server-only helper: reads the locale from the `locale` cookie.
 * Must be called from a Server Component or Server Action.
 */
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value;
  return locale === "en" ? "en" : "fr";
}
