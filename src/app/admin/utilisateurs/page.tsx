export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { updateUserRoleAction, deleteUserAction, verifyUserAction } from "./actions";
import { DeleteUserButton } from "./delete-user-button";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { enrollments: true, lessonProgress: true, badges: true } } },
    take: 100,
  });

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
                      <form action={updateUserRoleAction} className="inline">
                        <input type="hidden" name="userId" value={user.id} />
                        <select name="role" defaultValue={user.role} onChange={(e) => e.currentTarget.form?.requestSubmit()} className="rounded-md border border-border bg-background px-2 py-1 text-xs">
                          <option value="STUDENT">Étudiant</option>
                          <option value="STAFF">Staff</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </form>
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

