"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MessagesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/chat");
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}