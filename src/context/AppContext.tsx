"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { College, collegesData } from "../data/colleges";
import { Cutoff, cutoffsData } from "../data/cutoffs";
import { SeatMatrixEntry, seatMatrixData } from "../data/seatMatrix";
import { db } from "../lib/firebase";
import { collection, doc, setDoc, onSnapshot, getDoc, getDocs, updateDoc, deleteDoc, increment } from "firebase/firestore";

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
  
  // Dynamic Sync Additions
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
  
  // Authentication
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
  { id: 1, event: "Online Registration Starting Date", date: "13.05.2026", status: "Active" },
  { id: 2, event: "Online Registration Closing Date", date: "05.06.2026 (10.00 p.m.)", status: "Upcoming" },
  { id: 3, event: "Last date of payment through Debit Card/ Credit Card/ Net Banking/ UPI with Final submission of the online Application Form by Registered candidate", date: "05.06.2026 (11.59 p.m.)", status: "Upcoming" },
  { id: 4, event: "Online Editing of Application Form", date: "06.06.2026", status: "Upcoming" },
  { id: 5, event: "Publication of Merit list of UGEAC-2026", date: "08.06.2026", status: "Upcoming" },
  { id: 6, event: "Proposed date of Online Counselling", date: "Proposed date of Online Counselling", status: "Upcoming" }
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
    description: "Once satisfied with your choice hierarchy, click 'Lock Choices'. This requires OTP verification sent to your registered mobile and email. Remember: **If you do not lock choices manually, your last saved choices will be locked automatically at the deadline.** However, manual locking is highly recommended."
  },
  {
    title: "5. Seat Allotment Round 1",
    subtitle: "Allotment Letter",
    iconName: "Building",
    color: "border-purple-500 text-purple-500",
    description: "BCECE publishes the Round 1 Seat Allotment results on their portal. Log in to check your allocation status. If allocated, you must download your 'Seat Allotment Letter'. You will be asked a crucial question: **'Do you want to participate in upgrade for Round 2?'** Choose 'Yes' (Upgrade) or 'No' (Freeze)."
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

  // Dynamic States
  const [bulkFiles, setBulkFiles] = useState<BulkFile[]>(defaultBulkFiles);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(defaultTimelineEvents);
  const [guideSteps, setGuideSteps] = useState<GuideStep[]>(defaultGuideSteps);
  const [chatSessions, setChatSessions] = useState<any[]>([]);

  // Authentication States
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

      const sessionVisited = sessionStorage.getItem("bihareduconnect_session_visited");
      if (!sessionVisited) {
        sessionStorage.setItem("bihareduconnect_session_visited", "true");
      }

      const storedDark = localStorage.getItem("bihareduconnect_dark");
      if (storedDark) {
        setDarkMode(storedDark === "true");
        if (storedDark === "true") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    }
  }, []);

  // Seeding Helpers
  const seedCollectionIfEmpty = async <T,>(
    collectionName: string,
    defaultData: T[],
    getId: (item: T, idx: number) => string
  ) => {
    try {
      const colRef = collection(db, collectionName);
      const snap = await getDocs(colRef);
      if (snap.empty) {
        console.log(`Seeding Firestore collection: ${collectionName}`);
        let idx = 0;
        for (const item of defaultData) {
          const id = getId(item, idx);
          await setDoc(doc(db, collectionName, id), item as any);
          idx++;
        }
      }
    } catch (e) {
      console.error(`Error seeding ${collectionName}:`, e);
    }
  };

  const seedSettingsIfEmpty = async () => {
    try {
      const docRef = doc(db, "settings", "whatsapp");
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        await setDoc(docRef, { link: "https://wa.me/919999999999" });
      }
    } catch (e) {
      console.error("Error seeding settings:", e);
    }
  };

  // Setup Real-time Firestore Sync Listeners
  useEffect(() => {
    if (typeof window === "undefined") return;

    const performSeedingAndSetup = async () => {
      await seedCollectionIfEmpty("colleges", collegesData, (c) => c.id);
      await seedCollectionIfEmpty("cutoffs", cutoffsData, (c) => c.id || `cutoff-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
      await seedCollectionIfEmpty("seat_matrix", seatMatrixData, (s) => `${s.collegeCode}_${s.branchCode.replace(/[^a-zA-Z0-9]/g, "_")}`);
      await seedCollectionIfEmpty("bulk_files", defaultBulkFiles, (b) => b.name.replace(/[^a-zA-Z0-9]/g, "_"));
      await seedCollectionIfEmpty("timeline_events", defaultTimelineEvents, (t) => t.id.toString());
      
      try {
        const colRef = collection(db, "guide_steps");
        const snap = await getDocs(colRef);
        if (snap.empty) {
          for (let i = 0; i < defaultGuideSteps.length; i++) {
            await setDoc(doc(db, "guide_steps", i.toString()), defaultGuideSteps[i]);
          }
        }
      } catch (e) {
        console.error("Error seeding guide steps:", e);
      }

      await seedSettingsIfEmpty();
    };

    performSeedingAndSetup();

    // Setup Snapshot listeners
    const unsubColleges = onSnapshot(collection(db, "colleges"), (snap) => {
      const list: College[] = [];
      snap.forEach((d) => list.push(d.data() as College));
      if (list.length > 0) setColleges(list);
    });

    const unsubCutoffs = onSnapshot(collection(db, "cutoffs"), (snap) => {
      const list: Cutoff[] = [];
      snap.forEach((d) => list.push(d.data() as Cutoff));
      if (list.length > 0) setCutoffs(list);
    });

    const unsubSeatMatrix = onSnapshot(collection(db, "seat_matrix"), (snap) => {
      const list: SeatMatrixEntry[] = [];
      snap.forEach((d) => list.push(d.data() as SeatMatrixEntry));
      if (list.length > 0) setSeatMatrix(list);
    });

    const unsubBulkFiles = onSnapshot(collection(db, "bulk_files"), (snap) => {
      const list: BulkFile[] = [];
      snap.forEach((d) => list.push(d.data() as BulkFile));
      if (list.length > 0) setBulkFiles(list);
    });

    const unsubTimeline = onSnapshot(collection(db, "timeline_events"), (snap) => {
      const list: TimelineEvent[] = [];
      snap.forEach((d) => list.push(d.data() as TimelineEvent));
      if (list.length > 0) {
        list.sort((a, b) => a.id - b.id);
        setTimelineEvents(list);
      }
    });

    const unsubGuides = onSnapshot(collection(db, "guide_steps"), (snap) => {
      const list: GuideStep[] = new Array(defaultGuideSteps.length);
      snap.forEach((d) => {
        const idx = parseInt(d.id, 10);
        if (!isNaN(idx) && idx >= 0) {
          list[idx] = d.data() as GuideStep;
        }
      });
      const cleanList = list.filter(Boolean);
      if (cleanList.length > 0) setGuideSteps(cleanList);
    });

    const unsubSettings = onSnapshot(doc(db, "settings", "whatsapp"), (snap) => {
      if (snap.exists()) {
        setWhatsappLink(snap.data().link || "https://wa.me/919999999999");
      }
    });

    const unsubChats = onSnapshot(collection(db, "chat_sessions"), (snap) => {
      const list: any[] = [];
      snap.forEach((d) => list.push(d.data()));
      list.sort((a, b) => {
        const dateA = a.date || "";
        const dateB = b.date || "";
        if (dateA !== dateB) {
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        }
        return (b.lastMessageTime || "").localeCompare(a.lastMessageTime || "");
      });
      setChatSessions(list);
    });

    return () => {
      unsubColleges();
      unsubCutoffs();
      unsubSeatMatrix();
      unsubBulkFiles();
      unsubTimeline();
      unsubGuides();
      unsubSettings();
      unsubChats();
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
          id: docId,
          name: currentUser.name,
          email: emailClean,
          percentile: currentUser.percentile || 0,
          lastVisitTime: timeStr,
          lastActivity: Date.now(),
          role: currentUser.email && !currentUser.email.includes(".demo@") ? "Standard" : "Guest"
        };
      } else {
        // Unique anonymous tracking
        let anonId = "";
        if (typeof window !== "undefined") {
          anonId = localStorage.getItem("bihareduconnect_anon_id") || "";
          if (!anonId) {
            anonId = Math.random().toString(36).substring(2, 8).toUpperCase();
            localStorage.setItem("bihareduconnect_anon_id", anonId);
          }
        } else {
          anonId = "SERVER";
        }
        
        docId = `anonymous_guest_${anonId}`;
        visitorData = {
          id: docId,
          name: `Anonymous Guest #${anonId}`,
          email: `anonymous.${anonId}@bihareduconnect.in`,
          lastVisitTime: timeStr,
          lastActivity: Date.now(),
          role: "Anonymous"
        };
      }

      const docRef = doc(db, "visitor_logs", docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          ...visitorData,
          visitCount: docSnap.data().visitCount + 1
        });
      } else {
        await setDoc(docRef, {
          ...visitorData,
          visitCount: 1
        });
      }
    } catch (e) {
      console.error("Firebase logging error: ", e);
    }
  };

  // Stable order ref: stores the sorted ID order so rows don't jump on every update
  const logsOrderRef = React.useRef<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sessionVisitedLog = sessionStorage.getItem("bihareduconnect_session_visited_log");
      if (!sessionVisitedLog) {
        sessionStorage.setItem("bihareduconnect_session_visited_log", "true");
        recordVisit(user);
      }
      
      // Reset order ref when user changes (fresh login)
      logsOrderRef.current = [];

      // Setup Firebase real-time listener for visitor logs
      const unsubscribe = onSnapshot(collection(db, "visitor_logs"), (snapshot) => {
        const incomingMap = new Map<string, VisitorLog>();
        let globalVisits = 0;
        
        snapshot.forEach((doc) => {
          const data = doc.data() as VisitorLog;
          incomingMap.set(data.id, data);
          globalVisits += data.visitCount || 1;
        });

        // Find IDs that are genuinely new (not seen before)
        const existingIds = new Set(logsOrderRef.current);
        const newIds = [...incomingMap.keys()].filter(id => !existingIds.has(id));

        if (newIds.length > 0) {
          // Sort only the NEW entries by lastActivity descending
          const newEntries = newIds.map(id => incomingMap.get(id)!);
          newEntries.sort((a, b) => {
            const timeA = a.lastActivity || new Date(a.lastVisitTime).getTime() || 0;
            const timeB = b.lastActivity || new Date(b.lastVisitTime).getTime() || 0;
            return timeB - timeA;
          });
          // Prepend new entries to the stable order (newest first)
          logsOrderRef.current = [...newEntries.map(e => e.id), ...logsOrderRef.current];
        }

        // Build the final logs array using stable order, updating data in-place
        const stableIds = logsOrderRef.current.filter(id => incomingMap.has(id));
        const stableLogs = stableIds.map(id => incomingMap.get(id)!);

        setVisitorLogs(stableLogs);
        
        // Update totalVisits globally based on live Firebase data
        // We add a baseline of 124 (the original hardcoded mock data baseline)
        setTotalVisits(124 + globalVisits);
      }, (error) => {
        console.error("Firebase snapshot error: ", error);
        // Fallback to local storage if firebase fails
        const stored = localStorage.getItem("bihareduconnect_visitor_logs");
        if (stored) setVisitorLogs(JSON.parse(stored));
      });
      // Setup Firebase real-time listener for registered users
      const unsubscribeUsers = onSnapshot(collection(db, "registered_users"), (snapshot) => {
        const users: RegisteredUser[] = [];
        snapshot.forEach((doc) => {
          users.push(doc.data() as RegisteredUser);
        });
        setRegisteredUsers(users);
      }, (error) => {
        console.error("Firebase users snapshot error: ", error);
        const stored = localStorage.getItem("bihareduconnect_registered_users");
        if (stored) setRegisteredUsers(JSON.parse(stored));
      });
      
      return () => {
        unsubscribe();
        unsubscribeUsers();
      };
    }
  }, [user]);

  // Session Time Tracker
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
            if (anonId) {
              docId = `anonymous_guest_${anonId}`;
            }
          }
          
          if (docId) {
            const docRef = doc(db, "visitor_logs", docId);
            await setDoc(docRef, {
              totalSessionTime: increment(10),
              lastActivity: Date.now()
            }, { merge: true });
          }
        } catch (e) {
          // Ignore if document not found or error
        }
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [user]);

  // Sync state helpers
  const saveToLocalStorage = (key: string, data: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  const syncUserToFirebase = async (userData: RegisteredUser) => {
    try {
      const docId = userData.email.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, "_");
      await setDoc(doc(db, "registered_users", docId), userData);
    } catch (e) {
      console.error("Failed to sync user to Firebase:", e);
    }
  };

  const deleteUserFromFirebase = async (email: string) => {
    try {
      const docId = email.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, "_");
      await deleteDoc(doc(db, "registered_users", docId));
    } catch (e) {
      console.error("Failed to delete user from Firebase:", e);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newVal = !prev;
      saveToLocalStorage("bihareduconnect_dark", newVal ? "true" : "false");
      if (newVal) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
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
        ...prediction,
        id: `pred-${Date.now()}`,
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })
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

  // ADMIN OPERATIONS
  const addCollege = async (college: College) => {
    try {
      await setDoc(doc(db, "colleges", college.id), college);
    } catch (e) {
      console.error("Error adding college:", e);
    }
  };

  const updateCollege = async (college: College) => {
    try {
      await setDoc(doc(db, "colleges", college.id), college);
    } catch (e) {
      console.error("Error updating college:", e);
    }
  };

  const deleteCollege = async (collegeId: string) => {
    try {
      await deleteDoc(doc(db, "colleges", collegeId));
    } catch (e) {
      console.error("Error deleting college:", e);
    }
  };

  // Dynamic Datastore Handlers
  const addBulkFile = async (file: BulkFile) => {
    try {
      const docId = file.name.replace(/[^a-zA-Z0-9]/g, "_");
      await setDoc(doc(db, "bulk_files", docId), file);
    } catch (e) {
      console.error("Error adding bulk file:", e);
    }
  };

  const deleteBulkFile = async (fileName: string) => {
    try {
      const docId = fileName.replace(/[^a-zA-Z0-9]/g, "_");
      await deleteDoc(doc(db, "bulk_files", docId));
    } catch (e) {
      console.error("Error deleting bulk file:", e);
    }
  };

  const addTimelineEvent = async (event: Omit<TimelineEvent, "id">) => {
    try {
      const nextId = timelineEvents.length > 0 ? Math.max(...timelineEvents.map((e) => e.id)) + 1 : 1;
      const newEvent: TimelineEvent = { ...event, id: nextId };
      await setDoc(doc(db, "timeline_events", nextId.toString()), newEvent);
    } catch (e) {
      console.error("Error adding timeline event:", e);
    }
  };

  const updateTimelineEvent = async (id: number, updatedFields: Partial<TimelineEvent>) => {
    try {
      const ref = doc(db, "timeline_events", id.toString());
      await updateDoc(ref, updatedFields);
    } catch (e) {
      console.error("Error updating timeline event:", e);
    }
  };

  const deleteTimelineEvent = async (id: number) => {
    try {
      await deleteDoc(doc(db, "timeline_events", id.toString()));
    } catch (e) {
      console.error("Error deleting timeline event:", e);
    }
  };

  const updateGuideStep = async (index: number, updatedFields: Partial<GuideStep>) => {
    try {
      const ref = doc(db, "guide_steps", index.toString());
      await setDoc(ref, { ...guideSteps[index], ...updatedFields });
    } catch (e) {
      console.error("Error updating guide step:", e);
    }
  };

  const injectCutoffs = async (newCutoffs: Cutoff[]) => {
    try {
      for (const cutoff of newCutoffs) {
        let id = cutoff.id;
        if (!id) {
          id = `cutoff-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        await setDoc(doc(db, "cutoffs", id), { ...cutoff, id });
      }
    } catch (e) {
      console.error("Error injecting cutoffs:", e);
    }
  };

  const deleteCutoff = async (id: string) => {
    try {
      await deleteDoc(doc(db, "cutoffs", id));
    } catch (e) {
      console.error("Error deleting cutoff:", e);
    }
  };

  const resetCutoffs = async () => {
    try {
      const colRef = collection(db, "cutoffs");
      const snap = await getDocs(colRef);
      for (const d of snap.docs) {
        await deleteDoc(d.ref);
      }
      for (const c of cutoffsData) {
        await setDoc(doc(db, "cutoffs", c.id), c);
      }
    } catch (e) {
      console.error("Error resetting cutoffs:", e);
    }
  };

  const updateSeatMatrixEntry = async (entry: SeatMatrixEntry) => {
    try {
      const id = `${entry.collegeCode}_${entry.branchCode.replace(/[^a-zA-Z0-9]/g, "_")}`;
      await setDoc(doc(db, "seat_matrix", id), entry);
    } catch (e) {
      console.error("Error updating seat matrix entry:", e);
    }
  };

  const resetSeatMatrix = async () => {
    try {
      const colRef = collection(db, "seat_matrix");
      const snap = await getDocs(colRef);
      for (const d of snap.docs) {
        await deleteDoc(d.ref);
      }
      for (const entry of seatMatrixData) {
        const id = `${entry.collegeCode}_${entry.branchCode.replace(/[^a-zA-Z0-9]/g, "_")}`;
        await setDoc(doc(db, "seat_matrix", id), entry);
      }
    } catch (e) {
      console.error("Error resetting seat matrix:", e);
    }
  };
 
  // Authentication Helpers
  const loginDemo = (name: string, percentile: number): { success: boolean; error?: string } => {
    const nameClean = name.trim();
    const dummyEmail = `${nameClean.toLowerCase().replace(/\s+/g, "")}.demo@bihareduconnect.in`;
    
    // Check if blocked
    if (blockedEmails.includes(dummyEmail)) {
      return { success: false, error: "Your guest session has been suspended by the administrator." };
    }
    
    // Register dynamically if not exists
    const exists = registeredUsers.some(u => u.email.toLowerCase().trim() === dummyEmail);
    if (!exists) {
      const newDemoReg: RegisteredUser = {
        name: nameClean,
        email: dummyEmail,
        percentile,
        password: "demo"
      };
      const updatedUsers = [...registeredUsers, newDemoReg];
      setRegisteredUsers(updatedUsers);
      saveToLocalStorage("bihareduconnect_registered_users", updatedUsers);
      syncUserToFirebase(newDemoReg);
    } else {
      const existingUser = registeredUsers.find(u => u.email.toLowerCase().trim() === dummyEmail);
      if (existingUser) syncUserToFirebase(existingUser);
    }
    
    const demoUser: User = {
      name: nameClean,
      percentile,
      email: dummyEmail,
      isAdmin: false
    };
    setUser(demoUser);
    saveToLocalStorage("bihareduconnect_user", demoUser);
    recordVisit(demoUser);
    return { success: true };
  };

  const loginAdmin = (email: string, pass: string): boolean => {
    if (email === "admin@bihareduconnect.in" && pass === "admin123") {
      const adminUser: User = {
        name: "Admin Profile",
        email,
        isAdmin: true
      };
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
      
      // Update the name in registered users if they exist
      if (user.email) {
        const updatedRegList = registeredUsers.map(u => 
          u.email.toLowerCase() === user.email?.toLowerCase() ? { ...u, name: newName } : u
        );
        setRegisteredUsers(updatedRegList);
        saveToLocalStorage("bihareduconnect_registered_users", updatedRegList);
      }
    }
  };

  const registerUser = (name: string, email: string, percentile: number, pass: string): { success: boolean; error?: string } => {
    const emailLower = email.toLowerCase().trim();
    if (emailLower === "admin@bihareduconnect.in") {
      return { success: false, error: "This email address is reserved." };
    }
    
    const exists = registeredUsers.some(u => u.email.toLowerCase().trim() === emailLower);
    if (exists) {
      return { success: false, error: "An account with this email already exists." };
    }
    
    const newUser: RegisteredUser = {
      name: name.trim(),
      email: emailLower,
      percentile,
      password: pass.trim()
    };
    
    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    saveToLocalStorage("bihareduconnect_registered_users", updatedUsers);
    syncUserToFirebase(newUser);
    
    const userSession: User = {
      name: newUser.name,
      email: newUser.email,
      percentile: newUser.percentile,
      isAdmin: false
    };
    setUser(userSession);
    saveToLocalStorage("bihareduconnect_user", userSession);
    
    return { success: true };
  };

  const updateRegisteredUser = (oldEmail: string, updatedUser: RegisteredUser): { success: boolean; error?: string } => {
    const oldEmailClean = oldEmail.toLowerCase().trim();
    const newEmailClean = updatedUser.email.toLowerCase().trim();
    
    if (newEmailClean === "admin@bihareduconnect.in") {
      return { success: false, error: "This email address is reserved." };
    }
    
    if (oldEmailClean !== newEmailClean) {
      const exists = registeredUsers.some(u => u.email.toLowerCase().trim() === newEmailClean);
      if (exists) {
        return { success: false, error: "An account with the new email already exists." };
      }
    }
    
    const updatedList = registeredUsers.map(u => u.email.toLowerCase().trim() === oldEmailClean ? {
      ...updatedUser,
      email: newEmailClean,
      name: updatedUser.name.trim(),
      password: updatedUser.password ? updatedUser.password.trim() : ""
    } : u);
    
    setRegisteredUsers(updatedList);
    saveToLocalStorage("bihareduconnect_registered_users", updatedList);
    
    if (oldEmailClean !== newEmailClean) {
      deleteUserFromFirebase(oldEmailClean);
    }
    const newlyUpdatedUser = updatedList.find(u => u.email.toLowerCase().trim() === newEmailClean);
    if (newlyUpdatedUser) {
      syncUserToFirebase(newlyUpdatedUser);
    }
    
    if (user && user.email?.toLowerCase().trim() === oldEmailClean) {
      const updatedSession: User = {
        name: updatedUser.name,
        email: newEmailClean,
        percentile: updatedUser.percentile,
        isAdmin: false
      };
      setUser(updatedSession);
      saveToLocalStorage("bihareduconnect_user", updatedSession);
    }
    
    return { success: true };
  };

  const deleteRegisteredUser = (email: string) => {
    const emailClean = email.toLowerCase().trim();
    const updatedList = registeredUsers.filter(u => u.email.toLowerCase().trim() !== emailClean);
    setRegisteredUsers(updatedList);
    saveToLocalStorage("bihareduconnect_registered_users", updatedList);
    deleteUserFromFirebase(emailClean);
    
    if (user && user.email?.toLowerCase().trim() === emailClean) {
      setUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("bihareduconnect_user");
      }
    }
  };

  const togglePremiumAccess = (email: string, hasPremium: boolean) => {
    const emailClean = email.toLowerCase().trim();
    const targetUser = registeredUsers.find(u => u.email.toLowerCase().trim() === emailClean);
    if (!targetUser) return;
    
    const updatedUser = { ...targetUser, isPremium: hasPremium };
    const updatedList = registeredUsers.map(u => u.email.toLowerCase().trim() === emailClean ? updatedUser : u);
    
    setRegisteredUsers(updatedList);
    saveToLocalStorage("bihareduconnect_registered_users", updatedList);
    syncUserToFirebase(updatedUser);
    
    // Update active session if it's the current user
    if (user && user.email?.toLowerCase().trim() === emailClean) {
      const updatedSession = { ...user, isPremium: hasPremium };
      setUser(updatedSession);
      saveToLocalStorage("bihareduconnect_user", updatedSession);
    }
  };

  const loginUser = (emailOrName: string, passOrPercentile: string): { success: boolean; error?: string } => {
    const inputClean = emailOrName.trim();
    const passClean = passOrPercentile.trim();
    
    // 1. Secret Admin check
    if (inputClean === "admin@bihareduconnect.in" && passClean === "admin123") {
      const adminUser: User = {
        name: "Admin Profile",
        email: inputClean,
        isAdmin: true
      };
      setUser(adminUser);
      saveToLocalStorage("bihareduconnect_user", adminUser);
      return { success: true };
    }
    
    // 2. Check registered users
    const matchedUser = registeredUsers.find(
      u => u.email.toLowerCase().trim() === inputClean.toLowerCase() && u.password === passClean
    );
    
    if (matchedUser) {
      if (blockedEmails.includes(matchedUser.email.toLowerCase().trim())) {
        return { success: false, error: "Your account has been suspended by the administrator." };
      }
      
      syncUserToFirebase(matchedUser);
      
      const userSession: User = {
        name: matchedUser.name,
        email: matchedUser.email,
        percentile: matchedUser.percentile,
        isPremium: matchedUser.isPremium,
        isAdmin: false
      };
      setUser(userSession);
      saveToLocalStorage("bihareduconnect_user", userSession);
      recordVisit(userSession);
      return { success: true };
    }
    
    // 3. Fallback to instant Demo/Guest login if a numeric percentile is entered as the password
    const percentileVal = Number(passClean);
    if (inputClean && !isNaN(percentileVal) && percentileVal >= 0 && percentileVal <= 100) {
      const dummyEmail = `${inputClean.toLowerCase().replace(/\s+/g, "")}.demo@bihareduconnect.in`;
      
      if (blockedEmails.includes(dummyEmail)) {
        return { success: false, error: "Your account has been suspended by the administrator." };
      }
      
      // Check if already in registeredUsers
      const exists = registeredUsers.some(u => u.email.toLowerCase().trim() === dummyEmail);
      if (!exists) {
        const newDemoReg: RegisteredUser = {
          name: inputClean,
          email: dummyEmail,
          percentile: percentileVal,
          password: "demo"
        };
        const updatedUsers = [...registeredUsers, newDemoReg];
        setRegisteredUsers(updatedUsers);
        saveToLocalStorage("bihareduconnect_registered_users", updatedUsers);
        syncUserToFirebase(newDemoReg);
      } else {
        const existingUser = registeredUsers.find(u => u.email.toLowerCase().trim() === dummyEmail);
        if (existingUser) syncUserToFirebase(existingUser);
      }
      
      const demoUser: User = {
        name: inputClean,
        percentile: percentileVal,
        email: dummyEmail,
        isAdmin: false
      };
      setUser(demoUser);
      saveToLocalStorage("bihareduconnect_user", demoUser);
      recordVisit(demoUser);
      return { success: true };
    }
    
    return { 
      success: false, 
      error: "Invalid credentials. Please enter a valid registered email and password, or use Name and JEE Percentile for guest sign in." 
    };
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
    setBlockedEmails((prev) => {
      if (prev.includes(emailClean)) return prev;
      const updated = [...prev, emailClean];
      saveToLocalStorage("bihareduconnect_blocked_emails", updated);
      return updated;
    });
  };

  const unblockStudent = (email: string) => {
    const emailClean = email.toLowerCase().trim();
    setBlockedEmails((prev) => {
      const updated = prev.filter(e => e !== emailClean);
      saveToLocalStorage("bihareduconnect_blocked_emails", updated);
      return updated;
    });
  };

  const updateWhatsappLink = async (link: string) => {
    try {
      await setDoc(doc(db, "settings", "whatsapp"), { link });
    } catch (e) {
      console.error("Error updating whatsapp link:", e);
    }
  };

  const deleteChatSession = async (id: string) => {
    try {
      await deleteDoc(doc(db, "chat_sessions", id));
    } catch (e) {
      console.error("Error deleting chat session:", e);
    }
  };

  const clearAllChatSessions = async () => {
    try {
      const snap = await getDocs(collection(db, "chat_sessions"));
      for (const d of snap.docs) {
        await deleteDoc(d.ref);
      }
    } catch (e) {
      console.error("Error clearing chat sessions:", e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        colleges,
        cutoffs,
        seatMatrix,
        favorites,
        savedPredictions,
        totalVisits,
        darkMode,
        toggleDarkMode,
        addFavorite,
        removeFavorite,
        savePrediction,
        deletePrediction,
        addCollege,
        updateCollege,
        deleteCollege,
        
        // Dynamic Sync Additions
        bulkFiles,
        addBulkFile,
        deleteBulkFile,
        timelineEvents,
        addTimelineEvent,
        updateTimelineEvent,
        deleteTimelineEvent,
        guideSteps,
        updateGuideStep,
        injectCutoffs,
        deleteCutoff,
        resetCutoffs,
        updateSeatMatrixEntry,
        resetSeatMatrix,
        
        // Auth values
        user,
        showAuthModal,
        pendingRedirect,
        setShowAuthModal,
        setPendingRedirect,
        loginDemo,
        loginAdmin,
        logout,
        updateUserAvatar,
        updateUserName,
        registeredUsers,
        registerUser,
        updateRegisteredUser,
        deleteRegisteredUser,
        togglePremiumAccess,
        loginUser,
        blockedEmails,
        blockStudent,
        unblockStudent,
        visitorLogs,
        whatsappLink,
        updateWhatsappLink,
        chatSessions,
        deleteChatSession,
        clearAllChatSessions
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
