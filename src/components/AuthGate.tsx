"use client";

import React from "react";
import { useApp } from "../context/AppContext";
import { usePathname } from "next/navigation";
import { Lock, Sparkles, Compass, ShieldAlert } from "lucide-react";

export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setShowAuthModal, setPendingRedirect } = useApp();
  const pathname = usePathname();

  if (user) {
    return <>{children}</>;
  }

  const handleOpenAuth = () => {
    setPendingRedirect(pathname);
    setShowAuthModal(true);
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#2563EB]/5 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 transition-all duration-300">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-gradient-to-tr from-[#FF9933]/10 to-[#138808]/10 blur-3xl opacity-60"></div>
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-64 w-64 rounded-full bg-gradient-to-br from-[#2563EB]/10 to-emerald-500/10 blur-3xl opacity-60"></div>

      {/* Main Locked Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-gray-250/70 dark:border-slate-800/85 p-8 sm:p-10 shadow-2xl text-center">
        {/* Top Glow bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#FF9933] via-[#2563EB] to-[#138808]"></div>
        
        {/* Animated Locked Badge */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="absolute inset-0 rounded-3xl bg-[#FF9933]/15 animate-ping opacity-75"></div>
          <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#FF9933]/10 to-[#FF9933]/20 border border-[#FF9933]/30 flex items-center justify-center text-[#FF9933] shadow-md shadow-[#FF9933]/5">
            <Lock className="w-8 h-8" />
          </div>
        </div>

        {/* Info Text */}
        <div className="space-y-3 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF9933]/10 border border-[#FF9933]/20 text-[#FF9933] text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#FF9933]" />
            BCECE UGEAC Counselling 2026
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white leading-tight">
            Admissions Portal Locked
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
            Our predictive outcome matching, round cutoffs comparison sheets, and dashboards are secured for verified engineering aspirants.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8 text-left text-xs">
          {[
            { label: "Predict 38+ Govt Colleges", icon: Compass },
            { label: "Explore Round-wise Cutoffs", icon: ShieldAlert }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="flex items-center gap-2 p-3.5 rounded-2xl border border-gray-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/30 font-bold text-slate-700 dark:text-gray-300"
              >
                <Icon className="w-4 h-4 text-[#2563EB] dark:text-[#FF9933] shrink-0" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="space-y-4 max-w-xs mx-auto">
          <button
            onClick={handleOpenAuth}
            className="w-full py-4 bg-gradient-to-r from-[#FF9933] to-[#138808] hover:shadow-xl hover:shadow-[#138808]/20 text-white rounded-2xl font-extrabold flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 transition-all duration-200 text-sm uppercase tracking-wider"
          >
            <Lock className="w-4 h-4" />
            Sign In to Unlock
          </button>
          
          <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
            Guests can log in instantly with their name and percentile using a Demo Account. No OTP required!
          </p>
        </div>
      </div>
    </div>
  );
};
export default AuthGate;
