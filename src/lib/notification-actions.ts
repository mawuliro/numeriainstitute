"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function markNotificationRead(formData: FormData) {
  const session = await auth();
  if (!session?.user) return;

  const id = formData.get("id") as string;
  await db.notification.update({
    where: { id },
    data: { isRead: true },
  });
  revalidatePath("/dashboard");
}

export async function markAllNotificationsRead() {
  const session = await auth();
  if (!session?.user) return;

  await db.notification.updateMany({
    where: { userId: session.user.id, isRead: false },
    data: { isRead: true },
  });
  revalidatePath("/dashboard");
}
