export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProfileAction, changePasswordAction } from "./actions";

export default async function ProfileEditPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, bio: true, avatarUrl: true, preferredLanguage: true },
  });
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pb-16 lg:pb-0">
        <div className="container mx-auto max-w-2xl px-4 py-8">
          <h1 className="text-2xl font-bold">Modifier mon profil</h1>

          <div className="mt-6 space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Informations</CardTitle></CardHeader>
              <CardContent>
                <form action={updateProfileAction} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nom</label>
                    <input name="name" defaultValue={user.name ?? ""} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email (non modifiable)</label>
                    <input value={user.email} disabled className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bio</label>
                    <textarea name="bio" defaultValue={user.bio ?? ""} rows={3} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Parle-nous de toi..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Langue préférée</label>
                    <select name="preferredLanguage" defaultValue={user.preferredLanguage} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <button type="submit" className="rounded-lg bg-[#1B2A4E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1B2A4E]/90">Enregistrer</button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Changer le mot de passe</CardTitle></CardHeader>
              <CardContent>
                <form action={changePasswordAction} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mot de passe actuel</label>
                    <input name="currentPassword" type="password" required className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nouveau mot de passe</label>
                    <input name="newPassword" type="password" required minLength={6} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirmer</label>
                    <input name="confirmPassword" type="password" required minLength={6} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                  </div>
                  <button type="submit" className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-muted">Changer le mot de passe</button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
