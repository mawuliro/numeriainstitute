"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { validatePassword } from "@/lib/security";

const ALLOWED_LANGS = ["fr", "en"];

export async function updateProfileAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const name = ((formData.get("name") as string) || "").trim();
  const bio = ((formData.get("bio") as string) || "").trim();
  const preferredLanguage = (formData.get("preferredLanguage") as string) || "fr";

  // H7: validate inputs
  if (name.length > 80) {
    return { error: "Le nom ne peut pas dépasser 80 caractères." };
  }
  if (bio.length > 500) {
    return { error: "La bio ne peut pas dépasser 500 caractères." };
  }
  if (!ALLOWED_LANGS.includes(preferredLanguage)) {
    return { error: "Langue invalide." };
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { name: name || null, bio: bio || null, preferredLanguage },
  });

  revalidatePath("/profil");
  revalidatePath("/", "layout");
  return { success: "Profil mis à jour." };
}

export async function changePasswordAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "Tous les champs sont requis." };
  }
  if (newPassword !== confirmPassword) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  const validation = validatePassword(newPassword);
  if (!validation.valid) {
    return { error: `Mot de passe invalide : ${validation.errors.join(", ")}` };
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { passwordHash: true },
  });

  if (!user?.passwordHash) {
    return { error: "Aucun mot de passe défini. Utilise la réinitialisation par email." };
  }

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    return { error: "Mot de passe actuel incorrect." };
  }

  const newHash = await bcrypt.hash(newPassword, 12);
  await db.user.update({
    where: { id: session.user.id },
    data: { passwordHash: newHash },
  });

  revalidatePath("/profil");
  return { success: "Mot de passe modifié avec succès." };
}
