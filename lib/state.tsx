"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Translations dictionary
const translations = {
  en: {
    appName: "PREMROG",
    home: "Home",
    reels: "Reels",
    story: "Story",
    upload: "Upload",
    search: "Search",
    notifications: "Notifications",
    wallet: "Wallet",
    chat: "Chat",
    profile: "Profile",
    creator: "Creator Panel",
    admin: "Super Admin",
    advertiser: "Advertiser",
    legal: "Legal Info",
    support: "Support",
    login: "Log In",
    signup: "Sign Up",
    logout: "Log Out",
    coins: "Coins",
    cash: "Cash Balance",
    earnings: "Earnings",
    recharge: "Recharge",
    withdraw: "Withdraw",
    boost: "Boost Post",
    autoRenew: "Auto-Renew",
    follow: "Follow",
    following: "Following",
    followers: "Followers",
    unfollow: "Unfollow",
    like: "Like",
    comment: "Comment",
    share: "Share",
    save: "Save",
    adCooldown: "Ad Cooldown",
    watchAd: "Watch Reward Ad (+1 Coin)",
    settings: "Settings",
    submit: "Submit",
    cancel: "Cancel",
    creatorAnalytics: "Creator Analytics",
    invalidViews: "Invalid Views Removed",
    fraudAlert: "Anti-Fraud Active",
    callNativeAd: "Calling Banner Ad (Premrog Sponsor)",
    chatNativeAd: "Chat Top Banner Ad",
  },
  hi: {
    appName: "प्रेमरोग",
    home: "होम",
    reels: "रील्स",
    story: "कहानी",
    upload: "अपलोड",
    search: "खोजें",
    notifications: "सूचनाएं",
    wallet: "वैलेट",
    chat: "चैट",
    profile: "प्रोफ़ाइल",
    creator: "क्रिएटर पैनल",
    admin: "सुपर एडमिन",
    advertiser: "विज्ञापनदाता",
    legal: "कानूनी जानकारी",
    support: "सहायता",
    login: "लॉग इन",
    signup: "साइन अप",
    logout: "लॉग आउट",
    coins: "सिक्के",
    cash: "कैश बैलेंस",
    earnings: "कमाई",
    recharge: "रिचार्ज",
    withdraw: "निकासी",
    boost: "पोस्ट बूस्ट करें",
    autoRenew: "ऑटो-रिन्यू",
    follow: "फॉलो करें",
    following: "फॉलो कर रहे हैं",
    followers: "फॉलोअर्स",
    unfollow: "अनफॉलो",
    like: "पसंद",
    comment: "टिप्पणी",
    share: "शेयर",
    save: "सुरक्षित करें",
    adCooldown: "विज्ञापन अंतराल",
    watchAd: "इनाम विज्ञापन देखें (+1 सिक्का)",
    settings: "सेटिंग्स",
    submit: "जमा करें",
    cancel: "रद्द करें",
    creatorAnalytics: "क्रिएटर विश्लेषण",
    invalidViews: "अवैध व्यूज हटाए गए",
    fraudAlert: "धोखाधड़ी विरोधी सक्रिय",
    callNativeAd: "कॉलिंग बैनर विज्ञापन (प्रेमरोग प्रायोजक)",
    chatNativeAd: "चैट टॉप बैनर विज्ञापन",
  }
};

export type Language = "en" | "hi";

