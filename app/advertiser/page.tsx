"use client";

import React, { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useAppState } from "@/lib/state";
import { 
  Megaphone, 
  Target, 
  TrendingUp, 
  BarChart2, 
  DollarSign, 
  Layers, 
  Languages, 
  CheckCircle,
  PlusCircle,
  Sparkles
} from "lucide-react";

export default function AdvertiserDashboardPage() {
  const { state, createCampaign } = useAppState();

  const [name, setName] = useState("");
  const [type, setType] = useState("Feed Ads");
  const [budget, setBudget] = useState("");
  const [country, setCountry] = useState("India");
  const [language, setLanguage] = useState("All");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const isIndia = state.user?.country === "India";
  const currencySymbol = isIndia ? "₹" : "$";

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    const budgetVal = parseFloat(budget);
    if (isNaN(budgetVal) || budgetVal <= 0) {
      alert("Please enter a valid budget.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      createCampaign(name, type, budgetVal, country, language);
      setSuccess("Campaign created! Awaiting Super Admin activation.");
      setName("");
      setBudget("");
    }, 1200);
  };

  return (
    <div className="bg-black text-white min-h-screen pb-24 font-sans relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />

      <main className="max-w-md mx-auto px-4 pt-4">
        <h1 className="text-xl font-black mb-6 tracking-wide bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
          ADVERTISING HUB
        </h1>

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-2xl p-4 mb-4 text-center font-bold">
            {success}
          </div>
        )}

        {/* 1. Campaign Creator Form */}
        <section className="bg-white/5 border border-white/10 p-5 rounded-3xl mb-6 backdrop-blur-md">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-4">
            <PlusCircle className="w-4.5 h-4.5 text-pink-500" />
            Launch Ad Campaign
          </h3>

          <form onSubmit={handleCreateCampaign} className="space-y-4">
            {/* Campaign Name */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Campaign Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Cola Brand Diwali Splash"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* Ad format selection */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Ad Format
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="Feed Ads">Feed Ads</option>
                  <option value="Story Ads">Story Ads</option>
                  <option value="Reel Ads">Reel Ads</option>
                  <option value="Video Ads">Video Ads</option>
                  <option value="Movie Ads">Movie Ads</option>
                  <option value="Chat Ads">Chat Ads</option>
                  <option value="Audio Call Ads">Audio Call Ads</option>
                  <option value="Video Call Ads">Video Call Ads</option>
                  <option value="Reward Ads">Reward Ads</option>
                  <option value="Banner Ads">Banner Ads</option>
                </select>
              </div>

              {/* Budget input */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Total Budget
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-xs text-gray-500">
                    {currencySymbol}
                  </div>
                  <input
                    type="number"
                    required
                    placeholder="1000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-6 pr-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Target demographics */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Country Target
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="India">India</option>
                  <option value="Global">Global</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Language Target
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="All">All Languages</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded-xl text-xs transition"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                "Deploy Campaign Draft"
              )}
            </button>
          </form>
        </section>

        {/* 2. Active Campaigns CTR Analytics */}
        <section className="bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-md">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-4">
            <BarChart2 className="w-4.5 h-4.5 text-pink-500" />
            Campaign Performance
          </h3>

          <div className="space-y-4">
            {state.campaigns.map((camp) => {
              const ctr = camp.impressions > 0 ? ((camp.clicks / camp.impressions) * 100).toFixed(1) : "0.0";
              const progressPct = camp.budget > 0 ? (camp.spent / camp.budget) * 100 : 0;

              return (
                <div key={camp.id} className="bg-black/40 border border-white/5 p-4 rounded-2xl space-y-3.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-xs">{camp.name}</h4>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5 block">
                        {camp.type} • Target: {camp.country}
                      </span>
                    </div>

                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded uppercase ${
                      camp.status === "active"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : camp.status === "pending"
                        ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 animate-pulse"
                        : "bg-gray-500/10 text-gray-400 border border-white/10"
                    }`}>
                      {camp.status}
                    </span>
                  </div>

                  {camp.status === "active" && (
                    <>
                      {/* Metric widgets */}
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                        <div className="bg-white/5 p-2 rounded-xl">
                          <span className="text-gray-500 block">Impressions</span>
                          <span className="font-bold text-white mt-0.5 block">{camp.impressions}</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded-xl">
                          <span className="text-gray-500 block">Clicks</span>
                          <span className="font-bold text-white mt-0.5 block">{camp.clicks}</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded-xl">
                          <span className="text-gray-500 block">CTR</span>
                          <span className="font-bold text-pink-500 mt-0.5 block">{ctr}%</span>
                        </div>
                      </div>

                      {/* Budget consumption progress bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] text-gray-400">
                          <span>Spent: {currencySymbol}{camp.spent}</span>
                          <span>Budget: {currencySymbol}{camp.budget}</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-pink-500 transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
