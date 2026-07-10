/**
 * Seed full Mécanique Classique course (7 modules, 22 lessons)
 * and Mécanique Quantique I (8 modules, 18 lessons)
 * with text blocks (Markdown + LaTeX), sandbox blocks, MCQs, FB, TF.
 */
import { db } from "@/lib/db";

type BlockData = {
  type: "TEXT" | "SANDBOX" | "MCQ" | "FILL_BLANK" | "TRUE_FALSE";
  content?: string;
  title?: string;
  code?: string;
  question?: string;
  explanation?: string;
  choices?: { text: string; correct: boolean; feedback?: string }[];
  textWithBlanks?: string;
  answers?: Record<string, string[]>;
  statements?: { statement: string; is_true: boolean; statement_note?: string }[];
};

type LessonData = {
  title: string;
  slug: string;
  minutes: number;
  blocks: BlockData[];
};

type ModuleData = {
  title: string;
  description: string;
  lessons: LessonData[];
};

// ── Helpers ──
async function seedCourse(slug: string, modules: ModuleData[]) {
  const course = await db.course.findUnique({ where: { slug } });
  if (!course) { console.log(`Course ${slug} not found`); return; }

  // Delete existing modules/lessons/blocks
  await db.courseModule.deleteMany({ where: { courseId: course.id } });

  let lessonCount = 0;
  for (let mi = 0; mi < modules.length; mi++) {
    const mod = modules[mi];
    const module_ = await db.courseModule.create({
      data: { courseId: course.id, title: mod.title, description: mod.description, order: mi, isActive: true },
    });

    for (let li = 0; li < mod.lessons.length; li++) {
      const ld = mod.lessons[li];
      const lesson = await db.courseLesson.create({
        data: { courseId: course.id, moduleId: module_.id, title: ld.title, slug: ld.slug, order: li, estimatedMinutes: ld.minutes, isFreePreview: true, isActive: true },
      });

      for (let bi = 0; bi < ld.blocks.length; bi++) {
        const bd = ld.blocks[bi];
        await createBlock(lesson.id, course.id, bd, bi);
      }
      lessonCount++;
    }
  }
  console.log(`✓ ${slug}: ${modules.length} modules, ${lessonCount} lessons`);
}

async function createBlock(lessonId: string, courseId: string, bd: BlockData, order: number) {
  if (bd.type === "TEXT") {
    await db.lessonBlock.create({ data: { lessonId, blockType: "TEXT", order, textContent: bd.content } });
  } else if (bd.type === "SANDBOX") {
    await db.lessonBlock.create({ data: { lessonId, blockType: "SANDBOX", order, sandboxTitle: bd.title, sandboxInitialCode: bd.code } });
  } else if (bd.type === "MCQ" && bd.question && bd.choices) {
    const mcq = await db.mCQExercise.create({
      data: { lessonId, title: bd.title ?? "QCM", question: bd.question, explanation: bd.explanation ?? "", points: 5, difficulty: "easy", allowMultiple: false, shuffleChoices: true, isActive: true,
        choices: { create: bd.choices.map((c, i) => ({ text: c.text, isCorrect: c.correct, feedback: c.feedback ?? "", order: i })) } } });
    await db.lessonBlock.create({ data: { lessonId, blockType: "MCQ", order, mcqId: mcq.id } });
  } else if (bd.type === "FILL_BLANK" && bd.textWithBlanks && bd.answers) {
    const fb = await db.fillBlankExercise.create({
      data: { lessonId, title: bd.title ?? "À trous", textWithBlanks: bd.textWithBlanks, answersJson: JSON.stringify(bd.answers), explanation: bd.explanation ?? "", points: 5, isActive: true } });
    await db.lessonBlock.create({ data: { lessonId, blockType: "FILL_BLANK", order, fillBlankId: fb.id } });
  } else if (bd.type === "TRUE_FALSE" && bd.statements) {
    const tf = await db.trueFalseExercise.create({
      data: { lessonId, title: bd.title ?? "Vrai/Faux", statementsJson: JSON.stringify(bd.statements), explanation: bd.explanation ?? "", points: 6, isActive: true } });
    await db.lessonBlock.create({ data: { lessonId, blockType: "TRUE_FALSE", order, trueFalseId: tf.id } });
  }
}

