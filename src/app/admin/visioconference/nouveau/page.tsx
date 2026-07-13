export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createMeetingAction } from "../actions";

export default function NewMeetingPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Planifier une réunion</h1>
        <p className="text-sm text-muted-foreground">Créer une nouvelle visioconférence</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Détails</CardTitle></CardHeader>
        <CardContent>
          <form action={createMeetingAction} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Titre *</label>
              <input
                name="title"
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                placeholder="Ex: Cours de mécanique — Session 1"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description (optionnel)</label>
              <textarea
                name="description"
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                placeholder="Description de la réunion..."
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date et heure de début *</label>
                <input
                  name="startTime"
                  type="datetime-local"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Durée (heures)</label>
                <input
                  name="duration"
                  type="number"
                  defaultValue={2}
                  min={1}
                  max={8}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="rounded-lg bg-[#1B2A4E] px-6 py-2 text-sm font-semibold text-white hover:bg-[#1B2A4E]/90"
              >
                Créer la réunion
              </button>
              <a
                href="/admin/visioconference"
                className="rounded-lg border px-6 py-2 text-sm font-medium hover:bg-muted"
              >
                Annuler
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
