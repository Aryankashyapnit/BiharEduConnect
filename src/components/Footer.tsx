"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin, ExternalLink, ShieldCheck } from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand & Intro */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF9933] to-[#138808] text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-800 dark:text-white">
                Bihar<span className="text-[#FF9933]">Edu</span><span className="text-[#138808]">Connect</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              BiharEduConnect is a comprehensive B.Tech admissions resource platform. We offer college prediction tools,cutoff explorer sheets, and counselling guides to make the UGEAC engineering admission process transparent and student-friendly.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#2563EB] dark:text-[#FF9933] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Designed for BCECE aspirants
            </div>
          </div>

          {/* Column 2: Key Features */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">
              Counselling Tools
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/predictor", label: "College Predictor" },
                { href: "/cutoffs", label: "Cutoff Explorer" },
                { href: "/seats", label: "Interactive Seat Matrix" },
                { href: "/compare", label: "College Comparison Grid" }
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-[#2563EB] dark:text-gray-400 dark:hover:text-[#FF9933] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Resources */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">
              Student Resources
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/guide", label: "Counselling Step-by-Step" },
                { href: "/colleges", label: "Bihar Colleges Directory" },
                { href: "/dashboard", label: "Saved Predictions Log" },
                { href: "/about", label: "About BiharEduConnect" },
                { href: "/seo", label: "BCECE Admission FAQ" }
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-[#2563EB] dark:text-gray-400 dark:hover:text-[#FF9933] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Official Helpdesk */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
              BCECE Board Helpdesk
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <span>BCECE Board, IAS Association Building, Near Patna Airport, Patna - 800014</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-500 dark:text-gray-400">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                <span>+91-612-2220230 (Official Board)</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-500 dark:text-gray-400">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <span>support@bihareduconnect.in</span>
              </li>
            </ul>
            <a
              href="https://bceceboard.bihar.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#138808] dark:text-[#138808] font-bold hover:underline"
            >
              BCECE Official Website
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="border-t border-gray-200 dark:border-slate-800/80 pt-8 pb-4">
          <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
            <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1">
              Disclaimer Notice
            </h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
              BiharEduConnect is an independent, student-centric research resource and predictive portal. This website is NOT affiliated with, authorized, or endorsed by the Bihar Combined Entrance Competitive Examination Board (BCECEB) or any government department of technical education. Cutoff predictions and admission statistics are modeled from preceding counselling databases and public seat matrix logs. All students are strongly advised to check official bulletins on the official BCECE Board website before finalizing choice locks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
            <p>&copy; {currentYear} BiharEduConnect. Built for Bihar engineering aspirants.</p>
            <div className="flex space-x-4">
              <Link href="/seo" className="hover:underline hover:text-slate-800 dark:hover:text-white">Privacy Policy</Link>
              <Link href="/seo" className="hover:underline hover:text-slate-800 dark:hover:text-white">Terms of Use</Link>
              <Link href="/seo" className="hover:underline hover:text-slate-800 dark:hover:text-white">Help & FAQ</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
