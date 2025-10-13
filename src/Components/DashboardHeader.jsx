import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Edit, LogOut, Settings } from "lucide-react";

const DashboardHeader = () => {
  const location = useLocation();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Get page name based on current route
  const getPageName = () => {
    const path = location.pathname;
    switch (path) {
      case '/candidate/dashboard':
        return 'Candidate Dashboard';
      case '/recruiter/dashboard':
        return 'Recruiter Dashboard';
      case '/candidate/profile-setup':
        return 'Profile Setup';
      case '/recruiter/candidate-search':
        return 'Candidate Search';
      case '/recruiter/candidate-profile':
        return 'Candidate Profile';
      default:
        return 'Dashboard';
    }
  };

  // User dropdown handlers
  const handleUserDropdownToggle = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleEditProfile = () => {
    setUserDropdownOpen(false);
    // In real app, navigate to edit profile page or open modal
    alert("Edit Profile - This would open profile editing functionality");
  };

  const handleLogout = () => {
    setUserDropdownOpen(false);
    // In real app, implement logout logic
    if (window.confirm("Are you sure you want to logout?")) {
      alert("Logging out...");
      // Redirect to login page or clear session
    }
  };

  const handleSettings = () => {
    setUserDropdownOpen(false);
    // In real app, navigate to settings page
    alert("Settings - This would open settings page");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('.user-dropdown')) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen]);

  return (
    <div className="fixed top-0 left-0 right-0 h-12 bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-sm px-2 sm:px-3 md:px-4 lg:px-6 py-1.5 z-50 flex items-center">
      <div className="flex items-center justify-between gap-1 sm:gap-2 md:gap-4 w-full">
        {/* Left Section - Logo */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
          {/* Logo - Always visible */}
          <Link to="/" className="flex items-center gap-1 sm:gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
              <span className="text-white font-bold text-xs">VP</span>
            </div>
            {/* Page Name - Hidden on small screens, visible on md+ */}
            <div className="min-w-0 hidden md:block">
              <h4 className="text-sm lg:text-base font-semibold text-gray-800 truncate">{getPageName()}</h4>
            </div>
          </Link>
        </div>

        {/* Right Section - User Section */}
        <div className="relative user-dropdown flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2">
            {/* User Info - Hidden on small screens, visible on sm+ */}
            <div className="hidden sm:block text-right">
              <div className="text-[10px] sm:text-xs font-medium text-gray-800 truncate max-w-[80px] lg:max-w-none">John User</div>
              <div className="text-[9px] sm:text-xs text-gray-500 truncate max-w-[80px] lg:max-w-none">Candidate</div>
            </div>
            {/* User Avatar - Always visible */}
            <button
              onClick={handleUserDropdownToggle}
              className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center cursor-pointer hover:from-indigo-200 hover:to-purple-200 transition-all duration-200 border border-indigo-200/50 shadow-sm flex-shrink-0"
            >
              <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-indigo-600" />
            </button>
          </div>

          {/* User Dropdown Menu - Responsive */}
          {userDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg border border-gray-200/50 py-2 z-50">
              {/* User Info Header */}
              <div className="px-3 sm:px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">John User</div>
                    <div className="text-[10px] sm:text-xs text-gray-500 truncate">john.user@vettedpool.com</div>
                    <div className="text-[10px] sm:text-xs text-indigo-600 font-medium">Candidate</div>
                  </div>
                </div>
              </div>

              {/* Menu Items - Responsive */}
              <div className="py-1">
                <button
                  onClick={handleEditProfile}
                  className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                  <span className="truncate">Edit Profile</span>
                </button>
                
                <button
                  onClick={handleSettings}
                  className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                  <span className="truncate">Settings</span>
                </button>
                
                <div className="border-t border-gray-100 my-1"></div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
                  <span className="truncate">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
