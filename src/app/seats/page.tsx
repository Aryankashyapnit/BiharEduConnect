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
import { AuthGate } from "../../components/AuthGate";

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
    <AuthGate>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Decorative Blur Elements */}
      <div className="absolute top-0 right-10 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-[#FF9933]/10 to-[#2563EB]/10 blur-3xl opacity-50"></div>
      <div className="absolute bottom-10 left-10 -z-10 h-[250px] w-[250px] rounded-full bg-gradient-to-br from-[#138808]/10 to-[#FF9933]/10 blur-3xl opacity-50"></div>

      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 relative">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-3">
          <Layers className="w-3.5 h-3.5" />
          Intake & Seat Distribution
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">
          Bihar Engineering <br />
          <span className="gradient-text-premium font-black">
            Seat Matrix Dashboard
          </span>
        </h1>
        <p className="mt-3.5 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Analyze branch-specific allocations, institutional quotas, and reservation category structures for B.Tech counselling admissions.
        </p>
      </div>

      {/* Aggregate Statistics Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="glass-card p-5 rounded-2xl shadow-md text-center hover-lift transition-all duration-300 border border-gray-150">
          <span className="text-[10px] text-gray-450 font-extrabold uppercase tracking-wider block">Total B.Tech Seats</span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#2563EB] mt-1.5">{totalBtechSeats}</h3>
          <p className="text-[9px] text-gray-450 mt-1 font-semibold">Across all government colleges</p>
        </div>
        <div className="glass-card p-5 rounded-2xl shadow-md text-center hover-lift transition-all duration-300 border border-gray-150">
          <span className="text-[10px] text-gray-450 font-extrabold uppercase tracking-wider block">Government Institutions</span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#FF9933] mt-1.5">{totalInstitutes}</h3>
          <p className="text-[9px] text-gray-450 mt-1 font-semibold">Participating in UGEAC admissions</p>
        </div>
        <div className="glass-card p-5 rounded-2xl shadow-md text-center hover-lift transition-all duration-300 border border-gray-150">
          <span className="text-[10px] text-gray-450 font-extrabold uppercase tracking-wider block">Selected College Intake</span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#138808] mt-1.5">{totalCollegeSeats} Seats</h3>
          <p className="text-[9px] text-gray-450 mt-1 font-semibold truncate max-w-[200px] mx-auto">{collegeSelectedObj.name}</p>
        </div>
        <div className="glass-card p-5 rounded-2xl shadow-md text-center hover-lift transition-all duration-300 border border-gray-150">
          <span className="text-[10px] text-gray-450 font-extrabold uppercase tracking-wider block">Counselling Board</span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white mt-2 uppercase tracking-wide">BCECEB</h3>
          <p className="text-[9px] text-gray-450 mt-1 font-semibold">Patna, Bihar (UGEAC-2026)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Filter and Visual Progress distribution */}
        <div className="lg:col-span-1 space-y-6">
          {/* Controls Card */}
          <div className="glass-card rounded-2xl p-5 shadow-md transition-all duration-300">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-slate-850">
              <Grid className="w-4.5 h-4.5 text-[#2563EB]" />
              Select Institution
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">Government College</label>
                <select
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50/50 dark:bg-slate-950/60 dark:text-white text-xs font-semibold focus:outline-none focus:border-[#FF9933] cursor-pointer"
                >
                  {colleges.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">Branch Filter</label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50/50 dark:bg-slate-950/60 dark:text-white text-xs font-semibold focus:outline-none focus:border-[#FF9933] cursor-pointer"
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
          <div className="glass-card rounded-2xl p-5 shadow-md transition-all duration-300">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-slate-850">
              <Percent className="w-4.5 h-4.5 text-[#FF9933]" />
              Category Breakdowns
            </h2>

            <div className="space-y-4">
              {seatCategories.map((sc) => {
                const count = catAggregates[sc.code] || 0;
                const percentage = totalCollegeSeats > 0 ? Math.round((count / totalCollegeSeats) * 100) : 0;
                return (
                  <div key={sc.code}>
                    <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                      <span className="text-slate-700 dark:text-gray-300 text-[11px]">{sc.name} ({sc.code})</span>
                      <span className="text-gray-550 dark:text-gray-400 text-[10px]">{count} Seats ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-150 dark:bg-slate-850 h-2 rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${getCategoryColor(sc.code)}`}
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
          <div className="glass-card rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-slate-800 transition-all duration-300">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-850 bg-slate-50/30 dark:bg-slate-900/40 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-850 dark:text-white flex items-center gap-2 text-base">
                  <Users className="w-5 h-5 text-[#138808]" />
                  Branch-wise Seat Distribution Matrix
                </h3>
                <p className="text-[10px] text-gray-450 font-semibold mt-0.5">
                  Detailed category allocation mapping for B.Tech courses.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/60 text-gray-450 dark:text-gray-400 font-extrabold text-[9px] uppercase tracking-wider">
                    <th className="px-6 py-4">Branch Description</th>
                    {seatCategories.map((sc) => (
                      <th key={sc.code} className="px-3 py-4 text-center">
                        {sc.code}
                      </th>
                    ))}
                    <th className="px-6 py-4 text-right">Total Intake</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 dark:divide-slate-850/80">
                  {entries.map((entry, index) => (
                    <tr key={index} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors duration-200">
                      <td className="px-6 py-4 font-extrabold text-slate-800 dark:text-gray-200 text-[13px]">
                        {branchNames[entry.branchCode] || entry.branchCode}
                        <div className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest mt-1">
                          Code: {entry.branchCode}
                        </div>
                      </td>
                      {seatCategories.map((sc) => {
                        const seats = entry.categorySeats[sc.code] || 0;
                        return (
                          <td key={sc.code} className="px-3 py-4 text-center font-black text-slate-700 dark:text-gray-300 text-sm">
                            {seats === 0 ? (
                              <span className="text-gray-300 dark:text-slate-800">-</span>
                            ) : (
                              seats
                            )}
                          </td>
                        );
                      })}
                      <td className="px-6 py-4 text-right font-black text-sm text-[#2563EB]">
                        {entry.totalSeats} Seats
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50/50 dark:bg-slate-950/60 border-t border-gray-150 dark:border-slate-850 flex gap-2.5">
              <Info className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                **Note**: In addition to standard category allocations shown above, 5% Tuition Fee Waiver (TFW) supernumerary seats and Disabled Quota (DQ) / Service Man Quota (SMQ) horizontal reservations are dynamically added by the board during actual allotments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AuthGate>
);
}

