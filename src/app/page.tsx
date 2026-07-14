import {
  GraduationCap,
  Globe,
  Smartphone,
  Trophy,
  FlaskConical,
  Wallet,
  Star,
  ArrowRight,
  Code2,
  FileText,
  Atom,
  type LucideIcon,
} from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { NumeriaLogo } from "@/components/numeria-logo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getLocale, t, type Locale } from "@/lib/i18n";

export default async function Home() {
  const locale = await getLocale();
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pb-16 lg:pb-0">
        <Hero locale={locale} />
        <StatsBar locale={locale} />
        <WhyChooseUs locale={locale} />
        <Testimonials locale={locale} />
        <PopularCourses locale={locale} />
        <CtaBanner locale={locale} />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Hero — floating math symbols, same as Django site                         */
/* ────────────────────────────────────────────────────────────────────────── */

const MATH_SYMBOLS = [
  "∫", "e^{iπ} + 1 = 0", "∑", "π ≈ 3.14159",
  "a² + b² = c²", "∇·E = ρ/ε₀", "√", "f(x) = ax + b",
  "lim n→∞", "θ", "P(A|B) = P(B|A)P(A)/P(B)", "α + β",
  "{ x ∈ ℝ : x > 0 }",
];

function Hero({ locale }: { locale: Locale }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1B2A4E] via-[#1B2A4E] to-[#0d1530]">
      {/* Floating math symbols */}
      {MATH_SYMBOLS.map((sym, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute select-none font-mono text-white/5"
          style={{
            top: `${10 + (i * 7) % 80}%`,
            left: `${5 + (i * 13) % 90}%`,
            fontSize: `${1.5 + (i % 3) * 0.8}rem`,
            animation: `float ${8 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }}
        >
          {sym}
        </span>
      ))}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>

      <div className="relative container mx-auto max-w-7xl px-4 py-16 sm:py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center text-white">
          <Badge className="mb-6 bg-[#2DD4BF]/20 text-[#2DD4BF] border-[#2DD4BF]/30">
            {t(locale, "home.badge")}
          </Badge>

          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {t(locale, "home.title")}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-white/80 sm:text-lg">
            {t(locale, "home.subtitle")}
          </p>

          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
            <Link
              href="/cours"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2DD4BF] px-6 py-3 text-sm font-semibold text-[#1B2A4E] shadow-lg shadow-[#2DD4BF]/25 transition-transform hover:scale-105"
            >
              {t(locale, "home.discoverCourses")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              {t(locale, "home.createAccount")}
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4 text-sm text-white/60 sm:gap-8">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["A", "K", "F"].map((letter) => (
                  <div
                    key={letter}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#1B2A4E] bg-[#2DD4BF] text-xs font-bold text-[#1B2A4E]"
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <span>2+ {t(locale, "home.students")}</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-[#C9A227] text-[#C9A227]" />
              ))}
              <span className="ml-1">4.9/5</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Stats bar                                                                  */
/* ────────────────────────────────────────────────────────────────────────── */

function StatsBar({ locale }: { locale: Locale }) {
  const stats = [
    { value: "2+", label: t(locale, "home.students") },
    { value: "5", label: t(locale, "home.availableCourses") },
    { value: "5", label: t(locale, "home.countries") },
  ];

  return (
    <section className="border-y border-border bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((s) => (
            <div key={s.label} className="px-4 py-8 text-center">
              <div className="text-3xl font-bold text-primary md:text-4xl">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Why choose Numeria?                                                        */
/* ────────────────────────────────────────────────────────────────────────── */

type Feature = {
  icon: LucideIcon;
  emoji: string;
  titleKey: string;
  descriptionKey: string;
};

const FEATURES: Feature[] = [
  {
    icon: GraduationCap,
    emoji: "🎓",
    titleKey: "feature.quality",
    descriptionKey: "feature.qualityDesc",
  },
  {
    icon: Globe,
    emoji: "🌍",
    titleKey: "feature.african",
    descriptionKey: "feature.africanDesc",
  },
  {
    icon: Smartphone,
    emoji: "📱",
    titleKey: "feature.responsive",
    descriptionKey: "feature.responsiveDesc",
  },
  {
    icon: Trophy,
    emoji: "🏆",
    titleKey: "feature.certificates",
    descriptionKey: "feature.certificatesDesc",
  },
  {
    icon: FlaskConical,
    emoji: "🧪",
    titleKey: "feature.interactive",
    descriptionKey: "feature.interactiveDesc",
  },
  {
    icon: Wallet,
    emoji: "💰",
    titleKey: "feature.accessible",
    descriptionKey: "feature.accessibleDesc",
  },
];

function WhyChooseUs({ locale }: { locale: Locale }) {
  return (
    <section id="features" className="py-12 sm:py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">
            {t(locale, "home.ourStrengths")}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t(locale, "home.whyChoose")}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {t(locale, "home.whyChooseSub")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.titleKey}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="mb-4 text-4xl">{feature.emoji}</div>
              <h3 className="text-lg font-semibold">
                {t(locale, feature.titleKey)}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t(locale, feature.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Testimonials                                                               */
/* ────────────────────────────────────────────────────────────────────────── */

const TESTIMONIALS = [
  {
    initial: "M",
    name: "Marie K.",
    role: "Master's student",
    quote: "The courses are excellent and adapted to our African context.",
  },
  {
    initial: "J",
    name: "Jean T.",
    role: "Professor",
    quote: "Finally a platform that understands our educational needs.",
  },
];

function Testimonials({ locale }: { locale: Locale }) {
  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t(locale, "home.testimonials")}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((testimonial) => (
            <Card key={testimonial.name}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    {testimonial.initial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    <p className="mt-3 text-sm text-muted-foreground">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Popular courses                                                            */
/* ────────────────────────────────────────────────────────────────────────── */

type PopularCourse = {
  icon: LucideIcon;
  category: string;
  title: string;
  description: string;
  lessons: number;
  level: string;
};

const POPULAR_COURSES: PopularCourse[] = [
  {
    icon: Code2,
    category: "PYTHON",
    title: "Python : de l'Algorithmique à la POO",
    description: "Apprends Python de zéro à la POO : algorithmique, structures de données, récursivité, tri, classes, héritage.",
    lessons: 15,
    level: "Débutant",
  },
  {
    icon: FileText,
    category: "AUTRE",
    title: "Scientific English for University",
    description: "Master Scientific English: vocabulary, papers, abstracts, presentations, grammar.",
    lessons: 11,
    level: "Intermédiaire",
  },
  {
    icon: FileText,
    category: "INFORMATIQUE",
    title: "LaTeX : Typographie Scientifique",
    description: "Maîtrise LaTeX : documents, mathématiques, tableaux, figures, présentations Beamer.",
    lessons: 10,
    level: "Débutant",
  },
];

function PopularCourses({ locale }: { locale: Locale }) {
  return (
    <section id="courses" className="py-12 sm:py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">
            {t(locale, "home.popularCourses")}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t(locale, "home.startLearning")}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {t(locale, "home.startLearningSub")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {POPULAR_COURSES.map((course) => (
            <Card key={course.title} className="group flex flex-col overflow-hidden transition-all hover:shadow-lg">
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Badge variant="outline">{course.category}</Badge>
                </div>
                <h3 className="text-lg font-bold group-hover:text-primary">
                  {course.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">
                  {course.description}
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{course.lessons} {t(locale, "home.lessons")}</span>
                  <span>·</span>
                  <span>{course.level}</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#2DD4BF]">
                    {t(locale, "home.free")}
                  </span>
                  <Link
                    href="/cours"
                    className="text-sm font-semibold text-primary transition-colors group-hover:text-primary/80"
                  >
                    {t(locale, "home.viewCourse")} →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/cours"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold transition-colors hover:bg-muted"
          >
            {t(locale, "home.viewAllCourses")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* CTA banner                                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

function CtaBanner({ locale }: { locale: Locale }) {
  return (
    <section id="contact" className="py-12 sm:py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1B2A4E] via-[#1B2A4E] to-[#0d1530] px-4 py-12 text-center sm:px-6 sm:py-16 md:px-12 md:py-24">
          <div
            aria-hidden
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#2DD4BF]/20 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#C9A227]/15 blur-3xl"
          />

          <div className="relative mx-auto max-w-2xl">
            <Badge className="mb-4 bg-[#2DD4BF]/20 text-[#2DD4BF]">
              {t(locale, "home.joinUs")}
            </Badge>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
              {t(locale, "home.ctaTitle")}
            </h2>
            <p className="mt-3 text-base text-white/80 sm:text-lg">
              {t(locale, "home.ctaSubtitle")}
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#2DD4BF] px-8 py-3.5 text-sm font-semibold text-[#1B2A4E] shadow-lg shadow-[#2DD4BF]/25 transition-transform hover:scale-105"
            >
              {t(locale, "home.ctaButton")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-4 text-xs text-white/40">
              {t(locale, "home.noCard")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
