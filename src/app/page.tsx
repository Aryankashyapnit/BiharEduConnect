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
  const { colleges, addCollege, updateCollege, deleteCollege } = useApp();

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Admin Panel Local States
  const [successMsg, setSuccessMsg] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formEstablished, setFormEstablished] = useState<number>(2008);
  const [formNirf, setFormNirf] = useState<number | "">("");
  const [formAvgPack, setFormAvgPack] = useState<number>(4.0);
  const [formHighestPack, setFormHighestPack] = useState<number>(10.0);
  const [formTuition, setFormTuition] = useState<number>(8500);
  const [formHostelAvail, setFormHostelAvail] = useState(true);
  const [formHostelFee, setFormHostelFee] = useState<number>(9000);
  const [formWebsite, setFormWebsite] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCampusSize, setFormCampusSize] = useState("35 Acres");
  const [formBranches, setFormBranches] = useState("CSE, ECE, EE, ME, CE");

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setIsEditing(false);
    setFormName("");
    setFormCode("");
    setFormLocation("");
    setFormEstablished(2010);
    setFormNirf("");
    setFormAvgPack(4.0);
    setFormHighestPack(9.0);
    setFormTuition(8500);
    setFormHostelAvail(true);
    setFormHostelFee(9000);
    setFormWebsite("https://example.edu");
    setFormDescription("A government college of engineering in Bihar.");
    setFormCampusSize("30 Acres");
    setFormBranches("CSE, ECE, EE, ME, CE");
  };

  const handleEditClick = (col: College) => {
    setIsEditing(true);
    setIsCreating(false);
    setEditingId(col.id);

    setFormName(col.name);
    setFormCode(col.code);
    setFormLocation(col.location);
    setFormEstablished(col.established);
    setFormNirf(col.nirf || "");
    setFormAvgPack(col.averagePackage);
    setFormHighestPack(col.highestPackage);
    setFormTuition(col.tuitionFee);
    setFormHostelAvail(col.hostelAvailable);
    setFormHostelFee(col.hostelFee);
    setFormWebsite(col.website);
    setFormDescription(col.description);
    setFormCampusSize(col.campusSize);
    setFormBranches(col.branches.join(", "));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const branchesArray = formBranches.split(",").map(b => b.trim().toUpperCase()).filter(b => b.length > 0);

    const updatedColObj: College = {
      id: isEditing && editingId ? editingId : formName.toLowerCase().replace(/\s+/g, "-"),
      name: formName,
      code: formCode,
      location: formLocation,
      established: formEstablished,
      nirf: formNirf === "" ? null : Number(formNirf),
      averagePackage: Number(formAvgPack),
      highestPackage: Number(formHighestPack),
      tuitionFee: Number(formTuition),
      hostelAvailable: formHostelAvail,
      hostelFee: formHostelAvail ? Number(formHostelFee) : 0,
      website: formWebsite,
      description: formDescription,
      campusSize: formCampusSize,
      branches: branchesArray,
      recruits: ["TCS", "Wipro", "Infosys", "L&T"],
      image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600"
    };

    if (isEditing) {
      updateCollege(updatedColObj);
      showNotification("College profile updated successfully!");
    } else {
      addCollege(updatedColObj);
      showNotification("New College profile created successfully!");
    }

    setIsEditing(false);
    setIsCreating(false);
    setEditingId(null);
  };

  const handleDeleteClick = (id: string) => {
    if (confirm("Are you sure you want to delete this college profile? This will immediately remove it from Predictor and Directory views.")) {
      deleteCollege(id);
      showNotification("College profile deleted successfully!");
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
    { date: "July 1, 2026", title: "UGEAC-2026 Online Registration Commences", status: "Upcoming", badge: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" },
    { date: "July 20, 2026", title: "Official UGEAC Merit List & State Ranks Release", status: "Upcoming", badge: "bg-blue-500/10 text-blue-500 border border-blue-500/20" },
    { date: "July 22 - 26, 2026", title: "Online Choice Filling & Choice Locking Window", status: "Action Needed", badge: "bg-[#FF9933]/10 text-[#FF9933] border border-[#FF9933]/20" },
    { date: "August 1, 2026", title: "Round 1 Seat Allotment Publication", status: "Upcoming", badge: "bg-purple-500/10 text-purple-500 border border-purple-500/20" },
    { date: "August 2 - 6, 2026", title: "Round 1 Physical Document Verification (DV) & Admission", status: "Mandatory", badge: "bg-red-500/10 text-red-500 border border-red-500/20" }
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
                  className="px-6 py-3.5 bg-gradient-to-r from-[#FF9933] to-[#138808] hover:shadow-lg shadow-[#138808]/20 text-white font-bold rounded-xl text-sm flex items-center gap-1.5 transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  Predict My College
                  <ArrowRight className="w-4.5 h-4.5" />
                </Link>
                <Link
                  href="/cutoffs"
                  className="px-6 py-3.5 border border-gray-300 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-850 dark:text-gray-300 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Check Cutoffs
                </Link>
                <Link
                  href="/guide"
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

      {/* 7. ADMINISTRATIVE ACCESS PORTAL SECTION */}
      <section id="admin-panel" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-250 dark:border-slate-900 transition-colors scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldAlert className="w-3.5 h-3.5" />
            Administrative Control Area
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            BiharEduConnect <span className="text-amber-500">Database Administration</span>
          </h2>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Create new college entries, update placement averages, edit dynamic branches, or delete college files instantly.
          </p>
        </div>

        {successMsg && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl flex items-center gap-2 text-sm font-bold shadow-sm">
            <CheckCircle className="w-5 h-5 shrink-0" />
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Edit / Creation form sidepanel */}
          {(isCreating || isEditing) && (
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-md relative">
              <button
                type="button"
                onClick={() => { setIsEditing(false); setIsCreating(false); }}
                className="absolute top-4 right-4 text-gray-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-4 flex items-center gap-1.5 border-b border-gray-100 dark:border-slate-850 pb-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                {isEditing ? "Edit College Profile" : "Create New College Profile"}
              </h3>

              <form onSubmit={handleSave} className="space-y-3.5 text-[11px]">
                <div>
                  <label className="block font-bold text-gray-400 uppercase mb-1">College Name</label>
                  <input
                    type="text" required value={formName} onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Gaya College of Engineering"
                    className="w-full px-3 py-2 border border-gray-250 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 dark:text-white rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-400 uppercase mb-1">Unique Code</label>
                    <input
                      type="text" required value={formCode} onChange={(e) => setFormCode(e.target.value)}
                      placeholder="e.g. GCE-GAYA"
                      className="w-full px-3 py-2 border border-gray-250 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 dark:text-white rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-400 uppercase mb-1">Location (City)</label>
                    <input
                      type="text" required value={formLocation} onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="e.g. Gaya"
                      className="w-full px-3 py-2 border border-gray-250 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 dark:text-white rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-bold text-gray-400 uppercase mb-1">Established</label>
                    <input
                      type="number" required value={formEstablished} onChange={(e) => setFormEstablished(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-250 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 dark:text-white rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-400 uppercase mb-1">NIRF Rank</label>
                    <input
                      type="number" value={formNirf} onChange={(e) => setFormNirf(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="None"
                      className="w-full px-3 py-2 border border-gray-250 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 dark:text-white rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-400 uppercase mb-1">Campus Size</label>
                    <input
                      type="text" required value={formCampusSize} onChange={(e) => setFormCampusSize(e.target.value)}
                      placeholder="35 Acres"
                      className="w-full px-3 py-2 border border-gray-250 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 dark:text-white rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-400 uppercase mb-1">Avg Placement (LPA)</label>
                    <input
                      type="number" step="0.1" required value={formAvgPack} onChange={(e) => setFormAvgPack(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-250 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 dark:text-white rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-400 uppercase mb-1">Max Placement (LPA)</label>
                    <input
                      type="number" step="0.1" required value={formHighestPack} onChange={(e) => setFormHighestPack(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-250 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 dark:text-white rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-400 uppercase mb-1">Tuition Fee (Annual)</label>
                    <input
                      type="number" required value={formTuition} onChange={(e) => setFormTuition(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-250 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 dark:text-white rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-400 uppercase mb-1">Hostel Fee (Annual)</label>
                    <input
                      type="number" required={formHostelAvail} disabled={!formHostelAvail} value={formHostelFee} onChange={(e) => setFormHostelFee(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-250 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 dark:text-white rounded-lg focus:outline-none focus:border-amber-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox" id="home-hostel" checked={formHostelAvail} onChange={(e) => setFormHostelAvail(e.target.checked)}
                    className="rounded text-amber-550 focus:ring-amber-500 cursor-pointer"
                  />
                  <label htmlFor="home-hostel" className="font-bold text-slate-700 dark:text-gray-300 cursor-pointer">Hostel Facilities Available</label>
                </div>

                <div>
                  <label className="block font-bold text-gray-400 uppercase mb-1">Branches (Comma separated)</label>
                  <input
                    type="text" required value={formBranches} onChange={(e) => setFormBranches(e.target.value)}
                    placeholder="CSE, ECE, EE, ME, CE"
                    className="w-full px-3 py-2 border border-gray-250 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 dark:text-white rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-400 uppercase mb-1">Official Website</label>
                  <input
                    type="url" required value={formWebsite} onChange={(e) => setFormWebsite(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-250 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 dark:text-white rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-400 uppercase mb-1">Description Profile</label>
                  <textarea
                    required value={formDescription} onChange={(e) => setFormDescription(e.target.value)}
                    rows={2} placeholder="Provide overview description..."
                    className="w-full px-3 py-2 border border-gray-250 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 dark:text-white rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer mt-3"
                >
                  <Save className="w-4 h-4" />
                  {isEditing ? "Save Profile Details" : "Create College Profile"}
                </button>
              </form>
            </div>
          )}

          {/* Database Grid list of colleges */}
          <div className={(isCreating || isEditing) ? "lg:col-span-7" : "lg:col-span-12"}>
            <div className="bg-white dark:bg-slate-900 border border-gray-250/70 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-200 dark:border-slate-850 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900">
                <div>
                  <h4 className="font-extrabold text-slate-850 dark:text-white flex items-center gap-1.5 text-sm">
                    <Building className="w-4.5 h-4.5 text-amber-500" />
                    Manage Colleges Datastore
                  </h4>
                </div>

                {!(isCreating || isEditing) && (
                  <button
                    type="button"
                    onClick={handleCreateNew}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 animate-bounce" />
                    Add College Record
                  </button>
                )}
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 text-gray-450 dark:text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="px-5 py-3">College (Code)</th>
                      <th className="px-5 py-3">Estd</th>
                      <th className="px-5 py-3">Avg Placements</th>
                      <th className="px-5 py-3 text-center">Branches</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 dark:divide-slate-800/80 font-semibold text-slate-700 dark:text-gray-300">
                    {colleges.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="font-bold text-slate-800 dark:text-gray-150 leading-snug">{c.name}</div>
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block mt-0.5">Code: {c.code} | {c.location}</span>
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-350">
                          {c.established}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-[#138808]">
                          {c.averagePackage.toFixed(2)} LPA
                        </td>
                        <td className="px-5 py-3.5 text-center font-bold text-[#2563EB]">
                          {c.branches.length}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => handleEditClick(c)}
                              className="p-1.5 border border-gray-200 dark:border-slate-800 text-gray-400 hover:text-amber-500 hover:bg-amber-500/5 rounded-lg cursor-pointer"
                              title="Edit College Profile"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteClick(c.id)}
                              className="p-1.5 border border-gray-200 dark:border-slate-800 text-gray-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg cursor-pointer"
                              title="Delete College Profile"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
