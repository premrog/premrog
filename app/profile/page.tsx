"use client";

import React, { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { useAppState } from "@/lib/state";
import { 
  CheckCircle, 
  MapPin, 
  Globe, 
  Sliders, 
  Settings, 
  Briefcase, 
  Flag, 
  ShieldCheck,
  Edit3,
  LogOut,
  Camera
} from "lucide-react";

export default function ProfilePage() {
  const { state, updateProfile, logout, t } = useAppState();
  
  const [activeSubTab, setActiveSubTab] = useState<"photo" | "reel" | "video" | "movie">("photo");
  const [isEditing, setIsEditing] = useState(false);

  // Edit fields state
  const [bio, setBio] = useState(state.user?.bio || "");
  const [profilePic, setProfilePic] = useState(state.user?.profilePic || "");
  const [coverPic, setCoverPic] = useState(state.user?.coverPic || "");

  if (!state.user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-6 text-center font-sans">
        <h2 className="text-xl font-bold">Please log in to view your profile</h2>
        <Link href="/login" className="mt-4 bg-pink-600 px-6 py-2.5 rounded-xl font-bold">
          Log In
        </Link>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ bio, profilePic, coverPic });
    setIsEditing(false);
  };

  // Filter creator uploads
  const myUploads = state.posts.filter(p => p.user === state.user?.username && p.type === activeSubTab && p.status === "active");

  return (
    <div className="bg-black text-white min-h-screen pb-24 font-sans relative overflow-hidden">
      {/* Cover picture */}
      <div className="h-44 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        {state.user.coverPic && (
          <img 
            src={state.user.coverPic} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-80"
          />
        )}
        <button 
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 p-2 rounded-full backdrop-blur-md border border-white/10"
        >
          <Camera className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Avatar details */}
      <div className="px-4 relative z-10">
        <div className="flex justify-between items-end -mt-12">
          <div className="relative">
            <img
              src={state.user.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150"}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-black object-cover bg-gray-900"
            />
            {state.user.isVerified && (
              <span className="absolute bottom-1 right-1 bg-pink-500 rounded-full p-1 border-2 border-black">
                <CheckCircle className="w-3.5 h-3.5 text-white fill-white/10" />
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-white/5 hover:bg-white/10 p-2.5 rounded-xl border border-white/10 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={logout}
              className="bg-red-600/20 border border-red-500/20 hover:bg-red-600/30 p-2.5 rounded-xl text-xs font-bold text-red-500 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Username & Bio */}
        <div className="mt-4">
          <h1 className="text-xl font-black flex items-center gap-1">
            @{state.user.username}
          </h1>
          <p className="text-xs text-gray-400 mt-1.5 font-medium leading-relaxed max-w-sm">
            {state.user.bio}
          </p>

          <div className="flex gap-3 mt-3 text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-pink-500" /> {state.user.country}</span>
            <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-pink-500" /> {state.user.language === "en" ? "English" : "Hindi"}</span>
          </div>
        </div>

        {/* Stats strip */}
        <section className="flex bg-white/5 border border-white/5 p-4 rounded-2xl mt-5 text-center text-xs">
          <div className="flex-1">
            <h4 className="font-black text-white text-base">{state.posts.filter(p => p.user === state.user?.username).length}</h4>
            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mt-0.5 block">Posts</span>
          </div>
          <div className="w-px bg-white/10 h-7 self-center" />
          <div className="flex-1">
            <h4 className="font-black text-white text-base">{state.user.followers.length}</h4>
            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mt-0.5 block">Followers</span>
          </div>
          <div className="w-px bg-white/10 h-7 self-center" />
          <div className="flex-1">
            <h4 className="font-black text-white text-base">{state.user.following.length}</h4>
            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mt-0.5 block">Following</span>
          </div>
        </section>

        {/* Shortcut Action Panels (Creator, Advertiser, Super Admin) */}
        <section className="mt-5 space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <Link 
              href="/creator" 
              className="bg-gradient-to-r from-pink-600/20 to-purple-600/10 border border-pink-500/20 hover:border-pink-500/40 p-3.5 rounded-2xl flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-pink-500" />
                <span className="text-xs font-bold text-white">{t("creator")}</span>
              </div>
            </Link>

            <Link 
              href="/advertiser" 
              className="bg-gradient-to-r from-purple-600/20 to-indigo-600/10 border border-purple-500/20 hover:border-purple-500/40 p-3.5 rounded-2xl flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-bold text-white">{t("advertiser")}</span>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <Link 
              href="/admin" 
              className="bg-gradient-to-r from-red-600/20 to-orange-600/10 border border-red-500/20 hover:border-red-500/40 p-3.5 rounded-2xl flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-500" />
                <span className="text-xs font-bold text-white">{t("admin")}</span>
              </div>
            </Link>

            <Link 
              href="/settings" 
              className="bg-white/5 border border-white/5 hover:border-white/10 p-3.5 rounded-2xl flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-bold text-white">System Settings</span>
              </div>
            </Link>
          </div>
        </section>

        {/* Profile upload tabs */}
        <section className="mt-6">
          <div className="flex border-b border-white/10 mb-4 bg-white/5 rounded-xl p-1">
            {(["photo", "reel", "video", "movie"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`flex-1 py-1.5 text-center text-[10px] font-bold rounded-lg uppercase transition-all ${
                  activeSubTab === tab
                    ? "bg-pink-600 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab}s
              </button>
            ))}
          </div>

          {/* Tab Content Grid */}
          <div className="grid grid-cols-3 gap-2">
            {myUploads.map(upload => (
              <div 
                key={upload.id} 
                className="aspect-square bg-gray-900 border border-white/5 rounded-xl overflow-hidden relative group cursor-pointer"
              >
                <img 
                  src={upload.type === "photo" ? upload.mediaUrl : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150"} 
                  alt="My media" 
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                
                {upload.isBoosted && (
                  <span className="absolute top-1 left-1 bg-pink-600 text-[6px] text-white font-bold px-1 rounded uppercase">
                    ⚡ Boost
                  </span>
                )}
                
                <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] font-bold px-1 rounded">
                  {upload.views} v
                </span>
              </div>
            ))}
          </div>
          {myUploads.length === 0 && (
            <p className="text-center text-xs text-gray-500 py-6">No uploads in this category yet.</p>
          )}
        </section>
      </div>

      {/* Edit Profile Modal Dialog */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in max-w-md mx-auto">
          <form 
            onSubmit={handleSaveProfile} 
            className="bg-gray-950 border border-white/10 rounded-3xl p-6 w-full space-y-4 max-h-[85vh] overflow-y-auto"
          >
            <h3 className="font-bold text-sm text-pink-500 uppercase tracking-widest">Update Creator Profile</h3>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Biography / Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Profile Photo URI</label>
              <input
                type="text"
                value={profilePic}
                onChange={(e) => setProfilePic(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl p-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Cover Image URI</label>
              <input
                type="text"
                value={coverPic}
                onChange={(e) => setCoverPic(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl p-2 text-xs text-white"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button 
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-pink-600 hover:bg-pink-500 text-white px-5 py-2 rounded-xl text-xs font-bold"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      )}

      <BottomNav />
    </div>
  );
}