import { collegesData } from "./colleges";
import official2025Cutoffs from "./cutoffs2025.json";

export interface Cutoff {
  id: string;
  collegeCode: string;
  branchCode: string;
  year: number;
  round: number;
  category: string;
  gender: 'Co-ed' | 'Female';
  openingRank: number;
  closingRank: number;
}

export const categoryRatios: Record<string, number> = {
  UR: 1.0,
  BC: 2.72,
  EBC: 3.54,
  EWS: 4.59,
  SC: 12.94,
  ST: 45.0,
  RCG: 7.89
};

export const categoryBenefitMultipliers: Record<string, number> = {
  UR: 1.0,
  BC: 1.20,
  EBC: 1.25,
  EWS: 1.30,
  SC: 3.00,
  ST: 2.00,
  RCG: 2.80
};

export const convertPercentileToUR = (p: number): number => {
  if (p >= 100) return 1;
  if (p <= 0) return 16729;

  const samples = [
    { p: 100, r: 1 },
    { p: 81, r: 2364 },
    { p: 57, r: 7583 },
    { p: 52, r: 8534 },
    { p: 49.22, r: 9182 },
    { p: 42, r: 10289 },
    { p: 0, r: 16729 }
  ];

  for (let i = 0; i < samples.length - 1; i++) {
    const s1 = samples[i];
    const s2 = samples[i + 1];
    if (p <= s1.p && p >= s2.p) {
      const fraction = (p - s2.p) / (s1.p - s2.p);
      return Math.round(s2.r + fraction * (s1.r - s2.r));
    }
  }
  return 16729;
};

export const convertURToPercentile = (r: number): number => {
  if (r <= 1) return 100;
  if (r >= 16729) return 0;

  const samples = [
    { p: 100, r: 1 },
    { p: 81, r: 2364 },
    { p: 57, r: 7583 },
    { p: 52, r: 8534 },
    { p: 49.22, r: 9182 },
    { p: 42, r: 10289 },
    { p: 0, r: 16729 }
  ];

  for (let i = 0; i < samples.length - 1; i++) {
    const s1 = samples[i];
    const s2 = samples[i + 1];
    if (r >= s1.r && r <= s2.r) {
      const fraction = (r - s1.r) / (s2.r - s1.r);
      return Number((s1.p - fraction * (s1.p - s2.p)).toFixed(2));
    }
  }
  return 0;
};