export interface Message {
  id: string;
  sender: "me" | "other";
  text: string;
  type: "text" | "image" | "video" | "file" | "voice";
  mediaUrl?: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

export interface ChatThread {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  messages: Message[];
}

export interface Post {
  id: string;
  type: "photo" | "story" | "reel" | "video" | "movie";
  user: string;
  userAvatar?: string;
  caption: string;
  mediaUrl: string;
  duration?: string; // e.g. "10s", "1m", "10m", "3h"
  size?: string; // e.g. "150KB", "20MB", "1200MB"
  cost: number; // in Coins or Currency
  costUnit: "Coins" | "Cash";
  validityDays: number;
  autoRenew: boolean;
  likes: string[]; // usernames
  comments: { id: string; user: string; text: string; timestamp: string }[];
  views: number;
  isBoosted: boolean;
  boostType: "none" | "basic" | "standard" | "premium" | "global";
  expiresAt: string;
  monetized: boolean;
  status: "active" | "deleted";
}

export interface Campaign {
  id: string;
  name: string;
  type: string;
  budget: number;
  spent: number;
  country: string;
  language: string;
  impressions: number;
  clicks: number;
  status: "active" | "pending" | "completed";
}

export interface AppNotification {
  id: string;
  type: "like" | "comment" | "follow" | "chat" | "call" | "wallet" | "earnings";
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Withdrawal {
  id: string;
  user: string;
  amount: number;
  currency: string;
  method: string;
  details: string;
  status: "pending" | "approved" | "rejected";
  timestamp: string;
}

export interface UserProfile {
  username: string;
  email: string;
  phone: string;
  bio: string;
  profilePic: string;
  coverPic: string;
  country: "India" | "International";
  language: Language;
  followers: string[];
  following: string[];
  isVerified: boolean;
  isCreator: boolean;
  isSuspended: boolean;
  isBanned: boolean;
}

export interface AppState {
  user: UserProfile | null;
  coins: number;
  cash: number; // ₹ for India, $ for International
  earnings: number; // Creator wallet
  autoRecharge: {
    photo: boolean;
    story: boolean;
    reel: boolean;
    video: boolean;
    movie: boolean;
  };
  posts: Post[];
  chats: ChatThread[];
  campaigns: Campaign[];
  notifications: AppNotification[];
  withdrawals: Withdrawal[];
  bannedIPs: string[];
  bannedDevices: string[];
  rewardAdCooldown: string | null; // ISO Timestamp of next available reward ad
  systemSettings: {
    coinRateINR: number;
    coinRateUSD: number;
    uploadCharges: {
      photo: number; // Coins
      story: number; // Coins
      reel: number; // Cash
      video: number; // Cash
      movie: number; // Cash
    };
    boostPrices: {
      basic: number;
      standard: number;
      premium: number;
      global: number;
    };
    revenueShare: number; // e.g. 0.75
  };
  fraudLogs: {
    selfViewsCount: number;
    invalidImpressionsCount: number;
    duplicateIPCount: number;
  };
  activeCall: {
    type: "audio" | "video" | null;
    partnerName: string | null;
    status: "ringing" | "connected" | null;
  };
}

interface AppContextType {
  state: AppState;
  t: (key: keyof typeof translations["en"]) => string;
  login: (emailOrPhone: string) => boolean;
  signup: (username: string, email: string, phone: string, country: "India" | "International", language: Language) => void;
  logout: () => void;
  updateProfile: (fields: Partial<UserProfile>) => void;
  toggleFollow: (username: string) => void;
  rechargeWallet: (amount: number, method: string) => void;
  watchRewardAd: () => { success: boolean; message: string };
  uploadContent: (
    type: "photo" | "story" | "reel" | "video" | "movie",
    caption: string,
    fileSizeMB: number,
    durationSeconds: number,
    autoRenew: boolean
  ) => { success: boolean; message: string };
  toggleAutoRenew: (postId: string) => void;
  boostPost: (postId: string, type: "basic" | "standard" | "premium" | "global") => { success: boolean; message: string };
  likePost: (postId: string) => void;
  commentPost: (postId: string, text: string) => void;
  sendMessage: (chatId: string, text: string, type?: Message["type"]) => void;
  startCall: (type: "audio" | "video", partnerName: string) => void;
  endCall: () => void;
  createCampaign: (name: string, type: string, budget: number, country: string, language: string) => void;
  approveCampaign: (campaignId: string) => void;
  rejectCampaign: (campaignId: string) => void;
  requestWithdrawal: (amount: number, method: string, details: string) => { success: boolean; message: string };
  approveWithdrawal: (id: string) => void;
  rejectWithdrawal: (id: string) => void;
  banUser: (username: string) => void;
  suspendUser: (username: string) => void;
  verifyUser: (username: string) => void;
  removeVerification: (username: string) => void;
  deletePost: (id: string) => void;
  restorePost: (id: string) => void;
  updateSystemSettings: (settings: Partial<AppState["systemSettings"]>) => void;
  toggleAutoRecharge: (type: keyof AppState["autoRecharge"]) => void;
  viewPost: (postId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultInitialState: AppState = {
  user: {
    username: "RajeshKumar",
    email: "rajesh@gmail.com",
    phone: "9876543210",
    bio: "Premrog Content Creator 🔥 | Video Director",
    profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150",
    coverPic: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800",
    country: "India",
    language: "en",
    followers: ["amit_12", "sneha_sharma", "rohit_roy"],
    following: ["premrog_official", "creative_director"],
    isVerified: true,
    isCreator: true,
    isSuspended: false,
    isBanned: false,
  },
  coins: 120,
  cash: 350,
  earnings: 1500,
  autoRecharge: {
    photo: true,
    story: false,
    reel: true,
    video: false,
    movie: false
  },
  posts: [
    {
      id: "post-1",
      type: "photo",
      user: "sneha_sharma",
      userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150",
      caption: "Living life one photo at a time! 📸 #Premrog",
      mediaUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600",
      size: "120 KB",
      cost: 1,
      costUnit: "Coins",
      validityDays: 28,
      autoRenew: true,
      likes: ["RajeshKumar", "amit_12"],
      comments: [
        { id: "c-1", user: "RajeshKumar", text: "Amazing scenery! 😍", timestamp: "1 hour ago" }
      ],
      views: 1450,
      isBoosted: false,
      boostType: "none",
      expiresAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
      monetized: true,
      status: "active"
    },
    {
      id: "post-2",
      type: "reel",
      user: "rohit_roy",
      userAvatar: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=150",
      caption: "Dance moves on fire! 🔥 Rate this 1-10! #reels #viral",
      mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-dancing-40097-large.mp4",
      duration: "45s",
      size: "18 MB",
      cost: 1,
      costUnit: "Cash",
      validityDays: 28,
      autoRenew: false,
      likes: ["sneha_sharma"],
      comments: [],
      views: 3200,
      isBoosted: true,
      boostType: "standard",
      expiresAt: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      monetized: true,
      status: "active"
    },
    {
      id: "post-3",
      type: "video",
      user: "premrog_official",
      userAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150",
      caption: "Exclusive Interview: The Future of Global Creator Economy on Premrog! 🚀",
      mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-holding-a-smartphone-with-a-blank-screen-42289-large.mp4",
      duration: "8m 12s",
      size: "95 MB",
      cost: 5,
      costUnit: "Cash",
      validityDays: 28,
      autoRenew: true,
      likes: ["RajeshKumar", "sneha_sharma", "rohit_roy"],
      comments: [
        { id: "c-2", user: "amit_12", text: "This monetization system is exactly what we needed!", timestamp: "2 hours ago" }
      ],
      views: 12500,
      isBoosted: true,
      boostType: "global",
      expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      monetized: true,
      status: "active"
    }
  ],
  chats: [
    {
      id: "chat-1",
      name: "Sneha Sharma",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150",
      online: true,
      messages: [
        { id: "m-1", sender: "other", text: "Hey! Did you see the new earnings dashboard on Premrog?", type: "text", timestamp: "5m ago", status: "read" },
        { id: "m-2", sender: "me", text: "Yes! The 75% ad revenue share is incredible! 💸", type: "text", timestamp: "4m ago", status: "read" },
        { id: "m-3", sender: "other", text: "Let's call and discuss the campaign details.", type: "text", timestamp: "2m ago", status: "read" }
      ]
    },
    {
      id: "chat-2",
      name: "Amit Kumar",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150",
      online: false,
      messages: [
        { id: "m-4", sender: "other", text: "Sent you the project draft file.", type: "text", timestamp: "1h ago", status: "read" },
        { id: "m-5", sender: "other", text: "draft_v1.pdf", type: "file", timestamp: "1h ago", status: "read" }
      ]
    }
  ],
  campaigns: [
    {
      id: "camp-1",
      name: "Cola Brand Diwali Splash",
      type: "Feed Ads",
      budget: 15000,
      spent: 4200,
      country: "India",
      language: "All",
      impressions: 42000,
      clicks: 3480,
      status: "active"
    },
    {
      id: "camp-2",
      name: "Global Tech Webinar Boost",
      type: "Reward Ads",
      budget: 250,
      spent: 120,
      country: "Global",
      language: "English",
      impressions: 12000,
      clicks: 890,
      status: "active"
    }
  ],
  notifications: [
    { id: "n-1", type: "like", text: "rohit_roy liked your reel", timestamp: "10m ago", read: false },
    { id: "n-2", type: "earnings", text: "Ad revenue ₹235.40 credited to Creator Wallet", timestamp: "1h ago", read: false },
    { id: "n-3", type: "wallet", text: "Photo Auto-Renew: Deducted 1 Coin for 'Living Life'", timestamp: "1d ago", read: true }
  ],
  withdrawals: [
    { id: "w-1", user: "RajeshKumar", amount: 1200, currency: "INR", method: "UPI", details: "rajesh@ybl", status: "approved", timestamp: "2 days ago" }
  ],
  bannedIPs: ["192.168.1.99"],
  bannedDevices: ["dev-mac-123x"],
  rewardAdCooldown: null,
  systemSettings: {
    coinRateINR: 10,
    coinRateUSD: 500,
    uploadCharges: {
      photo: 1,
      story: 2,
      reel: 1, // ₹1
      video: 5, // ₹5
      movie: 59 // ₹59
    },
    boostPrices: {
      basic: 50,
      standard: 150,
      premium: 500,
      global: 1500
    },
    revenueShare: 0.75
  },
  fraudLogs: {
    selfViewsCount: 14,
    invalidImpressionsCount: 8,
    duplicateIPCount: 32
  },
  activeCall: {
    type: null,
    partnerName: null,
    status: null
  }
};

export function StateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultInitialState);

