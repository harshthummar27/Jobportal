import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Eye, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import RecruiterLayout from "../../Components/RecruiterLayout";

const ShortlistedCandidates = () => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 25,
    total: 0,
    last_page: 1,
    from: 0,
    to: 0,
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

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recruiter/selections?${params}`, {
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

      if (!data || !data.selections) {
        throw new Error('Invalid API response');
      }

      const selections = data.selections;
      setSelectedCandidates(Array.isArray(selections.data) ? selections.data : []);
      setPagination({
        current_page: selections.current_page ?? 1,
        per_page: Number(selections.per_page) || pagination.per_page,
        total: selections.total ?? 0,
        last_page: selections.last_page ?? 1,
        from: selections.from ?? 0,
        to: selections.to ?? 0,
      });
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
      job_title: candidate.job_title || 'N/A',
      location: candidate.location || 'N/A',
      selected_at: candidate.selected_at ? new Date(candidate.selected_at).toLocaleDateString() : 'N/A',
      selection_status: candidate.selection_status || 'shortlisted',
    };
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'shortlisted':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Shortlisted</span>;
      case 'approved':
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Approved</span>;
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">Pending</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">{status}</span>;
    }
  };

  return (
    <RecruiterLayout>
      <div className="w-full max-w-none">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-4">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shortlisted Candidates</h1>
                <p className="text-gray-600 mt-1">View and manage your selected candidates</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>{pagination.total} Total Selected</span>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
                              <div className="text-xs text-gray-500">Selected: {formattedCandidate.selected_at}</div>
                        </div>
                      </td>
                          <td className="px-6 py-4">
                        <div>
                              <div className="text-sm font-medium text-gray-900">{formattedCandidate.job_title}</div>
                        </div>
                      </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm text-gray-900">{formattedCandidate.location}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(formattedCandidate.selection_status)}
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
    </RecruiterLayout>
  );
};

export default ShortlistedCandidates;
