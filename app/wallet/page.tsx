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
  Check,
  Building,
  UserCheck,
  Smartphone,
  Globe,
  Info
} from "lucide-react";

export default function WalletPage() {
  const { 
    state, 
    rechargeWallet, 
    watchRewardAd, 
    requestWithdrawal, 
    toggleAutoRecharge,
    updateProfile
  } = useAppState();

  const isIndia = state.user?.country === "India";
  const currencySymbol = isIndia ? "₹" : "$";

  // State for Recharge forms
  const [rechargeAmt, setRechargeAmt] = useState("");
  const [rechargeMethod, setRechargeMethod] = useState("Google Play Billing");
  const [paymentID, setPaymentID] = useState("");

  // Google Play & Apple iOS compliance simulation state
  const [platform, setPlatform] = useState<"web" | "android" | "ios">("android");
  const [userChoiceBilling, setUserChoiceBilling] = useState(false);
  const [externalPurchase, setExternalPurchase] = useState(false);
  const [showAppleDisclosure, setShowAppleDisclosure] = useState(false);
  const [showGoogleChoice, setShowGoogleChoice] = useState(false);
  
  // State for Payout forms
  const [payoutAmt, setPayoutAmt] = useState("");
  const [payoutMethod, setPayoutMethod] = useState(isIndia ? "UPI" : "PayPal");
  const [payoutDetails, setPayoutDetails] = useState(state.user?.bankAccount || "");

  // State for Tax Compliance Form
  const [panCard, setPanCard] = useState(state.user?.panCard || "");
  const [taxForm, setTaxForm] = useState(state.user?.taxForm || "");
  const [bankAccount, setBankAccount] = useState(state.user?.bankAccount || "");
  const [guardianPan, setGuardianPan] = useState(state.user?.guardianPan || "");
  const [age, setAge] = useState(state.user?.age !== undefined ? String(state.user.age) : "25");

  // Reward Ad simulation state
  const [adRunning, setAdRunning] = useState(false);
  const [adCountdown, setAdCountdown] = useState(30);
  const [adMessage, setAdMessage] = useState("");

  // Cooldown countdown text
  const [cooldownText, setCooldownText] = useState("");

  // Update default recharge method when platform changes
  useEffect(() => {
    if (platform === "web") {
      setRechargeMethod(isIndia ? "PhonePe UPI" : "PayPal Gateway");
    } else if (platform === "android") {
      setRechargeMethod("Google Play Billing");
    } else if (platform === "ios") {
      setRechargeMethod("Apple In-App Billing");
    }
  }, [platform, isIndia]);

  // Calculate dynamic settlement date
  // July 28th, 2026 is Tuesday. If it is a weekend, we shift to Monday.
  const getPayoutClearanceDateText = () => {
    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1; // next month
    if (month > 11) {
      month = 0;
      year += 1;
    }
    const clearanceDate = new Date(year, month, 28);
    const day = clearanceDate.getDay();
    let isShifted = false;
    
    // Saturday (6) or Sunday (0) shifts to Monday
    if (day === 6) {
      clearanceDate.setDate(clearanceDate.getDate() + 2);
      isShifted = true;
    } else if (day === 0) {
      clearanceDate.setDate(clearanceDate.getDate() + 1);
      isShifted = true;
    }
    
    return {
      dateString: clearanceDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      isShifted
    };
  };

  const payoutClearance = getPayoutClearanceDateText();

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
          const hStr = String(h).padStart(2, '0');
          const mStr = String(m).padStart(2, '0');
          const sStr = String(s).padStart(2, '0');
          setCooldownText(`${hStr}:${mStr}:${sStr}`);
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

    // Google Play Policy Block Check
    if (platform === "android" && !userChoiceBilling && rechargeMethod.includes("PhonePe")) {
      alert("Compliance Error: Direct PhonePe UPI payments inside native Android apps violate Google Play Developer Policy Section 3. Use Google Play Billing or enable User Choice Billing.");
      return;
    }

    // Apple App Store Policy Block Check
    if (platform === "ios" && !externalPurchase && rechargeMethod.includes("PayPal")) {
      alert("Compliance Error: Direct PayPal web checkout inside native iOS apps violates App Store Guideline 3.1.1. Use Apple In-App Purchase or enable External Purchase Link Entitlement.");
      return;
    }

    // Google Choice System trigger
    if (platform === "android" && userChoiceBilling && rechargeMethod.includes("PhonePe")) {
      setShowGoogleChoice(true);
      return;
    }

    // Apple Disclosure trigger
    if (platform === "ios" && externalPurchase && rechargeMethod.includes("PayPal")) {
      setShowAppleDisclosure(true);
      return;
    }

    executeRecharge(amount, targetWallet, rechargeMethod);
  };

  const executeRecharge = (amount: number, targetWallet: "Coins" | "Cash", method: string) => {
    const res = rechargeWallet(amount, `${method} (${targetWallet})`);
    alert(res.message);
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
      alert("Please enter payout routing address (UPI/Bank Account).");
      return;
    }

    const res = requestWithdrawal(amount, payoutMethod, payoutDetails);
    alert(res.message);
    if (res.success) {
      setPayoutAmt("");
    }
  };

  const handleTaxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userAge = parseInt(age);

    if (isNaN(userAge) || userAge < 14) {
      alert("Compliance Error: Registration blocked for instances under 14 years old.");
      return;
    }

    // minor creator check
    if (userAge >= 15 && userAge <= 17 && !guardianPan) {
      alert("Compliance Error: Creators aged 15-17 must map a legal adult guardian's verified PAN Card.");
      return;
    }

    const activePan = userAge <= 17 ? guardianPan : panCard;
    if (!activePan) {
      alert("Compliance Error: PAN card registration details are required for tax compliance.");
      return;
    }

    // Identity Mapping: 1 Unique PAN = 1 Unique UPI/Bank account
    // Simulate duplicate identity check
    if (activePan === "PAN_DUPLICATE_LOCK" || activePan === "1234567890") {
      updateProfile({
        isSuspended: true,
        isBanned: true,
        taxStatus: "rejected"
      });
      alert("⚠️ Compliance Violation Detected: Duplicate PAN Identity matching detected across nodes. Profile placed under lockdown.");
      return;
    }

    updateProfile({
      age: userAge,
      panCard: panCard || undefined,
      guardianPan: guardianPan || undefined,
      taxForm: taxForm || undefined,
      bankAccount: bankAccount,
      taxStatus: "verified"
    });

    alert("Tax compliance data submitted. Identity status verified successfully!");
  };

  const triggerRewardAd = () => {
    setAdMessage("");
    setAdRunning(true);
  };

  // Sync speed check message
  const getRechargeOptions = () => {
    if (platform === "web") {
      return isIndia ? (
        <option value="PhonePe UPI">PhonePe UPI (Web)</option>
      ) : (
        <option value="PayPal Gateway">PayPal Gateway (Web)</option>
      );
    } else if (platform === "android") {
      return userChoiceBilling ? (
        <>
          <option value="Google Play Billing">Google Play Billing (Native)</option>
          <option value="PhonePe UPI">PhonePe UPI (Alternative System)</option>
        </>
      ) : (
        <option value="Google Play Billing">Google Play Billing (Native Only)</option>
      );
    } else {
      // ios
      return externalPurchase ? (
        <>
          <option value="Apple In-App Billing">Apple In-App Purchase (Native)</option>
          <option value="PayPal Gateway">PayPal Gateway (External Purchase)</option>
        </>
      ) : (
        <option value="Apple In-App Billing">Apple In-App Purchase (Native Only)</option>
      );
    }
  };

  const isWebSync = rechargeMethod.startsWith("PhonePe") || rechargeMethod.startsWith("PayPal");

  if (state.user?.isBanned || state.user?.isSuspended) {
    return (
      <div className="bg-[#FFF5F7] text-[#000000] min-h-screen flex flex-col justify-center items-center p-6 text-center font-sans">
        <ShieldAlert className="w-16 h-16 text-rose-600 mb-4 animate-bounce" />
        <h2 className="text-xl font-black uppercase text-rose-600">Account Lockdown Active</h2>
        <p className="text-xs text-[#000000] mt-2 max-w-sm leading-relaxed">
          Your profile has been locked down due to compliance breaches. Duplicate PAN mapping detection has flagged this node:
        </p>
        <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-2xl text-[10px] font-bold text-rose-600 mt-4 w-full max-w-xs">
          1 Unique PAN = 1 Unique Bank Account = 1 Node Mapped
        </div>
        <button 
          onClick={() => {
            updateProfile({ isBanned: false, isSuspended: false, taxStatus: "verified", panCard: "ABCDE1234F" });
            window.location.reload();
          }}
          className="mt-6 bg-[#000000] text-[#FFF5F7] px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-[#000000]/90 transition"
        >
          Reset Profile Compliance
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF5F7] text-[#000000] min-h-screen pb-24 font-sans relative overflow-hidden">
      {/* Decorative Brand Accents */}
      <div className="absolute top-0 left-1/4 w-[250px] h-[250px] bg-pink-300/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[280px] h-[280px] bg-pink-400/10 rounded-full blur-[90px] pointer-events-none" />

      <main className="max-w-md mx-auto px-4 pt-4">
        <h1 className="text-xl font-black mb-6 tracking-wide text-[#000000] flex items-center gap-1">
          <Coins className="w-6 h-6 text-pink-600" />
          <span>PREMROG WALLET HUB (V19)</span>
        </h1>

        {/* Store Billing Compliance Controller */}
        <section className="bg-white border border-pink-200 rounded-3xl p-5 mb-5 shadow-sm">
          <h3 className="text-xs font-bold text-pink-600 uppercase tracking-widest flex items-center gap-1.5 mb-2">
            <Sliders className="w-4.5 h-4.5 text-pink-500" />
            Simulated Billing Environment
          </h3>
          <p className="text-[10px] text-[#000000] mb-4">
            Toggle the simulated runtime to review compliance with Google Play Store Billing policies and Apple App Store Review Guideline 3.1.1.
          </p>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <button
              onClick={() => setPlatform("web")}
              className={`py-2 rounded-xl text-[10px] font-bold border transition ${
                platform === "web"
                  ? "bg-pink-600 border-pink-600 text-white"
                  : "bg-white border-pink-200 text-[#000000] hover:bg-pink-50"
              }`}
            >
              🌐 Web Client
            </button>
            <button
              onClick={() => setPlatform("android")}
              className={`py-2 rounded-xl text-[10px] font-bold border transition ${
                platform === "android"
                  ? "bg-pink-600 border-pink-600 text-white"
                  : "bg-white border-pink-200 text-[#000000] hover:bg-pink-50"
              }`}
            >
              🤖 Android App
            </button>
            <button
              onClick={() => setPlatform("ios")}
              className={`py-2 rounded-xl text-[10px] font-bold border transition ${
                platform === "ios"
                  ? "bg-pink-600 border-pink-600 text-white"
                  : "bg-white border-pink-200 text-[#000000] hover:bg-pink-50"
              }`}
            >
              🍎 iOS App
            </button>
          </div>

          {platform === "android" && (
            <div className="bg-pink-50 border border-pink-100 p-3 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#000000]">User Choice Billing (India/EEA)</span>
                <button
                  type="button"
                  onClick={() => setUserChoiceBilling(prev => !prev)}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 ${
                    userChoiceBilling ? "bg-pink-600" : "bg-pink-200"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                      userChoiceBilling ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
              <p className="text-[9px] text-pink-950 leading-relaxed">
                Allow alternative payment choices in specific markets. Under user choice, Google collects a reduced service fee (usually 4% less) on third-party transactions.
              </p>
            </div>
          )}

          {platform === "ios" && (
            <div className="bg-pink-50 border border-pink-100 p-3 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#000000]">External Purchase Link Entitlement</span>
                <button
                  type="button"
                  onClick={() => setExternalPurchase(prev => !prev)}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 ${
                    externalPurchase ? "bg-pink-600" : "bg-pink-200"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                      externalPurchase ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
              <p className="text-[9px] text-pink-950 leading-relaxed">
                Allows external web checkout links. In compliance with Apple guidelines, developers must display standard disclosures and report sales to pay commission (12%-27%).
              </p>
            </div>
          )}

          {platform === "web" && (
            <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl text-[9px] text-emerald-950 leading-normal">
              <strong>🌐 Web Store Rules Active:</strong> Users browsing www.premrog.com can pay directly using credit cards, UPI, or PayPal. Native mobile App Store commission policies do not apply.
            </div>
          )}
        </section>

        {/* 1. Coin Wallet Card */}
        <section className="bg-white border border-pink-200 rounded-3xl p-5 mb-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-pink-600 uppercase tracking-widest block">
                Coins Wallet
              </span>
              <h2 className="text-3xl font-black mt-1 text-[#000000] flex items-center gap-1.5">
                <Coins className="w-8 h-8 text-pink-500" />
                {state.coins}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[9px] bg-pink-100 border border-pink-200 text-pink-600 font-bold px-2.5 py-0.5 rounded-full uppercase">
                {isIndia ? "₹1 = 10 Coins" : "$1 = 500 Coins"}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-pink-100 text-[10px] text-pink-800 font-medium flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-pink-500" />
            Non-Refundable • Non-Withdrawable • Non-Transferable
          </div>

          {/* Quick recharge form for Coins */}
          <form onSubmit={(e) => handleRechargeSubmit(e, "Coins")} className="mt-5 space-y-3">
            <h4 className="text-[10px] font-bold text-[#000000] uppercase tracking-wider">Recharge Coins</h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                required
                placeholder={isIndia ? "Min ₹10 (100 Coins)" : "Min $1 (500 Coins)"}
                value={rechargeAmt}
                onChange={(e) => setRechargeAmt(e.target.value)}
                className="bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs text-[#000000] placeholder-pink-400/70 focus:outline-none focus:border-pink-500"
              />
              <select
                value={rechargeMethod}
                onChange={(e) => setRechargeMethod(e.target.value)}
                className="bg-white border border-pink-200 rounded-xl px-2 py-2 text-xs text-[#000000] focus:outline-none focus:border-pink-500 cursor-pointer"
              >
                {getRechargeOptions()}
              </select>
            </div>
            
            {rechargeMethod.includes("PhonePe") || rechargeMethod.includes("PayPal") ? (
              <input
                type="text"
                required
                placeholder={isIndia ? "Enter PhonePe UPI ID / Payment Addr" : "Enter PayPal Billing Address"}
                value={paymentID}
                onChange={(e) => setPaymentID(e.target.value)}
                className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs text-[#000000] placeholder-pink-400/70 focus:outline-none focus:border-pink-500"
              />
            ) : null}

            {/* Store Policy & Guidelines Alerts */}
            {platform === "android" && !userChoiceBilling && (
              <div className="text-[9px] text-rose-700 bg-rose-50 border border-rose-200/50 p-2.5 rounded-xl flex gap-1.5 items-start">
                <ShieldAlert className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Google Play Policy Block (Section 3):</strong> Exclusive Google Play Billing mandated for digital assets. Direct PhonePe checkout is locked.
                </span>
              </div>
            )}
            {platform === "android" && userChoiceBilling && (
              <div className="text-[9px] text-blue-700 bg-blue-50 border border-blue-200/50 p-2.5 rounded-xl flex gap-1.5 items-start">
                <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Google Play User Choice Billing:</strong> PhonePe UPI is allowed. Google levies an 11% to 26% service commission. Standard choice dialogues apply.
                </span>
              </div>
            )}
            {platform === "ios" && !externalPurchase && (
              <div className="text-[9px] text-rose-700 bg-rose-50 border border-rose-200/50 p-2.5 rounded-xl flex gap-1.5 items-start">
                <ShieldAlert className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Apple Review Guideline 3.1.1:</strong> Digital goods (Coins) must strictly go through Apple In-App Purchase. External PayPal link is blocked.
                </span>
              </div>
            )}
            {platform === "ios" && externalPurchase && (
              <div className="text-[9px] text-blue-700 bg-blue-50 border border-blue-200/50 p-2.5 rounded-xl flex gap-1.5 items-start">
                <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Apple External Purchase Entitlement:</strong> Direct PayPal web link active. Requires Apple standard system disclosure. Apple collects a 12% to 27% commission.
                </span>
              </div>
            )}

            {/* Sync Speed Warning */}
            {isWebSync ? (
              <div className="text-[9px] text-amber-700 bg-amber-50 border border-amber-200/50 p-2.5 rounded-xl flex gap-1.5 items-start">
                <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span><strong>Web Gateway Hold Sync:</strong> PhonePe/PayPal transactions require a <strong>24 to 48 Hours</strong> hold ledger sync verification before successful coins/cash credit.</span>
              </div>
            ) : (
              <div className="text-[9px] text-emerald-700 bg-emerald-50 border border-emerald-200/50 p-2.5 rounded-xl flex gap-1.5 items-start">
                <Zap className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>Instant Mobile In-App Sync:</strong> Native SDK builds (Google Play Billing / Apple Pay IAP) guarantee <strong>instant execution (तुरंत क्रेडिट)</strong>.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#000000] hover:bg-[#000000]/90 text-[#FFF5F7] font-bold py-2 rounded-xl text-xs transition"
            >
              Authorize Coins Payment
            </button>
          </form>
        </section>

        {/* 2. Cash Wallet Card */}
        <section className="bg-white border border-pink-200 rounded-3xl p-5 mb-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-pink-600 uppercase tracking-widest block">
                Cash Wallet
              </span>
              <h2 className="text-3xl font-black mt-1 text-[#000000] flex items-center gap-1">
                <DollarSign className="w-8 h-8 text-pink-500" />
                {isIndia ? `₹${state.cash}` : `$${state.cash}`}
              </h2>
            </div>
          </div>

          <p className="text-[10px] text-pink-900 mt-2 bg-pink-100/50 p-2.5 rounded-xl border border-pink-100 font-medium">
            Used to pay upload Ingestion Fees for Reels ({isIndia ? "₹1" : "$0.02"}), Videos ({isIndia ? "₹5" : "$0.07"}), and Movies ({isIndia ? "₹59" : "$0.80"}).
          </p>

          <form onSubmit={(e) => handleRechargeSubmit(e, "Cash")} className="mt-5 space-y-3">
            <h4 className="text-[10px] font-bold text-[#000000] uppercase tracking-wider">Topup Cash Wallet</h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                required
                placeholder="Enter Topup Amount"
                value={rechargeAmt}
                onChange={(e) => setRechargeAmt(e.target.value)}
                className="bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs text-[#000000] placeholder-pink-400/70 focus:outline-none focus:border-pink-500"
              />
              <select
                value={rechargeMethod}
                onChange={(e) => setRechargeMethod(e.target.value)}
                className="bg-white border border-pink-200 rounded-xl px-2 py-2 text-xs text-[#000000] focus:outline-none focus:border-pink-500 cursor-pointer"
              >
                {getRechargeOptions()}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-[#000000] hover:bg-[#000000]/90 text-[#FFF5F7] font-bold py-2 rounded-xl text-xs transition"
            >
              Topup Cash
            </button>
          </form>
        </section>

        {/* 3. Identity Compliance & Tax Verification Gate */}
        <section className="bg-white border border-pink-200 rounded-3xl p-5 mb-5 shadow-sm">
          <h3 className="text-xs font-bold text-pink-600 uppercase tracking-widest flex items-center gap-1.5 mb-2">
            <UserCheck className="w-4 h-4 text-pink-500" />
            Identity Verification Gate
          </h3>

          <p className="text-[10px] text-[#000000] mb-4">
            India creators must submit a verified PAN. International creators must submit localized tax certification forms. Age limit rules strictly apply.
          </p>

          <form onSubmit={handleTaxSubmit} className="space-y-3 border-t border-pink-100 pt-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[8px] font-bold text-pink-700 uppercase tracking-wider mb-1">Creator Age</label>
                <input 
                  type="number"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Age"
                  className="w-full bg-white border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-[#000000] focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-[8px] font-bold text-pink-700 uppercase tracking-wider mb-1">Status</label>
                <span className={`inline-block w-full text-center text-xs font-bold px-2 py-1.5 rounded-xl border ${
                  state.user?.taxStatus === "verified"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                    : "bg-amber-50 border-amber-200 text-amber-600"
                }`}>
                  {state.user?.taxStatus === "verified" ? "✓ Verified" : "⚠️ Review Needed"}
                </span>
              </div>
            </div>

            {parseInt(age) >= 15 && parseInt(age) <= 17 && (
              <div>
                <label className="block text-[8px] font-bold text-pink-700 uppercase tracking-wider mb-1">Guardian&apos;s Verified PAN Card</label>
                <input 
                  type="text"
                  required
                  value={guardianPan}
                  onChange={(e) => setGuardianPan(e.target.value)}
                  placeholder="Enter Guardian's PAN"
                  className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs text-[#000000] placeholder-pink-400 focus:outline-none focus:border-pink-500 font-mono"
                />
              </div>
            )}

            {parseInt(age) >= 18 && (
              <div>
                <label className="block text-[8px] font-bold text-pink-700 uppercase tracking-wider mb-1">
                  {isIndia ? "Creator PAN Card (10-digit)" : "Local Statutory Tax Certificate ID"}
                </label>
                <input 
                  type="text"
                  required
                  value={panCard}
                  onChange={(e) => setPanCard(e.target.value)}
                  placeholder={isIndia ? "ABCDE1234F" : "Tax Form ID"}
                  className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs text-[#000000] placeholder-pink-400 focus:outline-none focus:border-pink-500 font-mono"
                />
              </div>
            )}

            <div>
              <label className="block text-[8px] font-bold text-pink-700 uppercase tracking-wider mb-1">UPI ID / Bank Account Details</label>
              <input 
                type="text"
                required
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                placeholder="UPI ID or Bank Account No"
                className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs text-[#000000] placeholder-pink-400 focus:outline-none focus:border-pink-500 font-mono"
              />
            </div>

            <div className="text-[8px] text-pink-800 leading-tight">
              * Verification mapping is strictly index locked: 1 PAN = 1 UPI/Bank = 1 Active Node. Duplicate identity locks accounts immediately.
            </div>

            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-2 rounded-xl text-xs transition"
            >
              Verify Tax & Age Compliance
            </button>
          </form>
        </section>

        {/* 4. Creator Earnings Wallet */}
        <section className="bg-white border border-pink-200 rounded-3xl p-5 mb-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-pink-600 uppercase tracking-widest block">
                Creator Earnings (Settled Ledger)
              </span>
              <h2 className="text-3xl font-black mt-1 text-[#000000] flex items-center gap-1">
                {isIndia ? `₹${state.earnings}` : `$${state.earnings}`}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[9px] bg-pink-100 border border-pink-200 text-pink-600 font-bold px-2 py-0.5 rounded uppercase">
                75% Creator Split
              </span>
            </div>
          </div>

          {/* Threshold Carry-Forward Status */}
          {((isIndia && state.earnings < 1000) || (!isIndia && state.earnings < 100)) ? (
            <div className="mt-3 p-2 bg-amber-50 border border-amber-200 text-amber-800 text-[9px] font-semibold rounded-xl leading-normal">
              ⚠️ Carry-Forward Mechanism Active: Wallet balance is below the payout floor threshold ({isIndia ? "₹1,000" : "$100 USD"}). Earnings will automatically roll forward to next month&apos;s pool without decay.
            </div>
          ) : (
            <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[9px] font-semibold rounded-xl leading-normal">
              ✓ Payout Floor Cleared: Earnings exceed minimum threshold ({isIndia ? '₹1,000' : '$100 USD'}) and are open for settlement.
            </div>
          )}

          {/* Calendar Settlement scheduling */}
          <div className="mt-3 bg-pink-50 border border-pink-100 p-3 rounded-2xl space-y-1 text-xs">
            <div className="font-bold text-pink-900 flex justify-between">
              <span>Next Payout Settlement:</span>
              <span className="text-pink-600 underline">28th of Next Month</span>
            </div>
            <p className="text-[9px] text-[#000000] leading-normal pt-1">
              Clearance date: <strong className="text-pink-700">{payoutClearance.dateString}</strong>. 
              {payoutClearance.isShifted && " (Holiday/Weekend Rule: Payout is shifted to the immediate next business working day)."}
            </p>
          </div>

          {/* Withdrawal Request Form */}
          <form onSubmit={handleWithdrawSubmit} className="mt-5 space-y-3 border-t border-pink-100 pt-4">
            <h4 className="text-[10px] font-bold text-[#000000] uppercase tracking-wider">Withdraw Outbound Request</h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                required
                placeholder={isIndia ? "Min ₹1000" : "Min $100"}
                value={payoutAmt}
                onChange={(e) => setPayoutAmt(e.target.value)}
                className="bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs text-[#000000] placeholder-pink-400 focus:outline-none focus:border-pink-500"
              />
              <select
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
                className="bg-white border border-pink-200 rounded-xl px-2 py-2 text-xs text-[#000000] focus:outline-none focus:border-pink-500 cursor-pointer"
              >
                {isIndia ? (
                  <>
                    <option value="UPI">PhonePe UPI</option>
                    <option value="Bank">Bank Account</option>
                  </>
                ) : (
                  <>
                    <option value="PayPal">PayPal Address</option>
                    <option value="Bank">Bank Account</option>
                  </>
                )}
              </select>
            </div>

            <input
              type="text"
              required
              placeholder="Confirm UPI ID / Bank Routing No"
              value={payoutDetails}
              onChange={(e) => setPayoutDetails(e.target.value)}
              className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs text-[#000000] placeholder-pink-400 focus:outline-none focus:border-pink-500 font-mono"
            />

            <button
              type="submit"
              className="w-full bg-[#000000] hover:bg-[#000000]/90 text-[#FFF5F7] font-bold py-2 rounded-xl text-xs transition"
            >
              Request Compliance Payout
            </button>
          </form>
        </section>

        {/* 5. Watch Reward Video (Bonus Engine) */}
        <section className="bg-white border border-pink-200 p-5 rounded-3xl mb-5 shadow-sm">
          <h3 className="text-xs font-bold text-pink-600 uppercase tracking-widest flex items-center gap-1.5 mb-3">
            <Zap className="w-4.5 h-4.5 text-pink-500" />
            Bonus
          </h3>

          <p className="text-[10px] text-[#000000] leading-normal mb-4">
            Claim your reward by watching the 30-second video stream. Valid every 3 hours.
          </p>

          {adRunning ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-pink-600 font-bold animate-pulse">Streaming Bonus Video...</span>
                <span>{adCountdown} seconds left</span>
              </div>
              <div className="w-full h-2.5 bg-pink-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-pink-600 transition-all duration-1000 ease-linear"
                  style={{ width: `${((30 - adCountdown) / 30) * 100}%` }}
                />
              </div>
            </div>
          ) : cooldownText ? (
            <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl flex items-center justify-between text-xs text-[#000000]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-500" />
                <span className="font-semibold text-rose-700">Bonus Cooldown Active</span>
              </div>
              <span className="font-mono font-black text-rose-600">{cooldownText}</span>
            </div>
          ) : (
            <button
              onClick={triggerRewardAd}
              className="w-full bg-[#000000] hover:bg-[#000000]/90 text-[#FFF5F7] font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:scale-[1.01] transition"
            >
              <Zap className="w-4 h-4 text-pink-500 animate-bounce" />
              Claim Bonus (+1 Coin)
            </button>
          )}

          {adMessage && (
            <div className="mt-3 text-center bg-emerald-50 border border-emerald-200 text-emerald-600 p-2 rounded-xl text-[10px] font-bold">
              {adMessage}
            </div>
          )}
        </section>

        {/* 6. Auto Recharge settings */}
        <section className="bg-white border border-pink-200 p-5 rounded-3xl shadow-sm">
          <h3 className="text-xs font-bold text-pink-600 uppercase tracking-widest flex items-center gap-1.5 mb-4">
            <Sliders className="w-4.5 h-4.5 text-pink-500" />
            Auto Recharge Config
          </h3>

          <div className="space-y-4">
            {(["photo", "story", "reel", "video", "movie"] as const).map((type) => (
              <div key={type} className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-[#000000] capitalize">{type} Auto-Recharge</span>
                  <span className="text-[9px] text-[#000000]/70 block mt-0.5">
                    Auto-deduct when upload expires (28 Days)
                  </span>
                </div>
                
                <button
                  onClick={() => toggleAutoRecharge(type)}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${
                    state.autoRecharge[type] ? "bg-pink-600" : "bg-pink-200"
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

      {/* Compliance Modals */}
      {showGoogleChoice && (
        <div className="fixed inset-0 z-50 bg-[#000000]/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-pink-200 rounded-3xl p-5 max-w-sm w-full space-y-4 text-[#000000] shadow-xl">
            <h4 className="font-black text-sm text-[#000000] border-b border-pink-100 pb-2">
              Select Payment Mechanism
            </h4>
            <p className="text-[10px] text-[#000000]/70 leading-normal">
              In compliance with local developer billing mandates, PremRog supports alternative user choice payment gateways:
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowGoogleChoice(false);
                  executeRecharge(parseFloat(rechargeAmt), "Coins", "Google Play Billing");
                }}
                className="w-full text-left bg-pink-50 hover:bg-pink-100 p-3 rounded-xl border border-pink-200 text-xs font-bold flex justify-between items-center transition"
              >
                <div>
                  <div className="text-pink-900">Google Play Billing</div>
                  <div className="text-[8px] text-pink-700 font-medium">Secured by Google Play SDK</div>
                </div>
                <span className="text-[8px] text-emerald-600 bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded font-mono">Instant Sync</span>
              </button>
              <button
                onClick={() => {
                  setShowGoogleChoice(false);
                  executeRecharge(parseFloat(rechargeAmt), "Coins", "PhonePe UPI");
                }}
                className="w-full text-left bg-white hover:bg-pink-50 p-3 rounded-xl border border-pink-200 text-xs font-bold flex justify-between items-center transition"
              >
                <div>
                  <div className="text-pink-900">PhonePe UPI (Alternative System)</div>
                  <div className="text-[8px] text-pink-700 font-medium">Alternative billing gateway</div>
                </div>
                <span className="text-[8px] text-amber-600 bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded font-mono">24-48h Hold</span>
              </button>
            </div>
            <button
              onClick={() => setShowGoogleChoice(false)}
              className="w-full bg-[#000000] text-[#FFF5F7] py-2 rounded-xl text-xs font-bold transition hover:bg-[#000000]/80"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showAppleDisclosure && (
        <div className="fixed inset-0 z-50 bg-[#000000]/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-pink-200 rounded-3xl p-5 max-w-sm w-full space-y-4 text-[#000000] shadow-xl">
            <h4 className="font-black text-sm text-[#000000] border-b border-pink-100 pb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-pink-600" />
              External Purchase System Disclosure
            </h4>
            <p className="text-[10px] text-rose-950 leading-normal bg-rose-50 p-3 rounded-xl border border-rose-100">
              <strong>Mandated Apple Disclosure Statement:</strong> Any purchases made through this link will be completed on the web. Apple is not responsible for the privacy or security of transactions completed outside the App Store.
            </p>
            <p className="text-[10px] text-[#000000]/70 leading-normal">
              Would you like to proceed to the external PayPal checkout site? Apple still collects a statutory commission fee on these sales.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowAppleDisclosure(false)}
                className="bg-white border border-pink-200 hover:bg-pink-50 text-[#000000] font-bold py-2 rounded-xl text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAppleDisclosure(false);
                  executeRecharge(parseFloat(rechargeAmt), "Coins", "PayPal Gateway");
                }}
                className="bg-[#000000] hover:bg-[#000000]/90 text-[#FFF5F7] font-bold py-2 rounded-xl text-xs transition"
              >
                Continue to Web
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}