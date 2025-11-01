import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, User, Edit, LogOut, AlertTriangle, UserCircle, Building, Globe, Phone, Mail, MapPin, CheckCircle, X, Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from 'react-toastify';
import logo from '../../public/vettedpool-logo.webp';

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
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState(null);
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

  // Fetch recruiter profile
  const fetchRecruiterProfile = async () => {
    try {
      setLoadingProfile(true);
      setProfileError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recruiter/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      console.error('Error fetching recruiter profile:', error);
      setProfileError(error.message);
      toast.error(`Failed to load profile: ${error.message}`);
    } finally {
      setLoadingProfile(false);
    }
  };

  // Handle My Profile click
  const handleMyProfile = () => {
    setUserDropdownOpen(false);
    setShowProfileModal(true);
    fetchRecruiterProfile();
  };

  // Close profile modal
  const closeProfileModal = () => {
    setShowProfileModal(false);
    setProfileData(null);
    setProfileError(null);
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
    if (showLogoutModal || showProfileModal || showChangePasswordModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showLogoutModal, showProfileModal, showChangePasswordModal]);

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

      {/* Recruiter Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <UserCircle className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recruiter Profile</h3>
                  <p className="text-xs text-gray-500">View your complete profile information</p>
                </div>
              </div>
              <button
                onClick={closeProfileModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {loadingProfile ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                  <span className="ml-3 text-gray-600">Loading profile...</span>
                </div>
              ) : profileError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">Error loading profile: {profileError}</span>
                  </div>
                </div>
              ) : profileData?.recruiter_profile ? (
                <div className="space-y-6">
                  {/* Verification Status Section */}
                  {profileData.verification_status && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Verification Status
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="flex items-center gap-2">
                          {profileData.verification_status.email_verified ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <X className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-xs text-gray-700">Email Verified</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {profileData.verification_status.agreement_accepted ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <X className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-xs text-gray-700">Agreement Accepted</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {profileData.verification_status.fully_verified ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <X className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-xs text-gray-700">Fully Verified</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {profileData.verification_status.can_access_candidates ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <X className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-xs text-gray-700">Can Access Candidates</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Company Information Section */}
                  <div className="border border-gray-200 rounded-lg p-5">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Building className="h-4 w-4 text-indigo-600" />
                      Company Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500">Company Name</label>
                        <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile.company_name || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          Company Website
                        </label>
                        <p className="text-sm text-gray-900 mt-1">
                          {profileData.recruiter_profile.company_website ? (
                            <a href={profileData.recruiter_profile.company_website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                              {profileData.recruiter_profile.company_website}
                            </a>
                          ) : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">Company Size</label>
                        <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile.company_size || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">Industry</label>
                        <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile.industry || 'N/A'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-medium text-gray-500">Company Description</label>
                        <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile.company_description || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="border border-gray-200 rounded-lg p-5">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <UserCircle className="h-4 w-4 text-indigo-600" />
                      Contact Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500">Contact Person Name</label>
                        <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile.contact_person_name || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">Contact Person Title</label>
                        <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile.contact_person_title || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          Contact Email
                        </label>
                        <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile.contact_email || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          Contact Phone
                        </label>
                        <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile.contact_phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Address Information Section */}
                  <div className="border border-gray-200 rounded-lg p-5">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-indigo-600" />
                      Address Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="text-xs font-medium text-gray-500">Office Address</label>
                        <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile.office_address || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">City</label>
                        <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile.city || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">State</label>
                        <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile.state || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">Country</label>
                        <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile.country || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">Postal Code</label>
                        <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile.postal_code || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Agreement & Preferences Section */}
                  <div className="border border-gray-200 rounded-lg p-5">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Agreement & Preferences</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500">Agreement Accepted</label>
                        <p className="text-sm text-gray-900 mt-1 flex items-center gap-2">
                          {profileData.recruiter_profile.agreement_accepted ? (
                            <><CheckCircle className="h-4 w-4 text-green-600" /> Yes</>
                          ) : (
                            <><X className="h-4 w-4 text-red-600" /> No</>
                          )}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">Agreement Accepted At</label>
                        <p className="text-sm text-gray-900 mt-1">
                          {profileData.recruiter_profile.agreement_accepted_at 
                            ? new Date(profileData.recruiter_profile.agreement_accepted_at).toLocaleString()
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">Agreement Terms</label>
                        <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile.agreement_terms || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">Agreement Version</label>
                        <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile.agreement_version || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">Preferences</label>
                        <p className="text-sm text-gray-900 mt-1">
                          {profileData.recruiter_profile.preferences 
                            ? (typeof profileData.recruiter_profile.preferences === 'string' 
                              ? profileData.recruiter_profile.preferences 
                              : JSON.stringify(profileData.recruiter_profile.preferences))
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">Active Status</label>
                        <p className="text-sm text-gray-900 mt-1 flex items-center gap-2">
                          {profileData.recruiter_profile.is_active ? (
                            <><CheckCircle className="h-4 w-4 text-green-600" /> Active</>
                          ) : (
                            <><X className="h-4 w-4 text-red-600" /> Inactive</>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Email Verification Section */}
                  <div className="border border-gray-200 rounded-lg p-5">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Email Verification</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500">Email Verified</label>
                        <p className="text-sm text-gray-900 mt-1 flex items-center gap-2">
                          {profileData.recruiter_profile.email_verified ? (
                            <><CheckCircle className="h-4 w-4 text-green-600" /> Verified</>
                          ) : (
                            <><X className="h-4 w-4 text-red-600" /> Not Verified</>
                          )}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">Email Verified At</label>
                        <p className="text-sm text-gray-900 mt-1">
                          {profileData.recruiter_profile.email_verified_at 
                            ? new Date(profileData.recruiter_profile.email_verified_at).toLocaleString()
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                    <h4 className="text-xs font-medium text-gray-500 mb-3">Account Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
                      <div>
                        <span className="font-medium">Created:</span>{' '}
                        {profileData.recruiter_profile.created_at 
                          ? new Date(profileData.recruiter_profile.created_at).toLocaleString()
                          : 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Last Updated:</span>{' '}
                        {profileData.recruiter_profile.updated_at 
                          ? new Date(profileData.recruiter_profile.updated_at).toLocaleString()
                          : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No profile data available</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end">
              <button
                onClick={closeProfileModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                Close
              </button>
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

      {/* Header - Same style for both logged in and logged out */}
    <header className="border-b border-gray-100 bg-white fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
            {/* Logo - Always show Shield logo and VettedPool */}
          <Link to="/">
          <div className="flex items-center gap-2">
           <img className="h-10 w-[100%] text-indigo-600" src={logo} alt="" />
          </div>
          </Link>

            {/* Right Section - Login Button or User Dropdown */}
            {isLoggedIn ? (
              // User Dropdown (when logged in)
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
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 border border-indigo-200/50 shadow-sm flex-shrink-0"
                  >
                    <span className="text-white font-bold text-xs sm:text-sm">
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
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xs sm:text-sm">
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
                          <div className="text-[10px] sm:text-xs text-indigo-600 font-medium">{getRoleDisplayName()}</div>
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
            ) : (
              // Login Button (when logged out)
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-dark transition"
            >
              Login
            </Link>
              </div>
            )}
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;
