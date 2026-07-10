import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

export default function AdmissionsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b bg-muted/30 py-12">
          <div className="container mx-auto max-w-7xl px-4">
            <Badge variant="secondary" className="mb-3">
              <FileText className="mr-1 h-3 w-3" />
              Applications
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Admissions
            </h1>
            <p className="mt-2 text-muted-foreground">
              Apply for our in-person and hybrid training programmes.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto max-w-4xl px-4">
            <h2 className="mb-6 text-xl font-semibold">Application process</h2>
            <div className="space-y-4">
              {[
                { step: 1, title: "Create an account", desc: "Sign up for free on Numeria Institute." },
                { step: 2, title: "Choose a programme", desc: "Browse available programmes and select the one that fits you." },
                { step: 3, title: "Submit your application", desc: "Fill out the application form with your background and motivation." },
                { step: 4, title: "Interview", desc: "Selected candidates will be invited for a short interview." },
                { step: 5, title: "Enrolment", desc: "Upon acceptance, complete enrolment and start your journey!" },
              ].map((s) => (
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
                Start your application
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
