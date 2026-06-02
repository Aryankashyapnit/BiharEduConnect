"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { getCutoff } from "../../data/cutoffs";
import { branchNames } from "../../data/colleges";
import { 
  TrendingUp, 
  Search, 
  Layers, 
  MapPin, 
  BarChart3, 
  Info,
  Calendar,
  Grid
} from "lucide-react";
import { AuthGate } from "../../components/AuthGate";

export default function CutoffExplorer() {
  const { colleges, cutoffs } = useApp();

  // Filter States
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedRound, setSelectedRound] = useState(1);
  const [selectedCollege, setSelectedCollege] = useState("All");
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("UR");

  // Reset selected branch if it's not offered by the newly selected college
  React.useEffect(() => {
    if (selectedCollege !== "All" && selectedBranch !== "All") {
      const offeredBranches = cutoffs
        .filter((c) => c.collegeCode === selectedCollege)
        .map((c) => c.branchCode);
      if (!offeredBranches.includes(selectedBranch)) {
        setSelectedBranch("All");
      }
    }
  }, [selectedCollege, selectedBranch, cutoffs]);

  const categories = ["UR", "BC", "EBC", "SC", "ST", "EWS", "RCG"];
  // Dynamically extract all unique branches present in the cutoffs database (filtered by selected college if applicable)
  const uniqueBranches = Array.from(
    new Set(
      cutoffs
        .filter((c) => selectedCollege === "All" || c.collegeCode === selectedCollege)
        .map((c) => c.branchCode)
    )
  ).sort();

  // Filtered List
  const filteredCutoffs = cutoffs.filter((cutoff) => {
    const matchYear = cutoff.year === selectedYear;
    const matchRound = cutoff.round === selectedRound;
    const matchCollege = selectedCollege === "All" || cutoff.collegeCode === selectedCollege;
    const matchBranch = selectedBranch === "All" || cutoff.branchCode === selectedBranch;
    const matchCategory = cutoff.category === selectedCategory;

    return matchYear && matchRound && matchCollege && matchBranch && matchCategory;
  });

  // Trend Data for the SVG chart
  // Let's draw trend line of closing ranks of the selected college/branch over 2023, 2024, and 2025, Round 1 and Round 2
  const getTrendData = () => {
    const college = selectedCollege === "All" ? "MIT-MUZAFFARPUR" : selectedCollege;
    // Default to the college's first offered branch if selectedBranch is "All" to draw realistic trend lines
    const branch = selectedBranch === "All" ? (colleges.find(c => c.code === college)?.branches[0] || "CSE") : selectedBranch;
    
    // We want 6 points:
    const p1_23 = getCutoff(college, branch, 2023, 1, selectedCategory);
    const p2_23 = getCutoff(college, branch, 2023, 2, selectedCategory);
    const p1_24 = getCutoff(college, branch, 2024, 1, selectedCategory);
    const p2_24 = getCutoff(college, branch, 2024, 2, selectedCategory);
    const p1_25 = getCutoff(college, branch, 2025, 1, selectedCategory);
    const p2_25 = getCutoff(college, branch, 2025, 2, selectedCategory);

    return [
      { label: "2023 R1", value: p1_23.closingRank },
      { label: "2023 R2", value: p2_23.closingRank },
      { label: "2024 R1", value: p1_24.closingRank },
      { label: "2024 R2", value: p2_24.closingRank },
      { label: "2025 R1", value: p1_25.closingRank },
      { label: "2025 R2", value: p2_25.closingRank }
    ];
  };

  const trendPoints = getTrendData();
  const maxVal = Math.max(...trendPoints.map((p) => p.value)) * 1.15 || 1000;
  const minVal = Math.min(...trendPoints.map((p) => p.value)) * 0.85 || 100;

  // SVG Chart Dimensions
  const width = 500;
  const height = 220;
  const padding = 40;

  const pointsString = trendPoints
    .map((p, index) => {
      const x = padding + (index * (width - 2 * padding)) / (trendPoints.length - 1);
      // invert Y coordinate for SVG space
      const y = height - padding - ((p.value - minVal) / (maxVal - minVal)) * (height - 2 * padding);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <AuthGate>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 relative">
        <div className="absolute top-0 right-10 -z-10 h-[250px] w-[250px] rounded-full bg-gradient-to-tr from-[#2563EB]/10 to-[#138808]/10 blur-3xl opacity-60"></div>
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#138808]/10 border border-[#138808]/20 text-[#138808] text-xs font-bold uppercase tracking-wider mb-3">
          <TrendingUp className="w-3.5 h-3.5" />
          Cutoff & Trend Explorer
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">
          BCECE UGEAC <br />
          <span className="gradient-text-premium font-black">
            Cutoff Database
          </span>
        </h1>
        <p className="mt-3.5 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Search and visualize historical opening and closing ranks for engineering admissions across multiple rounds, branches, and categories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Trend Analyzer Panel */}
        <div className="lg:col-span-1 glass-card rounded-2xl p-6 shadow-md flex flex-col justify-between transition-all duration-300">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
              <BarChart3 className="w-4.5 h-4.5 text-[#FF9933]" />
              Cutoff Trend Analysis
            </h2>
            <p className="text-[11px] text-gray-400 leading-relaxed mb-4">
              Showing visual closing rank trend for **{selectedCollege === "All" ? "MIT Muzaffarpur" : colleges.find(c => c.code === selectedCollege)?.name}** (Branch: **{selectedBranch === "All" ? "CSE" : selectedBranch}**, Category: **{selectedCategory}**).
            </p>

            {/* SVG Trend Line Chart */}
            <div className="w-full bg-slate-50/50 dark:bg-slate-950/60 rounded-xl border border-gray-150 dark:border-slate-800/80 p-3.5 flex items-center justify-center shadow-inner relative overflow-hidden">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
                {/* Grid Lines */}
                {[0, 1, 2, 3].map((g, i) => {
                  const y = padding + (i * (height - 2 * padding)) / 3;
                  const label = Math.round(maxVal - (i * (maxVal - minVal)) / 3);
                  return (
                    <g key={i} className="opacity-30 dark:opacity-10">
                      <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
                      <text x={padding - 8} y={y + 4} fill="#64748b" fontSize="9" textAnchor="end" className="font-extrabold">
                        {label}
                      </text>
                    </g>
                  );
                })}

                {/* X Axis Labels */}
                {trendPoints.map((p, index) => {
                  const x = padding + (index * (width - 2 * padding)) / (trendPoints.length - 1);
                  return (
                    <text key={index} x={x} y={height - 12} fill="#64748b" fontSize="9" textAnchor="middle" className="font-bold opacity-80">
                      {p.label}
                    </text>
                  );
                })}

                {/* Draw Trend Polyline */}
                <polyline fill="none" stroke="url(#trend-grad)" strokeWidth="3.5" points={pointsString} className="drop-shadow-[0_2px_8px_rgba(37,99,235,0.2)]" />

                {/* Draw Data Points Circles */}
                {trendPoints.map((p, index) => {
                  const x = padding + (index * (width - 2 * padding)) / (trendPoints.length - 1);
                  const y = height - padding - ((p.value - minVal) / (maxVal - minVal)) * (height - 2 * padding);
                  return (
                    <g key={index} className="group cursor-pointer">
                      <circle cx={x} cy={y} r="5" fill="#2563EB" stroke="#ffffff" strokeWidth="1.5" className="hover:scale-130 transition-transform duration-250 cursor-pointer" />
                      <rect x={x - 22} y={y - 25} width="44" height="16" rx="4" fill="#0f172a" className="opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md" />
                      <text x={x} y={y - 14} fill="#ffffff" fontSize="9" textAnchor="middle" className="font-extrabold opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
                        {p.value}
                      </text>
                    </g>
                  );
                })}

                {/* SVG Gradient definitions */}
                <defs>
                  <linearGradient id="trend-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF9933" />
                    <stop offset="50%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#138808" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="mt-4 p-3 bg-[#2563EB]/5 dark:bg-[#2563EB]/10 border border-[#2563EB]/15 dark:border-slate-800/80 rounded-xl flex gap-2">
            <Info className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
              💡 **Insight**: A downward trend in closing rank numbers indicates a branch is gaining popularity (tighter cutoffs). Upward trends mean branches are easier to secure.
            </p>
          </div>
        </div>

        {/* Right Columns: Filtering Controls Panel */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 shadow-md transition-all duration-300">
          <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 dark:border-slate-850">
            <Grid className="w-4.5 h-4.5 text-[#138808]" />
            Search Filters
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
            {/* Year filter */}
            <div>
              <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">Counselling Year</label>
              <div className="flex rounded-xl border border-gray-250 dark:border-slate-800 overflow-hidden font-bold p-0.5 bg-slate-50/50 dark:bg-slate-950/40">
                {[2025, 2024, 2023].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`flex-1 py-1.5 rounded-lg text-xs text-center cursor-pointer transition-all duration-300 ${
                      selectedYear === yr
                        ? "bg-[#FF9933] text-white shadow-sm font-extrabold"
                        : "text-gray-500 hover:text-slate-800 dark:hover:text-white font-semibold"
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            {/* Round filter */}
            <div>
              <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">Counselling Round</label>
              <div className="flex rounded-xl border border-gray-250 dark:border-slate-800 overflow-hidden font-bold p-0.5 bg-slate-50/50 dark:bg-slate-950/40">
                {[1, 2].map((rd) => (
                  <button
                    key={rd}
                    onClick={() => setSelectedRound(rd)}
                    className={`flex-1 py-1.5 rounded-lg text-xs text-center cursor-pointer transition-all duration-300 ${
                      selectedRound === rd
                        ? "bg-[#138808] text-white shadow-sm font-extrabold"
                        : "text-gray-500 hover:text-slate-800 dark:hover:text-white font-semibold"
                    }`}
                  >
                    Round {rd}
                  </button>
                ))}
              </div>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">Student Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50/50 dark:bg-slate-950/60 dark:text-white text-xs font-semibold focus:outline-none focus:border-[#FF9933] cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c} Category
                  </option>
                ))}
              </select>
            </div>

            {/* College search filter */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-2">
              <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">College Filter</label>
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50/50 dark:bg-slate-950/60 dark:text-white text-xs font-semibold focus:outline-none focus:border-[#FF9933] cursor-pointer"
              >
                <option value="All">All Engineering Colleges</option>
                {colleges.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code.split("-")[0]})
                  </option>
                ))}
              </select>
            </div>

            {/* Branch search filter */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-2">
              <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">Branch/Specialization</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50/50 dark:bg-slate-950/60 dark:text-white text-xs font-semibold focus:outline-none focus:border-[#FF9933] cursor-pointer"
              >
                <option value="All">All Branches</option>
                {uniqueBranches.map((b) => (
                  <option key={b} value={b}>
                    {branchNames[b] || b} ({b})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Cutoff Results Table */}
      <div className="glass-card rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-slate-800">
        <div className="px-6 py-4.5 border-b border-gray-200 dark:border-slate-850 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/40">
          <div>
            <h3 className="font-extrabold text-slate-800 dark:text-white flex items-center gap-2 text-base">
              <Layers className="w-5 h-5 text-[#2563EB]" />
              Cutoff Directory Table
            </h3>
            <p className="text-[10px] text-gray-450 font-semibold mt-0.5">
              Showing matching entries for year {selectedYear}, Round {selectedRound}, category {selectedCategory}.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/60 text-gray-550 dark:text-gray-400 font-extrabold uppercase tracking-wider text-[9px]">
                <th className="px-6 py-4">Engineering Institution</th>
                <th className="px-6 py-4">Branch Code</th>
                <th className="px-6 py-4">Gender Pool</th>
                <th className="px-6 py-4 text-center">Opening Rank</th>
                <th className="px-6 py-4 text-center">Closing Rank</th>
                <th className="px-6 py-4 text-right">Seat Intake</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 dark:divide-slate-850/80">
              {filteredCutoffs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-semibold text-xs leading-normal">
                    No cutoff records found matching the exact filters. Try selecting a broader filter.
                  </td>
                </tr>
              ) : (
                filteredCutoffs.map((item, index) => {
                  const college = colleges.find((c) => c.code === item.collegeCode);
                  return (
                    <tr
                      key={item.id || index}
                      className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="font-extrabold text-slate-850 dark:text-gray-200 text-[13px]">
                          {college ? college.name : item.collegeCode}
                        </div>
                        <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-[#138808]" />
                          {college ? college.location : "Bihar"} (Code: {item.collegeCode.split("-")[0]})
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded bg-[#FF9933]/10 text-[#FF9933] text-[10px] font-extrabold uppercase border border-[#FF9933]/15">
                          {item.branchCode}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                          {item.gender === "Female" ? "Female (RCG)" : "Co-ed Pool"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-black text-sm text-[#2563EB]">
                        {item.openingRank}
                      </td>
                      <td className="px-6 py-4 text-center font-black text-sm text-[#138808]">
                        {item.closingRank}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-500 dark:text-gray-400 font-semibold">
                        60 Seats
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AuthGate>
);
}
