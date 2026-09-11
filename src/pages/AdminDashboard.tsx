import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LogOut, Menu, X, Settings, Search,
  MessageSquare, Zap, Image, FileText, 
  Briefcase, BookOpen, Palette, Package
} from "lucide-react";
import EnquiriesTab from "../components/admin/EnquiriesTab";
import HeroSliderTab from "../components/admin/HeroSliderTab";
import GalleryTab from "../components/admin/GalleryTab";
import ProjectsTab from "../components/admin/ProjectsTab";
import BlogTab from "../components/admin/BlogTab";
import ServicesTab from "../components/admin/ServicesTab";
import ServicePagesTab from "../components/admin/ServicePagesTab";
import PackagesTab from "../components/admin/PackagesTab";
import SettingsTab from "../components/admin/SettingsTab";

type TabType = 
  | "enquiries" 
  | "hero-slider" 
  | "gallery" 
  | "projects" 
  | "blog" 
  | "services" 
  | "service-pages" 
  | "packages" 
  | "settings";

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("enquiries");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [adminName, setAdminName] = useState("Admin");

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("parbati_admin_token");
    if (!token) {
      navigate("/admin");
    }
  }, [navigate]);

  const tabs: TabConfig[] = [
    {
      id: "enquiries",
      label: "Enquiries",
      icon: <MessageSquare className="h-5 w-5" />,
      component: <EnquiriesTab />,
    },
    {
      id: "hero-slider",
      label: "Hero Slider",
      icon: <Zap className="h-5 w-5" />,
      component: <HeroSliderTab />,
    },
    {
      id: "gallery",
      label: "Gallery",
      icon: <Image className="h-5 w-5" />,
      component: <GalleryTab />,
    },
    {
      id: "projects",
      label: "Projects",
      icon: <Briefcase className="h-5 w-5" />,
      component: <ProjectsTab />,
    },
    {
      id: "blog",
      label: "Blog",
      icon: <BookOpen className="h-5 w-5" />,
      component: <BlogTab />,
    },
    {
      id: "services",
      label: "Services",
      icon: <Palette className="h-5 w-5" />,
      component: <ServicesTab />,
    },
    {
      id: "service-pages",
      label: "Service Pages",
      icon: <FileText className="h-5 w-5" />,
      component: <ServicePagesTab />,
    },
    {
      id: "packages",
      label: "Packages",
      icon: <Package className="h-5 w-5" />,
      component: <PackagesTab />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      component: <SettingsTab />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("parbati_admin_token");
    navigate("/admin");
  };

  const currentTab = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <img src="/logo/logo.png" alt="Parbati Interior" className={`object-contain ${isSidebarOpen ? "h-20 w-auto" : "h-12 w-auto"}`} />
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                activeTab === tab.id
                  ? "bg-brand-red text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              title={tab.label}
            >
              {tab.icon}
              {isSidebarOpen && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-950 text-red-300 hover:bg-brand-red hover:text-white transition-all text-sm font-medium"
          >
            <LogOut className="h-5 w-5" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isSidebarOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>

            {/* Search Bar - Active only on Enquiries */}
            {activeTab === "enquiries" && (
              <div className="hidden sm:flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg flex-1 max-w-md">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search enquiries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm flex-1"
                />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">{adminName}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
            <div className="w-10 h-10 bg-brand-red text-white rounded-full flex items-center justify-center font-bold">
              {adminName[0]}
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="space-y-6">
            {/* Tab Header */}
            <div>
              <div className="flex items-center space-x-3 mb-2">
                {currentTab?.icon}
                <h1 className="text-3xl font-bold text-gray-900">{currentTab?.label}</h1>
              </div>
              <p className="text-sm text-gray-600">
                Manage your {currentTab?.label.toLowerCase()} content
              </p>
            </div>

            {/* Tab Component */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {currentTab?.component}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
