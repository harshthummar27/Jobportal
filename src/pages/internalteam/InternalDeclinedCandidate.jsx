import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, RefreshCw, ChevronLeft, ChevronRight, AlertCircle, Users, ChevronUp, ChevronDown, Eye } from "lucide-react";

const EXCLUDED_FIELDS = ['candidate_status', 'is_blocked', 'block_info', 'latest_offer', 'letest_offer'];

const DeclinedCandidatesIT = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const perPage = 25;
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const [meta, setMeta] = useState({ current_page: 1, per_page: 25, total: 0, last_page: 1, from: null, to: null });
  const [links, setLinks] = useState({ first: null, last: null, prev: null, next: null });

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('per_page', String(perPage));
      params.set('status', 'decline');
      if (search) params.set('search', search);
      // Only add sort params if sortBy is not an excluded field
      if (sortBy && !EXCLUDED_FIELDS.includes(sortBy)) {
        params.set('sort_by', sortBy);
        params.set('sort_direction', sortDirection);
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/internal/candidates?${params.toString()}` , {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      setCandidates(Array.isArray(json.data) ? json.data : []);
      if (json.meta) setMeta(json.meta);
      if (json.links) setLinks(json.links);
    } catch (err) {
      console.error('Error fetching declined candidates:', err);
      setError('Failed to fetch declined candidates. Please try again.');
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const searchDebounceRef = useRef(null);

  useEffect(() => {
    fetchCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy, sortDirection]);

  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = setTimeout(() => {
      setPage(1);
      fetchCandidates();
    }, 400);
    return () => clearTimeout(searchDebounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCandidates();
  };

  const toggleSort = (field) => {
    // Prevent sorting by excluded fields
    if (EXCLUDED_FIELDS.includes(field)) {
      return;
    }
    if (sortBy === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
    setPage(1);
  };

  const columns = useMemo(() => {
    if (!candidates || candidates.length === 0) return [];
    const first = candidates[0];
    return Object.keys(first).filter(key => !EXCLUDED_FIELDS.includes(key));
  }, [candidates]);

  // Reset sortBy if it's set to an excluded field
  useEffect(() => {
    if (sortBy && EXCLUDED_FIELDS.includes(sortBy)) {
      setSortBy("");
      setSortDirection("asc");
    }
  }, [sortBy]);

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
    
    // For candidate_profile column, return special marker
    if (col === 'candidate_profile' && typeof value === 'object' && value !== null) {
      return 'PROFILE_BUTTON';
    }
    
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return String(value);
  };

  // Get candidate code from row data
  const getCandidateCode = (row) => {
    // Try to get from candidate_profile object
    if (row.candidate_profile && typeof row.candidate_profile === 'object') {
      const profileData = row.candidate_profile;
      if (profileData.candidate_code || profileData.candidateCode) {
        return profileData.candidate_code || profileData.candidateCode;
      }
    }
    // Try to get from candidate_profile string
    if (row.candidate_profile && typeof row.candidate_profile === 'string') {
      try {
        const profileData = JSON.parse(row.candidate_profile);
        if (profileData.candidate_code || profileData.candidateCode) {
          return profileData.candidate_code || profileData.candidateCode;
        }
      } catch (e) {
        // Not valid JSON, ignore
      }
    }
    // Try other common fields
    if (row.candidate_code) return row.candidate_code;
    if (row.code) return row.code;
    // Fallback to ID
    if (row.id) return `CAND${row.id}`;
    return null;
  };

  return (
    <div className="w-full max-w-none">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-gray-100 text-gray-700">
            <Users className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Declined Candidates</h1>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, code, etc."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors whitespace-nowrap"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button
            type="button"
            onClick={() => { setSearch(""); setPage(1); fetchCandidates(); }}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-1 whitespace-nowrap"
          >
            <RefreshCw className="h-4 w-4" /> Reset
          </button>
        </form>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-48">
          <div className="flex items-center gap-2 text-gray-600">
            <RefreshCw className="h-5 w-5 animate-spin text-emerald-600" />
            <span>Loading candidates...</span>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            {candidates.length === 0 ? (
              <div className="p-6 text-center text-gray-600">No candidates found.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col}
                        scope="col"
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                        onClick={() => toggleSort(col)}
                      >
                        <div className="flex items-center gap-1">
                          <span>{col}</span>
                          {sortBy === col && (
                            sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {candidates.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      {columns.map((col) => {
                        const formattedValue = formatValue(row[col], col);
                        const candidateCode = getCandidateCode(row);
                        return (
                          <td key={col} className="px-4 py-2 text-sm text-gray-700 max-w-[28rem] break-words">
                            {formattedValue === 'PROFILE_BUTTON' ? (
                              candidateCode ? (
                                <Link
                                  to={`/internal-team/candidate/${candidateCode}`}
                                  className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1 inline-flex"
                                >
                                  <Eye className="h-3 w-3" />
                                  View
                                </Link>
                              ) : (
                                <span className="text-gray-400 text-xs">N/A</span>
                              )
                            ) : (
                              formattedValue
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

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
    </div>
  );
};

export default DeclinedCandidatesIT;


