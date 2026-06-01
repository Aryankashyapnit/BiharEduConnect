"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { College } from "../../data/colleges";
import { AuthGate } from "../../components/AuthGate";
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
  PlusCircle,
  Search,
  ChevronRight
} from "lucide-react";

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
    totalVisits
  } = useApp();

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

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<"colleges" | "bulk" | "cutoffs" | "guides" | "timeline" | "students">("colleges");

  // Tab 6: Students CRUD & Visit Chat states
  const [studentSearch, setStudentSearch] = useState("");
  const [studentFormName, setStudentFormName] = useState("");
  const [studentFormEmail, setStudentFormEmail] = useState("");
  const [studentFormPercentile, setStudentFormPercentile] = useState<number>(90.0);
  const [studentFormPassword, setStudentFormPassword] = useState("");
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [editingStudentEmail, setEditingStudentEmail] = useState<string | null>(null);
  
  // Chat Logs viewer states
  const [chatSessions, setChatSessions] = useState<any[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bihareduconnect_chat_sessions");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setChatSessions(parsed);
          if (parsed.length > 0) {
            setSelectedSessionId(parsed[0].id);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [activeTab]);

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
    const res = registerUser(studentFormName, studentFormEmail, studentFormPercentile, studentFormPassword);
    if (res.success) {
      showNotification(`✓ Registered candidate ${studentFormName} successfully!`);
      setStudentFormName("");
      setStudentFormEmail("");
      setStudentFormPercentile(90.0);
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
    const updated = {
      name: studentFormName.trim(),
      email: studentFormEmail.trim(),
      percentile: studentFormPercentile,
      password: studentFormPassword.trim()
    };
    const res = updateRegisteredUser(editingStudentEmail, updated);
    if (res.success) {
      showNotification("✓ Candidate details updated successfully.");
      setIsEditingStudent(false);
      setEditingStudentEmail(null);
      setStudentFormName("");
      setStudentFormEmail("");
      setStudentFormPercentile(90.0);
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
    setStudentFormPercentile(stud.percentile);
    setStudentFormPassword(stud.password || "");
  };

  const handleDeleteStudent = (email: string) => {
    if (confirm(`Are you sure you want to delete registration for ${email}?`)) {
      deleteRegisteredUser(email);
      showNotification("✓ Candidate registration removed.");
    }
  };

  const handleGenerateMockChats = () => {
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
    localStorage.setItem("bihareduconnect_chat_sessions", JSON.stringify(mockSessions));
    setChatSessions(mockSessions);
    setSelectedSessionId(mockSessions[0].id);
    showNotification("✓ Mock chat sessions generated for testing!");
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
  const [bulkFiles, setBulkFiles] = useState<Array<{
    name: string;
    type: string;
    size: string;
    date: string;
    status: "Uploaded" | "Pending";
  }>>([
    { name: "UGEAC_2026_Counselling_Handbook.pdf", type: "Circular Guide", size: "3.4 MB", date: "2026-06-01", status: "Uploaded" },
    { name: "Seat_Matrix_Govt_Engineering_2026.xlsx", type: "Seat Matrix", size: "850 KB", date: "2026-05-28", status: "Uploaded" },
    { name: "Official_Information_Bulletin_2026.pdf", type: "BCECE Circular", size: "6.2 MB", date: "2026-05-20", status: "Uploaded" }
  ]);

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

      setBulkFiles((prev) => [
        {
          name: finalFileName,
          type: docUploadType === "circular" ? "Official circular" : docUploadType === "matrix" ? "Seat Matrix" : "Handbook PDF",
          size: actualSize,
          date: new Date().toISOString().split("T")[0],
          status: "Uploaded"
        },
        ...prev
      ]);
      
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
      setIsInjectingCutoffs(false);
      setBulkCutoffText("");
      showNotification(`✓ Successfully loaded and merged ${cutoffYear} Round ${cutoffRound} closing cutoffs into prediction engines.`);
    }, 1800);
  };

  // ==========================================
  // TAB 4: COUNSELLING GUIDES LOCAL STATES
  // ==========================================
  const [selectedGuideIndex, setSelectedGuideIndex] = useState(0);
  const [guideTitle, setGuideTitle] = useState("Online Registration");
  const [guideSubtitle, setGuideSubtitle] = useState("UGEAC Portal Setup");
  const [guideDesc, setGuideDesc] = useState("Candidates must visit the official BCECE Board website and click on the 'UGEAC Online Application Portal'. Register using JEE Main Roll, password, mobile, and email.");

  const handleUpdateGuide = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification(`✓ Step ${selectedGuideIndex + 1} (${guideTitle}) updated in walkthrough guidelines database!`);
  };

  // ==========================================
  // TAB 5: TIMELINE SCHEDULER STATES
  // ==========================================
  const [timelineEvents, setTimelineEvents] = useState([
    { id: 1, event: "Online Registration Start", date: "June 05, 2026", status: "Active" },
    { id: 2, event: "UGEAC Merit List Publication", date: "June 18, 2026", status: "Upcoming" },
    { id: 3, event: "Choice Filling & Locking Phase", date: "June 22 - June 26, 2026", status: "Upcoming" },
    { id: 4, event: "Round 1 Seat Allotment Publication", date: "July 02, 2026", status: "Upcoming" }
  ]);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");

  const handleAddTimelineEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !newEventDate) return;

    setTimelineEvents((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        event: newEventTitle,
        date: newEventDate,
        status: "Upcoming"
      }
    ]);
    setNewEventTitle("");
    setNewEventDate("");
    showNotification("✓ Event scheduled on candidates vertical timelines!");
  };

  const handleToggleEventStatus = (id: number) => {
    setTimelineEvents((prev) =>
      prev.map((ev) =>
        ev.id === id
          ? { ...ev, status: ev.status === "Active" ? "Done" : ev.status === "Upcoming" ? "Active" : "Upcoming" }
          : ev
      )
    );
    showNotification("✓ Milestone event state updated.");
  };

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
            
            <div className="flex gap-4 shrink-0 text-left">
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
            { id: "students", label: "Students & Visits", icon: Users }
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
                  </div>

                  <div>
                    <label className="block font-extrabold text-gray-450 uppercase mb-1">Official College Link</label>
                    <input
                      type="url" required value={formWebsite} onChange={(e) => setFormWebsite(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-extrabold text-gray-450 uppercase mb-1">Image URL Address</label>
                    <input
                      type="url" required value={formImage} onChange={(e) => setFormImage(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
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

            {/* Colleges datastore grid layout */}
            <div className={(isCreating || isEditing) ? "lg:col-span-7" : "lg:col-span-12"}>
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden text-left">
                <div className="px-5 py-4 border-b border-gray-200 dark:border-slate-850 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950">
                  <h4 className="font-extrabold text-slate-850 dark:text-white flex items-center gap-1.5 text-sm">
                    <Building className="w-4.5 h-4.5 text-amber-500" />
                    BCECE Colleges Directory ({colleges.length})
                  </h4>

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
                          <td className="px-5 py-3.5 text-center text-[#2563EB]">
                            {c.branches.length}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex gap-2 justify-end">
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
                          setBulkFiles((prev) => prev.filter((_, idx) => idx !== i));
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
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-left text-xs max-w-4xl mx-auto">
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
                          setTimelineEvents((prev) => prev.filter((item) => item.id !== ev.id));
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              {/* Stat 1: Platform Visits */}
              <div className="bg-gradient-to-br from-[#2563EB]/10 to-[#1d4ed8]/5 dark:from-slate-900 dark:to-slate-950 border border-[#2563EB]/15 dark:border-slate-800 rounded-3xl p-5 shadow-sm relative overflow-hidden group">
                <div className="absolute right-4 top-4 opacity-15 text-[#2563EB] group-hover:scale-110 transform transition-transform duration-300">
                  <Users className="w-10 h-10" />
                </div>
                <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider block">Total Platform Visits</span>
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
                <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider block">Registered Candidates</span>
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
                <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider block">AI Chat Enquiries</span>
                <span className="text-3xl font-black text-slate-800 dark:text-white block mt-1">{chatSessions.length}</span>
                <span className="text-[10px] text-[#138808] font-bold block mt-1.5">
                  Visitor logs tracked via AI Chatbot
                </span>
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
                        <label className="block text-[10px] text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wide mb-1.5">JEE Main Percentile</label>
                        <input
                          type="number"
                          step="0.0001"
                          min="0"
                          max="100"
                          required
                          value={studentFormPercentile}
                          onChange={(e) => setStudentFormPercentile(Number(e.target.value))}
                          placeholder="e.g. 92.54"
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
                          setStudentFormPercentile(90.0);
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
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-850 pb-2">
                  <h3 className="text-sm font-bold text-slate-850 dark:text-white flex items-center gap-1.5">
                    <span>Registered Candidates List</span>
                    <span className="bg-gray-100 dark:bg-slate-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {registeredUsers.length}
                    </span>
                  </h3>
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
                      .filter(u => 
                        u.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                        u.email.toLowerCase().includes(studentSearch.toLowerCase())
                      )
                      .map((stud) => (
                        <div key={stud.email} className="p-3 bg-slate-50/50 dark:bg-slate-950 border border-gray-150 dark:border-slate-850 rounded-xl flex items-center justify-between transition-all hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <div className="flex items-center gap-2.5 text-left min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 font-extrabold text-sm uppercase">
                              {stud.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-extrabold text-xs text-slate-800 dark:text-gray-150 leading-tight truncate">{stud.name}</h4>
                              <span className="text-[10px] text-gray-550 dark:text-gray-400 block truncate">{stud.email}</span>
                              <span className="text-[9px] text-[#2563EB] dark:text-[#FF9933] font-bold block mt-0.5">Percentile: {stud.percentile}%</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
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
                      ))
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
                      onClick={() => {
                        if (confirm("Clear all captured student AI chat logs?")) {
                          localStorage.removeItem("bihareduconnect_chat_sessions");
                          setChatSessions([]);
                          setSelectedSessionId(null);
                          showNotification("✓ All visitor visitor logs cleared successfully.");
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
                            <span className="text-[8px] text-[#2563EB] dark:text-[#FF9933] font-bold block mt-0.5">JEEM: {session.percentile}%</span>
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
                          <div className="bg-slate-100 dark:bg-slate-900 px-4 py-2 border-b border-gray-155 dark:border-slate-800 text-left flex items-center justify-between">
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-tight truncate">{session.studentName}</h4>
                              <span className="text-[9px] text-gray-450 block truncate">{session.studentEmail} &bull; JEE: {session.percentile}%</span>
                            </div>
                            <span className="text-[9px] bg-slate-200 dark:bg-slate-800 text-gray-600 dark:text-gray-350 px-2 py-0.5 rounded font-extrabold uppercase shrink-0">
                              {session.date}
                            </span>
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
        </div>
      )}

      </div>
    </AuthGate>
  );
}
