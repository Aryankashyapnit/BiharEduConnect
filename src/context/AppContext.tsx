"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { College, collegesData } from "../data/colleges";
import { Cutoff, cutoffsData } from "../data/cutoffs";
import { SeatMatrixEntry, seatMatrixData } from "../data/seatMatrix";
import { db } from "../lib/firebase";
import { collection, doc, setDoc, onSnapshot, getDoc, getDocs, updateDoc, deleteDoc, increment } from "firebase/firestore";
import { supabase } from "../lib/supabase"; // SUPABASE IMPORT

export interface SavedPrediction {
  id: string;
  collegeName: string;
  collegeCode: string;
  branchName: string;
  branchCode: string;
  category: string;
  rank: number;
  chance: "High" | "Moderate" | "Low";
  date: string;
}

export interface User {
  name: string;
  percentile?: number;
  email?: string;
  isAdmin: boolean;
  avatarSeed?: string;
  isPremium?: boolean;
}

export interface RegisteredUser {
  name: string;
  email: string;
  percentile: number;
  password?: string;
  isPremium?: boolean;
}

export interface BulkFile {
  name: string;
  type: string;
  size: string;
  date: string;
  status: "Uploaded" | "Pending";
}

export interface TimelineEvent {
  id: number;
  event: string;
  date: string;
  status: "Active" | "Upcoming" | "Done";
}

export interface GuideStep {
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  color: string;
}

export interface VisitorLog {
  id: string;
  name: string;
  email: string;
  percentile?: number;
  visitCount: number;
  lastVisitTime: string;
  lastVisitTimestamp?: number;
  role: "Standard" | "Guest" | "Anonymous";
  totalSessionTime?: number;
  lastActivity?: number;
}

interface AppContextType {
  colleges: College[];
  cutoffs: Cutoff[];
  seatMatrix: SeatMatrixEntry[];
  favorites: string[];
  savedPredictions: SavedPrediction[];
  totalVisits: number;
  darkMode: boolean;
  toggleDarkMode: () => void;
  addFavorite: (collegeId: string) => void;
  removeFavorite: (collegeId: string) => void;
  savePrediction: (prediction: Omit<SavedPrediction, "id" | "date">) => void;
  deletePrediction: (id: string) => void;
  addCollege: (college: College) => void;
  updateCollege: (college: College) => void;
  deleteCollege: (collegeId: string) => void;
  
  bulkFiles: BulkFile[];
  addBulkFile: (file: BulkFile) => void;
  deleteBulkFile: (fileName: string) => void;
  
  timelineEvents: TimelineEvent[];
  addTimelineEvent: (event: Omit<TimelineEvent, "id">) => void;
  updateTimelineEvent: (id: number, updated: Partial<TimelineEvent>) => void;
  deleteTimelineEvent: (id: number) => void;
  
  guideSteps: GuideStep[];
  updateGuideStep: (index: number, updated: Partial<GuideStep>) => void;
  
  injectCutoffs: (newCutoffs: Cutoff[]) => void;
  deleteCutoff: (id: string) => void;
  resetCutoffs: () => void;
  updateSeatMatrixEntry: (entry: SeatMatrixEntry) => void;
  resetSeatMatrix: () => void;
  
  user: User | null;
  showAuthModal: boolean;
  pendingRedirect: string | null;
  setShowAuthModal: (show: boolean) => void;
  setPendingRedirect: (path: string | null) => void;
  loginDemo: (name: string, percentile: number) => { success: boolean; error?: string };
  loginAdmin: (email: string, pass: string) => boolean;
  logout: () => void;
  updateUserAvatar: (seed: string) => void;
  updateUserName: (name: string) => void;
  registeredUsers: RegisteredUser[];
  registerUser: (name: string, email: string, percentile: number, pass: string) => { success: boolean; error?: string };
  updateRegisteredUser: (oldEmail: string, updatedUser: RegisteredUser) => { success: boolean; error?: string };
  deleteRegisteredUser: (email: string) => void;
  togglePremiumAccess: (email: string, hasPremium: boolean) => void;
  loginUser: (emailOrName: string, passOrPercentile: string) => { success: boolean; error?: string };
  blockedEmails: string[];
  blockStudent: (email: string) => void;
  unblockStudent: (email: string) => void;
  visitorLogs: VisitorLog[];
  chatSessions: any[];
  deleteChatSession: (id: string) => Promise<void>;
  clearAllChatSessions: () => Promise<void>;
  whatsappLink: string;
  updateWhatsappLink: (link: string) => void;
}

const defaultBulkFiles: BulkFile[] = [
  { name: "UGEAC_2026_Counselling_Handbook.pdf", type: "Circular Guide", size: "3.4 MB", date: "2026-06-01", status: "Uploaded" },
  { name: "Seat_Matrix_Govt_Engineering_2026.xlsx", type: "Seat Matrix", size: "850 KB", date: "2026-05-28", status: "Uploaded" },
  { name: "Official_Information_Bulletin_2026.pdf", type: "BCECE Circular", size: "6.2 MB", date: "2026-05-20", status: "Uploaded" }
];

