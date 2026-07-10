export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { updatePostAction, deletePostAction } from "../actions";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await db.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Modifier l'article</h1>
        <Badge variant={post.isPublished ? "default" : "secondary"} className="mt-1">
          {post.isPublished ? "Publié" : "Brouillon"}
        </Badge>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Contenu</CardTitle></CardHeader>
        <CardContent>
          <form action={updatePostAction} className="space-y-4">
            <input type="hidden" name="id" value={post.id} />
            <div className="space-y-2">
              <label className="text-sm font-medium">Titre</label>
              <input name="title" defaultValue={post.title} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie</label>
                <input name="category" defaultValue={post.category} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Publié ?</label>
                <label className="flex items-center gap-2 pt-2">
                  <input type="checkbox" name="isPublished" defaultChecked={post.isPublished} className="h-4 w-4 accent-[#2DD4BF]" />
                  <span className="text-sm">Publier</span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Extrait</label>
              <input name="excerpt" defaultValue={post.excerpt ?? ""} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contenu (Markdown + LaTeX)</label>
              <textarea name="content" rows={12} defaultValue={post.content} className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="rounded-lg bg-[#1B2A4E] px-6 py-2 text-sm font-semibold text-white hover:bg-[#1B2A4E]/90">Enregistrer</button>
              <a href="/admin/blog" className="rounded-lg border px-6 py-2 text-sm font-medium hover:bg-muted">Annuler</a>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Delete */}
      <Card className="border-red-200">
        <CardContent className="p-4">
          <form action={deletePostAction} className="flex items-center justify-between">
            <input type="hidden" name="id" value={post.id} />
            <p className="text-sm text-red-600">Supprimer définitivement cet article</p>
            <button type="submit" className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600">Supprimer</button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
