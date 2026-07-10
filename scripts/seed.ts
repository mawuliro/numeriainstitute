/**
 * Seed script — creates the Mécanique Classique course with 1 module + 3 sample lessons.
 * Run with: bun run db:seed
 */
import { db } from "@/lib/db";

async function main() {
  // Create course
  const course = await db.course.upsert({
    where: { slug: "mecanique-classique" },
    update: {},
    create: {
      slug: "mecanique-classique",
      title: "Mécanique Classique · De Newton à Lagrange",
      description:
        "Un cours complet de mécanique classique avec simulations Python interactives. Couvre la cinématique, la dynamique, l'énergie, les collisions, les oscillateurs et la gravitation.",
      shortDescription:
        "Maîtrise la mécanique : cinématique, forces, énergie, collisions, oscillateurs, gravitation.",
      category: "physique",
      level: "DEBUTANT",
      language: "fr",
      price: 0,
      isFree: true,
      status: "PUBLISHED",
      estimatedHours: 60,
    },
  });

  // Module 0: Cinématique
  const mod1 = await db.courseModule.create({
    data: {
      courseId: course.id,
      title: "Cinématique · Décrire le mouvement",
      description: "Position, vitesse, accélération et types de mouvements.",
      order: 0,
      isActive: true,
    },
  });

  // Lesson 1: Vecteurs et repères
  const les1 = await db.courseLesson.create({
    data: {
      courseId: course.id,
      moduleId: mod1.id,
      title: "Vecteurs et repères",
      slug: "vecteurs-reperes",
      order: 0,
      estimatedMinutes: 35,
      isFreePreview: true,
      isActive: true,
    },
  });

  // Blocks for lesson 1
  await db.lessonBlock.create({
    data: {
      lessonId: les1.id,
      blockType: "TEXT",
      order: 0,
      textContent: `# Vecteurs et repères en physique

## 1. Qu'est-ce qu'un vecteur ?

Un **vecteur** est une grandeur qui possède :
- une **direction**
- un **sens**
- une **norme** (la valeur numérique)
- un **point d'application**

Exemples : la force $\\vec{F}$, la vitesse $\\vec{v}$, l'accélération $\\vec{a}$.

## 2. Repère cartésien

Le repère cartésien $(O, \\vec{i}, \\vec{j}, \\vec{k})$ :

$$\\vec{r} = x\\,\\vec{i} + y\\,\\vec{j} + z\\,\\vec{k}$$

## 3. Norme d'un vecteur

$$|\\vec{v}| = \\sqrt{v_x^2 + v_y^2 + v_z^2}$$

## 4. Produit scalaire

$$\\vec{A} \\cdot \\vec{B} = |\\vec{A}||\\vec{B}|\\cos\\theta$$

> 💡 **Astuce** : Le produit scalaire est nul si les vecteurs sont perpendiculaires.`,
    },
  });

  await db.lessonBlock.create({
    data: {
      lessonId: les1.id,
      blockType: "SANDBOX",
      order: 1,
      sandboxTitle: "Visualiser des vecteurs 2D avec matplotlib",
      sandboxInitialCode: `import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import FancyArrowPatch

A = np.array([3, 1])
B = np.array([1, 2])
C = A + B

fig, ax = plt.subplots(figsize=(7, 6))
ax.set_xlim(-1, 5); ax.set_ylim(-1, 5)

ax.add_patch(FancyArrowPatch((0,0), A, arrowstyle='->', mutation_scale=20, color='blue', lw=2.5))
ax.add_patch(FancyArrowPatch((0,0), B, arrowstyle='->', mutation_scale=20, color='red', lw=2.5))
ax.add_patch(FancyArrowPatch((0,0), C, arrowstyle='->', mutation_scale=22, color='green', lw=3))

ax.text(A[0]+0.1, A[1]+0.1, r'$\\vec{A}=(3,1)$', fontsize=12, color='blue')
ax.text(B[0]+0.1, B[1]+0.1, r'$\\vec{B}=(1,2)$', fontsize=12, color='red')
ax.text(C[0]+0.1, C[1]+0.1, r'$\\vec{A}+\\vec{B}=(4,3)$', fontsize=12, color='green')

ax.set_aspect('equal'); ax.grid(True, alpha=0.3)
ax.set_title("Addition vectorielle", fontsize=13)
plt.tight_layout()
print(f'|A| = {np.linalg.norm(A):.3f}')
print(f'|B| = {np.linalg.norm(B):.3f}')
print(f'|A+B| = {np.linalg.norm(C):.3f}')`,
    },
  });

  // MCQ
  const mcq = await db.mCQExercise.create({
    data: {
      lessonId: les1.id,
      title: "Norme d'un vecteur",
      question: "Quelle est la norme du vecteur $\\vec{v} = (3, 4)$ ?",
      explanation: "$|v| = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$.",
      points: 5,
      difficulty: "easy",
      allowMultiple: false,
      shuffleChoices: true,
      isActive: true,
    },
  });
  await db.mCQChoice.createMany({
    data: [
      { exerciseId: mcq.id, text: "7", isCorrect: false, feedback: "3+4=7 mais ce n'est pas comme ça qu'on calcule une norme.", order: 0 },
      { exerciseId: mcq.id, text: "5", isCorrect: true, feedback: "Exact ! racine(9+16) = 5", order: 1 },
      { exerciseId: mcq.id, text: "25", isCorrect: false, feedback: "C'est le carré de la norme.", order: 2 },
      { exerciseId: mcq.id, text: "1", isCorrect: false, order: 3 },
    ],
  });
  await db.lessonBlock.create({
    data: {
      lessonId: les1.id,
      blockType: "MCQ",
      order: 2,
      mcqId: mcq.id,
    },
  });

  // Fill blank
  const fb = await db.fillBlankExercise.create({
    data: {
      lessonId: les1.id,
      title: "Composantes et produit scalaire",
      textWithBlanks: "Soit $\\vec{A} = (2, 3)$ et $\\vec{B} = (4, -1)$. Alors $\\vec{A} \\cdot \\vec{B} = 2 \\times 4 + 3 \\times {{blank_1}} = {{blank_2}}$. De plus, $|\\vec{A}| = \\sqrt{{{blank_3}}} \\approx 3{,}61$.",
      answersJson: JSON.stringify({ blank_1: ["-1"], blank_2: ["5"], blank_3: ["13"] }),
      explanation: "$\\vec{A}\\cdot\\vec{B} = 2\\times 4 + 3\\times(-1) = 8 - 3 = 5$. Et $|\\vec{A}|^2 = 2^2 + 3^2 = 4 + 9 = 13$.",
      points: 5,
      isActive: true,
    },
  });
  await db.lessonBlock.create({
    data: {
      lessonId: les1.id,
      blockType: "FILL_BLANK",
      order: 3,
      fillBlankId: fb.id,
    },
  });

  // True/False
  const tf = await db.trueFalseExercise.create({
    data: {
      lessonId: les1.id,
      title: "Vrai ou Faux ? Vecteurs",
      statementsJson: JSON.stringify([
        { statement: "La vitesse est une grandeur vectorielle.", is_true: true },
        { statement: "La norme d'un vecteur peut être négative.", is_true: false },
        { statement: "Si $\\vec{A} \\cdot \\vec{B} = 0$ alors les vecteurs sont perpendiculaires (en supposant qu'aucun n'est nul).", is_true: true },
        { statement: "La masse est une grandeur vectorielle.", is_true: false },
        { statement: "Le produit vectoriel $\\vec{A} \\times \\vec{B}$ est un scalaire.", is_true: false },
      ]),
      explanation: "Le produit scalaire est nul ⟺ perpendiculaire. La masse est scalaire. Le produit vectoriel est un vecteur.",
      points: 6,
      isActive: true,
    },
  });
  await db.lessonBlock.create({
    data: {
      lessonId: les1.id,
      blockType: "TRUE_FALSE",
      order: 4,
      trueFalseId: tf.id,
    },
  });

  console.log("✓ Seeded Mécanique Classique course with 1 module + 1 lesson (5 blocks)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
