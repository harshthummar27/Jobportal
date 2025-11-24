import React, { useState, useEffect, useRef } from "react";
import { 
  User, Briefcase, CheckCircle, TrendingUp, Calendar, MapPin, 
  Award, Users, DollarSign, Shield, Phone, Mail, 
  Building, Star, AlertCircle, RefreshCw, Clock, FileText, Edit, X, Save, Download
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import CandidateLayout from "../../Components/CandidateLayout";

const CandidateMyProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [candidateCode, setCandidateCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [currentSkill, setCurrentSkill] = useState({ name: "", experience: "" });
  const [editingSkillIndex, setEditingSkillIndex] = useState(null);
  const [editingSkill, setEditingSkill] = useState({ name: "", experience: "" });
  const [errors, setErrors] = useState({});
  const hasShownErrorToastRef = useRef(false);

  // Fetch profile data from API
  const fetchProfileData = async () => {
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
      
      // Dispatch custom event to update header immediately
      window.dispatchEvent(new CustomEvent('candidateProfileUpdated'));

      // Reset error toast flag on success
      hasShownErrorToastRef.current = false;

    } catch (error) {
      console.error("Profile fetch error:", error);
      
      // Check if it's a "profile not found" error - don't show toast for these
      const isProfileNotFound = error.message?.toLowerCase().includes("profile not found") || 
                                error.message?.toLowerCase().includes("not found") ||
                                error.message?.toLowerCase().includes("profile does not exist");
      
      if (isProfileNotFound) {
        // Don't show toast for profile not found errors - UI will handle it
        setError(error.message || "Profile not found");
      } else {
        // Handle other specific error messages - show toast only once
        if (error.message.includes("token") || error.message.includes("unauthorized")) {
          // Only show toast once to prevent duplicates from React StrictMode
          if (!hasShownErrorToastRef.current) {
            toast.error("Session expired. Please log in again.");
            hasShownErrorToastRef.current = true;
          }
          setError("Session expired");
        } else if (error.message.includes("network") || error.message.includes("fetch")) {
          // Only show toast once to prevent duplicates from React StrictMode
          if (!hasShownErrorToastRef.current) {
            toast.error("Network error. Please check your connection.");
            hasShownErrorToastRef.current = true;
          }
          setError("Network error");
        } else {
          // Only show toast once to prevent duplicates from React StrictMode
          if (!hasShownErrorToastRef.current) {
            toast.error(error.message || "Failed to load profile data");
            hasShownErrorToastRef.current = true;
          }
          setError(error.message || "Failed to load profile");
        }
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
      setIsLoading(false);
      return;
    }

    // Check if user has profile
    const hasProfileStatus = localStorage.getItem('has_profile');
    const hasProfileValue = hasProfileStatus === 'true';
    setHasProfile(hasProfileValue);

    if (hasProfileValue) {
      // Only fetch from API if user has profile
      fetchProfileData();
    } else {
      // User doesn't have profile, don't fetch profile data
      setIsLoading(false);
    }
  }, []);

  // Helper function to safely extract string value from array items
  // Handles both string and object formats (e.g., {name: "JavaScript", experience: "5 years"})
  const getArrayItemDisplay = (item) => {
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item !== null) {
      return item.name || item.title || item.value || JSON.stringify(item);
    }
    return String(item);
  };

  // Helper function to format experience string properly
  // Always uses "year" (singular) regardless of the number
  const formatExperience = (experience) => {
    if (!experience || experience.trim() === '') return '';
    
    // Extract number from the string
    const numberMatch = experience.trim().match(/\d+/);
    if (!numberMatch) return experience;
    
    const number = parseInt(numberMatch[0], 10);
    return `${number} year`;
  };

  // Helper function to format relocation willingness for display
  const formatRelocationWillingness = (value) => {
    if (!value || value.trim() === '') return 'Not Defined';
    
    const relocationMap = {
      'by_self': 'Yes, I can relocate by myself',
      'if_employer_covers': 'Yes, if employer covers relocation costs',
      'not_willing': 'Not willing to relocate'
    };
    
    return relocationMap[value] || value;
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

  // Handle refresh button click
  const handleRefresh = () => {
    // Reset error toast flag when manually refreshing
    hasShownErrorToastRef.current = false;
    
    // Check if user has profile first
    const hasProfileStatus = localStorage.getItem('has_profile');
    const hasProfileValue = hasProfileStatus === 'true';
    
    if (hasProfileValue) {
      // User has profile, fetch fresh data
      fetchProfileData();
    } else {
      // User doesn't have profile, just reload the page to show the same state
      window.location.reload();
    }
  };

  // Initialize edit form data
  const initializeEditForm = () => {
    if (profileData) {
      setEditFormData({
        city: profileData.city || "",
        state: profileData.state || "",
        gender: profileData.gender || "",
        current_employer: profileData.current_employer || "",
        total_years_experience: profileData.total_years_experience || "",
        desired_annual_package: profileData.desired_annual_package || "",
        availability_date: profileData.availability_date ? profileData.availability_date.split('T')[0] : "",
        desired_job_roles: profileData.desired_job_roles || [],
        preferred_industries: profileData.preferred_industries || [],
        employment_types: profileData.employment_types || [],
        skills: profileData.skills || [],
        languages_spoken: profileData.languages_spoken || [],
        preferred_locations: profileData.preferred_locations || [],
        relocation_willingness: profileData.relocation_willingness || "",
        visa_status: profileData.visa_status || "",
        job_seeking_status: profileData.job_seeking_status || "",
        education: profileData.education || [],
        certifications: profileData.certifications || [],
        job_history: profileData.job_history || [],
        ethnicity: profileData.ethnicity || "",
        veteran_status: profileData.veteran_status || false,
        disability_status: profileData.disability_status || false,
        willing_to_relocate: profileData.willing_to_relocate || false,
        additional_notes: profileData.additional_notes || "",
        references: profileData.references || []
      });
    }
  };

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (!isEditMode) {
      initializeEditForm();
    }
    setIsEditMode(!isEditMode);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditFormData({});
    setErrors({});
    setCurrentSkill({ name: "", experience: "" });
    setEditingSkillIndex(null);
    setEditingSkill({ name: "", experience: "" });
  };

  // Handle form input change
  const handleEditInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  // Handle array field changes (add/remove items)
  const handleArrayFieldChange = (field, action, value, index = null) => {
    setEditFormData(prev => {
      const currentArray = prev[field] || [];
      if (action === 'add' && value && !currentArray.includes(value)) {
        return { ...prev, [field]: [...currentArray, value] };
      } else if (action === 'remove' && index !== null) {
        return { ...prev, [field]: currentArray.filter((_, i) => i !== index) };
      }
      return prev;
    });
  };

  // Handle skill addition with experience
  const handleAddSkill = () => {
    if (currentSkill.name && currentSkill.name.trim()) {
      const experienceValue = currentSkill.experience.trim() || "0";
      const normalizedExperience = formatExperience(experienceValue);
      
      const skillObj = {
        name: currentSkill.name.trim(),
        experience: normalizedExperience
      };
      
      setEditFormData(prev => {
        const currentSkills = prev.skills || [];
        // Check if skill already exists
        const skillExists = currentSkills.some(
          s => (typeof s === 'string' ? s : s.name) === skillObj.name
        );
        
        if (!skillExists) {
          return { ...prev, skills: [...currentSkills, skillObj] };
        }
        return prev;
      });
      
      setCurrentSkill({ name: "", experience: "" });
    }
  };

  // Handle skill removal
  const handleRemoveSkill = (index) => {
    setEditFormData(prev => {
      const currentSkills = prev.skills || [];
      return { ...prev, skills: currentSkills.filter((_, i) => i !== index) };
    });
    // If removing the skill being edited, cancel edit mode
    if (editingSkillIndex === index) {
      setEditingSkillIndex(null);
      setEditingSkill({ name: "", experience: "" });
    }
  };

  // Handle start editing a skill
  const handleStartEditSkill = (index) => {
    const skills = editFormData.skills || profileData.skills || [];
    const skill = skills[index];
    if (skill) {
      setEditingSkillIndex(index);
      setEditingSkill({
        name: typeof skill === 'string' ? skill : skill.name || "",
        experience: typeof skill === 'string' ? "" : skill.experience || ""
      });
    }
  };

  // Handle save edited skill
  const handleSaveEditSkill = (index) => {
    if (editingSkill.name && editingSkill.name.trim()) {
      const experienceValue = editingSkill.experience.trim() || "0";
      const normalizedExperience = formatExperience(experienceValue);
      
      const skillObj = {
        name: editingSkill.name.trim(),
        experience: normalizedExperience
      };
      
      setEditFormData(prev => {
        const currentSkills = prev.skills || [];
        const updatedSkills = [...currentSkills];
        updatedSkills[index] = skillObj;
        return { ...prev, skills: updatedSkills };
      });
      
      setEditingSkillIndex(null);
      setEditingSkill({ name: "", experience: "" });
    }
  };

  // Handle cancel editing skill
  const handleCancelEditSkill = () => {
    setEditingSkillIndex(null);
    setEditingSkill({ name: "", experience: "" });
  };

  // Handle resume download
  const handleResumeDownload = async () => {
    if (!profileData.resume_file_path) {
      toast.error("Resume file not available");
      return;
    }

    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      // Construct the download URL
      const downloadUrl = profileData.resume_file_path.startsWith('http') 
        ? profileData.resume_file_path 
        : `${baseURL}${profileData.resume_file_path.startsWith('/') ? '' : '/'}${profileData.resume_file_path}`;
      
      // Fetch the file with authentication headers
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download resume');
      }

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = profileData.resume_file_name || 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Resume downloaded successfully");
    } catch (error) {
      console.error("Error downloading resume:", error);
      toast.error("Failed to download resume. Please try again.");
    }
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    try {
      // Clear previous errors
      setErrors({});
      
      // Transform skills to ensure correct format (array of objects with name and experience)
      const formattedSkills = (editFormData.skills || []).map(skill => {
        if (typeof skill === 'string') {
          // Backward compatibility: convert old string format to object format
          return {
            name: skill,
            experience: "0 years"
          };
        }
        // Ensure experience is provided and normalized, default to "0 years" if empty
        const experienceValue = skill.experience || "0";
        return {
          name: skill.name || skill,
          experience: formatExperience(experienceValue)
        };
      });

      // Prepare data for API
      const updateData = {
        city: editFormData.city || "",
        state: editFormData.state || "",
        gender: editFormData.gender || "",
        current_employer: editFormData.current_employer || "",
        total_years_experience: editFormData.total_years_experience ? parseInt(editFormData.total_years_experience) : null,
        desired_annual_package: editFormData.desired_annual_package ? parseFloat(editFormData.desired_annual_package) : null,
        availability_date: editFormData.availability_date || null,
        desired_job_roles: editFormData.desired_job_roles || [],
        preferred_industries: editFormData.preferred_industries || [],
        employment_types: editFormData.employment_types || [],
        skills: formattedSkills,
        languages_spoken: editFormData.languages_spoken || [],
        preferred_locations: editFormData.preferred_locations || [],
        relocation_willingness: editFormData.relocation_willingness || "",
        visa_status: editFormData.visa_status || "",
        job_seeking_status: editFormData.job_seeking_status || "",
        education: editFormData.education || [],
        certifications: editFormData.certifications || [],
        job_history: editFormData.job_history || [],
        ethnicity: editFormData.ethnicity || "",
        veteran_status: editFormData.veteran_status || false,
        disability_status: editFormData.disability_status || false,
        willing_to_relocate: editFormData.willing_to_relocate || false,
        additional_notes: editFormData.additional_notes || "",
        references: editFormData.references || []
      };

      const result = await updateProfileData(updateData);
      if (result.success) {
        setIsEditMode(false);
        setEditFormData({});
        setErrors({});
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    }
  };

  // Update profile data via API
  const updateProfileData = async (updatedData) => {
    try {
      setIsUpdating(true);
      setError(null);

      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const apiEndpoint = `${baseURL}/api/profile/update`;

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      // Parse response JSON
      let data;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        throw new Error("Invalid response from server. Please try again.");
      }

      if (!response.ok) {
        // Handle validation errors from backend
        const newErrors = {};
        let hasFieldErrors = false;
        
        // Check if backend returns errors object with field-specific errors
        if (data.errors && typeof data.errors === 'object') {
          Object.keys(data.errors).forEach(field => {
            const fieldErrors = data.errors[field];
            // Handle array of error messages (take first one) or single string
            if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
              newErrors[field] = fieldErrors[0];
            } else if (typeof fieldErrors === 'string') {
              newErrors[field] = fieldErrors;
            } else if (fieldErrors) {
              newErrors[field] = String(fieldErrors);
            }
            hasFieldErrors = true;
          });
        }
        
        // Set field-specific errors
        if (hasFieldErrors) {
          setErrors(newErrors);
        }
        
        // Handle general error messages
        const errorMessage = data.message || data.error || 'Profile update failed';
        
        // Check for authentication errors
        if (errorMessage.toLowerCase().includes("token") || 
            errorMessage.toLowerCase().includes("unauthorized") || 
            response.status === 401) {
          // Only show toast once to prevent duplicates
          if (!hasShownErrorToastRef.current) {
            toast.error("Session expired. Please log in again.");
            hasShownErrorToastRef.current = true;
          }
          setIsUpdating(false);
          return { success: false, errors: newErrors };
        }
        
        // Show general error message if no field-specific errors
        if (!hasFieldErrors) {
          // Only show toast once to prevent duplicates
          if (!hasShownErrorToastRef.current) {
            toast.error(errorMessage);
            hasShownErrorToastRef.current = true;
          }
        } else {
          // Show general error message for field errors
          if (!hasShownErrorToastRef.current) {
            toast.error("Failed to update profile. Please check the errors below.");
            hasShownErrorToastRef.current = true;
          }
        }
        setIsUpdating(false);
        return { success: false, errors: newErrors };
      }

      // Success - update local state
      const updatedProfile = data.profile || data.data || data;
      setProfileData(updatedProfile);
      setCandidateCode(updatedProfile.candidate_code || updatedProfile.candidateCode || candidateCode);
      
      // Dispatch custom event to update header immediately
      window.dispatchEvent(new CustomEvent('candidateProfileUpdated'));

      // Reset error toast flag on success
      hasShownErrorToastRef.current = false;
      
      toast.success("Profile updated successfully!");
      setIsUpdating(false);
      return { success: true, data: updatedProfile };

    } catch (error) {
      console.error("Profile update error:", error);
      
      // Handle network errors or other exceptions
      if (error.message) {
        if (error.message.includes('JSON') || error.message.includes('Failed to fetch')) {
          // Only show toast once to prevent duplicates
          if (!hasShownErrorToastRef.current) {
            toast.error("Network error. Please check your connection and try again.");
            hasShownErrorToastRef.current = true;
          }
        } else {
          // Only show toast once to prevent duplicates
          if (!hasShownErrorToastRef.current) {
            toast.error(error.message || "Failed to update profile. Please try again.");
            hasShownErrorToastRef.current = true;
          }
        }
      } else {
        // Only show toast once to prevent duplicates
        if (!hasShownErrorToastRef.current) {
          toast.error("Failed to update profile. Please try again.");
          hasShownErrorToastRef.current = true;
        }
      }
      
      setIsUpdating(false);
      return { success: false, errors: {} };
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <CandidateLayout>
        <div className="w-full max-w-none">
          <div className="mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
              <User className="h-6 w-6 sm:h-8 sm:w-8 animate-pulse mx-auto text-indigo-600 mb-2 sm:mb-3" />
              <p className="text-xs sm:text-sm text-gray-500 font-medium">Loading profile...</p>
            </div>
          </div>
        </div>
      </CandidateLayout>
    );
  }

  // Show error state
  if (error && !profileData) {
    return (
      <CandidateLayout>
        <div className="w-full max-w-none">
          <div className="mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8 lg:p-12 max-w-2xl mx-auto">
              <div className="flex flex-col items-center text-center">
                {/* Icon Container */}
                <div className="mb-4 sm:mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto bg-gradient-to-br from-red-50 to-orange-50 rounded-full flex items-center justify-center shadow-inner">
                    <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-red-500" />
                  </div>
                </div>
                
                {/* Error Title */}
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Profile Not Found
                </h2>
                
                {/* Error Message */}
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto leading-relaxed">
                  {error.includes("Profile not found") || error.includes("not found")
                    ? "We couldn't find your profile information. Please try refreshing or set up your profile."
                    : "There was an issue loading your profile. Please try again."}
                </p>
                
                {/* Action Button */}
                <div className="flex items-center justify-center w-full">
                  <button
                    onClick={() => fetchProfileData()}
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 text-sm sm:text-base font-semibold shadow-md hover:shadow-lg w-full sm:w-auto min-w-[140px]"
                  >
                    <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />
                    Try Again
                  </button>
                </div>
                
                {/* Additional Help Text */}
                <p className="text-xs sm:text-sm text-gray-500 mt-6 sm:mt-8 max-w-sm mx-auto">
                  If the problem persists, please contact support or try logging out and back in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CandidateLayout>
    );
  }

  return (
    <CandidateLayout>
      <div className="w-full max-w-none">
        <div className="mx-auto">
          {/* Page Header */}
          <div className="mb-3">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 hidden sm:block">View and manage your candidate profile</p>
              </div>
              <div className="flex items-center gap-2">
                {candidateCode && (
                  <div className="px-2 py-1 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700">{candidateCode}</span>
                  </div>
                )}
                {!isEditMode ? (
                  <button
                    onClick={handleEditToggle}
                    className="p-1.5 sm:p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 flex-shrink-0"
                    title="Edit Profile"
                  >
                    <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isUpdating}
                      className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 text-[10px] sm:text-xs font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Save Changes"
                    >
                      <Save className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className="hidden sm:inline">Save</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isUpdating}
                      className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 text-[10px] sm:text-xs font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Cancel"
                    >
                      <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className="hidden sm:inline">Cancel</span>
                    </button>
                  </div>
                )}
                <button 
                  onClick={handleRefresh}
                  className="p-1.5 sm:p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex-shrink-0"
                  title="Refresh Profile Data"
                  disabled={isUpdating}
                >
                  <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 ${isUpdating ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Completeness Card */}
          {hasProfile && profileData && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Profile Completeness</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mt-0.5">{calculateProfileCompleteness()}%</p>
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 text-indigo-600" />
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-indigo-600 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${calculateProfileCompleteness()}%` }}></div>
              </div>
            </div>
          )}

          {/* Modern Profile Details Section - Only show if user has profile */}
          {hasProfile && profileData && (
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Profile Details</h2>
                  <p className="text-xs text-gray-600 hidden sm:block">Your complete profile information</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
                {/* Basic Information */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">Basic Information</h3>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                      <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs font-medium text-gray-500">Full Name</p>
                        <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">{profileData.full_name || "Not Defined"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                      <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs font-medium text-gray-500">Gender</p>
                        {isEditMode ? (
                          <div>
                            <select
                              value={editFormData.gender || ""}
                              onChange={(e) => handleEditInputChange('gender', e.target.value)}
                              className={`w-full mt-0.5 px-2 py-1 text-[10px] sm:text-xs border rounded focus:outline-none focus:ring-1 ${
                                errors.gender 
                                  ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                                  : 'border-gray-300 focus:ring-indigo-500'
                              }`}
                            >
                              <option value="">Select gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                              <option value="prefer_not_to_say">Prefer not to say</option>
                            </select>
                            {errors.gender && (
                              <p className="mt-1 text-[10px] text-red-600 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.gender}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">
                            {profileData.gender 
                              ? profileData.gender.charAt(0).toUpperCase() + profileData.gender.slice(1).replace(/_/g, ' ')
                              : "Not Defined"}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                      <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs font-medium text-gray-500">Contact Email</p>
                        <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">{profileData.contact_email || "Not Defined"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                      <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs font-medium text-gray-500">Contact Phone</p>
                        <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">{profileData.contact_phone || "Not Defined"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                      <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs font-medium text-gray-500">Location</p>
                        {isEditMode ? (
                          <div>
                            <div className="flex gap-1 mt-0.5">
                              <div className="flex-1">
                                <input
                                  type="text"
                                  placeholder="City"
                                  value={editFormData.city || ""}
                                  onChange={(e) => handleEditInputChange('city', e.target.value)}
                                  className={`w-full px-2 py-1 text-[10px] sm:text-xs border rounded focus:outline-none focus:ring-1 ${
                                    errors.city 
                                      ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                                      : 'border-gray-300 focus:ring-indigo-500'
                                  }`}
                                />
                              </div>
                              <div className="flex-1">
                                <input
                                  type="text"
                                  placeholder="State"
                                  value={editFormData.state || ""}
                                  onChange={(e) => handleEditInputChange('state', e.target.value)}
                                  className={`w-full px-2 py-1 text-[10px] sm:text-xs border rounded focus:outline-none focus:ring-1 ${
                                    errors.state 
                                      ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                                      : 'border-gray-300 focus:ring-indigo-500'
                                  }`}
                                />
                              </div>
                            </div>
                            {errors.city && (
                              <p className="mt-1 text-[10px] text-red-600 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.city}
                              </p>
                            )}
                            {errors.state && (
                              <p className="mt-1 text-[10px] text-red-600 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.state}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">
                            {profileData.city && profileData.state 
                              ? `${profileData.city}, ${profileData.state}` 
                              : "Not Defined"}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                      <Building className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs font-medium text-gray-500">Current Employer</p>
                        {isEditMode ? (
                          <div>
                            <input
                              type="text"
                              value={editFormData.current_employer || ""}
                              onChange={(e) => handleEditInputChange('current_employer', e.target.value)}
                              className={`w-full mt-0.5 px-2 py-1 text-[10px] sm:text-xs border rounded focus:outline-none focus:ring-1 ${
                                errors.current_employer 
                                  ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                                  : 'border-gray-300 focus:ring-indigo-500'
                              }`}
                              placeholder="Current Employer"
                            />
                            {errors.current_employer && (
                              <p className="mt-1 text-[10px] text-red-600 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.current_employer}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">{profileData.current_employer || "Not Defined"}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                      <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs font-medium text-gray-500">Experience</p>
                        {isEditMode ? (
                          <div>
                            <input
                              type="number"
                              value={editFormData.total_years_experience || ""}
                              onChange={(e) => handleEditInputChange('total_years_experience', e.target.value)}
                              className={`w-full mt-0.5 px-2 py-1 text-[10px] sm:text-xs border rounded focus:outline-none focus:ring-1 ${
                                errors.total_years_experience 
                                  ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                                  : 'border-gray-300 focus:ring-indigo-500'
                              }`}
                              placeholder="Years of experience"
                              min="0"
                            />
                            {errors.total_years_experience && (
                              <p className="mt-1 text-[10px] text-red-600 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.total_years_experience}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">
                            {profileData.total_years_experience 
                              ? `${profileData.total_years_experience} years` 
                              : "Not Defined"}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                      <DollarSign className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs font-medium text-gray-500">Desired Package</p>
                        {isEditMode ? (
                          <div>
                            <input
                              type="number"
                              value={editFormData.desired_annual_package || ""}
                              onChange={(e) => handleEditInputChange('desired_annual_package', e.target.value)}
                              className={`w-full mt-0.5 px-2 py-1 text-[10px] sm:text-xs border rounded focus:outline-none focus:ring-1 ${
                                errors.desired_annual_package 
                                  ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                                  : 'border-gray-300 focus:ring-indigo-500'
                              }`}
                              placeholder="Desired annual package (USD)"
                              min="0"
                              step="1000"
                            />
                            {errors.desired_annual_package && (
                              <p className="mt-1 text-[10px] text-red-600 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.desired_annual_package}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">
                            {profileData.desired_annual_package 
                              ? `$${parseFloat(profileData.desired_annual_package).toLocaleString()}` 
                              : "Not Defined"}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                      <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs font-medium text-gray-500">Available From</p>
                        {isEditMode ? (
                          <input
                            type="date"
                            value={editFormData.availability_date || ""}
                            onChange={(e) => handleEditInputChange('availability_date', e.target.value)}
                            className="w-full mt-0.5 px-2 py-1 text-[10px] sm:text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        ) : (
                          <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">
                            {profileData.availability_date 
                              ? new Date(profileData.availability_date).toLocaleDateString() 
                              : "Not Defined"}
                          </p>
                        )}
                      </div>
                    </div>
                    {profileData.resume_file_path && (
                      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                        <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-1">Resume</p>
                          <button
                            onClick={handleResumeDownload}
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-200 text-[10px] sm:text-xs font-medium shadow-sm hover:shadow-md"
                          >
                            <Download className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{profileData.resume_file_name || 'Download Resume'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Job Preferences */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">Job Preferences</h3>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <div>
                      <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-1">Desired Roles</p>
                      {isEditMode ? (
                        <div className="space-y-1">
                          <div className="flex gap-1">
                            <input
                              type="text"
                              placeholder="Add role"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const value = e.target.value.trim();
                                  if (value) {
                                    handleArrayFieldChange('desired_job_roles', 'add', value);
                                    if (errors.desired_job_roles) {
                                      setErrors(prev => ({ ...prev, desired_job_roles: "" }));
                                    }
                                  }
                                  e.target.value = '';
                                }
                              }}
                              className={`flex-1 px-2 py-1 text-[10px] sm:text-xs border rounded focus:outline-none focus:ring-1 ${
                                errors.desired_job_roles 
                                  ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                                  : 'border-gray-300 focus:ring-indigo-500'
                              }`}
                            />
                          </div>
                          {errors.desired_job_roles && (
                            <p className="text-[10px] text-red-600 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.desired_job_roles}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {(editFormData.desired_job_roles || profileData.desired_job_roles || []).map((role, index) => (
                              <span key={index} className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-100 text-green-800 rounded-md text-[10px] sm:text-xs font-medium">
                                {getArrayItemDisplay(role)}
                                <button
                                  type="button"
                                  onClick={() => handleArrayFieldChange('desired_job_roles', 'remove', null, index)}
                                  className="hover:text-red-600"
                                >
                                  <X className="h-2.5 w-2.5" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {profileData.desired_job_roles && profileData.desired_job_roles.length > 0 ? (
                            profileData.desired_job_roles.map((role, index) => (
                              <span key={index} className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded-md text-[10px] sm:text-xs font-medium">
                                {getArrayItemDisplay(role)}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] sm:text-xs text-gray-500 italic">Not Defined</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-1">Preferred Industries</p>
                      {isEditMode ? (
                        <div className="space-y-1">
                          <div className="flex gap-1">
                            <input
                              type="text"
                              placeholder="Add industry"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const value = e.target.value.trim();
                                  if (value) {
                                    handleArrayFieldChange('preferred_industries', 'add', value);
                                    if (errors.preferred_industries) {
                                      setErrors(prev => ({ ...prev, preferred_industries: "" }));
                                    }
                                  }
                                  e.target.value = '';
                                }
                              }}
                              className={`flex-1 px-2 py-1 text-[10px] sm:text-xs border rounded focus:outline-none focus:ring-1 ${
                                errors.preferred_industries 
                                  ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                                  : 'border-gray-300 focus:ring-indigo-500'
                              }`}
                            />
                          </div>
                          {errors.preferred_industries && (
                            <p className="text-[10px] text-red-600 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.preferred_industries}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {(editFormData.preferred_industries || profileData.preferred_industries || []).map((industry, index) => (
                              <span key={index} className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-md text-[10px] sm:text-xs font-medium">
                                {getArrayItemDisplay(industry)}
                                <button
                                  type="button"
                                  onClick={() => handleArrayFieldChange('preferred_industries', 'remove', null, index)}
                                  className="hover:text-red-600"
                                >
                                  <X className="h-2.5 w-2.5" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {profileData.preferred_industries && profileData.preferred_industries.length > 0 ? (
                            profileData.preferred_industries.map((industry, index) => (
                              <span key={index} className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-md text-[10px] sm:text-xs font-medium">
                                {getArrayItemDisplay(industry)}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] sm:text-xs text-gray-500 italic">Not Defined</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-1">Employment Types</p>
                      {isEditMode ? (
                        <div className="space-y-1">
                          <div className="flex gap-1">
                            <input
                              type="text"
                              placeholder="Add employment type"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const value = e.target.value.trim();
                                  if (value) {
                                    handleArrayFieldChange('employment_types', 'add', value);
                                    if (errors.employment_types) {
                                      setErrors(prev => ({ ...prev, employment_types: "" }));
                                    }
                                  }
                                  e.target.value = '';
                                }
                              }}
                              className={`flex-1 px-2 py-1 text-[10px] sm:text-xs border rounded focus:outline-none focus:ring-1 ${
                                errors.employment_types 
                                  ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                                  : 'border-gray-300 focus:ring-indigo-500'
                              }`}
                            />
                          </div>
                          {errors.employment_types && (
                            <p className="text-[10px] text-red-600 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.employment_types}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {(editFormData.employment_types || profileData.employment_types || []).map((type, index) => (
                              <span key={index} className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded-md text-[10px] sm:text-xs font-medium">
                                {getArrayItemDisplay(type)}
                                <button
                                  type="button"
                                  onClick={() => handleArrayFieldChange('employment_types', 'remove', null, index)}
                                  className="hover:text-red-600"
                                >
                                  <X className="h-2.5 w-2.5" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {profileData.employment_types && profileData.employment_types.length > 0 ? (
                            profileData.employment_types.map((type, index) => (
                              <span key={index} className="px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded-md text-[10px] sm:text-xs font-medium">
                                {getArrayItemDisplay(type)}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] sm:text-xs text-gray-500 italic">Not Defined</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                      <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs font-medium text-gray-500">Relocation</p>
                        {isEditMode ? (
                          <div>
                            <select
                              value={editFormData.relocation_willingness || ""}
                              onChange={(e) => handleEditInputChange('relocation_willingness', e.target.value)}
                              className={`w-full mt-0.5 px-2 py-1 text-[10px] sm:text-xs border rounded focus:outline-none focus:ring-1 ${
                                errors.relocation_willingness 
                                  ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                                  : 'border-gray-300 focus:ring-indigo-500'
                              }`}
                            >
                              <option value="">Select relocation preference</option>
                              <option value="by_self">Yes, I can relocate by myself</option>
                              <option value="if_employer_covers">Yes, if employer covers relocation costs</option>
                              <option value="not_willing">Not willing to relocate</option>
                            </select>
                            {errors.relocation_willingness && (
                              <p className="mt-1 text-[10px] text-red-600 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.relocation_willingness}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">
                            {formatRelocationWillingness(profileData.relocation_willingness)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills & Education */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Star className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">Skills & Education</h3>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <div>
                      <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-1">Skills</p>
                      {isEditMode ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-1">
                            <input
                              type="text"
                              placeholder="Skill name"
                              value={currentSkill.name}
                              onChange={(e) => setCurrentSkill(prev => ({ ...prev, name: e.target.value }))}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddSkill();
                                }
                              }}
                              className="px-2 py-1 text-[10px] sm:text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <input
                              type="text"
                              placeholder="Experience (e.g., 3 years)"
                              value={currentSkill.experience}
                              onChange={(e) => setCurrentSkill(prev => ({ ...prev, experience: e.target.value }))}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddSkill();
                                }
                              }}
                              className="px-2 py-1 text-[10px] sm:text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleAddSkill}
                            className="px-2 py-1 bg-indigo-600 text-white rounded text-[10px] sm:text-xs hover:bg-indigo-700 transition-colors"
                          >
                            Add Skill
                          </button>
                          <div className="space-y-1">
                            {(editFormData.skills || profileData.skills || []).map((skill, index) => {
                              const skillName = typeof skill === 'string' ? skill : skill.name;
                              const skillExperience = typeof skill === 'string' ? '' : skill.experience;
                              const formattedExperience = skillExperience ? formatExperience(skillExperience) : '';
                              const isEditing = editingSkillIndex === index;
                              
                              if (isEditing) {
                                // Show edit mode with input fields
                                return (
                                  <div key={index} className="p-1.5 bg-blue-50 rounded-md border border-blue-200">
                                    <div className="grid grid-cols-2 gap-1 mb-1">
                                      <input
                                        type="text"
                                        placeholder="Skill name"
                                        value={editingSkill.name}
                                        onChange={(e) => setEditingSkill(prev => ({ ...prev, name: e.target.value }))}
                                        className="px-2 py-1 text-[10px] sm:text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                      />
                                      <input
                                        type="text"
                                        placeholder="Experience (e.g., 3 years)"
                                        value={editingSkill.experience}
                                        onChange={(e) => setEditingSkill(prev => ({ ...prev, experience: e.target.value }))}
                                        className="px-2 py-1 text-[10px] sm:text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                      />
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => handleSaveEditSkill(index)}
                                        className="px-2 py-0.5 bg-green-600 text-white rounded text-[10px] sm:text-xs hover:bg-green-700 transition-colors flex items-center gap-1"
                                      >
                                        <Save className="h-2.5 w-2.5" />
                                        Save
                                      </button>
                                      <button
                                        type="button"
                                        onClick={handleCancelEditSkill}
                                        className="px-2 py-0.5 bg-gray-600 text-white rounded text-[10px] sm:text-xs hover:bg-gray-700 transition-colors flex items-center gap-1"
                                      >
                                        <X className="h-2.5 w-2.5" />
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                );
                              }
                              
                              // Show normal view with edit and delete buttons
                              return (
                                <div key={index} className="flex items-center justify-between p-1.5 bg-gray-50 rounded-md">
                                  <div className="flex-1 min-w-0">
                                    <span className="text-[10px] sm:text-xs font-medium text-gray-900">{skillName}</span>
                                    {formattedExperience && (
                                      <span className="text-[10px] sm:text-xs text-gray-600 ml-1">({formattedExperience})</span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 ml-2">
                                    <button
                                      type="button"
                                      onClick={() => handleStartEditSkill(index)}
                                      className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                                      title="Edit skill"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveSkill(index)}
                                      className="text-red-600 hover:text-red-800 flex-shrink-0"
                                      title="Remove skill"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {profileData.skills && profileData.skills.length > 0 ? (
                            profileData.skills.map((skill, index) => {
                              const skillName = typeof skill === 'string' ? skill : skill.name;
                              const skillExperience = typeof skill === 'string' ? '' : skill.experience;
                              const formattedExperience = skillExperience ? formatExperience(skillExperience) : '';
                              return (
                                <div key={index} className="p-1.5 bg-purple-50 rounded-md border border-purple-200">
                                  <span className="text-[10px] sm:text-xs font-medium text-purple-900">{skillName}</span>
                                  {formattedExperience && (
                                    <span className="text-[10px] sm:text-xs text-purple-700 ml-1">({formattedExperience})</span>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <span className="text-[10px] sm:text-xs text-gray-500 italic">Not Defined</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-1">Education</p>
                      <div className="space-y-1">
                        {profileData.education && profileData.education.length > 0 ? (
                          profileData.education.map((edu, index) => (
                            <div key={index} className="p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                              <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">{edu.degree}</p>
                              <p className="text-[10px] sm:text-xs text-gray-600 truncate">{edu.institution} ({edu.year})</p>
                            </div>
                          ))
                        ) : (
                          <span className="text-[10px] sm:text-xs text-gray-500 italic">Not Defined</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-1">Certifications</p>
                      <div className="flex flex-wrap gap-1">
                        {profileData.certifications && profileData.certifications.length > 0 ? (
                          profileData.certifications.map((cert, index) => (
                            <span key={index} className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded-md text-[10px] sm:text-xs font-medium">
                              {cert.name || cert}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] sm:text-xs text-gray-500 italic">Not Defined</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Work Experience & Languages */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">Experience & Languages</h3>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <div>
                      <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-1">Job History</p>
                      <div className="space-y-1">
                        {profileData.job_history && profileData.job_history.length > 0 ? (
                          profileData.job_history.map((job, index) => {
                            // Format dates
                            const startDate = job.start_date 
                              ? new Date(job.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                              : 'N/A';
                            const endDate = job.end_date 
                              ? new Date(job.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                              : 'Present';
                            
                            return (
                              <div key={index} className="p-1.5 sm:p-2 bg-gray-50 rounded-lg border-l-2 border-orange-400">
                                <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">
                                  {job.position || 'N/A'}
                                </p>
                                <p className="text-[10px] sm:text-xs text-gray-600 truncate">
                                  {job.company || 'N/A'}
                                </p>
                                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                                  {startDate} - {endDate}
                                </p>
                              </div>
                            );
                          })
                        ) : (
                          <span className="text-[10px] sm:text-xs text-gray-500 italic">Not Defined</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-1">Languages</p>
                      {isEditMode ? (
                        <div className="space-y-1">
                          <div className="flex gap-1">
                            <input
                              type="text"
                              placeholder="Add language"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const value = e.target.value.trim();
                                  if (value) handleArrayFieldChange('languages_spoken', 'add', value);
                                  e.target.value = '';
                                }
                              }}
                              className="flex-1 px-2 py-1 text-[10px] sm:text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {(editFormData.languages_spoken || profileData.languages_spoken || []).map((language, index) => (
                              <span key={index} className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-teal-100 text-teal-800 rounded-md text-[10px] sm:text-xs font-medium">
                                {getArrayItemDisplay(language)}
                                <button
                                  type="button"
                                  onClick={() => handleArrayFieldChange('languages_spoken', 'remove', null, index)}
                                  className="hover:text-red-600"
                                >
                                  <X className="h-2.5 w-2.5" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {profileData.languages_spoken && profileData.languages_spoken.length > 0 ? (
                            profileData.languages_spoken.map((language, index) => (
                              <span key={index} className="px-1.5 py-0.5 bg-teal-100 text-teal-800 rounded-md text-[10px] sm:text-xs font-medium">
                                {getArrayItemDisplay(language)}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] sm:text-xs text-gray-500 italic">Not Defined</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-1">Preferred Locations</p>
                      <div className="flex flex-wrap gap-1">
                        {profileData.preferred_locations && profileData.preferred_locations.length > 0 ? (
                          profileData.preferred_locations.map((location, index) => (
                            <span key={index} className="px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded-md text-[10px] sm:text-xs font-medium">
                              {getArrayItemDisplay(location)}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] sm:text-xs text-gray-500 italic">Not Defined</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-md transition-all duration-200 lg:col-span-2">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">Additional Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                        <Shield className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] sm:text-xs font-medium text-gray-500">Visa Status</p>
                          {isEditMode ? (
                            <div>
                              <select
                                value={editFormData.visa_status || ""}
                                onChange={(e) => handleEditInputChange('visa_status', e.target.value)}
                                className={`w-full mt-0.5 px-2 py-1 text-[10px] sm:text-xs border rounded focus:outline-none focus:ring-1 ${
                                  errors.visa_status 
                                    ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                                    : 'border-gray-300 focus:ring-indigo-500'
                                }`}
                              >
                                <option value="">Select visa status</option>
                                <option value="us_citizen">US Citizen</option>
                                <option value="permanent_resident">Permanent Resident</option>
                                <option value="h1b">H1B</option>
                                <option value="opt_cpt">OPT/CPT</option>
                                <option value="other">Other</option>
                              </select>
                              {errors.visa_status && (
                                <p className="mt-1 text-[10px] text-red-600 flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  {errors.visa_status}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">
                              {profileData.visa_status 
                                ? profileData.visa_status.replace('_', ' ').toUpperCase() 
                                : "Not Defined"}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                        <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] sm:text-xs font-medium text-gray-500">Job Seeking Status</p>
                          {isEditMode ? (
                            <div>
                              <select
                                value={editFormData.job_seeking_status || ""}
                                onChange={(e) => handleEditInputChange('job_seeking_status', e.target.value)}
                                className={`w-full mt-0.5 px-2 py-1 text-[10px] sm:text-xs border rounded focus:outline-none focus:ring-1 ${
                                  errors.job_seeking_status 
                                    ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                                    : 'border-gray-300 focus:ring-indigo-500'
                                }`}
                              >
                                <option value="">Select status</option>
                                <option value="actively_looking">Actively Looking</option>
                                <option value="open_to_offers">Open to Offers</option>
                                <option value="not_looking">Not Looking</option>
                              </select>
                              {errors.job_seeking_status && (
                                <p className="mt-1 text-[10px] text-red-600 flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  {errors.job_seeking_status}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">
                              {profileData.job_seeking_status 
                                ? profileData.job_seeking_status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) 
                                : "Not Defined"}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                        <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] sm:text-xs font-medium text-gray-500">Ethnicity</p>
                          {isEditMode ? (
                            <input
                              type="text"
                              value={editFormData.ethnicity || ""}
                              onChange={(e) => handleEditInputChange('ethnicity', e.target.value)}
                              className="w-full mt-0.5 px-2 py-1 text-[10px] sm:text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              placeholder="Ethnicity"
                            />
                          ) : (
                            <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">{profileData.ethnicity || "Not Defined"}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                        <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] sm:text-xs font-medium text-gray-500">Willing to Relocate</p>
                          <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">
                            {profileData.willing_to_relocate !== null && profileData.willing_to_relocate !== undefined 
                              ? (profileData.willing_to_relocate ? "Yes" : "No") 
                              : "Not Defined"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                        <Shield className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] sm:text-xs font-medium text-gray-500">Veteran Status</p>
                          <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">
                            {profileData.veteran_status !== null && profileData.veteran_status !== undefined 
                              ? (profileData.veteran_status ? "Yes" : "No") 
                              : "Not Defined"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                        <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] sm:text-xs font-medium text-gray-500">Disability Status</p>
                          <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">
                            {profileData.disability_status !== null && profileData.disability_status !== undefined 
                              ? (profileData.disability_status ? "Yes" : "No") 
                              : "Not Defined"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {profileData.score_notes && (
                    <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
                      <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-1">Score Notes</p>
                      <div className="p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                        <p className="text-[10px] sm:text-xs text-gray-700">{profileData.score_notes}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
                    <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-1">Additional Notes</p>
                    {isEditMode ? (
                      <textarea
                        value={editFormData.additional_notes || ""}
                        onChange={(e) => handleEditInputChange('additional_notes', e.target.value)}
                        className="w-full mt-0.5 px-2 py-1 text-[10px] sm:text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        rows="3"
                        placeholder="Additional notes"
                      />
                    ) : (
                      <div className="p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                        <p className="text-[10px] sm:text-xs text-gray-700">{profileData.additional_notes || "Not Defined"}</p>
                      </div>
                    )}
                  </div>

                  {profileData.references && profileData.references.length > 0 ? (
                    <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
                      <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-1">References</p>
                      <div className="space-y-1">
                        {profileData.references.map((ref, index) => (
                          <div key={index} className="p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                            <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">{ref.name}</p>
                            <p className="text-[10px] sm:text-xs text-gray-600 truncate">{ref.position} - {ref.contact}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
                      <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-1">References</p>
                      <span className="text-[10px] sm:text-xs text-gray-500 italic">Not Defined</span>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}

          {/* Modern No Profile Data Message - Show when user doesn't have profile */}
          {!hasProfile && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
              <User className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-gray-300 mb-2 sm:mb-3" />
              <p className="text-xs sm:text-sm text-gray-500 font-medium">No profile data available</p>
              <Link
                to="/candidate/profile-setup"
                className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 text-xs sm:text-sm font-medium mt-3"
              >
                <User className="h-3 w-3" />
                Complete Profile Setup
              </Link>
            </div>
          )}
        </div>
      </div>
    </CandidateLayout>
  );
};

export default CandidateMyProfile;

