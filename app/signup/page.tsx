"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/state";
import { User, Mail, Smartphone, Globe, Flag, ShieldCheck } from "lucide-react";

export default function SignupPage() {
  const { signup } = useAppState();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState<"India" | "International">("India");
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !phone) {
      setError("Please fill out all fields.");
      return;
    }
    if (!agree) {
      setError("You must agree to the Terms and Conditions.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      signup(username, email, phone, country, language);
      router.push("/home");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Glow animations */}
      <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-pink-600/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[120px]" />

      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] my-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black tracking-widest bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(236,72,153,0.3)]">
            PREMROG
          </h1>
          <p className="text-xs text-gray-400 mt-2 font-medium">
            CREATOR ACCOUNT REGISTRATION (V1.0)
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl p-3 mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-4 h-4 text-gray-500" />
              </div>
              <input
                type="text"
                required
                placeholder="e.g. rajesh_kumar"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-pink-500 transition duration-300"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-gray-500" />
              </div>
              <input
                type="email"
                required
                placeholder="e.g. user@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-pink-500 transition duration-300"
              />
            </div>
          </div>

          {/* Mobile number */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Smartphone className="w-4 h-4 text-gray-500" />
              </div>
              <input
                type="tel"
                required
                placeholder="e.g. +91 9999999999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-pink-500 transition duration-300"
              />
            </div>
          </div>

          {/* Country Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Country
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Flag className="w-4 h-4 text-gray-500" />
                </div>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value as "India" | "International")}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-pink-500 transition duration-300 appearance-none"
                >
                  <option value="India" className="bg-gray-900">India (₹)</option>
                  <option value="International" className="bg-gray-900">International ($)</option>
                </select>
              </div>
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Language
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="w-4 h-4 text-gray-500" />
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-pink-500 transition duration-300 appearance-none"
                >
                  <option value="en" className="bg-gray-900">English</option>
                  <option value="hi" className="bg-gray-900">Hindi (हिंदी)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="agree"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-1 accent-pink-500"
            />
            <label htmlFor="agree" className="text-xs text-gray-400 leading-tight">
              I agree to the <Link href="/legal" className="text-pink-500 hover:underline">Terms & Conditions</Link>, <Link href="/legal" className="text-pink-500 hover:underline">Privacy Policy</Link>, and <Link href="/legal" className="text-pink-500 hover:underline">Monetization Guidelines</Link>.
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl transition duration-300 shadow-lg shadow-pink-600/20 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Create Creator Account</span>
              </>
            )}
          </button>
        </form>

        {/* Back to login */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-pink-500 font-bold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}