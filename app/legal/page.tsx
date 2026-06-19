"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, CheckCircle, HelpCircle } from "lucide-react";

export default function LegalHubPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("terms");

  const policies = [
    { id: "about", name: "About Premrog", content: `
# About Premrog Social Media Platform

Premrog is a next-generation decentralized content creation, sharing, and monetization platform built on Cloudflare serverless edge architecture. We combine the messaging features of WhatsApp, vertical videos of Instagram, conversational feeds of Facebook, and video publishing controls of YouTube into a single high-performance global network.
- Domain: www.premrog.com
- Platforms: Web (Cloudflare Pages), Android, iOS, and Progressive Web Apps (PWA).
- Coverage: Global distribution with native Multi-Language support.
    ` },
    { id: "contact", name: "Contact Us", content: `
# Contact Premrog Support Desk

We are committed to delivering secure, fast real-time communications. Get in touch with us:
- Official Email: support.premrog@gmail.com
- App Support Desk: Accessible in-app under Support Center.
- Corporate Office: Delhi NCR, India / Global virtual nodes.
- Response time: Within 24-48 business hours.
    ` },
    { id: "privacy", name: "Privacy Policy", content: `
# Privacy & Encrypted Data Policy

Premrog values user privacy above all.
1. P2P Communication: All voice calls, video calls, and text exchanges use secure, end-to-end encrypted WebRTC channels. No media packet is stored on Premrog servers.
2. Device Data: We collect fingerprint tokens for anti-fraud views analytics and session security checks.
3. Cookies & IP logs: Stored to detect proxy manipulations and secure creator earnings.
    ` },
    { id: "terms", name: "Terms & Conditions", content: `
# Terms & Conditions (V1.0)

By registering a creator or regular user account on Premrog, you agree to these terms:
1. Account Responsibility: You are responsible for all content uploaded.
2. Upload fee: Charging Coins or cash is required to store files.
3. No Transfer: Wallet balance, coins, and auto-renew packages are locked to your unique device fingerprint and username.
    ` },
    { id: "guidelines", name: "Community Guidelines", content: `
# Premrog Community Safety Guidelines

We enforce a safe, positive creator workspace.
- No harassment or toxic behavior in comments or chats.
- No posting copyright-infringed content.
- Violence, adult media, and illegal uploads are subject to immediate IP Ban and Device bans by Super Admins.
    ` },
    { id: "creator", name: "Creator Policy", content: `
# Creator Rights & Duties

Creators are the core of Premrog.
1. Eligibility: Anyone can toggle on creator mode in settings.
2. Revenue Split: Gross ad revenue (Reels/Videos/Movies) is split 75% to Creator and 25% to Premrog platform.
3. Verification: Creators can request verified checks, approved at Super Admin discretion.
    ` },
    { id: "monetization", name: "Monetization Policy", content: `
# Monetization Guidelines

Earn ad revenues on your uploads.
- Ad payouts are counted on valid impressions and view counts.
- Creators watching own content (Self View) filters views and invalidates revenue.
- Repeated fraud attempts lead to payout holds or creator account suspension.
    ` },
    { id: "advertiser", name: "Advertiser Policy", content: `
# Advertiser Standards & Guidelines

We facilitate high CTR native campaigns.
1. Ad Approvals: All campaigns created by advertisers require Super Admin activation.
2. Target Criteria: Demographics target by India/Global country filters and Hindi/English languages.
3. Content: Ads must be clean, safe, and disclose products transparently.
    ` },
    { id: "wallet", name: "Wallet Policy", content: `
# Virtual Wallet System Terms

Premrog splits finances into 3 distinct wallets:
1. Coins Wallet: Virtual coins to upload photos (1 Coin) and stories (2 Coins). Non-refundable and non-withdrawable.
2. Cash Wallet: Native currency topups to pay for Reel/Video/Movie uploads.
3. Creator Earnings: Ad commissions accumulated. Withdrawable once thresholds are hit.
    ` },
    { id: "recharge", name: "Recharge Policy", content: `
# Wallet Recharge Terms

Billing is configured depending on platform routing rules:
- Web: Payments via direct gateways (UPI for India, PayPal globally).
- Android: Handled via Google Play In-App Billing.
- iOS: Handled via Apple App Store In-App Purchases (IAP).
Balances sync under database ledgers.
    ` },
    { id: "refund", name: "Refund Review Policy", content: `
# Refund & Dispute Review Guidelines

- Coins and Cash wallets are normally non-refundable and non-exchangeable.
- Exception: Unused recharge balances can be reviewed by emailing support.premrog@gmail.com.
- Final decision is subject to App Store Billing policies.
    ` },
    { id: "withdrawal", name: "Withdrawal Policy", content: `
# Payout Withdrawal Policy

Creators can cash out their ad share:
- India: Minimum withdrawal ₹1000 via UPI or Bank Transfer.
- International: Minimum withdrawal $100 via PayPal or Bank Transfer.
- Processing window: Up to 3-5 working days after Admin approval.
    ` },
    { id: "copyright", name: "Copyright Management Policy", content: `
# DMCA & Copyright Guidelines

Premrog respects original intellectual property.
- Uploading films, trailers, or audio files without explicit license leads to immediate DMCA takedowns.
- Copyright owners can submit claims to support.premrog@gmail.com.
- Removed contents can request restore review under Admin panel.
    ` },
    { id: "support", name: "Support Center policy", content: `
# Customer Support Protocols

Our support desk is accessible under support.premrog@gmail.com.
- Ticket categories: Account, Wallet topups, Payouts, Copyright disputes.
- Escalations: Unresolved payment errors undergo manual review inside the Super Admin ledger.
    ` }
  ];

  const currentPolicy = policies.find(p => p.id === activeTab) || policies[2];

  return (
    <div className="bg-[#FFF5F7] text-[#000000] min-h-screen font-sans relative overflow-hidden max-w-md mx-auto border-x border-pink-200">
      {/* Glow effect */}
      <div className="absolute top-0 right-1/4 w-[250px] h-[250px] bg-pink-300/20 rounded-full blur-[90px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-pink-200 p-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-[#000000]/70 hover:text-pink-600 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-md font-black tracking-wide text-pink-600">
            LEGAL & POLICIES
          </h1>
          <span className="text-[9px] text-[#000000]/60 font-semibold block mt-0.5">Premrog Compliance Hub (V1.0)</span>
        </div>
      </header>

      <div className="p-4 flex gap-4 h-[calc(100vh-80px)]">
        {/* Left vertical tab selectors */}
        <div className="w-[35%] overflow-y-auto space-y-1.5 border-r border-pink-200 pr-2 scrollbar-none">
          {policies.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveTab(p.id)}
              className={`w-full text-left text-[9px] font-bold py-2.5 px-3 rounded-xl transition-all border ${
                activeTab === p.id
                  ? "bg-pink-600 text-white border-pink-600"
                  : "bg-white border-pink-200 text-[#000000] hover:bg-pink-50"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Right content view area */}
        <div className="w-[65%] overflow-y-auto px-1 select-text scrollbar-none">
          <div className="text-xs space-y-4 leading-relaxed text-[#000000]/80">
            {/* Simple manual render of markdown styling */}
            {currentPolicy.content.split("\n").map((line, idx) => {
              if (line.startsWith("# ")) {
                return <h2 key={idx} className="text-sm font-black text-pink-600 pt-2 border-b border-pink-100 pb-1 uppercase">{line.replace("# ", "")}</h2>;
              }
              if (line.startsWith("## ")) {
                return <h3 key={idx} className="text-xs font-bold text-black pt-1">{line.replace("## ", "")}</h3>;
              }
              if (line.startsWith("- ")) {
                return <li key={idx} className="list-disc pl-2 ml-2 text-[#000000]/70">{line.replace("- ", "")}</li>;
              }
              if (line.trim().match(/^\d+\./)) {
                return <p key={idx} className="pl-1 font-semibold text-black">{line}</p>;
              }
              if (line.trim() === "") return null;
              return <p key={idx} className="text-[#000000]/70 text-[11px]">{line}</p>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
