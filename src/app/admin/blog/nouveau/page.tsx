export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPostAction } from "../actions";

export default function NewPostPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nouvel article</h1>
        <p className="text-sm text-muted-foreground">Créer un nouvel article de blog</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Contenu</CardTitle></CardHeader>
        <CardContent>
          <form action={createPostAction} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Titre *</label>
              <input name="title" required className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug *</label>
              <input name="slug" required placeholder="mon-article" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie</label>
                <input name="category" defaultValue="General" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Publié ?</label>
                <label className="flex items-center gap-2 pt-2">
                  <input type="checkbox" name="isPublished" className="h-4 w-4 accent-[#2DD4BF]" />
                  <span className="text-sm">Publier immédiatement</span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Extrait</label>
              <input name="excerpt" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Résumé court" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contenu (Markdown + LaTeX) *</label>
              <textarea name="content" required rows={12} className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm" placeholder={"# Titre\n\nTexte avec **gras** et $LaTeX$"} />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="rounded-lg bg-[#1B2A4E] px-6 py-2 text-sm font-semibold text-white hover:bg-[#1B2A4E]/90">Créer</button>
              <a href="/admin/blog" className="rounded-lg border px-6 py-2 text-sm font-medium hover:bg-muted">Annuler</a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
