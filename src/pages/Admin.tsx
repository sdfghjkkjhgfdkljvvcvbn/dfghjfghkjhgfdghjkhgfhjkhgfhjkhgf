import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Project, ContactMessage } from "../types";
import { transformDriveUrl } from "../utils/driveHelper";
import { Lock, LogOut, Key, User, Plus, Trash2, Edit2, Calendar, FileText, Check, Phone, Mail, MessageSquare, RefreshCw, Eye, Sparkles, Loader2, AlertCircle } from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Administrative dashboard states
  const [activeTab, setActiveTab] = useState<"projects" | "contacts">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // CRUD Form states (supports BOTH add and update operations)
  const [isEditing, setIsEditing] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    category: "Residential",
    mediaUrl: "",
    mediaType: "image" as "image" | "video"
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submittingForm, setSubmittingForm] = useState(false);

  // Apply `noindex` SEO meta-tag to protect this view
  useEffect(() => {
    document.title = "Admin Portal | Parbati Interior";
    
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  // Check for stored token on load
  useEffect(() => {
    async function verifyStoredToken() {
      const storedToken = localStorage.getItem("parbati_admin_token");
      if (storedToken) {
        try {
          const res = await fetch("/api/admin/verify", {
            headers: {
              "Authorization": `Bearer ${storedToken}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.valid) {
              setToken(storedToken);
              setIsAuthenticated(true);
            } else {
              localStorage.removeItem("parbati_admin_token");
            }
          } else {
            localStorage.removeItem("parbati_admin_token");
          }
        } catch {
          localStorage.removeItem("parbati_admin_token");
        }
      }
      setCheckingAuth(false);
    }
    verifyStoredToken();
  }, []);

  // Fetch projects and contacts if authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      loadDashboardData();
    }
  }, [isAuthenticated, token]);

  async function loadDashboardData() {
    setLoadingData(true);
    try {
      // 1. Fetch Projects
      const projRes = await fetch("/api/projects");
      if (projRes.ok) {
        const projData = await projRes.json();
        setProjects(projData);
      }

      // 2. Fetch Contact Leads
      const contactRes = await fetch("/api/admin/contacts", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (contactRes.ok) {
        const contactData = await contactRes.json();
        setContacts(contactData);
      }
    } catch (error) {
      console.error("Error loading dashboard logs:", error);
    } finally {
      setLoadingData(false);
    }
  }

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!usernameInput.trim() || !passwordInput.trim()) {
      setLoginError("Please enter both username and password.");
      return;
    }

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("parbati_admin_token", data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        setLoginError("");
      } else {
        setLoginError(data.error || "Incorrect login credentials. Try again.");
      }
    } catch {
      setLoginError("Network error. Make sure your local server is online.");
    }
  };

  // Logout routine
  const handleLogout = () => {
    localStorage.removeItem("parbati_admin_token");
    setToken(null);
    setIsAuthenticated(false);
    navigate("/"); // Redirect to public home
  };

  // Project Add / Edit form submit handler
  const handleProjectFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    const { title, description, category, mediaUrl, mediaType } = projectForm;

    if (!title.trim() || !description.trim() || !mediaUrl.trim()) {
      setFormError("All input fields are required.");
      return;
    }

    setSubmittingForm(true);

    try {
      const url = isEditing
        ? `/api/projects/${editingProjectId}`
        : "/api/projects";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(projectForm)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormSuccess(
          isEditing
            ? "Project updated successfully!"
            : "New portfolio project added successfully!"
        );
        
        // Reset form inputs
        setProjectForm({
          title: "",
          description: "",
          category: "Residential",
          mediaUrl: "",
          mediaType: "image"
        });
        setIsEditing(false);
        setEditingProjectId(null);
        
        // Reload projects
        loadDashboardData();
      } else {
        setFormError(data.error || "Failed to persist project file.");
      }
    } catch {
      setFormError("Network communication failure. Please verify.");
    } finally {
      setSubmittingForm(false);
    }
  };

  // Populate form with current project details for Editing
  const startEditProject = (proj: Project) => {
    setIsEditing(true);
    setEditingProjectId(proj.id);
    setProjectForm({
      title: proj.title,
      description: proj.description,
      category: proj.category,
      mediaUrl: proj.mediaUrl,
      mediaType: proj.mediaType
    });
    setFormError("");
    setFormSuccess("");
    // Scroll form into focus on smaller screens
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel edit state
  const cancelEdit = () => {
    setIsEditing(false);
    setEditingProjectId(null);
    setProjectForm({
      title: "",
      description: "",
      category: "Residential",
      mediaUrl: "",
      mediaType: "image"
    });
    setFormError("");
    setFormSuccess("");
  };

  // Project Delete handler
  const deleteProject = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this project from the database?")) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete project file.");
      }
    } catch {
      alert("Error contacting server database.");
    }
  };

  // Contact Inquiry lead delete handler
  const deleteContactInquiry = async (id: string) => {
    if (!window.confirm("Are you sure you want to clear this customer inquiry lead?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        setContacts((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert("Failed to delete contact request log.");
      }
    } catch {
      alert("Error communicating with server.");
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="h-10 w-10 text-brand-red animate-spin" />
        <span className="text-sm font-bold text-gray-400 mt-4 uppercase tracking-widest">Verifying Admin Token...</span>
      </div>
    );
  }

  // ==========================================
  // VIEW 1: MINIMALIST LOGIN SCREEN (UNAUTHENTICATED)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div id="admin-login-view" className="min-h-screen bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
        <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6">
          
          <div className="text-center space-y-2">
            <div className="mx-auto h-12 w-12 bg-brand-red text-white p-3 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25">
              <Lock className="h-6 w-6 stroke-[2.2]" />
            </div>
            <h2 className="font-display text-2xl font-extrabold text-white tracking-tight">
              Parbati Portal Gateway
            </h2>
            <p className="text-xs text-gray-500">
              This administrative interface is locked. Unauthorized access is forbidden.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl space-y-6">
            
            {loginError && (
              <div className="p-3 bg-red-950 border border-red-900 text-red-300 text-xs rounded-xl flex items-center space-x-2.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center">
                  <User className="h-3.5 w-3.5 text-brand-red mr-1.5" />
                  Admin Username
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Enter administrator username"
                  className="w-full bg-gray-950 border border-gray-800 focus:border-brand-red text-white text-sm px-4 py-3 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-brand-red transition-all"
                  autoComplete="username"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center">
                  <Key className="h-3.5 w-3.5 text-brand-red mr-1.5" />
                  Passphrase
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter secure master password"
                  className="w-full bg-gray-950 border border-gray-800 focus:border-brand-red text-white text-sm px-4 py-3 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-brand-red transition-all"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center py-3 px-4 bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-500/10 uppercase tracking-wider"
              >
                Sign In Security
              </button>

            </form>

            <div className="text-center pt-2">
              <a href="/" className="text-[10px] text-gray-500 hover:text-gray-400 hover:underline">
                Return to public homepage
              </a>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: AUTHENTICATED ADMINISTRATOR PANEL
  // ==========================================
  return (
    <div id="admin-dashboard-view" className="min-h-screen bg-gray-50">
      
      {/* Admin Panel Header */}
      <nav className="bg-gray-950 text-white border-b border-gray-900 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-brand-red text-white p-1.5 rounded-lg">
                <Lock className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="block font-display text-base font-black tracking-tight">Parbati Interior Admin Hub</span>
                <span className="block text-[8px] font-mono tracking-widest text-gray-400 uppercase">Secure Database Management</span>
              </div>
            </div>

            {/* Logout button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-red-950 border border-red-900 text-red-300 text-xs font-bold rounded-lg hover:bg-brand-red hover:text-white transition-colors focus:outline-hidden"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout Console</span>
              </button>
            </div>

          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 5 COLUMNS: CRUD PROJECT MANAGER INPUT FORM */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/60 shadow-xs space-y-6">
              
              <div>
                <span className="text-[10px] font-extrabold text-brand-red uppercase tracking-widest block mb-1">
                  {isEditing ? "Modify Project File" : "Add Portfolio File"}
                </span>
                <h3 className="font-display text-xl font-bold text-gray-900 flex items-center">
                  <Sparkles className="h-5 w-5 text-amber-500 mr-2 shrink-0" />
                  {isEditing ? "Edit Project Details" : "Create New Project"}
                </h3>
              </div>

              {/* Success / Error Banners */}
              {formError && (
                <div className="p-3.5 bg-red-50 border border-red-100 text-brand-red text-xs rounded-xl flex items-start space-x-2">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-xl flex items-start space-x-2">
                  <Check className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <form onSubmit={handleProjectFormSubmit} className="space-y-4">
                
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="E.g., High-Gloss Modular Kitchen Setup"
                    className="w-full text-sm border border-gray-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red px-3.5 py-2.5 rounded-xl focus:outline-hidden transition-all"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Description &amp; Specifications
                  </label>
                  <textarea
                    rows={4}
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    placeholder="Describe design specifications, materials used, fittings, and location details..."
                    className="w-full text-sm border border-gray-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red px-3.5 py-2.5 rounded-xl focus:outline-hidden transition-all resize-none"
                  />
                </div>

                {/* Grid Category & Media Type */}
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Category Selection */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Design Category
                    </label>
                    <select
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                      className="w-full text-sm border border-gray-200 focus:border-brand-red px-3 py-2.5 rounded-xl focus:outline-hidden bg-white"
                    >
                      <option value="Residential">Residential</option>
                      <option value="Modular Kitchen">Modular Kitchen</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Custom Furniture">Custom Furniture</option>
                      <option value="General Construction">General Construction</option>
                    </select>
                  </div>

                  {/* Media Type */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Media Type
                    </label>
                    <select
                      value={projectForm.mediaType}
                      onChange={(e) => setProjectForm({ ...projectForm, mediaType: e.target.value as "image" | "video" })}
                      className="w-full text-sm border border-gray-200 focus:border-brand-red px-3 py-2.5 rounded-xl focus:outline-hidden bg-white"
                    >
                      <option value="image">Image Asset</option>
                      <option value="video">Short Video</option>
                    </select>
                  </div>

                </div>

                {/* Media Url */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Google Drive Share Link / Public URL
                  </label>
                  <input
                    type="text"
                    value={projectForm.mediaUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, mediaUrl: e.target.value })}
                    placeholder="https://drive.google.com/file/d/... or Unsplash URL"
                    className="w-full text-sm border border-gray-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red px-3.5 py-2.5 rounded-xl focus:outline-hidden transition-all"
                  />
                  <p className="text-[10px] text-gray-400">
                    Paste standard Google Drive public share links. The helper transforms it dynamically.
                  </p>
                </div>

                {/* Actions Row */}
                <div className="pt-2 flex space-x-3">
                  <button
                    type="submit"
                    disabled={submittingForm}
                    className="flex-1 inline-flex items-center justify-center py-3 px-4 bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-500/10 disabled:opacity-50"
                  >
                    {submittingForm ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                        Saving to JSON...
                      </>
                    ) : isEditing ? (
                      "Apply Changes"
                    ) : (
                      "Publish Project"
                    )}
                  </button>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>

              </form>

            </div>
          </div>

          {/* RIGHT 7 COLUMNS: TAB CONTROLLER FOR RETRIEVING DATA */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tabs Trigger Bar */}
            <div className="bg-white p-2 rounded-2xl border border-gray-200/60 shadow-xs flex space-x-2">
              <button
                onClick={() => setActiveTab("projects")}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-2 ${
                  activeTab === "projects"
                    ? "bg-brand-red text-white shadow-sm"
                    : "text-gray-600 hover:text-brand-red hover:bg-gray-50"
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Gallery Files ({projects.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("contacts")}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-2 ${
                  activeTab === "contacts"
                    ? "bg-brand-red text-white shadow-sm"
                    : "text-gray-600 hover:text-brand-red hover:bg-gray-50"
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span>Customer Leads ({contacts.length})</span>
              </button>
            </div>

            {/* TAB VIEW 1: PROJECTS GRID */}
            {activeTab === "projects" ? (
              <div className="space-y-4">
                
                <div className="flex justify-between items-center px-2">
                  <h4 className="text-sm font-extrabold uppercase tracking-widest text-gray-500">Live Project List</h4>
                  <button
                    onClick={loadDashboardData}
                    disabled={loadingData}
                    className="p-2 text-gray-500 hover:text-brand-red hover:bg-gray-100 rounded-lg transition-colors"
                    title="Reload data"
                  >
                    <RefreshCw className={`h-4 w-4 ${loadingData ? "animate-spin" : ""}`} />
                  </button>
                </div>

                {loadingData ? (
                  <div className="text-center py-16 bg-white border border-gray-200/60 rounded-3xl">
                    <Loader2 className="h-8 w-8 text-brand-red animate-spin mx-auto mb-3" />
                    <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">Loading database content...</span>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-16 bg-white border border-gray-200/60 rounded-3xl p-6">
                    <p className="text-sm text-gray-500">No projects currently configured in projects.json.</p>
                  </div>
                ) : (
                  /* Projects rows */
                  <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="bg-white p-4 rounded-2xl border border-gray-200/60 shadow-xs flex items-center justify-between gap-4 hover:border-gray-300 transition-colors"
                      >
                        {/* Left part */}
                        <div className="flex items-center space-x-4 min-w-0">
                          {/* Thumbnail */}
                          <img
                            src={transformDriveUrl(proj.mediaUrl, "image")}
                            alt={proj.title}
                            referrerPolicy="no-referrer"
                            className="h-12 w-16 object-cover bg-gray-100 rounded-lg border border-gray-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <h5 className="font-display font-bold text-sm text-gray-900 truncate">
                              {proj.title}
                            </h5>
                            <div className="flex items-center space-x-2.5 text-[10px] text-gray-400 font-medium">
                              <span className="text-brand-red">{proj.category}</span>
                              <span>&bull;</span>
                              <span>{proj.mediaType.toUpperCase()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions buttons */}
                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            onClick={() => startEditProject(proj)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit project"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteProject(proj.id)}
                            className="p-2 text-gray-500 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete project"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            ) : (
              /* TAB VIEW 2: CUSTOMER LEADS LIST */
              <div className="space-y-4">
                
                <div className="flex justify-between items-center px-2">
                  <h4 className="text-sm font-extrabold uppercase tracking-widest text-gray-500">Customer Leads &amp; Inquiries</h4>
                  <button
                    onClick={loadDashboardData}
                    disabled={loadingData}
                    className="p-2 text-gray-500 hover:text-brand-red hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <RefreshCw className={`h-4 w-4 ${loadingData ? "animate-spin" : ""}`} />
                  </button>
                </div>

                {loadingData ? (
                  <div className="text-center py-16 bg-white border border-gray-200/60 rounded-3xl">
                    <Loader2 className="h-8 w-8 text-brand-red animate-spin mx-auto mb-3" />
                    <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">Loading customer files...</span>
                  </div>
                ) : contacts.length === 0 ? (
                  <div className="text-center py-16 bg-white border border-gray-200/60 rounded-3xl p-6">
                    <p className="text-sm text-gray-500">No customer message leads registered yet.</p>
                  </div>
                ) : (
                  /* Customer logs list */
                  <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                    {contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-xs space-y-4 hover:border-gray-300 transition-all"
                      >
                        {/* Header card details */}
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="block font-display font-bold text-base text-gray-900">{contact.name}</span>
                            <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
                              <a href={`mailto:${contact.email}`} className="flex items-center hover:text-brand-red transition-colors">
                                <Mail className="h-3 w-3 mr-1" />
                                {contact.email}
                              </a>
                              <span>&bull;</span>
                              <a href={`tel:${contact.phone}`} className="flex items-center hover:text-brand-red transition-colors">
                                <Phone className="h-3 w-3 mr-1" />
                                {contact.phone}
                              </a>
                            </div>
                          </div>

                          <span className="text-[10px] text-gray-400 font-mono flex items-center shrink-0">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            {new Date(contact.createdAt).toLocaleDateString("en-US", { hour: 'numeric', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Customer Message box */}
                        <div className="bg-gray-50 rounded-xl p-4 text-xs sm:text-sm text-gray-600 leading-relaxed italic border border-gray-100">
                          "{contact.message}"
                        </div>

                        {/* Actions block */}
                        <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                          
                          {/* Easy WhatsApp chat trigger */}
                          <a
                            href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${contact.name}! This is the design coordinator from Parbati Interior. We successfully received your consultation request regarding your design project. Let's schedule a site visit.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                          >
                            <MessageSquare className="h-4 w-4 mr-1.5" />
                            Reply on WhatsApp
                          </a>

                          <button
                            onClick={() => deleteContactInquiry(contact.id)}
                            className="inline-flex items-center space-x-1 text-xs text-gray-400 hover:text-brand-red transition-colors"
                            title="Delete contact log"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Clear Lead</span>
                          </button>

                        </div>

                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
}
