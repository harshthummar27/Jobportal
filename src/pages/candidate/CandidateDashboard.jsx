import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { User, Briefcase, CheckCircle, Eye, TrendingUp, Calendar, Bell, MapPin, GraduationCap, Award, Languages, Users, DollarSign, Shield, Phone, Mail, Building, Star, AlertCircle, RefreshCw, Edit, X, Clock ,FileText } from "lucide-react";
import { toast } from 'react-toastify';
import Header from "../../Components/Header";

const CandidateDashboard = () => {
  const location = useLocation();
  const [profileData, setProfileData] = useState(null);
  const [candidateCode, setCandidateCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  // Fetch profile data from API
  const fetchProfileData = async (showSuccessMessage = false) => {
    try {
      setIsLoading(true);
      setError(null);

      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const apiEndpoint = `${baseURL}/api/profile/show`;

      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile data');
      }

      // Set profile data from API response (extract from nested structure)
      const profileData = data.profile || data;
      setProfileData(profileData);
      setCandidateCode(profileData.candidate_code || profileData.candidateCode || "");
      
      // Also save to localStorage for offline access
      localStorage.setItem('candidateProfileData', JSON.stringify(profileData));
      
      

    } catch (error) {
      console.error("Profile fetch error:", error);
      
      // Handle specific error messages
      if (error.message.includes("token") || error.message.includes("unauthorized")) {
        toast.error("Session expired. Please log in again.");
        // Don't navigate here as it might cause issues, let user handle it
        setError("Session expired");
      } else if (error.message.includes("network") || error.message.includes("fetch")) {
        toast.error("Network error. Please check your connection.");
        setError("Network error");
      } else {
        toast.error(error.message || "Failed to load profile data");
        setError(error.message || "Failed to load profile");
      }

      // Fallback to localStorage data if API fails
      const savedProfileData = localStorage.getItem('candidateProfileData');
      if (savedProfileData) {
        const parsedData = JSON.parse(savedProfileData);
        setProfileData(parsedData);
        setCandidateCode(parsedData.candidate_code || parsedData.candidateCode || "");
        toast.info("Using cached profile data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load profile data on component mount
  useEffect(() => {
    // Check authentication first
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please log in to access this page.");
      // You can add navigation here if needed
      setIsLoading(false);
      return;
    }

    // Check if user has profile
    const hasProfileStatus = localStorage.getItem('has_profile');
    const hasProfileValue = hasProfileStatus === 'true';
    setHasProfile(hasProfileValue);

    // Try to load from location state first (if coming from profile setup)
    if (location.state?.profileData) {
      // If coming from profile setup, fetch fresh data from API to get complete profile
      setHasProfile(true);
      localStorage.setItem('has_profile', 'true');
      
      // Fetch profile data without showing success message
      fetchProfileData(false);
    } else if (hasProfileValue) {
      // Only fetch from API if user has profile
      fetchProfileData(false);
    } else {
      // User doesn't have profile, don't fetch profile data
      setIsLoading(false);
    }
  }, [location.state]);

  // Handle edit profile mode
  const handleEditProfile = () => {
    setIsEditMode(true);
    setEditFormData(profileData || {});
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditFormData({});
    // Restore background scrolling
    document.body.style.overflow = 'unset';
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const apiEndpoint = `${baseURL}/api/profile/update`;

      // Prepare the data to send (only the fields that are editable)
      const updateData = {
        city: editFormData.city || "",
        state: editFormData.state || "",
        willing_to_relocate: editFormData.willing_to_relocate || false,
        preferred_locations: editFormData.preferred_locations || [],
        desired_job_roles: editFormData.desired_job_roles || [],
        preferred_industries: editFormData.preferred_industries || [],
        employment_types: editFormData.employment_types || [],
        total_years_experience: editFormData.total_years_experience || 0,
        skills: editFormData.skills || [],
        desired_annual_package: editFormData.desired_annual_package || "",
        additional_notes: editFormData.additional_notes || ""
      };

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Success - close modal and refresh data
      toast.success("Profile updated successfully!");
      setIsEditMode(false);
      // Restore background scrolling
      document.body.style.overflow = 'unset';
      // Refresh profile data
      fetchProfileData(false);
      
    } catch (error) {
      console.error("Profile update error:", error);
      
      // Handle specific error messages
      if (error.message.includes("token") || error.message.includes("unauthorized")) {
        toast.error("Session expired. Please log in again.");
      } else if (error.message.includes("network") || error.message.includes("fetch")) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error(error.message || "Failed to update profile");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle refresh button click
  const handleRefresh = () => {
    // Check if user has profile first
    const hasProfileStatus = localStorage.getItem('has_profile');
    const hasProfileValue = hasProfileStatus === 'true';
    
    if (hasProfileValue) {
      // User has profile, fetch fresh data
      fetchProfileData(false);
    } else {
      // User doesn't have profile, just reload the page to show the same state
      window.location.reload();
    }
  };

  // Calculate profile completeness dynamically
  const calculateProfileCompleteness = () => {
    if (!profileData) return 0;
    
    const requiredFields = [
      'city', 'state', 'desired_job_roles', 'preferred_industries', 
      'employment_types', 'total_years_experience', 'visa_status', 
      'job_seeking_status'
    ];
    
    const optionalFields = [
      'current_employer', 'skills', 'education', 'certifications',
      'languages_spoken', 'preferred_locations', 'desired_annual_package',
      'availability_date', 'additional_notes'
    ];
    
    let completedRequired = 0;
    let completedOptional = 0;
    
    requiredFields.forEach(field => {
      if (profileData[field] && profileData[field] !== "" && 
          (!Array.isArray(profileData[field]) || profileData[field].length > 0)) {
        completedRequired++;
      }
    });
    
    optionalFields.forEach(field => {
      if (profileData[field] && profileData[field] !== "" && 
          (!Array.isArray(profileData[field]) || profileData[field].length > 0)) {
        completedOptional++;
      }
    });
    
    const requiredScore = (completedRequired / requiredFields.length) * 70; // 70% for required fields
    const optionalScore = (completedOptional / optionalFields.length) * 30; // 30% for optional fields
    
    return Math.round(requiredScore + optionalScore);
  };

  // Profile data with dynamic calculations
  const profile = {
    candidateCode: candidateCode || "Not Defined",
    status: hasProfile && profileData ? "pre-interviewed" : "incomplete",
    completeness: hasProfile ? calculateProfileCompleteness() : 0,
    activeApplications: profileData?.activeApplications || 0,
    totalViews: profileData?.totalViews || 0
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onEditProfile={handleEditProfile} userData={profileData} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
                <User className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">Loading Dashboard...</h3>
              <p className="text-sm text-gray-600">Fetching your profile data</p>
              <div className="mt-3 w-32 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
                <div className="h-1 bg-indigo-600 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !profileData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onEditProfile={handleEditProfile} userData={profileData} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">Failed to Load Profile</h3>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => fetchProfileData(false)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 text-sm font-medium"
              >
                <RefreshCw className="h-3 w-3" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onEditProfile={handleEditProfile} userData={profileData} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Modern Header */}
        <div className="mb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mt-[8vh]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
            <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Candidate Dashboard
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm">Welcome back! Here's your job search overview</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-white border border-gray-200 rounded-lg shadow-sm">
                <span className="text-xs font-medium text-gray-700">{profile.candidateCode}</span>
              </div>
              <button 
                onClick={handleRefresh}
                className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                title="Refresh Profile Data"
              >
                <RefreshCw className="h-3 w-3 text-gray-600" />
              </button>
              <button className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                <Bell className="h-3 w-3 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
            {/* Backdrop with blur */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={isSaving ? undefined : handleCancelEdit}
            ></div>
            
            {/* Modal Content - Fully Responsive */}
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg">
              {/* Floating X Icon - Top Right */}
              <button
                onClick={handleCancelEdit}
                disabled={isSaving}
                className={`absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm border border-gray-200 group ${
                  isSaving 
                    ? 'bg-gray-100 cursor-not-allowed' 
                    : 'bg-white hover:bg-gray-50'
                }`}
                title="Close"
              >
                <X className={`h-3 w-3 ${
                  isSaving ? 'text-gray-400' : 'text-gray-600 group-hover:text-gray-800'
                }`} />
              </button>
              
              {/* Simple Header */}
              <div className="px-4 sm:px-6 py-2 sm:py-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Edit className="h-3 w-3 text-white" />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Edit Profile</h2>
                </div>
              </div>
              
              {/* Modal Body */}
              <div className="px-4 sm:px-6 pb-3 sm:pb-4">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {/* Location & Basic Info */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-1">Location & Experience</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          value={editFormData.city || ""}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
                        <input
                          type="text"
                          value={editFormData.state || ""}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                          placeholder="State"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Total Years Experience</label>
                      <input
                        type="number"
                        value={editFormData.total_years_experience || ""}
                        onChange={(e) => handleInputChange('total_years_experience', parseInt(e.target.value))}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                        placeholder="Years of experience"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Desired Annual Package</label>
                      <input
                        type="number"
                        value={editFormData.desired_annual_package || ""}
                        onChange={(e) => handleInputChange('desired_annual_package', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                        placeholder="Desired salary"
                        min="0"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="willing_to_relocate"
                        checked={editFormData.willing_to_relocate || false}
                        onChange={(e) => handleInputChange('willing_to_relocate', e.target.checked)}
                        className="w-3 h-3 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="willing_to_relocate" className="text-xs font-medium text-gray-700">
                        Willing to Relocate
                      </label>
                    </div>
                  </div>

                  {/* Job Preferences */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-1">Job Preferences</h3>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Preferred Locations</label>
                      <input
                        type="text"
                        value={Array.isArray(editFormData.preferred_locations) ? editFormData.preferred_locations.join(', ') : ""}
                        onChange={(e) => handleInputChange('preferred_locations', e.target.value.split(',').map(item => item.trim()).filter(item => item))}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                        placeholder="Delhi, Gurgaon, Mumbai (comma separated)"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Desired Job Roles</label>
                      <input
                        type="text"
                        value={Array.isArray(editFormData.desired_job_roles) ? editFormData.desired_job_roles.join(', ') : ""}
                        onChange={(e) => handleInputChange('desired_job_roles', e.target.value.split(',').map(item => item.trim()).filter(item => item))}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                        placeholder="Senior Software Engineer, Team Lead (comma separated)"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Preferred Industries</label>
                      <input
                        type="text"
                        value={Array.isArray(editFormData.preferred_industries) ? editFormData.preferred_industries.join(', ') : ""}
                        onChange={(e) => handleInputChange('preferred_industries', e.target.value.split(',').map(item => item.trim()).filter(item => item))}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                        placeholder="IT, Finance, Healthcare (comma separated)"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Employment Types</label>
                      <input
                        type="text"
                        value={Array.isArray(editFormData.employment_types) ? editFormData.employment_types.join(', ') : ""}
                        onChange={(e) => handleInputChange('employment_types', e.target.value.split(',').map(item => item.trim()).filter(item => item))}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                        placeholder="Full-time, Contract, Part-time (comma separated)"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Skills</label>
                      <input
                        type="text"
                        value={Array.isArray(editFormData.skills) ? editFormData.skills.join(', ') : ""}
                        onChange={(e) => handleInputChange('skills', e.target.value.split(',').map(item => item.trim()).filter(item => item))}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                        placeholder="PHP, Laravel, JavaScript, React (comma separated)"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-2">Additional Information</h3>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Additional Notes</label>
                    <textarea
                      value={editFormData.additional_notes || ""}
                      onChange={(e) => handleInputChange('additional_notes', e.target.value)}
                      rows={3}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm resize-none"
                      placeholder="Looking for senior role with team leadership..."
                    />
                  </div>
                </div>
                
                {/* Save Button - Bottom */}
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                        isSaving 
                          ? 'bg-gray-400 text-white cursor-not-allowed' 
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {isSaving ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </div>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modern Status Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {/* Profile Status Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-gray-500">Status</p>
                <p className="text-sm font-bold text-gray-900">Active</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Profile Verified</span>
            </div>
          </div>

          {/* Profile Complete Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-gray-500">Complete</p>
                <p className="text-base font-bold text-gray-900">{profile.completeness}%</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
              <div className="bg-indigo-600 h-1 rounded-full transition-all duration-1000 ease-out" style={{ width: `${profile.completeness}%` }}></div>
            </div>
          </div>

          {/* Active Opportunities Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-gray-500">Opportunities</p>
                <p className="text-base font-bold text-gray-900">{profile.activeApplications}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-600">In Progress</span>
            </div>
          </div>

          {/* Profile Views Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Eye className="h-4 w-4 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-gray-500">Views</p>
                <p className="text-base font-bold text-gray-900">{profile.totalViews}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Last 30 days</span>
            </div>
          </div>
        </div>

        {/* Modern Profile Details Section - Only show if user has profile */}
        {hasProfile && profileData && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center">
                <User className="h-3 w-3 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Profile Details
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Basic Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                    <User className="h-3 w-3 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Basic Information</h3>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <User className="h-3 w-3 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-500">Full Name</p>
                        <p className="text-xs font-semibold text-gray-900">{profileData.full_name || "Not Defined"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <Mail className="h-3 w-3 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-500">Contact Email</p>
                        <p className="text-xs font-semibold text-gray-900">{profileData.contact_email || "Not Defined"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <Phone className="h-3 w-3 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-500">Contact Phone</p>
                        <p className="text-xs font-semibold text-gray-900">{profileData.contact_phone || "Not Defined"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <MapPin className="h-3 w-3 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-500">Location</p>
                        <p className="text-xs font-semibold text-gray-900">
                          {profileData.city && profileData.state 
                            ? `${profileData.city}, ${profileData.state}` 
                            : "Not Defined"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <Building className="h-3 w-3 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-500">Current Employer</p>
                        <p className="text-xs font-semibold text-gray-900">{profileData.current_employer || "Not Defined"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <Clock className="h-3 w-3 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-500">Experience</p>
                        <p className="text-xs font-semibold text-gray-900">
                          {profileData.total_years_experience 
                            ? `${profileData.total_years_experience} years` 
                            : "Not Defined"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <DollarSign className="h-3 w-3 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-500">Desired Package</p>
                        <p className="text-xs font-semibold text-gray-900">
                          {profileData.desired_annual_package 
                            ? `$${parseFloat(profileData.desired_annual_package).toLocaleString()}` 
                            : "Not Defined"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <Calendar className="h-3 w-3 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-500">Available From</p>
                        <p className="text-xs font-semibold text-gray-900">
                          {profileData.availability_date 
                            ? new Date(profileData.availability_date).toLocaleDateString() 
                            : "Not Defined"}
                        </p>
                      </div>
                    </div>
                  </div>
              </div>

              {/* Job Preferences */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-green-600 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-3 w-3 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Job Preferences</h3>
                </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Desired Roles</p>
                      <div className="flex flex-wrap gap-1">
                        {profileData.desired_job_roles && profileData.desired_job_roles.length > 0 ? (
                          profileData.desired_job_roles.map((role, index) => (
                            <span key={index} className="px-2 py-0.5 bg-green-100 text-green-800 rounded-md text-xs font-medium">
                              {role}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500 italic">Not Defined</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Preferred Industries</p>
                      <div className="flex flex-wrap gap-1">
                        {profileData.preferred_industries && profileData.preferred_industries.length > 0 ? (
                          profileData.preferred_industries.map((industry, index) => (
                            <span key={index} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">
                              {industry}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500 italic">Not Defined</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Employment Types</p>
                      <div className="flex flex-wrap gap-1">
                        {profileData.employment_types && profileData.employment_types.length > 0 ? (
                          profileData.employment_types.map((type, index) => (
                            <span key={index} className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-md text-xs font-medium">
                              {type}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500 italic">Not Defined</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <MapPin className="h-3 w-3 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-500">Relocation</p>
                        <p className="text-xs font-semibold text-gray-900">{profileData.relocation_willingness || "Not Defined"}</p>
                      </div>
                    </div>
                  </div>
              </div>

              {/* Skills & Education */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Star className="h-3 w-3 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Skills & Education</h3>
                </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {profileData.skills && profileData.skills.length > 0 ? (
                          profileData.skills.map((skill, index) => (
                            <span key={index} className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-md text-xs font-medium">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500 italic">Not Defined</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Education</p>
                      <div className="space-y-1">
                        {profileData.education && profileData.education.length > 0 ? (
                          profileData.education.map((edu, index) => (
                            <div key={index} className="p-2 bg-gray-50 rounded-lg">
                              <p className="text-xs font-semibold text-gray-900">{edu.degree}</p>
                              <p className="text-xs text-gray-600">{edu.institution} ({edu.year})</p>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500 italic">Not Defined</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Certifications</p>
                      <div className="flex flex-wrap gap-1">
                        {profileData.certifications && profileData.certifications.length > 0 ? (
                          profileData.certifications.map((cert, index) => (
                            <span key={index} className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-md text-xs font-medium">
                              {cert.name || cert}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500 italic">Not Defined</span>
                        )}
                      </div>
                    </div>
                  </div>
              </div>

              {/* Work Experience & Languages */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-orange-600 rounded-lg flex items-center justify-center">
                    <Award className="h-3 w-3 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Experience & Languages</h3>
                </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Job History</p>
                      <div className="space-y-1">
                        {profileData.job_history && profileData.job_history.length > 0 ? (
                          profileData.job_history.map((job, index) => (
                            <div key={index} className="p-2 bg-gray-50 rounded-lg border-l-2 border-orange-400">
                              <p className="text-xs font-semibold text-gray-900">{job.position}</p>
                              <p className="text-xs text-gray-600">{job.company} - {job.duration}</p>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500 italic">Not Defined</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Languages</p>
                      <div className="flex flex-wrap gap-1">
                        {profileData.languages_spoken && profileData.languages_spoken.length > 0 ? (
                          profileData.languages_spoken.map((language, index) => (
                            <span key={index} className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded-md text-xs font-medium">
                              {language}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500 italic">Not Defined</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Preferred Locations</p>
                      <div className="flex flex-wrap gap-1">
                        {profileData.preferred_locations && profileData.preferred_locations.length > 0 ? (
                          profileData.preferred_locations.map((location, index) => (
                            <span key={index} className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded-md text-xs font-medium">
                              {location}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500 italic">Not Defined</span>
                        )}
                      </div>
                    </div>
                  </div>
              </div>

              {/* Resume Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-cyan-600 rounded-lg flex items-center justify-center">
                    <FileText className="h-3 w-3 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Resume Information</h3>
                </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <FileText className="h-3 w-3 text-cyan-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-500">Resume File</p>
                        <p className="text-xs font-semibold text-gray-900">{profileData.resume_file_name || "Not Defined"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <FileText className="h-3 w-3 text-cyan-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-500">File Type</p>
                        <p className="text-xs font-semibold text-gray-900">{profileData.resume_mime_type || "Not Defined"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <FileText className="h-3 w-3 text-cyan-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-500">File Path</p>
                        <p className="text-xs font-semibold text-gray-900">{profileData.resume_file_path || "Not Defined"}</p>
                      </div>
                    </div>
                  </div>
              </div>

              {/* Additional Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 lg:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-gray-600 rounded-lg flex items-center justify-center">
                    <FileText className="h-3 w-3 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Additional Information</h3>
                </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <User className="h-3 w-3 text-gray-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-500">Profile ID</p>
                          <p className="text-xs font-semibold text-gray-900">{profileData.id || "Not Defined"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <User className="h-3 w-3 text-gray-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-500">User ID</p>
                          <p className="text-xs font-semibold text-gray-900">{profileData.user_id || "Not Defined"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <Shield className="h-3 w-3 text-gray-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-500">Visa Status</p>
                          <p className="text-xs font-semibold text-gray-900">
                            {profileData.visa_status 
                              ? profileData.visa_status.replace('_', ' ').toUpperCase() 
                              : "Not Defined"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <Clock className="h-3 w-3 text-gray-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-500">Job Seeking Status</p>
                          <p className="text-xs font-semibold text-gray-900">
                            {profileData.job_seeking_status 
                              ? profileData.job_seeking_status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) 
                              : "Not Defined"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <Users className="h-3 w-3 text-gray-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-500">Ethnicity</p>
                          <p className="text-xs font-semibold text-gray-900">{profileData.ethnicity || "Not Defined"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <CheckCircle className="h-3 w-3 text-gray-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-500">Willing to Relocate</p>
                          <p className="text-xs font-semibold text-gray-900">
                            {profileData.willing_to_relocate !== null && profileData.willing_to_relocate !== undefined 
                              ? (profileData.willing_to_relocate ? "Yes" : "No") 
                              : "Not Defined"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <Shield className="h-3 w-3 text-gray-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-500">Veteran Status</p>
                          <p className="text-xs font-semibold text-gray-900">
                            {profileData.veteran_status !== null && profileData.veteran_status !== undefined 
                              ? (profileData.veteran_status ? "Yes" : "No") 
                              : "Not Defined"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <Users className="h-3 w-3 text-gray-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-500">Disability Status</p>
                          <p className="text-xs font-semibold text-gray-900">
                            {profileData.disability_status !== null && profileData.disability_status !== undefined 
                              ? (profileData.disability_status ? "Yes" : "No") 
                              : "Not Defined"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <Star className="h-3 w-3 text-gray-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-500">Candidate Score</p>
                          <p className="text-xs font-semibold text-gray-900">{profileData.candidate_score || "Not Defined"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <User className="h-3 w-3 text-gray-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-500">Scored By</p>
                          <p className="text-xs font-semibold text-gray-900">{profileData.scored_by || "Not Defined"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <Calendar className="h-3 w-3 text-gray-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-500">Created At</p>
                          <p className="text-xs font-semibold text-gray-900">
                            {profileData.created_at 
                              ? new Date(profileData.created_at).toLocaleDateString() 
                              : "Not Defined"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <Clock className="h-3 w-3 text-gray-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-500">Updated At</p>
                          <p className="text-xs font-semibold text-gray-900">
                            {profileData.updated_at 
                              ? new Date(profileData.updated_at).toLocaleDateString() 
                              : "Not Defined"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {profileData.score_notes && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-500 mb-1">Score Notes</p>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-700">{profileData.score_notes}</p>
                      </div>
                    </div>
                  )}
                  
                  {profileData.additional_notes && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-500 mb-1">Additional Notes</p>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-700">{profileData.additional_notes}</p>
                      </div>
                    </div>
                  )}

                  {profileData.references && profileData.references.length > 0 ? (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-500 mb-1">References</p>
                      <div className="space-y-1">
                        {profileData.references.map((ref, index) => (
                          <div key={index} className="p-2 bg-gray-50 rounded-lg">
                            <p className="text-xs font-semibold text-gray-900">{ref.name}</p>
                            <p className="text-xs text-gray-600">{ref.position} - {ref.contact}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-500 mb-1">References</p>
                      <span className="text-xs text-gray-500 italic">Not Defined</span>
                    </div>
                  )}

                  {profileData.blocked_companies && profileData.blocked_companies.length > 0 ? (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-500 mb-1">Blocked Companies</p>
                      <div className="flex flex-wrap gap-1">
                        {profileData.blocked_companies.map((company, index) => (
                          <span key={index} className="px-2 py-0.5 bg-red-100 text-red-800 rounded-md text-xs font-medium">
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-500 mb-1">Blocked Companies</p>
                      <span className="text-xs text-gray-500 italic">Not Defined</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
        )}

        {/* Modern No Profile Data Message - Show when user doesn't have profile */}
        {!hasProfile && (
          <div className="mb-4">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <User className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Create Your Profile</h3>
              <p className="text-xs text-gray-600 mb-4 max-w-md mx-auto">Complete your profile setup to access exclusive job opportunities with pre-vetted companies and start your job search journey.</p>
              <Link
                to="/candidate/profile-setup"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 text-sm font-medium"
              >
                <User className="h-3 w-3" />
                Complete Profile Setup
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CandidateDashboard;
