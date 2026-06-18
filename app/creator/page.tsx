"use client";

import React, { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useAppState } from "@/lib/state";
import { 
  Users, 
  Eye, 
  TrendingUp, 
  DollarSign, 
  ShieldAlert, 
  Award, 
  Zap, 
  CheckCircle, 
  History,
  Trash2,
  RefreshCw,
  Sliders,
  DollarSign as MoneyIcon
} from "lucide-react";

export default function CreatorDashboardPage() {
  const { state, toggleAutoRenew, boostPost, deletePost, t } = useAppState();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [boostType, setBoostType] = useState<"basic" | "standard" | "premium" | "global">("basic");

  const isIndia = state.user?.country === "India";
  const currencySymbol = isIndia ? "₹" : "$";

  // Calculate Creator Stats from state.posts
  const creatorPosts = state.posts.filter(p => p.user === state.user?.username);
  const totalViews = creatorPosts.reduce((acc, p) => acc + p.views, 0);
  const totalLikes = creatorPosts.reduce((acc, p) => acc + p.likes.length, 0);
  const totalShares = totalViews * 0.08; // simulate share factor

  // Ad revenue formula: 75% Creator split
  // Views * ₹0.40 gross revenue per view * 75%
  const grossRevenue = totalViews * 0.40;
  const creatorAdShare = grossRevenue * state.systemSettings.revenueShare;

  const handleBoost = (postId: string) => {
    const res = boostPost(postId, boostType);
    alert(res.message);
    setSelectedPostId(null);
  };

  const myWithdrawals = state.withdrawals.filter(w => w.user === state.user?.username);

  return (
    <div className="bg-black text-white min-h-screen pb-24 font-sans relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-pink-900/10 rounded-full blur-[100px] pointer-events-none" />

      <main className="max-w-md mx-auto px-4 pt-4">
        <h1 className="text-xl font-black mb-6 tracking-wide bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          CREATOR CONSOLE
        </h1>

        {/* 1. Creator Stats Grid */}
        <section className="grid grid-cols-2 gap-3.5 mb-5">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            <div className="flex justify-between items-center text-gray-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Followers</span>
              <Users className="w-4 h-4 text-pink-500" />
            </div>
            <h2 className="text-2xl font-black">{state.user?.followers.length || 0}</h2>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            <div className="flex justify-between items-center text-gray-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Views</span>
              <Eye className="w-4 h-4 text-pink-500" />
            </div>
            <h2 className="text-2xl font-black">{totalViews}</h2>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            <div className="flex justify-between items-center text-gray-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Likes & Shares</span>
              <TrendingUp className="w-4 h-4 text-pink-500" />
            </div>
            <h2 className="text-xl font-black">{totalLikes} • {Math.round(totalShares)}</h2>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            <div className="flex justify-between items-center text-gray-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Est. Earnings</span>
              <DollarSign className="w-4 h-4 text-pink-500" />
            </div>
            <h2 className="text-xl font-black text-green-400">
              {currencySymbol}{creatorAdShare.toFixed(2)}
            </h2>
          </div>
        </section>

        {/* 2. Fraud Prevention Analytics */}
        <section className="bg-gradient-to-br from-red-500/10 via-orange-500/5 to-black border border-red-500/20 p-5 rounded-3xl mb-5 backdrop-blur-md">
          <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5 mb-4">
            <ShieldAlert className="w-4.5 h-4.5 text-red-500 animate-pulse" />
            Anti-Fraud Filter Logs
          </h3>
          
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-black/40 border border-white/5 p-3 rounded-2xl">
              <span className="text-[9px] text-gray-500 block uppercase font-medium">Self Views</span>
              <span className="text-sm font-bold text-red-400 mt-1 block">
                {state.fraudLogs.selfViewsCount}
              </span>
            </div>
            <div className="bg-black/40 border border-white/5 p-3 rounded-2xl">
              <span className="text-[9px] text-gray-500 block uppercase font-medium">Invalid Ads</span>
              <span className="text-sm font-bold text-red-400 mt-1 block">
                {state.fraudLogs.invalidImpressionsCount}
              </span>
            </div>
            <div className="bg-black/40 border border-white/5 p-3 rounded-2xl">
              <span className="text-[9px] text-gray-500 block uppercase font-medium">Duplicate IPs</span>
              <span className="text-sm font-bold text-red-400 mt-1 block">
                {state.fraudLogs.duplicateIPCount}
              </span>
            </div>
          </div>
          <p className="text-[9px] text-gray-500 mt-3 text-center">
            Ad counts cooling are locked to 3 hours per user session to protect advertisers.
          </p>
        </section>

        {/* 3. Managed Content Listing */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-5 backdrop-blur-md">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
            <Sliders className="w-4.5 h-4.5 text-pink-500" />
            Manage Content ({creatorPosts.length})
          </h3>

          <div className="space-y-4">
            {creatorPosts.map((post) => (
              <div key={post.id} className="bg-black/40 border border-white/5 p-3.5 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold truncate max-w-[150px]">{post.caption}</h4>
                    <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wide mt-0.5 block">
                      {post.type} • {post.views} views
                    </span>
                  </div>
                  
                  {/* Delete button */}
                  <button 
                    onClick={() => {
                      if(confirm("Confirm delete post?")) deletePost(post.id);
                    }}
                    className="text-red-500 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-xl transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Auto Renew & Boost parameters */}
                <div className="flex justify-between items-center text-[10px] pt-2 border-t border-white/5">
                  <button
                    onClick={() => toggleAutoRenew(post.id)}
                    className={`font-bold px-3 py-1.5 rounded-xl border transition flex items-center gap-1 ${
                      post.autoRenew
                        ? "border-pink-500/30 text-pink-500 bg-pink-500/5"
                        : "border-white/10 text-gray-400"
                    }`}
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Auto-Renew: {post.autoRenew ? "ON" : "OFF"}</span>
                  </button>

                  <button
                    onClick={() => setSelectedPostId(post.id)}
                    className="font-bold bg-pink-600 hover:bg-pink-500 text-white px-3 py-1.5 rounded-xl transition flex items-center gap-1"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Boost post</span>
                  </button>
                </div>
              </div>
            ))}
            {creatorPosts.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-4">No content uploaded by you yet.</p>
            )}
          </div>
        </section>

        {/* Boost modal trigger popover */}
        {selectedPostId && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-gray-950 border border-white/10 p-6 rounded-3xl max-w-sm w-full space-y-4">
              <h3 className="font-bold text-sm text-pink-500">⚡ SELECT BOOST PACKAGE</h3>
              <p className="text-[10px] text-gray-400">
                Boost content priority to reach global audiences on feeds. Charges Cash.
              </p>

              <select
                value={boostType}
                onChange={(e) => setBoostType(e.target.value as "basic" | "standard" | "premium" | "global")}
                className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-xs text-white"
              >
                <option value="basic">Basic (₹50 / $0.60)</option>
                <option value="standard">Standard (₹150 / $1.80)</option>
                <option value="premium">Premium (₹500 / $6.20)</option>
                <option value="global">Global VIP (₹1500 / $18.70)</option>
              </select>

              <div className="flex gap-2 justify-end pt-2">
                <button 
                  onClick={() => setSelectedPostId(null)}
                  className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleBoost(selectedPostId)}
                  className="bg-pink-600 hover:bg-pink-500 text-white px-5 py-2 rounded-xl text-xs font-bold"
                >
                  Purchase Boost
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. Withdrawal logs history */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-md">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-4">
            <History className="w-4.5 h-4.5 text-pink-500" />
            Payout History ({myWithdrawals.length})
          </h3>

          <div className="space-y-3">
            {myWithdrawals.map((w) => (
              <div key={w.id} className="bg-black/40 border border-white/5 p-3 rounded-2xl flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold block text-white">
                    {w.currency === "INR" ? `₹${w.amount}` : `$${w.amount}`}
                  </span>
                  <span className="text-[9px] text-gray-500 mt-0.5 block capitalize">
                    {w.method} • {w.timestamp}
                  </span>
                </div>
                
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                  w.status === "approved" 
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : w.status === "rejected"
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                }`}>
                  {w.status}
                </span>
              </div>
            ))}
            {myWithdrawals.length === 0 && (
              <p className="text-[10px] text-gray-500 text-center py-2">No previous payout history.</p>
            )}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}