/**
 * Main seed script — creates the complete "Mécanique Classique" course on Neon.
 *
 * Usage:
 *   DATABASE_URL="postgresql://..." bun run scripts/seed-mecanique/index.ts
 *
 * Idempotent: if the course already exists, it updates it instead of failing.
 */
import { PrismaClient, Prisma } from "@prisma/client";
import type { CourseInput } from "./types";
import { moduleCinematique } from "./module-1-cinematique";
import { moduleLoisNewton } from "./module-2-lois-newton";
import { moduleForces } from "./module-3-forces";
import { moduleEnergie } from "./module-4-energie";
import { moduleQuantiteMouvement } from "./module-5-quantite-mouvement";
import { moduleOscillateursGravitation } from "./module-6-oscillateurs-gravitation";

const course: CourseInput = {
  slug: "mecanique-classique",
  title: "Mécanique Classique",
  description:
    "Cours complet de mécanique newtonienne : cinématique, lois de Newton, forces, énergie, quantité de mouvement, oscillateurs et gravitation. Cours structuré avec théorie, formules LaTeX, schémas SVG, exemples corrigés pas-à-pas, exercices interactifs et labs PhET-style.",
  shortDescription:
    "Lois de Newton, énergie, collisions, oscillateurs — le cours complet de mécanique.",
  category: "physique",
  level: "INTERMEDIAIRE",
  estimatedHours: 12,
  modules: [
    moduleCinematique,
    moduleLoisNewton,
    moduleForces,
    moduleEnergie,
    moduleQuantiteMouvement,
    moduleOscillateursGravitation,
  ],
};

const db = new PrismaClient();

async function upsertBlock(
  db: Prisma.TransactionClient | PrismaClient,
  lessonId: string,
  order: number,
  block: CourseInput["modules"][0]["lessons"][0]["blocks"][0],
  courseId: string
): Promise<void> {
  switch (block.type) {
    case "text": {
      await db.lessonBlock.create({
        data: {
          lessonId,
          blockType: "TEXT",
          order,
          textContent: block.content,
        },
      });
      break;
    }
    case "sandbox": {
      await db.lessonBlock.create({
        data: {
          lessonId,
          blockType: "SANDBOX",
          order,
          sandboxTitle: block.title,
          sandboxInitialCode: block.code,
        },
      });
      break;
    }
    case "mcq": {
      // Create the MCQ exercise first
      const mcq = await db.mCQExercise.create({
        data: {
          lessonId,
          title: block.title,
          question: block.question,
          explanation: block.explanation,
          points: 5,
          difficulty: "easy",
          allowMultiple: false,
          shuffleChoices: true,
          isActive: true,
          choices: {
            create: block.choices.map((c, i) => ({
              text: c.text,
              isCorrect: c.isCorrect,
              feedback: c.feedback,
              order: i,
            })),
          },
        },
      });
      // Then create the block referencing the MCQ
      await db.lessonBlock.create({
        data: {
          lessonId,
          blockType: "MCQ",
          order,
          mcqId: mcq.id,
        },
      });
      break;
    }
    case "lab": {
      // Create the InteractiveLab
      const lab = await db.interactiveLab.create({
        data: {
          title: block.title,
          instructions: block.instructions,
          simulationCode: block.simulationCode,
          sliderConfigJson: JSON.stringify(block.sliderConfig),
          challengesJson: JSON.stringify(block.challenges),
          points: 20,
          difficulty: "medium",
          isActive: true,
        },
      });
      // Then create the block referencing the lab
      await db.lessonBlock.create({
        data: {
          lessonId,
          blockType: "INTERACTIVE_LAB",
          order,
          interactiveLabId: lab.id,
        },
      });
      break;
    }
  }
}

