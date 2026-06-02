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

  const categories = ["UR", "BC", "EBC", "SC", "ST", "EWS", "RCG"];
  const branches = ["CSE", "ECE", "EE", "EEE", "ME", "CE", "IT"];

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
    const branch = selectedBranch === "All" ? "CSE" : selectedBranch;
    
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
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#138808]/10 text-[#138808] text-xs font-bold uppercase tracking-wider mb-3">
          <TrendingUp className="w-3.5 h-3.5" />
          Cutoff & Trend Explorer
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          BCECE UGEAC <span className="bg-gradient-to-r from-[#2563EB] to-[#138808] bg-clip-text text-transparent">Cutoff Database</span>
        </h1>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
          Search and visualize historical opening and closing ranks for engineering admissions across multiple rounds, branches, and categories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Trend Analyzer Panel */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-gray-250/70 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-[#FF9933]" />
              Cutoff Trend Analysis
            </h2>
            <p className="text-xs text-gray-400 leading-normal mb-4">
              Showing visual closing rank trend for **{selectedCollege === "All" ? "MIT Muzaffarpur" : colleges.find(c => c.code === selectedCollege)?.name}** (Branch: **{selectedBranch === "All" ? "CSE" : selectedBranch}**, Category: **{selectedCategory}**).
            </p>

            {/* SVG Trend Line Chart */}
            <div className="w-full bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-gray-150 dark:border-slate-800/80 p-3 flex items-center justify-center">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
                {/* Grid Lines */}
                {[0, 1, 2, 3].map((g, i) => {
                  const y = padding + (i * (height - 2 * padding)) / 3;
                  const label = Math.round(maxVal - (i * (maxVal - minVal)) / 3);
                  return (
                    <g key={i} className="opacity-40 dark:opacity-20">
                      <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
                      <text x={padding - 8} y={y + 4} fill="#64748b" fontSize="10" textAnchor="end" className="font-semibold">
                        {label}
                      </text>
                    </g>
                  );
                })}

                {/* X Axis Labels */}
                {trendPoints.map((p, index) => {
                  const x = padding + (index * (width - 2 * padding)) / (trendPoints.length - 1);
                  return (
                    <text key={index} x={x} y={height - 12} fill="#64748b" fontSize="10" textAnchor="middle" className="font-semibold opacity-80">
                      {p.label}
                    </text>
                  );
                })}

                {/* Draw Trend Polyline */}
                <polyline fill="none" stroke="url(#trend-grad)" strokeWidth="3" points={pointsString} />

                {/* Draw Data Points Circles */}
                {trendPoints.map((p, index) => {
                  const x = padding + (index * (width - 2 * padding)) / (trendPoints.length - 1);
                  const y = height - padding - ((p.value - minVal) / (maxVal - minVal)) * (height - 2 * padding);
                  return (
                    <g key={index} className="group cursor-pointer">
                      <circle cx={x} cy={y} r="5" fill="#2563EB" stroke="#ffffff" strokeWidth="1.5" className="hover:scale-125 transition-transform" />
                      <rect x={x - 22} y={y - 25} width="44" height="16" rx="4" fill="#1e293b" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      <text x={x} y={y - 14} fill="#ffffff" fontSize="9" textAnchor="middle" className="font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
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

          <div className="mt-4 p-3.5 bg-[#2563EB]/5 dark:bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-xl flex gap-2">
            <Info className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal">
              💡 **Insight**: A downward trend in closing rank numbers indicates a branch is gaining popularity (tighter cutoffs). Upward trends mean branches are easier to secure.
            </p>
          </div>
        </div>

        {/* Right Columns: Filtering Controls Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-gray-250/70 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            <Grid className="w-5 h-5 text-[#138808]" />
            Search Filters
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
            {/* Year filter */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Counselling Year</label>
              <div className="flex rounded-lg border border-gray-200 dark:border-slate-800 overflow-hidden font-bold">
                {[2025, 2024, 2023].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`flex-1 py-1.5 text-xs text-center cursor-pointer transition-colors ${
                      selectedYear === yr
                        ? "bg-[#FF9933] text-white"
                        : "bg-slate-50 dark:bg-slate-950 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            {/* Round filter */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Counselling Round</label>
              <div className="flex rounded-lg border border-gray-200 dark:border-slate-800 overflow-hidden font-bold">
                {[1, 2].map((rd) => (
                  <button
                    key={rd}
                    onClick={() => setSelectedRound(rd)}
                    className={`flex-1 py-1.5 text-xs text-center cursor-pointer transition-colors ${
                      selectedRound === rd
                        ? "bg-[#138808] text-white"
                        : "bg-slate-50 dark:bg-slate-950 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    Round {rd}
                  </button>
                ))}
              </div>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Student Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold border border-gray-200 dark:border-slate-800 rounded-lg bg-gray-50 dark:bg-slate-950 dark:text-white"
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
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">College Filter</label>
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold border border-gray-200 dark:border-slate-800 rounded-lg bg-gray-50 dark:bg-slate-950 dark:text-white"
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
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Branch/Specialization</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold border border-gray-200 dark:border-slate-800 rounded-lg bg-gray-50 dark:bg-slate-950 dark:text-white"
              >
                <option value="All">All Branches</option>
                {branches.map((b) => (
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
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-850 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <Layers className="w-5 h-5 text-[#2563EB]" />
              Cutoff Directory Table
            </h3>
            <p className="text-xs text-gray-400">
              Showing matching entries for year {selectedYear}, Round {selectedRound}, category {selectedCategory}.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 text-gray-550 dark:text-gray-400 font-semibold text-xs uppercase tracking-wider">
                <th className="px-6 py-3.5">Engineering Institution</th>
                <th className="px-6 py-3.5">Branch Code</th>
                <th className="px-6 py-3.5">Gender Pool</th>
                <th className="px-6 py-3.5 text-center">Opening Rank</th>
                <th className="px-6 py-3.5 text-center">Closing Rank</th>
                <th className="px-6 py-3.5 text-right">Seat Intake</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 dark:divide-slate-800/80">
              {filteredCutoffs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 font-semibold">
                    No cutoff records found matching the exact filters. Try selecting a broader filter.
                  </td>
                </tr>
              ) : (
                filteredCutoffs.map((item, index) => {
                  const college = colleges.find((c) => c.code === item.collegeCode);
                  return (
                    <tr
                      key={item.id || index}
                      className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-850 dark:text-gray-150">
                          {college ? college.name : item.collegeCode}
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#138808]" />
                          {college ? college.location : "Bihar"} (Code: {item.collegeCode.split("-")[0]})
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded bg-[#FF9933]/10 text-[#FF9933] text-xs font-bold uppercase">
                          {item.branchCode}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                          {item.gender === "Female" ? "Female (RCG)" : "Co-ed Pool"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-[#2563EB]">
                        {item.openingRank}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-[#138808]">
                        {item.closingRank}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400 font-semibold">
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
