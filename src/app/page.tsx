"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "../context/AppContext";
import { College } from "../data/colleges";
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
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  SlidersHorizontal,
  Building,
  CheckCircle
} from "lucide-react";

export default function Homepage() {
  const { 
    colleges, 
    user,
    setShowAuthModal,
    setPendingRedirect
  } = useApp();

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  React.useEffect(() => {
    if (!user) {
      setShowAuthModal(true);
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
    { value: "38+", label: "Government Colleges", icon: GraduationCap, color: "text-[#FF9933] bg-[#FF9933]/10" },
    { value: "10,500+", label: "B.Tech Seats", icon: Layers, color: "text-[#138808] bg-[#138808]/10" },
    { value: "15+", label: "Engg Branches", icon: BookOpen, color: "text-[#2563EB] bg-[#2563EB]/10" },
    { value: "98.5%", label: "Accuracy Rate", icon: Award, color: "text-amber-500 bg-amber-500/10" }
  ];

  const features = [
    {
      title: "College Predictor",
      description: "Enter your category, rank, and gender to identify high-probability engineering colleges and B.Tech specializations in Bihar.",
      href: "/predictor",
      icon: Compass,
      color: "from-[#FF9933]/20 to-[#FF9933]/5",
      iconColor: "text-[#FF9933]",
      actionText: "Predict My College"
    },
    {
      title: "Cutoff Explorer",
      description: "Search and compare round-wise historical cutoff closing ranks from preceding UGEAC admissions lists using multi-year trend charts.",
      href: "/cutoffs",
      icon: TrendingUp,
      color: "from-[#2563EB]/20 to-[#2563EB]/5",
      iconColor: "text-[#2563EB]",
      actionText: "Analyze Trends"
    },
    {
      title: "Seat Matrix Dashboard",
      description: "Explore category-wise (UR, BC, EBC, SC, ST, EWS, RCG) and branch-wise B.Tech intake statistics across all participating colleges.",
      href: "/seats",
      icon: Layers,
      color: "from-[#138808]/20 to-[#138808]/5",
      iconColor: "text-[#138808]",
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
    { date: "06.06.2026", title: "Online Editing of Application Form", status: "Upcoming", badge: "bg-[#FF9933]/10 text-[#FF9933] border border-[#FF9933]/20" },
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
      {/* 1. HERO SECTION WITH GRADIENT BACKGROUND */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2563EB]/5 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 py-16 sm:py-24 transition-colors">
        <div className="absolute top-0 right-0 -z-10 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-[#FF9933]/10 to-[#138808]/10 blur-3xl opacity-60"></div>
        <div className="absolute bottom-10 left-10 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-[#2563EB]/10 to-[#138808]/10 blur-3xl opacity-60"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero text panel */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF9933]/10 border border-[#FF9933]/20 text-[#FF9933] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" />
                BCECE UGEAC Counselling 2026
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-800 dark:text-white leading-[1.1]">
                Bihar Engineering <br />
                <span className="bg-gradient-to-r from-[#FF9933] via-[#2563EB] to-[#138808] bg-clip-text text-transparent">
                  Counselling Made Easy
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Predict government engineering colleges based on rank, compare placements, analyze category-specific cutoffs, check seat matrices, and track admission schedules in one place.
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/predictor"
                  onClick={(e) => handleGuardClick(e, "/predictor")}
                  className="px-6 py-3.5 bg-gradient-to-r from-[#FF9933] to-[#138808] hover:shadow-lg shadow-[#138808]/20 text-white font-bold rounded-xl text-sm flex items-center gap-1.5 transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  Predict My College
                  <ArrowRight className="w-4.5 h-4.5" />
                </Link>
                <Link
                  href="/cutoffs"
                  onClick={(e) => handleGuardClick(e, "/cutoffs")}
                  className="px-6 py-3.5 border border-gray-300 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-850 dark:text-gray-300 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Check Cutoffs
                </Link>
                <Link
                  href="/guide"
                  onClick={(e) => handleGuardClick(e, "/guide")}
                  className="px-6 py-3.5 text-[#2563EB] hover:text-[#2563EB]/80 font-bold text-sm hover:underline cursor-pointer"
                >
                  Counselling Guide ➔
                </Link>
              </div>
            </div>

            {/* Hero graphics panel (glowing cards overlay) */}
            <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800/80 p-6 shadow-2xl relative">
                {/* Decorative glowing gradient borders */}
                <div className="absolute -inset-0.5 -z-10 rounded-[26px] bg-gradient-to-tr from-[#FF9933] via-[#2563EB] to-[#138808] opacity-25 blur-sm"></div>

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
                    
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#138808]/10 via-white to-white dark:from-[#138808]/10 dark:via-slate-900 dark:to-slate-900 border border-[#138808]/20 flex items-center justify-between gap-2 shadow-sm">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-855 dark:text-gray-100">MIT Muzaffarpur</h4>
                        <span className="text-[10px] text-[#FF9933] font-semibold">B.Tech in CSE</span>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full text-[9px] font-bold">
                          92% Chance
                        </span>
                        <span className="block text-[8px] text-gray-400 mt-1">Closing Cutoff: 380</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#2563EB]/10 via-white to-white dark:from-[#2563EB]/10 dark:via-slate-900 dark:to-slate-900 border border-[#2563EB]/20 flex items-center justify-between gap-2 shadow-sm">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-855 dark:text-gray-100">BCE Bhagalpur</h4>
                        <span className="text-[10px] text-[#FF9933] font-semibold">B.Tech in ECE</span>
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
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/30">
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
            return (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-205 dark:border-slate-800/80 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-5 shrink-0`}>
                    <Icon className={`w-6 h-6 ${feat.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-[#2563EB] transition-colors mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                    {feat.description}
                  </p>
                </div>

                <Link
                  href={feat.href}
                  onClick={(e) => handleGuardClick(e, feat.href)}
                  className="flex items-center gap-1.5 text-xs text-[#2563EB] dark:text-[#FF9933] font-bold hover:underline"
                >
                  {feat.actionText}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
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
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6 pb-3 border-b border-gray-100 dark:border-slate-850">
                <Calendar className="w-5 h-5 text-[#FF9933]" />
                Latest Admission Notification Board
              </h2>

              <div className="space-y-4">
                {updates.map((upd, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-gray-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors"
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
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
                <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-slate-850 pb-2">
                  <FileText className="w-5 h-5 text-[#138808]" />
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
                      <span className="h-4 w-4 bg-[#138808]/15 border border-[#138808]/30 rounded-full flex items-center justify-center shrink-0 text-[10px] text-[#138808] font-bold mt-0.5">
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
                    className="w-full py-2.5 bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-bold rounded-xl text-xs text-center uppercase tracking-wider block transition-colors cursor-pointer"
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
          {[
            {
              quote: "The College Predictor is remarkably precise. I secured CSE at MIT Muzaffarpur exactly as suggested based on my UGEAC merit rank. The cutoff trend lines helped me order my choices perfectly.",
              student: "Abhishek Sahni",
              college: "MIT Muzaffarpur (B.Tech CSE - 2025)",
              color: "border-[#FF9933]/25 bg-[#FF9933]/5"
            },
            {
              quote: "Choice filling order is what makes or breaks seat allocations. Following the mega-menu tips on BiharEduConnect, I listed BCE Bhagalpur CSE above local ones and got allocated R1. Best portal ever!",
              student: "Priya Kumari",
              college: "BCE Bhagalpur (B.Tech CSE - 2025)",
              color: "border-[#2563EB]/25 bg-[#2563EB]/5"
            },
            {
              quote: "The interactive seat matrix gave me a clear perspective of category distribution splits. The built-in AI assistant solved all of my doubts about residential certificates instantly. Highly recommended!",
              student: "Rahul Kumar",
              college: "GCE Gaya (B.Tech EEE - 2025)",
              color: "border-[#138808]/25 bg-[#138808]/5"
            }
          ].map((test, i) => (
            <div
              key={i}
              className={`p-6 border rounded-2xl flex flex-col justify-between relative shadow-sm ${test.color}`}
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
              <HelpCircle className="w-6 h-6 text-[#2563EB]" />
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

      {/* 6.5 ABOUT US SECTION */}
      <section id="about-us" className="bg-slate-50 dark:bg-slate-900/10 border-t border-b border-gray-200 dark:border-slate-900 py-16 transition-colors scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF9933]/10 text-[#FF9933] text-xs font-bold uppercase tracking-wider mb-3">
              <GraduationCap className="w-3.5 h-3.5" />
              Our Mission & Vision
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              About <span className="bg-gradient-to-r from-[#FF9933] via-[#2563EB] to-[#138808] bg-clip-text text-transparent">BiharEduConnect</span>
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
              <div className="p-4 bg-[#138808]/5 border border-[#138808]/20 rounded-2xl flex gap-3">
                <CheckCircle className="w-6 h-6 text-[#138808] shrink-0 mt-0.5" />
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
              <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800/80 p-6 shadow-xl relative">
                <div className="absolute -inset-0.5 -z-10 rounded-[26px] bg-gradient-to-tr from-[#FF9933] via-[#2563EB] to-[#138808] opacity-20 blur-sm"></div>
                
                <div className="space-y-6 text-left">
                  {/* Mission block */}
                  <div className="flex gap-4">
                    <div className="p-3 bg-[#FF9933]/15 text-[#FF9933] rounded-xl shrink-0 h-11 w-11 flex items-center justify-center font-bold">
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
                    <div className="p-3 bg-[#138808]/15 text-[#138808] rounded-xl shrink-0 h-11 w-11 flex items-center justify-center font-bold">
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
                <Users className="w-6 h-6 text-[#2563EB]" />
                Meet Our Founders
              </h3>
              <p className="text-xs text-gray-450 dark:text-gray-400 mt-1.5">
                The visionary minds from premier technical institutions driving transparent admissions in Bihar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  name: "ARYAN SINGH KASHYAP",
                  role: "Founder",
                  college: "National Institute of Technology, Agartala (NIT Agartala)",
                  color: "border-[#FF9933]/30 bg-gradient-to-br from-[#FF9933]/5 to-transparent",
                  badgeColor: "bg-[#FF9933]/10 text-[#FF9933]"
                },
                {
                  name: "PANDAV YADAV",
                  role: "Co-Founder",
                  college: "Government Engineering College, Banka (GEC Banka)",
                  color: "border-[#138808]/30 bg-gradient-to-br from-[#138808]/5 to-transparent",
                  badgeColor: "bg-[#138808]/10 text-[#138808]"
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
                      <MapPin className="w-3.5 h-3.5 text-[#138808] shrink-0" />
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
                  color: "text-[#2563EB] bg-[#2563EB]/10 border-[#2563EB]/20"
                },
                {
                  title: "Student-First Design",
                  description: "Our mobile-first predictor calculators and checklists are built intentionally for candidates across all of Bihar's rural and urban sectors.",
                  icon: Compass,
                  color: "text-[#FF9933] bg-[#FF9933]/10 border-[#FF9933]/20"
                },
                {
                  title: "Counselling Clarity",
                  description: "Demystifying complex seat reservation categories (BC, EBC, EWS, RCG) and nodal verification guidelines to avoid accidental application rejections.",
                  icon: Layers,
                  color: "text-[#138808] bg-[#138808]/10 border-[#138808]/20"
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
    </div>
  );
}