// Programmatic Generator for 2024 and 2025 UGEAC Closing/Opening ranks
const generateAllCutoffs = (): Cutoff[] => {
  const generated: Cutoff[] = [];
  let idCounter = 1;

  // Tier-wise base General (UR) CSE closing rank in Round 1 for UGEAC 2025
  // Note: Lower-tier GECs have very few takers; closing ranks are high (many vacant seats)
  const baseRanks: Record<string, number> = {
    // Tier 1 — Top colleges (very high competition)
    "MIT-MUZAFFARPUR": 134,
    "BCE-BHAGALPUR": 159,
    // Tier 2 — Strong regional colleges
    "BCE-BAKHTIYARPUR": 434,
    "GCE-GAYA": 712,
    "DCE-DARBHANGA": 791,
    "NCE-CHANDI": 759,
    // Tier 3 — Mid-tier established colleges
    "MCE-MOTIHARI": 1222,
    "LNJPIT-CHAPRA": 1635,
    "RRSDCE-BEGUSARAI": 1800,
    // Tier 4 — GECs with decent intake
    "GEC-VAISHALI": 2121,
    "SIT-SITAMARHI": 2254,
    "BPMCE-MADHEPURA": 2049,
    "PCE-PURNEA": 2514,
    // Tier 5 — Moderate competition GECs
    "SCE-SASARAM": 3176,
    "KCE-KATIHAR": 3181,
    "GEC-WESTCHAMPARAN": 3342,
    "SCE-SAHARSA": 3562,
    "SCE-SUPAUL": 3781,
    // Tier 6 — Lower-mid GECs
    "GEC-SAMASTIPUR": 5200,
    "GEC-BANKA": 5500,
    "GEC-NAWADA": 5800,
    "GEC-BHOJPUR": 6000,
    // Tier 7 — Low competition GECs (remote locations, many vacant seats)
    "GEC-MADHUBANI": 7000,
    "GEC-SIWAN": 7500,
    "GEC-BUXAR": 7800,
    "GEC-KISHANGANJ": 8000,
    "GEC-AURANGABAD": 8200,
    "GEC-JAMUI": 8500,
    "SPNREC-ARARIA": 8800,
    "GEC-SHEIKHPURA": 9200,
    // Tier 8 — Very remote / newest GECs (closing ranks very high due to low demand)
    "GEC-ARWAL": 9500,
    "GEC-KAIMUR": 10200,
    "GEC-JEHANABAD": 10500,
    "GEC-LAKHISARAI": 10800,
    "GEC-MUNGER": 11200,
    "GEC-GOPALGANJ": 11500,
    "GEC-SHEOHAR": 12000,
    "GEC-KHAGARIA": 12500
  };

  const categories = ["UR", "BC", "EBC", "SC", "ST", "EWS", "RCG"];
  const years = [2023, 2024];
  const rounds = [1, 2];

  collegesData.forEach((college) => {
    const baseRank = baseRanks[college.code] || 2000;
    
    college.branches.forEach((branch) => {
      // Branch-specific multiplier (CSE most popular, so lowest closing rank)
      let branchMult = 4.0;
      switch (branch) {
        case "CSE": branchMult = 1.0; break;
        case "CSE(AI)": branchMult = 1.1; break;
        case "CSE(AI&ML)": branchMult = 1.1; break;
        case "CSE (AI &ML)": branchMult = 1.1; break;
        case "ARTIFICIAL INTELLIGENCE & MACHINE LEARN": branchMult = 1.15; break;
        case "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING": branchMult = 1.15; break;
        case "CSE-IOT": branchMult = 1.15; break;
        case "CSE (IOT)": branchMult = 1.15; break;
        case "CSE(IOT)": branchMult = 1.15; break;
        case "CSE(IOT&CYBER SECURITY INCLUDING BLOCK CHAIN TECHNOLOGY)": branchMult = 1.18; break;
        case "CSE(CYBER SECURITY)": branchMult = 1.2; break;
        case "CSE (CYBER SECURITY)": branchMult = 1.2; break;
        case "CSE(DATA SCIENCE)": branchMult = 1.2; break;
        case "CSE (DATA SCIENCE)": branchMult = 1.2; break;
        case "CSE(NETWORKS)": branchMult = 1.22; break;
        case "MC": branchMult = 1.8; break;
        case "IT": branchMult = 2.0; break;
        case "CE(COMPUTER APPLICATION)": branchMult = 4.2; break;
        case "CE (COMPUTER APPLICATION )": branchMult = 4.2; break;
        case "CE(COMPUTER APPLICATION )": branchMult = 4.2; break;
        case "3D ANIMATION & GRAPHICS": branchMult = 4.5; break;
        case "ECE": branchMult = 4.0; break;
        case "ECE(ACT)": branchMult = 4.0; break;
        case "ELECTRONICS AND INSTRUMENTATION ENGG.": branchMult = 4.0; break;
        case "EE(VLSI)": branchMult = 4.2; break;
        case "EE": branchMult = 6.0; break;
        case "EEE": branchMult = 6.2; break;
        case "ROBOTIC AND AUTOMATION": branchMult = 4.5; break;
        case "BIOMEDICAL & ROBOTIC ENGG.": branchMult = 5.0; break;
        case "MECHATRONICS ENGG.": branchMult = 5.2; break;
        case "FIRE TECHNOLOGY & SAFETY": branchMult = 11.0; break;
        case "AERONAUTICAL ENGG.": branchMult = 5.0; break;
        case "ME": branchMult = 12.0; break;
        case "MECHANICAL &SMART MANUFACTURING": branchMult = 12.0; break;
        case "MINING ENGG.": branchMult = 6.0; break;
        case "CE": branchMult = 8.0; break;
        case "CHEMICAL ENGG.": branchMult = 20.0; break;
        case "CHEMICAL ENGINEERING": branchMult = 20.0; break;
        case "FOOD TECHNOLOGY AND MANAGEMENT": branchMult = 7.0; break;
        case "FPP": branchMult = 8.0; break;
        case "Leather Technology": branchMult = 50.0; break;
        case "LEATHER TECHNOLOGY": branchMult = 50.0; break;
        default: branchMult = 4.0; break;
      }

      years.forEach((year) => {
        // Year specific multiplier to represent realistic historical fluctuations
        let yearMult = 1.0;
        if (year === 2024) yearMult = 0.94;
        else if (year === 2023) yearMult = 0.88;

        rounds.forEach((round) => {
          // Round 2 closing ranks are always slightly larger (more seats occupied)
          const roundMult = round === 2 ? 1.12 : 1.0;

          categories.forEach((category) => {
            const ratio = categoryRatios[category] || 1.0;
            const benefit = categoryBenefitMultipliers[category] || 1.0;
            // Cap at 16729 (total UGEAC candidates) — no rank beyond this is meaningful
            const closingRank = Math.min(16729, Math.round((baseRank * branchMult * yearMult * roundMult * benefit) / ratio));
            const openingRank = Math.max(1, Math.round(closingRank * 0.72));

            generated.push({
              id: `c-gen-${idCounter++}`,
              collegeCode: college.code,
              branchCode: branch,
              year,
              round,
              category,
              gender: category === "RCG" ? "Female" : "Co-ed",
              openingRank,
              closingRank
            });
          });
        });
      });
    });
  });

  return generated;
};