  // Sync with localStorage on mount & updates
  useEffect(() => {
    const saved = localStorage.getItem("premrog_state");
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse state", e);
      }
    }
  }, []);

  const saveState = (newState: AppState) => {
    setState(newState);
    localStorage.setItem("premrog_state", JSON.stringify(newState));
  };

  // Helper translations
  const t = (key: keyof typeof translations["en"]): string => {
    const lang = state.user?.language || "en";
    return translations[lang][key] || translations["en"][key] || String(key);
  };

  // Auth Operations
  const login = (emailOrPhone: string): boolean => {
    if (!emailOrPhone) return false;
    const isEmail = emailOrPhone.includes("@");
    const formattedUsername = isEmail 
      ? emailOrPhone.split("@")[0] 
      : "User_" + emailOrPhone.slice(-4);

    const newUser: UserProfile = {
      username: formattedUsername,
      email: isEmail ? emailOrPhone : formattedUsername + "@premrog.com",
      phone: !isEmail ? emailOrPhone : "9999999999",
      bio: "Joined Premrog Community! 🎉",
      profilePic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150",
      coverPic: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800",
      country: emailOrPhone.startsWith("+91") || emailOrPhone.length === 10 ? "India" : "International",
      language: "en",
      followers: [],
      following: ["premrog_official"],
      isVerified: false,
      isCreator: false,
      isSuspended: false,
      isBanned: false,
    };

    saveState({
      ...state,
      user: newUser,
      coins: 100, // Sign up free coins
      cash: 200,
      earnings: 0,
    });
    return true;
  };

