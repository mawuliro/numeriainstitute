export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BookOpen, Users, FileText, GraduationCap, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const [courses, users, lessons, enrollments] = await Promise.all([
    db.course.count(),
    db.user.count(),
    db.courseLesson.count(),
    db.enrollment.count(),
  ]);

  const recentCourses = await db.course.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { enrollments: true } } },
  });

  const recentUsers = await db.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground">
          Vue d&apos;ensemble de la plateforme Numeria Institute
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: BookOpen, label: "Cours", value: courses, color: "text-[#2DD4BF]" },
          { icon: Users, label: "Utilisateurs", value: users, color: "text-[#C9A227]" },
          { icon: FileText, label: "Leçons", value: lessons, color: "text-blue-500" },
          { icon: GraduationCap, label: "Inscriptions", value: enrollments, color: "text-purple-500" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-muted ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent courses */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Cours récents</CardTitle>
              <Link href="/admin/cours" className="text-xs text-[#2DD4BF] hover:underline">
                Tout voir →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/admin/cours/${course.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div>
                    <p className="text-sm font-medium">{course.title}</p>
                    <p className="text-xs text-muted-foreground">{course.category}</p>
                  </div>
                  <Badge variant="secondary">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {course._count.enrollments}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent users */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Utilisateurs récents</CardTitle>
              <Link href="/admin/utilisateurs" className="text-xs text-[#2DD4BF] hover:underline">
                Tout voir →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {(user.name ?? user.email)[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.name ?? user.email}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{user.role}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
