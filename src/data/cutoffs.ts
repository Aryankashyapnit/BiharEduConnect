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

export const cutoffsData: Cutoff[] = [
  // ==================== 2025 CUTOFFS ====================
  // MIT MUZAFFARPUR - CSE - 2025
  { id: "c1", collegeCode: "MIT-MUZAFFARPUR", branchCode: "CSE", year: 2025, round: 1, category: "UR", gender: "Co-ed", openingRank: 1, closingRank: 240 },
  { id: "c2", collegeCode: "MIT-MUZAFFARPUR", branchCode: "CSE", year: 2025, round: 1, category: "BC", gender: "Co-ed", openingRank: 241, closingRank: 380 },
  { id: "c3", collegeCode: "MIT-MUZAFFARPUR", branchCode: "CSE", year: 2025, round: 1, category: "EBC", gender: "Co-ed", openingRank: 245, closingRank: 410 },
  { id: "c4", collegeCode: "MIT-MUZAFFARPUR", branchCode: "CSE", year: 2025, round: 1, category: "SC", gender: "Co-ed", openingRank: 500, closingRank: 950 },
  { id: "c5", collegeCode: "MIT-MUZAFFARPUR", branchCode: "CSE", year: 2025, round: 1, category: "ST", gender: "Co-ed", openingRank: 350, closingRank: 600 },
  { id: "c6", collegeCode: "MIT-MUZAFFARPUR", branchCode: "CSE", year: 2025, round: 1, category: "EWS", gender: "Co-ed", openingRank: 250, closingRank: 420 },
  { id: "c7", collegeCode: "MIT-MUZAFFARPUR", branchCode: "CSE", year: 2025, round: 1, category: "RCG", gender: "Female", openingRank: 300, closingRank: 550 },

  { id: "c8", collegeCode: "MIT-MUZAFFARPUR", branchCode: "CSE", year: 2025, round: 2, category: "UR", gender: "Co-ed", openingRank: 241, closingRank: 290 },
  { id: "c9", collegeCode: "MIT-MUZAFFARPUR", branchCode: "CSE", year: 2025, round: 2, category: "BC", gender: "Co-ed", openingRank: 381, closingRank: 430 },
  { id: "c10", collegeCode: "MIT-MUZAFFARPUR", branchCode: "CSE", year: 2025, round: 2, category: "EBC", gender: "Co-ed", openingRank: 411, closingRank: 470 },
  { id: "c11", collegeCode: "MIT-MUZAFFARPUR", branchCode: "CSE", year: 2025, round: 2, category: "SC", gender: "Co-ed", openingRank: 951, closingRank: 1050 },

  // MIT MUZAFFARPUR - ECE - 2025
  { id: "c12", collegeCode: "MIT-MUZAFFARPUR", branchCode: "ECE", year: 2025, round: 1, category: "UR", gender: "Co-ed", openingRank: 150, closingRank: 480 },
  { id: "c13", collegeCode: "MIT-MUZAFFARPUR", branchCode: "ECE", year: 2025, round: 1, category: "BC", gender: "Co-ed", openingRank: 481, closingRank: 650 },
  { id: "c14", collegeCode: "MIT-MUZAFFARPUR", branchCode: "ECE", year: 2025, round: 1, category: "EBC", gender: "Co-ed", openingRank: 490, closingRank: 740 },
  { id: "c15", collegeCode: "MIT-MUZAFFARPUR", branchCode: "ECE", year: 2025, round: 1, category: "SC", gender: "Co-ed", openingRank: 900, closingRank: 1400 },
  { id: "c16", collegeCode: "MIT-MUZAFFARPUR", branchCode: "ECE", year: 2025, round: 1, category: "EWS", gender: "Co-ed", openingRank: 500, closingRank: 700 },

  // BCE BHAGALPUR - CSE - 2025
  { id: "c20", collegeCode: "BCE-BHAGALPUR", branchCode: "CSE", year: 2025, round: 1, category: "UR", gender: "Co-ed", openingRank: 180, closingRank: 450 },
  { id: "c21", collegeCode: "BCE-BHAGALPUR", branchCode: "CSE", year: 2025, round: 1, category: "BC", gender: "Co-ed", openingRank: 451, closingRank: 580 },
  { id: "c22", collegeCode: "BCE-BHAGALPUR", branchCode: "CSE", year: 2025, round: 1, category: "EBC", gender: "Co-ed", openingRank: 460, closingRank: 680 },
  { id: "c23", collegeCode: "BCE-BHAGALPUR", branchCode: "CSE", year: 2025, round: 1, category: "SC", gender: "Co-ed", openingRank: 800, closingRank: 1250 },
  { id: "c24", collegeCode: "BCE-BHAGALPUR", branchCode: "CSE", year: 2025, round: 1, category: "EWS", gender: "Co-ed", openingRank: 470, closingRank: 620 },

  { id: "c25", collegeCode: "BCE-BHAGALPUR", branchCode: "CSE", year: 2025, round: 2, category: "UR", gender: "Co-ed", openingRank: 451, closingRank: 510 },
  { id: "c26", collegeCode: "BCE-BHAGALPUR", branchCode: "CSE", year: 2025, round: 2, category: "BC", gender: "Co-ed", openingRank: 581, closingRank: 630 },
  { id: "c27", collegeCode: "BCE-BHAGALPUR", branchCode: "CSE", year: 2025, round: 2, category: "EBC", gender: "Co-ed", openingRank: 681, closingRank: 730 },

  // GCE GAYA - CSE - 2025
  { id: "c30", collegeCode: "GCE-GAYA", branchCode: "CSE", year: 2025, round: 1, category: "UR", gender: "Co-ed", openingRank: 400, closingRank: 850 },
  { id: "c31", collegeCode: "GCE-GAYA", branchCode: "CSE", year: 2025, round: 1, category: "BC", gender: "Co-ed", openingRank: 851, closingRank: 1100 },
  { id: "c32", collegeCode: "GCE-GAYA", branchCode: "CSE", year: 2025, round: 1, category: "EBC", gender: "Co-ed", openingRank: 860, closingRank: 1250 },
  { id: "c33", collegeCode: "GCE-GAYA", branchCode: "CSE", year: 2025, round: 1, category: "SC", gender: "Co-ed", openingRank: 1300, closingRank: 1950 },
  { id: "c34", collegeCode: "GCE-GAYA", branchCode: "CSE", year: 2025, round: 1, category: "EWS", gender: "Co-ed", openingRank: 870, closingRank: 1150 },

  // BCE BAKHTIYARPUR - CSE - 2025
  { id: "c40", collegeCode: "BCE-BAKHTIYARPUR", branchCode: "CSE", year: 2025, round: 1, category: "UR", gender: "Co-ed", openingRank: 300, closingRank: 680 },
  { id: "c41", collegeCode: "BCE-BAKHTIYARPUR", branchCode: "CSE", year: 2025, round: 1, category: "BC", gender: "Co-ed", openingRank: 681, closingRank: 880 },
  { id: "c42", collegeCode: "BCE-BAKHTIYARPUR", branchCode: "CSE", year: 2025, round: 1, category: "EBC", gender: "Co-ed", openingRank: 690, closingRank: 950 },
  { id: "c43", collegeCode: "BCE-BAKHTIYARPUR", branchCode: "CSE", year: 2025, round: 1, category: "SC", gender: "Co-ed", openingRank: 1100, closingRank: 1600 },
  { id: "c44", collegeCode: "BCE-BAKHTIYARPUR", branchCode: "CSE", year: 2025, round: 1, category: "EWS", gender: "Co-ed", openingRank: 700, closingRank: 910 },

  // NCE CHANDI - CSE - 2025
  { id: "c50", collegeCode: "NCE-CHANDI", branchCode: "CSE", year: 2025, round: 1, category: "UR", gender: "Co-ed", openingRank: 500, closingRank: 980 },
  { id: "c51", collegeCode: "NCE-CHANDI", branchCode: "CSE", year: 2025, round: 1, category: "BC", gender: "Co-ed", openingRank: 981, closingRank: 1250 },
  { id: "c52", collegeCode: "NCE-CHANDI", branchCode: "CSE", year: 2025, round: 1, category: "EBC", gender: "Co-ed", openingRank: 990, closingRank: 1350 },
  { id: "c53", collegeCode: "NCE-CHANDI", branchCode: "CSE", year: 2025, round: 1, category: "SC", gender: "Co-ed", openingRank: 1500, closingRank: 2200 },

  // DCE DARBHANGA - CSE - 2025
  { id: "c60", collegeCode: "DCE-DARBHANGA", branchCode: "CSE", year: 2025, round: 1, category: "UR", gender: "Co-ed", openingRank: 450, closingRank: 920 },
  { id: "c61", collegeCode: "DCE-DARBHANGA", branchCode: "CSE", year: 2025, round: 1, category: "BC", gender: "Co-ed", openingRank: 921, closingRank: 1180 },
  { id: "c62", collegeCode: "DCE-DARBHANGA", branchCode: "CSE", year: 2025, round: 1, category: "EBC", gender: "Co-ed", openingRank: 930, closingRank: 1280 },

  // MCE MOTIHARI - CSE - 2025
  { id: "c70", collegeCode: "MCE-MOTIHARI", branchCode: "CSE", year: 2025, round: 1, category: "UR", gender: "Co-ed", openingRank: 600, closingRank: 1200 },
  { id: "c71", collegeCode: "MCE-MOTIHARI", branchCode: "CSE", year: 2025, round: 1, category: "BC", gender: "Co-ed", openingRank: 1201, closingRank: 1480 },
  { id: "c72", collegeCode: "MCE-MOTIHARI", branchCode: "CSE", year: 2025, round: 1, category: "EBC", gender: "Co-ed", openingRank: 1210, closingRank: 1550 },


  // ==================== 2024 CUTOFFS ====================
  // MIT MUZAFFARPUR - CSE - 2024
  { id: "c101", collegeCode: "MIT-MUZAFFARPUR", branchCode: "CSE", year: 2024, round: 1, category: "UR", gender: "Co-ed", openingRank: 1, closingRank: 260 },
  { id: "c102", collegeCode: "MIT-MUZAFFARPUR", branchCode: "CSE", year: 2024, round: 1, category: "BC", gender: "Co-ed", openingRank: 261, closingRank: 395 },
  { id: "c103", collegeCode: "MIT-MUZAFFARPUR", branchCode: "CSE", year: 2024, round: 1, category: "EBC", gender: "Co-ed", openingRank: 262, closingRank: 430 },
  { id: "c104", collegeCode: "MIT-MUZAFFARPUR", branchCode: "CSE", year: 2024, round: 1, category: "SC", gender: "Co-ed", openingRank: 550, closingRank: 1000 },
  { id: "c105", collegeCode: "MIT-MUZAFFARPUR", branchCode: "CSE", year: 2024, round: 1, category: "EWS", gender: "Co-ed", openingRank: 265, closingRank: 440 },

  // BCE BHAGALPUR - CSE - 2024
  { id: "c110", collegeCode: "BCE-BHAGALPUR", branchCode: "CSE", year: 2024, round: 1, category: "UR", gender: "Co-ed", openingRank: 190, closingRank: 470 },
  { id: "c111", collegeCode: "BCE-BHAGALPUR", branchCode: "CSE", year: 2024, round: 1, category: "BC", gender: "Co-ed", openingRank: 471, closingRank: 610 },
  { id: "c112", collegeCode: "BCE-BHAGALPUR", branchCode: "CSE", year: 2024, round: 1, category: "EBC", gender: "Co-ed", openingRank: 475, closingRank: 710 },

  // GCE GAYA - CSE - 2024
  { id: "c120", collegeCode: "GCE-GAYA", branchCode: "CSE", year: 2024, round: 1, category: "UR", gender: "Co-ed", openingRank: 420, closingRank: 890 },
  { id: "c121", collegeCode: "GCE-GAYA", branchCode: "CSE", year: 2024, round: 1, category: "BC", gender: "Co-ed", openingRank: 891, closingRank: 1150 },
  { id: "c122", collegeCode: "GCE-GAYA", branchCode: "CSE", year: 2024, round: 1, category: "EBC", gender: "Co-ed", openingRank: 900, closingRank: 1300 },

  // BCE BAKHTIYARPUR - CSE - 2024
  { id: "c130", collegeCode: "BCE-BAKHTIYARPUR", branchCode: "CSE", year: 2024, round: 1, category: "UR", gender: "Co-ed", openingRank: 320, closingRank: 720 },
  { id: "c131", collegeCode: "BCE-BAKHTIYARPUR", branchCode: "CSE", year: 2024, round: 1, category: "BC", gender: "Co-ed", openingRank: 721, closingRank: 920 },
  { id: "c132", collegeCode: "BCE-BAKHTIYARPUR", branchCode: "CSE", year: 2024, round: 1, category: "EBC", gender: "Co-ed", openingRank: 730, closingRank: 990 }
];

