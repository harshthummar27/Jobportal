import React, { useState, useEffect } from "react";
import { 
  Loader2, 
  AlertCircle, 
  DollarSign, 
  MapPin, 
  Briefcase,
  User,
  Filter,
  ArrowUpDown
} from "lucide-react";
import RecruiterLayout from "../../Components/RecruiterLayout";

const OfferedCandidates = () => {
  const [offers, setOffers] = useState([]);
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
  
  // Filters
  const [sortDirection, setSortDirection] = useState("desc");
  const [offerStatus, setOfferStatus] = useState(null); // null means all statuses

  const fetchOfferedCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Pagination params
      const params = new URLSearchParams({
        page: pagination.current_page.toString(),
        per_page: pagination.per_page.toString()
      });

      if (sortDirection) {
        params.append('sort_direction', sortDirection);
      }
      // Only pass offer_status if it's not null (null means all statuses)
      if (offerStatus !== null) {
        params.append('offer_status', offerStatus);
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recruiter/offered-candidates?${params}`, {
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

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch offered candidates');
      }

      // Handle paginated response
      if (data.data && data.data.data) {
        // Paginated response
        setOffers(Array.isArray(data.data.data) ? data.data.data : []);
        setPagination({
          current_page: data.data.current_page ?? 1,
          per_page: Number(data.data.per_page) || pagination.per_page,
          total: data.data.total ?? 0,
          last_page: data.data.last_page ?? 1,
          from: data.data.from ?? 0,
          to: data.data.to ?? 0,
        });
      } else {
        // Non-paginated response (backward compatibility)
        setOffers(Array.isArray(data.data) ? data.data : []);
        setPagination(prev => ({
          ...prev,
          total: Array.isArray(data.data) ? data.data.length : 0,
          last_page: 1,
          from: 1,
          to: Array.isArray(data.data) ? data.data.length : 0,
        }));
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch offered candidates');
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset to page 1 when filters change
    if (pagination.current_page !== 1) {
      setPagination(prev => ({ ...prev, current_page: 1 }));
    } else {
      fetchOfferedCandidates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortDirection, offerStatus]);

  useEffect(() => {
    fetchOfferedCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current_page]);

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium">Pending</span>;
      case 'accepted':
        return <span className="bg-green-100 text-green-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium">Accepted</span>;
      case 'declined':
        return <span className="bg-red-100 text-red-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium">Declined</span>;
      case 'withdrawn':
        return <span className="bg-gray-100 text-gray-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium">Withdrawn</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium">{status || 'N/A'}</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    try {
      if (!amount) return 'N/A';
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount)) return 'N/A';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(numAmount);
    } catch {
      return 'N/A';
    }
  };

  return (
    <RecruiterLayout>
      <div className="w-full max-w-none">
        <div className="mx-auto">
          {/* Page Header */}
          <div className="mb-3">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Offered Candidates</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 hidden sm:block">View all candidates you have made offers to</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {/* Offer Status Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Offer Status</label>
                <div className="relative">
                  <Filter className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 pointer-events-none z-10" />
                  <select
                    value={offerStatus || ''}
                    onChange={(e) => setOfferStatus(e.target.value || null)}
                    className="w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-1.5 sm:py-2.5 bg-white border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none cursor-pointer transition-all duration-200 text-xs sm:text-sm font-medium text-gray-700"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="withdrawn">Withdrawn</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Sort Direction */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Sort Direction</label>
                <div className="relative">
                  <ArrowUpDown className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 pointer-events-none z-10" />
                  <select
                    value={sortDirection}
                    onChange={(e) => setSortDirection(e.target.value)}
                    className="w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-1.5 sm:py-2.5 bg-white border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none cursor-pointer transition-all duration-200 text-xs sm:text-sm font-medium text-gray-700"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm font-medium">Error: {error}</span>
              </div>
            </div>
          )}

          {/* Offers Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-8 sm:p-12 text-center">
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin mx-auto text-indigo-600 mb-2 sm:mb-3" />
                <p className="text-xs sm:text-sm text-gray-500 font-medium">Loading offered candidates...</p>
              </div>
            ) : offers.length === 0 ? (
              <div className="p-8 sm:p-12 text-center">
                <Briefcase className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-gray-300 mb-2 sm:mb-3" />
                <p className="text-xs sm:text-sm text-gray-500 font-medium">No offered candidates found</p>
                <p className="text-xs text-gray-400 mt-1.5 sm:mt-2 hidden sm:block">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="p-2 sm:p-3">
                <div className="space-y-3">
                  {offers.filter(offer => offer && offer.offer_id).map((offer) => (
                    <div
                      key={offer.offer_id}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                    >
                      {/* Compact Header */}
                      <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                        <div className="flex items-center justify-between gap-2 sm:gap-3">
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <div className="h-8 w-8 sm:h-9 sm:w-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-indigo-100 shadow-sm">
                              <User className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <div className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                                  {offer.candidate?.candidate_code || 'N/A'}
                                </div>
                                {offer.candidate && offer.candidate.total_years_experience != null && (
                                  <>
                                    <span className="text-[10px] sm:text-xs text-gray-400">•</span>
                                    <span className="text-[10px] sm:text-xs text-gray-600">{offer.candidate.total_years_experience} yrs</span>
                                  </>
                                )}
                                {offer.candidate && offer.candidate.visa_status && (
                                  <>
                                    <span className="text-[10px] sm:text-xs text-gray-400">•</span>
                                    <span className="text-[10px] sm:text-xs text-gray-600">{offer.candidate.visa_status}</span>
                                  </>
                                )}
                                {offer.candidate && offer.candidate.candidate_score != null && (
                                  <>
                                    <span className="text-[10px] sm:text-xs text-gray-400">•</span>
                                    <span className="text-[10px] sm:text-xs font-semibold text-yellow-700">Score: {offer.candidate.candidate_score}</span>
                                  </>
                                )}
                              </div>
                              {offer.candidate && offer.candidate.city && offer.candidate.state && (
                                <div className="flex items-center gap-1 mt-1 text-[10px] sm:text-xs text-gray-600">
                                  <MapPin className="h-3 w-3 text-gray-400" />
                                  <span>{offer.candidate.city}, {offer.candidate.state}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {getStatusBadge(offer.offer_status)}
                          </div>
                        </div>
                      </div>

                      {/* Compact Body - Grid Layout */}
                      <div className="px-3 sm:px-4 py-2.5 sm:py-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                          {/* Job & Offer Info */}
                          <div className="md:col-span-2 space-y-2 sm:space-y-2.5">
                            <div className="flex items-start gap-2">
                              <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">
                                  {offer.job_title || 'N/A'}
                                </div>
                                <div className="text-[10px] sm:text-xs text-gray-600 leading-relaxed line-clamp-2 mb-1.5">
                                  {offer.job_description || 'N/A'}
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  {offer.location && (
                                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-600">
                                      <MapPin className="h-3 w-3 text-gray-400" />
                                      <span>{offer.location}</span>
                                    </div>
                                  )}
                                  {offer.offered_salary && (
                                    <div className="flex items-center gap-1">
                                      <DollarSign className="h-3.5 w-3.5 text-green-600" />
                                      <span className="text-xs sm:text-sm font-bold text-gray-900">{formatCurrency(offer.offered_salary)}</span>
                                    </div>
                                  )}
                                  {offer.is_expired !== undefined && (
                                    <span className={`text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded ${offer.is_expired ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                                      {offer.is_expired ? 'Expired' : 'Active'}
                                    </span>
                                  )}
                                </div>
                                {Array.isArray(offer.benefits) && offer.benefits.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1.5">
                                    {offer.benefits.slice(0, 3).map((benefit, idx) => (
                                      <span key={idx} className="text-[10px] sm:text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100">
                                        {benefit || 'N/A'}
                                      </span>
                                    ))}
                                    {offer.benefits.length > 3 && (
                                      <span className="text-[10px] sm:text-xs text-gray-500">+{offer.benefits.length - 3}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            {(offer.offer_notes || offer.decline_reason) && (
                              <div className="space-y-1.5 pt-1.5 border-t border-gray-100">
                                {offer.offer_notes && (
                                  <div className="text-[10px] sm:text-xs text-gray-600">
                                    <span className="font-semibold text-gray-700">Notes: </span>
                                    <span className="line-clamp-1">{offer.offer_notes}</span>
                                  </div>
                                )}
                                {offer.decline_reason && (
                                  <div className="text-[10px] sm:text-xs text-red-700">
                                    <span className="font-semibold">Declined: </span>
                                    <span className="line-clamp-1">{offer.decline_reason}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Status & Dates */}
                          <div className="space-y-2 sm:space-y-2.5">
                            {offer.candidate_status && (
                              <div className="pb-2 border-b border-gray-100">
                                <div className="text-[10px] sm:text-xs font-semibold text-gray-700 mb-0.5">Status:</div>
                                <div className="text-[10px] sm:text-xs font-semibold text-gray-900 mb-0.5">
                                  {offer.candidate_status?.status_display || offer.candidate_status?.status || 'N/A'}
                                </div>
                                {offer.candidate_status?.notes && (
                                  <div className="text-[10px] sm:text-xs text-gray-500 line-clamp-1">
                                    {offer.candidate_status.notes}
                                  </div>
                                )}
                                {offer.candidate_status?.status_date && (
                                  <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                                    {formatDateTime(offer.candidate_status.status_date)}
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="space-y-1.5">
                              {offer.offered_at && (
                                <div className="text-[10px] sm:text-xs">
                                  <div className="font-semibold text-gray-700">Offered:</div>
                                  <div className="text-gray-600">{formatDateTime(offer.offered_at)}</div>
                                </div>
                              )}
                              {offer.start_date && (
                                <div className="text-[10px] sm:text-xs">
                                  <div className="font-semibold text-gray-700">Start:</div>
                                  <div className="text-gray-600">{formatDate(offer.start_date)}</div>
                                </div>
                              )}
                              {offer.offer_deadline && (
                                <div className="text-[10px] sm:text-xs">
                                  <div className="font-semibold text-gray-700">Deadline:</div>
                                  <div className="text-gray-600">{formatDate(offer.offer_deadline)}</div>
                                </div>
                              )}
                              {offer.responded_at && (
                                <div className="text-[10px] sm:text-xs">
                                  <div className="font-semibold text-gray-700">Responded:</div>
                                  <div className="text-gray-600">{formatDateTime(offer.responded_at)}</div>
                                </div>
                              )}
                            </div>
                            {(offer.offered_by || offer.selection_id) && (
                              <div className="pt-2 border-t border-gray-100 space-y-1">
                                {offer.offered_by && (
                                  <div className="text-[10px] sm:text-xs text-gray-600">
                                    <div className="font-semibold text-gray-700">By: {offer.offered_by?.name || 'N/A'}</div>
                                    <div className="text-gray-500 truncate">{offer.offered_by?.email || 'N/A'}</div>
                                  </div>
                                )}
                                {offer.selection_id && (
                                  <div className="text-[10px] sm:text-xs text-gray-400">
                                    ID: {offer.selection_id}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Pagination - Show all the time when there are offers */}
            {!loading && offers.length > 0 && (
              <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
                  <div className="text-xs sm:text-sm text-gray-700">
                    <span className="font-medium">
                      Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total || 0} results
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={() => {
                        const newPage = pagination.current_page - 1;
                        if (newPage >= 1) {
                          setPagination(prev => ({ ...prev, current_page: newPage }));
                        }
                      }}
                      disabled={pagination.current_page <= 1}
                      className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-1"
                    >
                      <span className="hidden sm:inline">Previous</span>
                    </button>
                    <span className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-700">
                      Page {pagination.current_page || 1} of {pagination.last_page || 1}
                    </span>
                    <button
                      onClick={() => {
                        const newPage = pagination.current_page + 1;
                        if (newPage <= pagination.last_page) {
                          setPagination(prev => ({ ...prev, current_page: newPage }));
                        }
                      }}
                      disabled={pagination.current_page >= pagination.last_page}
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
    </RecruiterLayout>
  );
};

export default OfferedCandidates;
