export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { LessonBlocksRenderer } from "@/components/lesson/lesson-blocks-renderer";
                  {session?.user && (
                    <FavoriteButton lessonId={lesson.id} courseId={course.id} isFavorited={false} />
                  )}
import { LessonCompleteButton } from "./lesson-complete-button";
import { FavoriteButton } from "./favorite-button";
import { Clock, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { getLocale, t } from "@/lib/i18n";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = await params;
  const locale = await getLocale();

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

  // Check if user is logged in and has progress
  const session = await auth();
  let userProgress: { isCompleted: boolean } | null = null;
  let completedLessonIds: Set<string> = new Set();

  if (session?.user) {
    const progress = await db.lessonProgress.findMany({
      where: {
        userId: session.user.id,
        lessonId: { in: allLessons.map((l) => l.id) },
      },
      select: { lessonId: true, isCompleted: true },
    });
    completedLessonIds = new Set(
      progress.filter((p) => p.isCompleted).map((p) => p.lessonId)
    );
    userProgress = progress.find((p) => p.lessonId === lessonId)
      ? { isCompleted: progress.find((p) => p.lessonId === lessonId)!.isCompleted }
      : null;
  }

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
      <main className="flex-1 pb-16 lg:pb-0">
        <div className="container mx-auto max-w-7xl px-4 py-4 sm:py-6">
          {/* Breadcrumb */}
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/cours" className="hover:text-foreground">
              {t(locale, "course.catalog")}
            </Link>
            <span>/</span>
            <Link
              href={`/cours/${course.slug}`}
              className="hover:text-foreground"
            >
              {course.title}
            </Link>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_280px]">
            {/* Main content */}
            <div className="min-w-0">
              {/* Lesson header */}
              <div className="mb-6 border-b pb-4">
                <p className="mb-1 text-sm text-muted-foreground">
                  {t(locale, "course.lesson")} {currentIdx + 1}{" "}
                  {t(locale, "course.of")} {allLessons.length}
                </p>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  {lesson.title}
                </h1>
                <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {lesson.estimatedMinutes} {t(locale, "course.minutes")}
                  </span>
                  {lesson.isFreePreview && (
                    <Badge variant="outline" className="text-[#2DD4BF]">
                      {t(locale, "course.freePreview")}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Lesson blocks */}
              <LessonBlocksRenderer blocks={lesson.blocks} />

              {/* Navigation */}
              <div className="mt-8 space-y-4 border-t pt-6">
                {/* Progress bar */}
                {session?.user && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Progression du cours</span>
                        <span>{completedLessonIds.size}/{allLessons.length}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#2DD4BF] transition-all duration-500"
                          style={{ width: `${allLessons.length > 0 ? (completedLessonIds.size / allLessons.length) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Complete button + navigation */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  {prevLesson ? (
                    <Link
                      href={`/cours/${course.slug}/${prevLesson.id}`}
                      className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      {t(locale, "course.previous")}
                    </Link>
                  ) : (
                    <div />
                  )}

                  {session?.user && (
                    <FavoriteButton lessonId={lesson.id} courseId={course.id} isFavorited={false} />
                  )}
                  {session?.user && (
                    <LessonCompleteButton
                      lessonId={lesson.id}
                      courseId={course.id}
                      isCompleted={userProgress?.isCompleted ?? false}
                    />
                  )}

                  {nextLesson ? (
                    <Link
                      href={`/cours/${course.slug}/${nextLesson.id}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      {t(locale, "course.next")}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar: lesson list */}
            <aside className="hidden lg:block">
              <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-xl border bg-card p-4">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {t(locale, "course.lessonsLabel")}
                </h3>
                <div className="space-y-1">
                  {course.modules.map((module, modIdx) => (
                    <div key={module.id} className="mb-3">
                      <p className="mb-1 px-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        {t(locale, "course.module")} {modIdx + 1}
                      </p>
                      {module.lessons.map((l) => (
                        <Link
                          key={l.id}
                          href={`/cours/${course.slug}/${l.id}`}
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                            l.id === lessonId
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                        >
                          {completedLessonIds.has(l.id) && (
                            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-green-500" />
                          )}
                          <span className="truncate">{l.title}</span>
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
