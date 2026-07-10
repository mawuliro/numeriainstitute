export const dynamic = "force-dynamic";

import Link from "next/link";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Atom, Calculator, Code2, FileText, Users, Clock } from "lucide-react";

const CATEGORY_ICONS: Record<string, typeof Atom> = {
  physique: Atom,
  mathematiques: Calculator,
  python: Code2,
  latex: FileText,
};

export default async function CataloguePage() {
  const courses = await db.course.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "asc" },
    include: {
      modules: { where: { isActive: true } },
      _count: { select: { enrollments: true } },
    },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Header */}
        <section className="border-b bg-muted/30">
          <div className="container mx-auto max-w-7xl px-4 py-12">
            <Badge variant="secondary" className="mb-3">
              Catalogue
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Tous les cours
            </h1>
            <p className="mt-2 text-muted-foreground">
              {courses.length} cours disponibles · Accès gratuit à tous les
              cours
            </p>
          </div>
        </section>

        {/* Courses grid */}
        <section className="py-12">
          <div className="container mx-auto max-w-7xl px-4">
            {courses.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-12 text-center">
                <p className="text-muted-foreground">
                  Aucun cours publié pour le moment. Reviens bientôt !
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => {
                  const Icon =
                    CATEGORY_ICONS[course.category] ?? FileText;
                  const totalLessons = course.modules.reduce(
                    (sum, m) => sum + (m.lessons?.length ?? 0),
                    0,
                  );

                  return (
                    <Link key={course.id} href={`/cours/${course.slug}`}>
                      <Card className="group flex h-full flex-col overflow-hidden transition-all hover:shadow-lg">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                              <Icon className="h-6 w-6" />
                            </div>
                            <Badge variant="outline">
                              {course.category}
                            </Badge>
                          </div>
                          <CardTitle className="mt-3 text-xl group-hover:text-primary">
                            {course.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col">
                          <p className="text-sm text-muted-foreground">
                            {course.shortDescription ?? course.description}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2 text-xs">
                            <Badge variant="secondary">
                              {course.level.toLowerCase()}
                            </Badge>
                            <Badge variant="secondary">
                              <Clock className="mr-1 h-3 w-3" />
                              {course.estimatedHours}h
                            </Badge>
                            <Badge variant="secondary">
                              {totalLessons} leçons
                            </Badge>
                            <Badge variant="secondary">
                              <Users className="mr-1 h-3 w-3" />
                              {course._count.enrollments}
                            </Badge>
                          </div>

                          <div className="mt-auto pt-6">
                            <span className="text-sm font-semibold text-primary transition-colors group-hover:text-primary/80">
                              {course.isFree
                                ? "Accéder gratuitement →"
                                : `Accéder · ${(course.price / 100).toFixed(2)} €`}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
