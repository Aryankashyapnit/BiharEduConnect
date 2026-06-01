import { collegesData } from "./colleges";

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

// Helper to programmatically construct realistic, category-wise seat distribution
const generateSeatMatrix = (): SeatMatrixEntry[] => {
  const generated: SeatMatrixEntry[] = [];

  collegesData.forEach((college) => {
    college.branches.forEach((branch) => {
      // Standard Gov Engineering intake is 60. IT in MIT Muzaffarpur is 40.
      const total = (college.code === "MIT-MUZAFFARPUR" && branch === "IT") ? 40 : 60;
      
      const UR = Math.round(total * 0.40);
      const BC = Math.round(total * 0.12);
      const EBC = Math.round(total * 0.18);
      const SC = Math.round(total * 0.16);
      const ST = total === 60 ? 1 : 0;
      const EWS = Math.round(total * 0.10);
      
      // Allocate the exact mathematical remainder to RCG to sum to total perfectly
      const RCG = total - (UR + BC + EBC + SC + ST + EWS);

      generated.push({
        collegeCode: college.code,
        branchCode: branch,
        totalSeats: total,
        categorySeats: { UR, BC, EBC, SC, ST, EWS, RCG }
      });
    });
  });

  return generated;
};

// Seed Seat Matrices programmatically for all colleges & branches
export const seatMatrixData: SeatMatrixEntry[] = generateSeatMatrix();

// Helper to retrieve seat matrix, reading from client localStorage dynamic updates first
export const getSeatMatrix = (collegeCode: string, branchCode: string): SeatMatrixEntry => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("bihareduconnect_seat_matrix");
    if (stored) {
      try {
        const parsed: SeatMatrixEntry[] = JSON.parse(stored);
        const match = parsed.find(s => s.collegeCode === collegeCode && s.branchCode === branchCode);
        if (match) return match;
      } catch (e) {
        console.error("Error reading stored seat matrix", e);
      }
    }
  }

  const match = seatMatrixData.find(s => s.collegeCode === collegeCode && s.branchCode === branchCode);
  if (match) return match;

  // Final fallback split if not found
  const total = 60;
  return {
    collegeCode,
    branchCode,
    totalSeats: total,
    categorySeats: {
      UR: 24,
      BC: 7,
      EBC: 11,
      SC: 10,
      ST: 1,
      EWS: 6,
      RCG: 1
    }
  };
};
