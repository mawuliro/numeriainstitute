/**
 * Seed content blocks for all empty lessons
 */
import { db } from "@/lib/db";

async function main() {
  const lessons = await db.courseLesson.findMany({
    include: { _count: { select: { blocks: true } } },
  });

  let added = 0;
  for (const lesson of lessons) {
    if (lesson._count.blocks > 0) continue;

    // Find the course to get context
    const course = await db.course.findUnique({
      where: { id: lesson.courseId },
      select: { slug: true, title: true },
    });

    let content = "";
    let sandboxCode = "";

    // Generate content based on lesson title
    if (lesson.title.toLowerCase().includes("vecteur")) {
      content = `# Vecteurs et repères\n\n## 1. Qu'est-ce qu'un vecteur ?\n\nUn **vecteur** possède direction, sens, norme et point d'application.\n\n$$|\\vec{v}| = \\sqrt{v_x^2 + v_y^2 + v_z^2}$$\n\n## 2. Produit scalaire\n\n$$\\vec{A} \\cdot \\vec{B} = |\\vec{A}||\\vec{B}|\\cos\\theta$$\n\n> 💡 Le produit scalaire est nul si les vecteurs sont perpendiculaires.`;
      sandboxCode = `import matplotlib.pyplot as plt\nimport numpy as np\nfrom matplotlib.patches import FancyArrowPatch\n\nfig, ax = plt.subplots(figsize=(7, 6))\nax.set_xlim(-1, 5); ax.set_ylim(-1, 5)\nA = np.array([3, 1]); B = np.array([1, 2]); C = A + B\nax.add_patch(FancyArrowPatch((0,0), A, arrowstyle='->', mutation_scale=20, color='blue', lw=2.5))\nax.add_patch(FancyArrowPatch((0,0), B, arrowstyle='->', mutation_scale=20, color='red', lw=2.5))\nax.add_patch(FancyArrowPatch((0,0), C, arrowstyle='->', mutation_scale=22, color='green', lw=3))\nax.set_aspect('equal'); ax.grid(True, alpha=0.3)\nplt.tight_layout(); plt.savefig('plot.png')`;
    } else if (lesson.title.toLowerCase().includes("newton")) {
      content = `# Les trois lois de Newton\n\n## 1. Principe d'inertie\nSi $\\sum \\vec{F} = \\vec{0}$ alors $\\vec{v} = \\text{cste}$.\n\n## 2. PFD\n$$\\sum \\vec{F} = m\\,\\vec{a}$$\n\n## 3. Actions réciproques\n$$\\vec{F}_{A \\to B} = -\\vec{F}_{B \\to A}$$\n\n> 💡 **Astuce** : Toujours choisir un repère et projeter les forces.`;
    } else if (lesson.title.toLowerCase().includes("quantique") || lesson.title.toLowerCase().includes("échelles")) {
      content = `# Échelles quantiques\n\n## 1. La crise de la physique classique\n\n- Spectre de raies\n- Effet photoélectrique\n- Catastrophe ultraviolette\n\n## 2. Constantes fondamentales\n\n- $h = 6{,}626 \\times 10^{-34}$ J·s\n- $\\hbar = h/(2\\pi)$\n\n## 3. Régime quantique\n\n$$S \\sim \\hbar \\Rightarrow \\text{quantique}$$`;
    } else if (lesson.title.toLowerCase().includes("python") || lesson.title.toLowerCase().includes("variable")) {
      content = `# Variables et types\n\n## 1. Qu'est-ce qu'une variable ?\n\nUne **variable** est un nom qui désigne une valeur stockée en mémoire.\n\n\`\`\`python\nage = 25\nnom = "Marie"\npi = 3.14159\n\`\`\`\n\n## 2. Types fondamentaux\n\n- \`int\` : entiers\n- \`float\` : décimaux\n- \`str\` : chaînes\n- \`bool\` : booléens\n\n> 💡 Utilise \`type(x)\` pour connaître le type.`;
      sandboxCode = `age = 25\nnom = 'Marie'\npi = 3.14159\nprint(f'Nom: {nom}, Age: {age}, Pi: {pi}')\nprint(f'Type de age: {type(age)}')\nprint(f'Type de nom: {type(nom)}')`;
    } else if (lesson.title.toLowerCase().includes("writing") || lesson.title.toLowerCase().includes("abstract")) {
      content = `# Writing an Abstract\n\n## What is an abstract?\n\nAn **abstract** is a concise summary of your research paper (150-250 words).\n\n## Structure\n\n1. **Background** — Why does this matter?\n2. **Methods** — What did you do?\n3. **Results** — What did you find?\n4. **Conclusions** — What does it mean?\n\n> 💡 Write the abstract **last**, after the paper is complete.`;
    } else {
      // Generic content
      content = `# ${lesson.title}\n\n## Introduction\n\nCette leçon couvre les concepts fondamentaux de **${course?.title ?? "ce cours"}**.\n\n## Points clés\n\n- Concept 1\n- Concept 2\n- Concept 3\n\n> 💡 **Astuce** : Pratique avec les exercices ci-dessous pour consolider ton apprentissage.`;
    }

    // Add text block
    await db.lessonBlock.create({
      data: {
        lessonId: lesson.id,
        blockType: "TEXT",
        order: 0,
        textContent: content,
      },
    });
    added++;

    // Add sandbox if we have code
    if (sandboxCode) {
      await db.lessonBlock.create({
        data: {
          lessonId: lesson.id,
          blockType: "SANDBOX",
          order: 1,
          sandboxTitle: "Simulation interactive",
          sandboxInitialCode: sandboxCode,
        },
      });
    }

    // Add an MCQ
    const mcq = await db.mCQExercise.create({
      data: {
        lessonId: lesson.id,
        title: "Question de compréhension",
        question: "Quelle est la principale notion abordée dans cette leçon ?",
        explanation: "Relis l'introduction de la leçon pour confirmer ta réponse.",
        points: 5,
        difficulty: "easy",
        allowMultiple: false,
        shuffleChoices: true,
        isActive: true,
        choices: {
          create: [
            { text: "Les concepts fondamentaux du cours", isCorrect: true, feedback: "Exact !", order: 0 },
            { text: "L'histoire de la discipline", isCorrect: false, feedback: "Pas exactement.", order: 1 },
            { text: "La bibliographie", isCorrect: false, feedback: "Non.", order: 2 },
            { text: "Les exercices pratiques uniquement", isCorrect: false, feedback: "Pas uniquement.", order: 3 },
          ],
        },
      },
    });
    await db.lessonBlock.create({
      data: {
        lessonId: lesson.id,
        blockType: "MCQ",
        order: 2,
        mcqId: mcq.id,
      },
    });

    // Add a true/false
    const tf = await db.trueFalseExercise.create({
      data: {
        lessonId: lesson.id,
        title: "Vrai ou Faux ?",
        statementsJson: JSON.stringify([
          { statement: "Cette leçon fait partie du cours " + (course?.title ?? ""), is_true: true },
          { statement: "Les exercices sont optionnels.", is_true: false, statement_note: "Les exercices sont essentiels pour apprendre." },
          { statement: "La pratique régulière améliore la compréhension.", is_true: true },
        ]),
        points: 6,
        isActive: true,
      },
    });
    await db.lessonBlock.create({
      data: {
        lessonId: lesson.id,
        blockType: "TRUE_FALSE",
        order: 3,
        trueFalseId: tf.id,
      },
    });
  }

  console.log(`✓ Added content to ${added} lessons`);
}

main().catch(console.error).finally(() => db.$disconnect());
