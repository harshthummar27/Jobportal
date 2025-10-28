import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Edit, LogOut, AlertTriangle } from "lucide-react";
import { toast } from 'react-toastify';

const DashboardHeader = ({ onEditProfile, userData }) => {
  const location = useLocation();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
    if (onEditProfile) {
      onEditProfile();
    }
  };

  const handleLogout = () => {
    setUserDropdownOpen(false);
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      const token = localStorage.getItem('token');
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      
      const response = await fetch(`${baseURL}/api/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        // credentials: 'include', // Include cookies for session management
      });

      if (response.ok) {
        // Clear any local storage or session data
        localStorage.clear();
        
        // Show success toast
        toast.success("Logged out successfully!");
        setShowLogoutModal(false);
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        console.error('Logout failed:', response.statusText);
        toast.error('Logout failed. Please try again.');
        setShowLogoutModal(false);
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout. Please try again.');
      setShowLogoutModal(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showLogoutModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showLogoutModal]);


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
    <>
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
                  <p className="text-sm text-gray-500">Are you sure you want to logout?</p>
                </div>
              </div>

              {/* Modal Content */}
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  You will be redirected to the login page and will need to sign in again to access your account.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelLogout}
                  disabled={isLoggingOut}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  disabled={isLoggingOut}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoggingOut ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging out...
                    </>
                  ) : (
                    'Logout'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <div className="text-[10px] sm:text-xs font-medium text-gray-800 truncate max-w-[80px] lg:max-w-none">
                {userData?.full_name || userData?.contact_email || "User"}
              </div>
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
                    <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                      {userData?.full_name || "User"}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500 truncate">
                      {userData?.contact_email || "user@example.com"}
                    </div>
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
    </>
  );
};

export default DashboardHeader;
