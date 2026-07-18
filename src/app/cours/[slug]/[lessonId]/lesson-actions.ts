"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Mark a lesson as complete
export async function markLessonCompleteAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) return;

  const lessonId = formData.get("lessonId") as string;
  const courseId = formData.get("courseId") as string;

  if (!lessonId || !courseId) return;

  // Upsert lesson progress
  await db.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: session.user.id,
        lessonId,
      },
    },
    update: {
      isCompleted: true,
      completedAt: new Date(),
    },
    create: {
      userId: session.user.id,
      lessonId,
      isCompleted: true,
      completedAt: new Date(),
    },
  });

  // Auto-enroll if not already enrolled (free courses)
  const existing = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId,
      },
    },
  });

  if (!existing) {
    await db.enrollment.create({
      data: { userId: session.user.id, courseId },
    });
  }

  revalidatePath(`/cours/${courseId}/${lessonId}`);
}

// Auto-enroll user in a free course
export async function enrollInCourseAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const courseId = formData.get("courseId") as string;
  if (!courseId) return;

  const existing = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId,
      },
    },
  });

  if (!existing) {
    await db.enrollment.create({
      data: { userId: session.user.id, courseId },
    });

    // Create notification
    const course = await db.course.findUnique({
      where: { id: courseId },
      select: { title: true },
    });

    await db.notification.create({
      data: {
        userId: session.user.id,
        title: "Inscription au cours",
        message: `Tu es maintenant inscrit au cours « ${course?.title} ». Bon apprentissage !`,
        link: `/cours`,
      },
    });
  }

  revalidatePath(`/cours/${courseId}`);
}
