import React, { useState, useEffect } from "react";
import { 
  User, Briefcase, CheckCircle, Eye, TrendingUp, Calendar, Bell, MapPin, 
  GraduationCap, Award, Languages, Users, DollarSign, Shield, Phone, Mail, 
  Building, Star, AlertCircle, RefreshCw, Clock, FileText 
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
      
      // Also save to localStorage for offline access
      localStorage.setItem('candidateProfileData', JSON.stringify(profileData));

    } catch (error) {
      console.error("Profile fetch error:", error);
      
      // Handle specific error messages
      if (error.message.includes("token") || error.message.includes("unauthorized")) {
        toast.error("Session expired. Please log in again.");
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
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-2 text-red-600 mb-3">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm font-medium">Error: {error}</span>
              </div>
              <button
                onClick={() => fetchProfileData()}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 text-xs sm:text-sm font-medium"
              >
                <RefreshCw className="h-3 w-3" />
                Try Again
              </button>
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
                <button 
                  onClick={handleRefresh}
                  className="p-1.5 sm:p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex-shrink-0"
                  title="Refresh Profile Data"
                >
                  <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" />
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
                        <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">
                          {profileData.city && profileData.state 
                            ? `${profileData.city}, ${profileData.state}` 
                            : "Not Defined"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                      <Building className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs font-medium text-gray-500">Current Employer</p>
                        <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">{profileData.current_employer || "Not Defined"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                      <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs font-medium text-gray-500">Experience</p>
                        <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">
                          {profileData.total_years_experience 
                            ? `${profileData.total_years_experience} years` 
                            : "Not Defined"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                      <DollarSign className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs font-medium text-gray-500">Desired Package</p>
                        <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">
                          {profileData.desired_annual_package 
                            ? `$${parseFloat(profileData.desired_annual_package).toLocaleString()}` 
                            : "Not Defined"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                      <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs font-medium text-gray-500">Available From</p>
                        <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">
                          {profileData.availability_date 
                            ? new Date(profileData.availability_date).toLocaleDateString() 
                            : "Not Defined"}
                        </p>
                      </div>
                    </div>
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
                      <div className="flex flex-wrap gap-1">
                        {profileData.desired_job_roles && profileData.desired_job_roles.length > 0 ? (
                          profileData.desired_job_roles.map((role, index) => (
                            <span key={index} className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded-md text-[10px] sm:text-xs font-medium">
                              {role}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] sm:text-xs text-gray-500 italic">Not Defined</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-1">Preferred Industries</p>
                      <div className="flex flex-wrap gap-1">
                        {profileData.preferred_industries && profileData.preferred_industries.length > 0 ? (
                          profileData.preferred_industries.map((industry, index) => (
                            <span key={index} className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-md text-[10px] sm:text-xs font-medium">
                              {industry}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] sm:text-xs text-gray-500 italic">Not Defined</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-1">Employment Types</p>
                      <div className="flex flex-wrap gap-1">
                        {profileData.employment_types && profileData.employment_types.length > 0 ? (
                          profileData.employment_types.map((type, index) => (
                            <span key={index} className="px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded-md text-[10px] sm:text-xs font-medium">
                              {type}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] sm:text-xs text-gray-500 italic">Not Defined</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                      <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs font-medium text-gray-500">Relocation</p>
                        <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">{profileData.relocation_willingness || "Not Defined"}</p>
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
                      <div className="flex flex-wrap gap-1">
                        {profileData.skills && profileData.skills.length > 0 ? (
                          profileData.skills.map((skill, index) => (
                            <span key={index} className="px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded-md text-[10px] sm:text-xs font-medium">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] sm:text-xs text-gray-500 italic">Not Defined</span>
                        )}
                      </div>
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
                          profileData.job_history.map((job, index) => (
                            <div key={index} className="p-1.5 sm:p-2 bg-gray-50 rounded-lg border-l-2 border-orange-400">
                              <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">{job.position}</p>
                              <p className="text-[10px] sm:text-xs text-gray-600 truncate">{job.company} - {job.duration}</p>
                            </div>
                          ))
                        ) : (
                          <span className="text-[10px] sm:text-xs text-gray-500 italic">Not Defined</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-1">Languages</p>
                      <div className="flex flex-wrap gap-1">
                        {profileData.languages_spoken && profileData.languages_spoken.length > 0 ? (
                          profileData.languages_spoken.map((language, index) => (
                            <span key={index} className="px-1.5 py-0.5 bg-teal-100 text-teal-800 rounded-md text-[10px] sm:text-xs font-medium">
                              {language}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] sm:text-xs text-gray-500 italic">Not Defined</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-1">Preferred Locations</p>
                      <div className="flex flex-wrap gap-1">
                        {profileData.preferred_locations && profileData.preferred_locations.length > 0 ? (
                          profileData.preferred_locations.map((location, index) => (
                            <span key={index} className="px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded-md text-[10px] sm:text-xs font-medium">
                              {location}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] sm:text-xs text-gray-500 italic">Not Defined</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resume Information */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-600" />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">Resume Information</h3>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                      <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-cyan-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs font-medium text-gray-500">Resume File</p>
                        <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">{profileData.resume_file_name || "Not Defined"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                      <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-cyan-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs font-medium text-gray-500">File Type</p>
                        <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">{profileData.resume_mime_type || "Not Defined"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                      <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-cyan-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs font-medium text-gray-500">File Path</p>
                        <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">{profileData.resume_file_path || "Not Defined"}</p>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                        <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] sm:text-xs font-medium text-gray-500">Profile ID</p>
                          <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">{profileData.id || "Not Defined"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                        <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] sm:text-xs font-medium text-gray-500">User ID</p>
                          <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">{profileData.user_id || "Not Defined"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                        <Shield className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] sm:text-xs font-medium text-gray-500">Visa Status</p>
                          <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">
                            {profileData.visa_status 
                              ? profileData.visa_status.replace('_', ' ').toUpperCase() 
                              : "Not Defined"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                        <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] sm:text-xs font-medium text-gray-500">Job Seeking Status</p>
                          <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">
                            {profileData.job_seeking_status 
                              ? profileData.job_seeking_status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) 
                              : "Not Defined"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                        <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] sm:text-xs font-medium text-gray-500">Ethnicity</p>
                          <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">{profileData.ethnicity || "Not Defined"}</p>
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
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                        <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] sm:text-xs font-medium text-gray-500">Candidate Score</p>
                          <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">{profileData.candidate_score || "Not Defined"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                        <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] sm:text-xs font-medium text-gray-500">Scored By</p>
                          <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">{profileData.scored_by || "Not Defined"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                        <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] sm:text-xs font-medium text-gray-500">Created At</p>
                          <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">
                            {profileData.created_at 
                              ? new Date(profileData.created_at).toLocaleDateString() 
                              : "Not Defined"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                        <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] sm:text-xs font-medium text-gray-500">Updated At</p>
                          <p className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">
                            {profileData.updated_at 
                              ? new Date(profileData.updated_at).toLocaleDateString() 
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
                  
                  {profileData.additional_notes && (
                    <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
                      <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-1">Additional Notes</p>
                      <div className="p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                        <p className="text-[10px] sm:text-xs text-gray-700">{profileData.additional_notes}</p>
                      </div>
                    </div>
                  )}

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

                  {profileData.blocked_companies && profileData.blocked_companies.length > 0 ? (
                    <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
                      <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-1">Blocked Companies</p>
                      <div className="flex flex-wrap gap-1">
                        {profileData.blocked_companies.map((company, index) => (
                          <span key={index} className="px-1.5 py-0.5 bg-red-100 text-red-800 rounded-md text-[10px] sm:text-xs font-medium">
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
                      <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-1">Blocked Companies</p>
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

