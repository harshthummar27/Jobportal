import React, { useState, useEffect, createContext, useContext } from "react";
import { Menu, Search, X, User, Edit, LogOut, Settings } from "lucide-react";
import { useLocation } from "react-router-dom";
import SuperAdminSidebar from "./SuperAdminSidebar";

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


const SuperAdminLayout = ({ children }) => {
  const location = useLocation();
  
  // Initialize collapsed state from localStorage or default to false
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
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
      case '/superadmin/dashboard':
        return 'Dashboard';
      case '/superadmin/pending-candidates':
        return 'Pending Candidates';
      case '/superadmin/approved-candidates':
        return 'Approved Candidates';
      case '/superadmin/recruiters':
        return 'Recruiters';
      case '/superadmin/internal-team':
        return 'Internal Team';
      default:
        return 'Super Admin Panel';
    }
  };

  // Save collapsed state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
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

  // Global search handlers
  const handleGlobalSearch = (e) => {
    const newValue = e.target.value;
    setGlobalSearchTerm(newValue);
  };

  const clearGlobalSearch = () => {
    setGlobalSearchTerm("");
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
    <SearchContext.Provider value={{ searchTerm: globalSearchTerm, onSearch: setGlobalSearchTerm }}>
      <div className="min-h-screen bg-gray-50">
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
                className="p-1.5 ml-[-0.5vw] sm:p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 transition-all duration-200 active:scale-95 touch-manipulation"
                title={isMobile ? "Toggle menu" : (isCollapsed ? "Expand sidebar" : "Collapse sidebar")}
                aria-label={isMobile ? "Toggle mobile menu" : "Toggle sidebar"}
              >
                <Menu className="h-4 w-4 sm:h-4 sm:w-4" />
              </button>
              
              {/* Logo */}
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                  <span className="text-white font-bold text-xs">VP</span>
                </div>
                {/* Page Name - Hidden on small screens, visible on md+ */}
                <div className="min-w-0 hidden md:block">
                  <h4 className="text-sm lg:text-base font-semibold text-gray-800 truncate">{getPageName()}</h4>
                </div>
              </div>
            </div>
            
            {/* Center Section - Global Search Bar */}
            <div className="flex-1 flex justify-center px-2 sm:px-4 md:px-6 lg:px-8">
              <div className="relative w-full max-w-[200px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px] xl:max-w-[600px]">
                <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={globalSearchTerm}
                  onChange={handleGlobalSearch}
                  className="w-full pl-6 sm:pl-8 pr-6 sm:pr-8 py-1 sm:py-1.5 text-[10px] sm:text-xs bg-gray-50/80 border border-gray-200/60 rounded-md focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 focus:bg-white transition-all duration-200 placeholder-gray-400"
                />
                {globalSearchTerm && (
                  <button
                    onClick={clearGlobalSearch}
                    className="absolute right-1.5 sm:right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Section - User Section */}
            <div className="relative user-dropdown flex-shrink-0">
              <div className="flex items-center gap-1 sm:gap-2">
                {/* User Info - Hidden on small screens, visible on sm+ */}
                <div className="hidden sm:block text-right">
                  <div className="text-[10px] sm:text-xs font-medium text-gray-800 truncate max-w-[80px] lg:max-w-none">John Admin</div>
                  <div className="text-[9px] sm:text-xs text-gray-500 truncate max-w-[80px] lg:max-w-none">Super Admin</div>
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
                        <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">John Admin</div>
                        <div className="text-[10px] sm:text-xs text-gray-500 truncate">admin@vettedpool.com</div>
                        <div className="text-[10px] sm:text-xs text-indigo-600 font-medium">Super Admin</div>
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
            <SuperAdminSidebar 
              isCollapsed={isCollapsed} 
              setIsCollapsed={setIsCollapsed}
              onMobileClose={handleMobileClose}
              isMobile={isMobile}
              mobileSidebarOpen={mobileSidebarOpen}
            />
          </div>

          {/* Main content - Enhanced mobile behavior */}
          <div className={`
            flex-1 transition-all duration-300 ease-in-out overflow-hidden
            ${isMobile 
              ? 'ml-0' 
              : (isCollapsed ? 'lg:ml-16' : 'lg:ml-64')
            }
            h-full w-full
          `}>
            <div className="p-3 sm:p-4 lg:p-6 h-full overflow-auto w-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </SearchContext.Provider>
  );
};

export default SuperAdminLayout;
