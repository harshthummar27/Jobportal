import React, { useState, useEffect } from "react";
import { Menu, User, LogOut, AlertTriangle, Lock, Eye, EyeOff, Loader2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import CandidateSidebar from "./CandidateSidebar";

const CandidateLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('candidateSidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [displayName, setDisplayName] = useState("Candidate");
  const [displayEmail, setDisplayEmail] = useState("candidate@vettedpool.com");
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

  const getPageName = () => 'Candidate Dashboard';

  useEffect(() => {
    localStorage.setItem('candidateSidebarCollapsed', JSON.stringify(isCollapsed));
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
        localStorage.clear();
        toast.success("Logged out successfully!");
        setShowLogoutModal(false);
        
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

  const handleChangePassword = () => {
    setUserDropdownOpen(false);
    setShowChangePasswordModal(true);
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

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (passwordErrors[name]) {
      setPasswordErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

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

      const contentType = response.headers.get('content-type');
      const data = contentType && contentType.includes('application/json') 
        ? await response.json() 
        : { message: 'Failed to change password' };

      if (!response.ok) {
        const newErrors = {};
        
        if (data.errors && typeof data.errors === 'object') {
          Object.keys(data.errors).forEach(field => {
            if (['current_password', 'new_password', 'confirm_password'].includes(field)) {
              const fieldErrors = data.errors[field];
              const errorMessage = Array.isArray(fieldErrors) ? fieldErrors[0] : String(fieldErrors);
              newErrors[field] = errorMessage;
            }
          });
        }
        
        if (Object.keys(newErrors).length === 0) {
          const errorMessage = data.message || data.error || data.detail || 'Failed to change password';
          toast.error(errorMessage);
        }
        
        setPasswordErrors(newErrors);
        return;
      }

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

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  useEffect(() => {
    if (showLogoutModal || showChangePasswordModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showLogoutModal, showChangePasswordModal]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('.user-dropdown')) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

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
    if (displayName && displayName !== "Candidate") {
      return displayName.charAt(0).toUpperCase();
    }
    return "C";
  };

  return (
    <>
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
                  <p className="text-sm text-gray-500">Are you sure you want to logout?</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  You will be redirected to the login page and will need to sign in again to access your account.
                </p>
              </div>

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
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between z-10 rounded-t-xl">
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

            <form onSubmit={handleChangePasswordSubmit} className="px-4 sm:px-6 py-4 sm:py-6">
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
                  <span className="text-white font-bold text-xs">VC</span>
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
                        <div className="text-[10px] sm:text-xs text-indigo-600 font-medium">Candidate</div>
                      </div>
                    </div>
                  </div>

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
          <div className={`${isMobile ? (mobileSidebarOpen ? 'block' : 'hidden') : 'block'}`}>
            <CandidateSidebar
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
    </>
  );
};

export default CandidateLayout;

