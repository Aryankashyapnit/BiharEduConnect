"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { getSeatMatrix, seatCategories } from "../../data/seatMatrix";
import { branchNames } from "../../data/colleges";
import { 
  Layers, 
  Search, 
  MapPin, 
  Info,
  Users,
  Grid,
  TrendingUp,
  Percent
} from "lucide-react";

export default function SeatMatrixDashboard() {
  const { colleges } = useApp();

  // Filter States
  const [selectedCollege, setSelectedCollege] = useState("MIT-MUZAFFARPUR");
  const [selectedBranch, setSelectedBranch] = useState("All");

  const collegeSelectedObj = colleges.find((c) => c.code === selectedCollege) || colleges[0];

  // Aggregate stats across all colleges
  const totalBtechSeats = colleges.reduce((sum, c) => sum + c.branches.length * 60, 0);
  const totalInstitutes = colleges.length;

  // Filtered branches for matrix list
  const activeBranches = selectedBranch === "All" 
    ? collegeSelectedObj.branches 
    : collegeSelectedObj.branches.filter(b => b === selectedBranch);

  const entries = activeBranches.map(branchCode => getSeatMatrix(selectedCollege, branchCode));

  // Category wise totals for selected college
  const getCategoryAggregate = () => {
    const aggregate: Record<string, number> = { UR: 0, BC: 0, EBC: 0, SC: 0, ST: 0, EWS: 0, RCG: 0 };
    entries.forEach(entry => {
      Object.keys(aggregate).forEach(cat => {
        aggregate[cat] += entry.categorySeats[cat] || 0;
      });
    });
    return aggregate;
  };

  const catAggregates = getCategoryAggregate();
  const totalCollegeSeats = Object.values(catAggregates).reduce((sum, v) => sum + v, 0);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "UR": return "bg-[#2563EB]"; // blue
      case "BC": return "bg-[#FF9933]"; // saffron
      case "EBC": return "bg-[#138808]"; // green
      case "SC": return "bg-red-500";
      case "ST": return "bg-purple-500";
      case "EWS": return "bg-teal-500";
      case "RCG": return "bg-pink-500";
      default: return "bg-slate-400";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-3">
          <Layers className="w-3.5 h-3.5" />
          Intake & Seat Distribution
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Bihar Engineering <span className="bg-gradient-to-r from-[#FF9933] to-[#138808] bg-clip-text text-transparent">Seat Matrix Dashboard</span>
        </h1>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
          Analyze branch-specific allocations, institutional quotas, and reservation category structures for B.Tech counselling admissions.
        </p>
      </div>

      {/* Aggregate Statistics Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-center">
          <span className="text-xs text-gray-400 font-bold uppercase">Total B.Tech Seats</span>
          <h3 className="text-2xl font-extrabold text-[#2563EB] mt-1">{totalBtechSeats}</h3>
          <p className="text-[10px] text-gray-400 mt-0.5">Across all government engineering colleges</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-center">
          <span className="text-xs text-gray-400 font-bold uppercase">Government Institutions</span>
          <h3 className="text-2xl font-extrabold text-[#FF9933] mt-1">{totalInstitutes}</h3>
          <p className="text-[10px] text-gray-400 mt-0.5">Participating in UGEAC admissions</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-center">
          <span className="text-xs text-gray-400 font-bold uppercase">Selected College Intake</span>
          <h3 className="text-2xl font-extrabold text-[#138808] mt-1">{totalCollegeSeats} Seats</h3>
          <p className="text-[10px] text-gray-400 mt-0.5">{collegeSelectedObj.name}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-center">
          <span className="text-xs text-gray-400 font-bold uppercase">Counselling Board</span>
          <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mt-1.5 uppercase">BCECEB</h3>
          <p className="text-[10px] text-gray-400 mt-0.5">Patna, Bihar (UGEAC-2026)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Filter and Visual Progress distribution */}
        <div className="lg:col-span-1 space-y-6">
          {/* Controls Card */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Grid className="w-5 h-5 text-[#2563EB]" />
              Select Institution
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Government College</label>
                <select
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold border border-gray-200 dark:border-slate-800 rounded-lg bg-gray-50 dark:bg-slate-950 dark:text-white"
                >
                  {colleges.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Branch Filter</label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold border border-gray-200 dark:border-slate-800 rounded-lg bg-gray-50 dark:bg-slate-950 dark:text-white"
                >
                  <option value="All">All Branches</option>
                  {collegeSelectedObj.branches.map((b) => (
                    <option key={b} value={b}>
                      {branchNames[b] || b} ({b})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Visual Percentage Breakdown */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Percent className="w-5 h-5 text-[#FF9933]" />
              Category Breakdowns
            </h2>

            <div className="space-y-3.5">
              {seatCategories.map((sc) => {
                const count = catAggregates[sc.code] || 0;
                const percentage = totalCollegeSeats > 0 ? Math.round((count / totalCollegeSeats) * 100) : 0;
                return (
                  <div key={sc.code}>
                    <div className="flex justify-between items-center text-xs font-bold mb-1">
                      <span className="text-slate-700 dark:text-gray-300">{sc.name} ({sc.code})</span>
                      <span className="text-gray-500">{count} Seats ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-150 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getCategoryColor(sc.code)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Grid Table Matrix */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-850 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#138808]" />
                  Branch-wise Seat Distribution Matrix
                </h3>
                <p className="text-xs text-gray-400">
                  Detailed category allocation mapping for B.Tech courses.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 text-gray-450 dark:text-gray-400 font-bold text-xs uppercase tracking-wider">
                    <th className="px-6 py-4">Branch Description</th>
                    {seatCategories.map((sc) => (
                      <th key={sc.code} className="px-3 py-4 text-center">
                        {sc.code}
                      </th>
                    ))}
                    <th className="px-6 py-4 text-right">Total Intake</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 dark:divide-slate-800/80">
                  {entries.map((entry, index) => (
                    <tr key={index} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-gray-200">
                        {branchNames[entry.branchCode] || entry.branchCode}
                        <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">
                          Code: {entry.branchCode}
                        </div>
                      </td>
                      {seatCategories.map((sc) => {
                        const seats = entry.categorySeats[sc.code] || 0;
                        return (
                          <td key={sc.code} className="px-3 py-4 text-center font-bold text-slate-700 dark:text-gray-300">
                            {seats === 0 ? (
                              <span className="text-gray-300 dark:text-slate-800">-</span>
                            ) : (
                              seats
                            )}
                          </td>
                        );
                      })}
                      <td className="px-6 py-4 text-right font-extrabold text-[#2563EB]">
                        {entry.totalSeats} Seats
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-gray-150 dark:border-slate-850 flex gap-2">
              <Info className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal">
                **Note**: In addition to standard category allocations shown above, 5% Tuition Fee Waiver (TFW) supernumerary seats and Disabled Quota (DQ) / Service Man Quota (SMQ) horizontal reservations are dynamically added by the board during actual allotments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
