"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/state";
import { Smartphone, Mail, Key, Globe, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { login, state, t } = useAppState();
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [lang, setLang] = useState<"en" | "hi">(state.user?.language || "en");

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone) {
      setError(lang === "en" ? "Please enter email or mobile number" : "कृपया ईमेल या मोबाइल नंबर दर्ज करें");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== "123456" && otpCode.length !== 6) {
      setError(lang === "en" ? "Invalid OTP (Use 123456 for demo)" : "अमान्य ओटीपी (डेमो के लिए 123456 का उपयोग करें)");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const success = login(emailOrPhone);
      if (success) {
        router.push("/home");
      } else {
        setError(lang === "en" ? "Login failed" : "लॉगिन विफल रहा");
      }
    }, 1000);
  };

  const handleSocialLogin = (platform: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login(`${platform.toLowerCase()}_user@premrog.com`);
      router.push("/home");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-pink-600/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[120px]" />

      {/* Floating Language Bar */}
      <div className="absolute top-4 right-4 bg-white/5 border border-white/10 rounded-full p-1 flex items-center gap-1 backdrop-blur-md">
        <button
          onClick={() => {
            const nextLang = lang === "en" ? "hi" : "en";
            setLang(nextLang);
            // Quick update without full profile write if no user logged in
            if (state.user) {
              state.user.language = nextLang;
            }
          }}
          className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 hover:bg-white/10 transition"
        >
          <Globe className="w-3.5 h-3.5 text-pink-500" />
          {lang === "en" ? "हिंदी" : "English"}
        </button>
      </div>

      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-widest bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(236,72,153,0.3)]">
            {lang === "en" ? "PREMROG" : "प्रेमरोग"}
          </h1>
          <p className="text-xs text-gray-400 mt-2 font-medium tracking-wider uppercase">
            {lang === "en" ? "Connect • Create • Monetize" : "जुड़ें • बनाएं • कमाएं"}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl p-3 mb-6 text-center">
            {error}
          </div>
        )}

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                {lang === "en" ? "Mobile Number or Email" : "मोबाइल नंबर या ईमेल"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {emailOrPhone.includes("@") ? (
                    <Mail className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Smartphone className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <input
                  type="text"
                  required
                  placeholder={lang === "en" ? "e.g., +91 9999999999 or user@email.com" : "उदा. +91 9999999999 या ईमेल"}
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition duration-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl transition duration-300 shadow-lg shadow-pink-600/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{lang === "en" ? "Send OTP Code" : "ओटीपी कोड भेजें"}</span>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-300">
                {lang === "en" ? "Enter the 6-digit OTP code sent to:" : "6-अंकों का ओटीपी दर्ज करें जो भेजा गया है:"}
              </p>
              <p className="text-sm font-bold text-pink-500 mt-1">{emailOrPhone}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                {lang === "en" ? "Verification Code" : "सत्यापन कोड"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder={lang === "en" ? "Enter 123456" : "123456 दर्ज करें"}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-center text-white tracking-widest text-lg font-bold placeholder-gray-600 focus:outline-none focus:border-pink-500 transition duration-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl transition duration-300 shadow-lg shadow-pink-600/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{lang === "en" ? "Verify & Login" : "सत्यापित करें और लॉगिन करें"}</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="w-full text-center text-xs text-gray-400 hover:text-white transition mt-2"
            >
              {lang === "en" ? "Change phone number / email" : "फ़ोन नंबर / ईमेल बदलें"}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-3 text-gray-500">
              {lang === "en" ? "Or Continue With" : "या इसके साथ जारी रखें"}
            </span>
          </div>
        </div>

        {/* Social logins */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSocialLogin("Google")}
            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-3 hover:bg-white/10 transition duration-300 font-semibold text-sm"
          >
            <span className="text-red-500 font-black">G</span> Google
          </button>
          <button
            onClick={() => handleSocialLogin("Apple")}
            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-3 hover:bg-white/10 transition duration-300 font-semibold text-sm"
          >
            <span className="text-white font-black"></span> Apple
          </button>
        </div>

        {/* Sign up prompt */}
        <p className="text-center text-sm text-gray-400 mt-8">
          {lang === "en" ? "Don't have an account?" : "खाता नहीं है?"}{" "}
          <Link href="/signup" className="text-pink-500 font-bold hover:underline">
            {lang === "en" ? "Create Account" : "खाता बनाएं"}
          </Link>
        </p>

        {/* Forgot password prompt */}
        <div className="text-center mt-3">
          <Link href="/forgot-password" className="text-xs text-gray-500 hover:text-gray-300">
            {lang === "en" ? "Trouble logging in?" : "लॉगिन करने में परेशानी?"}
          </Link>
        </div>
      </div>
    </div>
  );
}