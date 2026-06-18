"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { useAppState } from "@/lib/state";
import { Search, Check, CheckCheck, Circle, Sparkles, MessageSquare } from "lucide-react";

export default function ChatPage() {
  const { state, t } = useAppState();
  const [query, setQuery] = useState("");
  const [adRefreshCount, setAdRefreshCount] = useState(0);

  // Simulate banner ad refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAdRefreshCount(prev => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredChats = state.chats.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-black text-white min-h-screen pb-24 font-sans relative overflow-hidden">
      {/* Background neon blur */}
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-pink-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Banner Ad - Mandatory Chat Ad (100% Premrog) */}
      <div className="max-w-md mx-auto px-4 pt-3">
        <div className="bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-indigo-900/40 border border-pink-500/20 p-3 rounded-2xl flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="bg-pink-600 text-white text-[7px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
              Ad
            </span>
            <div>
              <p className="text-[10px] font-bold text-white">Recharge Now & Get 10% Extra Coins!</p>
              <p className="text-[8px] text-gray-400">Offer valid only today on Premrog.com gateway.</p>
            </div>
          </div>
          <Link href="/wallet" className="bg-pink-600 hover:bg-pink-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-lg transition">
            Buy
          </Link>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 pt-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-black tracking-wide bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            {t("chat")}
          </h1>
          <span className="text-[8px] font-bold tracking-widest text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20 uppercase flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> P2P Encrypted
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative mb-5">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition"
          />
        </div>

        {/* Chats List */}
        <div className="space-y-2">
          {filteredChats.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/5">
              <MessageSquare className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No active chats.</p>
              <p className="text-[11px] text-gray-500 mt-1">Visit creator profiles to initiate P2P chats.</p>
            </div>
          ) : (
            filteredChats.map((chat) => {
              const lastMsg = chat.messages[chat.messages.length - 1];
              const unreadCount = chat.messages.filter(m => m.sender === "other" && m.status !== "read").length;

              return (
                <Link 
                  key={chat.id} 
                  href={`/messages/${chat.id}`}
                  className="bg-white/5 border border-white/5 hover:border-white/20 p-3 rounded-2xl flex justify-between items-center transition backdrop-blur-md cursor-pointer block"
                >
                  <div className="flex items-center gap-3">
                    {/* Profile image with online dot */}
                    <div className="relative flex-shrink-0">
                      <img 
                        src={chat.avatar} 
                        alt={chat.name} 
                        className="w-11 h-11 rounded-full object-cover border border-white/10"
                      />
                      {chat.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-black" />
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-xs text-white flex items-center gap-1">
                        {chat.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5 max-w-[200px]">
                        {lastMsg ? lastMsg.text : "No messages yet."}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className="text-[8px] text-gray-500 font-medium">
                      {lastMsg ? lastMsg.timestamp : ""}
                    </span>
                    
                    {unreadCount > 0 ? (
                      <span className="bg-pink-500 text-white text-[8px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border border-black animate-pulse">
                        {unreadCount}
                      </span>
                    ) : lastMsg?.sender === "me" ? (
                      lastMsg.status === "read" ? (
                        <CheckCheck className="w-3.5 h-3.5 text-pink-500" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-gray-500" />
                      )
                    ) : null}
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
