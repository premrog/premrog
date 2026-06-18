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
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-pink-600/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[120px]" />

      <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <h1 className="text-2xl font-black text-pink-500 mb-2 text-center tracking-wide">
          Reset Password
        </h1>
        <p className="text-xs text-gray-400 text-center mb-6">
          Recover your Premrog account access
        </p>

        {success ? (
          <div className="space-y-4 text-center">
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-sm">
              Password updated successfully! You can now log in.
            </div>
            <Link
              href="/login"
              className="block w-full bg-pink-600 hover:bg-pink-500 py-3 rounded-xl font-bold transition text-center"
            >
              Go to Login
            </Link>
          </div>
        ) : !submitted ? (
          <form onSubmit={handleSendReset} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Mobile Number or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {emailOrPhone.includes("@") ? (
                    <Mail className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Smartphone className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <input
                  type="text"
                  required
                  placeholder="Enter registered mobile or email"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-pink-500 transition duration-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 hover:bg-pink-500 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Send Verification Code"
              )}
            </button>

            <Link
              href="/login"
              className="flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-white transition mt-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </Link>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                required
                placeholder="Enter 6-digit code (any code)"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 text-center tracking-widest text-lg font-bold focus:outline-none focus:border-pink-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-pink-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 hover:bg-pink-500 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
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