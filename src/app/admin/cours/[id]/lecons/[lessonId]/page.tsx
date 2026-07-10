export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Box, ListChecks, PenLine, ToggleLeft, Trash2 } from "lucide-react";
import {
  addTextBlockAction,
  addSandboxBlockAction,
  addMcqBlockAction,
  deleteBlockAction,
} from "../actions";

const BLOCK_TYPES = [
  { type: "TEXT", label: "Texte", icon: FileText, color: "text-blue-500" },
  { type: "SANDBOX", label: "Sandbox Python", icon: Box, color: "text-green-500" },
  { type: "MCQ", label: "QCM", icon: ListChecks, color: "text-purple-500" },
];

export default async function AdminLessonEditorPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id: courseId, lessonId } = await params;

  const lesson = await db.courseLesson.findUnique({
    where: { id: lessonId },
    include: {
      blocks: { orderBy: { order: "asc" } },
      module: true,
    },
  });

  if (!lesson) notFound();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/admin/cours/${courseId}/lecons`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Leçons
        </Link>
        <h1 className="mt-1 text-2xl font-bold">{lesson.title}</h1>
        <div className="mt-1 flex gap-2">
          <Badge variant="outline">{lesson.estimatedMinutes} min</Badge>
          <Badge variant="outline">{lesson.blocks.length} blocs</Badge>
          <Badge variant="outline">{lesson.isFreePreview ? "Gratuit" : "Payant"}</Badge>
        </div>
      </div>

      {/* Existing blocks */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Blocs de contenu</h2>
        {lesson.blocks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              Aucun bloc. Ajoute du contenu ci-dessous.
            </CardContent>
          </Card>
        ) : (
          lesson.blocks.map((block, i) => (
            <Card key={block.id}>
              <CardContent className="flex items-center gap-3 p-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-xs font-bold">
                  {i + 1}
                </span>
                <Badge variant="outline">{block.blockType}</Badge>
                <div className="flex-1 truncate text-sm text-muted-foreground">
                  {block.blockType === "TEXT" && block.textContent?.substring(0, 80) + "..."}
                  {block.blockType === "SANDBOX" && block.sandboxTitle}
                  {block.blockType === "MCQ" && "QCM"}
                  {block.blockType === "FILL_BLANK" && "À trous"}
                  {block.blockType === "TRUE_FALSE" && "Vrai/Faux"}
                </div>
                <form action={deleteBlockAction}>
                  <input type="hidden" name="blockId" value={block.id} />
                  <input type="hidden" name="lessonId" value={lessonId} />
                  <input type="hidden" name="courseId" value={courseId} />
                  <button
                    type="submit"
                    className="rounded-md p-1.5 text-red-500 hover:bg-red-50"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </form>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add block forms */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Ajouter un bloc</h2>

        {/* Text block */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4 text-blue-500" />
              Bloc texte (Markdown + LaTeX)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={addTextBlockAction} className="space-y-3">
              <input type="hidden" name="lessonId" value={lessonId} />
              <input type="hidden" name="courseId" value={courseId} />
              <textarea
                name="content"
                rows={6}
                required
                placeholder="# Titre&#10;&#10;Texte avec **gras** et $LaTeX$&#10;&#10;$$E = mc^2$$"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm"
              />
              <button
                type="submit"
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
              >
                + Ajouter le texte
              </button>
            </form>
          </CardContent>
        </Card>

        {/* Sandbox block */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Box className="h-4 w-4 text-green-500" />
              Sandbox Python
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={addSandboxBlockAction} className="space-y-3">
              <input type="hidden" name="lessonId" value={lessonId} />
              <input type="hidden" name="courseId" value={courseId} />
              <input
                name="title"
                required
                placeholder="Titre de la simulation"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <textarea
                name="code"
                rows={6}
                required
                placeholder={"import matplotlib.pyplot as plt\nimport numpy as np\n\n# Ton code ici\nplt.savefig('plot.png')"}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm"
              />
              <button
                type="submit"
                className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600"
              >
                + Ajouter la sandbox
              </button>
            </form>
          </CardContent>
        </Card>

        {/* MCQ block */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ListChecks className="h-4 w-4 text-purple-500" />
              QCM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={addMcqBlockAction} className="space-y-3">
              <input type="hidden" name="lessonId" value={lessonId} />
              <input type="hidden" name="courseId" value={courseId} />
              <input
                name="title"
                required
                placeholder="Titre du QCM"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <textarea
                name="question"
                rows={2}
                required
                placeholder="Question (Markdown + LaTeX supporté)"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <textarea
                name="choices"
                rows={5}
                required
                placeholder={"Une réponse fausse\n*La bonne réponse (préfixe avec *)\nUne autre fausse"}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <input
                name="explanation"
                placeholder="Explication (optionnel)"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-lg bg-purple-500 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-600"
              >
                + Ajouter le QCM
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
