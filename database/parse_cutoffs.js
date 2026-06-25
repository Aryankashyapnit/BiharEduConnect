const fs = require('fs');
const path = require('path');

// Helper to load collegesData from src/data/colleges.ts
function getCollegesData() {
  const collegesPath = path.join(__dirname, "../src/data/colleges.ts");
  const content = fs.readFileSync(collegesPath, "utf-8");
  const startMarker = "export const collegesData: College[] =";
  const endMarker = "export const branchNames";
  
  const startIndex = content.indexOf(startMarker);
  if (startIndex === -1) throw new Error("Could not find collegesData start marker");
  
  const endIndex = content.indexOf(endMarker, startIndex);
  if (endIndex === -1) throw new Error("Could not find branchNames end marker");
  
  let arrayString = content.substring(startIndex + startMarker.length, endIndex).trim();
  if (arrayString.endsWith(";")) {
    arrayString = arrayString.slice(0, -1).trim();
  }
  return eval(arrayString); // Use eval since it has JS object layout, not pure JSON
}

// Mapping of PDF Institute names to college codes
const collegeNameMap = {
  "B.C.E. BAKHTIYARPUR": "BCE-BAKHTIYARPUR",
  "B.C.E. BHAGALPUR": "BCE-BHAGALPUR",
  "B.P.M.C.E. MADHEPURA": "BPMCE-MADHEPURA",
  "D.C.E. DARBHANGA": "DCE-DARBHANGA",
  "G.C.E. GAYA": "GCE-GAYA",
  "GOVT ENGG COLLEGE W. CHAMPARAN": "GEC-WESTCHAMPARAN",
  "GOVT ENGG. COLLEGE SHEOHAR": "GEC-SHEOHAR",
  "GOVT. ENGG. COLLEGE OF LAKHISARAI": "GEC-LAKHISARAI",
  "GOVT. ENGG. COLLEGE OF SAMASTIPUR": "GEC-SAMASTIPUR",
  "GOVT. ENGG. COLLEGE, ARWAL": "GEC-ARWAL",
  "GOVT. ENGG. COLLEGE, AURANGABAD": "GEC-AURANGABAD",
  "GOVT. ENGG. COLLEGE, BANKA": "GEC-BANKA",
  "GOVT. ENGG. COLLEGE, BHOJPUR": "GEC-BHOJPUR",
  "GOVT. ENGG. COLLEGE, BUXAR": "GEC-BUXAR",
  "GOVT. ENGG. COLLEGE, GOPALGANJ": "GEC-GOPALGANJ",
  "GOVT. ENGG. COLLEGE, JAMUI": "GEC-JAMUI",
  "GOVT. ENGG. COLLEGE, JEHANABAD": "GEC-JEHANABAD",
  "GOVT. ENGG. COLLEGE, KAIMUR": "GEC-KAIMUR",
  "GOVT. ENGG. COLLEGE, KHAGARIA": "GEC-KHAGARIA",
  "GOVT. ENGG. COLLEGE, MADHUBANI": "GEC-MADHUBANI",
  "GOVT. ENGG. COLLEGE, NAWADA": "GEC-NAWADA",
  "GOVT. ENGG. COLLEGE, SHEIKHPURA": "GEC-SHEIKHPURA",
  "GOVT. ENGG. COLLEGE, SIWAN": "GEC-SIWAN",
  "GOVT. ENGG. COLLEGE, VAISHALI": "GEC-VAISHALI",
  "GOVT. ENGG.COLLEGE MUNGER": "GEC-MUNGER",
  "GOVT.ENGG. COLLEGE KISHANGANJ": "GEC-KISHANGANJ",
  "K.C.E., KATIHAR": "KCE-KATIHAR",
  "L.N.J.P.I.T. TECHNOLOGY. CHAPRA": "LNJPIT-CHAPRA",
  "M..C.E. MOTIHARI": "MCE-MOTIHARI",
  "M.I.T. MUZAFFARPUR": "MIT-MUZAFFARPUR",
  "NALANDA COLLEGE. OF ENGG,CHANDI": "NCE-CHANDI",
  "PURNEA COLLEGE OF ENGG.": "PCE-PURNEA",
  "R.R.S.D.C.E, BEGUSARAI": "RRSDCE-BEGUSARAI",
  "S.C.E SASARAM": "SCE-SASARAM",
  "S.I.T. SITAMARHI": "SIT-SITAMARHI",
  "SAHARSA COLLEGE OF ENGG.": "SCE-SAHARSA",
  "SHRI PHANISHWAR NATH RENU ENGG. COLLEGE, ARARIA": "SPNREC-ARARIA",
  "SUPAUL ENGG. COLLEGE, SUPAUL": "SCE-SUPAUL"
};

