import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { LessonBlocksRenderer } from "@/components/lesson/lesson-blocks-renderer";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = await params;

  const course = await db.course.findUnique({
    where: { slug },
    include: {
      modules: {
        where: { isActive: true },
        orderBy: { order: "asc" },
        include: {
          lessons: {
            where: { isActive: true },
            orderBy: { order: "asc" },
            select: {
              id: true,
              title: true,
              slug: true,
              order: true,
              estimatedMinutes: true,
              isFreePreview: true,
            },
          },
        },
      },
    },
  });

  if (!course) notFound();

  // Flatten all lessons to find current + prev + next
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const currentIdx = allLessons.findIndex((l) => l.id === lessonId);
  if (currentIdx === -1) notFound();

  const currentLesson = allLessons[currentIdx];
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson =
    currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  // Fetch full lesson with blocks
  const lesson = await db.courseLesson.findUnique({
    where: { id: lessonId },
    include: {
      blocks: {
        orderBy: { order: "asc" },
        include: {
          mcq: { include: { choices: { orderBy: { order: "asc" } } } },
          fillBlank: true,
          trueFalse: true,
          codeEx: true,
          lab: true,
        },
      },
    },
  });

  if (!lesson) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          {/* Breadcrumb */}
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/cours" className="hover:text-foreground">
              Catalogue
            </Link>
            <span>/</span>
            <Link
              href={`/cours/${course.slug}`}
              className="hover:text-foreground"
            >
              {course.title}
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            {/* Main content */}
            <div className="min-w-0">
              {/* Lesson header */}
              <div className="mb-6 border-b pb-4">
                <p className="mb-1 text-sm text-muted-foreground">
                  Leçon {currentIdx + 1} sur {allLessons.length}
                </p>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  {lesson.title}
                </h1>
                <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {lesson.estimatedMinutes} minutes
                  </span>
                  {lesson.isFreePreview && (
                    <Badge variant="outline" className="text-[#2DD4BF]">
                      Aperçu gratuit
                    </Badge>
                  )}
                </div>
              </div>

              {/* Lesson blocks */}
              <LessonBlocksRenderer blocks={lesson.blocks} />

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between border-t pt-6">
                {prevLesson ? (
                  <Link
                    href={`/cours/${course.slug}/${prevLesson.id}`}
                    className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Précédent
                  </Link>
                ) : (
                  <div />
                )}
                {nextLesson ? (
                  <Link
                    href={`/cours/${course.slug}/${nextLesson.id}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </div>

            {/* Sidebar: lesson list */}
            <aside className="hidden lg:block">
              <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-xl border bg-card p-4">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Leçons
                </h3>
                <div className="space-y-1">
                  {course.modules.map((module, modIdx) => (
                    <div key={module.id} className="mb-3">
                      <p className="mb-1 px-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        Module {modIdx + 1}
                      </p>
                      {module.lessons.map((l) => (
                        <Link
                          key={l.id}
                          href={`/cours/${course.slug}/${l.id}`}
                          className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                            l.id === lessonId
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                        >
                          {l.title}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
