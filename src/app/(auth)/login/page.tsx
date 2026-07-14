export const dynamic = "force-dynamic";

import { getLocale, type Locale } from "@/lib/i18n";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const locale = await getLocale();
  return <LoginForm locale={locale} />;
}
