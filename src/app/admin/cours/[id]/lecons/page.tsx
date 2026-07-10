export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, FileText, Box, ToggleLeft, ListChecks, PenLine, FlaskConical } from "lucide-react";
import { createModuleAction, createLessonAction } from "./actions";

export default async function AdminLessonsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await db.course.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            include: {
              blocks: { orderBy: { order: "asc" } },
            },
          },
        },
      },
    },
  });

  if (!course) notFound();

  const blockTypeIcons: Record<string, typeof FileText> = {
    TEXT: FileText,
    SANDBOX: Box,
    MCQ: ListChecks,
    FILL_BLANK: PenLine,
    TRUE_FALSE: ToggleLeft,
    INTERACTIVE_LAB: FlaskConical,
  };

  const blockTypeLabels: Record<string, string> = {
    TEXT: "Texte",
    SANDBOX: "Sandbox",
    MCQ: "QCM",
    FILL_BLANK: "À trous",
    TRUE_FALSE: "Vrai/Faux",
    INTERACTIVE_LAB: "Lab interactif",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href={`/admin/cours/${course.id}`} className="text-sm text-muted-foreground hover:text-foreground">
          ← {course.title}
        </Link>
        <h1 className="mt-1 text-2xl font-bold">Gérer les leçons</h1>
        <p className="text-sm text-muted-foreground">
          Ajoute, modifie et organise les modules et leçons du cours
        </p>
      </div>

      {/* Add module form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ajouter un module</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createModuleAction} className="flex gap-3">
            <input type="hidden" name="courseId" value={course.id} />
            <input
              name="title"
              required
              placeholder="Titre du module (ex: Cinématique)"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-lg bg-[#1B2A4E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1B2A4E]/90"
            >
              <Plus className="h-4 w-4" />
              Ajouter
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Modules & Lessons */}
      {course.modules.map((module, modIdx) => (
        <Card key={module.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                  {modIdx + 1}
                </span>
                <CardTitle className="text-base">{module.title}</CardTitle>
              </div>
              <Badge variant="secondary">{module.lessons.length} leçons</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add lesson form */}
            <form action={createLessonAction} className="flex gap-2 rounded-lg border border-dashed p-3">
              <input type="hidden" name="courseId" value={course.id} />
              <input type="hidden" name="moduleId" value={module.id} />
              <input
                name="title"
                required
                placeholder="Titre de la leçon"
                className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm"
              />
              <input
                name="slug"
                required
                placeholder="slug"
                className="w-32 rounded-md border border-border bg-background px-3 py-1.5 text-sm"
              />
              <input
                name="minutes"
                type="number"
                defaultValue={30}
                className="w-20 rounded-md border border-border bg-background px-3 py-1.5 text-sm"
              />
              <button
                type="submit"
                className="rounded-md bg-[#2DD4BF] px-3 py-1.5 text-sm font-semibold text-[#1B2A4E]"
              >
                + Leçon
              </button>
            </form>

            {/* Lessons */}
            {module.lessons.map((lesson, lesIdx) => (
              <div key={lesson.id} className="rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-xs">
                    {lesIdx + 1}
                  </span>
                  <Link
                    href={`/admin/cours/${course.id}/lecons/${lesson.id}`}
                    className="flex-1 text-sm font-medium hover:text-[#2DD4BF]"
                  >
                    {lesson.title}
                  </Link>
                  <Badge variant="outline">{lesson.estimatedMinutes} min</Badge>
                  <Badge variant="outline">{lesson.blocks.length} blocs</Badge>
                </div>

                {/* Block list preview */}
                {lesson.blocks.length > 0 && (
                  <div className="mt-2 ml-9 flex flex-wrap gap-1.5">
                    {lesson.blocks.map((block) => {
                      const Icon = blockTypeIcons[block.blockType] ?? FileText;
                      return (
                        <span
                          key={block.id}
                          className="flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs"
                        >
                          <Icon className="h-3 w-3" />
                          {blockTypeLabels[block.blockType] ?? block.blockType}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
