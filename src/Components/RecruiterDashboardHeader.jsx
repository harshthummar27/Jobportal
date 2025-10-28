import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Edit, LogOut, AlertTriangle } from "lucide-react";
import { toast } from 'react-toastify';

const RecruiterDashboardHeader = ({ onEditProfile, userData }) => {
  const location = useLocation();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

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

  const fetchProfileData = async () => {
    try {
      setProfileLoading(true);
      const token = localStorage.getItem('token');
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      
      const response = await fetch(`${baseURL}/api/recruiter/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      } else {
        console.error('Failed to fetch profile:', response.statusText);
        toast.error('Failed to load profile data');
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      toast.error('Error loading profile data');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleEditProfile = () => {
    setUserDropdownOpen(false);
    setShowProfileModal(true);
    fetchProfileData();
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

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setProfileData(null);
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showLogoutModal || showProfileModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showLogoutModal, showProfileModal]);


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

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">My Profile</h3>
                    <p className="text-sm text-gray-500">Recruiter Profile Information</p>
                  </div>
                </div>
                <button
                  onClick={closeProfileModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              {profileLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <svg className="animate-spin h-8 w-8 mx-auto text-blue-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-500 mt-2">Loading profile...</p>
                  </div>
                </div>
              ) : profileData ? (
                <div className="space-y-6">
                  {/* Company Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Company Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-600">Company Name</label>
                        <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile?.company_name || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Industry</label>
                        <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile?.industry || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Company Size</label>
                        <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile?.company_size || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Website</label>
                        <p className="text-sm text-gray-900 mt-1">
                          {profileData.recruiter_profile?.company_website ? (
                            <a href={profileData.recruiter_profile.company_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {profileData.recruiter_profile.company_website}
                            </a>
                          ) : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="text-xs font-medium text-gray-600">Company Description</label>
                      <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile?.company_description || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-600">Contact Person</label>
                        <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile?.contact_person_name || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Title</label>
                        <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile?.contact_person_title || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Email</label>
                        <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile?.contact_email || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Phone</label>
                        <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile?.contact_phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Address Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-600">Office Address</label>
                        <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile?.office_address || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">City</label>
                        <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile?.city || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">State</label>
                        <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile?.state || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Country</label>
                        <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile?.country || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Postal Code</label>
                        <p className="text-sm text-gray-900 mt-1">{profileData.recruiter_profile?.postal_code || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Verification Status</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        profileData.verification_status?.email_verified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        Email {profileData.verification_status?.email_verified ? 'Verified' : 'Not Verified'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        profileData.verification_status?.agreement_accepted 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        Agreement {profileData.verification_status?.agreement_accepted ? 'Accepted' : 'Not Accepted'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        profileData.verification_status?.fully_verified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {profileData.verification_status?.fully_verified ? 'Fully Verified' : 'Pending Verification'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 mx-auto text-red-400" />
                  <p className="text-red-600 mt-2 font-medium">Failed to load profile data</p>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={closeProfileModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Close
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
                  <span className="truncate">My Profile</span>
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

export default RecruiterDashboardHeader;