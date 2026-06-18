"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, ShieldAlert, Send, FileText, CheckCircle } from "lucide-react";

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
    <div className="bg-black text-white min-h-screen font-sans relative overflow-hidden max-w-md mx-auto border-x border-white/5">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-[250px] h-[250px] bg-pink-900/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-20 bg-black/85 backdrop-blur-md border-b border-white/10 p-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-white transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-md font-black tracking-wide bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            SUPPORT CENTER
          </h1>
          <span className="text-[9px] text-gray-500 font-semibold block mt-0.5">official support desk</span>
        </div>
      </header>

      <main className="p-4 space-y-5">
        {/* Official email contact strip */}
        <section className="bg-gradient-to-r from-pink-950/40 to-indigo-950/40 border border-pink-500/20 p-4 rounded-3xl backdrop-blur-md flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-500">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider block">Official Email Support</span>
            <a 
              href="mailto:support.premrog@gmail.com" 
              className="text-xs font-black text-white hover:text-pink-400 transition hover:underline mt-0.5 block"
            >
              support.premrog@gmail.com
            </a>
          </div>
        </section>

        {submitted ? (
          <section className="bg-white/5 border border-white/10 p-6 rounded-3xl text-center space-y-4 backdrop-blur-md animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-green-500/15 text-green-400 flex items-center justify-center mx-auto border border-green-500/20">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Ticket Submitted Successfully</h3>
              <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">
                Your support request has been logged. Our administrative team will respond to your registered email address.
              </p>
            </div>
            
            <div className="bg-black/40 border border-white/5 p-3 rounded-2xl">
              <span className="text-[9px] text-gray-500 uppercase font-medium">Ticket Reference ID</span>
              <span className="text-xs font-black text-pink-500 block mt-1 tracking-wider">{ticketId}</span>
            </div>

            <button
              onClick={() => setSubmitted(false)}
              className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-2.5 rounded-xl text-xs transition"
            >
              File Another Request
            </button>
          </section>
        ) : (
          <form onSubmit={handleSubmitTicket} className="bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-md space-y-4">
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">File Support Ticket</h3>

            {/* Category Select */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Support Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Issue Description */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Describe your issue
              </label>
              <textarea
                required
                rows={4}
                placeholder="Include payment ID, upload file details, or error descriptions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition"
              />
            </div>

            {/* Screenshot attachment simulation */}
            <div className="flex justify-between items-center bg-black/40 border border-white/5 p-3.5 rounded-xl">
              <div>
                <span className="text-xs font-semibold text-gray-200 block">Attach Screenshot</span>
                <span className="text-[9px] text-gray-500 block mt-0.5">Attach payment receipt or UI error</span>
              </div>
              <button
                type="button"
                onClick={() => setScreenshotSim(!screenshotSim)}
                className={`text-[10px] font-bold px-3.5 py-1.5 rounded-xl border transition ${
                  screenshotSim 
                    ? "border-pink-500 text-pink-500 bg-pink-500/5"
                    : "border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {screenshotSim ? "Attached ✓" : "Upload File"}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-pink-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Support Ticket</span>
            </button>
          </form>
        )}

        <section className="bg-red-500/5 border border-red-500/10 p-4 rounded-3xl text-xs flex gap-3 items-center backdrop-blur-md">
          <ShieldAlert className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div>
            <span className="font-bold text-red-400 block">Fraud & Refund Review Policy</span>
            <p className="text-[9px] text-gray-500 mt-0.5 leading-normal">
              Coins are non-refundable. Wallet topups manual disputes require review under payment gateway ledgers.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