const defaultTimelineEvents: TimelineEvent[] = [
  { id: 1, event: "Publication of Rank Card on Board's Website", date: "23.06.2026", status: "Done" },
  { id: 2, event: "Seat Matrix posting on website", date: "23.06.2026", status: "Done" },
  { id: 3, event: "Starting date of Online Choice filling for Seat Allotment", date: "26.06.2026", status: "Upcoming" },
  { id: 4, event: "Last date of Online Choice filling for seat allotment & locking", date: "01.07.2026", status: "Upcoming" },
  { id: 5, event: "Publication of Round-1 Seat Allotment Result", date: "04.07.2026", status: "Upcoming" },
  { id: 6, event: "Downloading of Allotment order (1st Round)", date: "04.07.2026 to 09.07.2026", status: "Upcoming" },
  { id: 7, event: "Documents Verification and Admission (1st Round)", date: "07.07.2026 to 09.07.2026", status: "Upcoming" },
  { id: 8, event: "2nd Round Provisional Seat Allotment Result publication date", date: "17.07.2026", status: "Upcoming" },
  { id: 9, event: "Downloading of Allotment order (2nd Round)", date: "17.07.2026 to 21.07.2026", status: "Upcoming" },
  { id: 10, event: "Documents Verification and Admission (2nd Round)", date: "20.07.2026 to 21.07.2026", status: "Upcoming" }
];

