import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, UserCheck, AlertCircle, Loader2, Search, CheckCircle, X, MapPin, Briefcase, DollarSign, Award, Calendar, Star, FileText } from "lucide-react";
import { toast } from 'react-toastify';
import RecruiterLayout from "../../Components/RecruiterLayout";


const RecruiterDashboard = () => {
  const [activeTab, setActiveTab] = useState("shortlisted");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 25,
    total: 0,
    last_page: 1
  });
  
  // Search state (for api/candidates/search)
  const [searchParams, setSearchParams] = useState({
    job_role: '',
    preferred_locations: '', // comma separated
    skills: '', // comma separated
    years_experience_min: '',
    years_experience_max: '',
    salary_min: '',
    salary_max: '',
    visa_status: '',
    candidate_score_min: ''
  });
  const [isSearching, setIsSearching] = useState(false);
  
  // Profile modal state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileCandidate, setProfileCandidate] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  
  // Select candidate state
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectFormData, setSelectFormData] = useState({
    job_title: '',
    job_description: '',
    offered_salary_min: '',
    offered_salary_max: '',
    location: '',
    notes: '',
    selection_status: 'shortlisted',
    is_priority: false
  });
  const [isSelecting, setIsSelecting] = useState(false);


  const normalizeText = (value) => value?.toString().trim().replace(/\s+/g, ' ') || '';
  const titleCase = (value) => normalizeText(value).toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

  // Visa status options
  const visaStatuses = [
    { value: '', label: 'All Visa Statuses' },
    { value: 'us_citizen', label: 'US Citizen' },
    { value: 'permanent_resident', label: 'Permanent Resident' },
    { value: 'h1b', label: 'H1B' },
    { value: 'opt_cpt', label: 'OPT/CPT' },
    { value: 'other', label: 'Other' }
  ];

  // Search candidates using the new search API
  const searchCandidates = async (filters) => {
    try {
      setIsSearching(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Build search parameters
      const params = new URLSearchParams({
        page: '1', // static as requested
        per_page: '25' // static as requested
      });

      // Add search filters if they have values
      const f = filters || searchParams;
      const jobRole = titleCase(f.job_role);
      if (jobRole) params.append('job_role', jobRole);
      if (f.preferred_locations) {
        const locationsArray = f.preferred_locations
          .split(',')
          .map(loc => loc.trim())
          .filter(Boolean);
        locationsArray.forEach(loc => params.append('preferred_locations[]', loc));
      }
      if (f.skills) {
        const skillsArray = f.skills
          .split(',')
          .map(skill => skill.trim())
          .filter(Boolean);
        skillsArray.forEach(skill => params.append('skills[]', skill));
      }
      if (f.years_experience_min) params.append('years_experience_min', normalizeText(f.years_experience_min));
      if (f.years_experience_max) params.append('years_experience_max', normalizeText(f.years_experience_max));
      if (f.salary_min) params.append('salary_min', normalizeText(f.salary_min));
      if (f.salary_max) params.append('salary_max', normalizeText(f.salary_max));
      if (f.visa_status) params.append('visa_status', normalizeText(f.visa_status));
      if (f.candidate_score_min) params.append('candidate_score_min', normalizeText(f.candidate_score_min));

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/candidates/search?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Parse response JSON first
      let data;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Invalid response from server. Please try again.');
      }

      if (!response.ok) {
        // Handle Laravel validation errors (422)
        if (response.status === 422 && data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(', ');
          throw new Error(errorMessages || data.message || 'Validation error');
        }
        
        // Handle other error responses
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      console.log('Search API Response:', data); // Debug log
      
      // Handle the API response structure: { candidates: { data: [...], ... }, filters_applied: {...} }
      if (data.candidates) {
        setCandidates(data.candidates.data || []);
        setPagination({
          current_page: data.candidates.current_page || 1,
          per_page: data.candidates.per_page || 25,
          total: data.candidates.total || 0,
          last_page: data.candidates.last_page || 1,
          from: data.candidates.from,
          to: data.candidates.to
        });
      } else {
        throw new Error(data.message || 'Failed to search candidates');
      }
    } catch (error) {
      console.error('Error searching candidates:', error);
      setError(error.message);
      toast.error(error.message || 'Failed to search candidates. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Initial/refresh fetch now uses search endpoint as well
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      await searchCandidates({});
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const handleSearch = () => {
    const current = { ...searchParams };
    searchCandidates(current);
  };

  const handleClearSearch = () => {
    const cleared = {
      job_role: '',
      preferred_locations: '',
      skills: '',
      years_experience_min: '',
      years_experience_max: '',
      salary_min: '',
      salary_max: '',
      visa_status: '',
      candidate_score_min: ''
    };
    setSearchParams(cleared);
    searchCandidates(cleared);
  };

  const handleSearchParamChange = (key, value) => {
    setSearchParams(prev => ({ ...prev, [key]: value }));
  };

  // Select candidate API function
  const selectCandidate = async () => {
    try {
      setIsSelecting(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Parse salary values, ensuring they're valid numbers
      const salaryMin = selectFormData.offered_salary_min ? parseInt(selectFormData.offered_salary_min, 10) : null;
      const salaryMax = selectFormData.offered_salary_max ? parseInt(selectFormData.offered_salary_max, 10) : null;

      // Validate required fields
      if (!selectFormData.job_title?.trim() || 
          !selectFormData.job_description?.trim() || 
          salaryMin === null || 
          salaryMax === null || 
          isNaN(salaryMin) || 
          isNaN(salaryMax) ||
          !selectFormData.location?.trim()) {
        throw new Error('Please fill all required fields with valid values');
      }

      // Validate salary range
      if (salaryMin > salaryMax) {
        throw new Error('Minimum salary cannot be greater than maximum salary');
      }

      // Build payload matching Postman format exactly
      const payload = {
        candidate_code: selectedCandidate?.candidate_profile?.candidate_code || selectedCandidate?.candidate_code || `CAND${selectedCandidate?.id}`,
        selection_status: selectFormData.selection_status || 'shortlisted',
        notes: selectFormData.notes || '',
        job_title: selectFormData.job_title.trim(),
        job_description: selectFormData.job_description.trim(),
        offered_salary_min: salaryMin,
        offered_salary_max: salaryMax,
        location: selectFormData.location.trim(),
        is_priority: Boolean(selectFormData.is_priority)
      };


      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/candidates/select`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Log the full error response for debugging
        console.error('API Error Response:', data);
        
        // Handle Laravel validation errors (422)
        if (response.status === 422 && data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(', ');
          throw new Error(errorMessages || data.message || 'Validation error');
        }
        
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      // Handle successful response (API returns message and selection object)
      if (data.selection || data.message) {
        toast.success(data.message || 'Candidate selected successfully!');
        setShowSelectModal(false);
        setSelectedCandidate(null);
        setSelectFormData({
          job_title: '',
          job_description: '',
          offered_salary_min: '',
          offered_salary_max: '',
          location: '',
          notes: '',
          selection_status: 'shortlisted',
          is_priority: false
        });
        // Refresh candidates list
        fetchCandidates();
      } else {
        throw new Error(data.message || 'Failed to select candidate');
      }
    } catch (error) {
      console.error('Error selecting candidate:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSelecting(false);
    }
  };

  // Fetch full candidate details for profile modal
  const fetchCandidateDetails = async (code) => {
    try {
      setProfileLoading(true);
      setProfileError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/candidates/${code}`, {
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
      
      if (data && data.candidate) {
        setProfileCandidate(data.candidate);
      } else if (data && data.success && data.data) {
        setProfileCandidate(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch candidate details');
      }
    } catch (error) {
      console.error('Error fetching candidate details:', error);
      setProfileError(error.message);
      toast.error(error.message || 'Failed to load candidate profile');
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle view profile click
  const handleViewProfile = (candidate) => {
    const code = candidate.candidate_profile?.candidate_code || candidate.candidate_code || `CAND${candidate.id}`;
    setProfileCandidate(null);
    setProfileError(null);
    setShowProfileModal(true);
    fetchCandidateDetails(code);
  };

  // Handle select candidate click (from profile modal)
  const handleSelectCandidate = (candidate) => {
    // Use profileCandidate if available, otherwise use the passed candidate
    const candidateToUse = candidate || profileCandidate;
    if (!candidateToUse) return;
    
    // Handle both data structures (nested candidate_profile or flat)
    const profile = candidateToUse.candidate_profile || candidateToUse;
    const code = profile?.candidate_code || candidateToUse.candidate_code || `CAND${candidateToUse.id}`;
    
    setSelectedCandidate(candidateToUse);
    setSelectFormData(prev => ({
      ...prev,
      job_title: (profile?.desired_job_roles?.[0]) || (candidateToUse.desired_job_roles?.[0]) || '',
      location: `${profile?.city || candidateToUse.city || ''}, ${profile?.state || candidateToUse.state || ''}`
        .replace(', ,', '')
        .replace(/^,\s*/, '')
        .replace(/,\s*$/, ''),
      offered_salary_min: profile?.desired_annual_package || candidateToUse.desired_annual_package || '',
      offered_salary_max: profile?.desired_annual_package || candidateToUse.desired_annual_package || '',
      selection_status: 'shortlisted'
    }));
    setShowSelectModal(true);
    setShowProfileModal(false); // Close profile modal when opening select modal
  };

  // Fetch candidates on component mount
  useEffect(() => {
    fetchCandidates();
  }, []);

  const getStatusClasses = (status) =>
    status === "interview-scheduled"
      ? "bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
      : "bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs";

  // Format candidate data for display (supports both old and new shapes)
  const formatCandidateData = (candidate) => {
    const profile = candidate.candidate_profile;
    const code = profile?.candidate_code || candidate.candidate_code || `CAND${candidate.id}`;
    const desiredRoles = profile?.desired_job_roles || candidate.desired_job_roles || [];
    const skills = profile?.skills || candidate.skills || [];
    const yearsExp = profile?.total_years_experience ?? candidate.total_years_experience ?? 0;
    const city = profile?.city || candidate.city || 'N/A';
    const state = profile?.state || candidate.state || 'N/A';
    const salaryRaw = profile?.desired_annual_package ?? candidate.desired_annual_package;
    const visa = (profile?.visa_status || candidate.visa_status || '')
      ?.toString()
      .replace('_', ' ');
    return {
      id: candidate.id,
      code,
      name: profile?.full_name || candidate.name || code,
      role: desiredRoles?.[0] || "Software Engineer",
      score: profile?.candidate_score ?? candidate.candidate_score ?? 0,
      shortlistedDate: new Date(candidate.created_at).toLocaleDateString(),
      status: "pending",
      experience: `${yearsExp} years`,
      location: `${city}, ${state}`,
      skills,
      salary: salaryRaw ? `$${parseInt(salaryRaw).toLocaleString()}` : "Not specified",
      visaStatus: visa || "Not specified",
      interviewStatus: "pre-interviewed",
      email: candidate.email,
      phone: profile?.contact_phone || candidate.mobile_number
    };
  };

  return (
    <RecruiterLayout>
      <div className="w-full max-w-none">
        <div className="mx-auto">
          {/* Welcome Section */}
          <div className="mb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Welcome back!</h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 hidden sm:block">Manage your candidate selections and track your hiring progress</p>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" />
                <span className="text-xs sm:text-sm text-gray-600">{pagination.total} Total Candidates</span>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="mb-3 sm:mb-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
              <div className="mb-2 sm:mb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 flex-shrink-0" />
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Find Candidates</h3>
                      <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">Use filters to narrow down results. Leave blank to view all.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={handleClearSearch}
                      className="px-2 py-1.5 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex-shrink-0"
                      aria-label="Clear filters"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="px-2 py-1.5 sm:px-3 sm:py-1.5 bg-blue-600 text-white text-[10px] sm:text-xs font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-1"
                      aria-label="Search candidates"
                    >
                      {isSearching ? (
                        <>
                          <Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin" />
                          <span className="hidden sm:inline">Searching...</span>
                        </>
                      ) : (
                        <>
                          <Search className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          <span className="hidden sm:inline">Search</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-2 sm:pt-3">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                  <div>
                    <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Job Role</label>
                    <input
                      type="text"
                      placeholder="e.g., Data Scientist"
                      value={searchParams.job_role}
                      onChange={(e) => handleSearchParamChange('job_role', e.target.value)}
                      className="w-full px-1.5 py-1 sm:px-2 sm:py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Preferred Locations</label>
                    <input
                      type="text"
                      placeholder="e.g., New York, Austin"
                      value={searchParams.preferred_locations}
                      onChange={(e) => handleSearchParamChange('preferred_locations', e.target.value)}
                      className="w-full px-1.5 py-1 sm:px-2 sm:py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Skills</label>
                    <input
                      type="text"
                      placeholder="e.g., Python, ML"
                      value={searchParams.skills}
                      onChange={(e) => handleSearchParamChange('skills', e.target.value)}
                      className="w-full px-1.5 py-1 sm:px-2 sm:py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Min Exp</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={searchParams.years_experience_min}
                      onChange={(e) => handleSearchParamChange('years_experience_min', e.target.value)}
                      className="w-full px-1.5 py-1 sm:px-2 sm:py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Max Exp</label>
                    <input
                      type="number"
                      placeholder="10"
                      value={searchParams.years_experience_max}
                      onChange={(e) => handleSearchParamChange('years_experience_max', e.target.value)}
                      className="w-full px-1.5 py-1 sm:px-2 sm:py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Salary Range</label>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        placeholder="Min"
                        value={searchParams.salary_min}
                        onChange={(e) => handleSearchParamChange('salary_min', e.target.value)}
                        className="w-full px-1.5 py-1 sm:px-2 sm:py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500"
                      />
                      <span className="text-[10px] sm:text-xs text-gray-400 self-center px-0.5 sm:px-1">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={searchParams.salary_max}
                        onChange={(e) => handleSearchParamChange('salary_max', e.target.value)}
                        className="w-full px-1.5 py-1 sm:px-2 sm:py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Visa Status</label>
                    <select
                      value={searchParams.visa_status}
                      onChange={(e) => handleSearchParamChange('visa_status', e.target.value)}
                      className="w-full px-1.5 py-1 sm:px-2 sm:py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 bg-white"
                    >
                      {visaStatuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Min Score</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={searchParams.candidate_score_min}
                      onChange={(e) => handleSearchParamChange('candidate_score_min', e.target.value)}
                      className="w-full px-1.5 py-1 sm:px-2 sm:py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Approved Candidates Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Approved Candidates</h2>
                    <p className="text-xs text-gray-600 hidden sm:block">Candidates available for selection</p>
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  {loading ? (
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                      <span className="hidden sm:inline">Loading...</span>
                    </div>
                  ) : (
                    `${candidates.length} candidates`
                  )}
                </div>
              </div>
            </div>
            
            {error && (
              <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-red-50 border-b border-red-200">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-xs sm:text-sm font-medium">Error: {error}</span>
                </div>
              </div>
            )}
            
            {loading ? (
              <div className="p-8 sm:p-12 text-center">
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin mx-auto text-gray-400 mb-2 sm:mb-3" />
                <p className="text-xs sm:text-sm text-gray-500 font-medium">Loading candidates...</p>
              </div>
            ) : candidates.length === 0 ? (
              <div className="p-8 sm:p-12 text-center">
                <Users className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-gray-300 mb-2 sm:mb-3" />
                <p className="text-xs sm:text-sm text-gray-500 font-medium">No candidates found</p>
              </div>
            ) : (
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {candidates.map((candidate) => {
                    const formattedCandidate = formatCandidateData(candidate);
                    return (
                      <div
                        key={candidate.id}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
                      >
                        {/* Card Header */}
                        <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="text-xs sm:text-sm font-bold text-indigo-600 truncate">
                                {formattedCandidate.code}
                              </div>
                              <div className="flex items-center gap-1 mt-0.5">
                                <Calendar className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                <span className="text-[10px] sm:text-xs text-gray-500">
                                  {formattedCandidate.shortlistedDate}
                                </span>
                              </div>
                            </div>
                            {formattedCandidate.score > 0 && (
                              <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded-md border border-gray-200 flex-shrink-0">
                                <Award className="h-3 w-3 text-yellow-500" />
                                <span className="text-[10px] sm:text-xs font-semibold text-gray-700">
                                  {formattedCandidate.score}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="px-3 sm:px-4 py-3 sm:py-4 flex-1 flex flex-col gap-2 sm:gap-3">
                          {/* Role & Experience */}
                          <div>
                            <div className="flex items-start gap-2">
                              <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                                  {formattedCandidate.role}
                                </div>
                                <div className="text-[10px] sm:text-xs text-gray-600 mt-0.5">
                                  {formattedCandidate.experience}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Skills */}
                          {formattedCandidate.skills && formattedCandidate.skills.length > 0 && (
                            <div>
                              <div className="text-[10px] sm:text-xs text-gray-500 mb-1">Skills</div>
                              <div className="flex flex-wrap gap-1">
                                {formattedCandidate.skills.slice(0, 4).map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] sm:text-xs bg-blue-50 text-blue-700 border border-blue-100"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {formattedCandidate.skills.length > 4 && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] sm:text-xs bg-gray-50 text-gray-600 border border-gray-200">
                                    +{formattedCandidate.skills.length - 4}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Location */}
                          <div>
                            <div className="flex items-start gap-2">
                              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-[10px] sm:text-xs font-medium text-gray-900 truncate">
                                  {formattedCandidate.location}
                                </div>
                                <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                                  {formattedCandidate.visaStatus}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Salary */}
                          <div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                              <div className="text-xs sm:text-sm font-semibold text-gray-900">
                                {formattedCandidate.salary}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer - Actions */}
                        <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-200 bg-gray-50">
                          <button
                            onClick={() => handleViewProfile(candidate)}
                            className="w-full text-center px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs font-medium text-indigo-600 bg-white border border-indigo-200 rounded-md hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Pagination */}
            {!loading && candidates.length > 0 && pagination.last_page > 1 && (
              <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
                  <div className="text-xs sm:text-sm text-gray-700">
                    <span className="font-medium">
                      Showing {pagination.from} to {pagination.to} of {pagination.total} results
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page - 1 }))}
                      disabled={pagination.current_page === 1}
                      className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-1"
                    >
                      <span className="hidden sm:inline">Previous</span>
                    </button>
                    <span className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-700">
                      Page {pagination.current_page} of {pagination.last_page}
                    </span>
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page + 1 }))}
                      disabled={pagination.current_page === pagination.last_page}
                      className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-1"
                    >
                      <span className="hidden sm:inline">Next</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10 rounded-t-xl">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Candidate Profile</h3>
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  setProfileCandidate(null);
                  setProfileError(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="px-4 sm:px-6 py-4 sm:py-6">
              {profileLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  <span className="ml-3 text-sm text-gray-600">Loading profile...</span>
                </div>
              ) : profileError ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-8 w-8 text-red-400 mb-2" />
                  <p className="text-sm text-red-600 font-medium">{profileError}</p>
                </div>
              ) : profileCandidate ? (
                <div className="space-y-4 sm:space-y-6">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 sm:p-6 border border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="text-lg sm:text-xl font-bold text-indigo-600 mb-1">
                          {profileCandidate.candidate_code || profileCandidate.candidate_profile?.candidate_code || 'N/A'}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                          {profileCandidate.candidate_score !== null && profileCandidate.candidate_score !== undefined && (
                            <div className="flex items-center gap-1">
                              <Award className="h-4 w-4 text-yellow-500" />
                              <span className="font-medium">Score: {profileCandidate.candidate_score}</span>
                            </div>
                          )}
                          {profileCandidate.created_at && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>Added: {new Date(profileCandidate.created_at).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {profileCandidate.visa_status && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                          {profileCandidate.visa_status.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Basic Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {profileCandidate.city && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
                          <p className="text-xs sm:text-sm text-gray-900">{profileCandidate.city}</p>
                        </div>
                      )}
                      {profileCandidate.state && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">State</label>
                          <p className="text-xs sm:text-sm text-gray-900">{profileCandidate.state}</p>
                        </div>
                      )}
                      {profileCandidate.total_years_experience !== undefined && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Experience</label>
                          <p className="text-xs sm:text-sm text-gray-900">{profileCandidate.total_years_experience} years</p>
                        </div>
                      )}
                      {profileCandidate.desired_annual_package && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Desired Salary</label>
                          <p className="text-xs sm:text-sm text-gray-900">${parseInt(profileCandidate.desired_annual_package).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                      Professional Information
                    </h4>
                    <div className="space-y-3 sm:space-y-4">
                      {profileCandidate.desired_job_roles && profileCandidate.desired_job_roles.length > 0 && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Desired Job Roles</label>
                          <div className="flex flex-wrap gap-1.5">
                            {profileCandidate.desired_job_roles.map((role, idx) => (
                              <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {profileCandidate.preferred_locations && profileCandidate.preferred_locations.length > 0 && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Preferred Locations</label>
                          <div className="flex flex-wrap gap-1.5">
                            {profileCandidate.preferred_locations.map((loc, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                                {loc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Skills */}
                  {profileCandidate.skills && profileCandidate.skills.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
                      <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                        <Star className="h-4 w-4 text-blue-600" />
                        Skills
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {profileCandidate.skills.map((skill, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Job History */}
                  {profileCandidate.job_history && profileCandidate.job_history.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
                      <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Job History</h4>
                      <div className="space-y-2">
                        {profileCandidate.job_history.map((job, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-lg p-3 bg-white">
                            <div className="font-medium text-xs sm:text-sm text-gray-900">{job.position} @ {job.company}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {job.start_date ? new Date(job.start_date).toLocaleDateString() : '—'} - {job.end_date ? new Date(job.end_date).toLocaleDateString() : 'Present'}
                            </div>
                            {job.description && (
                              <p className="text-xs text-gray-700 mt-1">{job.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {profileCandidate.education && profileCandidate.education.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
                      <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Education</h4>
                      <div className="space-y-2">
                        {profileCandidate.education.map((edu, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-lg p-3 bg-white">
                            <div className="font-medium text-xs sm:text-sm text-gray-900">{edu.degree} - {edu.major}</div>
                            <div className="text-xs text-gray-500 mt-1">{edu.institution}{edu.graduation_year ? `, ${edu.graduation_year}` : ''}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resume */}
                  {profileCandidate.resume_file_path && (
                    <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
                      <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        Resume
                      </h4>
                      <a
                        href={profileCandidate.resume_file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium"
                      >
                        Download {profileCandidate.resume_file_name || 'Resume'}
                      </a>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Footer with Select Button */}
            {profileCandidate && !profileLoading && !profileError && (
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 rounded-b-xl">
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    setProfileCandidate(null);
                    setProfileError(null);
                  }}
                  className="px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors order-2 sm:order-1"
                >
                  Close
                </button>
                <button
                  onClick={() => handleSelectCandidate(null)}
                  className="px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center justify-center gap-2 order-1 sm:order-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Select Candidate
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Select Candidate Modal */}
    {showSelectModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10 rounded-t-xl">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Select Candidate</h3>
            <button
              onClick={() => setShowSelectModal(false)}
              disabled={isSelecting}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="px-4 sm:px-6 py-4 sm:py-6">
            {/* Form */}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  value={selectFormData.job_title}
                  onChange={(e) => setSelectFormData(prev => ({ ...prev, job_title: e.target.value }))}
                  className="w-full px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Job Description *</label>
                <textarea
                  value={selectFormData.job_description}
                  onChange={(e) => setSelectFormData(prev => ({ ...prev, job_description: e.target.value }))}
                  rows={3}
                  className="w-full px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Min Salary Per Annum ($) </label>
                  <input
                    type="number"
                    value={selectFormData.offered_salary_min}
                    onChange={(e) => setSelectFormData(prev => ({ ...prev, offered_salary_min: e.target.value }))}
                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Max Salary Per Annum ($) *</label>
                  <input
                    type="number"
                    value={selectFormData.offered_salary_max}
                    onChange={(e) => setSelectFormData(prev => ({ ...prev, offered_salary_max: e.target.value }))}
                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input
                  type="text"
                  value={selectFormData.location}
                  onChange={(e) => setSelectFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_priority"
                  checked={selectFormData.is_priority}
                  onChange={(e) => setSelectFormData(prev => ({ ...prev, is_priority: e.target.checked }))}
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_priority" className="ml-2 text-xs sm:text-sm font-medium text-gray-700">
                  Priority Selection
                </label>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={selectFormData.notes}
                  onChange={(e) => setSelectFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  placeholder="Additional notes about this selection..."
                  className="w-full px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 rounded-b-xl">
            <button
              onClick={() => setShowSelectModal(false)}
              disabled={isSelecting}
              className="px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={selectCandidate}
              disabled={isSelecting || !selectFormData.job_title || !selectFormData.job_description || !selectFormData.offered_salary_min || !selectFormData.offered_salary_max || !selectFormData.location}
              className="px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-1 sm:order-2"
            >
              {isSelecting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                  <span>Selecting...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>Select Candidate</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )}
    </RecruiterLayout>
  );
};

export default RecruiterDashboard;
