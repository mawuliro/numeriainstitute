export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Calendar, Award, BookOpen } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      enrollments: { include: { course: true } },
      lessonProgress: true,
    },
  });
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">My Profile</h1>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {/* Left: avatar + info */}
            <Card className="md:col-span-1">
              <CardContent className="p-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {(user.name ?? user.email)[0].toUpperCase()}
                </div>
                <h2 className="mt-3 text-lg font-semibold">{user.name ?? "Student"}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Badge variant="secondary" className="mt-2">{user.role}</Badge>
              </CardContent>
            </Card>

            {/* Right: details */}
            <div className="space-y-4 md:col-span-2">
              <Card>
                <CardHeader><CardTitle className="text-base">Account info</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> {user.email}</div>
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> Joined {new Date(user.createdAt).toLocaleDateString()}</div>
                  <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-muted-foreground" /> {user.enrollments.length} courses enrolled</div>
                  <div className="flex items-center gap-2"><Award className="h-4 w-4 text-muted-foreground" /> {user.lessonProgress.filter(p => p.isCompleted).length} lessons completed</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">Enrolled courses</CardTitle></CardHeader>
                <CardContent>
                  {user.enrollments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No courses yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {user.enrollments.map(({ course }) => (
                        <div key={course.id} className="flex items-center justify-between rounded-lg border p-3">
                          <span className="text-sm font-medium">{course.title}</span>
                          <Badge variant="outline">{course.category}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
