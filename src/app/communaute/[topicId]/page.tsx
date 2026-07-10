export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pin, Lock, ArrowLeft, Send } from "lucide-react";

async function replyAction(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user) redirect("/login");

  const topicId = formData.get("topicId") as string;
  const content = formData.get("content") as string;

  if (!content.trim()) return;

  await db.communityPost.create({
    data: {
      topicId,
      authorId: session.user.id,
      content,
    },
  });

  await db.communityTopic.update({
    where: { id: topicId },
    data: { updatedAt: new Date() },
  });

  redirect(`/communaute/${topicId}`);
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;
  const session = await auth();

  const topic = await db.communityTopic.findUnique({
    where: { id: topicId },
    include: {
      author: { select: { id: true, name: true, email: true } },
      course: { select: { id: true, title: true, slug: true } },
      posts: {
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, name: true, email: true, role: true } },
        },
      },
    },
  });

  if (!topic) notFound();

  // Increment views
  await db.communityTopic.update({
    where: { id: topicId },
    data: { views: { increment: 1 } },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pb-16 lg:pb-0">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          {/* Breadcrumb */}
          <Link href="/communaute" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Forum
          </Link>

          {/* Topic header */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              {topic.isPinned && <Badge className="bg-[#C9A227]"><Pin className="h-3 w-3" /> Épinglé</Badge>}
              {topic.isLocked && <Badge variant="destructive"><Lock className="h-3 w-3" /> Verrouillé</Badge>}
              {topic.course && (
                <Link href={`/cours/${topic.course.slug}`}>
                  <Badge variant="outline">{topic.course.title}</Badge>
                </Link>
              )}
            </div>
            <h1 className="mt-2 text-2xl font-bold">{topic.title}</h1>
            <p className="text-sm text-muted-foreground">
              Démarré par {topic.author.name ?? topic.author.email.split("@")[0]} ·{" "}
              {new Date(topic.createdAt).toLocaleDateString("fr-FR", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {topic.posts.map((post, idx) => (
              <Card key={post.id} className={idx === 0 ? "border-[#2DD4BF]/30" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {(post.author.name ?? post.author.email)[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{post.author.name ?? post.author.email.split("@")[0]}</span>
                        {idx === 0 && <Badge variant="secondary" className="text-xs">Auteur</Badge>}
                        {(post.author.role === "STAFF" || post.author.role === "ADMIN") && (
                          <Badge className="bg-[#2DD4BF] text-[#1B2A4E] text-xs">Staff</Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="mt-2 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-200">
                        {post.content}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Reply form */}
          {topic.isLocked ? (
            <Card className="mt-6">
              <CardContent className="p-6 text-center text-sm text-muted-foreground">
                <Lock className="mx-auto mb-2 h-5 w-5" />
                Ce sujet est verrouillé. Vous ne pouvez plus répondre.
              </CardContent>
            </Card>
          ) : session?.user ? (
            <Card className="mt-6">
              <CardContent className="p-4">
                <form action={replyAction} className="space-y-3">
                  <input type="hidden" name="topicId" value={topic.id} />
                  <textarea
                    name="content"
                    rows={4}
                    required
                    placeholder="Votre réponse..."
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                  <Button type="submit" className="bg-[#1B2A4E] hover:bg-[#1B2A4E]/90">
                    <Send className="h-4 w-4" />
                    Répondre
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="mt-6">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Connecte-toi pour participer à la discussion
                </p>
                <Link href="/login">
                  <Button size="sm">Se connecter</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
