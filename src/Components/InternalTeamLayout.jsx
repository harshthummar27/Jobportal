import React, { useState, useEffect, createContext, useContext } from "react";
import { Menu, User, Edit, LogOut, Settings } from "lucide-react";
import { useLocation } from "react-router-dom";
import InternalTeamSidebar from "./InternalTeamSidebar";

// Create context for global search
const SearchContext = createContext();

// Hook to use search context
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    // Return default values if context is not available (fallback)
    console.warn('useSearch called outside of SearchProvider, returning default values');
    return { searchTerm: '', onSearch: () => {} };
  }
  return context;
};

const InternalTeamLayout = ({ children }) => {
  const location = useLocation();
  
  // Initialize collapsed state from localStorage or default to false
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('internalTeamSidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Get page name based on current route
  const getPageName = () => {
    const path = location.pathname;
    switch (path) {
      case '/internal-team/dashboard':
        return 'Internal Team Dashboard';
      case '/internal-team/candidate-selections':
        return 'Candidate Selections';
      case '/internal-team/interview-scheduling':
        return 'Interview Scheduling';
      case '/internal-team/offer-management':
        return 'Offer Management';
      case '/internal-team/screening-blocking':
        return 'Screening & Blocking';
      case '/internal-team/blocked-candidates':
        return 'Blocked Candidates';
      case '/internal-team/communication':
        return 'Communication';
      case '/internal-team/activity-log':
        return 'Activity Log';
      default:
        return 'Internal Team Panel';
    }
  };

  // Save collapsed state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('internalTeamSidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // Handle screen size changes and mobile detection
  useEffect(() => {
    const handleResize = () => {
      const isMobileScreen = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(isMobileScreen);
      
      // Close mobile sidebar when switching to desktop
      if (!isMobileScreen && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileSidebarOpen]);

  // Close mobile sidebar on navigation (but preserve desktop collapsed state)
  const handleMobileClose = () => {
    setMobileSidebarOpen(false);
  };

  // Enhanced hamburger toggle handler
  const handleHamburgerToggle = () => {
    if (isMobile) {
      // Mobile: Toggle overlay sidebar
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      // Desktop: Toggle collapsed state
      setIsCollapsed(!isCollapsed);
    }
  };

  // Global search UI removed; context is still provided for consumers

  // User dropdown handlers
  const handleUserDropdownToggle = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleEditProfile = () => {
    setUserDropdownOpen(false);
    // In real app, navigate to edit profile page or open modal
    alert("Edit Profile - This would open profile editing functionality");
  };

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    try {
      const token = localStorage.getItem('token');
      const baseURL = import.meta.env.VITE_API_BASE_URL;

      const response = await fetch(`${baseURL}/api/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        localStorage.clear();
        window.location.href = '/login';
      } else {
        console.error('Logout failed:', response.statusText);
        alert('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('An error occurred during logout. Please try again.');
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
    <SearchContext.Provider value={{ searchTerm: globalSearchTerm, onSearch: setGlobalSearchTerm }}>
      <div className="bg-gray-50">
        {/* Mobile Overlay - Professional transparent with blur (only behind sidebar) */}
        {mobileSidebarOpen && isMobile && (
          <div 
            className="fixed top-12 left-0 right-0 bottom-0 bg-white/20 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setMobileSidebarOpen(false)}
            onTouchStart={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Fixed Header - Fully Responsive */}
        <div className="fixed top-0 left-0 right-0 h-12 bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-sm px-2 sm:px-3 md:px-4 lg:px-6 py-1.5 z-50 flex items-center">
          <div className="flex items-center justify-between gap-1 sm:gap-2 md:gap-4 w-full">
            {/* Left Section - Logo & Menu */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-5 flex-shrink-0">
              {/* Universal Hamburger Menu Button - Works on all screen sizes */}
              <button
                onClick={handleHamburgerToggle}
                className="ml-[-0.5vw] p-1.5 sm:p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 transition-all duration-200 active:scale-95 touch-manipulation"
                title={isMobile ? "Toggle menu" : (isCollapsed ? "Expand sidebar" : "Collapse sidebar")}
                aria-label={isMobile ? "Toggle mobile menu" : "Toggle sidebar"}
              >
                <Menu className="h-4 w-4 sm:h-4 sm:w-4" />
              </button>
              
              {/* Logo */}
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                  <span className="text-white font-bold text-xs">IT</span>
                </div>
                {/* Page Name - Hidden on small screens, visible on md+ */}
                <div className="min-w-0 hidden md:block">
                  <h4 className="text-sm lg:text-base font-semibold text-gray-800 truncate">{getPageName()}</h4>
                </div>
              </div>
            </div>
            
            {/* Center Section removed */}

            {/* Right Section - User Section */}
            <div className="relative user-dropdown flex-shrink-0">
              <div className="flex items-center gap-1 sm:gap-2">
                {/* User Info - Hidden on small screens, visible on sm+ */}
                <div className="hidden sm:block text-right">
                  <div className="text-[10px] sm:text-xs font-medium text-gray-800 truncate max-w-[80px] lg:max-w-none">Sarah HR</div>
                  <div className="text-[9px] sm:text-xs text-gray-500 truncate max-w-[80px] lg:max-w-none">Internal Team</div>
                </div>
                {/* User Avatar - Always visible */}
                <button
                  onClick={handleUserDropdownToggle}
                  className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center cursor-pointer hover:from-emerald-200 hover:to-teal-200 transition-all duration-200 border border-emerald-200/50 shadow-sm flex-shrink-0"
                >
                  <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-600" />
                </button>
              </div>

              {/* User Dropdown Menu - Responsive */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg border border-gray-200/50 py-2 z-50">
                  {/* User Info Header */}
                  <div className="px-3 sm:px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">Sarah HR</div>
                        <div className="text-[10px] sm:text-xs text-gray-500 truncate">sarah.hr@vettedpool.com</div>
                        <div className="text-[10px] sm:text-xs text-emerald-600 font-medium">Internal Team</div>
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

        <div className="flex h-[calc(100vh-3rem)] overflow-hidden mt-12">
          {/* Sidebar - Enhanced mobile behavior */}
          <div className={`
            ${isMobile 
              ? (mobileSidebarOpen ? 'block' : 'hidden')
              : 'block'
            }
          `}>
            <InternalTeamSidebar 
              isCollapsed={isCollapsed} 
              setIsCollapsed={setIsCollapsed}
              onMobileClose={handleMobileClose}
              isMobile={isMobile}
              mobileSidebarOpen={mobileSidebarOpen}
            />
          </div>

          {/* Main content - Enhanced mobile behavior */}
          <div className="flex-1 transition-all duration-300 ease-in-out overflow-hidden h-full w-full">
            <div className="p-3 sm:p-4 lg:p-6 h-full overflow-auto w-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </SearchContext.Provider>
  );
};

export default InternalTeamLayout;
