export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Clock } from "lucide-react";

export default async function AdminCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await db.course.findUnique({
    where: { id },
    include: {
      modules: {
        where: { isActive: true },
        orderBy: { order: "asc" },
        include: {
          lessons: {
            where: { isActive: true },
            orderBy: { order: "asc" },
          },
        },
      },
      _count: { select: { enrollments: true } },
    },
  });

  if (!course) notFound();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/admin/cours" className="text-sm text-muted-foreground hover:text-foreground">
            ← Cours
          </Link>
          <h1 className="mt-1 text-2xl font-bold">{course.title}</h1>
          <p className="text-sm text-muted-foreground">{course.shortDescription}</p>
          <div className="mt-2 flex gap-2">
            <Badge variant="outline">{course.category}</Badge>
            <Badge variant="outline">{course.level}</Badge>
            <Badge variant={course.status === "PUBLISHED" ? "default" : "secondary"}>
              {course.status}
            </Badge>
            <Badge variant="outline">{course._count.enrollments} inscrits</Badge>
          </div>
        </div>
        <Link href={`/admin/cours/${course.id}/lecons`}>
          <Button className="bg-[#2DD4BF] text-[#1B2A4E] hover:bg-[#2DD4BF]/80">
            <Plus className="h-4 w-4" />
            Gérer les leçons
          </Button>
        </Link>
      </div>

      {/* Course info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informations</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Slug</p>
            <p className="font-mono">{course.slug}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Durée</p>
            <p>{course.estimatedHours} heures</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Prix</p>
            <p>{course.isFree ? "Gratuit" : `${(course.price / 100).toFixed(2)} €`}</p>
          </div>
          <div className="sm:col-span-3">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Description</p>
            <p className="mt-1">{course.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Modules & Lessons */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Contenu du cours</h2>
        {course.modules.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              Aucun module. Clique sur « Gérer les leçons » pour ajouter du contenu.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {course.modules.map((module, modIdx) => (
              <Card key={module.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                      {modIdx + 1}
                    </span>
                    <CardTitle className="text-base">{module.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {module.lessons.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Aucune leçon dans ce module.</p>
                  ) : (
                    <div className="space-y-1">
                      {module.lessons.map((lesson, lesIdx) => (
                        <Link
                          key={lesson.id}
                          href={`/admin/cours/${course.id}/lecons/${lesson.id}`}
                          className="flex items-center gap-3 rounded-lg border p-2.5 text-sm transition-colors hover:bg-muted/50"
                        >
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-xs">
                            {lesIdx + 1}
                          </span>
                          <span className="flex-1 font-medium">{lesson.title}</span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {lesson.estimatedMinutes} min
                          </span>
                          <Badge variant="outline" className="text-[#2DD4BF]">
                            {lesson.isFreePreview ? "Gratuit" : "Payant"}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
