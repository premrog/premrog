"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/state";
import { Mic, MicOff, Volume2, VolumeX, PhoneOff, User, Sparkles } from "lucide-react";

export default function AudioCallPage() {
  const router = useRouter();
  const { state, endCall } = useAppState();

  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(true);
  const [callTime, setCallTime] = useState(0);
  const [adRefreshCount, setAdRefreshCount] = useState(0);

  const callInfo = state.activeCall;

  // Call timer and 30-sec ad refresh loop
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
    <div className="min-h-screen bg-black text-white flex flex-col justify-between items-center p-6 relative overflow-hidden max-w-md mx-auto border-x border-white/5 font-sans">
      {/* Glow shapes */}
      <div className="absolute top-[20%] left-[-10%] w-[300px] h-[300px] bg-pink-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top encrypted notice */}
      <div className="z-10 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-[9px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-pink-500" />
        WebRTC Secure Peer-to-Peer
      </div>

      {/* Caller details */}
      <div className="flex flex-col items-center z-10 mt-12">
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 p-[3px] animate-pulse">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
              <User className="w-14 h-14 text-pink-500" />
            </div>
          </div>
          {callInfo.status === "connected" && (
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-black" />
          )}
        </div>

        <h2 className="text-xl font-bold text-white tracking-wide">
          {callInfo.partnerName || "Sneha Sharma"}
        </h2>
        
        <p className="text-xs text-pink-400 font-semibold uppercase tracking-widest mt-2">
          {callInfo.status === "ringing" ? "Ringing..." : formatTime(callTime)}
        </p>

        {/* Pulsing visualizer waveform */}
        {callInfo.status === "connected" && (
          <div className="flex gap-1.5 mt-8 h-12 items-center">
            <span className="h-6 w-1 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
            <span className="h-10 w-1 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
            <span className="h-12 w-1 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "0.5s" }} />
            <span className="h-8 w-1 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            <span className="h-4 w-1 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
          </div>
        )}
      </div>

      {/* Actions & Banner Ad */}
      <div className="w-full z-10 space-y-8 flex flex-col items-center">
        {/* Call control action buttons */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => setMuted(!muted)}
            className={`p-4 rounded-full border transition ${
              muted 
                ? "bg-red-500/20 border-red-500 text-red-500" 
                : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={handleHangup}
            className="p-5 bg-red-600 hover:bg-red-500 text-white rounded-full transition shadow-lg shadow-red-600/30"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          <button
            onClick={() => setSpeaker(!speaker)}
            className={`p-4 rounded-full border transition ${
              !speaker 
                ? "bg-red-500/20 border-red-500 text-red-500" 
                : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            {speaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        {/* Call Ad Banner - Mandatory Sponsor (100% Premrog) */}
        <div className="w-full bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="bg-pink-600 text-white text-[7px] font-bold px-1.5 py-0.5 rounded uppercase">Ad</span>
            <div>
              <p className="text-[9px] font-bold text-white">Looking for faster networks?</p>
              <p className="text-[8px] text-gray-500">Ad slot refreshes every 30 seconds (Loop: {adRefreshCount})</p>
            </div>
          </div>
          <button 
            onClick={() => alert("Sponsor Clicked!")}
            className="bg-pink-600 text-white text-[8px] font-bold px-3 py-1.5 rounded-xl hover:bg-pink-500 transition"
          >
            Learn
          </button>
        </div>
      </div>
    </div>
  );
}