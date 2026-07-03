"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { convertPercentileToUR } from "../../data/cutoffs";
import { 
  Bookmark, 
  TrendingUp, 
  Trash2, 
  MapPin, 
  GraduationCap, 
  CheckSquare, 
  Square,
  Clock,
  Compass,
  ArrowRight,
  ShieldCheck,
  Building,
  User,
  Mail,
  Phone,
  Key,
  LogOut,
  Sparkles,
  Lock,
  Target,
  FileCheck,
  Trophy,
  Crown,
  AlertCircle,
  CheckCircle2,
  RefreshCcw,
  Edit2,
  Check,
  X,
  Laptop
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthGate } from "../../components/AuthGate";

export default function StudentDashboard() {
  const { 
    savedPredictions, 
    colleges, 
    deletePrediction,
    user,
    logout,
    registerUser,
    timelineEvents,
    updateUserAvatar,
    updateUserName
  } = useApp();

  const router = useRouter();

  useEffect(() => {
    if (user && user.isAdmin) {
      router.replace("/admin");
    }
  }, [user, router]);

  // Upgrade Guest Account states
  const [upgradeEmail, setUpgradeEmail] = useState("");
  const [upgradePhone, setUpgradePhone] = useState("");
  const [upgradePassword, setUpgradePassword] = useState("");
  const [upgradeError, setUpgradeError] = useState("");
  const [upgradeSuccess, setUpgradeSuccess] = useState("");
  const [isUpgrading, setIsUpgrading] = useState(false);
  
  // Name Edit State
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState("");

  const isDemoUser = user?.email?.includes('.demo@') || !user?.email;
  const hasRealEmail = user?.email && !user?.email.includes('.demo@');

  const handleRandomizeAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    updateUserAvatar(randomSeed);
  };

  const handleSaveName = () => {
    if (editNameValue.trim().length > 2) {
      updateUserName(editNameValue.trim());
      setIsEditingName(false);
    }
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setEditNameValue(user?.name || "");
  };

  const handleUpgradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUpgradeError("");
    setUpgradeSuccess("");

    if (!user) return;

    const emailClean = upgradeEmail.trim();
    const phoneClean = upgradePhone.trim();
    const passClean = upgradePassword.trim();

    if (!emailClean || !emailClean.includes("@")) {
      setUpgradeError("Please enter a valid email address");
      return;
    }
    if (!phoneClean || phoneClean.replace(/\D/g, "").length < 10) {
      setUpgradeError("Please enter a valid 10-digit phone number");
      return;
    }
    if (!passClean || passClean.length < 4) {
      setUpgradeError("Choose a password with at least 4 characters");
      return;
    }

    setIsUpgrading(true);

    setTimeout(() => {
      const res = registerUser(
        user.name,
        emailClean,
        user.percentile || 90.0,
        passClean
      );
      setIsUpgrading(false);

      if (res.success) {
        setUpgradeSuccess("Profile completed successfully! Your account has been upgraded.");
        setUpgradeEmail("");
        setUpgradePhone("");
        setUpgradePassword("");
      } else {
        setUpgradeError(res.error || "Upgrade failed. Email might be in use.");
      }
    }, 1000);
  };


  // Counselling checklist state (stored in localStorage for persistence)
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    register: false,
    merit: false,
    choice: false,
    lock: false,
    allotment: false,
    verification: false
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCheck = localStorage.getItem("bihareduconnect_checklist");
      if (storedCheck) {
        setChecklist(JSON.parse(storedCheck));
      }
    }
  }, []);

  const toggleCheck = (key: string) => {
    setChecklist((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      if (typeof window !== "undefined") {
        localStorage.setItem("bihareduconnect_checklist", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const getChanceBadge = (chance: "High" | "Moderate" | "Low") => {
    switch (chance) {
      case "High":
        return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
      case "Moderate":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "Low":
        return "bg-slate-500/10 text-slate-500 border border-slate-500/20";
    }
  };

  // --- STUDENT ENGAGEMENT DATA & STATES ---
  const UGEAC_QUIZ_QUESTIONS = [
    {
      question: "Round 1 allotment me seat milne par agar Round 2 me upgrade hona hai, to kya reporting center jana padega?",
      options: [
        "Nahi, online upgrade karke direct check karein.",
        "Ha, physical document verification mandatory hai, warna seat and registration cancel ho jayega."
      ],
      correctAnswer: 1,
      explanation: "UGEAC Rules state that physical reporting at the designated nodal center is MANDATORY in Round 1 even if you opt for upgradation. If you skip, your seat is cancelled and you are removed from subsequent rounds."
    },
    {
      question: "BCECE Board engineering courses allotment me kaun sa rank criteria evaluate karta hai?",
      options: [
        "JEE Main CRL (All India Rank) direct classification.",
        "BCECE UGEAC Bihar State Merit Rank card allocation."
      ],
      correctAnswer: 1,
      explanation: "BCECE translates JEE Main scores into a State Merit Rank list (UGEAC Rank Card). Seats are allocated strictly on UGEAC State Rank and state reservation categories, not directly on CRL."
    },
    {
      question: "Counselling Portal pe locked preferences auto-lock hone se pehle manually save nahi kiya, to kya choice list delete ho jayegi?",
      options: [
        "Nahi, portal auto-locks your last saved preferences list at the deadline.",
        "Ha, process terminate ho jayega and candidate out ho jayega."
      ],
      correctAnswer: 0,
      explanation: "If you fail to lock choices, the system automatically locks the last saved preferences at the deadline. However, manual locking with OTP confirmation is highly recommended."
    },
    {
      question: "Bihar government engineering options selection preference list me maximum colleges selection ki kya limit hai?",
      options: [
        "Maximum 25 options count constraint.",
        "Unlimited options count choice filling configuration (koi extra fee nahi)."
      ],
      correctAnswer: 1,
      explanation: "UGEAC permits candidates to enter as many choices as they wish without any limit. Entering more colleges increases your chances of getting a seat."
    }
  ];

  const CUTOFF_DUEL_QUESTIONS = [
    {
      question: "CSE branch (General Category) ke liye kis institute ka closing cutoff rank low (more competitive/harder to get) hai?",
      options: [
        "Muzaffarpur Institute of Technology (MIT Muzaffarpur)",
        "Bhagalpur College of Engineering (BCE Bhagalpur)"
      ],
      correctAnswer: 0,
      stats: "MIT Muzaffarpur CSE closes ~800, whereas BCE Bhagalpur CSE closes ~1200.",
      explanation: "MIT Muzaffarpur is the oldest state engineering college with deep brand equity, drawing candidates at much lower ranks than BCE Bhagalpur."
    },
    {
      question: "General Category CSE ke liye kaun sa option relative low closing rank (higher competition) criteria draw karta hai?",
      options: [
        "Nalanda College of Engineering (NCE Chandi)",
        "Lok Nayak Jayaprakash Institute of Technology (LNJPIT Chapra)"
      ],
      correctAnswer: 0,
      stats: "NCE Chandi CSE closes ~1700, whereas LNJPIT Chapra CSE closes ~2400.",
      explanation: "NCE Chandi has better placement linkages and a longer history of academic results than LNJPIT Chapra, making it the preferred choice."
    },
    {
      question: "MIT Muzaffarpur college me in dono core branch selection me se kis branch me closing rank target top-tier hai?",
      options: [
        "Mechanical Engineering",
        "Civil Engineering"
      ],
      correctAnswer: 0,
      stats: "Mechanical closes ~3200, whereas Civil closes ~3800.",
      explanation: "Mechanical Engineering at MIT has historically high reputation and alumni base, making it close slightly faster than Civil."
    }
  ];

  const [docTracker, setDocTracker] = useState<Record<string, boolean>>({
    mark10: false,
    mark12: false,
    domicile: false,
    caste: false,
    income: false,
    medical: false,
    gap: false,
    photos: false,
  });

  const [activeHubTab, setActiveHubTab] = useState<"quiz" | "duel" | "badges">("quiz");

  // Rules Quiz states
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizCompletedState, setQuizCompletedState] = useState(false);

  // Cutoff Duel states
  const [currentDuelIndex, setCurrentDuelIndex] = useState(0);
  const [selectedDuelOption, setSelectedDuelOption] = useState<number | null>(null);
  const [duelScore, setDuelScore] = useState(0);
  const [duelAnswered, setDuelAnswered] = useState(false);
  const [duelCompletedState, setDuelCompletedState] = useState(false);

  // Persistence of badges in localStorage
  const [quizBadgeUnlocked, setQuizBadgeUnlocked] = useState(false);
  const [duelBadgeUnlocked, setDuelBadgeUnlocked] = useState(false);
  const [choicesCount, setChoicesCount] = useState(0);

  const handleAnswerQuiz = (optionIdx: number) => {
    if (quizAnswered) return;
    setSelectedQuizOption(optionIdx);
    setQuizAnswered(true);
    const isCorrect = optionIdx === UGEAC_QUIZ_QUESTIONS[currentQuizIndex].correctAnswer;
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    setQuizAnswered(false);
    setSelectedQuizOption(null);
    if (currentQuizIndex < UGEAC_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
    } else {
      setQuizCompletedState(true);
      const finalScore = quizScore + (selectedQuizOption === UGEAC_QUIZ_QUESTIONS[currentQuizIndex].correctAnswer ? 1 : 0);
      if (finalScore === UGEAC_QUIZ_QUESTIONS.length) {
        setQuizBadgeUnlocked(true);
        if (typeof window !== "undefined") {
          localStorage.setItem("bihareduconnect_quiz_completed", "true");
        }
      }
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedQuizOption(null);
    setQuizScore(0);
    setQuizAnswered(false);
    setQuizCompletedState(false);
  };

  const handleAnswerDuel = (optionIdx: number) => {
    if (duelAnswered) return;
    setSelectedDuelOption(optionIdx);
    setDuelAnswered(true);
    const isCorrect = optionIdx === CUTOFF_DUEL_QUESTIONS[currentDuelIndex].correctAnswer;
    if (isCorrect) {
      setDuelScore((prev) => prev + 1);
    }
  };

  const handleNextDuel = () => {
    setDuelAnswered(false);
    setSelectedDuelOption(null);
    if (currentDuelIndex < CUTOFF_DUEL_QUESTIONS.length - 1) {
      setCurrentDuelIndex((prev) => prev + 1);
    } else {
      setDuelCompletedState(true);
      const finalScore = duelScore + (selectedDuelOption === CUTOFF_DUEL_QUESTIONS[currentDuelIndex].correctAnswer ? 1 : 0);
      if (finalScore === CUTOFF_DUEL_QUESTIONS.length) {
        setDuelBadgeUnlocked(true);
        if (typeof window !== "undefined") {
          localStorage.setItem("bihareduconnect_cutoff_duel_completed", "true");
        }
      }
    }
  };

  const handleResetDuel = () => {
    setCurrentDuelIndex(0);
    setSelectedDuelOption(null);
    setDuelScore(0);
    setDuelAnswered(false);
    setDuelCompletedState(false);
  };


  // Daily Trivia Logic
  const triviaList = [
    "Did you know? MIT Muzaffarpur has a dedicated start-up incubation center.",
    "BCECE Board considers Category Rank first for reserved seats before Unreserved Rank.",
    "Gap Certificates can usually be made by a local notary for around ₹150-₹200.",
    "NCE Chandi boasts the highest placement packages in the IT branch among state colleges.",
    "Always keep at least 6 identical passport-size photographs ready for the nodal center.",
    "Medical Certificates must be signed by a registered Govt. Medical Officer.",
  ];
  const [dailyTrivia, setDailyTrivia] = useState("");
  
  // Mystery Box Game State
  const [mysteryOpened, setMysteryOpened] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [rewardCode, setRewardCode] = useState("");
  const [rewardDiscount, setRewardDiscount] = useState(20);

  const handleOpenMysteryBox = () => {
    if (mysteryOpened) return;
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      const discounts = [1, 2, 5, 10, 20];
      const randomDiscount = discounts[Math.floor(Math.random() * discounts.length)];
      setRewardDiscount(randomDiscount);
      setRewardCode(`UGEAC-PRO-${randomDiscount}`);
      setMysteryOpened(true);
    }, 1200);
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedDocs = localStorage.getItem("bihareduconnect_docs");
      if (storedDocs) setDocTracker(JSON.parse(storedDocs));

      // Select random trivia once on load
      setDailyTrivia(triviaList[Math.floor(Math.random() * triviaList.length)]);

      // Load quiz and duel achievements
      const quizDone = localStorage.getItem("bihareduconnect_quiz_completed");
      if (quizDone === "true") setQuizBadgeUnlocked(true);

      const duelDone = localStorage.getItem("bihareduconnect_cutoff_duel_completed");
      if (duelDone === "true") setDuelBadgeUnlocked(true);

      const storedChoices = localStorage.getItem("bihareduconnect_mock_choices");
      if (storedChoices) {
        try {
          const list = JSON.parse(storedChoices);
          setChoicesCount(list.length);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const toggleDoc = (key: string) => {
    setDocTracker((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      if (typeof window !== "undefined") {
        localStorage.setItem("bihareduconnect_docs", JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Calculate Overall Readiness Score
  const checklistValues = Object.values(checklist);
  const checklistProgress = checklistValues.filter(Boolean).length / checklistValues.length;
  
  const docValues = Object.values(docTracker);
  const docProgress = docValues.filter(Boolean).length / docValues.length;

  const badgesList = [
    { id: "doc_shield", label: "Document Shield", desc: "Possess all original reporting documents", unlocked: docProgress === 1.0, icon: "🛡️" },
    { id: "rules_wizard", label: "Rules Wizard", desc: "Score 100% on UGEAC Rules Quiz", unlocked: quizBadgeUnlocked, icon: "🧙" },
    { id: "cutoff_analyst", label: "Cutoff Analyst", desc: "Complete Cutoff Higher/Lower Duel", unlocked: duelBadgeUnlocked, icon: "📊" },
    { id: "preference_master", label: "Preference Master", desc: "Add 5+ choices in Preference Sheet", unlocked: choicesCount >= 5, icon: "📝" },
    { id: "predictor_pioneer", label: "Predictor Pioneer", desc: "Save 2+ college predictions", unlocked: savedPredictions.length >= 2, icon: "🚀" }
  ];

  const badgesProgress = badgesList.filter(b => b.unlocked).length / badgesList.length;
  
  const readinessScore = Math.round(((checklistProgress * 0.3) + (docProgress * 0.5) + (badgesProgress * 0.2)) * 100);

  if (user && user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 text-slate-800 dark:text-white font-extrabold uppercase tracking-widest text-xs">
        <span className="animate-pulse">Loading Clearance Credentials...</span>
      </div>
    );
  }

  return (
    <AuthGate>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        {/* Floating Radial Mesh Blur Backgrounds */}
        <div className="absolute top-10 left-10 w-80 h-80 bg-[#FF9933]/5 rounded-full blur-3xl pointer-events-none animate-float" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#138808]/5 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: "-3s" }} />
        <div className="absolute bottom-10 left-1/4 w-72 h-72 bg-[#2563EB]/4 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: "-6s" }} />

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB]/10 dark:bg-[#2563EB]/20 text-[#2563EB] dark:text-[#60a5fa] text-xs font-bold uppercase tracking-wider mb-4 border border-[#2563EB]/20 shadow-sm animate-pulse">
            <ShieldCheck className="w-3.5 h-3.5" />
            Candidate Dashboard
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-800 dark:text-white tracking-tight leading-none drop-shadow-sm">
            Your Personal <span className="gradient-text-premium">Counselling Hub</span>
          </h1>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 font-semibold">
            Track UGEAC admissions stages and retrieve your saved rank predictions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          
          {/* ================= LEFT SIDE: Candidate Profile & Progress Checklist (Col-4) ================= */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* Candidate Profile Details Card */}
            <div className="glass-card hover-lift rounded-2xl p-6 relative overflow-hidden">
              {/* Saffron accent banner inside card */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] to-[#2563EB]" />

              <h2 className="text-base font-extrabold text-slate-850 dark:text-white flex items-center gap-2 border-b border-gray-150/40 dark:border-slate-800/50 pb-3 mb-4">
                <User className="w-5 h-5 text-[#2563EB]" />
                Candidate Profile
              </h2>

              {user && (
                <div className="space-y-4">
                  {/* User initials avatar block */}
                  <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-gray-150/60 dark:border-slate-800/60 shadow-inner">
                    <div className="relative shrink-0 group">
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatarSeed || user.name || 'User'}&backgroundColor=c0aede`} 
                        alt="Avatar" 
                        className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-800 shadow-md group-hover:scale-105 transition-transform duration-300 bg-gradient-to-tr from-[#FF9933]/20 to-[#2563EB]/20"
                      />
                      
                      {/* Avatar Edit Button overlay */}
                      <button 
                        onClick={handleRandomizeAvatar}
                        className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                        title="Change Profile Photo"
                      >
                        <RefreshCcw className="w-5 h-5 text-white mb-0.5" />
                        <span className="text-[8px] font-bold text-white uppercase tracking-widest">Change</span>
                      </button>

                      <span className="absolute bottom-1 right-1 flex h-4 w-4 pointer-events-none">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-slate-800 shadow-sm"></span>
                      </span>
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      {isEditingName ? (
                        <div className="flex items-center gap-2 mb-1.5">
                          <input 
                            type="text" 
                            value={editNameValue}
                            onChange={(e) => setEditNameValue(e.target.value)}
                            className="w-full sm:w-auto px-2.5 py-1 text-sm font-bold bg-white dark:bg-slate-950 border border-[#2563EB]/40 rounded outline-none focus:ring-2 focus:ring-[#2563EB]/20 text-slate-800 dark:text-white"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                          />
                          <button onClick={handleSaveName} className="p-1.5 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200 transition-colors cursor-pointer" title="Save Name">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={handleCancelEditName} className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors cursor-pointer" title="Cancel">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 group/name">
                          <h3 className="font-black text-xl text-slate-850 dark:text-gray-100 leading-tight">
                            {user.name}
                          </h3>
                          <button 
                            onClick={() => {
                              setEditNameValue(user.name);
                              setIsEditingName(true);
                            }}
                            className="opacity-0 group-hover/name:opacity-100 transition-opacity p-1 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-md cursor-pointer text-gray-500 hover:text-[#2563EB]"
                            title="Edit Name"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mt-1.5">
                        {user.isAdmin ? (
                          <span className="px-2.5 py-1 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                            🛡️ Administrator
                          </span>
                        ) : hasRealEmail ? (
                          <span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                            ⚡ Standard Account
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                            <Sparkles className="w-3 h-3 text-amber-500" /> Demo Account
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Candidate credentials / info list */}
                  <div className="grid grid-cols-1 gap-2 pt-2">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50/50 dark:bg-slate-900/30 border border-gray-150/40 dark:border-slate-800/40 hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors">
                      <span className="font-extrabold uppercase tracking-widest text-[10px] text-gray-500 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-[#2563EB]" /> UGEAC General Rank (Est.)
                      </span>
                      <span className="font-black text-slate-800 dark:text-gray-100 bg-white dark:bg-slate-950 px-2.5 py-1 rounded-md border border-gray-200 dark:border-slate-800 shadow-sm text-xs">
                        {user.percentile !== undefined ? `#${Math.round(convertPercentileToUR(user.percentile))}` : "N/A"}
                      </span>
                    </div>
                    
                    {hasRealEmail && (
                      <>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50/50 dark:bg-slate-900/30 border border-gray-150/40 dark:border-slate-800/40 hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors">
                          <span className="font-extrabold uppercase tracking-widest text-[10px] text-gray-500 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-gray-400" /> Email
                          </span>
                          <span className="font-bold text-slate-700 dark:text-gray-300 text-xs truncate max-w-[170px]" title={user.email}>
                            {user.email}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50/50 dark:bg-slate-900/30 border border-gray-150/40 dark:border-slate-800/40 hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors">
                          <span className="font-extrabold uppercase tracking-widest text-[10px] text-gray-500 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-gray-400" /> Phone
                          </span>
                          <span className="font-bold text-slate-700 dark:text-gray-300 text-xs tracking-wide">
                            +91 9*******89
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50/50 dark:bg-slate-900/30 border border-gray-150/40 dark:border-slate-800/40 hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors">
                          <span className="font-extrabold uppercase tracking-widest text-[10px] text-gray-500 flex items-center gap-1.5">
                            <Key className="w-3.5 h-3.5 text-gray-400" /> Password
                          </span>
                          <span className="font-black text-slate-400 dark:text-slate-500 text-xs tracking-[0.3em]">
                            ••••••••
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Upgrade Profile CTA Form for guest/demo users */}
                  {(isDemoUser && !user.isAdmin) && (
                    <div className="p-4 bg-amber-500/5 dark:bg-amber-950/15 border border-amber-550/20 rounded-2xl space-y-3.5 backdrop-blur-md">
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wide flex items-center gap-1">
                          ⚠️ Complete Profile Verification
                        </h4>
                        <p className="text-[10px] text-gray-550 dark:text-gray-450 leading-relaxed font-semibold">
                          Upgrade your temporary guest account to a standard verified profile to unlock permanent logs, checklists, and predictors.
                        </p>
                      </div>

                      {upgradeError && (
                        <div className="p-2.5 bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold rounded-xl text-center shadow-inner">
                          {upgradeError}
                        </div>
                      )}
                      {upgradeSuccess && (
                        <div className="p-2.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold rounded-xl text-center shadow-inner">
                          {upgradeSuccess}
                        </div>
                      )}

                      <form onSubmit={handleUpgradeSubmit} className="space-y-2.5">
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                          <input
                            type="email"
                            required
                            value={upgradeEmail}
                            onChange={(e) => setUpgradeEmail(e.target.value)}
                            placeholder="Email Address"
                            className="w-full pl-9 pr-3.5 py-2 text-[11px] border border-gray-250/50 dark:border-slate-800 bg-white/50 dark:bg-slate-950 dark:text-white rounded-xl focus:outline-none focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/15 font-semibold transition-all duration-300"
                          />
                        </div>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                          <input
                            type="text"
                            required
                            value={upgradePhone}
                            onChange={(e) => setUpgradePhone(e.target.value)}
                            placeholder="10-digit Mobile No."
                            className="w-full pl-9 pr-3.5 py-2 text-[11px] border border-gray-250/50 dark:border-slate-800 bg-white/50 dark:bg-slate-950 dark:text-white rounded-xl focus:outline-none focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/15 font-semibold transition-all duration-300"
                          />
                        </div>
                        <div className="relative">
                          <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                          <input
                            type="password"
                            required
                            value={upgradePassword}
                            onChange={(e) => setUpgradePassword(e.target.value)}
                            placeholder="Create Password (Min 4 chars)"
                            className="w-full pl-9 pr-3.5 py-2 text-[11px] border border-gray-250/50 dark:border-slate-800 bg-white/50 dark:bg-slate-950 dark:text-white rounded-xl focus:outline-none focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/15 font-semibold transition-all duration-300"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isUpgrading}
                          className="w-full py-2 bg-gradient-to-r from-[#FF9933] to-[#138808] hover:shadow-lg text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer disabled:opacity-50 hover:scale-[1.01] duration-300 active:scale-[0.99] btn-premium"
                        >
                          {isUpgrading ? "Upgrading..." : "Verify & Complete Profile"}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Log Out button inside Profile Card */}
                  <button
                    onClick={logout}
                    className="w-full py-2.5 bg-red-500/10 border border-red-500/25 hover:bg-red-500 text-red-650 hover:text-white dark:text-red-400 dark:hover:text-white rounded-xl text-xs font-black uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md hover:shadow-red-500/10"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout Candidate Session
                  </button>
                </div>
              )}
            </div>

            {/* Counselling Step Tracker Card */}
            <div className="glass-card hover-lift rounded-2xl p-6 space-y-6 relative overflow-hidden">
              {/* Green accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#138808] to-[#2563EB]" />

              <div>
                <h2 className="text-base font-extrabold text-slate-850 dark:text-white flex items-center gap-2 border-b border-gray-150/40 dark:border-slate-800/50 pb-3">
                  <CheckSquare className="w-5 h-5 text-[#138808] animate-bounce" />
                  Counselling Progress checklist
                </h2>
                <p className="text-[11px] text-gray-500 dark:text-gray-450 mt-2 font-medium">
                  Tick off milestones as you advance through official BCECE engineering selection rounds.
                </p>
              </div>

              {/* Checklist items */}
              <div className="space-y-3 relative z-10">
                {[
                  { key: "register", label: "Registration & Fee Paid", desc: "Online form filled on BCECE board portal." },
                  { key: "merit", label: "State Merit Rank Released", desc: "Downloaded UGEAC Rank Card & registered rank." },
                  { key: "choice", label: "Choice Filling Submitted", desc: "Arranged target branches in choice preferences list." },
                  { key: "lock", label: "Choice Preference Locked", desc: "Choices locked with OTP verification successfully." },
                  { key: "allotment", label: "Seat Allotment Received", desc: "Round 1 or 2 allotment letter downloaded." },
                  { key: "verification", label: "Physical Verification Done", desc: "Original certificates checked at verification node." }
                ].map((step) => {
                  const checked = checklist[step.key];
                  return (
                    <button
                      key={step.key}
                      onClick={() => toggleCheck(step.key)}
                      className={`w-full text-left flex gap-3.5 p-3 rounded-xl border transition-all duration-300 hover:scale-[1.005] cursor-pointer group shadow-sm ${
                        checked
                          ? "border-[#138808]/30 bg-[#138808]/5 dark:bg-[#138808]/8 hover:bg-[#138808]/8 dark:hover:bg-[#138808]/12"
                          : "border-gray-200/50 dark:border-slate-850 bg-white/30 dark:bg-slate-950/30 hover:border-[#138808]/20 hover:bg-white/50 dark:hover:bg-slate-950/50"
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {checked ? (
                          <div className="w-5 h-5 rounded-md bg-[#138808] flex items-center justify-center text-white shadow shadow-[#138808]/30">
                            <ShieldCheck className="w-3.5 h-3.5 font-bold" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-md border border-gray-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900 group-hover:border-[#138808] transition-colors" />
                        )}
                      </div>
                      <div>
                        <h4 className={`text-xs font-black transition-colors ${checked ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-800 dark:text-gray-150"}`}>
                          {step.label}
                        </h4>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 font-semibold leading-relaxed">{step.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* ================= RIGHT SIDE: Dashboard Utilities & Gamification (Col-8) ================= */}
          <div className="lg:col-span-8 space-y-8">

            {/* Overall Counselling Readiness Score */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50 shadow-sm hover:shadow-2xl hover:shadow-[#138808]/15 transition-all duration-500 transform hover:-translate-y-1 group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#138808]/10 rounded-bl-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
              <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                <div className="shrink-0 relative">
                  {/* Glowing Gauge */}
                  <div className="w-28 h-28 rounded-full flex items-center justify-center relative shadow-inner bg-white dark:bg-slate-950">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle
                        cx="56"
                        cy="56"
                        r="46"
                        stroke="rgba(226, 232, 240, 0.4)"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="56"
                        cy="56"
                        r="46"
                        stroke="url(#readinessGradient)"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray="289"
                        strokeDashoffset={289 - (289 * readinessScore) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out drop-shadow-[0_0_6px_rgba(19,136,8,0.4)]"
                      />
                      <defs>
                        <linearGradient id="readinessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#138808" />
                          <stop offset="50%" stopColor="#22c55e" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="text-2xl font-black text-slate-800 dark:text-white z-10">{readinessScore}%</span>
                  </div>
                  {readinessScore === 100 && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center animate-bounce shadow-lg border-2 border-white dark:border-slate-900">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2 mb-1">
                    <Target className="w-6 h-6 text-[#138808]" /> Counselling Readiness Score
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-3">
                    {readinessScore === 100 ? "Amazing! You are 100% prepared for UGEAC admissions." : "Complete your checklist and document vault to reach 100% readiness before the merit list."}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-[10px] font-black text-slate-600 dark:text-gray-300 shadow-sm">
                      Checklist: {Math.round(checklistProgress * 100)}%
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-[10px] font-black text-slate-600 dark:text-gray-300 shadow-sm">
                      Documents: {Math.round(docProgress * 100)}%
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-[10px] font-black text-slate-600 dark:text-gray-300 shadow-sm">
                      Badges: {Math.round(badgesProgress * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= INTERACTIVE ASPIRANT ZONE ================= */}
            <div className="glass-card rounded-3xl p-6 relative overflow-hidden bg-gradient-to-br from-white via-slate-50/20 to-slate-100/30 dark:from-slate-900 dark:via-slate-950/20 dark:to-slate-900/30 border border-gray-150/40 dark:border-slate-800/40 shadow-sm">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-[#2563EB] to-[#138808]" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150/30 dark:border-slate-800/50 pb-4 mb-5">
                <div className="text-left">
                  <h3 className="text-lg font-black text-slate-850 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#2563EB] animate-pulse" />
                    Aspirant Interactive Zone
                  </h3>
                  <p className="text-[10px] text-gray-500 dark:text-gray-450 font-semibold mt-0.5">
                    Test your UGEAC knowledge, guess cutoff ranks, and collect unique badges!
                  </p>
                </div>
                
                {/* Navigation Tabs */}
                <div className="flex bg-slate-100/70 dark:bg-slate-950 p-1 rounded-xl border border-gray-250/20 dark:border-slate-800/30 self-start sm:self-auto shadow-inner">
                  {[
                    { id: "quiz", label: "Rules Quiz", icon: CheckCircle2 },
                    { id: "duel", label: "Cutoff Duel", icon: Target },
                    { id: "badges", label: "Badges Vault", icon: Trophy }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const active = activeHubTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveHubTab(tab.id as any)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-350 cursor-pointer ${
                          active
                            ? "bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/25"
                            : "text-slate-500 hover:text-[#2563EB] dark:text-gray-400 dark:hover:text-white"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="inline">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content: RULES QUIZ */}
              {activeHubTab === "quiz" && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  {!quizCompletedState ? (
                    <div className="bg-white/40 dark:bg-slate-900/30 rounded-2xl p-5 border border-gray-150/40 dark:border-slate-800/40 text-left">
                      {/* Progress & Score */}
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black text-[#2563EB] uppercase tracking-widest bg-[#2563EB]/10 px-2 py-0.5 rounded-md">
                          Question {currentQuizIndex + 1} of {UGEAC_QUIZ_QUESTIONS.length}
                        </span>
                        <span className="text-xs font-black text-emerald-500">
                          Score: {quizScore}
                        </span>
                      </div>

                      {/* Question Text */}
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-gray-100 leading-snug mb-4">
                        {UGEAC_QUIZ_QUESTIONS[currentQuizIndex].question}
                      </h4>

                      {/* Options */}
                      <div className="space-y-2.5">
                        {UGEAC_QUIZ_QUESTIONS[currentQuizIndex].options.map((option, idx) => {
                          const isSelected = selectedQuizOption === idx;
                          const isCorrect = idx === UGEAC_QUIZ_QUESTIONS[currentQuizIndex].correctAnswer;
                          const showCorrectStyle = quizAnswered && isCorrect;
                          const showIncorrectStyle = quizAnswered && isSelected && !isCorrect;

                          return (
                            <button
                              key={idx}
                              onClick={() => handleAnswerQuiz(idx)}
                              disabled={quizAnswered}
                              className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-between gap-3 ${
                                showCorrectStyle
                                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : showIncorrectStyle
                                  ? "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400"
                                  : isSelected
                                  ? "border-[#2563EB] bg-[#2563EB]/5 text-[#2563EB] dark:text-white"
                                  : "border-gray-200/50 dark:border-slate-850 hover:border-[#2563EB]/30 bg-white/40 dark:bg-slate-950/40 text-slate-700 dark:text-gray-300 cursor-pointer"
                              }`}
                            >
                              <span>{option}</span>
                              {quizAnswered && (
                                <span className="shrink-0">
                                  {isCorrect ? (
                                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                  ) : isSelected ? (
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                  ) : null}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation box on answer */}
                      {quizAnswered && (
                        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-gray-200 dark:border-slate-800 text-xs text-slate-650 dark:text-gray-400 leading-relaxed font-semibold animate-in slide-in-from-top-2 duration-300">
                          <span className="font-black text-[#2563EB] block mb-1">📢 Rule Explanation:</span>
                          {UGEAC_QUIZ_QUESTIONS[currentQuizIndex].explanation}
                        </div>
                      )}

                      {/* Next Button */}
                      {quizAnswered && (
                        <button
                          onClick={handleNextQuiz}
                          className="mt-4 w-full py-2.5 bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 cursor-pointer animate-in zoom-in duration-200"
                        >
                          {currentQuizIndex < UGEAC_QUIZ_QUESTIONS.length - 1 ? "Next Question" : "View Results"}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    // Quiz Result State
                    <div className="bg-white/40 dark:bg-slate-900/30 rounded-2xl p-6 border border-gray-150/40 dark:border-slate-800/40 text-center space-y-4">
                      <div className="text-5xl">🏆</div>
                      <div>
                        <h4 className="font-black text-lg text-slate-800 dark:text-white">Quiz Completed!</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1">
                          You scored <span className="text-[#2563EB] font-black">{quizScore} / {UGEAC_QUIZ_QUESTIONS.length}</span>
                        </p>
                      </div>

                      {quizScore === UGEAC_QUIZ_QUESTIONS.length ? (
                        <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold max-w-sm mx-auto">
                          🎉 Perfect Score! You have unlocked the <span className="underline font-black">🧙 Rules Wizard Badge</span> in your vault.
                        </div>
                      ) : (
                        <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-xl text-xs font-semibold max-w-sm mx-auto">
                          Get 100% correct answers to unlock the Counselling Rules Wizard Badge! Try again.
                        </div>
                      )}

                      <div className="flex justify-center gap-3">
                        <button
                          onClick={handleResetQuiz}
                          className="px-5 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                        >
                          Retry Quiz
                        </button>
                        {quizScore === UGEAC_QUIZ_QUESTIONS.length && (
                          <button
                            onClick={() => setActiveHubTab("badges")}
                            className="px-5 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                          >
                            View Vault
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab Content: CUTOFF DUEL */}
              {activeHubTab === "duel" && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  {!duelCompletedState ? (
                    <div className="bg-white/40 dark:bg-slate-900/30 rounded-2xl p-5 border border-gray-150/40 dark:border-slate-800/40 text-left">
                      {/* Progress & Score */}
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black text-[#FF9933] uppercase tracking-widest bg-[#FF9933]/10 px-2 py-0.5 rounded-md">
                          Duel {currentDuelIndex + 1} of {CUTOFF_DUEL_QUESTIONS.length}
                        </span>
                        <span className="text-xs font-black text-emerald-500">
                          Score: {duelScore}
                        </span>
                      </div>

                      {/* Question Text */}
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-gray-100 leading-snug mb-4">
                        {CUTOFF_DUEL_QUESTIONS[currentDuelIndex].question}
                      </h4>

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {CUTOFF_DUEL_QUESTIONS[currentDuelIndex].options.map((option, idx) => {
                          const isSelected = selectedDuelOption === idx;
                          const isCorrect = idx === CUTOFF_DUEL_QUESTIONS[currentDuelIndex].correctAnswer;
                          const showCorrectStyle = duelAnswered && isCorrect;
                          const showIncorrectStyle = duelAnswered && isSelected && !isCorrect;

                          return (
                            <button
                              key={idx}
                              onClick={() => handleAnswerDuel(idx)}
                              disabled={duelAnswered}
                              className={`text-left p-4 rounded-xl border text-xs sm:text-sm font-bold transition-all duration-300 flex flex-col justify-between min-h-[100px] ${
                                showCorrectStyle
                                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm"
                                  : showIncorrectStyle
                                  ? "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400 shadow-sm"
                                  : isSelected
                                  ? "border-[#FF9933] bg-[#FF9933]/5 text-[#FF9933] dark:text-white shadow-sm"
                                  : "border-gray-200/50 dark:border-slate-850 hover:border-[#FF9933]/30 bg-white/40 dark:bg-slate-955/40 text-slate-700 dark:text-gray-300 cursor-pointer"
                              }`}
                            >
                              <span className="block mb-2">{option}</span>
                              <div className="flex items-center justify-between w-full mt-auto pt-2 border-t border-gray-150/10 dark:border-slate-800/20">
                                <span className="text-[10px] text-gray-450 dark:text-gray-500 font-black tracking-widest uppercase">
                                  {idx === 0 ? "Option A" : "Option B"}
                                </span>
                                {duelAnswered && (
                                  <span className="shrink-0">
                                    {isCorrect ? (
                                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                                    ) : isSelected ? (
                                      <AlertCircle className="w-4.5 h-4.5 text-red-500" />
                                    ) : null}
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation box on answer */}
                      {duelAnswered && (
                        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-gray-200 dark:border-slate-800 text-xs text-slate-650 dark:text-gray-400 leading-relaxed font-semibold animate-in slide-in-from-top-2 duration-300">
                          <span className="font-black text-[#FF9933] block mb-1">📊 Cutoff Analysis:</span>
                          <div className="font-bold text-slate-750 dark:text-gray-300 mb-1">
                            {CUTOFF_DUEL_QUESTIONS[currentDuelIndex].stats}
                          </div>
                          {CUTOFF_DUEL_QUESTIONS[currentDuelIndex].explanation}
                        </div>
                      )}

                      {/* Next Button */}
                      {duelAnswered && (
                        <button
                          onClick={handleNextDuel}
                          className="mt-4 w-full py-2.5 bg-gradient-to-r from-[#FF9933] to-[#d97706] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 cursor-pointer animate-in zoom-in duration-200"
                        >
                          {currentDuelIndex < CUTOFF_DUEL_QUESTIONS.length - 1 ? "Next Duel" : "View Results"}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    // Duel Result State
                    <div className="bg-white/40 dark:bg-slate-900/30 rounded-2xl p-6 border border-gray-150/40 dark:border-slate-800/40 text-center space-y-4">
                      <div className="text-5xl">🎯</div>
                      <div>
                        <h4 className="font-black text-lg text-slate-800 dark:text-white">Duel Completed!</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1">
                          You scored <span className="text-[#FF9933] font-black">{duelScore} / {CUTOFF_DUEL_QUESTIONS.length}</span>
                        </p>
                      </div>

                      {duelScore === CUTOFF_DUEL_QUESTIONS.length ? (
                        <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold max-w-sm mx-auto">
                          🎉 Perfect Guessing! You have unlocked the <span className="underline font-black">📊 Cutoff Analyst Badge</span> in your vault.
                        </div>
                      ) : (
                        <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-xl text-xs font-semibold max-w-sm mx-auto">
                          Get 100% correct guesses to unlock the Cutoff Analyst Badge! Try again.
                        </div>
                      )}

                      <div className="flex justify-center gap-3">
                        <button
                          onClick={handleResetDuel}
                          className="px-5 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                        >
                          Retry Duel
                        </button>
                        {duelScore === CUTOFF_DUEL_QUESTIONS.length && (
                          <button
                            onClick={() => setActiveHubTab("badges")}
                            className="px-5 py-2 bg-[#FF9933] hover:bg-[#d97706] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                          >
                            View Vault
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab Content: ACHIVEMENT BADGES */}
              {activeHubTab === "badges" && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-gray-150/20 dark:border-slate-800/30 text-center">
                    <h4 className="text-xs font-black text-slate-850 dark:text-gray-305 uppercase tracking-widest mb-1">
                      Counselling Achievements Badge Vault
                    </h4>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">
                      Unlock all 5 badges to raise your Readiness Score to 100% and prepare for merit lists.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {badgesList.map((badge) => {
                      return (
                        <div
                          key={badge.id}
                          className={`p-4 rounded-2xl border relative overflow-hidden transition-all duration-300 shadow-sm ${
                            badge.unlocked
                              ? "bg-gradient-to-tr from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/60 border-amber-500/30 dark:border-amber-500/25 hover:shadow-md hover:shadow-amber-500/5 group/badge"
                              : "bg-white/10 dark:bg-slate-955/20 border-gray-200/40 dark:border-slate-900/40 opacity-70 grayscale"
                          }`}
                        >
                          {badge.unlocked && (
                            <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/10 rounded-bl-full pointer-events-none flex items-center justify-center">
                              <Crown className="w-3.5 h-3.5 text-amber-500" />
                            </div>
                          )}

                          <div className="flex items-start gap-3 relative z-10">
                            <div className={`text-3xl shrink-0 p-1.5 rounded-xl ${badge.unlocked ? "bg-amber-100 dark:bg-amber-950/30 animate-pulse" : "bg-gray-100 dark:bg-slate-900"}`}>
                              {badge.unlocked ? badge.icon : "🔒"}
                            </div>
                            <div className="text-left">
                              <h5 className={`text-xs font-black tracking-wide ${badge.unlocked ? "text-slate-850 dark:text-white" : "text-gray-500 dark:text-gray-550"}`}>
                                {badge.label}
                              </h5>
                              <p className="text-[9px] text-gray-500 dark:text-gray-450 font-semibold leading-normal mt-0.5">
                                {badge.desc}
                              </p>
                              <span className={`inline-block text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md mt-2.5 ${
                                badge.unlocked
                                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                  : "bg-gray-100 dark:bg-slate-900 text-gray-400"
                              }`}>
                                {badge.unlocked ? "Unlocked" : "Locked"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Digital Document Vault */}
              <div className="glass-card hover-lift rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] to-[#FF9933]" />
                <h2 className="text-base font-extrabold text-slate-850 dark:text-white flex items-center gap-2 mb-2 border-b border-gray-150/40 dark:border-slate-800/50 pb-3">
                  <FileCheck className="w-5 h-5 text-[#2563EB]" /> Digital Document Vault
                </h2>
                <p className="text-[10px] text-gray-500 mb-4 font-semibold">Verify you possess all original physical copies required for nodal center reporting.</p>
                <div className="space-y-2">
                  {[
                    { key: "mark10", label: "10th Marksheet & Passing Cert." },
                    { key: "mark12", label: "12th Marksheet & Passing Cert." },
                    { key: "domicile", label: "Bihar Domicile (Residential) Cert." },
                    { key: "caste", label: "Caste / EWS Certificate" },
                    { key: "income", label: "Family Income Certificate" },
                    { key: "medical", label: "Medical Fitness Certificate" },
                    { key: "gap", label: "Gap Certificate (if applicable)" },
                    { key: "photos", label: "6 Passport Size Photos" },
                  ].map((doc) => (
                    <label key={doc.key} className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 dark:border-slate-800 hover:border-[#2563EB]/40 bg-white/40 dark:bg-slate-900/40 cursor-pointer transition-colors group">
                      <input
                        type="checkbox"
                        checked={docTracker[doc.key]}
                        onChange={() => toggleDoc(doc.key)}
                        className="w-4 h-4 rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB]"
                      />
                      <span className={`text-xs font-bold transition-colors ${docTracker[doc.key] ? "text-slate-400 dark:text-slate-500 line-through" : "text-slate-700 dark:text-gray-300"}`}>
                        {doc.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                {/* Daily Mystery Box Game */}
                <div className="glass-card rounded-3xl p-1 shadow-sm relative overflow-hidden group border-0 bg-gradient-to-br from-[#FF9933]/20 via-transparent to-[#2563EB]/20">
                  <div className="bg-white/90 dark:bg-slate-900/90 rounded-[22px] p-6 h-full flex flex-col items-center justify-center text-center relative z-10 backdrop-blur-md">
                    {!mysteryOpened ? (
                      <div className="space-y-4 w-full">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF9933]/10 text-[#FF9933] text-[10px] font-black uppercase tracking-widest border border-[#FF9933]/20">
                          <Crown className="w-3.5 h-3.5" />
                          Daily Challenge
                        </div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-white">
                          Unlock Your Mystery Box
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2">
                          Tap the box to reveal today's UGEAC insider tip and a special reward code!
                        </p>
                        <button
                          onClick={handleOpenMysteryBox}
                          disabled={isShaking}
                          className={`text-6xl cursor-pointer hover:scale-110 transition-transform ${isShaking ? "animate-bounce" : "animate-pulse"}`}
                          style={isShaking ? { animationDuration: "0.2s" } : {}}
                        >
                          🎁
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4 w-full animate-in zoom-in duration-500">
                        <div className="text-4xl animate-bounce">🎉</div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                          <Sparkles className="w-3.5 h-3.5" />
                          Mystery Unlocked!
                        </div>
                        
                        <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-dashed border-gray-200 dark:border-slate-800">
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Today's Insider Tip</h4>
                          <p className="text-xs text-slate-700 dark:text-slate-300 font-bold leading-relaxed">
                            {dailyTrivia}
                          </p>
                        </div>

                        <div className="bg-gradient-to-r from-[#FF9933]/10 to-[#138808]/10 rounded-xl p-3 border border-[#138808]/20 flex items-center justify-between">
                          <div className="text-left">
                            <h4 className="text-[10px] font-black text-[#138808] uppercase tracking-widest mb-0.5">Bonus Reward Code</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Get {rewardDiscount}% off Premium Simulator</p>
                          </div>
                          <span className="px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-sm font-black text-slate-800 dark:text-white font-mono tracking-widest shadow-sm">
                            {rewardCode}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Preference Sheet Simulator Card */}
                <div className="glass-card hover-lift rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br from-[#2563EB]/5 to-transparent border border-gray-150 dark:border-slate-800">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] to-[#138808]" />
                  
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60a5fa] rounded-xl shrink-0">
                      <Laptop className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-850 dark:text-white text-left">
                        Preference Sheet Worksheet
                      </h3>
                      <p className="text-[10px] text-gray-500 font-semibold mt-1 text-left">
                        Build and optimize your college choice arrangement using our real-time AI analyzer.
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-300 font-semibold leading-relaxed mb-5 text-left">
                    Order your options, evaluate your list's health index score, check location details, and print/share your locked list.
                  </p>

                  <Link
                    href="/choices"
                    className="w-full py-2.5 bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg hover:from-[#1d4ed8] hover:to-[#173eab] flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01] transition-all"
                  >
                    Open Simulator
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            </div>
            
            {/* Saved Predictions log */}
            <div className="glass-card hover-lift rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] to-[#138808]" />

              <h2 className="text-base font-extrabold text-slate-850 dark:text-white flex items-center gap-2 mb-6 border-b border-gray-150/40 dark:border-slate-800/50 pb-3">
                <TrendingUp className="w-5 h-5 text-[#FF9933]" />
                Saved Predictions Log ({savedPredictions.length})
              </h2>

              {savedPredictions.length === 0 ? (
                <div className="py-16 text-center relative z-10">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-950 flex items-center justify-center mx-auto mb-4 border border-gray-250/20 dark:border-slate-800/30">
                    <Compass className="w-8 h-8 text-gray-450 dark:text-slate-650 animate-spin" style={{ animationDuration: "12s" }} />
                  </div>
                  <h4 className="font-extrabold text-slate-700 dark:text-slate-300">No Saved Predictions Yet</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 max-w-xs mx-auto leading-relaxed font-semibold">
                    Run the College Predictor and click the bookmark icon to save specific course results here.
                  </p>
                  <Link
                    href="/predictor"
                    className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-gradient-to-r from-[#FF9933] to-[#138808] text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer btn-premium"
                  >
                    Predict Colleges Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 relative z-10">
                  {savedPredictions.map((pred) => (
                    <div
                      key={pred.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border border-gray-200/50 dark:border-slate-850/70 rounded-2xl hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 bg-white/20 dark:bg-slate-950/20 hover:bg-white/60 dark:hover:bg-slate-950/60 shadow-sm relative overflow-hidden group/pred ${
                        pred.chance === "High"
                          ? "border-l-[5px] border-l-emerald-500 hover:shadow-emerald-500/10"
                          : pred.chance === "Moderate"
                          ? "border-l-[5px] border-l-amber-500 hover:shadow-amber-500/10"
                          : "border-l-[5px] border-l-slate-400 hover:shadow-slate-400/10"
                      }`}
                    >
                      {/* Decorative hover sweep */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 dark:via-white/5 to-white/0 translate-x-[-100%] group-hover/pred:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                      
                      <div className="relative z-10">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[9px] text-[#2563EB] dark:text-[#60a5fa] font-black uppercase tracking-widest bg-[#2563EB]/10 dark:bg-[#2563EB]/20 px-2 py-0.5 rounded-md border border-[#2563EB]/25">
                            Rank: {pred.rank}
                          </span>
                          <span className="text-[9px] text-slate-550 dark:text-gray-400 font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-md border border-gray-250/20 dark:border-slate-800/30">
                            Category: {pred.category}
                          </span>
                        </div>
                        <h4 className="font-black text-sm sm:text-base text-slate-850 dark:text-gray-100 leading-snug mt-2">
                          {pred.collegeName}
                        </h4>
                        <p className="text-xs text-slate-650 dark:text-slate-350 font-bold mt-1">
                          Course: <span className="text-[#FF9933]">{pred.branchName} ({pred.branchCode})</span>
                        </p>
                        <span className="text-[9px] text-gray-450 dark:text-gray-500 flex items-center gap-1 mt-2.5 font-bold">
                          <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                          Saved on {pred.date}
                        </span>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 border-dashed border-gray-200/50 dark:border-slate-800/50 pt-3 sm:pt-0">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${getChanceBadge(pred.chance)}`}>
                          {pred.chance} Chance
                        </span>
                        <button
                          onClick={() => deletePrediction(pred.id)}
                          className="p-2.5 border border-gray-200/60 dark:border-slate-800 hover:border-red-500/30 text-gray-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-500/5 rounded-xl cursor-pointer transition-colors shadow-sm"
                          title="Delete log entry"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Refer and Earn Premium Counselling Block */}
            <div className="glass-card hover-lift rounded-2xl p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-[#2563EB]/10 via-white to-[#FF9933]/10 dark:from-[#2563EB]/20 dark:via-slate-900 dark:to-[#FF9933]/20 border border-[#2563EB]/20 shadow-md">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FF9933]/20 to-[#2563EB]/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
              
              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                {/* Graphics Side */}
                <div className="shrink-0 flex items-center justify-center relative w-24 h-24 sm:w-32 sm:h-32">
                  <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-gray-100 dark:border-slate-700 flex items-center justify-center animate-bounce" style={{ animationDuration: "3s" }}>
                    <div className="text-4xl sm:text-5xl">🎁</div>
                  </div>
                  <Sparkles className="w-8 h-8 text-[#FF9933] absolute -top-2 -right-2 animate-pulse" />
                  <Trophy className="w-8 h-8 text-[#2563EB] absolute -bottom-2 -left-2" />
                </div>
                
                {/* Content Side */}
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#FF9933] to-[#2563EB] text-white text-[10px] font-black uppercase tracking-widest shadow-sm mb-3">
                    <Crown className="w-3.5 h-3.5" /> Refer & Earn
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white leading-tight mb-2">
                    Unlock Premium Counselling <br className="hidden sm:block" /> <span className="text-[#2563EB]">For FREE!</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-semibold mb-4">
                    Invite 5 friends to register on BiharEduConnect. Once they sign up, you'll instantly get a 100% discount code to unlock the full Premium Simulator & Handbook!
                  </p>
                  
                  {/* Progress Tracker */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Your Progress</span>
                      <span className="text-xs font-black text-[#FF9933]">0 / 5 Friends</span>
                    </div>
                    <div className="w-full h-2.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-[#FF9933] to-[#2563EB] transition-all duration-1000 ease-out" style={{ width: "5%" }} />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button 
                      onClick={() => alert("Referral link copied to clipboard: bihareduconnect.com/?ref=UGEAC" + user?.name?.slice(0,4).toUpperCase())}
                      className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                      Copy Invite Link
                    </button>
                    <a 
                      href={`https://wa.me/?text=Check out BiharEduConnect to predict your UGEAC engineering college! Register here: bihareduconnect.com/?ref=UGEAC${user?.name?.slice(0,4).toUpperCase()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-6 py-2.5 bg-[#138808] hover:bg-[#0f6b06] text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
                    >
                      Share on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AuthGate>
  );
}
