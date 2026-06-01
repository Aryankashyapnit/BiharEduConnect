"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
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

  const quickReplies = [
    { text: "What documents are required?", icon: FileText },
    { text: "What is the counselling process?", icon: Milestone },
    { text: "Can I get MIT Muzaffarpur?", icon: HelpCircle },
    { text: "Choice filling tips?", icon: CheckCircle2 }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Sync active chat session with localStorage for Admin Panel logs
  useEffect(() => {
    if (messages.length <= 1) return;
    
    try {
      const storedSessions = localStorage.getItem("bihareduconnect_chat_sessions");
      let sessions: any[] = storedSessions ? JSON.parse(storedSessions) : [];
      
      const sessionId = user ? `session-${user.email || user.name}` : "session-guest";
      const existingIndex = sessions.findIndex(s => s.id === sessionId);
      
      const updatedSession = {
        id: sessionId,
        studentName: user ? user.name : "Guest Student",
        studentEmail: user ? (user.email || "No Email (Guest)") : "guest@bihareduconnect.in",
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
      
      if (existingIndex > -1) {
        sessions[existingIndex] = updatedSession;
      } else {
        sessions.unshift(updatedSession);
      }
      
      localStorage.setItem("bihareduconnect_chat_sessions", JSON.stringify(sessions));
    } catch (e) {
      console.error("Failed to sync chat session to admin log:", e);
    }
  }, [messages, user]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // 1. Add User Message
    const userMsg: Message = {
      id: `msg-${Date.now()}-u`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // 2. Mock AI Response after a small delay
    setTimeout(() => {
      let replyText = "";
      const lowerText = text.toLowerCase();

      if (lowerText.includes("document") || lowerText.includes("docs") || lowerText.includes("kaagaz")) {
        replyText = "Here is the checklist of required documents for BCECE UGEAC Document Verification (DV):\n\n" +
          "1. JEE Main Admit Card & Rank Card 2025\n" +
          "2. BCECE UGEAC 2026 Application Form (Part-A & Part-B)\n" +
          "3. Class 10 & 12 passing certificate and marksheet\n" +
          "4. Resident Certificate of Bihar State (Mandatory)\n" +
          "5. Category/Caste Certificate (if applicable)\n" +
          "6. EWS / DQ / SMQ specific certificate (if applicable)\n" +
          "7. Character certificate & School Leaving Certificate (SLC)\n" +
          "8. 6 Passport-size photographs (same as JEE Main application)\n" +
          "9. Aadhar Card for ID proof.";
      } else if (lowerText.includes("process") || lowerText.includes("counselling") || lowerText.includes("steps")) {
        replyText = "The BCECE UGEAC Counselling takes place in these stages:\n\n" +
          "1. **Online Registration**: Fill personal/academic details and pay the registration fee.\n" +
          "2. **Merit List**: BCECE releases a state merit list based on JEE Main ranks.\n" +
          "3. **Choice Filling**: Log in to list your preferred colleges & branches. This is the most crucial step!\n" +
          "4. **Seat Allotment Round 1**: Check if you got allocated a seat.\n" +
          "5. **Freezing/Upgradation Choice**: Select 'Freeze' to take the seat or 'Upgrade' for Round 2.\n" +
          "6. **Document Verification (DV)**: Physically verify original documents at designated nodal centers.\n" +
          "7. **Round 2 & Mop-up Round**: Remaining vacant seats are allocated in subsequent lists.";
      } else if (lowerText.includes("mit") || lowerText.includes("muzaffarpur") || lowerText.includes("mitm")) {
        replyText = "Muzaffarpur Institute of Technology (MIT Muzaffarpur) is Bihar's top government engineering college! 🏛️\n\n" +
          "To get Computer Science & Engineering (CSE) at MIT:\n" +
          "- General/UR Category: Closing ranks are typically under **240-280** in UGEAC merit.\n" +
          "- BC Category: Under **380**.\n" +
          "- EBC Category: Under **410**.\n" +
          "- SC Category: Under **950**.\n\n" +
          "If your rank is slightly higher (e.g. 500-1000), you have great chances for ECE, Information Technology (IT), or Electrical/Mechanical branches at MIT!";
      } else if (lowerText.includes("choice") || lowerText.includes("filling") || lowerText.includes("lock")) {
        replyText = "💡 **Top Choice Filling Strategy Tips:**\n\n" +
          "1. Always list your dream colleges at the top, regardless of your rank. Next.js doesn't charge extra for higher choices!\n" +
          "2. Order of priority should be: MIT Muzaffarpur ➔ BCE Bhagalpur ➔ GCE Gaya ➔ BCE Bakhtiyarpur ➔ NCE Chandi.\n" +
          "3. CSE & ECE branches fill first. If you want CSE, list CSE in all top 5 colleges first, then move to ECE or IT.\n" +
          "4. Don't forget to **LOCK** your choices. If you don't lock, your choices will lock automatically at the deadline, but it's best to verify and lock them manually.";
      } else if (lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("pranam")) {
        replyText = "Hello there! I hope your preparation is going well. Let me know your BCECE or JEE Main rank and category, and I can suggest which engineering college or branch you can secure this year!";
      } else if (lowerText.includes("rank") || lowerText.includes("percentile") || lowerText.includes("college")) {
        replyText = "To predict the best colleges for your specific rank, please close this chat and use our **College Predictor** tool in the navbar! 🚀 Just enter your rank, category, and gender, and our algorithm will categorize your chances as High, Moderate, or Low with full cutoff graphs!";
      } else {
        replyText = "That's a very good question! Based on current UGEAC directives, B.Tech admission is strictly determined by JEE Main score merits. For placements, MIT Muzaffarpur and BCE Bhagalpur top the chart with average packages around 5-6 LPA. \n\nIs there anything else I can clarify about document submissions or seat quotas?";
      }

      const botMsg: Message = {
        id: `msg-${Date.now()}-b`,
        sender: "bot",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      {/* 1. Chat Widget Window */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[400px] h-[500px] sm:h-[550px] mb-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-right">
          {/* Chat Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-[#FF9933]/90 via-[#2563EB]/90 to-[#138808]/90 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <div className="relative p-1.5 rounded-lg bg-white/20">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-400 border border-white"></span>
              </div>
              <div>
                <h3 className="text-sm font-bold leading-none">Counselling AI Assistant</h3>
                <span className="text-[10px] text-white/80 font-medium">Active (BiharEduConnect)</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors duration-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-950/40">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-2.5 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  msg.sender === "user" 
                    ? "bg-[#2563EB] text-white" 
                    : "bg-gradient-to-tr from-[#FF9933] to-[#138808] text-white"
                }`}>
                  {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble Container */}
                <div>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-sm border ${
                    msg.sender === "user"
                      ? "bg-[#2563EB] text-white border-[#2563EB]/10 rounded-tr-none"
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-gray-100 border-gray-100 dark:border-slate-700 rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                  <span className={`text-[9px] text-gray-400 mt-1 block ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2.5 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF9933] to-[#138808] text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
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
            <div className="px-4 py-2 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1.5 font-bold">Frequently Asked:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {quickReplies.map((q) => {
                  const Icon = q.icon;
                  return (
                    <button
                      key={q.text}
                      onClick={() => handleSendMessage(q.text)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-200 dark:border-slate-850 hover:border-[#FF9933] dark:hover:border-[#FF9933] rounded-lg text-left text-[11px] text-gray-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all duration-200 cursor-pointer"
                    >
                      <Icon className="w-3.5 h-3.5 text-[#FF9933] shrink-0" />
                      <span className="truncate">{q.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input Panel */}
          <div className="p-3 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
              placeholder="Ask me anything about UGEAC..."
              className="flex-1 px-3 py-2 border border-gray-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-[#FF9933] bg-gray-50 dark:bg-slate-950 dark:text-white"
            />
            <button
              onClick={() => handleSendMessage(inputText)}
              disabled={!inputText.trim()}
              className="p-2.5 bg-[#FF9933] hover:bg-[#FF9933]/90 text-white rounded-xl disabled:opacity-50 disabled:hover:bg-[#FF9933] transition-colors duration-200 cursor-pointer"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Float Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#FF9933] via-[#2563EB] to-[#138808] text-white shadow-xl shadow-[#2563EB]/20 hover:scale-105 transition-transform duration-300 cursor-pointer group"
        aria-label="Ask AI Counsellor"
      >
        {isOpen ? (
          <X className="w-6 h-6 animate-spin-once" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-6 h-6 group-hover:rotate-6 transition-transform" />
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border border-white">
              AI
            </span>
          </div>
        )}
      </button>
    </div>
  );
};
export default AIChatbot;
