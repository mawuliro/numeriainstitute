export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { updateUserRoleAction, deleteUserAction, verifyUserAction } from "./actions";
import { DeleteUserButton } from "./delete-user-button";
import { RoleSelect } from "./role-select";

export default async function AdminUsersPage() {
  let users: Array<{
    id: string;
    firstName: string | null;
    lastName: string | null;
    name: string | null;
    email: string;
    avatarUrl: string | null;
    role: "STUDENT" | "MENTOR" | "STAFF" | "ADMIN";
    isVerified: boolean;
    _count: { enrollments: number; lessonProgress: number; badges: number };
  }> = [];

  let loadError: string | null = null;

  try {
    users = await db.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { enrollments: true, lessonProgress: true, badges: true } },
      },
      take: 100,
    });
  } catch (err) {
    console.error("[admin/utilisateurs] DB error:", err);
    loadError = err instanceof Error
      ? `${err.name}: ${err.message}\n${err.stack ?? ""}`
      : String(err);
  }

  // If the DB query failed, render the error inline (not via throw → error.tsx)
  // so the actual message is visible to the admin.
  if (loadError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Utilisateurs</h1>
          <p className="text-sm text-muted-foreground">Erreur de chargement</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                Impossible de charger les utilisateurs
              </p>
              <pre className="mt-3 whitespace-pre-wrap break-all text-xs text-red-600 dark:text-red-400">
                {loadError}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Utilisateurs</h1><p className="text-sm text-muted-foreground">{users.length} utilisateurs actifs</p></div>
      <Card><CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50"><tr>
              <th className="px-4 py-3 text-left font-medium">Utilisateur</th>
              <th className="px-4 py-3 text-left font-medium">Rôle</th>
              <th className="px-4 py-3 text-left font-medium">Cours</th>
              <th className="px-4 py-3 text-left font-medium">Badges</th>
              <th className="px-4 py-3 text-left font-medium">Statut</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {users.map((user) => {
                const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.name || user.email;
                const initial = (displayName[0] ?? "?").toUpperCase();
                return (
                  <tr key={user.id} className="border-b hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={user.avatarUrl} alt={displayName} className="h-8 w-8 rounded-full object-cover" />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{initial}</div>
                        )}
                        <div><p className="font-medium">{displayName}</p><p className="text-xs text-muted-foreground">{user.email}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <RoleSelect
                        userId={user.id}
                        defaultRole={user.role}
                        action={updateUserRoleAction}
                      />
                    </td>
                    <td className="px-4 py-3">{user._count.enrollments}</td>
                    <td className="px-4 py-3">🏆 {user._count.badges}</td>
                    <td className="px-4 py-3">
                      {user.isVerified ? <Badge className="bg-green-100 text-green-700">✓ Vérifié</Badge> : (
                        <form action={verifyUserAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <button type="submit" className="text-xs text-amber-600 hover:underline">Vérifier</button>
                        </form>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <form action={deleteUserAction} className="inline">
                        <input type="hidden" name="userId" value={user.id} />
                        <DeleteUserButton />
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent></Card>
    </div>
  );
}

