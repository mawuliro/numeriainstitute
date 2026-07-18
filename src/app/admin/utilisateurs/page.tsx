export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Trash2, UserCheck, Crown, Star } from "lucide-react";
import { updateUserRoleAction, deleteUserAction, verifyUserAction } from "./actions";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { enrollments: true, lessonProgress: true, badges: true } } },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Utilisateurs</h1><p className="text-sm text-muted-foreground">{users.length} utilisateurs</p></div>
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
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{(user.name ?? user.email)[0].toUpperCase()}</div>
                      <div><p className="font-medium">{user.name ?? "Sans nom"}</p><p className="text-xs text-muted-foreground">{user.email}</p></div>
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
                      <button type="submit" className="rounded-md p-1.5 text-red-500 hover:bg-red-50" title="Supprimer" onclick="return confirm('Supprimer cet utilisateur ?')">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent></Card>
    </div>
  );
}