const defaultGuideSteps: GuideStep[] = [
  {
    title: "1. Online Registration",
    subtitle: "UGEAC Portal Setup",
    iconName: "FileText",
    color: "border-[#FF9933] text-[#FF9933]",
    description: "Candidates must visit the official BCECE Board website and click on the 'UGEAC Online Application Portal'. Register using your JEE Main Roll Number, password, mobile number, and email. Pay the non-refundable registration fee (₹1200 for UR/BC/EBC; ₹600 for SC/ST/DQ) online via Net Banking/Credit Card."
  },
  {
    title: "2. Merit List & State Rank",
    subtitle: "State Merit Cards",
    iconName: "Milestone",
    color: "border-[#2563EB] text-[#2563EB]",
    description: "After checking registration details, the BCECE Board releases the official Bihar State Engineering Merit List (UGEAC Rank Cards). This list maps your JEE Main score into a State Merit Rank (UR Rank and Category Rank). This UGEAC State Rank is the ONLY rank used for seat allocation. You must download and print this Rank Card."
  },
  {
    title: "3. Choice Filling",
    subtitle: "Option Entries",
    iconName: "Layers",
    color: "border-[#138808] text-[#138808]",
    description: "Log in using your UGEAC credentials. You will see a list of available government engineering colleges and branch options. Select your preferred options and arrange them in descending order of your priority. You can add as many choices as you wish. There is no extra charge or penalty for adding multiple choices."
  },
  {
    title: "4. Choice Locking",
    subtitle: "Locking & Verification",
    iconName: "Lock",
    color: "border-amber-500 text-amber-500",
    description: "Once satisfied with your choice hierarchy, click 'Lock Choices'. This requires OTP verification sent to your registered mobile and email. Remember: If you do not lock choices manually, your last saved choices will be locked automatically at the deadline. However, manual locking is highly recommended."
  },
  {
    title: "5. Seat Allotment Round 1",
    subtitle: "Allotment Letter",
    iconName: "Building",
    color: "border-purple-500 text-purple-500",
    description: "BCECE publishes the Round 1 Seat Allotment results on their portal. Log in to check your allocation status. If allocated, you must download your 'Seat Allotment Letter'. You will be asked a crucial question: 'Do you want to participate in upgrade for Round 2?' Choose 'Yes' (Upgrade) or 'No' (Freeze)."
  },
  {
    title: "6. Document Verification (DV)",
    subtitle: "Physical Verification",
    iconName: "UserCheck",
    color: "border-emerald-500 text-emerald-500",
    description: "Regardless of whether you Freeze or Upgrade, you MUST physically report to your designated 'Nodal Verification Center' (typically one of the main engineering colleges) with all original documents for verification. If your documents are verified successfully, you will get a slip. Failure to report for DV in Round 1 cancels your entire application!"
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colleges, setColleges] = useState<College[]>(collegesData);
  const [cutoffs, setCutoffs] = useState<Cutoff[]>(cutoffsData);
  const [seatMatrix, setSeatMatrix] = useState<SeatMatrixEntry[]>(seatMatrixData);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [savedPredictions, setSavedPredictions] = useState<SavedPrediction[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [totalVisits, setTotalVisits] = useState<number>(0);

  const [bulkFiles, setBulkFiles] = useState<BulkFile[]>(defaultBulkFiles);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(defaultTimelineEvents);
  const [guideSteps, setGuideSteps] = useState<GuideStep[]>(defaultGuideSteps);
  const [chatSessions, setChatSessions] = useState<any[]>([]);

  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [blockedEmails, setBlockedEmails] = useState<string[]>([]);
  const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>([]);
  const [whatsappLink, setWhatsappLink] = useState<string>("https://wa.me/919999999999");

  // Load client-only configurations from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFavs = localStorage.getItem("bihareduconnect_favs");
      if (storedFavs) setFavorites(JSON.parse(storedFavs));

      const storedPredictions = localStorage.getItem("bihareduconnect_predictions");
      if (storedPredictions) setSavedPredictions(JSON.parse(storedPredictions));

      const storedUser = localStorage.getItem("bihareduconnect_user");
      if (storedUser) setUser(JSON.parse(storedUser));

      const storedBlocked = localStorage.getItem("bihareduconnect_blocked_emails");
      if (storedBlocked) setBlockedEmails(JSON.parse(storedBlocked));

      const storedVersion = localStorage.getItem("bihareduconnect_cutoffs_version");
      if (storedVersion !== "v2025_official_v1") {
        localStorage.removeItem("bihareduconnect_cutoffs");
        localStorage.setItem("bihareduconnect_cutoffs_version", "v2025_official_v1");
        setCutoffs(cutoffsData);
        setTimeout(async () => {
          const mapped = cutoffsData.map(c => ({
            id: c.id,
            college_code: c.collegeCode, branch_code: c.branchCode, year: c.year, round: c.round,
            category: c.category, gender: c.gender, opening_rank: c.openingRank, closing_rank: c.closingRank
          }));
          try {
            await supabase.from('cutoffs').delete().neq('id', 'dummy');
            await supabase.from('cutoffs').insert(mapped);
          } catch (e) {
            console.error("Migration seed error", e);
          }
        }, 1000);
      } else {
        const storedCutoffs = localStorage.getItem("bihareduconnect_cutoffs");
        if (storedCutoffs) {
          try { setCutoffs(JSON.parse(storedCutoffs)); } catch (e) {}
        }
      }

      const storedSeatMatrix = localStorage.getItem("bihareduconnect_seat_matrix");
      if (storedSeatMatrix) {
        try { setSeatMatrix(JSON.parse(storedSeatMatrix)); } catch (e) {}
      }

      const sessionVisited = sessionStorage.getItem("bihareduconnect_session_visited");
      if (!sessionVisited) {
        sessionStorage.setItem("bihareduconnect_session_visited", "true");
      }

      const storedDark = localStorage.getItem("bihareduconnect_dark");
      if (storedDark) {
        setDarkMode(storedDark === "true");
        if (storedDark === "true") document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  // HYBRID DATA FETCHING: SUPABASE (Heavy) + FIREBASE (Auth/Logs)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // --- SUPABASE FETCHING ---
    const fetchSupabaseData = async () => {
      try {
        // 1. Fetch Colleges
        const { data: colData } = await supabase.from('colleges').select('*');
        if (colData && colData.length > 0) {
          const mappedColleges = colData.map((d: any) => ({
            id: d.id, name: d.name, code: d.code, location: d.location, established: d.established,
            nirf: d.nirf, averagePackage: d.average_package, highestPackage: d.highest_package,
            tuitionFee: d.tuition_fee, hostelAvailable: d.hostel_available, hostelFee: d.hostel_fee,
            website: d.website, description: d.description, campusSize: d.campus_size,
            branches: d.branches || [], recruits: d.recruits || [], image: d.image || ""
          }));
          setColleges(mappedColleges as College[]);
        }

        // 2. Fetch Cutoffs (Commented out to prevent overwriting local calibrated v2025 data with old database cutoffs)
        /*
        const { data: cutData } = await supabase.from('cutoffs').select('*');
        if (cutData && cutData.length > 0) {
          const mappedCutoffs = cutData.map((d: any) => ({
            id: d.id.toString(), collegeCode: d.college_code, branchCode: d.branch_code,
            year: d.year, round: d.round, category: d.category, gender: d.gender,
            openingRank: d.opening_rank, closingRank: d.closing_rank
          }));
          setCutoffs(mappedCutoffs as Cutoff[]);
          localStorage.setItem("bihareduconnect_cutoffs", JSON.stringify(mappedCutoffs));
        }
        */

        // 3. Fetch Seat Matrix
        const { data: smData } = await supabase.from('seat_matrix').select('*');
        if (smData && smData.length > 0) {
          const mappedSeats = smData.map((d: any) => ({
            collegeCode: d.college_code, branchCode: d.branch_code, totalSeats: d.total_seats,
            categorySeats: { UR: d.ur_seats, BC: d.bc_seats, EBC: d.ebc_seats, SC: d.sc_seats, ST: d.st_seats, EWS: d.ews_seats, RCG: d.rcg_seats }
          }));
          setSeatMatrix(mappedSeats as SeatMatrixEntry[]);
        }

        // 4. Fetch Timeline Events
        const { data: tlData } = await supabase.from('timeline_events').select('*').order('id', { ascending: true });
        if (tlData && tlData.length > 0) setTimelineEvents(tlData as TimelineEvent[]);

        // 5. Fetch Bulk Files
        const { data: bfData } = await supabase.from('bulk_files').select('*');
        if (bfData && bfData.length > 0) setBulkFiles(bfData as BulkFile[]);

      } catch (error) {
        console.error("Error fetching Supabase heavy datastores:", error);
      }
    };

    fetchSupabaseData();

    // --- FIREBASE SNAPSHOTS ---
    const unsubGuides = onSnapshot(collection(db, "guide_steps"), (snap) => {
      const list: GuideStep[] = new Array(defaultGuideSteps.length);
      snap.forEach((d) => {
        const idx = parseInt(d.id, 10);
        if (!isNaN(idx) && idx >= 0) list[idx] = d.data() as GuideStep;
      });
      const cleanList = list.filter(Boolean);
      if (cleanList.length > 0) setGuideSteps(cleanList);
    });

    const unsubSettings = onSnapshot(doc(db, "settings", "whatsapp"), (snap) => {
      if (snap.exists()) setWhatsappLink(snap.data().link || "https://wa.me/919999999999");
    });

    const unsubChats = onSnapshot(collection(db, "chat_sessions"), (snap) => {
      const list: any[] = [];
      snap.forEach((d) => list.push(d.data()));
      list.sort((a, b) => {
        const dateA = a.date || "";
        const dateB = b.date || "";
        if (dateA !== dateB) return new Date(dateB).getTime() - new Date(dateA).getTime();
        return (b.lastMessageTime || "").localeCompare(a.lastMessageTime || "");
      });
      setChatSessions(list);
    });

    const unsubVisitorLogs = onSnapshot(collection(db, "visitor_logs"), (snap) => {
      const incomingMap = new Map<string, VisitorLog>();
      let globalVisits = 0;
      snap.forEach((doc) => {
        const data = doc.data() as VisitorLog;
        incomingMap.set(data.id, data);
        globalVisits += data.visitCount || 1;
      });
      const logsList = Array.from(incomingMap.values());
      const getLogTime = (log: VisitorLog) => {
        if (log.lastVisitTimestamp) return log.lastVisitTimestamp;
        if (log.lastVisitTime) {
          const parsed = new Date(log.lastVisitTime).getTime();
          if (!isNaN(parsed)) return parsed;
        }
        return log.lastActivity || 0;
      };
      logsList.sort((a, b) => getLogTime(b) - getLogTime(a));
      setVisitorLogs(logsList);
      setTotalVisits(124 + globalVisits);
    });

    const unsubUsers = onSnapshot(collection(db, "registered_users"), (snap) => {
      const users: RegisteredUser[] = [];
      snap.forEach((doc) => users.push(doc.data() as RegisteredUser));
      setRegisteredUsers(users);
    });

    return () => {
      unsubGuides();
      unsubSettings();
      unsubChats();
      unsubVisitorLogs();
      unsubUsers();
    };
  }, []);

  const recordVisit = async (currentUser: User | null) => {
    try {
      const timeStr = new Date().toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true
      });
      let visitorData: any = {};
      let docId = "";

      if (currentUser) {
        if (currentUser.isAdmin) return;
        const emailClean = currentUser.email ? currentUser.email.toLowerCase().trim() : `${currentUser.name.toLowerCase().replace(/\s+/g, "")}.demo@bihareduconnect.in`;
        docId = emailClean.replace(/[^a-zA-Z0-9]/g, "_");
        visitorData = {
          id: docId, name: currentUser.name, email: emailClean, percentile: currentUser.percentile || 0,
          lastVisitTime: timeStr, lastVisitTimestamp: Date.now(), lastActivity: Date.now(),
          role: currentUser.email && !currentUser.email.includes(".demo@") ? "Standard" : "Guest"
        };
      } else {
        let anonId = typeof window !== "undefined" ? (localStorage.getItem("bihareduconnect_anon_id") || "") : "SERVER";
        if (!anonId && typeof window !== "undefined") {
          anonId = Math.random().toString(36).substring(2, 8).toUpperCase();
          localStorage.setItem("bihareduconnect_anon_id", anonId);
        }
        docId = `anonymous_guest_${anonId}`;
        visitorData = {
          id: docId, name: `Anonymous Guest #${anonId}`, email: `anonymous.${anonId}@bihareduconnect.in`,
          lastVisitTime: timeStr, lastVisitTimestamp: Date.now(), lastActivity: Date.now(), role: "Anonymous"
        };
      }

      const docRef = doc(db, "visitor_logs", docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, { ...visitorData, visitCount: docSnap.data().visitCount + 1 });
      } else {
        await setDoc(docRef, { ...visitorData, visitCount: 1 });
      }
    } catch (e) {
      console.error("Firebase logging error: ", e);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sessionVisitedLog = sessionStorage.getItem("bihareduconnect_session_visited_log");
      if (!sessionVisitedLog) {
        sessionStorage.setItem("bihareduconnect_session_visited_log", "true");
        recordVisit(user);
      }
    }
  }, [user]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const interval = setInterval(async () => {
      if (document.visibilityState === 'visible') {
        try {
          let docId = "";
          if (user && !user.isAdmin) {
            const emailClean = user.email ? user.email.toLowerCase().trim() : `${user.name.toLowerCase().replace(/\s+/g, "")}.demo@bihareduconnect.in`;
            docId = emailClean.replace(/[^a-zA-Z0-9]/g, "_");
          } else if (!user) {
            const anonId = localStorage.getItem("bihareduconnect_anon_id");
            if (anonId) docId = `anonymous_guest_${anonId}`;
          }
          if (docId) {
            const docRef = doc(db, "visitor_logs", docId);
            await setDoc(docRef, { totalSessionTime: increment(10), lastActivity: Date.now() }, { merge: true });
          }
        } catch (e) {}
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const saveToLocalStorage = (key: string, data: any) => {
    if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(data));
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newVal = !prev;
      saveToLocalStorage("bihareduconnect_dark", newVal ? "true" : "false");
      if (newVal) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      return newVal;
    });
  };

  const addFavorite = (collegeId: string) => {
    setFavorites((prev) => {
      if (prev.includes(collegeId)) return prev;
      const updated = [...prev, collegeId];
      saveToLocalStorage("bihareduconnect_favs", updated);
      return updated;
    });
  };

  const removeFavorite = (collegeId: string) => {
    setFavorites((prev) => {
      const updated = prev.filter((id) => id !== collegeId);
      saveToLocalStorage("bihareduconnect_favs", updated);
      return updated;
    });
  };

  const savePrediction = (prediction: Omit<SavedPrediction, "id" | "date">) => {
    setSavedPredictions((prev) => {
      const newPrediction: SavedPrediction = {
        ...prediction, id: `pred-${Date.now()}`,
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
      };
      const updated = [newPrediction, ...prev];
      saveToLocalStorage("bihareduconnect_predictions", updated);
      return updated;
    });
  };

  const deletePrediction = (id: string) => {
    setSavedPredictions((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      saveToLocalStorage("bihareduconnect_predictions", updated);
      return updated;
    });
  };

  // ==========================================
  // ADMIN OPERATIONS (Mapped to Supabase)
  // ==========================================
  const addCollege = async (college: College) => {
    try {
      const mapped = {
        id: college.id, name: college.name, code: college.code, location: college.location,
        established: college.established, nirf: college.nirf, average_package: college.averagePackage,
        highest_package: college.highestPackage, tuition_fee: college.tuitionFee,
        hostel_available: college.hostelAvailable, hostel_fee: college.hostelFee,
        website: college.website, description: college.description, campus_size: college.campusSize,
        branches: college.branches, recruits: college.recruits, image: college.image
      };
      await supabase.from('colleges').insert([mapped]);
      setColleges(prev => [...prev, college]);
    } catch (e) { console.error("Error adding college:", e); }
  };

  const updateCollege = async (college: College) => {
    try {
      const mapped = {
        name: college.name, code: college.code, location: college.location, established: college.established,
        nirf: college.nirf, average_package: college.averagePackage, highest_package: college.highestPackage,
        tuition_fee: college.tuitionFee, hostel_available: college.hostelAvailable, hostel_fee: college.hostelFee,
        website: college.website, description: college.description, campus_size: college.campusSize,
        branches: college.branches, recruits: college.recruits, image: college.image
      };
      await supabase.from('colleges').update(mapped).eq('id', college.id);
      setColleges(prev => prev.map(c => c.id === college.id ? college : c));
    } catch (e) { console.error("Error updating college:", e); }
  };

  const deleteCollege = async (collegeId: string) => {
    try {
      await supabase.from('colleges').delete().eq('id', collegeId);
      setColleges(prev => prev.filter(c => c.id !== collegeId));
    } catch (e) { console.error("Error deleting college:", e); }
  };

  const addBulkFile = async (file: BulkFile) => {
    try {
      await supabase.from('bulk_files').insert([file]);
      setBulkFiles(prev => [...prev, file]);
    } catch (e) { console.error("Error adding bulk file:", e); }
  };

  const deleteBulkFile = async (fileName: string) => {
    try {
      await supabase.from('bulk_files').delete().eq('name', fileName);
      setBulkFiles(prev => prev.filter(f => f.name !== fileName));
    } catch (e) { console.error("Error deleting bulk file:", e); }
  };

  const addTimelineEvent = async (event: Omit<TimelineEvent, "id">) => {
    try {
      const nextId = timelineEvents.length > 0 ? Math.max(...timelineEvents.map((e) => e.id)) + 1 : 1;
      const newEvent = { ...event, id: nextId };
      await supabase.from('timeline_events').insert([newEvent]);
      setTimelineEvents(prev => [...prev, newEvent].sort((a,b) => a.id - b.id));
    } catch (e) { console.error("Error adding timeline event:", e); }
  };

  const updateTimelineEvent = async (id: number, updatedFields: Partial<TimelineEvent>) => {
    try {
      await supabase.from('timeline_events').update(updatedFields).eq('id', id);
      setTimelineEvents(prev => prev.map(ev => ev.id === id ? { ...ev, ...updatedFields } : ev));
    } catch (e) { console.error("Error updating timeline event:", e); }
  };

  const deleteTimelineEvent = async (id: number) => {
    try {
      await supabase.from('timeline_events').delete().eq('id', id);
      setTimelineEvents(prev => prev.filter(ev => ev.id !== id));
    } catch (e) { console.error("Error deleting timeline event:", e); }
  };

  const updateGuideStep = async (index: number, updatedFields: Partial<GuideStep>) => {
    try {
      const ref = doc(db, "guide_steps", index.toString());
      await setDoc(ref, { ...guideSteps[index], ...updatedFields });
    } catch (e) { console.error("Error updating guide step:", e); }
  };

  const injectCutoffs = async (newCutoffs: Cutoff[]) => {
    const cutoffsWithIds = newCutoffs.map(c => ({
      ...c, id: c.id || `cutoff-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));

    setCutoffs(prev => {
      const merged = [...prev, ...cutoffsWithIds];
      localStorage.setItem("bihareduconnect_cutoffs", JSON.stringify(merged));
      return merged;
    });

    const mappedForSupabase = cutoffsWithIds.map(c => ({
      college_code: c.collegeCode, branch_code: c.branchCode, year: c.year, round: c.round,
      category: c.category, gender: c.gender, opening_rank: c.openingRank, closing_rank: c.closingRank
    }));

    try { await supabase.from('cutoffs').insert(mappedForSupabase); } catch (e) {}
  };

  const deleteCutoff = async (id: string) => {
    setCutoffs(prev => {
      const updated = prev.filter(c => c.id !== id);
      localStorage.setItem("bihareduconnect_cutoffs", JSON.stringify(updated));
      return updated;
    });
    try { await supabase.from('cutoffs').delete().eq('id', id); } catch (e) {}
  };

  const resetCutoffs = async () => {
    setCutoffs(cutoffsData);
    localStorage.setItem("bihareduconnect_cutoffs", JSON.stringify(cutoffsData));
    const mapped = cutoffsData.map(c => ({
      id: c.id,
      college_code: c.collegeCode, branch_code: c.branchCode, year: c.year, round: c.round,
      category: c.category, gender: c.gender, opening_rank: c.openingRank, closing_rank: c.closingRank
    }));
    try {
      await supabase.from('cutoffs').delete().neq('id', 'dummy');
      await supabase.from('cutoffs').insert(mapped);
    } catch (e) {}
  };

  const updateSeatMatrixEntry = async (entry: SeatMatrixEntry) => {
    setSeatMatrix(prev => {
      const merged = [...prev];
      const index = merged.findIndex(s => s.collegeCode === entry.collegeCode && s.branchCode === entry.branchCode);
      if (index !== -1) merged[index] = entry;
      else merged.push(entry);
      localStorage.setItem("bihareduconnect_seat_matrix", JSON.stringify(merged));
      return merged;
    });

    const mapped = {
      college_code: entry.collegeCode, branch_code: entry.branchCode, total_seats: entry.totalSeats,
      ur_seats: entry.categorySeats.UR, bc_seats: entry.categorySeats.BC, ebc_seats: entry.categorySeats.EBC,
      sc_seats: entry.categorySeats.SC, st_seats: entry.categorySeats.ST, ews_seats: entry.categorySeats.EWS,
      rcg_seats: entry.categorySeats.RCG
    };
    try { await supabase.from('seat_matrix').upsert([mapped], { onConflict: 'college_code, branch_code' }); } catch (e) {}
  };

  const resetSeatMatrix = async () => {
    setSeatMatrix(seatMatrixData);
    localStorage.setItem("bihareduconnect_seat_matrix", JSON.stringify(seatMatrixData));
    const mapped = seatMatrixData.map(entry => ({
      college_code: entry.collegeCode, branch_code: entry.branchCode, total_seats: entry.totalSeats,
      ur_seats: entry.categorySeats.UR, bc_seats: entry.categorySeats.BC, ebc_seats: entry.categorySeats.EBC,
      sc_seats: entry.categorySeats.SC, st_seats: entry.categorySeats.ST, ews_seats: entry.categorySeats.EWS,
      rcg_seats: entry.categorySeats.RCG
    }));
    try {
      await supabase.from('seat_matrix').delete().neq('id', 'dummy'); 
      await supabase.from('seat_matrix').insert(mapped);
    } catch (e) {}
  };

  // Firebase Auth & User Functions
  const syncUserToFirebase = async (userData: RegisteredUser) => {
    try {
      const docId = userData.email.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, "_");
      await setDoc(doc(db, "registered_users", docId), userData);
    } catch (e) {}
  };

  const deleteUserFromFirebase = async (email: string) => {
    try {
      const docId = email.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, "_");
      await deleteDoc(doc(db, "registered_users", docId));
    } catch (e) {}
  };

  const loginDemo = (name: string, percentile: number): { success: boolean; error?: string } => {
    const nameClean = name.trim();
    const dummyEmail = `${nameClean.toLowerCase().replace(/\s+/g, "")}.demo@bihareduconnect.in`;
    if (blockedEmails.includes(dummyEmail)) return { success: false, error: "Your guest session has been suspended." };
    
    if (!registeredUsers.some(u => u.email.toLowerCase() === dummyEmail)) {
      const newDemoReg = { name: nameClean, email: dummyEmail, percentile, password: "demo" };
      const updatedUsers = [...registeredUsers, newDemoReg];
      setRegisteredUsers(updatedUsers);
      saveToLocalStorage("bihareduconnect_registered_users", updatedUsers);
      syncUserToFirebase(newDemoReg);
    }
    
    const demoUser = { name: nameClean, percentile, email: dummyEmail, isAdmin: false };
    setUser(demoUser);
    saveToLocalStorage("bihareduconnect_user", demoUser);
    recordVisit(demoUser);
    return { success: true };
  };

  const loginAdmin = (email: string, pass: string): boolean => {
    if (email === "admin@bihareduconnect.in" && pass === "admin123") {
      const adminUser = { name: "Admin Profile", email, isAdmin: true };
      setUser(adminUser);
      saveToLocalStorage("bihareduconnect_user", adminUser);
      return true;
    }
    return false;
  };

  const updateUserAvatar = (seed: string) => {
    if (user) {
      const updatedUser = { ...user, avatarSeed: seed };
      setUser(updatedUser);
      saveToLocalStorage("bihareduconnect_user", updatedUser);
    }
  };

  const updateUserName = (newName: string) => {
    if (user) {
      const updatedUser = { ...user, name: newName };
      setUser(updatedUser);
      saveToLocalStorage("bihareduconnect_user", updatedUser);
      if (user.email) {
        const updatedRegList = registeredUsers.map(u => u.email.toLowerCase() === user.email?.toLowerCase() ? { ...u, name: newName } : u);
        setRegisteredUsers(updatedRegList);
        saveToLocalStorage("bihareduconnect_registered_users", updatedRegList);
      }
    }
  };

  const registerUser = (name: string, email: string, percentile: number, pass: string): { success: boolean; error?: string } => {
    const emailLower = email.toLowerCase().trim();
    if (emailLower === "admin@bihareduconnect.in") return { success: false, error: "Reserved email." };
    if (registeredUsers.some(u => u.email.toLowerCase() === emailLower)) return { success: false, error: "Email exists." };
    
    const newUser = { name: name.trim(), email: emailLower, percentile, password: pass.trim() };
    setRegisteredUsers([...registeredUsers, newUser]);
    saveToLocalStorage("bihareduconnect_registered_users", [...registeredUsers, newUser]);
    syncUserToFirebase(newUser);
    
    const userSession = { name: newUser.name, email: newUser.email, percentile: newUser.percentile, isAdmin: false };
    setUser(userSession);
    saveToLocalStorage("bihareduconnect_user", userSession);
    return { success: true };
  };

  const updateRegisteredUser = (oldEmail: string, updatedUser: RegisteredUser) => {
    const oldEmailClean = oldEmail.toLowerCase().trim();
    const newEmailClean = updatedUser.email.toLowerCase().trim();
    if (newEmailClean === "admin@bihareduconnect.in") return { success: false, error: "Reserved email." };
    
    if (oldEmailClean !== newEmailClean && registeredUsers.some(u => u.email.toLowerCase() === newEmailClean)) {
      return { success: false, error: "Email already in use." };
    }
    
    const updatedList = registeredUsers.map(u => u.email.toLowerCase() === oldEmailClean ? { ...updatedUser, email: newEmailClean } : u);
    setRegisteredUsers(updatedList);
    saveToLocalStorage("bihareduconnect_registered_users", updatedList);
    
    if (oldEmailClean !== newEmailClean) deleteUserFromFirebase(oldEmailClean);
    syncUserToFirebase(updatedList.find(u => u.email.toLowerCase() === newEmailClean)!);
    
    if (user && user.email?.toLowerCase() === oldEmailClean) {
      const updatedSession = { name: updatedUser.name, email: newEmailClean, percentile: updatedUser.percentile, isAdmin: false };
      setUser(updatedSession);
      saveToLocalStorage("bihareduconnect_user", updatedSession);
    }
    return { success: true };
  };

  const deleteRegisteredUser = (email: string) => {
    const emailClean = email.toLowerCase().trim();
    const updatedList = registeredUsers.filter(u => u.email.toLowerCase() !== emailClean);
    setRegisteredUsers(updatedList);
    saveToLocalStorage("bihareduconnect_registered_users", updatedList);
    deleteUserFromFirebase(emailClean);
    if (user && user.email?.toLowerCase() === emailClean) {
      setUser(null);
      localStorage.removeItem("bihareduconnect_user");
    }
  };

  const togglePremiumAccess = (email: string, hasPremium: boolean) => {
    const emailClean = email.toLowerCase().trim();
    const targetUser = registeredUsers.find(u => u.email.toLowerCase() === emailClean);
    if (!targetUser) return;
    const updatedUser = { ...targetUser, isPremium: hasPremium };
    const updatedList = registeredUsers.map(u => u.email.toLowerCase() === emailClean ? updatedUser : u);
    setRegisteredUsers(updatedList);
    saveToLocalStorage("bihareduconnect_registered_users", updatedList);
    syncUserToFirebase(updatedUser);
    if (user && user.email?.toLowerCase() === emailClean) {
      setUser({ ...user, isPremium: hasPremium });
      saveToLocalStorage("bihareduconnect_user", { ...user, isPremium: hasPremium });
    }
  };

  const loginUser = (emailOrName: string, passOrPercentile: string) => {
    const inputClean = emailOrName.trim();
    const passClean = passOrPercentile.trim();
    if (inputClean === "admin@bihareduconnect.in" && passClean === "admin123") {
      const adminUser = { name: "Admin Profile", email: inputClean, isAdmin: true };
      setUser(adminUser);
      saveToLocalStorage("bihareduconnect_user", adminUser);
      return { success: true };
    }
    const matchedUser = registeredUsers.find(u => u.email.toLowerCase() === inputClean.toLowerCase() && u.password === passClean);
    if (matchedUser) {
      if (blockedEmails.includes(matchedUser.email.toLowerCase())) return { success: false, error: "Suspended." };
      syncUserToFirebase(matchedUser);
      const userSession = { name: matchedUser.name, email: matchedUser.email, percentile: matchedUser.percentile, isPremium: matchedUser.isPremium, isAdmin: false };
      setUser(userSession);
      saveToLocalStorage("bihareduconnect_user", userSession);
      recordVisit(userSession);
      return { success: true };
    }
    const percentileVal = Number(passClean);
    if (inputClean && !isNaN(percentileVal) && percentileVal >= 0 && percentileVal <= 100) {
      return loginDemo(inputClean, percentileVal);
    }
    return { success: false, error: "Invalid credentials." };
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("bihareduconnect_user");
      sessionStorage.setItem("bihareduconnect_logged_out", "true");
      window.location.href = "/";
    }
  };

  const blockStudent = (email: string) => {
    const emailClean = email.toLowerCase().trim();
    setBlockedEmails(prev => {
      if (prev.includes(emailClean)) return prev;
      saveToLocalStorage("bihareduconnect_blocked_emails", [...prev, emailClean]);
      return [...prev, emailClean];
    });
  };

  const unblockStudent = (email: string) => {
    const emailClean = email.toLowerCase().trim();
    setBlockedEmails(prev => {
      const updated = prev.filter(e => e !== emailClean);
      saveToLocalStorage("bihareduconnect_blocked_emails", updated);
      return updated;
    });
  };

  const updateWhatsappLink = async (link: string) => {
    try { await setDoc(doc(db, "settings", "whatsapp"), { link }); } catch (e) {}
  };

  const deleteChatSession = async (id: string) => {
    try { await deleteDoc(doc(db, "chat_sessions", id)); } catch (e) {}
  };

  const clearAllChatSessions = async () => {
    try {
      const snap = await getDocs(collection(db, "chat_sessions"));
      for (const d of snap.docs) await deleteDoc(d.ref);
    } catch (e) {}
  };

  return (
    <AppContext.Provider
      value={{
        colleges, cutoffs, seatMatrix, favorites, savedPredictions, totalVisits,
        darkMode, toggleDarkMode, addFavorite, removeFavorite, savePrediction, deletePrediction,
        addCollege, updateCollege, deleteCollege,
        bulkFiles, addBulkFile, deleteBulkFile,
        timelineEvents, addTimelineEvent, updateTimelineEvent, deleteTimelineEvent,
        guideSteps, updateGuideStep,
        injectCutoffs, deleteCutoff, resetCutoffs, updateSeatMatrixEntry, resetSeatMatrix,
        user, showAuthModal, pendingRedirect, setShowAuthModal, setPendingRedirect,
        loginDemo, loginAdmin, logout, updateUserAvatar, updateUserName,
        registeredUsers, registerUser, updateRegisteredUser, deleteRegisteredUser,
        togglePremiumAccess, loginUser, blockedEmails, blockStudent, unblockStudent,
        visitorLogs, whatsappLink, updateWhatsappLink, chatSessions, deleteChatSession, clearAllChatSessions
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};