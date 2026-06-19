"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { useAppState } from "@/lib/state";
import { 
  Settings, 
  Globe, 
  ShieldAlert, 
  HelpCircle, 
  LogOut, 
  Sliders, 
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
    updateProfile({ language: e.target.value as "en" | "hi" | "es" });
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
      <div className="min-h-screen bg-[#FFF5F7] text-[#000000] flex flex-col justify-center items-center p-6 text-center font-sans">
        <h2 className="text-xl font-bold">Please log in to view settings</h2>
        <Link href="/login" className="mt-4 bg-black text-[#FFF5F7] px-6 py-2.5 rounded-xl font-bold transition shadow-md">
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF5F7] text-[#000000] min-h-screen pb-24 font-sans relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-pink-300/10 rounded-full blur-[100px] pointer-events-none" />

      <main className="max-w-md mx-auto px-4 pt-4">
        <h1 className="text-xl font-black mb-6 tracking-wide text-[#000000] flex items-center gap-2">
          <Settings className="w-5.5 h-5.5 text-pink-600 animate-spin" style={{ animationDuration: "12s" }} />
          <span>SYSTEM SETTINGS (V19)</span>
        </h1>

        {/* 1. Account Preference section */}
        <section className="bg-white border border-pink-200 rounded-3xl p-5 mb-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-pink-650 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <User className="w-4 h-4 text-pink-600" />
            Account Preferences
          </h3>

          {/* Lang Selector */}
          <div className="flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-black block">App Language</span>
              <span className="text-[9px] text-[#000000]/70 block mt-0.5 font-medium">Select interface translation</span>
            </div>
            <div className="relative">
              <select
                value={state.user.language}
                onChange={handleLanguageChange}
                className="bg-[#FFF5F7] border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-black focus:outline-none focus:border-pink-500 appearance-none pr-6 cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="es">Español (Spanish)</option>
              </select>
              <Globe className="w-3.5 h-3.5 text-pink-600 absolute right-2 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Country selector */}
          <div className="flex justify-between items-center text-xs pt-3 border-t border-pink-100">
            <div>
              <span className="font-bold text-black block">Billing Country</span>
              <span className="text-[9px] text-[#000000]/70 block mt-0.5 font-medium">Determines wallet currency and ingestion rates</span>
            </div>
            <div className="relative">
              <select
                value={state.user.country}
                onChange={handleCountryChange}
                className="bg-[#FFF5F7] border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-black focus:outline-none focus:border-pink-500 appearance-none pr-6 cursor-pointer"
              >
                <option value="India">India (₹)</option>
                <option value="International">International ($)</option>
              </select>
              <ChevronRight className="w-3.5 h-3.5 text-pink-600 absolute right-1.5 top-2.5 rotate-90 pointer-events-none" />
            </div>
          </div>
        </section>

        {/* 2. Wallet Auto Recharge Settings Shortcut */}
        <section className="bg-white border border-pink-200 rounded-3xl p-5 mb-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-pink-650 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Sliders className="w-4.5 h-4.5 text-pink-600" />
            Upload Expiry Auto-Renew
          </h3>

          <div className="space-y-3">
            {(["photo", "story", "reel", "video", "movie"] as const).map((type) => (
              <div key={type} className="flex justify-between items-center text-xs">
                <span className="font-bold capitalize text-black">{type} Auto-Renew</span>
                <input
                  type="checkbox"
                  checked={state.autoRecharge[type]}
                  onChange={() => toggleAutoRecharge(type)}
                  className="w-4 h-4 accent-pink-600 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </section>

        {/* 3. Support & Legal Hub links */}
        <section className="bg-white border border-pink-200 rounded-3xl p-5 mb-5 shadow-sm space-y-2.5">
          <h3 className="text-xs font-bold text-pink-655 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <HelpCircle className="w-4.5 h-4.5 text-pink-600" />
            Support & Policies
          </h3>

          <Link 
            href="/support"
            className="flex justify-between items-center py-2 text-xs hover:text-pink-600 transition"
          >
            <span className="font-bold text-[#000000]">Customer Support Desk (#3)</span>
            <ChevronRight className="w-4 h-4 text-pink-600" />
          </Link>

          <Link 
            href="/legal"
            className="flex justify-between items-center py-2 text-xs hover:text-pink-600 transition border-t border-pink-100"
          >
            <span className="font-bold text-[#000000]">Legal Terms & Policy Hub (#4 / #5)</span>
            <ChevronRight className="w-4 h-4 text-pink-600" />
          </Link>
        </section>

        {/* 4. Danger actions (Bans / logs / logout) */}
        <section className="space-y-4">
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-3xl text-xs flex gap-3 items-center shadow-xs">
            <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <div>
              <span className="font-bold text-rose-800 block">Security Fingerprint Guard active</span>
              <p className="text-[10px] text-[#000000]/70 mt-0.5 leading-normal font-semibold">
                Premrog monitors system anomalies. VPN/Proxy manipulations block account monetization.
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-white border border-pink-200 hover:bg-pink-50 text-red-600 font-bold py-3.5 rounded-2xl text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Terminate User Session ({state.user.username})</span>
          </button>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}