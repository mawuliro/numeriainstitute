import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BookOpen, Clock, TrendingUp, Award } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      enrollments: {
        include: {
          course: {
            include: {
              modules: {
                where: { isActive: true },
                include: {
                  lessons: { where: { isActive: true } },
                },
              },
            },
          },
        },
      },
      lessonProgress: true,
    },
  });

  if (!user) redirect("/login");

  const completedLessons = user.lessonProgress.filter((p) => p.isCompleted);
  const totalEnrollments = user.enrollments.length;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Bonjour, {user.name ?? user.email.split("@")[0]} 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            Continue ton apprentissage là où tu l&apos;as laissé.
          </p>

          {/* Stats */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalEnrollments}</div>
                  <div className="text-xs text-muted-foreground">
                    Cours inscrits
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {completedLessons.length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Leçons terminées
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">0h</div>
                  <div className="text-xs text-muted-foreground">
                    Temps d&apos;apprentissage
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-xs text-muted-foreground">
                    Certificats
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enrolled courses */}
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold">Mes cours</h2>
            {user.enrollments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    Tu n&apos;es inscrit à aucun cours pour le moment.
                  </p>
                  <Link
                    href="/cours"
                    className="mt-4 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  >
                    Explorer le catalogue
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {user.enrollments.map(({ course }) => {
                  const totalLessons = course.modules.reduce(
                    (sum, m) => sum + m.lessons.length,
                    0,
                  );
                  const completedInCourse = completedLessons.filter((p) =>
                    course.modules.some((m) =>
                      m.lessons.some((l) => l.id === p.lessonId),
                    ),
                  ).length;
                  const progress =
                    totalLessons > 0
                      ? Math.round((completedInCourse / totalLessons) * 100)
                      : 0;

                  return (
                    <Link key={course.id} href={`/cours/${course.slug}`}>
                      <Card className="transition-all hover:shadow-md">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">
                              {course.title}
                            </CardTitle>
                            <Badge variant="secondary">{progress}%</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="h-2 rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-[#2DD4BF]"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {completedInCourse} / {totalLessons} leçons terminées
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
