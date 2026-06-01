"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { branchNames } from "../../data/colleges";
import { 
  Search, 
  MapPin, 
  TrendingUp, 
  Award, 
  Bookmark, 
  Star,
  Compass,
  ArrowUpDown,
  Filter,
  Building
} from "lucide-react";
import Link from "next/link";

export default function CollegesDirectory() {
  const { colleges, favorites, addFavorite, removeFavorite } = useApp();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [minPlacement, setMinPlacement] = useState(3.5);
  const [maxFee, setMaxFee] = useState(15000);
  const [sortBy, setSortBy] = useState("established"); // established, averagePackage, highestPackage, name

  // Filter logic
  const filteredColleges = colleges.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlacement = c.averagePackage >= minPlacement;
    const matchesFee = c.tuitionFee <= maxFee;

    return matchesSearch && matchesPlacement && matchesFee;
  });

  // Sort logic
  const sortedColleges = [...filteredColleges].sort((a, b) => {
    if (sortBy === "established") return a.established - b.established; // older first
    if (sortBy === "averagePackage") return b.averagePackage - a.averagePackage; // highest first
    if (sortBy === "highestPackage") return b.highestPackage - a.highestPackage; // highest first
    if (sortBy === "name") return a.name.localeCompare(b.name); // A-Z
    return 0;
  });

  const toggleFavorite = (collegeId: string) => {
    if (favorites.includes(collegeId)) {
      removeFavorite(collegeId);
    } else {
      addFavorite(collegeId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#138808]/10 text-[#138808] text-xs font-bold uppercase tracking-wider mb-3">
          <Building className="w-3.5 h-3.5" />
          Technical Institutions Directory
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Bihar Engineering <span className="bg-gradient-to-r from-[#FF9933] to-[#138808] bg-clip-text text-transparent">Colleges Database</span>
        </h1>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
          Browse location profiles, placements statistics, seat availability, fees structures, and course details for engineering colleges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Side: Directory Filters Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-gray-250/70 dark:border-slate-800 rounded-2xl p-5 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-[#FF9933]" />
              Database Filters
            </h2>

            <div className="space-y-5">
              {/* Search input */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Fuzzy Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, city..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-250 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 dark:text-white rounded-xl text-xs focus:outline-none focus:border-[#FF9933]"
                  />
                </div>
              </div>

              {/* Placement range */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs font-bold">
                  <label className="text-gray-400 uppercase">Min Avg Placement</label>
                  <span className="text-[#138808]">{minPlacement} LPA</span>
                </div>
                <input
                  type="range"
                  min="3.5"
                  max="6.0"
                  step="0.1"
                  value={minPlacement}
                  onChange={(e) => setMinPlacement(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#138808]"
                />
              </div>

              {/* Tuition fee range */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs font-bold">
                  <label className="text-gray-400 uppercase">Max Tuition Fee</label>
                  <span className="text-[#2563EB]">₹{maxFee.toLocaleString()}/yr</span>
                </div>
                <input
                  type="range"
                  min="8000"
                  max="16000"
                  step="500"
                  value={maxFee}
                  onChange={(e) => setMaxFee(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
                />
              </div>

              {/* Sorting Filter */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Sort Directory</label>
                <div className="relative">
                  <ArrowUpDown className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-250 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 dark:text-white rounded-xl text-xs focus:outline-none focus:border-[#FF9933]"
                  >
                    <option value="established">Established Year (Oldest First)</option>
                    <option value="averagePackage">Placement Average (Highest First)</option>
                    <option value="highestPackage">Placement Highest (Highest First)</option>
                    <option value="name">College Name (A-Z)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Grid Directory List */}
        <div className="lg:col-span-3 space-y-6">
          {sortedColleges.length === 0 ? (
            <div className="py-20 text-center bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">No Colleges Found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
                No matching results found for search filters. Try resetting sliders or modifying keywords.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {sortedColleges.map((college) => {
                const fav = favorites.includes(college.id);
                return (
                  <div
                    key={college.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col group"
                  >
                    {/* Visual Card Image Cover */}
                    <div className="h-44 bg-slate-200 dark:bg-slate-850 relative overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={college.image}
                        alt={college.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-transparent" />

                      {/* Location Badge */}
                      <span className="absolute bottom-3 left-4 px-2.5 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg text-[10px] font-bold tracking-wide uppercase flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#FF9933]" />
                        {college.location}, Bihar
                      </span>

                      {/* Favorite Button */}
                      <button
                        onClick={() => toggleFavorite(college.id)}
                        className={`absolute top-3 right-4 p-2 rounded-xl backdrop-blur-md border cursor-pointer transition-colors ${
                          fav
                            ? "bg-amber-500/80 text-white border-amber-500/10"
                            : "bg-black/35 text-white/80 border-white/10 hover:bg-black/50"
                        }`}
                      >
                        <Star className={`w-4 h-4 ${fav ? "fill-white" : ""}`} />
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] text-gray-400 font-extrabold uppercase">
                            Estd {college.established} | {college.campusSize}
                          </span>
                          {college.nirf && (
                            <span className="px-2 py-0.5 border border-[#2563EB]/20 bg-[#2563EB]/5 text-[#2563EB] rounded text-[9px] font-bold">
                              NIRF: {college.nirf}
                            </span>
                          )}
                        </div>
                        <h3 className="font-extrabold text-base text-slate-800 dark:text-gray-150 leading-snug group-hover:text-[#2563EB] transition-colors duration-200">
                          {college.name}
                        </h3>
                      </div>

                      {/* Key Placements Metrics Section */}
                      <div className="my-4 grid grid-cols-2 gap-3 border-t border-b border-gray-100 dark:border-slate-800 py-3.5 shrink-0">
                        <div>
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Average Placement</span>
                          <span className="text-sm font-extrabold text-[#138808] flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {college.averagePackage.toFixed(2)} LPA
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Highest Package</span>
                          <span className="text-sm font-extrabold text-[#2563EB] flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            {college.highestPackage.toFixed(2)} LPA
                          </span>
                        </div>
                      </div>

                      {/* Branches offered */}
                      <div className="mb-4 shrink-0">
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Branches Offered ({college.branches.length})</span>
                        <div className="flex flex-wrap gap-1">
                          {college.branches.slice(0, 4).map((b) => (
                            <span
                              key={b}
                              className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-gray-500 dark:text-gray-300"
                            >
                              {b}
                            </span>
                          ))}
                          {college.branches.length > 4 && (
                            <span className="px-1.5 py-0.5 rounded bg-[#FF9933]/15 text-[#FF9933] text-[10px] font-bold">
                              +{college.branches.length - 4} More
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <Link
                        href={`/colleges/${college.id}`}
                        className="w-full py-2 bg-slate-50 dark:bg-slate-850 hover:bg-[#2563EB] hover:text-white dark:hover:bg-[#2563EB] text-slate-800 dark:text-gray-300 font-bold text-center text-xs rounded-xl border border-gray-200/80 dark:border-slate-850 hover:border-[#2563EB] transition-all flex items-center justify-center gap-1 group"
                      >
                        View Full College Profile
                        <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
