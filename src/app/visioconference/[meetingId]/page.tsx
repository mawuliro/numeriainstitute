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

  // H12: require login for meeting access (no anonymous guests)
  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/visioconference/${meetingId}`)}`);
  }

  const meeting = await db.meeting.findUnique({
    where: { id: meetingId },
    include: {
      host: { select: { id: true, name: true, email: true, role: true } },
      participants: {
        where: { userId: session.user.id },
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

  // Fetch the user's role from DB to check host/admin status
  const currentUser = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, name: true, email: true },
  });

  const isHost =
    session.user.id === meeting.hostId ||
    currentUser?.role === "ADMIN" ||
    currentUser?.role === "STAFF";

  // If waiting room is enabled and user is not the host or already admitted,
  // show a waiting room screen.
  if (meeting.isWaitingRoomEnabled && !isHost) {
    const participant = meeting.participants[0];
    if (!participant || participant.status !== "admitted") {
      // Auto-create a "waiting" participant record if none exists
      if (!participant) {
        await db.meetingParticipant.create({
          data: {
            meetingId: meeting.id,
            userId: session.user.id,
            role: "participant",
            status: "waiting",
          },
        });
      }

      return (
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex flex-1 items-center justify-center p-4">
            <div className="max-w-md text-center">
              <div className="mb-4 text-6xl">🚪</div>
              <h1 className="text-xl font-bold">Salle d'attente</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Tu es en file d'attente pour la réunion « {meeting.title} ».
                L'organisateur t'autorisera à entrer sous peu.
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Statut : {participant?.status ?? "En attente"}
              </p>
            </div>
          </main>
        </div>
      );
    }
  }

  const displayName =
    currentUser?.name ?? currentUser?.email ?? session.user.email ?? "Participant";

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
