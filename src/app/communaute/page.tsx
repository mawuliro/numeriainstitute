import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, BookOpen } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1B2A4E] via-[#1B2A4E] to-[#0d1530] py-16">
          <div className="container mx-auto max-w-4xl px-4 text-center text-white">
            <Users className="mx-auto mb-4 h-12 w-12 text-[#2DD4BF]" />
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Numeria Community
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Join the conversation. Ask questions, share solutions, and learn
              together with fellow students.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: MessageSquare, title: "Physics", count: "12 topics", desc: "Mechanics, quantum, electromagnetism discussions" },
                { icon: BookOpen, title: "Programming", count: "8 topics", desc: "Python, LaTeX, algorithm help" },
                { icon: Users, title: "Mathematics", count: "5 topics", desc: "Calculus, linear algebra, probability" },
              ].map((cat) => (
                <Card key={cat.title}>
                  <CardContent className="p-6">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <cat.icon className="h-6 w-6" />
                    </div>
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold">{cat.title}</h2>
                      <Badge variant="secondary">{cat.count}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{cat.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-dashed p-8 text-center">
              <p className="text-muted-foreground">
                The community forum is coming soon. Sign up to be notified when
                it launches!
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
