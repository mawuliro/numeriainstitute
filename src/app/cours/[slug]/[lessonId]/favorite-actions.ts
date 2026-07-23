"use server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleFavoriteAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) return;
  const lessonId = formData.get("lessonId") as string;
  const courseId = formData.get("courseId") as string;
  if (!lessonId || !courseId) return;

  // C6: fetch slug for correct revalidatePath
  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { slug: true },
  });
  if (!course) return;

  const existing = await db.favorite.findUnique({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
  });
  if (existing) {
    await db.favorite.delete({ where: { id: existing.id } });
  } else {
    await db.favorite.create({ data: { userId: session.user.id, lessonId } });
  }
  revalidatePath(`/cours/${course.slug}/${lessonId}`);
}
