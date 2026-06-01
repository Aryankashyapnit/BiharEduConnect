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
  const years = [2024, 2025];
  const rounds = [1, 2];

  collegesData.forEach((college) => {
    const baseRank = baseRanks[college.code] || 2000;
    
    college.branches.forEach((branch) => {
      // Branch-specific multiplier (CSE most popular, so lowest closing rank)
      let branchMult = 2.0;
      switch (branch) {
        case "CSE": branchMult = 1.0; break;
        case "CSE-IOT": branchMult = 1.15; break;
        case "IT": branchMult = 1.25; break;
        case "ECE": branchMult = 1.45; break;
        case "EE": branchMult = 1.85; break;
        case "EEE": branchMult = 1.95; break;
        case "ME": branchMult = 2.3; break;
        case "CE": branchMult = 2.5; break;
        case "Chemical Engineering": branchMult = 2.8; break;
        case "Leather Technology": branchMult = 3.2; break;
        default: branchMult = 2.0; break;
      }

      years.forEach((year) => {
        // 2024 ranks were slightly lower due to higher JEE participation numbers in 2025
        const yearMult = year === 2024 ? 0.94 : 1.0;

        rounds.forEach((round) => {
          // Round 2 closing ranks are always slightly larger (more seats occupied)
          const roundMult = round === 2 ? 1.12 : 1.0;

          categories.forEach((category) => {
            let catMult = 1.0;
            switch (category) {
              case "UR": catMult = 1.0; break;
              case "BC": catMult = 1.35; break;
              case "EBC": catMult = 1.55; break;
              case "EWS": catMult = 1.45; break;
              case "SC": catMult = 2.4; break;
              case "ST": catMult = 2.1; break;
              case "RCG": catMult = 1.7; break;
            }

            const closingRank = Math.round(baseRank * branchMult * yearMult * roundMult * catMult);
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
