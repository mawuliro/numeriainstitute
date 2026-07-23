"use server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { awardBadge, updateStreak } from "@/lib/gamification";

export async function markLessonCompleteAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) return;
  const lessonId = formData.get("lessonId") as string;
  const courseId = formData.get("courseId") as string;
  if (!lessonId || !courseId) return;

  // C6: fetch the course slug for correct revalidatePath
  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { slug: true },
  });
  if (!course) return;
  const courseSlug = course.slug;

  // M41: wrap critical mutations in a transaction
  await db.$transaction(async (tx) => {
    // Check if this is the user's first ever lesson completion
    const completedCount = await tx.lessonProgress.count({
      where: { userId: session.user.id, isCompleted: true },
    });

    await tx.lessonProgress.upsert({
      where: { userId_lessonId: { userId: session.user.id, lessonId } },
      update: { isCompleted: true, completedAt: new Date() },
      create: { userId: session.user.id, lessonId, isCompleted: true, completedAt: new Date() },
    });

    // Auto-enroll
    const existing = await tx.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    });
    if (!existing) {
      await tx.enrollment.create({ data: { userId: session.user.id, courseId } });
    }

    return { completedCount };
  }).then(async ({ completedCount }) => {
    // Gamification (outside transaction — non-critical)
    await updateStreak(session.user.id).catch(() => {});
    if (completedCount === 0) {
      await awardBadge(session.user.id, "first_lesson").catch(() => {});
    }
  }).catch((err) => {
    console.error("markLessonCompleteAction failed:", err);
    return;
  });

  // Check if course is fully completed → award certificate + badge
  const fullCourse = await db.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        where: { isActive: true },
        include: { lessons: { where: { isActive: true }, select: { id: true } } },
      },
    },
  });
  if (fullCourse) {
    const allLessonIds = fullCourse.modules.flatMap((m) => m.lessons.map((l) => l.id));
    const completedInCourse = await db.lessonProgress.count({
      where: { userId: session.user.id, lessonId: { in: allLessonIds }, isCompleted: true },
    });

    if (completedInCourse === allLessonIds.length && allLessonIds.length > 0) {
      await awardBadge(session.user.id, "course_complete").catch(() => {});

      const certExists = await db.certificate.findUnique({
        where: { userId_courseId: { userId: session.user.id, courseId } },
      });
      if (!certExists) {
        // Use crypto.randomUUID for collision-free certificate numbers
        const certNumber = `NUM-${Date.now()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
        await db.certificate.create({
          data: { userId: session.user.id, courseId, certificateNumber: certNumber },
        });
        await db.notification.create({
          data: {
            userId: session.user.id,
            title: "Certificat obtenu ! 🎓",
            message: `Félicitations ! Tu as terminé le cours « ${fullCourse.title} ». Ton certificat est disponible.`,
            link: "/profil",
          },
        });
      }
    }
  }

  // C6: use slug instead of courseId; M10: also revalidate dashboard
  revalidatePath(`/cours/${courseSlug}/${lessonId}`);
  revalidatePath(`/cours/${courseSlug}`);
  revalidatePath("/dashboard", "page");
  revalidatePath("/profil", "page");
}

export async function enrollInCourseAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const courseId = formData.get("courseId") as string;
  if (!courseId) return;

  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { slug: true, title: true },
  });
  if (!course) return;

  const existing = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId } },
  });
  if (!existing) {
    await db.enrollment.create({ data: { userId: session.user.id, courseId } });
    await db.notification.create({
      data: {
        userId: session.user.id,
        title: "Inscription au cours",
        message: `Tu es maintenant inscrit au cours « ${course.title} ».`,
        link: "/cours",
      },
    });
  }
  revalidatePath(`/cours/${course.slug}`);
  revalidatePath("/dashboard", "page");
}
