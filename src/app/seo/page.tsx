"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Search, 
  BookOpen, 
  MapPin, 
  ChevronRight,
  TrendingUp,
  Compass,
  GraduationCap
} from "lucide-react";
import Link from "next/link";

export default function SEOResourceHub() {
  const [activeArticle, setActiveArticle] = useState("counselling");

  const articles = [
    {
      id: "counselling",
      title: "Bihar Engineering Counselling 2026",
      metaDesc: "Comprehensive guidelines on UGEAC engineering counselling registration dates, state merits, and counselling protocols.",
      content: `The Under Graduate Engineering Admission Counselling (UGEAC) 2026 is the primary pathway for secure admissions into undergraduate B.Tech courses in government engineering institutions in the state of Bihar. Conducted by the Bihar Combined Entrance Competitive Examination Board (BCECEB), this counselling process distributes over 10,000 engineering seats across 38 participating colleges. 

Admissions are strictly determined based on candidate JEE Main All India Ranks. The BCECE board translates JEE Main percentiles into a State Merit Rank (UGEAC Merit). Registrations typically commence in June, followed by online choice filling and seat allotment in July and August.Duly verified original resident certificates of Bihar are mandatory to qualify under Bihar's 100% Home State institutional reservation policy.`
    },
    {
      id: "bcece",
      title: "BCECE Engineering Admission Guidelines",
      metaDesc: "Understand eligibility conditions, Bihar Board domicile requirements, and percentiles cutoffs for state engineering admissions.",
      content: `BCECE Engineering Admission guidelines mandate that a student must have passed the 10+2 Intermediate Board Examination from a recognized school board (such as BSEB Bihar Board, CBSE, or ICSE) with Physics, Chemistry, and Mathematics (PCM) as core subjects. Candidates must have obtained a valid JEE Main score to participate in UGEAC.

Crucially, candidates must reside or hold domicile in the state of Bihar.Duly validated residential certificates issued by standard circle officers in Bihar are checked physically during Document Verification. Understanding the reservation categories is vital: seats are allocated under strict percentages across Unreserved (UR), Backward Class (BC), Extremely Backward Class (EBC), Scheduled Castes (SC), Scheduled Tribes (ST), Economically Weaker Sections (EWS), and Reserved Category Girls (RCG).`
    },
    {
      id: "predictor-info",
      title: "Bihar BTech College Predictor Guide",
      metaDesc: "How to use JEE Main ranks to predict government engineering college branches in Bihar (MIT, BCE, GCE).",
      content: `Our Bihar College Predictor utilizes multi-year cutoff matrices from preceding UGEAC admissions rounds to estimate your engineering admissions probability. The algorithm maps your merit rank, reservation category, gender pool, and domicile quota against round 1 and round 2 closing ranks.

Chances are classified as:
- **High Chance**: Your rank is safely below preceding cutoff closings. Excellent opportunity to lock this branch.
- **Moderate Chance**: Your rank is within 10-15% of the preceding cutoff closing. Good chance to secure this option in Round 2 or Mop-up rounds.
- **Low Chance**: Your rank is significantly above previous closing cutoffs. Suggests looking at newer colleges or core engineering branches.`
    },
    {
      id: "cutoff-guide",
      title: "Bihar Engineering Cutoffs Analysis",
      metaDesc: "Analyze opening and closing ranks for MIT Muzaffarpur, BCE Bhagalpur, and GCE Gaya across rounds.",
      content: `Bihar Engineering Cutoffs fluctuate annually depending on applicant numbers, JEE Main difficulty levels, and branch popularity trends. Historically, Computer Science & Engineering (CSE) and Electronics & Communication Engineering (ECE) branches are highly sought after and close early.

At premier institutions like MIT Muzaffarpur, the UR closing rank for CSE has consistently settled under 240. For BCE Bhagalpur, CSE cutoffs close around 450. Newer colleges, such as GEC Vaishali, GEC Banka, or KEC Katihar, offer CSE branches up to UGEAC ranks of 1500-2000, while core engineering branches like Mechanical (ME) and Civil (CE) are available up to ranks of 3000-4500.`
    },
    {
      id: "admission-book",
      title: "Bihar BTech Admission Guide 2026",
      metaDesc: "A step-by-step student admissions checklist for online registrations, merit checking, and physical document verification.",
      content: `Securing B.Tech admissions in Bihar government colleges involves navigating a strict sequence of official milestones:
1. **Online Registration**: Creating UGEAC profiles on the BCECE site and paying the registration fee.
2. **Rank Card Download**: Downloading the state merit card displaying your UR and Category ranks.
3. **Mock Choice Filling**: Simulating lists to order target colleges.
4. **Final Choice Lock**: Locking choices with OTP verification.
5. **Physical Document Verification**: Reporting to nodal verification colleges (e.g. MIT Muzaffarpur, LNJPIT Chapra) with original certificates.
6. **Final Admission**: Paying tuition fees at the allotted college campus.`
    },
    {
      id: "top-colleges",
      title: "Top Engineering Colleges in Bihar Profiles",
      metaDesc: "Overview of premier government engineering institutes, established years, campus sizes, and placements statistics.",
      content: `Bihar's technical education landscape comprises outstanding government-owned engineering institutes:
- **Muzaffarpur Institute of Technology (MIT Muzaffarpur)**: Established in 1954, it is the oldest and most prestigious, boasting a 55-acre campus, an average B.Tech placement of 5.8 LPA, and specialized labs.
- **Bhagalpur College of Engineering (BCE Bhagalpur)**: Founded in 1960, BCE Bhagalpur has a legacy in civil and electrical engineering with excellent alumni networks and average placement packages of 5.2 LPA.
- **Gaya College of Engineering (GCE Gaya)**: Established in 2008, GCE is southern Bihar's hub for technical education, offering modern computational blocks and solid average placements of 4.5 LPA.`
    }
  ];

  const activeArtObj = articles.find((a) => a.id === activeArticle) || articles[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* HTML5 Semantic single h1 per SEO guidelines */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-3">
          <FileText className="w-3.5 h-3.5" />
          UGEAC Informational Library
        </div>
        <h1 id="seo-hub-main-title" className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          BCECE Bihar Engineering <span className="bg-gradient-to-r from-[#FF9933] to-[#138808] bg-clip-text text-transparent">Counselling SEO Hub</span>
        </h1>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
          Access high-impact, researched educational articles regarding admission rules, cutoffs, and seat matrices in Bihar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation articles menu (Col-4) */}
        <div className="lg:col-span-4 space-y-2.5">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">SEO Informational Pages</h3>
          {articles.map((art) => {
            const isActive = activeArticle === art.id;
            return (
              <button
                key={art.id}
                id={`article-tab-id-${art.id}`}
                onClick={() => setActiveArticle(art.id)}
                className={`w-full text-left p-4 border rounded-2xl transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                  isActive
                    ? "bg-slate-50 dark:bg-slate-900 border-[#2563EB]/40 shadow-sm"
                    : "bg-white dark:bg-slate-950 border-gray-150 dark:border-slate-850 hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-gray-100 dark:border-slate-800 ${
                    isActive ? "bg-[#2563EB] text-white" : "bg-slate-50 dark:bg-slate-900 text-gray-400"
                  }`}>
                    <BookOpen className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-gray-150 leading-snug">{art.title}</h4>
                    <span className="text-[9px] text-gray-400 truncate block max-w-[200px] mt-0.5">{art.metaDesc}</span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? "text-[#2563EB] translate-x-0.5" : "text-gray-300 group-hover:translate-x-0.5"}`} />
              </button>
            );
          })}
        </div>

        {/* Detailed Article View (Col-8) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-gray-255 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <article className="space-y-4">
            <header className="space-y-2 border-b border-gray-100 dark:border-slate-850 pb-4">
              <span className="px-2.5 py-0.5 bg-[#138808]/15 border border-[#138808]/20 text-[#138808] rounded-md text-[9px] font-bold uppercase tracking-wide">
                SEO Resource Profile
              </span>
              <h2 className="text-2xl font-extrabold text-slate-850 dark:text-white leading-snug">
                {activeArtObj.title}
              </h2>
              <p className="text-xs italic text-gray-450 dark:text-gray-400">
                Meta Description: {activeArtObj.metaDesc}
              </p>
            </header>

            <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-4 whitespace-pre-line font-medium">
              {activeArtObj.content}
            </div>
          </article>

          {/* Quick links to action pages */}
          <div className="mt-8 pt-5 border-t border-dashed border-gray-150 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between">
            <span className="text-[10px] text-gray-405 font-bold uppercase tracking-wider">Helpful Tool Links:</span>
            <div className="flex gap-2.5">
              <Link
                href="/predictor"
                className="px-3.5 py-1.5 bg-gradient-to-r from-[#FF9933] to-[#138808] text-white font-bold rounded-lg text-[10px] uppercase flex items-center gap-1 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                Predict College
              </Link>
              <Link
                href="/cutoffs"
                className="px-3.5 py-1.5 border border-gray-250 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-800 dark:text-gray-300 font-bold rounded-lg text-[10px] uppercase flex items-center gap-1 cursor-pointer"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                Cutoffs Explorer
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
