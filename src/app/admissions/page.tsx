import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import Link from "next/link";
import { getLocale, t } from "@/lib/i18n";

export default async function AdmissionsPage() {
  const locale = await getLocale();

  const steps = [
    { step: 1, title: t(locale, "admissions.step1"), desc: t(locale, "admissions.step1Desc") },
    { step: 2, title: t(locale, "admissions.step2"), desc: t(locale, "admissions.step2Desc") },
    { step: 3, title: t(locale, "admissions.step3"), desc: t(locale, "admissions.step3Desc") },
    { step: 4, title: t(locale, "admissions.step4"), desc: t(locale, "admissions.step4Desc") },
    { step: 5, title: t(locale, "admissions.step5"), desc: t(locale, "admissions.step5Desc") },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pb-16 lg:pb-0">
        <section className="border-b bg-muted/30 py-12">
          <div className="container mx-auto max-w-7xl px-4">
            <Badge variant="secondary" className="mb-3">
              <FileText className="mr-1 h-3 w-3" />
              {t(locale, "nav.applications")}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {t(locale, "admissions.title")}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {t(locale, "admissions.subtitle")}
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto max-w-4xl px-4">
            <h2 className="mb-6 text-xl font-semibold">
              {t(locale, "admissions.process")}
            </h2>
            <div className="space-y-4">
              {steps.map((s) => (
                <Card key={s.step}>
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
                      {s.step}
                    </div>
                    <div>
                      <h3 className="font-semibold">{s.title}</h3>
                      <p className="text-sm text-muted-foreground">{s.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t(locale, "admissions.startApplication")}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
