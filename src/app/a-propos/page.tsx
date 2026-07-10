import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Telescope, Target, MapPin, Users, BookOpen, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pb-16 lg:pb-0">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1B2A4E] via-[#1B2A4E] to-[#0d1530] py-20">
          <div
            aria-hidden
            className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-[#2DD4BF]/20 blur-3xl"
          />
          <div className="container mx-auto max-w-4xl px-4 text-center text-white">
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
              About Numeria Institute
            </h1>
            <p className="mt-6 text-lg text-white/80">
              Numeria Institute was born from a simple observation: Sub-Saharan
              Africa is undergoing accelerated digital transformation, with a
              large and ambitious youth, but a glaring lack of practical training
              in computational sciences and artificial intelligence.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b bg-muted/30">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-2 divide-x divide-border md:grid-cols-4">
              {[
                { icon: MapPin, value: "Lomé, Togo", label: "ECOWAS Reach" },
                { icon: Users, value: "2+", label: "Enrolled students" },
                { icon: BookOpen, value: "5+", label: "Available courses" },
                { icon: Globe, value: "2025", label: "Year founded" },
              ].map((s) => (
                <div key={s.label} className="px-4 py-8 text-center">
                  <s.icon className="mx-auto mb-2 h-6 w-6 text-[#2DD4BF]" />
                  <div className="text-xl font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16">
          <div className="container mx-auto max-w-4xl px-4">
            <Badge variant="secondary" className="mb-3">
              📖 Our story
            </Badge>
            <h2 className="mb-6 text-2xl font-bold">Our story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Numeria Institute was born from a simple observation: Sub-Saharan
                Africa is experiencing an accelerated digital transformation,
                with a large and ambitious youth population, but a glaring lack
                of practical training in computational sciences and artificial
                intelligence.
              </p>
              <p>
                Based in Lomé, Togo, in the heart of West Africa, Numeria
                Institute was founded with a clear vision: to become the
                reference hub for applied technology training for the entire
                ECOWAS region.
              </p>
              <p>
                Our approach is unique: we combine academic rigor with projects
                rooted in African realities — agriculture, health, energy,
                inclusive finance — to train experts capable of creating
                high-impact local solutions.
              </p>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto max-w-7xl px-4">
            <h2 className="mb-8 text-center text-2xl font-bold">
              Vision &amp; Mission
            </h2>
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-3 text-3xl">🔭</div>
                  <h3 className="mb-2 text-lg font-semibold">Notre Vision</h3>
                  <p className="text-sm text-muted-foreground">
                    To become, by 2030, the leading training institute in
                    computational sciences and applied artificial intelligence
                    in French-speaking West Africa, producing experts capable of
                    modeling, analyzing and solving the continent&apos;s complex
                    problems.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="mb-3 text-3xl">🎯</div>
                  <h3 className="mb-2 text-lg font-semibold">Notre Mission</h3>
                  <p className="text-sm text-muted-foreground">
                    Train a new generation of African digital scientists and
                    engineers, equipped with modern tools (Python, Fortran,
                    ML/AI), capable of creating innovative technological
                    solutions for local and continental challenges.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
