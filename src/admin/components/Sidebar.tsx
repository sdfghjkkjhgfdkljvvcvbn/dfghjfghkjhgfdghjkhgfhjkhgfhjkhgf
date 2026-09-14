import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Layers,
  Image,
  FileText,
  Briefcase,
  Palette,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  requiresRole?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Enquiries', href: '/admin/enquiries', icon: <MessageSquare className="w-5 h-5" /> },
  { label: 'Hero Slider', href: '/admin/hero-slider', icon: <Layers className="w-5 h-5" /> },
  { label: 'Gallery', href: '/admin/gallery', icon: <Image className="w-5 h-5" /> },
  { label: 'Projects', href: '/admin/projects', icon: <Briefcase className="w-5 h-5" /> },
  { label: 'Blog', href: '/admin/blog', icon: <FileText className="w-5 h-5" /> },
  { label: 'Services', href: '/admin/services', icon: <Palette className="w-5 h-5" /> },
  { label: 'Happy Clients', href: '/admin/happy-clients', icon: <MessageSquare className="w-5 h-5" /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
];

export const Sidebar: React.FC = () => {
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/admin/login';
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
        >
          {sidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar Backdrop (Mobile) */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-60 bg-gray-900 text-white transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 py-6 border-b border-gray-800">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-white">Parbati</div>
                <div className="text-xs text-gray-400">Admin</div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 overflow-y-auto">
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-red-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* User Section */}
          <div className="px-3 py-4 border-t border-gray-800">
            {/* View Website Button */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Website
            </a>

            <div className="px-4 py-3 mb-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Logged in as</p>
              <p className="text-sm font-semibold text-white truncate">
                {user?.full_name || user?.email}
              </p>
              <p className="text-xs text-gray-400 capitalize">
                {user?.role.replace('_', ' ')}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