// Maps course names to frontend branch codes based on college branches list
function mapBranch(college, courseName) {
  const branches = college.branches;
  const course = courseName.toUpperCase().trim();

  if (course === "CIVIL ENGINEERING" || course === "CIVIL ENGG.") {
    if (branches.includes("CE")) return "CE";
    if (branches.includes("MC")) return "MC"; // Fallback typo
  }
  if (course === "MECHANICAL ENGINEERING" || course === "MECHANICAL ENGG.") {
    if (branches.includes("ME")) return "ME";
  }
  if (course === "ELECTRICAL ENGINEERING" || course === "ELECTRICAL ENGG.") {
    if (branches.includes("EE")) return "EE";
    if (branches.includes("EEE")) return "EEE";
  }
  if (course === "ELECTRICAL & ELECTRONICS ENGINEERING" || course === "ELECTRICAL & ELECTRONIC ENGINEERING") {
    if (branches.includes("EEE")) return "EEE";
    if (branches.includes("EE")) return "EE";
  }
  if (course === "COMPUTER SC. & ENGINEERING" || course === "COMPUTER SC. & ENGG." || course === "COMPUTER SCIENCE & ENGINEERING") {
    if (branches.includes("CSE")) return "CSE";
  }
  if (course === "INFORMATION TECHNOLOGY" || course === "I.T.") {
    if (branches.includes("IT")) return "IT";
  }
  if (course === "ELECTRONICS & COMMUNICATION ENGINEERING" || course === "ELECTRO & COMMUNICATION ENGINEERING") {
    if (branches.includes("ECE")) return "ECE";
  }
  if (course === "FIRE TECHNOLOGY & SAFETY") {
    if (branches.includes("FIRE TECHNOLOGY & SAFETY")) return "FIRE TECHNOLOGY & SAFETY";
  }
  if (course === "MECHATRONICS ENGG" || course === "MECHATRONICS ENGINEERING" || course.includes("MECHATRONICS")) {
    if (branches.includes("MECHATRONICS ENGG.")) return "MECHATRONICS ENGG.";
  }
  if (course === "ROBOTICS AND AUTOMATION" || course === "ROBOTIC AND AUTOMATION" || course.includes("ROBOTIC")) {
    if (branches.includes("ROBOTIC AND AUTOMATION")) return "ROBOTIC AND AUTOMATION";
  }
  if (course.includes("LEATHER")) {
    if (branches.includes("LEATHER TECHNOLOGY")) return "LEATHER TECHNOLOGY";
  }
  if (course.includes("CHEMICAL")) {
    if (branches.includes("CHEMICAL ENGG.")) return "CHEMICAL ENGG.";
  }
  if (course.includes("FOOD") || course.includes("FPP")) {
    if (branches.includes("FPP")) return "FPP";
    if (branches.includes("FOOD TECHNOLOGY AND MANAGEMENT")) return "FOOD TECHNOLOGY AND MANAGEMENT";
  }
  if (course.includes("BIOMEDICAL")) {
    if (branches.includes("BIOMEDICAL & ROBOTIC ENGG.")) return "BIOMEDICAL & ROBOTIC ENGG.";
  }
  if (course.includes("AERONAUTICAL")) {
    if (branches.includes("AERONAUTICAL ENGG.")) return "AERONAUTICAL ENGG.";
  }
  if (course.includes("VLSI")) {
    if (branches.includes("EE(VLSI)")) return "EE(VLSI)";
  }
  if (course.includes("MINING")) {
    if (branches.includes("MINING ENGG.")) return "MINING ENGG.";
  }
  if (course.includes("SMART") || course.includes("MANUFACTURING")) {
    if (branches.includes("MECHANICAL &SMART MANUFACTURING")) return "MECHANICAL &SMART MANUFACTURING";
  }
  if (course.includes("3-D") || course.includes("ANIMATION")) {
    if (branches.includes("3D ANIMATION & GRAPHICS")) return "3D ANIMATION & GRAPHICS";
  }

  // Handle specializations of CSE like IoT, Cyber Security, etc.
  if (course.includes("INTERNET OF THINGS") || course.includes("IOT")) {
    if (branches.includes("CSE-IOT")) return "CSE-IOT";
    if (branches.includes("MC")) return "MC"; // Bakhtiyarpur CSE-IoT maps to MC in collegesData
  }
  if (course.includes("CYBER SECURITY") || course.includes("CYBER")) {
    if (branches.includes("MC")) return "MC"; // Darbhanga CSE-Cyber maps to MC in collegesData
  }
  
  // Generic matches based on keywords
  for (const b of branches) {
    if (course.includes(b)) return b;
  }
  
  // Fallbacks
  if (course.includes("CIVIL")) return "CE";
  if (course.includes("COMPUTER")) return "CSE";
  if (course.includes("ELECTRICAL")) return "EE";
  if (course.includes("MECHANICAL")) return "ME";

  return null;
}

