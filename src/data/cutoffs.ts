import { collegesData } from "./colleges";

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
  BC: 1.35,
  EBC: 1.55,
  EWS: 1.45,
  SC: 2.4,
  ST: 2.1,
  RCG: 1.7
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

// Programmatic Generator for 2024 and 2025 UGEAC Closing/Opening ranks
const generateAllCutoffs = (): Cutoff[] => {
  const generated: Cutoff[] = [];
  let idCounter = 1;

  // Tier-wise base General (UR) CSE closing rank in Round 1 for UGEAC 2025
  const baseRanks: Record<string, number> = {
    "MIT-MUZAFFARPUR": 240,
    "BCE-BHAGALPUR": 450,
    "BCE-BAKHTIYARPUR": 680,
    "GCE-GAYA": 850,
    "DCE-DARBHANGA": 920,
    "NCE-CHANDI": 980,
    "LNJPIT-CHAPRA": 1100,
    "RRSDCE-BEGUSARAI": 1150,
    "MCE-MOTIHARI": 1200,
    "SCE-SASARAM": 1250,
    "SIT-SITAMARHI": 1300,
    "BPMCE-MADHEPURA": 1400,
    "KCE-KATIHAR": 1350,
    "PCE-PURNEA": 1380,
    "SCE-SAHARSA": 1450,
    "SCE-SUPAUL": 1420,
    "GEC-VAISHALI": 1500,
    "GEC-SAMASTIPUR": 1550,
    "GEC-BHOJPUR": 1600,
    "GEC-JAMUI": 1650,
    "GEC-AURANGABAD": 1700,
    "GEC-SIWAN": 1750,
    "SPNREC-ARARIA": 1800,
    "GEC-BANKA": 1850,
    "GEC-GOPALGANJ": 1900,
    "GEC-BUXAR": 1950,
    "GEC-MADHUBANI": 2000,
    "GEC-NAWADA": 2050,
    "GEC-WESTCHAMPARAN": 2100,
    "GEC-KISHANGANJ": 2150,
    "GEC-JEHANABAD": 2200,
    "GEC-MUNGER": 2250,
    "GEC-LAKHISARAI": 2300,
    "GEC-SHEIKHPURA": 2350,
    "GEC-SHEOHAR": 2400,
    "GEC-KHAGARIA": 2450,
    "GEC-KAIMUR": 2500,
    "GEC-ARWAL": 2600
  };

  const categories = ["UR", "BC", "EBC", "SC", "ST", "EWS", "RCG"];
  const years = [2023, 2024, 2025];
  const rounds = [1, 2];

  collegesData.forEach((college) => {
    const baseRank = baseRanks[college.code] || 2000;
    
    college.branches.forEach((branch) => {
      // Branch-specific multiplier (CSE most popular, so lowest closing rank)
      let branchMult = 2.0;
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
        case "IT": branchMult = 1.25; break;
        case "CE(COMPUTER APPLICATION)": branchMult = 1.3; break;
        case "CE (COMPUTER APPLICATION )": branchMult = 1.3; break;
        case "CE(COMPUTER APPLICATION )": branchMult = 1.3; break;
        case "3D ANIMATION & GRAPHICS": branchMult = 1.4; break;
        case "ECE": branchMult = 1.45; break;
        case "ECE(ACT)": branchMult = 1.5; break;
        case "ELECTRONICS AND INSTRUMENTATION ENGG.": branchMult = 1.6; break;
        case "EE(VLSI)": branchMult = 1.75; break;
        case "EE": branchMult = 1.85; break;
        case "EEE": branchMult = 1.95; break;
        case "ROBOTIC AND AUTOMATION": branchMult = 2.0; break;
        case "BIOMEDICAL & ROBOTIC ENGG.": branchMult = 2.05; break;
        case "MECHATRONICS ENGG.": branchMult = 2.1; break;
        case "FIRE TECHNOLOGY & SAFETY": branchMult = 2.15; break;
        case "AERONAUTICAL ENGG.": branchMult = 2.2; break;
        case "ME": branchMult = 2.3; break;
        case "MECHANICAL &SMART MANUFACTURING": branchMult = 2.3; break;
        case "MINING ENGG.": branchMult = 2.4; break;
        case "CE": branchMult = 2.5; break;
        case "CHEMICAL ENGG.": branchMult = 2.8; break;
        case "CHEMICAL ENGINEERING": branchMult = 2.8; break;
        case "FOOD TECHNOLOGY AND MANAGEMENT": branchMult = 2.9; break;
        case "FPP": branchMult = 3.0; break;
        case "Leather Technology": branchMult = 3.2; break;
        case "LEATHER TECHNOLOGY": branchMult = 3.2; break;
        default: branchMult = 2.0; break;
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
            const closingRank = Math.round((baseRank * branchMult * yearMult * roundMult * benefit) / ratio);
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

// Compile full dynamic database array on startup
export const cutoffsData: Cutoff[] = generateAllCutoffs();

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
