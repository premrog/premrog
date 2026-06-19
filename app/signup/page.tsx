"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/state";
import { User, Mail, Smartphone, Globe, Flag } from "lucide-react";

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
  const [age, setAge] = useState("");
  const [guardianPan, setGuardianPan] = useState("");
  const [creatorPan, setCreatorPan] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !phone || !age) {
      setError("Please fill out all fields.");
      return;
    }
    
    const parsedAge = parseInt(age);
    if (isNaN(parsedAge) || parsedAge < 14) {
      setError("Absolute compliance block: Registration is restricted for users under 14 years old.");
      return;
    }

    if (parsedAge >= 15 && parsedAge <= 17 && !guardianPan) {
      setError("Compliance gate: Creators aged 15-17 must map a legal adult guardian's verified PAN.");
      return;
    }

    if (parsedAge >= 18 && !creatorPan) {
      setError("Compliance gate: Creators aged 18+ must register a verified PAN card.");
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
      
      // Update registration details in the state
      const finalState = localStorage.getItem("premrog_state");
      if (finalState) {
        const parsed = JSON.parse(finalState);
        parsed.user.age = parsedAge;
        parsed.user.panCard = parsedAge >= 18 ? creatorPan : undefined;
        parsed.user.guardianPan = (parsedAge >= 15 && parsedAge <= 17) ? guardianPan : undefined;
        parsed.user.taxStatus = "verified";
        localStorage.setItem("premrog_state", JSON.stringify(parsed));
      }
      
      router.push("/home");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-[#000000] flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
      {/* Brand accent blurs */}
      <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-pink-300/20 blur-[100px]" />
      <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-pink-400/10 blur-[100px]" />

      <div className="w-full max-w-md bg-white border border-pink-200 rounded-3xl p-8 shadow-md my-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black tracking-widest bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            PREMROG
          </h1>
          <p className="text-xs text-pink-700 mt-2 font-bold uppercase tracking-wider">
            CREATOR ACCOUNT REGISTRATION (V19)
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-250 text-rose-600 text-xs rounded-xl p-3.5 mb-4 text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-[10px] font-bold text-pink-850 uppercase tracking-wider mb-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-4 h-4 text-pink-600" />
              </div>
              <input
                type="text"
                required
                placeholder="e.g. rajesh_kumar"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#FFF5F7] border border-pink-200 rounded-xl py-2.5 pl-10 pr-4 text-black text-sm placeholder-pink-400 focus:outline-none focus:border-pink-500 transition duration-300"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] font-bold text-pink-850 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-pink-600" />
              </div>
              <input
                type="email"
                required
                placeholder="e.g. user@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FFF5F7] border border-pink-200 rounded-xl py-2.5 pl-10 pr-4 text-black text-sm placeholder-pink-400 focus:outline-none focus:border-pink-500 transition duration-300"
              />
            </div>
          </div>

          {/* Mobile number */}
          <div>
            <label className="block text-[10px] font-bold text-pink-850 uppercase tracking-wider mb-1">
              Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Smartphone className="w-4 h-4 text-pink-600" />
              </div>
              <input
                type="tel"
                required
                placeholder="e.g. +91 9999999999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#FFF5F7] border border-pink-200 rounded-xl py-2.5 pl-10 pr-4 text-black text-sm placeholder-pink-400 focus:outline-none focus:border-pink-500 transition duration-300"
              />
            </div>
          </div>

          {/* Age Gate Input */}
          <div>
            <label className="block text-[10px] font-bold text-pink-850 uppercase tracking-wider mb-1">
              Age (Mandatory Gate)
            </label>
            <input
              type="number"
              required
              placeholder="Minimum age 14 required"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full bg-[#FFF5F7] border border-pink-200 rounded-xl py-2.5 px-4 text-black text-sm placeholder-pink-400 focus:outline-none focus:border-pink-500 transition"
            />
            <span className="text-[8px] text-pink-700 block mt-1 font-semibold">
              * Age 15-17 requires Guardian PAN. Age 18+ requires Creator PAN.
            </span>
          </div>

          {/* Minor Guardian PAN mapping */}
          {parseInt(age) >= 15 && parseInt(age) <= 17 && (
            <div>
              <label className="block text-[10px] font-bold text-pink-850 uppercase tracking-wider mb-1">
                Guardian&apos;s Verified PAN Card
              </label>
              <input
                type="text"
                required
                placeholder="Guardian's PAN"
                value={guardianPan}
                onChange={(e) => setGuardianPan(e.target.value)}
                className="w-full bg-[#FFF5F7] border border-pink-200 rounded-xl py-2.5 px-4 text-black text-sm font-mono placeholder-pink-400 focus:outline-none focus:border-pink-500 transition"
              />
            </div>
          )}

          {/* Creator PAN mapping */}
          {parseInt(age) >= 18 && (
            <div>
              <label className="block text-[10px] font-bold text-pink-850 uppercase tracking-wider mb-1">
                Creator PAN Card
              </label>
              <input
                type="text"
                required
                placeholder="10-digit PAN (e.g. ABCDE1234F)"
                value={creatorPan}
                onChange={(e) => setCreatorPan(e.target.value)}
                className="w-full bg-[#FFF5F7] border border-pink-200 rounded-xl py-2.5 px-4 text-black text-sm font-mono placeholder-pink-400 focus:outline-none focus:border-pink-500 transition"
              />
            </div>
          )}

          {/* Country & Language Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-pink-850 uppercase tracking-wider mb-1">
                Country
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Flag className="w-4 h-4 text-pink-500" />
                </div>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value as "India" | "International")}
                  className="w-full bg-[#FFF5F7] border border-pink-200 rounded-xl py-2.5 pl-10 pr-4 text-black text-sm focus:outline-none focus:border-pink-500 transition appearance-none cursor-pointer"
                >
                  <option value="India">India (₹)</option>
                  <option value="International">International ($)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-pink-850 uppercase tracking-wider mb-1">
                Language
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="w-4 h-4 text-pink-500" />
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
                  className="w-full bg-[#FFF5F7] border border-pink-200 rounded-xl py-2.5 pl-10 pr-4 text-black text-sm focus:outline-none focus:border-pink-500 transition appearance-none cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
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
              className="mt-1 accent-pink-650 cursor-pointer"
            />
            <label htmlFor="agree" className="text-xs text-pink-900 leading-tight font-medium">
              I agree to the <Link href="/legal" className="text-pink-600 font-bold hover:underline">Terms & Conditions</Link>, <Link href="/legal" className="text-pink-600 font-bold hover:underline">Privacy Policy</Link>, and <Link href="/legal" className="text-pink-600 font-bold hover:underline">Monetization split ledger guidelines</Link>.
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-black/90 text-white font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-pink-500" />
                <span>Create Creator Account</span>
              </>
            )}
          </button>
        </form>

        {/* Back to login */}
        <p className="text-center text-sm text-[#000000] mt-6 font-semibold">
          Already have an account?{" "}
          <Link href="/login" className="text-pink-600 font-black hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

// Simple fallback icon
function ShieldCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
      />
    </svg>
  );
}