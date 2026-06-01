"use client";

import React, { use } from "react";
import { useApp } from "../../../context/AppContext";
import { branchNames } from "../../../data/colleges";
import { getSeatMatrix } from "../../../data/seatMatrix";
import { 
  Building, 
  MapPin, 
  Calendar, 
  Layers, 
  TrendingUp, 
  DollarSign,
  Globe,
  Star,
  CheckCircle,
  FileText,
  BadgeAlert,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

interface CollegeDetailsProps {
  params: Promise<{ id: string }>;
}

export default function CollegeDetails({ params }: CollegeDetailsProps) {
  // Unwrap parameters according to Next.js 15 client-side standards
  const { id } = use(params);
  const { colleges, favorites, addFavorite, removeFavorite, cutoffs } = useApp();

  const college = colleges.find((c) => c.id === id);

  if (!college) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center">
        <BadgeAlert className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Institution Profile Not Found</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          The requested engineering college profile could not be located in our datastore.
        </p>
        <Link
          href="/colleges"
          className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-[#2563EB] text-white font-bold rounded-xl text-xs uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>
      </div>
    );
  }

  const isFav = favorites.includes(college.id);

  const toggleFavorite = () => {
    if (isFav) {
      removeFavorite(college.id);
    } else {
      addFavorite(college.id);
    }
  };

  // Fetch college specific cutoffs (showing 2025 Round 1 cutoffs for UR category as reference)
  const collegeCutoffs = cutoffs.filter(
    (c) => c.collegeCode === college.code && c.year === 2025 && c.round === 1 && c.category === "UR"
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link
        href="/colleges"
        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#2563EB] dark:hover:text-[#FF9933] font-bold uppercase tracking-wider mb-6 group transition-colors"
      >
        <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
        Back to Colleges Directory
      </Link>

      {/* Hero Header Cover */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm mb-8 h-64 sm:h-80">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={college.image}
          alt={college.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Floating Brand & Actions */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div className="space-y-1 sm:space-y-2">
            <span className="px-2.5 py-1 bg-[#FF9933]/15 text-[#FF9933] rounded-lg text-[9px] font-extrabold uppercase tracking-wide border border-[#FF9933]/25">
              Government Engineering Institution
            </span>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight">
              {college.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 font-semibold flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#138808]" />
              {college.location}, Bihar, India
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={toggleFavorite}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                isFav
                  ? "bg-amber-500 text-white border-amber-500"
                  : "bg-white/10 text-white border-white/20 hover:bg-white/25"
              }`}
            >
              <Star className={`w-4 h-4 ${isFav ? "fill-white" : ""}`} />
              {isFav ? "Favorited College" : "Bookmark Profile"}
            </button>
            <a
              href={college.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-800 hover:bg-gray-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#2563EB]" />
              Visit Website
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Quick Stats & Placement */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Facts Card */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-850 pb-2 flex items-center gap-1.5">
              <Building className="w-5 h-5 text-[#2563EB]" />
              College Quick Facts
            </h2>

            <ul className="space-y-4">
              <li className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-bold uppercase tracking-wider">Established Year</span>
                <span className="font-extrabold text-slate-700 dark:text-gray-200">{college.established}</span>
              </li>
              <li className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-bold uppercase tracking-wider">Campus Footprint</span>
                <span className="font-extrabold text-slate-700 dark:text-gray-200">{college.campusSize}</span>
              </li>
              <li className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-bold uppercase tracking-wider">Tuition Fees</span>
                <span className="font-extrabold text-slate-700 dark:text-gray-200">₹{college.tuitionFee.toLocaleString()} / Year</span>
              </li>
              <li className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-bold uppercase tracking-wider">Hostel Status</span>
                <span className="font-extrabold text-[#138808]">{college.hostelAvailable ? "Available" : "Not Available"}</span>
              </li>
              {college.hostelAvailable && (
                <li className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-wider">Hostel Fees</span>
                  <span className="font-extrabold text-slate-700 dark:text-gray-200">₹{college.hostelFee.toLocaleString()} / Year</span>
                </li>
              )}
            </ul>
          </div>

          {/* Placement Record Highlights */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-850 pb-2 flex items-center gap-1.5">
              <TrendingUp className="w-5 h-5 text-[#138808]" />
              Placement Highlights
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Average Package</span>
                <h4 className="text-xl font-extrabold text-[#138808] mt-1">{college.averagePackage.toFixed(2)} LPA</h4>
              </div>
              <div className="p-4 bg-[#2563EB]/5 border border-[#2563EB]/10 rounded-xl text-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Highest Package</span>
                <h4 className="text-xl font-extrabold text-[#2563EB] mt-1">{college.highestPackage.toFixed(2)} LPA</h4>
              </div>
            </div>

            {/* Recruiters list */}
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-2">Prime Recruiting Partners</span>
              <div className="flex flex-wrap gap-1.5">
                {college.recruits.map((rec) => (
                  <span
                    key={rec}
                    className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-gray-600 dark:text-gray-300"
                  >
                    {rec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: About, Seat Matrix, and Cutoff table */}
        <div className="lg:col-span-2 space-y-6">
          {/* About description */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3">About the Institute</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {college.description}
            </p>
          </div>

          {/* Seat matrix for this college */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-1.5">
              <Layers className="w-5 h-5 text-[#FF9933]" />
              Branch Seats Distribution
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 text-gray-450 uppercase font-bold tracking-wider">
                    <th className="px-4 py-3.5">Branch Specialization</th>
                    <th className="px-4 py-3.5 text-center">Branch Code</th>
                    <th className="px-4 py-3.5 text-center">B.Tech Intake</th>
                    <th className="px-4 py-3.5 text-right">Seat Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 dark:divide-slate-800/80">
                  {college.branches.map((b) => {
                    const matrix = getSeatMatrix(college.code, b);
                    return (
                      <tr key={b} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30">
                        <td className="px-4 py-3 font-bold text-slate-850 dark:text-gray-150">
                          {branchNames[b] || b}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-gray-500 dark:text-gray-300">
                            {b}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-slate-700 dark:text-gray-300">
                          {matrix.totalSeats} Seats
                        </td>
                        <td className="px-4 py-3 text-right text-gray-400">
                          {Math.round((matrix.totalSeats / (college.branches.length * 60)) * 100)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* College specific cutoffs reference */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-1.5">
              <FileText className="w-5 h-5 text-[#2563EB]" />
              Historical Cutoffs Reference (2025 - UR Round 1)
            </h2>

            {collegeCutoffs.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">
                No specific baseline cutoff statistics available for this college.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 text-gray-450 uppercase font-bold tracking-wider">
                      <th className="px-4 py-3">Branch</th>
                      <th className="px-4 py-3 text-center">Opening Merit Rank</th>
                      <th className="px-4 py-3 text-center">Closing Merit Rank</th>
                      <th className="px-4 py-3 text-right">Odds Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 dark:divide-slate-800/80">
                    {collegeCutoffs.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30">
                        <td className="px-4 py-3 font-bold text-slate-700 dark:text-gray-300">
                          {branchNames[item.branchCode] || item.branchCode} ({item.branchCode})
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-[#2563EB]">{item.openingRank}</td>
                        <td className="px-4 py-3 text-center font-bold text-[#138808]">{item.closingRank}</td>
                        <td className="px-4 py-3 text-right text-gray-400 font-semibold flex items-center justify-end gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          UR Pool
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
