export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { TextBlock } from "@/components/lesson/text-block";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, email: true } },
    },
  });

  if (!post || !post.isPublished) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <article className="container mx-auto max-w-3xl px-4 py-8">
          <Link href="/blog" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Blog
          </Link>

          <div className="mb-4 flex items-center gap-2">
            <Badge variant="outline">{post.category}</Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })
                : "Non publié"}
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{post.title}</h1>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {(post.author.name ?? post.author.email)[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">{post.author.name ?? post.author.email.split("@")[0]}</p>
              <p className="text-xs text-muted-foreground">{post.author.email}</p>
            </div>
          </div>

          {post.excerpt && (
            <p className="mt-6 text-lg text-muted-foreground italic border-l-4 border-[#2DD4BF] pl-4">
              {post.excerpt}
            </p>
          )}

          <div className="mt-8">
            <TextBlock content={post.content} />
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
