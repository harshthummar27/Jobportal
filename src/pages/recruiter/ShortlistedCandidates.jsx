import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Star, Calendar, MapPin, Briefcase, DollarSign, Eye, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import RecruiterDashboardHeader from "../../Components/RecruiterDashboardHeader";

const ShortlistedCandidates = () => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 25,
    total: 0,
    last_page: 1
  });

  // Fetch selected candidates from API
  const fetchSelectedCandidates = async () => {
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

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/candidates/selections?${params}`, {
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
        setSelectedCandidates(data.data);
        setPagination(data.meta);
      } else {
        throw new Error(data.message || 'Failed to fetch selected candidates');
      }
    } catch (error) {
      console.error('Error fetching selected candidates:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch candidates on component mount and when dependencies change
  useEffect(() => {
    fetchSelectedCandidates();
  }, [pagination.current_page]);

  // Format candidate data for display
  const formatCandidateData = (candidate) => {
    return {
      id: candidate.id,
      candidate_code: candidate.candidate_code,
      candidate_name: candidate.candidate_name || 'N/A',
      job_title: candidate.job_title || 'N/A',
      salary_offered: candidate.salary_offered ? `$${parseInt(candidate.salary_offered).toLocaleString()}` : 'N/A',
      location: candidate.location || 'N/A',
      employment_type: candidate.employment_type || 'N/A',
      start_date: candidate.start_date ? new Date(candidate.start_date).toLocaleDateString() : 'N/A',
      created_at: candidate.created_at ? new Date(candidate.created_at).toLocaleDateString() : 'N/A',
      status: candidate.status || 'selected'
    };
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'selected':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Selected</span>;
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">Pending</span>;
      case 'approved':
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Approved</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">Unknown</span>;
    }
  };

  const getEmploymentTypeBadge = (type) => {
    switch (type) {
      case 'full-time':
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Full-time</span>;
      case 'part-time':
        return <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">Part-time</span>;
      case 'contract':
        return <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">Contract</span>;
      case 'freelance':
        return <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs font-medium">Freelance</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">{type}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <RecruiterDashboardHeader />
      
      <div className="pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shortlisted Candidates</h1>
                <p className="text-gray-600 mt-1">View and manage your selected candidates</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to="/recruiter/dashboard"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg"
                >
                  <Users className="h-4 w-4" />
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Selected</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{pagination.total}</p>
                  <p className="text-xs text-gray-500 mt-1">Candidates</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Page</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">{selectedCandidates.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Showing now</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">
                    {selectedCandidates.filter(c => {
                      const createdDate = new Date(c.created_at);
                      const now = new Date();
                      return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">New selections</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Salary</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-1">
                    {selectedCandidates.length > 0 
                      ? `$${Math.round(selectedCandidates.reduce((sum, c) => sum + (parseInt(c.salary_offered) || 0), 0) / selectedCandidates.length / 1000)}k`
                      : '$0k'
                    }
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Offered</p>
                </div>
                <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Selected Candidates Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Selected Candidates</h2>
                    <p className="text-sm text-gray-600">Candidates you have selected for positions</p>
                </div>
              </div>
                <div className="text-sm text-gray-500">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading...
                    </div>
                  ) : (
                    `${selectedCandidates.length} candidates`
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
                <p className="text-gray-500 mt-2">Loading selected candidates...</p>
              </div>
            ) : selectedCandidates.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-gray-300" />
                <p className="text-gray-500 mt-2">No selected candidates found</p>
                <p className="text-sm text-gray-400 mt-1">Start selecting candidates from the dashboard</p>
            </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary & Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {selectedCandidates.map((candidate) => {
                      const formattedCandidate = formatCandidateData(candidate);
                      return (
                        <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                              <div className="text-sm font-semibold text-green-600">{formattedCandidate.candidate_code}</div>
                              <div className="text-sm text-gray-900">{formattedCandidate.candidate_name}</div>
                              <div className="text-xs text-gray-500">Selected: {formattedCandidate.created_at}</div>
                        </div>
                      </td>
                          <td className="px-6 py-4">
                        <div>
                              <div className="text-sm font-medium text-gray-900">{formattedCandidate.job_title}</div>
                              <div className="text-xs text-gray-500 mt-1">Position</div>
                        </div>
                      </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm text-gray-900">{formattedCandidate.salary_offered}</div>
                              <div className="text-xs text-gray-500">{formattedCandidate.location}</div>
                        </div>
                      </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              {getEmploymentTypeBadge(formattedCandidate.employment_type)}
                              <div className="text-xs text-gray-500">Start: {formattedCandidate.start_date}</div>
                            </div>
                      </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(formattedCandidate.status)}
                      </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button className="text-blue-600 hover:text-blue-900 px-3 py-1 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors">
                                <Eye className="h-4 w-4" />
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
            {!loading && selectedCandidates.length > 0 && pagination.last_page > 1 && (
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
  );
};

export default ShortlistedCandidates;
