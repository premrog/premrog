"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/state";
import { 
  X, 
  User, 
  LogIn, 
  UserPlus, 
  Key, 
  LogOut, 
  Settings, 
  Globe, 
  UploadCloud, 
  Users, 
  Heart, 
  MessageCircle, 
  ShieldAlert, 
  Link as LinkIcon, 
  FileText, 
  Shield, 
  Info, 
  HelpCircle, 
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Camera,
  Image as ImageIcon,
  Lock,
  Bell,
  Mail,
  Copy,
  Check
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const { state, logout, updateProfile, toggleFollow, t } = useAppState();

  const isLoggedIn = !!state.user;

  // Collapsible States
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [connectionsExpanded, setConnectionsExpanded] = useState(false);
  const [likesExpanded, setLikesExpanded] = useState(false);
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [moderationExpanded, setModerationExpanded] = useState(false);
  const [uploadPickerOpen, setUploadPickerOpen] = useState(false);

  // Settings sub-states
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);
  const [profilePrivate, setProfilePrivate] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);

  // Custom Toast Message state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Hidden inputs for upload simulation
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Auto close toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleLanguageChange = (lang: "en" | "hi" | "es") => {
    if (state.user) {
      updateProfile({ language: lang });
      triggerToast(`Language switched to ${lang === "en" ? "English" : lang === "hi" ? "Hindi" : "Spanish"}!`);
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
    triggerToast("Logged out successfully.");
    router.push("/");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://www.premrog.com/invite");
    triggerToast("App invite link copied to clipboard! 🔗");
  };

  // Upload simulation gate
  const handleUploadSource = (source: "camera" | "gallery") => {
    onClose();
    // Redirect to upload page and pass the source so that it opens the selector or intent
    router.push(`/upload?source=${source}`);
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-55 bg-[#000000] border border-pink-200 text-[#FFF5F7] text-[11px] font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-3.5 h-3.5 text-pink-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Drawer Overlay backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-40 bg-[#000000]/40 backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* Sidebar main slide-out panel - strictly structured under #FFF5F7 & text #000000 */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-[#FFF5F7] border-r border-pink-200 shadow-2xl transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } text-[#000000]`}
      >
        {/* Scrollable container inside the panel */}
        <div className="h-full flex flex-col justify-between overflow-y-auto scrollbar-none">
          
          <div className="p-5 space-y-5">
            
            {/* Header: User Metadata Viewer & Close button */}
            <div className="flex justify-between items-start border-b border-pink-200 pb-4">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={state.user?.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800"} 
                      alt="User Avatar" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-pink-500 shadow-md shadow-pink-200"
                    />
                    {state.user?.isVerified && (
                      <span className="absolute bottom-0 right-0 bg-pink-500 rounded-full p-[2px] border border-white">
                        <CheckCircle className="w-2.5 h-2.5 text-white" />
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#000000] leading-none truncate max-w-[140px]">
                      @{state.user?.username}
                    </h3>
                    <div className="mt-1 flex flex-col gap-0.5">
                      <span className="text-[10px] text-pink-900 font-medium">
                        Monetization:{" "}
                        <span className={state.user?.isCreator ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                          {state.user?.isCreator ? "Active" : "Inactive"}
                        </span>
                      </span>
                      <span className="text-[8px] text-pink-700 font-semibold uppercase">
                        {state.user?.isCreator ? "Creator Account" : "Member"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-pink-200">
                    <User className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#000000]">Welcome Guest</h3>
                    <span className="text-[8px] text-pink-700 block">Sign up to earn ad split</span>
                  </div>
                </div>
              )}

              <button 
                onClick={onClose} 
                className="text-pink-600 hover:text-black p-1 hover:bg-pink-100 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section 1: User Identity & Account Control (Auth Flow) */}
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-pink-800 uppercase tracking-widest block mb-2 px-2">
                Identity Controls
              </span>
              
              {!isLoggedIn ? (
                <div className="space-y-1 bg-white p-2 rounded-2xl border border-pink-100 shadow-xs">
                  <Link 
                    href="/login" 
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-[#000000] hover:bg-pink-50 transition font-medium"
                  >
                    <LogIn className="w-4 h-4 text-pink-500" />
                    <span>{t("login")} (#12)</span>
                  </Link>
                  <Link 
                    href="/signup" 
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-[#000000] hover:bg-pink-50 transition font-medium"
                  >
                    <UserPlus className="w-4 h-4 text-pink-500" />
                    <span>{t("signup")} (#13)</span>
                  </Link>
                  <Link 
                    href="/forgot-password" 
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-[#000000] hover:bg-pink-50 transition font-medium"
                  >
                    <Key className="w-4 h-4 text-pink-500" />
                    <span>Recover Credentials (#14)</span>
                  </Link>
                </div>
              ) : (
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/50 transition text-left font-bold"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Log Out Session (#11)</span>
                </button>
              )}
            </div>

            {/* Section 2: Account Settings & Preferences */}
            <div className="space-y-1.5 border-t border-pink-200 pt-4">
              <button
                onClick={() => setSettingsExpanded(!settingsExpanded)}
                className="w-full flex justify-between items-center px-2 py-1.5 text-[9px] font-bold text-pink-800 uppercase tracking-widest hover:text-pink-900 transition"
              >
                <span>Settings & Preferences (#1)</span>
                {settingsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {settingsExpanded && (
                <div className="bg-white border border-pink-100 rounded-2xl p-3.5 space-y-4 mt-1 shadow-xs">
                  
                  {/* Link to Main Setting Container */}
                  <Link 
                    href="/settings" 
                    onClick={onClose}
                    className="flex items-center justify-between text-xs text-[#000000] hover:text-pink-600 transition border-b border-pink-50 pb-2"
                  >
                    <span className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-pink-500" />
                      <strong>Main Settings Panel</strong>
                    </span>
                    <span className="text-[10px] text-pink-500 font-semibold">Configure &rarr;</span>
                  </Link>

                  {/* Dynamic Language Switcher inside Slider */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-[9px] font-bold text-pink-800 uppercase tracking-wider">
                      <Globe className="w-3.5 h-3.5 text-pink-500" />
                      Interface Language
                    </label>
                    <div className="relative">
                      <select
                        value={state.user?.language || "en"}
                        onChange={(e) => handleLanguageChange(e.target.value as "en" | "hi" | "es")}
                        className="w-full bg-[#FFF5F7] border border-pink-200 rounded-xl py-2 pl-3 pr-8 text-xs text-black focus:outline-none focus:border-pink-500 appearance-none cursor-pointer"
                      >
                        <option value="en">English (US)</option>
                        <option value="hi">हिंदी (Hindi)</option>
                        <option value="es">Español (Spanish)</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-pink-600 absolute right-2.5 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Notification Switches */}
                  <div className="space-y-2.5 pt-2 border-t border-pink-50">
                    <span className="text-[9px] font-bold text-pink-800 uppercase tracking-wider block">Notifications</span>
                    <div className="flex justify-between items-center text-xs text-[#000000]">
                      <span className="flex items-center gap-2">
                        <Bell className="w-3.5 h-3.5 text-pink-500" />
                        Push Notifications
                      </span>
                      <input 
                        type="checkbox" 
                        checked={pushNotif} 
                        onChange={() => { setPushNotif(!pushNotif); triggerToast(`Push alerts ${!pushNotif ? 'enabled' : 'disabled'}`); }}
                        className="w-4 h-4 accent-pink-500 cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-between items-center text-xs text-[#000000]">
                      <span className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-pink-500" />
                        Email Alerts
                      </span>
                      <input 
                        type="checkbox" 
                        checked={emailNotif} 
                        onChange={() => { setEmailNotif(!emailNotif); triggerToast(`Email logs ${!emailNotif ? 'enabled' : 'disabled'}`); }}
                        className="w-4 h-4 accent-pink-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Security Toggles */}
                  <div className="space-y-2.5 pt-2 border-t border-pink-50">
                    <span className="text-[9px] font-bold text-pink-800 uppercase tracking-wider block">Security Details</span>
                    <div className="flex justify-between items-center text-xs text-[#000000]">
                      <span className="flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-pink-500" />
                        Private Profile
                      </span>
                      <input 
                        type="checkbox" 
                        checked={profilePrivate} 
                        onChange={() => { setProfilePrivate(!profilePrivate); triggerToast(`Profile privacy set to ${!profilePrivate ? 'Private' : 'Public'}`); }}
                        className="w-4 h-4 accent-pink-500 cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-between items-center text-xs text-[#000000]">
                      <span className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-pink-500" />
                        2FA Authentication
                      </span>
                      <input 
                        type="checkbox" 
                        checked={twoFactor} 
                        onChange={() => { setTwoFactor(!twoFactor); triggerToast(`Two-factor security ${!twoFactor ? 'activated' : 'deactivated'}`); }}
                        className="w-4 h-4 accent-pink-500 cursor-pointer"
                      />
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Section 3: Content Creation & Social Engagement Shortcuts */}
            <div className="space-y-1.5 border-t border-pink-200 pt-4">
              <span className="text-[9px] font-bold text-pink-800 uppercase tracking-widest block mb-1 px-2">
                Creation & Shortcuts
              </span>

              {/* 8. Upload Shortcut triggers Gallery/Camera permissions Bottom-Sheet selector */}
              <div className="bg-white border border-pink-200 rounded-2xl p-2.5 space-y-2 shadow-xs">
                <button 
                  onClick={() => setUploadPickerOpen(!uploadPickerOpen)}
                  className="w-full flex justify-between items-center px-2 py-1.5 rounded-xl text-xs text-[#000000] hover:bg-pink-50 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <UploadCloud className="w-4.5 h-4.5 text-pink-600 animate-pulse" />
                    <span className="font-semibold">Create / Upload (#7)</span>
                  </span>
                  {uploadPickerOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {uploadPickerOpen && (
                  <div className="grid grid-cols-2 gap-2 p-1 pt-0">
                    <button 
                      onClick={() => handleUploadSource("camera")}
                      className="flex flex-col items-center justify-center py-2.5 rounded-xl bg-[#FFF5F7] hover:bg-pink-100 text-[#000000] border border-pink-200 transition cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-pink-600 mb-1" />
                      <span className="text-[9px] font-bold">Camera (लाइव)</span>
                    </button>
                    <button 
                      onClick={() => handleUploadSource("gallery")}
                      className="flex flex-col items-center justify-center py-2.5 rounded-xl bg-[#FFF5F7] hover:bg-pink-100 text-[#000000] border border-pink-200 transition cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4 text-pink-600 mb-1" />
                      <span className="text-[9px] font-bold">Gallery (गैलरी)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 9. Follow / Follower Management */}
              <div className="bg-white border border-pink-200 rounded-2xl p-1 shadow-xs">
                <button
                  onClick={() => setConnectionsExpanded(!connectionsExpanded)}
                  className="w-full flex justify-between items-center px-3 py-2.5 rounded-xl text-xs text-[#000000] hover:bg-pink-50 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <Users className="w-4.5 h-4.5 text-pink-500" />
                    <span>Connections (#6)</span>
                  </span>
                  {connectionsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {connectionsExpanded && (
                  <div className="p-3 pt-0 space-y-3">
                    <div className="flex gap-2 text-[10px] text-pink-800 bg-[#FFF5F7] p-2 rounded-xl justify-around border border-pink-100">
                      <div>Followers: <strong className="text-black">{state.user?.followers.length || 0}</strong></div>
                      <div className="border-r border-pink-200 h-3.5 my-auto" />
                      <div>Following: <strong className="text-black">{state.user?.following.length || 0}</strong></div>
                    </div>
                    {isLoggedIn && state.user?.following && state.user.following.length > 0 ? (
                      <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                        <span className="text-[8px] font-bold text-pink-700 uppercase">Following List</span>
                        {state.user.following.map(username => (
                          <div key={username} className="flex justify-between items-center text-[10px] bg-white px-2 py-1.5 rounded-lg border border-pink-200">
                            <span className="text-black font-semibold truncate max-w-[100px]">@{username}</span>
                            <button 
                              onClick={() => { toggleFollow(username); triggerToast(`Unfollowed @${username}`); }}
                              className="text-[8px] font-extrabold text-rose-600 hover:bg-rose-50 px-2 py-0.5 rounded border border-rose-200 uppercase"
                            >
                              Unfollow
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[9px] text-pink-600 text-center py-1 font-medium">Not following anyone yet.</p>
                    )}
                  </div>
                )}
              </div>

              {/* 10. Like Dashboard */}
              <div className="bg-white border border-pink-200 rounded-2xl p-1 shadow-xs">
                <button
                  onClick={() => setLikesExpanded(!likesExpanded)}
                  className="w-full flex justify-between items-center px-3 py-2.5 rounded-xl text-xs text-[#000000] hover:bg-pink-50 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <Heart className="w-4.5 h-4.5 text-pink-500" />
                    <span>Likes (#8)</span>
                  </span>
                  {likesExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {likesExpanded && (
                  <div className="p-3 pt-0 space-y-2">
                    <div className="text-[9px] text-[#000000] bg-[#FFF5F7] p-2 rounded-xl border border-pink-100 leading-relaxed font-medium">
                      Recent Likes:
                      <ul className="list-disc list-inside mt-1 space-y-0.5 text-pink-900">
                        <li>sneha_sharma (Photo)</li>
                        <li>rohit_roy (Reel)</li>
                        <li>premrog_official (Video)</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* 11. Comment History */}
              <div className="bg-white border border-pink-200 rounded-2xl p-1 shadow-xs">
                <button
                  onClick={() => setCommentsExpanded(!commentsExpanded)}
                  className="w-full flex justify-between items-center px-3 py-2.5 rounded-xl text-xs text-[#000000] hover:bg-pink-50 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <MessageCircle className="w-4.5 h-4.5 text-pink-500" />
                    <span>Comments (#9)</span>
                  </span>
                  {commentsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {commentsExpanded && (
                  <div className="p-3 pt-0 space-y-2">
                    <div className="text-[9px] text-[#000000] bg-[#FFF5F7] p-2 rounded-xl border border-pink-100 space-y-1.5 max-h-32 overflow-y-auto">
                      <div className="border-b border-pink-100 pb-1">
                        <span className="text-pink-600 text-[8px] block">Post: sneha_sharma</span>
                        <p className="text-black italic font-medium">&quot;Amazing scenery! 😍&quot;</p>
                      </div>
                      <div>
                        <span className="text-pink-600 text-[8px] block">Post: premrog_official</span>
                        <p className="text-black italic font-medium">&quot;This monetization system is exactly what we needed!&quot;</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section 4: Content Moderation & Legal Frameworks */}
            <div className="space-y-1.5 border-t border-pink-200 pt-4">
              <span className="text-[9px] font-bold text-pink-800 uppercase tracking-widest block mb-1 px-2">
                Moderation & Legal
              </span>

              {/* 12. Block & Report Status */}
              <div className="bg-white border border-pink-200 rounded-2xl p-1 shadow-xs">
                <button
                  onClick={() => setModerationExpanded(!moderationExpanded)}
                  className="w-full flex justify-between items-center px-3 py-2.5 rounded-xl text-xs text-[#000000] hover:bg-pink-50 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <ShieldAlert className="w-4.5 h-4.5 text-pink-500" />
                    <span>Report Terminal (#10)</span>
                  </span>
                  {moderationExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {moderationExpanded && (
                  <div className="p-3 pt-0 space-y-3 text-[10px]">
                    {/* Blocked Users */}
                    <div className="space-y-1.5">
                      <span className="text-[8px] font-bold text-pink-700 uppercase tracking-wider block">Blocked list</span>
                      <div className="flex justify-between items-center bg-[#FFF5F7] p-2 rounded-xl border border-pink-100">
                        <span className="text-black font-semibold">@bad_spammer_31</span>
                        <button 
                          onClick={() => triggerToast("Unblocked @bad_spammer_31")}
                          className="text-[8px] font-extrabold text-emerald-600 border border-emerald-300 px-1.5 py-0.5 rounded uppercase"
                        >
                          Unblock
                        </button>
                      </div>
                    </div>

                    {/* Report Status */}
                    <div className="space-y-1.5 border-t border-pink-100 pt-2">
                      <span className="text-[8px] font-bold text-pink-700 uppercase tracking-wider block">Reports history</span>
                      <div className="bg-[#FFF5F7] p-2 rounded-xl space-y-1 text-pink-900 border border-pink-100">
                        <div>ID #4190: Flagged Reel - <strong className="text-rose-600 uppercase font-bold">Resolved</strong></div>
                        <div className="text-[8px] text-pink-700">Reason: Copyright check clear.</div>
                        <div className="mt-1 border-t border-pink-100 pt-1">
                          Strikes: <strong className="text-rose-600">0 / 3</strong> (Warnings clear)
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 13. Copy Invite Link */}
              <button 
                onClick={handleCopyLink}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-[#000000] bg-white border border-pink-200 hover:bg-pink-50 transition text-left shadow-xs"
              >
                <span className="flex items-center gap-3">
                  <LinkIcon className="w-4.5 h-4.5 text-pink-500" />
                  <span>Copy invitation Link (#10)</span>
                </span>
                <Copy className="w-3.5 h-3.5 text-pink-600" />
              </button>

              {/* 14. Terms and Conditions */}
              <Link 
                href="/legal?tab=terms" 
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-[#000000] bg-white border border-pink-200 hover:bg-pink-50 transition shadow-xs"
              >
                <FileText className="w-4.5 h-4.5 text-pink-500" />
                <span>टर्म एंड कन्डीशन (Terms #4)</span>
              </Link>

              {/* 15. Policy */}
              <Link 
                href="/legal?tab=privacy" 
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-[#000000] bg-white border border-pink-200 hover:bg-pink-50 transition shadow-xs"
              >
                <Shield className="w-4.5 h-4.5 text-pink-500" />
                <span>पॉलिसी (Privacy #5)</span>
              </Link>
            </div>

            {/* Section 5: Corporate Info & Communication */}
            <div className="space-y-1.5 border-t border-pink-200 pt-4 pb-6">
              <span className="text-[9px] font-bold text-pink-800 uppercase tracking-widest block mb-1 px-2">
                Corporate & Support
              </span>

              {/* 17. About Us */}
              <Link 
                href="/legal?tab=about" 
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-[#000000] bg-white border border-pink-200 hover:bg-pink-50 transition shadow-xs"
              >
                <Info className="w-4.5 h-4.5 text-pink-500" />
                <span>About Premrog (#2)</span>
              </Link>

              {/* 18. Contact Us */}
              <Link 
                href="/support" 
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-[#000000] bg-white border border-pink-200 hover:bg-pink-50 transition shadow-xs"
              >
                <HelpCircle className="w-4.5 h-4.5 text-pink-500" />
                <span>Contact Us (#3)</span>
              </Link>
            </div>

          </div>
          
        </div>
      </aside>
    </>
  );
}
