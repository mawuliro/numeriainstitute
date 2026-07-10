"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Mic, MicOff, Video, VideoOff, ScreenShare, ScreenShareOff,
  PhoneOff, MessageSquare, Users, Hand, Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Participant = {
  id: string;
  name: string;
  isHost: boolean;
  micOn: boolean;
  cameraOn: boolean;
  isScreenSharing: boolean;
  isHandRaised: boolean;
  stream?: MediaStream;
};

type ChatMessage = {
  id: string;
  author: string;
  text: string;
  timestamp: number;
};

export function MeetingRoom({
  meetingId,
  roomName,
  title,
  isHost,
  userName,
  waitingRoomEnabled,
}: {
  meetingId: string;
  roomName: string;
  title: string;
  isHost: boolean;
  userName: string;
  waitingRoomEnabled: boolean;
}) {
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([
    { id: "local", name: userName + " (You)", isHost, micOn: false, cameraOn: false, isScreenSharing: false, isHandRaised: false },
  ]);
  const [inWaitingRoom, setInWaitingRoom] = useState(!isHost && waitingRoomEnabled);
  const [admitted, setAdmitted] = useState(isHost || !waitingRoomEnabled);

  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);

  // Toggle camera
  const toggleCamera = useCallback(async () => {
    if (!cameraOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setLocalStream(stream);
        setCameraOn(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (e) {
        console.error("Camera error:", e);
        alert("Impossible d'accéder à la caméra. Vérifie les permissions.");
      }
    } else {
      localStream?.getVideoTracks().forEach((t) => t.stop());
      setLocalStream(null);
      setCameraOn(false);
      if (videoRef.current) videoRef.current.srcObject = null;
    }
  }, [cameraOn, localStream]);

  // Toggle mic
  const toggleMic = useCallback(async () => {
    if (!micOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // In a real app, this stream would be sent via WebRTC
        setMicOn(true);
      } catch (e) {
        alert("Impossible d'accéder au microphone.");
      }
    } else {
      setMicOn(false);
    }
  }, [micOn]);

  // Toggle screen share
  const toggleScreenShare = useCallback(async () => {
    if (!screenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
        setScreenSharing(true);
        if (screenRef.current) screenRef.current.srcObject = stream;
        stream.getVideoTracks()[0].onended = () => setScreenSharing(false);
      } catch (e) {
        // User cancelled
      }
    } else {
      setScreenSharing(false);
    }
  }, [screenSharing]);

  // Send chat message
  const sendMessage = useCallback(() => {
    if (!chatInput.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), author: userName, text: chatInput, timestamp: Date.now() },
    ]);
    setChatInput("");
  }, [chatInput, userName]);

  // Leave meeting
  const leaveMeeting = useCallback(() => {
    localStream?.getTracks().forEach((t) => t.stop());
    window.location.href = "/visioconference";
  }, [localStream]);

  // Waiting room - simulate admit (in production, this would use WebSocket/polling)
  useEffect(() => {
    if (inWaitingRoom) {
      // Auto-admit after 3 seconds for demo (in production, host admits via WebSocket)
      const timer = setTimeout(() => {
        setInWaitingRoom(false);
        setAdmitted(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [inWaitingRoom]);

  // Waiting room screen
  if (inWaitingRoom) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="max-w-md text-center text-white">
          <div className="mb-4 text-6xl animate-pulse">🚪</div>
          <h1 className="text-2xl font-bold">Salle d'attente</h1>
          <p className="mt-2 text-white/60">
            Tu seras admis dans la réunion dès que l'organisateur sera prêt.
          </p>
          <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/3 animate-pulse rounded-full bg-[#2DD4BF]" />
          </div>
          <p className="mt-3 text-xs text-white/40">Connexion en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-[#0d1530]">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <div className="flex items-center gap-2 text-white">
          <Video className="h-5 w-5 text-[#2DD4BF]" />
          <span className="text-sm font-medium">{title}</span>
          {isHost && <span className="rounded bg-[#2DD4BF]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#2DD4BF]">HOST</span>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setShowParticipants(!showParticipants); setShowChat(false); }}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 hover:bg-white/10"
          >
            <Users className="h-4 w-4" />
          </button>
          <button
            onClick={() => { setShowChat(!showChat); setShowParticipants(false); }}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 hover:bg-white/10"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video grid */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {/* Local participant */}
            <div className="relative aspect-video rounded-xl bg-black/50 overflow-hidden border-2 border-[#2DD4BF]/30">
              {cameraOn ? (
                <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2DD4BF]/20 text-2xl font-bold text-[#2DD4BF]">
                    {userName[0]?.toUpperCase()}
                  </div>
                </div>
              )}
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1">
                {!micOn && <MicOff className="h-3 w-3 text-red-400" />}
                <span className="text-xs text-white">{userName} (You)</span>
                {handRaised && <Hand className="h-3 w-3 text-[#C9A227]" />}
              </div>
            </div>

            {/* Screen share */}
            {screenSharing && (
              <div className="relative aspect-video rounded-xl bg-black/50 overflow-hidden border-2 border-blue-400/50 sm:col-span-2 lg:col-span-3">
                <video ref={screenRef} autoPlay playsInline muted className="h-full w-full object-contain" />
                <div className="absolute bottom-2 left-2 rounded-md bg-blue-500/60 px-2 py-1">
                  <span className="text-xs text-white">Partage d'écran — {userName}</span>
                </div>
              </div>
            )}

            {/* Remote participants placeholder (would be filled by WebRTC) */}
            <div className="relative aspect-video rounded-xl bg-black/30 overflow-hidden">
              <div className="flex h-full items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-2xl font-bold text-white/40">
                  ?
                </div>
              </div>
              <div className="absolute bottom-2 left-2 text-xs text-white/40">
                En attente de participants...
              </div>
            </div>
          </div>
        </div>

        {/* Side panel: Chat or Participants */}
        {(showChat || showParticipants) && (
          <div className="w-72 border-l border-white/10 bg-[#1B2A4E]/50">
            {showChat && (
              <div className="flex h-full flex-col">
                <div className="border-b border-white/10 p-3">
                  <h3 className="text-sm font-semibold text-white">Chat</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {messages.length === 0 ? (
                    <p className="text-center text-xs text-white/40 mt-4">Aucun message pour le moment</p>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className="rounded-lg bg-white/5 p-2">
                        <p className="text-xs font-semibold text-[#2DD4BF]">{msg.author}</p>
                        <p className="text-sm text-white/80">{msg.text}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="border-t border-white/10 p-3 flex gap-2">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Message..."
                    className="flex-1 rounded-lg bg-white/10 px-3 py-1.5 text-sm text-white placeholder-white/30 outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    className="rounded-lg bg-[#2DD4BF] px-3 py-1.5 text-sm font-semibold text-[#1B2A4E]"
                  >
                    Envoyer
                  </button>
                </div>
              </div>
            )}

            {showParticipants && (
              <div className="flex h-full flex-col">
                <div className="border-b border-white/10 p-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Participants ({participants.length})</h3>
                  {isHost && (
                    <button className="text-xs text-[#2DD4BF] hover:underline">Muet pour tous</button>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  {participants.map((p) => (
                    <div key={p.id} className="flex items-center gap-2 rounded-lg p-2 hover:bg-white/5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2DD4BF]/20 text-sm font-bold text-[#2DD4BF]">
                        {p.name[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white">{p.name}</p>
                        {p.isHost && <span className="text-[10px] text-[#2DD4BF]">Organisateur</span>}
                      </div>
                      {!p.micOn && <MicOff className="h-3 w-3 text-red-400" />}
                      {!p.cameraOn && <VideoOff className="h-3 w-3 text-white/30" />}
                      {p.isHandRaised && <Hand className="h-3 w-3 text-[#C9A227]" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control bar */}
      <div className="flex items-center justify-center gap-2 border-t border-white/10 bg-[#0d1530] px-4 py-3">
        <button
          onClick={toggleMic}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
            micOn ? "bg-white/10 text-white hover:bg-white/20" : "bg-red-500 text-white hover:bg-red-600"
          }`}
          title={micOn ? "Couper le micro" : "Activer le micro"}
        >
          {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </button>

        <button
          onClick={toggleCamera}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
            cameraOn ? "bg-white/10 text-white hover:bg-white/20" : "bg-red-500 text-white hover:bg-red-600"
          }`}
          title={cameraOn ? "Couper la caméra" : "Activer la caméra"}
        >
          {cameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </button>

        <button
          onClick={toggleScreenShare}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
            screenSharing ? "bg-[#2DD4BF] text-[#1B2A4E]" : "bg-white/10 text-white hover:bg-white/20"
          }`}
          title="Partager l'écran"
        >
          {screenSharing ? <ScreenShareOff className="h-5 w-5" /> : <ScreenShare className="h-5 w-5" />}
        </button>

        <button
          onClick={() => setHandRaised(!handRaised)}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
            handRaised ? "bg-[#C9A227] text-white" : "bg-white/10 text-white hover:bg-white/20"
          }`}
          title="Lever la main"
        >
          <Hand className="h-5 w-5" />
        </button>

        <button
          onClick={() => { setShowChat(!showChat); setShowParticipants(false); }}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
            showChat ? "bg-[#2DD4BF] text-[#1B2A4E]" : "bg-white/10 text-white hover:bg-white/20"
          }`}
          title="Chat"
        >
          <MessageSquare className="h-5 w-5" />
        </button>

        <button
          onClick={() => { setShowParticipants(!showParticipants); setShowChat(false); }}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
            showParticipants ? "bg-[#2DD4BF] text-[#1B2A4E]" : "bg-white/10 text-white hover:bg-white/20"
          }`}
          title="Participants"
        >
          <Users className="h-5 w-5" />
        </button>

        {/* Leave button */}
        <button
          onClick={leaveMeeting}
          className="ml-4 flex h-11 items-center gap-2 rounded-full bg-red-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-red-600"
          title="Quitter"
        >
          <PhoneOff className="h-5 w-5" />
          <span className="hidden sm:inline">Quitter</span>
        </button>
      </div>
    </div>
  );
}
