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
  Building,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Link from "next/link";

interface FuzzyCollege {
  name: string;
  code: string;
  location: string;
  description: string;
}

function fuzzyMatchCollege(college: FuzzyCollege, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;

  const name = college.name.toLowerCase();
  const location = college.location.toLowerCase();
  const code = college.code.toLowerCase();
  const desc = college.description ? college.description.toLowerCase() : "";

  // 1. Direct substring match on any major field
  if (name.includes(q) || location.includes(q) || code.includes(q) || desc.includes(q)) {
    return true;
  }

  // 2. Space/punctuation-stripped direct match (handles GEC-Buxar as "gecbuxar")
  const cleanStr = (s: string) => s.replace(/[^a-z0-9]/g, "");
  const cleanQ = cleanStr(q);
  if (!cleanQ) return false;

  const cleanName = cleanStr(name);
  const cleanLoc = cleanStr(location);
  const cleanCode = cleanStr(code);
  const cleanDesc = cleanStr(desc);

  if (cleanName.includes(cleanQ) || cleanLoc.includes(cleanQ) || cleanCode.includes(cleanQ) || cleanDesc.includes(cleanQ)) {
    return true;
  }

  // 3. Initials Match (e.g. "gec" matches "Government Engineering College", "mit" matches "Muzaffarpur Institute of Technology")
  const words = name.split(/[^a-z0-9]+/);
  const initials = words.map(w => w[0]).join("");
  if (initials.includes(cleanQ)) {
    return true;
  }
  // Also check initials of code (e.g. GEC-BUXAR -> GECB)
  const codeWords = code.split(/[^a-z0-9]+/);
  const codeInitials = codeWords.map(w => w[0]).join("");
  if (codeInitials.includes(cleanQ)) {
    return true;
  }

  // 4. Consonant Skeleton Match (handles spelling variations like "buxur" vs "buxar", "muzafarpur" vs "muzaffarpur")
  // Helper to get consonant skeleton: remove vowels, deduplicate adjacent identical letters
  const getConsonantSkeleton = (s: string) => {
    return s
      .replace(/[aeiouy]/g, "") // remove vowels
      .replace(/([^a-z0-9])|(\1+)/g, "$1") // deduplicate letters (e.g. ff -> f, pp -> p)
      .replace(/(.)\1+/g, "$1"); // deduplicate remaining letters
  };

  const skeletonQ = getConsonantSkeleton(cleanQ);
  if (skeletonQ.length >= 2) {
    const skeletonName = getConsonantSkeleton(cleanName);
    const skeletonLoc = getConsonantSkeleton(cleanLoc);
    const skeletonCode = getConsonantSkeleton(cleanCode);

    if (skeletonName.includes(skeletonQ) || skeletonLoc.includes(skeletonQ) || skeletonCode.includes(skeletonQ)) {
      return true;
    }
  }

  // 5. Multi-word match: if the user types multiple words (e.g., "gec buxur"), check if each word of the query matches the college in some way
  const queryWords = q.split(/\s+/).filter(Boolean);
  if (queryWords.length > 1) {
    const allWordsMatch = queryWords.every(qw => {
      return fuzzyMatchCollege(college, qw);
    });
    if (allWordsMatch) return true;
  }

  return false;
}

