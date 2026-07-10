"use server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function createModuleAction(formData: FormData) {
  const courseId = formData.get("courseId") as string;
  const title = formData.get("title") as string;

  const maxOrder = await db.courseModule.max({
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
  const courseId = formData.get("courseId") as string;
  const moduleId = formData.get("moduleId") as string;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const minutes = parseInt(formData.get("minutes") as string) || 30;

  const maxOrder = await db.courseLesson.max({
    where: { moduleId },
    _max: { order: true },
  });

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

  redirect(`/admin/cours/${courseId}/lecons`);
}

export async function addTextBlockAction(formData: FormData) {
  const lessonId = formData.get("lessonId") as string;
  const courseId = formData.get("courseId") as string;
  const content = formData.get("content") as string;

  const maxOrder = await db.lessonBlock.max({
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
  const lessonId = formData.get("lessonId") as string;
  const courseId = formData.get("courseId") as string;
  const title = formData.get("title") as string;
  const code = formData.get("code") as string;

  const maxOrder = await db.lessonBlock.max({
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
  const lessonId = formData.get("lessonId") as string;
  const courseId = formData.get("courseId") as string;
  const title = formData.get("title") as string;
  const question = formData.get("question") as string;
  const explanation = formData.get("explanation") as string;

  // Parse choices
  const choicesRaw = formData.get("choices") as string;
  const lines = choicesRaw.split("\n").filter((l) => l.trim());
  const choices = lines.map((line, i) => {
    const isCorrect = line.startsWith("*");
    const text = isCorrect ? line.slice(1).trim() : line.trim();
    return { text, isCorrect, feedback: "", order: i };
  });

  const maxBlockOrder = await db.lessonBlock.max({
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
  const blockId = formData.get("blockId") as string;
  const lessonId = formData.get("lessonId") as string;
  const courseId = formData.get("courseId") as string;

  await db.lessonBlock.delete({ where: { id: blockId } });

  redirect(`/admin/cours/${courseId}/lecons/${lessonId}`);
}
