"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function createMeetingAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || (user.role !== "STAFF" && user.role !== "ADMIN")) {
    redirect("/dashboard");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const startTime = new Date(formData.get("startTime") as string);
  const durationHours = parseInt(formData.get("duration") as string) || 2;
  const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);
  const waitingRoom = formData.get("waitingRoom") === "on";

  // Generate a unique room name
  const roomName = `numeria-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  await db.meeting.create({
    data: {
      title,
      description,
      roomName,
      hostId: session.user.id,
      startTime,
      endTime,
      isWaitingRoomEnabled: waitingRoom,
    },
  });

  redirect("/admin/visioconference");
}
