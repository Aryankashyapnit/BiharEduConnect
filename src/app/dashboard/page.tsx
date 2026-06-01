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
  Building,
  User,
  Mail,
  Phone,
  Key,
  LogOut,
  Sparkles,
  Lock
} from "lucide-react";
import Link from "next/link";
import { AuthGate } from "../../components/AuthGate";

export default function StudentDashboard() {
  const { 
    favorites, 
    savedPredictions, 
    colleges, 
    deletePrediction, 
    removeFavorite,
    user,
    logout,
    registerUser,
    timelineEvents
  } = useApp();

  // Upgrade Guest Account states
  const [upgradeEmail, setUpgradeEmail] = useState("");
  const [upgradePhone, setUpgradePhone] = useState("");
  const [upgradePassword, setUpgradePassword] = useState("");
  const [upgradeError, setUpgradeError] = useState("");
  const [upgradeSuccess, setUpgradeSuccess] = useState("");
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUpgradeError("");
    setUpgradeSuccess("");

    if (!user) return;

    const emailClean = upgradeEmail.trim();
    const phoneClean = upgradePhone.trim();
    const passClean = upgradePassword.trim();

    if (!emailClean || !emailClean.includes("@")) {
      setUpgradeError("Please enter a valid email address");
      return;
    }
    if (!phoneClean || phoneClean.replace(/\D/g, "").length < 10) {
      setUpgradeError("Please enter a valid 10-digit phone number");
      return;
    }
    if (!passClean || passClean.length < 4) {
      setUpgradeError("Choose a password with at least 4 characters");
      return;
    }

    setIsUpgrading(true);

    setTimeout(() => {
      const res = registerUser(
        user.name,
        emailClean,
        user.percentile || 90.0,
        passClean
      );
      setIsUpgrading(false);

      if (res.success) {
        setUpgradeSuccess("Profile completed successfully! Your account has been upgraded.");
        setUpgradeEmail("");
        setUpgradePhone("");
        setUpgradePassword("");
      } else {
        setUpgradeError(res.error || "Upgrade failed. Email might be in use.");
      }
    }, 1000);
  };

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
        
        {/* ================= LEFT SIDE: Candidate Profile & Progress Checklist (Col-4) ================= */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          {/* Candidate Profile Details Card */}
          <div className="bg-white dark:bg-slate-900 border border-gray-250/70 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-850 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-slate-850 pb-2">
              <User className="w-5 h-5 text-[#2563EB]" />
              Candidate Profile
            </h2>

            {user && (
              <div className="space-y-4">
                {/* User initials avatar block */}
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF9933] to-[#138808] text-white font-extrabold text-lg shadow-inner">
                    {user.name.charAt(0).toUpperCase()}
                    <span className="absolute bottom-0.5 right-0.5 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-850 dark:text-gray-100 leading-snug">
                      {user.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {user.isAdmin ? (
                        <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[9px] font-bold uppercase tracking-wider">
                          🛡️ Administrator
                        </span>
                      ) : user.email ? (
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[9px] font-bold uppercase tracking-wider">
                          ⚡ Standard Account
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                          Guest Account
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Candidate credentials / info list */}
                <div className="space-y-2.5 text-xs border-t border-b border-gray-100 dark:border-slate-850 py-3.5">
                  <div className="flex justify-between items-center text-gray-500 dark:text-gray-450">
                    <span className="font-bold uppercase tracking-wider text-[9px]">JEE Percentile</span>
                    <span className="font-extrabold text-slate-800 dark:text-gray-200">
                      {user.percentile !== undefined ? `${user.percentile.toFixed(2)}%` : "N/A"}
                    </span>
                  </div>
                  {user.email && (
                    <div className="flex justify-between items-center text-gray-500 dark:text-gray-450">
                      <span className="font-bold uppercase tracking-wider text-[9px]">Email Address</span>
                      <span className="font-bold text-slate-800 dark:text-gray-200 truncate max-w-[140px]" title={user.email}>
                        {user.email}
                      </span>
                    </div>
                  )}
                  {/* Mock phone/password details for standard profile */}
                  {user.email && (
                    <div className="flex justify-between items-center text-gray-500 dark:text-gray-455">
                      <span className="font-bold uppercase tracking-wider text-[9px]">Phone Number</span>
                      <span className="font-bold text-slate-800 dark:text-gray-200">+91 9*******89</span>
                    </div>
                  )}
                  {user.email && (
                    <div className="flex justify-between items-center text-gray-500 dark:text-gray-455">
                      <span className="font-bold uppercase tracking-wider text-[9px]">Password Security</span>
                      <span className="font-bold text-slate-400 dark:text-slate-600 tracking-widest text-[8px]">••••••••</span>
                    </div>
                  )}
                </div>

                {/* Upgrade Profile CTA Form for guest/demo users */}
                {!user.email && !user.isAdmin && (
                  <div className="p-4 bg-amber-500/5 dark:bg-amber-950/10 border border-amber-500/20 rounded-xl space-y-3">
                    <div className="space-y-1">
                      <h4 className="text-[11px] font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wide flex items-center gap-1">
                        ⚠️ Complete the profile information
                      </h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-normal">
                        Upgrade your guest account to a standard verified profile to unlock permanent progress tracking.
                      </p>
                    </div>

                    {upgradeError && (
                      <div className="p-2 bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold rounded-lg text-center">
                        {upgradeError}
                      </div>
                    )}
                    {upgradeSuccess && (
                      <div className="p-2 bg-emerald-550/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold rounded-lg text-center">
                        {upgradeSuccess}
                      </div>
                    )}

                    <form onSubmit={handleUpgradeSubmit} className="space-y-2">
                      <div>
                        <input
                          type="email"
                          required
                          value={upgradeEmail}
                          onChange={(e) => setUpgradeEmail(e.target.value)}
                          placeholder="Enter your Email Address"
                          className="w-full px-3 py-2 text-[11px] border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white rounded-lg focus:outline-none focus:border-[#FF9933] font-semibold"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          required
                          value={upgradePhone}
                          onChange={(e) => setUpgradePhone(e.target.value)}
                          placeholder="10-digit Phone Number"
                          className="w-full px-3 py-2 text-[11px] border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white rounded-lg focus:outline-none focus:border-[#FF9933] font-semibold"
                        />
                      </div>
                      <div>
                        <input
                          type="password"
                          required
                          value={upgradePassword}
                          onChange={(e) => setUpgradePassword(e.target.value)}
                          placeholder="Choose Password (Min 4 chars)"
                          className="w-full px-3 py-2 text-[11px] border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white rounded-lg focus:outline-none focus:border-[#FF9933] font-semibold"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isUpgrading}
                        className="w-full py-2 bg-gradient-to-r from-[#FF9933] to-[#138808] hover:shadow-md text-white font-extrabold text-[10px] uppercase tracking-wider rounded-lg transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isUpgrading ? "Upgrading..." : "Complete Profile"}
                      </button>
                    </form>
                  </div>
                )}

                {/* Log Out button inside Profile Card */}
                <button
                  onClick={logout}
                  className="w-full py-2 bg-red-500/10 border border-red-500/25 hover:bg-red-500 text-red-650 hover:text-white rounded-xl text-xs font-extrabold uppercase transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-red-500/5 hover:shadow-none"
                >
                  <LogOut className="w-4 h-4" />
                  Logout Candidate Session
                </button>
              </div>
            )}
          </div>

          {/* Counselling Step Tracker Card */}
          <div className="bg-white dark:bg-slate-900 border border-gray-250/70 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
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

          {/* UGEAC 2026 Official Timeline & Schedule */}
          <div className="bg-white dark:bg-slate-900 border border-gray-250/70 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-850 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-slate-850 pb-2">
                <Clock className="w-5 h-5 text-[#FF9933]" />
                UGEAC 2026 Counselling Timeline
              </h2>
              <p className="text-[11px] text-gray-400 mt-1">
                Official BCECE schedule details for engineering seat selection.
              </p>
            </div>

            {/* Vertical Timeline Nodes */}
            <div className="relative pl-6 border-l border-gray-150 dark:border-slate-800 space-y-5 py-2.5 ml-2.5">
              
              {timelineEvents && timelineEvents.map((ev, index) => {
                const isDone = ev.status === "Done";
                const isActive = ev.status === "Active";
                
                return (
                  <div key={ev.id} className="relative group">
                    {/* Connector Dot */}
                    {isDone ? (
                      <div className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white font-extrabold text-[8px] ring-4 ring-emerald-50 dark:ring-emerald-950/40">
                        ✓
                      </div>
                    ) : isActive ? (
                      <div className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#2563EB] text-white ring-4 ring-blue-50 dark:ring-blue-950/40 animate-pulse">
                        •
                      </div>
                    ) : (
                      <div className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-gray-455 text-[8px] font-extrabold">
                        {index + 1}
                      </div>
                    )}
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`text-xs ${isDone ? "line-through text-gray-400 font-semibold" : isActive ? "text-slate-855 dark:text-gray-100 font-extrabold" : "text-slate-800 dark:text-gray-300 font-bold"}`}>
                          {ev.event}
                        </h4>
                        {isDone ? (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-500 text-[8px] font-bold uppercase tracking-wider">
                            Done
                          </span>
                        ) : isActive ? (
                          <span className="px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-500 text-[8px] font-bold uppercase tracking-wider animate-pulse">
                            Active
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded bg-gray-100 dark:bg-slate-800 text-gray-450 dark:text-gray-505 text-[8px] font-bold uppercase tracking-wider">
                            Upcoming
                          </span>
                        )}
                      </div>
                      <span className={`text-[9px] font-bold block mt-0.5 ${isActive ? "text-[#2563EB] dark:text-[#FF9933]" : "text-gray-400 dark:text-gray-400"}`}>
                        {ev.date} {isActive && "(Live Now!)"}
                      </span>
                    </div>
                  </div>
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
