"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Film, 
  CircleDot, 
  PlusCircle, 
  Search, 
  Bell, 
  Wallet, 
  MessageSquare, 
  User 
} from "lucide-react";
import { useAppState } from "@/lib/state";

export default function BottomNav() {
  const pathname = usePathname();
  const { state } = useAppState();

  // Count unread notifications
  const unreadNotiCount = state.notifications.filter(n => !n.read).length;

  const menus = [
    { name: "Home", href: "/home", Icon: Home },
    { name: "Reels", href: "/reels", Icon: Film },
    { name: "Story", href: "/story", Icon: CircleDot },
    { name: "Upload", href: "/upload", Icon: PlusCircle },
    { name: "Search", href: "/search", Icon: Search },
    { name: "Notify", href: "/notifications", Icon: Bell, badge: unreadNotiCount },
    { name: "Wallet", href: "/wallet", Icon: Wallet },
    { name: "Chat", href: "/chat", Icon: MessageSquare },
    { name: "Profile", href: "/profile", Icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-t border-white/10 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-md mx-auto flex justify-between items-center py-2 px-1">
        {menus.map((menu) => {
          const isActive = pathname === menu.href;
          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all duration-300 ${
                isActive 
                  ? "text-pink-500 scale-110 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" 
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <div className="relative">
                <menu.Icon className="w-5 h-5 transition-transform duration-300" />
                {menu.badge !== undefined && menu.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-pink-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse border border-black">
                    {menu.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-medium tracking-wide">
                {menu.name}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-5 h-0.5 bg-pink-500 rounded-full shadow-[0_0_8px_#ec4899]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}