"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { useRouter } from "next/navigation";
import { convertURToPercentile } from "../data/cutoffs";
import { 
  X, 
  Lock, 
  Check,
  Sparkles
} from "lucide-react";

export const AuthModal: React.FC = () => {
  const { 
    showAuthModal, 
    setShowAuthModal, 
    loginUser, 
    loginDemo,
    registerUser,
    pendingRedirect, 
    setPendingRedirect 
  } = useApp();
  
  const router = useRouter();

  // Mode: "signin" | "signup" | "demo"
  const [mode, setMode] = useState<"signin" | "signup" | "demo">("signin");
  
  // Sign In inputs
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPass, setSignInPass] = useState("");
  
  // Sign Up inputs
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPhoneOrPercentile, setSignUpPhoneOrPercentile] = useState("");
  const [signUpPass, setSignUpPass] = useState("");

  // Demo inputs
  const [demoName, setDemoName] = useState("");
  const [demoPercentile, setDemoPercentile] = useState("");
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear messages on modal/mode changes
  useEffect(() => {
    setErrorMsg("");
    setSuccessMsg("");
  }, [mode, showAuthModal]);

  if (!showAuthModal) return null;

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    
    const emailClean = signInEmail.trim();
    const passClean = signInPass.trim();

    if (!emailClean) {
      setErrorMsg("Please enter your email");
      return;
    }
    if (!passClean) {
      setErrorMsg("Please enter your password");
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      const res = loginUser(emailClean, passClean);
      setIsSubmitting(false);
      
      if (res.success) {
        const isAdmin = emailClean === "admin@bihareduconnect.in";
        setSuccessMsg(isAdmin ? "Welcome back, Administrator!" : "Successfully logged in!");
        setTimeout(() => {
          setShowAuthModal(false);
          setSignInEmail("");
          setSignInPass("");
          if (isAdmin) {
            router.push("/admin");
          } else if (pendingRedirect) {
            router.push(pendingRedirect);
            setPendingRedirect(null);
          } else {
            router.push("/dashboard");
          }
        }, 1000);
      } else {
        setErrorMsg(res.error || "Sign in failed");
      }
    }, 800);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const nameVal = signUpName.trim();
    const emailVal = signUpEmail.trim();
    const phoneOrPctStr = signUpPhoneOrPercentile.trim();
    const passVal = signUpPass.trim();

    if (!nameVal) {
      setErrorMsg("Please enter your full name");
      return;
    }
    if (!emailVal || !emailVal.includes("@")) {
      setErrorMsg("Please enter a valid email address");
      return;
    }
    if (!phoneOrPctStr) {
      setErrorMsg("Please enter your phone number or percentile");
      return;
    }
    
    // Parse Phone or Percentile:
    // If it looks like a phone number (e.g. 10 digits), we parse it and default percentile to a high-end mock value (e.g. 93.6).
    // If it looks like a decimal/percentile (0 to 100), we use it directly as the percentile.
    let percentileVal = 93.6;
    const cleanDigits = phoneOrPctStr.replace(/\D/g, "");
    
    if (cleanDigits.length >= 10) {
      // It is a phone number, assign default percentile
      percentileVal = 93.6;
    } else {
      const parsedPct = Number(phoneOrPctStr);
      if (isNaN(parsedPct) || parsedPct < 0 || parsedPct > 100) {
        setErrorMsg("Please enter a valid JEE Main percentile between 0 and 100 or a 10-digit phone number");
        return;
      }
      percentileVal = parsedPct;
    }
    
    if (!passVal || passVal.length < 4) {
      setErrorMsg("Choose a password with at least 4 characters");
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      const res = registerUser(nameVal, emailVal, percentileVal, passVal);
      setIsSubmitting(false);
      
      if (res.success) {
        setSuccessMsg("Account successfully registered & signed in!");
        setTimeout(() => {
          setShowAuthModal(false);
          setSignUpName("");
          setSignUpEmail("");
          setSignUpPhoneOrPercentile("");
          setSignUpPass("");
          if (pendingRedirect) {
            router.push(pendingRedirect);
            setPendingRedirect(null);
          } else {
            router.push("/dashboard");
          }
        }, 1000);
      } else {
        setErrorMsg(res.error || "Registration failed");
      }
    }, 800);
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const nameVal = demoName.trim();
    const rankStr = demoPercentile.trim(); // we keep state variable name to avoid editing state hooks unnecessarily

    if (!nameVal) {
      setErrorMsg("Please enter your name");
      return;
    }
    if (!rankStr) {
      setErrorMsg("Please enter your UGEAC General Rank");
      return;
    }

    const rankVal = Number(rankStr);
    if (isNaN(rankVal) || rankVal <= 0) {
      setErrorMsg("Please enter a valid rank number");
      return;
    }

    const pctVal = convertURToPercentile(rankVal);

    setIsSubmitting(true);

    setTimeout(() => {
      const res = loginDemo(nameVal, pctVal);
      setIsSubmitting(false);
      
      if (res.success) {
        setSuccessMsg("Logged in with Demo Account successfully!");
        setTimeout(() => {
          setShowAuthModal(false);
          setDemoName("");
          setDemoPercentile("");
          if (pendingRedirect) {
            router.push(pendingRedirect);
            setPendingRedirect(null);
          } else {
            router.push("/dashboard");
          }
        }, 1000);
      } else {
        setErrorMsg(res.error || "Demo login failed");
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
      <div className="relative w-full max-w-[430px] overflow-hidden rounded-[24px] bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-2xl transition-all duration-300 transform scale-100 flex flex-col z-10 p-8 text-center">

        {/* Close Button */}
        <button 
          onClick={() => setShowAuthModal(false)}
          className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors duration-200"
          title="Close Modal"
        >
          <X className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Lock Icon Circular Badge */}
        <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 text-amber-500 dark:text-amber-400 mb-3.5 mt-2">
          <Lock className="w-6 h-6 stroke-[2]" />
        </div>

        {/* Title */}
        <h3 className="text-[20px] font-bold text-slate-800 dark:text-white tracking-tight leading-snug">
          {mode === "signin" && "Sign in to view the complete list"}
          {mode === "signup" && "Sign up to view the complete list"}
          {mode === "demo" && "Sign in with Demo Account"}
        </h3>

        {/* 100% Free green badge */}
        <div className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-semibold mt-2 mb-6">
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
            <Check className="w-2.5 h-2.5 stroke-[3.5]" />
          </span>
          <span>100% Free, No Ads</span>
        </div>

        {/* Notification Blocks */}
        <div className="min-h-[20px] mb-3">
          {errorMsg && (
            <div className="px-3.5 py-2 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-500 text-xs font-bold text-center">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-500 text-xs font-bold text-center flex items-center justify-center gap-1.5 animate-bounce">
              <Check className="w-3.5 h-3.5 shrink-0 stroke-[3]" />
              {successMsg}
            </div>
          )}
        </div>

        {/* Form Body */}
        <div className="text-left">
          {mode === "signin" && (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white rounded-xl focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 font-semibold transition-all duration-200 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={signInPass}
                  onChange={(e) => setSignInPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white rounded-xl focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 font-semibold transition-all duration-200 placeholder-slate-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#0070f3] hover:bg-[#0060d0] text-white rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5 transition-all duration-250 disabled:opacity-50 text-sm tracking-wide mt-6 shadow-sm shadow-blue-500/10"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>

              {/* Or separator and Demo Account */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-150 dark:border-slate-800"></div>
                </div>
                <span className="relative px-3 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 text-[10px] font-extrabold uppercase tracking-widest">
                  Or
                </span>
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setMode("demo")}
                className="w-full py-2.5 bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 text-[#D97706] dark:text-amber-400 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5 transition-all duration-200 text-xs uppercase tracking-wider disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                Sign In with Demo Account
              </button>

              <div className="pt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </form>
          )}

          {mode === "signup" && (
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="What should we call you?"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white rounded-xl focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 font-semibold transition-all duration-200 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white rounded-xl focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 font-semibold transition-all duration-200 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                {/* Prefix Country Selector like the screenshot */}
                <div className="relative flex border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden focus-within:border-blue-600 dark:focus-within:border-blue-500 bg-white dark:bg-slate-950 transition-all duration-200">
                  <div className="flex items-center gap-1 px-3 border-r border-gray-200/80 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 text-xs font-bold select-none shrink-0">
                    <span>IN</span>
                    <span className="text-[7px] text-slate-400 dark:text-slate-500">▼</span>
                    <span className="text-slate-400 dark:text-slate-500 pl-0.5">+91</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={signUpPhoneOrPercentile}
                    onChange={(e) => setSignUpPhoneOrPercentile(e.target.value)}
                    placeholder="Enter your phone number"
                    className="flex-1 px-4 py-2.5 text-sm bg-transparent dark:text-white focus:outline-none font-semibold placeholder-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1.5">
                  Choose Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={signUpPass}
                  onChange={(e) => setSignUpPass(e.target.value)}
                  placeholder="Min 4 characters"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white rounded-xl focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 font-semibold transition-all duration-200 placeholder-slate-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#0070f3] hover:bg-[#0060d0] text-white rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5 transition-all duration-250 disabled:opacity-50 text-sm tracking-wide mt-6 shadow-sm shadow-blue-500/10"
              >
                {isSubmitting ? "Sending..." : "Send OTP"}
              </button>

              {/* Or separator and Demo Account */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-150 dark:border-slate-800"></div>
                </div>
                <span className="relative px-3 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 text-[10px] font-extrabold uppercase tracking-widest">
                  Or
                </span>
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setMode("demo")}
                className="w-full py-2.5 bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 text-[#D97706] dark:text-amber-400 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5 transition-all duration-200 text-xs uppercase tracking-wider disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                Sign In with Demo Account
              </button>

              <div className="pt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {mode === "demo" && (
            <form onSubmit={handleDemoSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1.5">
                  Aspirant Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={demoName}
                  onChange={(e) => setDemoName(e.target.value)}
                  placeholder="What should we call you?"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white rounded-xl focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 font-semibold transition-all duration-200 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1.5">
                  UGEAC General Rank <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={demoPercentile}
                  onChange={(e) => setDemoPercentile(e.target.value)}
                  placeholder="e.g. 4500"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white rounded-xl focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 font-semibold transition-all duration-200 placeholder-slate-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#0070f3] hover:bg-[#0060d0] text-white rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5 transition-all duration-250 disabled:opacity-50 text-sm tracking-wide mt-6 shadow-sm shadow-blue-500/10"
              >
                <Sparkles className="w-4 h-4 text-white" />
                {isSubmitting ? "Signing in..." : "Sign In as Guest"}
              </button>

              <div className="pt-4 text-center text-xs text-slate-500 dark:text-slate-400 space-x-2">
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Small Bottom T&C Disclaimer like the screenshot */}
        <div className="text-[11px] text-slate-550 dark:text-slate-450 mt-6 border-t border-gray-100/80 dark:border-slate-850 pt-4 leading-relaxed">
          By clicking {mode === "signup" ? "Sign Up" : "Sign In"}, you agree to our{" "}
          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
            Terms & Conditions
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
