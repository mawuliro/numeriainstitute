"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/security";

async function checkAdmin() {
  await requireAdmin();
}

export async function updateUserRoleAction(formData: FormData) {
  await checkAdmin();
  const userId = formData.get("userId") as string;
  const role = formData.get("role") as string;
  const validRoles = ["STUDENT", "MENTOR", "STAFF", "ADMIN"];
  if (!validRoles.includes(role)) {
    redirect("/admin/utilisateurs?error=invalid-role");
  }
  await db.user.update({
    where: { id: userId },
    data: { role: role as "STUDENT" | "MENTOR" | "STAFF" | "ADMIN" },
  });
  revalidatePath("/admin/utilisateurs");
}

export async function deleteUserAction(formData: FormData) {
  await checkAdmin();
  const userId = formData.get("userId") as string;
  const session = await auth();
  if (session?.user?.id === userId) {
    // Can't delete self — redirect back with an error flag
    redirect("/admin/utilisateurs?error=self-delete");
  }
  // C7: soft-delete (RGPD)
  await db.user.update({
    where: { id: userId },
    data: {
      deletedAt: new Date(),
      emailVerifyToken: null,
      emailVerifyExpires: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      passwordHash: null,
    },
  });
  revalidatePath("/admin/utilisateurs");
  redirect("/admin/utilisateurs?deleted=1");
}

export async function verifyUserAction(formData: FormData) {
  await checkAdmin();
  const userId = formData.get("userId") as string;
  await db.user.update({
    where: { id: userId },
    data: {
      isVerified: true,
      emailVerifyToken: null,
      emailVerifyExpires: null,
    },
  });
  revalidatePath("/admin/utilisateurs");
}
