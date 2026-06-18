"use client";

import React, { useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import { useAppState } from "@/lib/state";
import { 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Wallet, 
  DollarSign, 
  PhoneCall, 
  MessageSquare,
  CheckCheck,
  AlertCircle
} from "lucide-react";

export default function NotificationsPage() {
  const { state, t } = useAppState();

  // Mark all notifications as read when entering the page
  useEffect(() => {
    state.notifications.forEach(n => {
      n.read = true;
    });
    // Sync back to local storage
    localStorage.setItem("premrog_state", JSON.stringify(state));
  }, []);

  const getNotiIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-4 h-4 text-pink-500 fill-pink-500/10" />;
      case "comment":
        return <MessageCircle className="w-4 h-4 text-purple-500" />;
      case "follow":
        return <UserPlus className="w-4 h-4 text-indigo-500" />;
      case "wallet":
        return <Wallet className="w-4 h-4 text-yellow-500" />;
      case "earnings":
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case "chat":
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case "call":
        return <PhoneCall className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getNotiBg = (type: string) => {
    switch (type) {
      case "like": return "bg-pink-500/10 border-pink-500/20";
      case "comment": return "bg-purple-500/10 border-purple-500/20";
      case "follow": return "bg-indigo-500/10 border-indigo-500/20";
      case "wallet": return "bg-yellow-500/10 border-yellow-500/20";
      case "earnings": return "bg-green-500/10 border-green-500/20";
      case "chat": return "bg-blue-500/10 border-blue-500/20";
      case "call": return "bg-red-500/10 border-red-500/20";
      default: return "bg-white/5 border-white/10";
    }
  };

  return (
    <div className="bg-black text-white min-h-screen pb-24 font-sans relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-[250px] h-[250px] bg-pink-900/10 rounded-full blur-[90px] pointer-events-none" />

      <main className="max-w-md mx-auto px-4 pt-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-black tracking-wide bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            {t("notifications")}
          </h1>
          <button 
            onClick={() => alert("All alerts cleared.")}
            className="text-[10px] uppercase font-bold text-pink-500 flex items-center gap-1 hover:underline"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Clear All
          </button>
        </div>

        <div className="space-y-3">
          {state.notifications.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/5">
              <AlertCircle className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No new notifications.</p>
              <p className="text-[11px] text-gray-500 mt-1">Activities from followers and coin transactions show here.</p>
            </div>
          ) : (
            state.notifications.map((noti) => (
              <div 
                key={noti.id} 
                className={`border p-3.5 rounded-2xl flex gap-3 items-center backdrop-blur-md transition-all hover:scale-[1.01] ${getNotiBg(noti.type)}`}
              >
                <div className="p-2 rounded-xl bg-black/40 flex-shrink-0">
                  {getNotiIcon(noti.type)}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-200 leading-snug">
                    {noti.text}
                  </p>
                  <span className="text-[9px] text-gray-500 block mt-1 font-medium">
                    {noti.timestamp}
                  </span>
                </div>
                {!noti.read && (
                  <span className="w-2 h-2 rounded-full bg-pink-500 flex-shrink-0 shadow-[0_0_8px_#ec4899]" />
                )}
              </div>
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}