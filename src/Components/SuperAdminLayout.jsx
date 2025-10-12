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

  // Close mobile sidebar on navigation (but preserve desktop collapsed state)
  const handleMobileClose = () => {
    setMobileSidebarOpen(false);
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
        {/* Mobile Overlay */}
        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-gray-500 bg-opacity-50 z-40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Fixed Header - Always at top, never moves - Ultra Compact */}
        <div className="fixed top-0 left-0 right-0 h-12 bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-sm px-3 sm:px-4 lg:px-6 py-1.5 z-30 flex items-center">
          <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mobile Hamburger Menu Button */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-1 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 transition-all duration-200 lg:hidden"
              >
                <Menu className="h-3.5 w-3.5" />
              </button>
              
              {/* Desktop Sidebar Toggle Button */}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex p-1 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 transition-all duration-200"
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <Menu className="h-3.5 w-3.5" />
              </button>
              
              {/* Demo Logo */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-xs">VP</span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-800 truncate">{getPageName()}</h4>
                </div>
              </div>
              {/* <div className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 px-1.5 py-0.5 rounded-full text-xs font-medium hidden sm:block border border-indigo-200/50">
                Admin
              </div> */}
            </div>
            
            {/* Global Search Bar */}
            <div className="flex-1 max-w-xs sm:max-w-md mx-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={globalSearchTerm}
                  onChange={handleGlobalSearch}
                  className="w-full pl-8 pr-8 py-1.5 text-xs bg-gray-50/80 border border-gray-200/60 rounded-md focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 focus:bg-white transition-all duration-200 placeholder-gray-400"
                />
                {globalSearchTerm && (
                  <button
                    onClick={clearGlobalSearch}
                    className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* User Section */}
            <div className="relative user-dropdown">
              <div className="flex items-center gap-2">
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-medium text-gray-800">John Admin</div>
                  <div className="text-xs text-gray-500">Super Admin</div>
                </div>
                <button
                  onClick={handleUserDropdownToggle}
                  className="w-7 h-7 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center cursor-pointer hover:from-indigo-200 hover:to-purple-200 transition-all duration-200 border border-indigo-200/50 shadow-sm"
                >
                  <User className="h-3.5 w-3.5 text-indigo-600" />
                </button>
              </div>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200/50 py-2 z-50">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">John Admin</div>
                        <div className="text-xs text-gray-500">john.admin@vettedpool.com</div>
                        <div className="text-xs text-indigo-600 font-medium">Super Admin</div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={handleEditProfile}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Edit className="h-4 w-4 text-gray-400" />
                      Edit Profile
                    </button>
                    
                    <button
                      onClick={handleSettings}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="h-4 w-4 text-gray-400" />
                      Settings
                    </button>
                    
                    <div className="border-t border-gray-100 my-1"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 text-red-500" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-3rem)] overflow-hidden mt-12">
          {/* Sidebar */}
          <div className={`
            ${mobileSidebarOpen ? 'block' : 'hidden'} lg:block
          `}>
            <SuperAdminSidebar 
              isCollapsed={isCollapsed} 
              setIsCollapsed={setIsCollapsed}
              onMobileClose={handleMobileClose}
            />
          </div>

          {/* Main content */}
          <div className={`
            flex-1 transition-all duration-300 ease-in-out overflow-hidden
            ${isCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
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
