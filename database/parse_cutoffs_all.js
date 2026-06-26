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
  const colleges = eval(arrayString); // Use eval since it has JS object layout, not pure JSON

  const codes = colleges.map(c => c.code);
  if (!codes.includes("WIT-DARBHANGA")) {
    colleges.push({
      id: "wit-darbhanga",
      name: "Dr. APJ Abdul Kalam Women's Institute of Technology, Darbhanga",
      code: "WIT-DARBHANGA",
      location: "Darbhanga",
      established: 2012,
      nirf: null,
      averagePackage: 3.5,
      highestPackage: 8.0,
      tuitionFee: 40000,
      hostelAvailable: true,
      hostelFee: 15000,
      website: "https://www.witlnmu.ac.in",
      description: "Dr. APJ Abdul Kalam Women's Institute of Technology (WIT) is a premier women-only engineering institute under Lalit Narayan Mithila University, Darbhanga.",
      campusSize: "10 Acres",
      branches: ["CSE", "IT", "BI"],
      recruits: ["TCS", "Wipro", "Infosys"],
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=600"
    });
  }
  if (!codes.includes("CIPET-PATNA")) {
    colleges.push({
      id: "cipet-patna",
      name: "Central Institute of Petrochemicals Engineering & Technology (CIPET), Bihta, Patna",
      code: "CIPET-PATNA",
      location: "Patna",
      established: 1994,
      nirf: null,
      averagePackage: 3.6,
      highestPackage: 7.2,
      tuitionFee: 45000,
      hostelAvailable: true,
      hostelFee: 18000,
      website: "https://www.cipet.gov.in",
      description: "CIPET: IPT Patna is a premier central government institute offering B.Tech programs in Plastics Technology and Petrochemical Engineering.",
      campusSize: "15 Acres",
      branches: ["PLASTIC", "PETROCHEMICAL", "ME"],
      recruits: ["Reliance", "Supreme", "IPCL", "TCS"],
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600"
    });
  }
  if (!codes.includes("SGIDT-PATNA")) {
    colleges.push({
      id: "sgidt-patna",
      name: "Sanjay Gandhi Institute of Dairy Technology (SGIDT), Patna",
      code: "SGIDT-PATNA",
      location: "Patna",
      established: 1980,
      nirf: null,
      averagePackage: 4.5,
      highestPackage: 9.0,
      tuitionFee: 15000,
      hostelAvailable: true,
      hostelFee: 12000,
      website: "https://www.basu.org.in",
      description: "Sanjay Gandhi Institute of Dairy Technology (SGIDT) is a constituent college of Bihar Animal Sciences University, Patna, offering Dairy Technology education.",
      campusSize: "12 Acres",
      branches: ["DT"],
      recruits: ["Amul", "Sudha", "Mother Dairy", "Nestle"],
      image: "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=600"
    });
  }

  return colleges;
}

// Mapping of PDF Institute names to college codes (supporting 2024 and 2025 variants)
const collegeNameMap = {
  "B.C.E. BAKHTIYARPUR": "BCE-BAKHTIYARPUR",
  "B.C.E. BHAGALPUR": "BCE-BHAGALPUR",
  "B.P.M.C.E. MADHEPURA": "BPMCE-MADHEPURA",
  "B.P.M.C.E. MADHPURA": "BPMCE-MADHEPURA",
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
  "R.R.D.C.E. BEGUSARAI": "RRSDCE-BEGUSARAI", // 2024 variant
  "S.C.E SASARAM": "SCE-SASARAM",
  "S.I.T. SITAMARHI": "SIT-SITAMARHI",
  "SAHARSA COLLEGE OF ENGG.": "SCE-SAHARSA",
  "SHRI PHANISHWAR NATH RENU ENGG. COLLEGE, ARARIA": "SPNREC-ARARIA",
  "SUPAUL ENGG. COLLEGE, SUPAUL": "SCE-SUPAUL",
  "S.G.I.D.T. PATNA": "SGIDT-PATNA",
  "CIPET:IPT, BIHTA, PATNA": "CIPET-PATNA",
  "DR. APJ ABDUL KALAM WOMENS INST. OF TECH.": "WIT-DARBHANGA"
};

