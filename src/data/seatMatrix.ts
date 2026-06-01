export interface SeatMatrixEntry {
  collegeCode: string;
  branchCode: string;
  totalSeats: number;
  categorySeats: Record<string, number>;
}

export const seatCategories = [
  { code: "UR", name: "Unreserved (General)", percentage: 40 },
  { code: "BC", name: "Backward Class", percentage: 12 },
  { code: "EBC", name: "Extremely Backward Class", percentage: 18 },
  { code: "SC", name: "Scheduled Caste", percentage: 16 },
  { code: "ST", name: "Scheduled Tribe", percentage: 1 },
  { code: "EWS", name: "Economically Weaker Section", percentage: 10 },
  { code: "RCG", name: "Reserved Category Girls", percentage: 3 }
];

// Seed basic Seat Matrices for top colleges
export const seatMatrixData: SeatMatrixEntry[] = [
  // MIT Muzaffarpur
  {
    collegeCode: "MIT-MUZAFFARPUR",
    branchCode: "CSE",
    totalSeats: 60,
    categorySeats: { UR: 24, BC: 7, EBC: 11, SC: 10, ST: 1, EWS: 6, RCG: 1 }
  },
  {
    collegeCode: "MIT-MUZAFFARPUR",
    branchCode: "IT",
    totalSeats: 40,
    categorySeats: { UR: 16, BC: 5, EBC: 7, SC: 6, ST: 0, EWS: 4, RCG: 2 }
  },
  {
    collegeCode: "MIT-MUZAFFARPUR",
    branchCode: "ECE",
    totalSeats: 60,
    categorySeats: { UR: 24, BC: 7, EBC: 11, SC: 10, ST: 1, EWS: 6, RCG: 1 }
  },
  {
    collegeCode: "MIT-MUZAFFARPUR",
    branchCode: "EE",
    totalSeats: 60,
    categorySeats: { UR: 24, BC: 7, EBC: 11, SC: 10, ST: 1, EWS: 6, RCG: 1 }
  },
  {
    collegeCode: "MIT-MUZAFFARPUR",
    branchCode: "ME",
    totalSeats: 60,
    categorySeats: { UR: 24, BC: 7, EBC: 11, SC: 10, ST: 1, EWS: 6, RCG: 1 }
  },
  {
    collegeCode: "MIT-MUZAFFARPUR",
    branchCode: "CE",
    totalSeats: 60,
    categorySeats: { UR: 24, BC: 7, EBC: 11, SC: 10, ST: 1, EWS: 6, RCG: 1 }
  },

  // BCE Bhagalpur
  {
    collegeCode: "BCE-BHAGALPUR",
    branchCode: "CSE",
    totalSeats: 60,
    categorySeats: { UR: 24, BC: 7, EBC: 11, SC: 10, ST: 1, EWS: 6, RCG: 1 }
  },
  {
    collegeCode: "BCE-BHAGALPUR",
    branchCode: "ECE",
    totalSeats: 60,
    categorySeats: { UR: 24, BC: 7, EBC: 11, SC: 10, ST: 1, EWS: 6, RCG: 1 }
  },
  {
    collegeCode: "BCE-BHAGALPUR",
    branchCode: "EE",
    totalSeats: 60,
    categorySeats: { UR: 24, BC: 7, EBC: 11, SC: 10, ST: 1, EWS: 6, RCG: 1 }
  },
  {
    collegeCode: "BCE-BHAGALPUR",
    branchCode: "ME",
    totalSeats: 60,
    categorySeats: { UR: 24, BC: 7, EBC: 11, SC: 10, ST: 1, EWS: 6, RCG: 1 }
  },
  {
    collegeCode: "BCE-BHAGALPUR",
    branchCode: "CE",
    totalSeats: 60,
    categorySeats: { UR: 24, BC: 7, EBC: 11, SC: 10, ST: 1, EWS: 6, RCG: 1 }
  }
];

// Helper to generate a realistic seat matrix dynamic split if not explicitly seeded
export const getSeatMatrix = (collegeCode: string, branchCode: string): SeatMatrixEntry => {
  const match = seatMatrixData.find(s => s.collegeCode === collegeCode && s.branchCode === branchCode);
  if (match) return match;

  // Let's assume standard intake of 60 seats for Govt Engineering Colleges in Bihar
  const total = 60;
  const UR = Math.round(total * 0.40);
  const BC = Math.round(total * 0.12);
  const EBC = Math.round(total * 0.18);
  const SC = Math.round(total * 0.16);
  const ST = Math.round(total * 0.01) || 0;
  const EWS = Math.round(total * 0.10);
  const RCG = total - (UR + BC + EBC + SC + ST + EWS); // Remainder for reserved category girls

  return {
    collegeCode,
    branchCode,
    totalSeats: total,
    categorySeats: { UR, BC, EBC, SC, ST, EWS, RCG }
  };
};
