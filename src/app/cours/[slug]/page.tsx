import { notFound } from "next/navigation";
import Link from "next/link";
import { getCourseForCatalog } from "@/lib/queries";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, BookOpen, Users, ArrowRight } from "lucide-react";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseForCatalog(slug);

  if (!course) {
    notFound();
  }

  const totalLessons = course.modules.reduce(
    (sum, m) => sum + m.lessons.length,
    0,
  );

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero header */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1B2A4E] via-[#1B2A4E] to-[#0d1530]">
          <div
            aria-hidden
            className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-[#2DD4BF]/20 blur-3xl"
          />
          <div className="container mx-auto max-w-7xl px-4 py-16">
            <Link
              href="/cours"
              className="mb-6 inline-flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-white"
            >
              ← Catalogue
            </Link>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 text-white">
                <Badge className="mb-4 bg-[#2DD4BF]/20 text-[#2DD4BF]">
                  {course.category}
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  {course.title}
                </h1>
                <p className="mt-4 text-lg text-white/80">
                  {course.shortDescription ?? course.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-6 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[#2DD4BF]" />
                    <span>{totalLessons} leçons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#2DD4BF]" />
                    <span>{course.estimatedHours} heures</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#2DD4BF]" />
                    <span>{course._count.enrollments} inscrits</span>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  {course.modules[0]?.lessons[0] && (
                    <Link
                      href={`/cours/${course.slug}/${course.modules[0].lessons[0].id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#2DD4BF] px-6 py-3 text-sm font-semibold text-[#1B2A4E] shadow-lg shadow-[#2DD4BF]/25 transition-transform hover:scale-105"
                    >
                      Commencer le cours
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                  <div className="inline-flex items-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm">
                    {course.isFree
                      ? "Gratuit"
                      : `${(course.price / 100).toFixed(2)} €`}
                  </div>
                </div>
              </div>

              <div>
                <Card className="border-white/10 bg-white/5 backdrop-blur-md">
                  <CardContent className="p-6">
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/60">
                      Description
                    </h2>
                    <p className="text-sm text-white/80">
                      {course.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Course content */}
        <section className="py-12">
          <div className="container mx-auto max-w-7xl px-4">
            <h2 className="mb-6 text-2xl font-bold">Contenu du cours</h2>
            <div className="space-y-4">
              {course.modules.map((module, modIdx) => (
                <div key={module.id}>
                  <div className="mb-2 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                      {modIdx + 1}
                    </span>
                    <h3 className="text-lg font-semibold">{module.title}</h3>
                  </div>
                  <div className="ml-11 space-y-1">
                    {module.lessons.map((lesson, lesIdx) => (
                      <Link
                        key={lesson.id}
                        href={`/cours/${course.slug}/${lesson.id}`}
                        className="group flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/30 hover:bg-muted/50"
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground">
                          {lesIdx + 1}
                        </span>
                        <span className="flex-1 text-sm font-medium">
                          {lesson.title}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {lesson.estimatedMinutes} min
                        </span>
                        {lesson.isFreePreview && (
                          <Badge variant="outline" className="text-[#2DD4BF]">
                            Gratuit
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
