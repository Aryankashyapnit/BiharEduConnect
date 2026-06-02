"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { College, collegesData } from "../data/colleges";
import { Cutoff, cutoffsData } from "../data/cutoffs";
import { SeatMatrixEntry, seatMatrixData } from "../data/seatMatrix";

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
}

export interface RegisteredUser {
  name: string;
  email: string;
  percentile: number;
  password?: string;
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
  registeredUsers: RegisteredUser[];
  registerUser: (name: string, email: string, percentile: number, pass: string) => { success: boolean; error?: string };
  updateRegisteredUser: (oldEmail: string, updatedUser: RegisteredUser) => { success: boolean; error?: string };
  deleteRegisteredUser: (email: string) => void;
  loginUser: (emailOrName: string, passOrPercentile: string) => { success: boolean; error?: string };
  blockedEmails: string[];
  blockStudent: (email: string) => void;
  unblockStudent: (email: string) => void;
  visitorLogs: VisitorLog[];
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

  // Authentication States
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [blockedEmails, setBlockedEmails] = useState<string[]>([]);
  const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFavs = localStorage.getItem("bihareduconnect_favs");
      if (storedFavs) setFavorites(JSON.parse(storedFavs));

      const storedPredictions = localStorage.getItem("bihareduconnect_predictions");
      if (storedPredictions) setSavedPredictions(JSON.parse(storedPredictions));

      const storedColleges = localStorage.getItem("bihareduconnect_colleges");
      if (storedColleges) {
        const parsed = JSON.parse(storedColleges);
        if (parsed.length < collegesData.length) {
          setColleges(collegesData);
          localStorage.setItem("bihareduconnect_colleges", JSON.stringify(collegesData));
        } else {
          setColleges(parsed);
        }
      } else {
        setColleges(collegesData);
      }

      // Cutoffs Dynamic Loading & Migration
      const storedCutoffs = localStorage.getItem("bihareduconnect_cutoffs");
      let activeCutoffs = cutoffsData;
      if (storedCutoffs) {
        try {
          const parsed = JSON.parse(storedCutoffs);
          if (parsed.length < 7000) {
            activeCutoffs = cutoffsData;
            localStorage.setItem("bihareduconnect_cutoffs", JSON.stringify(cutoffsData));
          } else {
            activeCutoffs = parsed;
          }
        } catch (e) {
          activeCutoffs = cutoffsData;
          localStorage.setItem("bihareduconnect_cutoffs", JSON.stringify(cutoffsData));
        }
      } else {
        localStorage.setItem("bihareduconnect_cutoffs", JSON.stringify(cutoffsData));
      }
      setCutoffs(activeCutoffs);

      // Seat Matrix Dynamic Loading & Migration
      const storedSeatMatrix = localStorage.getItem("bihareduconnect_seat_matrix");
      let activeSeatMatrix = seatMatrixData;
      if (storedSeatMatrix) {
        try {
          const parsed = JSON.parse(storedSeatMatrix);
          if (parsed.length < 50) {
            activeSeatMatrix = seatMatrixData;
            localStorage.setItem("bihareduconnect_seat_matrix", JSON.stringify(seatMatrixData));
          } else {
            activeSeatMatrix = parsed;
          }
        } catch (e) {
          activeSeatMatrix = seatMatrixData;
          localStorage.setItem("bihareduconnect_seat_matrix", JSON.stringify(seatMatrixData));
        }
      } else {
        localStorage.setItem("bihareduconnect_seat_matrix", JSON.stringify(seatMatrixData));
      }
      setSeatMatrix(activeSeatMatrix);

      // Bulk Files Dynamic Loading
      const storedBulkFiles = localStorage.getItem("bihareduconnect_bulk_files");
      if (storedBulkFiles) {
        setBulkFiles(JSON.parse(storedBulkFiles));
      } else {
        setBulkFiles(defaultBulkFiles);
        localStorage.setItem("bihareduconnect_bulk_files", JSON.stringify(defaultBulkFiles));
      }

