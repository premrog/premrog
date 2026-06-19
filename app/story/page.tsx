"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppState, Post } from "@/lib/state";
import { ArrowLeft, Send, Sparkles, AlertCircle, SkipForward } from "lucide-react";

interface StoryAd {
  title: string;
  sponsor: string;
  description: string;
  sponsorUrl: string;
  mediaUrl: string;
}

function StoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state } = useAppState();
  
  const activeStories = state.posts.filter(p => p.type === "story" && p.status === "active");
  const targetId = searchParams.get("id");

  // Construct combined stories and ads list
  // Inject exactly 2 Interstitial Ads inside every block of 6 stories viewed (at index 2 and index 5)
  const combinedStoriesList: Array<{ 
    isAd: boolean; 
    data: Post | StoryAd; 
    adId?: string; 
  }> = [];
  let storyCounter = 0;

  activeStories.forEach((story) => {
    combinedStoriesList.push({ isAd: false, data: story });
    storyCounter++;
    
    // Check if we need to insert an ad
    // Story indices (excluding ads) are storyCounter.
    // If we want ads at indices 2 and 5 of the final list, that corresponds to after 2 stories and after 4 stories.
    // Let's do:
    // Index 0: Story 1
    // Index 1: Story 2
    // Index 2: Ad 1 (after 2 stories)
    // Index 3: Story 3
    // Index 4: Story 4
    // Index 5: Ad 2 (after 4 stories)
    // Index 6: Story 5
    // Index 7: Story 6
    // Index 8: Ad 3 (after 6 stories)
    if (storyCounter === 2) {
      combinedStoriesList.push({ 
        isAd: true, 
        adId: "story-ad-1", 
        data: { 
          title: "Global Tech Webinar Boost", 
          sponsor: "Cloudflare",
          description: "Learn Serverless SQL and edge scaling on Cloudflare! ⚡", 
          sponsorUrl: "www.tech-webinar.com",
          mediaUrl: ""
        } 
      });
    } else if (storyCounter === 4) {
      combinedStoriesList.push({ 
        isAd: true, 
        adId: "story-ad-2", 
        data: { 
          title: "Cola Brand Diwali Splash", 
          sponsor: "Cola Brand",
          description: "Get refreshing discounts on carbonated beverages! 🥤", 
          sponsorUrl: "www.cola-diwali-splash.com",
          mediaUrl: ""
        } 
      });
    } else if (storyCounter > 4 && (storyCounter - 4) % 2 === 0) {
      combinedStoriesList.push({ 
        isAd: true, 
        adId: `story-ad-${storyCounter}`, 
        data: { 
          title: "Premrog Sponsor Segment", 
          sponsor: "Premrog",
          description: "Connect organically and earn split revenues!", 
          sponsorUrl: "www.premrog.com",
          mediaUrl: ""
        } 
      });
    }
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState("");

  // Set initial story index based on URL param
  useEffect(() => {
    if (targetId && activeStories.length > 0) {
      const idx = combinedStoriesList.findIndex(s => !s.isAd && s.data && (s.data as Post).id === targetId);
      if (idx !== -1) {
        setActiveIndex(idx);
      }
    }
  }, [targetId, activeStories]);

  // Story progress timer (5 seconds for ads, 10 seconds for standard stories)
  useEffect(() => {
    if (combinedStoriesList.length === 0) return;
    
    const activeItem = combinedStoriesList[activeIndex];
    const duration = activeItem.isAd ? 50 : 100; // 5s for ads, 10s for stories (100ms intervals)
    
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Go to next story
          if (activeIndex < combinedStoriesList.length - 1) {
            setActiveIndex((prevIdx) => prevIdx + 1);
          } else {
            // End of stories, go home
            router.push("/home");
          }
          return 0;
        }
        return prev + 1;
      });
    }, duration);

    return () => clearInterval(interval);
  }, [activeIndex, combinedStoriesList, router]);

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else {
      router.push("/home");
    }
  };

  const handleNext = () => {
    if (activeIndex < combinedStoriesList.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      router.push("/home");
    }
  };

  const handleSendReaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const activeItem = combinedStoriesList[activeIndex];
    const itemData = activeItem.data as unknown as Post & StoryAd;
    if (activeItem.isAd) {
      alert(`Interacted with sponsor: ${itemData.title}`);
    } else {
      alert(`Reaction sent to @${itemData.user}: "${replyText}"`);
    }
    setReplyText("");
  };

  if (combinedStoriesList.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] text-[#000000] flex flex-col justify-center items-center p-6 text-center font-sans">
        <AlertCircle className="w-12 h-12 text-pink-600 mb-3 animate-pulse" />
        <h2 className="font-bold text-lg text-black">No Stories Active</h2>
        <p className="text-xs text-pink-900 mt-1 mb-5">There are no standard user stories in the active stack.</p>
        <Link 
          href="/upload"
          className="bg-black hover:bg-black/90 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-md"
        >
          Create Story
        </Link>
      </div>
    );
  }

  const activeItem = combinedStoriesList[activeIndex];
  const itemData = activeItem.data as unknown as Post & StoryAd;

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-[#000000] flex flex-col justify-between relative select-none font-sans">
      {/* Top progress indicators */}
      <div className="absolute top-3 left-4 right-4 z-20 flex gap-1.5">
        {combinedStoriesList.map((s, idx) => {
          let width = "0%";
          if (idx < activeIndex) width = "100%";
          if (idx === activeIndex) width = `${progress}%`;

          return (
            <div key={idx} className="flex-1 h-[3px] bg-black/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-pink-600 transition-all duration-100 ease-linear"
                style={{ width }}
              />
            </div>
          );
        })}
      </div>

      {/* Header overlay */}
      <div className="absolute top-6 left-4 right-4 z-20 flex justify-between items-center bg-white/90 border border-pink-200 p-2.5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2.5">
          <button onClick={() => router.push("/home")} className="text-black hover:text-pink-600 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          {activeItem.isAd ? (
            <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center font-bold text-xs text-white">
              Ad
            </div>
          ) : (
            <img 
              src={itemData.userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150"}
              alt={itemData.user}
              className="w-8 h-8 rounded-full border border-pink-500 object-cover"
            />
          )}

          <div>
            <h3 className="text-xs font-bold text-black">
              {activeItem.isAd ? itemData.title : `@${itemData.user}`}
            </h3>
            <span className="text-[8px] text-pink-850 font-bold uppercase tracking-wider">
              {activeItem.isAd ? "Sponsored Story" : "Story • 10s"}
            </span>
          </div>
        </div>

        <div className="bg-pink-100 border border-pink-200 px-2 py-0.5 rounded-lg text-[8px] font-bold text-pink-600 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-pink-600" />
          {activeItem.isAd ? "75% ad split active" : "Valid 24h"}
        </div>
      </div>

      {/* Interactive left/right tap areas */}
      <div className="absolute inset-y-20 left-0 right-0 z-10 flex">
        <div className="w-[30%] h-full cursor-w-resize" onClick={handlePrev} />
        <div className="w-[40%] h-full" onClick={() => alert("Story paused.")} />
        <div className="w-[30%] h-full cursor-e-resize" onClick={handleNext} />
      </div>

      {/* Image/Content Container */}
      <div className="flex-1 w-full bg-[#FFF5F7] flex items-center justify-center overflow-hidden relative">
        {activeItem.isAd ? (
          // Ad visual slide
          <div className="w-full h-full max-w-md bg-gradient-to-br from-pink-100 via-purple-50 to-white flex flex-col justify-center items-center px-8 text-center border-x border-pink-150">
            <Sparkles className="w-12 h-12 text-pink-600 mb-4 animate-spin" style={{ animationDuration: "12s" }} />
            <h4 className="text-base font-black text-black">{itemData.title}</h4>
            <p className="text-xs text-pink-900 mt-2 leading-relaxed max-w-xs">
              {itemData.description}
            </p>
            <button 
              onClick={() => alert(`Redirecting to sponsor: ${itemData.sponsorUrl}`)}
              className="mt-6 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md shadow-pink-200"
            >
              Learn More
            </button>
          </div>
        ) : (
          // Story visual slide
          <img
            src={itemData.mediaUrl}
            alt="Story Content"
            className="w-full h-full object-cover max-w-md"
          />
        )}
        
        {/* Caption Overlay */}
        {!activeItem.isAd && itemData.caption && (
          <div className="absolute bottom-24 left-6 right-6 z-20 bg-white/90 border border-pink-200 p-4 rounded-2xl text-center text-xs text-black leading-relaxed shadow-xs">
            {itemData.caption}
          </div>
        )}
      </div>

      {/* Bottom text response input */}
      <div className="p-4 bg-white border-t border-pink-250 z-20 max-w-md mx-auto w-full">
        <form onSubmit={handleSendReaction} className="flex gap-2">
          <input
            type="text"
            placeholder={activeItem.isAd ? "Interact with sponsor..." : `Reply to @${itemData.user}...`}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 bg-[#FFF5F7] border border-pink-200 rounded-2xl px-4 py-2.5 text-xs text-black placeholder-pink-400 focus:outline-none focus:border-pink-500 transition"
          />
          <button
            type="submit"
            className="bg-black hover:bg-black/90 p-2.5 rounded-2xl text-white transition flex items-center justify-center shadow-md"
          >
            <Send className="w-4 h-4 text-pink-500" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function StoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF5F7] text-black flex items-center justify-center">Loading Story...</div>}>
      <StoryContent />
    </Suspense>
  );
}