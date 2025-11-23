import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, RefreshCw, ChevronLeft, ChevronRight, AlertCircle, Users, ChevronUp, ChevronDown, Eye, X, User, Mail, Phone, Calendar, MapPin, Briefcase, Award, FileText, Globe, Trash2, AlertTriangle } from "lucide-react";
import { toast } from 'react-toastify';

const AllCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [page, setPage] = useState(1);
  const perPage = 25; // fixed per-page as requested
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("");

  const [meta, setMeta] = useState({ current_page: 1, per_page: 25, total: 0, last_page: 1, from: null, to: null });

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('per_page', String(perPage));
      if (search) params.set('search', search);
      if (sortBy) params.set('sort_by', sortBy);
      if (sortDirection) params.set('sort_direction', sortDirection);
      if (statusFilter) params.set('status', statusFilter);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/candidates?${params.toString()}` , {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      setCandidates(Array.isArray(json.data) ? json.data : []);
      if (json.meta) setMeta(json.meta);
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError('Failed to fetch candidates. Please try again.');
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const searchDebounceRef = useRef(null);
  const prevSearchRef = useRef(undefined);
  const isFirstRender = useRef(true);

  useEffect(() => {
    fetchCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy, sortDirection, statusFilter]);

  useEffect(() => {
    // Skip on first render to prevent double loading on mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevSearchRef.current = search;
      return;
    }

    // Skip if search hasn't actually changed
    if (prevSearchRef.current === search) {
      return;
    }
    
    // Update previous search value
    prevSearchRef.current = search;

    // Clear existing timeout
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    // Set debounced timeout
    searchDebounceRef.current = setTimeout(() => {
      setPage(1);
      fetchCandidates();
    }, 400);

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCandidates();
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
    setPage(1);
  };

  // Define necessary/default fields to show in table
  const defaultColumns = ['id', 'name', 'email', 'mobile_number', 'status'];
  
  // Get candidate code from profile for display
  const getCandidateCode = (candidate) => {
    if (candidate?.candidate_profile?.candidate_code) {
      return candidate.candidate_profile.candidate_code;
    }
    return '-';
  };

  const handleViewDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCandidate(null);
    setShowDeleteConfirm(false);
  };

  const handleDeleteClick = () => {
    if (!selectedCandidate || !selectedCandidate.id) {
      toast.error('Invalid candidate selected for deletion.');
      return;
    }
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCandidate || !selectedCandidate.id) {
      toast.error('Invalid candidate selected for deletion.');
      setShowDeleteConfirm(false);
      return;
    }

    try {
      setDeleteLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/candidates/delete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedCandidate.id
        }),
      });

      let data;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        toast.error('Invalid response from server. Please try again.');
        setShowDeleteConfirm(false);
        setDeleteLoading(false);
        return;
      }

      if (!response.ok) {
        // Handle backend error messages
        const errorMessage = data.message || data.error || data.errors?.message || `Failed to delete candidate. Status: ${response.status}`;
        toast.error(errorMessage);
        setShowDeleteConfirm(false);
        setDeleteLoading(false);
        return;
      }

      // Success - show toast and refresh
      toast.success(data.message || 'Candidate deleted successfully!');
      setShowDeleteConfirm(false);
      closeModal();
      fetchCandidates();
    } catch (err) {
      console.error('Error deleting candidate:', err);
      const errorMessage = err.message || 'Failed to delete candidate. Please try again.';
      toast.error(errorMessage);
      setShowDeleteConfirm(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  // Format field name for display
  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Get icon for field
  const getFieldIcon = (fieldName) => {
    const normalized = fieldName.toLowerCase().replace(/_/g, '');
    if (normalized.includes('name') || normalized.includes('id')) return User;
    if (normalized.includes('email')) return Mail;
    if (normalized.includes('phone') || normalized.includes('mobile')) return Phone;
    if (normalized.includes('date') || normalized.includes('created') || normalized.includes('updated')) return Calendar;
    if (normalized.includes('city') || normalized.includes('state') || normalized.includes('location')) return MapPin;
    if (normalized.includes('role') || normalized.includes('job')) return Briefcase;
    if (normalized.includes('experience') || normalized.includes('year')) return Award;
    if (normalized.includes('resume') || normalized.includes('file')) return FileText;
    if (normalized.includes('visa') || normalized.includes('sponsorship')) return Globe;
    return User;
  };

  // Format value for display in modal
  const formatModalValue = (value, fieldName = '') => {
    if (value === null || value === undefined) return 'N/A';
    
    if (typeof value === 'boolean') {
      return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Yes' : 'No'}
        </span>
      );
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) return 'N/A';
      // For arrays like desired_job_roles, show as badges
      if (fieldName.toLowerCase().includes('role') || fieldName.toLowerCase().includes('skill')) {
        return (
          <div className="flex flex-wrap gap-2">
            {value.map((item, idx) => (
              <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                {String(item)}
              </span>
            ))}
          </div>
        );
      }
      return (
        <div className="flex flex-wrap gap-1.5">
          {value.map((item, idx) => (
            <span key={idx} className="text-sm">{String(item)}</span>
          )).reduce((acc, item, idx) => idx === 0 ? [item] : [...acc, <span key={`sep-${idx}`} className="text-gray-400">,</span>, item], [])}
        </div>
      );
    }
    
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      try {
        const date = new Date(value);
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span>{date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
        );
      } catch (e) {
        return value;
      }
    }
    
    if (typeof value === 'object' && value !== null) {
      return (
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }
    
    return <span>{String(value)}</span>;
  };

  const formatValue = (value, col) => {
    if (value === null || value === undefined) return '-';
    
    // Format ISO date strings to readable format
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      try {
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        return value;
      }
    }
    
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return String(value);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      approve: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      decline: { bg: 'bg-red-100', text: 'text-red-800', label: 'Declined' }
    };
    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="w-full max-w-none">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-gray-100 text-gray-700">
            <Users className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">All Candidates</h1>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by mobile number, candidate code, email..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex-shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-sm"
            >
              <option value="">All Status</option>
              <option value="approve">Approved</option>
              <option value="pending">Pending</option>
              <option value="decline">Declined</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors whitespace-nowrap"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              type="button"
              onClick={() => { 
                setSearch(""); 
                setStatusFilter("");
                setPage(1); 
                fetchCandidates(); 
              }}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-1 whitespace-nowrap"
            >
              <RefreshCw className="h-4 w-4" /> Reset
            </button>
          </div>
        </form>
      </div>

      {/* State: Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[...Array(6)].map((_, idx) => (
                    <th key={idx} className="px-4 py-3 text-left">
                      <div 
                        className="h-4 bg-gray-200 rounded w-24"
                        style={{
                          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 1.5s infinite',
                        }}
                      ></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...Array(8)].map((_, rowIdx) => (
                  <tr key={rowIdx}>
                    {[...Array(6)].map((_, colIdx) => (
                      <td key={colIdx} className="px-4 py-3">
                        <div 
                          className={`h-4 rounded ${
                            colIdx === 0 ? 'w-32' : 
                            colIdx === 1 ? 'w-40' : 
                            colIdx === 2 ? 'w-28' : 
                            colIdx === 3 ? 'w-24' : 
                            colIdx === 4 ? 'w-36' : 
                            'w-20'
                          }`}
                          style={{
                            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 1.5s infinite',
                            animationDelay: `${rowIdx * 0.1 + colIdx * 0.05}s`,
                          }}
                        ></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div 
              className="h-4 rounded w-48"
              style={{
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
              }}
            ></div>
            <div className="flex items-center gap-2">
              <div 
                className="h-8 rounded w-20"
                style={{
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                }}
              ></div>
              <div 
                className="h-8 rounded w-20"
                style={{
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  animationDelay: '0.2s',
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && !error && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            {candidates.length === 0 ? (
              <div className="p-6 text-center text-gray-600">No candidates found.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    {defaultColumns.map((col) => (
                      <th
                        key={col}
                        scope="col"
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                        onClick={() => toggleSort(col)}
                      >
                        <div className="flex items-center gap-1">
                          <span>{formatFieldName(col)}</span>
                          {sortBy === col && (
                            sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate Code
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {candidates.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      {defaultColumns.map((col) => {
                        const formattedValue = formatValue(row[col], col);
                        return (
                          <td key={col} className="px-4 py-2 text-sm text-gray-700 max-w-[28rem] break-words">
                            {col === 'status' ? getStatusBadge(row[col]) : formattedValue}
                          </td>
                        );
                      })}
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {getCandidateCode(row)}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <button
                          onClick={() => handleViewDetails(row)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer: meta + pagination */}
          <div className="p-3 border-t border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="text-sm text-gray-600">
              Page {meta.current_page} of {meta.last_page} · Total {meta.total}
              {meta.from != null && meta.to != null && (
                <span> · Showing {meta.from}–{meta.to}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <div className="flex items-center gap-1"><ChevronLeft className="h-4 w-4" /> Prev</div>
              </button>
              <button
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(meta.last_page || p + 1, p + 1))}
                disabled={page >= (meta.last_page || 1)}
              >
                <div className="flex items-center gap-1">Next <ChevronRight className="h-4 w-4" /></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showModal && selectedCandidate && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <User className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold">Candidate Details</h2>
                  <p className="text-xs sm:text-sm text-indigo-100 mt-0.5">
                    {selectedCandidate.name || 'View full information'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Basic Information */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-4 sm:mb-5 pb-3 border-b border-gray-200">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Basic Information</h3>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {Object.keys(selectedCandidate)
                      .filter(key => key !== 'candidate_profile')
                      .map((key) => {
                        const IconComponent = getFieldIcon(key);
                        return (
                          <div key={key} className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="p-1.5 sm:p-2 bg-white rounded-md shadow-sm flex-shrink-0">
                                <IconComponent className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-xs sm:text-sm font-semibold text-gray-600 block mb-1">
                                  {formatFieldName(key)}
                                </span>
                                <div className="text-sm sm:text-base text-gray-900 break-words">
                                  {key === 'status' ? getStatusBadge(selectedCandidate[key]) : formatModalValue(selectedCandidate[key], key)}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Profile Information */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-4 sm:mb-5 pb-3 border-b border-gray-200">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Profile Information</h3>
                  </div>
                  {selectedCandidate.candidate_profile ? (
                    <div className="space-y-3 sm:space-y-4">
                      {Object.keys(selectedCandidate.candidate_profile).map((key) => {
                        const IconComponent = getFieldIcon(key);
                        const value = selectedCandidate.candidate_profile[key];
                        return (
                          <div key={key} className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="p-1.5 sm:p-2 bg-white rounded-md shadow-sm flex-shrink-0">
                                <IconComponent className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-xs sm:text-sm font-semibold text-gray-600 block mb-1">
                                  {formatFieldName(key)}
                                </span>
                                <div className="text-sm sm:text-base text-gray-900 break-words">
                                  {formatModalValue(value, key)}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-6 sm:p-8 border-2 border-dashed border-gray-300 text-center">
                      <Briefcase className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm sm:text-base text-gray-500 font-medium">No profile information available</p>
                      <p className="text-xs sm:text-sm text-gray-400 mt-1">This candidate hasn't completed their profile yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center gap-3">
              <button
                onClick={handleDeleteClick}
                disabled={deleteLoading}
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm sm:text-base flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                Delete
              </button>
              <button
                onClick={closeModal}
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedCandidate && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-2 sm:p-4"
          onClick={handleDeleteCancel}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 sm:px-6 py-4 sm:py-5 flex items-center gap-3 rounded-t-xl">
              <div className="p-2 bg-white/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold">Confirm Deletion</h2>
                <p className="text-xs sm:text-sm text-red-100 mt-0.5">This action cannot be undone</p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6">
              <div className="mb-4">
                <p className="text-sm sm:text-base text-gray-700 mb-2">
                  Are you sure you want to delete the following candidate?
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-red-900 text-sm sm:text-base">
                        {selectedCandidate.name || 'Unknown Candidate'}
                      </p>
                      {selectedCandidate.email && (
                        <p className="text-xs sm:text-sm text-red-700 mt-1">{selectedCandidate.email}</p>
                      )}
                      {selectedCandidate.mobile_number && (
                        <p className="text-xs sm:text-sm text-red-700">{selectedCandidate.mobile_number}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-yellow-800">
                    All associated data including profile information, offers, and selections will be permanently deleted.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-end gap-3 rounded-b-xl">
              <button
                onClick={handleDeleteCancel}
                disabled={deleteLoading}
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm sm:text-base flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    Delete Candidate
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

export default AllCandidates;

