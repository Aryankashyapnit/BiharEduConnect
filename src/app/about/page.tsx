"use client";

import React from "react";
import { 
  GraduationCap, 
  Target, 
  Eye, 
  ShieldCheck, 
  MapPin, 
  Compass, 
  TrendingUp, 
  Layers,
  Award,
  Users
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const values = [
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
  ];

  const founders = [
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
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF9933]/10 text-[#FF9933] text-xs font-bold uppercase tracking-wider mb-3">
          <GraduationCap className="w-3.5 h-3.5" />
          Our Mission & Vision
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          About <span className="bg-gradient-to-r from-[#FF9933] via-[#2563EB] to-[#138808] bg-clip-text text-transparent">BiharEduConnect</span>
        </h1>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-400 leading-relaxed">
          Empowering engineering aspirants of Bihar with advanced prediction systems and interactive guides for a seamless admissions journey.
        </p>
      </div>

      {/* Main Core Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
        {/* Left text block (Col-7) */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Democratizing Technical Admissions in Bihar
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Every year, over 15,000 students qualified in JEE Main participate in the Under Graduate Engineering Admission Counselling (UGEAC) conducted by the BCECE Board, Patna. Due to the complex nature of state reservation systems, round-wise cutoff dynamic thresholds, and document requirements, many high-merit candidates miss out on securing branches in their dream institutions.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            **BiharEduConnect** was conceived as a comprehensive, independent candidate helper to resolve this information gap. By building dynamic, client-side indexers and predictor tools, we provide students with instant, accurate insights regarding B.Tech vacancies, hostel fees, and branch scopes across Bihar's 38 government engineering colleges.
          </p>
          <div className="p-4 bg-[#138808]/5 border border-[#138808]/20 rounded-2xl flex gap-3">
            <ShieldCheck className="w-6 h-6 text-[#138808] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-gray-150">BCECEB Compliant Guidance</h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-normal mt-0.5">
                Our step-by-step guides strictly follow latest BCECE Board bulletins, helping candidates prepare resident, category, and educational certificates accurately.
              </p>
            </div>
          </div>
        </div>

        {/* Right side graphics panel (Col-5) */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800/80 p-6 shadow-xl relative">
            <div className="absolute -inset-0.5 -z-10 rounded-[26px] bg-gradient-to-tr from-[#FF9933] via-[#2563EB] to-[#138808] opacity-20 blur-sm"></div>
            
            <div className="space-y-6">
              {/* Mission block */}
              <div className="flex gap-4">
                <div className="p-3 bg-[#FF9933]/15 text-[#FF9933] rounded-xl shrink-0 h-11 w-11 flex items-center justify-center font-bold">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Our Mission</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal mt-1">
                    To deliver highly accurate rank predictions and choice strategies, making the admission path transparent and stress-free.
                  </p>
                </div>
              </div>

              {/* Vision block */}
              <div className="flex gap-4">
                <div className="p-3 bg-[#138808]/15 text-[#138808] rounded-xl shrink-0 h-11 w-11 flex items-center justify-center font-bold">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Our Vision</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal mt-1">
                    To cultivate a robust digital resource catalog for every aspiring technical graduate in Bihar, fostering merit-driven college allocations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meet the Founders Leadership Panel */}
      <section className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white flex items-center justify-center gap-1.5">
            <Users className="w-6 h-6 text-[#2563EB]" />
            Meet Our Founders
          </h2>
          <p className="text-xs text-gray-450 dark:text-gray-400 mt-1.5">
            The visionary minds from premier technical institutions driving transparent admissions in Bihar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {founders.map((f, i) => (
            <div
              key={i}
              className={`p-6 border rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 flex items-start gap-4 ${f.color}`}
            >
              <div className={`p-4 rounded-2xl shrink-0 ${f.badgeColor} flex items-center justify-center font-extrabold text-sm shadow-inner`}>
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide inline-block ${f.badgeColor}`}>
                  {f.role}
                </span>
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-white leading-snug tracking-tight">
                  {f.name}
                </h3>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#138808] shrink-0" />
                  {f.college}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values Section */}
      <div className="bg-slate-50 dark:bg-slate-900/30 rounded-3xl border border-gray-200 dark:border-slate-850 p-8 mb-12">
        <h2 className="text-xl font-bold text-center text-slate-800 dark:text-white mb-8">
          Our Foundational Values
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-150 dark:border-slate-800 shadow-sm flex flex-col items-center text-center space-y-4">
                <div className={`p-3 rounded-xl border shrink-0 ${v.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-gray-200">{v.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {v.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA section */}
      <div className="text-center bg-gradient-to-tr from-[#2563EB]/5 to-[#138808]/5 border border-dashed border-[#2563EB]/25 rounded-3xl p-8">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Ready to discover your engineering options?</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
          Start predicting your government colleges based on your JEE Main scores immediately.
        </p>
        <Link
          href="/predictor"
          className="inline-flex items-center gap-1.5 mt-4 px-5 py-2.5 bg-[#2563EB] hover:bg-[#2563EB]/95 text-white font-bold rounded-xl text-xs uppercase"
        >
          Open College Predictor
        </Link>
      </div>
    </div>
  );
}
