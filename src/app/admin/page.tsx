export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  BookOpen, Users, FileText, GraduationCap, TrendingUp,
  Clock, ArrowRight, Activity, UserCheck, BookMarked,
} from "lucide-react";

export default async function AdminDashboard() {
  const [
    totalUsers, totalCourses, totalLessons, totalEnrollments,
    totalBlocks, totalMCQs, totalTopics, totalPosts, totalMeetings,
    totalBlogPosts, verifiedUsers, adminUsers, recentUsers, recentEnrollments,
  ] = await Promise.all([
    db.user.count(),
    db.course.count(),
    db.courseLesson.count(),
    db.enrollment.count(),
    db.lessonBlock.count(),
    db.mCQExercise.count(),
    db.communityTopic.count(),
    db.communityPost.count(),
    db.meeting.count(),
    db.blogPost.count(),
    db.user.count({ where: { isVerified: true } }),
    db.user.count({ where: { role: { in: ["STAFF", "ADMIN"] } } }),
    db.user.findMany({ take: 5, orderBy: { createdAt: "desc" }, select: { id: true, email: true, name: true, role: true, isVerified: true, createdAt: true } }),
    db.enrollment.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { user: { select: { name: true, email: true } }, course: { select: { title: true } } } }),
  ]);

  // Course enrollment stats
  const courseStats = await db.course.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { enrollments: true, lessons: true } } },
  });

  // User growth (last 30 days, by day)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentUsersData = await db.user.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  // Group by day
  const userGrowth: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const day = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dayStr = day.toISOString().split("T")[0];
    const count = recentUsersData.filter((u) => u.createdAt.toISOString().split("T")[0] === dayStr).length;
    userGrowth.push({ date: dayStr, count });
  }

  const maxDailySignups = Math.max(...userGrowth.map((d) => d.count), 1);
  const verificationRate = totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0;

  const stats = [
    { icon: Users, label: "Utilisateurs", value: totalUsers, sub: `${verifiedUsers} vérifiés (${verificationRate}%)`, color: "text-[#2DD4BF]" },
    { icon: BookOpen, label: "Cours", value: totalCourses, sub: `${totalLessons} leçons`, color: "text-[#C9A227]" },
    { icon: GraduationCap, label: "Inscriptions", value: totalEnrollments, sub: "aux cours", color: "text-blue-500" },
    { icon: FileText, label: "Contenu", value: totalBlocks, sub: `${totalMCQs} exercices`, color: "text-purple-500" },
    { icon: Activity, label: "Forum", value: totalTopics, sub: `${totalPosts} messages`, color: "text-green-500" },
    { icon: BookMarked, label: "Blog", value: totalBlogPosts, sub: "articles", color: "text-orange-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground">
          Vue d&apos;ensemble de la plateforme Numeria Institute
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-3 sm:p-4">
              <div className={`mb-1 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
              <div className="text-[10px] text-muted-foreground/70 mt-0.5">{stat.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* User growth chart (CSS bars) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-[#2DD4BF]" />
              Croissance des utilisateurs (30 jours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-0.5 h-32">
              {userGrowth.map((day, i) => (
                <div
                  key={i}
                  className="flex-1 bg-[#2DD4BF]/30 rounded-t hover:bg-[#2DD4BF] transition-colors relative group"
                  style={{ height: `${(day.count / maxDailySignups) * 100}%`, minHeight: "2px" }}
                >
                  {day.count > 0 && (
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#2DD4BF] opacity-0 group-hover:opacity-100">
                      {day.count}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
              <span>Il y a 30 jours</span>
              <span>Aujourd&apos;hui</span>
            </div>
            <div className="mt-3 flex gap-4 text-xs">
              <span className="flex items-center gap-1">
                <UserCheck className="h-3 w-3 text-green-500" />
                {verifiedUsers} vérifiés
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3 text-blue-500" />
                {totalUsers - verifiedUsers} en attente
              </span>
              <span className="flex items-center gap-1">
                <ShieldIcon />
                {adminUsers} admins
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Course performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-4 w-4 text-[#C9A227]" />
              Performance des cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {courseStats.map((course) => {
                const maxEnrollments = Math.max(...courseStats.map((c) => c._count.enrollments), 1);
                const pct = (course._count.enrollments / maxEnrollments) * 100;
                return (
                  <div key={course.id}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <Link href={`/admin/cours/${course.id}`} className="font-medium hover:text-[#2DD4BF] truncate max-w-[200px]">
                        {course.title}
                      </Link>
                      <span className="text-muted-foreground flex-shrink-0">
                        {course._count.enrollments} inscrits · {course._count.lessons} leçons
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#C9A227] transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
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
              {recentUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Aucun utilisateur</p>
              ) : (
                recentUsers.map((user) => (
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
                    <div className="flex items-center gap-2">
                      {user.isVerified && (
                        <UserCheck className="h-3 w-3 text-green-500" />
                      )}
                      <Badge variant="outline" className="text-xs">{user.role}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent enrollments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inscriptions récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentEnrollments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucune inscription. Les inscriptions se font quand un étudiant complète une leçon.
                </p>
              ) : (
                recentEnrollments.map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">
                        {enrollment.user.name ?? enrollment.user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        → {enrollment.course.title}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(enrollment.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/admin/cours/nouveau", label: "Nouveau cours", icon: BookOpen, color: "text-[#2DD4BF]" },
              { href: "/admin/blog/nouveau", label: "Nouvel article", icon: FileText, color: "text-[#C9A227]" },
              { href: "/admin/visioconference/nouveau", label: "Planifier réunion", icon: Activity, color: "text-purple-500" },
              { href: "/admin/utilisateurs", label: "Gérer utilisateurs", icon: Users, color: "text-blue-500" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center gap-3 rounded-xl border p-4 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <action.icon className={`h-5 w-5 ${action.color}`} />
                <span className="text-sm font-medium flex-1">{action.label}</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ShieldIcon() {
  return <span className="text-xs">🛡️</span>;
}
