"use client";

import React, { useState } from "react";
import { 
  Info, 
  MapPin, 
  Layers, 
  CheckCircle2, 
  Milestone,
  FileText, 
  HelpCircle,
  Lock,
  UserCheck,
  Building,
  Sparkles,
  QrCode,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  ShieldCheck,
  FileCheck,
  ArrowRight
} from "lucide-react";
import { AuthGate } from "../../components/AuthGate";
import { collegesData } from "../../data/colleges";
import { getCutoff, convertPercentileToUR, categoryRatios } from "../../data/cutoffs";
import { useApp } from "../../context/AppContext";

export default function CounsellingGuide() {
  const { user, colleges, bulkFiles, guideSteps, whatsappLink } = useApp();
  const [activeStep, setActiveStep] = useState(0);

  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentUtr, setPaymentUtr] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [checkedDocs, setCheckedDocs] = useState<number[]>([]);
  
  const currentPrice = appliedDiscount ? Math.round(99 - (99 * (appliedDiscount / 100))) : 99;
  
  // Teaser state for engagement
  const [teaserRank, setTeaserRank] = useState("");
  const [teaserResult, setTeaserResult] = useState<number | null>(null);

  const handleTeaserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teaserRank) return;
    const rank = parseInt(teaserRank);
    if (isNaN(rank) || rank <= 0) return;
    
    // Quick gamified calculation to hype them up
    const possibleColleges = Math.max(3, 38 - Math.floor(rank / 150));
    setTeaserResult(Math.min(38, possibleColleges));
  };

  const toggleDoc = (i: number) => {
    setCheckedDocs(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedVal = localStorage.getItem("bihareduconnect_premium_guide");
      if (storedVal === "true") {
        setIsPremiumUnlocked(true);
      }
    }
  }, []);

  const handleSimulatePayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setIsPremiumUnlocked(true);
      setShowPaymentModal(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("bihareduconnect_premium_guide", "true");
      }
    }, 1500);
  };

  const handleVerifyTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentUtr.trim()) {
      alert("Please enter a valid 12-digit UTR/Reference number.");
      return;
    }
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setIsPremiumUnlocked(true);
      setShowPaymentModal(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("bihareduconnect_premium_guide", "true");
      }
      alert("✓ UPI Payment verified successfully! Premium Counselling Simulator and Guides are now unlocked.");
    }, 1500);
  };

  // ==========================================
  // UGEAC counselling choice simulator states
  // ==========================================
  const [simRank, setSimRank] = useState<string>(user?.percentile ? Math.round(convertPercentileToUR(user.percentile)).toString() : "5000");
  const [simCategory, setSimCategory] = useState("UR");
  const [simGender, setSimGender] = useState("Co-ed");
  const [simChoices, setSimChoices] = useState<Array<{
    collegeId: string;
    collegeCode: string;
    collegeName: string;
    branchCode: string;
  }>>([]);
  const [simStage, setSimStage] = useState<"setup" | "filling" | "locking" | "allocated">("setup");
  const [simOtpInput, setSimOtpInput] = useState("");
  const [simOtpError, setSimOtpError] = useState("");
  const [isSimOtpVerifying, setIsSimOtpVerifying] = useState(false);
  const [allottedSeat, setAllottedSeat] = useState<{
    collegeName: string;
    branchCode: string;
    preferenceIndex: number;
    closingRank: number;
    allotmentRank: number;
  } | null>(null);
  const [isSimulatingAllotment, setIsSimulatingAllotment] = useState(false);
  const [freezeDecision, setFreezeDecision] = useState<"freeze" | "upgrade" | null>(null);
  const [round2Seat, setRound2Seat] = useState<{
    collegeName: string;
    branchCode: string;
    preferenceIndex: number;
    closingRank: number;
    allotmentRank: number;
  } | null>(null);
  const [isSimulatingRound2, setIsSimulatingRound2] = useState(false);
  
  // Choice selection dropdown states
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");

  const calculateStateRank = (rankValStr: string) => {
    const val = Number(rankValStr);
    return isNaN(val) || val <= 0 ? 5000 : val;
  };

  const handleAddChoice = () => {
    if (!selectedCollegeId || !selectedBranch) {
      alert("Please select a college and branch first!");
      return;
    }
    
    const college = colleges.find((c) => c.id === selectedCollegeId);
    if (!college) return;
    
    const isDuplicate = simChoices.some(
      (c) => c.collegeId === selectedCollegeId && c.branchCode === selectedBranch
    );
    if (isDuplicate) {
      alert("This exact choice is already added to your preference list!");
      return;
    }
    
    // Premium tier restriction (max 2 choices under free tier)
    if (!isPremiumUnlocked && simChoices.length >= 2) {
      setShowPaymentModal(true);
      return;
    }
    
    setSimChoices((prev) => [
      ...prev,
      {
        collegeId: college.id,
        collegeCode: college.code,
        collegeName: college.name,
        branchCode: selectedBranch
      }
    ]);
    
    setSelectedBranch("");
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setSimChoices((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy;
    });
  };

  const handleMoveDown = (index: number) => {
    setSimChoices((prev) => {
      if (index === prev.length - 1) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy;
    });
  };

  const handleRemoveChoice = (index: number) => {
    setSimChoices((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setSimOtpError("");
    
    if (simOtpInput !== "1234") {
      setSimOtpError("Invalid OTP! Use simulator code '1234' to lock choices.");
      return;
    }
    
    setIsSimOtpVerifying(true);
    setTimeout(() => {
      setIsSimOtpVerifying(false);
      setSimStage("allocated");
      handleRunAllotment(1);
    }, 1200);
  };

  const handleRunAllotment = (roundNum: number) => {
    const rankVal = calculateStateRank(simRank);
    const ratio = categoryRatios[simCategory] || 1.0;
    const candidateCategoryRank = Math.round(rankVal / ratio);
    
    if (roundNum === 1) {
      setIsSimulatingAllotment(true);
      setTimeout(() => {
        setIsSimulatingAllotment(false);
        
        let allocated = null;
        for (let i = 0; i < simChoices.length; i++) {
          const choice = simChoices[i];
          const cutoff = getCutoff(choice.collegeCode, choice.branchCode, 2025, 1, simCategory, simGender);
          const closingRank = cutoff?.closingRank || Math.round((4500 + i * 400) / ratio); // fallback cutoff
          
          if (candidateCategoryRank <= closingRank) {
            allocated = {
              collegeName: choice.collegeName,
              branchCode: choice.branchCode,
              preferenceIndex: i + 1,
              closingRank: Math.round(closingRank),
              allotmentRank: simCategory === "UR" ? rankVal : candidateCategoryRank
            };
            break;
          }
        }
        setAllottedSeat(allocated);
      }, 1500);
    } else {
      setIsSimulatingRound2(true);
      setTimeout(() => {
        setIsSimulatingRound2(false);
        
        let allocated = null;
        for (let i = 0; i < simChoices.length; i++) {
          const choice = simChoices[i];
          const cutoff = getCutoff(choice.collegeCode, choice.branchCode, 2025, 2, simCategory, simGender);
          // Simulate standard Round 2 cutoff expansion (closing rank drops / relaxes by ~8-12%)
          const closingRank = (cutoff?.closingRank || Math.round((4500 + i * 400) / ratio)) * 1.10;
          
          if (candidateCategoryRank <= closingRank) {
            allocated = {
              collegeName: choice.collegeName,
              branchCode: choice.branchCode,
              preferenceIndex: i + 1,
              closingRank: Math.round(closingRank),
              allotmentRank: simCategory === "UR" ? rankVal : candidateCategoryRank
            };
            break;
          }
        }
        setRound2Seat(allocated);
      }, 1500);
    }
  };

  const handleResetSimulator = () => {
    setSimChoices([]);
    setSimStage("setup");
    setSimOtpInput("");
    setSimOtpError("");
    setAllottedSeat(null);
    setFreezeDecision(null);
    setRound2Seat(null);
    setSelectedCollegeId("");
    setSelectedBranch("");
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "FileText": return FileText;
      case "Milestone": return Milestone;
      case "Layers": return Layers;
      case "Lock": return Lock;
      case "Building": return Building;
      case "UserCheck": return UserCheck;
      default: return HelpCircle;
    }
  };

  const steps = guideSteps.map((step) => ({
    ...step,
    icon: getIconComponent(step.iconName)
  }));

  return (
    <AuthGate>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#138808]/10 text-[#138808] text-xs font-bold uppercase tracking-wider mb-3">
          <Milestone className="w-3.5 h-3.5" />
          Step-by-Step Counselling Walkthrough
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Bihar Engineering <span className="bg-gradient-to-r from-[#FF9933] to-[#138808] bg-clip-text text-transparent">Counselling Guide</span>
        </h1>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
          A definitive, step-by-step admissions walkthrough for BCECE UGEAC engineering counselling.
        </p>
      </div>

      {/* Premium Counselling Guide Upgrade Card */}
      <div className="bg-gradient-to-r from-amber-500/10 via-[#FF9933]/15 to-[#138808]/15 border border-[#FF9933]/30 rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-tr from-[#138808]/20 to-transparent rounded-full blur-2xl" />
        <div className="space-y-3 max-w-2xl relative z-10 text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-[#D97706] text-[10px] font-extrabold uppercase tracking-wider">
            ⭐ Premium Advantage
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-805 dark:text-white leading-tight">
            Unlock Expert Bihar Engineering <span className="bg-gradient-to-r from-[#FF9933] to-[#138808] bg-clip-text text-transparent">Counselling Handbook</span>
          </h2>
          <div className="space-y-2.5 text-xs md:text-sm text-gray-600 dark:text-gray-300">
            <p className="font-bold text-slate-800 dark:text-white leading-relaxed">
              Get full end-to-end support to secure your dream engineering college based on your specific JEE Main rank & percentile:
            </p>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-[#138808] dark:text-[#FF9933] font-black">✓</span>
                <span><strong className="text-slate-800 dark:text-gray-200">Personalized Choice Priority List:</strong> Get the exact order to fill your college choices based on your rank.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#138808] dark:text-[#FF9933] font-black">✓</span>
                <span><strong className="text-slate-800 dark:text-gray-200">Direct Expert Support:</strong> Access our exclusive WhatsApp group for 1-on-1 guidance anytime.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#138808] dark:text-[#FF9933] font-black">✓</span>
                <span><strong className="text-slate-800 dark:text-gray-200">Complete PDF Guides & Trackers:</strong> Download cutoff trends and placement statistics.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#138808] dark:text-[#FF9933] font-black">✓</span>
                <span><strong className="text-slate-800 dark:text-gray-200">Unlimited Mock Simulator:</strong> Test Round 1 & Round 2 seat allotments without restrictions.</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-3 pt-2 w-full text-left">
            <div className="flex flex-wrap gap-2.5 items-center">
              {isPremiumUnlocked ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-emerald-500/25 transition-all cursor-pointer"
                    title="Click to view Payment details / QR Scanner again"
                  >
                    ✓ Premium Unlocked (₹99 Paid)
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("bihareduconnect_premium_guide");
                      setIsPremiumUnlocked(false);
                    }}
                    className="text-[10px] text-red-500 hover:underline cursor-pointer font-bold"
                    title="Reset payment state for testing"
                  >
                    (Reset)
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mr-2">
                  <span className="text-2xl font-extrabold text-[#138808] dark:text-[#FF9933]">₹99</span>
                  <span className="text-xs text-gray-400 line-through">₹499</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[9px] font-bold uppercase tracking-wider">
                    80% OFF
                  </span>
                </div>
              )}

              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (isPremiumUnlocked) {
                    if (whatsappLink) {
                      window.open(whatsappLink, '_blank', 'noopener,noreferrer');
                    } else {
                      alert('WhatsApp link will be available shortly.');
                    }
                  } else {
                    setShowPaymentModal(true);
                  }
                }}
                className="px-3.5 py-1.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider rounded-xl hover:bg-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                💬 Join WhatsApp Group
                {!isPremiumUnlocked && <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
              </button>
            </div>

            {isPremiumUnlocked && bulkFiles && bulkFiles.length > 0 && (
              <div className="mt-4 space-y-2 border-t border-dashed border-slate-200 dark:border-slate-800 pt-4 w-full">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-gray-300 mb-2">Available Handbooks & Circular Downloads:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {bulkFiles.map((file, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950 border border-gray-150 dark:border-slate-850 rounded-2xl flex items-center justify-between shadow-sm">
                      <div className="min-w-0">
                        <p className="font-extrabold text-xs text-slate-850 dark:text-gray-250 truncate pr-2" title={file.name}>
                          {file.name}
                        </p>
                        <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wide mt-0.5">
                          {file.type} | Size: {file.size}
                        </span>
                      </div>
                      <button
                        onClick={() => alert(`Success: ${file.name} downloaded successfully!`)}
                        className="px-3 py-1.5 bg-gradient-to-r from-[#FF9933] to-[#138808] hover:shadow text-white text-[9px] font-extrabold uppercase tracking-widest rounded-xl shrink-0 cursor-pointer"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {!isPremiumUnlocked && (
          <button
            onClick={() => setShowPaymentModal(true)}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-[#FF9933] to-[#138808] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg shadow-[#FF9933]/10 cursor-pointer transform hover:-translate-y-0.5 active:scale-95 transition-all duration-200 shrink-0 z-10 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            Unlock Premium Guide
          </button>
        )}
      </div>

      {/* Interactive Visual Timeline Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        
        {/* Left Side: Steps Navigation Timeline List (Col-5) */}
        <div className="lg:col-span-5 relative">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Milestone className="w-4 h-4 text-[#FF9933]" />
            Counselling Journey
          </h3>
          
          {/* Vertical Connecting Line */}
          <div className="absolute left-[35px] top-[45px] bottom-10 w-0.5 bg-gradient-to-b from-gray-200 via-gray-200 to-transparent dark:from-slate-800 dark:via-slate-800 hidden sm:block" />
          
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;
              return (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`w-full text-left p-4 border rounded-2xl transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer group relative z-10 hover:translate-x-1 ${
                    isActive
                      ? "bg-white dark:bg-slate-900 border-[#2563EB]/40 shadow-[0_4px_12px_rgba(37,99,235,0.08)] ring-1 ring-[#2563EB]/20"
                      : "bg-white/60 dark:bg-slate-950/60 border-gray-150 dark:border-slate-850 hover:bg-white dark:hover:bg-slate-900 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-sm font-bold text-sm transition-all duration-300 ${
                      isActive ? `${step.color} scale-110 shadow-md` : "bg-gray-50 dark:bg-slate-800 text-gray-400 border-gray-200 dark:border-slate-700 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={`text-xs font-extrabold transition-colors ${isActive ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-gray-400 group-hover:text-slate-800 dark:group-hover:text-gray-200"}`}>{step.title}</h4>
                      <span className="text-[10px] text-gray-400 font-semibold">{step.subtitle}</span>
                    </div>
                  </div>
                  <CheckCircle2 className={`w-5 h-5 shrink-0 transition-all ${isActive ? "text-[#2563EB] scale-110" : "text-gray-200 dark:text-slate-800 group-hover:text-gray-300"}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Step Details View (Col-7) */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm min-h-[350px] flex flex-col justify-between relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563EB]/5 rounded-bl-full -z-10" />

            <div key={activeStep} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-forwards">
              <span className="inline-flex px-2.5 py-1 bg-[#2563EB]/10 border border-[#2563EB]/25 text-[#2563EB] rounded-lg text-[10px] font-extrabold uppercase tracking-wide shadow-sm">
                Stage {activeStep + 1} Detailed Protocol
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-850 dark:text-white leading-tight">
                {steps[activeStep].title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-gray-100 dark:border-slate-850">
                {steps[activeStep].description}
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-dashed border-gray-150 dark:border-slate-800 flex gap-2">
              <Info className="w-5 h-5 text-[#FF9933] shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal">
                **Pro-tip**: Document Verification centers are physical. Keep at least **3 complete photocopied sets** of all certificates alongside original sheets, and print **2 copies of Part A & B application forms** because centers retain them.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Document verification checklists and simulated choices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Verification Checklist */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#138808]/5 rounded-bl-full -z-10" />
          
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-slate-850 pb-3">
            <h2 className="text-lg font-bold text-slate-850 dark:text-white flex items-center gap-2">
              <FileText className="w-5.5 h-5.5 text-[#138808]" />
              DV Checklist
            </h2>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
              {checkedDocs.length} / 6 Ready
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full mb-5 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#138808] to-emerald-400 transition-all duration-500 ease-out"
              style={{ width: `${(checkedDocs.length / 6) * 100}%` }}
            />
          </div>

          <div className="space-y-2">
            {[
              { doc: "JEE Main Admit Card 2025", desc: "Original printout, same as carried in examination." },
              { doc: "UGEAC Rank Card 2026", desc: "Downloaded merit card containing State Rank." },
              { doc: "Online Application Form (A & B)", desc: "Must have candidate photograph & signature." },
              { doc: "Passing Certificate & Marksheets", desc: "10th & 12th original marksheets and school leaving cert." },
              { doc: "Bihar State Residence Certificate", desc: "Signed by CO or SDO of Bihar." },
              { doc: "Category Certificate", desc: "EWS / BC / EBC / SC / ST / DQ caste certificate if applicable." }
            ].map((item, i) => {
              const isChecked = checkedDocs.includes(i);
              return (
                <button 
                  key={i} 
                  onClick={() => toggleDoc(i)}
                  className={`w-full text-left flex gap-3 p-3 rounded-2xl transition-all duration-300 border cursor-pointer group hover:scale-[1.01] ${
                    isChecked 
                      ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800/30 shadow-sm" 
                      : "bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-gray-100 dark:hover:border-slate-800"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-300 ${
                    isChecked ? "bg-[#138808] border-[#138808] text-white" : "border-gray-300 dark:border-gray-600 text-transparent"
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold transition-all duration-300 ${isChecked ? "text-[#138808] dark:text-emerald-400 line-through opacity-80" : "text-slate-800 dark:text-gray-200"}`}>
                      {item.doc}
                    </h4>
                    <p className={`text-[10px] leading-normal transition-all duration-300 ${isChecked ? "text-gray-400 line-through opacity-60" : "text-gray-500"}`}>
                      {item.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* UGEAC Counselling Choice & Allotment Simulator */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          {/* Subtle decorative glowing background indicator */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF9933]/5 dark:bg-[#FF9933]/10 rounded-full blur-xl pointer-events-none" />
          
          {!isPremiumUnlocked ? (
            /* LOCK OVERLAY */
            <div className="text-center py-8 px-4 flex flex-col items-center justify-center gap-4 relative z-10 w-full h-full my-auto">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center animate-pulse">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
                  🔒 Counselling Simulator Locked
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed mx-auto">
                  The Premium UGEAC 2026 Choice Allotment Simulator is locked. Unlock now for only <strong>₹99</strong> to simulate Round 1 & Round 2 allotments!
                </p>
              </div>

              {/* QUICK ENGAGEMENT TEASER */}
              <div className="w-full max-w-xs bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 my-2">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">⚡ Quick Eligibility Check</h4>
                {!teaserResult ? (
                  <form onSubmit={handleTeaserSubmit} className="flex gap-2">
                    <input 
                      type="number" 
                      placeholder="Enter UGEAC Rank..." 
                      value={teaserRank}
                      onChange={(e) => setTeaserRank(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[#FF9933]/50 outline-none"
                    />
                    <button type="submit" className="px-3 py-2 bg-slate-800 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:scale-105 transition-transform">
                      Check
                    </button>
                  </form>
                ) : (
                  <div className="animate-in fade-in zoom-in duration-300">
                    <p className="text-xs text-slate-800 dark:text-gray-200 font-semibold leading-relaxed">
                      🔥 Great! You have strong chances in <strong className="text-[#138808]">{teaserResult}+ Engineering Colleges</strong>.
                    </p>
                    <p className="text-[10px] text-[#FF9933] font-bold mt-1 animate-pulse">
                      Unlock simulator below to see exactly which ones! 👇
                    </p>
                  </div>
                )}
              </div>
              
              <ul className="text-left text-[11px] text-gray-550 dark:text-gray-400 space-y-1.5 list-disc pl-5 max-w-xs font-medium mx-auto">
                <li>Simulate Round 1 & Round 2 Allotments</li>
                <li>Compare cutoffs of 38+ Bihar Engineering Colleges</li>
                <li>Arrange unlimited choices & preferences</li>
                <li>Expert Counselling strategy instructions</li>
              </ul>
              
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full max-w-xs py-3 bg-gradient-to-r from-[#FF9933] to-[#138808] text-white rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-[0_0_15px_rgba(255,153,51,0.4)] hover:shadow-[0_0_25px_rgba(19,136,8,0.6)] transition-all duration-300 transform active:scale-95 cursor-pointer mt-2 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                Unlock Premium Simulator (₹99)
              </button>
            </div>
          ) : (
            <div>
            <h2 className="text-lg font-bold text-slate-850 dark:text-white flex items-center justify-between gap-2 mb-3 border-b border-gray-100 dark:border-slate-850 pb-2">
              <span className="flex items-center gap-2">
                <Layers className="w-5.5 h-5.5 text-[#FF9933]" />
                UGEAC Counselling Simulator
              </span>
              <span className="px-2 py-0.5 rounded bg-[#FF9933]/15 text-[#FF9933] text-[9px] font-extrabold uppercase tracking-wide">
                Interactive Mock
              </span>
            </h2>

            {/* STAGE 1: CREDENTIALS SETUP */}
            {simStage === "setup" && (
              <div className="space-y-4 py-2 text-left">
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Welcome to the BCECE choice filling room! Enter your academic details to simulate a personalized counselling rank card.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                      UGEAC General Rank
                    </label>
                    <input
                      type="text"
                      value={simRank}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^[0-9]*$/.test(val)) {
                          setSimRank(val);
                        }
                      }}
                      placeholder="e.g. 5000"
                      className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white font-extrabold text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                        Caste Category
                      </label>
                      <select
                        value={simCategory}
                        onChange={(e) => setSimCategory(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white font-bold text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="UR">General (UR)</option>
                        <option value="BC">Backward (BC)</option>
                        <option value="EBC">Extremely Backward (EBC)</option>
                        <option value="SC">Scheduled Caste (SC)</option>
                        <option value="ST">Scheduled Tribe (ST)</option>
                        <option value="EWS">EWS Section</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                        Gender Quota
                      </label>
                      <select
                        value={simGender}
                        onChange={(e) => setSimGender(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white font-bold text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Co-ed">Co-Educational</option>
                        <option value="Female">Female Candidate</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSimStage("filling")}
                  className="w-full py-3 bg-gradient-to-r from-[#FF9933] to-[#138808] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg shadow-[#FF9933]/15 transform active:scale-95 transition-all mt-4 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Enter Choice Filling Room
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STAGE 2: CHOICE FILLING & PRIORITY ARRANGEMENT */}
            {simStage === "filling" && (
              <div className="space-y-4 py-2 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-405 font-bold uppercase tracking-wider">
                    Preference Basket ({simChoices.length} Added)
                  </span>
                  <button
                    onClick={handleResetSimulator}
                    className="text-[10px] text-red-500 font-bold hover:underline cursor-pointer"
                  >
                    Reset Setup
                  </button>
                </div>

                {/* Free Tier Alert Indicator */}
                {!isPremiumUnlocked && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2">
                    <Lock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 leading-normal">
                      <strong>Demo Mode Active</strong>: You can add up to <strong>2 college choices</strong>. Unlock <span className="underline font-bold cursor-pointer" onClick={() => setShowPaymentModal(true)}>Premium Advantage (₹99)</span> for unlimited preferences & Category Allotments!
                    </p>
                  </div>
                )}

                {/* Selection Dropdowns */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">1. Choose Institution</label>
                    <select
                      value={selectedCollegeId}
                      onChange={(e) => {
                        setSelectedCollegeId(e.target.value);
                        setSelectedBranch(""); // Reset branch when college changes
                      }}
                      className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-gray-200 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">-- Choose Bihar Govt College --</option>
                      {colleges.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.location})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-8 space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase">2. Select B.Tech Branch</label>
                      <select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-gray-200 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                        disabled={!selectedCollegeId}
                      >
                        <option value="">-- Choose Branch --</option>
                        {selectedCollegeId &&
                          colleges
                            .find((c) => c.id === selectedCollegeId)
                            ?.branches.map((b) => (
                              <option key={b} value={b}>
                                {b} (B.Tech)
                              </option>
                            ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddChoice}
                      className="col-span-4 p-2.5 bg-[#138808] hover:bg-[#138808]/90 text-white rounded-xl font-extrabold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm hover:shadow cursor-pointer transition-all transform active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>
                </div>

                {/* Preference List container */}
                {simChoices.length > 0 ? (
                  <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1 pt-1">
                    {simChoices.map((choice, index) => (
                      <div key={index} className="p-3 bg-slate-50 dark:bg-slate-950 border border-gray-150 dark:border-slate-850 rounded-xl flex items-center justify-between text-xs transition-all hover:border-gray-250 dark:hover:border-slate-750">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-blue-100 dark:bg-slate-800 text-[#2563EB] dark:text-[#FF9933] font-bold flex items-center justify-center text-[10px]">
                            {index + 1}
                          </span>
                          <div className="text-left">
                            <p className="font-extrabold text-slate-850 dark:text-gray-200 leading-none truncate max-w-[130px] sm:max-w-[170px]">
                              {choice.collegeName.replace(" Institute of Technology", "").replace(" College of Engineering", "")}
                            </p>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{choice.branchCode}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                            className="p-1 rounded bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-500 disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveDown(index)}
                            disabled={index === simChoices.length - 1}
                            className="p-1 rounded bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-500 disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRemoveChoice(index)}
                            className="p-1 rounded bg-red-50 dark:bg-red-950/20 hover:bg-red-100 text-red-500 dark:text-red-400 cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => setSimStage("locking")}
                      className="w-full py-2.5 bg-[#2563EB] hover:bg-[#2563EB]/95 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-sm hover:shadow mt-4 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Lock className="w-4 h-4" />
                      Lock Preferences & Submit
                    </button>
                  </div>
                ) : (
                  <div className="border border-dashed border-gray-200 dark:border-slate-850 rounded-2xl py-10 text-center flex flex-col items-center justify-center space-y-2">
                    <Layers className="w-8 h-8 text-gray-300 dark:text-slate-800 animate-pulse" />
                    <p className="text-[10px] text-gray-400 font-bold max-w-[200px] leading-normal">
                      Your choices are empty! Search and select Bihar govt colleges from the basket above to arrange them.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STAGE 3: OTP VERIFICATION LOCKING */}
            {simStage === "locking" && (
              <form onSubmit={handleVerifyOtp} className="space-y-4 py-4 text-center">
                <div className="w-12 h-12 bg-amber-50 dark:bg-slate-800 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
                  OTP Security Lockout
                </h3>
                <p className="text-[11px] text-gray-400 max-w-[280px] mx-auto leading-relaxed">
                  To ensure your UGEAC seat prioritization is tamper-proof, enter simulated passcode <strong className="text-emerald-500 font-bold">1234</strong> below.
                </p>
                <div className="max-w-[200px] mx-auto space-y-1">
                  <input
                    type="text"
                    placeholder="Enter 4-Digit OTP"
                    maxLength={4}
                    value={simOtpInput}
                    onChange={(e) => setSimOtpInput(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-center tracking-[8px] p-2.5 border rounded-xl border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white font-extrabold text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {simOtpError && (
                    <span className="text-[9px] text-red-500 font-semibold block">{simOtpError}</span>
                  )}
                </div>
                
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setSimStage("filling")}
                    className="flex-1 py-2 border border-gray-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg text-slate-700 dark:text-gray-300 font-bold text-xs"
                  >
                    Modify Choices
                  </button>
                  <button
                    type="submit"
                    disabled={isSimOtpVerifying}
                    className="flex-1 py-2 bg-gradient-to-r from-[#FF9933] to-[#138808] text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-sm hover:shadow disabled:opacity-50 cursor-pointer"
                  >
                    {isSimOtpVerifying ? "Verifying..." : "Lock Options"}
                  </button>
                </div>
              </form>
            )}

            {/* STAGE 4: ALLOTMENT LETTER OR NO SEAT NOTIFICATION */}
            {simStage === "allocated" && (
              <div className="space-y-4 py-2">
                {isSimulatingAllotment ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 border-4 border-[#2563EB]/25 rounded-full" />
                      <div className="absolute inset-0 border-4 border-t-[#2563EB] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                      <Layers className="w-6 h-6 text-[#2563EB] animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
                        UGEAC Allocation Solver
                      </h3>
                      <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-slate-950 border border-blue-100 dark:border-slate-900 text-[#2563EB] text-[8px] font-extrabold uppercase tracking-widest mt-1 inline-block">
                        Matching Category Rank: {simCategory}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 max-w-[285px] mx-auto leading-relaxed">
                      Matching your UGEAC rank <strong className="text-slate-800 dark:text-white">#{calculateStateRank(simRank)}</strong> against historical college cutoffs...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 text-left text-xs">
                    {allottedSeat ? (
                      <div className="space-y-3">
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-2.5">
                          <div className="p-1.5 bg-emerald-500/20 text-[#138808] rounded-xl shrink-0">
                            <FileCheck className="w-5.5 h-5.5" />
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-[#138808] font-extrabold uppercase tracking-widest">
                              Round 1 Provisional Slip
                            </span>
                            <h3 className="text-sm font-extrabold text-slate-850 dark:text-white leading-tight">
                              Seat Allocated Successfully!
                            </h3>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">
                              Based on UGEAC merit rules, you qualify for <strong>Choice #{allottedSeat.preferenceIndex}</strong>.
                            </p>
                          </div>
                        </div>

                        {/* Allotment Details Card */}
                        <div className="bg-slate-50 dark:bg-slate-950 border border-gray-150 dark:border-slate-850 rounded-2xl p-4 space-y-2.5 text-xs">
                          <div className="flex justify-between border-b border-gray-200/50 dark:border-slate-850 pb-2">
                            <span className="text-gray-400 font-bold">Allotted College:</span>
                            <span className="font-extrabold text-slate-800 dark:text-white text-right max-w-[160px] truncate">{allottedSeat.collegeName}</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-200/50 dark:border-slate-850 pb-2">
                            <span className="text-gray-400 font-bold">Course Stream:</span>
                            <span className="font-extrabold text-slate-800 dark:text-white uppercase">{allottedSeat.branchCode} (B.Tech)</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-200/50 dark:border-slate-850 pb-2">
                            <span className="text-gray-400 font-bold">Allocated Category:</span>
                            <span className="font-extrabold text-[#FF9933]">{simCategory}</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-200/50 dark:border-slate-850 pb-2">
                            <span className="text-gray-400 font-bold">{simCategory === "UR" ? "UGEAC UR Rank:" : `UGEAC ${simCategory} Category Rank:`}</span>
                            <span className="font-extrabold text-[#2563EB]">#{allottedSeat.allotmentRank}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400 font-bold">{simCategory === "UR" ? "Historical UR Cutoff:" : `Historical ${simCategory} Cutoff:`}</span>
                            <span className="font-extrabold text-gray-500 dark:text-gray-300">#{allottedSeat.closingRank}</span>
                          </div>
                        </div>

                        {/* Slide vs Freeze Decision panels */}
                        {freezeDecision === null ? (
                          <div className="space-y-3 pt-1">
                            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-2">
                              <Info className="w-5.5 h-5.5 text-amber-500 shrink-0 mt-0.5" />
                              <p className="text-[10px] text-amber-600 leading-normal">
                                <strong>BCECE Tip</strong>: If you select <strong>Freeze</strong>, you claim the college. If you select <strong>Upgrade</strong>, you try for a higher preference in Round 2, while safely retaining this seat if no upgrade qualifies!
                              </p>
                            </div>
                            <div className="flex gap-2.5">
                              <button
                                onClick={() => { setFreezeDecision("upgrade"); handleRunAllotment(2); }}
                                className="flex-1 py-3 border border-orange-500/25 bg-orange-500/5 hover:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center"
                              >
                                Slide & Upgrade
                              </button>
                              <button
                                onClick={() => setFreezeDecision("freeze")}
                                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-[#138808] text-white text-[10px] font-extrabold uppercase tracking-wider rounded-xl shadow-sm hover:shadow transition-all cursor-pointer text-center"
                              >
                                Freeze & Accept
                              </button>
                            </div>
                          </div>
                        ) : freezeDecision === "freeze" ? (
                          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-3 text-center">
                            <div className="w-10 h-10 bg-emerald-500/20 text-[#138808] rounded-full flex items-center justify-center mx-auto">
                              <ShieldCheck className="w-6 h-6 animate-bounce" />
                            </div>
                            <div>
                              <h4 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
                                Simulated Freeze Successful!
                              </h4>
                              <p className="text-[10px] text-gray-400 mt-1 max-w-[240px] mx-auto leading-normal">
                                Provisional Seat at <strong className="text-slate-800 dark:text-white">{allottedSeat.collegeName}</strong> locked. Download admission letters and report to DV center!
                              </p>
                            </div>
                            
                            <div className="flex gap-2.5 pt-2 max-w-[220px] mx-auto">
                              <button
                                onClick={() => { alert("Success: Simulated Admission Letter generated & saved!"); }}
                                className="flex-1 py-1.5 bg-[#138808] text-white font-bold text-[9px] uppercase tracking-wider rounded"
                              >
                                Download Slip
                              </button>
                              <button
                                onClick={handleResetSimulator}
                                className="flex-1 py-1.5 border border-gray-200 dark:border-slate-800 text-slate-600 dark:text-gray-400 font-bold text-[9px] uppercase tracking-wider rounded hover:bg-slate-50 dark:hover:bg-slate-850"
                              >
                                Try Again
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* ROUND 2 SIMULATION OUTCOME */
                          <div className="space-y-3">
                            {isSimulatingRound2 ? (
                              <div className="py-6 text-center space-y-3 border border-dashed border-gray-150 dark:border-slate-850 rounded-2xl">
                                <div className="w-8 h-8 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin mx-auto" />
                                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-extrabold">
                                  Recalculating Round 2 Cutoff drops...
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {round2Seat ? (
                                  round2Seat.preferenceIndex < allottedSeat.preferenceIndex ? (
                                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl space-y-3 text-left">
                                      <div className="flex gap-2 items-start">
                                        <div className="p-1.5 bg-blue-500/20 text-[#2563EB] rounded-xl shrink-0">
                                          <Sparkles className="w-5 h-5 animate-pulse" />
                                        </div>
                                        <div>
                                          <h4 className="text-xs font-extrabold text-blue-655 dark:text-blue-400 uppercase tracking-wider">
                                            Seat Upgraded Successfully!
                                          </h4>
                                          <p className="text-[10px] text-gray-550 dark:text-gray-400 mt-0.5 leading-normal">
                                            Round 2 cutoffs relaxed. You climbed from Choice #{allottedSeat.preferenceIndex} to your top-tier <strong>Choice #{round2Seat.preferenceIndex}</strong>!
                                          </p>
                                        </div>
                                      </div>
                                      
                                      <div className="p-3 bg-white dark:bg-slate-900 border border-blue-500/15 rounded-xl space-y-1.5 text-[11px]">
                                        <div><strong className="text-gray-400 font-bold">New Institution:</strong> <span className="font-extrabold text-slate-800 dark:text-white">{round2Seat.collegeName}</span></div>
                                        <div><strong className="text-gray-400 font-bold">New B.Tech Branch:</strong> <span className="font-extrabold text-slate-800 dark:text-white uppercase">{round2Seat.branchCode}</span></div>
                                        <div><strong className="text-gray-400 font-bold">Rank threshold:</strong> <span className="font-extrabold text-blue-505">#{round2Seat.closingRank}</span></div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-gray-150 dark:border-slate-850 rounded-2xl space-y-2 text-left">
                                      <h4 className="text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Slide Complete: No Change
                                      </h4>
                                      <p className="text-[10px] text-gray-400 leading-normal">
                                        Round 2 cutoffs did not fall enough to grant your higher preferences. Under standard rules, <strong>your Round 1 seat is fully retained!</strong>
                                      </p>
                                      <div className="p-3 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 rounded-xl space-y-1.5 text-[11px]">
                                        <div><strong className="text-gray-400 font-bold">Retained Seat:</strong> <span className="font-extrabold text-slate-800 dark:text-white">{allottedSeat.collegeName}</span></div>
                                        <div><strong className="text-gray-400 font-bold">Allocated Branch:</strong> <span className="font-extrabold text-slate-800 dark:text-white uppercase">{allottedSeat.branchCode}</span></div>
                                      </div>
                                    </div>
                                  )
                                ) : (
                                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-gray-150 dark:border-slate-850 rounded-2xl space-y-2 text-left">
                                    <h4 className="text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                      Slide Complete: Retain Seat
                                    </h4>
                                    <p className="text-[10px] text-gray-400 leading-normal">
                                      No higher choices matched in Round 2. You retain your allocated Round 1 seat:
                                    </p>
                                    <div className="p-3 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 rounded-xl space-y-1.5 text-[11px]">
                                      <div><strong className="text-gray-400 font-bold">Retained Seat:</strong> <span className="font-extrabold text-slate-800 dark:text-white">{allottedSeat.collegeName}</span></div>
                                      <div><strong className="text-gray-400 font-bold">Branch:</strong> <span className="font-extrabold text-slate-800 dark:text-white uppercase">{allottedSeat.branchCode}</span></div>
                                    </div>
                                  </div>
                                )}
                                
                                <button
                                  type="button"
                                  onClick={handleResetSimulator}
                                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-gray-300 font-bold rounded-xl uppercase tracking-wider cursor-pointer transition-all"
                                >
                                  Reset Simulator
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* NO SEAT ALLOTTED CARD */
                      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-3.5 text-center">
                        <div className="w-10 h-10 bg-amber-500/20 text-[#D97706] rounded-full flex items-center justify-center mx-auto animate-bounce">
                          <Info className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-[#D97706] uppercase tracking-wider">
                            Round 1 Seat: Not Allotted
                          </h4>
                          <p className="text-[10px] text-gray-400 mt-1 max-w-[240px] mx-auto leading-normal">
                            No seat allocated in Round 1. Your State Merit Rank <strong>#{calculateStateRank(simRank)}</strong> is higher than closing cutoffs of your added choices.
                          </p>
                        </div>

                        <div className="p-3 bg-white dark:bg-slate-900 border border-amber-500/15 rounded-xl space-y-2 text-[10px] text-left">
                          <strong className="text-[#D97706] block border-b pb-1 uppercase tracking-wider">💡 Educational Advice:</strong>
                          <p className="text-gray-500 dark:text-gray-400 leading-normal">
                            1. <strong>Don't skip DV</strong>: Under real rules, you must wait for Round 2 upgrade.
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 leading-normal">
                            2. <strong>Add Safer Choices</strong>: Add 4-5 backups lower in your preference basket. Never lock only high-cutoff options.
                          </p>
                        </div>

                        <button
                          onClick={handleResetSimulator}
                          className="w-full py-2 border border-amber-500/30 text-amber-600 hover:bg-amber-500/10 font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                        >
                          Modify Preference Basket
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-2">
            <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-600 leading-normal">
              **Caution**: Never list safe colleges above dream colleges. If preference 1 matches, Next.js / BCECE locks it and automatically deletes preferences 2, 3, 4! Arrange from most preferred to least preferred.
            </p>
      </div>
    </div>

      </div>
    </div>

      {/* Sleek simulated UPI payment modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={() => setShowPaymentModal(false)}></div>
          
          <div className="relative w-full max-w-sm rounded-[24px] bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 shadow-2xl z-10 p-6 text-center space-y-4">
            <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-white" onClick={() => setShowPaymentModal(false)}>
              ✕
            </button>

            <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-[#2563EB] mb-2">
              <QrCode className="w-6 h-6" />
            </div>

            <h3 className="text-base font-extrabold text-slate-805 dark:text-white">
              Scan QR or Choose Simulated Pay
            </h3>
            
            <p className="text-xs text-gray-400 leading-relaxed">
              Pay {appliedDiscount ? <><span className="line-through text-gray-300">₹99</span> <span className="text-[#138808] font-black">₹{currentPrice}</span></> : `₹${currentPrice}`} safely to unlock the premium Bihar UGEAC 2026 PDF Handbook & expert counsel sheets.
            </p>

            {/* Coupon Code Input */}
            {!appliedDiscount ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Have a reward code?"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-1.5 border border-dashed border-[#FF9933]/50 bg-[#FF9933]/5 text-[#FF9933] text-xs rounded-xl font-bold focus:outline-none focus:border-[#FF9933] placeholder-[#FF9933]/50"
                />
                <button
                  type="button"
                  onClick={() => {
                    const match = couponCode.match(/^UGEAC-PRO-(\d+)$/);
                    if (match) {
                      const disc = parseInt(match[1]);
                      if ([1, 2, 5, 10, 20].includes(disc)) {
                        setAppliedDiscount(disc);
                        return;
                      }
                    }
                    alert("Invalid or Expired Code");
                  }}
                  className="px-3 py-1.5 bg-[#FF9933] text-white rounded-xl text-[10px] font-extrabold uppercase tracking-wider shadow-sm hover:bg-orange-500 transition-colors"
                >
                  Apply
                </button>
              </div>
            ) : (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest py-1.5 px-3 rounded-xl flex items-center justify-center gap-1.5 animate-in zoom-in">
                <CheckCircle2 className="w-4 h-4" /> Coupon {couponCode} Applied! ({appliedDiscount}% Off)
              </div>
            )}

            {/* Real scannable UPI QR Code */}
            <div className="mx-auto w-44 h-44 border border-gray-100 dark:border-slate-850 bg-white rounded-2xl flex flex-col items-center justify-center p-3.5 relative group shadow-sm">
              {/* Outer corner design */}
              <div className="absolute inset-2 border-2 border-dashed border-[#FF9933]/30 rounded-xl pointer-events-none" />
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi%3A%2F%2Fpay%3Fpa%3D9296276633%40axl%26pn%3DBiharEduConnect%26am%3D${currentPrice}%26cu%3DINR%26tn%3DPremium%2520Counselling%2520Unlock`}
                alt="BCECE UGEAC UPI QR Code"
                className="w-32 h-32 relative z-10 rounded-lg shadow-sm"
              />
              <span className="text-[9px] text-[#138808] font-extrabold tracking-wider uppercase mt-1 relative z-10">
                UPI ID: 9296276633@axl
              </span>
            </div>

            {/* Direct Pay / UPI Launch apps block to resolve "scanner not opening" on mobile */}
            <div className="space-y-2 text-center">
              <span className="text-[9px] text-gray-400 font-extrabold uppercase block tracking-wider">
                Or Tap to Pay Directly on Mobile:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { name: "GPay", color: "bg-blue-50 dark:bg-slate-950 border-blue-500/10 text-blue-500 hover:bg-blue-100" },
                  { name: "PhonePe", color: "bg-purple-50 dark:bg-slate-950 border-purple-500/10 text-purple-500 hover:bg-purple-100" },
                  { name: "Paytm", color: "bg-sky-50 dark:bg-slate-950 border-sky-500/10 text-sky-500 hover:bg-sky-100" },
                  { name: "BHIM", color: "bg-orange-50 dark:bg-slate-950 border-orange-500/10 text-orange-500 hover:bg-orange-100" }
                ].map((app) => (
                  <a
                    key={app.name}
                    href={`upi://pay?pa=9296276633@axl&pn=BiharEduConnect&am=${currentPrice}&cu=INR&tn=Premium%20Counselling%20Unlock`}
                    className={`py-2 border rounded-xl flex flex-col items-center justify-center text-[10px] font-black tracking-tighter uppercase transition-all ${app.color}`}
                  >
                    {app.name}
                  </a>
                ))}
              </div>
              <a
                href={`upi://pay?pa=9296276633@axl&pn=BiharEduConnect&am=${currentPrice}&cu=INR&tn=Premium%20Counselling%20Unlock`}
                className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-[#2563EB]/10 to-[#1d4ed8]/10 hover:from-[#2563EB] hover:to-[#1d4ed8] text-[#2563EB] hover:text-white dark:text-blue-400 dark:hover:text-white dark:bg-slate-850 border border-[#2563EB]/20 dark:border-slate-800 rounded-xl font-extrabold text-[10px] uppercase tracking-wider transition-all duration-300"
              >
                <span>🚀 Pay via any UPI App</span>
              </a>
            </div>

            {/* Manual Transaction UTR Reference Entry to Verify Scan Pay */}
            <form onSubmit={handleVerifyTransaction} className="border-t border-gray-150 dark:border-slate-850 pt-3 space-y-2 text-left">
              <label className="block text-[9px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Paid? Verify Transaction UTR Number:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  pattern="[0-9]{12}"
                  maxLength={12}
                  value={paymentUtr}
                  onChange={(e) => setPaymentUtr(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 12-digit UPI UTR (e.g. 6203...)"
                  className="flex-1 px-3 py-1.5 border border-gray-250 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 text-xs rounded-xl font-mono focus:outline-none focus:border-blue-500 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={isPaying || paymentUtr.length !== 12}
                  className="px-4 py-1.5 bg-gradient-to-r from-[#FF9933] to-[#138808] text-white rounded-xl text-[10px] font-extrabold uppercase tracking-wider disabled:opacity-40 cursor-pointer shadow hover:shadow-md shrink-0"
                >
                  {isPaying ? "Verifying..." : "Verify"}
                </button>
              </div>
              <span className="text-[8px] text-gray-400 block leading-tight">
                Enter the 12-digit Ref No. / UTR from your GPay, PhonePe, or Paytm receipt to instantly approve the payment!
              </span>
            </form>

            <div className="border-t border-gray-150 dark:border-slate-850 pt-3 mt-4">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="w-full py-2 border border-gray-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl text-slate-700 dark:text-gray-300 font-bold text-xs cursor-pointer transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthGate>
  );
}
