"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, ShieldAlert, Send, CheckCircle } from "lucide-react";

export default function SupportPage() {
  const router = useRouter();

  const [category, setCategory] = useState("Account Issues");
  const [description, setDescription] = useState("");
  const [screenshotSim, setScreenshotSim] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const categories = [
    "Account Issues",
    "Recharge Issues",
    "Wallet Issues",
    "Withdrawal Issues",
    "Creator Issues",
    "Advertiser Issues",
    "Copyright Issues",
    "Technical Support"
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert("Please describe your issue.");
      return;
    }

    setTicketId(`PR-${Math.floor(100000 + Math.random() * 900000)}`);
    setSubmitted(true);
    setDescription("");
    setScreenshotSim(false);
  };

  return (
    <div className="bg-[#FFF5F7] text-[#000000] min-h-screen font-sans relative overflow-hidden max-w-md mx-auto border-x border-pink-200">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-[250px] h-[250px] bg-pink-300/20 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-pink-200 p-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-[#000000]/70 hover:text-pink-600 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-md font-black tracking-wide text-pink-600">
            SUPPORT CENTER
          </h1>
          <span className="text-[9px] text-[#000000]/60 font-semibold block mt-0.5">official support desk</span>
        </div>
      </header>

      <main className="p-4 space-y-5">
        {/* Official email contact strip */}
        <section className="bg-white border border-pink-200 p-4 rounded-3xl flex items-center gap-3 shadow-xs">
          <div className="p-2.5 rounded-xl bg-pink-100 text-pink-600">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-[#000000]/60 uppercase font-bold tracking-wider block">Official Email Support</span>
            <a 
              href="mailto:support.premrog@gmail.com" 
              className="text-xs font-black text-pink-600 hover:text-pink-500 transition hover:underline mt-0.5 block"
            >
              support.premrog@gmail.com
            </a>
          </div>
        </section>

        {submitted ? (
          <section className="bg-white border border-pink-200 p-6 rounded-3xl text-center space-y-4 shadow-sm animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-250">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-black">Ticket Submitted Successfully</h3>
              <p className="text-[10px] text-[#000000]/70 mt-1.5 leading-relaxed">
                Your support request has been logged. Our administrative team will respond to your registered email address.
              </p>
            </div>
            
            <div className="bg-pink-50 border border-pink-100 p-3 rounded-2xl">
              <span className="text-[9px] text-pink-700 uppercase font-medium">Ticket Reference ID</span>
              <span className="text-xs font-black text-pink-600 block mt-1 tracking-wider">{ticketId}</span>
            </div>

            <button
              onClick={() => setSubmitted(false)}
              className="w-full bg-[#000000] hover:bg-[#000000]/95 text-white font-bold py-2.5 rounded-xl text-xs transition"
            >
              File Another Request
            </button>
          </section>
        ) : (
          <form onSubmit={handleSubmitTicket} className="bg-white border border-pink-200 p-5 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-pink-600 uppercase tracking-wider">File Support Ticket</h3>

            {/* Category Select */}
            <div>
              <label className="block text-[10px] font-bold text-[#000000]/70 uppercase tracking-wider mb-1">
                Support Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-pink-250 rounded-xl p-2.5 text-xs text-[#000000] focus:outline-none focus:border-pink-500 cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Issue Description */}
            <div>
              <label className="block text-[10px] font-bold text-[#000000]/70 uppercase tracking-wider mb-1">
                Describe your issue
              </label>
              <textarea
                required
                rows={4}
                placeholder="Include payment ID, upload file details, or error descriptions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-pink-250 rounded-xl p-3 text-xs text-[#000000] placeholder-pink-400/70 focus:outline-none focus:border-pink-500 transition"
              />
            </div>

            {/* Screenshot attachment simulation */}
            <div className="flex justify-between items-center bg-pink-50 border border-pink-100 p-3.5 rounded-xl">
              <div>
                <span className="text-xs font-semibold text-pink-900 block">Attach Screenshot</span>
                <span className="text-[9px] text-[#000000]/60 block mt-0.5">Attach payment receipt or UI error</span>
              </div>
              <button
                type="button"
                onClick={() => setScreenshotSim(!screenshotSim)}
                className={`text-[10px] font-bold px-3.5 py-1.5 rounded-xl border transition ${
                  screenshotSim 
                    ? "border-pink-600 text-pink-600 bg-pink-100"
                    : "border-pink-250 text-pink-600 hover:bg-pink-50"
                }`}
              >
                {screenshotSim ? "Attached ✓" : "Upload File"}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Support Ticket</span>
            </button>
          </form>
        )}

        <section className="bg-rose-50 border border-rose-200 p-4 rounded-3xl text-xs flex gap-3 items-center shadow-xs">
          <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <div>
            <span className="font-bold text-rose-800 block">Fraud & Refund Review Policy</span>
            <p className="text-[9px] text-rose-950 mt-0.5 leading-normal">
              Coins are non-refundable. Wallet topups manual disputes require review under payment gateway ledgers.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
