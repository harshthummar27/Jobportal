import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Edit, LogOut, AlertTriangle, X, Loader2, Lock, Eye, EyeOff, Menu } from "lucide-react";
import { toast } from 'react-toastify';
import logo from '../../public/vettedpool-logo.png';
import NotificationDropdown from './NotificationDropdown';

const Header = ({ onEditProfile, userData }) => {
  const location = useLocation();
  
  // Helper function to check auth synchronously
  const checkAuthSync = () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        return {
          isLoggedIn: true,
          userRole: user.role || null,
          localUserData: user.user || user
        };
      }
      return {
        isLoggedIn: false,
        userRole: null,
        localUserData: null
      };
    } catch (error) {
      console.error('Error parsing user data:', error);
      return {
        isLoggedIn: false,
        userRole: null,
        localUserData: null
      };
    }
  };

  // Initialize state synchronously from localStorage
  const initialAuth = checkAuthSync();
  const [isLoggedIn, setIsLoggedIn] = useState(initialAuth.isLoggedIn);
  const [userRole, setUserRole] = useState(initialAuth.userRole);
  const [localUserData, setLocalUserData] = useState(initialAuth.localUserData);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Update auth status when storage changes (for logout from other tabs)
  useEffect(() => {
    const checkAuth = () => {
      const auth = checkAuthSync();
      setIsLoggedIn(auth.isLoggedIn);
      setUserRole(auth.userRole);
      setLocalUserData(auth.localUserData);
    };
    
    // Listen for storage changes (for logout from other tabs)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Get page name based on current route (only for dashboard pages)
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
        return null;
    }
  };

  // Get display name for user - prioritize name over email
  const getUserDisplayName = () => {
    // First check userData prop (passed from dashboard)
    if (userData?.full_name) return userData.full_name;
    
    // Check localUserData for name fields
    if (localUserData?.full_name) return localUserData.full_name;
    if (localUserData?.name) return localUserData.name;
    
    // Check profile data in localStorage (for candidates)
    try {
      const candidateProfileData = localStorage.getItem('candidateProfileData');
      if (candidateProfileData) {
        const profile = JSON.parse(candidateProfileData);
        if (profile.full_name) return profile.full_name;
      }
    } catch (error) {
      // Ignore parsing errors
    }
    
    // Fallback to email only if no name found
    if (userData?.contact_email) return userData.contact_email;
    if (localUserData?.email) return localUserData.email;
    if (localUserData?.contact_email) return localUserData.contact_email;
    
    return "User";
  };

  // Get user initial (first letter of name)
  const getUserInitial = () => {
    const displayName = getUserDisplayName();
    if (displayName && displayName !== "User") {
      // Get first letter and make it uppercase
      return displayName.charAt(0).toUpperCase();
    }
    // Fallback to "U" if no valid name found
    return "U";
  };

  // Get display email for user
  const getUserDisplayEmail = () => {
    if (userData?.contact_email) return userData.contact_email;
    if (localUserData?.email) return localUserData.email;
    if (localUserData?.contact_email) return localUserData.contact_email;
    return "user@example.com";
  };

  // Get role display name
  const getRoleDisplayName = () => {
    if (userRole) {
      return userRole.charAt(0).toUpperCase() + userRole.slice(1);
    }
    return "User";
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
      });

      if (response.ok) {
        // Clear any local storage or session data
        localStorage.clear();
        
        // Show success toast
        toast.success("Logged out successfully!");
        setShowLogoutModal(false);
        
        // Reset state
        setIsLoggedIn(false);
        setUserRole(null);
        setLocalUserData(null);
        
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

  // Prevent background scrolling when modal or mobile menu is open
  useEffect(() => {
    if (showLogoutModal || showChangePasswordModal || mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showLogoutModal, showChangePasswordModal, mobileMenuOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('.user-dropdown')) {
        setUserDropdownOpen(false);
      }
      if (mobileMenuOpen && !event.target.closest('nav') && !event.target.closest('button[aria-label="Toggle menu"]')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen, mobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Get dashboard link based on role
  const getDashboardLink = () => {
    if (userRole === 'candidate') {
      return '/candidate/dashboard';
    } else if (userRole === 'recruiter') {
      return '/recruiter/dashboard';
    } else if (userRole === 'staff') {
      return '/internal-team/dashboard';
    } else if (userRole === 'superadmin') {
      return '/superadmin/dashboard';
    }
    return '/';
  };

  const pageName = getPageName();
  const isDashboardPage = pageName !== null;

  // Check if a nav link is active
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

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

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
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
                <p className="mt-1.5 text-xs text-gray-500">Must be at least 8 characters long</p>
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

      {/* Header - Same style for both logged in and logged out */}
    <header className="border-b border-gray-100 bg-white fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-3">
        <div className="flex justify-between items-center">
            {/* Logo - Always show VettedPool logo */}
          <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
            <img 
              className="h-10 w-auto sm:h-10 md:h-12 max-w-[200px] sm:max-w-[220px] md:max-w-none object-contain" 
              src={logo} 
              alt="VettedPool Logo" 
            />
          </Link>

            {/* Navigation Links - Center (Desktop) */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link
                to="/"
                className={`relative text-sm lg:text-base font-medium text-[#273469] hover:text-[#1e2749] transition-colors duration-200 py-2 group ${
                  isActiveLink('/') ? 'text-[#1e2749]' : ''
                }`}
              >
                Home
                <span className={`absolute bottom-1 left-0 h-0.5 bg-[#273469] transition-all duration-300 ease-in-out ${
                  isActiveLink('/') ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
              <Link
                to="/about-us"
                className={`relative text-sm lg:text-base font-medium text-[#273469] hover:text-[#1e2749] transition-colors duration-200 py-2 group ${
                  isActiveLink('/about-us') ? 'text-[#1e2749]' : ''
                }`}
              >
                About Us
                <span className={`absolute bottom-1 left-0 h-0.5 bg-[#273469] transition-all duration-300 ease-in-out ${
                  isActiveLink('/about-us') ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
              <Link
                to="/pricing"
                className={`relative text-sm lg:text-base font-medium text-[#273469] hover:text-[#1e2749] transition-colors duration-200 py-2 group ${
                  isActiveLink('/pricing') ? 'text-[#1e2749]' : ''
                }`}
              >
                Pricing
                <span className={`absolute bottom-1 left-0 h-0.5 bg-[#273469] transition-all duration-300 ease-in-out ${
                  isActiveLink('/pricing') ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
              <Link
                to="/contact-us"
                className={`relative text-sm lg:text-base font-medium text-[#273469] hover:text-[#1e2749] transition-colors duration-200 py-2 group ${
                  isActiveLink('/contact-us') ? 'text-[#1e2749]' : ''
                }`}
              >
                Contact Us
                <span className={`absolute bottom-1 left-0 h-0.5 bg-[#273469] transition-all duration-300 ease-in-out ${
                  isActiveLink('/contact-us') ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            </nav>

            {/* Right Section - Login Button or User Dropdown + Mobile Menu */}
            <div className="flex items-center gap-2 sm:gap-3">
            {isLoggedIn ? (
              <>
                {/* Notification Dropdown - Only show for internal team (staff) */}
                {userRole === 'staff' && <NotificationDropdown />}
                
                {/* User Dropdown (when logged in) */}
                <div className="relative user-dropdown flex-shrink-0">
                <div className="flex items-center gap-2">
                  {/* User Info - Hidden on small screens, visible on sm+ */}
                  <div className="hidden sm:block text-right">
                    <div className="text-xs sm:text-sm font-medium text-gray-800 truncate max-w-[120px] lg:max-w-none">
                      {getUserDisplayName()}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500 truncate">{getRoleDisplayName()}</div>
                  </div>
                  {/* User Avatar - Always visible */}
                  <button
                    onClick={handleUserDropdownToggle}
                    className="w-10 h-10 sm:w-10 sm:h-10 bg-[#273469] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#1e2749] transition-all duration-200 border border-[#273469]/20 shadow-sm flex-shrink-0"
                  >
                    <span className="text-white font-bold text-sm sm:text-sm">
                      {getUserInitial()}
                    </span>
                  </button>
                </div>

                {/* User Dropdown Menu - Responsive */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg border border-gray-200/50 py-2 z-50">
                    {/* User Info Header */}
                    <div className="px-3 sm:px-4 py-3 border-b border-gray-300">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-10 h-10 sm:w-10 sm:h-10 bg-[#273469] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm sm:text-sm">
                            {getUserInitial()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                            {getUserDisplayName()}
                          </div>
                          <div className="text-[10px] sm:text-xs text-gray-500 truncate">
                            {getUserDisplayEmail()}
                          </div>
                          <div className="text-[10px] sm:text-xs text-[#273469] font-medium">{getRoleDisplayName()}</div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items - Responsive */}
                    <div className="py-1">
                      {/* Dashboard Link - Only show if not on dashboard page */}
                      {!isDashboardPage && (
                        <>
                          <Link
                            to={getDashboardLink()}
                            className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                            <span className="truncate">Dashboard</span>
                          </Link>
                          <div className="border-t border-gray-300 my-1"></div>
                        </>
                      )}
                      
            
                      
                      {/* Edit Profile - Only show if onEditProfile callback is provided */}
                      {onEditProfile && (
                        <>
                          <button
                            onClick={handleEditProfile}
                            className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                            <span className="truncate">Edit Profile</span>
                          </button>
                          <div className="border-t border-gray-300 my-1"></div>
                        </>
                      )}
                      
                      {/* Change Password */}
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
              </>
            ) : (
              // Login Button (when logged out)
            <Link
              to="/login"
              className="px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-dark transition"
            >
              Login
            </Link>
            )}

            {/* Mobile Menu Button - Show last on mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-lg text-[#273469] hover:text-[#1e2749] hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 flex-shrink-0 relative"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 transition-transform duration-300 rotate-0" />
                ) : (
                  <Menu className="h-6 w-6 transition-transform duration-300" />
                )}
              </div>
            </button>
            </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop Overlay */}
          <div 
            className="fixed top-[73px] left-0 right-0 bottom-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          
          {/* Menu Dropdown */}
          <div className="md:hidden border-t border-gray-200 bg-white shadow-xl relative z-50 transition-all duration-300 ease-out">
            <div className="max-w-7xl mx-auto px-4 py-5">
              <nav className="space-y-2">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 text-base font-medium rounded-lg transition-all duration-200 ${
                    isActiveLink('/')
                      ? 'text-[#1e2749] bg-gradient-to-r from-[#273469]/10 to-[#273469]/5 border-l-4 border-[#273469] shadow-sm'
                      : 'text-[#273469] hover:text-[#1e2749] hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-50 active:bg-gray-100'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full transition-colors ${isActiveLink('/') ? 'bg-[#273469]' : 'bg-gray-300'}`}></div>
                  <span className="font-semibold">Home</span>
                </Link>
                <Link
                  to="/about-us"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 text-base font-medium rounded-lg transition-all duration-200 ${
                    isActiveLink('/about-us')
                      ? 'text-[#1e2749] bg-gradient-to-r from-[#273469]/10 to-[#273469]/5 border-l-4 border-[#273469] shadow-sm'
                      : 'text-[#273469] hover:text-[#1e2749] hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-50 active:bg-gray-100'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full transition-colors ${isActiveLink('/about-us') ? 'bg-[#273469]' : 'bg-gray-300'}`}></div>
                  <span className="font-semibold">About Us</span>
                </Link>
                <Link
                  to="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 text-base font-medium rounded-lg transition-all duration-200 ${
                    isActiveLink('/pricing')
                      ? 'text-[#1e2749] bg-gradient-to-r from-[#273469]/10 to-[#273469]/5 border-l-4 border-[#273469] shadow-sm'
                      : 'text-[#273469] hover:text-[#1e2749] hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-50 active:bg-gray-100'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full transition-colors ${isActiveLink('/pricing') ? 'bg-[#273469]' : 'bg-gray-300'}`}></div>
                  <span className="font-semibold">Pricing</span>
                </Link>
                <Link
                  to="/contact-us"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 text-base font-medium rounded-lg transition-all duration-200 ${
                    isActiveLink('/contact-us')
                      ? 'text-[#1e2749] bg-gradient-to-r from-[#273469]/10 to-[#273469]/5 border-l-4 border-[#273469] shadow-sm'
                      : 'text-[#273469] hover:text-[#1e2749] hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-50 active:bg-gray-100'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full transition-colors ${isActiveLink('/contact-us') ? 'bg-[#273469]' : 'bg-gray-300'}`}></div>
                  <span className="font-semibold">Contact Us</span>
                </Link>
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
    </>
  );
};

export default Header;
