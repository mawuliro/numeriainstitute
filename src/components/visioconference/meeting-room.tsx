"use client";

import { useEffect, useRef, useState } from "react";
import { PhoneOff, Users, MessageSquare } from "lucide-react";

export function MeetingRoom({
  meetingId,
  roomName,
  title,
  isHost,
  userName,
}: {
  meetingId: string;
  roomName: string;
  title: string;
  isHost: boolean;
  userName: string;
  waitingRoomEnabled?: boolean;
}) {
  const [showInfo, setShowInfo] = useState(false);
  const [participantCount, setParticipantCount] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Build Jitsi room URL
  const jitsiDomain = "meet.jit.si";
  const roomUrl = `https://${jitsiDomain}/${roomName}?` + new URLSearchParams({
    "config.startWithAudioMuted": "false",
    "config.startWithVideoMuted": "false",
    "config.prejoinPageEnabled": "true",
    "config.subject": title,
    "config.enableNoisyMicDetection": "true",
    "interfaceConfig.SHOW_JITSI_WATERMARK": "false",
    "interfaceConfig.SHOW_WATERMARK_FOR_GUESTS": "false",
    "interfaceConfig.TOOLBAR_BUTTONS": JSON.stringify([
      "microphone", "camera", "closedcaptions", "desktop", "fullscreen",
      "fodeviceselection", "hangup", "profile", "chat", "recording",
      "livestreaming", "etherpad", "sharedvideo", "settings", "raisehand",
      "videoquality", "filmstrip", "invite", "feedback", "stats", "shortcuts",
      "tileview", "videobackgroundblur", "download", "help", "mute-everyone",
      "mute-video-everyone", "security",
    ]),
    "interfaceConfig Filmstrip": "false",
    "userInfo.displayName": userName,
  }).toString();

  // Listen for Jitsi API events (participant count, etc.)
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "participant-count") {
        setParticipantCount(event.data.count);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const leaveMeeting = () => {
    window.location.href = "/visioconference";
  };

  return (
    <div className="flex flex-1 flex-col bg-[#0d1530]">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <div className="flex items-center gap-2 text-white">
          <span className="text-sm font-medium truncate max-w-xs sm:max-w-md">{title}</span>
          {isHost && (
            <span className="rounded bg-[#2DD4BF]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#2DD4BF]">
              HOST
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 hover:bg-white/10"
            title="Participants"
          >
            <Users className="h-4 w-4" />
          </button>
          <button
            onClick={leaveMeeting}
            className="flex h-9 items-center gap-2 rounded-lg bg-red-500 px-4 text-sm font-semibold text-white hover:bg-red-600"
          >
            <PhoneOff className="h-4 w-4" />
            <span className="hidden sm:inline">Quitter</span>
          </button>
        </div>
      </div>

      {/* Jitsi iframe — full screen */}
      <div className="relative flex-1">
        <iframe
          ref={iframeRef}
          src={roomUrl}
          allow="camera; microphone; display-capture; autoplay; clipboard-write; fullscreen"
          className="absolute inset-0 h-full w-full border-0"
          title={title}
        />
      </div>

      {/* Info overlay */}
      {showInfo && (
        <div className="absolute bottom-16 right-4 z-50 w-64 rounded-xl border border-white/10 bg-[#1B2A4E] p-4 shadow-xl">
          <h3 className="mb-2 text-sm font-semibold text-white">Informations</h3>
          <div className="space-y-2 text-xs text-white/70">
            <div className="flex justify-between">
              <span>Statut</span>
              <span className="flex items-center gap-1 text-green-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                En direct
              </span>
            </div>
            <div className="flex justify-between">
              <span>Room</span>
              <span className="font-mono text-white/50">{roomName}</span>
            </div>
            <div className="flex justify-between">
              <span>Rôle</span>
              <span className="text-[#2DD4BF]">{isHost ? "Organisateur" : "Participant"}</span>
            </div>
          </div>
          <p className="mt-3 border-t border-white/10 pt-2 text-[10px] text-white/40">
            Propulsé par Jitsi Meet — 100% gratuit, open source
          </p>
        </div>
      )}
    </div>
  );
}
