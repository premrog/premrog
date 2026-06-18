"use client";

import React, { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import { useAppState } from "@/lib/state";
import { 
  Coins, 
  DollarSign, 
  Tv, 
  Zap, 
  RefreshCw, 
  Sliders, 
  Download, 
  ArrowRight, 
  Lock, 
  ShieldAlert,
  CreditCard,
  Clock,
  Check
} from "lucide-react";

export default function WalletPage() {
  const { 
    state, 
    rechargeWallet, 
    watchRewardAd, 
    requestWithdrawal, 
    toggleAutoRecharge 
  } = useAppState();

  const isIndia = state.user?.country === "India";
  const currencySymbol = isIndia ? "₹" : "$";

  // State for Recharge forms
  const [rechargeAmt, setRechargeAmt] = useState("");
  const [rechargeMethod, setRechargeMethod] = useState("PhonePe UPI");
  const [paymentID, setPaymentID] = useState("");
  
  // State for Payout forms
  const [payoutAmt, setPayoutAmt] = useState("");
  const [payoutMethod, setPayoutMethod] = useState(isIndia ? "UPI" : "PayPal");
  const [payoutDetails, setPayoutDetails] = useState("");

  // Reward Ad simulation state
  const [adRunning, setAdRunning] = useState(false);
  const [adCountdown, setAdCountdown] = useState(30);
  const [adMessage, setAdMessage] = useState("");

  // Cooldown countdown text
  const [cooldownText, setCooldownText] = useState("");

  useEffect(() => {
    if (state.rewardAdCooldown) {
      const interval = setInterval(() => {
        const remainingMs = new Date(state.rewardAdCooldown!).getTime() - Date.now();
        if (remainingMs <= 0) {
          setCooldownText("");
          clearInterval(interval);
        } else {
          const h = Math.floor(remainingMs / 3600000);
          const m = Math.floor((remainingMs % 3600000) / 60000);
          const s = Math.floor((remainingMs % 60000) / 1000);
          setCooldownText(`${h}h ${m}m ${s}s`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state.rewardAdCooldown]);

  // Simulate watching the 30-sec ad
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (adRunning && adCountdown > 0) {
      timer = setTimeout(() => {
        setAdCountdown(prev => prev - 1);
      }, 1000);
    } else if (adRunning && adCountdown === 0) {
      setAdRunning(false);
      const res = watchRewardAd();
      setAdMessage(res.message);
      setAdCountdown(30);
    }
    return () => clearTimeout(timer);
  }, [adRunning, adCountdown]);

  const handleRechargeSubmit = (e: React.FormEvent, targetWallet: "Coins" | "Cash") => {
    e.preventDefault();
    const amount = parseFloat(rechargeAmt);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid recharge amount.");
      return;
    }

    // Min recharge checks
    if (targetWallet === "Coins") {
      const min = isIndia ? 10 : 1;
      if (amount < min) {
        alert(`Minimum Coins recharge is ${isIndia ? "₹10" : "$1"}`);
        return;
      }
    }

    rechargeWallet(amount, `${rechargeMethod} (${targetWallet})`);
    alert(`Payment of ${currencySymbol}${amount} initiated via ${rechargeMethod}. Balance updated!`);
    setRechargeAmt("");
    setPaymentID("");
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(payoutAmt);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid payout amount.");
      return;
    }
    if (!payoutDetails) {
      alert("Please enter pay details.");
      return;
    }

    const res = requestWithdrawal(amount, payoutMethod, payoutDetails);
    alert(res.message);
    if (res.success) {
      setPayoutAmt("");
      setPayoutDetails("");
    }
  };

  const triggerRewardAd = () => {
    setAdMessage("");
    setAdRunning(true);
  };

  return (
    <div className="bg-black text-white min-h-screen pb-24 font-sans relative overflow-hidden">
      {/* Glow panels */}
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-yellow-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-green-900/10 rounded-full blur-[100px] pointer-events-none" />

      <main className="max-w-md mx-auto px-4 pt-4">
        <h1 className="text-xl font-black mb-6 tracking-wide bg-gradient-to-r from-yellow-500 via-orange-500 to-green-500 bg-clip-text text-transparent">
          PREMROG WALLET HUB (V1.0)
        </h1>

        {/* 1. Coin Wallet Card */}
        <section className="bg-gradient-to-br from-yellow-500/20 via-orange-600/10 to-black border border-yellow-500/20 rounded-3xl p-5 mb-5 backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest block">
                Coins Wallet
              </span>
              <h2 className="text-3xl font-black mt-1 text-white flex items-center gap-1.5">
                <Coins className="w-8 h-8 text-yellow-500" />
                {state.coins}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[9px] bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-bold px-2.5 py-0.5 rounded-full uppercase">
                {isIndia ? "₹1 = 10 Coins" : "$1 = 500 Coins"}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-gray-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-yellow-500" />
            Non-Refundable • Non-Withdrawable • Non-Transferable
          </div>

          {/* Quick recharge form for Coins */}
          <form onSubmit={(e) => handleRechargeSubmit(e, "Coins")} className="mt-5 space-y-3">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Recharge Coins</h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                required
                placeholder={isIndia ? "Min ₹10 (100 Coins)" : "Min $1 (500 Coins)"}
                value={rechargeAmt}
                onChange={(e) => setRechargeAmt(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500"
              />
              <select
                value={rechargeMethod}
                onChange={(e) => setRechargeMethod(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-yellow-500"
              >
                {isIndia ? (
                  <>
                    <option value="PhonePe UPI">PhonePe UPI</option>
                    <option value="Google Play Billing">Google Play IAP</option>
                  </>
                ) : (
                  <>
                    <option value="PayPal Gateway">PayPal ID</option>
                    <option value="Apple In-App Billing">Apple Pay IAP</option>
                  </>
                )}
              </select>
            </div>
            
            <input
              type="text"
              required
              placeholder={isIndia ? "Enter PhonePe UPI Address" : "Enter PayPal email / ID"}
              value={paymentID}
              onChange={(e) => setPaymentID(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500"
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-black font-bold py-2 rounded-xl text-xs transition"
            >
              Authorize Coins Payment
            </button>
          </form>
        </section>

        {/* 2. Cash Wallet Card */}
        <section className="bg-gradient-to-br from-green-500/20 via-emerald-600/10 to-black border border-green-500/20 rounded-3xl p-5 mb-5 backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest block">
                Cash Wallet (India/Intl)
              </span>
              <h2 className="text-3xl font-black mt-1 text-white flex items-center gap-1">
                <DollarSign className="w-8 h-8 text-green-500" />
                {isIndia ? `₹${state.cash}` : `$${state.cash}`}
              </h2>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 mt-2">
            Used to pay upload charges for Reels ({isIndia ? '₹1' : '$0.02'}), Videos ({isIndia ? '₹5' : '$0.07'}), and Movies ({isIndia ? '₹59' : '$0.75'}).
          </p>

          <form onSubmit={(e) => handleRechargeSubmit(e, "Cash")} className="mt-5 space-y-3">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Topup Cash Wallet</h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                required
                placeholder="Enter Topup Amount"
                value={rechargeAmt}
                onChange={(e) => setRechargeAmt(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-green-500"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-2 rounded-xl text-xs transition"
              >
                Topup Cash
              </button>
            </div>
          </form>
        </section>

        {/* 3. Creator Earnings Wallet */}
        <section className="bg-gradient-to-br from-pink-500/20 via-purple-600/10 to-black border border-pink-500/20 rounded-3xl p-5 mb-5 backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest block">
                Creator Earnings
              </span>
              <h2 className="text-3xl font-black mt-1 text-white flex items-center gap-1">
                {isIndia ? `₹${state.earnings}` : `$${state.earnings}`}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[9px] bg-pink-500/10 border border-pink-500/20 text-pink-400 font-bold px-2 py-0.5 rounded uppercase">
                75% Ad Split
              </span>
            </div>
          </div>

          <p className="text-[9px] text-gray-500 mt-2">
            Min Withdrawal: {isIndia ? "₹1000" : "$100"}. Withdrawal requests are manually processed by Super Admins.
          </p>

          {/* Withdrawal Request Form */}
          <form onSubmit={handleWithdrawSubmit} className="mt-5 space-y-3">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Withdraw Earnings</h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                required
                placeholder={isIndia ? "Min ₹1000" : "Min $100"}
                value={payoutAmt}
                onChange={(e) => setPayoutAmt(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-pink-500"
              />
              <select
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
              >
                {isIndia ? (
                  <>
                    <option value="UPI">PhonePe UPI</option>
                    <option value="Bank">Bank Transfer</option>
                  </>
                ) : (
                  <>
                    <option value="PayPal">PayPal</option>
                    <option value="Bank">Bank Transfer</option>
                  </>
                )}
              </select>
            </div>

            <input
              type="text"
              required
              placeholder="UPI ID / PayPal Email / Bank Account Details"
              value={payoutDetails}
              onChange={(e) => setPayoutDetails(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-pink-500"
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-2 rounded-xl text-xs transition"
            >
              Request Payout
            </button>
          </form>
        </section>

        {/* 4. Watch Reward Ads simulation */}
        <section className="bg-white/5 border border-white/10 p-5 rounded-3xl mb-5 backdrop-blur-md">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
            <Tv className="w-4.5 h-4.5 text-pink-500" />
            Reward Ads
          </h3>

          <p className="text-[10px] text-gray-400 leading-normal mb-4">
            Watch a complete 30-second sponsored ad to earn 1 Coin. Valid every 4 hours.
          </p>

          {adRunning ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-pink-500 font-bold animate-pulse">Playing Sponsor Ad...</span>
                <span>{adCountdown} seconds left</span>
              </div>
              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-pink-500 transition-all duration-1000 ease-linear"
                  style={{ width: `${((30 - adCountdown) / 30) * 100}%` }}
                />
              </div>
            </div>
          ) : cooldownText ? (
            <div className="bg-red-500/5 border border-red-500/10 p-3 rounded-2xl flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500" />
                <span>Ad Cooldown Active</span>
              </div>
              <span className="font-bold text-red-400">{cooldownText}</span>
            </div>
          ) : (
            <button
              onClick={triggerRewardAd}
              className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:scale-[1.01] transition"
            >
              <Tv className="w-4 h-4 animate-bounce" />
              Watch Full Reward Ad (+1 Coin)
            </button>
          )}

          {adMessage && (
            <div className="mt-3 text-center bg-green-500/10 border border-green-500/20 text-green-400 p-2 rounded-xl text-[10px] font-bold">
              {adMessage}
            </div>
          )}
        </section>

        {/* 5. Auto Recharge settings */}
        <section className="bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-md">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-4">
            <Sliders className="w-4.5 h-4.5 text-pink-500" />
            Auto Recharge Config
          </h3>

          <div className="space-y-4">
            {(["photo", "story", "reel", "video", "movie"] as const).map((type) => (
              <div key={type} className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-gray-200 capitalize">{type} Auto-Recharge</span>
                  <span className="text-[9px] text-gray-500 block mt-0.5">
                    Auto-deduct when upload expires (28 Days)
                  </span>
                </div>
                
                <button
                  onClick={() => toggleAutoRecharge(type)}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${
                    state.autoRecharge[type] ? "bg-pink-500" : "bg-gray-700"
                  }`}
                >
                  <div 
                    className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                      state.autoRecharge[type] ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}