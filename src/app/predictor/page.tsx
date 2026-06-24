"use client";
 
import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { getCutoff, getEstimatedCutoff, convertPercentileToUR, categoryRatios } from "../../data/cutoffs";
import { branchNames } from "../../data/colleges";
import { 
  Compass, 
  HelpCircle, 
  Download, 
  Bookmark, 
  Check, 
  SlidersHorizontal, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  BadgePercent,
  MapPin,
  Building
} from "lucide-react";
import Link from "next/link";
import { AuthGate } from "../../components/AuthGate";
 
export default function CollegePredictor() {
  const { colleges, savePrediction, savedPredictions, user } = useApp();
 
  // Form State
  const [inputType, setInputType] = useState<"percentile" | "ugeac_rank" | "bcece_rank">("percentile");
  const [percentile, setPercentile] = useState<number | "">(user?.percentile || "");
  const [rank, setRank] = useState<number | "">("");
  const [rankType, setRankType] = useState<"ur" | "category">("ur");
  const [category, setCategory] = useState("UR");
  const [gender, setGender] = useState("Co-ed");
  const [quota, setQuota] = useState("Home State");
  const [round, setRound] = useState<number>(1);
 
  // Output State
  const [predictions, setPredictions] = useState<any[]>([]);
  const [hasPredicted, setHasPredicted] = useState(false);
  const [filterChance, setFilterChance] = useState("All");
  const [filterBranch, setFilterBranch] = useState("All");
 
  const performPrediction = (
    type: "percentile" | "ugeac_rank" | "bcece_rank",
    pct: number | "",
    rk: number | "",
    cat: string,
    gen: string,
    rnd: number,
    rkType: "ur" | "category"
  ) => {
    let targetRank = 0;
    let estimatedUR = 0;
    
    // 1. Calculate General UR rank first
    if (type === "percentile") {
      const pctVal = Number(pct);
      if (isNaN(pctVal) || pctVal <= 0 || pctVal > 100) {
        alert("Please enter a valid percentile between 0 and 100");
        return;
      }
      
      estimatedUR = convertPercentileToUR(pctVal);
    } else {
      const rankVal = Number(rk);
      if (isNaN(rankVal) || rankVal <= 0) {
        alert("Please enter a valid rank number");
        return;
      }
      
      let baseRankVal = rankVal;
      if (type === "bcece_rank") {
        baseRankVal = Math.round(baseRankVal * 1.45); // convert BCECE to equivalent UGEAC rank
      }
 
      if (rkType === "category" && cat !== "UR") {
        // User entered Category Rank, convert to General UR rank
        const ratio = categoryRatios[cat] || 1.0;
        estimatedUR = Math.round(baseRankVal * ratio);
      } else {
        // User entered General UR Rank
        estimatedUR = baseRankVal;
      }
    }
 
    // 2. Convert estimatedUR to targetRank in category units to compare with database category cutoffs
    if (cat === "UR") {
      targetRank = estimatedUR;
    } else {
      const ratio = categoryRatios[cat] || 1.0;
      targetRank = Math.round(estimatedUR / ratio);
      targetRank = Math.max(1, targetRank);
    }

    const results: any[] = [];

    colleges.forEach((college) => {
      college.branches.forEach((branchCode) => {
        const cutoff2025 = getCutoff(college.code, branchCode, 2025, rnd, cat, gen);
        const cutoff2024 = getCutoff(college.code, branchCode, 2024, rnd, cat, gen);

        let chance: "High" | "Moderate" | "Low" = "Low";
        let chancePercentage = 10;

        const closing2025 = cutoff2025.closingRank;
        
        if (targetRank <= closing2025 * 0.85) {
          chance = "High";
          chancePercentage = Math.min(98, Math.round(98 - (targetRank / closing2025) * 15));
        } else if (targetRank <= closing2025 * 1.12) {
          chance = "Moderate";
          chancePercentage = Math.round(75 - ((targetRank - closing2025 * 0.85) / (closing2025 * 0.27)) * 25);
        } else {
          chance = "Low";
          chancePercentage = Math.max(8, Math.round(40 - (targetRank / closing2025) * 15));
        }

        results.push({
          college,
          branchCode,
          branchName: branchNames[branchCode] || branchCode,
          cutoff2025,
          cutoff2024,
          chance,
          chancePercentage,
          rankEntered: targetRank
        });
      });
    });

    results.sort((a, b) => {
      const chanceOrder: Record<string, number> = { High: 0, Moderate: 1, Low: 2 };
      if (chanceOrder[a.chance] !== chanceOrder[b.chance]) {
        return chanceOrder[a.chance] - chanceOrder[b.chance];
      }
      return a.college.established - b.college.established;
    });

    setPredictions(results);
    setHasPredicted(true);
  };

  // URL search parameter parsing effect
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const r = params.get("rank");
      const c = params.get("category");
      const p = params.get("percentile");
      const t = params.get("type");
      const g = params.get("gender") || "Co-ed";
      const rd = params.get("round") ? Number(params.get("round")) : 1;
      const rt = (params.get("rankType") as any) || "ur";

      let initialized = false;
      let initType = inputType;
      let initPercentile = percentile;
      let initRank = rank;
      let initCategory = category;
      let initGender = gender;
      let initRound = round;
      let initRankType = rankType;

      if (t === "percentile" || t === "ugeac_rank" || t === "bcece_rank") {
        setInputType(t);
        initType = t;
        initialized = true;
      }
      if (p) {
        const pNum = Number(p);
        setPercentile(pNum);
        initPercentile = pNum;
        initialized = true;
      }
      if (r) {
        const rNum = Number(r);
        setRank(rNum);
        initRank = rNum;
        initialized = true;
      }
      if (c) {
        setCategory(c);
        initCategory = c;
        initialized = true;
      }
      if (g) {
        setGender(g);
        initGender = g;
      }
      if (rd) {
        setRound(rd);
        initRound = rd;
      }
      if (rt === "ur" || rt === "category") {
        setRankType(rt);
        initRankType = rt;
      }

      if (initialized && colleges.length > 0) {
        setTimeout(() => {
          performPrediction(initType, initPercentile, initRank, initCategory, initGender, initRound, initRankType);
        }, 150);
      }
    }
  }, [colleges]);

  // Dynamic Real-time Rank Estimation calculations for the UI
  const getUIEstimatedRanks = () => {
    let estUR = 0;
    if (inputType === "percentile") {
      const pctVal = Number(percentile);
      if (pctVal > 0 && pctVal <= 100) {
        estUR = convertPercentileToUR(pctVal);
      }
    } else {
      const r = Number(rank);
      if (r > 0) {
        if (rankType === "category" && category !== "UR") {
          const multiplier = categoryRatios[category] || 1.0;
          estUR = Math.round(r * multiplier);
        } else {
          estUR = r;
        }
      }
    }
 
    if (estUR === 0) return null;
 
    let estCatRank = 0;
    let catLabel = "";
    const ratio = categoryRatios[category] || 1.0;
    estCatRank = Math.round(estUR / ratio);
    catLabel = `${category} Rank`;
    
    const equivUgeacUR = inputType === "bcece_rank" ? Math.round(estUR * 1.45) : estUR;
 
    return {
      ur: estUR,
      cat: Math.max(1, estCatRank),
      label: catLabel,
      equivUgeac: equivUgeacUR
    };
  };

  const uiRanks = getUIEstimatedRanks();

  const categories = [
    { code: "UR", name: "Unreserved (UR)" },
    { code: "BC", name: "Backward Class (BC)" },
    { code: "EBC", name: "Extremely Backward Class (EBC)" },
    { code: "SC", name: "Scheduled Caste (SC)" },
    { code: "ST", name: "Scheduled Tribe (ST)" },
    { code: "EWS", name: "Economically Weaker Section (EWS)" },
    { code: "RCG", name: "Reserved Category Girls (RCG)" }
  ];

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    performPrediction(inputType, percentile, rank, category, gender, round, rankType);
  };

  const handleSave = (pred: any) => {
    savePrediction({
      collegeName: pred.college.name,
      collegeCode: pred.college.code,
      branchName: pred.branchName,
      branchCode: pred.branchCode,
      category,
      rank: pred.rankEntered,
      chance: pred.chance
    });
  };

  const isBookmarked = (collegeCode: string, branchCode: string) => {
    return savedPredictions.some(
      (p) => p.collegeCode === collegeCode && p.branchCode === branchCode && p.rank === rank
    );
  };

  // Filter logic
  const filteredPredictions = predictions.filter((p) => {
    const matchChance = filterChance === "All" || p.chance === filterChance;
    const matchBranch = filterBranch === "All" || p.branchCode === filterBranch;
    return matchChance && matchBranch;
  });

  const getChanceBadge = (chance: "High" | "Moderate" | "Low") => {
    switch (chance) {
      case "High":
        return "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50";
      case "Moderate":
        return "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50";
      case "Low":
        return "bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800";
    }
  };

  // Extract unique branch options for filtering dropdown
  const uniqueBranches = Array.from(new Set(predictions.map((p) => p.branchCode)));

  const handlePrint = () => {
    window.print();
  };

  return (
    <AuthGate>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Print Stylesheet */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            /* Hide navbar, footer, form, buttons, header descriptions, filters */
            nav, footer, .no-print, button, select, input, .inline-flex, .bg-gradient-to-r, .text-center {
              display: none !important;
            }
            
            body, .max-w-7xl, .lg\\:col-span-8, .grid, .lg\\:col-span-12 {
              display: block !important;
              width: 100% !important;
              max-width: 100% !important;
              background: white !important;
              color: black !important;
              box-shadow: none !important;
              border: none !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            .lg\\:col-span-4 {
              display: none !important;
            }

            /* Optimized list layout for printing cards */
            .group {
              page-break-inside: avoid !important;
              border: 1px solid #cbd5e1 !important;
              background: white !important;
              border-radius: 12px !important;
              margin-bottom: 12px !important;
              padding: 16px !important;
              box-shadow: none !important;
              flex-direction: row !important;
              display: flex !important;
              align-items: center !important;
              justify-content: space-between !important;
            }

            .group img {
              display: none !important;
            }
          }
        `}} />

        {/* Print-only Official Header */}
        <div className="hidden print:block mb-6 border-b-2 border-slate-800 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">BiharEduConnect</h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Estimated Engineering Admission & Predictions Report</p>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-gray-400 block font-bold uppercase">Counselling Session</span>
              <strong className="text-sm font-extrabold text-slate-800 block">UGEAC/BCECE 2026</strong>
            </div>
          </div>
          
          {/* User Parameters Summary Box */}
          <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[9px] text-gray-450 block font-bold uppercase">Input Merit Type</span>
              <strong className="text-slate-800 font-extrabold">
                {inputType === "percentile" ? "JEE Percentile" : inputType === "ugeac_rank" ? "UGEAC State Rank" : "BCECE State Rank"}
              </strong>
            </div>
            <div>
              <span className="text-[9px] text-gray-455 block font-bold uppercase">Entered Score/Rank</span>
              <strong className="text-slate-800 font-extrabold">
                {inputType === "percentile" ? `${percentile}%` : rank}
              </strong>
            </div>
            <div>
              <span className="text-[9px] text-gray-455 block font-bold uppercase">Reservation Category</span>
              <strong className="text-slate-800 font-extrabold">{category}</strong>
            </div>
            <div>
              <span className="text-[9px] text-gray-455 block font-bold uppercase">Estimated UR Rank</span>
              <strong className="text-slate-800 font-extrabold">
                {uiRanks ? `~${uiRanks.ur.toLocaleString("en-IN")}` : "N/A"}
              </strong>
            </div>
          </div>
        </div>
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 relative">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 -z-10 h-[200px] w-[200px] rounded-full bg-[#FF9933]/5 blur-2xl"></div>
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF9933]/10 border border-[#FF9933]/20 text-[#FF9933] text-xs font-bold uppercase tracking-wider mb-3">
          <Compass className="w-3.5 h-3.5" />
          {inputType === "bcece_rank" ? "BCECE Merit Predictor" : "UGEAC Merit Predictor"}
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">
          Bihar Engineering <br />
          <span className="gradient-text-premium font-black">
            College Predictor
          </span>
        </h1>
        <p className="mt-3.5 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Enter your JEE Main / BCECE rank details below to discover which government engineering colleges and branches you can secure in Bihar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Panel */}
        <div className="lg:col-span-4">
          <div className="glass-card rounded-2xl p-6 shadow-lg lg:sticky lg:top-24 transition-all duration-300">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-slate-850">
              <SlidersHorizontal className="w-4.5 h-4.5 text-[#2563EB]" />
              Predictor Parameters
            </h2>

            <form onSubmit={handlePredict} className="space-y-4">
              {/* 1. Percentile / Rank Selector Tab */}
              <div className="flex p-0.5 bg-slate-100/50 dark:bg-slate-950/60 rounded-xl border border-gray-250/60 dark:border-slate-800/80 mb-3 w-full">
                <button
                  type="button"
                  onClick={() => setInputType("percentile")}
                  className={`flex-1 py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all duration-300 cursor-pointer ${
                    inputType === "percentile"
                      ? "bg-white dark:bg-slate-850 text-[#2563EB] dark:text-[#FF9933] shadow-md border-b-2 border-transparent"
                      : "text-gray-500 hover:text-slate-800 dark:hover:text-white"
                  }`}
                >
                  JEE Percentile
                </button>
                <button
                  type="button"
                  onClick={() => setInputType("ugeac_rank")}
                  className={`flex-1 py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all duration-300 cursor-pointer ${
                    inputType === "ugeac_rank"
                      ? "bg-white dark:bg-slate-850 text-[#2563EB] dark:text-[#FF9933] shadow-md border-b-2 border-transparent"
                      : "text-gray-500 hover:text-slate-800 dark:hover:text-white"
                  }`}
                >
                  UGEAC Rank
                </button>
                <button
                  type="button"
                  onClick={() => setInputType("bcece_rank")}
                  className={`flex-1 py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all duration-300 cursor-pointer ${
                    inputType === "bcece_rank"
                      ? "bg-white dark:bg-slate-850 text-[#2563EB] dark:text-[#FF9933] shadow-md border-b-2 border-transparent"
                      : "text-gray-500 hover:text-slate-800 dark:hover:text-white"
                  }`}
                >
                  BCECE Rank
                </button>
              </div>

              {/* 2. Conditionally Rendered Input Field */}
              {inputType === "percentile" ? (
                <div>
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">
                    JEE Main Percentile <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={percentile}
                    onChange={(e) => setPercentile(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 92.45"
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/60 dark:text-white rounded-xl focus:outline-none focus:border-[#FF9933] focus:ring-1 focus:ring-[#FF9933] transition-all font-semibold placeholder-slate-400 text-xs"
                  />
                  <p className="text-[9px] text-gray-450 dark:text-gray-500 mt-1.5 leading-relaxed font-medium">
                    Enter your percentile. The system will automatically estimate your UGEAC State Merit Rank using a high-precision curve model!
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 flex justify-between items-center">
                      <span>{inputType === "ugeac_rank" ? "UGEAC" : "BCECE"} Rank Type</span>
                      {category === "UR" && (
                        <span className="text-[9px] text-[#2563EB] font-bold lowercase tracking-wider bg-[#2563EB]/10 px-2 py-0.5 rounded">
                          Category is UR
                        </span>
                      )}
                    </label>
                    <div className="flex p-0.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-gray-200 dark:border-slate-800/80 mb-1 w-full">
                      <button
                        type="button"
                        onClick={() => setRankType("ur")}
                        className={`flex-1 py-1.5 text-[11px] rounded-lg font-bold transition-all duration-200 cursor-pointer ${
                          rankType === "ur"
                            ? "bg-white dark:bg-slate-800 text-[#2563EB] dark:text-[#FF9933] shadow-sm"
                            : "text-gray-400 hover:text-slate-700"
                        }`}
                      >
                        UR (General) Rank
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (category !== "UR") setRankType("category");
                        }}
                        className={`flex-1 py-1.5 text-[11px] rounded-lg font-bold transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                          rankType === "category" && category !== "UR"
                            ? "bg-white dark:bg-slate-800 text-[#2563EB] dark:text-[#FF9933] shadow-sm"
                            : "text-gray-400 hover:text-slate-700"
                        }`}
                        disabled={category === "UR"}
                        title={category === "UR" ? "Select a reservation category first to enter Category Rank" : ""}
                      >
                        Category Rank
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">
                      {rankType === "category" && category !== "UR" 
                        ? `${category} Category ${inputType === "ugeac_rank" ? "UGEAC" : "BCECE"} Rank` 
                        : `${inputType === "ugeac_rank" ? "UGEAC" : "BCECE"} General (UR) Rank`} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={rank}
                      onChange={(e) => setRank(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder={rankType === "category" && category !== "UR" ? "e.g. 350" : "e.g. 1500"}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/60 dark:text-white rounded-xl focus:outline-none focus:border-[#FF9933] focus:ring-1 focus:ring-[#FF9933] transition-all font-semibold placeholder-slate-400 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* 2.5 Real-time dynamic rank estimator preview panel */}
              {uiRanks && (
                <div className="p-3.5 bg-gradient-to-br from-blue-500/5 to-[#138808]/5 border border-[#2563EB]/15 dark:border-slate-800/80 rounded-2xl space-y-2.5 text-left transition-all duration-300 shadow-inner">
                  <span className="text-[9px] text-[#2563EB] dark:text-[#FF9933] font-extrabold uppercase tracking-widest block flex items-center gap-1">
                    🎯 Real-time Rank Estimations
                  </span>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2 bg-white/70 dark:bg-slate-950/80 border border-gray-100 dark:border-slate-850 rounded-xl">
                      <span className="text-[9px] text-gray-455 block font-bold uppercase tracking-wider">
                        {inputType === "bcece_rank" ? "BCECE UR Rank" : "Estimated UR Rank"}
                      </span>
                      <strong className="text-sm font-black text-slate-800 dark:text-white mt-0.5 block">
                        ~{uiRanks.ur.toLocaleString("en-IN")}
                      </strong>
                    </div>
                    <div className="p-2 bg-white/70 dark:bg-slate-950/80 border border-gray-100 dark:border-slate-850 rounded-xl">
                      <span className="text-[9px] text-gray-455 block font-bold uppercase tracking-wider">
                        {inputType === "bcece_rank" ? "Equivalent UGEAC UR" : uiRanks.label}
                      </span>
                      <strong className="text-sm font-black text-slate-800 dark:text-white mt-0.5 block">
                        ~{(inputType === "bcece_rank" ? uiRanks.equivUgeac : uiRanks.cat).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </div>
                  <p className="text-[9px] text-gray-400 mt-1 leading-normal font-medium">
                    {inputType === "bcece_rank"
                      ? "* Equivalent UGEAC UR calculated using historical BCECE vacancy and seat conversion ratios."
                      : "* Ratios calibrated using real UGEAC state merit samples: BC (2.72), EBC (3.54), SC (12.94), EWS (4.59), ST (45.0), RCG (7.89)."}
                  </p>
                </div>
              )}

              {/* 3. Category select */}
              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">
                  Reservation Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/60 dark:text-white rounded-xl focus:outline-none focus:border-[#FF9933] focus:ring-1 focus:ring-[#FF9933] transition-all font-semibold cursor-pointer text-xs"
                >
                  {categories.map((cat) => (
                    <option key={cat.code} value={cat.code}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Gender pool select */}
              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">
                  Gender Pool
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Co-ed", "Female"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all duration-300 cursor-pointer ${
                        gender === g
                          ? "bg-[#2563EB] border-[#2563EB] text-white shadow-md shadow-blue-500/10"
                          : "border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 bg-gray-50/20 dark:bg-slate-950/20"
                      }`}
                    >
                      {g === "Female" ? "Female (RCG Pool)" : "Co-ed Pool"}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Counselling Round selection */}
              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">
                  Counselling Round
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRound(r)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all duration-300 cursor-pointer ${
                        round === r
                          ? "bg-[#138808] border-[#138808] text-white shadow-md shadow-emerald-500/10"
                          : "border-gray-250 dark:border-slate-800 text-gray-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 bg-gray-50/20 dark:bg-slate-950/20"
                      }`}
                    >
                      Round {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Predict Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#FF9933] to-[#138808] text-white rounded-xl font-bold hover:shadow-lg shadow-[#138808]/15 transform hover:-translate-y-0.5 transition-all duration-350 flex items-center justify-center gap-2 cursor-pointer mt-6 btn-premium"
              >
                Predict My Colleges
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Output predictions */}
        <div className="lg:col-span-8">
          {/* Unpredicted placeholder state */}
          {!hasPredicted ? (
            <div className="h-full min-h-[400px] glass-card border border-dashed border-gray-300 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center p-8 text-center transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-radial-gradient from-blue-500/5 via-transparent to-transparent -z-10"></div>
              <div className="p-4 bg-white dark:bg-slate-850 rounded-2xl shadow-lg mb-4 text-[#FF9933] border border-gray-100 dark:border-slate-800 animate-float">
                <Compass className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Awaiting Prediction Inputs</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mt-2 leading-relaxed">
                Enter your ranks, reservation codes, and gender preferences on the left panel, and click predict to load engineering options.
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {/* Output Controls Bar */}
              <div className="glass-card rounded-2xl p-5 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-left">
                  <h3 className="font-extrabold text-slate-800 dark:text-white text-base">
                    Predictions Found ({filteredPredictions.length})
                  </h3>
                  <p className="text-[10px] text-gray-450 font-semibold mt-0.5">
                    Results calculated based on 2025 opening & closing UGEAC rounds.
                  </p>
                </div>

                <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  {/* Chance Filter */}
                  <select
                    value={filterChance}
                    onChange={(e) => setFilterChance(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 text-xs font-semibold border border-gray-250 dark:border-slate-800 rounded-xl bg-gray-50/50 dark:bg-slate-950/60 dark:text-white cursor-pointer focus:outline-none focus:border-[#FF9933]"
                  >
                    <option value="All">All Chances</option>
                    <option value="High">High Chance</option>
                    <option value="Moderate">Moderate Chance</option>
                    <option value="Low">Low Chance</option>
                  </select>

                  {/* Branch Filter */}
                  <select
                    value={filterBranch}
                    onChange={(e) => setFilterBranch(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 text-xs font-semibold border border-gray-255 dark:border-slate-800 rounded-xl bg-gray-50/50 dark:bg-slate-950/60 dark:text-white cursor-pointer focus:outline-none focus:border-[#FF9933]"
                  >
                    <option value="All">All Branches</option>
                    {uniqueBranches.map((br) => (
                      <option key={br} value={br}>
                        {br}
                      </option>
                    ))}
                  </select>

                  {/* Export Options */}
                  <div className="w-full sm:w-auto no-print">
                    <button
                      onClick={handlePrint}
                      className="w-full sm:w-auto px-4 py-2 border border-gray-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/60 hover:bg-[#2563EB] hover:text-white dark:hover:bg-[#2563EB] hover:border-transparent text-gray-600 dark:text-gray-300 cursor-pointer transition-all duration-300 flex items-center justify-center gap-1.5 text-xs font-extrabold shadow-sm hover:shadow-md hover-lift"
                      title="Print or Save PDF Report"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF Report</span>
                    </button>
                  </div>
                </div>
              </div>

              {filteredPredictions.length === 0 ? (
                <div className="p-12 text-center glass-card border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <h4 className="font-bold text-slate-800 dark:text-white">No Predictions Match Filters</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Try relaxing your filters or select "All Chances" to view remaining options.
                  </p>
                </div>
              ) : (
                /* Predictions List Grid */
                <div className="grid grid-cols-1 gap-4">
                  {filteredPredictions.map((pred, index) => {
                    const saved = isBookmarked(pred.college.code, pred.branchCode);
                    return (
                      <div
                        key={`${pred.college.code}-${pred.branchCode}-${index}`}
                        className="glass-card rounded-2xl p-5 shadow-sm hover-lift flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden group"
                      >
                        {/* Colored Left-border indicator based on chance */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                          pred.chance === "High" ? "bg-emerald-500" : pred.chance === "Moderate" ? "bg-amber-500" : "bg-slate-350 dark:bg-slate-700"
                        }`} />

                        {/* College and Course info */}
                        <div className="flex gap-4 items-start pl-1">
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-gray-350 mt-1 shadow-inner shrink-0 hidden sm:block border border-gray-100 dark:border-slate-800">
                            <Building className="w-5 h-5 text-[#2563EB]" />
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-400 font-extrabold tracking-widest uppercase flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#138808]" />
                              {pred.college.location}, Bihar (Estd {pred.college.established})
                            </span>
                            <h4 className="font-extrabold text-base text-slate-800 dark:text-white leading-snug group-hover:text-[#2563EB] transition-colors duration-300">
                              {pred.college.name}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                              Branch: <span className="text-[#FF9933]">{pred.branchName} ({pred.branchCode})</span>
                            </p>
                          </div>
                        </div>

                        {/* Cutoffs & Probability Details */}
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 self-stretch md:self-auto justify-between md:justify-end shrink-0 border-t border-dashed border-gray-150 dark:border-slate-800 pt-3 md:pt-0 md:border-0 mt-2 md:mt-0">
                          {/* Historical cutoffs */}
                          <div className="text-left md:text-right space-y-1">
                            <div className="text-[9px] text-gray-400 uppercase tracking-wider font-extrabold">
                              Closing Cutoff Ranks
                            </div>
                            <div className="flex gap-3 text-xs font-bold text-slate-700 dark:text-gray-300">
                              <span>2025: <strong className="text-slate-900 dark:text-white">{pred.cutoff2025.closingRank}</strong></span>
                              <span className="text-gray-300 dark:text-slate-800">|</span>
                              <span>2024: <strong className="text-slate-900 dark:text-white">{pred.cutoff2024.closingRank}</strong></span>
                            </div>
                          </div>

                          {/* Admission Odds Gauge */}
                          <div className="flex flex-col items-center">
                            <div className={`px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold ${getChanceBadge(pred.chance)}`}>
                              {pred.chance} Chance
                            </div>
                            <div className="w-16 bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  pred.chance === "High" ? "bg-emerald-500" : pred.chance === "Moderate" ? "bg-amber-500" : "bg-slate-400"
                                }`}
                                style={{ width: `${pred.chancePercentage}%` }}
                              />
                            </div>
                            <span className="text-[9px] text-gray-400 font-semibold mt-1">
                              Prob: {pred.chancePercentage}%
                            </span>
                          </div>

                          {/* Action Items */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSave(pred)}
                              className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                                saved
                                  ? "bg-[#138808]/15 border-[#138808]/20 text-[#138808]"
                                  : "border-gray-250 dark:border-slate-800 text-gray-400 hover:text-[#138808] hover:bg-slate-50 dark:hover:bg-slate-900 bg-gray-50/20 dark:bg-slate-950/10"
                              }`}
                              title={saved ? "Prediction Saved" : "Bookmark Prediction"}
                            >
                              {saved ? <Check className="w-4.5 h-4.5" /> : <Bookmark className="w-4.5 h-4.5 animate-pulse-subtle" />}
                            </button>
                            <Link
                              href={`/colleges/${pred.college.id}`}
                              className="p-2.5 border border-gray-250 dark:border-slate-800 text-gray-400 hover:text-[#2563EB] hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl bg-gray-50/20 dark:bg-slate-950/10 hover-lift"
                              title="View College Details"
                            >
                              <TrendingUp className="w-4.5 h-4.5 rotate-45" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  </AuthGate>
);
}
