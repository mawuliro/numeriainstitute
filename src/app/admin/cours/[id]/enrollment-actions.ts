"use server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/security";
import { sendEmail } from "@/lib/email";

export async function enrollStudentAction(formData: FormData) {
  await requireAdmin();

  const courseId = formData.get("courseId") as string;
  const studentEmail = (formData.get("studentEmail") as string)?.toLowerCase().trim();

  if (!studentEmail) {
    redirect(`/admin/cours/${courseId}?error=email-required`);
  }

  const student = await db.user.findUnique({
    where: { email: studentEmail },
    select: { id: true, name: true, email: true, isVerified: true },
  });

  if (!student) {
    redirect(`/admin/cours/${courseId}?error=student-not-found`);
  }

  // H5: auto-verify the student if not already
  if (!student.isVerified) {
    await db.user.update({
      where: { id: student.id },
      data: {
        isVerified: true,
        emailVerifyToken: null,
        emailVerifyExpires: null,
      },
    });
  }

  // Check if already enrolled
  const existing = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: student.id, courseId } },
  });

  if (existing) {
    redirect(`/admin/cours/${courseId}?error=already-enrolled`);
  }

  await db.enrollment.create({
    data: { userId: student.id, courseId },
  });

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

  // Send confirmation email (best-effort)
  try {
    await sendEmail({
      to: student.email,
      subject: `Numeria Institute — Inscription au cours « ${course?.title ?? ""} »`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1B2A4E; font-size: 24px;">NUMERIA <span style="color: #2DD4BF;">Institute</span></h1>
          <h2 style="color: #1B2A4E;">Bonjour ${student.name ?? ""},</h2>
          <p>Tu as été inscrit au cours « ${course?.title ?? ""} » par un administrateur de Numeria Institute.</p>
          <p>Connecte-toi pour commencer : <a href="${process.env.NEXTAUTH_URL || ""}/cours" style="color: #2DD4BF;">Accéder au cours</a></p>
          <p style="color: #999; font-size: 12px;">© ${new Date().getFullYear()} Numeria Institute</p>
        </div>
      `,
    });
  } catch {
    // Best-effort
  }

  revalidatePath(`/admin/cours/${courseId}`);
  revalidatePath("/dashboard", "page");
  redirect(`/admin/cours/${courseId}?enrolled=${encodeURIComponent(student.name ?? student.email)}`);
}

export async function unenrollStudentAction(formData: FormData) {
  await requireAdmin();

  const enrollmentId = formData.get("enrollmentId") as string;
  const courseId = formData.get("courseId") as string;
  if (!enrollmentId) redirect("/admin/cours");

  await db.enrollment.delete({ where: { id: enrollmentId } });
  revalidatePath("/admin/cours");
  if (courseId) {
    revalidatePath(`/admin/cours/${courseId}`);
    redirect(`/admin/cours/${courseId}`);
  }
  redirect("/admin/cours");
}
