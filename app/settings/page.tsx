"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { useAppState } from "@/lib/state";
import { 
  Settings, 
  Globe, 
  ShieldAlert, 
  HelpCircle, 
  FileText, 
  LogOut, 
  Sliders, 
  Coins, 
  DollarSign, 
  User,
  ChevronRight
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { state, updateProfile, toggleAutoRecharge, logout, t } = useAppState();

  const isIndia = state.user?.country === "India";
  const currencySymbol = isIndia ? "₹" : "$";

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!state.user) return;
    updateProfile({ language: e.target.value as "en" | "hi" });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!state.user) return;
    updateProfile({ country: e.target.value as "India" | "International" });
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!state.user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-6 text-center">
        <h2 className="text-xl font-bold">Please log in to view settings</h2>
        <Link href="/login" className="mt-4 bg-pink-600 px-6 py-2.5 rounded-xl font-bold">
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen pb-24 font-sans relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-pink-900/10 rounded-full blur-[100px] pointer-events-none" />

      <main className="max-w-md mx-auto px-4 pt-4">
        <h1 className="text-xl font-black mb-6 tracking-wide bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
          <Settings className="w-5.5 h-5.5 text-pink-500" />
          SYSTEM SETTINGS
        </h1>

        {/* 1. Account Preference section */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-5 backdrop-blur-md space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <User className="w-4 h-4 text-pink-500" />
            Account Preferences
          </h3>

          {/* Lang Selector */}
          <div className="flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-gray-200 block">App Language</span>
              <span className="text-[9px] text-gray-500 block mt-0.5">Select interface translation</span>
            </div>
            <div className="relative">
              <select
                value={state.user.language}
                onChange={handleLanguageChange}
                className="bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-pink-500 appearance-none pr-6"
              >
                <option value="en">English</option>
                <option value="hi">Hindi (हिंदी)</option>
              </select>
              <Globe className="w-3.5 h-3.5 text-gray-500 absolute right-2 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Country selector */}
          <div className="flex justify-between items-center text-xs pt-3 border-t border-white/5">
            <div>
              <span className="font-bold text-gray-200 block">Billing Country</span>
              <span className="text-[9px] text-gray-500 block mt-0.5">Determines wallet currency</span>
            </div>
            <div className="relative">
              <select
                value={state.user.country}
                onChange={handleCountryChange}
                className="bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-pink-500 appearance-none pr-6"
              >
                <option value="India">India (₹)</option>
                <option value="International">International ($)</option>
              </select>
              <ChevronRight className="w-3.5 h-3.5 text-gray-500 absolute right-1.5 top-2.5 rotate-90 pointer-events-none" />
            </div>
          </div>
        </section>

        {/* 2. Wallet Auto Recharge Settings Shortcut */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-5 backdrop-blur-md space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Sliders className="w-4.5 h-4.5 text-pink-500" />
            Upload Expiry Settings
          </h3>

          <div className="space-y-3">
            {(["photo", "story", "reel", "video", "movie"] as const).map((type) => (
              <div key={type} className="flex justify-between items-center text-xs">
                <span className="font-bold capitalize text-gray-300">{type} Auto-Renew</span>
                <input
                  type="checkbox"
                  checked={state.autoRecharge[type]}
                  onChange={() => toggleAutoRecharge(type)}
                  className="w-4 h-4 accent-pink-500"
                />
              </div>
            ))}
          </div>
        </section>

        {/* 3. Support & Legal Hub links */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-5 backdrop-blur-md space-y-2.5">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <HelpCircle className="w-4.5 h-4.5 text-pink-500" />
            Support & Policies
          </h3>

          <Link 
            href="/support"
            className="flex justify-between items-center py-2 text-xs hover:text-pink-400 transition"
          >
            <span className="font-semibold text-gray-200">Customer Support Desk</span>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </Link>

          <Link 
            href="/legal"
            className="flex justify-between items-center py-2 text-xs hover:text-pink-400 transition border-t border-white/5"
          >
            <span className="font-semibold text-gray-200">Legal Terms & Policy Hub</span>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </Link>
        </section>

        {/* 4. Danger actions (Bans / logs / logout) */}
        <section className="space-y-4">
          <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-3xl text-xs flex gap-3 items-center backdrop-blur-md">
            <ShieldAlert className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <span className="font-bold text-red-400 block">Security Fingerprint Active</span>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-normal">
                Premrog monitors system anomalies. VPN/Proxy manipulations block account monetization.
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-red-500 font-bold py-3.5 rounded-2xl text-xs transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Terminate User Session ({state.user.username})</span>
          </button>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}