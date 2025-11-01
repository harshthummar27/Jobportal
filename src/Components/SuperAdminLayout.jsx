import React, { useState, useEffect, createContext, useContext } from "react";
import { Menu, Search, X, User, LogOut, AlertTriangle, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
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
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [displayName, setDisplayName] = useState("Super Admin");
  const [displayEmail, setDisplayEmail] = useState("admin@vettedpool.com");

  // Get page name based on current route
  const getPageName = () => {
    const path = location.pathname;
    switch (path) {
      case '/superadmin/dashboard':
        return 'Dashboard';
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

  // Handle Change Password click
  const handleChangePassword = () => {
    setUserDropdownOpen(false);
    setShowChangePasswordModal(true);
    // Reset form data
    setPasswordFormData({
      current_password: '',
      new_password: '',
      confirm_password: ''
    });
    setPasswordErrors({});
    setShowPasswords({
      current: false,
      new: false,
      confirm: false
    });
  };

  // Close change password modal
  const closeChangePasswordModal = () => {
    setShowChangePasswordModal(false);
    setPasswordFormData({
      current_password: '',
      new_password: '',
      confirm_password: ''
    });
    setPasswordErrors({});
    setShowPasswords({
      current: false,
      new: false,
      confirm: false
    });
  };

  // Handle password form input changes
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordFormData.current_password.trim()) {
      errors.current_password = 'Current password is required';
    }
    
    if (!passwordFormData.new_password.trim()) {
      errors.new_password = 'New password is required';
    } else if (passwordFormData.new_password.length < 6) {
      errors.new_password = 'New password must be at least 6 characters';
    }
    
    if (!passwordFormData.confirm_password.trim()) {
      errors.confirm_password = 'Please confirm your new password';
    } else if (passwordFormData.new_password !== passwordFormData.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
    }
    
    if (passwordFormData.current_password === passwordFormData.new_password) {
      errors.new_password = 'New password must be different from current password';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle change password submission
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setIsChangingPassword(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${baseURL}/api/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: passwordFormData.current_password,
          new_password: passwordFormData.new_password,
          confirm_password: passwordFormData.confirm_password
        }),
      });

      // Parse response data
      const contentType = response.headers.get('content-type');
      const data = contentType && contentType.includes('application/json') 
        ? await response.json() 
        : { message: 'Failed to change password' };

      if (!response.ok) {
        const newErrors = {};
        
        // Handle field-specific validation errors
        if (data.errors && typeof data.errors === 'object') {
          // Handle each field error
          Object.keys(data.errors).forEach(field => {
            if (['current_password', 'new_password', 'confirm_password'].includes(field)) {
              const fieldErrors = data.errors[field];
              // Get first error message from array or use string directly
              const errorMessage = Array.isArray(fieldErrors) ? fieldErrors[0] : String(fieldErrors);
              newErrors[field] = errorMessage;
            }
          });
        }
        
        // If no field-specific errors found, show general error
        if (Object.keys(newErrors).length === 0) {
          const errorMessage = data.message || data.error || data.detail || 'Failed to change password';
          toast.error(errorMessage);
        }
        
        setPasswordErrors(newErrors);
        return;
      }

      // Success
      toast.success('Password changed successfully!');
      closeChangePasswordModal();
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMessage = error.message || 'An error occurred while changing password. Please try again.';
      setPasswordErrors({ current_password: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showLogoutModal || showChangePasswordModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showLogoutModal, showChangePasswordModal]);

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

  // Fetch user data from localStorage
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

  const getUserInitial = () => {
    if (displayName && displayName !== "Super Admin") {
      return displayName.charAt(0).toUpperCase();
    }
    return "A";
  };


  return (
    <SearchContext.Provider value={{ searchTerm: globalSearchTerm, onSearch: setGlobalSearchTerm }}>
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

        {/* Change Password Modal */}
        {showChangePasswordModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-300 px-4 sm:px-6 py-4 flex items-center justify-between z-10 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lock className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Change Password</h3>
                    <p className="text-xs text-gray-500 hidden sm:block">Update your account password</p>
                  </div>
                </div>
                <button
                  onClick={closeChangePasswordModal}
                  disabled={isChangingPassword}
                  className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Content */}
              <form onSubmit={handleChangePasswordSubmit} className="px-4 sm:px-6 py-4 sm:py-6">
                {/* Current Password Field */}
                <div className="mb-4">
                  <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      id="current_password"
                      name="current_password"
                      value={passwordFormData.current_password}
                      onChange={handlePasswordInputChange}
                      disabled={isChangingPassword}
                      className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        passwordErrors.current_password
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300 bg-white'
                      } disabled:opacity-50 disabled:cursor-not-allowed pr-10`}
                      placeholder="Enter your current password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={isChangingPassword}
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.current_password && (
                    <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                      {passwordErrors.current_password}
                    </p>
                  )}
                </div>

                {/* New Password Field */}
                <div className="mb-4">
                  <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      id="new_password"
                      name="new_password"
                      value={passwordFormData.new_password}
                      onChange={handlePasswordInputChange}
                      disabled={isChangingPassword}
                      className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        passwordErrors.new_password
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300 bg-white'
                      } disabled:opacity-50 disabled:cursor-not-allowed pr-10`}
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={isChangingPassword}
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.new_password && (
                    <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                      {passwordErrors.new_password}
                    </p>
                  )}
                  <p className="mt-1.5 text-xs text-gray-500">Must be at least 6 characters long</p>
                </div>

                {/* Confirm Password Field */}
                <div className="mb-6">
                  <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      id="confirm_password"
                      name="confirm_password"
                      value={passwordFormData.confirm_password}
                      onChange={handlePasswordInputChange}
                      disabled={isChangingPassword}
                      className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        passwordErrors.confirm_password
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300 bg-white'
                      } disabled:opacity-50 disabled:cursor-not-allowed pr-10`}
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={isChangingPassword}
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.confirm_password && (
                    <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                      {passwordErrors.confirm_password}
                    </p>
                  )}
                </div>

                {/* Modal Actions */}
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <button
                    type="button"
                    onClick={closeChangePasswordModal}
                    disabled={isChangingPassword}
                    className="px-4 py-2.5 text-sm sm:text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="px-4 py-2.5 text-sm sm:text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-1 sm:order-2"
                  >
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Changing...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        <span>Change Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
                  className="w-full pl-6 sm:pl-8 pr-6 sm:pr-8 py-1 sm:py-1.5 text-[10px] sm:text-xs bg-gray-50/80 border border-gray-200/60 rounded-md focus:ring-1 focus:ring-indigo-500/20 focus:border-indigo-300 focus:bg-white transition-all duration-200 placeholder-gray-400"
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
                  <div className="text-[10px] sm:text-xs font-medium text-gray-800 truncate max-w-[80px] lg:max-w-none">{displayName}</div>
                  <div className="text-[9px] sm:text-xs text-gray-500 truncate max-w-[80px] lg:max-w-none">{displayEmail}</div>
                </div>
                {/* User Avatar - Always visible */}
                <button
                  onClick={handleUserDropdownToggle}
                  className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center cursor-pointer hover:from-indigo-200 hover:to-purple-200 transition-all duration-200 border border-indigo-200/50 shadow-sm flex-shrink-0"
                >
                  <span className="text-indigo-600 font-bold text-[10px] sm:text-xs">
                    {getUserInitial()}
                  </span>
                </button>
              </div>

              {/* User Dropdown Menu - Responsive */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg border border-gray-300 py-2 z-50">
                  {/* User Info Header */}
                  <div className="px-3 sm:px-4 py-3 border-b border-gray-300">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs sm:text-sm">
                          {getUserInitial()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{displayName}</div>
                        <div className="text-[10px] sm:text-xs text-gray-500 truncate">{displayEmail}</div>
                        <div className="text-[10px] sm:text-xs text-indigo-600 font-medium">Super Admin</div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items - Responsive */}
                  <div className="py-1">
                    <button
                      onClick={handleChangePassword}
                      className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">Change Password</span>
                    </button>
                    <div className="border-t border-gray-300 my-1"></div>
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
      </>
    </SearchContext.Provider>
  );
};

export default SuperAdminLayout;
