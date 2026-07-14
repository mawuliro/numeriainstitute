export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Newspaper, ArrowRight, Calendar } from "lucide-react";
import { getLocale, t } from "@/lib/i18n";

export default async function BlogPage() {
  const locale = await getLocale();
  const posts = await db.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    include: {
      author: { select: { id: true, name: true, email: true } },
    },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pb-16 lg:pb-0">
        <section className="border-b bg-muted/30 py-12">
          <div className="container mx-auto max-w-7xl px-4">
            <Badge variant="secondary" className="mb-3">
              <Newspaper className="mr-1 h-3 w-3" />
              {t(locale, "nav.blog")}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {t(locale, "blog.title")}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {t(locale, "blog.subtitle")}
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto max-w-7xl px-4">
            {posts.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-12 text-center">
                <p className="text-muted-foreground">
                  {t(locale, "blog.noPosts")}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="group flex h-full flex-col overflow-hidden transition-all hover:shadow-lg">
                      <CardContent className="flex flex-1 flex-col p-6">
                        <div className="mb-2 flex items-center gap-2">
                          <Badge variant="outline">{post.category}</Badge>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {post.publishedAt
                              ? new Date(post.publishedAt).toLocaleDateString("fr-FR")
                              : t(locale, "blog.draft")}
                          </span>
                        </div>
                        <h2 className="text-lg font-bold group-hover:text-primary">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="mt-2 flex-1 text-sm text-muted-foreground">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="mt-4 flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                            {(post.author.name ?? post.author.email)[0].toUpperCase()}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {post.author.name ?? post.author.email.split("@")[0]}
                          </span>
                          <ArrowRight className="ml-auto h-4 w-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
