"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { College } from "../../data/colleges";
import { convertPercentileToUR, convertURToPercentile } from "../../data/cutoffs";
import { AuthGate } from "../../components/AuthGate";
import { db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { 
  ShieldAlert, 
  Building, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  SlidersHorizontal, 
  CheckCircle,
  UploadCloud,
  FileSpreadsheet,
  Calendar,
  Clock,
  Sparkles,
  FileText,
  LayoutDashboard,
  Layers,
  Database,
  Info,
  Users,
  MessageSquare,
  Mail,
  Lock,
  Unlock,
  PlusCircle,
  Search,
  ChevronRight,
  LogOut,
  Crown
} from "lucide-react";

// Helper function to compress images client-side to prevent localStorage overflow
const compressImageFile = (file: File, maxWidth = 800, maxHeight = 800, quality = 0.75): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      if (typeof window === "undefined") {
        resolve("");
        return;
      }
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string); // fallback
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function AdminDashboard() {
  const { 
    colleges, 
    addCollege, 
    updateCollege, 
    deleteCollege,
    user,
    registeredUsers,
    registerUser,
    updateRegisteredUser,
    deleteRegisteredUser,
    togglePremiumAccess,
    totalVisits,
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
    cutoffs,
    deleteCutoff,
    resetCutoffs,
    seatMatrix,
    updateSeatMatrixEntry,
    resetSeatMatrix,
    blockedEmails,
    blockStudent,
    unblockStudent,
    visitorLogs,
    whatsappLink,
    updateWhatsappLink,
    chatSessions,
    deleteChatSession,
    clearAllChatSessions,
    logout
  } = useApp();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<"colleges" | "bulk" | "cutoffs" | "guides" | "timeline" | "students" | "settings">("colleges");

  // Tab 6: Students CRUD & Visit Chat states
  const [studentSearch, setStudentSearch] = useState("");
  const [activeCandidateFilter, setActiveCandidateFilter] = useState<"standard" | "demo">("standard");
  const [studentFormName, setStudentFormName] = useState("");
  const [studentFormEmail, setStudentFormEmail] = useState("");
  const [studentFormPercentile, setStudentFormPercentile] = useState<number>(2364); // UGEAC General Rank (internally percentile, default 2364 rank maps to 81.0 percentile)
  const [studentFormPassword, setStudentFormPassword] = useState("");
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [editingStudentEmail, setEditingStudentEmail] = useState<string | null>(null);
  const [visitorLogSort, setVisitorLogSort] = useState<"recent" | "top">("recent");
  
  // Chat Logs viewer states
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // Tab 3: Admin Cutoff Filters
  const [adminCutoffSearch, setAdminCutoffSearch] = useState("");
  const [adminCutoffYear, setAdminCutoffYear] = useState<number | "All">("All");
  const [adminCutoffRound, setAdminCutoffRound] = useState<number | "All">("All");
  const [adminCutoffCategory, setAdminCutoffCategory] = useState<string | "All">("All");

  // Seat Matrix Editor states
  const [isEditingSeats, setIsEditingSeats] = useState(false);
  const [seatEditorCollegeCode, setSeatEditorCollegeCode] = useState<string | null>(null);
  const [seatEditorBranch, setSeatEditorBranch] = useState<string>("");
  const [seatUr, setSeatUr] = useState<number>(24);
  const [seatBc, setSeatBc] = useState<number>(7);
  const [seatEbc, setSeatEbc] = useState<number>(11);
  const [seatSc, setSeatSc] = useState<number>(10);
  const [seatSt, setSeatSt] = useState<number>(1);
  const [seatEws, setSeatEws] = useState<number>(6);
  const [seatRcg, setSeatRcg] = useState<number>(1);

  useEffect(() => {
    if (chatSessions && chatSessions.length > 0 && !selectedSessionId) {
      setSelectedSessionId(chatSessions[0].id);
    }
  }, [chatSessions, selectedSessionId]);

  // Notifications
  const [successMsg, setSuccessMsg] = useState("");
  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  // Student Registrations & Chats Actions
  const handleRegisterStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentFormName.trim() || !studentFormEmail.trim() || !studentFormPassword.trim()) {
      showNotification("❌ Please fill all fields.");
      return;
    }
    const pctVal = convertURToPercentile(studentFormPercentile);
    const res = registerUser(studentFormName, studentFormEmail, pctVal, studentFormPassword);
    if (res.success) {
      showNotification(`✓ Registered candidate ${studentFormName} successfully!`);
      setStudentFormName("");
      setStudentFormEmail("");
      setStudentFormPercentile(2364);
      setStudentFormPassword("");
    } else {
      showNotification(`❌ Error: ${res.error || "Failed to register student."}`);
    }
  };

  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudentEmail) return;
    if (!studentFormName.trim() || !studentFormEmail.trim() || !studentFormPassword.trim()) {
      showNotification("❌ Please fill all fields.");
      return;
    }
    const pctVal = convertURToPercentile(studentFormPercentile);
    const updated = {
      name: studentFormName.trim(),
      email: studentFormEmail.trim(),
      percentile: pctVal,
      password: studentFormPassword.trim()
    };
    const res = updateRegisteredUser(editingStudentEmail, updated);
    if (res.success) {
      showNotification("✓ Candidate details updated successfully.");
      setIsEditingStudent(false);
      setEditingStudentEmail(null);
      setStudentFormName("");
      setStudentFormEmail("");
      setStudentFormPercentile(2364);
      setStudentFormPassword("");
    } else {
      showNotification(`❌ Error: ${res.error || "Failed to update details."}`);
    }
  };

  const handleStartEditStudent = (stud: any) => {
    setIsEditingStudent(true);
    setEditingStudentEmail(stud.email);
    setStudentFormName(stud.name);
    setStudentFormEmail(stud.email);
    setStudentFormPercentile(Math.round(convertPercentileToUR(stud.percentile)));
    setStudentFormPassword(stud.password || "");
  };

  const handleDeleteStudent = (email: string) => {
    if (confirm(`Are you sure you want to delete registration for ${email}?`)) {
      deleteRegisteredUser(email);
      showNotification("✓ Candidate registration removed.");
    }
  };

  const handleGenerateMockChats = async () => {
    const mockSessions = [
      {
        id: "mock-session-aman",
        studentName: "Aman Raj",
        studentEmail: "aman.raj@gmail.com",
        percentile: 88.5,
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        lastMessageTime: "03:14 PM",
        messages: [
          { sender: "user", text: "Hi, kya mujhe MIT Muzaffarpur me CSE mil sakta hai?", timestamp: "03:12 PM" },
          { sender: "bot", text: "Namaste Aman! Muzaffarpur Institute of Technology (MIT Muzaffarpur) me CSE milna kaafi competitive hai. General Category ke liye UGEAC closing rank typically under 240-280 hoti hai. BC category me under 380 rank tak chances achhe hain. Apni category check karein!", timestamp: "03:13 PM" },
          { sender: "user", text: "Mera JEE Main percentile 88.5 hai BC category me.", timestamp: "03:13 PM" },
          { sender: "bot", text: "88.5 percentile par aapki BC category rank achhi banegi. MIT Muzaffarpur me ECE, Electrical ya Mechanical branch ke bahut achhe chances hain. Agar aapko strictly CSE chahiye, toh aap BCE Bhagalpur ya GCE Gaya ke options check kar sakte hain!", timestamp: "03:14 PM" }
        ]
      },
      {
        id: "mock-session-priya",
        studentName: "Priya Sharma",
        studentEmail: "priya.sharma99@outlook.com",
        percentile: 94.2,
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        lastMessageTime: "11:45 AM",
        messages: [
          { sender: "user", text: "What documents do I need for physical verification?", timestamp: "11:40 AM" },
          { sender: "bot", text: "Hello Priya! For physical document verification at nodal centers, you need:\n1. JEE Main Admit & Rank Card\n2. UGEAC Application Form (Part-A & Part-B)\n3. 10th & 12th passing certificates & marksheets\n4. Resident Certificate of Bihar State (Mandatory)\n5. Category Certificate (if applicable)\n6. School Leaving Certificate & Character Certificate\n7. 6 Passport photos & Aadhar Card.\n\nMake sure to carry 3 sets of self-attested photocopies of all documents!", timestamp: "11:42 AM" },
          { sender: "user", text: "Okay, thank you so much! Is caste certificate mandatory for General-EWS?", timestamp: "11:44 AM" },
          { sender: "bot", text: "Yes Priya, for General-EWS quota benefit, you must present a valid EWS Income & Asset Certificate issued by the competent Bihar authority (Circle Officer/Revenue Officer) during document verification.", timestamp: "11:45 AM" }
        ]
      }
    ];
    try {
      for (const session of mockSessions) {
        await setDoc(doc(db, "chat_sessions", session.id), session);
      }
      setSelectedSessionId(mockSessions[0].id);
      showNotification("✓ Mock chat sessions generated in Firestore!");
    } catch (e) {
      console.error(e);
      showNotification("❌ Failed to generate test data.");
    }
  };

  const handleOpenSeatEditor = (collegeCode: string, branchCode: string) => {
    const existing = seatMatrix.find(s => s.collegeCode === collegeCode && s.branchCode === branchCode) || {
      collegeCode,
      branchCode,
      totalSeats: 60,
      categorySeats: { UR: 24, BC: 7, EBC: 11, SC: 10, ST: 1, EWS: 6, RCG: 1 }
    };
    
    setSeatEditorCollegeCode(collegeCode);
    setSeatEditorBranch(branchCode);
    setSeatUr(existing.categorySeats.UR || 0);
    setSeatBc(existing.categorySeats.BC || 0);
    setSeatEbc(existing.categorySeats.EBC || 0);
    setSeatSc(existing.categorySeats.SC || 0);
    setSeatSt(existing.categorySeats.ST || 0);
    setSeatEws(existing.categorySeats.EWS || 0);
    setSeatRcg(existing.categorySeats.RCG || 0);
    setIsEditingSeats(true);
  };

  const handleSaveSeats = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seatEditorCollegeCode || !seatEditorBranch) return;

    const total = seatUr + seatBc + seatEbc + seatSc + seatSt + seatEws + seatRcg;
    const entry = {
      collegeCode: seatEditorCollegeCode,
      branchCode: seatEditorBranch,
      totalSeats: total,
      categorySeats: {
        UR: seatUr,
        BC: seatBc,
        EBC: seatEbc,
        SC: seatSc,
        ST: seatSt,
        EWS: seatEws,
        RCG: seatRcg
      }
    };

    updateSeatMatrixEntry(entry);
    setIsEditingSeats(false);
    showNotification(`✓ Seat matrix updated for ${seatEditorCollegeCode} - ${seatEditorBranch} (Total Seats: ${total})`);
  };

  // ==========================================
  // TAB 1: COLLEGE CRUD LOCAL STATES
  // ==========================================
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formEstablished, setFormEstablished] = useState<number>(2008);
  const [formNirf, setFormNirf] = useState<number | "">("");
  const [formAvgPack, setFormAvgPack] = useState<number>(4.0);
  const [formHighestPack, setFormHighestPack] = useState<number>(10.0);
  const [formTuition, setFormTuition] = useState<number>(8500);
  const [formHostelAvail, setFormHostelAvail] = useState(true);
  const [formHostelFee, setFormHostelFee] = useState<number>(9000);
  const [formWebsite, setFormWebsite] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCampusSize, setFormCampusSize] = useState("35 Acres");
  const [formBranches, setFormBranches] = useState("CSE, ECE, EE, ME, CE");
  const [formImage, setFormImage] = useState("");
  const [imageInputMode, setImageInputMode] = useState<"upload" | "url">("upload");
  const [isCompressingImage, setIsCompressingImage] = useState(false);

  const handleCreateNew = () => {
    setIsCreating(true);
    setIsEditing(false);
    setFormName("");
    setFormCode("");
    setFormLocation("");
    setFormEstablished(2010);
    setFormNirf("");
    setFormAvgPack(4.5);
    setFormHighestPack(12.0);
    setFormTuition(9500);
    setFormHostelAvail(true);
    setFormHostelFee(10000);
    setFormWebsite("https://example.edu");
    setFormDescription("State government engineering college under BCECE Board UGEAC counselling.");
    setFormCampusSize("35 Acres");
    setFormBranches("CSE, ECE, EE, ME, CE");
    setFormImage("https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600");
    setImageInputMode("upload");
  };

  const handleEditClick = (col: College) => {
    setIsEditing(true);
    setIsCreating(false);
    setEditingId(col.id);

    setFormName(col.name);
    setFormCode(col.code);
    setFormLocation(col.location);
    setFormEstablished(col.established);
    setFormNirf(col.nirf || "");
    setFormAvgPack(col.averagePackage);
    setFormHighestPack(col.highestPackage);
    setFormTuition(col.tuitionFee);
    setFormHostelAvail(col.hostelAvailable);
    setFormHostelFee(col.hostelFee);
    setFormWebsite(col.website);
    setFormDescription(col.description);
    setFormCampusSize(col.campusSize);
    setFormBranches(col.branches.join(", "));
    setFormImage(col.image || "");
    
    if (col.image && col.image.startsWith("data:image/")) {
      setImageInputMode("upload");
    } else {
      setImageInputMode("url");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const branchesArray = formBranches.split(",").map(b => b.trim().toUpperCase()).filter(b => b.length > 0);

    const updatedColObj: College = {
      id: isEditing && editingId ? editingId : formName.toLowerCase().replace(/\s+/g, "-"),
      name: formName,
      code: formCode,
      location: formLocation,
      established: formEstablished,
      nirf: formNirf === "" ? null : Number(formNirf),
      averagePackage: Number(formAvgPack),
      highestPackage: Number(formHighestPack),
      tuitionFee: Number(formTuition),
      hostelAvailable: formHostelAvail,
      hostelFee: formHostelAvail ? Number(formHostelFee) : 0,
      website: formWebsite,
      description: formDescription,
      campusSize: formCampusSize,
      branches: branchesArray,
      recruits: ["TCS", "Wipro", "Infosys", "L&T"],
      image: formImage.trim() || "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600"
    };

    if (isEditing) {
      updateCollege(updatedColObj);
      showNotification("✓ College profile details updated successfully!");
    } else {
      addCollege(updatedColObj);
      showNotification("✓ New college record initialized in UGEAC directory!");
    }

    setIsEditing(false);
    setIsCreating(false);
    setEditingId(null);
  };

  const handleDeleteClick = (id: string) => {
    if (confirm("Are you sure you want to delete this college profile? This will immediately remove it from all college directories and predictors.")) {
      deleteCollege(id);
      showNotification("✓ College datastore profile removed successfully.");
    }
  };

  // ==========================================
  // TAB 2: BULK DOCUMENTS LOCAL STATES
  // ==========================================
  const [docUploadType, setDocUploadType] = useState("circular");
  const [docTitle, setDocTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Auto pre-fill doc title if empty
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ").replace(/-/g, " ");
      setDocTitle(cleanName);
    }
  };

  const handleBulkUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle) {
      alert("Please enter a document title first!");
      return;
    }
    
    setIsBulkUploading(true);
    setBulkProgress(15);
    
    // Simulate incremental loader
    const interval = setInterval(() => {
      setBulkProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 20;
      });
    }, 250);

    setTimeout(() => {
      const extension = selectedFile ? selectedFile.name.split(".").pop() : "pdf";
      const actualSize = selectedFile 
        ? (selectedFile.size / (1024 * 1024)).toFixed(2) + " MB" 
        : (Math.random() * 3 + 1).toFixed(1) + " MB";
      const finalFileName = docTitle.toLowerCase().trim().replace(/\s+/g, "_") + "." + extension;

      addBulkFile({
        name: finalFileName,
        type: docUploadType === "circular" ? "Official circular" : docUploadType === "matrix" ? "Seat Matrix" : "Handbook PDF",
        size: actualSize,
        date: new Date().toISOString().split("T")[0],
        status: "Uploaded"
      });
      
      setIsBulkUploading(false);
      setBulkProgress(0);
      setDocTitle("");
      setSelectedFile(null);

      // Reset DOM file input element if exists
      const fileInput = document.getElementById("admin-file-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      showNotification("✓ Document processed and appended to candidate downloads!");
    }, 1500);
  };

  // ==========================================
  // TAB 3: CUTOFFS DATABASE LOCAL STATES
  // ==========================================
  const [cutoffYear, setCutoffYear] = useState(2025);
  const [cutoffRound, setCutoffRound] = useState(1);
  const [bulkCutoffText, setBulkCutoffText] = useState("");
  const [isInjectingCutoffs, setIsInjectingCutoffs] = useState(false);

  const handleInjectCutoffs = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkCutoffText.trim()) {
      alert("Please paste cutoff JSON or CSV data first!");
      return;
    }

    setIsInjectingCutoffs(true);
    
    setTimeout(() => {
      try {
        const lines = bulkCutoffText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
        const parsedCutoffs: any[] = [];
        if (lines.length > 1) {
          const header = lines[0].split(",").map(h => h.trim().toUpperCase());
          const isCustomFormat = header.includes("UR_CLOSING") || header.includes("BC_CLOSING") || header.includes("EBC_CLOSING");
          
          for (let i = 1; i < lines.length; i++) {
            const parts = lines[i].split(",").map(p => p.trim());
            if (parts.length >= 3) {
              const collegeCode = parts[0];
              const branchCode = parts[1];
              
              if (isCustomFormat) {
                const categoriesToInject = ["UR", "BC", "EBC"];
                categoriesToInject.forEach((cat, idx) => {
                  const val = parts[idx + 2];
                  if (val && !isNaN(Number(val))) {
                    parsedCutoffs.push({
                      collegeCode,
                      branchCode,
                      year: cutoffYear,
                      round: cutoffRound,
                      category: cat,
                      gender: "Co-ed",
                      openingRank: Math.round(Number(val) * 0.7),
                      closingRank: Math.round(Number(val))
                    });
                  }
                });
              } else {
                const categoryCode = parts[2];
                const closingRank = parts[3];
                if (closingRank && !isNaN(Number(closingRank))) {
                  parsedCutoffs.push({
                    collegeCode,
                    branchCode,
                    year: cutoffYear,
                    round: cutoffRound,
                    category: categoryCode,
                    gender: "Co-ed",
                    openingRank: Math.round(Number(closingRank) * 0.7),
                    closingRank: Math.round(Number(closingRank))
                  });
                }
              }
            }
          }
        }
        
        if (parsedCutoffs.length > 0) {
          injectCutoffs(parsedCutoffs);
          setIsInjectingCutoffs(false);
          setBulkCutoffText("");
          showNotification(`✓ Successfully loaded and merged ${parsedCutoffs.length} closing cutoffs into prediction engines.`);
        } else {
          setIsInjectingCutoffs(false);
          alert("No valid rows could be parsed. Please check headers and formatting!");
        }
      } catch (err) {
        setIsInjectingCutoffs(false);
        alert("Failed to parse cutoffs CSV. Check console for details.");
        console.error(err);
      }
    }, 1500);
  };

  // ==========================================
  // TAB 4: COUNSELLING GUIDES LOCAL STATES
  // ==========================================
  const [selectedGuideIndex, setSelectedGuideIndex] = useState(0);
  const [guideTitle, setGuideTitle] = useState("Online Registration");
  const [guideSubtitle, setGuideSubtitle] = useState("UGEAC Portal Setup");
  const [guideDesc, setGuideDesc] = useState("Candidates must visit the official BCECE Board website and click on the 'UGEAC Online Application Portal'. Register using JEE Main Roll, password, mobile, and email.");

  useEffect(() => {
    if (guideSteps && guideSteps[selectedGuideIndex]) {
      // Load current guide step details automatically when step is selected
      const step = guideSteps[selectedGuideIndex];
      // strip number prefix if any
      setGuideTitle(step.title.replace(/^\d+\.\s+/, ""));
      setGuideSubtitle(step.subtitle);
      setGuideDesc(step.description);
    }
  }, [selectedGuideIndex, guideSteps]);

  const handleUpdateGuide = (e: React.FormEvent) => {
    e.preventDefault();
    updateGuideStep(selectedGuideIndex, {
      title: `${selectedGuideIndex + 1}. ${guideTitle}`,
      subtitle: guideSubtitle,
      description: guideDesc
    });
    showNotification(`✓ Step ${selectedGuideIndex + 1} (${guideTitle}) updated in walkthrough guidelines database!`);
  };

  // ==========================================
  // TAB 5: TIMELINE SCHEDULER STATES
  // ==========================================
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");

  const handleAddTimelineEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !newEventDate) return;

    addTimelineEvent({
      event: newEventTitle,
      date: newEventDate,
      status: "Upcoming"
    });
    setNewEventTitle("");
    setNewEventDate("");
    showNotification("✓ Event scheduled on candidates vertical timelines!");
  };

  const handleToggleEventStatus = (id: number) => {
    const ev = timelineEvents.find((e) => e.id === id);
    if (!ev) return;
    const nextStatus = ev.status === "Active" ? "Done" : ev.status === "Upcoming" ? "Active" : "Upcoming";
    updateTimelineEvent(id, { status: nextStatus });
    showNotification("✓ Milestone event state updated.");
  };

  // ==========================================
  // TAB 7: SITE SETTINGS STATES & HANDLERS
  // ==========================================
  const [settingsWhatsappLink, setSettingsWhatsappLink] = useState(whatsappLink);

  useEffect(() => {
    if (whatsappLink) {
      setSettingsWhatsappLink(whatsappLink);
    }
  }, [whatsappLink]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsWhatsappLink.trim().startsWith("http://") && !settingsWhatsappLink.trim().startsWith("https://")) {
      alert("Please enter a valid URL beginning with http:// or https://");
      return;
    }
    updateWhatsappLink(settingsWhatsappLink.trim());
    showNotification("✓ Site configuration settings updated successfully!");
  };

  // Route protection alert
  if (user && !user.isAdmin) {
    return (
      <AuthGate>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white dark:bg-slate-900 border border-red-500/20 rounded-3xl p-8 shadow-xl max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-850 dark:text-white uppercase tracking-wider">
              Access Denied
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              🚫 Administrative clearance level required. Your account (<strong>{user.name}</strong>) does not have sufficient permissions to view the datastore control panel.
            </p>
          </div>
        </div>
      </AuthGate>
    );
  }

  return (
    <AuthGate>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Admin Header panel */}
        <div className="bg-slate-900 border border-amber-500/35 rounded-3xl p-6 md:p-8 relative overflow-hidden mb-8 shadow-xl text-left">
          {/* Subtle decoration */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5" />
                Administrative Command Panel
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                BiharEduConnect <span className="text-amber-500">System Admin</span>
              </h1>
              <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">
                Clearance level active. Manage college directories, inject CSV cutoff tables, bulk-upload PDF guide handbooks, and schedule registration milestone calendar dates dynamically.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 shrink-0 text-left">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5">
                <span className="text-[9px] text-gray-500 font-bold block uppercase">Database State</span>
                <span className="text-xs font-extrabold text-emerald-500 flex items-center gap-1.5 mt-0.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Synced ({colleges.length} Colleges)
                </span>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5">
                <span className="text-[9px] text-gray-500 font-bold block uppercase">Clearance Operator</span>
                <span className="text-xs font-extrabold text-amber-500 flex items-center gap-1.5 mt-0.5">
                  {user?.name || "System Admin"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => logout()}
                className="inline-flex items-center gap-1.5 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow hover:shadow-red-500/20 active:scale-95 transition-all cursor-pointer border border-red-500/20"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Tab Selection panels */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-slate-850 pb-2">
          {[
            { id: "colleges", label: "Colleges DB", icon: Building },
            { id: "bulk", label: "Bulk Documents", icon: UploadCloud },
            { id: "cutoffs", label: "Cutoff Manager", icon: Database },
            { id: "guides", label: "Guide Steps", icon: FileText },
            { id: "timeline", label: "Timeline Scheduler", icon: Calendar },
            { id: "students", label: "Students & Visits", icon: Users },
            { id: "settings", label: "Site Settings", icon: SlidersHorizontal }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setIsEditing(false);
                  setIsCreating(false);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                  active
                    ? "bg-amber-500 text-white shadow shadow-amber-500/20"
                    : "text-gray-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-950"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic success banner notification */}
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-505 rounded-2xl flex items-center gap-2 text-xs font-extrabold shadow-sm text-left">
            <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500" />
            {successMsg}
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 1 CONTENT: COLLEGES DB MANAGEMENT */}
        {/* ==================================================== */}
        {activeTab === "colleges" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* College Editor Form Side panel */}
            {(isCreating || isEditing) && (
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-md relative text-left">
                <button
                  type="button"
                  onClick={() => { setIsEditing(false); setIsCreating(false); }}
                  className="absolute top-5 right-5 text-gray-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-4 flex items-center gap-1.5 border-b border-gray-100 dark:border-slate-850 pb-2">
                  <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                  {isEditing ? "Edit College Datastore Profile" : "Create New College Record"}
                </h3>

                <form onSubmit={handleSave} className="space-y-3.5 text-[10px]">
                  <div>
                    <label className="block font-extrabold text-gray-450 uppercase mb-1">College Name</label>
                    <input
                      type="text" required value={formName} onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Gaya College of Engineering"
                      className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-extrabold text-gray-450 uppercase mb-1">Unique Code</label>
                      <input
                        type="text" required value={formCode} onChange={(e) => setFormCode(e.target.value)}
                        placeholder="e.g. GCE-GAYA"
                        className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold text-gray-450 uppercase mb-1">Location City</label>
                      <input
                        type="text" required value={formLocation} onChange={(e) => setFormLocation(e.target.value)}
                        placeholder="e.g. Gaya"
                        className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-extrabold text-gray-450 uppercase mb-1">Established</label>
                      <input
                        type="number" required value={formEstablished} onChange={(e) => setFormEstablished(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold text-gray-450 uppercase mb-1">NIRF Rank</label>
                      <input
                        type="number" value={formNirf} onChange={(e) => setFormNirf(e.target.value === "" ? "" : Number(e.target.value))}
                        placeholder="None"
                        className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold text-gray-450 uppercase mb-1">Campus Size</label>
                      <input
                        type="text" required value={formCampusSize} onChange={(e) => setFormCampusSize(e.target.value)}
                        placeholder="35 Acres"
                        className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-extrabold text-gray-450 uppercase mb-1">Avg package (LPA)</label>
                      <input
                        type="number" step="0.1" required value={formAvgPack} onChange={(e) => setFormAvgPack(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold text-gray-450 uppercase mb-1">Max Package (LPA)</label>
                      <input
                        type="number" step="0.1" required value={formHighestPack} onChange={(e) => setFormHighestPack(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-extrabold text-gray-450 uppercase mb-1">Tuition Fee (Annual)</label>
                      <input
                        type="number" required value={formTuition} onChange={(e) => setFormTuition(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold text-gray-450 uppercase mb-1">Hostel Fee (Annual)</label>
                      <input
                        type="number" required={formHostelAvail} disabled={!formHostelAvail} value={formHostelFee} onChange={(e) => setFormHostelFee(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox" id="admin-hostel-check" checked={formHostelAvail} onChange={(e) => setFormHostelAvail(e.target.checked)}
                      className="rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                    <label htmlFor="admin-hostel-check" className="font-bold text-slate-700 dark:text-gray-300 cursor-pointer">Hostel Facilities Available</label>
                  </div>

                  <div>
                    <label className="block font-extrabold text-gray-450 uppercase mb-1">Branches (Comma separated)</label>
                    <input
                      type="text" required value={formBranches} onChange={(e) => setFormBranches(e.target.value)}
                      placeholder="CSE, ECE, EE, ME, CE"
                      className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    
                    {/* Dynamic Branch Seats Quick-Edit Link List */}
                    {formBranches.trim() && (
                      <div className="mt-2 p-2.5 bg-slate-50/60 dark:bg-slate-950/40 rounded-2xl border border-gray-200 dark:border-slate-850 space-y-1.5 text-[9px] text-left">
                        <span className="font-bold text-gray-400 uppercase block mb-1">Configure Branch Seats Intake:</span>
                        <div className="flex flex-wrap gap-2">
                          {formBranches.split(",").map(b => b.trim().toUpperCase()).filter(b => b.length > 0).map((branch) => {
                            const entry = seatMatrix.find(s => s.collegeCode === formCode && s.branchCode === branch) || {
                              totalSeats: 60
                            };
                            return (
                              <button
                                key={branch}
                                type="button"
                                onClick={() => {
                                  if (formCode) {
                                    handleOpenSeatEditor(formCode, branch);
                                  } else {
                                    alert("Please specify a Unique College Code first!");
                                  }
                                }}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl font-bold transition-all cursor-pointer"
                                title={`Edit seats for ${branch}`}
                              >
                                <Layers className="w-3 h-3 text-emerald-500" />
                                {branch}: {entry.totalSeats} Seats (Edit)
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-extrabold text-gray-450 uppercase mb-1">Official College Link</label>
                    <input
                      type="url" required value={formWebsite} onChange={(e) => setFormWebsite(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Premium Dual Mode Image Uploader */}
                  <div className="space-y-2">
                    <label className="block font-extrabold text-gray-450 uppercase mb-1">College Banner Photo</label>
                    
                    {/* Toggle Selector tabs */}
                    <div className="flex border border-gray-250 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 p-1 mb-2">
                      <button
                        type="button"
                        onClick={() => setImageInputMode("upload")}
                        className={`flex-1 py-1.5 text-[9px] font-extrabold uppercase tracking-wider rounded-lg transition-all ${
                          imageInputMode === "upload"
                            ? "bg-amber-500 text-white shadow-sm"
                            : "text-gray-400 dark:text-gray-500 hover:text-slate-700 dark:hover:text-white"
                        }`}
                      >
                        Direct JPG/PNG Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageInputMode("url")}
                        className={`flex-1 py-1.5 text-[9px] font-extrabold uppercase tracking-wider rounded-lg transition-all ${
                          imageInputMode === "url"
                            ? "bg-amber-500 text-white shadow-sm"
                            : "text-gray-400 dark:text-gray-500 hover:text-slate-700 dark:hover:text-white"
                        }`}
                      >
                        Provide Web URL Link
                      </button>
                    </div>

                    {/* Mode Panels */}
                    {imageInputMode === "upload" ? (
                      <div className="space-y-2">
                        {/* Hidden File Input */}
                        <input
                          type="file"
                          id="college-photo-file-upload"
                          accept="image/jpeg,image/png,image/jpg"
                          className="hidden"
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              try {
                                setIsCompressingImage(true);
                                const base64 = await compressImageFile(file);
                                setFormImage(base64);
                              } catch (err) {
                                console.error("Error compressing image:", err);
                                alert("Failed to process image file. Please try another photo.");
                              } finally {
                                setIsCompressingImage(false);
                              }
                            }
                          }}
                        />

                        {/* Interactive Drag & Drop Box */}
                        <div
                          onClick={() => {
                            if (!isCompressingImage) {
                              document.getElementById("college-photo-file-upload")?.click();
                            }
                          }}
                          className={`border-2 border-dashed rounded-2xl py-5 px-3 text-center flex flex-col items-center justify-center space-y-1.5 cursor-pointer transition-all hover:bg-slate-50/50 dark:hover:bg-slate-950/20 active:scale-[0.99] duration-250 ${
                            formImage && formImage.startsWith("data:image/")
                              ? "border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-500/2"
                              : "border-gray-250 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 hover:border-amber-500/50"
                          }`}
                        >
                          {isCompressingImage ? (
                            <>
                              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                              <span className="font-extrabold text-slate-750 dark:text-slate-200">Compressing & optimizing...</span>
                              <p className="text-[8px] text-gray-400 mt-0.5">Resizing image for peak website performance</p>
                            </>
                          ) : formImage && formImage.startsWith("data:image/") ? (
                            <>
                              <CheckCircle className="w-7 h-7 text-emerald-500 animate-pulse" />
                              <div>
                                <span className="font-extrabold text-slate-800 dark:text-gray-200 block text-[10px]">Photo Upload Active!</span>
                                <p className="text-[8px] text-gray-400 mt-0.5">JPEG Compressed base64 string loaded successfully</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="w-7 h-7 text-amber-500 animate-bounce" />
                              <div>
                                <span className="font-extrabold text-slate-800 dark:text-white block text-[10px]">Select College JPG/PNG Photo</span>
                                <p className="text-[8px] text-gray-400 mt-0.5">Click to browse your computer files</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        {/* URL Address Input */}
                        <input
                          type="url"
                          required={imageInputMode === "url"}
                          value={formImage && formImage.startsWith("data:image/") ? "" : formImage}
                          onChange={(e) => setFormImage(e.target.value)}
                          placeholder="e.g. https://images.unsplash.com/photo..."
                          className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    )}

                    {/* Unified Premium Preview Area */}
                    {formImage && (
                      <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-950 border border-gray-250 dark:border-slate-850 rounded-2xl flex items-center justify-between shadow-sm animate-fadeIn">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-205 dark:border-slate-800 bg-slate-200 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={formImage}
                              alt="Form Banner Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Clear image if it's a broken URL
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600";
                              }}
                            />
                          </div>
                          <div className="text-[9px]">
                            <span className="font-extrabold text-slate-800 dark:text-gray-250 block truncate max-w-[150px]">
                              {formImage.startsWith("data:image/") ? "Direct Photo Upload" : "Web Image Link"}
                            </span>
                            <span className={`inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.5 rounded font-extrabold uppercase text-[7px] ${
                              formImage.startsWith("data:image/") 
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
                                : "bg-blue-500/10 text-[#2563EB] dark:text-blue-400 border border-blue-500/20"
                            }`}>
                              <span className={`h-1 w-1 rounded-full ${formImage.startsWith("data:image/") ? "bg-emerald-500" : "bg-[#2563EB]"}`} />
                              {formImage.startsWith("data:image/") ? "JPEG Base64" : "External URL"}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormImage("")}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 border border-red-500/10 rounded-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                          title="Remove Photo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-extrabold text-gray-450 uppercase mb-1">Detailed Description Profile</label>
                    <textarea
                      required value={formDescription} onChange={(e) => setFormDescription(e.target.value)}
                      rows={2}
                      className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer mt-3"
                  >
                    <Save className="w-4 h-4" />
                    {isEditing ? "Save Record Edits" : "Create New College Record"}
                  </button>
                </form>
              </div>
            )}

            {isEditingSeats && (
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-md relative text-left">
                <button
                  type="button"
                  onClick={() => { setIsEditingSeats(false); }}
                  className="absolute top-5 right-5 text-gray-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-sm font-bold text-slate-855 dark:text-white mb-3 border-b border-gray-100 dark:border-slate-855 pb-2 flex items-center gap-1.5">
                  <Layers className="w-4.5 h-4.5 text-emerald-500 animate-pulse" />
                  Edit Seat Allocation Matrix
                </h3>

                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal mb-4">
                  Define the exact category seat allocations for <strong>{seatEditorCollegeCode}</strong> (Branch: <strong>{seatEditorBranch}</strong>).
                </p>

                <form onSubmit={handleSaveSeats} className="space-y-3.5 text-[10px]">
                  <div>
                    <label className="block font-bold text-gray-400 uppercase mb-1">Branch/Specialization</label>
                    <select
                      value={seatEditorBranch}
                      onChange={(e) => {
                        if (seatEditorCollegeCode) {
                          handleOpenSeatEditor(seatEditorCollegeCode, e.target.value);
                        }
                      }}
                      className="w-full p-2.5 rounded-xl border border-gray-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:border-emerald-500"
                    >
                      {colleges.find(c => c.code === seatEditorCollegeCode)?.branches.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="border-t border-gray-100 dark:border-slate-850 my-2" />

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-400 uppercase mb-1">UR Seats</label>
                      <input
                        type="number" min="0" required value={seatUr} onChange={(e) => setSeatUr(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-gray-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-400 uppercase mb-1">BC Seats</label>
                      <input
                        type="number" min="0" required value={seatBc} onChange={(e) => setSeatBc(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-gray-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-400 uppercase mb-1">EBC Seats</label>
                      <input
                        type="number" min="0" required value={seatEbc} onChange={(e) => setSeatEbc(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-gray-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-400 uppercase mb-1">SC Seats</label>
                      <input
                        type="number" min="0" required value={seatSc} onChange={(e) => setSeatSc(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-gray-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-bold text-gray-400 uppercase mb-1">ST Seats</label>
                      <input
                        type="number" min="0" required value={seatSt} onChange={(e) => setSeatSt(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-gray-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-400 uppercase mb-1">EWS Seats</label>
                      <input
                        type="number" min="0" required value={seatEws} onChange={(e) => setSeatEws(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-gray-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-400 uppercase mb-1">RCG Seats</label>
                      <input
                        type="number" min="0" required value={seatRcg} onChange={(e) => setSeatRcg(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-gray-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-gray-155 dark:border-slate-850 rounded-xl">
                    <span className="font-bold text-gray-400 uppercase block mb-1">Seats intake summary</span>
                    <span className="font-extrabold text-xs text-[#2563EB]">Total seats calculated: {seatUr + seatBc + seatEbc + seatSc + seatSt + seatEws + seatRcg} Seats</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save Seat Allocations
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Reset seat matrix of this college to default percentages?")) {
                          resetSeatMatrix();
                          setIsEditingSeats(false);
                          showNotification("✓ Seat Matrix reset to baseline defaults!");
                        }
                      }}
                      className="px-3.5 py-2.5 border border-red-500/25 text-red-500 rounded-xl font-bold hover:bg-red-500/5 cursor-pointer"
                      title="Reset Matrix"
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Colleges datastore grid layout */}
            <div className={(isCreating || isEditing || isEditingSeats) ? "lg:col-span-7" : "lg:col-span-12"}>
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden text-left">
                <div className="px-5 py-4 border-b border-gray-200 dark:border-slate-850 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950">
                  <h4 className="font-extrabold text-slate-850 dark:text-white flex items-center gap-1.5 text-sm">
                    <Building className="w-4.5 h-4.5 text-amber-500" />
                    BCECE Colleges Directory ({colleges.length})
                  </h4>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const res = await fetch("/api/save-colleges", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ colleges, seatMatrix })
                          });
                          const data = await res.json();
                          if (data.success) {
                            if (data.warning) {
                              showNotification("⚠️ Saved to disk, but Git Push failed! Please push manually.");
                              alert(data.warning);
                            } else if (data.pushed) {
                              showNotification("✓ Success! Saved to disk and automatically pushed to GitHub! Vercel is now deploying.");
                            } else {
                              showNotification("✓ Saved to disk! No new changes detected to push.");
                            }
                          } else {
                            alert("Error saving database: " + data.error);
                          }
                        } catch (err: any) {
                          alert("Failed to sync to Git: " + err.message);
                        }
                      }}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-[#138808] hover:shadow text-white rounded-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 border border-emerald-500/10"
                    >
                      <Save className="w-3.5 h-3.5 animate-pulse" />
                      Sync colleges.ts to Local Git
                    </button>

                    {!(isCreating || isEditing) && (
                      <button
                        type="button"
                        onClick={handleCreateNew}
                        className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add College Record
                      </button>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto text-xs">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950 text-gray-450 dark:text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="px-5 py-3">College details</th>
                        <th className="px-5 py-3 text-center">Established</th>
                        <th className="px-5 py-3 text-center font-bold">Averages</th>
                        <th className="px-5 py-3 text-center">Branches</th>
                        <th className="px-5 py-3 text-right">Action Buttons</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 dark:divide-slate-800/80 font-bold text-slate-700 dark:text-gray-300">
                      {colleges.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="font-extrabold text-slate-800 dark:text-gray-150 leading-snug">{c.name}</div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block mt-0.5">Code: {c.code} | {c.location}</span>
                          </td>
                          <td className="px-5 py-3.5 text-center text-gray-500 dark:text-gray-400">
                            {c.established}
                          </td>
                          <td className="px-5 py-3.5 text-center text-[#138808]">
                            {c.averagePackage.toFixed(2)} LPA
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <div className="flex flex-wrap justify-center gap-1 max-w-[150px] mx-auto">
                              {c.branches.map((b) => {
                                const entry = seatMatrix.find(s => s.collegeCode === c.code && s.branchCode === b) || { totalSeats: 60 };
                                return (
                                  <button
                                    key={b}
                                    type="button"
                                    onClick={() => {
                                      setIsEditing(false);
                                      setIsCreating(false);
                                      handleOpenSeatEditor(c.code, b);
                                    }}
                                    className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-[8px] font-extrabold cursor-pointer transition-colors"
                                    title={`Click to edit seats for ${b} (Current: ${entry.totalSeats} seats)`}
                                  >
                                    {b} ({entry.totalSeats})
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsEditing(false);
                                  setIsCreating(false);
                                  handleOpenSeatEditor(c.code, c.branches[0] || "CSE");
                                }}
                                className="p-2 border border-gray-200 dark:border-slate-850 text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/5 rounded-lg cursor-pointer"
                                title="Edit Category Seat Matrix"
                              >
                                <Layers className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEditClick(c)}
                                className="p-2 border border-gray-200 dark:border-slate-850 text-gray-400 hover:text-amber-500 hover:bg-amber-500/5 rounded-lg cursor-pointer"
                                title="Edit College Profile"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteClick(c.id)}
                                className="p-2 border border-gray-200 dark:border-slate-850 text-gray-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg cursor-pointer"
                                title="Delete College Profile"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2 CONTENT: BULK DOCUMENT UPLOAD MANAGER */}
        {/* ==================================================== */}
        {activeTab === "bulk" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left text-xs">
            
            {/* Bulk upload form panel */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-3 border-b border-gray-100 dark:border-slate-850 pb-2 flex items-center gap-1.5">
                <UploadCloud className="w-5 h-5 text-[#2563EB]" />
                Bulk Document Uploader
              </h3>
              
              <p className="text-[11px] text-gray-405 leading-relaxed mb-4">
                Administrators can upload dynamic counselling circulars, downloadable rank card templates, PDF handbooks, or Excel matrices instantly.
              </p>

              <form onSubmit={handleBulkUploadSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block font-bold text-gray-400 uppercase">Document Category</label>
                  <select
                    value={docUploadType}
                    onChange={(e) => setDocUploadType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold"
                  >
                    <option value="circular">BCECE Board Notification Circular</option>
                    <option value="matrix">Official Seat Matrix Breakdown</option>
                    <option value="handbook">Premium Counselling Handbook PDF</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-gray-400 uppercase">Document Title / File Name</label>
                  <input
                    type="text"
                    required
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="e.g. UGEAC 2026 Choice priority guide"
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold"
                  />
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  id="admin-file-upload"
                  accept=".pdf,.xls,.xlsx,.csv"
                  className="hidden"
                  onChange={handleFileSelect}
                />

                {/* Drag and drop selection card */}
                <div
                  onClick={() => document.getElementById("admin-file-upload")?.click()}
                  className={`border border-dashed rounded-2xl py-6 text-center flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all hover:bg-slate-50/50 dark:hover:bg-slate-950/20 ${
                    selectedFile
                      ? "border-emerald-500/50 bg-emerald-500/5"
                      : "border-gray-250 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40"
                  }`}
                >
                  {selectedFile ? (
                    <>
                      <CheckCircle className="w-8 h-8 text-emerald-500 animate-pulse" />
                      <div className="px-4">
                        <span className="font-extrabold text-slate-800 dark:text-gray-250 leading-tight block break-all">
                          {selectedFile.name}
                        </span>
                        <p className="text-[9px] text-gray-400 mt-1 font-bold">
                          Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB | Click to change file
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 text-[#2563EB] animate-bounce" />
                      <div>
                        <span className="font-extrabold text-slate-805 dark:text-white">Choose Bulk Document File</span>
                        <p className="text-[9px] text-gray-405 mt-0.5">Supports PDF, XLS, XLSX, CSV (Max 15MB)</p>
                      </div>
                    </>
                  )}
                </div>

                {isBulkUploading && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase">
                      <span>Uploading documents in bulk...</span>
                      <span>{bulkProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-1.5">
                      <div className="bg-[#2563EB] h-1.5 rounded-full transition-all duration-300" style={{ width: `${bulkProgress}%` }} />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isBulkUploading}
                  className="w-full py-2.5 bg-[#2563EB] hover:bg-[#2563EB]/90 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow"
                >
                  <UploadCloud className="w-4 h-4" />
                  Analyze & Upload Bulk Files
                </button>
              </form>
            </div>

            {/* Document list side column */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-850 pb-2">
                Active Uploader Basket circulars
              </h3>

              <div className="space-y-3">
                {bulkFiles.map((file, i) => (
                  <div key={i} className="p-3 bg-slate-50/50 dark:bg-slate-950 border border-gray-150 dark:border-slate-850 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-blue-500/10 text-[#2563EB] rounded-xl shrink-0">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 dark:text-gray-150 leading-snug">{file.name}</h4>
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{file.type} | Size: {file.size}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[8px] font-extrabold uppercase">
                        {file.status}
                      </span>
                      <button
                        onClick={() => {
                          deleteBulkFile(file.name);
                          showNotification("✓ Document removed from active datastore basket.");
                        }}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3 CONTENT: CUTOFFS DATABASE MANAGER */}
        {/* ==================================================== */}
        {activeTab === "cutoffs" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Injector Card */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-left text-xs">
              <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-3 border-b border-gray-100 dark:border-slate-850 pb-2 flex items-center gap-1.5">
                <Database className="w-5 h-5 text-amber-500" />
                Historical Cutoff Injector
              </h3>

              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                Inject round-wise UGEAC closing and opening cutoffs directly in bulk formats. The predictor matches candidates ranks dynamically against this structured dataset.
              </p>

              <form onSubmit={handleInjectCutoffs} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-400 uppercase">Counselling Session Year</label>
                    <select
                      value={cutoffYear}
                      onChange={(e) => setCutoffYear(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold"
                    >
                      <option value={2026}>2026 Cutoffs (Admissions active)</option>
                      <option value={2025}>2025 Cutoffs (Pre-loaded)</option>
                      <option value={2024}>2024 Cutoffs (Pre-loaded)</option>
                      <option value={2023}>2023 Cutoffs (Pre-loaded)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-gray-400 uppercase">Counselling Seat Allotment Round</label>
                    <select
                      value={cutoffRound}
                      onChange={(e) => setCutoffRound(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold"
                    >
                      <option value={1}>Round 1 Allotment closing</option>
                      <option value={2}>Round 2 Sliding Allotment</option>
                      <option value={3}>Round 3 Mop-Up offline cutoff</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-gray-400 uppercase">Paste Bulk Database Data (CSV / JSON format)</label>
                  <textarea
                    required
                    rows={6}
                    value={bulkCutoffText}
                    onChange={(e) => setBulkCutoffText(e.target.value)}
                    placeholder="e.g. COLLEGE_CODE,BRANCH_CODE,UR_CLOSING,BC_CLOSING,EBC_CLOSING&#10;MIT-MUZAFFARPUR,CSE,1250,1580,1850&#10;BCE-BHAGALPUR,CSE,1800,2100,2400"
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-mono text-[10px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isInjectingCutoffs}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {isInjectingCutoffs ? "Parsing Data Sheet..." : "Load & Merge Cutoffs Database"}
                </button>
              </form>
            </div>

            {/* Cutoffs Explorer & Deletion Table */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-left text-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-2 border-b border-gray-100 dark:border-slate-850">
                <div>
                  <h3 className="text-sm font-bold text-slate-850 dark:text-white flex items-center gap-1.5">
                    <Database className="w-4.5 h-4.5 text-[#2563EB]" />
                    <span>Manage Injected Cutoffs Database ({cutoffs.length})</span>
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Explore, search, filter and remove specific cutoff records from UGEAC datastore</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Are you sure you want to reset all cutoffs to standard 2024-2025 database defaults? Any custom uploads will be replaced.")) {
                      resetCutoffs();
                      showNotification("✓ Cutoffs database reset to baseline defaults!");
                    }
                  }}
                  className="px-3 py-1.5 border border-red-500/25 text-red-500 hover:bg-red-500/5 text-[9px] font-extrabold uppercase rounded-lg cursor-pointer transition-all active:scale-95 animate-pulse"
                >
                  Reset to Defaults
                </button>
              </div>

              {/* Filters Block */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Search text</label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={adminCutoffSearch}
                      onChange={(e) => setAdminCutoffSearch(e.target.value)}
                      placeholder="College or Branch..."
                      className="w-full pl-8 pr-2 py-2 text-[10px] border border-gray-200 dark:border-slate-850 rounded-lg bg-gray-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Year</label>
                  <select
                    value={adminCutoffYear}
                    onChange={(e) => setAdminCutoffYear(e.target.value === "All" ? "All" : Number(e.target.value))}
                    className="w-full px-2 py-2 text-[10px] border border-gray-200 dark:border-slate-850 rounded-lg bg-gray-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="All">All Years</option>
                    <option value={2025}>2025 Session</option>
                    <option value={2024}>2024 Session</option>
                    <option value={2023}>2023 Session</option>
                    <option value={2026}>2026 Session</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Round</label>
                  <select
                    value={adminCutoffRound}
                    onChange={(e) => setAdminCutoffRound(e.target.value === "All" ? "All" : Number(e.target.value))}
                    className="w-full px-2 py-2 text-[10px] border border-gray-200 dark:border-slate-850 rounded-lg bg-gray-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="All">All Rounds</option>
                    <option value={1}>Round 1</option>
                    <option value={2}>Round 2</option>
                    <option value={3}>Round 3 (Mop-Up)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Category</label>
                  <select
                    value={adminCutoffCategory}
                    onChange={(e) => setAdminCutoffCategory(e.target.value)}
                    className="w-full px-2 py-2 text-[10px] border border-gray-200 dark:border-slate-850 rounded-lg bg-gray-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="All">All Categories</option>
                    {["UR", "BC", "EBC", "SC", "ST", "EWS", "RCG"].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table list */}
              <div className="overflow-x-auto text-[10px] max-h-[350px] overflow-y-auto border border-gray-150 dark:border-slate-850 rounded-xl">
                {(() => {
                  const filtered = cutoffs.filter(c => {
                    const matchSearch = adminCutoffSearch === "" || 
                      c.collegeCode.toLowerCase().includes(adminCutoffSearch.toLowerCase()) ||
                      c.branchCode.toLowerCase().includes(adminCutoffSearch.toLowerCase());
                    const matchYear = adminCutoffYear === "All" || c.year === adminCutoffYear;
                    const matchRound = adminCutoffRound === "All" || c.round === adminCutoffRound;
                    const matchCategory = adminCutoffCategory === "All" || c.category === adminCutoffCategory;
                    return matchSearch && matchYear && matchRound && matchCategory;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="text-center py-8 text-gray-400 font-bold">
                        No matching cutoff records found in datastore.
                      </div>
                    );
                  }

                  // Slice results to keep UI lightning fast
                  const sliced = filtered.slice(0, 100);

                  return (
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-gray-455 dark:text-gray-400 font-bold uppercase tracking-wider text-[9px]">
                          <th className="px-4 py-2">College Code</th>
                          <th className="px-4 py-2">Branch</th>
                          <th className="px-4 py-2 text-center">Year</th>
                          <th className="px-4 py-2 text-center">Round</th>
                          <th className="px-4 py-2 text-center">Cat</th>
                          <th className="px-4 py-2 text-center text-[#2563EB]">Opening</th>
                          <th className="px-4 py-2 text-center text-[#138808]">Closing</th>
                          <th className="px-4 py-2 text-right">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-150 dark:divide-slate-800/80 font-bold text-slate-700 dark:text-gray-300">
                        {sliced.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                            <td className="px-4 py-2">{c.collegeCode}</td>
                            <td className="px-4 py-2">
                              <span className="px-1.5 py-0.5 rounded bg-[#FF9933]/10 text-[#FF9933] text-[9px] font-extrabold uppercase">{c.branchCode}</span>
                            </td>
                            <td className="px-4 py-2 text-center">{c.year}</td>
                            <td className="px-4 py-2 text-center">R{c.round}</td>
                            <td className="px-4 py-2 text-center">
                              <span className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[8px] font-extrabold">{c.category}</span>
                            </td>
                            <td className="px-4 py-2 text-center text-[#2563EB]">{c.openingRank}</td>
                            <td className="px-4 py-2 text-center text-[#138808]">{c.closingRank}</td>
                            <td className="px-4 py-2 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  deleteCutoff(c.id);
                                  showNotification(`✓ Removed cutoff record: ${c.collegeCode} - ${c.branchCode} (${c.category})`);
                                }}
                                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                })()}
              </div>
              <div className="mt-3 text-right text-[9px] text-gray-400 font-bold">
                ⚠️ Displaying top 100 matches to ensure fluid browser responsiveness. Clear filters to explore rest of datastore.
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4 CONTENT: COUNSELLING GUIDES STEPS EDIT */}
        {/* ==================================================== */}
        {activeTab === "guides" && (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-left text-xs max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Step selection sidebar (Col-4) */}
            <div className="md:col-span-4 space-y-2 border-r border-gray-100 dark:border-slate-850 pr-4">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Select Counselling Step</h4>
              {[
                "1. Online Registration",
                "2. Merit List & State Rank",
                "3. Choice Filling Phase",
                "4. Choice Locking (OTP)",
                "5. Round 1 Allotment",
                "6. Physical Verification"
              ].map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedGuideIndex(idx);
                    setGuideTitle(step.split(". ")[1]);
                    if (idx === 0) {
                      setGuideSubtitle("UGEAC Portal Setup");
                      setGuideDesc("Candidates must visit BCECE website UGEAC Application Portal and register using JEE Main Roll, phone, and email.");
                    } else if (idx === 1) {
                      setGuideSubtitle("State Merit Cards");
                      setGuideDesc("BCECE Board publishes UGEAC state merits rank cards. Ranks UR and Category are mapped from JEE percentile.");
                    } else {
                      setGuideSubtitle("Counselling Action Protocol");
                      setGuideDesc("Customize this step protocols, rules, and guidelines for the counselling candidate step database.");
                    }
                  }}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    selectedGuideIndex === idx
                      ? "bg-slate-100 dark:bg-slate-800 border-amber-500/40 text-amber-500"
                      : "border-gray-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950"
                  }`}
                >
                  {step}
                </button>
              ))}
            </div>

            {/* Guide Step details form (Col-8) */}
            <form onSubmit={handleUpdateGuide} className="md:col-span-8 space-y-4">
              <h3 className="text-sm font-bold text-slate-850 dark:text-white border-b border-gray-100 dark:border-slate-850 pb-2 flex items-center gap-1.5">
                <FileText className="w-5 h-5 text-blue-500" />
                Manage Step {selectedGuideIndex + 1} Walkthrough Instructions
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-gray-400 uppercase">Step Title</label>
                  <input
                    type="text"
                    required
                    value={guideTitle}
                    onChange={(e) => setGuideTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-gray-400 uppercase">Step Subtitle</label>
                  <input
                    type="text"
                    required
                    value={guideSubtitle}
                    onChange={(e) => setGuideSubtitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-gray-400 uppercase">Protocol & Instruction Guidelines</label>
                <textarea
                  required
                  rows={4}
                  value={guideDesc}
                  onChange={(e) => setGuideDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#2563EB] hover:bg-[#2563EB]/95 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Update Step Walkthrough Guide
              </button>
            </form>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 5 CONTENT: TIMELINE SCHEDULER */}
        {/* ==================================================== */}
        {activeTab === "timeline" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left text-xs">
            
            {/* Add timeline event panel (Col-5) */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-3 border-b border-gray-100 dark:border-slate-850 pb-2 flex items-center gap-1.5">
                <Calendar className="w-5 h-5 text-[#138808]" />
                Milestone Scheduler
              </h3>
              
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                Schedule B.Tech admission key dates. Updates made here reflect instantly on the candidates vertical counselling schedule timeline.
              </p>

              <form onSubmit={handleAddTimelineEvent} className="space-y-4">
                <div className="space-y-1">
                  <label className="block font-bold text-gray-400 uppercase">Counselling Event Name</label>
                  <input
                    type="text"
                    required
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="e.g. UGEAC Round 1 Allotment Publication"
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-gray-400 uppercase">Event Scheduled Dates</label>
                  <input
                    type="text"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    placeholder="e.g. July 02 - July 05, 2026"
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#138808] hover:bg-[#138808]/90 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow"
                >
                  <Plus className="w-4 h-4" />
                  Schedule Milestone
                </button>
              </form>
            </div>

            {/* Active timeline events list (Col-7) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-850 pb-2 flex items-center justify-between">
                <span>Timeline Schedule List</span>
                <span className="text-[10px] text-gray-400 font-bold">Total: {timelineEvents.length} Events</span>
              </h3>

              <div className="space-y-3">
                {timelineEvents.map((ev) => (
                  <div key={ev.id} className="p-3 bg-slate-50/50 dark:bg-slate-950 border border-gray-150 dark:border-slate-850 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-left">
                      <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl shrink-0">
                        <Clock className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 dark:text-gray-150 leading-snug">{ev.event}</h4>
                        <span className="text-[10px] text-gray-400 font-bold">{ev.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleEventStatus(ev.id)}
                        className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide cursor-pointer border ${
                          ev.status === "Active"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : ev.status === "Done"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-slate-100 dark:bg-slate-850 text-gray-500 border-gray-200 dark:border-slate-800"
                        }`}
                        title="Toggle Event Status"
                      >
                        {ev.status}
                      </button>
                      <button
                        onClick={() => {
                          deleteTimelineEvent(ev.id);
                          showNotification("✓ Event unscheduled successfully.");
                        }}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer"
                        title="Unschedule Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 6 CONTENT: STUDENTS & VISITS MANAGEMENT */}
        {/* ==================================================== */}
        {activeTab === "students" && (
          <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {/* Stat 1: Platform Visits */}
              <div className="bg-gradient-to-br from-[#2563EB]/10 to-[#1d4ed8]/5 dark:from-slate-900 dark:to-slate-950 border border-[#2563EB]/15 dark:border-slate-800 rounded-3xl p-5 shadow-sm relative overflow-hidden group">
                <div className="absolute right-4 top-4 opacity-15 text-[#2563EB] group-hover:scale-110 transform transition-transform duration-300">
                  <Users className="w-10 h-10" />
                </div>
                <span className="text-[10px] text-gray-550 font-extrabold uppercase tracking-wider block">Total Platform Visits</span>
                <span className="text-3xl font-black text-slate-800 dark:text-white block mt-1">{totalVisits}</span>
                <span className="text-[10px] text-[#2563EB] font-bold block mt-1.5 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Visitor Session Counters active
                </span>
              </div>

              {/* Stat 2: Registered Students */}
              <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 dark:from-slate-900 dark:to-slate-950 border border-amber-500/15 dark:border-slate-800 rounded-3xl p-5 shadow-sm relative overflow-hidden group">
                <div className="absolute right-4 top-4 opacity-15 text-amber-500 group-hover:scale-110 transform transition-transform duration-300">
                  <Users className="w-10 h-10" />
                </div>
                <span className="text-[10px] text-gray-550 font-extrabold uppercase tracking-wider block">Registered Candidates</span>
                <span className="text-3xl font-black text-slate-800 dark:text-white block mt-1">{registeredUsers.length}</span>
                <span className="text-[10px] text-amber-500 font-bold block mt-1.5">
                  Clearance Level: Student merit records
                </span>
              </div>

              {/* Stat 3: Chat Enquiries */}
              <div className="bg-gradient-to-br from-[#138808]/10 to-[#0f7c05]/5 dark:from-slate-900 dark:to-slate-950 border border-[#138808]/15 dark:border-slate-800 rounded-3xl p-5 shadow-sm relative overflow-hidden group">
                <div className="absolute right-4 top-4 opacity-15 text-[#138808] group-hover:scale-110 transform transition-transform duration-300">
                  <MessageSquare className="w-10 h-10" />
                </div>
                <span className="text-[10px] text-gray-550 font-extrabold uppercase tracking-wider block">AI Chat Enquiries</span>
                <span className="text-3xl font-black text-slate-800 dark:text-white block mt-1">{chatSessions.length}</span>
                <span className="text-[10px] text-[#138808] font-bold block mt-1.5">
                  Visitor logs tracked via AI Chatbot
                </span>
              </div>

              {/* Stat 4: Top Visitor */}
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 dark:from-slate-900 dark:to-slate-950 border border-purple-500/15 dark:border-slate-800 rounded-3xl p-5 shadow-sm relative overflow-hidden group">
                <div className="absolute right-4 top-4 opacity-15 text-purple-500 group-hover:scale-110 transform transition-transform duration-300">
                  <Crown className="w-10 h-10" />
                </div>
                <span className="text-[10px] text-gray-550 font-extrabold uppercase tracking-wider block">Top Portal Visitor</span>
                {(() => {
                  if (!visitorLogs || visitorLogs.length === 0) {
                    return <span className="text-3xl font-black text-slate-800 dark:text-white block mt-1">N/A</span>;
                  }
                  const topLog = [...visitorLogs].sort((a, b) => (b.visitCount || 0) - (a.visitCount || 0))[0];
                  return (
                    <>
                      <span className="text-lg font-black text-slate-800 dark:text-white block mt-1 truncate" title={topLog.name}>
                        {topLog.name}
                      </span>
                      <span className="text-[10px] text-purple-500 font-bold block mt-1.5 flex items-center gap-1">
                        🏆 {topLog.visitCount || 0} visits logged
                      </span>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Main panels grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            {/* Registered Candidates Manager (Col-5) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {isEditingStudent && (
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-850 dark:text-white mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-slate-850 pb-2">
                    <PlusCircle className="w-5 h-5 text-amber-500" />
                    <span>Edit Candidate Details</span>
                  </h3>
                  
                  <form onSubmit={handleUpdateStudent} className="space-y-4">
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase rounded-xl">
                      ⚠️ Editing details for {editingStudentEmail}
                    </div>
                    
                    <div>
                      <label className="block text-[10px] text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wide mb-1.5">Candidate Full Name</label>
                      <input
                        type="text"
                        required
                        value={studentFormName}
                        onChange={(e) => setStudentFormName(e.target.value)}
                        placeholder="e.g. Rahul Kumar"
                        className="w-full px-3 py-2 text-xs border border-gray-200 dark:border-slate-850 rounded-xl bg-gray-50 dark:bg-slate-950 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wide mb-1.5">Student Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            required
                            value={studentFormEmail}
                            onChange={(e) => setStudentFormEmail(e.target.value)}
                            placeholder="e.g. rahul@example.com"
                            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 dark:border-slate-850 rounded-xl bg-gray-50 dark:bg-slate-950 dark:text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wide mb-1.5">UGEAC General Rank</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={studentFormPercentile}
                          onChange={(e) => setStudentFormPercentile(Number(e.target.value))}
                          placeholder="e.g. 4500"
                          className="w-full px-3 py-2 text-xs border border-gray-200 dark:border-slate-850 rounded-xl bg-gray-50 dark:bg-slate-950 dark:text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wide mb-1.5">Account Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                          type="password"
                          required
                          value={studentFormPassword}
                          onChange={(e) => setStudentFormPassword(e.target.value)}
                          placeholder="e.g. candidatePass123"
                          className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 dark:border-slate-850 rounded-xl bg-gray-50 dark:bg-slate-950 dark:text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider shadow cursor-pointer transition-colors"
                      >
                        Save Details
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingStudent(false);
                          setEditingStudentEmail(null);
                          setStudentFormName("");
                          setStudentFormEmail("");
                          setStudentFormPercentile(2364);
                          setStudentFormPassword("");
                        }}
                        className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-extrabold uppercase tracking-wider cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Registered Candidates List */}
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex flex-col gap-3 border-b border-gray-100 dark:border-slate-850 pb-3">
                  <h3 className="text-sm font-bold text-slate-850 dark:text-white flex items-center gap-1.5 justify-between">
                    <span>Candidate Accounts Directory</span>
                    <span className="bg-gray-100 dark:bg-slate-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {registeredUsers.length} total
                    </span>
                  </h3>
                  
                  {/* Premium Tab Selector for Standard & Demo Accounts */}
                  <div className="flex border border-gray-100 dark:border-slate-800 rounded-xl overflow-hidden p-1 bg-gray-50/50 dark:bg-slate-950/60 mt-1">
                    <button
                      type="button"
                      onClick={() => setActiveCandidateFilter("standard")}
                      className={`flex-1 py-1.5 text-[10px] font-extrabold uppercase tracking-wider rounded-lg transition-all ${
                        activeCandidateFilter === "standard"
                          ? "bg-[#2563EB] text-white shadow-sm"
                          : "text-gray-400 hover:text-slate-700 dark:hover:text-white"
                      }`}
                    >
                      👤 Standard ({registeredUsers.filter(u => !u.email.includes(".demo@bihareduconnect.in")).length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCandidateFilter("demo")}
                      className={`flex-1 py-1.5 text-[10px] font-extrabold uppercase tracking-wider rounded-lg transition-all ${
                        activeCandidateFilter === "demo"
                          ? "bg-amber-500 text-white shadow-sm"
                          : "text-gray-400 hover:text-[#FF9933]"
                      }`}
                    >
                      ⚡ Demo/Guest ({registeredUsers.filter(u => u.email.includes(".demo@bihareduconnect.in")).length})
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 dark:border-slate-850 rounded-xl bg-gray-50 dark:bg-slate-950 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                  {registeredUsers.length === 0 ? (
                    <div className="text-center py-6 text-xs text-gray-405">
                      No registered candidates found.
                    </div>
                  ) : (
                    registeredUsers
                      .filter(u => {
                        const isDemo = u.email.includes(".demo@bihareduconnect.in");
                        const matchesFilter = activeCandidateFilter === "demo" ? isDemo : !isDemo;
                        const matchesSearch = u.name.toLowerCase().includes(studentSearch.toLowerCase()) || u.email.toLowerCase().includes(studentSearch.toLowerCase());
                        return matchesFilter && matchesSearch;
                      })
                      .map((stud) => {
                        const isBlocked = blockedEmails.includes(stud.email.toLowerCase().trim());
                        return (
                          <div key={stud.email} className={`p-3 border rounded-xl flex items-center justify-between transition-all ${
                            isBlocked 
                              ? "bg-red-50/30 dark:bg-red-950/5 border-red-200/50 dark:border-red-900/20" 
                              : "bg-slate-50/50 dark:bg-slate-950 border-gray-150 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                          }`}>
                            <div className="flex items-center gap-2.5 text-left min-w-0">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-sm uppercase ${
                                isBlocked 
                                  ? "bg-red-500/10 text-red-500" 
                                  : "bg-amber-500/10 text-amber-500"
                              }`}>
                                {stud.name.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-extrabold text-xs text-slate-800 dark:text-gray-150 leading-tight truncate">{stud.name}</h4>
                                  {stud.isPremium && (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[8px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                                      <Crown className="w-2.5 h-2.5" /> Premium 99
                                    </span>
                                  )}
                                  {isBlocked && (
                                    <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 text-[8px] font-bold uppercase tracking-wider">
                                      Suspended
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-gray-550 dark:text-gray-400 block truncate">{stud.email}</span>
                                <span className="text-[9px] text-[#2563EB] dark:text-[#FF9933] font-bold block mt-0.5">UGEAC Rank: #{Math.round(convertPercentileToUR(stud.percentile))}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {/* Block/Unblock toggle */}
                              <button
                                onClick={() => {
                                  if (isBlocked) {
                                    unblockStudent(stud.email);
                                    showNotification(`✓ Reactivated account for ${stud.name}`);
                                  } else {
                                    if (confirm(`Are you sure you want to suspend/block candidate ${stud.name} (${stud.email})?`)) {
                                      blockStudent(stud.email);
                                      showNotification(`✓ Suspended candidate ${stud.name}`);
                                    }
                                  }
                                }}
                                className={`p-1.5 rounded cursor-pointer transition-colors ${
                                  isBlocked 
                                    ? "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20" 
                                    : "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                                }`}
                                title={isBlocked ? "Unblock Student Access" : "Suspend/Block Student Access"}
                              >
                                {isBlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                              </button>
                              
                              <button
                                onClick={() => {
                                  if (stud.isPremium) {
                                    if (confirm(`Revoke Premium 99 access for ${stud.name}?`)) {
                                      togglePremiumAccess(stud.email, false);
                                    }
                                  } else {
                                    if (confirm(`Grant Premium 99 access to ${stud.name}?`)) {
                                      togglePremiumAccess(stud.email, true);
                                    }
                                  }
                                }}
                                className={`p-1.5 rounded cursor-pointer transition-colors ${
                                  stud.isPremium 
                                    ? "text-amber-500 bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-900/30" 
                                    : "text-gray-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:text-amber-500"
                                }`}
                                title={stud.isPremium ? "Revoke Premium 99 Access" : "Grant Premium 99 Access"}
                              >
                                <Crown className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleStartEditStudent(stud)}
                                className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded cursor-pointer transition-colors"
                                title="Edit Details"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              
                              <button
                                onClick={() => handleDeleteStudent(stud.email)}
                                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer transition-colors"
                                title="Remove Registration"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            </div>

            {/* AI Counselling Visit Chats (Logs Viewer) (Col-7) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-850 pb-3">
                <div className="text-left">
                  <h3 className="text-sm font-bold text-slate-850 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#2563EB]" />
                    <span>Student AI Chat Visit Logs</span>
                    <span className="bg-[#2563EB]/10 text-[#2563EB] text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {chatSessions.length} sessions
                    </span>
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Monitors real-time chatbot interactions and visitor analytics</p>
                </div>
                
                <div className="flex gap-2">
                  {chatSessions.length > 0 && (
                    <button
                      onClick={async () => {
                        if (confirm("Clear all captured student AI chat logs?")) {
                          await clearAllChatSessions();
                          setSelectedSessionId(null);
                          showNotification("✓ All visitor logs cleared successfully.");
                        }
                      }}
                      className="px-2.5 py-1.5 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase rounded-lg hover:bg-red-500/5 cursor-pointer transition-colors"
                    >
                      Clear Logs
                    </button>
                  )}
                  <button
                    onClick={handleGenerateMockChats}
                    className="px-2.5 py-1.5 border border-[#2563EB]/25 text-[#2563EB] text-[10px] font-bold uppercase rounded-lg hover:bg-[#2563EB]/5 cursor-pointer transition-colors"
                  >
                    Generate Test Data
                  </button>
                </div>
              </div>

              {chatSessions.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl bg-gray-50/50 dark:bg-slate-950/20 gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-gray-400">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div className="max-w-sm">
                    <h4 className="font-extrabold text-sm text-slate-700 dark:text-gray-300">No Captures Recorded</h4>
                    <p className="text-[11px] text-gray-400 mt-1">Logs dynamically capture chatbot visitor dialogue details. Click &apos;Generate Test Data&apos; to instantly view interactive chat histories!</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[500px]">
                  {/* Left Column: Sessions List (Col-4) */}
                  <div className="md:col-span-4 border-r border-gray-150 dark:border-slate-800 pr-2 overflow-y-auto space-y-2 max-h-full">
                    {chatSessions.map((session) => {
                      const isSelected = selectedSessionId === session.id;
                      return (
                        <button
                          key={session.id}
                          onClick={() => setSelectedSessionId(session.id)}
                          className={`w-full p-2.5 text-left rounded-xl transition-all border flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? "bg-[#2563EB]/10 border-[#2563EB]/30 text-slate-800 dark:text-white"
                              : "border-transparent bg-slate-50/40 dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/60 text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              <span className="font-extrabold text-xs leading-none truncate block">{session.studentName}</span>
                            </div>
                            <span className="text-[9px] text-gray-400 block truncate mt-1">{session.studentEmail}</span>
                            <span className="text-[8px] text-[#2563EB] dark:text-[#FF9933] font-bold block mt-0.5">UGEAC Rank: #{Math.round(convertPercentileToUR(session.percentile))}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-1" />
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Column: Selected Transcript Bubble Flow (Col-8) */}
                  <div className="md:col-span-8 flex flex-col h-full bg-gray-50 dark:bg-slate-950/30 rounded-2xl overflow-hidden border border-gray-150 dark:border-slate-850">
                    {(() => {
                      const session = chatSessions.find(s => s.id === selectedSessionId);
                      if (!session) return (
                        <div className="flex-1 flex items-center justify-center text-xs text-gray-400">
                          Select a session to view transcript
                        </div>
                      );

                      return (
                        <>
                          {/* Selected Header */}
                          <div className="bg-slate-100 dark:bg-slate-900 px-4 py-3 border-b border-gray-155 dark:border-slate-800 text-left flex items-center justify-between">
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-tight truncate">{session.studentName}</h4>
                              <span className="text-[9px] text-gray-450 block truncate">{session.studentEmail} &bull; UGEAC Rank: #{Math.round(convertPercentileToUR(session.percentile))}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] bg-slate-200 dark:bg-slate-800 text-gray-600 dark:text-gray-350 px-2 py-1 rounded font-extrabold uppercase shrink-0">
                                {session.date}
                              </span>
                              <button
                                onClick={async () => {
                                  if (confirm(`Delete chat log for ${session.studentName}?`)) {
                                    await deleteChatSession(session.id);
                                    setSelectedSessionId(null);
                                    showNotification("✓ Chat log deleted successfully.");
                                  }
                                }}
                                className="p-1 hover:bg-red-500/10 text-red-500 rounded transition-colors cursor-pointer flex items-center justify-center"
                                title="Delete Log"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Bubble list */}
                          <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {session.messages.map((m: any, idx: number) => {
                              const isUser = m.sender === "user";
                              return (
                                <div key={idx} className={`flex gap-2 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                                  {/* Profile Icon */}
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] text-white shadow-sm font-bold ${
                                    isUser ? "bg-[#2563EB]" : "bg-gradient-to-tr from-[#FF9933] to-[#138808]"
                                  }`}>
                                    {isUser ? "S" : "AI"}
                                  </div>
                                  <div>
                                    <div className={`p-2.5 rounded-xl text-[11px] leading-relaxed whitespace-pre-line text-left shadow-sm border ${
                                      isUser
                                        ? "bg-[#2563EB] text-white border-[#2563EB]/10 rounded-tr-none"
                                        : "bg-white dark:bg-slate-800 text-slate-850 dark:text-gray-100 border-gray-100 dark:border-slate-700 rounded-tl-none"
                                    }`}>
                                      {m.text}
                                    </div>
                                    <span className={`text-[8px] text-gray-400 mt-0.5 block ${isUser ? "text-right" : "text-left"}`}>
                                      {m.timestamp}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
            </div>

            {/* Detailed Platform Visitor Log Tracking Table */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-4 mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-slate-850 pb-3 text-left">
                <div>
                  <h3 className="text-sm font-bold text-slate-850 dark:text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#138808]" />
                    <span>Platform Visitor Visit Logging Table</span>
                    <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      Real-time Logs
                    </span>
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Tracks exactly who loaded the portal, their candidate credentials, UGEAC General Rank, and aggregate visits count.
                  </p>
                </div>
                
                {/* Sort Segmented Control Toggle */}
                <div className="flex border border-gray-150 dark:border-slate-800 rounded-xl overflow-hidden p-1 bg-gray-50/50 dark:bg-slate-950/60 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => setVisitorLogSort("recent")}
                    className={`px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      visitorLogSort === "recent"
                        ? "bg-[#138808] text-white shadow-sm"
                        : "text-gray-400 hover:text-slate-700 dark:hover:text-white"
                    }`}
                  >
                    🕒 Recent Visits
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisitorLogSort("top")}
                    className={`px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      visitorLogSort === "top"
                        ? "bg-amber-500 text-white shadow-sm"
                        : "text-gray-400 hover:text-[#FF9933]"
                    }`}
                  >
                    🔥 Top Visitors
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-slate-850">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 text-gray-500 dark:text-gray-400 font-extrabold uppercase text-[9px] tracking-wider border-b border-gray-100 dark:border-slate-850">
                      <th className="p-3.5">Visitor Identity</th>
                      <th className="p-3.5">Email Address</th>
                      <th className="p-3.5">UGEAC Rank (Est.)</th>
                      <th className="p-3.5 text-center">Time Spent</th>
                      <th className="p-3.5 text-center">Platform Visits</th>
                      <th className="p-3.5 text-right">Last Visit Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-850">
                    {(() => {
                      if (!visitorLogs || visitorLogs.length === 0) {
                        return (
                          <tr>
                            <td colSpan={6} className="p-6 text-center text-gray-400">
                              No visitor logs captured yet.
                            </td>
                          </tr>
                        );
                      }
                      
                      const maxVisits = Math.max(...visitorLogs.map(l => l.visitCount || 0));
                      const sortedLogs = [...visitorLogs];
                      if (visitorLogSort === "top") {
                        sortedLogs.sort((a, b) => (b.visitCount || 0) - (a.visitCount || 0));
                      }
                      
                      return sortedLogs.map((log) => {
                        const isTopVisitor = log.visitCount && log.visitCount === maxVisits && maxVisits > 0;
                        return (
                          <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                            <td className="p-3.5 font-bold">
                              <div className="flex items-center gap-2">
                                <span className="text-slate-800 dark:text-gray-200">{log.name}</span>
                                {isTopVisitor && (
                                  <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[8px] font-extrabold uppercase flex items-center gap-1 shrink-0">
                                    <Crown className="w-2.5 h-2.5 text-amber-500" /> Top Visitor
                                  </span>
                                )}
                                {log.role === "Standard" ? (
                                <span className="px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[8px] font-extrabold uppercase">
                                  Standard
                                </span>
                              ) : log.role === "Guest" ? (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[8px] font-extrabold uppercase">
                                  Guest
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.2 rounded bg-slate-500/10 text-gray-500 border border-gray-205 dark:border-slate-800 text-[8px] font-extrabold uppercase">
                                  Anon
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3.5 text-gray-500 dark:text-gray-450 font-semibold">{log.email}</td>
                          <td className="p-3.5 font-extrabold text-[#2563EB] dark:text-[#FF9933]">
                            {log.percentile !== undefined ? `#${Math.round(convertPercentileToUR(log.percentile))}` : "N/A"}
                          </td>
                          <td className="p-3.5 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 font-black text-[10px]">
                              {log.totalSessionTime ? (log.totalSessionTime < 60 ? `${log.totalSessionTime}s` : log.totalSessionTime < 3600 ? `${Math.floor(log.totalSessionTime / 60)}m ${log.totalSessionTime % 60}s` : `${Math.floor(log.totalSessionTime / 3600)}h ${Math.floor((log.totalSessionTime % 3600) / 60)}m`) : "0s"}
                            </span>
                          </td>
                          <td className="p-3.5 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-[#2563EB] font-black text-[10px]">
                              {log.visitCount} visits
                            </span>
                          </td>
                          <td className="p-3.5 text-right font-bold text-gray-400 dark:text-slate-500 text-[10px]">
                            {log.lastVisitTime}
                          </td>
                        </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 7 CONTENT: SITE SETTINGS */}
      {/* ==================================================== */}
      {activeTab === "settings" && (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm text-left max-w-4xl mx-auto space-y-8 animate-fadeIn">
          {/* Header */}
          <div className="border-b border-gray-150 dark:border-slate-850 pb-4">
            <h2 className="text-xl font-extrabold text-slate-850 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-6 h-6 text-amber-500" />
              Global Site Configurations
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Customize portal integrations, links, and premium counselling feature variables in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Link Edit Form (Col-7) */}
            <form onSubmit={handleSaveSettings} className="md:col-span-7 space-y-5">
              <div className="bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-gray-300 flex items-center gap-1.5">
                  <span className="p-1 rounded bg-[#25D366]/10 text-[#25D366] flex items-center justify-center">
                    💬
                  </span>
                  WhatsApp Group Settings
                </h3>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase">
                    Premium Support Link
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="e.g. https://wa.me/919999999999 or chat invite link"
                    value={settingsWhatsappLink}
                    onChange={(e) => setSettingsWhatsappLink(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200"
                  />
                  <p className="text-[10px] text-gray-400 leading-normal">
                    This link will be bound to the <strong>💬 Join WhatsApp Group</strong> button on the candidate dashboard and premium counselling guide page.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-[#138808] hover:shadow-lg hover:shadow-amber-500/10 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Site Configurations
              </button>
            </form>

            {/* Interactive Realtime Live Preview (Col-5) */}
            <div className="md:col-span-5 space-y-4">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Live Preview (Guide Page view)
              </h4>
              <div className="border border-dashed border-gray-200 dark:border-slate-800 rounded-2xl p-5 bg-slate-50/50 dark:bg-slate-950/20 text-center relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                <div className="space-y-3 text-left">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-[#D97706] text-[8px] font-extrabold uppercase tracking-wider">
                    ⭐ Premium Advantage
                  </div>
                  <h5 className="font-extrabold text-slate-850 dark:text-white text-xs leading-snug">
                    Unlock Expert Bihar Engineering <span className="bg-gradient-to-r from-[#FF9933] to-[#138808] bg-clip-text text-transparent">Counselling Handbook</span>
                  </h5>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    Get access to rank-wise choices, placement excel trackers, and direct group help.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 text-left">
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-black rounded-lg shrink-0">
                    ✓ Premium Unlocked
                  </span>
                  <a
                    href={settingsWhatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-emerald-500 text-white hover:bg-emerald-600 shadow shadow-emerald-500/15 text-[9px] font-extrabold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1 cursor-pointer shrink-0"
                    title="Simulated Link Button"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Mock click: This will open ${settingsWhatsappLink} in a new tab.`);
                    }}
                  >
                    💬 Join Group
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      </div>
    </AuthGate>
  );
}
