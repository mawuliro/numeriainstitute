import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HandHeart, GraduationCap, Video, Star } from "lucide-react";
import Link from "next/link";

export default function MentoratPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1B2A4E] via-[#1B2A4E] to-[#0d1530] py-16">
          <div className="container mx-auto max-w-4xl px-4 text-center text-white">
            <HandHeart className="mx-auto mb-4 h-12 w-12 text-[#2DD4BF]" />
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Mentorship Programme
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Get personalised guidance from experienced mentors. Book 1-on-1
              sessions, get help with your projects, and accelerate your
              learning.
            </p>
            <Link
              href="/signup"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2DD4BF] px-6 py-3 text-sm font-semibold text-[#1B2A4E] shadow-lg shadow-[#2DD4BF]/25 transition-transform hover:scale-105"
            >
              Find a mentor
            </Link>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: Video, title: "1-on-1 video sessions", desc: "Book private sessions with mentors via integrated video conferencing." },
                { icon: GraduationCap, title: "Expert mentors", desc: "Learn from professors, engineers, and researchers with real-world experience." },
                { icon: Star, title: "Verified reviews", desc: "Browse mentor profiles with student ratings and reviews." },
              ].map((feature) => (
                <Card key={feature.title}>
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h2 className="text-lg font-semibold">{feature.title}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-dashed p-8 text-center">
              <Badge variant="secondary" className="mb-3">Coming soon</Badge>
              <p className="text-muted-foreground">
                The mentorship platform is under development. Sign up to be
                notified when mentor bookings go live!
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
