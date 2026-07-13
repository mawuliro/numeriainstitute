"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function enrollStudentAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || (user.role !== "STAFF" && user.role !== "ADMIN")) {
    return { error: "Seuls les administrateurs peuvent inscrire des étudiants." };
  }

  const courseId = formData.get("courseId") as string;
  const studentEmail = (formData.get("studentEmail") as string)?.toLowerCase().trim();

  if (!studentEmail) {
    return { error: "Email de l'étudiant requis." };
  }

  const student = await db.user.findUnique({
    where: { email: studentEmail },
    select: { id: true, name: true, email: true },
  });

  if (!student) {
    return { error: `Aucun utilisateur trouvé avec l'email ${studentEmail}. L'étudiant doit d'abord créer un compte.` };
  }

  // Check if already enrolled
  const existing = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: student.id, courseId } },
  });

  if (existing) {
    return { error: `${student.name ?? student.email} est déjà inscrit à ce cours.` };
  }

  await db.enrollment.create({
    data: { userId: student.id, courseId },
  });

  // Create notification for the student
  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { title: true },
  });

  await db.notification.create({
    data: {
      userId: student.id,
      title: "Inscription au cours",
      message: `Tu as été inscrit au cours « ${course?.title} » par un administrateur.`,
      link: `/cours`,
    },
  });

  revalidatePath(`/admin/cours/${courseId}`);
  return { success: true, studentName: student.name ?? student.email };
}

export async function unenrollStudentAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || (user.role !== "STAFF" && user.role !== "ADMIN")) {
    return { error: "Non autorisé." };
  }

  const enrollmentId = formData.get("enrollmentId") as string;
  await db.enrollment.delete({ where: { id: enrollmentId } });
  revalidatePath("/admin/cours");
}