// ── Mécanique Classique ──
const MECANIQUE: ModuleData[] = [
  {
    title: "Cinématique · Décrire le mouvement",
    description: "Position, vitesse, accélération, mouvements rectilignes et paraboliques.",
    lessons: [
      { title: "Vecteurs et repères", slug: "vecteurs-reperes", minutes: 35, blocks: [
        { type: "TEXT", content: "# Vecteurs et repères\n\n## 1. Vecteur\nUn **vecteur** possède direction, sens, norme, point d'application.\n$$|\\vec{v}| = \\sqrt{v_x^2 + v_y^2 + v_z^2}$$\n## 2. Produit scalaire\n$$\\vec{A} \\cdot \\vec{B} = |\\vec{A}||\\vec{B}|\\cos\\theta$$\n> 💡 Produit scalaire nul ⟺ vecteurs perpendiculaires." },
        { type: "SANDBOX", title: "Addition vectorielle", code: "import matplotlib.pyplot as plt\nimport numpy as np\nfrom matplotlib.patches import FancyArrowPatch\n\nfig, ax = plt.subplots(figsize=(7, 6))\nax.set_xlim(-1, 5); ax.set_ylim(-1, 5)\nA = np.array([3, 1]); B = np.array([1, 2]); C = A + B\nax.add_patch(FancyArrowPatch((0,0), A, arrowstyle='->', mutation_scale=20, color='blue', lw=2.5))\nax.add_patch(FancyArrowPatch((0,0), B, arrowstyle='->', mutation_scale=20, color='red', lw=2.5))\nax.add_patch(FancyArrowPatch((0,0), C, arrowstyle='->', mutation_scale=22, color='green', lw=3))\nax.set_aspect('equal'); ax.grid(True, alpha=0.3)\nplt.tight_layout(); plt.savefig('plot.png')" },
        { type: "MCQ", title: "Norme d'un vecteur", question: "Quelle est la norme du vecteur $\\vec{v} = (3, 4)$ ?", choices: [
          { text: "7", correct: false, feedback: "3+4=7 mais ce n'est pas la norme." },
          { text: "5", correct: true, feedback: "Exact ! √(9+16) = 5" },
          { text: "25", correct: false, feedback: "C'est le carré de la norme." },
          { text: "1", correct: false }], explanation: "$|v| = \\sqrt{3^2 + 4^2} = 5$" },
        { type: "FILL_BLANK", title: "Produit scalaire", textWithBlanks: "Soit $\\vec{A} = (2, 3)$ et $\\vec{B} = (4, -1)$. Alors $\\vec{A} \\cdot \\vec{B} = 2 \\times 4 + 3 \\times {{blank_1}} = {{blank_2}}$.", answers: { blank_1: ["-1"], blank_2: ["5"] }, explanation: "2×4 + 3×(-1) = 8 - 3 = 5" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "La vitesse est une grandeur vectorielle.", is_true: true },
          { statement: "La norme d'un vecteur peut être négative.", is_true: false },
          { statement: "Si $\\vec{A} \\cdot \\vec{B} = 0$ alors les vecteurs sont perpendiculaires.", is_true: true },
          { statement: "La masse est une grandeur vectorielle.", is_true: false }], explanation: "La masse est scalaire, la norme est toujours positive." },
      ]},
      { title: "Position, vitesse et accélération", slug: "position-vitesse-acceleration", minutes: 40, blocks: [
        { type: "TEXT", content: "# Position, vitesse, accélération\n\n## Position\n$$\\vec{r}(t) = x(t)\\,\\vec{i} + y(t)\\,\\vec{j} + z(t)\\,\\vec{k}$$\n## Vitesse\n$$\\vec{v}(t) = \\frac{d\\vec{r}}{dt} = \\dot{\\vec{r}}$$\n## Accélération\n$$\\vec{a}(t) = \\frac{d\\vec{v}}{dt} = \\frac{d^2\\vec{r}}{dt^2}$$\n## MRUA\n$$x(t) = x_0 + v_0 t + \\frac{1}{2} a t^2$$\n$$v^2 - v_0^2 = 2 a (x - x_0)$$" },
        { type: "SANDBOX", title: "MRUA: x(t), v(t), a(t)", code: "import matplotlib.pyplot as plt\nimport numpy as np\n\nt = np.linspace(0, 10, 200)\nx0, v0, a = 0, 5, 2\nx = x0 + v0*t + 0.5*a*t**2\nv = v0 + a*t\n\nfig, axes = plt.subplots(3, 1, figsize=(8, 10), sharex=True)\naxes[0].plot(t, x, 'b-', lw=2.5); axes[0].set_ylabel('x (m)'); axes[0].grid(True, alpha=0.3)\naxes[1].plot(t, v, 'r-', lw=2.5); axes[1].set_ylabel('v (m/s)'); axes[1].grid(True, alpha=0.3)\naxes[2].plot(t, np.full_like(t, a), 'g-', lw=2.5); axes[2].set_ylabel('a (m/s²)'); axes[2].set_xlabel('t (s)'); axes[2].grid(True, alpha=0.3)\nplt.tight_layout(); plt.savefig('plot.png')" },
        { type: "MCQ", title: "Vitesse et dérivée", question: "La vitesse est la dérivée de ___ par rapport au temps.", choices: [
          { text: "L'accélération", correct: false }, { text: "La position", correct: true, feedback: "Exact ! v = dr/dt" },
          { text: "La force", correct: false }, { text: "L'énergie", correct: false }], explanation: "v = dr/dt" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "L'accélération est la dérivée seconde de la position.", is_true: true },
          { statement: "Le vecteur vitesse est tangent à la trajectoire.", is_true: true },
          { statement: "Si la vitesse est constante, l'accélération est nulle.", is_true: true },
          { statement: "L'accélération normale modifie la norme de la vitesse.", is_true: false, statement_note: "C'est l'accélération tangentielle qui modifie la norme." }], explanation: "L'accélération normale modifie la direction." },
      ]},
      { title: "Mouvement rectiligne : MRU et MRUA", slug: "mru-mrua", minutes: 35, blocks: [
        { type: "TEXT", content: "# MRU et MRUA\n\n## MRU\n$$x(t) = x_0 + v\\,t$$\n## MRUA\n$$v(t) = v_0 + at$$\n$$x(t) = x_0 + v_0 t + \\frac{1}{2}at^2$$\n$$v^2 - v_0^2 = 2a(x - x_0)$$\n> 💡 Ces formules ne sont valables que si a est constant." },
        { type: "MCQ", title: "Distance de freinage", question: "Une voiture à 30 m/s décélère à -6 m/s². Temps d'arrêt ?", choices: [
          { text: "3 s", correct: false }, { text: "5 s", correct: true, feedback: "Bravo ! t = v/|a| = 30/6 = 5 s" },
          { text: "6 s", correct: false }, { text: "10 s", correct: false }], explanation: "t = -v₀/a = 30/6 = 5 s" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "Dans un MRU, l'accélération est nulle.", is_true: true },
          { statement: "La formule v²-v₀²=2aΔx ne nécessite pas le temps.", is_true: true },
          { statement: "Si a > 0, l'objet accélère forcément.", is_true: false, statement_note: "Pas forcément : si v₀ < 0 et a > 0, l'objet ralentit d'abord." }], explanation: "Le signe de a seul ne détermine pas si on accélère ou ralentit." },
      ]},
      { title: "Mouvement parabolique (projectile)", slug: "projectile-parabolique", minutes: 45, blocks: [
        { type: "TEXT", content: "# Mouvement parabolique\n\n## Équations\n$$x(t) = v_0 \\cos\\alpha \\cdot t$$\n$$y(t) = v_0 \\sin\\alpha \\cdot t - \\frac{1}{2}gt^2$$\n## Portée\n$$P = \\frac{v_0^2 \\sin(2\\alpha)}{g}$$\n## Flèche\n$$h = \\frac{v_0^2 \\sin^2\\alpha}{2g}$$\n> 💡 La portée maximale est à α = 45°." },
        { type: "SANDBOX", title: "Trajectoire parabolique", code: "import matplotlib.pyplot as plt\nimport numpy as np\n\ng = 9.81; v0 = 30; alpha = np.radians(45)\nT = 2*v0*np.sin(alpha)/g\nt = np.linspace(0, T, 200)\nx = v0*np.cos(alpha)*t\ny = v0*np.sin(alpha)*t - 0.5*g*t**2\n\nfig, ax = plt.subplots(figsize=(10, 6))\nax.plot(x, y, 'b-', lw=2.5)\nP = v0**2*np.sin(2*alpha)/g; h = (v0*np.sin(alpha))**2/(2*g)\nax.plot(P, 0, 'gs', markersize=10, label=f'Portée: {P:.1f}m')\nax.plot(x[np.argmax(y)], max(y), 'r^', markersize=10, label=f'Flèche: {h:.1f}m')\nax.set_xlabel('x (m)'); ax.set_ylabel('y (m)'); ax.legend(); ax.grid(True, alpha=0.3)\nplt.tight_layout(); plt.savefig('plot.png')" },
        { type: "MCQ", title: "Angle de portée maximale", question: "Quel angle donne la portée maximale (sans frottement) ?", choices: [
          { text: "30°", correct: false }, { text: "45°", correct: true, feedback: "Exact ! sin(2×45°) = 1" },
          { text: "60°", correct: false }, { text: "90°", correct: false }], explanation: "P = v₀²sin(2α)/g est max pour α = 45°" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "Le mouvement horizontal est un MRU.", is_true: true },
          { statement: "Au sommet, la vitesse est nulle.", is_true: false, statement_note: "Seule la composante verticale est nulle." },
          { statement: "Pour des angles complémentaires, la portée est la même.", is_true: true }], explanation: "sin(2α) = sin(180°-2α)" },
      ]},
      { title: "Mouvement circulaire uniforme", slug: "mouvement-circulaire", minutes: 40, blocks: [
        { type: "TEXT", content: "# Mouvement circulaire uniforme\n\n## Relation\n$$v = R\\omega$$\n## Accélération centripète\n$$a = \\frac{v^2}{R} = R\\omega^2$$\n## Période\n$$T = \\frac{2\\pi}{\\omega}$$\n> 💡 L'accélération est centripète (vers le centre), pas centrifuge." },
        { type: "SANDBOX", title: "MCU: vecteurs v et a", code: "import matplotlib.pyplot as plt\nimport numpy as np\n\nR = 3; omega = 2\nfig, ax = plt.subplots(figsize=(7, 7))\ntheta = np.linspace(0, 2*np.pi, 200)\nax.plot(R*np.cos(theta), R*np.sin(theta), 'b-', lw=2)\nfor ang in np.linspace(0, 2*np.pi, 8, endpoint=False):\n    px, py = R*np.cos(ang), R*np.sin(ang)\n    ax.add_patch(plt.Arrow(px, py, -R*omega*np.sin(ang)*0.5, R*omega*np.cos(ang)*0.5, width=0.15, color='green'))\n    ax.add_patch(plt.Arrow(px, py, -np.cos(ang)*0.8, -np.sin(ang)*0.8, width=0.12, color='red'))\nax.set_aspect('equal'); ax.grid(True, alpha=0.3); ax.set_title('MCU: v (vert) tangent, a (rouge) centripète')\nplt.tight_layout(); plt.savefig('plot.png')" },
        { type: "MCQ", title: "Accélération en MCU", question: "Dans un MCU, l'accélération est :", choices: [
          { text: "Nulle", correct: false }, { text: "Centripète, de norme v²/R", correct: true, feedback: "Bravo !" },
          { text: "Tangentielle", correct: false }, { text: "Centrifuge", correct: false, feedback: "La force centrifuge n'existe pas en référentiel galiléen." }], explanation: "a = v²/R vers le centre" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "En MCU, le vecteur vitesse change de direction.", is_true: true },
          { statement: "Si R double à ω constant, l'accélération centripète double.", is_true: true },
          { statement: "T = 2π/ω est la période.", is_true: true }], explanation: "a = Rω², donc a ∝ R à ω constant." },
      ]},
    ],
  },
  {
    title: "Dynamique · Les forces et les lois de Newton",
    description: "Lois de Newton, forces usuelles, plan incliné, applications.",
    lessons: [
      { title: "Les trois lois de Newton", slug: "lois-newton", minutes: 45, blocks: [
        { type: "TEXT", content: "# Les trois lois de Newton\n\n## 1. Principe d'inertie\nSi $\\sum \\vec{F} = \\vec{0}$ alors $\\vec{v} = \\text{cste}$\n## 2. PFD\n$$\\sum \\vec{F} = m\\,\\vec{a}$$\n## 3. Actions réciproques\n$$\\vec{F}_{A \\to B} = -\\vec{F}_{B \\to A}$$\n> 💡 Les forces des 3ème loi s'exercent sur des corps différents — elles ne se compensent pas." },
        { type: "MCQ", title: "PFD", question: "Une force de 10 N sur un objet de 2 kg donne quelle accélération ?", choices: [
          { text: "20 m/s²", correct: false }, { text: "5 m/s²", correct: true, feedback: "a = F/m = 10/2 = 5" },
          { text: "0.2 m/s²", correct: false }, { text: "10 m/s²", correct: false }], explanation: "a = F/m = 10/2 = 5 m/s²" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "Dans le vide, une plume et une bille tombent à la même vitesse.", is_true: true },
          { statement: "Les forces de la 3ème loi se compensent.", is_true: false, statement_note: "Elles s'exercent sur des corps différents." },
          { statement: "Le PFD n'est valable que dans un référentiel galiléen.", is_true: true }], explanation: "Les forces de la 3ème loi sont sur des objets différents." },
      ]},
      { title: "Forces usuelles", slug: "forces-usuelles", minutes: 40, blocks: [
        { type: "TEXT", content: "# Forces usuelles\n\n## Poids\n$$\\vec{P} = m\\vec{g}$$\n## Tension\nForce d'un fil, le long du fil, vers le fil.\n## Réaction normale\nPerpendiculaire au support, vers l'objet.\n## Frottement sec\n$$|\\vec{f}| = \\mu|\\vec{R}|$$\n## Ressort (Hooke)\n$$\\vec{F} = -k(x - x_0)\\vec{u}$$" },
        { type: "MCQ", title: "Poids sur la Lune", question: "Astronaute de 80 kg sur la Lune (g = 1.6 m/s²). Poids ?", choices: [
          { text: "80 N", correct: false }, { text: "784 N", correct: false, feedback: "C'est sur Terre." },
          { text: "128 N", correct: true, feedback: "P = 80 × 1.6 = 128 N" }, { text: "0 N", correct: false }], explanation: "P = mg_Lune = 80 × 1.6 = 128 N" },
        { type: "FILL_BLANK", title: "Loi de Hooke", textWithBlanks: "$\\vec{F} = {{blank_1}}(x - x_0)\\vec{u}$. Si k = 50 N/m et Δx = 0.1 m, alors |F| = {{blank_2}} N. Le signe indique vers l'équilibre.", answers: { blank_1: ["-k"], blank_2: ["5"] }, explanation: "F = -kΔx, |F| = 50 × 0.1 = 5 N" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "Un fil ne peut que tirer.", is_true: true },
          { statement: "La réaction normale est toujours verticale.", is_true: false, statement_note: "Elle est perpendiculaire au support." },
          { statement: "Le frottement statique est généralement supérieur au cinétique.", is_true: true }], explanation: "La réaction est perpendiculaire au support, pas forcément verticale." },
      ]},
      { title: "Plan incliné et frottement", slug: "plan-incline-frottement", minutes: 40, blocks: [
        { type: "TEXT", content: "# Plan incliné\n\n## PFD projeté\n$$ma = mg\\sin\\alpha - f$$\n$$R = mg\\cos\\alpha$$\n## Sans frottement\n$$a = g\\sin\\alpha$$\n## Avec frottement\n$$a = g(\\sin\\alpha - \\mu_c \\cos\\alpha)$$\n## Angle critique\n$$\\tan\\alpha_c = \\mu_s$$" },
        { type: "SANDBOX", title: "Accélération vs angle", code: "import matplotlib.pyplot as plt\nimport numpy as np\n\ng = 9.81\nalpha = np.linspace(0, 90, 200)\nar = np.radians(alpha)\nfor mu in [0, 0.2, 0.4, 0.6]:\n    a = g * (np.sin(ar) - mu * np.cos(ar))\n    a = np.where(a > 0, a, 0)\n    plt.plot(alpha, a, lw=2.5, label=f'μ = {mu}')\nplt.xlabel('Angle α (°)'); plt.ylabel('a (m/s²)'); plt.title('Plan incliné: a = g(sinα - μcosα)')\nplt.legend(); plt.grid(True, alpha=0.3); plt.tight_layout(); plt.savefig('plot.png')" },
        { type: "MCQ", title: "Accélération sans frottement", question: "Bloc sur plan incliné à 30° sans frottement. Accélération ?", choices: [
          { text: "9.81 m/s²", correct: false }, { text: "4.90 m/s²", correct: true, feedback: "a = g sin30° = 4.9" },
          { text: "8.49 m/s²", correct: false, feedback: "Tu as utilisé cos." }, { text: "0", correct: false }], explanation: "a = g sinα = 9.81 × 0.5 ≈ 4.9 m/s²" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "Sans frottement, l'accélération ne dépend pas de la masse.", is_true: true },
          { statement: "Si tanα < μs, le bloc reste immobile.", is_true: true },
          { statement: "La réaction normale vaut mg sur un plan incliné.", is_true: false, statement_note: "Elle vaut mg cosα." }], explanation: "R = mg cosα, pas mg." },
      ]},
      { title: "Applications : virages, loop", slug: "applications-dynamique", minutes: 45, blocks: [
        { type: "TEXT", content: "# Applications\n\n## Virage à plat\n$$v_{max} = \\sqrt{\\mu_s g R}$$\n## Loop vertical\nAu sommet : $mg + R = mv^2/R$\nVitesse minimale : $v_{min} = \\sqrt{gR}$\n## Pendule conique\n$$\\cos\\alpha = \\frac{g}{\\omega^2 L}$$" },
        { type: "MCQ", title: "Vitesse max dans un virage", question: "Virage R=50m, μ=0.6. Vitesse max ?", choices: [
          { text: "54 km/h", correct: false }, { text: "62 km/h", correct: true, feedback: "v = √(0.6×9.81×50) ≈ 17.2 m/s ≈ 62 km/h" },
          { text: "80 km/h", correct: false }, { text: "100 km/h", correct: false }], explanation: "v = √(μgR) ≈ 17.2 m/s" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "La force centripète dans un virage est fournie par le frottement.", is_true: true },
          { statement: "Dans un loop, le sommet est le point le plus critique.", is_true: true },
          { statement: "Plus ω augmente dans un pendule conique, plus α diminue.", is_true: false, statement_note: "α augmente avec ω." }], explanation: "cosα = g/(ω²L), donc si ω augmente, cosα diminue, α augmente." },
      ]},
    ],
  },
  {
    title: "Travail et énergie",
    description: "Travail, énergie cinétique, énergie potentielle, conservation.",
    lessons: [
      { title: "Travail d'une force", slug: "travail-force", minutes: 35, blocks: [
        { type: "TEXT", content: "# Travail d'une force\n\n$$W = \\vec{F} \\cdot \\vec{AB} = F \\cdot AB \\cdot \\cos\\theta$$\n## Puissance\n$$P = \\vec{F} \\cdot \\vec{v}$$\n## TEC\n$$\\Delta E_c = \\sum W$$\n> 💡 Force perpendiculaire → travail nul." },
        { type: "MCQ", title: "Travail et angle", question: "Force de 10 N à 60° du déplacement de 5 m. Travail ?", choices: [
          { text: "50 J", correct: false }, { text: "25 J", correct: true, feedback: "W = 10×5×cos60° = 25 J" },
          { text: "43.3 J", correct: false, feedback: "Tu as utilisé sin." }, { text: "0 J", correct: false }], explanation: "W = Fd cosθ = 10×5×0.5 = 25 J" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "Le travail peut être négatif.", is_true: true },
          { statement: "Le travail du poids dépend du chemin.", is_true: false, statement_note: "Le poids est conservatif." },
          { statement: "Le travail des forces de frottement est toujours négatif.", is_true: true }], explanation: "Le frottement s'oppose au déplacement." },
      ]},
      { title: "Énergie cinétique et TEC", slug: "energie-cinetique", minutes: 35, blocks: [
        { type: "TEXT", content: "# Énergie cinétique\n\n$$E_c = \\frac{1}{2}mv^2$$\n## TEC\n$$\\Delta E_c = E_c(B) - E_c(A) = \\sum W$$\n> 💡 Si le problème demande une vitesse sans le temps → TEC." },
        { type: "MCQ", title: "Énergie cinétique", question: "Si la vitesse double, Ec est multipliée par :", choices: [
          { text: "2", correct: false }, { text: "4", correct: true, feedback: "Ec ∝ v²" },
          { text: "8", correct: false }, { text: "1/2", correct: false }], explanation: "Ec = ½mv² ∝ v²" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "L'énergie cinétique est toujours positive.", is_true: true },
          { statement: "Le TEC donne la direction de la vitesse.", is_true: false, statement_note: "Il donne la norme seulement." },
          { statement: "Si ΣW = 0, alors vB = vA.", is_true: true }], explanation: "Le TEC ne donne que la norme." },
      ]},
      { title: "Énergie potentielle et mécanique", slug: "energie-potentielle", minutes: 40, blocks: [
        { type: "TEXT", content: "# Énergie potentielle\n\n## Poids\n$$E_p = mgz$$\n## Ressort\n$$E_p = \\frac{1}{2}k(x-x_0)^2$$\n## Énergie mécanique\n$$E_m = E_c + E_p$$\n## Conservation\nSi pas de frottement : $E_m = \\text{cste}$" },
        { type: "MCQ", title: "Énergie potentielle", question: "Objet de 2 kg à 5 m de hauteur. Ep ?", choices: [
          { text: "10 J", correct: false }, { text: "49 J", correct: false },
          { text: "98 J", correct: true, feedback: "Ep = mgh = 2×9.81×5 ≈ 98 J" }, { text: "196 J", correct: false }], explanation: "Ep = mgh = 2 × 9.81 × 5" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "Le poids est conservatif.", is_true: true },
          { statement: "Les forces de frottement sont conservatives.", is_true: false },
          { statement: "Les minima de Ep correspondent à des équilibres stables.", is_true: true }], explanation: "Les frottements sont non conservatifs." },
      ]},
      { title: "Conservation de l'énergie", slug: "conservation-energie", minutes: 40, blocks: [
        { type: "TEXT", content: "# Conservation de l'énergie\n\nSans frottement : $E_m = E_c + E_p = \\text{cste}$\n## Vitesse au bas d'une pente\n$$v = \\sqrt{2gh}$$\n## Loop vertical\nAu sommet : $v_{min} = \\sqrt{gR}$\nAu bas : $v_0 = \\sqrt{5gR}$" },
        { type: "MCQ", title: "Vitesse au bas", question: "Objet qui tombe de h=5m sans frottement. Vitesse au sol ?", choices: [
          { text: "5 m/s", correct: false }, { text: "9.9 m/s", correct: true, feedback: "v = √(2gh) = √(2×9.81×5)" },
          { text: "49 m/s", correct: false }, { text: "98 m/s", correct: false }], explanation: "v = √(2gh)" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "Sans frottement, Em est constante.", is_true: true },
          { statement: "La vitesse au bas d'une pente dépend de l'angle.", is_true: false, statement_note: "Elle ne dépend que de h." },
          { statement: "Dans un loop, il faut partir d'au moins 5R/2 au-dessus du bas.", is_true: true }], explanation: "v₀ = √(5gR) → h = 5R/2" },
      ]},
    ],
  },
  {
    title: "Collisions et quantité de mouvement",
    description: "Quantité de mouvement, collisions élastiques et inélastiques.",
    lessons: [
      { title: "Quantité de mouvement et impulsion", slug: "quantite-mouvement", minutes: 35, blocks: [
        { type: "TEXT", content: "# Quantité de mouvement\n\n$$\\vec{p} = m\\vec{v}$$\n## Conservation\nSi $\\sum \\vec{F}_{ext} = \\vec{0}$ : $\\vec{P} = \\text{cste}$\n## Impulsion\n$$\\Delta \\vec{p} = \\int \\vec{F}\\,dt$$" },
        { type: "MCQ", title: "Conservation de p", question: "La quantité de mouvement se conserve si :", choices: [
          { text: "Le système est isolé", correct: true, feedback: "Exact !" },
          { text: "Le système est immobile", correct: false },
          { text: "Il y a des forces internes", correct: false },
          { text: "Le système est soumis à la gravité", correct: false }], explanation: "Système isolé = pas de forces externes." },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "La quantité de mouvement est un vecteur.", is_true: true },
          { statement: "Les forces internes ne modifient pas la quantité de mouvement totale.", is_true: true },
          { statement: "Le centre de masse d'un système isolé se déplace à vitesse constante.", is_true: true }], explanation: "Tous corrects — principes fondamentaux." },
      ]},
      { title: "Collisions élastiques et inélastiques", slug: "collisions", minutes: 45, blocks: [
        { type: "TEXT", content: "# Collisions\n\n## Choc élastique\nConservation de p ET Ec\n## Choc mou\n$v = \\frac{m_1 v_1 + m_2 v_2}{m_1 + m_2}$\n## Coefficient de restitution\n$$e = -\\frac{v_1' - v_2'}{v_1 - v_2}$$\n- e=1 : élastique, e=0 : mou" },
        { type: "MCQ", title: "Choc élastique, masses égales", question: "Bille de 1 kg à 4 m/s percute une bille identique au repos. Après choc élastique :", choices: [
          { text: "Les deux avancent à 2 m/s", correct: false },
          { text: "La première s'arrête, la deuxième part à 4 m/s", correct: true, feedback: "Les vitesses s'échangent !" },
          { text: "Les deux rebondissent", correct: false },
          { text: "La première continue à 4 m/s", correct: false }], explanation: "Pour m₁=m₂ en choc élastique 1D, les vitesses s'échangent." },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "La quantité de mouvement se conserve dans tout type de choc.", is_true: true },
          { statement: "L'énergie cinétique se conserve dans un choc parfaitement inélastique.", is_true: false },
          { statement: "Le coefficient de restitution est toujours entre 0 et 1.", is_true: true }], explanation: "e ∈ [0,1]." },
      ]},
    ],
  },
  {
    title: "Oscillateurs",
    description: "Oscillateur harmonique, pendule simple, oscillations amorties.",
    lessons: [
      { title: "Oscillateur harmonique", slug: "oscillateur-harmonique", minutes: 45, blocks: [
        { type: "TEXT", content: "# Oscillateur harmonique\n\n$$\\ddot{x} + \\omega_0^2 x = 0$$\n## Solution\n$$x(t) = X\\cos(\\omega_0 t + \\varphi)$$\n## Pulsation\n$$\\omega_0 = \\sqrt{\\frac{k}{m}}$$\n## Période\n$$T = 2\\pi\\sqrt{\\frac{m}{k}}$$\n> 💡 La période ne dépend pas de l'amplitude (isochronisme)." },
        { type: "SANDBOX", title: "Oscillateur harmonique", code: "import matplotlib.pyplot as plt\nimport numpy as np\n\nk, m = 10, 1.0\nomega0 = np.sqrt(k/m); T = 2*np.pi/omega0\nt = np.linspace(0, 3*T, 500)\nx = 0.5 * np.cos(omega0*t)\nv = -0.5*omega0*np.sin(omega0*t)\n\nfig, axes = plt.subplots(2, 1, figsize=(8, 8), sharex=True)\naxes[0].plot(t, x, 'b-', lw=2.5); axes[0].set_ylabel('x (m)'); axes[0].grid(True, alpha=0.3)\naxes[1].plot(t, v, 'r-', lw=2.5); axes[1].set_ylabel('v (m/s)'); axes[1].set_xlabel('t (s)'); axes[1].grid(True, alpha=0.3)\nplt.tight_layout(); plt.savefig('plot.png')" },
        { type: "MCQ", title: "Période", question: "Ressort k=16 N/m, m=1 kg. Période ?", choices: [
          { text: "0.5 s", correct: false }, { text: "1.57 s", correct: true, feedback: "T = 2π√(1/16) = π/2" },
          { text: "6.28 s", correct: false }, { text: "16 s", correct: false }], explanation: "T = 2π√(m/k) = 2π/4 = π/2" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "La période ne dépend pas de l'amplitude.", is_true: true },
          { statement: "L'énergie mécanique est proportionnelle à l'amplitude.", is_true: false, statement_note: "Proportionnelle au carré de l'amplitude." },
          { statement: "Le portrait de phase est composé d'ellipses.", is_true: true }], explanation: "Em = ½kX² ∝ X²" },
      ]},
      { title: "Pendule simple", slug: "pendule-simple", minutes: 40, blocks: [
        { type: "TEXT", content: "# Pendule simple\n\n## Équation\n$$\\ddot{\\theta} + \\frac{g}{L}\\sin\\theta = 0$$\n## Petites oscillations\n$$T = 2\\pi\\sqrt{\\frac{L}{g}}$$\n> 💡 La période ne dépend pas de la masse." },
        { type: "MCQ", title: "Période du pendule", question: "Pendule de L=0.25m. Période ?", choices: [
          { text: "0.5 s", correct: false }, { text: "1.0 s", correct: true, feedback: "T = 2π√(0.25/9.81) ≈ 1 s" },
          { text: "2.0 s", correct: false }, { text: "3.14 s", correct: false }], explanation: "T = 2π√(L/g)" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "La période ne dépend pas de la masse.", is_true: true },
          { statement: "Pour de grandes amplitudes, la période diminue.", is_true: false, statement_note: "Elle augmente." },
          { statement: "L'équation exacte est non linéaire.", is_true: true }], explanation: "Pour grandes amplitudes, T augmente." },
      ]},
      { title: "Oscillations amorties et forcées", slug: "oscillations-amorties", minutes: 40, blocks: [
        { type: "TEXT", content: "# Oscillations amorties\n\n$$\\ddot{x} + 2\\gamma\\dot{x} + \\omega_0^2 x = 0$$\n## Régimes\n- Sous-critique : γ < ω₀ (oscillations amorties)\n- Critique : γ = ω₀ (retour le plus rapide)\n- Sur-critique : γ > ω₀ (retour sans oscillation)\n## Résonance\nAmplitude maximale pour ω ≈ ω₀" },
        { type: "MCQ", title: "Régime critique", question: "Le régime critique correspond à :", choices: [
          { text: "γ < ω₀", correct: false }, { text: "γ = ω₀", correct: true, feedback: "Retour le plus rapide sans oscillation" },
          { text: "γ > ω₀", correct: false }, { text: "γ = 0", correct: false }], explanation: "γ = ω₀ = régime critique" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "À la résonance, l'amplitude est maximale.", is_true: true },
          { statement: "Le régime critique revient le plus vite à l'équilibre.", is_true: true },
          { statement: "Plus γ est faible, plus le pic de résonance est élevé.", is_true: true }], explanation: "Tous corrects." },
      ]},
    ],
  },
  {
    title: "Gravitation universelle",
    description: "Loi de Newton, lois de Kepler, orbites.",
    lessons: [
      { title: "Loi de gravitation universelle", slug: "loi-gravitation", minutes: 40, blocks: [
        { type: "TEXT", content: "# Gravitation universelle\n\n$$\\vec{F} = -G\\frac{m_1 m_2}{r^2}\\vec{u_r}$$\n\n$G = 6{,}674 \\times 10^{-11}$ N·m²/kg²\n\n## Champ gravitationnel\n$$g(h) = g_0\\left(\\frac{R_T}{R_T + h}\\right)^2$$\n> 💡 À la surface : g₀ = GM_T/R_T² ≈ 9.81 m/s²" },
        { type: "MCQ", title: "Force gravitationnelle", question: "Si la distance double, la force :", choices: [
          { text: "Double", correct: false }, { text: "Reste la même", correct: false },
          { text: "Est divisée par 4", correct: true, feedback: "F ∝ 1/r²" },
          { text: "Est divisée par 2", correct: false }], explanation: "F = Gm₁m₂/r², donc r→2r ⇒ F→F/4" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "La gravitation est toujours attractive.", is_true: true },
          { statement: "La force gravitationnelle est inversement proportionnelle à la distance.", is_true: false, statement_note: "Au carré de la distance." },
          { statement: "À l'intérieur d'une coquille sphérique, le champ est nul.", is_true: true }], explanation: "F ∝ 1/r², pas 1/r." },
      ]},
      { title: "Lois de Kepler", slug: "lois-kepler", minutes: 45, blocks: [
        { type: "TEXT", content: "# Lois de Kepler\n\n## 1. Orbites elliptiques\nLes planètes décrivent des ellipses (Soleil à un foyer).\n## 2. Loi des aires\nLe rayon balaie des aires égales en temps égaux.\n## 3. Loi des périodes\n$$\\frac{T^2}{a^3} = \\frac{4\\pi^2}{GM}$$\n## Vitesse de libération\n$$v_2 = \\sqrt{\\frac{2GM}{R}}$$" },
        { type: "MCQ", title: "3ème loi de Kepler", question: "Si a est multiplié par 4, T est multiplié par :", choices: [
          { text: "4", correct: false }, { text: "8", correct: true, feedback: "T ∝ a^(3/2), donc 4^(3/2) = 8" },
          { text: "16", correct: false }, { text: "64", correct: false }], explanation: "T² ∝ a³, donc T ∝ a^(3/2)" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "Les planètes parcourent des ellipses avec le Soleil à un foyer.", is_true: true },
          { statement: "La vitesse d'une planète est constante sur son orbite.", is_true: false, statement_note: "Elle varie : plus rapide au périhélie." },
          { statement: "La vitesse de libération est √2 fois la vitesse orbitale.", is_true: true }], explanation: "v₂ = √2 × v₁" },
      ]},
    ],
  },
  {
    title: "Mécanique avancée",
    description: "Moment cinétique, rotation, Lagrange.",
    lessons: [
      { title: "Moment cinétique et rotation", slug: "moment-cinetique", minutes: 45, blocks: [
        { type: "TEXT", content: "# Moment cinétique\n\n$$\\vec{L} = \\vec{r} \\times m\\vec{v}$$\n## Théorème\n$$\\frac{d\\vec{L}}{dt} = \\sum \\vec{\\mathcal{M}}$$\n## Solide en rotation\n$$I\\dot{\\omega} = \\sum \\mathcal{M}$$\n## Disque plein\n$$I = \\frac{1}{2}mR^2$$\n## Conservation\nSi ΣM = 0 : L = Iω = cste" },
        { type: "MCQ", title: "Moment d'inertie", question: "Moment d'inertie d'un disque plein ?", choices: [
          { text: "mR²", correct: false }, { text: "½mR²", correct: true, feedback: "Exact !" },
          { text: "⅖mR²", correct: false, feedback: "C'est une sphère." }, { text: "⅟₁₂mL²", correct: false, feedback: "C'est une tige." }], explanation: "Disque plein : I = ½mR²" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "Le moment cinétique se conserve si le moment des forces est nul.", is_true: true },
          { statement: "Le moment d'inertie joue le rôle de la masse en rotation.", is_true: true },
          { statement: "Quand un patineur rapproche ses bras, sa vitesse de rotation diminue.", is_true: false, statement_note: "Elle augmente : I diminue, ω augmente." }], explanation: "L = Iω constant, donc si I diminue, ω augmente." },
      ]},
      { title: "Introduction au formalisme de Lagrange", slug: "lagrange", minutes: 50, blocks: [
        { type: "TEXT", content: "# Mécanique de Lagrange\n\n## Lagrangien\n$$\\mathcal{L} = E_c - E_p$$\n## Équation d'Euler-Lagrange\n$$\\frac{d}{dt}\\frac{\\partial \\mathcal{L}}{\\partial \\dot{q}} - \\frac{\\partial \\mathcal{L}}{\\partial q} = 0$$\n## Théorème de Noether\nÀ toute symétrie continue correspond une quantité conservée.\n- Translation temps → énergie\n- Translation espace → quantité de mouvement\n- Rotation → moment cinétique" },
        { type: "MCQ", title: "Lagrangien", question: "Le lagrangien est défini par :", choices: [
          { text: "L = Ec + Ep", correct: false }, { text: "L = Ec - Ep", correct: true, feedback: "Exact !" },
          { text: "L = Ec · Ep", correct: false }, { text: "L = Em = Ec + Ep", correct: false }], explanation: "L = Ec - Ep" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "Le lagrangien est L = Ec - Ep.", is_true: true },
          { statement: "Les équations d'Euler-Lagrange sont vectorielles.", is_true: false, statement_note: "Elles sont scalaires (une par coordonnée)." },
          { statement: "La conservation de l'énergie correspond à la symétrie de translation dans le temps.", is_true: true }], explanation: "Euler-Lagrange est scalaire, une équation par coordonnée généralisée." },
      ]},
    ],
  },
];

