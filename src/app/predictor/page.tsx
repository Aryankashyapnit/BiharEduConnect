"use client";

import { CommunityComments } from "../../components/CommunityComments";
import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { getCutoff, getEstimatedCutoff, convertPercentileToUR, categoryRatios, cutoffsData, Cutoff } from "../../data/cutoffs";
import bcece2025Cutoffs from "../../data/bceceCutoffs2025.json";
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
  MapPin,
  Building,
  GraduationCap
} from "lucide-react";
import Link from "next/link";
import { AuthGate } from "../../components/AuthGate";

const localBranchNames: Record<string, string> = {
  ...branchNames,
  AG: "Agricultural Engineering"
};

// ==========================================
// UGEAC SPECIFIC HELPER FUNCTIONS
// ==========================================
const getBestCutoffForCategory = (
  collegeCode: string,
  branchCode: string,
  year: number,
  round: number,
  category: string,
  candidateGender: string
): Cutoff | null => {
  const matches = cutoffsData.filter(
    c =>
      c.collegeCode === collegeCode &&
      c.branchCode === branchCode &&
      c.year === year &&
      c.round === round &&
      c.category === category
  );

  if (matches.length === 0) {
    return null;
  }

  if (candidateGender === "Female") {
    let best = matches[0];
    for (const m of matches) {
      if (m.closingRank > best.closingRank) {
        best = m;
      }
    }
    return best;
  } else {
    const coedMatch = matches.find(m => m.gender === "Co-ed");
    return coedMatch || null;
  }
};

const evaluateChance = (rankVal: number, cutoff2025: Cutoff, cutoff2024: Cutoff) => {
  let chance: "High" | "Moderate" | "Low" = "Low";
  let chancePercentage = 10;

  const closing2025 = cutoff2025.closingRank;
  const closing2024 = cutoff2024.closingRank;

  const minClosing = Math.min(closing2025, closing2024);
  const avgClosing = Math.round((closing2025 + closing2024) / 2);
  const maxClosing = Math.max(closing2025, closing2024);

  if (rankVal <= minClosing * 0.95) {
    chance = "High";
    chancePercentage = Math.min(98, Math.round(98 - (rankVal / avgClosing) * 12));
  } else if (rankVal <= avgClosing * 1.05) {
    chance = "Moderate";
    chancePercentage = Math.round(75 - ((rankVal - minClosing * 0.95) / (avgClosing * 1.05 - minClosing * 0.95 + 1)) * 20);
  } else if (rankVal <= maxClosing * 1.15) {
    chance = "Low";
    chancePercentage = Math.max(15, Math.round(45 - ((rankVal - avgClosing * 1.05) / (maxClosing * 1.15 - avgClosing * 1.05 + 1)) * 25));
  } else {
    chance = "Low";
    chancePercentage = Math.max(5, Math.round(15 - (rankVal / maxClosing) * 5));
  }

  return { chance, chancePercentage };
};

// ==========================================
// BCECE SPECIFIC HELPER FUNCTIONS
// ==========================================
const getBestBceceCutoff = (
  collegeCode: string,
  branchCode: string,
  round: number,
  category: string,
  candidateGender: string
): any | null => {
  const matches = (bcece2025Cutoffs as any[]).filter(
    c =>
      c.collegeCode === collegeCode &&
      c.branchCode === branchCode &&
      c.round === round &&
      c.category === category
  );

  if (matches.length === 0) {
    return null;
  }

  if (candidateGender === "Female") {
    let best = matches[0];
    for (const m of matches) {
      if (m.closingRank > best.closingRank) {
        best = m;
      }
    }
    return best;
  } else {
    const coedMatch = matches.find(m => m.gender === "Co-ed");
    return coedMatch || null;
  }
};

const evaluateBceceChance = (rankVal: number, closing2025: number) => {
  let chance: "High" | "Moderate" | "Low" = "Low";
  let chancePercentage = 10;

  if (rankVal <= closing2025 * 0.90) {
    chance = "High";
    chancePercentage = Math.min(98, Math.round(98 - (rankVal / closing2025) * 15));
  } else if (rankVal <= closing2025 * 1.02) {
    chance = "Moderate";
    chancePercentage = Math.round(75 - ((rankVal - closing2025 * 0.90) / (closing2025 * 0.12 + 1)) * 25);
  } else if (rankVal <= closing2025 * 1.12) {
    chance = "Low";
    chancePercentage = Math.max(15, Math.round(45 - ((rankVal - closing2025 * 1.02) / (closing2025 * 0.10 + 1)) * 30));
  } else {
    chance = "Low";
    chancePercentage = Math.max(5, Math.round(15 - (rankVal / closing2025) * 5));
  }

  return { chance, chancePercentage };
};

