export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Video, Calendar, Users, Plus } from "lucide-react";
import { getLocale, t } from "@/lib/i18n";

export default async function VisioconferencePage() {
  const locale = await getLocale();
  const meetings = await db.meeting.findMany({
    where: { isActive: true },
    orderBy: { startTime: "asc" },
    include: {
      host: { select: { id: true, name: true, email: true } },
      _count: { select: { participants: true } },
    },
  });

  const now = new Date();
  const upcoming = meetings.filter((m) => new Date(m.startTime) > now);
  const live = meetings.filter((m) => {
    const start = new Date(m.startTime);
    const end = m.endTime ? new Date(m.endTime) : new Date(start.getTime() + 2 * 60 * 60 * 1000);
    return start <= now && now <= end;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pb-16 lg:pb-0">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1B2A4E] via-[#1B2A4E] to-[#0d1530] py-12">
          <div className="container mx-auto max-w-7xl px-4 text-center text-white">
            <Video className="mx-auto mb-4 h-12 w-12 text-[#2DD4BF]" />
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {t(locale, "video.title")}
            </h1>
            <p className="mt-2 text-white/80">
              {t(locale, "video.subtitle")}
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto max-w-5xl px-4 space-y-8">
            {/* Live meetings */}
            {live.length > 0 && (
              <div>
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                  <span className="flex h-3 w-3 animate-pulse rounded-full bg-red-500" />
                  {t(locale, "video.live")}
                </h2>
                <div className="space-y-3">
                  {live.map((meeting) => (
                    <Card key={meeting.id} className="border-red-200">
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                          <Video className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{meeting.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            {t(locale, "video.organisedBy")} {meeting.host.name ?? meeting.host.email}
                          </p>
                        </div>
                        <Link href={`/visioconference/${meeting.id}`}>
                          <Button className="bg-red-500 hover:bg-red-600">
                            {t(locale, "video.joinNow")}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming meetings */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <Calendar className="h-5 w-5 text-[#2DD4BF]" />
                  {t(locale, "video.upcoming")}
                </h2>
                <Link href="/admin/visioconference/nouveau">
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4" />
                    {t(locale, "video.scheduleAdmin")}
                  </Button>
                </Link>
              </div>

              {upcoming.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-sm text-muted-foreground">
                    {t(locale, "video.noMeetings")}
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {upcoming.map((meeting) => (
                    <Card key={meeting.id}>
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Video className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{meeting.title}</h3>
                          <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(meeting.startTime).toLocaleDateString("fr-FR", {
                                day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {meeting._count.participants} {t(locale, "video.registered")}
                            </span>
                            <span>{t(locale, "video.by")} {meeting.host.name ?? meeting.host.email}</span>
                          </div>
                        </div>
                        <Link href={`/visioconference/${meeting.id}`}>
                          <Button variant="outline" size="sm">
                            {t(locale, "video.join")}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
