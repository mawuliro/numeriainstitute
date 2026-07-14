import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, BookOpen, Globe } from "lucide-react";
import { getLocale, t } from "@/lib/i18n";

export default async function AboutPage() {
  const locale = await getLocale();

  const stats = [
    { icon: MapPin, value: t(locale, "contact.addressValue"), label: t(locale, "about.ecowas") },
    { icon: Users, value: "2+", label: t(locale, "about.stats") },
    { icon: BookOpen, value: "5+", label: t(locale, "about.availableCourses") },
    { icon: Globe, value: "2025", label: t(locale, "about.founded") },
  ];

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
              {t(locale, "about.title")}
            </h1>
            <p className="mt-6 text-lg text-white/80">
              {t(locale, "about.intro")}
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b bg-muted/30">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-2 divide-x divide-border md:grid-cols-4">
              {stats.map((s) => (
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
              📖 {t(locale, "about.ourStory")}
            </Badge>
            <h2 className="mb-6 text-2xl font-bold">
              {t(locale, "about.ourStory")}
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>{t(locale, "about.story1")}</p>
              <p>{t(locale, "about.story2")}</p>
              <p>{t(locale, "about.story3")}</p>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto max-w-7xl px-4">
            <h2 className="mb-8 text-center text-2xl font-bold">
              {t(locale, "about.visionMission")}
            </h2>
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-3 text-3xl">🔭</div>
                  <h3 className="mb-2 text-lg font-semibold">
                    {t(locale, "about.vision")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(locale, "about.visionDesc")}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="mb-3 text-3xl">🎯</div>
                  <h3 className="mb-2 text-lg font-semibold">
                    {t(locale, "about.mission")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(locale, "about.missionDesc")}
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