// ── Mécanique Quantique I ──
const QUANTIQUE: ModuleData[] = [
  {
    title: "Introduction · Pourquoi la mécanique quantique ?",
    description: "Limites de la physique classique, dualité onde-corpuscule.",
    lessons: [
      { title: "Échelles quantiques", slug: "echelles-quantiques", minutes: 45, blocks: [
        { type: "TEXT", content: "# Échelles quantiques\n\n## Crise de la physique classique\n- Spectre de raies\n- Effet photoélectrique\n- Catastrophe ultraviolette\n## Constantes\n$h = 6{,}626 \\times 10^{-34}$ J·s, $\\hbar = h/(2\\pi)$\n## Régime quantique\n$$S \\sim \\hbar \\Rightarrow \\text{quantique}$$" },
        { type: "MCQ", title: "Échelle atomique", question: "Le rayon de Bohr vaut environ :", choices: [
          { text: "0.5 fm", correct: false }, { text: "0.5 Å", correct: true, feedback: "a₀ ≈ 0.529 Å" },
          { text: "0.5 nm", correct: false }, { text: "0.5 μm", correct: false }], explanation: "a₀ ≈ 0.529 Å = 5.29×10⁻¹¹ m" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "La mécanique quantique est nécessaire quand S ~ ℏ.", is_true: true },
          { statement: "Pour une balle de tennis, S/ℏ ~ 1.", is_true: false, statement_note: "S/ℏ ~ 10³³ → classique." },
          { statement: "Quand v ~ c, il faut la mécanique quantique relativiste.", is_true: true }], explanation: "Une balle a S/ℏ ~ 10³³, c'est classique." },
      ]},
      { title: "Dualité onde-corpuscule", slug: "dualite-onde-corpuscule", minutes: 50, blocks: [
        { type: "TEXT", content: "# Dualité onde-corpuscule\n\n## Photon\n$$E = h\\nu = \\hbar\\omega$$\n## de Broglie\n$$\\lambda = \\frac{h}{p}$$\n## Fentes de Young\nUn électron isolé passe par les deux fentes (onde), mais est détecté en un point (particule)." },
        { type: "MCQ", title: "de Broglie", question: "La longueur d'onde de de Broglie vaut :", choices: [
          { text: "λ = hp", correct: false }, { text: "λ = h/p", correct: true, feedback: "Exact !" },
          { text: "λ = p/h", correct: false }, { text: "λ = hp²", correct: false }], explanation: "λ = h/p" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "Un photon transporte une énergie E = hν.", is_true: true },
          { statement: "Dans les fentes de Young, un électron isolé passe par une seule fente.", is_true: false, statement_note: "Il passe par les deux à la fois." },
          { statement: "Plus une particule est rapide, plus λ est court.", is_true: true }], explanation: "λ = h/p, p plus grand → λ plus court." },
      ]},
      { title: "Effet photoélectrique et corps noir", slug: "effet-photoelectrique", minutes: 45, blocks: [
        { type: "TEXT", content: "# Effet photoélectrique\n\n## Équation d'Einstein\n$$h\\nu = W + \\frac{1}{2}mv^2$$\n## Fréquence seuil\n$$\\nu_0 = \\frac{W}{h}$$\n## Loi de Planck\n$$u(\\nu, T) = \\frac{8\\pi h \\nu^3}{c^3}\\frac{1}{e^{h\\nu/(k_BT)} - 1}$$" },
        { type: "MCQ", title: "Effet photoélectrique", question: "Si on augmente l'intensité (même fréquence) :", choices: [
          { text: "L'énergie cinétique des électrons augmente", correct: false },
          { text: "Le nombre de photoélectrons augmente", correct: true, feedback: "Plus de photons → plus d'électrons, même énergie." },
          { text: "Aucun effet", correct: false }, { text: "L'effet disparaît", correct: false }], explanation: "L'intensité = nombre de photons, pas leur énergie." },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "La loi de Rayleigh-Jeans diverge à haute fréquence.", is_true: true },
          { statement: "L'énergie cinétique des photoélectrons dépend de l'intensité.", is_true: false, statement_note: "Elle dépend de la fréquence." },
          { statement: "Einstein a reçu le Nobel pour l'effet photoélectrique.", is_true: true }], explanation: "Einstein a eu le Nobel en 1921 pour l'effet photoélectrique." },
      ]},
    ],
  },
  {
    title: "Formalisme mathématique",
    description: "Espace de Hilbert, bra-ket, opérateurs, Schrödinger.",
    lessons: [
      { title: "Espace de Hilbert et notation bra-ket", slug: "espace-hilbert-bra-ket", minutes: 55, blocks: [
        { type: "TEXT", content: "# Espace de Hilbert\n\n## Ket et bra\n$|\\psi\\rangle$ (ket), $\\langle\\psi|$ (bra)\n## Produit scalaire\n$\\langle\\phi|\\psi\\rangle = \\langle\\psi|\\phi\\rangle^*$\n## Normalisation\n$\\langle\\psi|\\psi\\rangle = 1$\n## Relation de fermeture\n$$\\sum_n |u_n\\rangle\\langle u_n| = \\mathbb{1}$$" },
        { type: "MCQ", title: "Produit scalaire", question: "Le produit scalaire hermitien vérifie :", choices: [
          { text: "⟨φ|ψ⟩ = ⟨ψ|φ⟩", correct: false }, { text: "⟨φ|ψ⟩ = ⟨ψ|φ⟩*", correct: true, feedback: "Hermitien = conjugué." },
          { text: "⟨φ|ψ⟩ = -⟨ψ|φ⟩", correct: false }, { text: "⟨φ|ψ⟩ = 0", correct: false }], explanation: "⟨φ|ψ⟩ = ⟨ψ|φ⟩*" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "Un état quantique est un vecteur dans un espace de Hilbert.", is_true: true },
          { statement: "Un état physique est défini à un facteur de phase près.", is_true: true },
          { statement: "La relation de fermeture exprime l'identité comme une somme de projecteurs.", is_true: true }], explanation: "Tous corrects." },
      ]},
      { title: "Opérateurs et observables", slug: "operateurs-observables", minutes: 50, blocks: [
        { type: "TEXT", content: "# Opérateurs\n\n## Hermitien\n$A = A^\\dagger$ → valeurs propres réelles\n## Commutateur\n$[\\hat{x}, \\hat{p}] = i\\hbar$\n## Représentation position\n$\\hat{p} = -i\\hbar\\frac{d}{dx}$" },
        { type: "MCQ", title: "Opérateur hermitien", question: "Un opérateur hermitien vérifie :", choices: [
          { text: "A = -A†", correct: false }, { text: "A = A†", correct: true, feedback: "Auto-adjoint." },
          { text: "A = A⁻¹", correct: false }, { text: "A = 0", correct: false }], explanation: "A = A†" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "Un opérateur hermitien a des valeurs propres réelles.", is_true: true },
          { statement: "[x̂, p̂] = 0.", is_true: false, statement_note: "C'est iℏ." },
          { statement: "Si [A,B] = 0, on peut diagonaliser simultanément A et B.", is_true: true }], explanation: "[x̂,p̂] = iℏ, pas 0." },
      ]},
      { title: "Équation de Schrödinger", slug: "equation-schrodinger", minutes: 55, blocks: [
        { type: "TEXT", content: "# Équation de Schrödinger\n\n## Dépendante du temps\n$$i\\hbar\\frac{\\partial}{\\partial t}|\\psi\\rangle = \\hat{H}|\\psi\\rangle$$\n## Hamiltonien\n$$\\hat{H} = -\\frac{\\hbar^2}{2m}\\nabla^2 + V$$\n## États stationnaires\n$$\\hat{H}\\phi_n = E_n\\phi_n$$\n$$\\psi(x,t) = \\phi_n(x) e^{-iE_n t/\\hbar}$$" },
        { type: "MCQ", title: "Schrödinger", question: "L'équation de Schrödinger dépendante du temps est :", choices: [
          { text: "iℏ ∂ₜ|ψ⟩ = Ĥ|ψ⟩", correct: true, feedback: "Exact !" },
          { text: "ℏ ∂ₜ|ψ⟩ = Ĥ|ψ⟩", correct: false, feedback: "Il manque le i." },
          { text: "iℏ ∂ₜ|ψ⟩ = p̂|ψ⟩", correct: false }, { text: "iℏ ∂ₜ|ψ⟩ = V|ψ⟩", correct: false }], explanation: "iℏ ∂ₜ|ψ⟩ = Ĥ|ψ⟩" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "L'équation de Schrödinger conserve la norme.", is_true: true },
          { statement: "Les états stationnaires ont une densité de probabilité indépendante du temps.", is_true: true },
          { statement: "L'opérateur d'évolution est hermitien.", is_true: false, statement_note: "Il est unitaire." }], explanation: "U est unitaire (U†U = 1), pas hermitien." },
      ]},
    ],
  },
  {
    title: "Postulats de la mécanique quantique",
    description: "Les 5 postulats, principe d'incertitude.",
    lessons: [
      { title: "Les cinq postulats", slug: "postulats", minutes: 50, blocks: [
        { type: "TEXT", content: "# Les 5 postulats\n\n1. **État** → vecteur de Hilbert $|\\psi\\rangle$\n2. **Observable** → opérateur hermitien\n3. **Mesure** → valeur propre $a_n$ avec probabilité $|c_n|^2$\n4. **Réduction** → après mesure, $|\\psi\\rangle \\to |u_n\\rangle$\n5. **Évolution** → $i\\hbar\\partial_t|\\psi\\rangle = \\hat{H}|\\psi\\rangle$" },
        { type: "MCQ", title: "Postulat de mesure", question: "Les valeurs possibles d'une mesure sont :", choices: [
          { text: "Les vecteurs propres", correct: false }, { text: "Les valeurs propres", correct: true, feedback: "Exact !" },
          { text: "Les normes", correct: false }, { text: "Les phases", correct: false }], explanation: "La mesure donne une valeur propre de l'observable." },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "La mesure modifie l'état du système.", is_true: true },
          { statement: "La probabilité de mesurer an est |cn|².", is_true: true },
          { statement: "L'évolution temporelle est unitaire.", is_true: true }], explanation: "Tous corrects — principes fondamentaux." },
      ]},
      { title: "Principe d'incertitude de Heisenberg", slug: "heisenberg", minutes: 45, blocks: [
        { type: "TEXT", content: "# Principe d'incertitude\n\n$$\\Delta x \\cdot \\Delta p \\geq \\frac{\\hbar}{2}$$\n## Généralisation\n$$\\Delta A \\cdot \\Delta B \\geq \\frac{1}{2}|\\langle[A,B]\\rangle|$$\n> 💡 Ce n'est pas une limite instrumentale, c'est une limite fondamentale." },
        { type: "MCQ", title: "Heisenberg", question: "Si Δx diminue, alors Δp :", choices: [
          { text: "Diminue", correct: false }, { text: "Augmente", correct: true, feedback: "Δx·Δp ≥ ℏ/2" },
          { text: "Reste constant", correct: false }, { text: "Devient nul", correct: false }], explanation: "Δx·Δp ≥ ℏ/2, donc si Δx diminue, Δp augmente." },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "Le principe d'incertitude est une limite fondamentale.", is_true: true },
          { statement: "On peut mesurer x et p simultanément avec une précision arbitraire.", is_true: false },
          { statement: "ΔA·ΔB ≥ ½|⟨[A,B]⟩|.", is_true: true }], explanation: "La relation générale implique [A,B]." },
      ]},
    ],
  },
  {
    title: "Problèmes unidimensionnels",
    description: "Puits infini, oscillateur harmonique, effet tunnel.",
    lessons: [
      { title: "Puits infini", slug: "puits-infini", minutes: 45, blocks: [
        { type: "TEXT", content: "# Puits infini\n\n$$E_n = \\frac{n^2\\pi^2\\hbar^2}{2mL^2}$$\n$$\\phi_n(x) = \\sqrt{\\frac{2}{L}}\\sin\\frac{n\\pi x}{L}$$\n> 💡 L'énergie est quantifiée : n = 1, 2, 3, ..." },
        { type: "MCQ", title: "Puits infini", question: "L'énergie fondamentale (n=1) d'un électron dans un puits de L=1nm vaut environ :", choices: [
          { text: "0.01 eV", correct: false }, { text: "0.38 eV", correct: true, feedback: "E₁ = π²ℏ²/(2mL²) ≈ 0.38 eV" },
          { text: "13.6 eV", correct: false }, { text: "1 MeV", correct: false }], explanation: "E₁ = π²ℏ²/(2m_eL²)" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "L'énergie est quantifiée dans un puits infini.", is_true: true },
          { statement: "Le niveau fondamental a une énergie nulle.", is_true: false, statement_note: "E₁ > 0 (énergie du point zéro)." },
          { statement: "Les fonctions d'onde sont des sinus.", is_true: true }], explanation: "E₁ > 0 : c'est l'énergie du point zéro." },
      ]},
      { title: "Oscillateur harmonique quantique", slug: "oscillateur-quantique", minutes: 50, blocks: [
        { type: "TEXT", content: "# Oscillateur harmonique quantique\n\n$$E_n = \\hbar\\omega\\left(n + \\frac{1}{2}\\right)$$\n## Énergie du point zéro\n$$E_0 = \\frac{1}{2}\\hbar\\omega$$\n> 💡 Même au niveau fondamental, l'énergie n'est pas nulle." },
        { type: "MCQ", title: "Énergie du point zéro", question: "L'énergie du niveau fondamental (n=0) est :", choices: [
          { text: "0", correct: false }, { text: "ℏω/2", correct: true, feedback: "E₀ = ℏω/2" },
          { text: "ℏω", correct: false }, { text: "3ℏω/2", correct: false }], explanation: "E₀ = ℏω(0 + 1/2) = ℏω/2" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "Les niveaux d'énergie sont équidistants.", is_true: true },
          { statement: "L'énergie du point zéro est nulle.", is_true: false, statement_note: "E₀ = ℏω/2." },
          { statement: "Les fonctions d'onde utilisent les polynômes d'Hermite.", is_true: true }], explanation: "E₀ = ℏω/2, pas 0." },
      ]},
      { title: "Barrière de potentiel et effet tunnel", slug: "effet-tunnel", minutes: 45, blocks: [
        { type: "TEXT", content: "# Effet tunnel\n\nUne particule peut traverser une barrière même si $E < V_0$.\n## Coefficient de transmission\n$$T \\propto e^{-2\\kappa a}, \\quad \\kappa = \\sqrt{\\frac{2m(V_0-E)}{\\hbar^2}}$$\n## Applications\n- Microscopie STM\n- Radioactivité α" },
        { type: "MCQ", title: "Effet tunnel", question: "L'effet tunnel se produit quand :", choices: [
          { text: "E > V₀", correct: false }, { text: "E < V₀", correct: true, feedback: "La particule traverse malgré E < V₀" },
          { text: "E = V₀", correct: false }, { text: "E = 0", correct: false }], explanation: "L'effet tunnel se produit pour E < V₀." },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "L'effet tunnel est impossible en mécanique classique.", is_true: true },
          { statement: "La transmission décroît exponentiellement avec l'épaisseur.", is_true: true },
          { statement: "La radioactivité α s'explique par l'effet tunnel.", is_true: true }], explanation: "Tous corrects." },
      ]},
    ],
  },
  {
    title: "Moment cinétique et spin",
    description: "Moment cinétique orbital, spin 1/2, matrices de Pauli.",
    lessons: [
      { title: "Moment cinétique orbital", slug: "moment-cinetique-orbital", minutes: 50, blocks: [
        { type: "TEXT", content: "# Moment cinétique\n\n$$\\hat{L}^2|l,m\\rangle = \\hbar^2 l(l+1)|l,m\\rangle$$\n$$\\hat{L}_z|l,m\\rangle = \\hbar m|l,m\\rangle$$\nl = 0, 1, 2, ... et m = -l, ..., +l" },
        { type: "MCQ", title: "Valeurs propres", question: "Pour l=2, combien de valeurs de m ?", choices: [
          { text: "2", correct: false }, { text: "5", correct: true, feedback: "m = -2,-1,0,1,2 → 5 valeurs" },
          { text: "4", correct: false }, { text: "3", correct: false }], explanation: "m va de -l à +l, soit 2l+1 = 5 valeurs." },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "L² et Lz commutent.", is_true: true },
          { statement: "l peut être demi-entier pour le moment cinétique orbital.", is_true: false, statement_note: "l est entier pour L orbital." },
          { statement: "La dégénérescence est 2l+1.", is_true: true }], explanation: "l est entier pour le moment cinétique orbital." },
      ]},
      { title: "Spin 1/2 et matrices de Pauli", slug: "spin-pauli", minutes: 50, blocks: [
        { type: "TEXT", content: "# Spin 1/2\n\n## Matrices de Pauli\n$\\sigma_x = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$, $\\sigma_y = \\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix}$, $\\sigma_z = \\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$\n## Stern-Gerlach\n2 taches → spin up/down\n## Larmor\n$\\omega_0 = \\gamma B$" },
        { type: "MCQ", title: "Spin", question: "Le spin 1/2 fait de l'électron un :", choices: [
          { text: "Boson", correct: false }, { text: "Fermion", correct: true, feedback: "Spin demi-entier → fermion" },
          { text: "Boson de jauge", correct: false }, { text: "Scalaire", correct: false }], explanation: "Spin 1/2 → fermion (principe de Pauli)." },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "Le spin est un moment cinétique intrinsèque.", is_true: true },
          { statement: "Le spin 1/2 a un espace de Hilbert de dimension 2.", is_true: true },
          { statement: "Les matrices de Pauli commutent entre elles.", is_true: false, statement_note: "[σi, σj] = 2iεijkσk" }], explanation: "Les matrices de Pauli ne commutent pas." },
      ]},
    ],
  },
  {
    title: "Atome d'hydrogène",
    description: "Équation radiale, structure fine, orbitales.",
    lessons: [
      { title: "Résolution de l'équation radiale", slug: "equation-radiale", minutes: 60, blocks: [
        { type: "TEXT", content: "# Atome d'hydrogène\n\n$$E_n = -\\frac{13.6}{n^2} \\text{ eV}$$\n$$a_0 = 0{,}529 \\text{ Å}$$\n## Dégénérescence\n$g_n = n^2$ (sans spin)" },
        { type: "MCQ", title: "Niveaux d'énergie", question: "Énergie du niveau n=2 ?", choices: [
          { text: "-6.8 eV", correct: false }, { text: "-3.4 eV", correct: true, feedback: "E₂ = -13.6/4 = -3.4 eV" },
          { text: "-13.6 eV", correct: false }, { text: "-1.5 eV", correct: false }], explanation: "E₂ = -13.6/4" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "Les niveaux ne dépendent que de n.", is_true: true },
          { statement: "La dégénérescence du niveau n=3 est 9.", is_true: true },
          { statement: "Le potentiel centrifuge repousse l'électron pour l>0.", is_true: true }], explanation: "Tous corrects." },
      ]},
      { title: "Structure fine", slug: "structure-fine", minutes: 55, blocks: [
        { type: "TEXT", content: "# Structure fine\n\n$$\\alpha = \\frac{1}{137}$$\nCorrections : relativiste + spin-orbite + Darwin\n$$\\Delta E_{sf} = E_n \\frac{\\alpha^2}{n}\\left(\\frac{1}{j+1/2} - \\frac{3}{4n}\\right)$$\n> 💡 L'énergie dépend de n et j (pas de l séparément)." },
        { type: "MCQ", title: "Constante de structure fine", question: "α vaut environ :", choices: [
          { text: "1/137", correct: true, feedback: "Exact !" }, { text: "1/10", correct: false },
          { text: "1/1000", correct: false }, { text: "1", correct: false }], explanation: "α ≈ 1/137" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "La structure fine brise la dégénérescence en l.", is_true: true },
          { statement: "Les corrections sont de l'ordre de α² ~ 10⁻⁴.", is_true: true },
          { statement: "L'orbitale 2s est plus petite que la 2p.", is_true: false, statement_note: "2s est plus étendue (6a₀ vs 5a₀)." }], explanation: "2s est légèrement plus étendue que 2p." },
      ]},
    ],
  },
  {
    title: "Méthodes d'approximation",
    description: "Perturbations, méthode variationnelle.",
    lessons: [
      { title: "Théorie des perturbations", slug: "perturbations", minutes: 55, blocks: [
        { type: "TEXT", content: "# Perturbations\n\n## 1er ordre\n$$\\Delta E_n^{(1)} = \\langle n|\\hat{V}|n\\rangle$$\n## 2nd ordre\n$$\\Delta E_n^{(2)} = \\sum_{k \\neq n} \\frac{|\\langle k|\\hat{V}|n\\rangle|^2}{E_n - E_k}$$\n> 💡 Pour l'état fondamental, ΔE₀⁽²⁾ < 0 toujours." },
        { type: "MCQ", title: "Perturbation 1er ordre", question: "La correction au 1er ordre est :", choices: [
          { text: "⟨n|V̂|n⟩", correct: true, feedback: "Valeur moyenne." },
          { text: "Σ|⟨k|V̂|n⟩|²/(En-Ek)", correct: false, feedback: "C'est le 2nd ordre." },
          { text: "0", correct: false }, { text: "En - Ek", correct: false }], explanation: "ΔE⁽¹⁾ = ⟨n|V̂|n⟩" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "Pour l'état fondamental, ΔE₀⁽²⁾ < 0.", is_true: true },
          { statement: "Pour un état dégénéré, il faut diagonaliser V̂.", is_true: true },
          { statement: "L'effet Stark linéaire apparaît pour les niveaux dégénérés.", is_true: true }], explanation: "Tous corrects." },
      ]},
      { title: "Méthode variationnelle", slug: "methode-variationnelle", minutes: 50, blocks: [
        { type: "TEXT", content: "# Méthode variationnelle\n\n$$\\langle\\psi|\\hat{H}|\\psi\\rangle \\geq E_0$$\nMinimiser sur une famille d'essai → borne supérieure de E₀.\n## Hélium\n$Z^* = 2 - 5/16 \\approx 1{,}69$ (écran électronique)" },
        { type: "MCQ", title: "Principe variationnel", question: "Pour tout |ψ⟩ normalisé :", choices: [
          { text: "E[ψ] ≤ E₀", correct: false }, { text: "E[ψ] ≥ E₀", correct: true, feedback: "Borne supérieure." },
          { text: "E[ψ] = E₀", correct: false }, { text: "E[ψ] = 0", correct: false }], explanation: "⟨ψ|H|ψ⟩ ≥ E₀" },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "La méthode variationnelle donne une borne supérieure.", is_true: true },
          { statement: "Pour l'hélium, Z* < 2 traduit l'écran électronique.", is_true: true },
          { statement: "La méthode s'applique aussi aux états excités.", is_true: false, statement_note: "Seulement pour l'état fondamental." }], explanation: "La méthode variationnelle est pour l'état fondamental." },
      ]},
    ],
  },
  {
    title: "Particules identiques",
    description: "Bosons, fermions, principe de Pauli.",
    lessons: [
      { title: "Bosons, fermions et principe de Pauli", slug: "bosons-fermions", minutes: 50, blocks: [
        { type: "TEXT", content: "# Particules identiques\n\n## Bosons (spin entier)\nFonction d'onde symétrique\n## Fermions (spin demi-entier)\nFonction d'onde antisymétrique\n## Pauli\nDeux fermions identiques ne peuvent occuper le même état.\n## Déterminant de Slater\nAntisymétrise automatiquement la fonction d'onde." },
        { type: "MCQ", title: "Principe de Pauli", question: "Le principe d'exclusion de Pauli dit que :", choices: [
          { text: "Deux bosons ne peuvent être dans le même état", correct: false },
          { text: "Deux fermions identiques ne peuvent occuper le même état", correct: true, feedback: "Exact !" },
          { text: "Toutes les particules sont discernables", correct: false },
          { text: "Le spin est toujours entier", correct: false }], explanation: "Pauli : deux fermions ≠ même état." },
        { type: "TRUE_FALSE", title: "Vrai ou Faux ?", statements: [
          { statement: "Les particules identiques sont indiscernables.", is_true: true },
          { statement: "Les bosons ont une fonction d'onde antisymétrique.", is_true: false, statement_note: "Symétrique pour les bosons." },
          { statement: "Le principe de Pauli explique le tableau périodique.", is_true: true }], explanation: "Bosons = symétrique, fermions = antisymétrique." },
      ]},
    ],
  },
];

async function main() {
  console.log("Seeding Mécanique Classique...");
  await seedCourse("mecanique-classique", MECANIQUE);

  console.log("Seeding Mécanique Quantique I...");
  await seedCourse("mecanique-quantique-1", QUANTIQUE);

  console.log("✓ All courses seeded!");
}

main().catch(console.error).finally(() => db.$disconnect());
