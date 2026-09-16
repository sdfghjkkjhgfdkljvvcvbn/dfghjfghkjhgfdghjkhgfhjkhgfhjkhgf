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
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Enquiries', href: '/admin/enquiries', icon: <MessageSquare className="w-4 h-4" /> },
  { label: 'Hero Slider', href: '/admin/hero-slider', icon: <Layers className="w-4 h-4" /> },
  { label: 'Gallery', href: '/admin/gallery', icon: <Image className="w-4 h-4" /> },
  { label: 'Projects', href: '/admin/projects', icon: <Briefcase className="w-4 h-4" /> },
  { label: 'Blog', href: '/admin/blog', icon: <FileText className="w-4 h-4" /> },
  { label: 'Services', href: '/admin/services', icon: <Palette className="w-4 h-4" /> },
  { label: 'Happy Clients', href: '/admin/happy-clients', icon: <MessageSquare className="w-4 h-4" /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
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
          className="p-2 rounded-lg bg-[#8F2F2F] text-white hover:bg-[#7a2828]"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
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
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-[#15181C] text-white transition-transform duration-300 flex flex-col h-screen ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className="px-6 py-8 flex items-center justify-center">
          <Link
            to="/admin/dashboard"
            className="flex items-center justify-center w-full"
            onClick={() => setSidebarOpen(false)}
          >
            <img 
              src="/logo/logo_for_parbati_interior (1).png" 
              alt="Parbati Interior" 
              className="w-48 h-auto object-contain max-w-full"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 overflow-hidden">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all relative group ${
                  isActive(item.href)
                    ? 'text-white bg-white/5'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {/* Active Indicator */}
                {isActive(item.href) && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-[#8F2F2F] rounded-r"></div>
                )}
                <span className="ml-2">{item.icon}</span>
                <span className="font-light">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Separator */}
        <div className="px-4 py-4 border-t border-white/10 space-y-3">
          {/* View Website Button */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#8F2F2F] hover:bg-[#7a2828] text-white font-medium rounded-lg transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            View Website
          </a>
        </div>

        {/* User Section */}
        <div className="px-4 py-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-[#8F2F2F] rounded-lg flex items-center justify-center text-xs font-medium flex-shrink-0">
              {user?.full_name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-light text-white truncate">
                {user?.full_name || user?.email}
              </p>
              <p className="text-xs text-white/60 capitalize">
                {user?.role.replace('_', ' ')}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};
