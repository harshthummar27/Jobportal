import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Star, UserCheck, AlertCircle, Loader2, Search, Filter, MapPin, Briefcase, DollarSign, CheckCircle, X } from "lucide-react";
import RecruiterDashboardHeader from "../../Components/RecruiterDashboardHeader";


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
  
  // Search state
  const [searchParams, setSearchParams] = useState({
    job_role: '',
    location: '',
    skills: '',
    years_experience_min: '',
    years_experience_max: '',
    salary_min: '',
    salary_max: '',
    sort_by: 'candidate_score',
    sort_direction: 'desc'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [mainSearchTerm, setMainSearchTerm] = useState('');
  
  // Select candidate state
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectFormData, setSelectFormData] = useState({
    job_title: '',
    job_description: '',
    salary_offered: '',
    location: '',
    employment_type: 'full-time',
    start_date: '',
    notes: ''
  });
  const [isSelecting, setIsSelecting] = useState(false);


  // Search candidates using the search API
  const searchCandidates = async () => {
    try {
      setIsSearching(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Build search parameters
      const params = new URLSearchParams({
        page: pagination.current_page.toString(),
        per_page: pagination.per_page.toString(),
        sort_by: searchParams.sort_by,
        sort_direction: searchParams.sort_direction
      });

      // Add search filters if they have values
      if (searchParams.job_role) params.append('job_role', searchParams.job_role);
      if (searchParams.location) params.append('location', searchParams.location);
      if (searchParams.skills) params.append('skills', searchParams.skills);
      if (searchParams.years_experience_min) params.append('years_experience_min', searchParams.years_experience_min);
      if (searchParams.years_experience_max) params.append('years_experience_max', searchParams.years_experience_max);
      if (searchParams.salary_min) params.append('salary_min', searchParams.salary_min);
      if (searchParams.salary_max) params.append('salary_max', searchParams.salary_max);

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
      
      if (data.success) {
        setCandidates(data.data);
        setPagination(data.meta);
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

  // Fetch candidates from API (original approved candidates)
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const params = new URLSearchParams({
        page: pagination.current_page.toString(),
        per_page: pagination.per_page.toString()
      });

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recruiter/candidates?${params}`, {
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
      
      if (data.success) {
        setCandidates(data.data);
        setPagination(data.meta);
      } else {
        throw new Error(data.message || 'Failed to fetch candidates');
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const handleSearch = () => {
    // If main search term is provided, use it for job_role search
    if (mainSearchTerm.trim()) {
      setSearchParams(prev => ({ ...prev, job_role: mainSearchTerm.trim() }));
    }
    setPagination(prev => ({ ...prev, current_page: 1 }));
    searchCandidates();
  };

  const handleClearSearch = () => {
    setSearchParams({
      job_role: '',
      location: '',
      skills: '',
      years_experience_min: '',
      years_experience_max: '',
      salary_min: '',
      salary_max: '',
      sort_by: 'candidate_score',
      sort_direction: 'desc'
    });
    setMainSearchTerm('');
    setPagination(prev => ({ ...prev, current_page: 1 }));
    fetchCandidates();
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

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/candidates/select`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidate_code: selectedCandidate?.candidate_profile?.candidate_code || `CAND${selectedCandidate?.id}`,
          job_title: selectFormData.job_title,
          job_description: selectFormData.job_description,
          salary_offered: parseInt(selectFormData.salary_offered),
          location: selectFormData.location,
          employment_type: selectFormData.employment_type,
          start_date: selectFormData.start_date,
          notes: selectFormData.notes
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        alert('Candidate selected successfully!');
        setShowSelectModal(false);
        setSelectedCandidate(null);
        setSelectFormData({
          job_title: '',
          job_description: '',
          salary_offered: '',
          location: '',
          employment_type: 'full-time',
          start_date: '',
          notes: ''
        });
      } else {
        throw new Error(data.message || 'Failed to select candidate');
      }
    } catch (error) {
      console.error('Error selecting candidate:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSelecting(false);
    }
  };

  // Handle select candidate click
  const handleSelectCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setSelectFormData(prev => ({
      ...prev,
      job_title: candidate.candidate_profile?.desired_job_roles?.[0] || '',
      location: `${candidate.candidate_profile?.city || ''}, ${candidate.candidate_profile?.state || ''}`.replace(', ,', '').replace(/^,\s*/, '').replace(/,\s*$/, ''),
      salary_offered: candidate.candidate_profile?.desired_annual_package || ''
    }));
    setShowSelectModal(true);
  };

  // Fetch candidates on component mount and when dependencies change
  useEffect(() => {
    fetchCandidates();
  }, [pagination.current_page]);

  const getStatusClasses = (status) =>
    status === "interview-scheduled"
      ? "bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
      : "bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs";

  // Format candidate data for display
  const formatCandidateData = (candidate) => {
    const profile = candidate.candidate_profile;
    return {
      id: candidate.id,
      code: profile?.candidate_code || `CAND${candidate.id}`,
      name: profile?.full_name || candidate.name,
      role: profile?.desired_job_roles?.[0] || "Software Engineer",
      score: profile?.candidate_score || 85,
      shortlistedDate: new Date(candidate.created_at).toLocaleDateString(),
      status: "pending",
      experience: `${profile?.total_years_experience || 0} years`,
      location: `${profile?.city || 'N/A'}, ${profile?.state || 'N/A'}`,
      skills: profile?.skills || [],
      salary: profile?.desired_annual_package ? `$${parseInt(profile.desired_annual_package).toLocaleString()}` : "Not specified",
      visaStatus: profile?.visa_status?.replace('_', ' ') || "Not specified",
      interviewStatus: "pre-interviewed",
      email: candidate.email,
      phone: profile?.contact_phone || candidate.mobile_number
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <RecruiterDashboardHeader />
      
      <div className="pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back!</h1>
                <p className="text-gray-600 mt-1">Manage your candidate selections and track your hiring progress</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/recruiter/shortlisted"
                  className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-200 shadow-lg"
                >
                  <Users className="h-5 w-5" />
                  Shortlisted
                </Link>
              </div>
            </div>
           {/* Compact Search Section */}
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              {/* Search Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-600" />
                  <h3 className="text-sm font-medium text-gray-900">Search Candidates</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    <Filter className="h-3 w-3 inline mr-1" />
                    {showFilters ? 'Hide' : 'Filters'}
                  </button>
                  <button
                    onClick={handleClearSearch}
                    className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Main Search Row */}
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Job role, skills, location..."
                    value={mainSearchTerm}
                    onChange={(e) => setMainSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
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

              {/* Compact Advanced Filters */}
              {showFilters && (
                <div className="border-t border-gray-100 pt-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Job Role</label>
                      <input
                        type="text"
                        placeholder="Developer"
                        value={searchParams.job_role}
                        onChange={(e) => handleSearchParamChange('job_role', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                      <input
                        type="text"
                        placeholder="New York"
                        value={searchParams.location}
                        onChange={(e) => handleSearchParamChange('location', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Skills</label>
                      <input
                        type="text"
                        placeholder="PHP, Laravel"
                        value={searchParams.skills}
                        onChange={(e) => handleSearchParamChange('skills', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Min Exp</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={searchParams.years_experience_min}
                        onChange={(e) => handleSearchParamChange('years_experience_min', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Max Exp</label>
                      <input
                        type="number"
                        placeholder="10"
                        value={searchParams.years_experience_max}
                        onChange={(e) => handleSearchParamChange('years_experience_max', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Salary Range</label>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          placeholder="60k"
                          value={searchParams.salary_min}
                          onChange={(e) => handleSearchParamChange('salary_min', e.target.value)}
                          className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="text-xs text-gray-400 self-center">-</span>
                        <input
                          type="number"
                          placeholder="120k"
                          value={searchParams.salary_max}
                          onChange={(e) => handleSearchParamChange('salary_max', e.target.value)}
                          className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Sort Options */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Sort By</label>
                      <select
                        value={searchParams.sort_by}
                        onChange={(e) => handleSearchParamChange('sort_by', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="candidate_score">Score</option>
                        <option value="created_at">Date</option>
                        <option value="total_years_experience">Experience</option>
                        <option value="desired_annual_package">Salary</option>
                      </select>
                    </div>
                    <div className="sm:w-24">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Order</label>
                      <select
                        value={searchParams.sort_direction}
                        onChange={(e) => handleSearchParamChange('sort_direction', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="desc">Desc</option>
                        <option value="asc">Asc</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                  <p className="text-3xl font-bold text-indigo-600 mt-1">{pagination.total}</p>
                  <p className="text-xs text-gray-500 mt-1">Approved candidates</p>
                </div>
                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Page</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">{candidates.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Showing now</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">
                    {candidates.length > 0 
                      ? Math.round(candidates.reduce((sum, c) => sum + (c.candidate_profile?.candidate_score || 85), 0) / candidates.length)
                      : 0
                    }
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Current candidates</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-green-600" />
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
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
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm font-semibold text-gray-900">{formattedCandidate.score}</span>
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
                                to={`/recruiter/candidate/${candidate.id}`}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary Offered ($) *</label>
                  <input
                    type="number"
                    value={selectFormData.salary_offered}
                    onChange={(e) => setSelectFormData(prev => ({ ...prev, salary_offered: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type *</label>
                  <select
                    value={selectFormData.employment_type}
                    onChange={(e) => setSelectFormData(prev => ({ ...prev, employment_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={selectFormData.start_date}
                    onChange={(e) => setSelectFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
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
              disabled={isSelecting || !selectFormData.job_title || !selectFormData.job_description || !selectFormData.salary_offered || !selectFormData.location || !selectFormData.start_date}
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
    </div>
  );
};

export default RecruiterDashboard;
