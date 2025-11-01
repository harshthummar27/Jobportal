import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, ChevronLeft, ChevronRight, AlertCircle, FileText, ChevronUp, ChevronDown, ArrowUpDown, Eye, MinusCircle } from "lucide-react";
import { toast } from 'react-toastify';

const WithdrawnOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const perPage = 25;
  const [sortBy, setSortBy] = useState("offered_at");
  const [sortDirection, setSortDirection] = useState("desc");

  const [meta, setMeta] = useState({ current_page: 1, per_page: 25, total: 0, last_page: 1, from: null, to: null });
  const [links, setLinks] = useState({ first: null, last: null, prev: null, next: null });
  
  // Status update states
  const [actionLoadingKey, setActionLoadingKey] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOffer, setModalOffer] = useState(null);
  const [modalStatus, setModalStatus] = useState('withdrawn');
  const [modalReason, setModalReason] = useState('');
  
  // Expanded row state: tracks which row index is expanded
  const [expandedRow, setExpandedRow] = useState(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('per_page', String(perPage));
      params.set('sort_by', sortBy);
      params.set('sort_direction', sortDirection);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/internal/offers/status/withdrawn?${params.toString()}`, {
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
      setOffers(Array.isArray(json.data) ? json.data : []);
      if (json.meta) setMeta(json.meta);
      if (json.links) setLinks(json.links);
    } catch (err) {
      console.error('Error fetching withdrawn offers:', err);
      setError('Failed to fetch withdrawn offers. Please try again.');
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy, sortDirection]);

  // Update offer status
  const updateOfferStatus = async (offerId, status, reason = '') => {
    try {
      setActionError(null);
      const loadingKey = `${offerId}:${status}`;
      setActionLoadingKey(loadingKey);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/internal/offers/${offerId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          reason: reason || undefined
        }),
      });

      const data = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        const errorMessage = data.message || data.error || data.errors?.message || `Failed to update offer status (${response.status})`;
        throw new Error(errorMessage);
      }

      toast.success(`Offer status updated to ${status.charAt(0).toUpperCase() + status.slice(1)}.`);
      setModalOpen(false);
      setModalOffer(null);
      setModalStatus('withdrawn');
      setModalReason('');
      await fetchOffers();
    } catch (err) {
      console.error('Error updating offer status:', err);
      const message = err?.message || 'Failed to update offer status. Please try again.';
      setActionError(message);
      toast.error(message);
    } finally {
      setActionLoadingKey(null);
    }
  };

  const handleStatusChange = (row, newStatus) => {
    const offerId = row.id ?? row.offer_id ?? row.ID;
    if (!offerId) {
      toast.error('Offer ID not found. Cannot update status.');
      return;
    }

    const currentStatus = (row.status ?? '').toString().toLowerCase();
    if (newStatus === currentStatus) {
      return;
    }

    setModalOffer(row);
    setModalStatus(newStatus);
    setModalReason('');
    setModalOpen(true);
  };

  const closeModal = () => {
    if (!actionLoadingKey) {
      setModalOpen(false);
      setModalOffer(null);
      setModalStatus('withdrawn');
      setModalReason('');
      setActionError(null);
    }
  };

  const confirmStatusUpdate = async () => {
    if (!modalOffer) return;
    
    const offerId = modalOffer.id ?? modalOffer.offer_id ?? modalOffer.ID;
    if (!offerId) {
      toast.error('Offer ID not found. Cannot update status.');
      return;
    }

    if ((modalStatus === 'declined' || modalStatus === 'withdrawn') && !modalReason.trim()) {
      toast.error('Please provide a reason for declining or withdrawing the offer.');
      return;
    }

    const reason = modalReason.trim().substring(0, 1000);
    await updateOfferStatus(offerId, modalStatus, reason);
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

  const columns = useMemo(() => {
    if (!offers || offers.length === 0) return [];
    const first = offers[0];
    // Filter out id and any status-related fields (status, offer_status, offerStatus, etc.)
    return Object.keys(first).filter(col => {
      const colLower = col.toLowerCase();
      return !['id'].includes(col) && 
             !colLower.includes('status') && 
             !['offer_status', 'offerStatus'].includes(col);
    });
  }, [offers]);

  // Get candidate code from row data
  const getCandidateCode = (row) => {
    // Try to get from candidate object
    if (row.candidate && typeof row.candidate === 'object') {
      if (row.candidate.candidate_code || row.candidate.candidateCode) {
        return row.candidate.candidate_code || row.candidate.candidateCode;
      }
    }
    // Try candidate_profile object
    if (row.candidate_profile && typeof row.candidate_profile === 'object') {
      const profileData = row.candidate_profile;
      if (profileData.candidate_code || profileData.candidateCode) {
        return profileData.candidate_code || profileData.candidateCode;
      }
    }
    // Try candidate_profile string (JSON)
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
    // Try direct candidate_code field
    if (row.candidate_code) return row.candidate_code;
    if (row.code) return row.code;
    return null;
  };

  // Format column name to be human-readable
  const formatColumnName = (col) => {
    const nameMap = {
      'offered_at': 'Offered Date',
      'job_title': 'Job Title',
      'offered_salary': 'Salary',
      'location': 'Location',
      'offer_deadline': 'Deadline',
      'start_date': 'Start Date',
      'candidate_id': 'Candidate',
      'candidate': 'Candidate',
      'offered_by': 'Offered By',
      'offeredBy': 'Offered By',
      'offered_by_recruiter': 'Recruiter',
      'candidate_profile': 'Candidate',
      'created_at': 'Created',
      'updated_at': 'Updated'
    };
    return nameMap[col] || col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Format currency
  const formatCurrency = (value) => {
    if (!value && value !== 0) return '-';
    const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : Number(value);
    if (isNaN(num)) return String(value);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Format date
  const formatDate = (value) => {
    if (!value) return '-';
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
      return String(value);
    }
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusLower = String(status || '').toLowerCase();
    const badges = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
      accepted: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
      declined: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
      withdrawn: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
    };
    return badges[statusLower] || badges.pending;
  };

  const formatValue = (value, col, row) => {
    if (value === null || value === undefined) return null;
    
    // For candidate_id column, show View button if candidate code is available
    if ((col === 'candidate_id' || col === 'candidate' || col === 'candidate_profile') && row) {
      const candidateCode = getCandidateCode(row);
      if (candidateCode) {
        return 'CANDIDATE_PROFILE_BUTTON';
      }
    }
    
    // For offered_by or similar user object fields, format user-friendly
    if ((col === 'offered_by' || col === 'offeredBy' || col === 'offered_by_recruiter') && typeof value === 'object' && value !== null) {
      return 'USER_INFO_OBJECT';
    }
    
    // For recruiter objects (with company_name, recruiter_name, recruiter_email)
    if ((col.includes('recruiter') || col === 'recruiter') && typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return 'RECRUITER_OBJECT';
    }
    
    // Format array fields (like benefits)
    if (Array.isArray(value)) {
      return { type: 'array', value: value };
    }
    
    // Format currency fields
    if (col.includes('salary') || col.includes('amount') || col.includes('price')) {
      return { type: 'currency', value: formatCurrency(value) };
    }
    
    // Format date fields
    if (col.includes('date') || col.includes('deadline') || col.includes('_at') || col === 'offered_at' || col === 'start_date' || col === 'offer_deadline') {
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
        return { type: 'date', value: formatDate(value) };
      }
    }
    
    // For other object fields, try to format user-friendly
    if (typeof value === 'object' && value !== null) {
      // Check if it's a recruiter-like object
      if (value.company_name || value.recruiter_name || value.recruiter_email) {
        return 'RECRUITER_OBJECT';
      }
      // Check if it has name and email (user-like object)
      if (value.name && value.email) {
        return 'USER_INFO_OBJECT';
      }
      // Otherwise return as JSON string
      return JSON.stringify(value, null, 2);
    }
    
    return String(value);
  };

  // Toggle row expansion - when any cell is clicked, expand entire row
  const toggleRowExpansion = (rowIdx) => {
    setExpandedRow(expandedRow === rowIdx ? null : rowIdx);
  };

  // Check if cell is expandable (has long content)
  const isExpandable = (value, col) => {
    if (!value) return false;
    const strValue = typeof value === 'string' ? value : String(value);
    // Consider expandable if longer than 50 characters or has newlines
    return strValue.length > 50 || strValue.includes('\n');
  };

  // Check if row has any expandable content
  const hasExpandableContent = (row) => {
    return columns.some(col => {
      const value = row[col];
      if (!value) return false;
      if (Array.isArray(value)) return value.length > 3;
      if (typeof value === 'string') return isExpandable(value, col);
      return false;
    });
  };

  // Render cell content with expansion
  const renderCellContent = (value, col, rowIdx, formattedValue, candidateCode, row) => {
    const isRowExpanded = expandedRow === rowIdx;
    const isLongText = typeof value === 'string' && isExpandable(value, col);
    
    // Special cases that shouldn't be expandable
    if (formattedValue === 'CANDIDATE_PROFILE_BUTTON' && candidateCode) {
      return (
        <Link
          to={`/internal-team/candidate/${candidateCode}`}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-xs"
        >
          <Eye className="h-3.5 w-3.5" />
          View Profile
        </Link>
      );
    }
    
    if (formattedValue === 'USER_INFO_OBJECT' && typeof value === 'object' && value !== null) {
      return (
        <div className="flex flex-col min-w-0">
          {value.name && (
            <span className="font-medium text-gray-900 truncate">{value.name}</span>
          )}
          {value.email && (
            <span className="text-xs text-gray-600 truncate">{value.email}</span>
          )}
          {!value.name && !value.email && value.id && (
            <span className="text-xs text-gray-500">ID: {value.id}</span>
          )}
        </div>
      );
    }
    
    if (formattedValue === 'RECRUITER_OBJECT' && typeof value === 'object' && value !== null) {
      return (
        <div className="flex flex-col min-w-0 gap-0.5">
          {value.company_name && (
            <span className="font-medium text-gray-900 truncate">{value.company_name}</span>
          )}
          {value.recruiter_name && (
            <span className="text-xs text-gray-700 truncate">{value.recruiter_name}</span>
          )}
          {value.recruiter_email && (
            <span className="text-xs text-gray-600 truncate">{value.recruiter_email}</span>
          )}
        </div>
      );
    }
    
    if (formattedValue && typeof formattedValue === 'object' && formattedValue.type === 'currency') {
      return <span className="font-medium text-gray-900">{formattedValue.value}</span>;
    }
    
    if (formattedValue && typeof formattedValue === 'object' && formattedValue.type === 'date') {
      return <span className="text-gray-700">{formattedValue.value}</span>;
    }
    
    if (formattedValue && typeof formattedValue === 'object' && formattedValue.type === 'array') {
      const arrayValue = formattedValue.value;
      const maxVisible = 3;
      const hasMore = arrayValue.length > maxVisible;
      const visibleItems = isRowExpanded ? arrayValue : arrayValue.slice(0, maxVisible);
      
      return (
        <div className="flex flex-wrap gap-1">
          {visibleItems.map((item, i) => (
            <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              {String(item)}
            </span>
          ))}
          {hasMore && !isRowExpanded && (
            <span className="text-blue-600 text-xs">+{arrayValue.length - maxVisible}</span>
          )}
        </div>
      );
    }
    
    // For text content
    const displayValue = formattedValue || value || '-';
    const stringValue = String(displayValue);
    
    if (isLongText) {
      return (
        <div
          className={`transition-all ${isRowExpanded ? '' : 'line-clamp-2'} break-words`}
          style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
        >
          <span className="text-gray-700 break-words">{stringValue}</span>
          {!isRowExpanded && (
            <span className="text-blue-600 text-xs ml-1">...</span>
          )}
        </div>
      );
    }
    
    return <span className="text-gray-700">{stringValue}</span>;
  };

  return (
    <div className="w-full max-w-none space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gray-50 text-gray-600 shadow-sm">
            <MinusCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Withdrawn Offers</h1>
            <p className="text-sm text-gray-500 mt-0.5">View and manage withdrawn job offers</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchOffers}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <ArrowUpDown className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="offered_at">Offered Date</option>
              <option value="job_title">Job Title</option>
              <option value="offered_salary">Salary</option>
              <option value="location">Location</option>
              <option value="offer_deadline">Deadline</option>
              <option value="start_date">Start Date</option>
            </select>
            <ChevronDown className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          
          <div className="relative">
            <select
              value={sortDirection}
              onChange={(e) => {
                setSortDirection(e.target.value);
                setPage(1);
              }}
              className="pl-3 pr-8 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
            <ChevronDown className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          
          {(sortBy !== "offered_at" || sortDirection !== "desc") && (
            <button
              type="button"
              onClick={() => {
                setSortBy("offered_at");
                setSortDirection("desc");
                setPage(1);
              }}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-col items-center gap-3 text-gray-600">
            <RefreshCw className="h-8 w-8 animate-spin text-emerald-600" />
            <span className="text-sm font-medium">Loading offers...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            {offers.length === 0 ? (
              <div className="p-12 text-center">
                <MinusCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-600">No withdrawn offers found</p>
                <p className="text-xs text-gray-500 mt-1">Withdrawn offers will appear here</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 text-xs table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    {/* First column */}
                    {columns.length > 0 && (
                      <th
                        key={columns[0]}
                        scope="col"
                        className="px-2 py-1 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => toggleSort(columns[0])}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{formatColumnName(columns[0])}</span>
                          {sortBy === columns[0] && (
                            sortDirection === 'asc' ? <ChevronUp className="h-3.5 w-3.5 text-emerald-600" /> : <ChevronDown className="h-3.5 w-3.5 text-emerald-600" />
                          )}
                        </div>
                      </th>
                    )}
                    {/* Offer Status as 2nd column */}
                    <th
                      scope="col"
                      className="px-2 py-1 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Offer Status
                    </th>
                    {/* Remaining columns */}
                    {columns.slice(1).map((col) => (
                      <th
                        key={col}
                        scope="col"
                        className="px-2 py-1 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => toggleSort(col)}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{formatColumnName(col)}</span>
                          {sortBy === col && (
                            sortDirection === 'asc' ? <ChevronUp className="h-3.5 w-3.5 text-emerald-600" /> : <ChevronDown className="h-3.5 w-3.5 text-emerald-600" />
                          )}
                        </div>
                      </th>
                    ))}
                    {/* Status dropdown header at last position */}
                    <th
                      scope="col"
                      className="px-2 py-1 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {offers.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      {/* First column */}
                      {columns.length > 0 && (() => {
                        const col = columns[0];
                        const formattedValue = formatValue(row[col], col, row);
                        const candidateCode = getCandidateCode(row);
                        return (
                          <td 
                            key={col} 
                            className={`px-2 py-1 text-xs text-gray-900 max-w-[120px] ${expandedRow === idx ? 'whitespace-normal break-words' : 'whitespace-nowrap truncate'}`}
                            onClick={() => {
                              const hasExpandable = hasExpandableContent(row);
                              if (hasExpandable) toggleRowExpansion(idx);
                            }}
                            style={{ cursor: hasExpandableContent(row) ? 'pointer' : 'default', overflow: 'hidden', wordBreak: 'break-word' }}
                          >
                            {renderCellContent(row[col], col, idx, formattedValue, candidateCode, row)}
                          </td>
                        );
                      })()}
                      {/* Offer Status as 2nd column - show badge only */}
                      <td className="px-2 py-1 whitespace-nowrap">
                        {(() => {
                          const current = (row.status ?? '').toString().toLowerCase() || 'withdrawn';
                          const badgeStyle = getStatusBadge(current);
                          return (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badgeStyle.bg} ${badgeStyle.text} border ${badgeStyle.border}`}>
                              {current.charAt(0).toUpperCase() + current.slice(1)}
                            </span>
                          );
                        })()}
                      </td>
                      {/* Remaining columns */}
                      {columns.slice(1).map((col) => {
                        const formattedValue = formatValue(row[col], col, row);
                        const candidateCode = getCandidateCode(row);
                        return (
                          <td 
                            key={col} 
                            className={`px-2 py-1 text-xs text-gray-900 max-w-[120px] ${expandedRow === idx ? 'whitespace-normal break-words' : 'whitespace-nowrap truncate'}`}
                            onClick={() => {
                              const hasExpandable = hasExpandableContent(row);
                              if (hasExpandable) toggleRowExpansion(idx);
                            }}
                            style={{ cursor: hasExpandableContent(row) ? 'pointer' : 'default', overflow: 'hidden', wordBreak: 'break-word' }}
                          >
                            {renderCellContent(row[col], col, idx, formattedValue, candidateCode, row)}
                          </td>
                        );
                      })}
                      {/* Status dropdown at last position */}
                      <td className="px-2 py-1 whitespace-nowrap">
                        {(() => {
                          const offerId = row.id ?? row.offer_id ?? row.ID;
                          const isLoadingThisRow = actionLoadingKey && actionLoadingKey.startsWith(`${offerId}:`);
                          const current = (row.status ?? '').toString().toLowerCase() || 'withdrawn';
                          return (
                            <div className="relative inline-flex items-center">
                              <select
                                className={`appearance-none pr-8 pl-3 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${isLoadingThisRow ? 'opacity-70 cursor-not-allowed' : 'hover:border-gray-400'}`}
                                value={current}
                                onChange={(e) => handleStatusChange(row, e.target.value)}
                                disabled={!!isLoadingThisRow}
                              >
                                <option value="pending">Pending</option>
                                <option value="accepted">Accepted</option>
                                <option value="declined">Declined</option>
                                <option value="withdrawn">Withdrawn</option>
                              </select>
                              <div className="pointer-events-none absolute right-2">
                                {isLoadingThisRow ? (
                                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-gray-500" />
                                ) : (
                                  <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
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

          {actionError && (
            <div className="px-6 py-3 bg-red-50 border-t border-red-200">
              <p className="text-sm text-red-700">{actionError}</p>
            </div>
          )}

          {/* Status Update Modal */}
          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
              <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-bold text-gray-900">Update Offer Status</h3>
                </div>
                <div className="px-6 py-5 space-y-4">
                  {modalOffer && (
                    <div className="text-xs text-gray-500 font-medium">
                      Offer ID: <span className="text-gray-700">{String(modalOffer.id ?? modalOffer.offer_id ?? modalOffer.ID ?? 'N/A')}</span>
                    </div>
                  )}
                  
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Status
                    </label>
                    <span className="text-base font-bold text-gray-900 capitalize">
                      {modalStatus}
                    </span>
                  </div>

                  {(modalStatus === 'declined' || modalStatus === 'withdrawn') && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Reason <span className="text-red-500">*</span>
                        <span className="ml-2 text-xs font-normal text-gray-500">
                          ({modalReason.length}/1000 characters)
                        </span>
                      </label>
                      <textarea
                        value={modalReason}
                        onChange={(e) => {
                          if (e.target.value.length <= 1000) {
                            setModalReason(e.target.value);
                          }
                        }}
                        placeholder="Please provide a reason for declining or withdrawing the offer..."
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-all"
                        rows={4}
                        maxLength={1000}
                        disabled={!!actionLoadingKey}
                      />
                    </div>
                  )}
                </div>
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={closeModal}
                    disabled={!!actionLoadingKey}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
                    onClick={confirmStatusUpdate}
                    disabled={!!actionLoadingKey}
                  >
                    {actionLoadingKey ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Status'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Page {meta.current_page}</span> of <span className="font-medium">{meta.last_page}</span>
              {' · '}
              <span className="font-medium">{meta.total}</span> total offers
              {meta.from != null && meta.to != null && (
                <span className="text-gray-500"> ({meta.from}–{meta.to} shown)</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
                onClick={() => setPage((p) => Math.min(meta.last_page || p + 1, p + 1))}
                disabled={page >= (meta.last_page || 1)}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawnOffers;