  const signup = (
    username: string,
    email: string,
    phone: string,
    country: "India" | "International",
    language: Language
  ) => {
    const newUser: UserProfile = {
      username: username.replace(/\s+/g, ""),
      email,
      phone,
      bio: "New Premrog Member!",
      profilePic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150",
      coverPic: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800",
      country,
      language,
      followers: [],
      following: ["premrog_official"],
      isVerified: false,
      isCreator: true, // Default enabled for demo
      isSuspended: false,
      isBanned: false,
    };

    saveState({
      ...state,
      user: newUser,
      coins: 100, // Free coins
      cash: country === "India" ? 100 : 10, // Free cash balance
      earnings: 0
    });
  };

  const logout = () => {
    saveState({
      ...state,
      user: null
    });
  };

  const updateProfile = (fields: Partial<UserProfile>) => {
    if (!state.user) return;
    saveState({
      ...state,
      user: { ...state.user, ...fields }
    });
  };

  const toggleFollow = (username: string) => {
    if (!state.user) return;
    const isFollowing = state.user.following.includes(username);
    const updatedFollowing = isFollowing
      ? state.user.following.filter(u => u !== username)
      : [...state.user.following, username];

    const updatedNotifications = [...state.notifications];
    if (!isFollowing) {
      updatedNotifications.unshift({
        id: `noti-${Date.now()}`,
        type: "follow",
        text: `${state.user.username} started following you`,
        timestamp: "Just now",
        read: false
      });
    }

    saveState({
      ...state,
      user: {
        ...state.user,
        following: updatedFollowing
      },
      notifications: updatedNotifications
    });
  };

