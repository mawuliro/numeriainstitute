/**
 * Seed all 5 courses matching the Django site.
 * Run with: npx tsx scripts/seed-all-courses.ts
 */
import { db } from "@/lib/db";

async function main() {
  // Delete existing (clean slate)
  await db.course.deleteMany({});
  console.log("✓ Cleared courses");

  // ── Course 1: Python ──────────────────────────────────────────────────
  const py = await db.course.create({ data: {
    slug: "python-algorithmique-poo", title: "Python : de l'Algorithmique à la POO",
    description: "Un parcours complet pour apprendre Python depuis les premiers concepts algorithmiques jusqu'à la programmation orientée objet.",
    shortDescription: "Apprends Python de zéro à la POO : algorithmique, structures de données, récursivité, tri, classes, héritage.",
    category: "python", level: "DEBUTANT", language: "fr", price: 0, isFree: true, status: "PUBLISHED", estimatedHours: 40,
  }});
  const pyM = await db.courseModule.create({ data: { courseId: py.id, title: "Les bases de Python", order: 0, isActive: true }});
  const pyL = await db.courseLesson.create({ data: { courseId: py.id, moduleId: pyM.id, title: "Variables et types", slug: "variables-types", order: 0, estimatedMinutes: 25, isFreePreview: true, isActive: true }});
  await db.lessonBlock.create({ data: { lessonId: pyL.id, blockType: "TEXT", order: 0, textContent: "# Variables et types\n\n## 1. Qu'est-ce qu'une variable ?\n\nUne **variable** est un nom qui désigne une valeur stockée en mémoire.\n\n```python\nage = 25\nnom = \"Marie\"\npi = 3.14159\n```\n\n## 2. Types fondamentaux\n\n- `int` : entiers (`42`)\n- `float` : décimaux (`3.14`)\n- `str` : chaînes (`\"hello\"`)\n- `bool` : booléens (`True`, `False`)\n\n> 💡 **Astuce** : Utilise `type(x)` pour connaître le type d'une variable." }});
  await db.lessonBlock.create({ data: { lessonId: pyL.id, blockType: "SANDBOX", order: 1, sandboxTitle: "Tester des variables", sandboxInitialCode: "age = 25\nnom = 'Marie'\npi = 3.14159\nprint(f'Nom: {nom}, Age: {age}, Pi: {pi}')\nprint(f'Type de age: {type(age)}')\nprint(f'Type de nom: {type(nom)}')" }});

  // ── Course 2: Scientific English ──────────────────────────────────────
  const en = await db.course.create({ data: {
    slug: "scientific-english-university", title: "Scientific English for University",
    description: "Master Scientific English: vocabulary, papers, abstracts, presentations, grammar.",
    shortDescription: "Master Scientific English: vocabulary, papers, abstracts, presentations, grammar.",
    category: "autre", level: "INTERMEDIAIRE", language: "en", price: 0, isFree: true, status: "PUBLISHED", estimatedHours: 30,
  }});
  const enM = await db.courseModule.create({ data: { courseId: en.id, title: "Academic Writing", order: 0, isActive: true }});
  await db.courseLesson.create({ data: { courseId: en.id, moduleId: enM.id, title: "Writing an abstract", slug: "writing-abstract", order: 0, estimatedMinutes: 30, isFreePreview: true, isActive: true }});

  // ── Course 3: LaTeX ───────────────────────────────────────────────────
  const la = await db.course.create({ data: {
    slug: "latex-typographie-scientifique", title: "LaTeX : Typographie Scientifique",
    description: "Maîtrise LaTeX : documents, mathématiques, tableaux, figures, présentations Beamer.",
    shortDescription: "Maîtrise LaTeX : documents, mathématiques, tableaux, figures, présentations Beamer.",
    category: "informatique", level: "DEBUTANT", language: "fr", price: 0, isFree: true, status: "PUBLISHED", estimatedHours: 25,
  }});
  const laM = await db.courseModule.create({ data: { courseId: la.id, title: "Premiers pas avec LaTeX", order: 0, isActive: true }});
  await db.courseLesson.create({ data: { courseId: la.id, moduleId: laM.id, title: "Structure d'un document", slug: "structure-document", order: 0, estimatedMinutes: 25, isFreePreview: true, isActive: true }});

  // ── Course 4: Mécanique Classique ─────────────────────────────────────
  const mc = await db.course.create({ data: {
    slug: "mecanique-classique", title: "Mécanique Classique · De Newton à Lagrange",
    description: "Un cours complet de mécanique classique avec simulations Python interactives.",
    shortDescription: "Maîtrise la mécanique : cinématique, forces, énergie, collisions, oscillateurs, gravitation.",
    category: "physique", level: "DEBUTANT", language: "fr", price: 0, isFree: true, status: "PUBLISHED", estimatedHours: 60,
  }});

  // Module 1: Cinématique
  const mcM1 = await db.courseModule.create({ data: { courseId: mc.id, title: "Cinématique · Décrire le mouvement", description: "Position, vitesse, accélération.", order: 0, isActive: true }});
  const mcL1 = await db.courseLesson.create({ data: { courseId: mc.id, moduleId: mcM1.id, title: "Vecteurs et repères", slug: "vecteurs-reperes", order: 0, estimatedMinutes: 35, isFreePreview: true, isActive: true }});
  await db.lessonBlock.create({ data: { lessonId: mcL1.id, blockType: "TEXT", order: 0, textContent: "# Vecteurs et repères\n\n## 1. Qu'est-ce qu'un vecteur ?\n\nUn **vecteur** possède direction, sens, norme et point d'application.\n\n$$|\\vec{v}| = \\sqrt{v_x^2 + v_y^2 + v_z^2}$$\n\n## 2. Produit scalaire\n\n$$\\vec{A} \\cdot \\vec{B} = |\\vec{A}||\\vec{B}|\\cos\\theta$$\n\n> 💡 Le produit scalaire est nul si les vecteurs sont perpendiculaires." }});

  // Module 2: Dynamique
  const mcM2 = await db.courseModule.create({ data: { courseId: mc.id, title: "Dynamique · Les forces", description: "Lois de Newton, forces usuelles.", order: 1, isActive: true }});
  const mcL2 = await db.courseLesson.create({ data: { courseId: mc.id, moduleId: mcM2.id, title: "Les trois lois de Newton", slug: "lois-newton", order: 0, estimatedMinutes: 45, isFreePreview: true, isActive: true }});
  await db.lessonBlock.create({ data: { lessonId: mcL2.id, blockType: "TEXT", order: 0, textContent: "# Les trois lois de Newton\n\n## 1. Principe d'inertie\nSi $\\sum \\vec{F} = \\vec{0}$ alors $\\vec{v} = \\text{cste}$.\n\n## 2. PFD\n$$\\sum \\vec{F} = m\\,\\vec{a}$$\n\n## 3. Actions réciproques\n$$\\vec{F}_{A \\to B} = -\\vec{F}_{B \\to A}$$" }});

  // ── Course 5: Mécanique Quantique I ───────────────────────────────────
  const mq = await db.course.create({ data: {
    slug: "mecanique-quantique-1", title: "Mécanique Quantique I · Du formalisme à l'atome d'hydrogène",
    description: "Un cours complet de mécanique quantique avec simulations, exercices corrigés.",
    shortDescription: "Maîtrise la mécanique quantique : formalisme de Dirac, postulats, puits, oscillateur, spin, hydrogène.",
    category: "physique", level: "AVANCE", language: "fr", price: 0, isFree: true, status: "PUBLISHED", estimatedHours: 70,
  }});
  const mqM = await db.courseModule.create({ data: { courseId: mq.id, title: "Introduction · Pourquoi la mécanique quantique ?", description: "Limites de la physique classique.", order: 0, isActive: true }});
  const mqL = await db.courseLesson.create({ data: { courseId: mq.id, moduleId: mqM.id, title: "Échelles quantiques", slug: "echelles-quantiques", order: 0, estimatedMinutes: 45, isFreePreview: true, isActive: true }});
  await db.lessonBlock.create({ data: { lessonId: mqL.id, blockType: "TEXT", order: 0, textContent: "# Échelles quantiques\n\n## 1. La crise de la physique classique\n\n- Spectre de raies des atomes\n- Effet photoélectrique\n- Catastrophe ultraviolette\n\n## 2. Constantes fondamentales\n\n- $h = 6{,}626 \\times 10^{-34}$ J·s\n- $\\hbar = h/(2\\pi)$\n- $c = 3 \\times 10^8$ m/s\n\n## 3. Régime quantique\n\n$$S \\sim \\hbar \\Rightarrow \\text{quantique}$$" }});

  const count = await db.course.count();
  const lessons = await db.courseLesson.count();
  console.log(`✓ Seeded ${count} courses with ${lessons} lessons`);
}

main().catch(console.error).finally(() => db.$disconnect());
