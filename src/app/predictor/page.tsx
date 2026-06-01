"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { getCutoff } from "../../data/cutoffs";
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
  const { colleges, savePrediction, savedPredictions } = useApp();

  // Form State
  const [rank, setRank] = useState<number | "">("");
  const [category, setCategory] = useState("UR");
  const [gender, setGender] = useState("Co-ed");
  const [quota, setQuota] = useState("Home State");

  // Output State
  const [predictions, setPredictions] = useState<any[]>([]);
  const [hasPredicted, setHasPredicted] = useState(false);
  const [filterChance, setFilterChance] = useState("All");
  const [filterBranch, setFilterBranch] = useState("All");

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
    if (!rank || rank <= 0) return;

    const results: any[] = [];

    // Predict across all colleges and branches
    colleges.forEach((college) => {
      college.branches.forEach((branchCode) => {
        // Fetch 2025 Round 1 Cutoff
        const cutoff2025 = getCutoff(college.code, branchCode, 2025, 1, category, gender);
        // Fetch 2024 Round 1 Cutoff
        const cutoff2024 = getCutoff(college.code, branchCode, 2024, 1, category, gender);

        let chance: "High" | "Moderate" | "Low" = "Low";
        let chancePercentage = 10;

        if (quota === "Other State") {
          // Bihar government colleges reserve 100% of seats for Home State candidates
          chance = "Low";
          chancePercentage = 5;
        } else {
          const closing2025 = cutoff2025.closingRank;
          
          if (rank <= closing2025 * 0.85) {
            chance = "High";
            chancePercentage = Math.min(98, Math.round(98 - (rank / closing2025) * 15));
          } else if (rank <= closing2025 * 1.12) {
            chance = "Moderate";
            chancePercentage = Math.round(75 - ((rank - closing2025 * 0.85) / (closing2025 * 0.27)) * 25);
          } else {
            chance = "Low";
            chancePercentage = Math.max(8, Math.round(40 - (rank / closing2025) * 15));
          }
        }

        results.push({
          college,
          branchCode,
          branchName: branchNames[branchCode] || branchCode,
          cutoff2025,
          cutoff2024,
          chance,
          chancePercentage,
          rankEntered: rank
        });
      });
    });

    // Sort predictions: High chance first, then by college establishment/popularity
    results.sort((a, b) => {
      const chanceOrder: Record<string, number> = { High: 0, Moderate: 1, Low: 2 };
      if (chanceOrder[a.chance] !== chanceOrder[b.chance]) {
        return chanceOrder[a.chance] - chanceOrder[b.chance];
      }
      return a.college.established - b.college.established; // older colleges first
    });

    setPredictions(results);
    setHasPredicted(true);
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
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF9933]/10 text-[#FF9933] text-xs font-bold uppercase tracking-wider mb-3">
          <Compass className="w-3.5 h-3.5" />
          UGEAC Merit Predictor
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Bihar Engineering <span className="bg-gradient-to-r from-[#FF9933] to-[#138808] bg-clip-text text-transparent">College Predictor</span>
        </h1>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
          Enter your JEE Main / BCECE rank details below to discover which government engineering colleges and branches you can secure in Bihar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Panel */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-250/70 dark:border-slate-800 p-6 shadow-md lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-[#2563EB]" />
              Predictor Parameters
            </h2>

            <form onSubmit={handlePredict} className="space-y-4">
              {/* 1. Rank input */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                  UGEAC State Merit Rank / BCECE Rank
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={rank}
                  onChange={(e) => setRank(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 1500"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 dark:text-white rounded-xl focus:outline-none focus:border-[#FF9933] font-semibold"
                />
              </div>

              {/* 2. Category select */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                  Reservation Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 dark:text-white rounded-xl focus:outline-none focus:border-[#FF9933] font-semibold"
                >
                  {categories.map((cat) => (
                    <option key={cat.code} value={cat.code}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Gender selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                  Gender Pool
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Co-ed", "Female"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-2 px-3 rounded-xl border text-sm font-bold transition-all ${
                        gender === g
                          ? "bg-[#2563EB] border-[#2563EB] text-white"
                          : "border-gray-250 dark:border-slate-800 text-gray-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {g === "Female" ? "Female (RCG Pool)" : "Co-ed Pool"}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Domicile selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                  Domicile Quota
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Home State", "Other State"].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQuota(q)}
                      className={`py-2 px-3 rounded-xl border text-sm font-bold transition-all ${
                        quota === q
                          ? "bg-[#138808] border-[#138808] text-white"
                          : "border-gray-250 dark:border-slate-800 text-gray-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {q === "Home State" ? "Bihar Domicile" : "Other State"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Predict Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#FF9933] to-[#138808] text-white rounded-xl font-bold hover:shadow-lg shadow-[#138808]/15 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-6"
              >
                Predict My Colleges
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {quota === "Other State" && (
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-600 leading-normal">
                  **Warning**: Government engineering colleges in Bihar allocate 100% B.Tech seats exclusively to Bihar Domicile students via UGEAC. Other State candidates are only eligible under vacant Institutional/Mop-up quotas.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Output predictions */}
        <div className="lg:col-span-8">
          {/* Unpredicted placeholder state */}
          {!hasPredicted ? (
            <div className="h-full min-h-[350px] bg-slate-50 dark:bg-slate-900/40 border border-dashed border-gray-300 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center">
              <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-md mb-4 text-[#FF9933]">
                <Compass className="w-10 h-10 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Awaiting Prediction Inputs</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mt-1">
                Enter your ranks, reservation codes, and gender preferences on the left panel, and click predict to load engineering options.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Output Controls Bar */}
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white">
                    Predictions Found ({filteredPredictions.length})
                  </h3>
                  <p className="text-xs text-gray-400">
                    Results calculated based on 2025 opening & closing UGEAC rounds.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Chance Filter */}
                  <select
                    value={filterChance}
                    onChange={(e) => setFilterChance(e.target.value)}
                    className="px-3 py-1.5 text-xs font-semibold border border-gray-200 dark:border-slate-800 rounded-lg bg-gray-50 dark:bg-slate-950 dark:text-white"
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
                    className="px-3 py-1.5 text-xs font-semibold border border-gray-200 dark:border-slate-800 rounded-lg bg-gray-50 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="All">All Branches</option>
                    {uniqueBranches.map((br) => (
                      <option key={br} value={br}>
                        {br}
                      </option>
                    ))}
                  </select>

                  {/* Print Report */}
                  <button
                    onClick={handlePrint}
                    className="p-2 border border-gray-200 dark:border-slate-800 rounded-lg bg-gray-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-500 hover:text-slate-850 dark:text-gray-400 dark:hover:text-white cursor-pointer transition-colors duration-200"
                    title="Export Report"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {filteredPredictions.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm">
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
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden group"
                      >
                        {/* Colored Left-border indicator based on chance */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                          pred.chance === "High" ? "bg-emerald-500" : pred.chance === "Moderate" ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-700"
                        }`} />

                        {/* College and Course info */}
                        <div className="flex gap-4 items-start pl-1">
                          <div className="p-2.5 rounded-xl bg-slate-55/70 dark:bg-slate-800 text-slate-600 dark:text-gray-300 mt-1 shadow-inner shrink-0 hidden sm:block">
                            <Building className="w-5 h-5 text-[#2563EB]" />
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#138808]" />
                              {pred.college.location}, Bihar (Estd {pred.college.established})
                            </span>
                            <h4 className="font-bold text-base text-slate-800 dark:text-white leading-snug group-hover:text-[#2563EB] transition-colors duration-200">
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
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                              Closing Cutoff Ranks
                            </div>
                            <div className="flex gap-3 text-xs font-bold text-slate-700 dark:text-gray-300">
                              <span>2025: <strong className="text-slate-900 dark:text-white">{pred.cutoff2025.closingRank}</strong></span>
                              <span className="text-gray-300 dark:text-slate-850">|</span>
                              <span>2024: <strong className="text-slate-900 dark:text-white">{pred.cutoff2024.closingRank}</strong></span>
                            </div>
                          </div>

                          {/* Admission Odds Gauge */}
                          <div className="flex flex-col items-center">
                            <div className={`px-2.5 py-1 rounded-full border text-[11px] font-bold ${getChanceBadge(pred.chance)}`}>
                              {pred.chance} Chance
                            </div>
                            <div className="w-16 bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
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
                              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                                saved
                                  ? "bg-[#138808]/15 border-[#138808]/20 text-[#138808]"
                                  : "border-gray-200 dark:border-slate-800 text-gray-400 hover:text-[#138808] hover:bg-slate-50 dark:hover:bg-slate-900"
                              }`}
                              title={saved ? "Prediction Saved" : "Bookmark Prediction"}
                            >
                              {saved ? <Check className="w-4.5 h-4.5" /> : <Bookmark className="w-4.5 h-4.5" />}
                            </button>
                            <Link
                              href={`/colleges/${pred.college.id}`}
                              className="p-2.5 border border-gray-200 dark:border-slate-800 text-gray-400 hover:text-[#2563EB] hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl"
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
