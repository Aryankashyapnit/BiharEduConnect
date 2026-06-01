"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { branchNames } from "../../data/colleges";
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

export default function CompareTools() {
  const { colleges } = useApp();

  // 1. College Compare State
  const [col1, setCol1] = useState(colleges[0]?.id || "");
  const [col2, setCol2] = useState(colleges[1]?.id || "");
  const [col3, setCol3] = useState(colleges[2]?.id || "");

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-3">
          <GitCompare className="w-3.5 h-3.5 animate-pulse" />
          Compare & Analyze
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Admissions <span className="bg-gradient-to-r from-[#FF9933] via-[#2563EB] to-[#138808] bg-clip-text text-transparent">Comparison Suite</span>
        </h1>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
          Make data-driven choice filling lists by comparing colleges side-by-side or analyzing core B.Tech branch prospects.
        </p>
      </div>

      {/* ================= SECTION 1: COLLEGE COMPARE GRID ================= */}
      <section className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm mb-12">
        <h2 className="text-xl font-bold text-slate-850 dark:text-white flex items-center gap-2 mb-6 pb-3 border-b border-gray-100 dark:border-slate-850">
          <Building className="w-5.5 h-5.5 text-[#FF9933]" />
          Side-by-Side College Comparison
        </h2>

        {/* Dropdowns row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Col 1 select */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-2xl flex flex-col gap-1">
            <span className="text-[9px] text-[#FF9933] font-bold uppercase tracking-wider">Institution 1</span>
            <select
              value={col1}
              onChange={(e) => setCol1(e.target.value)}
              className="font-bold text-xs bg-transparent dark:text-white border-0 outline-none w-full focus:ring-0"
            >
              {colleges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Col 2 select */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-2xl flex flex-col gap-1">
            <span className="text-[9px] text-[#2563EB] font-bold uppercase tracking-wider">Institution 2</span>
            <select
              value={col2}
              onChange={(e) => setCol2(e.target.value)}
              className="font-bold text-xs bg-transparent dark:text-white border-0 outline-none w-full focus:ring-0"
            >
              {colleges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Col 3 select */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-2xl flex flex-col gap-1">
            <span className="text-[9px] text-[#138808] font-bold uppercase tracking-wider">Institution 3</span>
            <select
              value={col3}
              onChange={(e) => setCol3(e.target.value)}
              className="font-bold text-xs bg-transparent dark:text-white border-0 outline-none w-full focus:ring-0"
            >
              {colleges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Matrix details */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-gray-150 dark:border-slate-800 text-gray-400 font-bold uppercase tracking-wide">
                <th className="py-3 w-1/4">Comparison Matrix</th>
                <th className="py-3 px-4 w-1/4 text-slate-800 dark:text-gray-100 font-extrabold">{college1Obj?.name.split(" ")[0]} ({college1Obj?.code.split("-")[0]})</th>
                <th className="py-3 px-4 w-1/4 text-slate-800 dark:text-gray-100 font-extrabold">{college2Obj?.name.split(" ")[0]} ({college2Obj?.code.split("-")[0]})</th>
                <th className="py-3 px-4 w-1/4 text-slate-800 dark:text-gray-100 font-extrabold">{college3Obj?.name.split(" ")[0]} ({college3Obj?.code.split("-")[0]})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-gray-300">
              {/* Estd Year */}
              <tr>
                <td className="py-4 text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><Calendar className="w-4 h-4 shrink-0" />Estd Year</td>
                <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{college1Obj?.established}</td>
                <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{college2Obj?.established}</td>
                <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{college3Obj?.established}</td>
              </tr>
              {/* Location */}
              <tr>
                <td className="py-4 text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><MapPin className="w-4 h-4 shrink-0" />Location</td>
                <td className="py-4 px-4">{college1Obj?.location}</td>
                <td className="py-4 px-4">{college2Obj?.location}</td>
                <td className="py-4 px-4">{college3Obj?.location}</td>
              </tr>
              {/* NIRF Rank */}
              <tr>
                <td className="py-4 text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><Award className="w-4 h-4 shrink-0" />NIRF Rank</td>
                <td className="py-4 px-4">{college1Obj?.nirf ? `Rank ${college1Obj.nirf}` : "N/A"}</td>
                <td className="py-4 px-4">{college2Obj?.nirf ? `Rank ${college2Obj.nirf}` : "N/A"}</td>
                <td className="py-4 px-4">{college3Obj?.nirf ? `Rank ${college3Obj.nirf}` : "N/A"}</td>
              </tr>
              {/* Average Placement Package */}
              <tr>
                <td className="py-4 text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><TrendingUp className="w-4 h-4 shrink-0" />Average Placements</td>
                <td className="py-4 px-4 text-[#138808] font-extrabold">{college1Obj?.averagePackage.toFixed(2)} LPA</td>
                <td className="py-4 px-4 text-[#138808] font-extrabold">{college2Obj?.averagePackage.toFixed(2)} LPA</td>
                <td className="py-4 px-4 text-[#138808] font-extrabold">{college3Obj?.averagePackage.toFixed(2)} LPA</td>
              </tr>
              {/* Highest Placement Package */}
              <tr>
                <td className="py-4 text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><TrendingUp className="w-4 h-4 shrink-0" />Highest Placements</td>
                <td className="py-4 px-4 text-[#2563EB] font-extrabold">{college1Obj?.highestPackage.toFixed(2)} LPA</td>
                <td className="py-4 px-4 text-[#2563EB] font-extrabold">{college2Obj?.highestPackage.toFixed(2)} LPA</td>
                <td className="py-4 px-4 text-[#2563EB] font-extrabold">{college3Obj?.highestPackage.toFixed(2)} LPA</td>
              </tr>
              {/* Annual Tuition Fees */}
              <tr>
                <td className="py-4 text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><DollarSign className="w-4 h-4 shrink-0" />Annual Tuition Fee</td>
                <td className="py-4 px-4 font-bold text-slate-800 dark:text-gray-100">₹{college1Obj?.tuitionFee.toLocaleString()}</td>
                <td className="py-4 px-4 font-bold text-slate-800 dark:text-gray-100">₹{college2Obj?.tuitionFee.toLocaleString()}</td>
                <td className="py-4 px-4 font-bold text-slate-800 dark:text-gray-100">₹{college3Obj?.tuitionFee.toLocaleString()}</td>
              </tr>
              {/* Hostel Fees */}
              <tr>
                <td className="py-4 text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><DollarSign className="w-4 h-4 shrink-0" />Annual Hostel Fee</td>
                <td className="py-4 px-4">{college1Obj?.hostelAvailable ? `₹${college1Obj.hostelFee.toLocaleString()}` : "No Hostel"}</td>
                <td className="py-4 px-4">{college2Obj?.hostelAvailable ? `₹${college2Obj.hostelFee.toLocaleString()}` : "No Hostel"}</td>
                <td className="py-4 px-4">{college3Obj?.hostelAvailable ? `₹${college3Obj.hostelFee.toLocaleString()}` : "No Hostel"}</td>
              </tr>
              {/* Campus size */}
              <tr>
                <td className="py-4 text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><Layers className="w-4 h-4 shrink-0" />Campus Area</td>
                <td className="py-4 px-4">{college1Obj?.campusSize}</td>
                <td className="py-4 px-4">{college2Obj?.campusSize}</td>
                <td className="py-4 px-4">{college3Obj?.campusSize}</td>
              </tr>
              {/* Total Course Count */}
              <tr>
                <td className="py-4 text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><BookOpen className="w-4 h-4 shrink-0" />Branch Count</td>
                <td className="py-4 px-4">{college1Obj?.branches.length} Specializations</td>
                <td className="py-4 px-4">{college2Obj?.branches.length} Specializations</td>
                <td className="py-4 px-4">{college3Obj?.branches.length} Specializations</td>
              </tr>
              {/* Top Recruiters */}
              <tr>
                <td className="py-4 text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><Briefcase className="w-4 h-4 shrink-0" />Key Recruiters</td>
                <td className="py-4 px-4 leading-normal text-xs text-gray-550 dark:text-gray-400 font-medium">{college1Obj?.recruits.slice(0, 4).join(", ")}</td>
                <td className="py-4 px-4 leading-normal text-xs text-gray-550 dark:text-gray-400 font-medium">{college2Obj?.recruits.slice(0, 4).join(", ")}</td>
                <td className="py-4 px-4 leading-normal text-xs text-gray-550 dark:text-gray-400 font-medium">{college3Obj?.recruits.slice(0, 4).join(", ")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ================= SECTION 2: BRANCH PREFERENCE COMPARER ================= */}
      <section className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-850 dark:text-white flex items-center gap-2 mb-6 pb-3 border-b border-gray-100 dark:border-slate-850">
          <BookOpen className="w-5.5 h-5.5 text-[#138808]" />
          Branch Specialization Preference Analyzer
        </h2>

        {/* Branch selectors */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-2xl flex flex-col gap-1">
            <span className="text-[9px] text-[#2563EB] font-bold uppercase tracking-wider">Branch Specialization 1</span>
            <select
              value={branch1}
              onChange={(e) => setBranch1(e.target.value)}
              className="font-bold text-sm bg-transparent dark:text-white border-0 outline-none w-full focus:ring-0"
            >
              {Object.keys(branchDetails).map((b) => (
                <option key={b} value={b}>
                  {branchNames[b] || b} ({b})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-2xl flex flex-col gap-1">
            <span className="text-[9px] text-[#138808] font-bold uppercase tracking-wider">Branch Specialization 2</span>
            <select
              value={branch2}
              onChange={(e) => setBranch2(e.target.value)}
              className="font-bold text-sm bg-transparent dark:text-white border-0 outline-none w-full focus:ring-0"
            >
              {Object.keys(branchDetails).map((b) => (
                <option key={b} value={b}>
                  {branchNames[b] || b} ({b})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Side-by-side branch insights grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          {/* Branch 1 box */}
          <div className="p-5 bg-gradient-to-br from-[#2563EB]/5 via-white to-white dark:from-[#2563EB]/5 dark:via-slate-900 dark:to-slate-900 border border-[#2563EB]/25 rounded-2xl space-y-4">
            <div>
              <span className="px-2 py-0.5 bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] rounded font-extrabold text-[10px]">
                Option 1: {branch1}
              </span>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-2">
                {branchNames[branch1] || branch1}
              </h3>
            </div>

            <ul className="space-y-3.5 text-xs text-slate-650 dark:text-gray-300">
              <li>
                <strong className="block text-gray-400 font-bold uppercase text-[9px] tracking-wider mb-0.5">Popularity Index</strong>
                <span className="font-bold text-slate-800 dark:text-gray-150">{b1Info.popularity}</span>
              </li>
              <li>
                <strong className="block text-gray-400 font-bold uppercase text-[9px] tracking-wider mb-0.5">Academic Complexity</strong>
                <span className="font-bold text-slate-800 dark:text-gray-150">{b1Info.difficulty}</span>
              </li>
              <li>
                <strong className="block text-gray-400 font-bold uppercase text-[9px] tracking-wider mb-1">Key Curriculum Subjects</strong>
                <div className="flex flex-wrap gap-1">
                  {b1Info.subjects.map((sub) => (
                    <span key={sub} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-semibold text-[10px] text-gray-600 dark:text-gray-300">
                      {sub}
                    </span>
                  ))}
                </div>
              </li>
              <li>
                <strong className="block text-gray-400 font-bold uppercase text-[9px] tracking-wider mb-1">Career & Placements Opportunities</strong>
                <div className="flex flex-wrap gap-1">
                  {b1Info.careers.map((car) => (
                    <span key={car} className="px-2 py-0.5 bg-[#2563EB]/10 border border-[#2563EB]/10 text-[#2563EB] rounded font-bold text-[10px]">
                      {car}
                    </span>
                  ))}
                </div>
              </li>
              <li className="pt-2 border-t border-dashed border-gray-150 dark:border-slate-800">
                <strong className="block text-gray-400 font-bold uppercase text-[9px] tracking-wider mb-0.5">Market Scope Outlook</strong>
                <p className="leading-relaxed text-gray-500 dark:text-gray-400">{b1Info.scope}</p>
              </li>
            </ul>
          </div>

          {/* Branch 2 box */}
          <div className="p-5 bg-gradient-to-br from-[#138808]/5 via-white to-white dark:from-[#138808]/5 dark:via-slate-900 dark:to-slate-900 border border-[#138808]/25 rounded-2xl space-y-4">
            <div>
              <span className="px-2 py-0.5 bg-[#138808]/10 border border-[#138808]/20 text-[#138808] rounded font-extrabold text-[10px]">
                Option 2: {branch2}
              </span>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-2">
                {branchNames[branch2] || branch2}
              </h3>
            </div>

            <ul className="space-y-3.5 text-xs text-slate-650 dark:text-gray-300">
              <li>
                <strong className="block text-gray-400 font-bold uppercase text-[9px] tracking-wider mb-0.5">Popularity Index</strong>
                <span className="font-bold text-slate-800 dark:text-gray-150">{b2Info.popularity}</span>
              </li>
              <li>
                <strong className="block text-gray-400 font-bold uppercase text-[9px] tracking-wider mb-0.5">Academic Complexity</strong>
                <span className="font-bold text-slate-800 dark:text-gray-150">{b2Info.difficulty}</span>
              </li>
              <li>
                <strong className="block text-gray-400 font-bold uppercase text-[9px] tracking-wider mb-1">Key Curriculum Subjects</strong>
                <div className="flex flex-wrap gap-1">
                  {b2Info.subjects.map((sub) => (
                    <span key={sub} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-semibold text-[10px] text-gray-600 dark:text-gray-300">
                      {sub}
                    </span>
                  ))}
                </div>
              </li>
              <li>
                <strong className="block text-gray-400 font-bold uppercase text-[9px] tracking-wider mb-1">Career & Placements Opportunities</strong>
                <div className="flex flex-wrap gap-1">
                  {b2Info.careers.map((car) => (
                    <span key={car} className="px-2 py-0.5 bg-[#138808]/10 border border-[#138808]/10 text-[#138808] rounded font-bold text-[10px]">
                      {car}
                    </span>
                  ))}
                </div>
              </li>
              <li className="pt-2 border-t border-dashed border-gray-150 dark:border-slate-800">
                <strong className="block text-gray-400 font-bold uppercase text-[9px] tracking-wider mb-0.5">Market Scope Outlook</strong>
                <p className="leading-relaxed text-gray-500 dark:text-gray-400">{b2Info.scope}</p>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
