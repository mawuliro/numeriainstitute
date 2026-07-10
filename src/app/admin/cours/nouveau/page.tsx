export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";

async function createCourseAction(formData: FormData) {
  "use server";
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const shortDescription = formData.get("shortDescription") as string;
  const category = formData.get("category") as string;
  const level = formData.get("level") as string;
  const estimatedHours = parseInt(formData.get("estimatedHours") as string) || 40;

  await db.course.create({
    data: {
      title,
      slug,
      description,
      shortDescription,
      category,
      level: level as "DEBUTANT" | "INTERMEDIAIRE" | "AVANCE",
      estimatedHours,
      price: 0,
      isFree: true,
      status: "PUBLISHED",
      language: "fr",
    },
  });

  redirect("/admin/cours");
}

export default function NewCoursePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nouveau cours</h1>
        <p className="text-sm text-muted-foreground">Créer un nouveau cours</p>
      </div>

      <form action={createCourseAction} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Titre *</label>
          <input
            name="title"
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            placeholder="Ex: Mécanique Classique"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Slug (URL) *</label>
          <input
            name="slug"
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            placeholder="ex: mecanique-classique"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description courte</label>
          <input
            name="shortDescription"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            placeholder="Une phrase de résumé"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description complète *</label>
          <textarea
            name="description"
            required
            rows={4}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            placeholder="Description détaillée du cours"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Catégorie</label>
            <select name="category" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
              <option value="physique">Physique</option>
              <option value="mathematiques">Mathématiques</option>
              <option value="python">Python</option>
              <option value="informatique">Informatique</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Niveau</label>
            <select name="level" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
              <option value="DEBUTANT">Débutant</option>
              <option value="INTERMEDIAIRE">Intermédiaire</option>
              <option value="AVANCE">Avancé</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Heures</label>
            <input
              name="estimatedHours"
              type="number"
              defaultValue={40}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="rounded-lg bg-[#1B2A4E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1B2A4E]/90"
          >
            Créer le cours
          </button>
          <a
            href="/admin/cours"
            className="rounded-lg border px-6 py-2.5 text-sm font-medium hover:bg-muted"
          >
            Annuler
          </a>
        </div>
      </form>
    </div>
  );
}
