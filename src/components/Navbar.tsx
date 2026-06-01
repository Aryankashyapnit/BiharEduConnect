"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "../context/AppContext";
import { 
  GraduationCap, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Bookmark, 
  TrendingUp, 
  ShieldAlert, 
  Layers, 
  Info,
  GitCompare,
  Compass,
  User,
  Clock
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { 
    favorites, 
    savedPredictions, 
    darkMode, 
    toggleDarkMode,
    user,
    logout,
    setShowAuthModal
  } = useApp();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdminRoute = pathname === "/admin";

  const navLinks = [
    { href: "/colleges", label: "Colleges DB", icon: GraduationCap },
    { href: "/predictor", label: "Predictor", icon: Compass },
    { href: "/cutoffs", label: "Cutoffs", icon: TrendingUp },
    { href: "/compare", label: "Compare Tools", icon: GitCompare },
    { href: "/guide", label: "Counselling Guide", icon: Info },
    { href: "/timeline", label: "Timeline", icon: Clock }
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand Identity */}
          <div className="flex items-center">
            <Link 
              href={user ? (user.isAdmin ? "/admin" : "/dashboard") : "/"} 
              className="flex items-center gap-2 group"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF9933] to-[#138808] text-white shadow-md shadow-[#FF9933]/10 transform transition-transform group-hover:scale-105 duration-300">
                <GraduationCap className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2563EB] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2563EB]"></span>
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white group-hover:text-[#FF9933] transition-colors duration-200">
                  Bihar<span className="text-[#FF9933]">Edu</span><span className="text-[#138808]">Connect</span>
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wide -mt-1">
                  UGEAC / BCECE counselling
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          {user && !user.isAdmin && !isAdminRoute && (
            <nav className="hidden lg:flex space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-slate-100 dark:bg-slate-800 text-[#2563EB] dark:text-[#FF9933]"
                        : "text-gray-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? "text-[#2563EB] dark:text-[#FF9933]" : "text-gray-400 dark:text-gray-400"}`} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Desktop Right Panel */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <>
                {/* Greeting text removed fully from top navbar per user instruction */}
                {/* Saved Predictions Count removed per user instruction */}

                {/* Favorite Colleges Count */}
                {!user.isAdmin && !isAdminRoute && (
                  <Link
                    href="/dashboard"
                    className="relative p-2 text-gray-500 hover:text-[#138808] dark:text-gray-400 dark:hover:text-[#138808] hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors duration-200"
                    title="Favorite Colleges"
                  >
                    <Bookmark className="w-5 h-5" />
                    {favorites.length > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#138808] text-[10px] font-bold text-white shadow-sm">
                        {favorites.length}
                      </span>
                    )}
                  </Link>
                )}

                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 text-gray-500 hover:text-[#2563EB] dark:text-gray-400 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors duration-200 cursor-pointer"
                  aria-label="Toggle theme"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Admin Access Panel Link (if admin) */}
                {user.isAdmin && (
                  <Link
                    href="/admin"
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                      isAdminRoute
                        ? "bg-amber-500 text-white border-amber-500 hover:bg-amber-600 shadow-sm"
                        : "border-amber-500/20 text-amber-500 hover:bg-amber-500/5"
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Admin Panel
                  </Link>
                )}

                {/* Sleek Profile Link Button */}
                <Link
                  href={user.isAdmin ? "/admin" : "/dashboard"}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#2563EB]/10 to-[#1d4ed8]/10 dark:from-slate-800 dark:to-slate-900 hover:from-[#2563EB] hover:to-[#1d4ed8] text-[#2563EB] dark:text-[#FF9933] hover:text-white dark:hover:text-white text-xs font-extrabold uppercase tracking-wider transition-all duration-300 border border-[#2563EB]/15 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transform active:scale-95 cursor-pointer"
                  title={user.isAdmin ? "Admin Panel" : "My Profile / Dashboard"}
                >
                  <User className="w-3.5 h-3.5 shrink-0" />
                  <span>{user.isAdmin ? "Admin" : "Profile"}</span>
                </Link>
              </>
            ) : (
              <>
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 text-gray-500 hover:text-[#2563EB] dark:text-gray-400 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors duration-200 cursor-pointer"
                  aria-label="Toggle theme"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Sign In Button */}
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF9933] to-[#138808] text-white text-xs font-extrabold uppercase tracking-wider shadow-sm hover:shadow-lg shadow-[#FF9933]/15 hover:from-[#ff8800] hover:to-[#0f7c05] cursor-pointer transform hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
                >
                  Sign In
                </button>
              </>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 hover:text-[#2563EB] dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg cursor-pointer"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 space-y-1">
          {user ? (
            <>
              {!user.isAdmin && !isAdminRoute && (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-bold text-[#FF9933] hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    <User className="w-5 h-5 text-[#FF9933]" />
                    Candidate Dashboard
                  </Link>
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-all duration-200 ${
                          active
                            ? "bg-slate-100 dark:bg-slate-800 text-[#2563EB] dark:text-[#FF9933]"
                            : "text-gray-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${active ? "text-[#2563EB]" : "text-gray-400"}`} />
                        {link.label}
                      </Link>
                    );
                  })}
                </>
              )}
              <div className="border-t border-gray-100 dark:border-slate-800 my-2 pt-2 flex flex-col gap-2.5 px-3">
                {!user.isAdmin && !isAdminRoute && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-[#2563EB]"
                  >
                    <Bookmark className="w-5 h-5" />
                    Favorites ({favorites.length})
                  </Link>
                )}
                
                {user.isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-1.5 text-xs font-bold border px-2.5 py-1.5 rounded-md ${
                      isAdminRoute
                        ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                        : "text-amber-500 border-amber-500/20"
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4" />
                    ADMIN PANEL
                  </Link>
                )}

                {isAdminRoute && !user.isAdmin && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-1.5 text-xs text-[#2563EB] dark:text-[#FF9933] font-bold border border-[#2563EB]/20 px-2.5 py-1.5 rounded-md"
                  >
                    <User className="w-4 h-4 text-[#2563EB]" />
                    USER DASHBOARD
                  </Link>
                )}
              </div>
            </>
          ) : (
            <div className="py-4 px-3 flex flex-col items-center gap-3 text-center">
              <p className="text-xs text-gray-500">Sign in to unlock UGEAC counselling tools.</p>
              <button
                onClick={() => {
                  setShowAuthModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-gradient-to-r from-[#FF9933] to-[#138808] text-white font-bold rounded-lg text-xs uppercase cursor-pointer"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
export default Navbar;
