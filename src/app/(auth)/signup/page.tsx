export const dynamic = "force-dynamic";

import { getLocale, type Locale } from "@/lib/i18n";
import { SignupForm } from "./signup-form";

export default async function SignupPage() {
  const locale = await getLocale();
  return <SignupForm locale={locale} />;
}
