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
    "MIT-MUZAFFARPUR": 134,
    "BCE-BHAGALPUR": 159,
    "BCE-BAKHTIYARPUR": 434,
    "GCE-GAYA": 712,
    "DCE-DARBHANGA": 791,
    "NCE-CHANDI": 759,
    "LNJPIT-CHAPRA": 1635,
    "RRSDCE-BEGUSARAI": 1800,
    "MCE-MOTIHARI": 1222,
    "SCE-SASARAM": 3176,
    "SIT-SITAMARHI": 2254,
    "BPMCE-MADHEPURA": 2049,
    "KCE-KATIHAR": 3181,
    "PCE-PURNEA": 2514,
    "SCE-SAHARSA": 3562,
    "SCE-SUPAUL": 3781,
    "GEC-VAISHALI": 2121,
    "GEC-SAMASTIPUR": 4054,
    "GEC-BHOJPUR": 4551,
    "GEC-JAMUI": 6245,
    "GEC-AURANGABAD": 5882,
    "GEC-SIWAN": 4856,
    "SPNREC-ARARIA": 6696,
    "GEC-BANKA": 4252,
    "GEC-GOPALGANJ": 7291,
    "GEC-BUXAR": 5709,
    "GEC-MADHUBANI": 4940,
    "GEC-NAWADA": 4323,
    "GEC-WESTCHAMPARAN": 3342,
    "GEC-KISHANGANJ": 5688,
    "GEC-JEHANABAD": 7093,
    "GEC-MUNGER": 7327,
    "GEC-LAKHISARAI": 7097,
    "GEC-SHEIKHPURA": 6051,
    "GEC-SHEOHAR": 7250,
    "GEC-KHAGARIA": 7152,
    "GEC-KAIMUR": 6872,
    "GEC-ARWAL": 5422
  };

  const categories = ["UR", "BC", "EBC", "SC", "ST", "EWS", "RCG"];
  const years = [2023, 2024, 2025];
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
        case "IT": branchMult = 2.0; break;
        case "CE(COMPUTER APPLICATION)": branchMult = 4.2; break;
        case "CE (COMPUTER APPLICATION )": branchMult = 4.2; break;
        case "CE(COMPUTER APPLICATION )": branchMult = 4.2; break;
        case "3D ANIMATION & GRAPHICS": branchMult = 4.5; break;
        case "ECE": branchMult = 3.5; break;
        case "ECE(ACT)": branchMult = 3.8; break;
        case "ELECTRONICS AND INSTRUMENTATION ENGG.": branchMult = 4.0; break;
        case "EE(VLSI)": branchMult = 4.2; break;
        case "EE": branchMult = 4.5; break;
        case "EEE": branchMult = 5.0; break;
        case "ROBOTIC AND AUTOMATION": branchMult = 4.5; break;
        case "BIOMEDICAL & ROBOTIC ENGG.": branchMult = 5.0; break;
        case "MECHATRONICS ENGG.": branchMult = 5.2; break;
        case "FIRE TECHNOLOGY & SAFETY": branchMult = 10.0; break;
        case "AERONAUTICAL ENGG.": branchMult = 5.0; break;
        case "ME": branchMult = 8.0; break;
        case "MECHANICAL &SMART MANUFACTURING": branchMult = 8.0; break;
        case "MINING ENGG.": branchMult = 6.0; break;
        case "CE": branchMult = 5.8; break;
        case "CHEMICAL ENGG.": branchMult = 15.0; break;
        case "CHEMICAL ENGINEERING": branchMult = 15.0; break;
        case "FOOD TECHNOLOGY AND MANAGEMENT": branchMult = 7.0; break;
        case "FPP": branchMult = 8.0; break;
        case "Leather Technology": branchMult = 25.0; break;
        case "LEATHER TECHNOLOGY": branchMult = 25.0; break;
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
