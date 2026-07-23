export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProfileAction, changePasswordAction } from "./actions";
import { getLocale, t } from "@/lib/i18n";
import { ProfileForm } from "./profile-form";
import { PasswordForm } from "./password-form";

export default async function ProfileEditPage({
  searchParams,
}: {
  searchParams: Promise<{ profileError?: string; profileSuccess?: string; pwError?: string; pwSuccess?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const locale = await getLocale();
  const sp = await searchParams;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, firstName: true, lastName: true, email: true, bio: true, avatarUrl: true, preferredLanguage: true },
  });
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pb-16 lg:pb-0">
        <div className="container mx-auto max-w-2xl px-4 py-8">
          <h1 className="text-2xl font-bold">
            {t(locale, "profile.editProfile")}
          </h1>

          <div className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {t(locale, "profile.accountInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileForm
                  action={updateProfileAction}
                  initialFirstName={user.firstName ?? ""}
                  initialLastName={user.lastName ?? ""}
                  initialBio={user.bio ?? ""}
                  initialLanguage={user.preferredLanguage}
                  initialAvatarUrl={user.avatarUrl}
                  locale={locale}
                  error={sp.profileError}
                  success={sp.profileSuccess}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {t(locale, "profile.changePassword")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PasswordForm
                  action={changePasswordAction}
                  locale={locale}
                  error={sp.pwError}
                  success={sp.pwSuccess}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
