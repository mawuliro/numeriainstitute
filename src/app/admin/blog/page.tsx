export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Newspaper } from "lucide-react";

export default async function AdminBlogPage() {
  const posts = await db.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true, email: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="text-sm text-muted-foreground">{posts.length} articles</p>
        </div>
        <Link href="/admin/blog/nouveau">
          <Button className="bg-[#1B2A4E] hover:bg-[#1B2A4E]/90">
            <Plus className="h-4 w-4" /> Nouvel article
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/admin/blog/${post.id}`}>
            <Card className="transition-all hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Newspaper className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-medium truncate">{post.title}</h2>
                  <p className="text-xs text-muted-foreground">
                    {post.author.name ?? post.author.email} · {post.category}
                  </p>
                </div>
                <Badge variant={post.isPublished ? "default" : "secondary"}>
                  {post.isPublished ? "Publié" : "Brouillon"}
                </Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
