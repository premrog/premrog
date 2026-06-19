"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { useAppState } from "@/lib/state";
import { 
  UploadCloud, 
  ImageIcon, 
  Film, 
  Video as VideoIcon, 
  Tv, 
  CircleDot, 
  Coins,
  DollarSign,
  AlertCircle,
  Sparkles,
  Camera,
  FolderOpen,
  Check
} from "lucide-react";

function UploadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, uploadContent } = useAppState();

  const isIndia = state.user?.country === "India";
  const currencySymbol = isIndia ? "₹" : "$";

  // State for source modal
  const [source, setSource] = useState<"camera" | "gallery" | null>(null);
  const [isSimulatingSource, setIsSimulatingSource] = useState(false);

  const [type, setType] = useState<"photo" | "story" | "reel" | "video" | "movie">("photo");
  const [caption, setCaption] = useState("");
  const [fileSizeMB, setFileSizeMB] = useState(0.1); // default 100 KB
  const [durationSeconds, setDurationSeconds] = useState(10); // default 10s
  const [autoRenew, setAutoRenew] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Set default parameters when source is picked in URL
  useEffect(() => {
    const urlSource = searchParams.get("source");
    if (urlSource === "camera" || urlSource === "gallery") {
      triggerSourceSimulation(urlSource);
    }
  }, [searchParams]);

  const triggerSourceSimulation = (selectedSource: "camera" | "gallery") => {
    setIsSimulatingSource(true);
    setTimeout(() => {
      setIsSimulatingSource(false);
      setSource(selectedSource);
    }, 1200);
  };

  // Upload configuration details mapping
  const getUploadSpecs = (uploadType: typeof type) => {
    switch (uploadType) {
      case "photo":
        return { label: "Photo", maxMB: 0.2, maxDuration: 0, cost: 1, unit: "Coins", validity: "28 Days", desc: "Max Size: 200 KB | Ingestion: 1 Coin" };
      case "story":
        return { label: "Story", maxMB: 10, maxDuration: 10, cost: 2, unit: "Coins", validity: "24 Hours", desc: "Max Duration: 10 Seconds | Ingestion: 2 Coins" };
      case "reel":
        return { label: "Reel", maxMB: 25, maxDuration: 60, cost: isIndia ? 1 : 0.02, unit: "Cash", validity: "28 Days", desc: `Max Size: 25 MB | Max Duration: 1 min | Cost: ${isIndia ? '₹1' : '$0.02'}` };
      case "video":
        return { label: "Video", maxMB: 120, maxDuration: 600, cost: isIndia ? 5 : 0.07, unit: "Cash", validity: "28 Days", desc: `Max Size: 120 MB | Max Duration: 10 min | Cost: ${isIndia ? '₹5' : '$0.07'}` };
      case "movie":
        return { label: "Movie", maxMB: 1500, maxDuration: 10800, cost: isIndia ? 59 : 0.80, unit: "Cash", validity: "28 Days", desc: `Max Size: 1500 MB (1.5GB) | Max Duration: 3 hours | Cost: ${isIndia ? '₹59' : '$0.80'}` };
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
      setError("Please add a title or description.");
      return;
    }

    // Strict parameter and extension checks prior to ingestion
    if (type === "photo" && fileSizeMB > 0.2) {
      setError("Compliance Violation: Photo size exceeds strict 200 KB limit.");
      return;
    }
    if (type === "story" && durationSeconds > 10) {
      setError("Compliance Violation: Story duration exceeds strict 10-second limit.");
      return;
    }
    if (type === "reel" && fileSizeMB > 25) {
      setError("Compliance Violation: Reel size exceeds strict 25 MB limit.");
      return;
    }
    if (type === "reel" && durationSeconds > 60) {
      setError("Compliance Violation: Reel duration exceeds strict 1 minute limit.");
      return;
    }
    if (type === "video" && fileSizeMB > 120) {
      setError("Compliance Violation: Video size exceeds strict 120 MB limit.");
      return;
    }
    if (type === "video" && durationSeconds > 600) {
      setError("Compliance Violation: Video duration exceeds strict 10 minutes limit.");
      return;
    }
    if (type === "movie" && fileSizeMB > 1500) {
      setError("Compliance Violation: Movie size exceeds strict 1500 MB (1.5GB) limit.");
      return;
    }
    if (type === "movie" && durationSeconds > 10800) {
      setError("Compliance Violation: Movie duration exceeds strict 3 hours limit.");
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
    <div className="bg-[#FFF5F7] text-[#000000] min-h-screen pb-24 font-sans relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-1/4 w-[250px] h-[250px] bg-pink-300/10 rounded-full blur-[80px] pointer-events-none" />

      {/* 1. Acquisition Gateway Modal Overlay (Camera vs Gallery bottom sheet popup) */}
      {(!source || isSimulatingSource) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/60 backdrop-blur-xs p-4">
          <div className="bg-[#FFF5F7] border-2 border-pink-200 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative text-center">
            {isSimulatingSource ? (
              <div className="py-12 space-y-4">
                <div className="w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <h3 className="font-bold text-[#000000]">Connecting Ingestion Source...</h3>
                <p className="text-[10px] text-pink-800">Invoking device drivers and validation layers</p>
              </div>
            ) : (
              <>
                <h3 className="font-black text-lg text-[#000000] uppercase tracking-wide mb-1">
                  Select Ingestion Source
                </h3>
                <p className="text-[10px] text-pink-900 mb-6 font-medium">
                  Choose your hardware capture route or browse local file storage.
                </p>

                <div className="space-y-3">
                  {/* Option A: Camera */}
                  <button
                    onClick={() => triggerSourceSimulation("camera")}
                    className="w-full flex items-center justify-between p-4 bg-white border border-pink-200 rounded-2xl hover:bg-pink-50 transition cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-pink-100 p-2.5 rounded-xl border border-pink-200">
                        <Camera className="w-5 h-5 text-pink-600" />
                      </div>
                      <div>
                        <strong className="text-[#000000] text-xs block">Option A: Camera</strong>
                        <span className="text-[9px] text-[#000000]/70 block mt-0.5">लाइव रिकॉर्डिंग/कैप्चर (Auto timing limits apply)</span>
                      </div>
                    </div>
                  </button>

                  {/* Option B: Gallery */}
                  <button
                    onClick={() => triggerSourceSimulation("gallery")}
                    className="w-full flex items-center justify-between p-4 bg-white border border-pink-200 rounded-2xl hover:bg-pink-50 transition cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-pink-100 p-2.5 rounded-xl border border-pink-200">
                        <FolderOpen className="w-5 h-5 text-pink-600" />
                      </div>
                      <div>
                        <strong className="text-[#000000] text-xs block">Option B: Gallery</strong>
                        <span className="text-[9px] text-[#000000]/70 block mt-0.5">गैलरी/स्टोरेज से चयन (Verifies parameters & size checks)</span>
                      </div>
                    </div>
                  </button>
                </div>

                <button
                  onClick={() => router.push("/home")}
                  className="mt-6 text-xs text-pink-700 hover:underline font-bold"
                >
                  Cancel & Go Home
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <main className="max-w-md mx-auto px-4 pt-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-black tracking-wide text-[#000000]">
            INGESTION PORTAL (V19)
          </h1>
          {source && (
            <span className="text-[9px] bg-pink-100 border border-pink-200 text-pink-600 font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
              <Check className="w-3 h-3 text-pink-600" />
              Source: {source}
            </span>
          )}
        </div>

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs rounded-2xl p-4 mb-4 text-center font-bold">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-2xl p-4 mb-4 text-center font-bold flex items-center justify-center gap-1.5">
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
                className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                  isSelected 
                    ? "border-pink-500 bg-pink-100 text-pink-600 scale-105" 
                    : "border-pink-200 bg-white text-[#000000] hover:bg-pink-50"
                }`}
              >
                {tType === "photo" && <ImageIcon className="w-4 h-4 text-pink-600" />}
                {tType === "story" && <CircleDot className="w-4 h-4 text-pink-600" />}
                {tType === "reel" && <Film className="w-4 h-4 text-pink-600" />}
                {tType === "video" && <VideoIcon className="w-4 h-4 text-pink-600" />}
                {tType === "movie" && <Tv className="w-4 h-4 text-pink-600" />}
                <span className="text-[9px] font-bold capitalize">{tType}</span>
              </button>
            );
          })}
        </section>

        {/* Specs Display Banner */}
        <section className="bg-white border border-pink-200 rounded-2xl p-3.5 mb-6 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-[#000000]">{specs.label} Ingestion Bounds</h3>
            <span className="text-[10px] text-pink-900 font-medium block mt-0.5">{specs.desc}</span>
          </div>
          <span className="text-[10px] bg-pink-100 border border-pink-200 text-pink-600 font-bold px-2 py-0.5 rounded uppercase">
            {specs.validity}
          </span>
        </section>

        {/* Upload Form */}
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          {/* Caption / Title */}
          <div>
            <label className="block text-xs font-bold text-pink-800 uppercase tracking-wider mb-2">
              Description or Movie Title
            </label>
            <textarea
              required
              rows={3}
              placeholder={`Enter title or caption details for this ${type}...`}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-white border border-pink-200 rounded-2xl p-3 text-xs text-[#000000] placeholder-pink-400 focus:outline-none focus:border-pink-500 transition duration-300"
            />
          </div>

          {/* Size simulator slider */}
          <div>
            <div className="flex justify-between items-center mb-2 text-xs">
              <span className="text-pink-850 font-semibold">Simulate Ingested File Size</span>
              <span className="font-bold text-pink-600">
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
              className="w-full accent-pink-600 cursor-pointer"
            />
            <span className="text-[9px] text-[#000000]/70 block mt-1 font-medium">
              Strict limit constraint: {specs.maxMB < 1 ? `${specs.maxMB * 1024} KB` : `${specs.maxMB} MB`}
            </span>
          </div>

          {/* Duration simulator slider */}
          {type !== "photo" && (
            <div>
              <div className="flex justify-between items-center mb-2 text-xs">
                <span className="text-pink-850 font-semibold">Simulate Media Playback Duration</span>
                <span className="font-bold text-pink-600">
                  {durationSeconds < 60 ? `${durationSeconds}s` : `${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`}
                </span>
              </div>
              <input
                type="range"
                min={type === "story" ? 5 : type === "reel" ? 10 : type === "video" ? 60 : 3600}
                max={type === "story" ? 15 : type === "reel" ? 90 : type === "video" ? 900 : 14400}
                value={durationSeconds}
                onChange={(e) => setDurationSeconds(parseInt(e.target.value))}
                className="w-full accent-pink-600 cursor-pointer"
              />
              <span className="text-[9px] text-[#000000]/70 block mt-1 font-medium">
                Strict limit constraint: {specs.maxDuration < 60 ? `${specs.maxDuration} seconds` : `${specs.maxDuration / 60} minutes`}
              </span>
            </div>
          )}

          {/* Source Timing Notification */}
          {source === "camera" && type !== "photo" && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-2xl text-[10px] font-semibold leading-normal">
              ⏳ Camera Capture Timing Cap Active: Live camera capture auto-caps duration limits to 10s for Stories and 1m (60s) for Reels as mandated by hardware interface requirements.
            </div>
          )}

          {/* Auto Renew Setting */}
          <div className="bg-white border border-pink-200 rounded-2xl p-4 flex justify-between items-center shadow-sm">
            <div>
              <span className="text-xs font-bold text-[#000000] block">Enable Auto-Renew</span>
              <span className="text-[9px] text-[#000000]/70 block mt-0.5 font-medium">
                ON &rarr; Auto-deduct wallet to renew | OFF &rarr; Auto-delete after expiry (Server Cron scanning)
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoRenew}
              onChange={(e) => setAutoRenew(e.target.checked)}
              className="w-5 h-5 accent-pink-600 cursor-pointer"
            />
          </div>

          {/* Wallet check cost banner */}
          <div className="bg-white border border-pink-200 rounded-2xl p-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
              {specs.unit === "Coins" ? (
                <Coins className="w-5 h-5 text-pink-600" />
              ) : (
                <DollarSign className="w-5 h-5 text-pink-600" />
              )}
              <div>
                <span className="text-[10px] text-pink-700 uppercase tracking-widest block font-bold">Deduction Cost</span>
                <span className="text-sm font-black text-[#000000]">
                  {specs.unit === "Coins" 
                    ? `${specs.cost} Coins` 
                    : `${currencySymbol}${specs.cost}`}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-pink-700 uppercase tracking-widest block font-bold">Available Balance</span>
              <span className="text-xs font-bold text-pink-900">
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
            className="w-full bg-[#000000] hover:bg-[#000000]/90 text-[#FFF5F7] font-bold py-3.5 rounded-2xl transition shadow-md shadow-pink-200 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#FFF5F7] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UploadCloud className="w-4.5 h-4.5 text-pink-500" />
                <span>Pay Ingestion Fee & Upload {type.toUpperCase()}</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => setSource(null)}
            className="text-xs text-pink-700 hover:underline font-bold"
          >
            Change Ingestion Source
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF5F7] text-black flex items-center justify-center">Loading Ingestion Portal...</div>}>
      <UploadContent />
    </Suspense>
  );
}