export default function CollegesDirectory() {
  const { colleges } = useApp();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [minPlacement, setMinPlacement] = useState(3.5);
  const [maxFee, setMaxFee] = useState(15000);
  const [sortBy, setSortBy] = useState("established"); // established, averagePackage, highestPackage, name
  const [mobileFiltersExpanded, setMobileFiltersExpanded] = useState(false);

  // Active filter count
  const activeFilterCount = 
    (searchTerm ? 1 : 0) + 
    (minPlacement > 3.5 ? 1 : 0) + 
    (maxFee < 15000 ? 1 : 0) + 
    (sortBy !== "established" ? 1 : 0);

  // Filter logic
  const filteredColleges = colleges.filter((c) => {
    const matchesSearch = fuzzyMatchCollege(c, searchTerm);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-10 -z-10 h-[350px] w-[350px] rounded-full bg-gradient-to-tr from-[#FF9933]/10 to-[#138808]/10 blur-3xl opacity-60"></div>
      <div className="absolute bottom-10 left-10 -z-10 h-[250px] w-[250px] rounded-full bg-gradient-to-br from-[#2563EB]/10 to-[#138808]/10 blur-3xl opacity-60"></div>

      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#138808]/10 border border-[#138808]/20 text-[#138808] text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
          <Building className="w-3.5 h-3.5" />
          Technical Institutions Directory
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">
          Bihar Engineering <br />
          <span className="gradient-text-premium font-black drop-shadow-sm">
            Colleges Database
          </span>
        </h1>
        <p className="mt-3.5 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Browse location profiles, placements statistics, seat availability, fees structures, and course details for engineering colleges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Side: Directory Filters Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-2xl p-5 shadow-lg lg:sticky lg:top-24 transition-all duration-300">
            <div className={`flex items-center justify-between w-full pb-2 ${mobileFiltersExpanded ? "border-b border-gray-100 dark:border-slate-850 mb-4" : "lg:border-b lg:border-gray-100 lg:dark:border-slate-850 lg:mb-4"}`}>
              <button
                onClick={() => setMobileFiltersExpanded(!mobileFiltersExpanded)}
                className="w-full flex items-center justify-between text-left focus:outline-none lg:cursor-default"
              >
                <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Filter className="w-4.5 h-4.5 text-[#FF9933]" />
                  Database Filters
                  {activeFilterCount > 0 && (
                    <span className="px-2 py-0.5 text-[9px] font-extrabold bg-[#FF9933]/15 text-[#FF9933] rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </h2>
                <div className="lg:hidden p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  {mobileFiltersExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  )}
                </div>
              </button>
            </div>

            <div className={`space-y-5 lg:block ${mobileFiltersExpanded ? "block animate-fade-in" : "hidden"}`}>
              {/* Search input */}
              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">Fuzzy Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, city..."
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/60 dark:text-white rounded-xl text-xs focus:outline-none focus:border-[#FF9933] focus:ring-1 focus:ring-[#FF9933] transition-all placeholder-slate-400 font-semibold"
                  />
                </div>
              </div>

              {/* Placement range */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs font-bold">
                  <label className="text-gray-400 uppercase tracking-wider text-[10px]">Min Avg Placement</label>
                  <span className="text-[#138808] bg-[#138808]/10 px-2 py-0.5 rounded text-[10px]">{minPlacement} LPA</span>
                </div>
                <input
                  type="range"
                  min="3.5"
                  max="6.0"
                  step="0.1"
                  value={minPlacement}
                  onChange={(e) => setMinPlacement(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-250 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#138808]"
                />
              </div>

              {/* Tuition fee range */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs font-bold">
                  <label className="text-gray-400 uppercase tracking-wider text-[10px]">Max Tuition Fee</label>
                  <span className="text-[#2563EB] bg-[#2563EB]/10 px-2 py-0.5 rounded text-[10px]">₹{maxFee.toLocaleString()}/yr</span>
                </div>
                <input
                  type="range"
                  min="8000"
                  max="16000"
                  step="500"
                  value={maxFee}
                  onChange={(e) => setMaxFee(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-250 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
                />
              </div>

              {/* Sorting Filter */}
              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">Sort Directory</label>
                <div className="relative">
                  <ArrowUpDown className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/60 dark:text-white rounded-xl text-xs focus:outline-none focus:border-[#FF9933] focus:ring-1 focus:ring-[#FF9933] transition-all font-semibold cursor-pointer"
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
            <div className="py-20 text-center glass-card border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <Search className="w-12 h-12 text-gray-300 dark:text-slate-800 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">No Colleges Found</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
                No matching results found for search filters. Try resetting sliders or modifying keywords.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
              {sortedColleges.map((college) => {
                return (
                  <div
                    key={college.id}
                    className="glass-card rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#FF9933]/15 flex flex-col group transition-all duration-500 transform hover:-translate-y-2 relative"
                  >
                    {/* Decorative hover gradient glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FF9933]/20 to-[#2563EB]/20 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-2xl pointer-events-none" />

                    {/* Visual Card Image Cover */}
                    <div className="h-48 bg-slate-200 dark:bg-slate-850 relative overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={college.image}
                        alt={college.name}
                        className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out opacity-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                      {/* Location Badge */}
                      <span className="absolute bottom-3.5 left-4 px-2.5 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg text-[10px] font-bold tracking-wide uppercase flex items-center gap-1.5 shadow-sm">
                        <MapPin className="w-3.5 h-3.5 text-[#FF9933]" />
                        {college.location}, Bihar
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest">
                            Estd {college.established} | {college.campusSize}
                          </span>
                          {college.nirf && (
                            <span className="px-2 py-0.5 border border-[#2563EB]/20 bg-[#2563EB]/5 dark:bg-[#2563EB]/10 text-[#2563EB] rounded text-[9px] font-extrabold">
                              NIRF: {college.nirf}
                            </span>
                          )}
                        </div>
                        <h3 className="font-extrabold text-base text-slate-800 dark:text-gray-150 leading-snug group-hover:text-[#2563EB] transition-colors duration-300">
                          {college.name}
                        </h3>
                      </div>

                      {/* Key Placements Metrics Section */}
                      <div className="my-4 grid grid-cols-2 gap-3 border-t border-b border-gray-100 dark:border-slate-850 py-3.5 shrink-0">
                        <div>
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Average Placement</span>
                          <span className="text-sm font-black text-[#138808] flex items-center gap-1.5 mt-0.5">
                            <TrendingUp className="w-4 h-4" />
                            {college.averagePackage.toFixed(2)} LPA
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Highest Package</span>
                          <span className="text-sm font-black text-[#2563EB] flex items-center gap-1.5 mt-0.5">
                            <Award className="w-4 h-4" />
                            {college.highestPackage.toFixed(2)} LPA
                          </span>
                        </div>
                      </div>

                      {/* Branches offered */}
                      <div className="mb-5 shrink-0">
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-2">Branches Offered ({college.branches.length})</span>
                        <div className="flex flex-wrap gap-1">
                          {college.branches.slice(0, 4).map((b) => (
                            <span
                              key={b}
                              className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-850 text-[10px] font-bold text-gray-500 dark:text-gray-300"
                            >
                              {b}
                            </span>
                          ))}
                          {college.branches.length > 4 && (
                            <span className="px-2 py-0.5 rounded bg-[#FF9933]/15 text-[#FF9933] text-[10px] font-bold">
                              +{college.branches.length - 4} More
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <Link
                        href={`/colleges/${college.id}`}
                        className="w-full py-3 bg-slate-50 dark:bg-slate-850/50 hover:bg-gradient-to-r hover:from-[#FF9933] hover:to-[#138808] hover:text-white dark:hover:from-[#FF9933] dark:hover:to-[#138808] text-slate-800 dark:text-gray-300 font-extrabold text-center text-xs rounded-xl border border-gray-200/80 dark:border-slate-850 hover:border-transparent transition-all duration-300 flex items-center justify-center gap-1.5 group/btn shadow-sm hover:shadow-[0_0_15px_rgba(255,153,51,0.4)] cursor-pointer overflow-hidden relative"
                      >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                        View Full College Profile
                        <Compass className="w-4 h-4 group-hover/btn:rotate-45 transition-transform duration-300" />
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

