export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Clock, CheckCircle2, XCircle, Send, Trash2 } from "lucide-react";
import { createInvitationAction, revokeInvitationAction, resendInvitationAction } from "./actions";

export default async function AdminInvitationsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; created?: string; revoked?: string; resent?: string; warning?: string; email?: string }>;
}) {
  const sp = await searchParams;

  // Fetch all invitations
  const invitations = await db.invitation.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      invitedByUser: {
        select: { firstName: true, lastName: true, name: true, email: true },
      },
      course: {
        select: { id: true, title: true },
      },
    },
    take: 100,
  });

  // Fetch courses for the dropdown
  const courses = await db.course.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, title: true },
    orderBy: { title: "asc" },
  });

  const now = new Date();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Invitations</h1>
        <p className="text-sm text-muted-foreground">
          {invitations.length} invitation(s) — invitation-only system
        </p>
      </div>

      {/* Success/error banners */}
      {sp.created && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300">
          ✅ Invitation créée — l'email a été envoyé avec succès.
        </div>
      )}
      {sp.warning === "email-failed" && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
          ⚠️ Invitation créée mais l'email n'a pas pu être envoyé (Brevo non configuré).
          Le lien d'inscription est dans la console du serveur. En production, configurez BREVO_API_KEY.
        </div>
      )}
      {sp.revoked && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">
          🗑️ Invitation révoquée.
        </div>
      )}
      {sp.resent && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300">
          📧 Email d'invitation renvoyé.
        </div>
      )}
      {sp.error === "invalid-email" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          ❌ Email invalide.
        </div>
      )}
      {sp.error === "user-exists" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          ❌ Un compte existe déjà avec l'email {sp.email}.
        </div>
      )}
      {sp.error === "already-invited" && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
          ⚠️ Une invitation en attente existe déjà pour {sp.email}. Utilise "Renvoyer" ci-dessous.
        </div>
      )}

      {/* Create new invitation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Mail className="h-5 w-5 text-[#2DD4BF]" />
            Inviter une personne
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createInvitationAction} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email de l'invité(e) *</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="etudiant@exemple.com"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cours (optionnel)</label>
                <select
                  name="courseId"
                  defaultValue=""
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="">— Pas de cours spécifique —</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message personnalisé (optionnel)</label>
              <textarea
                name="message"
                rows={2}
                maxLength={500}
                placeholder="Bonjour, tu es invité(e) à rejoindre Numeria Institute..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <Button type="submit" className="bg-[#1B2A4E] hover:bg-[#1B2A4E]/90">
              <Send className="h-4 w-4" />
              Envoyer l'invitation
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Pending invitations list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invitations envoyées</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Cours</th>
                  <th className="px-4 py-3 text-left font-medium">Statut</th>
                  <th className="px-4 py-3 text-left font-medium">Expiry</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invitations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      Aucune invitation envoyée pour le moment.
                    </td>
                  </tr>
                ) : (
                  invitations.map((inv) => {
                    const isExpired = inv.expiresAt < now && !inv.usedAt;
                    const isUsed = !!inv.usedAt;
                    const isPending = !inv.usedAt && inv.expiresAt > now;

                    return (
                      <tr key={inv.id} className="border-b hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{inv.email}</p>
                            <p className="text-xs text-muted-foreground">
                              par {inv.invitedByUser.firstName ?? ""} {inv.invitedByUser.lastName ?? ""} · {inv.invitedByUser.email}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {inv.course ? (
                            <Badge variant="outline">{inv.course.title}</Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isUsed ? (
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle2 className="mr-1 h-3 w-3" /> Utilisée
                            </Badge>
                          ) : isExpired ? (
                            <Badge variant="destructive">
                              <XCircle className="mr-1 h-3 w-3" /> Expirée
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <Clock className="mr-1 h-3 w-3" /> En attente
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {new Date(inv.expiresAt).toLocaleDateString("fr-FR", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {isPending && (
                              <form action={resendInvitationAction} className="inline">
                                <input type="hidden" name="invitationId" value={inv.id} />
                                <button
                                  type="submit"
                                  className="rounded-md p-1.5 text-[#2DD4BF] hover:bg-[#2DD4BF]/10"
                                  title="Renvoyer l'email"
                                >
                                  <Send className="h-4 w-4" />
                                </button>
                              </form>
                            )}
                            {!isUsed && (
                              <form action={revokeInvitationAction} className="inline">
                                <input type="hidden" name="invitationId" value={inv.id} />
                                <button
                                  type="submit"
                                  className="rounded-md p-1.5 text-red-500 hover:bg-red-50"
                                  title="Révoquer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </form>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
