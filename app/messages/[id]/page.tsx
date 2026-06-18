"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppState } from "@/lib/state";
import { 
  Phone, 
  Video, 
  Send, 
  Paperclip, 
  Mic, 
  ChevronLeft, 
  Image as ImageIcon, 
  FileText, 
  Check, 
  CheckCheck, 
  Lock,
  Circle,
  Play
} from "lucide-react";

export default function MessageThreadPage() {
  const params = useParams();
  const router = useRouter();
  const { state, sendMessage, startCall } = useAppState();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatId = params.id as string;
  const chat = state.chats.find(c => c.id === chatId);

  const [text, setText] = useState("");
  const [showAttachments, setShowAttachments] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  // Mark chat messages as read on view
  useEffect(() => {
    if (chat) {
      chat.messages.forEach(m => {
        if (m.sender === "other") m.status = "read";
      });
      localStorage.setItem("premrog_state", JSON.stringify(state));
    }
  }, [chat]);

  if (!chat) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-6 text-center">
        <p className="text-gray-400 mb-4">Chat conversation not found.</p>
        <button 
          onClick={() => router.push("/chat")}
          className="bg-pink-600 px-5 py-2 rounded-xl text-xs font-bold"
        >
          Back to Chats
        </button>
      </div>
    );
  }

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(chatId, text, "text");
    setText("");
  };

  const handleSendFile = (type: "image" | "file" | "voice") => {
    setShowAttachments(false);
    let mockContent = "Check this out!";
    if (type === "image") {
      mockContent = "Sent a photo 🖼️";
      sendMessage(chatId, mockContent, "image");
    } else if (type === "file") {
      mockContent = "invoice_premrog.pdf (4.2 MB)";
      sendMessage(chatId, mockContent, "file");
    } else {
      mockContent = "Voice Note 🎙️ (0:12)";
      sendMessage(chatId, mockContent, "voice");
    }
  };

  const handleStartCall = (callType: "audio" | "video") => {
    startCall(callType, chat.name);
    router.push(callType === "audio" ? "/audio-call" : "/video-call");
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      handleSendFile("voice");
    }, 2500); // simulate recording for 2.5s
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative font-sans max-w-md mx-auto border-x border-white/5">
      {/* Background gradients */}
      <div className="absolute top-12 left-1/4 w-[200px] h-[200px] bg-purple-950/15 rounded-full blur-[80px] pointer-events-none" />

      {/* Header bar */}
      <header className="sticky top-0 z-20 bg-black/85 backdrop-blur-md border-b border-white/10 p-3.5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/chat")} className="text-gray-400 hover:text-white transition">
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <img 
              src={chat.avatar} 
              alt={chat.name} 
              className="w-10 h-10 rounded-full object-cover border border-white/10"
            />
            {chat.online && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black" />
            )}
          </div>

          <div>
            <h2 className="font-bold text-xs leading-none">{chat.name}</h2>
            <span className="text-[9px] text-gray-500 font-semibold mt-1 block">
              {chat.online ? "Online Now" : "End-to-End Encrypted"}
            </span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleStartCall("audio")}
            className="text-pink-500 hover:text-pink-400 transition"
          >
            <Phone className="w-4.5 h-4.5" />
          </button>
          <button 
            onClick={() => handleStartCall("video")}
            className="text-pink-500 hover:text-pink-400 transition"
          >
            <Video className="w-4.5 h-4.5" />
          </button>
        </div>
      </header>

      {/* Messages console area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 select-text">
        {/* Encryption alert banner */}
        <div className="flex items-center justify-center gap-1.5 bg-white/5 border border-white/5 rounded-xl py-2 px-3 text-[10px] text-gray-400 text-center max-w-xs mx-auto">
          <Lock className="w-3.5 h-3.5 text-pink-500" />
          <span>Messages are secured with P2P encryption keys.</span>
        </div>

        {chat.messages.map((msg) => {
          const isMe = msg.sender === "me";
          return (
            <div 
              key={msg.id} 
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-xs shadow-md border ${
                  isMe 
                    ? "bg-pink-600 border-pink-500/20 text-white rounded-br-none" 
                    : "bg-white/5 border-white/5 text-gray-200 rounded-bl-none"
                }`}
              >
                {/* Check custom content type rendering */}
                {msg.type === "image" ? (
                  <div className="space-y-2">
                    <img 
                      src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300" 
                      alt="Shared Image" 
                      className="rounded-xl max-h-40 w-full object-cover"
                    />
                    <p>{msg.text}</p>
                  </div>
                ) : msg.type === "file" ? (
                  <div className="flex items-center gap-2.5 bg-black/30 p-2 rounded-xl border border-white/5">
                    <FileText className="w-6 h-6 text-pink-500" />
                    <div>
                      <span className="font-bold block truncate max-w-[120px] text-[11px]">{msg.text}</span>
                      <span className="text-[8px] text-gray-500 block mt-0.5">PDF Document</span>
                    </div>
                  </div>
                ) : msg.type === "voice" ? (
                  <div className="flex items-center gap-2.5">
                    <button className="bg-black/40 hover:bg-black/60 p-2 rounded-full border border-white/10 text-pink-500">
                      <Play className="w-3.5 h-3.5 fill-pink-500" />
                    </button>
                    <div className="flex-1 flex gap-0.5 items-center">
                      <span className="h-4 w-0.5 bg-pink-500 rounded-full" />
                      <span className="h-6 w-0.5 bg-pink-500 rounded-full" />
                      <span className="h-3 w-0.5 bg-pink-500 rounded-full" />
                      <span className="h-7 w-0.5 bg-pink-500 rounded-full" />
                      <span className="h-5 w-0.5 bg-pink-500 rounded-full" />
                      <span className="h-2 w-0.5 bg-pink-500 rounded-full" />
                    </div>
                    <span className="text-[8px] text-gray-300 font-bold">0:12</span>
                  </div>
                ) : (
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                )}

                <div className="flex justify-end items-center gap-1.5 mt-1.5">
                  <span className="text-[8px] text-white/50 block font-medium">
                    {msg.timestamp}
                  </span>
                  {isMe && (
                    msg.status === "read" ? (
                      <CheckCheck className="w-3 h-3 text-white" />
                    ) : (
                      <Check className="w-3 h-3 text-white/50" />
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachments quick drawer */}
      {showAttachments && (
        <div className="absolute bottom-16 left-4 right-4 bg-gray-950/95 border border-white/10 p-4 rounded-3xl backdrop-blur-xl z-20 grid grid-cols-3 gap-3 animate-fade-in shadow-2xl">
          <button 
            onClick={() => handleSendFile("image")}
            className="flex flex-col items-center gap-2 p-3 hover:bg-white/5 rounded-2xl transition"
          >
            <div className="p-3 bg-pink-500/10 rounded-full text-pink-500">
              <ImageIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-gray-300">Share Photo</span>
          </button>

          <button 
            onClick={() => handleSendFile("file")}
            className="flex flex-col items-center gap-2 p-3 hover:bg-white/5 rounded-2xl transition"
          >
            <div className="p-3 bg-purple-500/10 rounded-full text-purple-500">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-gray-300">Share File</span>
          </button>

          <button 
            onClick={() => handleSendFile("voice")}
            className="flex flex-col items-center gap-2 p-3 hover:bg-white/5 rounded-2xl transition"
          >
            <div className="p-3 bg-indigo-500/10 rounded-full text-indigo-500">
              <Mic className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-gray-300">Voice Note</span>
          </button>
        </div>
      )}

      {/* Input panel bar */}
      <footer className="p-4 bg-gradient-to-t from-black to-black/85 border-t border-white/10 flex items-center gap-2.5">
        <button 
          onClick={() => setShowAttachments(!showAttachments)}
          className={`p-2 rounded-xl transition ${
            showAttachments ? "bg-pink-500 text-white" : "bg-white/5 text-gray-400 hover:text-white"
          }`}
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={isRecording ? "Recording voice note..." : "Type message securely..."}
            disabled={isRecording}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition"
          />
        </div>

        {text.trim() !== "" ? (
          <button
            onClick={handleSend}
            className="bg-pink-600 hover:bg-pink-500 p-2.5 rounded-2xl text-white transition shadow-lg shadow-pink-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        ) : (
          <button
            onMouseDown={startVoiceRecording}
            className={`p-2.5 rounded-2xl transition ${
              isRecording ? "bg-red-600 animate-pulse text-white" : "bg-white/5 text-gray-400 hover:text-white"
            }`}
            title="Hold to record"
          >
            <Mic className="w-4 h-4" />
          </button>
        )}
      </footer>
    </div>
  );
}