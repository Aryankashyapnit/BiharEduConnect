"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { AuthGate } from "../../components/AuthGate";
import { 
  Laptop, 
  Plus, 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  FileText, 
  MessageSquare, 
  Compass, 
  Sparkles 
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
  const { colleges } = useApp();

  const [choices, setChoices] = useState<Choice[]>([]);
  const [simCollegeId, setSimCollegeId] = useState("");
  const [simBranchName, setSimBranchName] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

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
        // Default initial choices
        setChoices([
          { id: "choice-1", collegeName: "Muzaffarpur Institute of Technology", collegeCode: "MIT-MUZ", branchName: "CSE", branchCode: "CSE", avgPackage: 6.2 },
          { id: "choice-2", collegeName: "Bhagalpur College of Engineering", collegeCode: "BCE-BHG", branchName: "CSE", branchCode: "CSE", avgPackage: 5.8 },
          { id: "choice-3", collegeName: "Muzaffarpur Institute of Technology", collegeCode: "MIT-MUZ", branchName: "ECE", branchCode: "ECE", avgPackage: 5.2 }
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

  const getChoiceQualityReport = () => {
    let score = 100;
    const warnings: string[] = [];
    const successes: string[] = [];

    if (!isLoaded || choices.length === 0) {
      return { score: 0, warnings: ["Add some choices to calculate preference sheet quality."], successes: [] };
    }

    // Rule 1: Length check
    if (choices.length < 5) {
      score -= 25;
      warnings.push("⚠️ Too few choices. Place at least 5-10 options to safeguard your round allocations.");
    } else if (choices.length < 10) {
      score -= 10;
      warnings.push("⚠️ Listing under 10 choices increases allocation slip-out risk. Try adding 3-5 more district backup colleges.");
    } else {
      successes.push("✓ Safe range: Your sheet contains a healthy number of choices.");
    }

    // Rule 2: Choice ordering check (Placement validation)
    let orderViolation = false;
    for (let i = 0; i < choices.length - 1; i++) {
      const current = choices[i];
      const next = choices[i + 1];
      
      if (current.branchCode === next.branchCode && current.avgPackage < next.avgPackage) {
        orderViolation = true;
        warnings.push(`⚠️ Quality Warning: You placed ${current.collegeCode} (${current.avgPackage} LPA) above ${next.collegeCode} (${next.avgPackage} LPA) for ${current.branchCode}. Check if you prefer the location of ${current.collegeCode}.`);
        score -= 10;
        break; // Show one placement warning to avoid clutter
      }
    }
    if (!orderViolation) {
      successes.push("✓ Optimal Ranking: Top placement colleges are correctly prioritised at the head of your list.");
    }

    // Rule 3: Backup check
    const hasTopTier = choices.some(c => c.collegeCode === "MITM" || c.collegeCode === "BCEB" || c.collegeCode === "MIT-MUZ" || c.collegeCode === "BCE-BHG");
    if (!hasTopTier) {
      warnings.push("💡 Tip: Consider adding premier state nodes like MIT Muzaffarpur or BCE Bhagalpur as top dream preferences.");
    } else {
      successes.push("✓ Aspirational Mix: Premier state nodes are included in your preference lock.");
    }

    return {
      score: Math.max(score, 10),
      warnings,
      successes
    };
  };

  const choiceReport = getChoiceQualityReport();

  return (
    <AuthGate>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        {/* Floating Radial Mesh Blur Backgrounds */}
        <div className="absolute top-10 left-10 w-80 h-80 bg-[#FF9933]/5 rounded-full blur-3xl pointer-events-none animate-float" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#138808]/5 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: "-3s" }} />
        <div className="absolute bottom-10 left-1/4 w-72 h-72 bg-[#2563EB]/4 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: "-6s" }} />

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB]/10 dark:bg-[#2563EB]/20 text-[#2563EB] dark:text-[#60a5fa] text-xs font-bold uppercase tracking-wider mb-4 border border-[#2563EB]/20 shadow-sm animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            AI Choice-Locking Sheet Optimizer
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-800 dark:text-white tracking-tight leading-none drop-shadow-sm">
            Mock Choice-Filling <span className="gradient-text-premium">Worksheet</span>
          </h1>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
            Create, re-order, and optimize your UGEAC college preference lock list. Our real-time AI analyzer evaluates your preference sheet hierarchy and awards a quality confidence score.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
          {/* Left Panel: Build Choice Sheet (Col-7) */}
          <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between relative overflow-hidden group">
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
                  <label className="block text-[9px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Select College</label>
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
                  <label className="block text-[9px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Select Branch</label>
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
                    className="w-full py-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-xl text-xs font-bold transition-all transform active:scale-95 cursor-pointer shadow-sm flex items-center justify-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>

              {/* Choices Table List */}
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {!isLoaded ? (
                  <div className="text-center py-12">
                    <span className="text-xs text-gray-450 animate-pulse">Loading mock preferences...</span>
                  </div>
                ) : choices.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-gray-200 dark:border-slate-800 rounded-2xl bg-white/20 dark:bg-slate-900/10">
                    <p className="text-xs text-gray-400 dark:text-gray-500">Your mock choice list is empty. Add engineering branches from the selector above!</p>
                  </div>
                ) : (
                  choices.map((c, idx) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-3.5 bg-white/85 dark:bg-slate-900/60 border border-gray-150 dark:border-slate-800 rounded-xl hover:border-[#2563EB]/35 transition-all hover:shadow-sm"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-4">
                        <span className="h-5 w-5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-850 dark:text-gray-300 flex items-center justify-center text-[10px] font-black shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0 text-left">
                          <span className="font-extrabold text-xs text-slate-800 dark:text-gray-200 truncate block leading-tight">{c.collegeName} ({c.collegeCode})</span>
                          <span className="text-[10px] text-[#FF9933] font-bold block truncate mt-0.5">{c.branchName}</span>
                        </div>
                      </div>

                      {/* Action buttons (Up, Down, Delete) */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveChoice(idx, "up")}
                          disabled={idx === 0}
                          className="p-1.5 border border-gray-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer flex items-center justify-center"
                        >
                          <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveChoice(idx, "down")}
                          disabled={idx === choices.length - 1}
                          className="p-1.5 border border-gray-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer flex items-center justify-center"
                        >
                          <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteChoice(c.id)}
                          className="p-1.5 border border-red-500/10 text-red-500 rounded-lg hover:bg-red-500/5 cursor-pointer flex items-center justify-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Export actions at bottom */}
            {choices.length > 0 && (
              <div className="pt-6 border-t border-gray-100 dark:border-slate-800/80 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const listText = choices.map((c, i) => `${i + 1}. ${c.collegeName} (${c.collegeCode}) - ${c.branchCode}`).join("\n");
                    const shareText = `Check out my Bihar UGEAC 2026 Choice Preference Lock List:\n\n${listText}\n\nAI Preference Quality Score: ${choiceReport.score}%\nCreate your custom preference worksheet on BiharEduConnect! 🚀`;
                    navigator.clipboard.writeText(shareText);
                    alert("✓ Mock Preference List copied to clipboard with AI Optimization details!");
                  }}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold transition-all transform active:scale-95 cursor-pointer shadow flex items-center gap-1.5 border border-slate-700/50"
                >
                  <FileText className="w-4 h-4 text-gray-400 dark:text-slate-600" /> Copy Sheet Data
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const listText = choices.map((c, i) => `${i + 1}. ${c.collegeCode} - ${c.branchCode}`).join("\n");
                    const shareText = `Check out my Bihar UGEAC 2026 Choice Lock List:\n\n${listText}\n\nAI Quality Score: ${choiceReport.score}%\nCheck yours on BiharEduConnect!`;
                    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
                    window.open(waUrl, "_blank");
                  }}
                  className="px-4 py-2.5 bg-[#138808] hover:bg-[#0f7c05] text-white rounded-xl text-xs font-bold transition-all transform active:scale-95 cursor-pointer shadow flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" /> Share on WhatsApp
                </button>
              </div>
            )}
          </div>

          {/* Right Panel: AI Preference Sheet Evaluation (Col-5) */}
          <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563EB]/10 rounded-bl-full pointer-events-none" />
            
            <div className="space-y-6">
              <h3 className="text-md font-black text-slate-800 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-3 flex items-center gap-2 text-left">
                <Compass className="w-5 h-5 text-[#FF9933]" /> AI Strength Analysis
              </h3>

              {/* Radial Score Dial */}
              <div className="flex flex-col items-center py-4 bg-slate-50/50 dark:bg-slate-900/30 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-inner relative">
                <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-850 shadow-inner animate-float">
                  <div className="absolute inset-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-slate-850 dark:text-white leading-none">
                      {choiceReport.score}%
                    </span>
                    <span className="text-[7px] text-[#2563EB] font-black uppercase tracking-wider mt-1">Sheet Health</span>
                  </div>
                  {/* Gauge Ring */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="48" stroke="rgba(226, 232, 240, 0.4)" strokeWidth="6" fill="transparent" />
                    <circle
                      cx="56" cy="56" r="48"
                      stroke="url(#choiceDialGradient)" strokeWidth="6" fill="transparent"
                      strokeDasharray="301"
                      strokeDashoffset={301 - (301 * choiceReport.score) / 100}
                      className="transition-all duration-500 ease-out"
                    />
                    <defs>
                      <linearGradient id="choiceDialGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FF9933" />
                        <stop offset="100%" stopColor="#138808" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <span className="text-[9px] text-gray-500 font-extrabold uppercase mt-3 tracking-widest">Preference Sheet Quality Score</span>
              </div>

              {/* Warning/Success Logs list */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-black text-gray-400 dark:text-slate-550 uppercase tracking-widest text-left">Optimization Audit Logs</h4>
                
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 text-left">
                  {choiceReport.warnings.map((warn, i) => (
                    <div key={i} className="p-3 bg-red-500/5 dark:bg-red-500/10 border border-red-500/15 rounded-xl text-[11px] text-red-500 font-semibold leading-relaxed">
                      {warn}
                    </div>
                  ))}
                  {choiceReport.successes.map((succ, i) => (
                    <div key={i} className="p-3 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15 rounded-xl text-[11px] text-[#138808] dark:text-[#22c55e] font-semibold leading-relaxed">
                      {succ}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-150 dark:border-slate-800 text-[10px] text-gray-450 leading-normal text-left">
              💡 <strong>Counseling Tip:</strong> Place your highest priority options at the very top. A higher-ranked preference in UGEAC choice entries secures seats with zero risk of penalty.
            </div>
          </div>
        </div>
      </div>
    </AuthGate>
  );
}
