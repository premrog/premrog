"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Smartphone, ArrowLeft, Key } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSendReset = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-[#000000] flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-pink-300/20 blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-pink-400/10 blur-[100px]" />

      <div className="w-full max-w-sm bg-white border border-pink-200 rounded-3xl p-8 shadow-md">
        <h1 className="text-2xl font-black text-pink-600 mb-2 text-center tracking-wide">
          Reset Password
        </h1>
        <p className="text-xs text-pink-850 text-center mb-6 font-semibold">
          Recover your Premrog account access
        </p>

        {success ? (
          <div className="space-y-4 text-center">
            <div className="bg-emerald-50 border border-emerald-250 text-emerald-600 p-4 rounded-xl text-sm font-bold animate-pulse">
              Password updated successfully! You can now log in.
            </div>
            <Link
              href="/login"
              className="block w-full bg-black hover:bg-black/90 py-3 rounded-xl font-bold transition text-center text-[#FFF5F7] cursor-pointer"
            >
              Go to Login
            </Link>
          </div>
        ) : !submitted ? (
          <form onSubmit={handleSendReset} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-pink-850 uppercase tracking-wider mb-2">
                Mobile Number or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {emailOrPhone.includes("@") ? (
                    <Mail className="w-4 h-4 text-pink-500" />
                  ) : (
                    <Smartphone className="w-4 h-4 text-pink-500" />
                  )}
                </div>
                <input
                  type="text"
                  required
                  placeholder="Registered mobile or email"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full bg-[#FFF5F7] border border-pink-200 rounded-xl py-2.5 pl-10 pr-4 text-black text-sm focus:outline-none focus:border-pink-500 transition duration-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-black/90 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 text-white cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Send Verification Code"
              )}
            </button>

            <Link
              href="/login"
              className="flex items-center justify-center gap-1.5 text-xs text-pink-700 hover:underline font-bold mt-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </Link>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-pink-850 uppercase tracking-wider mb-1">
                Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                required
                placeholder="Enter 123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full bg-[#FFF5F7] border border-pink-200 rounded-xl py-2.5 text-center tracking-widest text-lg font-bold focus:outline-none focus:border-pink-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-pink-850 uppercase tracking-wider mb-1">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="w-4 h-4 text-pink-500" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#FFF5F7] border border-pink-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-pink-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-black/90 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 text-white cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}