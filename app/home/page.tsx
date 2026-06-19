"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAppState, Post } from "@/lib/state";
import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";
import { 
  Search, 
  MessageSquare, 
  Bell, 
  Heart, 
  MessageCircle, 
  Share2, 
  Sparkles, 
  Plus, 
  CheckCircle, 
  TrendingUp, 
  Eye, 
  Send,
  Menu,
  SkipForward
} from "lucide-react";

// Stateful Custom Video Player with Mid-Roll Skippable Ad triggers
function FeedVideoPlayer({ post }: { post: Post }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [adOverlay, setAdOverlay] = useState<{ active: boolean; title: string; countdown: number } | null>(null);
  const [triggeredTimes, setTriggeredTimes] = useState<number[]>([]);

  const isMovie = post.type === "movie";

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const currentTime = video.currentTime;
    const duration = video.duration || 600; // fallback to 10 mins

    if (isMovie) {
      // Movie trigger point: every 10 minutes of playback (600s)
      const tenMinBlock = Math.floor(currentTime / 600);
      if (tenMinBlock > 0 && !triggeredTimes.includes(tenMinBlock)) {
        setTriggeredTimes([...triggeredTimes, tenMinBlock]);
        triggerMidRollAd(video, `Minute ${tenMinBlock * 10} Ad Break`);
      }
    } else {
      // 10-Minute Video triggers: strategic points at 1/3 and 2/3 of duration
      const oneThird = duration / 3;
      const twoThirds = (duration * 2) / 3;

      if (currentTime >= oneThird && !triggeredTimes.includes(1)) {
        setTriggeredTimes([...triggeredTimes, 1]);
        triggerMidRollAd(video, "Video Mid-Roll Ad (Break 1/2)");
      } else if (currentTime >= twoThirds && !triggeredTimes.includes(2)) {
        setTriggeredTimes([...triggeredTimes, 2]);
        triggerMidRollAd(video, "Video Mid-Roll Ad (Break 2/2)");
      }
    }
  };

  const triggerMidRollAd = (video: HTMLVideoElement, title: string) => {
    video.pause();
    setAdOverlay({
      active: true,
      title,
      countdown: 5 // skippable after 5 seconds
    });
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (adOverlay && adOverlay.active && adOverlay.countdown > 0) {
      timer = setTimeout(() => {
        setAdOverlay({
          ...adOverlay,
          countdown: adOverlay.countdown - 1
        });
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [adOverlay]);

  const handleSkipAd = () => {
    setAdOverlay(null);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src={post.mediaUrl}
        controls
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-full object-contain"
        poster="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600"
      />

      {/* Skippable Mid-Roll Ad Overlay */}
      {adOverlay && adOverlay.active && (
        <div className="absolute inset-0 z-30 bg-[#FFF5F7] flex flex-col items-center justify-center p-6 text-center text-[#000000]">
          <Sparkles className="w-8 h-8 text-pink-600 mb-2 animate-spin" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-pink-600">{adOverlay.title}</h4>
          <p className="text-[10px] text-pink-900 mt-1 leading-normal font-medium">
            Cola Brand sponsored break. 75% creator ad split credited.
          </p>
          
          <div className="mt-4">
            {adOverlay.countdown > 0 ? (
              <span className="text-[10px] font-bold text-gray-500">
                You can skip in {adOverlay.countdown}s
              </span>
            ) : (
              <button
                onClick={handleSkipAd}
                className="bg-black hover:bg-black/90 text-white text-[10px] font-bold px-4 py-1.5 rounded-xl transition flex items-center gap-1.5"
              >
                <span>Skip Ad</span>
                <SkipForward className="w-3 h-3 text-pink-500" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const { state, t, likePost, commentPost, viewPost, toggleFollow } = useAppState();
  const [activeTab, setActiveTab] = useState<"home" | "following" | "trending">("home");
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [openComments, setOpenComments] = useState<{ [postId: string]: boolean }>({});
  const [showAdNotice, setShowAdNotice] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Auto-view posts that are visible
  useEffect(() => {
    if (state.posts.length > 0) {
      state.posts.forEach(post => {
        viewPost(post.id);
      });
    }
  }, []);

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    commentPost(postId, text);
    setCommentInputs({ ...commentInputs, [postId]: "" });
  };

  // Filter posts based on tab
  const getFilteredPosts = () => {
    const activePosts = state.posts.filter(p => p.status === "active" && p.type !== "story");
    if (activeTab === "following") {
      return activePosts.filter(p => state.user?.following.includes(p.user) || p.user === state.user?.username);
    }
    if (activeTab === "trending") {
      return [...activePosts].sort((a, b) => (b.isBoosted ? 1 : 0) - (a.isBoosted ? 1 : 0) || b.views - a.views);
    }
    return activePosts;
  };

  const filteredPosts = getFilteredPosts();
  const unreadChats = state.chats.reduce((acc, c) => acc + c.messages.filter(m => m.sender === "other" && m.status !== "read").length, 0);

  // Construct combined feed items
  // Inject exactly 1 Graphical/Display Ad after every 5 continuous Photos scrolled.
  const displayedFeedItems: Array<{ 
    isAd: boolean; 
    data?: Post | { title: string; description: string; sponsorUrl: string }; 
    adId?: string; 
  }> = [];
  let continuousPhotoCount = 0;

  filteredPosts.forEach((post) => {
    displayedFeedItems.push({ isAd: false, data: post });
    
    if (post.type === "photo") {
      continuousPhotoCount++;
      if (continuousPhotoCount % 5 === 0) {
        displayedFeedItems.push({
          isAd: true,
          adId: `photo-ad-${post.id}`,
          data: {
            title: "Cola Brand Diwali Splash",
            description: "Celebrate with carbonated fizz and grab up to 30% discounts! 🥤",
            sponsorUrl: "www.cola-diwali-splash.com"
          }
        });
      }
    }
  });

  return (
    <div className="bg-[#FFF5F7] text-[#000000] min-h-screen pb-24 relative overflow-hidden font-sans">
      
      {/* Sidebar Drawer Menu */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Header - Styled in light theme */}
      <header className="sticky top-0 z-50 bg-[#FFF5F7]/90 backdrop-blur-md border-b border-pink-200 px-4 py-3 flex justify-between items-center max-w-md mx-auto">
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="text-pink-600 hover:text-black p-1 hover:bg-pink-100 rounded-xl transition mr-1.5"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-2xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            {t("appName")}
          </span>
          {state.user?.isVerified && (
            <CheckCircle className="w-4 h-4 text-pink-500 fill-pink-500/20" />
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/search" className="text-pink-600 hover:text-black transition relative">
            <Search className="w-5 h-5" />
          </Link>
          <Link href="/chat" className="text-pink-600 hover:text-black transition relative">
            <MessageSquare className="w-5 h-5" />
            {unreadChats > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white animate-pulse">
                {unreadChats}
              </span>
            )}
          </Link>
          <Link href="/notifications" className="text-pink-600 hover:text-black transition relative">
            <Bell className="w-5 h-5" />
            {state.notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
                {state.notifications.filter(n => !n.read).length}
              </span>
            )}
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 mt-2">
        {/* Stories list */}
        <section className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-pink-850 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              {t("story")}
            </h2>
            <Link href="/story" className="text-xs text-pink-600 font-semibold hover:underline">
              View All
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {/* Create Story Button */}
            <div className="flex flex-col items-center flex-shrink-0">
              <Link href="/upload" className="relative">
                <div className="w-14 h-14 rounded-full border border-dashed border-pink-300 flex items-center justify-center bg-white hover:bg-pink-50 transition">
                  <Plus className="w-5 h-5 text-pink-600" />
                </div>
                <span className="absolute bottom-0 right-0 bg-pink-600 rounded-full p-0.5 border border-white">
                  <Plus className="w-3 h-3 text-white" />
                </span>
              </Link>
              <span className="text-[10px] text-pink-800 mt-1 font-semibold">Add Story</span>
            </div>

            {/* Stories */}
            {state.posts.filter(p => p.type === "story" && p.status === "active").map((story) => (
              <Link key={story.id} href={`/story?id=${story.id}`} className="flex flex-col items-center flex-shrink-0">
                <div className="p-[2px] rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500">
                  <img
                    src={story.userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150"}
                    alt={story.user}
                    className="w-12 h-12 rounded-full border-2 border-[#FFF5F7] object-cover"
                  />
                </div>
                <span className="text-[10px] text-[#000000] mt-1 font-semibold truncate w-14 text-center">
                  {story.user}
                </span>
              </Link>
            ))}

            {/* Mock stories if none exist */}
            {state.posts.filter(p => p.type === "story" && p.status === "active").length === 0 && (
              <>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="p-[2px] rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150" className="w-12 h-12 rounded-full border-2 border-white object-cover" />
                  </div>
                  <span className="text-[10px] text-black mt-1 font-semibold">sneha_s</span>
                </div>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="p-[2px] rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500">
                    <img src="https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=150" className="w-12 h-12 rounded-full border-2 border-white object-cover" />
                  </div>
                  <span className="text-[10px] text-black mt-1 font-semibold">rohit_roy</span>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Tabs */}
        <section className="flex border-b border-pink-200 mb-4 bg-white rounded-2xl p-1 shadow-xs">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "home"
                ? "bg-pink-600 text-white shadow-sm shadow-pink-200"
                : "text-pink-900 hover:text-black"
            }`}
          >
            {t("home")}
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "following"
                ? "bg-pink-600 text-white shadow-sm shadow-pink-200"
                : "text-pink-900 hover:text-black"
            }`}
          >
            {t("following")}
          </button>
          <button
            onClick={() => setActiveTab("trending")}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all flex justify-center items-center gap-1.5 cursor-pointer ${
              activeTab === "trending"
                ? "bg-pink-600 text-white shadow-sm shadow-pink-200"
                : "text-pink-900 hover:text-black"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Trending
          </button>
        </section>

        {/* Anti-Fraud Banner Notice */}
        {showAdNotice && (
          <div className="bg-white border border-pink-200 rounded-2xl p-4 mb-4 relative overflow-hidden shadow-xs">
            <h3 className="text-xs font-bold text-pink-600 flex items-center gap-1 mb-1">
              🛡️ Anti-Fraud Analytics Active
            </h3>
            <p className="text-[10px] text-[#000000]/80 leading-normal font-medium">
              Creator own-views are filtered automatically. Ads use 3-hour Same User & Device cooldown protection.
            </p>
            <button 
              onClick={() => setShowAdNotice(false)} 
              className="absolute top-2 right-2 text-pink-600 hover:text-black text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Post Feed */}
        <section className="space-y-5">
          {displayedFeedItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-pink-200 shadow-sm">
              <p className="text-pink-900 text-sm font-semibold">No posts found in this feed.</p>
              <Link href="/upload" className="text-pink-600 font-bold text-xs mt-2 inline-block hover:underline">
                Upload your first content!
              </Link>
            </div>
          ) : (
            displayedFeedItems.map((item, idx) => {
              if (item.isAd) {
                // RENDER IN-FEED NATIVE GRAPHICAL DISPLAY AD
                const ad = item.data as { title: string; description: string; sponsorUrl: string };
                return (
                  <article key={item.adId} className="bg-white border border-pink-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="bg-pink-100 text-pink-600 text-[9px] font-bold tracking-widest px-2 py-0.5 rounded border border-pink-200 uppercase">
                        Sponsored Ad
                      </span>
                      <span className="text-[9px] text-[#000000]/60 font-semibold">Auto-refresh 30s</span>
                    </div>
                    <div className="bg-[#FFF5F7] rounded-xl p-3 border border-pink-100 flex gap-3 items-center">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-sm text-white">
                        Promo
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-black">{ad.title}</h4>
                        <p className="text-[10px] text-pink-900 mt-0.5 leading-normal font-semibold">
                          {ad.description}
                        </p>
                      </div>
                      <button 
                        onClick={() => alert(`Redirecting to Sponsor: ${ad.sponsorUrl}`)}
                        className="bg-black hover:bg-black/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl transition"
                      >
                        Visit
                      </button>
                    </div>
                  </article>
                );
              }

              const post = item.data as Post;
              const isLiked = post.likes.includes(state.user?.username || "");
              const displayComments = openComments[post.id];

              return (
                <article key={post.id} className="bg-white border border-pink-200 rounded-2xl overflow-hidden shadow-sm transition hover:border-pink-300">
                  {/* User profile header */}
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={post.userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150"}
                        alt={post.user}
                        className="w-9 h-9 rounded-full object-cover border border-pink-200"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-xs text-black hover:underline cursor-pointer">
                            {post.user}
                          </span>
                          {post.user === "premrog_official" && (
                            <CheckCircle className="w-3.5 h-3.5 text-pink-500 fill-pink-500/20" />
                          )}
                        </div>
                        <span className="text-[9px] text-[#000000]/70 font-semibold uppercase tracking-wider">
                          {post.type} • {post.expiresAt ? "Expires in 28d" : ""}
                        </span>
                      </div>
                    </div>

                    {post.user !== state.user?.username && (
                      <button
                        onClick={() => toggleFollow(post.user)}
                        className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                          state.user?.following.includes(post.user)
                            ? "border-pink-200 text-pink-800"
                            : "border-pink-500 text-pink-600 bg-pink-50 hover:bg-pink-100"
                        }`}
                      >
                        {state.user?.following.includes(post.user) ? t("following") : t("follow")}
                      </button>
                    )}
                  </div>

                  {/* Media content player */}
                  <div className="relative aspect-video w-full bg-[#FFF5F7] flex items-center justify-center overflow-hidden border-y border-pink-100">
                    {post.type === "photo" ? (
                      <img
                        src={post.mediaUrl}
                        alt="Post Media"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FeedVideoPlayer post={post} />
                    )}

                    {/* Boost Tag */}
                    {post.isBoosted && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-600 text-[8px] font-bold uppercase tracking-widest text-white px-2 py-0.5 rounded-md shadow-md shadow-pink-500/20 z-10">
                        ⚡ {post.boostType} Boosted
                      </span>
                    )}

                    {/* Video duration badge */}
                    {post.duration && post.type === "photo" && (
                      <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        {post.duration}
                      </span>
                    )}
                  </div>

                  {/* Description and Interactions */}
                  <div className="p-4">
                    <p className="text-xs text-black leading-relaxed">
                      <span className="font-bold text-black mr-1.5">{post.user}</span>
                      {post.caption}
                    </p>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-pink-100">
                      <div className="flex items-center gap-4">
                        {/* Like Button */}
                        <button
                          onClick={() => likePost(post.id)}
                          className={`flex items-center gap-1 text-xs transition cursor-pointer ${
                            isLiked ? "text-pink-600 drop-shadow-xs" : "text-[#000000]/60 hover:text-black"
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? "fill-pink-500 text-pink-500" : "text-[#000000]/65"}`} />
                          <span className="text-[10px] font-bold">{post.likes.length}</span>
                        </button>

                        {/* Comment trigger */}
                        <button
                          onClick={() => setOpenComments({ ...openComments, [post.id]: !displayComments })}
                          className="flex items-center gap-1 text-xs text-[#000000]/60 hover:text-black transition cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4 text-[#000000]/65" />
                          <span className="text-[10px] font-bold">{post.comments.length}</span>
                        </button>

                        {/* Share button */}
                        <button
                          onClick={() => alert("Copied post link to clipboard!")}
                          className="flex items-center gap-1 text-xs text-[#000000]/60 hover:text-black transition cursor-pointer"
                        >
                          <Share2 className="w-4 h-4 text-[#000000]/65" />
                        </button>
                      </div>

                      {/* Views count */}
                      <div className="flex items-center gap-1 text-pink-850 text-[10px] font-semibold">
                        <Eye className="w-3.5 h-3.5 text-pink-600" />
                        <span>{post.views} views</span>
                      </div>
                    </div>

                    {/* Comments Drawer */}
                    {displayComments && (
                      <div className="mt-4 pt-3 border-t border-pink-100 space-y-3">
                        <div className="max-h-36 overflow-y-auto space-y-2.5 pr-1">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="text-[11px] leading-snug">
                              <span className="font-bold text-[#000000] mr-1">@{comment.user}:</span>
                              <span className="text-[#000000]/70 font-semibold">{comment.text}</span>
                            </div>
                          ))}
                          {post.comments.length === 0 && (
                            <p className="text-[10px] text-pink-800 text-center py-2 font-medium">No comments yet. Be the first!</p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentInputs[post.id] || ""}
                            onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                            onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit(post.id)}
                            className="flex-1 bg-[#FFF5F7] border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-black placeholder-pink-400 focus:outline-none focus:border-pink-500"
                          />
                          <button
                            onClick={() => handleCommentSubmit(post.id)}
                            className="bg-black hover:bg-black/90 px-3 py-1.5 rounded-xl text-white transition flex items-center justify-center"
                          >
                            <Send className="w-3 h-3 text-pink-500" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}