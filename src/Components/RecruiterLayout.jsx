import React, { useState, useEffect, createContext, useContext } from "react";
import { Menu, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import RecruiterSidebar from "./RecruiterSidebar";

const SearchContext = createContext();

export const useRecruiterSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    console.warn('useRecruiterSearch called outside of provider, returning defaults');
    return { searchTerm: '', onSearch: () => {} };
  }
  return context;
};

const RecruiterLayout = ({ children }) => {
  // No route-based title; always show "Recruiter Dashboard"

  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('recruiterSidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [displayName, setDisplayName] = useState("Recruiter");
  const [displayEmail, setDisplayEmail] = useState("recruiter@vettedpool.com");

  const getPageName = () => 'Recruiter Dashboard';

  useEffect(() => {
    localStorage.setItem('recruiterSidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    const handleResize = () => {
      const isMobileScreen = window.innerWidth < 1024;
      setIsMobile(isMobileScreen);
      if (!isMobileScreen && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileSidebarOpen]);

  const handleMobileClose = () => setMobileSidebarOpen(false);

  const handleHamburgerToggle = () => {
    if (isMobile) setMobileSidebarOpen(!mobileSidebarOpen);
    else setIsCollapsed(!isCollapsed);
  };

  const handleUserDropdownToggle = () => setUserDropdownOpen(!userDropdownOpen);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('.user-dropdown')) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  // Load user display info
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const parsed = JSON.parse(userStr);
        const inner = parsed.user || parsed;
        const name = inner.full_name || inner.name || parsed.full_name || parsed.name;
        const email = inner.email || inner.contact_email || parsed.email || parsed.contact_email;
        if (name) setDisplayName(name);
        if (email) setDisplayEmail(email);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Get user initial (first letter of name)
  const getUserInitial = () => {
    if (displayName && displayName !== "Recruiter") {
      // Get first letter and make it uppercase
      return displayName.charAt(0).toUpperCase();
    }
    // Fallback to "R" if no valid name found
    return "R";
  };

  return (
    <SearchContext.Provider value={{ searchTerm: "", onSearch: () => {} }}>
      <div className="bg-gray-50">
        {mobileSidebarOpen && isMobile && (
          <div 
            className="fixed top-12 left-0 right-0 bottom-0 bg-white/20 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setMobileSidebarOpen(false)}
            onTouchStart={() => setMobileSidebarOpen(false)}
          />
        )}

        <div className="fixed top-0 left-0 right-0 h-12 bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-sm px-2 sm:px-3 md:px-4 lg:px-6 py-1.5 z-50 flex items-center">
          <div className="flex items-center justify-between gap-1 sm:gap-2 md:gap-4 w-full">
              <div className="flex items-center gap-1 sm:gap-2 md:gap-5 flex-shrink-0">
              <button
                onClick={handleHamburgerToggle}
                className="ml-[-0.5vw] p-1.5 sm:p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 transition-all duration-200 active:scale-95 touch-manipulation"
                title={isMobile ? "Toggle menu" : (isCollapsed ? "Expand sidebar" : "Collapse sidebar")}
                aria-label={isMobile ? "Toggle mobile menu" : "Toggle sidebar"}
              >
                <Menu className="h-4 w-4 sm:h-4 sm:w-4" />
              </button>
              <Link to="/" className="flex items-center gap-1 sm:gap-2 cursor-pointer hover:opacity-90 transition-opacity">
                <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                  <span className="text-white font-bold text-xs">RC</span>
                </div>
                <div className="min-w-0 hidden md:block">
                  <h4 className="text-sm lg:text-base font-semibold text-gray-800 truncate">{getPageName()}</h4>
                </div>
              </Link>
            </div>

            <div className="flex-1" />

            <div className="relative user-dropdown flex-shrink-0">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="hidden sm:block text-right">
                  <div className="text-[10px] sm:text-xs font-medium text-gray-800 truncate max-w-[140px] lg:max-w-none">{displayName}</div>
                  <div className="text-[9px] sm:text-xs text-gray-500 truncate max-w-[140px] lg:max-w-none">{displayEmail}</div>
                </div>
                <button
                  onClick={handleUserDropdownToggle}
                  className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 border border-indigo-200/50 shadow-sm flex-shrink-0"
                >
                  <span className="text-white font-bold text-[10px] sm:text-xs">
                    {getUserInitial()}
                  </span>
                </button>
              </div>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg border border-gray-200/50 py-2 z-50">
                  <div className="px-3 sm:px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs sm:text-sm">
                          {getUserInitial()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{displayName}</div>
                        <div className="text-[10px] sm:text-xs text-gray-500 truncate">{displayEmail}</div>
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
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
          <div className={`${isMobile ? (mobileSidebarOpen ? 'block' : 'hidden') : 'block'}`}>
            <RecruiterSidebar
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              onMobileClose={handleMobileClose}
              isMobile={isMobile}
              mobileSidebarOpen={mobileSidebarOpen}
            />
          </div>
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

export default RecruiterLayout;