      // Timeline Events Dynamic Loading & Auto-Migration to Official Screenshot Dates
      const storedTimelineEvents = localStorage.getItem("bihareduconnect_timeline_events");
      let activeTimeline = defaultTimelineEvents;
      if (storedTimelineEvents) {
        try {
          const parsed = JSON.parse(storedTimelineEvents);
          // If cached data is the old 4-item list or contains the old mock dates, overwrite with new official ones!
          if (parsed.length <= 4 || parsed.some((e: any) => e.date.includes("June 05") || e.date.includes("June 18"))) {
            activeTimeline = defaultTimelineEvents;
            localStorage.setItem("bihareduconnect_timeline_events", JSON.stringify(defaultTimelineEvents));
          } else {
            activeTimeline = parsed;
          }
        } catch (e) {
          activeTimeline = defaultTimelineEvents;
          localStorage.setItem("bihareduconnect_timeline_events", JSON.stringify(defaultTimelineEvents));
        }
      } else {
        localStorage.setItem("bihareduconnect_timeline_events", JSON.stringify(defaultTimelineEvents));
      }
      setTimelineEvents(activeTimeline);

      // Guide Steps Dynamic Loading
      const storedGuideSteps = localStorage.getItem("bihareduconnect_guide_steps");
      if (storedGuideSteps) {
        setGuideSteps(JSON.parse(storedGuideSteps));
      } else {
        setGuideSteps(defaultGuideSteps);
        localStorage.setItem("bihareduconnect_guide_steps", JSON.stringify(defaultGuideSteps));
      }

      const storedUser = localStorage.getItem("bihareduconnect_user");
      if (storedUser) setUser(JSON.parse(storedUser));

      const storedUsers = localStorage.getItem("bihareduconnect_registered_users");
      if (storedUsers) {
        setRegisteredUsers(JSON.parse(storedUsers));
      } else {
        const defaultUsers: RegisteredUser[] = [
          { name: "Aman Raj", email: "amanraj.demo@bihareduconnect.in", percentile: 88.5, password: "demo" },
          { name: "Priya Sharma", email: "priyasharma.demo@bihareduconnect.in", percentile: 94.2, password: "demo" },
          { name: "Rohan Kumar", email: "rohan.kumar@gmail.com", percentile: 91.5, password: "student123" }
        ];
        setRegisteredUsers(defaultUsers);
        localStorage.setItem("bihareduconnect_registered_users", JSON.stringify(defaultUsers));
      }

      const storedBlocked = localStorage.getItem("bihareduconnect_blocked_emails");
      if (storedBlocked) setBlockedEmails(JSON.parse(storedBlocked));

      const storedVisits = localStorage.getItem("bihareduconnect_total_visits");
      const initialVisits = storedVisits ? parseInt(storedVisits, 10) : 124;
      setTotalVisits(initialVisits);
      
