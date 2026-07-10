export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Video, Calendar } from "lucide-react";

export default async function AdminVisioPage() {
  const meetings = await db.meeting.findMany({
    orderBy: { startTime: "desc" },
    include: {
      host: { select: { name: true, email: true } },
      _count: { select: { participants: true } },
    },
    take: 30,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Visioconférence</h1>
          <p className="text-sm text-muted-foreground">{meetings.length} réunions</p>
        </div>
        <Link href="/admin/visioconference/nouveau">
          <Button className="bg-[#1B2A4E] hover:bg-[#1B2A4E]/90">
            <Plus className="h-4 w-4" /> Planifier
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {meetings.map((m) => {
          const isLive = new Date(m.startTime) <= new Date() && m.isActive;
          const isUpcoming = new Date(m.startTime) > new Date();
          return (
            <Card key={m.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  isLive ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary"
                }`}>
                  <Video className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-medium truncate">{m.title}</h2>
                  <p className="text-xs text-muted-foreground">
                    {m.host.name ?? m.host.email} ·{" "}
                    {new Date(m.startTime).toLocaleDateString("fr-FR", {
                      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
                <Badge variant={isLive ? "default" : isUpcoming ? "secondary" : "outline"}>
                  {isLive ? "En direct" : isUpcoming ? "À venir" : "Terminé"}
                </Badge>
                <Link href={`/visioconference/${m.id}`}>
                  <Button size="sm" variant="outline">
                    {isLive ? "Rejoindre" : "Voir"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
