"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
    const pathname = usePathname();

    const menus = [
        { name: "Home", href: "/home", icon: "🏠" },
        { name: "Reels", href: "/reels", icon: "🎬" },
        { name: "Upload", href: "/upload", icon: "➕" },
        { name: "Chat", href: "/chat", icon: "💬" },
        { name: "Profile", href: "/profile", icon: "👤" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800">
            <div className="flex justify-around py-3">
                {menus.map((menu) => (
                    <Link
                        key={menu.href}
                        href={menu.href}
                        className={`flex flex-col items-center text-sm ${pathname === menu.href
                                ? "text-pink-500"
                                : "text-gray-400"
                            }`}
                    >
                        <span>{menu.icon}</span>
                        <span>{menu.name}</span>
                    </Link>
                ))}
            </div>
        </nav>
    );
}