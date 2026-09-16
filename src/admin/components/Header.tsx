import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface HeaderProps {
  title?: string;
  description?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, description }) => {
  const { user } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const initials = user?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'A';

  return (
    <div className="bg-white border-b border-[#E5E1DA] sticky top-0 z-20">
      <div className="px-8 py-4 flex items-center justify-between">
        {/* Page Title */}
        <div>
          {title && (
            <h1 className="text-2xl font-light text-[#202124] tracking-tight">{title}</h1>
          )}
          {description && (
            <p className="text-sm text-[#77736D] mt-1">{description}</p>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button className="p-2 hover:bg-[#F7F6F2] rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-[#77736D]" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 hover:bg-[#F7F6F2] rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-[#8F2F2F] text-white rounded-lg flex items-center justify-center text-sm font-medium">
                {initials}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-[#202124]">
                  {user?.full_name || 'Admin'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-[#77736D]" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5E1DA] rounded-lg shadow-md py-2">
                <button className="w-full text-left px-4 py-2 text-sm text-[#202124] hover:bg-[#F7F6F2]">
                  Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-[#202124] hover:bg-[#F7F6F2]">
                  Settings
                </button>
                <hr className="my-2 border-[#E5E1DA]" />
                <button className="w-full text-left px-4 py-2 text-sm text-[#8F2F2F] hover:bg-[#F7F6F2]">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
