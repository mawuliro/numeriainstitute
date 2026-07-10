export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageSquare, Eye, Pin, Lock, Plus, BookOpen } from "lucide-react";

export default async function CommunityPage() {
  // Group topics by course
  const courses = await db.course.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { title: "asc" },
    include: {
      topics: {
        orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
        include: {
          author: { select: { id: true, name: true, email: true } },
          _count: { select: { posts: true } },
        },
      },
      _count: { select: { enrollments: true } },
    },
  });

  const generalTopics = await db.communityTopic.findMany({
    where: { courseId: null },
    orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
    include: {
      author: { select: { id: true, name: true, email: true } },
      _count: { select: { posts: true } },
    },
    take: 10,
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pb-16 lg:pb-0">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1B2A4E] via-[#1B2A4E] to-[#0d1530] py-12">
          <div className="container mx-auto max-w-7xl px-4 text-center text-white">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Communauté
            </h1>
            <p className="mt-2 text-white/80">
              Discute avec d&apos;autres apprenants, pose tes questions et partage tes connaissances.
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto max-w-7xl px-4 space-y-8">
            {/* General forum */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <MessageSquare className="h-5 w-5 text-[#2DD4BF]" />
                  Forum général
                </h2>
                <Link href="/communaute/nouveau">
                  <Button size="sm" className="bg-[#2DD4BF] text-[#1B2A4E] hover:bg-[#2DD4BF]/80">
                    <Plus className="h-4 w-4" />
                    Nouveau sujet
                  </Button>
                </Link>
              </div>

              {generalTopics.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-sm text-muted-foreground">
                    Aucun sujet pour le moment. Sois le premier à démarrer une discussion !
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {generalTopics.map((topic) => (
                    <Link key={topic.id} href={`/communaute/${topic.id}`}>
                      <Card className="transition-all hover:shadow-md">
                        <CardContent className="flex items-center gap-4 p-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            {(topic.author.name ?? topic.author.email)[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {topic.isPinned && <Pin className="h-3 w-3 text-[#C9A227]" />}
                              {topic.isLocked && <Lock className="h-3 w-3 text-red-500" />}
                              <p className="font-medium truncate">{topic.title}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              par {topic.author.name ?? topic.author.email.split("@")[0]} ·{" "}
                              {new Date(topic.createdAt).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {topic._count.posts}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {topic.views}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Course forums */}
            {courses.map((course) => (
              <div key={course.id}>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-xl font-bold">
                    <BookOpen className="h-5 w-5 text-[#2DD4BF]" />
                    {course.title}
                  </h2>
                  <Link href={`/communaute/nouveau?courseId=${course.id}`}>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                      Nouveau sujet
                    </Button>
                  </Link>
                </div>

                {course.topics.length === 0 ? (
                  <Card>
                    <CardContent className="p-4 text-center text-sm text-muted-foreground">
                      Aucun sujet. Inscris-toi au cours pour participer au forum !
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {course.topics.map((topic) => (
                      <Link key={topic.id} href={`/communaute/${topic.id}`}>
                        <Card className="transition-all hover:shadow-md">
                          <CardContent className="flex items-center gap-4 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                              {(topic.author.name ?? topic.author.email)[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                {topic.isPinned && <Pin className="h-3 w-3 text-[#C9A227]" />}
                                <p className="font-medium truncate">{topic.title}</p>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                par {topic.author.name ?? topic.author.email.split("@")[0]} ·{" "}
                                {new Date(topic.createdAt).toLocaleDateString("fr-FR")}
                              </p>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                {topic._count.posts}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {topic.views}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