// Maps course names to frontend branch codes based on college branches list
function mapBranch(college, courseName) {
  const branches = college.branches;
  const course = courseName.toUpperCase().trim();

  if (course === "CIVIL ENGINEERING" || course === "CIVIL ENGG." || course.includes("CIVIL ENGG WITH")) {
    if (branches.includes("CE")) return "CE";
    if (branches.includes("MC")) return "MC"; // Fallback typo
  }
  if (course === "MECHANICAL ENGINEERING" || course === "MECHANICAL ENGG." || course.includes("MECHANICAL AND SMART")) {
    if (branches.includes("ME")) return "ME";
    if (branches.includes("MECHANICAL &SMART MANUFACTURING")) return "MECHANICAL &SMART MANUFACTURING";
  }
  if (course === "ELECTRICAL ENGINEERING" || course === "ELECTRICAL ENGG.") {
    if (branches.includes("EE")) return "EE";
    if (branches.includes("EEE")) return "EEE";
  }
  if (course === "ELECTRICAL & ELECTRONICS ENGINEERING" || course === "ELECTRICAL & ELECTRONIC ENGINEERING") {
    if (branches.includes("EEE")) return "EEE";
    if (branches.includes("EE")) return "EE";
  }
  if (course === "COMPUTER SC. & ENGINEERING" || course === "COMPUTER SC. & ENGG." || course === "COMPUTER SCIENCE & ENGINEERING" || course === "COMPUTER SC AND ENGG") {
    if (branches.includes("CSE")) return "CSE";
  }
  if (course === "INFORMATION TECHNOLOGY" || course === "I.T." || course === "I.T") {
    if (branches.includes("IT")) return "IT";
  }
  if (course === "ELECTRONICS & COMMUNICATION ENGINEERING" || course === "ELECTRO & COMMUNICATION ENGINEERING" || course === "ELECTRO & COMMUNICATION ENGG") {
    if (branches.includes("ECE")) return "ECE";
  }
  if (course === "FIRE TECHNOLOGY & SAFETY") {
    if (branches.includes("FIRE TECHNOLOGY & SAFETY")) return "FIRE TECHNOLOGY & SAFETY";
  }
  if (course === "MECHATRONICS ENGG" || course === "MECHATRONICS ENGINEERING" || course.includes("MECHATRONICS")) {
    if (branches.includes("MECHATRONICS ENGG.")) return "MECHATRONICS ENGG.";
  }
  if (course === "ROBOTICS AND AUTOMATION" || course === "ROBOTIC AND AUTOMATION" || course.includes("ROBOTIC") || course.includes("ROBOTICS")) {
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
  if (course.includes("3-D") || course.includes("3D") || course.includes("ANIMATION")) {
    if (branches.includes("3D ANIMATION & GRAPHICS")) return "3D ANIMATION & GRAPHICS";
  }
  if (course.includes("BIOINFORMATICS")) {
    if (branches.includes("BI")) return "BI";
  }
  if (course.includes("PLASTIC") || course.includes("POLYMER")) {
    if (branches.includes("PLASTIC")) return "PLASTIC";
  }
  if (course.includes("PETROCHEMICAL")) {
    if (branches.includes("PETROCHEMICAL")) return "PETROCHEMICAL";
  }
  if (course.includes("DAIRY")) {
    if (branches.includes("DT")) return "DT";
  }

  // Handle specializations of CSE like IoT, Cyber Security, AI, Data Science, Networks
  if (course.includes("INTERNET OF THINGS") || course.includes("IOT")) {
    if (branches.includes("CSE-IOT")) return "CSE-IOT";
    if (branches.includes("MC")) return "MC"; // Bakhtiyarpur CSE-IoT maps to MC in collegesData
  }
  if (course.includes("CYBER SECURITY") || course.includes("CYBER")) {
    if (branches.includes("MC")) return "MC"; // Darbhanga CSE-Cyber maps to MC in collegesData
  }
  if (course.includes("ARTIFICIAL INTELLIGENCE") || course.includes("ARTIFICAL") || course.includes("AI")) {
    if (branches.includes("ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING")) return "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING";
    if (branches.includes("MC")) return "MC";
  }
  if (course.includes("DATA SCIENCE")) {
    if (branches.includes("MC")) return "MC";
  }
  if (course.includes("NETWORKS")) {
    if (branches.includes("MC")) return "MC";
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

function parseYearFile(year, rawFileName, outputJsonName) {
  console.log(`\n--- Starting parsing for UGEAC-${year} ---`);
  const colleges = getCollegesData();
  const collegeMap = {};
  colleges.forEach(c => {
    collegeMap[c.code] = c;
  });

  const rawTextPath = path.join(__dirname, rawFileName);
  const content = fs.readFileSync(rawTextPath, "utf-8");
  const lines = content.split("\n");

  const results = [];
  let idCounter = 10001;

  let skippedCount = 0;
  let parsedCount = 0;

  const middleRegex = /^([\s\S]+?)\s+(Female|General)\s+([A-Z0-9-]+)$/i;

  let accumulatedText = "";

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    if (trimmed.startsWith("Page No:-") || trimmed.startsWith("INSTITUTE") || trimmed.startsWith("COMBINED")) return;

    // Split by tab characters since pdf-parse preserved tabs
    const parts = trimmed.split("\t").map(s => s.trim());
    
    // Check if this line has ranks at the end
    const numericParts = parts.filter(s => /^\d+$/.test(s)).map(Number);
    
    if (numericParts.length >= 2) {
      // Form the full row text by combining any accumulated text
      const fullRowText = (accumulatedText + " " + trimmed).trim();
      accumulatedText = "";

      const rowParts = fullRowText.split("\t").map(s => s.trim());
      const rowNumericParts = rowParts.filter(s => /^\d+$/.test(s)).map(Number);
      const rowNonNumericParts = rowParts.filter(s => !/^\d+$/.test(s));

      const openingRank = rowNumericParts[rowNumericParts.length - 2];
      const closingRank = rowNumericParts[rowNumericParts.length - 1];

      // Find which college name key in collegeNameMap is a prefix of the first part
      const firstPart = rowNonNumericParts[0];
      const cleanFirstPart = firstPart
        .replace(/^--\s*\d+\s*of\s*\d+\s*--\s*/i, "")
        .replace(/RANK\s+UR\s+CLOSING\s+RANK\s+CAT\s+OPENING\s+RANK\s+CAT\s+CLOSING\s+RANK/i, "")
        .trim();
      let collegeCode = null;
      let matchedKey = null;

      // Longest prefix match
      const sortedKeys = Object.keys(collegeNameMap).sort((a, b) => b.length - a.length);
      for (const key of sortedKeys) {
        if (cleanFirstPart.startsWith(key)) {
          collegeCode = collegeNameMap[key];
          matchedKey = key;
          break;
        }
      }

      if (!collegeCode) {
        skippedCount++;
        return;
      }

      const college = collegeMap[collegeCode];
      if (!college) {
        skippedCount++;
        return;
      }

      // Rest of the row is the course and category info
      // We strip the matched college name from the clean first part, and join with the rest
      const remainingFirstPart = cleanFirstPart.slice(matchedKey.length).trim();
      const middleTextParts = [remainingFirstPart, ...rowNonNumericParts.slice(1)];
      const middleText = middleTextParts.filter(Boolean).join(" ").trim();

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
        id: `c-${year}-${idCounter++}`,
        collegeCode,
        branchCode,
        year,
        round: 1, // Store for round 1
        category: rawCategory,
        gender,
        openingRank,
        closingRank
      });

      // Also push a duplicate for round 2 so both filter queries in the UI work
      results.push({
        id: `c-${year}-${idCounter++}`,
        collegeCode,
        branchCode,
        year,
        round: 2, // Store for round 2
        category: rawCategory,
        gender,
        openingRank,
        closingRank
      });

      parsedCount++;
    } else {
      // No ranks! This is a fragment.
      accumulatedText = (accumulatedText + " " + trimmed).trim();
    }
  });

  console.log(`Parsed rows: ${parsedCount}`);
  console.log(`Skipped rows (unmapped/metadata): ${skippedCount}`);
  console.log(`Generated cutoff records: ${results.length}`);

  // Write directly to frontend data directory
  const outputPath = path.join(__dirname, `../src/data/${outputJsonName}`);
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`Wrote official JSON results to ${outputPath}`);
}

// Parse both 2024 and 2025
parseYearFile(2024, "raw_ocr_2024.txt", "cutoffs2024.json");
parseYearFile(2025, "raw_ocr.txt", "cutoffs2025.json");
