const fs = require("fs");
const path = require("path");
const { initializeApp } = require("firebase/app");
const { getFirestore, writeBatch, doc, collection, getDocs } = require("firebase/firestore");

// Firebase configuration from src/lib/firebase.ts
const firebaseConfig = {
  apiKey: "AIzaSyDJoxUDi_ityt7t2mpHJ9veO9WPST_l7WY",
  authDomain: "bihareduconnect.firebaseapp.com",
  projectId: "bihareduconnect",
  storageBucket: "bihareduconnect.firebasestorage.app",
  messagingSenderId: "690018701298",
  appId: "1:690018701298:web:a4c0f9db9f3d9472e3256b",
  measurementId: "G-7WR3XJY13W"
};

// Initialize Firebase client
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Read and parse collegesData from src/data/colleges.ts
function getCollegesData() {
  const collegesPath = path.join(__dirname, "../src/data/colleges.ts");
  const content = fs.readFileSync(collegesPath, "utf-8");
  const startMarker = "export const collegesData: College[] =";
  const endMarker = "export const branchNames";
  
  const startIndex = content.indexOf(startMarker);
  if (startIndex === -1) throw new Error("Could not find collegesData start marker");
  
  const endIndex = content.indexOf(endMarker, startIndex);
  if (endIndex === -1) throw new Error("Could not find branchNames end marker");
  
  const arrayString = content.substring(startIndex + startMarker.length, endIndex).trim();
  // Strip trailing semicolon if exists
  const jsonString = arrayString.endsWith(";") ? arrayString.slice(0, -1).trim() : arrayString;
  
  return JSON.parse(jsonString);
}

// Generate cutoff data based on cutoffs.ts logic
function generateAllCutoffs(colleges) {
  const generated = [];
  let idCounter = 1;

  const baseRanks = {
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
  const years = [2023, 2024, 2025];
  const rounds = [1, 2];

  colleges.forEach((college) => {
    const baseRank = baseRanks[college.code] || 2000;
    
    college.branches.forEach((branch) => {
      let branchMult = 2.0;
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
        case "IT": branchMult = 1.25; break;
        case "CE(COMPUTER APPLICATION)": branchMult = 1.3; break;
        case "CE (COMPUTER APPLICATION )": branchMult = 1.3; break;
        case "CE(COMPUTER APPLICATION )": branchMult = 1.3; break;
        case "3D ANIMATION & GRAPHICS": branchMult = 1.4; break;
        case "ECE": branchMult = 1.45; break;
        case "ECE(ACT)": branchMult = 1.5; break;
        case "ELECTRONICS AND INSTRUMENTATION ENGG.": branchMult = 1.6; break;
        case "EE(VLSI)": branchMult = 1.75; break;
        case "EE": branchMult = 1.85; break;
        case "EEE": branchMult = 1.95; break;
        case "ROBOTIC AND AUTOMATION": branchMult = 2.0; break;
        case "BIOMEDICAL & ROBOTIC ENGG.": branchMult = 2.05; break;
        case "MECHATRONICS ENGG.": branchMult = 2.1; break;
        case "FIRE TECHNOLOGY & SAFETY": branchMult = 2.15; break;
        case "AERONAUTICAL ENGG.": branchMult = 2.2; break;
        case "ME": branchMult = 2.3; break;
        case "MECHANICAL &SMART MANUFACTURING": branchMult = 2.3; break;
        case "MINING ENGG.": branchMult = 2.4; break;
        case "CE": branchMult = 2.5; break;
        case "CHEMICAL ENGG.": branchMult = 2.8; break;
        case "CHEMICAL ENGINEERING": branchMult = 2.8; break;
        case "FOOD TECHNOLOGY AND MANAGEMENT": branchMult = 2.9; break;
        case "FPP": branchMult = 3.0; break;
        case "Leather Technology": branchMult = 3.2; break;
        case "LEATHER TECHNOLOGY": branchMult = 3.2; break;
        default: branchMult = 2.0; break;
      }

      years.forEach((year) => {
        let yearMult = 1.0;
        if (year === 2024) yearMult = 0.94;
        else if (year === 2023) yearMult = 0.88;

        rounds.forEach((round) => {
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
}

async function main() {
  console.log("Reading colleges data...");
  const colleges = getCollegesData();
  console.log(`Successfully parsed ${colleges.length} colleges.`);

  console.log("Generating cutoff records...");
  const cutoffs = generateAllCutoffs(colleges);
  console.log(`Generated ${cutoffs.length} cutoff records.`);

  console.log("Connecting to Firestore & fetching existing cutoffs...");
  const colRef = collection(db, "cutoffs");
  const snap = await getDocs(colRef);
  console.log(`Currently there are ${snap.size} cutoffs in Firestore.`);

  // 1. Delete existing documents to prevent any duplicates or mismatched IDs
  console.log("Deleting existing cutoff documents in batches of 500...");
  let deleteBatch = writeBatch(db);
  let deleteCount = 0;
  for (const docSnap of snap.docs) {
    deleteBatch.delete(docSnap.ref);
    deleteCount++;
    if (deleteCount % 500 === 0) {
      console.log(`Committing delete batch (${deleteCount} documents)...`);
      await deleteBatch.commit();
      deleteBatch = writeBatch(db);
    }
  }
  if (deleteCount % 500 !== 0) {
    await deleteBatch.commit();
  }
  console.log(`Deleted ${deleteCount} old records.`);

  // 2. Upload the new full cutoff dataset in batches of 500
  const batchSize = 500;
  let batch = writeBatch(db);
  let count = 0;
  let batchCount = 1;

  console.log("Starting bulk upload of all cutoffs to Firestore...");
  
  for (const item of cutoffs) {
    const docRef = doc(db, "cutoffs", item.id);
    batch.set(docRef, item);
    count++;

    if (count % batchSize === 0 || count === cutoffs.length) {
      console.log(`Committing batch #${batchCount} (${count} documents)...`);
      await batch.commit();
      batch = writeBatch(db);
      batchCount++;
    }
  }

  console.log(`Successfully finished! Seeded/Synced all ${count} cutoff records into Firestore.`);
  process.exit(0);
}

main().catch(err => {
  console.error("Critical error seeding cutoffs:", err);
  process.exit(1);
});
