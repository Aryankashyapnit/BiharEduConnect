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

export const seatMatrixData: SeatMatrixEntry[] = [
  {
    "collegeCode": "BCE-BHAGALPUR",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "BCE-BHAGALPUR",
    "branchCode": "MC",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "BCE-BHAGALPUR",
    "branchCode": "EE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "BCE-BHAGALPUR",
    "branchCode": "ECE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "BCE-BHAGALPUR",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "MIT-MUZAFFARPUR",
    "branchCode": "CE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "MIT-MUZAFFARPUR",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "MIT-MUZAFFARPUR",
    "branchCode": "EE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "MIT-MUZAFFARPUR",
    "branchCode": "ECE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "MIT-MUZAFFARPUR",
    "branchCode": "IT",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "MIT-MUZAFFARPUR",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "MIT-MUZAFFARPUR",
    "branchCode": "LEATHER TECHNOLOGY",
    "totalSeats": 30,
    "categorySeats": {
      "UR": 12,
      "BC": 4,
      "EBC": 5,
      "SC": 5,
      "ST": 0,
      "EWS": 3,
      "RCG": 1
    }
  },
  {
    "collegeCode": "MIT-MUZAFFARPUR",
    "branchCode": "CHEMICAL ENGG.",
    "totalSeats": 30,
    "categorySeats": {
      "UR": 12,
      "BC": 4,
      "EBC": 5,
      "SC": 5,
      "ST": 0,
      "EWS": 3,
      "RCG": 1
    }
  },
  {
    "collegeCode": "MIT-MUZAFFARPUR",
    "branchCode": "MC",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "MIT-MUZAFFARPUR",
    "branchCode": "BIOMEDICAL & ROBOTIC ENGG.",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GCE-GAYA",
    "branchCode": "CSE",
    "totalSeats": 120,
    "categorySeats": {
      "UR": 48,
      "BC": 15,
      "EBC": 21,
      "SC": 19,
      "ST": 1,
      "EWS": 12,
      "RCG": 4
    }
  },
  {
    "collegeCode": "GCE-GAYA",
    "branchCode": "EEE",
    "totalSeats": 90,
    "categorySeats": {
      "UR": 36,
      "BC": 10,
      "EBC": 16,
      "SC": 15,
      "ST": 1,
      "EWS": 9,
      "RCG": 3
    }
  },
  {
    "collegeCode": "GCE-GAYA",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GCE-GAYA",
    "branchCode": "MC",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GCE-GAYA",
    "branchCode": "CE",
    "totalSeats": 90,
    "categorySeats": {
      "UR": 36,
      "BC": 11,
      "EBC": 16,
      "SC": 14,
      "ST": 1,
      "EWS": 9,
      "RCG": 3
    }
  },
  {
    "collegeCode": "MCE-MOTIHARI",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "MCE-MOTIHARI",
    "branchCode": "EEE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "MCE-MOTIHARI",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "MCE-MOTIHARI",
    "branchCode": "CE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 12,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "MCE-MOTIHARI",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "DCE-DARBHANGA",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "DCE-DARBHANGA",
    "branchCode": "EEE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "DCE-DARBHANGA",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "DCE-DARBHANGA",
    "branchCode": "MC",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "DCE-DARBHANGA",
    "branchCode": "CE",
    "totalSeats": 90,
    "categorySeats": {
      "UR": 36,
      "BC": 11,
      "EBC": 16,
      "SC": 15,
      "ST": 1,
      "EWS": 9,
      "RCG": 2
    }
  },
  {
    "collegeCode": "DCE-DARBHANGA",
    "branchCode": "FIRE TECHNOLOGY & SAFETY",
    "totalSeats": 30,
    "categorySeats": {
      "UR": 12,
      "BC": 4,
      "EBC": 5,
      "SC": 5,
      "ST": 0,
      "EWS": 3,
      "RCG": 1
    }
  },
  {
    "collegeCode": "DCE-DARBHANGA",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "NCE-CHANDI",
    "branchCode": "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "NCE-CHANDI",
    "branchCode": "EEE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "NCE-CHANDI",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "NCE-CHANDI",
    "branchCode": "CE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "NCE-CHANDI",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "NCE-CHANDI",
    "branchCode": "AERONAUTICAL ENGG.",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "LNJPIT-CHAPRA",
    "branchCode": "CSE",
    "totalSeats": 120,
    "categorySeats": {
      "UR": 48,
      "BC": 14,
      "EBC": 21,
      "SC": 19,
      "ST": 2,
      "EWS": 12,
      "RCG": 4
    }
  },
  {
    "collegeCode": "LNJPIT-CHAPRA",
    "branchCode": "EEE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "LNJPIT-CHAPRA",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "LNJPIT-CHAPRA",
    "branchCode": "MC",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "LNJPIT-CHAPRA",
    "branchCode": "CE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "LNJPIT-CHAPRA",
    "branchCode": "FPP",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "BCE-BAKHTIYARPUR",
    "branchCode": "CE",
    "totalSeats": 90,
    "categorySeats": {
      "UR": 36,
      "BC": 10,
      "EBC": 16,
      "SC": 15,
      "ST": 1,
      "EWS": 9,
      "RCG": 3
    }
  },
  {
    "collegeCode": "BCE-BAKHTIYARPUR",
    "branchCode": "EEE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 12,
      "SC": 9,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "BCE-BAKHTIYARPUR",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "BCE-BAKHTIYARPUR",
    "branchCode": "MC",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "BCE-BAKHTIYARPUR",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 11,
      "SC": 9,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "BCE-BAKHTIYARPUR",
    "branchCode": "FIRE TECHNOLOGY & SAFETY",
    "totalSeats": 30,
    "categorySeats": {
      "UR": 12,
      "BC": 4,
      "EBC": 5,
      "SC": 5,
      "ST": 0,
      "EWS": 3,
      "RCG": 1
    }
  },
  {
    "collegeCode": "SIT-SITAMARHI",
    "branchCode": "CE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "SIT-SITAMARHI",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "SIT-SITAMARHI",
    "branchCode": "EE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "SIT-SITAMARHI",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "SIT-SITAMARHI",
    "branchCode": "CE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "SIT-SITAMARHI",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "RRSDCE-BEGUSARAI",
    "branchCode": "CE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "RRSDCE-BEGUSARAI",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "RRSDCE-BEGUSARAI",
    "branchCode": "EEE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "RRSDCE-BEGUSARAI",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 11,
      "SC": 9,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "RRSDCE-BEGUSARAI",
    "branchCode": "CHEMICAL ENGG.",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "RRSDCE-BEGUSARAI",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "SCE-SASARAM",
    "branchCode": "CE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "SCE-SASARAM",
    "branchCode": "CSE",
    "totalSeats": 90,
    "categorySeats": {
      "UR": 36,
      "BC": 11,
      "EBC": 15,
      "SC": 15,
      "ST": 1,
      "EWS": 9,
      "RCG": 3
    }
  },
  {
    "collegeCode": "SCE-SASARAM",
    "branchCode": "EEE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "SCE-SASARAM",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "SCE-SASARAM",
    "branchCode": "EE(VLSI)",
    "totalSeats": 30,
    "categorySeats": {
      "UR": 12,
      "BC": 3,
      "EBC": 6,
      "SC": 5,
      "ST": 0,
      "EWS": 3,
      "RCG": 1
    }
  },
  {
    "collegeCode": "SCE-SASARAM",
    "branchCode": "MINING ENGG.",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "BPMCE-MADHEPURA",
    "branchCode": "CE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "BPMCE-MADHEPURA",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "BPMCE-MADHEPURA",
    "branchCode": "EEE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 10,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "BPMCE-MADHEPURA",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "BPMCE-MADHEPURA",
    "branchCode": "3D ANIMATION & GRAPHICS",
    "totalSeats": 30,
    "categorySeats": {
      "UR": 12,
      "BC": 4,
      "EBC": 5,
      "SC": 5,
      "ST": 0,
      "EWS": 3,
      "RCG": 1
    }
  },
  {
    "collegeCode": "BPMCE-MADHEPURA",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "BPMCE-MADHEPURA",
    "branchCode": "CE",
    "totalSeats": 30,
    "categorySeats": {
      "UR": 12,
      "BC": 3,
      "EBC": 6,
      "SC": 5,
      "ST": 0,
      "EWS": 3,
      "RCG": 1
    }
  },
  {
    "collegeCode": "KCE-KATIHAR",
    "branchCode": "CE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 11,
      "SC": 9,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "KCE-KATIHAR",
    "branchCode": "CSE",
    "totalSeats": 120,
    "categorySeats": {
      "UR": 48,
      "BC": 15,
      "EBC": 21,
      "SC": 19,
      "ST": 1,
      "EWS": 12,
      "RCG": 4
    }
  },
  {
    "collegeCode": "KCE-KATIHAR",
    "branchCode": "EEE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 10,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "KCE-KATIHAR",
    "branchCode": "ME",
    "totalSeats": 30,
    "categorySeats": {
      "UR": 12,
      "BC": 3,
      "EBC": 6,
      "SC": 5,
      "ST": 0,
      "EWS": 3,
      "RCG": 1
    }
  },
  {
    "collegeCode": "KCE-KATIHAR",
    "branchCode": "MECHANICAL &SMART MANUFACTURING",
    "totalSeats": 30,
    "categorySeats": {
      "UR": 12,
      "BC": 3,
      "EBC": 5,
      "SC": 5,
      "ST": 1,
      "EWS": 3,
      "RCG": 1
    }
  },
  {
    "collegeCode": "KCE-KATIHAR",
    "branchCode": "EE(VLSI)",
    "totalSeats": 30,
    "categorySeats": {
      "UR": 12,
      "BC": 3,
      "EBC": 6,
      "SC": 5,
      "ST": 0,
      "EWS": 3,
      "RCG": 1
    }
  },
  {
    "collegeCode": "PCE-PURNEA",
    "branchCode": "CE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "PCE-PURNEA",
    "branchCode": "EE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "PCE-PURNEA",
    "branchCode": "ME",
    "totalSeats": 30,
    "categorySeats": {
      "UR": 12,
      "BC": 4,
      "EBC": 5,
      "SC": 5,
      "ST": 0,
      "EWS": 3,
      "RCG": 1
    }
  },
  {
    "collegeCode": "PCE-PURNEA",
    "branchCode": "MC",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "PCE-PURNEA",
    "branchCode": "ECE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "PCE-PURNEA",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "PCE-PURNEA",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "PCE-PURNEA",
    "branchCode": "MECHATRONICS ENGG.",
    "totalSeats": 30,
    "categorySeats": {
      "UR": 12,
      "BC": 4,
      "EBC": 5,
      "SC": 5,
      "ST": 0,
      "EWS": 3,
      "RCG": 1
    }
  },
  {
    "collegeCode": "SCE-SAHARSA",
    "branchCode": "CE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "SCE-SAHARSA",
    "branchCode": "EE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "SCE-SAHARSA",
    "branchCode": "ECE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "SCE-SAHARSA",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "SCE-SAHARSA",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "SCE-SUPAUL",
    "branchCode": "CE",
    "totalSeats": 90,
    "categorySeats": {
      "UR": 36,
      "BC": 10,
      "EBC": 16,
      "SC": 15,
      "ST": 1,
      "EWS": 9,
      "RCG": 3
    }
  },
  {
    "collegeCode": "SCE-SUPAUL",
    "branchCode": "EE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "SCE-SUPAUL",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 11,
      "SC": 9,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "SCE-SUPAUL",
    "branchCode": "MC",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "SCE-SUPAUL",
    "branchCode": "ECE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "SCE-SUPAUL",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "SCE-SUPAUL",
    "branchCode": "CSE",
    "totalSeats": 30,
    "categorySeats": {
      "UR": 12,
      "BC": 4,
      "EBC": 5,
      "SC": 5,
      "ST": 0,
      "EWS": 3,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-BANKA",
    "branchCode": "CE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-BANKA",
    "branchCode": "EE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-BANKA",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-BANKA",
    "branchCode": "ECE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 10,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-BANKA",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-BANKA",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-VAISHALI",
    "branchCode": "CE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-VAISHALI",
    "branchCode": "EE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 10,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-VAISHALI",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-VAISHALI",
    "branchCode": "MC",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-VAISHALI",
    "branchCode": "ECE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-VAISHALI",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-VAISHALI",
    "branchCode": "ECE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 10,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-VAISHALI",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-JAMUI",
    "branchCode": "CE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-JAMUI",
    "branchCode": "EE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-JAMUI",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 12,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-JAMUI",
    "branchCode": "ECE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-JAMUI",
    "branchCode": "CSE",
    "totalSeats": 30,
    "categorySeats": {
      "UR": 12,
      "BC": 4,
      "EBC": 5,
      "SC": 5,
      "ST": 0,
      "EWS": 3,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-JAMUI",
    "branchCode": "CSE",
    "totalSeats": 30,
    "categorySeats": {
      "UR": 12,
      "BC": 4,
      "EBC": 5,
      "SC": 5,
      "ST": 0,
      "EWS": 3,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-JAMUI",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-NAWADA",
    "branchCode": "CE",
    "totalSeats": 120,
    "categorySeats": {
      "UR": 48,
      "BC": 15,
      "EBC": 22,
      "SC": 19,
      "ST": 1,
      "EWS": 12,
      "RCG": 3
    }
  },
  {
    "collegeCode": "GEC-NAWADA",
    "branchCode": "EE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-NAWADA",
    "branchCode": "ECE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-NAWADA",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-NAWADA",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-KISHANGANJ",
    "branchCode": "CE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-KISHANGANJ",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-KISHANGANJ",
    "branchCode": "EE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-KISHANGANJ",
    "branchCode": "ECE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-KISHANGANJ",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-KISHANGANJ",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "SPNREC-ARARIA",
    "branchCode": "CE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "SPNREC-ARARIA",
    "branchCode": "ME",
    "totalSeats": 30,
    "categorySeats": {
      "UR": 12,
      "BC": 4,
      "EBC": 5,
      "SC": 5,
      "ST": 0,
      "EWS": 3,
      "RCG": 1
    }
  },
  {
    "collegeCode": "SPNREC-ARARIA",
    "branchCode": "EE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 10,
      "SC": 9,
      "ST": 2,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "SPNREC-ARARIA",
    "branchCode": "MECHATRONICS ENGG.",
    "totalSeats": 30,
    "categorySeats": {
      "UR": 12,
      "BC": 4,
      "EBC": 6,
      "SC": 5,
      "ST": 0,
      "EWS": 3,
      "RCG": 0
    }
  },
  {
    "collegeCode": "SPNREC-ARARIA",
    "branchCode": "ECE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-MUNGER",
    "branchCode": "CE",
    "totalSeats": 120,
    "categorySeats": {
      "UR": 48,
      "BC": 14,
      "EBC": 22,
      "SC": 19,
      "ST": 1,
      "EWS": 12,
      "RCG": 4
    }
  },
  {
    "collegeCode": "GEC-MUNGER",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-MUNGER",
    "branchCode": "MC",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-MUNGER",
    "branchCode": "EE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-MUNGER",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-MUNGER",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-SHEOHAR",
    "branchCode": "CE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-SHEOHAR",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-SHEOHAR",
    "branchCode": "EE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-SHEOHAR",
    "branchCode": "ECE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-SHEOHAR",
    "branchCode": "CE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-SHEOHAR",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-WESTCHAMPARAN",
    "branchCode": "CE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-WESTCHAMPARAN",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-WESTCHAMPARAN",
    "branchCode": "EE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-WESTCHAMPARAN",
    "branchCode": "ECE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 11,
      "SC": 9,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-WESTCHAMPARAN",
    "branchCode": "EE(VLSI)",
    "totalSeats": 30,
    "categorySeats": {
      "UR": 12,
      "BC": 3,
      "EBC": 6,
      "SC": 5,
      "ST": 0,
      "EWS": 3,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-WESTCHAMPARAN",
    "branchCode": "CSE",
    "totalSeats": 30,
    "categorySeats": {
      "UR": 12,
      "BC": 4,
      "EBC": 5,
      "SC": 5,
      "ST": 0,
      "EWS": 3,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-WESTCHAMPARAN",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-AURANGABAD",
    "branchCode": "CE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-AURANGABAD",
    "branchCode": "EE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 11,
      "SC": 9,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-AURANGABAD",
    "branchCode": "ECE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-AURANGABAD",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-AURANGABAD",
    "branchCode": "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-KAIMUR",
    "branchCode": "CE",
    "totalSeats": 90,
    "categorySeats": {
      "UR": 36,
      "BC": 11,
      "EBC": 15,
      "SC": 15,
      "ST": 1,
      "EWS": 9,
      "RCG": 3
    }
  },
  {
    "collegeCode": "GEC-KAIMUR",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-KAIMUR",
    "branchCode": "EE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-KAIMUR",
    "branchCode": "ECE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 12,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-KAIMUR",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-KAIMUR",
    "branchCode": "CSE",
    "totalSeats": 30,
    "categorySeats": {
      "UR": 12,
      "BC": 4,
      "EBC": 5,
      "SC": 5,
      "ST": 0,
      "EWS": 3,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-GOPALGANJ",
    "branchCode": "CE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-GOPALGANJ",
    "branchCode": "ME",
    "totalSeats": 30,
    "categorySeats": {
      "UR": 12,
      "BC": 4,
      "EBC": 5,
      "SC": 5,
      "ST": 0,
      "EWS": 3,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-GOPALGANJ",
    "branchCode": "EE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-GOPALGANJ",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-GOPALGANJ",
    "branchCode": "AERONAUTICAL ENGG.",
    "totalSeats": 30,
    "categorySeats": {
      "UR": 12,
      "BC": 3,
      "EBC": 5,
      "SC": 5,
      "ST": 1,
      "EWS": 3,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-GOPALGANJ",
    "branchCode": "EE(VLSI)",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-GOPALGANJ",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-MADHUBANI",
    "branchCode": "CE",
    "totalSeats": 120,
    "categorySeats": {
      "UR": 48,
      "BC": 14,
      "EBC": 22,
      "SC": 19,
      "ST": 1,
      "EWS": 12,
      "RCG": 4
    }
  },
  {
    "collegeCode": "GEC-MADHUBANI",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-MADHUBANI",
    "branchCode": "EE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-MADHUBANI",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 10,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-MADHUBANI",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-SIWAN",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-SIWAN",
    "branchCode": "EE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-SIWAN",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-SIWAN",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-SIWAN",
    "branchCode": "EE(VLSI)",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-JEHANABAD",
    "branchCode": "CE",
    "totalSeats": 120,
    "categorySeats": {
      "UR": 48,
      "BC": 14,
      "EBC": 22,
      "SC": 19,
      "ST": 1,
      "EWS": 12,
      "RCG": 4
    }
  },
  {
    "collegeCode": "GEC-JEHANABAD",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-JEHANABAD",
    "branchCode": "ECE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-JEHANABAD",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-JEHANABAD",
    "branchCode": "EE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-ARWAL",
    "branchCode": "CE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-ARWAL",
    "branchCode": "ME",
    "totalSeats": 30,
    "categorySeats": {
      "UR": 12,
      "BC": 3,
      "EBC": 6,
      "SC": 5,
      "ST": 0,
      "EWS": 3,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-ARWAL",
    "branchCode": "EE",
    "totalSeats": 120,
    "categorySeats": {
      "UR": 48,
      "BC": 14,
      "EBC": 22,
      "SC": 19,
      "ST": 1,
      "EWS": 12,
      "RCG": 4
    }
  },
  {
    "collegeCode": "GEC-ARWAL",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 10,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-ARWAL",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-ARWAL",
    "branchCode": "ROBOTIC AND AUTOMATION",
    "totalSeats": 30,
    "categorySeats": {
      "UR": 12,
      "BC": 3,
      "EBC": 6,
      "SC": 5,
      "ST": 0,
      "EWS": 3,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-KHAGARIA",
    "branchCode": "CE",
    "totalSeats": 120,
    "categorySeats": {
      "UR": 48,
      "BC": 15,
      "EBC": 22,
      "SC": 19,
      "ST": 1,
      "EWS": 12,
      "RCG": 3
    }
  },
  {
    "collegeCode": "GEC-KHAGARIA",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-KHAGARIA",
    "branchCode": "EE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-KHAGARIA",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-KHAGARIA",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 11,
      "SC": 9,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-BUXAR",
    "branchCode": "CE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-BUXAR",
    "branchCode": "EE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-BUXAR",
    "branchCode": "CSE",
    "totalSeats": 120,
    "categorySeats": {
      "UR": 48,
      "BC": 14,
      "EBC": 21,
      "SC": 19,
      "ST": 2,
      "EWS": 12,
      "RCG": 4
    }
  },
  {
    "collegeCode": "GEC-BUXAR",
    "branchCode": "ECE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-BHOJPUR",
    "branchCode": "CE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-BHOJPUR",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-BHOJPUR",
    "branchCode": "EE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 11,
      "SC": 9,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-BHOJPUR",
    "branchCode": "ECE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-BHOJPUR",
    "branchCode": "CSE",
    "totalSeats": 90,
    "categorySeats": {
      "UR": 36,
      "BC": 10,
      "EBC": 17,
      "SC": 15,
      "ST": 1,
      "EWS": 9,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-BHOJPUR",
    "branchCode": "ELECTRONICS AND INSTRUMENTATION ENGG.",
    "totalSeats": 30,
    "categorySeats": {
      "UR": 12,
      "BC": 3,
      "EBC": 6,
      "SC": 5,
      "ST": 0,
      "EWS": 3,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-SHEIKHPURA",
    "branchCode": "CE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-SHEIKHPURA",
    "branchCode": "ME",
    "totalSeats": 30,
    "categorySeats": {
      "UR": 12,
      "BC": 3,
      "EBC": 6,
      "SC": 5,
      "ST": 0,
      "EWS": 3,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-SHEIKHPURA",
    "branchCode": "EE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-SHEIKHPURA",
    "branchCode": "ECE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-SHEIKHPURA",
    "branchCode": "CSE",
    "totalSeats": 120,
    "categorySeats": {
      "UR": 48,
      "BC": 15,
      "EBC": 21,
      "SC": 19,
      "ST": 1,
      "EWS": 12,
      "RCG": 4
    }
  },
  {
    "collegeCode": "GEC-SHEIKHPURA",
    "branchCode": "MECHATRONICS ENGG.",
    "totalSeats": 30,
    "categorySeats": {
      "UR": 12,
      "BC": 3,
      "EBC": 6,
      "SC": 5,
      "ST": 0,
      "EWS": 3,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-LAKHISARAI",
    "branchCode": "CE",
    "totalSeats": 120,
    "categorySeats": {
      "UR": 48,
      "BC": 14,
      "EBC": 22,
      "SC": 19,
      "ST": 1,
      "EWS": 12,
      "RCG": 4
    }
  },
  {
    "collegeCode": "GEC-LAKHISARAI",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-LAKHISARAI",
    "branchCode": "EE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 10,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-LAKHISARAI",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 11,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-LAKHISARAI",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-SAMASTIPUR",
    "branchCode": "CE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 9,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-SAMASTIPUR",
    "branchCode": "ME",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 10,
      "SC": 10,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-SAMASTIPUR",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 7,
      "EBC": 11,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 1
    }
  },
  {
    "collegeCode": "GEC-SAMASTIPUR",
    "branchCode": "ECE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 6,
      "EBC": 11,
      "SC": 10,
      "ST": 1,
      "EWS": 6,
      "RCG": 2
    }
  },
  {
    "collegeCode": "GEC-SAMASTIPUR",
    "branchCode": "CSE",
    "totalSeats": 60,
    "categorySeats": {
      "UR": 24,
      "BC": 8,
      "EBC": 11,
      "SC": 9,
      "ST": 0,
      "EWS": 6,
      "RCG": 2
    }
  }
];

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
