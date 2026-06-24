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

const categoryRatios = {
  UR: 1.0,
  BC: 2.72,
  EBC: 3.54,
  EWS: 4.59,
  SC: 12.94,
  ST: 45.0,
  RCG: 7.89
};

const categoryBenefitMultipliers = {
  UR: 1.0,
  BC: 1.35,
  EBC: 1.55,
  EWS: 1.45,
  SC: 2.4,
  ST: 2.1,
  RCG: 1.7
};

// Generate cutoff data based on cutoffs.ts logic
function generateAllCutoffs(colleges) {
  const generated = [];
  let idCounter = 1;

  const baseRanks = {
    "MIT-MUZAFFARPUR": 134,
    "BCE-BHAGALPUR": 159,
    "BCE-BAKHTIYARPUR": 434,
    "GCE-GAYA": 712,
    "DCE-DARBHANGA": 791,
    "NCE-CHANDI": 759,
    "LNJPIT-CHAPRA": 1635,
    "RRSDCE-BEGUSARAI": 1800,
    "MCE-MOTIHARI": 1222,
    "SCE-SASARAM": 3176,
    "SIT-SITAMARHI": 2254,
    "BPMCE-MADHEPURA": 2049,
    "KCE-KATIHAR": 3181,
    "PCE-PURNEA": 2514,
    "SCE-SAHARSA": 3562,
    "SCE-SUPAUL": 3781,
    "GEC-VAISHALI": 2121,
    "GEC-SAMASTIPUR": 4054,
    "GEC-BHOJPUR": 4551,
    "GEC-JAMUI": 6245,
    "GEC-AURANGABAD": 5882,
    "GEC-SIWAN": 4856,
    "SPNREC-ARARIA": 6696,
    "GEC-BANKA": 4252,
    "GEC-GOPALGANJ": 7291,
    "GEC-BUXAR": 5709,
    "GEC-MADHUBANI": 4940,
    "GEC-NAWADA": 4323,
    "GEC-WESTCHAMPARAN": 3342,
    "GEC-KISHANGANJ": 5688,
    "GEC-JEHANABAD": 7093,
    "GEC-MUNGER": 7327,
    "GEC-LAKHISARAI": 7097,
    "GEC-SHEIKHPURA": 6051,
    "GEC-SHEOHAR": 7250,
    "GEC-KHAGARIA": 7152,
    "GEC-KAIMUR": 6872,
    "GEC-ARWAL": 5422
  };

  const categories = ["UR", "BC", "EBC", "SC", "ST", "EWS", "RCG"];
  const years = [2023, 2024, 2025];
  const rounds = [1, 2];

  colleges.forEach((college) => {
    const baseRank = baseRanks[college.code] || 2000;
    
    college.branches.forEach((branch) => {
      let branchMult = 4.0;
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
        case "IT": branchMult = 2.0; break;
        case "CE(COMPUTER APPLICATION)": branchMult = 4.2; break;
        case "CE (COMPUTER APPLICATION )": branchMult = 4.2; break;
        case "CE(COMPUTER APPLICATION )": branchMult = 4.2; break;
        case "3D ANIMATION & GRAPHICS": branchMult = 4.5; break;
        case "ECE": branchMult = 3.5; break;
        case "ECE(ACT)": branchMult = 3.8; break;
        case "ELECTRONICS AND INSTRUMENTATION ENGG.": branchMult = 4.0; break;
        case "EE(VLSI)": branchMult = 4.2; break;
        case "EE": branchMult = 4.5; break;
        case "EEE": branchMult = 5.0; break;
        case "ROBOTIC AND AUTOMATION": branchMult = 4.5; break;
        case "BIOMEDICAL & ROBOTIC ENGG.": branchMult = 5.0; break;
        case "MECHATRONICS ENGG.": branchMult = 5.2; break;
        case "FIRE TECHNOLOGY & SAFETY": branchMult = 10.0; break;
        case "AERONAUTICAL ENGG.": branchMult = 5.0; break;
        case "ME": branchMult = 8.0; break;
        case "MECHANICAL &SMART MANUFACTURING": branchMult = 8.0; break;
        case "MINING ENGG.": branchMult = 6.0; break;
        case "CE": branchMult = 5.8; break;
        case "CHEMICAL ENGG.": branchMult = 15.0; break;
        case "CHEMICAL ENGINEERING": branchMult = 15.0; break;
        case "FOOD TECHNOLOGY AND MANAGEMENT": branchMult = 7.0; break;
        case "FPP": branchMult = 8.0; break;
        case "Leather Technology": branchMult = 25.0; break;
        case "LEATHER TECHNOLOGY": branchMult = 25.0; break;
        default: branchMult = 4.0; break;
      }

      years.forEach((year) => {
        let yearMult = 1.0;
        if (year === 2024) yearMult = 0.94;
        else if (year === 2023) yearMult = 0.88;

        rounds.forEach((round) => {
          const roundMult = round === 2 ? 1.12 : 1.0;

          categories.forEach((category) => {
            const ratio = categoryRatios[category] || 1.0;
            const benefit = categoryBenefitMultipliers[category] || 1.0;
            const closingRank = Math.round((baseRank * branchMult * yearMult * roundMult * benefit) / ratio);
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
