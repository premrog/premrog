"use client";

import React, { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useAppState } from "@/lib/state";
import { Search as SearchIcon, TrendingUp, CheckCircle, UserPlus, UserMinus, Sparkles } from "lucide-react";

export default function SearchPage() {
  const { state, toggleFollow, t } = useAppState();
  const [query, setQuery] = useState("");

  // Get matching users from chats, posts authors, or just follow listings
  const getMatchingCreators = () => {
    if (!query.trim()) return [];
    
    // Search usernames
    const allUsers = Array.from(new Set([
      "sneha_sharma", "rohit_roy", "amit_12", "creative_director", "premrog_official"
    ]));

    return allUsers.filter(u => u.toLowerCase().includes(query.toLowerCase()));
  };

  const matchingCreators = getMatchingCreators();

  const trendingTags = [
    { tag: "#PremrogCreators", views: "1.2M views" },
    { tag: "#ReelsDiwali", views: "850K views" },
    { tag: "#MonetizeMe", views: "450K views" },
    { tag: "#CoinEarners", views: "320K views" },
    { tag: "#WebRTCCalls", views: "210K views" }
  ];

  return (
    <div className="bg-black text-white min-h-screen pb-24 font-sans relative overflow-hidden">
      {/* Background radial overlay */}
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-purple-950/10 rounded-full blur-[100px] pointer-events-none" />

      <main className="max-w-md mx-auto px-4 pt-4">
        <h1 className="text-xl font-black mb-4 tracking-wide bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          EXPLORE & DISCOVER
        </h1>

        {/* Search bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <SearchIcon className="w-4 h-4 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search creators, keywords, tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition duration-300"
          />
        </div>

        {/* Search Results */}
        {query.trim() !== "" ? (
          <section className="mb-6 space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Search Results ({matchingCreators.length})
            </h3>
            {matchingCreators.map(username => {
              const isFollowing = state.user?.following.includes(username);
              return (
                <div key={username} className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center justify-between backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white uppercase">
                      {username[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs">@{username}</span>
                        {username === "premrog_official" && <CheckCircle className="w-3.5 h-3.5 text-pink-500 fill-pink-500/20" />}
                      </div>
                      <span className="text-[10px] text-gray-400 block mt-0.5">Premrog Verified Creator</span>
                    </div>
                  </div>

                  {state.user?.username !== username && (
                    <button
                      onClick={() => toggleFollow(username)}
                      className={`text-xs font-bold px-4 py-1.5 rounded-xl border flex items-center gap-1 transition ${
                        isFollowing
                          ? "border-white/10 text-gray-400"
                          : "border-pink-500 bg-pink-500/10 text-pink-500 hover:bg-pink-500/20"
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <UserMinus className="w-3.5 h-3.5" />
                          <span>{t("unfollow")}</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>{t("follow")}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
            {matchingCreators.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-4">No creators match your search query.</p>
            )}
          </section>
        ) : null}

        {/* Sponsored advertisement block */}
        <section className="bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-black border border-white/10 p-4 rounded-3xl mb-6 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 bg-pink-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-bl uppercase">
            Sponsored
          </div>
          <h4 className="text-xs font-black text-white flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            GLOBAL TECH WEBINAR
          </h4>
          <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
            Learn cloud architecture directly from industry experts. Watch a reward ad to unlock free coupon code!
          </p>
          <button 
            onClick={() => alert("Redirecting to Sponsor: www.globaltechwebinar.com")}
            className="mt-3 bg-pink-600 hover:bg-pink-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-xl transition shadow-md shadow-pink-600/20"
          >
            Register Now
          </button>
        </section>

        {/* Trending Tags list */}
        <section className="mb-6 bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-md">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-4">
            <TrendingUp className="w-4 h-4 text-pink-500" />
            TRENDING ON PREMROG
          </h3>
          <div className="space-y-4">
            {trendingTags.map((item, index) => (
              <div 
                key={item.tag} 
                onClick={() => setQuery(item.tag.slice(1))}
                className="flex justify-between items-center cursor-pointer group"
              >
                <div>
                  <span className="text-xs font-bold text-white group-hover:text-pink-400 transition">
                    {item.tag}
                  </span>
                  <span className="text-[10px] text-gray-500 block mt-0.5">
                    {item.views}
                  </span>
                </div>
                <span className="bg-white/5 border border-white/5 group-hover:border-pink-500/20 text-gray-400 text-xs px-2.5 py-1 rounded-xl transition">
                  #{index + 1}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Categories exploration grid */}
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Explore Categories
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {["🎬 Bollywood Reels", "🎧 Music Lounge", "🎮 Gaming Feeds", "🍛 Food Recipes"].map(cat => (
              <div 
                key={cat} 
                onClick={() => setQuery(cat.split(" ")[1])}
                className="bg-white/5 border border-white/10 p-3.5 rounded-2xl text-center text-xs font-bold hover:border-pink-500/30 transition cursor-pointer backdrop-blur-md"
              >
                {cat}
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}