async function main() {
  console.log("🚀 Seeding Mécanique Classique on Neon...");

  // Compute total lessons count for stats
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalBlocks = course.modules.reduce(
    (sum, m) => sum + m.lessons.reduce((s, l) => s + l.blocks.length, 0),
    0
  );
  console.log(
    `   ${course.modules.length} modules, ${totalLessons} lessons, ${totalBlocks} blocks`
  );

  // Step 1: delete existing course if it exists (outside transaction — Neon
  // connections can time out during long operations)
  const existing = await db.course.findUnique({
    where: { slug: course.slug },
    select: { id: true },
  });

  let courseId: string;

  if (existing) {
    console.log(`   Course "${course.slug}" already exists — deleting old content...`);
    // Cascade delete: blocks → lessons → modules → course
    // Use deleteMany on each level (Prisma cascade may not work on Neon with foreign keys)
    const modules = await db.courseModule.findMany({
      where: { courseId: existing.id },
      select: { id: true },
    });
    for (const m of modules) {
      const lessons = await db.courseLesson.findMany({
        where: { moduleId: m.id },
        select: { id: true },
      });
      for (const l of lessons) {
        await db.lessonBlock.deleteMany({ where: { lessonId: l.id } });
      }
      await db.courseLesson.deleteMany({ where: { moduleId: m.id } });
    }
    await db.courseModule.deleteMany({ where: { courseId: existing.id } });
    // Update the course record
    await db.course.update({
      where: { id: existing.id },
      data: {
        title: course.title,
        description: course.description,
        shortDescription: course.shortDescription,
        category: course.category,
        level: course.level,
        estimatedHours: course.estimatedHours,
      },
    });
    courseId = existing.id;
    console.log(`   Updated course: ${courseId}`);
  } else {
    const created = await db.course.create({
      data: {
        slug: course.slug,
        title: course.title,
        description: course.description,
        shortDescription: course.shortDescription,
        category: course.category,
        level: course.level,
        estimatedHours: course.estimatedHours,
        isFree: true,
        price: 0,
        status: "PUBLISHED",
        language: "fr",
      },
    });
    courseId = created.id;
    console.log(`   Created course: ${courseId}`);
  }

  // Step 2: create modules, lessons, and blocks SEQUENTIALLY (no transaction)
  // to avoid Neon connection timeout on long operations
  for (let mIdx = 0; mIdx < course.modules.length; mIdx++) {
    const module = course.modules[mIdx];
    const dbModule = await db.courseModule.create({
      data: {
        courseId,
        title: module.title,
        description: module.description ?? null,
        order: mIdx,
        isActive: true,
      },
    });

    for (let lIdx = 0; lIdx < module.lessons.length; lIdx++) {
      const lesson = module.lessons[lIdx];
      const slug = `lecon-${mIdx + 1}-${lIdx + 1}-${lesson.slug}`;
      const dbLesson = await db.courseLesson.create({
        data: {
          courseId,
          moduleId: dbModule.id,
          title: lesson.title,
          slug,
          order: lIdx,
          estimatedMinutes: lesson.estimatedMinutes,
          isFreePreview: lesson.isFreePreview,
          isActive: true,
        },
      });

      for (let bIdx = 0; bIdx < lesson.blocks.length; bIdx++) {
        await upsertBlock(db, dbLesson.id, bIdx, lesson.blocks[bIdx], courseId);
      }
    }
    console.log(
      `   Module ${mIdx + 1}/${course.modules.length}: "${module.title}" — ${module.lessons.length} lessons ✓`
    );
  }

  // Final stats
  const finalCourse = await db.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        include: {
          lessons: { select: { id: true, title: true } },
        },
      },
    },
  });

  console.log("\n✅ Seed complete!");
  console.log(`   Course: ${finalCourse?.title}`);
  console.log(
    `   ${finalCourse?.modules.length} modules, ${finalCourse?.modules.reduce((s, m) => s + m.lessons.length, 0)} lessons`
  );
  finalCourse?.modules.forEach((m, i) => {
    console.log(`     ${i + 1}. ${m.title} (${m.lessons.length} leçons)`);
  });
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
