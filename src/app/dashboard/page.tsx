"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { 
  Bookmark, 
  TrendingUp, 
  Trash2, 
  MapPin, 
  GraduationCap, 
  CheckSquare, 
  Square,
  Clock,
  Compass,
  ArrowRight,
  ShieldCheck,
  Building
} from "lucide-react";
import Link from "next/link";
import { AuthGate } from "../../components/AuthGate";

export default function StudentDashboard() {
  const { 
    favorites, 
    savedPredictions, 
    colleges, 
    deletePrediction, 
    removeFavorite 
  } = useApp();

  // Load favorite college objects
  const favoriteColleges = colleges.filter((c) => favorites.includes(c.id));

  // Counselling checklist state (stored in localStorage for persistence)
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    register: false,
    merit: false,
    choice: false,
    lock: false,
    allotment: false,
    verification: false
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCheck = localStorage.getItem("bihareduconnect_checklist");
      if (storedCheck) {
        setChecklist(JSON.parse(storedCheck));
      }
    }
  }, []);

  const toggleCheck = (key: string) => {
    setChecklist((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      if (typeof window !== "undefined") {
        localStorage.setItem("bihareduconnect_checklist", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const getChanceBadge = (chance: "High" | "Moderate" | "Low") => {
    switch (chance) {
      case "High":
        return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
      case "Moderate":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "Low":
        return "bg-slate-500/10 text-slate-500 border border-slate-500/20";
    }
  };

  return (
    <AuthGate>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          Candidate Dashboard
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Your Personal <span className="bg-gradient-to-r from-[#FF9933] to-[#138808] bg-clip-text text-transparent">Counselling Hub</span>
        </h1>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
          Track UGEAC admissions stages, view bookmarked institutions, and retrieve saved rank predictions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= LEFT SIDE: Counselling Progress checklist (Col-4) ================= */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-250/70 dark:border-slate-800 rounded-2xl p-6 shadow-sm lg:sticky lg:top-24 space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-850 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-slate-850 pb-2">
                <CheckSquare className="w-5 h-5 text-[#138808]" />
                Counselling Step Tracker
              </h2>
              <p className="text-[11px] text-gray-400 mt-1">
                Tick off milestones as you advance through official BCECE engineering selection rounds.
              </p>
            </div>

            {/* Checklist items */}
            <div className="space-y-3.5">
              {[
                { key: "register", label: "Registration & Fee Paid", desc: "Online form filled on BCECE board portal." },
                { key: "merit", label: "State Merit Rank Released", desc: "Downloaded UGEAC Rank Card & registered rank." },
                { key: "choice", label: "Choice Filling Submitted", desc: "Arranged target branches in choice preferences list." },
                { key: "lock", label: "Choice Preference Locked", desc: "Choices locked with OTP verification successfully." },
                { key: "allotment", label: "Seat Allotment Received", desc: "Round 1 or 2 allotment letter downloaded." },
                { key: "verification", label: "Physical Verification Done", desc: "Original certificates checked at verification node." }
              ].map((step) => {
                const checked = checklist[step.key];
                return (
                  <button
                    key={step.key}
                    onClick={() => toggleCheck(step.key)}
                    className="w-full text-left flex gap-3 p-3 rounded-xl border border-gray-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors cursor-pointer group"
                  >
                    <div className="shrink-0 mt-0.5">
                      {checked ? (
                        <CheckSquare className="w-5 h-5 text-[#138808]" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-300 dark:text-slate-800 group-hover:text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold ${checked ? "line-through text-gray-400" : "text-slate-800 dark:text-gray-200"}`}>
                        {step.label}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">{step.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE: Saved Predictions & Favorites (Col-8) ================= */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Saved Predictions log */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-slate-850 pb-2.5">
              <TrendingUp className="w-5 h-5 text-[#FF9933]" />
              Saved Predictions Log ({savedPredictions.length})
            </h2>

            {savedPredictions.length === 0 ? (
              <div className="py-12 text-center">
                <Compass className="w-10 h-10 text-gray-300 mx-auto mb-2 animate-bounce" />
                <h4 className="font-bold text-slate-700 dark:text-slate-350">No Saved Predictions Yet</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
                  Run the College Predictor and click the bookmark icon to save specific course results here.
                </p>
                <Link
                  href="/predictor"
                  className="inline-flex items-center gap-1 mt-4 px-4 py-2 bg-gradient-to-r from-[#FF9933] to-[#138808] text-white font-bold rounded-xl text-xs uppercase"
                >
                  Predict Colleges Now
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3.5">
                {savedPredictions.map((pred) => (
                  <div
                    key={pred.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-gray-150 dark:border-slate-800/80 rounded-xl hover:shadow-sm transition-shadow bg-slate-50/20"
                  >
                    <div>
                      <span className="text-[9px] text-[#2563EB] font-bold uppercase tracking-wider">
                        Rank: {pred.rank} | Category: {pred.category}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-gray-100 leading-snug mt-0.5">
                        {pred.collegeName}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                        Course: <span className="text-[#FF9933]">{pred.branchName} ({pred.branchCode})</span>
                      </p>
                      <span className="text-[9px] text-gray-400 flex items-center gap-1 mt-1 font-semibold">
                        <Clock className="w-3 h-3 text-gray-300" />
                        Saved on {pred.date}
                      </span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 border-dashed border-gray-150 pt-2 sm:pt-0">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getChanceBadge(pred.chance)}`}>
                        {pred.chance} Chance
                      </span>
                      <button
                        onClick={() => deletePrediction(pred.id)}
                        className="p-2 border border-gray-200 dark:border-slate-800 hover:border-red-500/25 text-gray-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg cursor-pointer transition-colors"
                        title="Delete log entry"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bookmarked Colleges */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-slate-850 pb-2.5">
              <Bookmark className="w-5 h-5 text-[#2563EB]" />
              Bookmarked Institution Directories ({favoriteColleges.length})
            </h2>

            {favoriteColleges.length === 0 ? (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                <Bookmark className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <h4 className="font-bold text-slate-700 dark:text-slate-350">No Bookmarked Colleges</h4>
                <p className="text-xs text-gray-550 dark:text-gray-450 mt-1 max-w-xs mx-auto">
                  Browse through the Bihar College directory and save institutions to build shortcuts here.
                </p>
                <Link
                  href="/colleges"
                  className="inline-flex items-center gap-1 mt-4 px-4 py-2 border border-gray-300 dark:border-slate-800 text-slate-700 dark:text-gray-300 font-bold rounded-xl text-xs uppercase"
                >
                  Browse Colleges
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favoriteColleges.map((college) => (
                  <div
                    key={college.id}
                    className="p-4 border border-gray-150 dark:border-slate-800 rounded-xl hover:shadow-sm transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex justify-between gap-2 items-start">
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">
                          Estd {college.established} | {college.campusSize}
                        </span>
                        <button
                          onClick={() => removeFavorite(college.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                          title="Remove bookmark"
                        >
                          <Bookmark className="w-4 h-4 fill-amber-400 text-amber-500" />
                        </button>
                      </div>
                      <h4 className="font-bold text-sm text-slate-805 dark:text-gray-100 group-hover:text-[#2563EB] transition-colors leading-snug mt-1">
                        {college.name}
                      </h4>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-1 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-[#138808]" />
                        {college.location}, Bihar
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-dashed border-gray-100 dark:border-slate-850 flex items-center justify-between text-xs">
                      <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">
                        Avg Package: <strong className="text-[#138808]">{college.averagePackage.toFixed(1)} LPA</strong>
                      </span>
                      <Link
                        href={`/colleges/${college.id}`}
                        className="text-[#2563EB] hover:underline font-bold text-[11px]"
                      >
                        View Profile ➔
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  </AuthGate>
);
}
