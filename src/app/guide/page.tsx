"use client";

import React, { useState } from "react";
import { 
  Info, 
  MapPin, 
  Layers, 
  CheckCircle2, 
  Milestone,
  FileText, 
  HelpCircle,
  Lock,
  UserCheck,
  Building
} from "lucide-react";
import { AuthGate } from "../../components/AuthGate";

export default function CounsellingGuide() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "1. Online Registration",
      subtitle: "UGEAC Portal Setup",
      icon: FileText,
      color: "border-[#FF9933] text-[#FF9933]",
      description: "Candidates must visit the official BCECE Board website and click on the 'UGEAC Online Application Portal'. Register using your JEE Main Roll Number, password, mobile number, and email. Pay the non-refundable registration fee (₹1200 for UR/BC/EBC; ₹600 for SC/ST/DQ) online via Net Banking/Credit Card."
    },
    {
      title: "2. Merit List & State Rank",
      subtitle: "State Merit Cards",
      icon: Milestone,
      color: "border-[#2563EB] text-[#2563EB]",
      description: "After checking registration details, the BCECE Board releases the official Bihar State Engineering Merit List (UGEAC Rank Cards). This list maps your JEE Main score into a State Merit Rank (UR Rank and Category Rank). This UGEAC State Rank is the ONLY rank used for seat allocation. You must download and print this Rank Card."
    },
    {
      title: "3. Choice Filling",
      subtitle: "Option Entries",
      icon: Layers,
      color: "border-[#138808] text-[#138808]",
      description: "Log in using your UGEAC credentials. You will see a list of available government engineering colleges and branch options. Select your preferred options and arrange them in descending order of your priority. You can add as many choices as you wish. There is no extra charge or penalty for adding multiple choices."
    },
    {
      title: "4. Choice Locking",
      subtitle: "Locking & Verification",
      icon: Lock,
      color: "border-amber-500 text-amber-500",
      description: "Once satisfied with your choice hierarchy, click 'Lock Choices'. This requires OTP verification sent to your registered mobile and email. Remember: **If you do not lock choices manually, your last saved choices will be locked automatically at the deadline.** However, manual locking is highly recommended."
    },
    {
      title: "5. Seat Allotment Round 1",
      subtitle: "Allotment Letter",
      icon: Building,
      color: "border-purple-500 text-purple-500",
      description: "BCECE publishes the Round 1 Seat Allotment results on their portal. Log in to check your allocation status. If allocated, you must download your 'Seat Allotment Letter'. You will be asked a crucial question: **'Do you want to participate in upgrade for Round 2?'** Choose 'Yes' (Upgrade) or 'No' (Freeze)."
    },
    {
      title: "6. Document Verification (DV)",
      subtitle: "Physical Verification",
      icon: UserCheck,
      color: "border-emerald-500 text-emerald-500",
      description: "Regardless of whether you Freeze or Upgrade, you MUST physically report to your designated 'Nodal Verification Center' (typically one of the main engineering colleges) with all original documents for verification. If your documents are verified successfully, you will get a slip. Failure to report for DV in Round 1 cancels your entire application!"
    }
  ];

  return (
    <AuthGate>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#138808]/10 text-[#138808] text-xs font-bold uppercase tracking-wider mb-3">
          <Milestone className="w-3.5 h-3.5" />
          Step-by-Step Counselling Walkthrough
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Bihar Engineering <span className="bg-gradient-to-r from-[#FF9933] to-[#138808] bg-clip-text text-transparent">Counselling Guide</span>
        </h1>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
          A definitive, step-by-step admissions walkthrough for BCECE UGEAC engineering counselling.
        </p>
      </div>

      {/* Interactive Visual Timeline Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        
        {/* Left Side: Steps Navigation Timeline List (Col-5) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Counselling Stages</h3>
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index;
            return (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`w-full text-left p-4 border rounded-2xl transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                  isActive
                    ? "bg-slate-50 dark:bg-slate-900 border-[#2563EB]/40 shadow-sm"
                    : "bg-white dark:bg-slate-950 border-gray-150 dark:border-slate-850 hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-sm font-bold text-sm ${step.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 dark:text-gray-150">{step.title}</h4>
                    <span className="text-[10px] text-gray-400 font-semibold">{step.subtitle}</span>
                  </div>
                </div>
                <CheckCircle2 className={`w-5 h-5 shrink-0 ${isActive ? "text-[#2563EB]" : "text-gray-250 group-hover:text-gray-350"}`} />
              </button>
            );
          })}
        </div>

        {/* Right Side: Step Details View (Col-7) */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm min-h-[350px] flex flex-col justify-between">
            <div className="space-y-4">
              <span className="px-2.5 py-1 bg-[#2563EB]/10 border border-[#2563EB]/25 text-[#2563EB] rounded-lg text-[10px] font-extrabold uppercase tracking-wide">
                Stage {activeStep + 1} Detailed Protocol
              </span>
              <h2 className="text-2xl font-extrabold text-slate-850 dark:text-white">
                {steps[activeStep].title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {steps[activeStep].description}
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-dashed border-gray-150 dark:border-slate-800 flex gap-2">
              <Info className="w-5 h-5 text-[#FF9933] shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal">
                **Pro-tip**: Document Verification centers are physical. Keep at least **3 complete photocopied sets** of all certificates alongside original sheets, and print **2 copies of Part A & B application forms** because centers retain them.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Document verification checklists and simulated choices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Verification Checklist */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-850 dark:text-white flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-slate-850 pb-2">
            <FileText className="w-5.5 h-5.5 text-[#138808]" />
            Official BCECE DV Checklist
          </h2>

          <div className="space-y-3.5">
            {[
              { doc: "JEE Main Admit Card 2025", desc: "Original printout, same as carried in JEE Main examination center." },
              { doc: "UGEAC Rank Card 2026", desc: "Downloaded merit card containing your State Merit Rank." },
              { doc: "Online Application Form (Part-A & Part-B)", desc: "Downloaded during registration. Must have candidate photograph & signature." },
              { doc: "Passing Certificate & Marksheets", desc: "Class 10th & 12th original marksheets and school leaving certificate." },
              { doc: "Bihar State Residence Certificate", desc: "Duly signed by Circle Officer (CO) or Sub-Divisional Officer (SDO) of Bihar." },
              { doc: "Category Certificate", desc: "EWS / BC / EBC / SC / ST / DQ caste certificate issued by competent authority in Bihar." }
            ].map((item, i) => (
              <div key={i} className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#138808] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-gray-200">{item.doc}</h4>
                  <p className="text-[10px] text-gray-400 leading-normal">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Choice filling Mock Visual */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-850 dark:text-white flex items-center gap-2 mb-3 border-b border-gray-100 dark:border-slate-850 pb-2">
              <Layers className="w-5.5 h-5.5 text-[#FF9933]" />
              Model Choice Preference Layout
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Here is the standard preference listing format recommended for high-performing choices:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-850 rounded-xl flex items-center justify-between">
                <span>Preference 1: **MIT Muzaffarpur (CSE)**</span>
                <span className="text-[10px] text-[#FF9933] font-bold">1st Choice</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-850 rounded-xl flex items-center justify-between">
                <span>Preference 2: **BCE Bhagalpur (CSE)**</span>
                <span className="text-[10px] text-[#2563EB] font-bold">Highly Safe</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-850 rounded-xl flex items-center justify-between">
                <span>Preference 3: **MIT Muzaffarpur (ECE)**</span>
                <span className="text-[10px] text-[#138808] font-bold">Highly Popular</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-850 rounded-xl flex items-center justify-between">
                <span>Preference 4: **BCE Bakhtiyarpur (CSE)**</span>
                <span className="text-[10px] text-gray-400 font-bold">Safe Back Up</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-2">
            <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-600 leading-normal">
              **Caution**: Never list safe colleges above dream colleges. If preference 1 matches, Next.js / BCECE locks it and automatically deletes preferences 2, 3, 4! Arrange from most preferred to least preferred.
            </p>
          </div>
        </div>

      </div>
    </div>
  </AuthGate>
);
}
