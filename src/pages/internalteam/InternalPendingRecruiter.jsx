import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, RefreshCw, ChevronLeft, ChevronRight, AlertCircle, Users, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from 'react-toastify';

const PendingRecruitersIT = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const perPage = 25;
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const [meta, setMeta] = useState({ current_page: 1, per_page: 25, total: 0, last_page: 1, from: null, to: null });
  const [actionLoadingKey, setActionLoadingKey] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmRow, setConfirmRow] = useState(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchRecruiters = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('per_page', String(perPage));
      params.set('status', 'pending');
      if (search) params.set('search', search);
      if (sortBy) params.set('sort_by', sortBy);
      if (sortDirection) params.set('sort_direction', sortDirection);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/internal/recruiters?${params.toString()}` , {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      let json;
      if (!response.ok) {
        // Try to parse backend error message
        try {
          json = await response.json();
          const apiMsg = json?.message || json?.error || `HTTP error! status: ${response.status}`;
          throw new Error(apiMsg);
        } catch (e) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      json = await response.json();
      setRecruiters(Array.isArray(json.data) ? json.data : []);
      if (json.meta) setMeta(json.meta);
    } catch (err) {
      console.error('Error fetching pending recruiters:', err);
      const message = err?.message || 'Failed to fetch pending recruiters. Please try again.';
      setError(message);
      toast.error(message);
      setRecruiters([]);
    } finally {
      setLoading(false);
    }
  };

  const updateRecruiterStatus = async (id, status) => {
    try {
      setActionError(null);
      const loadingKey = `${id}:${status}`;
      setActionLoadingKey(loadingKey);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/internal/status/recruiter`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || data.error || `Failed to update status (${response.status})`);
      }

      toast.success(`Recruiter status updated to ${status}.`);
      await fetchRecruiters();
    } catch (err) {
      console.error('Error updating recruiter status:', err);
      const message = err?.message || 'Failed to update status.';
      setActionError(message);
      toast.error(message);
    } finally {
      setActionLoadingKey(null);
    }
  };

  const handleStatusChange = async (row, nextStatus) => {
    const id = row.id ?? row.ID ?? row.recruiter_id;
    if (!id) return;

    const currentStatus = row.status ?? row.current_status ?? '';
    if (String(nextStatus).toLowerCase() === String(currentStatus).toLowerCase()) return;

    if (nextStatus === 'decline') {
      setConfirmRow(row);
      setConfirmOpen(true);
      return;
    }

    await updateRecruiterStatus(id, nextStatus);
    if (actionError) {
      fetchRecruiters();
    }
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setConfirmRow(null);
  };

  const confirmDecline = async () => {
    if (!confirmRow) return;
    const id = confirmRow.id ?? confirmRow.ID ?? confirmRow.recruiter_id;
    await updateRecruiterStatus(id, 'decline');
    closeConfirm();
  };

  const searchDebounceRef = useRef(null);
  const prevSearchRef = useRef(undefined);
  const isFirstRender = useRef(true);

  useEffect(() => {
    fetchRecruiters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy, sortDirection]);

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
      fetchRecruiters();
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
    fetchRecruiters();
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

  const formatCellValue = (value) => {
    if (value === null || value === undefined) return '';
    
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
    
    if (typeof value === 'object') return JSON.stringify(value);
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return String(value);
  };

  const columns = useMemo(() => {
    if (!recruiters || recruiters.length === 0) return [];
    const first = recruiters[0];
    return Object.keys(first);
  }, [recruiters]);

  return (
    <div className="w-full max-w-none">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-gray-100 text-gray-700">
            <Users className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Pending Recruiters</h1>
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
            onClick={() => { setSearch(""); setPage(1); fetchRecruiters(); }}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-1 whitespace-nowrap"
          >
            <RefreshCw className="h-4 w-4" /> Reset
          </button>
        </form>
      </div>

      {/* Error */}
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
            {recruiters.length === 0 ? (
              <div className="p-6 text-center text-gray-600">No recruiters found.</div>
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
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recruiters.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      {columns.map((col) => (
                        <td key={col} className="px-4 py-2 text-sm text-gray-700 max-w-[28rem] break-words">
                          {formatCellValue(row[col])}
                        </td>
                      ))}
                      <td className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">
                        {(() => {
                          const id = row.id ?? row.ID ?? row.recruiter_id;
                          const isLoadingThisRow = actionLoadingKey && actionLoadingKey.startsWith(`${id}:`);
                          const current = (row.status ?? row.current_status ?? '').toString().toLowerCase();
                          return (
                            <div className="relative inline-flex items-center">
                              <select
                                className={`appearance-none pr-8 pl-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 ${isLoadingThisRow ? 'opacity-70 cursor-not-allowed' : ''}`}
                                value={current || ''}
                                onChange={(e) => handleStatusChange(row, e.target.value)}
                                disabled={!!isLoadingThisRow}
                              >
                                <option value="pending">Pending</option>
                                <option value="approve">Approve</option>
                                <option value="decline">Decline</option>
                              </select>
                              <div className="pointer-events-none absolute right-2">
                                {isLoadingThisRow ? (
                                  <RefreshCw className="h-4 w-4 animate-spin text-gray-500" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-gray-500" />
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </td>
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

          {actionError && (
            <div className="px-4 pb-3 text-sm text-red-700">{actionError}</div>
          )}
        </div>
      )}

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-sm mx-4">
            <div className="p-5 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-800">Confirm Decline</h3>
            </div>
            <div className="p-5 text-sm text-gray-700 space-y-2">
              <p>Are you sure you want to decline this recruiter?</p>
              {confirmRow && (
                <div className="text-xs text-gray-500">
                  ID: {String(confirmRow.id ?? confirmRow.ID ?? confirmRow.recruiter_id)}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 flex items-center justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={closeConfirm}
                disabled={!!actionLoadingKey}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                onClick={confirmDecline}
                disabled={!!actionLoadingKey}
              >
                {actionLoadingKey && confirmRow && actionLoadingKey === `${(confirmRow.id ?? confirmRow.ID ?? confirmRow.recruiter_id)}:decline` ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Declining...
                  </>
                ) : (
                  'Confirm Decline'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRecruitersIT;


