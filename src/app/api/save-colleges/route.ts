import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export async function POST(request: Request) {
  try {
    const { colleges, seatMatrix } = await request.json();

    // 1. Sync colleges if provided
    if (colleges && Array.isArray(colleges)) {
      const filePath = path.join(process.cwd(), "src/data/colleges.ts");
      const fileContent = `export interface College {
  id: string;
  name: string;
  code: string;
  location: string;
  established: number;
  nirf: number | null;
  averagePackage: number; // in LPA
  highestPackage: number; // in LPA
  tuitionFee: number; // Annual in INR
  hostelAvailable: boolean;
  hostelFee: number; // Annual in INR
  website: string;
  description: string;
  campusSize: string;
  branches: string[];
  recruits: string[];
  image: string;
}

export const collegesData: College[] = ${JSON.stringify(colleges, null, 2)};

export const branchNames: Record<string, string> = {
  CSE: "Computer Science & Engineering",
  IT: "Information Technology",
  ECE: "Electronics & Communication Engineering",
  EE: "Electrical Engineering",
  EEE: "Electrical & Electronics Engineering",
  ME: "Mechanical Engineering",
  CE: "Civil Engineering",
  "Leather Technology": "Leather Technology",
  "Chemical Engineering": "Chemical Engineering",
  "CSE-IOT": "CSE (Internet of Things)"
};
`;
      fs.writeFileSync(filePath, fileContent, "utf-8");
    }

    // 2. Sync seat matrix if provided
    if (seatMatrix && Array.isArray(seatMatrix)) {
      const filePath = path.join(process.cwd(), "src/data/seatMatrix.ts");
      const fileContent = `import { collegesData } from "./colleges";

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

export const seatMatrixData: SeatMatrixEntry[] = ${JSON.stringify(seatMatrix, null, 2)};

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
`;
      fs.writeFileSync(filePath, fileContent, "utf-8");
    }

    // 3. Automatically commit and push both files to Git
    try {
      await execPromise("git add src/data/colleges.ts src/data/seatMatrix.ts");
      const { stdout: statusOut } = await execPromise("git status --porcelain src/data/colleges.ts src/data/seatMatrix.ts");
      if (statusOut.trim()) {
        await execPromise('git commit -m "Admin update: sync colleges and seat matrix database records with uploaded photos"');
        await execPromise("git push origin main");
        return NextResponse.json({ success: true, pushed: true });
      } else {
        return NextResponse.json({ success: true, pushed: false, message: "No new changes detected compared to Git HEAD." });
      }
    } catch (gitError: any) {
      console.error("Git automation command failed:", gitError);
      return NextResponse.json({ 
        success: true, 
        pushed: false, 
        warning: "Database saved on local disk, but Git auto-push failed. Error: " + gitError.message 
      });
    }
  } catch (error: any) {
    console.error("Error writing database files:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
