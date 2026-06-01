"use client";

import React from "react";
import { useApp } from "../../context/AppContext";
import { 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  Calendar, 
  ChevronRight, 
  ArrowRight,
  ShieldCheck,
  Compass,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { AuthGate } from "../../components/AuthGate";

export default function CounsellingTimelinePage() {
  const { user, timelineEvents } = useApp();

  return (
    <AuthGate>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FF9933]/10 text-[#FF9933] text-xs font-extrabold uppercase tracking-widest mb-3">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            Official Schedule Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-805 dark:text-white tracking-tight">
            Bihar UGEAC 2026 <span className="bg-gradient-to-r from-[#FF9933] to-[#138808] bg-clip-text text-transparent">Counselling Timeline</span>
          </h1>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Track key milestones, official dates, and next steps for BCECE Bihar state government engineering admissions.
          </p>
        </div>

        {/* Central Vertical Timeline */}
        <div className="relative border-l-2 border-gray-100 dark:border-slate-850 pl-8 ml-4 md:ml-8 space-y-10 py-4">
          
          {timelineEvents && timelineEvents.map((ev, index) => {
            const isDone = ev.status === "Done";
            const isActive = ev.status === "Active";
            
            return (
              <div key={ev.id} className="relative group">
                {/* Pulsating Indicator Badge */}
                {isDone ? (
                  <div className="absolute -left-[42px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white font-extrabold text-xs ring-4 ring-emerald-50 dark:ring-emerald-950/40">
                    ✓
                  </div>
                ) : isActive ? (
                  <div className="absolute -left-[42px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#2563EB] text-white font-extrabold text-xs ring-4 ring-blue-50 dark:ring-blue-950/40 animate-pulse">
                    •
                  </div>
                ) : (
                  <div className="absolute -left-[42px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-gray-400 font-extrabold text-xs">
                    {index + 1}
                  </div>
                )}
                
                <div className={`bg-white dark:bg-slate-900 border rounded-2xl p-6 transition-all duration-300 relative overflow-hidden ${
                  isActive 
                    ? "border-[#2563EB]/25 dark:border-blue-900/35 shadow-md shadow-[#2563EB]/5 hover:shadow-lg" 
                    : "border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md"
                }`}>
                  {isActive && <div className="absolute top-0 right-0 h-1.5 w-full bg-gradient-to-r from-[#FF9933] to-[#138808]" />}
                  
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
                    {isDone ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-extrabold uppercase tracking-wider">
                        Phase {index + 1}: Completed
                      </span>
                    ) : isActive ? (
                      <span className="px-2.5 py-0.5 rounded bg-blue-500/15 text-[#2563EB] text-[10px] font-extrabold uppercase tracking-wider animate-pulse">
                        Phase {index + 1}: Active (Live Now!)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 text-[10px] font-extrabold uppercase tracking-wider">
                        Phase {index + 1}: Upcoming
                      </span>
                    )}
                    <span className="text-[11px] text-gray-400 font-extrabold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {ev.date}
                    </span>
                  </div>
                  
                  <h3 className={`text-base font-extrabold text-slate-850 dark:text-white transition-colors leading-snug ${
                    isActive ? "group-hover:text-[#2563EB]" : isDone ? "group-hover:text-emerald-500" : ""
                  }`}>
                    {ev.event}
                  </h3>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                    {ev.event.toLowerCase().includes("registration")
                      ? "Candidates register successfully on the BCECE board portal, pay the UGEAC counselling registration fees, and upload active JEE Main score records."
                      : ev.event.toLowerCase().includes("merit")
                      ? "BCECE releases provisional state rank merit lists mapping candidate percentiles to state ranks. Download UGEAC Rank cards prior to choices priority listing."
                      : ev.event.toLowerCase().includes("choice")
                      ? "Candidates priority prioritized list of Bihar B.Tech government colleges selection branches is submitted and secured via OTP verification protocols."
                      : ev.event.toLowerCase().includes("allotment")
                      ? "Seat allotment publication rounds begin. Candidates check, download allocation letters, and select freeze or slide upgrading choices."
                      : "Candidates physically present academic qualifications, category certificates, residential documents, and medical checksheets at official reporting nodes."}
                  </p>
                  
                  {isActive && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-850 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-[#FF9933]" />
                        Verify rank prior to preference choice filling!
                      </span>
                      <Link
                        href="/predictor"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-[#FF9933] to-[#138808] text-white font-extrabold text-[10px] uppercase rounded-xl hover:shadow-md transition-shadow"
                      >
                        Predict colleges now
                        <Compass className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Small Bottom T&C Disclaimer */}
        <div className="text-[11px] text-slate-550 dark:text-slate-450 mt-10 border-t border-gray-100 dark:border-slate-850 pt-6 text-center leading-relaxed">
          * Note: Counselling dates are subject to minor official updates by the BCECE board. Monitor official notifications at{" "}
          <a href="https://bceceboard.bihar.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
            bceceboard.bihar.gov.in
          </a>.
        </div>
      </div>
    </AuthGate>
  );
}
