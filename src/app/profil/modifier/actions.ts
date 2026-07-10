"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function updateProfileAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;
  const preferredLanguage = formData.get("preferredLanguage") as string;

  await db.user.update({
    where: { id: session.user.id },
    data: { name, bio, preferredLanguage },
  });

  redirect("/profil");
}

export async function changePasswordAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (newPassword !== confirmPassword) {
    redirect("/profil/modifier?error=mismatch");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { passwordHash: true },
  });

  if (!user?.passwordHash) redirect("/login");

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) redirect("/profil/modifier?error=wrong");

  const newHash = await bcrypt.hash(newPassword, 12);
  await db.user.update({
    where: { id: session.user.id },
    data: { passwordHash: newHash },
  });

  redirect("/profil");
}
