import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, UserCheck, AlertCircle, Loader2, Search, CheckCircle, X } from "lucide-react";
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
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

  // Handle select candidate click
  const handleSelectCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setSelectFormData(prev => ({
      ...prev,
      job_title: (candidate.candidate_profile?.desired_job_roles?.[0]) || (candidate.desired_job_roles?.[0]) || '',
      location: `${candidate.candidate_profile?.city || candidate.city || ''}, ${candidate.candidate_profile?.state || candidate.state || ''}`
        .replace(', ,', '')
        .replace(/^,\s*/, '')
        .replace(/,\s*$/, ''),
      offered_salary_min: candidate.candidate_profile?.desired_annual_package || candidate.desired_annual_package || '',
      offered_salary_max: candidate.candidate_profile?.desired_annual_package || candidate.desired_annual_package || ''
    }));
    setShowSelectModal(true);
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
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-4">
          {/* Welcome Section */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back!</h1>
                <p className="text-gray-600 mt-1">Manage your candidate selections and track your hiring progress</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{pagination.total} Total Candidates</span>
                </div>
              </div>
            </div>
          {/* Search & Filters */}
          <div className="mb-5">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-5 mt-[1vh]">
              <div className="mb-3 md:mb-4">
                <div className="flex items-start md:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-600" />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Find Candidates</h3>
                      <p className="hidden md:block text-xs text-gray-500">Use filters to narrow down results. Leave blank to view all.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleClearSearch}
                      className="px-3 py-1.5 text-xs border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      aria-label="Clear filters"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      aria-label="Search candidates"
                    >
                      {isSearching ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="h-3 w-3 inline mr-1" />
                          Search
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Job Role</label>
                    <input
                      type="text"
                      placeholder="e.g., Data Scientist"
                      value={searchParams.job_role}
                      onChange={(e) => handleSearchParamChange('job_role', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Preferred Locations</label>
                    <input
                      type="text"
                      placeholder="e.g., New York, Austin"
                      value={searchParams.preferred_locations}
                      onChange={(e) => handleSearchParamChange('preferred_locations', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Skills</label>
                    <input
                      type="text"
                      placeholder="e.g., Python, ML"
                      value={searchParams.skills}
                      onChange={(e) => handleSearchParamChange('skills', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Min Exp</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={searchParams.years_experience_min}
                      onChange={(e) => handleSearchParamChange('years_experience_min', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Max Exp</label>
                    <input
                      type="number"
                      placeholder="10"
                      value={searchParams.years_experience_max}
                      onChange={(e) => handleSearchParamChange('years_experience_max', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Salary Range</label>
                    <div className="flex gap-1.5">
                      <input
                        type="number"
                        placeholder="Min"
                        value={searchParams.salary_min}
                        onChange={(e) => handleSearchParamChange('salary_min', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                      />
                      <span className="text-xs text-gray-400 self-center px-1">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={searchParams.salary_max}
                        onChange={(e) => handleSearchParamChange('salary_max', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Visa Status</label>
                    <input
                      type="text"
                      placeholder="e.g., opt_cpt, h1b, citizen"
                      value={searchParams.visa_status}
                      onChange={(e) => handleSearchParamChange('visa_status', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Min Score</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={searchParams.candidate_score_min}
                      onChange={(e) => handleSearchParamChange('candidate_score_min', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Approved Candidates Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Approved Candidates</h2>
                    <p className="text-sm text-gray-600">Candidates available for selection</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading...
                    </div>
                  ) : (
                    `${candidates.length} candidates`
                  )}
                </div>
              </div>
            </div>
            
            {error && (
              <div className="px-6 py-4 bg-red-50 border-b border-red-100">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Error: {error}</span>
                </div>
              </div>
            )}
            
            {loading ? (
              <div className="p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                <p className="text-gray-500 mt-2">Loading candidates...</p>
              </div>
            ) : candidates.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto text-gray-300" />
                <p className="text-gray-500 mt-2">No candidates found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role & Experience</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {candidates.map((candidate) => {
                      const formattedCandidate = formatCandidateData(candidate);
                      return (
                        <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-semibold text-indigo-600">{formattedCandidate.code}</div>
                              <div className="text-sm text-gray-900">{formattedCandidate.name}</div>
                              <div className="text-xs text-gray-500">{formattedCandidate.shortlistedDate}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{formattedCandidate.role}</div>
                              <div className="text-xs text-gray-500">{formattedCandidate.experience}</div>
                              <div className="text-xs text-gray-400 mt-1">
                                {formattedCandidate.skills.slice(0, 3).join(', ')}
                                {formattedCandidate.skills.length > 3 && '...'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formattedCandidate.location}</div>
                            <div className="text-xs text-gray-500">{formattedCandidate.visaStatus}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formattedCandidate.salary}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <Link
                                to={`/recruiter/candidate/${formattedCandidate.code}`}
                                className="text-indigo-600 hover:text-indigo-900 px-3 py-1 border border-indigo-200 rounded-md hover:bg-indigo-50 transition-colors"
                              >
                                View
                              </Link>
                              <button 
                                onClick={() => handleSelectCandidate(candidate)}
                                className="text-green-600 hover:text-green-900 px-3 py-1 border border-green-200 rounded-md hover:bg-green-50 transition-colors"
                              >
                                Select
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Pagination */}
            {!loading && candidates.length > 0 && pagination.last_page > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {pagination.from} to {pagination.to} of {pagination.total} results
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page - 1 }))}
                      disabled={pagination.current_page === 1}
                      className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-700">
                      Page {pagination.current_page} of {pagination.last_page}
                    </span>
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page + 1 }))}
                      disabled={pagination.current_page === pagination.last_page}
                      className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          </div>
        </div>
      </div>
      {/* Select Candidate Modal */}
    {showSelectModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Select Candidate</h3>
            <button
              onClick={() => setShowSelectModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-6">
            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  value={selectFormData.job_title}
                  onChange={(e) => setSelectFormData(prev => ({ ...prev, job_title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
                <textarea
                  value={selectFormData.job_description}
                  onChange={(e) => setSelectFormData(prev => ({ ...prev, job_description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary ($) *</label>
                  <input
                    type="number"
                    value={selectFormData.offered_salary_min}
                    onChange={(e) => setSelectFormData(prev => ({ ...prev, offered_salary_min: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary ($) *</label>
                  <input
                    type="number"
                    value={selectFormData.offered_salary_max}
                    onChange={(e) => setSelectFormData(prev => ({ ...prev, offered_salary_max: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    value={selectFormData.location}
                    onChange={(e) => setSelectFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selection Status *</label>
                  <select
                    value={selectFormData.selection_status}
                    onChange={(e) => setSelectFormData(prev => ({ ...prev, selection_status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="shortlisted">Shortlisted</option>
                    <option value="selected">Selected</option>
                    <option value="rejected">Rejected</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_priority"
                    checked={selectFormData.is_priority}
                    onChange={(e) => setSelectFormData(prev => ({ ...prev, is_priority: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_priority" className="ml-2 text-sm font-medium text-gray-700">
                    Priority Selection
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={selectFormData.notes}
                  onChange={(e) => setSelectFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  placeholder="Additional notes about this selection..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              onClick={() => setShowSelectModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={selectCandidate}
              disabled={isSelecting || !selectFormData.job_title || !selectFormData.job_description || !selectFormData.offered_salary_min || !selectFormData.offered_salary_max || !selectFormData.location}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSelecting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                  Selecting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 inline mr-2" />
                  Select Candidate
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