  // Wallet operations
  const rechargeWallet = (amount: number, method: string) => {
    if (!state.user) return;
    const isIndia = state.user.country === "India"; 
    let addedCoins = 0;
    let addedCash = 0;

    if (method.includes("Coins")) {
      if (isIndia) {
        addedCoins = amount * state.systemSettings.coinRateINR;
      } else {
        addedCoins = amount * state.systemSettings.coinRateUSD;
      }
    } else {
      addedCash = amount;
    }

    const newCoins = state.coins + addedCoins;
    const newCash = state.cash + addedCash;

    saveState({
      ...state,
      coins: newCoins,
      cash: newCash,
      notifications: [
        {
          id: `noti-${Date.now()}`,
          type: "wallet",
          text: `Wallet recharged successfully. Added ${addedCoins > 0 ? `${addedCoins} Coins` : `${isIndia ? '₹' : '$'}${addedCash}`}`,
          timestamp: "Just now",
          read: false
        },
        ...state.notifications
      ]
    });
  };

  const watchRewardAd = (): { success: boolean; message: string } => {
    const now = Date.now();
    if (state.rewardAdCooldown) {
      const cooldownDate = new Date(state.rewardAdCooldown).getTime();
      if (now < cooldownDate) {
        const remainingMin = Math.round((cooldownDate - now) / 60000);
        return {
          success: false,
          message: `Reward ad on cooldown. Try again in ${remainingMin} minutes.`
        };
      }
    }

    const nextCooldown = new Date(now + 4 * 60 * 60 * 1000).toISOString(); // 4 hours
    saveState({
      ...state,
      coins: state.coins + 1,
      rewardAdCooldown: nextCooldown,
      notifications: [
        {
          id: `noti-${Date.now()}`,
          type: "wallet",
          text: "Watched reward ad: +1 Coin credited",
          timestamp: "Just now",
          read: false
        },
        ...state.notifications
      ]
    });
    return { success: true, message: "Success! +1 Coin credited." };
  };

  const uploadContent = (
    type: "photo" | "story" | "reel" | "video" | "movie",
    caption: string,
    fileSizeMB: number,
    durationSeconds: number,
    autoRenew: boolean
  ): { success: boolean; message: string } => {
    if (!state.user) return { success: false, message: "User not logged in" };

    const isIndia = state.user.country === "India";

    // 1. Validation Checks
    if (type === "photo" && fileSizeMB > 0.2) return { success: false, message: "Photo exceeds size limit of 200 KB" };
    if (type === "story" && durationSeconds > 10) return { success: false, message: "Story exceeds maximum duration of 10 seconds" };
    if (type === "reel" && fileSizeMB > 25) return { success: false, message: "Reel exceeds maximum size of 25 MB" };
    if (type === "reel" && durationSeconds > 60) return { success: false, message: "Reel exceeds maximum duration of 1 minute" };
    if (type === "video" && fileSizeMB > 120) return { success: false, message: "Video exceeds maximum size of 120 MB" };
    if (type === "video" && durationSeconds > 600) return { success: false, message: "Video exceeds maximum duration of 10 minutes" };
    if (type === "movie" && fileSizeMB > 1500) return { success: false, message: "Movie exceeds maximum size of 1500 MB" };
    if (type === "movie" && durationSeconds > 10800) return { success: false, message: "Movie exceeds maximum duration of 3 hours" };

    // Cost calculations
    let chargeAmount = 0;
    let chargeUnit: "Coins" | "Cash" = "Coins";

    if (type === "photo") {
      chargeAmount = state.systemSettings.uploadCharges.photo;
      chargeUnit = "Coins";
    } else if (type === "story") {
      chargeAmount = state.systemSettings.uploadCharges.story;
      chargeUnit = "Coins";
    } else if (type === "reel") {
      chargeAmount = state.systemSettings.uploadCharges.reel;
      chargeUnit = "Cash";
    } else if (type === "video") {
      chargeAmount = state.systemSettings.uploadCharges.video;
      chargeUnit = "Cash";
    } else if (type === "movie") {
      chargeAmount = state.systemSettings.uploadCharges.movie;
      chargeUnit = "Cash";
    }

    let actualCharge = chargeAmount;
    if (chargeUnit === "Cash" && !isIndia) {
      actualCharge = chargeAmount / 80; // approximate $ equivalents
      actualCharge = parseFloat(actualCharge.toFixed(2));
    }

    // Check balance
    if (chargeUnit === "Coins") {
      if (state.coins < actualCharge) return { success: false, message: `Insufficient Coin Balance! Requires ${actualCharge} Coins.` };
    } else {
      if (state.cash < actualCharge) return { success: false, message: `Insufficient Cash Balance! Requires ${isIndia ? '₹' : '$'}${actualCharge}.` };
    }

    const newCoins = chargeUnit === "Coins" ? state.coins - actualCharge : state.coins;
    const newCash = chargeUnit === "Cash" ? state.cash - actualCharge : state.cash;

    let mediaUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600";
    if (type === "reel") mediaUrl = "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-dancing-40097-large.mp4";
    if (type === "video") mediaUrl = "https://assets.mixkit.co/videos/preview/mixkit-holding-a-smartphone-with-a-blank-screen-42289-large.mp4";
    if (type === "movie") mediaUrl = "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4";

    const validityDays = type === "story" ? 1 : 28;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      type,
      user: state.user.username,
      userAvatar: state.user.profilePic,
      caption,
      mediaUrl,
      duration: `${Math.round(durationSeconds)}s`,
      size: `${fileSizeMB.toFixed(1)} MB`,
      cost: chargeAmount,
      costUnit: chargeUnit,
      validityDays,
      autoRenew,
      likes: [],
      comments: [],
      views: 0,
      isBoosted: false,
      boostType: "none",
      expiresAt: new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toISOString(),
      monetized: true,
      status: "active"
    };

