"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppState } from "@/lib/state";
import { ArrowLeft, Send, Sparkles, AlertCircle } from "lucide-react";

function StoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state } = useAppState();
  
  const stories = state.posts.filter(p => p.type === "story" && p.status === "active");
  const targetId = searchParams.get("id");

  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState("");

  // Set initial story index based on URL param
  useEffect(() => {
    if (targetId && stories.length > 0) {
      const idx = stories.findIndex(s => s.id === targetId);
      if (idx !== -1) {
        setActiveIndex(idx);
      }
    }
  }, [targetId, stories]);

  // Story progress timer (10 seconds total)
  useEffect(() => {
    if (stories.length === 0) return;
    
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Go to next story
          if (activeIndex < stories.length - 1) {
            setActiveIndex((prevIdx) => prevIdx + 1);
          } else {
            // End of stories, go home
            router.push("/home");
          }
          return 0;
        }
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeIndex, stories, router]);

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else {
      router.push("/home");
    }
  };

  const handleNext = () => {
    if (activeIndex < stories.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      router.push("/home");
    }
  };

  const handleSendReaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    alert(`Reaction sent to ${activeStory.user}: "${replyText}"`);
    setReplyText("");
  };

  if (stories.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-pink-500 mb-3 animate-pulse" />
        <h2 className="font-bold text-lg">No Stories Active</h2>
        <p className="text-sm text-gray-500 mt-1 max-w-xs">
          Stories cost 2 coins and remain active for 24 hours. Upload a story in the Upload tab!
        </p>
        <Link href="/upload" className="mt-5 bg-pink-600 px-6 py-2.5 rounded-xl font-bold hover:bg-pink-500 transition">
          Create Story
        </Link>
      </div>
    );
  }

  const activeStory = stories[activeIndex];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between relative select-none">
      {/* Top progress indicators */}
      <div className="absolute top-3 left-4 right-4 z-20 flex gap-1.5">
        {stories.map((s, idx) => {
          let width = "0%";
          if (idx < activeIndex) width = "100%";
          if (idx === activeIndex) width = `${progress}%`;

          return (
            <div key={s.id} className="flex-1 h-[3px] bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-pink-500 transition-all duration-100 ease-linear"
                style={{ width }}
              />
            </div>
          );
        })}
      </div>

      {/* Header overlay */}
      <div className="absolute top-6 left-4 right-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/40 to-transparent p-2 rounded-xl">
        <div className="flex items-center gap-2.5">
          <button onClick={() => router.push("/home")} className="text-white hover:text-gray-300">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <img 
            src={activeStory.userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150"}
            alt={activeStory.user}
            className="w-8 h-8 rounded-full border border-pink-500 object-cover"
          />
          <div>
            <h3 className="text-xs font-bold text-white">@{activeStory.user}</h3>
            <span className="text-[8px] text-gray-300 font-medium uppercase tracking-wider">
              Story • {activeStory.duration || "10s"}
            </span>
          </div>
        </div>

        <div className="bg-pink-600/20 border border-pink-500/20 px-2 py-0.5 rounded text-[8px] font-bold text-pink-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Valid 24h
        </div>
      </div>

      {/* Interactive left/right tap areas */}
      <div className="absolute inset-y-20 left-0 right-0 z-10 flex">
        <div className="w-[30%] h-full cursor-w-resize" onClick={handlePrev} />
        <div className="w-[40%] h-full" onClick={() => alert("Story paused. Release to resume.")} />
        <div className="w-[30%] h-full cursor-e-resize" onClick={handleNext} />
      </div>

      {/* Image/Content Container */}
      <div className="flex-1 w-full bg-gray-950 flex items-center justify-center overflow-hidden">
        <img
          src={activeStory.mediaUrl}
          alt="Story Media"
          className="w-full h-full object-cover max-w-md"
        />
        
        {/* Caption Overlay */}
        {activeStory.caption && (
          <div className="absolute bottom-24 left-6 right-6 z-20 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/5 text-center text-xs text-white leading-relaxed">
            {activeStory.caption}
          </div>
        )}
      </div>

      {/* Bottom text response input */}
      <div className="p-4 bg-gradient-to-t from-black to-black/80 z-20 max-w-md mx-auto w-full">
        <form onSubmit={handleSendReaction} className="flex gap-2">
          <input
            type="text"
            placeholder={`Reply to @${activeStory.user}...`}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition"
          />
          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-500 p-2.5 rounded-2xl text-white transition flex items-center justify-center shadow-lg shadow-pink-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function StoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Story...</div>}>
      <StoryContent />
    </Suspense>
  );
}