      const sessionVisited = sessionStorage.getItem("bihareduconnect_session_visited");
      if (!sessionVisited) {
        const incremented = initialVisits + 1;
        setTotalVisits(incremented);
        localStorage.setItem("bihareduconnect_total_visits", incremented.toString());
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

  const recordVisit = (currentUser: User | null) => {
    if (typeof window === "undefined") return;
    
    const stored = localStorage.getItem("bihareduconnect_visitor_logs");
    let logs: VisitorLog[] = [];
    if (stored) {
      try {
        logs = JSON.parse(stored);
      } catch (e) {
        logs = [];
      }
    }
    
    if (logs.length === 0) {
      logs = [
        { id: "vis-1", name: "Rohan Kumar", email: "rohan.kumar@gmail.com", percentile: 91.5, visitCount: 5, lastVisitTime: "01 Jun 2026, 07:15 PM", role: "Standard" },
        { id: "vis-2", name: "Aman Raj", email: "amanraj.demo@bihareduconnect.in", percentile: 88.5, visitCount: 12, lastVisitTime: "01 Jun 2026, 07:32 PM", role: "Guest" },
        { id: "vis-3", name: "Priya Sharma", email: "priyasharma.demo@bihareduconnect.in", percentile: 94.2, visitCount: 8, lastVisitTime: "01 Jun 2026, 07:44 PM", role: "Guest" },
        { id: "vis-4", name: "Anonymous Guest #301", email: "anonymous.guest301@bihareduconnect.in", visitCount: 3, lastVisitTime: "01 Jun 2026, 04:12 PM", role: "Anonymous" }
      ];
      localStorage.setItem("bihareduconnect_visitor_logs", JSON.stringify(logs));
    }
    
    const timeStr = new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
    
    if (currentUser) {
      if (currentUser.isAdmin) {
        setVisitorLogs(logs);
        return;
      }
      
      const emailClean = currentUser.email ? currentUser.email.toLowerCase().trim() : `${currentUser.name.toLowerCase().replace(/\s+/g, "")}.demo@bihareduconnect.in`;
      const existingIdx = logs.findIndex(l => l.email.toLowerCase().trim() === emailClean);
      
      if (existingIdx !== -1) {
        logs[existingIdx].visitCount += 1;
        logs[existingIdx].lastVisitTime = timeStr;
        logs[existingIdx].name = currentUser.name;
        logs[existingIdx].percentile = currentUser.percentile;
        logs[existingIdx].role = currentUser.email ? "Standard" : "Guest";
      } else {
        logs.unshift({
          id: `vis-${Date.now()}`,
          name: currentUser.name,
          email: emailClean,
          percentile: currentUser.percentile,
          visitCount: 1,
          lastVisitTime: timeStr,
          role: currentUser.email ? "Standard" : "Guest"
        });
      }
    } else {
      const anonEmail = "anonymous.guest301@bihareduconnect.in";
      const existingIdx = logs.findIndex(l => l.email === anonEmail);
      if (existingIdx !== -1) {
        logs[existingIdx].visitCount += 1;
        logs[existingIdx].lastVisitTime = timeStr;
      } else {
        logs.unshift({
          id: `vis-${Date.now()}`,
          name: "Anonymous Guest #301",
          email: anonEmail,
          visitCount: 1,
          lastVisitTime: timeStr,
          role: "Anonymous"
        });
      }
    }
    
    setVisitorLogs(logs);
    localStorage.setItem("bihareduconnect_visitor_logs", JSON.stringify(logs));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sessionVisitedLog = sessionStorage.getItem("bihareduconnect_session_visited_log");
      if (!sessionVisitedLog) {
        sessionStorage.setItem("bihareduconnect_session_visited_log", "true");
        recordVisit(user);
      } else {
        const stored = localStorage.getItem("bihareduconnect_visitor_logs");
        if (stored) {
          try {
            setVisitorLogs(JSON.parse(stored));
          } catch (e) {
            setVisitorLogs([]);
          }
        } else {
          const defaultLogs: VisitorLog[] = [
            { id: "vis-1", name: "Rohan Kumar", email: "rohan.kumar@gmail.com", percentile: 91.5, visitCount: 5, lastVisitTime: "01 Jun 2026, 07:15 PM", role: "Standard" },
            { id: "vis-2", name: "Aman Raj", email: "amanraj.demo@bihareduconnect.in", percentile: 88.5, visitCount: 12, lastVisitTime: "01 Jun 2026, 07:32 PM", role: "Guest" },
            { id: "vis-3", name: "Priya Sharma", email: "priyasharma.demo@bihareduconnect.in", percentile: 94.2, visitCount: 8, lastVisitTime: "01 Jun 2026, 07:44 PM", role: "Guest" },
            { id: "vis-4", name: "Anonymous Guest #301", email: "anonymous.guest301@bihareduconnect.in", visitCount: 3, lastVisitTime: "01 Jun 2026, 04:12 PM", role: "Anonymous" }
          ];
          setVisitorLogs(defaultLogs);
          localStorage.setItem("bihareduconnect_visitor_logs", JSON.stringify(defaultLogs));
        }
      }
    }
  }, [user]);

  // Sync state helpers
  const saveToLocalStorage = (key: string, data: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
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
  const addCollege = (college: College) => {
    setColleges((prev) => {
      const updated = [...prev, college];
      saveToLocalStorage("bihareduconnect_colleges", updated);
      return updated;
    });
  };

  const updateCollege = (college: College) => {
    setColleges((prev) => {
      const updated = prev.map((c) => (c.id === college.id ? college : c));
      saveToLocalStorage("bihareduconnect_colleges", updated);
      return updated;
    });
  };

  const deleteCollege = (collegeId: string) => {
    setColleges((prev) => {
      const updated = prev.filter((c) => c.id !== collegeId);
      saveToLocalStorage("bihareduconnect_colleges", updated);
      return updated;
    });
  };

  // Dynamic Datastore Handlers
  const addBulkFile = (file: BulkFile) => {
    setBulkFiles((prev) => {
      const updated = [file, ...prev];
      saveToLocalStorage("bihareduconnect_bulk_files", updated);
      return updated;
    });
  };

  const deleteBulkFile = (fileName: string) => {
    setBulkFiles((prev) => {
      const updated = prev.filter((f) => f.name !== fileName);
      saveToLocalStorage("bihareduconnect_bulk_files", updated);
      return updated;
    });
  };

  const addTimelineEvent = (event: Omit<TimelineEvent, "id">) => {
    setTimelineEvents((prev) => {
      const nextId = prev.length > 0 ? Math.max(...prev.map((e) => e.id)) + 1 : 1;
      const newEvent: TimelineEvent = { ...event, id: nextId };
      const updated = [...prev, newEvent];
      saveToLocalStorage("bihareduconnect_timeline_events", updated);
      return updated;
    });
  };

  const updateTimelineEvent = (id: number, updatedFields: Partial<TimelineEvent>) => {
    setTimelineEvents((prev) => {
      const updated = prev.map((ev) => (ev.id === id ? { ...ev, ...updatedFields } : ev));
      saveToLocalStorage("bihareduconnect_timeline_events", updated);
      return updated;
    });
  };

  const deleteTimelineEvent = (id: number) => {
    setTimelineEvents((prev) => {
      const updated = prev.filter((ev) => ev.id !== id);
      saveToLocalStorage("bihareduconnect_timeline_events", updated);
      return updated;
    });
  };

  const updateGuideStep = (index: number, updatedFields: Partial<GuideStep>) => {
    setGuideSteps((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], ...updatedFields };
      }
      saveToLocalStorage("bihareduconnect_guide_steps", updated);
      return updated;
    });
  };

  const injectCutoffs = (newCutoffs: Cutoff[]) => {
    setCutoffs((prev) => {
      const updated = [...prev];
      newCutoffs.forEach((newC) => {
        const idx = updated.findIndex(
          (c) =>
            c.collegeCode === newC.collegeCode &&
            c.branchCode === newC.branchCode &&
            c.year === newC.year &&
            c.round === newC.round &&
            c.category === newC.category
        );
        if (idx !== -1) {
          updated[idx] = newC;
        } else {
          if (!newC.id) {
            newC.id = `cutoff-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          }
          updated.push(newC);
        }
      });
      saveToLocalStorage("bihareduconnect_cutoffs", updated);
      return updated;
    });
  };

  const deleteCutoff = (id: string) => {
    setCutoffs((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveToLocalStorage("bihareduconnect_cutoffs", updated);
      return updated;
    });
  };

  const resetCutoffs = () => {
    setCutoffs(cutoffsData);
    saveToLocalStorage("bihareduconnect_cutoffs", cutoffsData);
  };

  const updateSeatMatrixEntry = (entry: SeatMatrixEntry) => {
    setSeatMatrix((prev) => {
      const updated = [...prev];
      const idx = updated.findIndex(
        (s) => s.collegeCode === entry.collegeCode && s.branchCode === entry.branchCode
      );
      if (idx !== -1) {
        updated[idx] = entry;
      } else {
        updated.push(entry);
      }
      saveToLocalStorage("bihareduconnect_seat_matrix", updated);
      return updated;
    });
  };

  const resetSeatMatrix = () => {
    setSeatMatrix(seatMatrixData);
    saveToLocalStorage("bihareduconnect_seat_matrix", seatMatrixData);
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
    }
    
    const demoUser: User = {
      name: nameClean,
      percentile,
      email: dummyEmail,
      isAdmin: false
    };
    setUser(demoUser);
    saveToLocalStorage("bihareduconnect_user", demoUser);
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
    
    if (user && user.email?.toLowerCase().trim() === emailClean) {
      setUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("bihareduconnect_user");
      }
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
      
      const userSession: User = {
        name: matchedUser.name,
        email: matchedUser.email,
        percentile: matchedUser.percentile,
        isAdmin: false
      };
      setUser(userSession);
      saveToLocalStorage("bihareduconnect_user", userSession);
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
      }
      
      const demoUser: User = {
        name: inputClean,
        percentile: percentileVal,
        email: dummyEmail,
        isAdmin: false
      };
      setUser(demoUser);
      saveToLocalStorage("bihareduconnect_user", demoUser);
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
        registeredUsers,
        registerUser,
        updateRegisteredUser,
        deleteRegisteredUser,
        loginUser,
        blockedEmails,
        blockStudent,
        unblockStudent,
        visitorLogs
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
