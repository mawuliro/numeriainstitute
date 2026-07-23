"use server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const user = await db.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (!user || (user.role !== "STAFF" && user.role !== "ADMIN")) redirect("/dashboard");
}

export async function updateUserRoleAction(formData: FormData) {
  await checkAdmin();
  const userId = formData.get("userId") as string;
  const role = formData.get("role") as string;
  await db.user.update({ where: { id: userId }, data: { role: role as any } });
  revalidatePath("/admin/utilisateurs");
}

export async function deleteUserAction(formData: FormData) {
  await checkAdmin();
  const userId = formData.get("userId") as string;
  const session = await auth();
  if (session?.user?.id === userId) return { error: "Tu ne peux pas te supprimer toi-même." };
  await db.user.delete({ where: { id: userId } });
  revalidatePath("/admin/utilisateurs");
}

export async function verifyUserAction(formData: FormData) {
  await checkAdmin();
  const userId = formData.get("userId") as string;
  await db.user.update({ where: { id: userId }, data: { isVerified: true, emailVerifyToken: null, emailVerifyExpires: null } });
  revalidatePath("/admin/utilisateurs");
}
