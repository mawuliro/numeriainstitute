export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { MeetingRoom } from "@/components/visioconference/meeting-room";

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ meetingId: string }>;
}) {
  const { meetingId } = await params;
  const session = await auth();

  const meeting = await db.meeting.findUnique({
    where: { id: meetingId },
    include: {
      host: { select: { id: true, name: true, email: true, role: true } },
      participants: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });

  if (!meeting || !meeting.isActive) notFound();

  // Check if meeting is accessible (within 15 min before start or during)
  const now = new Date();
  const startTime = new Date(meeting.startTime);
  const gracePeriod = new Date(startTime.getTime() - 15 * 60 * 1000);
  const isLive = now >= gracePeriod;

  if (!isLive) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex flex-1 items-center justify-center p-4">
          <div className="max-w-md text-center">
            <div className="mb-4 text-6xl">⏰</div>
            <h1 className="text-xl font-bold">Réunion pas encore commencée</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Cette réunion commence le{" "}
              {startTime.toLocaleDateString("fr-FR", {
                day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
              })}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Tu pourras rejoindre 15 minutes avant le début.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const isHost = session?.user?.id === meeting.hostId ||
    (session?.user && (await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    }))?.role === "ADMIN");

  const displayName = session?.user
    ? (await db.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, email: true },
      }))?.name ?? session.user.email ?? "Guest"
    : "Guest";

  return (
    <div className="flex min-h-screen flex-col bg-[#0d1530]">
      <MeetingRoom
        meetingId={meeting.id}
        roomName={meeting.roomName}
        title={meeting.title}
        isHost={!!isHost}
        userName={displayName}
      />
    </div>
  );
}
