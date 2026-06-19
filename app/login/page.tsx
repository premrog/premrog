"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/state";
import { Smartphone, Mail, Key, Globe } from "lucide-react";

export default function LoginPage() {
  const { login, state, t } = useAppState();
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<"en" | "hi">(
    state.user?.language === "hi" ? "hi" : "en"
  );

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
    <div className="min-h-screen bg-[#FFF5F7] text-[#000000] flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-pink-300/20 blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-pink-400/10 blur-[100px]" />

      {/* Floating Language Bar */}
      <div className="absolute top-4 right-4 bg-white border border-pink-200 rounded-full p-1 flex items-center gap-1 shadow-xs">
        <button
          onClick={() => {
            const nextLang = lang === "en" ? "hi" : "en";
            setLang(nextLang);
            if (state.user) {
              state.user.language = nextLang;
            }
          }}
          className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 hover:bg-pink-50 transition cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-pink-500" />
          {lang === "en" ? "हिंदी" : "English"}
        </button>
      </div>

      <div className="w-full max-w-md bg-white border border-pink-200 rounded-3xl p-8 shadow-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-widest bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            {lang === "en" ? "PREMROG" : "प्रेमरोग"}
          </h1>
          <p className="text-xs text-pink-700 mt-2 font-bold tracking-wider uppercase">
            {lang === "en" ? "Connect • Create • Monetize" : "जुड़ें • बनाएं • कमाएं"}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl p-3 mb-6 text-center font-bold">
            {error}
          </div>
        )}

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-pink-850 uppercase tracking-wider mb-2">
                {lang === "en" ? "Mobile Number or Email" : "मोबाइल नंबर या ईमेल"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {emailOrPhone.includes("@") ? (
                    <Mail className="w-5 h-5 text-pink-500" />
                  ) : (
                    <Smartphone className="w-5 h-5 text-pink-500" />
                  )}
                </div>
                <input
                  type="text"
                  required
                  placeholder={lang === "en" ? "e.g., +91 9999999999" : "उदा. +91 9999999999"}
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full bg-[#FFF5F7] border border-pink-200 rounded-xl py-3 pl-10 pr-4 text-black placeholder-pink-400 focus:outline-none focus:border-pink-500 transition duration-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-black/90 text-white font-bold py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
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
              <p className="text-sm text-pink-900 font-semibold">
                {lang === "en" ? "Enter the 6-digit OTP code sent to:" : "6-अंकों का ओटीपी दर्ज करें जो भेजा गया है:"}
              </p>
              <p className="text-sm font-bold text-pink-655 mt-1">{emailOrPhone}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-pink-850 uppercase tracking-wider mb-2">
                {lang === "en" ? "Verification Code" : "सत्यापन कोड"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="w-5 h-5 text-pink-500" />
                </div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder={lang === "en" ? "Enter 123456" : "123456 दर्ज करें"}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full bg-[#FFF5F7] border border-pink-200 rounded-xl py-3 pl-10 pr-4 text-center text-black tracking-widest text-lg font-bold placeholder-pink-400 focus:outline-none focus:border-pink-500 transition duration-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-black/90 text-white font-bold py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
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
              className="w-full text-center text-xs text-pink-700 hover:underline font-bold mt-2"
            >
              {lang === "en" ? "Change phone number / email" : "फ़ोन नंबर / ईमेल बदलें"}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-pink-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#FFF5F7] border border-pink-200 px-3 py-0.5 rounded-full text-pink-850 font-bold">
              {lang === "en" ? "Or Continue With" : "या इसके साथ जारी रखें"}
            </span>
          </div>
        </div>

        {/* Social logins */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSocialLogin("Google")}
            className="flex items-center justify-center gap-2 bg-[#FFF5F7] border border-pink-200 rounded-xl py-3 hover:bg-pink-100 transition duration-300 font-bold text-sm cursor-pointer"
          >
            <span className="text-red-500 font-black">G</span> Google
          </button>
          <button
            onClick={() => handleSocialLogin("Apple")}
            className="flex items-center justify-center gap-2 bg-[#FFF5F7] border border-pink-200 rounded-xl py-3 hover:bg-pink-100 transition duration-300 font-bold text-sm cursor-pointer"
          >
            <span className="text-black font-black"></span> Apple
          </button>
        </div>

        {/* Sign up prompt */}
        <p className="text-center text-sm text-[#000000] mt-8 font-semibold">
          {lang === "en" ? "Don't have an account?" : "खाता नहीं है?"}{" "}
          <Link href="/signup" className="text-pink-600 font-black hover:underline">
            {lang === "en" ? "Create Account" : "खाता बनाएं"}
          </Link>
        </p>

        {/* Forgot password prompt */}
        <div className="text-center mt-3">
          <Link href="/forgot-password" className="text-xs text-pink-700 hover:underline font-bold">
            {lang === "en" ? "Trouble logging in?" : "लॉगिन करने में परेशानी?"}
          </Link>
        </div>
      </div>
    </div>
  );
}