export default function UnifiedCollegePredictor() {
  const { colleges: originalColleges, savePrediction, savedPredictions, user } = useApp();

  // Mode state: 'ugeac' | 'bcece'
  const [predictorMode, setPredictorMode] = useState<"ugeac" | "bcece">("ugeac");

  // Dynamically inject Agricultural College if missing
  const colleges = React.useMemo(() => {
    const list = [...originalColleges];
    if (!list.some(c => c.code === "CAE-ARA-BHOJPUR")) {
      list.push({
        id: "cae-ara-bhojpur",
        name: "College of Agricultural Engineering, Ara, Bhojpur",
        code: "CAE-ARA-BHOJPUR",
        location: "Ara",
        established: 2018,
        nirf: 300,
        averagePackage: 4.5,
        highestPackage: 8,
        tuitionFee: 10500,
        hostelAvailable: true,
        hostelFee: 12000,
        website: "https://www.caeara.org",
        description: "College of Agricultural Engineering, Ara, Bhojpur is a constituent college of Bihar Agricultural University, Sabour, Bhagalpur, established to offer professional education in agricultural engineering.",
        campusSize: "25 Acres",
        branches: ["AG"],
        recruits: ["TCS", "Mahindra", "Escorts", "VST Tillers"],
        image: "https://images.unsplash.com/photo-1595275372297-f51b446db67e?auto=format&fit=crop&w=600"
      });
    }
    return list;
  }, [originalColleges]);

  // ==========================================
  // SHARED & UGEAC FORM STATE
  // ==========================================

  const [urRank, setUrRank] = useState<number | "">("");
  const [categoryRank, setCategoryRank] = useState<number | "">("");
  const [rcgRank, setRcgRank] = useState<number | "">("");
  const [category, setCategory] = useState("UR");
  const [gender, setGender] = useState("Co-ed");
  const [round, setRound] = useState<number>(1);

  // Predictions output
  const [predictions, setPredictions] = useState<any[]>([]);
  const [hasPredicted, setHasPredicted] = useState(false);
  const [filterChance, setFilterChance] = useState("High");
  const [filterBranch, setFilterBranch] = useState("All");

  // ==========================================
  // RESET STATE ON MODE CHANGE
  // ==========================================
  useEffect(() => {
    setPredictions([]);
    setHasPredicted(false);
    setUrRank("");
    setCategoryRank("");
    setRcgRank("");
    setCategory("UR");
    setGender("Co-ed");
    setRound(1);
    setFilterChance("High");
    setFilterBranch("All");
  }, [predictorMode]);

  // Sync estimators for UGEAC
  const handleUrRankChangeUgeac = (val: number | "") => {
    setUrRank(val);
    if (val !== "") {
      if (category !== "UR") {
        setCategoryRank(Math.round(val / (categoryRatios[category] || 1.0)));
      }
      if (gender === "Female") {
        setRcgRank(Math.round(val / (categoryRatios["RCG"] || 1.0)));
      }
    } else {
      setCategoryRank("");
      setRcgRank("");
    }
  };

  const handleCategoryChangeUgeac = (newCat: string) => {
    setCategory(newCat);
    if (newCat === "UR") {
      setCategoryRank("");
    } else if (urRank !== "") {
      setCategoryRank(Math.round(Number(urRank) / (categoryRatios[newCat] || 1.0)));
    }
  };

  const handleGenderChangeUgeac = (newGender: string) => {
    setGender(newGender);
    if (newGender === "Female" && urRank !== "") {
      setRcgRank(Math.round(Number(urRank) / (categoryRatios["RCG"] || 1.0)));
    } else {
      setRcgRank("");
    }
  };

  // Sync inputs for BCECE
  const handleCategoryChangeBcece = (newCat: string) => {
    setCategory(newCat);
    if (newCat === "UR") {
      setCategoryRank("");
    }
  };

  const handleGenderChangeBcece = (newGender: string) => {
    setGender(newGender);
    if (newGender !== "Female") {
      setRcgRank("");
    }
  };

  // ==========================================
  // PREDICTION EXECUTION ENGINES
  // ==========================================
  const performUgeacPrediction = () => {
    let evaluatedUR = 0;
    let evaluatedCategory = 0;
    let evaluatedRCG = 0;

    const urVal = Number(urRank);
    if (isNaN(urVal) || urVal <= 0) {
      alert("Please enter a valid General UR rank");
      return;
    }
    evaluatedUR = urVal;

    if (category !== "UR") {
      const catVal = Number(categoryRank);
      if (isNaN(catVal) || catVal <= 0) {
        alert(`Please enter a valid ${category} Category rank`);
        return;
      }
      evaluatedCategory = catVal;
    }

    if (gender === "Female" && rcgRank !== "") {
      const rcgVal = Number(rcgRank);
      if (!isNaN(rcgVal) && rcgVal > 0) {
        evaluatedRCG = rcgVal;
      }
    }



    // Determine eligible categories
    const eligibleCategories = ["UR"];
    if (category !== "UR") {
      eligibleCategories.push(category);
    }
    if (gender === "Female" && category !== "UR" && evaluatedRCG > 0) {
      if (!eligibleCategories.includes("RCG")) {
        eligibleCategories.push("RCG");
      }
    }

    const results: any[] = [];

    colleges.forEach((college) => {
      college.branches.forEach((branchCode) => {
        const quotaPredictions: any[] = [];

        eligibleCategories.forEach((quotaCategory) => {
          const cutoff2025 = getBestCutoffForCategory(college.code, branchCode, 2025, round, quotaCategory, gender);
          const cutoff2024 = getBestCutoffForCategory(college.code, branchCode, 2024, round, quotaCategory, gender);

          if (!cutoff2025 && !cutoff2024) return;

          const valid2025 = cutoff2025 || getEstimatedCutoff(college.code, branchCode, 2025, round, quotaCategory, gender);
          const valid2024 = cutoff2024 || getEstimatedCutoff(college.code, branchCode, 2024, round, quotaCategory, gender);

          if (gender === "Co-ed" && (valid2025.gender === "Female" || valid2024.gender === "Female")) {
            return;
          }

          let rankToUse = evaluatedUR;
          if (quotaCategory === "RCG" || valid2025.gender === "Female" || valid2024.gender === "Female") {
            rankToUse = evaluatedRCG;
          } else if (quotaCategory === category && category !== "UR") {
            rankToUse = evaluatedCategory;
          }

          const { chance, chancePercentage } = evaluateChance(rankToUse, valid2025, valid2024);

          quotaPredictions.push({
            quotaCategory,
            cutoff2025: valid2025,
            cutoff2024: valid2024,
            chance,
            chancePercentage,
            rankUsed: rankToUse
          });
        });

        if (quotaPredictions.length === 0) return;

        let bestQuotaPred = quotaPredictions[0];
        const chancePriority: Record<string, number> = { High: 3, Moderate: 2, Low: 1 };

        quotaPredictions.forEach((pred) => {
          const currentBestPriority = chancePriority[bestQuotaPred.chance];
          const newPriority = chancePriority[pred.chance];
          if (newPriority > currentBestPriority) {
            bestQuotaPred = pred;
          } else if (newPriority === currentBestPriority) {
            if (pred.chancePercentage > bestQuotaPred.chancePercentage) {
              bestQuotaPred = pred;
            }
          }
        });

        results.push({
          college,
          branchCode,
          branchName: branchNames[branchCode] || branchCode,
          chance: bestQuotaPred.chance,
          chancePercentage: bestQuotaPred.chancePercentage,
          cutoff2025: bestQuotaPred.cutoff2025,
          cutoff2024: bestQuotaPred.cutoff2024,
          rankEntered: bestQuotaPred.rankUsed,
          quotaCategory: bestQuotaPred.quotaCategory,
          quotaPredictions
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

    const hasHigh = results.some((r) => r.chance === "High");
    const hasMod = results.some((r) => r.chance === "Moderate");
    if (hasHigh) {
      setFilterChance("High");
    } else if (hasMod) {
      setFilterChance("Moderate");
    } else {
      setFilterChance("Low");
    }
  };

  const performBcecePrediction = () => {
    const urVal = Number(urRank);
    if (isNaN(urVal) || urVal <= 0) {
      alert("Please enter a valid General UR rank");
      return;
    }

    if (category !== "UR") {
      const catVal = Number(categoryRank);
      if (isNaN(catVal) || catVal <= 0) {
        alert(`Please enter a valid ${category} Category rank`);
        return;
      }
    }

    if (gender === "Female" && rcgRank !== "") {
      const rcgVal = Number(rcgRank);
      if (isNaN(rcgVal) || rcgVal <= 0) {
        alert("Please enter a valid RCG rank");
        return;
      }
    }

    // Determine eligible categories
    const eligibleCategories = ["UR", "E-UR"];
    if (category !== "UR") {
      eligibleCategories.push(category);
      if (category === "SC") eligibleCategories.push("E-SC");
      if (category === "EBC") eligibleCategories.push("E-EBC");
      if (category === "BC") eligibleCategories.push("E-BC");
    }
    if (gender === "Female" && rcgRank !== "") {
      eligibleCategories.push("RCG");
      eligibleCategories.push("E-RCG");
    }

    const results: any[] = [];

    colleges.forEach((college) => {
      college.branches.forEach((branchCode) => {
        const quotaPredictions: any[] = [];

        eligibleCategories.forEach((quotaCategory) => {
          const cutoff2025 = getBestBceceCutoff(college.code, branchCode, round, quotaCategory, gender);

          if (!cutoff2025) return;

          if (gender === "Co-ed" && cutoff2025.gender === "Female") {
            return;
          }

          let rankToUse = urVal;
          if (quotaCategory === "RCG" || quotaCategory === "E-RCG") {
            rankToUse = Number(rcgRank) || urVal;
          } else if (quotaCategory !== "UR" && quotaCategory !== "E-UR") {
            rankToUse = Number(categoryRank) || urVal;
          }

          const { chance, chancePercentage } = evaluateBceceChance(rankToUse, cutoff2025.closingRank);

          quotaPredictions.push({
            quotaCategory,
            cutoff2025,
            chance,
            chancePercentage,
            rankUsed: rankToUse
          });
        });

        if (quotaPredictions.length === 0) return;

        let bestQuotaPred = quotaPredictions[0];
        const chancePriority: Record<string, number> = { High: 3, Moderate: 2, Low: 1 };

        quotaPredictions.forEach((pred) => {
          const currentBestPriority = chancePriority[bestQuotaPred.chance];
          const newPriority = chancePriority[pred.chance];
          if (newPriority > currentBestPriority) {
            bestQuotaPred = pred;
          } else if (newPriority === currentBestPriority) {
            if (pred.chancePercentage > bestQuotaPred.chancePercentage) {
              bestQuotaPred = pred;
            }
          }
        });

        results.push({
          college,
          branchCode,
          branchName: localBranchNames[branchCode] || branchCode,
          chance: bestQuotaPred.chance,
          chancePercentage: bestQuotaPred.chancePercentage,
          cutoff2025: bestQuotaPred.cutoff2025,
          rankEntered: bestQuotaPred.rankUsed,
          quotaCategory: bestQuotaPred.quotaCategory,
          quotaPredictions
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

    const hasHigh = results.some((r) => r.chance === "High");
    const hasMod = results.some((r) => r.chance === "Moderate");
    if (hasHigh) {
      setFilterChance("High");
    } else if (hasMod) {
      setFilterChance("Moderate");
    } else {
      setFilterChance("Low");
    }
  };

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    if (predictorMode === "ugeac") {
      performUgeacPrediction();
    } else {
      performBcecePrediction();
    }
  };

  const handleSave = (pred: any) => {
    const displayCategory = predictorMode === "bcece" ? `${category} (BCECE)` : category;
    savePrediction({
      collegeName: pred.college.name,
      collegeCode: pred.college.code,
      branchName: pred.branchName,
      branchCode: pred.branchCode,
      category: displayCategory,
      rank: Number(urRank),
      chance: pred.chance
    });
  };

  const isBookmarked = (collegeCode: string, branchCode: string) => {
    return savedPredictions.some(
      (p) => p.collegeCode === collegeCode && p.branchCode === branchCode && p.rank === Number(urRank)
    );
  };

  // Filter Logic
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

  const uniqueBranches = Array.from(new Set(predictions.map((p) => p.branchCode)));

  const handlePrint = () => {
    window.print();
  };

  const categoriesUgeac = [
    { code: "UR", name: "Unreserved (UR)" },
    { code: "BC", name: "Backward Class (BC)" },
    { code: "EBC", name: "Extremely Backward Class (EBC)" },
    { code: "SC", name: "Scheduled Caste (SC)" },
    { code: "ST", name: "Scheduled Tribe (ST)" },
    { code: "EWS", name: "Economically Weaker Section (EWS)" },
    { code: "RCG", name: "Reserved Category Girls (RCG)" }
  ];

  const categoriesBcece = [
    { code: "UR", name: "Unreserved (UR)" },
    { code: "BC", name: "Backward Class (BC)" },
    { code: "EBC", name: "Extremely Backward Class (EBC)" },
    { code: "SC", name: "Scheduled Caste (SC)" },
    { code: "ST", name: "Scheduled Tribe (ST)" },
    { code: "EWS", name: "Economically Weaker Section (EWS)" },
    { code: "DQ", name: "Disabled Quota (DQ)" },
    { code: "SMQ", name: "Servicemen Quota (SMQ)" }
  ];

  return (
    <AuthGate>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Print Stylesheet */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            nav, footer, .no-print, button, select, input {
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

        {/* Print Header */}
        <div className="hidden print:block mb-6 border-b-2 border-slate-800 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">BiharEduConnect</h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                {predictorMode === "ugeac" ? "Official UGEAC Admission Predictions Report" : "Official BCECE Admission Predictions Report"}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-gray-400 block font-bold uppercase">Counselling Session</span>
              <strong className="text-sm font-extrabold text-slate-800 block">
                {predictorMode === "ugeac" ? "UGEAC 2026" : "BCECE 2025 Cutoffs Base"}
              </strong>
            </div>
          </div>
          <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[9px] text-gray-400 block font-bold uppercase">General UR Rank</span>
              <strong className="text-slate-800 font-extrabold">{urRank}</strong>
            </div>
            <div>
              <span className="text-[9px] text-gray-400 block font-bold uppercase">Category</span>
              <strong className="text-slate-800 font-extrabold">{category}</strong>
            </div>
            {category !== "UR" && (
              <div>
                <span className="text-[9px] text-gray-400 block font-bold uppercase">Category Rank</span>
                <strong className="text-slate-800 font-extrabold">{categoryRank}</strong>
              </div>
            )}
            {gender === "Female" && rcgRank !== "" && (
              <div>
                <span className="text-[9px] text-gray-400 block font-bold uppercase">RCG Rank</span>
                <strong className="text-slate-800 font-extrabold">{rcgRank}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 relative no-print">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 -z-10 h-[200px] w-[200px] rounded-full bg-[#2563EB]/5 blur-2xl"></div>
          
          {/* Predictor Mode Tabs */}
          <div className="inline-flex items-center gap-1.5 p-1 bg-slate-100/80 dark:bg-slate-900/80 border border-gray-250/20 dark:border-slate-800/30 rounded-2xl mb-6 no-print shadow-sm">
            <button
              onClick={() => setPredictorMode("ugeac")}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                predictorMode === "ugeac"
                  ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/15"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-slate-200"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              UGEAC Predictor
            </button>
            <button
              onClick={() => setPredictorMode("bcece")}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                predictorMode === "bcece"
                  ? "bg-[#138808] text-white shadow-md shadow-emerald-500/15"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-slate-200"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              BCECE Predictor
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">
            Bihar Engineering <br />
            <span className="gradient-text-premium font-black">
              {predictorMode === "ugeac" ? "UGEAC College Predictor" : "BCECE College Predictor"}
            </span>
          </h1>
          <p className="mt-3.5 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {predictorMode === "ugeac"
              ? "Enter your UGEAC state rank card details to discover government engineering colleges in Bihar."
              : "Discover your chances of admission in government engineering and agricultural colleges based on official parsed BCECE ranks."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Parameter Form */}
          <div className="lg:col-span-4 no-print">
            <div className="glass-card rounded-2xl p-6 shadow-lg lg:sticky lg:top-24 transition-all duration-300">
              <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-slate-850">
                <SlidersHorizontal className={`w-4.5 h-4.5 ${predictorMode === "ugeac" ? "text-[#2563EB]" : "text-[#138808]"}`} />
                Predictor Parameters
              </h2>

              <form onSubmit={handlePredict} className="space-y-4">
                {/* 1. Ranks Entry */}
                <div className="space-y-3.5">
                  {/* General Rank input (Common, but labeled differently) */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-gray-550 uppercase tracking-wider mb-1.5">
                      {predictorMode === "ugeac" ? "UGEAC General (UR) Rank" : "BCECE General (UR) Rank"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={urRank}
                      onChange={(e) => {
                        const val = e.target.value === "" ? "" : Number(e.target.value);
                        if (predictorMode === "ugeac") {
                          handleUrRankChangeUgeac(val);
                        } else {
                          setUrRank(val);
                        }
                      }}
                      placeholder="e.g. 1500"
                      className={`w-full px-4 py-2.5 border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/60 dark:text-white rounded-xl focus:outline-none focus:ring-1 transition-all font-semibold placeholder-slate-400 text-xs ${
                        predictorMode === "ugeac" ? "focus:border-[#2563EB] focus:ring-[#2563EB]" : "focus:border-[#138808] focus:ring-[#138808]"
                      }`}
                    />
                  </div>

                  {/* Category Rank input (Shared, shown if category != UR) */}
                  {category !== "UR" && (
                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">
                        {category} Category Rank <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={categoryRank}
                        onChange={(e) => setCategoryRank(e.target.value === "" ? "" : Number(e.target.value))}
                        placeholder={`Enter your ${category} rank`}
                        className={`w-full px-4 py-2.5 border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/60 dark:text-white rounded-xl focus:outline-none focus:ring-1 transition-all font-semibold placeholder-slate-400 text-xs ${
                          predictorMode === "ugeac" ? "focus:border-[#2563EB] focus:ring-[#2563EB]" : "focus:border-[#138808] focus:ring-[#138808]"
                        }`}
                      />
                    </div>
                  )}

                  {/* RCG Rank (Female Rank, conditionally optional) */}
                  {gender === "Female" && (
                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 flex justify-between">
                        <span>RCG Rank (Female Rank)</span>
                        <span className="text-[9px] text-[#138808] font-bold">Optional</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={rcgRank}
                        onChange={(e) => setRcgRank(e.target.value === "" ? "" : Number(e.target.value))}
                        placeholder="e.g. 500"
                        className={`w-full px-4 py-2.5 border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/60 dark:text-white rounded-xl focus:outline-none focus:ring-1 transition-all font-semibold placeholder-slate-400 text-xs ${
                          predictorMode === "ugeac" ? "focus:border-[#2563EB] focus:ring-[#2563EB]" : "focus:border-[#138808] focus:ring-[#138808]"
                        }`}
                      />
                    </div>
                  )}
                </div>

                {/* 3. Category Select */}
                <div>
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">
                    Reservation Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      if (predictorMode === "ugeac") {
                        handleCategoryChangeUgeac(e.target.value);
                      } else {
                        handleCategoryChangeBcece(e.target.value);
                      }
                    }}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/60 dark:text-white rounded-xl focus:outline-none focus:border-slate-300 transition-all font-semibold cursor-pointer text-xs"
                  >
                    {(predictorMode === "ugeac" ? categoriesUgeac : categoriesBcece).map((cat) => (
                      <option key={cat.code} value={cat.code}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Gender Pool */}
                <div>
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">
                    Gender Pool
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Co-ed", "Female"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => {
                          if (predictorMode === "ugeac") {
                            handleGenderChangeUgeac(g);
                          } else {
                            handleGenderChangeBcece(g);
                          }
                        }}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all duration-300 cursor-pointer ${
                          gender === g
                            ? (predictorMode === "ugeac" 
                                ? "bg-[#2563EB] border-[#2563EB] text-white shadow-md shadow-blue-500/10" 
                                : "bg-[#138808] border-[#138808] text-white shadow-md shadow-emerald-500/10")
                            : "border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 bg-gray-50/20 dark:bg-slate-950/20"
                        }`}
                      >
                        {g === "Female" ? "Female (RCG Pool)" : "Co-ed Pool"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Counselling Round */}
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
                            ? "bg-slate-800 dark:bg-slate-200 border-slate-800 dark:border-slate-200 text-white dark:text-slate-900 shadow-sm"
                            : "border-gray-250 dark:border-slate-800 text-gray-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 bg-gray-50/20 dark:bg-slate-950/20"
                        }`}
                      >
                        Round {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full mt-4 py-3 bg-gradient-to-r from-[#FF9933] to-[#138808] hover:scale-[1.01] transition-all duration-300 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer btn-premium animate-bounce-subtle"
                >
                  Discover Admission Chances
                  <ArrowRight className="w-4.5 h-4.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Prediction Results */}
          <div className="lg:col-span-8">
            {!hasPredicted ? (
              <div className="glass-card rounded-2xl p-10 py-16 text-center border-dashed border-2 border-gray-200 dark:border-slate-850 flex flex-col items-center justify-center shadow-md h-full min-h-[400px]">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 animate-pulse ${
                  predictorMode === "ugeac" ? "bg-[#2563EB]/10" : "bg-[#138808]/10"
                }`}>
                  <Compass className={`w-8 h-8 ${predictorMode === "ugeac" ? "text-[#2563EB]" : "text-[#138808]"}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Awaiting Input Parameters</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 max-w-sm leading-relaxed">
                  Enter your General (UR) and Category rank details in the parameter panel to discover available B.Tech branches and agriculture seats matching your ranks.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Result Summary Banner */}
                <div className={`glass-card rounded-2xl p-5 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print bg-white/40 dark:bg-slate-950/40 border-l-4 ${
                  predictorMode === "ugeac" ? "border-l-[#2563EB]" : "border-l-[#138808]"
                }`}>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                      Found {predictions.length} Available Choices
                    </h3>
                    <p className="text-[11px] text-gray-400 font-semibold mt-1">
                      {predictorMode === "ugeac"
                        ? `Results calculated based on multi-year 2024 & 2025 UGEAC rounds.`
                        : `Results calculated based on official Round ${round} cutoffs from BCECE 2025.`}
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={handlePrint}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 transition cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      Print / Save PDF
                    </button>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-gray-150/40 dark:border-slate-800/50 no-print">
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                    {["High", "Moderate", "Low", "All"].map((lvl) => {
                      const count = lvl === "All" 
                        ? predictions.length 
                        : predictions.filter(p => p.chance === lvl).length;
                      return (
                        <button
                          key={lvl}
                          onClick={() => setFilterChance(lvl)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                            filterChance === lvl
                              ? "bg-white dark:bg-slate-950 text-[#138808] shadow-sm"
                              : "text-gray-500 hover:text-gray-800 dark:hover:text-slate-200"
                          }`}
                        >
                          {lvl} Chance ({count})
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      Branch:
                    </label>
                    <select
                      value={filterBranch}
                      onChange={(e) => setFilterBranch(e.target.value)}
                      className="px-3 py-1.5 border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white rounded-lg text-xs font-bold focus:outline-none cursor-pointer w-full sm:w-auto"
                    >
                      <option value="All">All Branches</option>
                      {uniqueBranches.map((code) => (
                        <option key={code} value={code}>
                          {localBranchNames[code] || code}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Results Listing */}
                {filteredPredictions.length === 0 ? (
                  <div className="glass-card rounded-2xl p-10 text-center flex flex-col items-center justify-center border border-gray-150 dark:border-slate-800 shadow-md">
                    <AlertTriangle className="w-10 h-10 text-amber-500 mb-3" />
                    <h4 className="font-bold text-slate-800 dark:text-white">No Matching Choices Found</h4>
                    <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">
                      No options matching a "{filterChance}" chance were found in this selection. Try selecting "All" or adjusting input ranks.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPredictions.map((pred, i) => {
                      const college = pred.college;
                      const hasSaved = isBookmarked(college.code, pred.branchCode);
                      return (
                        <div
                          key={`${college.code}-${pred.branchCode}-${i}`}
                          className="group glass-card rounded-2xl border border-gray-200/50 dark:border-slate-850/80 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-5 p-5 bg-white/20 dark:bg-slate-950/20"
                        >
                          <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                            pred.chance === "High" ? "bg-emerald-500" : pred.chance === "Moderate" ? "bg-amber-500" : "bg-slate-350 dark:bg-slate-700"
                          }`} />

                          <div className="flex gap-4 items-center pl-1">
                            {college.image && (
                              <img
                                src={college.image}
                                alt={college.name}
                                className="w-16 h-16 rounded-xl object-cover border border-gray-100 dark:border-slate-800 hidden sm:block shadow-sm group-hover:scale-105 transition duration-500"
                              />
                            )}
                            <div className="space-y-1.5">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/30">
                                {localBranchNames[pred.branchCode] || pred.branchCode}
                              </span>
                              <h3 className="text-sm font-black text-slate-850 dark:text-white leading-snug group-hover:text-[#138808] transition duration-300">
                                {college.name}
                              </h3>
                              <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[11px] text-gray-550 font-bold">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                  {college.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Building className="w-3.5 h-3.5 text-gray-400" />
                                  Est. {college.established}
                                </span>
                              </div>

                              {/* Quotas breakdown chips on card */}
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {pred.quotaPredictions?.map((qp: any, qIdx: number) => (
                                  <span
                                    key={qIdx}
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                                      qp.quotaCategory === pred.quotaCategory 
                                        ? (predictorMode === "ugeac" ? "bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/25" : "bg-[#138808]/10 text-[#138808] border-[#138808]/25")
                                        : "bg-slate-50 dark:bg-slate-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-slate-800"
                                    }`}
                                    title={`Rank used: ${qp.rankUsed} | 2025 Closing: ${qp.cutoff2025.closingRank}`}
                                  >
                                    <span className="font-extrabold uppercase">
                                      {qp.quotaCategory}{qp.cutoff2025.gender === "Female" ? " (FEMALE)" : ""}:
                                    </span>
                                    <span>{qp.chance} ({qp.chancePercentage}%)</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Chance & Cutoff details area */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 sm:gap-2.5 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100 dark:border-slate-850 shrink-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${getChanceBadge(
                                  pred.chance
                                )}`}
                              >
                                {pred.chance} Chance
                              </span>
                              <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                                {pred.chancePercentage}%
                              </span>
                            </div>

                            {/* Cutoff Details */}
                            {predictorMode === "ugeac" ? (
                              <div className="text-[11px] text-gray-550 dark:text-gray-450 font-bold text-left sm:text-right">
                                Closing Cutoffs ({pred.quotaCategory}):
                                <div className="flex gap-2 text-xs mt-0.5 font-bold text-slate-700 dark:text-gray-300 justify-start sm:justify-end">
                                  <span>2025: <strong className="text-slate-900 dark:text-white">{pred.cutoff2025.closingRank}</strong></span>
                                  <span className="text-gray-300 dark:text-slate-800">|</span>
                                  <span>2024: <strong className="text-slate-900 dark:text-white">{pred.cutoff2024.closingRank}</strong></span>
                                </div>
                              </div>
                            ) : (
                              <div className="text-[11px] text-gray-550 dark:text-gray-450 font-bold text-left sm:text-right">
                                2025 Closing:{" "}
                                <strong className="text-slate-800 dark:text-slate-200 font-black">
                                  {pred.cutoff2025.closingRank.toLocaleString("en-IN")}
                                </strong>{" "}
                                <span className="text-[10px] text-gray-400 block sm:inline sm:ml-1 font-semibold">
                                  (via {pred.quotaCategory})
                                </span>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 no-print self-end sm:self-auto">
                              <button
                                onClick={() => handleSave(pred)}
                                disabled={hasSaved}
                                className={`p-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                                  hasSaved
                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                    : "border-gray-200 dark:border-slate-800 text-gray-400 hover:text-[#138808] hover:bg-slate-50 dark:hover:bg-slate-850"
                                }`}
                                title={hasSaved ? "Prediction Saved to Dashboard" : "Bookmark Prediction"}
                              >
                                {hasSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                              </button>
                              <Link
                                href={`/colleges/${college.id}`}
                                className="p-2 border border-gray-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-gray-400 hover:text-[#2563EB] rounded-xl transition cursor-pointer"
                                title="View College Details"
                              >
                                <Building className="w-4 h-4" />
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

        {/* Community Discussion */}
        <div className="mt-16 no-print">
          <CommunityComments pageId="predictor" title="Predictor Discussion" />
        </div>
      </div>
    </AuthGate>
  );
}