    saveState({
      ...state,
      coins: newCoins,
      cash: newCash,
      posts: [newPost, ...state.posts],
      notifications: [
        {
          id: `noti-${Date.now()}`,
          type: "wallet",
          text: `Deducted ${chargeUnit === "Coins" ? `${actualCharge} Coins` : `${isIndia ? '₹' : '$'}${actualCharge}`} for ${type} upload`,
          timestamp: "Just now",
          read: false
        },
        ...state.notifications
      ]
    });

    return { success: true, message: `${type.toUpperCase()} uploaded successfully!` };
  };

  const toggleAutoRenew = (postId: string) => {
    const updated = state.posts.map(p => {
      if (p.id === postId) {
        return { ...p, autoRenew: !p.autoRenew };
      }
      return p;
    });
    saveState({ ...state, posts: updated });
  };

  const boostPost = (postId: string, type: "basic" | "standard" | "premium" | "global"): { success: boolean; message: string } => {
    if (!state.user) return { success: false, message: "User not logged in" };
    const isIndia = state.user.country === "India";
    const basePrice = state.systemSettings.boostPrices[type];
    let price = basePrice;

    if (!isIndia) {
      price = parseFloat((basePrice / 80).toFixed(2));
    }

    if (state.cash < price) {
      return { success: false, message: `Insufficient Cash Balance. Boost cost: ${isIndia ? '₹' : '$'}${price}` };
    }

    const updatedPosts = state.posts.map(p => {
      if (p.id === postId) {
        return { ...p, isBoosted: true, boostType: type };
      }
      return p;
    });

    saveState({
      ...state,
      cash: state.cash - price,
      posts: updatedPosts,
      notifications: [
        {
          id: `noti-${Date.now()}`,
          type: "wallet",
          text: `Charged ${isIndia ? '₹' : '$'}${price} for ${type} boost`,
          timestamp: "Just now",
          read: false
        },
        ...state.notifications
      ]
    });

    return { success: true, message: `Post boosted successfully as ${type.toUpperCase()}!` };
  };

  const likePost = (postId: string) => {
    if (!state.user) return;
    const username = state.user.username;
    let author = "";
    
    const updatedPosts = state.posts.map(p => {
      if (p.id === postId) {
        author = p.user;
        const liked = p.likes.includes(username);
        const newLikes = liked
          ? p.likes.filter(u => u !== username)
          : [...p.likes, username];
        return { ...p, likes: newLikes };
      }
      return p;
    });

    const updatedNotifications = [...state.notifications];
    if (author && author !== username) {
      updatedNotifications.unshift({
        id: `noti-${Date.now()}`,
        type: "like",
        text: `${username} liked your post`,
        timestamp: "Just now",
        read: false
      });
    }

    saveState({
      ...state,
      posts: updatedPosts,
      notifications: updatedNotifications
    });
  };

  const commentPost = (postId: string, text: string) => {
    if (!state.user) return;
    const username = state.user.username;
    let author = "";

    const updatedPosts = state.posts.map(p => {
      if (p.id === postId) {
        author = p.user;
        return {
          ...p,
          comments: [
            ...p.comments,
            { id: `comm-${Date.now()}`, user: username, text, timestamp: "Just now" }
          ]
        };
      }
      return p;
    });

    const updatedNotifications = [...state.notifications];
    if (author && author !== username) {
      updatedNotifications.unshift({
        id: `noti-${Date.now()}`,
        type: "comment",
        text: `${username} commented: "${text.slice(0, 20)}..."`,
        timestamp: "Just now",
        read: false
      });
    }

    saveState({
      ...state,
      posts: updatedPosts,
      notifications: updatedNotifications
    });
  };

  const sendMessage = (chatId: string, text: string, type: Message["type"] = "text") => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "me",
      text,
      type,
      timestamp: "Just now",
      status: "sent"
    };

    let partnerName = "";
    const updatedChats = state.chats.map(chat => {
      if (chat.id === chatId) {
        partnerName = chat.name;
        return {
          ...chat,
          messages: [...chat.messages, newMessage]
        };
      }
      return chat;
    });

    saveState({
      ...state,
      chats: updatedChats
    });

    setTimeout(() => {
      const replyMessage: Message = {
        id: `msg-reply-${Date.now()}`,
        sender: "other",
        text: `Hey, this is a simulated P2P encrypted reply from ${partnerName}! 👍`,
        type: "text",
        timestamp: "Just now",
        status: "read"
      };

      const finalChats = localStorage.getItem("premrog_state");
      if (finalChats) {
        const parsed = JSON.parse(finalChats) as AppState;
        const chatsWithReply = parsed.chats.map(chat => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: [...chat.messages, replyMessage]
            };
          }
          return chat;
        });

        const replyNoti: AppNotification = {
          id: `noti-chat-${Date.now()}`,
          type: "chat",
          text: `New message from ${partnerName}: "${replyMessage.text.slice(0, 25)}..."`,
          timestamp: "Just now",
          read: false
        };

        saveState({
          ...parsed,
          chats: chatsWithReply,
          notifications: [replyNoti, ...parsed.notifications]
        });
      }
    }, 2500);
  };

  const startCall = (type: "audio" | "video", partnerName: string) => {
    saveState({
      ...state,
      activeCall: {
        type,
        partnerName,
        status: "ringing"
      }
    });

    setTimeout(() => {
      const callState = localStorage.getItem("premrog_state");
      if (callState) {
        const parsed = JSON.parse(callState) as AppState;
        if (parsed.activeCall.status === "ringing") {
          saveState({
            ...parsed,
            activeCall: {
              ...parsed.activeCall,
              status: "connected"
            }
          });
        }
      }
    }, 2500);
  };

  const endCall = () => {
    saveState({
      ...state,
      activeCall: {
        type: null,
        partnerName: null,
        status: null
      }
    });
  };

  const createCampaign = (name: string, type: string, budget: number, country: string, language: string) => {
    const newCamp: Campaign = {
      id: `camp-${Date.now()}`,
      name,
      type,
      budget,
      spent: 0,
      country,
      language,
      impressions: 0,
      clicks: 0,
      status: "pending"
    };

    saveState({
      ...state,
      campaigns: [...state.campaigns, newCamp],
      notifications: [
        {
          id: `noti-${Date.now()}`,
          type: "wallet",
          text: `Ad Campaign '${name}' created. Awaiting admin approval.`,
          timestamp: "Just now",
          read: false
        },
        ...state.notifications
      ]
    });
  };

  const approveCampaign = (campaignId: string) => {
    const updated = state.campaigns.map(c => {
      if (c.id === campaignId) return { ...c, status: "active" as const };
      return c;
    });
    saveState({ ...state, campaigns: updated });
  };

  const rejectCampaign = (campaignId: string) => {
    const updated = state.campaigns.map(c => {
      if (c.id === campaignId) return { ...c, status: "completed" as const };
      return c;
    });
    saveState({ ...state, campaigns: updated });
  };

  const requestWithdrawal = (amount: number, method: string, details: string): { success: boolean; message: string } => {
    if (!state.user) return { success: false, message: "Not logged in" };
    const isIndia = state.user.country === "India";
    const minLimit = isIndia ? 1000 : 100;
    const currency = isIndia ? "INR" : "USD";

    if (state.earnings < amount) {
      return { success: false, message: `Insufficient earnings balance. Available: ${isIndia ? '₹' : '$'}${state.earnings}` };
    }
    if (amount < minLimit) {
      return { success: false, message: `Minimum withdrawal amount is ${isIndia ? '₹1000' : '$100'}` };
    }

    const newReq: Withdrawal = {
      id: `w-${Date.now()}`,
      user: state.user.username,
      amount,
      currency,
      method,
      details,
      status: "pending",
      timestamp: "Just now"
    };

    saveState({
      ...state,
      earnings: state.earnings - amount,
      withdrawals: [newReq, ...state.withdrawals],
      notifications: [
        {
          id: `noti-${Date.now()}`,
          type: "earnings",
          text: `Withdrawal request of ${isIndia ? '₹' : '$'}${amount} submitted successfully.`,
          timestamp: "Just now",
          read: false
        },
        ...state.notifications
      ]
    });

    return { success: true, message: "Withdrawal request submitted!" };
  };

  const approveWithdrawal = (id: string) => {
    const updated = state.withdrawals.map(w => {
      if (w.id === id) return { ...w, status: "approved" as const };
      return w;
    });
    saveState({ ...state, withdrawals: updated });
  };

  const rejectWithdrawal = (id: string) => {
    let refundAmount = 0;
    const updated = state.withdrawals.map(w => {
      if (w.id === id) {
        refundAmount = w.amount;
        return { ...w, status: "rejected" as const };
      }
      return w;
    });
    saveState({
      ...state,
      earnings: state.earnings + refundAmount,
      withdrawals: updated
    });
  };

  const banUser = (username: string) => {
    if (state.user && state.user.username === username) {
      saveState({
        ...state,
        user: { ...state.user, isBanned: true }
      });
    }
  };

  const suspendUser = (username: string) => {
    if (state.user && state.user.username === username) {
      saveState({
        ...state,
        user: { ...state.user, isSuspended: !state.user.isSuspended }
      });
    }
  };

  const verifyUser = (username: string) => {
    if (state.user && state.user.username === username) {
      saveState({
        ...state,
        user: { ...state.user, isVerified: true }
      });
    }
  };

  const removeVerification = (username: string) => {
    if (state.user && state.user.username === username) {
      saveState({
        ...state,
        user: { ...state.user, isVerified: false }
      });
    }
  };

  const deletePost = (id: string) => {
    const updated = state.posts.map(p => {
      if (p.id === id) return { ...p, status: "deleted" as const };
      return p;
    });
    saveState({ ...state, posts: updated });
  };

  const restorePost = (id: string) => {
    const updated = state.posts.map(p => {
      if (p.id === id) return { ...p, status: "active" as const };
      return p;
    });
    saveState({ ...state, posts: updated });
  };

  const updateSystemSettings = (settings: Partial<AppState["systemSettings"]>) => {
    saveState({
      ...state,
      systemSettings: { ...state.systemSettings, ...settings }
    });
  };

  const toggleAutoRecharge = (type: keyof AppState["autoRecharge"]) => {
    saveState({
      ...state,
      autoRecharge: {
        ...state.autoRecharge,
        [type]: !state.autoRecharge[type]
      }
    });
  };

  const viewPost = (postId: string) => {
    if (!state.user) return;
    const viewer = state.user.username;

    const post = state.posts.find(p => p.id === postId);
    if (!post) return;

    if (post.user === viewer) {
      saveState({
        ...state,
        fraudLogs: {
          ...state.fraudLogs,
          selfViewsCount: state.fraudLogs.selfViewsCount + 1
        }
      });
      return;
    }

    const updatedPosts = state.posts.map(p => {
      if (p.id === postId) {
        return { ...p, views: p.views + 1 };
      }
      return p;
    });

    const adPayout = post.isBoosted ? 1.50 : 0.40;
    const creatorEarnings = adPayout * state.systemSettings.revenueShare;

    saveState({
      ...state,
      posts: updatedPosts,
      earnings: post.user === state.user.username ? state.earnings : state.earnings + creatorEarnings
    });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        t,
        login,
        signup,
        logout,
        updateProfile,
        toggleFollow,
        rechargeWallet,
        watchRewardAd,
        uploadContent,
        toggleAutoRenew,
        boostPost,
        likePost,
        commentPost,
        sendMessage,
        startCall,
        endCall,
        createCampaign,
        approveCampaign,
        rejectCampaign,
        requestWithdrawal,
        approveWithdrawal,
        rejectWithdrawal,
        banUser,
        suspendUser,
        verifyUser,
        removeVerification,
        deletePost,
        restorePost,
        updateSystemSettings,
        toggleAutoRecharge,
        viewPost
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within a StateProvider");
  }
  return context;
}
