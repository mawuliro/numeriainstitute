import {
  Atom,
  Calculator,
  Code2,
  FlaskConical,
  GraduationCap,
  LineChart,
  type LucideIcon,
  MessagesSquare,
  Sparkles,
  Users,
} from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { NumeriaLogo } from "@/components/numeria-logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <StatsBar />
        <FeaturedCourses />
        <Features />
        <CategoriesPreview />
        <CtaBanner />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Hero                                                                       */
/* ────────────────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-br from-[#1B2A4E] via-[#1B2A4E] to-[#0d1530]"
      />
      {/* Decorative teal glow */}
      <div
        aria-hidden
        className="absolute -right-32 top-10 -z-10 h-96 w-96 rounded-full bg-[#2DD4BF]/20 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -left-32 bottom-0 -z-10 h-96 w-96 rounded-full bg-[#C9A227]/10 blur-3xl"
      />

      <div className="container mx-auto max-w-7xl px-4 py-20 md:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: copy */}
          <div className="space-y-6 text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#2DD4BF]" />
              <span>Nouveau · Cours de Mécanique Quantique I disponible</span>
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              Apprends les <span className="text-[#2DD4BF]">sciences</span> par
              la <span className="text-[#C9A227]">pratique</span>
            </h1>

            <p className="max-w-xl text-lg text-white/80">
              Une plateforme d&apos;apprentissage interactive pour la physique,
              les mathématiques et la programmation. Cours structurés,
              laboratoires PhET-style, exercices corrigés, et mentorat
              personnalisé — pensée pour les apprenants francophones.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#courses"
                className="inline-flex items-center justify-center rounded-xl bg-[#2DD4BF] px-6 py-3 text-sm font-semibold text-[#1B2A4E] shadow-lg shadow-[#2DD4BF]/25 transition-transform hover:scale-105"
              >
                Explorer les cours
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                Découvrir la plateforme
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#2DD4BF]" />
                <span>+1 200 apprenants</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-[#2DD4BF]" />
                <span>4 cours complets</span>
              </div>
              <div className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-[#2DD4BF]" />
                <span>+30 laboratoires interactifs</span>
              </div>
            </div>
          </div>

          {/* Right: logo card */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div
                aria-hidden
                className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-[#2DD4BF]/30 to-[#C9A227]/20 blur-2xl"
              />
              <div className="flex aspect-square w-72 flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-12 backdrop-blur-md md:w-96">
                <NumeriaLogo size={180} variant="light" />
                <div className="mt-8 text-center">
                  <p className="text-2xl font-bold tracking-tight text-white">
                    NUMERIA
                  </p>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                    Institute
                  </p>
                </div>
              </div>
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

function StatsBar() {
  const stats = [
    { value: "4", label: "Cours complets" },
    { value: "60+", label: "Leçons interactives" },
    { value: "30+", label: "Laboratoires PhET-style" },
    { value: "1 200+", label: "Apprenants actifs" },
  ];

  return (
    <section className="border-y border-border bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 divide-x divide-border md:grid-cols-4">
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
/* Featured courses                                                           */
/* ────────────────────────────────────────────────────────────────────────── */

type Course = {
  icon: LucideIcon;
  title: string;
  description: string;
  category: string;
  level: string;
  lessons: number;
  hours: number;
  accent: "teal" | "gold" | "bleu";
};

const COURSES: Course[] = [
  {
    icon: Atom,
    title: "Mécanique Quantique I",
    description:
      "Du formalisme de Dirac à l'atome d'hydrogène. 8 modules, simulations de paquets d'ondes, orbitales, et effet tunnel.",
    category: "Physique",
    level: "Intermédiaire",
    lessons: 18,
    hours: 70,
    accent: "teal",
  },
  {
    icon: Calculator,
    title: "Mécanique Classique",
    description:
      "De Newton à Lagrange. Cinématique, dynamique, énergie, collisions, oscillateurs, gravitation. Schémas matplotlib et trajectoires.",
    category: "Physique",
    level: "Débutant",
    lessons: 22,
    hours: 60,
    accent: "gold",
  },
  {
    icon: Code2,
    title: "Python · Algorithmique à la POO",
    description:
      "Apprends Python de zéro à la programmation orientée objet. Sandbox Pyodide intégrée, exercices auto-évalués.",
    category: "Programmation",
    level: "Débutant",
    lessons: 15,
    hours: 40,
    accent: "bleu",
  },
];

function FeaturedCourses() {
  return (
    <section id="courses" className="py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">
            Catalogue
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Des cours conçus pour la pratique
          </h2>
          <p className="mt-3 text-muted-foreground">
            Chaque leçon combine théorie, simulations interactives, exercices
            corrigés et évaluations adaptatives.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {COURSES.map((course) => (
            <CourseCard key={course.title} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CourseCard({ course }: { course: Course }) {
  const { icon: Icon, accent } = course;
  const accentClasses = {
    teal: "bg-[#2DD4BF]/10 text-[#2DD4BF] ring-[#2DD4BF]/20",
    gold: "bg-[#C9A227]/10 text-[#C9A227] ring-[#C9A227]/20",
    bleu: "bg-primary/10 text-primary ring-primary/20",
  }[accent];

  return (
    <Card className="group flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ring-1 ${accentClasses}`}
          >
            <Icon className="h-6 w-6" />
          </div>
          <Badge variant="outline">{course.category}</Badge>
        </div>
        <CardTitle className="mt-3 text-xl">{course.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <p className="text-sm text-muted-foreground">{course.description}</p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <Badge variant="secondary">{course.level}</Badge>
          <Badge variant="secondary">{course.lessons} leçons</Badge>
          <Badge variant="secondary">{course.hours} h</Badge>
        </div>

        <a
          href="#"
          className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors group-hover:text-primary/80"
        >
          Voir le cours
          <span aria-hidden>→</span>
        </a>
      </CardContent>
    </Card>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Features                                                                   */
/* ────────────────────────────────────────────────────────────────────────── */

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    icon: FlaskConical,
    title: "Laboratoires interactifs",
    description:
      "Des simulations PhET-style avec sliders, graphiques en temps réel, et challenges adaptatifs. L'élève manipule, observe, et apprend par l'expérimentation.",
  },
  {
    icon: Code2,
    title: "Sandbox Python intégrée",
    description:
      "Pyodide s'exécute dans le navigateur — pas d'installation. Trace des trajectoires, des orbitales, des distributions quantiques d'un clic.",
  },
  {
    icon: Calculator,
    title: "Rendu LaTeX natif",
    description:
      "MathJax rend toutes les formules : vecteurs, fractions, intégrales, matrices, kets et bras de Dirac. La physique s'affiche comme dans un cours.",
  },
  {
    icon: LineChart,
    title: "Évaluation adaptative",
    description:
      "Les exercices s'adaptent à ton niveau : bonne réponse → challenge plus dur, erreur → indice et variantes. Progression sauvegardée.",
  },
  {
    icon: MessagesSquare,
    title: "Mentorat personnalisé",
    description:
      "Réserve des séances de tutorat individuel avec des mentors experts. Visioconférence intégrée, paiement sécurisé, escrow automatique.",
  },
  {
    icon: Users,
    title: "Communauté active",
    description:
      "Forum par matière, profils étudiants, partage de solutions. Apprends en groupe, pose tes questions, aide les autres.",
  },
];

function Features() {
  return (
    <section id="features" className="bg-muted/30 py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">
            Fonctionnalités
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Tout ce qu&apos;il faut pour réussir
          </h2>
          <p className="mt-3 text-muted-foreground">
            Une plateforme complète, pensée pour l&apos;apprentissage actif des
            sciences.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform group-hover:scale-110">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Categories preview                                                         */
/* ────────────────────────────────────────────────────────────────────────── */

function CategoriesPreview() {
  const categories = [
    { name: "Physique", count: 2, icon: Atom, color: "text-[#2DD4BF]" },
    { name: "Mathématiques", count: 1, icon: Calculator, color: "text-[#C9A227]" },
    { name: "Programmation", count: 1, icon: Code2, color: "text-primary" },
  ];

  return (
    <section id="about" className="py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge variant="secondary" className="mb-3">
              Domaines
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Une plateforme multi-disciplinaire
            </h2>
            <p className="mt-4 text-muted-foreground">
              Numeria Institute couvre les sciences fondamentales et
              appliquées. Que tu prépares un examen, que tu apprends pour le
              plaisir, ou que tu cherches une carrière en tech, tu trouveras
              un parcours adapté.
            </p>
            <p className="mt-4 text-muted-foreground">
              Tous les cours sont en français, avec des exemples concrets et
              des exercices pensés pour les apprenants africains et
              francophones.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="rounded-2xl border border-border bg-card p-6 text-center transition-all hover:border-primary/30 hover:shadow-md"
              >
                <cat.icon className={`mx-auto h-10 w-10 ${cat.color}`} />
                <div className="mt-3 text-2xl font-bold">{cat.count}</div>
                <div className="text-sm text-muted-foreground">{cat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* CTA banner                                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

function CtaBanner() {
  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1B2A4E] via-[#1B2A4E] to-[#0d1530] px-6 py-16 text-center md:px-12 md:py-24">
          {/* Decorative glows */}
          <div
            aria-hidden
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#2DD4BF]/20 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#C9A227]/15 blur-3xl"
          />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Prêt à commencer ton apprentissage ?
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Inscription gratuite. Accès immédiat à tous les cours gratuits.
              Aucune carte bancaire requise.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-xl bg-[#2DD4BF] px-8 py-3.5 text-sm font-semibold text-[#1B2A4E] shadow-lg shadow-[#2DD4BF]/25 transition-transform hover:scale-105"
              >
                Créer un compte gratuit
              </a>
              <a
                href="#courses"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                Parcourir le catalogue
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
