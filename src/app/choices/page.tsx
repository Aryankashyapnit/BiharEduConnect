"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { AuthGate } from "../../components/AuthGate";
import { convertPercentileToUR, categoryRatios } from "../../data/cutoffs";
import { 
  Laptop, 
  Plus, 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  FileText, 
  MessageSquare, 
  Compass, 
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Info,
  UserCheck,
  Download
} from "lucide-react";

interface Choice {
  id: string;
  collegeName: string;
  collegeCode: string;
  branchName: string;
  branchCode: string;
  avgPackage: number;
}

export default function ChoiceSimulatorPage() {
  const { colleges, cutoffs, user } = useApp();

  const [choices, setChoices] = useState<Choice[]>([]);
  const [simCollegeId, setSimCollegeId] = useState("");
  const [simBranchName, setSimBranchName] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Personalized Counseling States
  const [percentileInput, setPercentileInput] = useState<number | "">(85);
  const [categoryInput, setCategoryInput] = useState("UR");
  const [genderInput, setGenderInput] = useState("Co-ed");

  // Sync with user context when loaded
  useEffect(() => {
    if (user && user.percentile) {
      setPercentileInput(user.percentile);
    }
  }, [user]);

  // Load initial choices from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bihareduconnect_mock_choices");
      if (stored) {
        try {
          setChoices(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse stored choices", e);
        }
      } else {
        // Default initial choices (Using exact database college codes so cutoff lookup matches)
        setChoices([
          { id: "choice-1", collegeName: "Muzaffarpur Institute of Technology", collegeCode: "MIT-MUZAFFARPUR", branchName: "CSE", branchCode: "CSE", avgPackage: 6.2 },
          { id: "choice-2", collegeName: "Bhagalpur College of Engineering", collegeCode: "BCE-BHAGALPUR", branchName: "CSE", branchCode: "CSE", avgPackage: 5.8 },
          { id: "choice-3", collegeName: "Muzaffarpur Institute of Technology", collegeCode: "MIT-MUZAFFARPUR", branchName: "ECE", branchCode: "ECE", avgPackage: 5.2 }
        ]);
      }
      setIsLoaded(true);
    }
  }, []);

  // Set default college and branch when colleges data loads
  useEffect(() => {
    if (colleges && colleges.length > 0 && !simCollegeId) {
      setSimCollegeId(colleges[0].id);
      setSimBranchName(colleges[0].branches[0] || "CSE");
    }
  }, [colleges, simCollegeId]);

  const saveToLocalStorage = (updatedChoices: Choice[]) => {
    setChoices(updatedChoices);
    if (typeof window !== "undefined") {
      localStorage.setItem("bihareduconnect_mock_choices", JSON.stringify(updatedChoices));
    }
  };

  const addChoice = () => {
    if (!simCollegeId || !simBranchName) return;
    const col = colleges.find(c => c.id === simCollegeId);
    if (!col) return;
    
    // Check if choice already exists
    const exists = choices.some(c => c.collegeCode === col.code && c.branchCode === simBranchName);
    if (exists) {
      alert("This college and branch combination is already in your preference list!");
      return;
    }

    const newChoice: Choice = {
      id: `choice-${Date.now()}`,
      collegeName: col.name,
      collegeCode: col.code,
      branchName: simBranchName,
      branchCode: simBranchName,
      avgPackage: col.averagePackage || 4.5
    };
    
    saveToLocalStorage([...choices, newChoice]);
  };

  const deleteChoice = (id: string) => {
    saveToLocalStorage(choices.filter(c => c.id !== id));
  };

  const moveChoice = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === choices.length - 1) return;
    
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const updated = [...choices];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    saveToLocalStorage(updated);
  };

  // Helper: Estimate UGEAC Rank from Percentile
  const getEstimatedRank = () => {
    const pctVal = Number(percentileInput);
    if (isNaN(pctVal) || pctVal <= 0 || pctVal > 100) return 1000;
    return convertPercentileToUR(pctVal);
  };
 
  const estimatedRank = getEstimatedRank();
 
  // Helper: Get Closing Cutoff Rank for a choice under chosen Category/Gender
  const getChoiceClosingRank = (choice: Choice) => {
    const ratio = categoryRatios[categoryInput] || 1.0;
    if (!cutoffs || cutoffs.length === 0) return Math.round(2000 / ratio);
    
    // Find matching cutoff row for 2025 (latest), Round 1, selected Category and Gender
    const match = cutoffs.find(
      c => c.collegeCode === choice.collegeCode && 
           c.branchCode === choice.branchCode && 
           c.year === 2025 && 
           c.round === 1 && 
           c.category === categoryInput
    );
    
    if (match) return match.closingRank;
 
    // Fallback general base calculation
    const baseRanks: Record<string, number> = {
      "MIT-MUZAFFARPUR": 240,
      "BCE-BHAGALPUR": 450,
      "BCE-BAKHTIYARPUR": 680,
      "GCE-GAYA": 850,
      "DCE-DARBHANGA": 920,
      "NCE-CHANDI": 980,
      "MCE-MOTIHARI": 1200,
      "GEC-JEHANABAD": 2200,
      "GEC-MUNGER": 2250
    };
    const base = baseRanks[choice.collegeCode] || 1500;
    return Math.round(base / ratio);
  };
 
  // Helper: Classify a choice relative to estimated rank
  const getChoiceClassification = (choice: Choice) => {
    const closingRank = getChoiceClosingRank(choice);
    const ratio = categoryRatios[categoryInput] || 1.0;
    const candidateCategoryRank = Math.round(estimatedRank / ratio);
    
    // If closing rank is significantly smaller than estimated rank, it's a dream
    if (closingRank < candidateCategoryRank * 0.85) {
      return { label: "Dream", style: "bg-red-500/10 text-red-600 border-red-500/20", icon: "🚀" };
    }
    // If closing rank is near estimated rank, it's realistic
    if (closingRank <= candidateCategoryRank * 1.35) {
      return { label: "Realistic", style: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: "🎯" };
    }
    // Otherwise, it's a safety backup
    return { label: "Safety", style: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: "🛡️" };
  };

  // Core Evaluation Engine
  const getChoiceQualityReport = () => {
    let score = 100;
    const blockingErrors: { index1: number; index2: number; c1: Choice; c2: Choice; r1: number; r2: number }[] = [];
    const warnings: string[] = [];
    const successes: string[] = [];
    
    let dreamCount = 0;
    let realisticCount = 0;
    let safetyCount = 0;

    if (!isLoaded || choices.length === 0) {
      return { 
        score: 0, 
        warnings: ["Add some choices to calculate preference sheet quality."], 
        successes: [], 
        blockingErrors: [],
        dreamCount: 0,
        realisticCount: 0,
        safetyCount: 0
      };
    }

    // 1. Length check
    if (choices.length < 5) {
      score -= 25;
      warnings.push("Too few choices: Add at least 5-10 options to safeguard against getting zero college allocations.");
    } else if (choices.length < 10) {
      score -= 10;
      warnings.push("Moderate risk: Listing under 10 choices increases slip-out risk. Try adding 3-5 more backup options.");
    } else {
      successes.push("Safe count: Your preference sheet contains a healthy number of choices.");
    }

    // 2. Classify list and compile counts
    choices.forEach(c => {
      const cls = getChoiceClassification(c);
      if (cls.label === "Dream") dreamCount++;
      else if (cls.label === "Realistic") realisticCount++;
      else safetyCount++;
    });

    // 3. Blocking Order Check (The critical check requested by user)
    // Checks if a student placed an easy-to-get college (high cutoff rank) above a hard-to-get college (low cutoff rank)
    const ratio = categoryRatios[categoryInput] || 1.0;
    const threshold = Math.round(250 / ratio);
    for (let i = 0; i < choices.length; i++) {
      const r1 = getChoiceClosingRank(choices[i]);
      for (let j = i + 1; j < choices.length; j++) {
        const r2 = getChoiceClosingRank(choices[j]);
        // If a choice placed higher (choice i) has a much larger closing rank (meaning it is significantly easier to get)
        // than a choice placed lower (choice j).
        if (r1 > r2 + threshold) {
          blockingErrors.push({
            index1: i,
            index2: j,
            c1: choices[i],
            c2: choices[j],
            r1,
            r2
          });
        }
      }
    }

    // Deduct points for blocking errors
    if (blockingErrors.length > 0) {
      // Deduct 15 points per blocking pair, max 45 points
      const deduction = Math.min(blockingErrors.length * 15, 45);
      score -= deduction;
      warnings.push(`Blocking Sequence Error: You placed an easier backup college above a highly competitive dream college. This blocks your dream options.`);
    } else {
      successes.push("Perfect Sequence: Choices are sorted correctly from most competitive to safe backup options.");
    }

    // 4. Mix balance checks
    if (choices.length > 0) {
      if (safetyCount === 0) {
        score -= 15;
        warnings.push("No Safety Backup: Add at least 2 safety colleges (closing rank > estimated rank) at the bottom to secure an allocation.");
      } else {
        successes.push(`Includes Safety: You have ${safetyCount} backup option(s) at the bottom of your sheet.`);
      }

      if (dreamCount === 0) {
        score -= 10;
        warnings.push("No Dream Choices: Add 2-3 highly competitive colleges at the very top. There is no risk in listing top-tier options first!");
      }
    }

    return {
      score: Math.max(score, 10),
      warnings,
      successes,
      blockingErrors,
      dreamCount,
      realisticCount,
      safetyCount
    };
  };

  const choiceReport = getChoiceQualityReport();

  // Counseling Bhaiya's Hinglish advice bubble
  const getCounsellingBhaiyaMessage = () => {
    if (choices.length === 0) {
      return "Arre! Pehle upper selector se kuch colleges aur engineering branches add karo preference list me, tab mai check karke guide karunga!";
    }

    if (choiceReport.blockingErrors.length > 0) {
      const firstError = choiceReport.blockingErrors[0];
      return `Galti pakdi gayi! 🛑 Aapne high cutoff rank wale college (${firstError.c1.collegeCode}) ko top preference me rakha hai aur aapse behtar placement wale college (${firstError.c2.collegeCode}) ko niche rakha hai. Bihar UGEAC me computer upper preferences ko pehle check karta hai. Agar aap dono ke liye qualify karenge, toh automatically aapko niche tier wala college mil jayega, aur behtar college lock ho jayega! Niche order adjust karein.`;
    }

    if (choiceReport.safetyCount === 0) {
      return `Risky List! ⚠️ Aapne rank #${estimatedRank} ke hisab se backup/safety colleges list me add nahi kiye hain. Agar category/cutoff fluctuations hui, toh Round 1 aur Round 2 me seat milna muskil ho jayega. Kuch district level safe GECs add karke unhe list ke niche rakhein!`;
    }

    if (choiceReport.dreamCount === 0) {
      return `Ek chota tip! 💡 Aapne sirf safe aur realistic options rakhein hain. Hamesha list ke starting me 3-4 dream colleges (jaise MIT Muzaffarpur, BCE Bhagalpur) jarur rakhein. Rank agar thodi kam bhi hai, fir bhi inko top me rakhne me koi nuksaan ya penalty nahi hai!`;
    }

    if (choices.length < 7) {
      return "Aapka sequence toh thik lag raha hai, par total choices thode kam hain. Kam se kam 8-12 preferences rakhein taaki counseling round slip-out ka risk bilkul zero ho jaye.";
    }

    return "Shabash! 🌟 Aapki choice sheet bilkul perfect hai. Aapne premium dream preferences ko upar rakha hai, beech me realistic matches hain, aur bottom me safe backup colleges hain. Is tarike se aapko aapke rank ke hisab se best available college mil jayega!";
  };

  return (
    <AuthGate>
      {/* Styles for print styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          nav, header, footer, .no-print {
            display: none !important;
          }
          #print-section {
            display: block !important;
          }
        }
      ` }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative no-print">
        {/* Floating Radial Mesh Blur Backgrounds */}
        <div className="absolute top-10 left-10 w-80 h-80 bg-[#FF9933]/5 rounded-full blur-3xl pointer-events-none animate-float" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#138808]/5 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: "-3s" }} />
        <div className="absolute bottom-10 left-1/4 w-72 h-72 bg-[#2563EB]/4 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: "-6s" }} />

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB]/10 dark:bg-[#2563EB]/20 text-[#2563EB] dark:text-[#60a5fa] text-xs font-bold uppercase tracking-wider mb-4 border border-[#2563EB]/20 shadow-sm animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            AI Choice-Locking Sheet Advisor
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-800 dark:text-white tracking-tight leading-none drop-shadow-sm">
            Mock Choice-Filling <span className="gradient-text-premium">Worksheet</span>
          </h1>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
            Create, re-order, and optimize your UGEAC college preference lock list. Our real-time AI counselor evaluates your preference list, flags blocking mistakes, and guides you to secure your best college seat.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          {/* Left Panel: Build Choice Sheet (Col-7) */}
          <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden group">
            <div className="space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-850 pb-3">
                <h3 className="text-md font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-[#2563EB]" /> Choice Entry Sheet
                </h3>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800/80 text-gray-500 dark:text-gray-400 px-2.5 py-0.5 rounded-full font-bold border border-slate-200/50 dark:border-slate-700/50">
                  {choices.length} choices listed
                </span>
              </div>

              {/* Add choice Form */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-slate-50/50 dark:bg-slate-900/30 border border-gray-200/50 dark:border-slate-800 rounded-2xl">
                <div className="sm:col-span-6">
                  <label className="block text-[9px] font-extrabold text-gray-400 dark:text-slate-550 uppercase tracking-widest mb-1.5">Select College</label>
                  <select
                    value={simCollegeId}
                    onChange={(e) => {
                      setSimCollegeId(e.target.value);
                      const col = colleges.find(c => c.id === e.target.value);
                      if (col && col.branches.length > 0) {
                        setSimBranchName(col.branches[0]);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2563EB] cursor-pointer"
                  >
                    {colleges && colleges.length > 0 ? (
                      colleges.map((col) => (
                        <option key={col.id} value={col.id}>{col.name} ({col.code})</option>
                      ))
                    ) : (
                      <option value="">No colleges loaded</option>
                    )}
                  </select>
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[9px] font-extrabold text-gray-400 dark:text-slate-550 uppercase tracking-widest mb-1.5">Select Branch</label>
                  <select
                    value={simBranchName}
                    onChange={(e) => setSimBranchName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2563EB] cursor-pointer"
                  >
                    {(() => {
                      const selectedCol = colleges.find(c => c.id === simCollegeId);
                      return selectedCol 
                        ? selectedCol.branches.map((b) => <option key={b} value={b}>{b}</option>)
                        : <option value="CSE">CSE</option>;
                    })()}
                  </select>
                </div>

                <div className="sm:col-span-2 flex items-end">
                  <button
                    type="button"
                    onClick={addChoice}
                    className="w-full py-2 bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white rounded-xl text-xs font-bold transition-all hover:shadow-md hover:shadow-[#2563EB]/15 cursor-pointer flex items-center justify-center gap-1 group"
                  >
                    <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" /> Add
                  </button>
                </div>
              </div>

              {/* Choices Table List */}
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {!isLoaded ? (
                  <div className="text-center py-12">
                    <span className="text-xs text-gray-450 animate-pulse">Loading mock preferences...</span>
                  </div>
                ) : choices.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-gray-200 dark:border-slate-800 rounded-2xl bg-white/20 dark:bg-slate-900/10">
                    <p className="text-xs text-gray-400 dark:text-gray-550">Your mock choice list is empty. Add engineering branches from the selector above!</p>
                  </div>
                ) : (
                  choices.map((c, idx) => {
                    const classification = getChoiceClassification(c);
                    return (
                      <div
                        key={c.id}
                        className="flex items-center justify-between p-3.5 bg-white/85 dark:bg-slate-900/60 border border-gray-150 dark:border-slate-800 rounded-xl hover:border-[#2563EB]/35 transition-all hover:shadow-sm"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-4">
                          <span className="h-5 w-5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-850 dark:text-gray-300 flex items-center justify-center text-[10px] font-black shrink-0">
                            {idx + 1}
                          </span>
                          <div className="min-w-0 text-left">
                            <span className="font-extrabold text-xs text-slate-800 dark:text-gray-200 truncate block leading-tight">
                              {c.collegeName} ({c.collegeCode})
                            </span>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[10px] text-[#FF9933] font-bold">
                                {c.branchName}
                              </span>
                              <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded border ${classification.style}`}>
                                {classification.icon} {classification.label}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons (Up, Down, Delete) */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => moveChoice(idx, "up")}
                            disabled={idx === 0}
                            className="btn-action-small p-1.5 border border-gray-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer flex items-center justify-center transition-all hover:text-emerald-500 hover:border-emerald-500/35 hover:bg-emerald-500/5 active:shadow-inner"
                          >
                            <ChevronUp className="w-3.5 h-3.5 text-gray-500 hover:text-emerald-500 transition-colors" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveChoice(idx, "down")}
                            disabled={idx === choices.length - 1}
                            className="btn-action-small p-1.5 border border-gray-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer flex items-center justify-center transition-all hover:text-blue-500 hover:border-blue-500/35 hover:bg-blue-500/5 active:shadow-inner"
                          >
                            <ChevronDown className="w-3.5 h-3.5 text-gray-500 hover:text-blue-500 transition-colors" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteChoice(c.id)}
                            className="btn-action-small p-1.5 border border-red-500/10 text-red-500 rounded-lg hover:bg-red-500/5 cursor-pointer flex items-center justify-center transition-all hover:text-red-600 hover:border-red-500/35"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Export actions at bottom */}
            {choices.length > 0 && (
              <div className="pt-6 mt-6 border-t border-gray-150 dark:border-slate-800/80 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const listText = choices.map((c, i) => `${i + 1}. ${c.collegeName} (${c.collegeCode}) - ${c.branchCode}`).join("\n");
                    const shareText = `Check out my Bihar UGEAC 2026 Choice Preference Lock List:\n\n${listText}\n\nAI Preference Quality Score: ${choiceReport.score}%\nCreate your custom preference worksheet on BiharEduConnect! 🚀`;
                    navigator.clipboard.writeText(shareText);
                    alert("✓ Mock Preference List copied to clipboard with AI Optimization details!");
                  }}
                  className="px-4 py-2.5 bg-slate-850 hover:bg-slate-900 hover:shadow-lg hover:shadow-slate-800/10 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-slate-750 group"
                >
                  <FileText className="w-4 h-4 text-gray-400 dark:text-slate-550 transition-transform duration-300 group-hover:scale-110" /> Copy Data
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-650 hover:from-red-600 hover:to-red-750 text-white rounded-xl text-xs font-bold transition-all hover:shadow-md hover:shadow-red-500/15 cursor-pointer flex items-center gap-1.5 border border-red-500/20 group"
                >
                  <Download className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" /> Download PDF
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const listText = choices.map((c, i) => `${i + 1}. ${c.collegeCode} - ${c.branchCode}`).join("\n");
                    const shareText = `Check out my Bihar UGEAC 2026 Choice Lock List:\n\n${listText}\n\nAI Quality Score: ${choiceReport.score}%\nCheck yours on BiharEduConnect!`;
                    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
                    window.open(waUrl, "_blank");
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-[#138808] to-[#0f7c05] hover:from-[#0f7c05] hover:to-[#0a5c03] text-white rounded-xl text-xs font-bold transition-all hover:shadow-md hover:shadow-emerald-600/10 cursor-pointer flex items-center gap-1.5 group"
                >
                  <MessageSquare className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" /> WhatsApp Share
                </button>
              </div>
            )}
          </div>

          {/* Right Panel: AI Preference Sheet Evaluation (Col-5) */}
          <div className="lg:col-span-5 space-y-6 no-print">
            
            {/* 1. Personalized Counseling Config Profile */}
            <div className="glass-card rounded-3xl p-6 shadow-xl text-left border border-[#2563EB]/10">
              <h3 className="text-xs font-extrabold text-[#2563EB] uppercase tracking-wider flex items-center gap-1.5 mb-4 border-b border-gray-100 dark:border-slate-800 pb-2">
                <UserCheck className="w-4 h-4" /> Counseling Profile Settings
              </h3>
              
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">JEE Main Percentile</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    max="100"
                    value={percentileInput} 
                    onChange={(e) => {
                      const val = e.target.value === "" ? "" : parseFloat(e.target.value);
                      if (val === "" || (!isNaN(val) && val >= 0 && val <= 100)) {
                        setPercentileInput(val);
                      }
                    }}
                    className="w-full px-2.5 py-1.5 border border-gray-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 dark:text-white rounded-xl text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">UGEAC Category</label>
                  <select 
                    value={categoryInput} 
                    onChange={(e) => setCategoryInput(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 dark:text-white rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="UR">UR (Unreserved)</option>
                    <option value="BC">BC (OBC-Backward Class)</option>
                    <option value="EBC">EBC (Extremely Backward)</option>
                    <option value="EWS">EWS (Economically Weaker)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="RCG">RCG (Girls Quota)</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 p-3 bg-[#2563EB]/5 rounded-2xl flex items-center justify-between border border-[#2563EB]/10">
                <div className="text-[10px] font-bold text-gray-500">Estimated State Merit Rank:</div>
                <div className="text-sm font-black text-[#2563EB]">UGEAC Rank #{estimatedRank}</div>
              </div>
            </div>

            {/* 2. AI Strength Analysis Health Meter */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563EB]/10 rounded-bl-full pointer-events-none" />
              
              <div className="space-y-6">
                <h3 className="text-md font-black text-slate-800 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#FF9933]" /> AI Preference Audit
                </h3>

                {/* Radial Score Dial */}
                <div className="flex flex-col items-center py-4 bg-slate-50/50 dark:bg-slate-900/30 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-inner relative">
                  <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-850 shadow-inner animate-float">
                    <div className="absolute inset-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-slate-850 dark:text-white leading-none">
                        {choiceReport.score}%
                      </span>
                      <span className="text-[6px] text-[#2563EB] font-black uppercase tracking-wider mt-0.5">Sheet Health</span>
                    </div>
                    {/* Gauge Ring */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="rgba(226, 232, 240, 0.4)" strokeWidth="5" fill="transparent" />
                      <circle
                        cx="48" cy="48" r="40"
                        stroke="url(#choiceDialGradient2)" strokeWidth="5" fill="transparent"
                        strokeDasharray="251"
                        strokeDashoffset={251 - (251 * choiceReport.score) / 100}
                        className="transition-all duration-500 ease-out"
                      />
                      <defs>
                        <linearGradient id="choiceDialGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FF9933" />
                          <stop offset="100%" stopColor="#138808" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  
                  {/* Distribution badges */}
                  <div className="flex items-center gap-2 mt-4 text-[9px] font-bold">
                    <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 border border-red-500/10">
                      Dream: {choiceReport.dreamCount}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/10">
                      Realistic: {choiceReport.realisticCount}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/10">
                      Safety: {choiceReport.safetyCount}
                    </span>
                  </div>
                </div>

                {/* 3. Counselling Bhaiya Hinglish Advisor Bubble */}
                <div className="p-4 bg-gradient-to-r from-amber-500/5 to-emerald-500/5 border border-amber-500/15 dark:border-emerald-500/10 rounded-2xl text-[11px] leading-relaxed relative">
                  <div className="flex items-center gap-1.5 mb-2 font-black text-slate-800 dark:text-white text-xs">
                    <span className="h-5 w-5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-[10px] shadow">🤖</span>
                    Counselling Bhaiya AI Guide
                  </div>
                  <p className="text-gray-650 dark:text-gray-300 font-bold italic">
                    "{getCounsellingBhaiyaMessage()}"
                  </p>
                </div>

                {/* 4. Warning/Success Logs list */}
                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-black text-gray-400 dark:text-slate-550 uppercase tracking-widest">Audit logs & warnings</h4>
                  
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    
                    {/* Critical Blocking Errors section */}
                    {choiceReport.blockingErrors.map((err, i) => (
                      <div key={`block-${i}`} className="p-3 bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-xl text-[10.5px] leading-relaxed">
                        <div className="flex items-center gap-1 text-red-600 font-black mb-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          CRITICAL BLOCKING MISTAKE
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 font-semibold">
                          Aapne high-cutoff college <strong className="text-slate-900 dark:text-white font-extrabold">#{err.index1 + 1} ({err.c1.collegeCode} - {err.c1.branchCode})</strong> ko behtar option <strong className="text-slate-900 dark:text-white font-extrabold">#{err.index2 + 1} ({err.c2.collegeCode} - {err.c2.branchCode})</strong> ke upar rakha hai.
                        </p>
                        <div className="mt-1.5 p-1.5 bg-red-500/10 text-red-700 rounded-lg font-bold text-[9.5px]">
                          💡 Solution: Move choice #{err.index2 + 1} above choice #{err.index1 + 1} to maximize placement package odds!
                        </div>
                      </div>
                    ))}

                    {choiceReport.warnings.map((warn, i) => (
                      <div key={`warn-${i}`} className="p-3 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/15 rounded-xl text-[10.5px] text-amber-600 dark:text-amber-500 font-semibold leading-relaxed flex gap-2 items-start">
                        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{warn}</span>
                      </div>
                    ))}
                    
                    {choiceReport.successes.map((succ, i) => (
                      <div key={`succ-${i}`} className="p-3 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15 rounded-xl text-[10.5px] text-[#138808] dark:text-[#22c55e] font-semibold leading-relaxed flex gap-2 items-start">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{succ}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-gray-150 dark:border-slate-800 text-[9px] text-gray-450 leading-normal">
                💡 <strong>Counseling Rule:</strong> Place your highest priority options at the very top. A higher-ranked preference in UGEAC choice entries secures seats with zero risk of penalty.
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* PDF Print Report Container */}
      <div id="print-section" className="hidden print:block p-8 bg-white text-black text-left font-sans">
        <div className="border-b-4 border-slate-900 pb-4 mb-6">
          <h1 className="text-xl font-black tracking-tight uppercase text-slate-900">BIHAR COMBINED ENTRANCE COMPETITIVE EXAMINATION BOARD</h1>
          <h2 className="text-sm font-bold text-slate-600 mt-0.5">UGEAC 2026 Counseling - Choice-Locking Sheet</h2>
          <div className="grid grid-cols-2 gap-4 mt-6 text-xs text-slate-850">
            <div><strong>Candidate Name:</strong> {user?.name || "Candidate"}</div>
            <div><strong>Estimated UGEAC Rank:</strong> #{estimatedRank}</div>
            <div><strong>Selected Category:</strong> {categoryInput}</div>
            <div><strong>Generated Date:</strong> {new Date().toLocaleDateString("en-IN")}</div>
          </div>
        </div>

        <table className="w-full border-collapse border border-slate-350 text-xs text-slate-800">
          <thead>
            <tr className="bg-slate-100 font-bold border-b border-slate-350 text-left">
              <th className="px-4 py-2.5 border-r border-slate-350 w-12 text-center">Pref #</th>
              <th className="px-4 py-2.5 border-r border-slate-350 w-32 text-center">College Code</th>
              <th className="px-4 py-2.5 border-r border-slate-350">College Name</th>
              <th className="px-4 py-2.5 border-r border-slate-350 w-36">Selected Branch</th>
              <th className="px-4 py-2.5 w-24 text-center">Category</th>
            </tr>
          </thead>
          <tbody>
            {choices.map((c, i) => (
              <tr key={c.id} className="border-b border-slate-350">
                <td className="px-4 py-2.5 border-r border-slate-350 text-center font-bold">{i + 1}</td>
                <td className="px-4 py-2.5 border-r border-slate-350 font-bold text-center">{c.collegeCode}</td>
                <td className="px-4 py-2.5 border-r border-slate-350 font-semibold text-slate-900">{c.collegeName}</td>
                <td className="px-4 py-2.5 border-r border-slate-350 font-bold text-[#FF9933]">{c.branchCode}</td>
                <td className="px-4 py-2.5 text-center font-semibold text-slate-600">{categoryInput}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-12 text-[10px] text-gray-500 border-t border-slate-200 pt-4 text-center leading-relaxed">
          <strong>Important Note:</strong> This is a reference preference sheet generated by BiharEduConnect's AI Advisor. 
          Ensure you fill these choices in the exact same sequence on the official UGEAC/BCECE portal. 
          Keep this sheet safe for reference during online choice locking.
        </div>
      </div>
    </AuthGate>
  );
}