// Compile full dynamic database array on startup (combining simulated 2023-2024 with official 2025 cutoffs)
export const cutoffsData: Cutoff[] = [...generateAllCutoffs(), ...(official2025Cutoffs as Cutoff[])];

// Robust fallback engine in case dynamic modifications in LocalStorage are empty
export const getEstimatedCutoff = (
  collegeCode: string,
  branchCode: string,
  year: number,
  round: number,
  category: string,
  gender: string
): Cutoff => {
  const match = cutoffsData.find(
    c =>
      c.collegeCode === collegeCode &&
      c.branchCode === branchCode &&
      c.year === year &&
      c.round === round &&
      c.category === category
  );
  if (match) return match;

  // General fallback approximation if college is not in list
  return {
    id: `est-${collegeCode}-${branchCode}-${year}-${round}-${category}`,
    collegeCode,
    branchCode,
    year,
    round,
    category,
    gender: (gender as 'Co-ed' | 'Female') || (category === "RCG" ? "Female" : "Co-ed"),
    openingRank: 1000,
    closingRank: 1500
  };
};

export const getCutoff = (
  collegeCode: string,
  branchCode: string,
  year: number,
  round: number,
  category: string,
  gender: string = "Co-ed"
): Cutoff => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("bihareduconnect_cutoffs");
    if (stored) {
      try {
        const parsed: Cutoff[] = JSON.parse(stored);
        const match = parsed.find(
          c =>
            c.collegeCode === collegeCode &&
            c.branchCode === branchCode &&
            c.year === year &&
            c.round === round &&
            c.category === category
        );
        if (match) return match;
      } catch (e) {
        console.error("Error reading stored cutoffs", e);
      }
    }
  }

  const match = cutoffsData.find(
    c =>
      c.collegeCode === collegeCode &&
      c.branchCode === branchCode &&
      c.year === year &&
      c.round === round &&
      c.category === category
  );
  if (match) return match;
  return getEstimatedCutoff(collegeCode, branchCode, year, round, category, gender);
};
