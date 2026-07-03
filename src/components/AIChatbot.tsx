"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { 
  Sparkles, 
  MessageSquare, 
  X, 
  Send, 
  User, 
  Bot,
  HelpCircle,
  FileText,
  Milestone,
  CheckCircle2
} from "lucide-react";
import { convertPercentileToUR } from "../data/cutoffs";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export const AIChatbot: React.FC = () => {
  const { user } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-init",
      sender: "bot",
      text: "Namaste! I am your BiharEduConnect AI Counselling Assistant. 🎓 I can help you understand the UGEAC engineering counselling process, cutoff ranks, college branches, and required documents. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = React.useMemo(() => {
    const rankToUse = user?.percentile ? Math.round(convertPercentileToUR(user.percentile)) : 1500;
    return [
      { text: "UGEAC 2026 important dates?", icon: Milestone },
      { text: "Documents needed for DV?", icon: FileText },
      { text: "Choice filling strategy tips?", icon: CheckCircle2 },
      { text: `Which college can I get with rank ${rankToUse}?`, icon: HelpCircle }
    ];
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Sync active chat session with Firestore for Admin Panel logs
  useEffect(() => {
    if (messages.length <= 1) return;
    
    const syncChatToFirestore = async () => {
      try {
        let anonId = "";
        if (typeof window !== "undefined") {
          anonId = localStorage.getItem("bihareduconnect_anon_id") || "";
          if (!anonId) {
            anonId = Math.random().toString(36).substring(2, 8).toUpperCase();
            localStorage.setItem("bihareduconnect_anon_id", anonId);
          }
        }
        
        const sessionId = user 
          ? `session-${(user.email || user.name).toLowerCase().replace(/[^a-zA-Z0-9]/g, "_")}` 
          : `session-guest-${anonId}`;
        
        const updatedSession = {
          id: sessionId,
          studentName: user ? user.name : `Guest Student #${anonId}`,
          studentEmail: user ? (user.email || `No Email (Guest #${anonId})`) : `anonymous.${anonId}@bihareduconnect.in`,
          percentile: user ? (user.percentile || 0) : 0,
          messages: messages.map(m => ({
            sender: m.sender,
            text: m.text,
            timestamp: m.timestamp
          })),
          lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
          })
        };
        
        await setDoc(doc(db, "chat_sessions", sessionId), updatedSession);
      } catch (e) {
        console.error("Failed to sync chat session to Firestore:", e);
      }
    };

    syncChatToFirestore();
  }, [messages, user]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // 1. Add User Message
    const userMsg: Message = {
      id: `msg-${Date.now()}-u`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText("");
    setIsTyping(true);

    // 2. Call real Gemini AI API
    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();
      const replyText = data.reply || data.error || "Sorry, I couldn't process your question. Please try again!";

      const botMsg: Message = {
        id: `msg-${Date.now()}-b`,
        sender: "bot",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errMsg: Message = {
        id: `msg-${Date.now()}-err`,
        sender: "bot",
        text: "⚠️ Network error — unable to reach the AI service. Please check your connection and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Render markdown helper
  const renderMessageText = (text: string, isUser: boolean) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      let content = line;
      let isBullet = false;
      if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
        content = line.replace(/^\s*[\*\-]\s+/, "");
        isBullet = true;
      }
      
      const parts = content.split(/(\*\*.*?\*\*)/g);
      const parsedParts = parts.map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong 
              key={j} 
              className={`font-black ${isUser ? "text-white" : "text-slate-900 dark:text-white"}`}
            >
              {part.slice(2, -2)}
            </strong>
          );
        }
        
        const linkParts = part.split(/(\[.*?\]\(.*?\))/g);
        return linkParts.map((linkPart, k) => {
          const match = linkPart.match(/\[(.*?)\]\((.*?)\)/);
          if (match) {
            return (
              <a 
                key={k} 
                href={match[2]} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`${isUser ? "text-cyan-250 underline" : "text-cyan-600 dark:text-cyan-400 font-bold hover:underline"}`}
              >
                {match[1]}
              </a>
            );
          }
          return linkPart;
        });
      });

      if (isBullet) {
        return (
          <div key={i} className="flex items-start gap-2 ml-2.5 mt-1.5">
            <span className={`select-none mt-1.5 text-xs ${isUser ? "text-indigo-200" : "text-cyan-500"}`}>•</span>
            <span className="flex-1 text-xs leading-relaxed">{parsedParts}</span>
          </div>
        );
      }

      return (
        <p 
          key={i} 
          className={`${line.trim() === "" ? "h-2" : "mt-1.5"} text-xs leading-relaxed`}
        >
          {parsedParts}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      {/* 1. Chat Widget Window */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[410px] h-[520px] sm:h-[580px] mb-4 rounded-[28px] glass-card shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-right relative border border-slate-200/50 dark:border-slate-800/80 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Decorative Top Accent Gradient Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500" />

          {/* Chat Header */}
          <div className="px-4.5 py-4 bg-slate-50/90 dark:bg-slate-950/90 border-b border-slate-200/60 dark:border-slate-800/60 text-slate-800 dark:text-gray-150 flex items-center justify-between shadow-sm backdrop-blur-md relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative p-2 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white shadow-md">
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white dark:border-slate-950"></span>
              </div>
              <div>
                <h3 className="text-xs font-black tracking-wide leading-none uppercase text-slate-900 dark:text-white">Counselling AI Assistant</h3>
                <span className="text-[9px] text-indigo-500 dark:text-indigo-400 font-extrabold flex items-center gap-1 mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-ping" />
                  Active Live Node
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all duration-200 cursor-pointer border border-transparent hover:border-slate-200/50 dark:hover:border-slate-800/50"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-3 max-w-[88%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-white/10 ${
                  msg.sender === "user" 
                    ? "bg-gradient-to-br from-indigo-500 to-cyan-500 text-white" 
                    : "bg-gradient-to-br from-violet-600 to-indigo-500 text-white"
                }`}>
                  {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble Container */}
                <div>
                  <div className={`px-4 py-3 rounded-[22px] text-xs leading-relaxed shadow-sm border ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-indigo-600 to-cyan-500 text-white border-indigo-500/20 rounded-tr-none"
                      : "bg-white dark:bg-slate-900 text-slate-800 dark:text-gray-100 border-slate-100 dark:border-slate-800/80 rounded-tl-none"
                  }`}>
                    {renderMessageText(msg.text, msg.sender === "user")}
                  </div>
                  <span className={`text-[8px] text-gray-400 mt-1 block px-1 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-500 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/85 rounded-[22px] rounded-tl-none shadow-sm flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies Tray */}
          {messages.length === 1 && !isTyping && (
            <div className="px-4.5 py-3 border-t border-slate-200/50 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
              <span className="text-[9px] text-gray-400 dark:text-gray-550 uppercase tracking-widest block mb-2 font-black">Frequently Asked Questions</span>
              <div className="grid grid-cols-2 gap-2">
                {quickReplies.map((q) => {
                  const Icon = q.icon;
                  return (
                    <button
                      key={q.text}
                      onClick={() => handleSendMessage(q.text)}
                      className="flex items-center gap-2 px-3 py-2 border border-slate-200/65 dark:border-slate-800 hover:border-cyan-400 dark:hover:border-cyan-500 rounded-xl text-left text-[10px] text-slate-700 dark:text-gray-300 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-cyan-50/20 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer shadow-sm hover:-translate-y-0.5 font-bold"
                    >
                      <Icon className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                      <span className="truncate">{q.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input Panel */}
          <div className="p-3 bg-slate-50/70 dark:bg-slate-950/80 border-t border-slate-200/50 dark:border-slate-800/60 backdrop-blur-md flex gap-2 z-10">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
              placeholder="Ask me about UGEAC cutoffs, schedule..."
              className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-800/80 rounded-2xl text-xs font-semibold focus:outline-none premium-input bg-white/95 dark:bg-slate-900/90 dark:text-white shadow-inner"
            />
            <button
              onClick={() => handleSendMessage(inputText)}
              disabled={!inputText.trim()}
              className="btn-premium p-3 text-white rounded-2xl disabled:opacity-50 transition-all duration-300 cursor-pointer shadow-md hover-magnetic flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Float Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-xl shadow-indigo-500/30 hover:scale-105 transition-transform duration-300 cursor-pointer group pulse-glow-blue relative z-50 border border-white/10"
        aria-label="Ask AI Counsellor"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 animate-ping opacity-25 group-hover:opacity-40" />
        {isOpen ? (
          <X className="w-6 h-6 text-white transition-transform duration-300 rotate-90 relative z-10" />
        ) : (
          <div className="relative flex items-center justify-center z-10">
            <MessageSquare className="w-6 h-6 group-hover:rotate-6 transition-transform" />
            <span className="absolute -top-3 -right-3 flex h-5 w-auto px-1.5 items-center justify-center rounded-full bg-slate-900 dark:bg-white text-[10px] font-black text-cyan-400 dark:text-indigo-600 border border-slate-700 dark:border-white shadow-md">
              AI
            </span>
          </div>
        )}
      </button>
    </div>
  );
};

export default AIChatbot;
