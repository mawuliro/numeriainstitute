import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, ArrowRight } from "lucide-react";
import Link from "next/link";

const POSTS = [
  {
    title: "Welcome to Numeria Institute",
    excerpt: "Discover our mission to make science accessible to all African learners.",
    date: "2025-01-15",
    category: "Announcement",
  },
  {
    title: "Why Python is essential for African students",
    excerpt: "Python has become the lingua franca of data science, AI, and scientific computing.",
    date: "2025-02-01",
    category: "Programming",
  },
  {
    title: "The importance of LaTeX in scientific writing",
    excerpt: "Learn why LaTeX remains the gold standard for scientific documents.",
    date: "2025-02-15",
    category: "Tools",
  },
];

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b bg-muted/30 py-12">
          <div className="container mx-auto max-w-7xl px-4">
            <Badge variant="secondary" className="mb-3">
              <Newspaper className="mr-1 h-3 w-3" />
              Blog
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Numeria Blog
            </h1>
            <p className="mt-2 text-muted-foreground">
              News, tutorials, and insights from the Numeria community.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {POSTS.map((post) => (
                <Card key={post.title} className="group flex flex-col overflow-hidden transition-all hover:shadow-lg">
                  <CardContent className="flex flex-1 flex-col p-6">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="outline">{post.category}</Badge>
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                    </div>
                    <h2 className="text-lg font-bold group-hover:text-primary">
                      {post.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <Link
                      href="/blog"
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary"
                    >
                      Read more <ArrowRight className="h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
