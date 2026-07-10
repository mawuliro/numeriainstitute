export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function createTopicAction(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user) redirect("/login");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const courseId = (formData.get("courseId") as string) || null;

  const topic = await db.communityTopic.create({
    data: {
      title,
      courseId: courseId || null,
      authorId: session.user.id,
    },
  });

  await db.communityPost.create({
    data: {
      topicId: topic.id,
      authorId: session.user.id,
      content,
    },
  });

  redirect("/communaute/" + topic.id);
}

export default async function NewTopicPage({
  searchParams,
}: {
  searchParams: Promise<{ courseId?: string }>;
}) {
  const { courseId } = await searchParams;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const course = courseId
    ? await db.course.findUnique({ where: { id: courseId }, select: { id: true, title: true } })
    : null;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pb-16 lg:pb-0">
        <div className="container mx-auto max-w-3xl px-4 py-8">
          <h1 className="text-2xl font-bold">Nouveau sujet</h1>
          {course && (
            <p className="mt-1 text-sm text-muted-foreground">
              Forum du cours : <span className="font-medium">{course.title}</span>
            </p>
          )}

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Créer une discussion</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createTopicAction} className="space-y-4">
                <input type="hidden" name="courseId" value={courseId ?? ""} />
                <div className="space-y-2">
                  <label className="text-sm font-medium">Titre *</label>
                  <input
                    name="title"
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    placeholder="Ex: Comment résoudre cette équation ?"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message *</label>
                  <textarea
                    name="content"
                    required
                    rows={8}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    placeholder="Décris ta question en détail..."
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="bg-[#1B2A4E] hover:bg-[#1B2A4E]/90">
                    Publier
                  </Button>
                  <a href="/communaute" className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted">
                    Annuler
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
