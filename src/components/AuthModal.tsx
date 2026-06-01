"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { useRouter } from "next/navigation";
import { 
  X, 
  User, 
  Percent, 
  Mail, 
  Lock, 
  ShieldAlert, 
  Sparkles, 
  LogIn, 
  CheckCircle,
  GraduationCap
} from "lucide-react";

export const AuthModal: React.FC = () => {
  const { 
    showAuthModal, 
    setShowAuthModal, 
    loginDemo, 
    loginAdmin, 
    pendingRedirect, 
    setPendingRedirect 
  } = useApp();
  
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"demo" | "admin">("demo");
  const [demoName, setDemoName] = useState("");
  const [demoPercentile, setDemoPercentile] = useState<number | "">("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear messages on modal open/close or tab switch
  useEffect(() => {
    setErrorMsg("");
    setSuccessMsg("");
  }, [showAuthModal, activeTab]);

  if (!showAuthModal) return null;

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    
    if (!demoName.trim()) {
      setErrorMsg("Please enter your name");
      return;
    }
    const percentileVal = Number(demoPercentile);
    if (!demoPercentile || percentileVal < 0 || percentileVal > 100) {
      setErrorMsg("Please enter a valid JEE percentile between 0 and 100");
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      loginDemo(demoName.trim(), percentileVal);
      setSuccessMsg("Logged in successfully as Demo User!");
      setIsSubmitting(false);
      
      setTimeout(() => {
        setShowAuthModal(false);
        // Clear fields
        setDemoName("");
        setDemoPercentile("");
        
        // Handle pending redirect
        if (pendingRedirect) {
          router.push(pendingRedirect);
          setPendingRedirect(null);
        }
      }, 1000);
    }, 800);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!adminEmail.trim() || !adminPassword) {
      setErrorMsg("Please fill in all administrative fields");
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      const success = loginAdmin(adminEmail.trim(), adminPassword);
      setIsSubmitting(false);
      
      if (success) {
        setSuccessMsg("Welcome, Administrator!");
        
        setTimeout(() => {
          setShowAuthModal(false);
          // Clear fields
          setAdminEmail("");
          setAdminPassword("");
          
          // Handle pending redirect
          if (pendingRedirect) {
            router.push(pendingRedirect);
            setPendingRedirect(null);
          }
        }, 1000);
      } else {
        setErrorMsg("Invalid administrative email or password");
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setShowAuthModal(false)}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800/85 shadow-2xl transition-all duration-300 transform scale-100 flex flex-col z-10">
        
        {/* Top Glow decoration */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#FF9933] via-[#2563EB] to-[#138808]"></div>

        {/* Close Button */}
        <button 
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 p-1.5 rounded-xl border border-gray-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-gray-400 hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors duration-200"
          title="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="px-6 pt-8 pb-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF9933] to-[#138808] text-white shadow-md mb-3">
            <GraduationCap className="w-6 h-6 animate-bounce" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight">
            Sign In to <span className="bg-gradient-to-r from-[#FF9933] via-[#2563EB] to-[#138808] bg-clip-text text-transparent">BiharEduConnect</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[280px] mx-auto">
            Unlock UGEAC engineering college predictors, cutoffs, and counseling tools.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pb-2">
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-gray-200/50 dark:border-slate-850">
            <button
              onClick={() => setActiveTab("demo")}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "demo"
                  ? "bg-white dark:bg-slate-800 text-[#2563EB] dark:text-[#FF9933] shadow-sm font-extrabold"
                  : "text-gray-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Demo Account
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "admin"
                  ? "bg-white dark:bg-slate-800 text-[#2563EB] dark:text-[#FF9933] shadow-sm font-extrabold"
                  : "text-gray-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Admin Portal
            </button>
          </div>
        </div>

        {/* Notification Blocks */}
        <div className="px-6 py-1 min-h-[28px]">
          {errorMsg && (
            <div className="px-3.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10.5px] font-bold text-center animate-shake">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10.5px] font-bold text-center flex items-center justify-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              {successMsg}
            </div>
          )}
        </div>

        {/* Form Body */}
        <div className="px-6 pb-8 pt-2">
          {activeTab === "demo" ? (
            <form onSubmit={handleDemoSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
                  Aspirant Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={demoName}
                    onChange={(e) => setDemoName(e.target.value)}
                    placeholder="e.g. Rahul Kumar"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-slate-850 bg-gray-50 dark:bg-slate-950 dark:text-white rounded-xl focus:outline-none focus:border-[#2563EB] dark:focus:border-[#FF9933] font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
                  JEE Main / BCECE Percentile
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                    <Percent className="w-4 h-4" />
                  </span>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    min="0"
                    max="100"
                    value={demoPercentile}
                    onChange={(e) => setDemoPercentile(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 92.4587"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-slate-850 bg-gray-50 dark:bg-slate-950 dark:text-white rounded-xl focus:outline-none focus:border-[#2563EB] dark:focus:border-[#FF9933] font-semibold"
                  />
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-550 mt-1 leading-relaxed">
                  Enter your percentile score. It will load predictive outcomes instantly.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-[#FF9933] to-[#138808] hover:shadow-lg hover:shadow-[#138808]/15 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 text-xs uppercase tracking-wider"
              >
                <LogIn className="w-4 h-4" />
                {isSubmitting ? "Signing in..." : "Login as Demo User"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
                  Administrative Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@bihareduconnect.in"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-slate-850 bg-gray-50 dark:bg-slate-950 dark:text-white rounded-xl focus:outline-none focus:border-[#2563EB] dark:focus:border-[#FF9933] font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
                  Secure Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-slate-850 bg-gray-50 dark:bg-slate-950 dark:text-white rounded-xl focus:outline-none focus:border-[#2563EB] dark:focus:border-[#FF9933] font-semibold"
                  />
                </div>
              </div>



              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-[#2563EB] to-[#1E40AF] hover:shadow-lg text-white rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 text-xs uppercase tracking-wider"
              >
                <LogIn className="w-4 h-4" />
                {isSubmitting ? "Authenticating..." : "Login as Administrator"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default AuthModal;
