export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Calendar, Award, BookOpen, Flame, Star, Trophy, Link as LinkIcon } from "lucide-react";
import { BADGES } from "@/lib/gamification";
import Link from "next/link";

const ROLE_LABELS: Record<string, string> = {
  STUDENT: "Étudiant",
  MENTOR: "Mentor",
  STAFF: "Staff",
  ADMIN: "Administrateur",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      enrollments: { include: { course: true } },
      lessonProgress: { where: { isCompleted: true } },
      badges: true,
      streak: true,
      certificates: { include: { course: { select: { title: true } } } },
    },
  });
  if (!user) redirect("/login");

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.name || "Étudiant";
  const initial = (displayName[0] ?? "?").toUpperCase();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pb-16 lg:pb-0">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Mon profil</h1>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {/* Avatar + info */}
            <Card className="md:col-span-1">
              <CardContent className="p-6 text-center">
                {user.avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={user.avatarUrl}
                    alt={displayName}
                    className="mx-auto h-20 w-20 rounded-full object-cover ring-2 ring-[#2DD4BF]/40"
                  />
                ) : (
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                    {initial}
                  </div>
                )}
                <h2 className="mt-3 text-lg font-semibold">{displayName}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Badge variant="secondary" className="mt-2">{ROLE_LABELS[user.role] ?? user.role}</Badge>
                {user.streak && user.streak.currentStreak > 0 && (
                  <div className="mt-3 flex items-center justify-center gap-1 text-sm font-semibold text-orange-500"><Flame className="h-4 w-4" />{user.streak.currentStreak} jours de streak</div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="space-y-4 md:col-span-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Card><CardContent className="p-4 text-center"><BookOpen className="mx-auto mb-1 h-5 w-5 text-[#2DD4BF]" /><div className="text-xl font-bold">{user.enrollments.length}</div><div className="text-xs text-muted-foreground">Cours</div></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><Award className="mx-auto mb-1 h-5 w-5 text-green-500" /><div className="text-xl font-bold">{user.lessonProgress.length}</div><div className="text-xs text-muted-foreground">Leçons</div></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><Trophy className="mx-auto mb-1 h-5 w-5 text-[#C9A227]" /><div className="text-xl font-bold">{user.badges.length}</div><div className="text-xs text-muted-foreground">Badges</div></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><Star className="mx-auto mb-1 h-5 w-5 text-purple-500" /><div className="text-xl font-bold">{user.streak?.totalXP ?? 0}</div><div className="text-xs text-muted-foreground">XP</div></CardContent></Card>
              </div>

              {/* Badges */}
              <Card>
                <CardHeader><CardTitle className="text-base">Mes badges 🏆</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {BADGES.map((badge) => {
                      const earned = user.badges.some(b => b.badgeType === badge.type);
                      return (
                        <div key={badge.type} className={`flex items-center gap-2 rounded-xl border p-3 ${earned ? "border-[#C9A227]/30 bg-[#C9A227]/5" : "border-muted opacity-40"}`}>
                          <span className="text-2xl">{badge.emoji}</span>
                          <div><p className="text-sm font-semibold">{badge.name}</p><p className="text-xs text-muted-foreground">{badge.desc}</p></div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Certificates */}
              {user.certificates.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="text-base">Mes certificats 🎓</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {user.certificates.map((cert) => (
                        <div key={cert.id} className="flex items-center justify-between rounded-lg border p-3">
                          <div><p className="text-sm font-semibold">{cert.course.title}</p><p className="text-xs text-muted-foreground font-mono">{cert.certificateNumber}</p></div>
                          <Badge className="bg-[#2DD4BF] text-[#1B2A4E]">Obtenu le {new Date(cert.issuedAt).toLocaleDateString("fr-FR")}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Account info */}
              <Card>
                <CardHeader><CardTitle className="text-base">Informations</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" />{user.email}</div>
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" />Inscrit le {new Date(user.createdAt).toLocaleDateString("fr-FR")}</div>
                  <Link href="/profil/modifier" className="inline-flex items-center gap-1 text-[#2DD4BF] hover:underline"><LinkIcon className="h-3 w-3" />Modifier mon profil</Link>
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
