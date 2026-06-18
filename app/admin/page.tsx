"use client";

import React, { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useAppState } from "@/lib/state";
import { 
  ShieldCheck, 
  Users, 
  Wallet, 
  DollarSign, 
  Tv, 
  Settings, 
  Flag, 
  ShieldAlert, 
  CheckCircle, 
  Ban, 
  TrendingUp,
  Plus,
  Minus,
  Check,
  X,
  Lock
} from "lucide-react";

export default function SuperAdminDashboardPage() {
  const { 
    state, 
    approveWithdrawal, 
    rejectWithdrawal, 
    approveCampaign, 
    rejectCampaign,
    banUser,
    suspendUser,
    verifyUser,
    removeVerification,
    deletePost,
    restorePost,
    updateSystemSettings
  } = useAppState();

  const [activeSubTab, setActiveSubTab] = useState<"users" | "content" | "wallets" | "withdrawals" | "campaigns" | "settings">("users");

  // State for user moderation search
  const [userQuery, setUserQuery] = useState("");
  
  // State for manual wallet adjust
  const [walletUser, setWalletUser] = useState("RajeshKumar");
  const [adjustAmt, setAdjustAmt] = useState("");
  const [adjustType, setAdjustType] = useState<"Coins" | "Cash">("Coins");

  // State for system settings editing
  const [photoCost, setPhotoCost] = useState(state.systemSettings.uploadCharges.photo.toString());
  const [storyCost, setStoryCost] = useState(state.systemSettings.uploadCharges.story.toString());
  const [reelCost, setReelCost] = useState(state.systemSettings.uploadCharges.reel.toString());
  const [videoCost, setVideoCost] = useState(state.systemSettings.uploadCharges.video.toString());
  const [movieCost, setMovieCost] = useState(state.systemSettings.uploadCharges.movie.toString());

  const handleWalletAdjust = (action: "add" | "remove") => {
    const amt = parseFloat(adjustAmt);
    if (isNaN(amt) || amt <= 0) {
      alert("Invalid amount.");
      return;
    }

    const modifier = action === "add" ? amt : -amt;
    if (adjustType === "Coins") {
      state.coins += modifier;
    } else {
      state.cash += modifier;
    }
    // sync
    localStorage.setItem("premrog_state", JSON.stringify(state));
    alert(`Adjusted ${adjustType} for ${walletUser} by ${modifier >= 0 ? "+" : ""}${modifier}`);
    setAdjustAmt("");
  };

  const handleSaveSettings = () => {
    updateSystemSettings({
      uploadCharges: {
        photo: parseInt(photoCost),
        story: parseInt(storyCost),
        reel: parseInt(reelCost),
        video: parseInt(videoCost),
        movie: parseInt(movieCost)
      }
    });
    alert("Upload costs settings updated successfully!");
  };

  // Calculate platform financial metrics
  const totalViews = state.posts.reduce((acc, p) => acc + p.views, 0);
  const totalUploadRevenue = state.posts.length * 5; // average charge
  const totalAdRevenue = totalViews * 0.40;
  const platformAdCut = totalAdRevenue * 0.25;

  return (
    <div className="bg-black text-white min-h-screen pb-24 font-sans relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-[350px] h-[350px] bg-red-950/10 rounded-full blur-[100px] pointer-events-none" />

      <main className="max-w-md mx-auto px-4 pt-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-black tracking-wide bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            SUPER ADMIN CORE
          </h1>
          <span className="bg-red-600/20 border border-red-500/20 px-2 py-0.5 rounded text-[8px] font-bold text-red-400 flex items-center gap-1">
            <Lock className="w-3 h-3" /> Root access
          </span>
        </div>

        {/* 1. Global Financial Metrics Grid */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-4 mb-5 backdrop-blur-md">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3.5 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-red-500" />
            Revenue Summary Matrix
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-black/40 border border-white/5 p-3 rounded-2xl">
              <span className="text-gray-500 block text-[9px] uppercase font-bold">Upload Fees</span>
              <span className="font-bold text-white mt-0.5 block">₹{totalUploadRevenue}</span>
            </div>
            <div className="bg-black/40 border border-white/5 p-3 rounded-2xl">
              <span className="text-gray-500 block text-[9px] uppercase font-bold">Recharge Cut</span>
              <span className="font-bold text-white mt-0.5 block">₹{state.withdrawals.length * 150}</span>
            </div>
            <div className="bg-black/40 border border-white/5 p-3 rounded-2xl">
              <span className="text-gray-500 block text-[9px] uppercase font-bold">Platform Ad Share (25%)</span>
              <span className="font-bold text-green-400 mt-0.5 block">₹{platformAdCut.toFixed(2)}</span>
            </div>
            <div className="bg-black/40 border border-white/5 p-3 rounded-2xl">
              <span className="text-gray-500 block text-[9px] uppercase font-bold">Total Platform Gross</span>
              <span className="font-bold text-red-400 mt-0.5 block">₹{(totalUploadRevenue + platformAdCut).toFixed(2)}</span>
            </div>
          </div>
        </section>

        {/* Dashboard Navigation SubTabs */}
        <section className="flex overflow-x-auto gap-2 pb-3.5 border-b border-white/10 mb-5 scrollbar-none">
          {[
            { id: "users", name: "Users", icon: Users },
            { id: "content", name: "Content", icon: Tv },
            { id: "wallets", name: "Wallets", icon: Wallet },
            { id: "withdrawals", name: "Payouts", icon: DollarSign },
            { id: "campaigns", name: "Ad Campaign", icon: Flag },
            { id: "settings", name: "Rates", icon: Settings },
          ].map((tab) => {
            const isSelected = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as "users" | "content" | "wallets" | "withdrawals" | "campaigns" | "settings")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                  isSelected
                    ? "bg-red-600 text-white shadow-md shadow-red-600/25"
                    : "bg-white/5 border border-white/5 text-gray-400 hover:text-gray-200"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </section>

        {/* Content render sections */}
        <section className="min-h-[250px]">
          
          {/* SubTab 1: Users moderation */}
          {activeSubTab === "users" && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search user profile..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs focus:outline-none"
              />

              {state.user && (
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3.5">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold">@{state.user.username}</h4>
                      <span className="text-[9px] text-gray-500 mt-0.5 block">{state.user.email}</span>
                    </div>
                    
                    <div className="flex gap-1.5">
                      <span className={`text-[8px] font-bold px-2 py-0.5 rounded ${state.user.isSuspended ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                        {state.user.isSuspended ? "Suspended" : "Active"}
                      </span>
                      {state.user.isVerified && (
                        <span className="bg-pink-500/20 text-pink-400 text-[8px] font-bold px-2 py-0.5 rounded">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-wrap gap-2 text-[10px]">
                    <button
                      onClick={() => suspendUser(state.user!.username)}
                      className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold px-3 py-1.5 rounded-xl transition"
                    >
                      {state.user.isSuspended ? "Unsuspend" : "Suspend User"}
                    </button>
                    
                    <button
                      onClick={() => banUser(state.user!.username)}
                      className="bg-red-600 hover:bg-red-500 text-white font-bold px-3 py-1.5 rounded-xl transition"
                    >
                      Ban User
                    </button>

                    {state.user.isVerified ? (
                      <button
                        onClick={() => removeVerification(state.user!.username)}
                        className="bg-white/5 border border-white/10 text-gray-400 font-bold px-3 py-1.5 rounded-xl transition"
                      >
                        Remove Badge
                      </button>
                    ) : (
                      <button
                        onClick={() => verifyUser(state.user!.username)}
                        className="bg-pink-600 hover:bg-pink-500 text-white font-bold px-3 py-1.5 rounded-xl transition"
                      >
                        Grant Badge
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SubTab 2: Content deletion/restore */}
          {activeSubTab === "content" && (
            <div className="space-y-3">
              {state.posts.map((post) => (
                <div key={post.id} className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold truncate max-w-[160px]">{post.caption}</h4>
                    <span className="text-[9px] text-gray-500 mt-0.5 block capitalize">{post.type} • by @{post.user}</span>
                  </div>

                  {post.status === "active" ? (
                    <button
                      onClick={() => deletePost(post.id)}
                      className="bg-red-500/10 border border-red-500/20 text-red-400 font-bold px-3 py-1 rounded-xl hover:bg-red-500/20 transition"
                    >
                      Delete
                    </button>
                  ) : (
                    <button
                      onClick={() => restorePost(post.id)}
                      className="bg-green-500/10 border border-green-500/20 text-green-400 font-bold px-3 py-1 rounded-xl hover:bg-green-500/20 transition"
                    >
                      Restore
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* SubTab 3: Wallets additions/deductions */}
          {activeSubTab === "wallets" && (
            <div className="bg-white/5 border border-white/10 p-5 rounded-3xl space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Edit Wallet Balances</h3>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Target Username</label>
                <select
                  value={walletUser}
                  onChange={(e) => setWalletUser(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="RajeshKumar">RajeshKumar</option>
                  <option value="sneha_sharma">sneha_sharma</option>
                  <option value="rohit_roy">rohit_roy</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Balance Type</label>
                  <select
                    value={adjustType}
                    onChange={(e) => setAdjustType(e.target.value as "Coins" | "Cash")}
                    className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="Coins">Coins</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Adjust Value</label>
                  <input
                    type="number"
                    required
                    placeholder="100"
                    value={adjustAmt}
                    onChange={(e) => setAdjustAmt(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl p-2 text-xs text-white placeholder-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleWalletAdjust("add")}
                  className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-xl text-xs transition flex justify-center items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Credit
                </button>
                <button
                  type="button"
                  onClick={() => handleWalletAdjust("remove")}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-xl text-xs transition flex justify-center items-center gap-1"
                >
                  <Minus className="w-3.5 h-3.5" /> Debit
                </button>
              </div>
            </div>
          )}

          {/* SubTab 4: Withdrawals approvals */}
          {activeSubTab === "withdrawals" && (
            <div className="space-y-3">
              {state.withdrawals.filter(w => w.status === "pending").map((w) => (
                <div key={w.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">@{w.user} requested payout</h4>
                      <p className="text-[9px] text-gray-500 mt-0.5">{w.timestamp} • Method: {w.method}</p>
                    </div>
                    <span className="font-black text-green-400">
                      {w.currency === "INR" ? `₹${w.amount}` : `$${w.amount}`}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-mono bg-black/40 p-2 rounded-xl border border-white/5">
                    Payee details: {w.details}
                  </p>
                  
                  <div className="flex gap-2 justify-end text-[10px] pt-1">
                    <button
                      onClick={() => rejectWithdrawal(w.id)}
                      className="bg-red-500/10 border border-red-500/20 text-red-400 font-bold px-4 py-1.5 rounded-xl hover:bg-red-500/20 transition flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Reject
                    </button>
                    <button
                      onClick={() => approveWithdrawal(w.id)}
                      className="bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-1.5 rounded-xl transition flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Approve Payout
                    </button>
                  </div>
                </div>
              ))}
              {state.withdrawals.filter(w => w.status === "pending").length === 0 && (
                <p className="text-xs text-gray-500 text-center py-6">No pending payout requests.</p>
              )}
            </div>
          )}

          {/* SubTab 5: Campaigns activation */}
          {activeSubTab === "campaigns" && (
            <div className="space-y-3">
              {state.campaigns.filter(c => c.status === "pending").map((camp) => (
                <div key={camp.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{camp.name}</h4>
                      <span className="text-[9px] text-gray-500 mt-0.5 block">{camp.type} • Target: {camp.country}</span>
                    </div>
                    <span className="font-black text-pink-500">
                      ₹{camp.budget}
                    </span>
                  </div>

                  <div className="flex gap-2 justify-end text-[10px] pt-1">
                    <button
                      onClick={() => rejectCampaign(camp.id)}
                      className="bg-red-500/10 border border-red-500/20 text-red-400 font-bold px-4 py-1.5 rounded-xl transition"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => approveCampaign(camp.id)}
                      className="bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-1.5 rounded-xl transition"
                    >
                      Activate Ad
                    </button>
                  </div>
                </div>
              ))}
              {state.campaigns.filter(c => c.status === "pending").length === 0 && (
                <p className="text-xs text-gray-500 text-center py-6">No pending ad campaigns to approve.</p>
              )}
            </div>
          )}

          {/* SubTab 6: System rates settings */}
          {activeSubTab === "settings" && (
            <div className="bg-white/5 border border-white/10 p-5 rounded-3xl space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-pink-500" />
                Configure Upload Cost Rates
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Photo Cost (Coins)</label>
                  <input
                    type="number"
                    value={photoCost}
                    onChange={(e) => setPhotoCost(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Story Cost (Coins)</label>
                  <input
                    type="number"
                    value={storyCost}
                    onChange={(e) => setStoryCost(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Reel Cost (₹)</label>
                  <input
                    type="number"
                    value={reelCost}
                    onChange={(e) => setReelCost(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Video Cost (₹)</label>
                  <input
                    type="number"
                    value={videoCost}
                    onChange={(e) => setVideoCost(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Movie Cost (₹)</label>
                <input
                  type="number"
                  value={movieCost}
                  onChange={(e) => setMovieCost(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl p-2 text-white"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveSettings}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl text-xs transition mt-2"
              >
                Apply Cost Updates
              </button>
            </div>
          )}

        </section>
      </main>

      <BottomNav />
    </div>
  );
}
