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
  
  // Authentication
  user: User | null;
  showAuthModal: boolean;
  pendingRedirect: string | null;
  setShowAuthModal: (show: boolean) => void;
  setPendingRedirect: (path: string | null) => void;
  loginDemo: (name: string, percentile: number) => void;
  loginAdmin: (email: string, pass: string) => boolean;
  logout: () => void;
  registeredUsers: RegisteredUser[];
  registerUser: (name: string, email: string, percentile: number, pass: string) => { success: boolean; error?: string };
  updateRegisteredUser: (oldEmail: string, updatedUser: RegisteredUser) => { success: boolean; error?: string };
  deleteRegisteredUser: (email: string) => void;
  loginUser: (emailOrName: string, passOrPercentile: string) => { success: boolean; error?: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colleges, setColleges] = useState<College[]>(collegesData);
  const [cutoffs, setCutoffs] = useState<Cutoff[]>(cutoffsData);
  const [seatMatrix, setSeatMatrix] = useState<SeatMatrixEntry[]>(seatMatrixData);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [savedPredictions, setSavedPredictions] = useState<SavedPrediction[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [totalVisits, setTotalVisits] = useState<number>(0);

  // Authentication States
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);

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

      const storedUser = localStorage.getItem("bihareduconnect_user");
      if (storedUser) setUser(JSON.parse(storedUser));

      const storedUsers = localStorage.getItem("bihareduconnect_registered_users");
      if (storedUsers) setRegisteredUsers(JSON.parse(storedUsers));

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

  // Authentication Helpers
  const loginDemo = (name: string, percentile: number) => {
    const demoUser: User = {
      name,
      percentile,
      isAdmin: false
    };
    setUser(demoUser);
    saveToLocalStorage("bihareduconnect_user", demoUser);
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
      const demoUser: User = {
        name: inputClean,
        percentile: percentileVal,
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
      window.location.href = "/";
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
        loginUser
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
