"use client";

import React, { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useAppState, Post } from "@/lib/state";
import { 
  Heart, 
  MessageCircle, 
  Volume2, 
  VolumeX, 
  Play, 
  CheckCircle,
  Eye,
  SkipForward,
  Sparkles
} from "lucide-react";

export default function ReelsPage() {
  const { state, likePost, commentPost, toggleFollow } = useAppState();
  const [muted, setMuted] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState<string | null>(null);

  // Fetch all active reels
  const activeReels = state.posts.filter(p => p.type === "reel" && p.status === "active");

  // Construct combined Reels + Ad list
  // Exactly 1 Video Ad automatically served after every 5 sequential Reels (every 6th item is an ad)
  const combinedReelsList: Array<{ 
    isAd: boolean; 
    data: Post | { title: string; description: string; sponsorUrl: string; mediaUrl: string }; 
    adId?: string; 
  }> = [];
  let reelCounter = 0;
  
  activeReels.forEach((reel) => {
    combinedReelsList.push({ isAd: false, data: reel });
    reelCounter++;
    if (reelCounter % 5 === 0) {
      combinedReelsList.push({ 
        isAd: true, 
        adId: `reel-ad-${reelCounter}`,
        data: {
          title: "Cola Brand Diwali Splash",
          description: "Celebrate with carbonated fizz and grab up to 30% discounts! 🥤",
          sponsorUrl: "www.cola-diwali-splash.com",
          mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4"
        }
      });
    }
  });

  const togglePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;
    commentPost(postId, commentText);
    setCommentText("");
  };

  return (
    <div className="bg-[#FFF5F7] text-[#000000] min-h-screen pb-20 select-none font-sans relative">
      {/* Header overlay */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <h1 className="text-xl font-black tracking-widest text-black drop-shadow-xs">
          REELS
        </h1>
        <span className="bg-pink-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
          Live (₹1/Upload)
        </span>
      </div>

      <div className="max-w-md mx-auto h-[calc(100vh-80px)] overflow-y-scroll snap-y snap-mandatory scrollbar-none relative bg-black">
        {combinedReelsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 bg-[#FFF5F7]">
            <FilmIcon className="w-16 h-16 text-pink-600 mb-4 animate-bounce" />
            <h2 className="font-bold text-lg text-black">No Reels Uploaded Yet</h2>
            <p className="text-sm text-pink-900 mt-1">Upload a 1-minute reel for ₹1 in the Upload tab.</p>
          </div>
        ) : (
          combinedReelsList.map((item, index) => {
            if (item.isAd) {
              // RENDER FULL-SCREEN VERTICAL INTERSTITIAL VIDEO AD
              const ad = item.data as { title: string; description: string; sponsorUrl: string; mediaUrl: string };
              return (
                <div 
                  key={item.adId} 
                  className="h-full w-full snap-start relative flex flex-col justify-end pb-8 bg-gradient-to-b from-purple-950 to-indigo-950"
                  style={{ height: "calc(100vh - 80px)" }}
                >
                  <video
                    src={ad.mediaUrl}
                    loop
                    muted={muted}
                    autoPlay
                    className="absolute inset-0 z-0 w-full h-full object-cover opacity-60"
                  />

                  {/* Ad Header overlay */}
                  <div className="absolute top-6 left-4 right-4 z-10 flex justify-between items-center">
                    <span className="bg-pink-600 text-white text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-xl uppercase">
                      Sponsored Ad
                    </span>
                    <span className="text-[10px] text-white bg-black/40 px-2.5 py-1 rounded-xl font-bold">
                      75% Creator Ad Split Enabled
                    </span>
                  </div>

                  {/* Skip button simulation */}
                  <div className="absolute right-4 top-24 z-10">
                    <button 
                      onClick={() => alert("Ad dismissed. Scroll to resume Reels!")}
                      className="bg-black/60 text-white border border-white/20 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-black transition"
                    >
                      <span>Skip Ad</span>
                      <SkipForward className="w-3.5 h-3.5 text-pink-500" />
                    </button>
                  </div>

                  {/* Bottom details overlay */}
                  <div className="absolute left-4 bottom-12 right-20 z-10 text-white drop-shadow-md">
                    <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                      {ad.title} <Sparkles className="w-4 h-4 text-yellow-400" />
                    </h3>
                    <p className="text-xs text-gray-200 mt-1 leading-relaxed">
                      {ad.description}
                    </p>
                    <button 
                      onClick={() => alert(`Redirecting to: ${ad.sponsorUrl}`)}
                      className="mt-4 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-md shadow-pink-500/20"
                    >
                      Visit Sponsor Site
                    </button>
                  </div>
                </div>
              );
            }

            // RENDER STANDARD REEL CARD
            const reel = item.data as Post;
            if (!reel) return null;
            const isLiked = reel.likes.includes(state.user?.username || "");
            const isPlaying = playingId === reel.id;

            return (
              <div 
                key={reel.id} 
                className="h-full w-full snap-start relative flex flex-col justify-end pb-8 bg-black"
                style={{ height: "calc(100vh - 80px)" }}
              >
                {/* Video Player */}
                <div 
                  className="absolute inset-0 z-0 bg-gray-950 flex items-center justify-center cursor-pointer"
                  onClick={() => togglePlay(reel.id)}
                >
                  <video
                    src={reel.mediaUrl}
                    loop
                    muted={muted}
                    autoPlay={index === 0}
                    className="w-full h-full object-cover"
                  />
                  
                  {!isPlaying && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                      <div className="bg-black/50 p-4 rounded-full backdrop-blur-md">
                        <Play className="w-8 h-8 text-white fill-white" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Right actions overlay */}
                <div className="absolute right-4 bottom-24 z-10 flex flex-col gap-6 items-center">
                  {/* Creator Profile avatar */}
                  <div className="relative">
                    <img
                      src={reel.userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150"}
                      alt={reel.user}
                      className="w-11 h-11 rounded-full border-2 border-pink-500 object-cover"
                    />
                    {reel.user !== state.user?.username && (
                      <button 
                        onClick={() => toggleFollow(reel.user)}
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-pink-500 rounded-full w-4 h-4 flex items-center justify-center text-white font-bold text-xs"
                      >
                        {state.user?.following.includes(reel.user) ? "✓" : "+"}
                      </button>
                    )}
                  </div>

                  {/* Likes */}
                  <button 
                    onClick={() => likePost(reel.id)}
                    className="flex flex-col items-center text-white hover:scale-110 transition drop-shadow-md"
                  >
                    <Heart className={`w-7 h-7 ${isLiked ? "text-pink-500 fill-pink-500" : ""}`} />
                    <span className="text-xs font-bold mt-1">{reel.likes.length}</span>
                  </button>

                  {/* Comments */}
                  <button 
                    onClick={() => setShowComments(showComments === reel.id ? null : reel.id)}
                    className="flex flex-col items-center text-white hover:scale-110 transition drop-shadow-md"
                  >
                    <MessageCircle className="w-7 h-7" />
                    <span className="text-xs font-bold mt-1">{reel.comments.length}</span>
                  </button>

                  {/* Audio Mute toggle */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
                    className="bg-black/50 p-2.5 rounded-full backdrop-blur-md border border-white/10"
                  >
                    {muted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                  </button>

                  {/* Views counter */}
                  <div className="flex flex-col items-center text-gray-300 text-[10px] drop-shadow-md">
                    <Eye className="w-4 h-4" />
                    <span className="font-bold">{reel.views}</span>
                  </div>
                </div>

                {/* Bottom details overlay */}
                <div className="absolute left-4 bottom-8 right-20 z-10 drop-shadow-md">
                  <div className="flex items-center gap-1.5 mb-2">
                    <h3 className="font-bold text-sm text-white">@{reel.user}</h3>
                    {reel.user === "premrog_official" && <CheckCircle className="w-3.5 h-3.5 text-pink-500 fill-pink-500/20" />}
                  </div>
                  <p className="text-xs text-gray-200 line-clamp-2 leading-relaxed">
                    {reel.caption}
                  </p>
                </div>

                {/* Inline comment panel */}
                {showComments === reel.id && (
                  <div className="absolute bottom-0 left-0 right-0 z-30 bg-black/95 border-t border-pink-200/20 rounded-t-3xl p-4 max-h-[50%] flex flex-col">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-sm text-white">Comments ({reel.comments.length})</h4>
                      <button onClick={() => setShowComments(null)} className="text-gray-400 text-xs font-bold hover:text-white">✕</button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1 text-xs">
                      {reel.comments.map(c => (
                        <div key={c.id} className="bg-white/5 p-2 rounded-xl border border-white/5">
                          <span className="font-bold text-pink-500 block">@{c.user}</span>
                          <span className="text-gray-300 mt-0.5 block">{c.text}</span>
                        </div>
                      ))}
                      {reel.comments.length === 0 && (
                        <p className="text-center text-gray-500 py-4">No comments yet. Start the conversation!</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                      />
                      <button
                        onClick={() => handleAddComment(reel.id)}
                        className="bg-pink-600 hover:bg-pink-500 px-4 py-2 rounded-xl text-xs font-bold transition text-white"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <BottomNav />
    </div>
  );
}

// Simple fallback icon
function FilmIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9 15 6-3-6-3v6Z"
      />
    </svg>
  );
}