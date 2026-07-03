"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { branchNames } from "../../data/colleges";
import { getCutoff } from "../../data/cutoffs";
import { 
  GitCompare, 
  Building, 
  MapPin, 
  Calendar, 
  Layers, 
  TrendingUp, 
  Award, 
  DollarSign, 
  Search,
  BookOpen,
  Briefcase,
  HelpCircle
} from "lucide-react";
import { AuthGate } from "../../components/AuthGate";

export default function CompareTools() {
  const { colleges } = useApp();

  // 1. College Compare State
  const [col1, setCol1] = useState(colleges[0]?.id || "");
  const [col2, setCol2] = useState(colleges[1]?.id || "");
  const [col3, setCol3] = useState(colleges[2]?.id || "");

  // Cutoff comparison states
  const [cutoffCategory, setCutoffCategory] = useState("UR");
  const [cutoffBranch, setCutoffBranch] = useState("CSE");

  const college1Obj = colleges.find((c) => c.id === col1);
  const college2Obj = colleges.find((c) => c.id === col2);
  const college3Obj = colleges.find((c) => c.id === col3);

  // 2. Branch Compare State
  const [branch1, setBranch1] = useState("CSE");
  const [branch2, setBranch2] = useState("ECE");

  const branchDetails: Record<string, {
    popularity: string;
    subjects: string[];
    careers: string[];
    difficulty: string;
    scope: string;
  }> = {
    CSE: {
      popularity: "Highest (1st Choice)",
      subjects: ["Data Structures", "Algorithms", "Database Systems", "Operating Systems", "Web Dev"],
      careers: ["Software Engineer", "Web Developer", "Data Scientist", "Cloud Architect"],
      difficulty: "Moderate",
      scope: "High growth in IT, corporate tech hubs, and startup ecosystem."
    },
    ECE: {
      popularity: "High (2nd Choice)",
      subjects: ["Digital Electronics", "Microprocessors", "Signal Processing", "VLSI Design", "Analog Circuits"],
      careers: ["Embedded Systems Engg", "VLSI Designer", "Telecom Engineer", "Hardware Specialist"],
      difficulty: "High",
      scope: "Growing rapidly with the semiconductor push and 5G/6G rollouts in India."
    },
    EE: {
      popularity: "Medium (3rd Choice)",
      subjects: ["Power Systems", "Control Systems", "Electrical Machines", "Circuit Theory", "Renewable Energy"],
      careers: ["Power Grid Engineer", "Controls Engineer", "Energy Auditor", "Substation Manager"],
      difficulty: "High",
      scope: "Consistent jobs in PSU sectors (NTPC, PowerGrid, BHEL) and EV/solar industries."
    },
    EEE: {
      popularity: "Medium",
      subjects: ["Power Electronics", "Analog Electronics", "Control Theory", "Machines", "Digital Systems"],
      careers: ["Automation Engineer", "Renewable energy consultant", "PSU Executive"],
      difficulty: "High",
      scope: "Combines electrical systems with electronic smart controls. Very versatile."
    },
    ME: {
      popularity: "Moderate",
      subjects: ["Thermodynamics", "Fluid Mechanics", "Fluid Machines", "CAD/CAM", "Machine Design"],
      careers: ["Automotive Engineer", "Production Executive", "Thermal Analyst", "HVAC Engineer"],
      difficulty: "Moderate",
      scope: "Traditional core engineering jobs, public sector units, and aerospace fields."
    },
    CE: {
      popularity: "Moderate",
      subjects: ["Structural Analysis", "Geotechnical Engg", "Concrete Technology", "Transportation", "Surveying"],
      careers: ["Structural Engineer", "Site Inspector", "Urban Planner", "Civil Contractor"],
      difficulty: "Moderate",
      scope: "High opportunities in government jobs (BPSC AE, JE), railways, and infrastructures."
    }
  };

  const b1Info = branchDetails[branch1] || branchDetails["CSE"];
  const b2Info = branchDetails[branch2] || branchDetails["ECE"];

  return (
    <AuthGate>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        {/* Floating Radial Glass Blur Backgrounds */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-[#FF9933]/5 rounded-full blur-3xl pointer-events-none animate-float" />
        <div className="absolute top-80 right-1/4 w-96 h-96 bg-[#138808]/5 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: "-2s" }} />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#2563EB]/4 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: "-4s" }} />

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB]/10 dark:bg-[#2563EB]/20 text-[#2563EB] dark:text-[#60a5fa] text-xs font-bold uppercase tracking-wider mb-4 border border-[#2563EB]/20 shadow-sm animate-pulse">
            <GitCompare className="w-3.5 h-3.5" />
            Compare & Analyze
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
            Admissions <span className="gradient-text-premium">Comparison Suite</span>
          </h1>
          <p className="mt-4 text-base text-gray-550 dark:text-gray-400 font-medium">
            Make data-driven choices by comparing colleges side-by-side or analyzing core B.Tech branch prospects.
          </p>
        </div>

        {/* ================= SECTION 1: COLLEGE COMPARE GRID ================= */}
        <section className="glass-card hover-lift rounded-3xl p-6 sm:p-8 mb-12 relative overflow-hidden z-10">
          {/* Saffron design accent line at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-[#2563EB] to-[#138808]" />

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-850 dark:text-white flex items-center gap-2.5 mb-8 pb-4 border-b border-gray-200/50 dark:border-slate-800/50">
            <Building className="w-6 h-6 text-[#FF9933] animate-bounce" />
            Side-by-Side College Comparison
          </h2>

          {/* Dropdowns row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Col 1 select */}
            <div className="p-4 bg-white/40 dark:bg-slate-950/40 border border-gray-200/60 dark:border-slate-800/80 rounded-2xl flex flex-col gap-1.5 hover:border-[#FF9933]/55 focus-within:border-[#FF9933] focus-within:ring-2 focus-within:ring-[#FF9933]/10 transition-all duration-300 shadow-sm">
              <span className="text-[9px] text-[#FF9933] font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933]" />
                Institution 1
              </span>
              <select
                value={col1}
                onChange={(e) => setCol1(e.target.value)}
                className="font-bold text-xs bg-transparent dark:text-white border-0 outline-none w-full cursor-pointer focus:ring-0 p-0 text-slate-800 dark:text-gray-150"
              >
                {colleges.map((c) => (
                  <option key={c.id} value={c.id} className="dark:bg-slate-950">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Col 2 select */}
            <div className="p-4 bg-white/40 dark:bg-slate-950/40 border border-gray-200/60 dark:border-slate-800/80 rounded-2xl flex flex-col gap-1.5 hover:border-[#2563EB]/55 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/10 transition-all duration-300 shadow-sm">
              <span className="text-[9px] text-[#2563EB] font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                Institution 2
              </span>
              <select
                value={col2}
                onChange={(e) => setCol2(e.target.value)}
                className="font-bold text-xs bg-transparent dark:text-white border-0 outline-none w-full cursor-pointer focus:ring-0 p-0 text-slate-800 dark:text-gray-150"
              >
                {colleges.map((c) => (
                  <option key={c.id} value={c.id} className="dark:bg-slate-950">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Col 3 select */}
            <div className="p-4 bg-white/40 dark:bg-slate-950/40 border border-gray-200/60 dark:border-slate-800/80 rounded-2xl flex flex-col gap-1.5 hover:border-[#138808]/55 focus-within:border-[#138808] focus-within:ring-2 focus-within:ring-[#138808]/10 transition-all duration-300 shadow-sm">
              <span className="text-[9px] text-[#138808] font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#138808]" />
                Institution 3
              </span>
              <select
                value={col3}
                onChange={(e) => setCol3(e.target.value)}
                className="font-bold text-xs bg-transparent dark:text-white border-0 outline-none w-full cursor-pointer focus:ring-0 p-0 text-slate-800 dark:text-gray-150"
              >
                {colleges.map((c) => (
                  <option key={c.id} value={c.id} className="dark:bg-slate-950">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cutoff comparison state selectors */}
          <div className="bg-white/30 dark:bg-slate-950/40 p-4 sm:p-5 border border-[#2563EB]/15 rounded-2xl mb-8 flex flex-wrap gap-4 items-center justify-between text-xs font-bold text-left backdrop-blur-md">
            <div className="space-y-1">
              <span className="text-[#2563EB] dark:text-[#60a5fa] flex items-center gap-1.5 uppercase text-[10px] tracking-widest font-black">
                ⚡ Closing Cutoffs Side-by-Side Comparison
              </span>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold leading-normal">
                Compare historical round-wise closing ranks for the selected branch and category below
              </p>
            </div>
            <div className="flex gap-4">
              <div>
                <label className="block text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase mb-1.5 tracking-wider">Branch</label>
                <select
                  value={cutoffBranch}
                  onChange={(e) => setCutoffBranch(e.target.value)}
                  className="px-3 py-1.5 border border-gray-200/80 dark:border-slate-800/80 rounded-xl bg-white/70 dark:bg-slate-900/80 dark:text-white font-extrabold outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all duration-300 cursor-pointer text-xs"
                >
                  {["CSE", "ECE", "EE", "EEE", "ME", "CE", "IT"].map((b) => (
                    <option key={b} value={b} className="dark:bg-slate-950">{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase mb-1.5 tracking-wider">Category</label>
                <select
                  value={cutoffCategory}
                  onChange={(e) => setCutoffCategory(e.target.value)}
                  className="px-3 py-1.5 border border-gray-200/80 dark:border-slate-800/80 rounded-xl bg-white/70 dark:bg-slate-900/80 dark:text-white font-extrabold outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all duration-300 cursor-pointer text-xs"
                >
                  {["UR", "BC", "EBC", "SC", "ST", "EWS", "RCG"].map((cat) => (
                    <option key={cat} value={cat} className="dark:bg-slate-950">{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Matrix details */}
          <div className="overflow-x-auto rounded-2xl border border-gray-200/50 dark:border-slate-800/80">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-200/60 dark:border-slate-800/80 text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest bg-slate-50/40 dark:bg-slate-950/40">
                  <th className="py-4 px-4 w-1/4 font-black">Comparison Matrix</th>
                  <th className="py-4 px-5 w-1/4 text-slate-850 dark:text-gray-100 font-black border-l border-gray-250/20 dark:border-slate-800/20 text-center sm:text-left">
                    <span className="block text-[10px] text-[#FF9933] font-bold">INSTITUTION 1</span>
                    {college1Obj?.name.split(" ")[0]} ({college1Obj?.code.split("-")[0]})
                  </th>
                  <th className="py-4 px-5 w-1/4 text-slate-850 dark:text-gray-100 font-black border-l border-gray-250/20 dark:border-slate-800/20 text-center sm:text-left">
                    <span className="block text-[10px] text-[#2563EB] font-bold">INSTITUTION 2</span>
                    {college2Obj?.name.split(" ")[0]} ({college2Obj?.code.split("-")[0]})
                  </th>
                  <th className="py-4 px-5 w-1/4 text-slate-850 dark:text-gray-100 font-black border-l border-gray-250/20 dark:border-slate-800/20 text-center sm:text-left">
                    <span className="block text-[10px] text-[#138808] font-bold">INSTITUTION 3</span>
                    {college3Obj?.name.split(" ")[0]} ({college3Obj?.code.split("-")[0]})
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150/30 dark:divide-slate-800/40 font-semibold text-slate-700 dark:text-gray-300">
                {/* Estd Year */}
                <tr className="hover:bg-slate-500/5 transition-colors duration-250">
                  <td className="py-4 px-4 text-gray-450 dark:text-gray-400 font-black uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4.5 h-4.5 text-[#FF9933] shrink-0" />
                    Estd Year
                  </td>
                  <td className="py-4 px-5 border-l border-gray-250/20 dark:border-slate-800/20 text-left">
                    {college1Obj ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-gray-250 border border-slate-200/40 dark:border-slate-700/50">
                        📅 {college1Obj.established}
                      </span>
                    ) : "-"}
                  </td>
                  <td className="py-4 px-5 border-l border-gray-250/20 dark:border-slate-800/20 text-left">
                    {college2Obj ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-gray-250 border border-slate-200/40 dark:border-slate-700/50">
                        📅 {college2Obj.established}
                      </span>
                    ) : "-"}
                  </td>
                  <td className="py-4 px-5 border-l border-gray-250/20 dark:border-slate-800/20 text-left">
                    {college3Obj ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-gray-250 border border-slate-200/40 dark:border-slate-700/50">
                        📅 {college3Obj.established}
                      </span>
                    ) : "-"}
                  </td>
                </tr>
                {/* Location */}
                <tr className="hover:bg-slate-500/5 transition-colors duration-250">
                  <td className="py-4 px-4 text-gray-450 dark:text-gray-400 font-black uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4.5 h-4.5 text-[#138808] shrink-0" />
                    Location
                  </td>
                  <td className="py-4 px-5 border-l border-gray-250/20 dark:border-slate-800/20 text-slate-800 dark:text-gray-200">{college1Obj?.location}</td>
                  <td className="py-4 px-5 border-l border-gray-250/20 dark:border-slate-800/20 text-slate-800 dark:text-gray-200">{college2Obj?.location}</td>
                  <td className="py-4 px-5 border-l border-gray-250/20 dark:border-slate-800/20 text-slate-800 dark:text-gray-200">{college3Obj?.location}</td>
                </tr>
                {/* NIRF Rank */}
                <tr className="hover:bg-slate-500/5 transition-colors duration-250">
                  <td className="py-4 px-4 text-gray-450 dark:text-gray-400 font-black uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4.5 h-4.5 text-[#2563EB] shrink-0" />
                    NIRF Rank
                  </td>
                  <td className="py-4 px-5 border-l border-gray-250/20 dark:border-slate-800/20">
                    {college1Obj?.nirf ? (
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black">
                        Rank {college1Obj.nirf}
                      </span>
                    ) : "N/A"}
                  </td>
                  <td className="py-4 px-5 border-l border-gray-250/20 dark:border-slate-800/20">
                    {college2Obj?.nirf ? (
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black">
                        Rank {college2Obj.nirf}
                      </span>
                    ) : "N/A"}
                  </td>
                  <td className="py-4 px-5 border-l border-gray-250/20 dark:border-slate-800/20">
                    {college3Obj?.nirf ? (
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black">
                        Rank {college3Obj.nirf}
                      </span>
                    ) : "N/A"}
                  </td>
                </tr>
                {/* Average Placement Package */}
                <tr className="hover:bg-slate-500/5 transition-colors duration-250">
                  <td className="py-4 px-4 text-gray-450 dark:text-gray-400 font-black uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4.5 h-4.5 text-[#138808] shrink-0" />
                    Average Placements
                  </td>
                  <td className="py-4 px-5 border-l border-gray-250/20 dark:border-slate-800/20">
                    {college1Obj ? (
                      <div className="flex flex-col gap-1.5 text-left">
                        <span className="text-[#138808] dark:text-[#22c55e] font-black text-base">{college1Obj.averagePackage.toFixed(2)} LPA</span>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#138808] h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (college1Obj.averagePackage / 15) * 100)}%` }} />
                        </div>
                      </div>
                    ) : "-"}
                  </td>
                  <td className="py-4 px-5 border-l border-gray-250/20 dark:border-slate-800/20">
                    {college2Obj ? (
                      <div className="flex flex-col gap-1.5 text-left">
                        <span className="text-[#138808] dark:text-[#22c55e] font-black text-base">{college2Obj.averagePackage.toFixed(2)} LPA</span>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#138808] h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (college2Obj.averagePackage / 15) * 100)}%` }} />
                        </div>
                      </div>
                    ) : "-"}
                  </td>
                  <td className="py-4 px-5 border-l border-gray-250/20 dark:border-slate-800/20">
                    {college3Obj ? (
                      <div className="flex flex-col gap-1.5 text-left">
                        <span className="text-[#138808] dark:text-[#22c55e] font-black text-base">{college3Obj.averagePackage.toFixed(2)} LPA</span>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#138808] h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (college3Obj.averagePackage / 15) * 100)}%` }} />
                        </div>
                      </div>
                    ) : "-"}
                  </td>
                </tr>
                {/* Highest Placement Package */}
                <tr className="hover:bg-slate-500/5 transition-colors duration-250">
                  <td className="py-4 px-4 text-gray-450 dark:text-gray-400 font-black uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4.5 h-4.5 text-[#2563EB] shrink-0" />
                    Highest Placements
                  </td>
                  <td className="py-4 px-5 border-l border-gray-250/20 dark:border-slate-800/20">
                    {college1Obj ? (
                      <div className="flex flex-col gap-1.5 text-left">
                        <span className="text-[#2563EB] dark:text-[#60a5fa] font-black text-base">{college1Obj.highestPackage.toFixed(2)} LPA</span>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#2563EB] h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (college1Obj.highestPackage / 30) * 100)}%` }} />
                        </div>
                      </div>
                    ) : "-"}
                  </td>
                  <td className="py-4 px-5 border-l border-gray-250/20 dark:border-slate-800/20">
                    {college2Obj ? (
                      <div className="flex flex-col gap-1.5 text-left">
                        <span className="text-[#2563EB] dark:text-[#60a5fa] font-black text-base">{college2Obj.highestPackage.toFixed(2)} LPA</span>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#2563EB] h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (college2Obj.highestPackage / 30) * 100)}%` }} />
                        </div>
                      </div>
                    ) : "-"}
                  </td>
                  <td className="py-4 px-5 border-l border-gray-250/20 dark:border-slate-800/20">
                    {college3Obj ? (
                      <div className="flex flex-col gap-1.5 text-left">
                        <span className="text-[#2563EB] dark:text-[#60a5fa] font-black text-base">{college3Obj.highestPackage.toFixed(2)} LPA</span>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#2563EB] h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (college3Obj.highestPackage / 30) * 100)}%` }} />
                        </div>
                      </div>
                    ) : "-"}
                  </td>
                </tr>
                {/* Annual Tuition Fees */}
                <tr className="hover:bg-slate-500/5 transition-colors duration-250">
                  <td className="py-4 px-4 text-gray-450 dark:text-gray-400 font-black uppercase tracking-wider flex items-center gap-2">
                    <DollarSign className="w-4.5 h-4.5 text-[#FF9933] shrink-0" />
                    Annual Tuition Fee
                  </td>
                  <td className="py-4 px-5 border-l border-gray-250/20 dark:border-slate-800/20">
                    {college1Obj ? (
                      <div className="flex flex-col gap-1.5 text-left">
                        <span className="font-black text-slate-850 dark:text-gray-150">₹{college1Obj.tuitionFee.toLocaleString()}</span>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#FF9933] h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (college1Obj.tuitionFee / 15000) * 100)}%` }} />
                        </div>
                      </div>
                    ) : "-"}
                  </td>
                  <td className="py-4 px-5 border-l border-gray-250/20 dark:border-slate-800/20">
                    {college2Obj ? (
                      <div className="flex flex-col gap-1.5 text-left">
                        <span className="font-black text-slate-850 dark:text-gray-150">₹{college2Obj.tuitionFee.toLocaleString()}</span>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#FF9933] h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (college2Obj.tuitionFee / 15000) * 100)}%` }} />
                        </div>
                      </div>
                    ) : "-"}
                  </td>
                  <td className="py-4 px-5 border-l border-gray-250/20 dark:border-slate-800/20">
                    {college3Obj ? (
                      <div className="flex flex-col gap-1.5 text-left">
                        <span className="font-black text-slate-850 dark:text-gray-150">₹{college3Obj.tuitionFee.toLocaleString()}</span>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#FF9933] h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (college3Obj.tuitionFee / 15000) * 100)}%` }} />
                        </div>
                      </div>
                    ) : "-"}
                  </td>
                </tr>
                {/* Hostel Fees */}
                <tr className="hover:bg-slate-500/5 transition-colors duration-250">
                  <td className="py-4 px-4 text-gray-450 dark:text-gray-400 font-black uppercase tracking-wider flex items-center gap-2">
                    <DollarSign className="w-4.5 h-4.5 text-[#FF9933] shrink-0 animate-pulse" />
                    Hostel Fee (Annual)
                  </td>
                  <td className="py-4 px-5 border-l border-gray-250/20 dark:border-slate-800/20 text-slate-800 dark:text-gray-300">
                    {college1Obj ? (
                      college1Obj.hostelAvailable ? (
                        <div className="flex flex-col gap-1.5 text-left">
                          <span className="font-bold text-slate-800 dark:text-gray-205">₹{college1Obj.hostelFee.toLocaleString()}</span>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#FF9933]/80 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (college1Obj.hostelFee / 18000) * 100)}%` }} />
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-450 text-xs font-semibold">No Hostel</span>
                      )
                    ) : "-"}
                  </td>
                  <td className="py-4 px-5 border-l border-gray-250/20 dark:border-slate-800/20 text-slate-800 dark:text-gray-300">
                    {college2Obj ? (
                      college2Obj.hostelAvailable ? (
                        <div className="flex flex-col gap-1.5 text-left">
                          <span className="font-bold text-slate-800 dark:text-gray-205">₹{college2Obj.hostelFee.toLocaleString()}</span>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#FF9933]/80 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (college2Obj.hostelFee / 18000) * 100)}%` }} />
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-450 text-xs font-semibold">No Hostel</span>
                      )
                    ) : "-"}
                  </td>
                  <td className="py-4 px-5 border-l border-gray-250/20 dark:border-slate-800/20 text-slate-800 dark:text-gray-300">
                    {college3Obj ? (
                      college3Obj.hostelAvailable ? (
                        <div className="flex flex-col gap-1.5 text-left">
                          <span className="font-bold text-slate-800 dark:text-gray-205">₹{college3Obj.hostelFee.toLocaleString()}</span>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#FF9933]/80 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (college3Obj.hostelFee / 18000) * 100)}%` }} />
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-450 text-xs font-semibold">No Hostel</span>
                      )
                    ) : "-"}
                  </td>
                </tr>
                {/* Campus size */}
                <tr className="hover:bg-slate-500/5 transition-colors duration-250">
                  <td className="py-4 px-4 text-gray-450 dark:text-gray-400 font-black uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4.5 h-4.5 text-gray-400 shrink-0" />
                    Campus Area
                  </td>
                  <td className="py-4 px-5 border-l border-gray-250/20 dark:border-slate-800/20 text-left">
                    {college1Obj ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-gray-250 border border-slate-200/40 dark:border-slate-700/50">
                        🌳 {college1Obj.campusSize}
                      </span>
                    ) : "-"}
                  </td>
                  <td className="py-4 px-5 border-l border-gray-250/20 dark:border-slate-800/20 text-left">
                    {college2Obj ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-gray-250 border border-slate-200/40 dark:border-slate-700/50">
                        🌳 {college2Obj.campusSize}
                      </span>
                    ) : "-"}
                  </td>
                  <td className="py-4 px-5 border-l border-gray-250/20 dark:border-slate-800/20 text-left">
                    {college3Obj ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-gray-250 border border-slate-200/40 dark:border-slate-700/50">
                        🌳 {college3Obj.campusSize}
                      </span>
                    ) : "-"}
                  </td>
                </tr>
                {/* Total Course Count */}
                <tr className="hover:bg-slate-500/5 transition-colors duration-250">
                  <td className="py-4 px-4 text-gray-450 dark:text-gray-400 font-black uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4.5 h-4.5 text-[#138808] shrink-0" />
                    Branch Count
                  </td>
                  <td className="py-4 px-5 border-l border-gray-250/20 dark:border-slate-800/20 text-slate-800 dark:text-gray-200">{college1Obj?.branches.length} Branches</td>
                  <td className="py-4 px-5 border-l border-gray-250/20 dark:border-slate-800/20 text-slate-800 dark:text-gray-200">{college2Obj?.branches.length} Branches</td>
                  <td className="py-4 px-5 border-l border-gray-250/20 dark:border-slate-800/20 text-slate-800 dark:text-gray-200">{college3Obj?.branches.length} Branches</td>
                </tr>
                {/* Top Recruiters */}
                <tr className="hover:bg-slate-500/5 transition-colors duration-250">
                  <td className="py-4 px-4 text-gray-450 dark:text-gray-400 font-black uppercase tracking-wider flex items-center gap-2">
                    <Briefcase className="w-4.5 h-4.5 text-[#2563EB] shrink-0" />
                    Key Recruiters
                  </td>
                  <td className="py-4 px-5 leading-normal text-xs text-gray-550 dark:text-gray-400 font-medium border-l border-gray-250/20 dark:border-slate-800/20">{college1Obj?.recruits.slice(0, 4).join(", ")}</td>
                  <td className="py-4 px-5 leading-normal text-xs text-gray-550 dark:text-gray-400 font-medium border-l border-gray-250/20 dark:border-slate-800/20">{college2Obj?.recruits.slice(0, 4).join(", ")}</td>
                  <td className="py-4 px-5 leading-normal text-xs text-gray-550 dark:text-gray-400 font-medium border-l border-gray-250/20 dark:border-slate-800/20">{college3Obj?.recruits.slice(0, 4).join(", ")}</td>
                </tr>
                {/* Divider for Cutoff statistics */}
                <tr className="bg-slate-50/80 dark:bg-slate-950/70 text-[10px] uppercase font-black text-slate-800 dark:text-slate-200 tracking-wider">
                  <td className="py-3 px-4 border-y border-gray-200/50 dark:border-slate-800/50 bg-[#2563EB]/5 font-black flex items-center gap-1.5" colSpan={4}>
                    <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-ping" />
                    ⚡ UGEAC Closing Ranks ({cutoffBranch} - {cutoffCategory})
                  </td>
                </tr>
                {/* 2025 Round 1 Closing */}
                <tr className="hover:bg-slate-500/5 transition-colors duration-250">
                  <td className="py-4 px-4 text-gray-450 dark:text-gray-400 font-black uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4.5 h-4.5 shrink-0 text-[#2563EB]" />
                    2025 Round 1 Closing
                  </td>
                  <td className="py-4 px-5 font-black text-[#2563EB] dark:text-[#60a5fa] text-base border-l border-gray-250/20 dark:border-slate-800/20">
                    {college1Obj ? getCutoff(college1Obj.code, cutoffBranch, 2025, 1, cutoffCategory).closingRank : "-"}
                  </td>
                  <td className="py-4 px-5 font-black text-[#2563EB] dark:text-[#60a5fa] text-base border-l border-gray-250/20 dark:border-slate-800/20">
                    {college2Obj ? getCutoff(college2Obj.code, cutoffBranch, 2025, 1, cutoffCategory).closingRank : "-"}
                  </td>
                  <td className="py-4 px-5 font-black text-[#2563EB] dark:text-[#60a5fa] text-base border-l border-gray-250/20 dark:border-slate-800/20">
                    {college3Obj ? getCutoff(college3Obj.code, cutoffBranch, 2025, 1, cutoffCategory).closingRank : "-"}
                  </td>
                </tr>
                {/* 2025 Round 2 Closing */}
                <tr className="hover:bg-slate-500/5 transition-colors duration-250">
                  <td className="py-4 px-4 text-gray-450 dark:text-gray-400 font-black uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4.5 h-4.5 shrink-0 text-[#138808]" />
                    2025 Round 2 Closing
                  </td>
                  <td className="py-4 px-5 font-black text-[#138808] dark:text-[#22c55e] text-base border-l border-gray-250/20 dark:border-slate-800/20">
                    {college1Obj ? getCutoff(college1Obj.code, cutoffBranch, 2025, 2, cutoffCategory).closingRank : "-"}
                  </td>
                  <td className="py-4 px-5 font-black text-[#138808] dark:text-[#22c55e] text-base border-l border-gray-250/20 dark:border-slate-800/20">
                    {college2Obj ? getCutoff(college2Obj.code, cutoffBranch, 2025, 2, cutoffCategory).closingRank : "-"}
                  </td>
                  <td className="py-4 px-5 font-black text-[#138808] dark:text-[#22c55e] text-base border-l border-gray-250/20 dark:border-slate-800/20">
                    {college3Obj ? getCutoff(college3Obj.code, cutoffBranch, 2025, 2, cutoffCategory).closingRank : "-"}
                  </td>
                </tr>
                {/* 2024 Round 1 Closing */}
                <tr className="hover:bg-slate-500/5 transition-colors duration-250">
                  <td className="py-4 px-4 text-gray-450 dark:text-gray-400 font-black uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4.5 h-4.5 shrink-0 text-[#FF9933]" />
                    2024 Round 1 Closing
                  </td>
                  <td className="py-4 px-5 font-black text-slate-800 dark:text-gray-150 border-l border-gray-250/20 dark:border-slate-800/20 text-base">
                    {college1Obj ? getCutoff(college1Obj.code, cutoffBranch, 2024, 1, cutoffCategory).closingRank : "-"}
                  </td>
                  <td className="py-4 px-5 font-black text-slate-800 dark:text-gray-150 border-l border-gray-250/20 dark:border-slate-800/20 text-base">
                    {college2Obj ? getCutoff(college2Obj.code, cutoffBranch, 2024, 1, cutoffCategory).closingRank : "-"}
                  </td>
                  <td className="py-4 px-5 font-black text-slate-800 dark:text-gray-150 border-l border-gray-250/20 dark:border-slate-800/20 text-base">
                    {college3Obj ? getCutoff(college3Obj.code, cutoffBranch, 2024, 1, cutoffCategory).closingRank : "-"}
                  </td>
                </tr>
                {/* 2024 Round 2 Closing */}
                <tr className="hover:bg-slate-500/5 transition-colors duration-250">
                  <td className="py-4 px-4 text-gray-450 dark:text-gray-400 font-black uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4.5 h-4.5 shrink-0 text-slate-400" />
                    2024 Round 2 Closing
                  </td>
                  <td className="py-4 px-5 text-gray-550 dark:text-gray-400 font-black border-l border-gray-250/20 dark:border-slate-800/20 text-base">
                    {college1Obj ? getCutoff(college1Obj.code, cutoffBranch, 2024, 2, cutoffCategory).closingRank : "-"}
                  </td>
                  <td className="py-4 px-5 text-gray-550 dark:text-gray-400 font-black border-l border-gray-250/20 dark:border-slate-800/20 text-base">
                    {college2Obj ? getCutoff(college2Obj.code, cutoffBranch, 2024, 2, cutoffCategory).closingRank : "-"}
                  </td>
                  <td className="py-4 px-5 text-gray-550 dark:text-gray-400 font-black border-l border-gray-250/20 dark:border-slate-800/20 text-base">
                    {college3Obj ? getCutoff(college3Obj.code, cutoffBranch, 2024, 2, cutoffCategory).closingRank : "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ================= SECTION 2: BRANCH PREFERENCE COMPARER ================= */}
        <section className="glass-card hover-lift rounded-3xl p-6 sm:p-8 relative overflow-hidden z-10">
          {/* Green design accent line at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#138808] via-[#2563EB] to-[#FF9933]" />

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-850 dark:text-white flex items-center gap-2.5 mb-8 pb-4 border-b border-gray-200/50 dark:border-slate-800/50">
            <BookOpen className="w-6 h-6 text-[#138808] animate-pulse" />
            Branch Specialization Preference Analyzer
          </h2>

          {/* Branch selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="p-4 bg-white/40 dark:bg-slate-950/40 border border-gray-200/60 dark:border-slate-800/80 rounded-2xl flex flex-col gap-1.5 hover:border-[#2563EB]/55 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/10 transition-all duration-300 shadow-sm">
              <span className="text-[9px] text-[#2563EB] font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                Branch Specialization 1
              </span>
              <select
                value={branch1}
                onChange={(e) => setBranch1(e.target.value)}
                className="font-bold text-xs bg-transparent dark:text-white border-0 outline-none w-full cursor-pointer focus:ring-0 p-0 text-slate-850 dark:text-gray-150"
              >
                {Object.keys(branchDetails).map((b) => (
                  <option key={b} value={b} className="dark:bg-slate-950">
                    {branchNames[b] || b} ({b})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-white/40 dark:bg-slate-950/40 border border-gray-200/60 dark:border-slate-800/80 rounded-2xl flex flex-col gap-1.5 hover:border-[#138808]/55 focus-within:border-[#138808] focus-within:ring-2 focus-within:ring-[#138808]/10 transition-all duration-300 shadow-sm">
              <span className="text-[9px] text-[#138808] font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#138808]" />
                Branch Specialization 2
              </span>
              <select
                value={branch2}
                onChange={(e) => setBranch2(e.target.value)}
                className="font-bold text-xs bg-transparent dark:text-white border-0 outline-none w-full cursor-pointer focus:ring-0 p-0 text-slate-850 dark:text-gray-150"
              >
                {Object.keys(branchDetails).map((b) => (
                  <option key={b} value={b} className="dark:bg-slate-950">
                    {branchNames[b] || b} ({b})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Side-by-side branch insights grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Branch 1 box */}
            <div className="p-6 bg-gradient-to-br from-[#2563EB]/10 via-white/5 to-transparent dark:from-[#2563EB]/15 dark:via-slate-900/50 dark:to-slate-900 border border-[#2563EB]/20 rounded-2xl space-y-5 shadow-sm hover:border-[#2563EB]/40 hover:shadow-md hover:shadow-[#2563EB]/5 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563EB]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#2563EB]/10 transition-colors" />
              <div>
                <span className="px-2.5 py-1 bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] dark:text-[#60a5fa] rounded-lg font-black text-[10px] tracking-wide uppercase">
                  Option 1: {branch1}
                </span>
                <h3 className="text-xl font-black text-slate-850 dark:text-white mt-3">
                  {branchNames[branch1] || branch1}
                </h3>
              </div>

              <ul className="space-y-4 text-xs text-slate-650 dark:text-gray-300 relative z-10">
                <li>
                  <strong className="block text-gray-400 dark:text-gray-500 font-black uppercase text-[9px] tracking-widest mb-1">Popularity Index</strong>
                  <span className="font-extrabold text-sm text-slate-800 dark:text-gray-150">{b1Info.popularity}</span>
                </li>
                <li>
                  <strong className="block text-gray-400 dark:text-gray-500 font-black uppercase text-[9px] tracking-widest mb-1">Academic Complexity</strong>
                  <span className="font-extrabold text-sm text-slate-800 dark:text-gray-150">{b1Info.difficulty}</span>
                </li>
                <li>
                  <strong className="block text-gray-400 dark:text-gray-500 font-black uppercase text-[9px] tracking-widest mb-1.5">Key Curriculum Subjects</strong>
                  <div className="flex flex-wrap gap-1.5">
                    {b1Info.subjects.map((sub) => (
                      <span key={sub} className="px-2.5 py-1 bg-white/60 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700/80 rounded-lg font-bold text-[10px] text-slate-700 dark:text-gray-200 border border-slate-350/20 dark:border-slate-700/50 shadow-inner transition-colors duration-200">
                        {sub}
                      </span>
                    ))}
                  </div>
                </li>
                <li>
                  <strong className="block text-gray-400 dark:text-gray-500 font-black uppercase text-[9px] tracking-widest mb-1.5">Career & Placement Opportunities</strong>
                  <div className="flex flex-wrap gap-1.5">
                    {b1Info.careers.map((car) => (
                      <span key={car} className="px-2.5 py-1 bg-[#2563EB]/10 border border-[#2563EB]/15 text-[#2563EB] dark:text-[#60a5fa] rounded-lg font-black text-[10px] hover:bg-[#2563EB]/20 transition-colors">
                        {car}
                      </span>
                    ))}
                  </div>
                </li>
                <li className="pt-4 border-t border-dashed border-gray-200/50 dark:border-slate-800/50">
                  <strong className="block text-gray-400 dark:text-gray-500 font-black uppercase text-[9px] tracking-widest mb-1">Market Scope Outlook</strong>
                  <p className="leading-relaxed text-gray-500 dark:text-gray-400 font-medium text-xs">{b1Info.scope}</p>
                </li>
              </ul>
            </div>

            {/* Branch 2 box */}
            <div className="p-6 bg-gradient-to-br from-[#138808]/10 via-white/5 to-transparent dark:from-[#138808]/15 dark:via-slate-900/50 dark:to-slate-900 border border-[#138808]/20 rounded-2xl space-y-5 shadow-sm hover:border-[#138808]/40 hover:shadow-md hover:shadow-[#138808]/5 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#138808]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#138808]/10 transition-colors" />
              <div>
                <span className="px-2.5 py-1 bg-[#138808]/10 border border-[#138808]/20 text-[#138808] dark:text-[#22c55e] rounded-lg font-black text-[10px] tracking-wide uppercase">
                  Option 2: {branch2}
                </span>
                <h3 className="text-xl font-black text-slate-850 dark:text-white mt-3">
                  {branchNames[branch2] || branch2}
                </h3>
              </div>

              <ul className="space-y-4 text-xs text-slate-650 dark:text-gray-300 relative z-10">
                <li>
                  <strong className="block text-gray-400 dark:text-gray-500 font-black uppercase text-[9px] tracking-widest mb-1">Popularity Index</strong>
                  <span className="font-extrabold text-sm text-slate-800 dark:text-gray-150">{b2Info.popularity}</span>
                </li>
                <li>
                  <strong className="block text-gray-400 dark:text-gray-500 font-black uppercase text-[9px] tracking-widest mb-1">Academic Complexity</strong>
                  <span className="font-extrabold text-sm text-slate-800 dark:text-gray-150">{b2Info.difficulty}</span>
                </li>
                <li>
                  <strong className="block text-gray-400 dark:text-gray-500 font-black uppercase text-[9px] tracking-widest mb-1.5">Key Curriculum Subjects</strong>
                  <div className="flex flex-wrap gap-1.5">
                    {b2Info.subjects.map((sub) => (
                      <span key={sub} className="px-2.5 py-1 bg-white/60 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700/80 rounded-lg font-bold text-[10px] text-slate-700 dark:text-gray-200 border border-slate-350/20 dark:border-slate-700/50 shadow-inner transition-colors duration-200">
                        {sub}
                      </span>
                    ))}
                  </div>
                </li>
                <li>
                  <strong className="block text-gray-400 dark:text-gray-500 font-black uppercase text-[9px] tracking-widest mb-1.5">Career & Placement Opportunities</strong>
                  <div className="flex flex-wrap gap-1.5">
                    {b2Info.careers.map((car) => (
                      <span key={car} className="px-2.5 py-1 bg-[#138808]/10 border border-[#138808]/15 text-[#138808] dark:text-[#22c55e] rounded-lg font-black text-[10px] hover:bg-[#138808]/20 transition-colors">
                        {car}
                      </span>
                    ))}
                  </div>
                </li>
                <li className="pt-4 border-t border-dashed border-gray-200/50 dark:border-slate-800/50">
                  <strong className="block text-gray-400 dark:text-gray-500 font-black uppercase text-[9px] tracking-widest mb-1">Market Scope Outlook</strong>
                  <p className="leading-relaxed text-gray-500 dark:text-gray-400 font-medium text-xs">{b2Info.scope}</p>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </AuthGate>
  );
}
