import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export async function POST(request: Request) {
  try {
    const { colleges } = await request.json();
    if (!colleges || !Array.isArray(colleges)) {
      return NextResponse.json({ error: "Invalid colleges data" }, { status: 400 });
    }

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

    // 1. Write the static file to local disk
    fs.writeFileSync(filePath, fileContent, "utf-8");

    // 2. Automatically commit and push to Git repository
    try {
      // Check if there are differences to commit
      const { stdout: statusOut } = await execPromise("git status --porcelain src/data/colleges.ts");
      if (statusOut.trim()) {
        await execPromise("git add src/data/colleges.ts");
        await execPromise('git commit -m "Admin update: sync colleges.ts database record with uploaded photo"');
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
    console.error("Error writing colleges.ts:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
