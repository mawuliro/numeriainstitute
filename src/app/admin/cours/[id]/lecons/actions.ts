"use server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/security";

export async function createModuleAction(formData: FormData) {
  await requireAdmin();
  const courseId = formData.get("courseId") as string;
  const title = (formData.get("title") as string)?.trim();

  if (!courseId || !title) {
    redirect(`/admin/cours/${courseId}/lecons?error=missing`);
  }

  const maxOrder = await db.courseModule.aggregate({
    where: { courseId },
    _max: { order: true },
  });

  await db.courseModule.create({
    data: {
      courseId,
      title,
      order: (maxOrder._max.order ?? -1) + 1,
      isActive: true,
    },
  });

  redirect(`/admin/cours/${courseId}/lecons`);
}

export async function createLessonAction(formData: FormData) {
  await requireAdmin();
  const courseId = formData.get("courseId") as string;
  const moduleId = formData.get("moduleId") as string;
  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const minutes = parseInt(formData.get("minutes") as string) || 30;

  if (!courseId || !moduleId || !title || !slug) {
    redirect(`/admin/cours/${courseId}/lecons?error=missing`);
  }

  const maxOrder = await db.courseLesson.aggregate({
    where: { moduleId },
    _max: { order: true },
  });

  try {
    await db.courseLesson.create({
      data: {
        courseId,
        moduleId,
        title,
        slug,
        order: (maxOrder._max.order ?? -1) + 1,
        estimatedMinutes: minutes,
        isFreePreview: true,
        isActive: true,
      },
    });
  } catch {
    redirect(`/admin/cours/${courseId}/lecons?error=slug-taken`);
  }

  redirect(`/admin/cours/${courseId}/lecons`);
}

export async function addTextBlockAction(formData: FormData) {
  await requireAdmin();
  const lessonId = formData.get("lessonId") as string;
  const courseId = formData.get("courseId") as string;
  const content = formData.get("content") as string;

  if (!lessonId || !content) {
    redirect(`/admin/cours/${courseId}/lecons/${lessonId || ""}?error=missing`);
  }

  const maxOrder = await db.lessonBlock.aggregate({
    where: { lessonId },
    _max: { order: true },
  });

  await db.lessonBlock.create({
    data: {
      lessonId,
      blockType: "TEXT",
      order: (maxOrder._max.order ?? -1) + 1,
      textContent: content,
    },
  });

  redirect(`/admin/cours/${courseId}/lecons/${lessonId}`);
}

export async function addSandboxBlockAction(formData: FormData) {
  await requireAdmin();
  const lessonId = formData.get("lessonId") as string;
  const courseId = formData.get("courseId") as string;
  const title = (formData.get("title") as string)?.trim() ?? "Sandbox";
  const code = formData.get("code") as string;

  if (!lessonId) {
    redirect(`/admin/cours/${courseId}/lecons?error=missing`);
  }

  const maxOrder = await db.lessonBlock.aggregate({
    where: { lessonId },
    _max: { order: true },
  });

  await db.lessonBlock.create({
    data: {
      lessonId,
      blockType: "SANDBOX",
      order: (maxOrder._max.order ?? -1) + 1,
      sandboxTitle: title,
      sandboxInitialCode: code,
    },
  });

  redirect(`/admin/cours/${courseId}/lecons/${lessonId}`);
}

export async function addMcqBlockAction(formData: FormData) {
  await requireAdmin();
  const lessonId = formData.get("lessonId") as string;
  const courseId = formData.get("courseId") as string;
  const title = (formData.get("title") as string)?.trim();
  const question = formData.get("question") as string;
  const explanation = (formData.get("explanation") as string)?.trim() ?? "";

  if (!lessonId || !title || !question) {
    redirect(`/admin/cours/${courseId}/lecons/${lessonId}?error=missing`);
  }

  // Parse choices
  const choicesRaw = formData.get("choices") as string;
  const lines = (choicesRaw ?? "").split("\n").filter((l) => l.trim());
  if (lines.length < 2) {
    redirect(`/admin/cours/${courseId}/lecons/${lessonId}?error=choices`);
  }

  const choices = lines.map((line, i) => {
    const isCorrect = line.startsWith("*");
    const text = isCorrect ? line.slice(1).trim() : line.trim();
    return { text, isCorrect, feedback: "", order: i };
  });

  const maxBlockOrder = await db.lessonBlock.aggregate({
    where: { lessonId },
    _max: { order: true },
  });

  const mcq = await db.mCQExercise.create({
    data: {
      lessonId,
      title,
      question,
      explanation,
      points: 5,
      difficulty: "easy",
      allowMultiple: false,
      shuffleChoices: true,
      isActive: true,
      choices: { create: choices },
    },
  });

  await db.lessonBlock.create({
    data: {
      lessonId,
      blockType: "MCQ",
      order: (maxBlockOrder._max.order ?? -1) + 1,
      mcqId: mcq.id,
    },
  });

  redirect(`/admin/cours/${courseId}/lecons/${lessonId}`);
}

export async function deleteBlockAction(formData: FormData) {
  await requireAdmin();
  const blockId = formData.get("blockId") as string;
  const lessonId = formData.get("lessonId") as string;
  const courseId = formData.get("courseId") as string;

  if (!blockId) {
    redirect(`/admin/cours/${courseId}/lecons/${lessonId || ""}?error=missing`);
  }

  await db.lessonBlock.delete({ where: { id: blockId } });

  redirect(`/admin/cours/${courseId}/lecons/${lessonId}`);
}