// Dynamically generate other branches cutoffs so every branch in the predictor works
// This is a robust fallback engine that estimates realistic ranges if specific records aren't seeded
export const getEstimatedCutoff = (
  collegeCode: string,
  branchCode: string,
  year: number,
  round: number,
  category: string,
  gender: string
): Cutoff => {
  // Let's find base CSE cutoff for this college and scale it based on branch popularity
  const baseCse = cutoffsData.find(
    c => c.collegeCode === collegeCode && c.branchCode === "CSE" && c.year === year && c.category === category
  );

  const baseUrCse = cutoffsData.find(
    c => c.collegeCode === collegeCode && c.branchCode === "CSE" && c.year === year && c.category === "UR"
  );

  // Popularity scaling factor (CSE is most popular, so lowest cutoff ranks)
  let popularityFactor = 1.0;
  switch (branchCode) {
    case "CSE": popularityFactor = 1.0; break;
    case "IT": popularityFactor = 1.2; break;
    case "ECE": popularityFactor = 1.5; break;
    case "EE": popularityFactor = 2.0; break;
    case "EEE": popularityFactor = 2.2; break;
    case "ME": popularityFactor = 2.8; break;
    case "CE": popularityFactor = 3.2; break;
    case "Chemical Engineering": popularityFactor = 3.5; break;
    case "Leather Technology": popularityFactor = 4.5; break;
    default: popularityFactor = 2.0; break;
  }

  // Round scaling (Round 2 cutoffs are slightly higher/longer)
  const roundFactor = round === 2 ? 1.15 : 1.0;

  // Category factors
  let categoryFactor = 1.0;
  switch (category) {
    case "UR": categoryFactor = 1.0; break;
    case "BC": categoryFactor = 1.4; break;
    case "EBC": categoryFactor = 1.6; break;
    case "EWS": categoryFactor = 1.5; break;
    case "SC": categoryFactor = 2.8; break;
    case "ST": categoryFactor = 2.2; break;
    case "RCG": categoryFactor = 1.8; break;
    case "DQ": categoryFactor = 4.5; break;
    case "SMQ": categoryFactor = 3.0; break;
    default: categoryFactor = 1.0; break;
  }

  // Base UR rank approximation if not found
  let baseUrClosing = 500; // general default
  if (baseUrCse) {
    baseUrClosing = baseUrCse.closingRank;
  } else if (collegeCode.includes("MIT")) {
    baseUrClosing = 240;
  } else if (collegeCode.includes("BCE-B")) {
    baseUrClosing = 450;
  } else if (collegeCode.includes("GCE")) {
    baseUrClosing = 850;
  } else {
    baseUrClosing = 1200;
  }

  const estimatedClosing = Math.round(baseUrClosing * popularityFactor * categoryFactor * roundFactor);
  const estimatedOpening = Math.round(estimatedClosing * 0.7);

  return {
    id: `est-${collegeCode}-${branchCode}-${year}-${round}-${category}`,
    collegeCode,
    branchCode,
    year,
    round,
    category,
    gender: (gender as 'Co-ed' | 'Female') || (category === "RCG" ? "Female" : "Co-ed"),
    openingRank: estimatedOpening,
    closingRank: estimatedClosing
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
