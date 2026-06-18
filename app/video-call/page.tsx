"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/state";
import { Camera, CameraOff, Mic, MicOff, PhoneOff, Sparkles } from "lucide-react";

export default function VideoCallPage() {
  const router = useRouter();
  const { state, endCall } = useAppState();

  const [muted, setMuted] = useState(false);
  const [camera, setCamera] = useState(true);
  const [callTime, setCallTime] = useState(0);
  const [adRefreshCount, setAdRefreshCount] = useState(0);

  const callInfo = state.activeCall;

  // Call timers and 30-sec ad refresh loop
  useEffect(() => {
    if (callInfo.status === "connected") {
      const timer = setInterval(() => {
        setCallTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [callInfo.status]);

  useEffect(() => {
    const adTimer = setInterval(() => {
      setAdRefreshCount(prev => prev + 1);
    }, 30000);
    return () => clearInterval(adTimer);
  }, []);

  const handleHangup = () => {
    endCall();
    router.back();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-4 relative overflow-hidden max-w-md mx-auto border-x border-white/5 font-sans">
      {/* Fullscreen Video Stream Sim (Partner Camera) */}
      <div className="absolute inset-0 z-0 bg-gray-950 flex items-center justify-center">
        {camera ? (
          <img 
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600" 
            alt="Video Call Feed" 
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="flex flex-col items-center">
            <CameraOff className="w-12 h-12 text-gray-600 mb-2 animate-pulse" />
            <span className="text-xs text-gray-500">Partner video paused</span>
          </div>
        )}
      </div>

      {/* Top Overlay details */}
      <header className="z-10 bg-gradient-to-b from-black/80 to-transparent p-3 rounded-2xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-pink-500 rounded-full w-2.5 h-2.5 animate-ping" />
          <div>
            <h3 className="font-bold text-xs">{callInfo.partnerName || "Sneha Sharma"}</h3>
            <p className="text-[10px] text-pink-400 font-semibold uppercase tracking-wider mt-0.5">
              {callInfo.status === "ringing" ? "Ringing..." : formatTime(callTime)}
            </p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[8px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          P2P WebRTC HD
        </div>
      </header>

      {/* Picture in picture secondary block (Self Camera) */}
      <div className="absolute right-4 top-20 z-10 w-28 aspect-[3/4] bg-black/60 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        {camera ? (
          <img 
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150" 
            alt="Self Camera Feed" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CameraOff className="w-6 h-6 text-gray-600" />
          </div>
        )}
      </div>

      {/* Bottom controls overlay */}
      <div className="z-10 space-y-4">
        {/* Buttons tray */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => setMuted(!muted)}
            className={`p-3.5 rounded-full border transition ${
              muted 
                ? "bg-red-500/20 border-red-500 text-red-500" 
                : "bg-black/60 border-white/10 text-gray-300 hover:text-white"
            }`}
          >
            {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={handleHangup}
            className="p-4 bg-red-600 hover:bg-red-500 text-white rounded-full transition shadow-lg shadow-red-600/30"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          <button
            onClick={() => setCamera(!camera)}
            className={`p-3.5 rounded-full border transition ${
              !camera 
                ? "bg-red-500/20 border-red-500 text-red-500" 
                : "bg-black/60 border-white/10 text-gray-300 hover:text-white"
            }`}
          >
            {camera ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
          </button>
        </div>

        {/* Calling Banner Ad - Mandatory Sponsor (100% Premrog) */}
        <div className="w-full bg-black/70 border border-white/10 p-3 rounded-2xl flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="bg-pink-600 text-white text-[7px] font-bold px-1.5 py-0.5 rounded uppercase">Ad</span>
            <div>
              <p className="text-[9px] font-bold text-white">Join Premrog Premium Club today!</p>
              <p className="text-[8px] text-gray-400">Ad refreshes every 30 seconds (Loop: {adRefreshCount})</p>
            </div>
          </div>
          <button 
            onClick={() => alert("Sponsor Clicked!")}
            className="bg-pink-600 text-white text-[8px] font-bold px-3 py-1.5 rounded-xl hover:bg-pink-500 transition"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}