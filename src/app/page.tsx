"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "../context/AppContext";
import { College } from "../data/colleges";
import { CommunityComments } from "../components/CommunityComments";
import { 
  Compass, 
  TrendingUp, 
  Layers, 
  GraduationCap, 
  Calendar, 
  MapPin, 
  ArrowRight,
  Sparkles,
  Users,
  Award,
  BookOpen,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  ShieldAlert,
  X,
  SlidersHorizontal,
  Building,
  CheckCircle,
  Laptop,
  Cpu,
  Cog,
  Zap,
  UserCheck
} from "lucide-react";

export default function Homepage() {
  const { 
    colleges, 
    user,
    setShowAuthModal,
    setPendingRedirect
  } = useApp();

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Onboarding Wizard State
  const [wizardType, setWizardType] = useState<"ugeac_rank" | "bcece_rank">("ugeac_rank");
  const [wizardValue, setWizardValue] = useState("");
  const [wizardCategory, setWizardCategory] = useState("UR");
  
  // Strategy Carousel State
  const [activeSlide, setActiveSlide] = useState(0);

  // Gamified Score Simulator State
  const [simRank, setSimRank] = useState(3500);

  // B.Tech Branch Pathfinder State
  const [pathfinderTraits, setPathfinderTraits] = useState({
    coding: false,
    hardware: false,
    construction: false,
    govJobs: false,
    mathLogic: false,
  });
  const [activePathfinderTab, setActivePathfinderTab] = useState<"CSE" | "ECE" | "CE" | "ME" | "EE">("CSE");



  const getCompatibilityScores = () => {
    let cse = 20; let ece = 20; let ce = 20; let me = 20; let ee = 20;
    if (pathfinderTraits.coding) { cse += 60; ece += 20; }
    if (pathfinderTraits.hardware) { ece += 50; ee += 30; cse += 10; }
    if (pathfinderTraits.construction) { ce += 60; me += 20; }
    if (pathfinderTraits.govJobs) { ce += 40; me += 30; ee += 30; }
    if (pathfinderTraits.mathLogic) { cse += 20; ece += 30; ee += 20; me += 20; }
    return {
      CSE: Math.min(cse, 100),
      ECE: Math.min(ece, 100),
      CE: Math.min(ce, 100),
      ME: Math.min(me, 100),
      EE: Math.min(ee, 100)
    };
  };

  const pathfinderScores = getCompatibilityScores();
  
  // dynamic matching simulation data
  const getSimulatedOdds = (rank: number) => {
    if (rank <= 2000) {
      return {
        level: "Top-Tier Government Engineering Colleges",
        prob: 96,
        badge: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
        text: "Exceptional rank! You are in the top bracket for CSE / ECE at MIT Muzaffarpur and BCE Bhagalpur.",
        colleges: [
          { name: "MIT Muzaffarpur", branch: "Computer Science & Engg", package: "12.5 LPA" },
          { name: "BCE Bhagalpur", branch: "Computer Science & Engg", package: "10.2 LPA" },
          { name: "NCE Chandi", branch: "Information Technology", package: "7.8 LPA" }
        ]
      };
    } else if (rank <= 5000) {
      return {
        level: "Mid-to-High Tier State Universities",
        prob: 88,
        badge: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
        text: "Very strong rank! High probability of securing CSE/ECE in top-middle government colleges.",
        colleges: [
          { name: "NCE Chandi", branch: "Computer Science & Engg", package: "7.8 LPA" },
          { name: "DCE Darbhanga", branch: "Computer Science & Engg", package: "6.5 LPA" },
          { name: "GCE Gaya", branch: "Electronics & Communication", package: "6.2 LPA" }
        ]
      };
    } else if (rank <= 8000) {
      return {
        level: "Established District Colleges",
        prob: 74,
        badge: "bg-amber-500/10 text-amber-500 border border-amber-550/20",
        text: "Good rank! Steady chances for core branches (EE/ECE/ME) at highly active district colleges.",
        colleges: [
          { name: "GCE Gaya", branch: "Electrical & Electronics Engg", package: "6.2 LPA" },
          { name: "MCET Motihari", branch: "Computer Science & Engg", package: "5.8 LPA" },
          { name: "LNJPIT Chapra", branch: "Mechanical Engineering", package: "5.5 LPA" }
        ]
      };
    } else {
      return {
        level: "Affiliated State Technical Nodes",
        prob: 62,
        badge: "bg-slate-500/10 text-slate-500 border border-slate-500/20",
        text: "Chances are moderate. Listing core civil and mechanical preferences in your choice sheets is highly advised.",
        colleges: [
          { name: "KEC Katihar", branch: "Civil Engineering", package: "4.8 LPA" },
          { name: "SEC Saharsa", branch: "Electrical Engineering", package: "4.5 LPA" },
          { name: "BPMCET Madhepura", branch: "Mechanical Engineering", package: "4.2 LPA" }
        ]
      };
    }
  };

  const simResult = getSimulatedOdds(simRank);



  React.useEffect(() => {
    const justLoggedOut = sessionStorage.getItem("bihareduconnect_logged_out");
    if (!user && !justLoggedOut) {
      setShowAuthModal(true);
    }
    if (justLoggedOut) {
      sessionStorage.removeItem("bihareduconnect_logged_out");
    }
  }, [user, setShowAuthModal]);

  const handleGuardClick = (e: React.MouseEvent, path: string) => {
    if (!user) {
      e.preventDefault();
      setPendingRedirect(path);
      setShowAuthModal(true);
    }
  };

  const stats = [
    { value: "38+", label: "Government Colleges", icon: GraduationCap, color: "text-[#6366f1] bg-[#6366f1]/10" },
    { value: "10,500+", label: "B.Tech Seats", icon: Layers, color: "text-[#06b6d4] bg-[#06b6d4]/10" },
    { value: "15+", label: "Engg Branches", icon: BookOpen, color: "text-[#22d3ee] bg-[#22d3ee]/10" },
    { value: "98.5%", label: "Accuracy Rate", icon: Award, color: "text-amber-500 bg-amber-500/10" }
  ];

  const features = [
    {
      title: "College Predictor",
      description: "Enter your JEE Main percentile / UGEAC state rank, or BCECE rank card details to predict your government engineering & agricultural admission chances in Bihar.",
      href: "/predictor",
      icon: Compass,
      color: "from-[#6366f1]/20 to-[#6366f1]/5",
      iconColor: "text-[#6366f1]",
      actionText: "Predict My College"
    },
    {
      title: "Cutoff Explorer",
      description: "Search and compare round-wise historical cutoff closing ranks from preceding UGEAC admissions lists using multi-year trend charts.",
      href: "/cutoffs",
      icon: TrendingUp,
      color: "from-[#22d3ee]/20 to-[#22d3ee]/5",
      iconColor: "text-[#22d3ee]",
      actionText: "Analyze Trends"
    },
    {
      title: "Seat Matrix Dashboard",
      description: "Explore category-wise (UR, BC, EBC, SC, ST, EWS, RCG) and branch-wise B.Tech intake statistics across all participating colleges.",
      href: "/seats",
      icon: Layers,
      color: "from-[#06b6d4]/20 to-[#06b6d4]/5",
      iconColor: "text-[#06b6d4]",
      actionText: "Check Seat Matrix"
    },
    {
      title: "Colleges Directory",
      description: "Access detailed campus profiles, placement packages (average/highest), infrastructure details, hostel fees, and direct websites.",
      href: "/colleges",
      icon: GraduationCap,
      color: "from-amber-500/20 to-amber-500/5",
      iconColor: "text-amber-500",
      actionText: "Browse Directory"
    }
  ];

  const updates = [
    { date: "13.05.2026", title: "Online Registration Starting Date", status: "Active", badge: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" },
    { date: "05.06.2026 (10.00 p.m.)", title: "Online Registration Closing Date", status: "Upcoming", badge: "bg-blue-500/10 text-blue-500 border border-blue-500/20" },
    { date: "05.06.2026 (11.59 p.m.)", title: "Last date of payment through Debit/Credit Card/Net Banking/UPI with Final submission", status: "Upcoming", badge: "bg-amber-500/10 text-amber-500 border border-amber-500/20" },
    { date: "06.06.2026", title: "Online Editing of Application Form", status: "Upcoming", badge: "bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20" },
    { date: "08.06.2026", title: "Publication of Merit list of UGEAC-2026", status: "Upcoming", badge: "bg-purple-500/10 text-purple-500 border border-purple-500/20" },
    { date: "Proposed date", title: "Proposed date of Online Counselling", status: "Upcoming", badge: "bg-slate-500/10 text-slate-500 border border-slate-500/20" }
  ];

  const faqs = [
    {
      q: "What is UGEAC counselling in Bihar?",
      a: "Under Graduate Engineering Admission Counselling (UGEAC) is the official state counselling conducted by the BCECE Board, Patna, for admitting JEE Main qualified candidates into B.Tech courses in Bihar's 38 government engineering colleges."
    },
    {
      q: "Are other state candidates eligible for Bihar Engineering admission?",
      a: "Under standard UGEAC rules, 100% of seats in government engineering colleges of Bihar are reserved for Home State (Bihar Domicile) candidates. Candidates must hold a valid residential certificate of Bihar."
    },
    {
      q: "How does the College Predictor work?",
      a: "Our algorithm matches your rank against category-wise and gender-wise opening and closing ranks of preceding rounds. It displays chances as High (very safe), Moderate (near the threshold), or Low (cutoff exceeded)."
    },
    {
      q: "What is the importance of Choice Filling?",
      a: "Choice filling is the most crucial step! You must list colleges in descending order of your preference. Even if your rank is high, listing your dream choices (e.g. MIT Muzaffarpur CSE) at the top is recommended as there is no penalty for aspirational listing."
    }
  ];

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="w-full">
      {/* Inline styles for keyframe marquee */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
      `}} />

      {/* Live Announcement Marquee Ticker */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white text-[10px] font-black uppercase py-3 overflow-hidden border-b border-white/5 relative z-40 backdrop-blur-md shadow-sm">
        <div className="flex w-full relative">
          <div className="inline-flex whitespace-nowrap animate-marquee gap-10 pr-10">
            <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#6366f1] animate-pulse" /> 🔥 UGEAC 2026 Choice Filling Starts Next Week!</span>
            <span className="text-gray-600">|</span>
            <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-[#22d3ee] animate-pulse" /> ⚡ MIT Muzaffarpur Placement Packages hit new record of 12.5 LPA!</span>
            <span className="text-gray-600">|</span>
            <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-[#06b6d4] animate-pulse" /> 📢 Category-wise Seat matrix updated for Round 2 engineering allocations</span>
            <span className="text-gray-600">|</span>
            <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#6366f1] animate-pulse" /> 🎓 Dual-claim RCG quota model activated for Girls!</span>
            <span className="text-gray-600">|</span>
          </div>
          <div className="inline-flex whitespace-nowrap animate-marquee gap-10 pr-10">
            <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#6366f1] animate-pulse" /> 🔥 UGEAC 2026 Choice Filling Starts Next Week!</span>
            <span className="text-gray-600">|</span>
            <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-[#22d3ee] animate-pulse" /> ⚡ MIT Muzaffarpur Placement Packages hit new record of 12.5 LPA!</span>
            <span className="text-gray-600">|</span>
            <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-[#06b6d4] animate-pulse" /> 📢 Category-wise Seat matrix updated for Round 2 engineering allocations</span>
            <span className="text-gray-600">|</span>
            <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#6366f1] animate-pulse" /> 🎓 Dual-claim RCG quota model activated for Girls!</span>
            <span className="text-gray-600">|</span>
          </div>
        </div>
      </div>

      {/* 1. HERO SECTION WITH GRADIENT BACKGROUND */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#22d3ee]/5 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 py-16 sm:py-24 transition-colors">
        <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] bg-gradient-to-tr from-[#6366f1] to-[#06b6d4] bg-glow-blob"></div>
        <div className="absolute bottom-10 left-10 -z-10 h-[400px] w-[400px] bg-gradient-to-br from-[#22d3ee] to-[#06b6d4] bg-glow-blob" style={{ animationDelay: '5s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero text panel */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#6366f1]/10 border border-[#6366f1]/20 text-[#6366f1] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#6366f1]" />
                BCECE UGEAC Counselling 2026
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-800 dark:text-white leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-forwards">
                Bihar Engineering <br />
                <span className="gradient-text-premium font-black drop-shadow-sm">
                  Counselling Made Easy
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-forwards">
                Predict government engineering colleges based on rank, compare placements, analyze category-specific cutoffs, check seat matrices, and track admission schedules in one place.
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 fill-mode-forwards">
                <Link
                  href="/predictor"
                  onClick={(e) => handleGuardClick(e, "/predictor")}
                  className="px-6 py-3.5 bg-gradient-to-r from-[#6366f1] to-[#06b6d4] text-white font-extrabold rounded-xl text-sm flex items-center gap-1.5 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,153,51,0.5)] active:scale-95 cursor-pointer btn-premium group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                  Predict My College
                  <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/cutoffs"
                  onClick={(e) => handleGuardClick(e, "/cutoffs")}
                  className="px-6 py-3.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 text-slate-800 dark:text-gray-200 font-extrabold rounded-xl text-sm transition-all duration-300 cursor-pointer shadow-sm hover-magnetic"
                >
                  Check Cutoffs
                </Link>
                <Link
                  href="/guide"
                  onClick={(e) => handleGuardClick(e, "/guide")}
                  className="px-6 py-3.5 text-[#22d3ee] dark:text-[#6366f1] hover:text-[#06b6d4] dark:hover:text-[#4f46e5] font-bold text-sm hover:underline cursor-pointer transition-colors"
                >
                  Counselling Guide ➔
                </Link>
              </div>
            </div>

            {/* Hero graphics panel (glowing cards overlay) */}
            <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-sm rounded-3xl glass-card p-6 shadow-2xl relative animate-float">
                {/* Decorative glowing gradient borders */}
                <div className="absolute -inset-0.5 -z-10 rounded-[26px] bg-gradient-to-tr from-[#6366f1] via-[#22d3ee] to-[#06b6d4] opacity-25 blur-sm"></div>

                <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-slate-850 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3.5 w-3.5 rounded-full bg-red-400"></div>
                    <div className="h-3.5 w-3.5 rounded-full bg-yellow-400"></div>
                    <div className="h-3.5 w-3.5 rounded-full bg-green-400"></div>
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Predictor Engine v2.0</span>
                </div>

                {/* Simulated prediction card snippet */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest block font-extrabold">Sample Input</span>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-gray-300">Rank: 1250</span>
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-gray-300">Category: BC</span>
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-gray-300">Co-ed</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-dashed border-gray-150 dark:border-slate-800">
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest block font-extrabold">Best Predicted Result</span>
                    
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#06b6d4]/10 via-white to-white dark:from-[#06b6d4]/10 dark:via-slate-900 dark:to-slate-900 border border-[#06b6d4]/20 flex items-center justify-between gap-2 shadow-sm">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-850 dark:text-gray-100">MIT Muzaffarpur</h4>
                        <span className="text-[10px] text-[#6366f1] font-semibold">B.Tech in CSE</span>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full text-[9px] font-bold">
                          92% Chance
                        </span>
                        <span className="block text-[8px] text-gray-400 mt-1">Closing Cutoff: 380</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#22d3ee]/10 via-white to-white dark:from-[#22d3ee]/10 dark:via-slate-900 dark:to-slate-900 border border-[#22d3ee]/20 flex items-center justify-between gap-2 shadow-sm">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-850 dark:text-gray-100">BCE Bhagalpur</h4>
                        <span className="text-[10px] text-[#6366f1] font-semibold">B.Tech in ECE</span>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full text-[9px] font-bold">
                          98% Chance
                        </span>
                        <span className="block text-[8px] text-gray-400 mt-1">Closing Cutoff: 620</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SYSTEM COUNTERS GRID */}
      <section className="bg-white dark:bg-slate-950 py-8 border-t border-b border-gray-100 dark:border-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((st, i) => {
              const Icon = st.icon;
              return (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100/50 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/20 glass-card hover-lift">
                  <div className={`p-3 rounded-xl ${st.color} shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white leading-none">{st.value}</h3>
                    <p className="text-xs text-gray-400 font-semibold mt-1">{st.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gamified Admissions Odds Simulator Slider Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="glass-card hover-lift rounded-3xl p-6 sm:p-8 border border-gray-150 dark:border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#22d3ee]/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left side: Interactive slider controls */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#06b6d4]/10 text-[#06b6d4] text-[10px] font-black uppercase tracking-wider border border-[#06b6d4]/20 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                Gamified Rank Simulator
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-850 dark:text-white leading-tight">
                Simulate Your <span className="gradient-text-premium font-black">College Probability</span>
              </h2>
              <p className="text-xs text-gray-550 dark:text-gray-400 font-bold leading-relaxed">
                Drag the score slider to simulate your UGEAC Rank in real-time. Witness your calculated admissions probabilities and recommended institutions update instantly!
              </p>

              {/* Slider Controller */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-slate-800 dark:text-gray-200 uppercase tracking-wider text-[10px]">UGEAC Bihar Rank</span>
                  <span className="px-3 py-1 rounded-lg bg-[#22d3ee]/15 text-[#22d3ee] dark:text-[#60a5fa] font-black text-sm">
                    Rank #{simRank}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="12000"
                  step="100"
                  value={simRank}
                  onChange={(e) => setSimRank(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-205 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#22d3ee] focus:outline-none transition-all"
                />
                <div className="flex justify-between text-[9px] text-gray-400 font-extrabold uppercase">
                  <span>#500 Top-Tier</span>
                  <span>#3000 Very Strong</span>
                  <span>#7000 Good</span>
                  <span>#12000 Moderate</span>
                </div>
              </div>
            </div>

            {/* Right side: Live updating gauge results */}
            <div className="lg:col-span-6 p-6 bg-white/40 dark:bg-slate-950/40 border border-gray-200/50 dark:border-slate-850/60 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 relative shadow-inner">
              <div className="space-y-4 text-center sm:text-left">
                <div>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${simResult.badge}`}>
                    {simResult.level}
                  </span>
                  <p className="text-xs text-gray-555 dark:text-gray-400 leading-relaxed font-semibold mt-2.5">
                    {simResult.text}
                  </p>
                </div>

                {/* Top 3 live match list */}
                <div className="space-y-2 text-left">
                  <span className="text-[9px] text-gray-450 dark:text-gray-550 font-black uppercase tracking-wider block">Suggested Top-3 Allocations</span>
                  {simResult.colleges.map((col, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-gray-200/20 dark:border-slate-800 shadow-sm hover:border-[#22d3ee]/30 transition-colors">
                      <span className="font-extrabold text-slate-805 dark:text-gray-200">{col.name}</span>
                      <div className="text-right flex items-center gap-2">
                        <span className="text-[10px] text-[#6366f1] font-black">{col.branch}</span>
                        <span className="px-1.5 py-0.2 bg-[#06b6d4]/10 text-[#06b6d4] dark:text-[#22c55e] rounded text-[8px] font-black">{col.package}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Glowing Probability Gauge Dial */}
              <div className="relative shrink-0 flex flex-col items-center justify-center w-36 h-36 rounded-full bg-slate-100 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 shadow-inner group">
                <div className="absolute inset-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-850 dark:text-white leading-none">
                    {simResult.prob}%
                  </span>
                  <span className="text-[8px] text-[#06b6d4] dark:text-[#22c55e] font-black uppercase tracking-wider mt-1">Odds</span>
                </div>
                {/* Dynamic SVG Gauge */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="64"
                    stroke="rgba(226, 232, 240, 0.5)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="64"
                    stroke="url(#gradientDial)"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="402"
                    strokeDashoffset={402 - (402 * simResult.prob) / 100}
                    className="transition-all duration-500 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradientDial" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 INTERACTIVE ADMISSION WIZARD & COUNSELLING SECRETS BLOCK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[600px] bg-gradient-to-r from-[#6366f1] to-[#06b6d4] bg-glow-blob" style={{ animationDelay: '3s' }}></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left panel: Interactive Wizard (7 cols) */}
          <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 border border-gray-150 dark:border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent -z-10"></div>
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22d3ee]/10 text-[#22d3ee] text-[10px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Admission Strategy Wizard
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white leading-snug">
                Prefill Your Admissions Odds!
              </h2>
              <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed max-w-xl">
                Enter your test ranks below. Our interactive helper will configure the prediction engines instantly to Suggest suggested government colleges in Bihar.
              </p>

              {/* Form elements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3.5">
                {/* 1. Score type tab toggles */}
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">Score Merit Type</label>
                  <div className="flex p-0.5 bg-slate-100/50 dark:bg-slate-950/60 rounded-xl border border-gray-200 dark:border-slate-850 w-full">
                    {["ugeac_rank", "bcece_rank"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setWizardType(t as any);
                          setWizardValue("");
                        }}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-300 cursor-pointer ${
                          wizardType === t
                            ? "bg-white dark:bg-slate-850 text-[#22d3ee] dark:text-[#6366f1] shadow-sm"
                            : "text-gray-500 hover:text-slate-800 dark:hover:text-white"
                        }`}
                      >
                        {t === "ugeac_rank" ? "UGEAC Rank" : "BCECE Rank"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Caste reservation code */}
                <div>
                  <label className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">Your reservation Caste</label>
                  <select
                    value={wizardCategory}
                    onChange={(e) => setWizardCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-250 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/60 dark:text-white rounded-xl text-xs font-semibold focus:outline-none cursor-pointer premium-input"
                  >
                    <option value="UR">Unreserved (UR)</option>
                    <option value="BC">Backward Class (BC)</option>
                    <option value="EBC">Extremely Backward Class (EBC)</option>
                    <option value="SC">Scheduled Caste (SC)</option>
                    <option value="ST">Scheduled Tribe (ST)</option>
                    <option value="EWS">Economically Weaker Section (EWS)</option>
                    <option value="RCG">Reserved Category Girls (RCG)</option>
                  </select>
                </div>

                {/* 3. Score input value */}
                <div>
                  <label className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">
                    {`${wizardType === "ugeac_rank" ? "UGEAC" : "BCECE"} Rank Value`}
                  </label>
                  <input
                    type="text"
                    value={wizardValue}
                    onChange={(e) => setWizardValue(e.target.value)}
                    placeholder="e.g. 1450"
                    className="w-full px-3.5 py-2.5 border border-gray-250 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/60 dark:text-white rounded-xl text-xs font-semibold focus:outline-none premium-input"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={(e) => {
                  if (!wizardValue.trim()) {
                    alert("Please enter a valid rank first.");
                    return;
                  }
                  const numVal = Number(wizardValue);
                  if (isNaN(numVal) || numVal <= 0) {
                    alert("Please enter a valid positive rank number.");
                    return;
                  }

                  const guardCheck = (path: string) => {
                    if (!user) {
                      e.preventDefault();
                      setPendingRedirect(path);
                      setShowAuthModal(true);
                    } else {
                      window.location.href = path;
                    }
                  };

                  const queryPath = `/predictor?rank=${wizardValue}&category=${wizardCategory}&type=${wizardType}`;

                  guardCheck(queryPath);
                }}
                className="w-full py-3 bg-gradient-to-r from-[#6366f1] to-[#06b6d4] text-white rounded-xl font-bold hover:shadow-lg shadow-[#06b6d4]/15 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer btn-premium"
              >
                Calculate My Admissions Odds
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Right panel: Strategy Advice Carousel (5 cols) */}
          <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-8 border border-gray-150 dark:border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/5 via-transparent to-transparent -z-10"></div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#06b6d4]/10 text-[#06b6d4] text-[10px] font-extrabold uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" />
                  Counselling Expert Advice
                </div>
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        activeSlide === idx ? "w-4.5 bg-[#6366f1]" : "w-1.5 bg-gray-250 dark:bg-slate-800"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Slider Content Wrapper */}
              <div className="relative min-h-[160px] flex items-center">
                {activeSlide === 0 && (
                  <div className="space-y-2 animate-fade-in">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[9px] font-extrabold uppercase tracking-wide">
                      Choice Filling Strategy
                    </span>
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
                      The Golden Rule of Preference Sheets
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                      Always place your dream colleges (like MIT Muzaffarpur or BCE Bhagalpur CSE) at the top of your choice sheet, even if your JEE rank is lower. UGEAC has zero penalties for aspirational listing, and this secures high preference allocations!
                    </p>
                  </div>
                )}

                {activeSlide === 1 && (
                  <div className="space-y-2 animate-fade-in">
                    <span className="px-2 py-0.5 rounded bg-pink-500/10 text-pink-500 text-[9px] font-extrabold uppercase tracking-wide">
                      Caste Quota Secrets
                    </span>
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
                      Double Seat Claim Pools for Girls
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                      Reserved Category Girls (RCG) in Bihar have access to two allocation pools: the standard Co-ed category pool (like BC or EBC) and the exclusive 3% RCG quota pool. This dual-claim model dramatically boosts allocation odds!
                    </p>
                  </div>
                )}

                {activeSlide === 2 && (
                  <div className="space-y-2 animate-fade-in">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[9px] font-extrabold uppercase tracking-wide">
                      Residency Guidelines
                    </span>
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
                      Bihar Home Domicile Advantage
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                      Under strict BCECE Board bulletins, 100% of seats across Bihar's 38 government engineering colleges are reserved exclusively for candidates holding valid residential residency certificates of Bihar. Domicile certificates are crucial!
                    </p>
                  </div>
                )}

                {activeSlide === 3 && (
                  <div className="space-y-2 animate-fade-in">
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-500 text-[9px] font-extrabold uppercase tracking-wide">
                      Upgradation Strategy
                    </span>
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
                      How Allotment Upgrades Work
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                      Allocated a lower preference in Round 1? Select 'Upgrade: Yes' during Document Verification (DV). You secure your R1 seat reservation while competing risk-free for higher-priority options in Round 2.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-gray-100 dark:border-slate-850 pt-4 mt-2">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase">Expert Tips (UGEAC 2026)</span>
              <button
                onClick={() => {
                  setActiveSlide((prev) => (prev + 1) % 4);
                }}
                className="text-xs text-[#22d3ee] dark:text-[#6366f1] font-bold hover:underline cursor-pointer"
              >
                Next Secret Tip ➔
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. KEY FEATURES CONTAINER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
            Counselling & Prediction Suite
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Powerful analytical tools built specifically for students participating in BCECE UGEAC admission rounds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            const neonBorderClass = i === 0 || i === 3 ? "neon-border-orange" : i === 1 ? "neon-border-blue" : "neon-border-green";
            return (
              <div
                key={i}
                className={`glass-card rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-2xl hover:shadow-[#22d3ee]/10 border border-gray-150 dark:border-slate-800 flex flex-col justify-between group transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden ${neonBorderClass}`}
              >
                {/* Decorative hover gradient block */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feat.color} rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-2xl`} />

                <div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-6 shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className={`w-7 h-7 ${feat.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-850 dark:text-white group-hover:text-[#22d3ee] dark:group-hover:text-[#6366f1] transition-colors mb-3">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                    {feat.description}
                  </p>
                </div>

                <Link
                  href={feat.href}
                  onClick={(e) => handleGuardClick(e, feat.href)}
                  className={`inline-flex w-max items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${feat.iconColor} bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-gray-200 dark:hover:border-slate-700 hover:shadow-sm`}
                >
                  {feat.actionText}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. LATEST UPDATES & COUNSELLING TIMELINE SECTION */}
      <section className="bg-slate-50 dark:bg-slate-900/30 border-t border-b border-gray-200 dark:border-slate-900 py-16 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                       {/* Updates Notice Board */}
            <div className="lg:col-span-7 glass-card rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6 pb-3 border-b border-gray-100 dark:border-slate-850">
                <Calendar className="w-5 h-5 text-[#6366f1]" />
                Latest Admission Notification Board
              </h2>
 
              <div className="space-y-4">
                {updates.map((upd, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-gray-100/50 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors"
                  >
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {upd.date}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-gray-100 leading-snug mt-1">
                        {upd.title}
                      </h4>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold self-start sm:self-center shrink-0 ${upd.badge}`}>
                      {upd.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
 
            {/* Quick document reminder and interactive timeline */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-card rounded-2xl p-6 shadow-sm">
                <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-slate-850 pb-2">
                  <FileText className="w-5 h-5 text-[#06b6d4]" />
                  Verification Documents Reminder
                </h2>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                  Keep these mandatory certificates fully prepared before the Document Verification (DV) round starts:
                </p>
                <ul className="space-y-2.5">
                  {[
                    "BCECE UGEAC Part A & B Application Forms",
                    "JEE Main 2026 Admit Card & Score Card",
                    "Bihar Residence Domicile Certificate (Mandatory)",
                    "Category Certificate (BC/EBC/SC/ST/EWS) if applicable",
                    "Class 10 & 12 passing certificate/marksheets"
                  ].map((doc, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                      <span className="h-4 w-4 bg-[#06b6d4]/15 border border-[#06b6d4]/30 rounded-full flex items-center justify-center shrink-0 text-[10px] text-[#06b6d4] font-bold mt-0.5">
                        {i + 1}
                      </span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  <Link
                    href="/guide"
                    onClick={(e) => handleGuardClick(e, "/guide")}
                    className="w-full py-2.5 bg-[#22d3ee] hover:bg-[#22d3ee]/90 text-white font-bold rounded-xl text-xs text-center uppercase tracking-wider block transition-colors cursor-pointer"
                  >
                    View Step-by-Step Guide
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. STUDENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
            Loved by Admissions Aspirants
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Hear from students who secured their target branches in Bihar's top engineering colleges using BiharEduConnect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {updates.slice(0, 3).map((upd, i) => { // fall back to standard testimonials
            return null;
          })}
          {[
            {
              quote: "The College Predictor is remarkably precise. I secured CSE at MIT Muzaffarpur exactly as suggested based on my UGEAC merit rank. The cutoff trend lines helped me order my choices perfectly.",
              student: "Abhishek Sahni",
              college: "MIT Muzaffarpur (B.Tech CSE - 2025)",
              color: "border-[#6366f1]/25 bg-[#6366f1]/5"
            },
            {
              quote: "Choice filling order is what makes or breaks seat allocations. Following the mega-menu tips on BiharEduConnect, I listed BCE Bhagalpur CSE above local ones and got allocated R1. Best portal ever!",
              student: "Priya Kumari",
              college: "BCE Bhagalpur (B.Tech CSE - 2025)",
              color: "border-[#22d3ee]/25 bg-[#22d3ee]/5"
            },
            {
              quote: "The interactive seat matrix gave me a clear perspective of category distribution splits. The built-in AI assistant solved all of my doubts about residential certificates instantly. Highly recommended!",
              student: "Rahul Kumar",
              college: "GCE Gaya (B.Tech EEE - 2025)",
              color: "border-[#06b6d4]/25 bg-[#06b6d4]/5"
            }
          ].map((test, i) => (
            <div
              key={i}
              className={`p-6 border rounded-2xl flex flex-col justify-between relative shadow-sm glass-card hover-lift ${test.color}`}
            >
              <p className="text-xs text-slate-650 dark:text-gray-300 leading-relaxed italic mb-6">
                "{test.quote}"
              </p>
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 dark:text-white">{test.student}</h4>
                <span className="text-[10px] text-gray-400 font-bold block mt-0.5">{test.college}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ ACCORDION SECTION */}
      <section className="bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-slate-900 py-16 transition-colors">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white flex items-center justify-center gap-1.5">
              <HelpCircle className="w-6 h-6 text-[#22d3ee]" />
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Quick answers about BCECE engineering admission rules, document validations, and predicted cutoffs.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/30"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-5 py-4 text-left flex justify-between items-center hover:bg-slate-100/50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <span className="text-sm font-bold text-slate-800 dark:text-gray-200">
                      {faq.q}
                    </span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 py-4 border-t border-gray-150 dark:border-slate-850 text-xs text-gray-500 dark:text-gray-450 leading-relaxed bg-white dark:bg-slate-900/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6.3 B.TECH BRANCH PATHFINDER & COMPATIBILITY ANALYZER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 -z-10 h-[400px] w-[400px] rounded-full bg-gradient-to-l from-[#22d3ee]/10 to-transparent blur-3xl opacity-50"></div>
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#06b6d4]/10 text-[#06b6d4] text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            Branch Selection Helper
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            B.Tech Branch <span className="bg-gradient-to-r from-[#22d3ee] to-[#06b6d4] bg-clip-text text-transparent">Pathfinder</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
            Confused about which engineering branch fits you best? Select your interests below and let our real-time engine calculate your ideal career compatibility across core streams.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Panel: Traits Checklist & Live Compatibility */}
          <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-150 dark:border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#6366f1]/10 rounded-bl-full pointer-events-none" />
            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-5 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#6366f1]" /> Your Core Interests
            </h3>
            <div className="space-y-3 mb-8">
              {[
                { id: "coding", label: "I love coding & logical puzzle solving", icon: Laptop, color: "blue" },
                { id: "hardware", label: "I am fascinated by hardware & gadgets", icon: Cpu, color: "orange" },
                { id: "construction", label: "I am interested in heavy construction & infra", icon: Building, color: "amber" },
                { id: "govJobs", label: "I primarily want a Government/PSU Job", icon: Award, color: "emerald" },
                { id: "mathLogic", label: "I am very strong at complex Mathematics", icon: Cog, color: "indigo" },
              ].map((trait) => (
                <label key={trait.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-[#22d3ee]/40 bg-white/50 dark:bg-slate-900/40 cursor-pointer transition-colors group">
                  <input
                    type="checkbox"
                    checked={(pathfinderTraits as any)[trait.id]}
                    onChange={(e) => setPathfinderTraits({ ...pathfinderTraits, [trait.id]: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-[#22d3ee] focus:ring-[#22d3ee]"
                  />
                  <trait.icon className={`w-4 h-4 text-gray-400 group-hover:text-${trait.color}-500 transition-colors`} />
                  <span className="text-xs font-bold text-slate-700 dark:text-gray-300 select-none">{trait.label}</span>
                </label>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-slate-800 pt-6">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Live Compatibility Match</h4>
              <div className="space-y-4">
                {[
                  { key: "CSE", label: "Computer Science", score: pathfinderScores.CSE, color: "bg-[#22d3ee]" },
                  { key: "ECE", label: "Electronics & Comm", score: pathfinderScores.ECE, color: "bg-[#6366f1]" },
                  { key: "CE", label: "Civil Engineering", score: pathfinderScores.CE, color: "bg-[#06b6d4]" },
                  { key: "ME", label: "Mechanical Engg", score: pathfinderScores.ME, color: "bg-purple-500" },
                  { key: "EE", label: "Electrical Engg", score: pathfinderScores.EE, color: "bg-red-500" },
                ].sort((a, b) => b.score - a.score).map((branch) => (
                  <div key={branch.key}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-800 dark:text-white">{branch.label}</span>
                      <span className="text-[10px] font-black text-gray-500">{branch.score}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${branch.color} transition-all duration-700 ease-out`} style={{ width: `${branch.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Career Roadmap Tabs */}
          <div className="lg:col-span-7 glass-card rounded-3xl shadow-xl border border-gray-150 dark:border-slate-800 p-6 sm:p-8 flex flex-col h-full">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: "CSE", label: "CSE", icon: Laptop },
                { id: "ECE", label: "ECE", icon: Cpu },
                { id: "EE", label: "EE", icon: Zap },
                { id: "ME", label: "ME", icon: Cog },
                { id: "CE", label: "CE", icon: Building },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePathfinderTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activePathfinderTab === tab.id 
                      ? "bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-md" 
                      : "bg-gray-100 dark:bg-slate-800/50 text-gray-500 hover:text-slate-800 dark:hover:text-white"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                </button>
              ))}
            </div>

            {/* Dynamic Content Area */}
            <div className="flex-1 animate-fade-in relative bg-white/40 dark:bg-slate-950/40 rounded-2xl p-5 border border-gray-200/50 dark:border-slate-850/60">
              {activePathfinderTab === "CSE" && (
                <div className="space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black text-[#22d3ee]">Computer Science & Engineering</h3>
                      <p className="text-xs text-gray-500 font-semibold mt-1">Focuses on software dev, AI/ML, logic, and networking.</p>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-[#22d3ee]/10 text-[#22d3ee] font-black text-xs shrink-0 text-center">
                      Top Package<br/><span className="text-lg">~12.5L</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
                      <span className="text-[9px] text-gray-400 font-black uppercase block mb-1">Top Job Roles</span>
                      <p className="text-xs font-bold text-slate-700 dark:text-gray-300">SDE, Data Scientist, Cloud Architect</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
                      <span className="text-[9px] text-gray-400 font-black uppercase block mb-1">Difficulty Level</span>
                      <p className="text-xs font-bold text-slate-700 dark:text-gray-300">High (Math & Logic intensive)</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase mb-3">4-Year Curriculum Roadmap</h4>
                    <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-3 before:w-px before:bg-gray-200 dark:before:bg-slate-800">
                      {[
                        { yr: "Y1", title: "C Programming & Engg Basics", desc: "Foundations of logic and computation." },
                        { yr: "Y2", title: "DSA, OOP & Web Dev", desc: "Core algorithms and system design." },
                        { yr: "Y3", title: "Databases, OS & Networks", desc: "Advanced system architectures." },
                        { yr: "Y4", title: "AI/ML, Projects & Placements", desc: "Specialization and campus hiring." },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-4 relative">
                          <div className="w-6 h-6 rounded-full bg-[#22d3ee] text-white flex items-center justify-center text-[9px] font-black shrink-0 relative z-10 shadow-sm border-2 border-white dark:border-slate-950">{item.yr}</div>
                          <div>
                            <h5 className="text-xs font-bold text-slate-800 dark:text-white">{item.title}</h5>
                            <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activePathfinderTab === "ECE" && (
                <div className="space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black text-[#6366f1]">Electronics & Communication</h3>
                      <p className="text-xs text-gray-500 font-semibold mt-1">Bridging hardware circuits with software programming.</p>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-[#6366f1]/10 text-[#6366f1] font-black text-xs shrink-0 text-center">
                      Top Package<br/><span className="text-lg">~9.5L</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
                      <span className="text-[9px] text-gray-400 font-black uppercase block mb-1">Top Job Roles</span>
                      <p className="text-xs font-bold text-slate-700 dark:text-gray-300">Embedded Engineer, Network Analyst</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
                      <span className="text-[9px] text-gray-400 font-black uppercase block mb-1">Difficulty Level</span>
                      <p className="text-xs font-bold text-slate-700 dark:text-gray-300">Very High (Math, Physics & Coding)</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase mb-3">4-Year Curriculum Roadmap</h4>
                    <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-3 before:w-px before:bg-gray-200 dark:before:bg-slate-800">
                      {[
                        { yr: "Y1", title: "Basic Electronics & C", desc: "Circuit fundamentals and programming." },
                        { yr: "Y2", title: "Digital Logic & Analog Circuits", desc: "Core hardware architecture." },
                        { yr: "Y3", title: "Microprocessors & Signals", desc: "Communication systems and IoT." },
                        { yr: "Y4", title: "VLSI, Projects & Placements", desc: "Chip design and specialized hardware." },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-4 relative">
                          <div className="w-6 h-6 rounded-full bg-[#6366f1] text-white flex items-center justify-center text-[9px] font-black shrink-0 relative z-10 shadow-sm border-2 border-white dark:border-slate-950">{item.yr}</div>
                          <div>
                            <h5 className="text-xs font-bold text-slate-800 dark:text-white">{item.title}</h5>
                            <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activePathfinderTab === "CE" && (
                <div className="space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black text-[#06b6d4]">Civil Engineering</h3>
                      <p className="text-xs text-gray-500 font-semibold mt-1">Infrastructure, construction, and urban planning.</p>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-[#06b6d4]/10 text-[#06b6d4] font-black text-xs shrink-0 text-center">
                      Govt Scope<br/><span className="text-lg">Very High</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
                      <span className="text-[9px] text-gray-400 font-black uppercase block mb-1">Top Job Roles</span>
                      <p className="text-xs font-bold text-slate-700 dark:text-gray-300">Site Engineer, Structural Analyst</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
                      <span className="text-[9px] text-gray-400 font-black uppercase block mb-1">Govt. Job Prospects</span>
                      <p className="text-xs font-bold text-[#06b6d4] dark:text-[#22c55e]">Exceptional (PWD, BPSC, CPWD)</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase mb-3">4-Year Curriculum Roadmap</h4>
                    <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-3 before:w-px before:bg-gray-200 dark:before:bg-slate-800">
                      {[
                        { yr: "Y1", title: "Mechanics & Graphics", desc: "Physics and engineering drawing." },
                        { yr: "Y2", title: "Surveying & Materials", desc: "Fluid mechanics and concrete tech." },
                        { yr: "Y3", title: "Structures & Geotech", desc: "Soil mechanics and design theory." },
                        { yr: "Y4", title: "Transport & Environment", desc: "Highway engineering and project execution." },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-4 relative">
                          <div className="w-6 h-6 rounded-full bg-[#06b6d4] text-white flex items-center justify-center text-[9px] font-black shrink-0 relative z-10 shadow-sm border-2 border-white dark:border-slate-950">{item.yr}</div>
                          <div>
                            <h5 className="text-xs font-bold text-slate-800 dark:text-white">{item.title}</h5>
                            <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activePathfinderTab === "ME" && (
                <div className="space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black text-purple-600">Mechanical Engineering</h3>
                      <p className="text-xs text-gray-500 font-semibold mt-1">Machines, thermodynamics, and manufacturing.</p>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-600 font-black text-xs shrink-0 text-center">
                      Govt Scope<br/><span className="text-lg">High</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
                      <span className="text-[9px] text-gray-400 font-black uppercase block mb-1">Top Job Roles</span>
                      <p className="text-xs font-bold text-slate-700 dark:text-gray-300">Design Engg, Auto/Manufacturing</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
                      <span className="text-[9px] text-gray-400 font-black uppercase block mb-1">Core Recruiters</span>
                      <p className="text-xs font-bold text-slate-700 dark:text-gray-300">Tata Motors, L&T, NTPC, IOCL</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase mb-3">4-Year Curriculum Roadmap</h4>
                    <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-3 before:w-px before:bg-gray-200 dark:before:bg-slate-800">
                      {[
                        { yr: "Y1", title: "Thermodynamics & Workshop", desc: "Energy fundamentals and tooling." },
                        { yr: "Y2", title: "Fluid Mech & Kinematics", desc: "Machine theory and fluid dynamics." },
                        { yr: "Y3", title: "Machine Design & Heat Transfer", desc: "Core mechanical system design." },
                        { yr: "Y4", title: "CAD/CAM & Automobile Engg", desc: "Computer aided manufacturing." },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-4 relative">
                          <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-[9px] font-black shrink-0 relative z-10 shadow-sm border-2 border-white dark:border-slate-950">{item.yr}</div>
                          <div>
                            <h5 className="text-xs font-bold text-slate-800 dark:text-white">{item.title}</h5>
                            <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activePathfinderTab === "EE" && (
                <div className="space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black text-red-500">Electrical Engineering</h3>
                      <p className="text-xs text-gray-500 font-semibold mt-1">Power systems, motors, and electrical grids.</p>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-red-500/10 text-red-500 font-black text-xs shrink-0 text-center">
                      Govt Scope<br/><span className="text-lg">Very High</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
                      <span className="text-[9px] text-gray-400 font-black uppercase block mb-1">Top Job Roles</span>
                      <p className="text-xs font-bold text-slate-700 dark:text-gray-300">Power Engineer, Grid Manager</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
                      <span className="text-[9px] text-gray-400 font-black uppercase block mb-1">Core Recruiters</span>
                      <p className="text-xs font-bold text-slate-700 dark:text-gray-300">BSPHCL, PowerGrid, NTPC, BHEL</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase mb-3">4-Year Curriculum Roadmap</h4>
                    <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-3 before:w-px before:bg-gray-200 dark:before:bg-slate-800">
                      {[
                        { yr: "Y1", title: "Basic Electrical & Magnetism", desc: "Circuit theorems and physics." },
                        { yr: "Y2", title: "Transformers & Machines", desc: "DC/AC machines and induction." },
                        { yr: "Y3", title: "Power Systems & Control", desc: "Grid management and stability." },
                        { yr: "Y4", title: "Power Electronics & Drives", desc: "High voltage engineering." },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-4 relative">
                          <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-[9px] font-black shrink-0 relative z-10 shadow-sm border-2 border-white dark:border-slate-950">{item.yr}</div>
                          <div>
                            <h5 className="text-xs font-bold text-slate-800 dark:text-white">{item.title}</h5>
                            <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6.5 ABOUT US SECTION */}
      <section id="about-us" className="bg-slate-50 dark:bg-slate-900/10 border-t border-b border-gray-200 dark:border-slate-900 py-16 transition-colors scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6366f1]/10 text-[#6366f1] text-xs font-bold uppercase tracking-wider mb-3">
              <GraduationCap className="w-3.5 h-3.5" />
              Our Mission & Vision
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              About <span className="bg-gradient-to-r from-[#6366f1] via-[#22d3ee] to-[#06b6d4] bg-clip-text text-transparent">BiharEduConnect</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
              Empowering engineering aspirants of Bihar with advanced prediction systems and interactive guides for a seamless admissions journey.
            </p>
          </div>

          {/* Main Core Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
            {/* Left text block */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                Democratizing Technical Admissions in Bihar
              </h3>
              <p className="text-sm text-gray-650 dark:text-gray-400 leading-relaxed">
                Every year, over 15,000 students qualified in JEE Main participate in the Under Graduate Engineering Admission Counselling (UGEAC) conducted by the BCECE Board, Patna. Due to the complex nature of state reservation systems, round-wise cutoff dynamic thresholds, and document requirements, many high-merit candidates miss out on securing branches in their dream institutions.
              </p>
              <p className="text-sm text-gray-650 dark:text-gray-400 leading-relaxed">
                <strong>BiharEduConnect</strong> was conceived as a comprehensive, independent candidate helper to resolve this information gap. By building dynamic, client-side indexers and predictor tools, we provide students with instant, accurate insights regarding B.Tech vacancies, hostel fees, and branch scopes across Bihar's 38 government engineering colleges.
              </p>
              <div className="p-4 bg-[#06b6d4]/5 border border-[#06b6d4]/20 rounded-2xl flex gap-3">
                <CheckCircle className="w-6 h-6 text-[#06b6d4] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-gray-150">BCECEB Compliant Guidance</h4>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-normal mt-0.5">
                    Our step-by-step guides strictly follow latest BCECE Board bulletins, helping candidates prepare resident, category, and educational certificates accurately.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side graphics panel */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              <div className="w-full max-w-sm rounded-3xl glass-card p-6 shadow-xl relative animate-float">
                <div className="absolute -inset-0.5 -z-10 rounded-[26px] bg-gradient-to-tr from-[#6366f1] via-[#22d3ee] to-[#06b6d4] opacity-20 blur-sm"></div>
                
                <div className="space-y-6 text-left">
                  {/* Mission block */}
                  <div className="flex gap-4">
                    <div className="p-3 bg-[#6366f1]/15 text-[#6366f1] rounded-xl shrink-0 h-11 w-11 flex items-center justify-center font-bold">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Our Mission</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal mt-1">
                        To deliver highly accurate rank predictions and choice strategies, making the admission path transparent and stress-free.
                      </p>
                    </div>
                  </div>

                  {/* Vision block */}
                  <div className="flex gap-4">
                    <div className="p-3 bg-[#06b6d4]/15 text-[#06b6d4] rounded-xl shrink-0 h-11 w-11 flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Our Vision</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal mt-1">
                        To cultivate a robust digital resource catalog for every aspiring technical graduate in Bihar, fostering merit-driven college allocations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Meet the Founders */}
          <div className="mb-16">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white flex items-center justify-center gap-1.5">
                <Users className="w-6 h-6 text-[#22d3ee]" />
                Meet Our Founders
              </h3>
              <p className="text-xs text-gray-450 dark:text-gray-400 mt-1.5">
                The visionary minds from premier technical institutions driving transparent admissions in Bihar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {[
                {
                  name: "ARYAN SINGH KASHYAP",
                  role: "Founder",
                  college: "National Institute of Technology, Agartala (NIT Agartala)",
                  color: "border-[#6366f1]/30 bg-gradient-to-br from-[#6366f1]/5 to-transparent",
                  badgeColor: "bg-[#6366f1]/10 text-[#6366f1]"
                },
                {
                  name: "KUMAR PANDAV",
                  role: "Co-founder",
                  college: "Government Engineering College, Banka (GEC Banka)",
                  color: "border-[#22d3ee]/30 bg-gradient-to-br from-[#22d3ee]/5 to-transparent",
                  badgeColor: "bg-[#22d3ee]/10 text-[#22d3ee]"
                }
              ].map((f, i) => (
                <div
                  key={i}
                  className={`p-6 border rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-4 text-left ${f.color}`}
                >
                  <div className={`p-4 rounded-2xl shrink-0 ${f.badgeColor} flex items-center justify-center font-extrabold text-sm shadow-inner`}>
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide inline-block ${f.badgeColor}`}>
                      {f.role}
                    </span>
                    <h4 className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-white leading-snug tracking-tight">
                      {f.name}
                    </h4>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#06b6d4] shrink-0" />
                      {f.college}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Values */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-850 p-8">
            <h3 className="text-xl font-bold text-center text-slate-800 dark:text-white mb-8">
              Our Foundational Values
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Data Transparency",
                  description: "We compile real-world round-by-round BCECE cutoff closing ranks to ensure candidates have accurate information before finalizing choice entries.",
                  icon: TrendingUp,
                  color: "text-[#22d3ee] bg-[#22d3ee]/10 border-[#22d3ee]/20"
                },
                {
                  title: "Student-First Design",
                  description: "Our mobile-first predictor calculators and checklists are built intentionally for candidates across all of Bihar's rural and urban sectors.",
                  icon: Compass,
                  color: "text-[#6366f1] bg-[#6366f1]/10 border-[#6366f1]/20"
                },
                {
                  title: "Counselling Clarity",
                  description: "Demystifying complex seat reservation categories (BC, EBC, EWS, RCG) and nodal verification guidelines to avoid accidental application rejections.",
                  icon: Layers,
                  color: "text-[#06b6d4] bg-[#06b6d4]/10 border-[#06b6d4]/20"
                }
              ].map((v, i) => {
                const Icon = v.icon;
                return (
                  <div key={i} className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-gray-150 dark:border-slate-850 shadow-sm flex flex-col items-center text-center space-y-4">
                    <div className={`p-3 rounded-xl border shrink-0 ${v.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-800 dark:text-gray-250">{v.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {v.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* Community Discussion Section */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-5xl mx-auto pb-4">
        <CommunityComments pageId="home" title="Community Discussion" />
      </section>



    </div>
  );
}