function parseFile() {
  console.log("Loading colleges data...");
  const colleges = getCollegesData();
  const collegeMap = {};
  colleges.forEach(c => {
    collegeMap[c.code] = c;
  });

  const rawTextPath = path.join(__dirname, "raw_ocr.txt");
  const content = fs.readFileSync(rawTextPath, "utf-8");
  const lines = content.split("\n");

  const results = [];
  let idCounter = 10001;

  let skippedCount = 0;
  let parsedCount = 0;

  const middleRegex = /^([\s\S]+?)\s+(Female|General)\s+([A-Z0-9-]+)$/i;

  let accumulatedText = "";
  let currentInstitute = "";

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    if (trimmed.startsWith("Page No:-") || trimmed.startsWith("INSTITUTE")) return;

    // Split by tab characters since pdf-parse preserved tabs
    const parts = trimmed.split("\t").map(s => s.trim());
    
    // Check if this line has ranks at the end
    const numericParts = parts.filter(s => /^\d+$/.test(s)).map(Number);
    
    if (numericParts.length >= 2) {
      // This line has ranks! We can parse it.
      const openingRank = numericParts[numericParts.length - 2];
      const closingRank = numericParts[numericParts.length - 1];

      // Remove the numeric parts from the array
      const nonNumericParts = parts.filter(s => !/^\d+$/.test(s));

      let inst = nonNumericParts[0];
      let middleText = nonNumericParts.slice(1).join(" ").trim();

      if (currentInstitute && !collegeNameMap[inst]) {
        // If current institute is set and inst is a fragment of the course name
        middleText = (accumulatedText + " " + inst + " " + middleText).trim();
        inst = currentInstitute;
      } else if (accumulatedText) {
        middleText = (accumulatedText + " " + middleText).trim();
      }

      // Reset accumulators
      accumulatedText = "";
      currentInstitute = "";

      const collegeCode = collegeNameMap[inst];
      if (!collegeCode) {
        skippedCount++;
        return;
      }

      const college = collegeMap[collegeCode];
      if (!college) {
        skippedCount++;
        return;
      }

      const match = middleRegex.exec(middleText);
      if (!match) {
        console.log(`Warning: Middle text did not match regex on line ${index + 1}: "${middleText}"`);
        skippedCount++;
        return;
      }

      const rawCourse = match[1].trim();
      const rawSeatType = match[2].trim();
      const rawCategory = match[3].trim();

      const branchCode = mapBranch(college, rawCourse);
      if (!branchCode) {
        console.log(`Warning: Could not map branch for college ${collegeCode}, course "${rawCourse}"`);
        skippedCount++;
        return;
      }

      const gender = rawSeatType === "Female" ? "Female" : "Co-ed";

      results.push({
        id: `c-2025-${idCounter++}`,
        collegeCode,
        branchCode,
        year: 2025,
        round: 1, // Store for round 1
        category: rawCategory,
        gender,
        openingRank,
        closingRank
      });

      // Also push a duplicate for round 2 so both filter queries in the UI work
      results.push({
        id: `c-2025-${idCounter++}`,
        collegeCode,
        branchCode,
        year: 2025,
        round: 2, // Store for round 2
        category: rawCategory,
        gender,
        openingRank,
        closingRank
      });

      parsedCount++;
    } else {
      // No ranks! This is a fragment.
      if (collegeNameMap[trimmed]) {
        currentInstitute = trimmed;
        accumulatedText = "";
      } else {
        accumulatedText = (accumulatedText + " " + trimmed).trim();
      }
    }
  });

  console.log(`Parsed rows: ${parsedCount}`);
  console.log(`Skipped rows (unmapped/metadata): ${skippedCount}`);
  console.log(`Generated cutoff records: ${results.length}`);

  // Write directly to frontend data directory
  const outputPath = path.join(__dirname, "../src/data/cutoffs2025.json");
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`Wrote official 2025 JSON results to ${outputPath}`);
}

parseFile();
