import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar, Users } from "lucide-react";

export default function FormationsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b bg-muted/30 py-12">
          <div className="container mx-auto max-w-7xl px-4">
            <Badge variant="secondary" className="mb-3">
              <Briefcase className="mr-1 h-3 w-3" />
              Training Programmes
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Training Programmes
            </h1>
            <p className="mt-2 text-muted-foreground">
              Intensive, cohort-based training programmes with live sessions,
              projects, and certificates.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  title: "Python for Data Science",
                  duration: "12 weeks",
                  students: "Cohort of 20",
                  desc: "Master Python, NumPy, Pandas, and machine learning fundamentals. Includes real-world projects with African datasets.",
                  level: "Intermediate",
                },
                {
                  title: "Scientific Computing with Fortran",
                  duration: "8 weeks",
                  students: "Cohort of 15",
                  desc: "Learn Fortran for high-performance scientific computing. Numerical methods, parallel programming, and HPC.",
                  level: "Advanced",
                },
              ].map((prog) => (
                <Card key={prog.title}>
                  <CardContent className="p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <Badge variant="outline">{prog.level}</Badge>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {prog.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {prog.students}
                        </span>
                      </div>
                    </div>
                    <h2 className="text-lg font-bold">{prog.title}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{prog.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-dashed p-8 text-center">
              <p className="text-muted-foreground">
                New cohorts open regularly. Create an account to be notified
                when enrolment opens!
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
