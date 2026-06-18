"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/state";
import BottomNav from "@/components/BottomNav";
import { 
  Search, 
  MessageSquare, 
  Bell, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Sparkles, 
  Plus, 
  CheckCircle, 
  TrendingUp, 
  Eye, 
  Send,
  Flag,
  Globe
} from "lucide-react";

export default function HomePage() {
  const { state, t, likePost, commentPost, viewPost, toggleFollow } = useAppState();
  const [activeTab, setActiveTab] = useState<"home" | "following" | "trending">("home");
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [openComments, setOpenComments] = useState<{ [postId: string]: boolean }>({});
  const [showAdNotice, setShowAdNotice] = useState(true);

  // Auto-view posts that are visible
  useEffect(() => {
    if (state.posts.length > 0) {
      state.posts.forEach(post => {
        // Mock view counts increment on load
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
      // Show boosted posts first or sort by views
      return [...activePosts].sort((a, b) => (b.isBoosted ? 1 : 0) - (a.isBoosted ? 1 : 0) || b.views - a.views);
    }
    return activePosts;
  };

  const filteredPosts = getFilteredPosts();
  const unreadChats = state.chats.reduce((acc, c) => acc + c.messages.filter(m => m.sender === "other" && m.status !== "read").length, 0);

  return (
    <div className="bg-black text-white min-h-screen pb-24 relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-1/4 w-[350px] h-[350px] bg-pink-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-4 py-3 flex justify-between items-center max-w-md mx-auto">
        <div className="flex items-center gap-1.5">
          <span className="text-2xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(236,72,153,0.3)]">
            {t("appName")}
          </span>
          {state.user?.isVerified && (
            <CheckCircle className="w-4 h-4 text-pink-500 fill-pink-500/20" />
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/search" className="text-gray-400 hover:text-white transition relative">
            <Search className="w-5 h-5" />
          </Link>
          <Link href="/chat" className="text-gray-400 hover:text-white transition relative">
            <MessageSquare className="w-5 h-5" />
            {unreadChats > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-black animate-pulse">
                {unreadChats}
              </span>
            )}
          </Link>
          <Link href="/notifications" className="text-gray-400 hover:text-white transition relative">
            <Bell className="w-5 h-5" />
            {state.notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-black">
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
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              {t("story")}
            </h2>
            <Link href="/story" className="text-xs text-pink-500 font-semibold hover:underline">
              View All
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {/* Create Story Button */}
            <div className="flex flex-col items-center flex-shrink-0">
              <Link href="/upload" className="relative">
                <div className="w-14 h-14 rounded-full border border-dashed border-gray-600 flex items-center justify-center bg-white/5 hover:bg-white/10 transition">
                  <Plus className="w-5 h-5 text-gray-400" />
                </div>
                <span className="absolute bottom-0 right-0 bg-pink-500 rounded-full p-0.5 border border-black">
                  <Plus className="w-3 h-3 text-white" />
                </span>
              </Link>
              <span className="text-[10px] text-gray-400 mt-1 font-medium">Add Story</span>
            </div>

            {/* Stories */}
            {state.posts.filter(p => p.type === "story" && p.status === "active").map((story) => (
              <Link key={story.id} href={`/story?id=${story.id}`} className="flex flex-col items-center flex-shrink-0">
                <div className="p-[2px] rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 animate-gradient-xy">
                  <img
                    src={story.userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150"}
                    alt={story.user}
                    className="w-12 h-12 rounded-full border-2 border-black object-cover"
                  />
                </div>
                <span className="text-[10px] text-gray-300 mt-1 font-semibold truncate w-14 text-center">
                  {story.user}
                </span>
              </Link>
            ))}

            {/* Mock stories if none exist */}
            {state.posts.filter(p => p.type === "story" && p.status === "active").length === 0 && (
              <>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="p-[2px] rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150" className="w-12 h-12 rounded-full border-2 border-black object-cover" />
                  </div>
                  <span className="text-[10px] text-gray-300 mt-1">sneha_s</span>
                </div>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="p-[2px] rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500">
                    <img src="https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=150" className="w-12 h-12 rounded-full border-2 border-black object-cover" />
                  </div>
                  <span className="text-[10px] text-gray-300 mt-1">rohit_roy</span>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Tabs */}
        <section className="flex border-b border-white/10 mb-4 bg-white/5 rounded-xl p-1 backdrop-blur-md">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${
              activeTab === "home"
                ? "bg-pink-600 text-white shadow-md shadow-pink-600/20"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {t("home")}
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${
              activeTab === "following"
                ? "bg-pink-600 text-white shadow-md shadow-pink-600/20"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {t("following")}
          </button>
          <button
            onClick={() => setActiveTab("trending")}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all flex justify-center items-center gap-1.5 ${
              activeTab === "trending"
                ? "bg-pink-600 text-white shadow-md shadow-pink-600/20"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Trending
          </button>
        </section>

        {/* Anti-Fraud Banner Notice */}
        {showAdNotice && (
          <div className="bg-gradient-to-r from-pink-900/40 to-indigo-900/40 border border-pink-500/20 rounded-2xl p-4 mb-4 relative overflow-hidden backdrop-blur-md">
            <h3 className="text-xs font-bold text-pink-400 flex items-center gap-1 mb-1">
              🛡️ Anti-Fraud Analytics Active
            </h3>
            <p className="text-[10px] text-gray-300 leading-normal">
              Creator own-views are filtered automatically. Ads use 3-hour Same User & Device cooldown protection.
            </p>
            <button 
              onClick={() => setShowAdNotice(false)} 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-300 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Post Feed */}
        <section className="space-y-5">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-gray-400 text-sm">No posts found in this feed.</p>
              <Link href="/upload" className="text-pink-500 font-semibold text-xs mt-2 inline-block hover:underline">
                Upload your first content!
              </Link>
            </div>
          ) : (
            filteredPosts.map((post, idx) => {
              const isLiked = post.likes.includes(state.user?.username || "");
              const displayComments = openComments[post.id];

              // Insert Advertisement Card after every 3rd post
              const showAd = (idx + 1) % 3 === 0;

              return (
                <React.Fragment key={post.id}>
                  {/* Post Card */}
                  <article className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md transition hover:border-white/20">
                    {/* User profile header */}
                    <div className="p-4 flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150"}
                          alt={post.user}
                          className="w-9 h-9 rounded-full object-cover border border-white/10"
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-xs text-white hover:underline cursor-pointer">
                              {post.user}
                            </span>
                            {post.user === "premrog_official" && (
                              <CheckCircle className="w-3 h-3 text-pink-500 fill-pink-500/20" />
                            )}
                          </div>
                          <span className="text-[9px] text-gray-400 font-medium uppercase tracking-wider">
                            {post.type} • {post.expiresAt ? "Expires in 28d" : ""}
                          </span>
                        </div>
                      </div>

                      {post.user !== state.user?.username && (
                        <button
                          onClick={() => toggleFollow(post.user)}
                          className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all ${
                            state.user?.following.includes(post.user)
                              ? "border-white/10 text-gray-400"
                              : "border-pink-500/40 text-pink-500 bg-pink-500/5 hover:bg-pink-500/10"
                          }`}
                        >
                          {state.user?.following.includes(post.user) ? t("following") : t("follow")}
                        </button>
                      )}
                    </div>

                    {/* Media content */}
                    <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden border-y border-white/5">
                      {post.type === "photo" ? (
                        <img
                          src={post.mediaUrl}
                          alt="Post Media"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={post.mediaUrl}
                          controls
                          className="w-full h-full object-contain"
                          poster="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600"
                        />
                      )}

                      {/* Boost Tag */}
                      {post.isBoosted && (
                        <span className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-600 text-[8px] font-bold uppercase tracking-widest text-white px-2 py-0.5 rounded-md shadow-md shadow-pink-500/20">
                          ⚡ {post.boostType} Boosted
                        </span>
                      )}

                      {/* Video duration badge */}
                      {post.duration && (
                        <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          {post.duration}
                        </span>
                      )}
                    </div>

                    {/* Description and Interactions */}
                    <div className="p-4">
                      <p className="text-xs text-gray-200 leading-relaxed">
                        <span className="font-bold text-white mr-1.5">{post.user}</span>
                        {post.caption}
                      </p>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-4">
                          {/* Like Button */}
                          <button
                            onClick={() => likePost(post.id)}
                            className={`flex items-center gap-1 text-xs transition ${
                              isLiked ? "text-pink-500 drop-shadow-[0_0_4px_rgba(244,63,94,0.4)]" : "text-gray-400 hover:text-white"
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${isLiked ? "fill-pink-500" : ""}`} />
                            <span className="text-[10px] font-semibold">{post.likes.length}</span>
                          </button>

                          {/* Comment trigger */}
                          <button
                            onClick={() => setOpenComments({ ...openComments, [post.id]: !displayComments })}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-[10px] font-semibold">{post.comments.length}</span>
                          </button>

                          {/* Share button */}
                          <button
                            onClick={() => alert("Copied post link to clipboard!")}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Views count */}
                        <div className="flex items-center gap-1 text-gray-500 text-[10px]">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{post.views} views</span>
                        </div>
                      </div>

                      {/* Comments Drawer */}
                      {displayComments && (
                        <div className="mt-4 pt-3 border-t border-white/5 space-y-3">
                          <div className="max-h-36 overflow-y-auto space-y-2.5 pr-1">
                            {post.comments.map((comment) => (
                              <div key={comment.id} className="text-[11px] leading-snug">
                                <span className="font-bold text-gray-300 mr-1">{comment.user}:</span>
                                <span className="text-gray-400">{comment.text}</span>
                              </div>
                            ))}
                            {post.comments.length === 0 && (
                              <p className="text-[10px] text-gray-500 text-center py-2">No comments yet. Be the first!</p>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              value={commentInputs[post.id] || ""}
                              onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                              onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit(post.id)}
                              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                            />
                            <button
                              onClick={() => handleCommentSubmit(post.id)}
                              className="bg-pink-600 hover:bg-pink-500 px-3 py-1.5 rounded-xl text-white transition flex items-center justify-center"
                            >
                              <Send className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </article>

                  {/* Inline Advertisement Card */}
                  {showAd && (
                    <article className="bg-white/5 border border-dashed border-pink-500/20 rounded-2xl p-4 backdrop-blur-md">
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="bg-pink-600/10 text-pink-500 text-[9px] font-bold tracking-widest px-2 py-0.5 rounded border border-pink-500/20 uppercase">
                          Sponsored Ad
                        </span>
                        <span className="text-[9px] text-gray-500">Auto-refresh 30s</span>
                      </div>
                      <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex gap-3 items-center">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-lg text-white">
                          Ad
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-white">Cola Brand Diwali Splash</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">
                            Celebrate with carbonated fizz and grab up to 30% discounts! 🥤
                          </p>
                        </div>
                        <button 
                          onClick={() => alert("Redirecting to Sponsor: www.cola-diwali-splash.com")}
                          className="bg-pink-600 hover:bg-pink-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl transition"
                        >
                          Visit
                        </button>
                      </div>
                    </article>
                  )}
                </React.Fragment>
              );
            })
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}