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

  // Check if this is the user's first ever lesson completion
  const completedCount = await db.lessonProgress.count({ where: { userId: session.user.id, isCompleted: true } });

  await db.lessonProgress.upsert({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
    update: { isCompleted: true, completedAt: new Date() },
    create: { userId: session.user.id, lessonId, isCompleted: true, completedAt: new Date() },
  });

  // Auto-enroll
  const existing = await db.enrollment.findUnique({ where: { userId_courseId: { userId: session.user.id, courseId } } });
  if (!existing) {
    await db.enrollment.create({ data: { userId: session.user.id, courseId } });
    const course = await db.course.findUnique({ where: { id: courseId }, select: { title: true } });
    await db.notification.create({ data: { userId: session.user.id, title: "Inscription au cours", message: `Tu es inscrit au cours « ${course?.title} ». Bon apprentissage !`, link: "/cours" } });
  }

  // Gamification: update streak + award badges
  await updateStreak(session.user.id);
  if (completedCount === 0) await awardBadge(session.user.id, "first_lesson");

  // Check if course is fully completed → award certificate + badge
  const course = await db.course.findUnique({ where: { id: courseId }, include: { modules: { where: { isActive: true }, include: { lessons: { where: { isActive: true }, select: { id: true } } } } } });
  if (course) {
    const allLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
    const completedInCourse = await db.lessonProgress.count({ where: { userId: session.user.id, lessonId: { in: allLessonIds }, isCompleted: true } });
    
    if (completedInCourse === allLessonIds.length && allLessonIds.length > 0) {
      // Course complete! Award badge + certificate
      await awardBadge(session.user.id, "course_complete");
      
      // Create certificate if not already exists
      const certExists = await db.certificate.findUnique({ where: { userId_courseId: { userId: session.user.id, courseId } } });
      if (!certExists) {
        const certNumber = `NUM-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        await db.certificate.create({ data: { userId: session.user.id, courseId, certificateNumber: certNumber } });
        await db.notification.create({ data: { userId: session.user.id, title: "Certificat obtenu ! 🎓", message: `Félicitations ! Tu as terminé le cours « ${course.title} ». Ton certificat est disponible.`, link: "/profil" } });
      }
    }
  }

  revalidatePath(`/cours/${courseId}/${lessonId}`);
}

export async function enrollInCourseAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const courseId = formData.get("courseId") as string;
  if (!courseId) return;
  const existing = await db.enrollment.findUnique({ where: { userId_courseId: { userId: session.user.id, courseId } } });
  if (!existing) {
    await db.enrollment.create({ data: { userId: session.user.id, courseId } });
    const course = await db.course.findUnique({ where: { id: courseId }, select: { title: true } });
    await db.notification.create({ data: { userId: session.user.id, title: "Inscription au cours", message: `Tu es maintenant inscrit au cours « ${course?.title} ».`, link: "/cours" } });
  }
  revalidatePath(`/cours/${courseId}`);
}
