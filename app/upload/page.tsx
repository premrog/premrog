"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { useAppState } from "@/lib/state";
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Film, 
  Video as VideoIcon, 
  Tv, 
  CircleDot, 
  Coins,
  DollarSign,
  AlertCircle,
  Sparkles,
  ToggleLeft
} from "lucide-react";

export default function UploadPage() {
  const router = useRouter();
  const { state, uploadContent, t } = useAppState();

  const [type, setType] = useState<"photo" | "story" | "reel" | "video" | "movie">("photo");
  const [caption, setCaption] = useState("");
  const [fileSizeMB, setFileSizeMB] = useState(0.1); // default 100 KB
  const [durationSeconds, setDurationSeconds] = useState(10); // default 10s
  const [autoRenew, setAutoRenew] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isIndia = state.user?.country === "India";
  const currencySymbol = isIndia ? "₹" : "$";

  // Upload configuration details mapping
  const getUploadSpecs = (uploadType: typeof type) => {
    switch (uploadType) {
      case "photo":
        return { label: "Photo Feed", maxMB: 0.2, maxDuration: 0, cost: 1, unit: "Coins", validity: "28 Days", desc: "Max Size: 200 KB | Charges: 1 Coin" };
      case "story":
        return { label: "Stories Bar", maxMB: 10, maxDuration: 10, cost: 2, unit: "Coins", validity: "24 Hours", desc: "Max Duration: 10 Seconds | Charges: 2 Coins" };
      case "reel":
        return { label: "Reels Stream", maxMB: 25, maxDuration: 60, cost: 1, unit: "Cash", validity: "28 Days", desc: "Max Size: 25 MB | Max Duration: 1 min | Cost: ₹1" };
      case "video":
        return { label: "Videos Hub", maxMB: 120, maxDuration: 600, cost: 5, unit: "Cash", validity: "28 Days", desc: "Max Size: 120 MB | Max Duration: 10 min | Cost: ₹5" };
      case "movie":
        return { label: "Movies Cinema", maxMB: 1500, maxDuration: 10800, cost: 59, unit: "Cash", validity: "28 Days", desc: "Max Size: 1500 MB | Max Duration: 3 hours | Cost: ₹59" };
    }
  };

  const specs = getUploadSpecs(type);

  // Set default parameters when upload type changes
  const handleTypeChange = (newType: typeof type) => {
    setType(newType);
    setError("");
    setSuccess("");
    if (newType === "photo") {
      setFileSizeMB(0.1);
      setDurationSeconds(0);
    } else if (newType === "story") {
      setFileSizeMB(2);
      setDurationSeconds(10);
    } else if (newType === "reel") {
      setFileSizeMB(15);
      setDurationSeconds(45);
    } else if (newType === "video") {
      setFileSizeMB(80);
      setDurationSeconds(480);
    } else {
      setFileSizeMB(900);
      setDurationSeconds(7200);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!caption.trim()) {
      setError("Please add a title or caption.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const res = uploadContent(type, caption, fileSizeMB, durationSeconds, autoRenew);
      if (res.success) {
        setSuccess(res.message);
        setCaption("");
        setTimeout(() => {
          router.push(type === "reel" ? "/reels" : "/home");
        }, 1500);
      } else {
        setError(res.message);
      }
    }, 1500);
  };

  return (
    <div className="bg-black text-white min-h-screen pb-24 font-sans relative overflow-hidden">
      {/* Dynamic Background neon blurs */}
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-pink-900/10 rounded-full blur-[100px] pointer-events-none" />

      <main className="max-w-md mx-auto px-4 pt-4">
        <h1 className="text-xl font-black mb-6 tracking-wide bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          UPLOAD CONTENT PORTAL
        </h1>

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-2xl p-4 mb-4 text-center font-bold">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-2xl p-4 mb-4 text-center font-bold flex items-center justify-center gap-1.5">
            <AlertCircle className="w-4.5 h-4.5" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Selector grid for upload types */}
        <section className="grid grid-cols-5 gap-1.5 mb-6">
          {(["photo", "story", "reel", "video", "movie"] as const).map((tType) => {
            const isSelected = type === tType;
            return (
              <button
                key={tType}
                type="button"
                onClick={() => handleTypeChange(tType)}
                className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${
                  isSelected 
                    ? "border-pink-500 bg-pink-500/10 text-pink-500 scale-105" 
                    : "border-white/5 bg-white/5 text-gray-400 hover:text-gray-200"
                }`}
              >
                {tType === "photo" && <ImageIcon className="w-4 h-4" />}
                {tType === "story" && <CircleDot className="w-4 h-4" />}
                {tType === "reel" && <Film className="w-4 h-4" />}
                {tType === "video" && <VideoIcon className="w-4 h-4" />}
                {tType === "movie" && <Tv className="w-4 h-4" />}
                <span className="text-[9px] font-bold capitalize">{tType}</span>
              </button>
            );
          })}
        </section>

        {/* Specs Display Banner */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-3.5 mb-6 backdrop-blur-md flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-white">{specs.label} Specification</h3>
            <span className="text-[10px] text-gray-400 block mt-0.5">{specs.desc}</span>
          </div>
          <span className="text-[10px] bg-pink-500/10 border border-pink-500/20 text-pink-400 font-bold px-2 py-0.5 rounded uppercase">
            {specs.validity}
          </span>
        </section>

        {/* Upload Form */}
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          {/* Caption / Title */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Caption or Movie Title
            </label>
            <textarea
              required
              rows={3}
              placeholder={`Write description for this ${type} or movie details...`}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition duration-300"
            />
          </div>

          {/* Size simulator slider */}
          <div>
            <div className="flex justify-between items-center mb-2 text-xs">
              <span className="text-gray-400 font-medium">Simulate File Size</span>
              <span className="font-bold text-pink-500">
                {fileSizeMB < 1 ? `${(fileSizeMB * 1024).toFixed(0)} KB` : `${fileSizeMB.toFixed(1)} MB`}
              </span>
            </div>
            <input
              type="range"
              min={type === "photo" ? 0.05 : type === "story" ? 1 : type === "reel" ? 5 : type === "video" ? 20 : 200}
              max={type === "photo" ? 0.4 : type === "story" ? 15 : type === "reel" ? 40 : type === "video" ? 200 : 2000}
              step={type === "photo" ? 0.01 : type === "movie" ? 50 : 1}
              value={fileSizeMB}
              onChange={(e) => setFileSizeMB(parseFloat(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer"
            />
            <span className="text-[9px] text-gray-500 block mt-1">
              Constraint limit: {specs.maxMB < 1 ? `${specs.maxMB * 1024} KB` : `${specs.maxMB} MB`}
            </span>
          </div>

          {/* Duration simulator slider */}
          {type !== "photo" && (
            <div>
              <div className="flex justify-between items-center mb-2 text-xs">
                <span className="text-gray-400 font-medium">Simulate Media Duration</span>
                <span className="font-bold text-pink-500">
                  {durationSeconds < 60 ? `${durationSeconds}s` : `${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`}
                </span>
              </div>
              <input
                type="range"
                min={type === "story" ? 5 : type === "reel" ? 10 : type === "video" ? 60 : 3600}
                max={type === "story" ? 15 : type === "reel" ? 90 : type === "video" ? 900 : 14400}
                value={durationSeconds}
                onChange={(e) => setDurationSeconds(parseInt(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
              <span className="text-[9px] text-gray-500 block mt-1">
                Constraint limit: {specs.maxDuration < 60 ? `${specs.maxDuration} seconds` : `${specs.maxDuration / 60} minutes`}
              </span>
            </div>
          )}

          {/* Auto Renew Setting */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center backdrop-blur-md">
            <div>
              <span className="text-xs font-bold text-gray-200 block">Enable Auto-Renew</span>
              <span className="text-[9px] text-gray-400 block mt-0.5">
                ON → Auto-deduct wallet to renew | OFF → Delete after expiry
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoRenew}
              onChange={(e) => setAutoRenew(e.target.checked)}
              className="w-5 h-5 accent-pink-500"
            />
          </div>

          {/* Wallet check cost banner */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {specs.unit === "Coins" ? (
                <Coins className="w-5 h-5 text-yellow-500" />
              ) : (
                <DollarSign className="w-5 h-5 text-green-500" />
              )}
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest block">Deduction Cost</span>
                <span className="text-sm font-black text-white">
                  {specs.unit === "Coins" 
                    ? `${specs.cost} Coins` 
                    : `${currencySymbol}${isIndia ? specs.cost : (specs.cost / 80).toFixed(2)}`}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest block">Available Balance</span>
              <span className="text-xs font-bold text-gray-300">
                {specs.unit === "Coins" 
                  ? `${state.coins} Coins` 
                  : `${currencySymbol}${state.cash}`}
              </span>
            </div>
          </div>

          {/* Upload Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-2xl transition shadow-lg shadow-pink-600/20 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UploadCloud className="w-4.5 h-4.5" />
                <span>Pay & Upload {type.toUpperCase()}</span>
              </>
            )}
          </button>
        </form>
      </main>

      <BottomNav />
    </div>
  );
}