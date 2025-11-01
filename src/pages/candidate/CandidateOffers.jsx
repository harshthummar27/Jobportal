import React, { useState, useEffect } from "react";
import { 
  Loader2, 
  AlertCircle, 
  DollarSign, 
  MapPin, 
  Briefcase,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from 'react-toastify';
import CandidateLayout from "../../Components/CandidateLayout";

const CandidateOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and sort states - all null by default
  const [page, setPage] = useState(null);
  const [offerStatus, setOfferStatus] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  // Pagination info from API
  const [pagination, setPagination] = useState(null);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Build query params - only include non-null values
      const params = new URLSearchParams();
      if (page !== null) params.append('page', page);
      params.append('per_page', '25'); // Always set to 25 items per page
      if (offerStatus !== null) params.append('offer_status', offerStatus);
      if (sortBy !== null) params.append('sort_by', sortBy);
      if (sortDirection !== null) params.append('sort_direction', sortDirection);

      const queryString = params.toString();
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/profile/offers${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
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
        throw new Error(data.message || 'Failed to fetch offers');
      }

      const offersData = Array.isArray(data.data) ? data.data : [];
      
      // Store pagination info if available
      let paginationData = null;
      if (data.pagination) {
        paginationData = data.pagination;
      } else if (data.total !== undefined || data.current_page !== undefined) {
        paginationData = {
          current_page: data.current_page || (page || 1),
          per_page: data.per_page || 25,
          total: data.total || 0,
          total_pages: data.total_pages || Math.ceil((data.total || 0) / (data.per_page || 25))
        };
      }
      
      // If current page has no data and we're on page > 1, reset to page 1
      const currentPageNum = page || 1;
      if (offersData.length === 0 && currentPageNum > 1) {
        if (paginationData && (paginationData.total === 0 || paginationData.total_pages === 0)) {
          // No data at all, reset to page 1 (null)
          setPage(null);
          setPagination(null);
          setOffers([]);
          return;
        } else if (paginationData && currentPageNum > paginationData.total_pages) {
          // Page exceeds available pages, go to last page
          setPage(paginationData.total_pages);
          // Will fetch again with correct page
          return;
        } else {
          // Current page has no data, go back to page 1
          setPage(1);
          // Will fetch again with page 1
          return;
        }
      }
      
      setOffers(offersData);
      setPagination(paginationData);

    } catch (error) {
      console.error('Error fetching offers:', error);
      setError(error.message || 'Failed to fetch offers');
      setOffers([]);
      toast.error(error.message || 'Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [page, offerStatus, sortBy, sortDirection]);

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
      case 'expired':
        return <span className="bg-orange-100 text-orange-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium">Expired</span>;
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
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(parseFloat(amount));
  };

  return (
    <CandidateLayout>
      <div className="w-full max-w-none">
        <div className="mx-auto">
          {/* Page Header */}
          <div className="mb-3">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Offers</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 hidden sm:block">View all job offers you have received</p>
          </div>

          {/* Filters and Sort Controls */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {/* Offer Status Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  <Filter className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Offer Status
                </label>
                <select
                  value={offerStatus || ''}
                  onChange={(e) => {
                    setOfferStatus(e.target.value || null);
                    setPage(1); // Reset to page 1 when filter changes
                  }}
                  className="w-full px-2 py-2 sm:px-3 sm:py-2.5 bg-white border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none cursor-pointer transition-all duration-200 text-xs sm:text-sm font-medium text-gray-700"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                  <option value="withdrawn">Withdrawn</option>
                  <option value="expired">Expired</option>
                  <option value="pending_response">Pending Response</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  <ArrowUpDown className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Sort By
                </label>
                <select
                  value={sortBy || ''}
                  onChange={(e) => {
                    setSortBy(e.target.value || null);
                    setPage(1); // Reset to page 1 when sort changes
                  }}
                  className="w-full px-2 py-2 sm:px-3 sm:py-2.5 bg-white border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none cursor-pointer transition-all duration-200 text-xs sm:text-sm font-medium text-gray-700"
                >
                  <option value="">Default</option>
                  <option value="offered_at">Offered Date</option>
                  <option value="start_date">Start Date</option>
                  <option value="offer_deadline">Deadline</option>
                  <option value="offered_salary">Salary</option>
                  <option value="offer_status">Status</option>
                </select>
              </div>

              {/* Sort Direction */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Sort Direction</label>
                <select
                  value={sortDirection || ''}
                  onChange={(e) => {
                    setSortDirection(e.target.value || null);
                    setPage(1); // Reset to page 1 when sort direction changes
                  }}
                  className="w-full px-2 py-2 sm:px-3 sm:py-2.5 bg-white border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none cursor-pointer transition-all duration-200 text-xs sm:text-sm font-medium text-gray-700"
                >
                  <option value="">Default</option>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>

              {/* Reset Filters */}
              <div className="sm:col-span-2 lg:col-span-1 flex items-end">
                <button
                  onClick={() => {
                    setPage(null);
                    setOfferStatus(null);
                    setSortBy(null);
                    setSortDirection(null);
                  }}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
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
                <p className="text-xs sm:text-sm text-gray-500 font-medium">Loading offers...</p>
              </div>
            ) : offers.length === 0 ? (
              <div className="p-8 sm:p-12 text-center">
                <Briefcase className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-gray-300 mb-2 sm:mb-3" />
                <p className="text-xs sm:text-sm text-gray-500 font-medium">No offers found</p>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-1 hidden sm:block">You haven't received any job offers yet</p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-left text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Job Details</th>
                        <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-left text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Offer Details</th>
                        <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-left text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                        <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-left text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Dates</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {offers.map((offer) => (
                        <tr key={offer.offer_id || offer.id} className="hover:bg-gray-50 transition-colors duration-150">
                          {/* Job Details */}
                          <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 align-top">
                            <div>
                              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                                <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                                <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{offer.job_title || 'N/A'}</div>
                              </div>
                              <div className="text-[10px] sm:text-xs text-gray-600 mb-2 sm:mb-3 leading-relaxed line-clamp-3">{offer.job_description || 'N/A'}</div>
                              {offer.location && (
                                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1.5 sm:mb-2">
                                  <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                                  <span className="truncate">{offer.location}</span>
                                </div>
                              )}
                              {offer.benefits && offer.benefits.length > 0 && (
                                <div className="mt-2 sm:mt-3">
                                  <div className="text-[10px] sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2">Benefits:</div>
                                  <div className="flex flex-wrap gap-1">
                                    {offer.benefits.map((benefit, idx) => (
                                      <span key={idx} className="text-[10px] sm:text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md font-medium border border-blue-100">
                                        {benefit}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Offer Details */}
                          <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 align-top">
                            <div>
                              {offer.offered_salary && (
                                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                                  <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                                  <span className="text-xs sm:text-sm font-bold text-gray-900">{formatCurrency(offer.offered_salary)}</span>
                                </div>
                              )}
                              {offer.offer_notes && (
                                <div className="text-[10px] sm:text-xs text-gray-600 mb-2 sm:mb-3">
                                  <div className="font-semibold text-gray-700 mb-0.5 sm:mb-1">Notes:</div>
                                  <div className="leading-relaxed line-clamp-3">{offer.offer_notes}</div>
                                </div>
                              )}
                              {offer.decline_reason && (
                                <div className="text-[10px] sm:text-xs text-red-700 mb-2 sm:mb-3">
                                  <div className="font-semibold mb-0.5 sm:mb-1">Decline Reason:</div>
                                  <div className="leading-relaxed line-clamp-2">{offer.decline_reason}</div>
                                </div>
                              )}
                              {offer.is_expired !== undefined && (
                                <div className={`text-[10px] sm:text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md inline-block ${offer.is_expired ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                                  {offer.is_expired ? 'Expired' : 'Active'}
                                </div>
                              )}
                              {offer.offered_by && (
                                <div className="text-[10px] sm:text-xs text-gray-500 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
                                  <div className="font-semibold text-gray-700 mb-0.5 sm:mb-1">Offered by:</div>
                                  <div className="truncate">{offer.offered_by.name}</div>
                                  <div className="text-gray-500 truncate">{offer.offered_by.email}</div>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 align-top">
                            <div>
                              <div className="mb-2 sm:mb-3">{getStatusBadge(offer.offer_status)}</div>
                            </div>
                          </td>

                          {/* Dates */}
                          <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 align-top">
                            <div className="text-[10px] sm:text-xs space-y-1.5 sm:space-y-2">
                              {offer.offered_at && (
                                <div className="pb-1.5 sm:pb-2 border-b border-gray-100">
                                  <div className="font-semibold text-gray-700 mb-0.5 sm:mb-1">Offered:</div>
                                  <div className="text-gray-600 truncate">{formatDateTime(offer.offered_at)}</div>
                                </div>
                              )}
                              {offer.start_date && (
                                <div>
                                  <div className="font-semibold text-gray-700 mb-0.5 sm:mb-1">Start Date:</div>
                                  <div className="text-gray-600 truncate">{formatDate(offer.start_date)}</div>
                                </div>
                              )}
                              {offer.offer_deadline && (
                                <div className="pt-1.5 sm:pt-2 border-t border-gray-100">
                                  <div className="font-semibold text-gray-700 mb-0.5 sm:mb-1">Deadline:</div>
                                  <div className="text-gray-600 truncate">{formatDate(offer.offer_deadline)}</div>
                                </div>
                              )}
                              {offer.responded_at && (
                                <div className="pt-1.5 sm:pt-2">
                                  <div className="font-semibold text-gray-700 mb-0.5 sm:mb-1">Responded:</div>
                                  <div className="text-gray-600 truncate">{formatDateTime(offer.responded_at)}</div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile/Tablet Card View */}
                <div className="lg:hidden divide-y divide-gray-200">
                  {offers.map((offer) => (
                    <div key={offer.offer_id || offer.id} className="p-3 sm:p-4 lg:p-5 hover:bg-gray-50 transition-colors duration-150">
                      {/* Status Badge */}
                      <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-1.5 sm:mb-2 gap-2">
                          <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{offer.job_title || 'N/A'}</div>
                          <div className="flex-shrink-0">{getStatusBadge(offer.offer_status)}</div>
                        </div>
                      </div>

                      {/* Job Details Card */}
                      <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                          <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                          <div className="text-xs sm:text-sm font-semibold text-gray-900">Job Details</div>
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-600 mb-1.5 sm:mb-2 leading-relaxed line-clamp-2">{offer.job_description || 'N/A'}</div>
                        {offer.location && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2 sm:mb-3">
                            <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                            <span className="truncate">{offer.location}</span>
                          </div>
                        )}
                        {offer.benefits && offer.benefits.length > 0 && (
                          <div>
                            <div className="text-[10px] sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2">Benefits:</div>
                            <div className="flex flex-wrap gap-1">
                              {offer.benefits.map((benefit, idx) => (
                                <span key={idx} className="text-[10px] sm:text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md font-medium border border-blue-100">
                                  {benefit}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Offer Details Card */}
                      <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200">
                        {offer.offered_salary && (
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                            <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-bold text-gray-900">{formatCurrency(offer.offered_salary)}</span>
                          </div>
                        )}
                        {offer.offer_notes && (
                          <div className="text-[10px] sm:text-xs text-gray-600 mb-1.5 sm:mb-2">
                            <div className="font-semibold text-gray-700 mb-0.5 sm:mb-1">Notes:</div>
                            <div className="leading-relaxed line-clamp-2">{offer.offer_notes}</div>
                          </div>
                        )}
                        {offer.decline_reason && (
                          <div className="text-[10px] sm:text-xs text-red-700 mb-1.5 sm:mb-2">
                            <div className="font-semibold mb-0.5 sm:mb-1">Decline Reason:</div>
                            <div className="leading-relaxed line-clamp-2">{offer.decline_reason}</div>
                          </div>
                        )}
                        {offer.is_expired !== undefined && (
                          <div className={`text-[10px] sm:text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md inline-block ${offer.is_expired ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                            {offer.is_expired ? 'Expired' : 'Active'}
                          </div>
                        )}
                        {offer.offered_by && (
                          <div className="text-[10px] sm:text-xs text-gray-500 mt-2 sm:mt-3">
                            <div className="font-semibold text-gray-700 mb-0.5 sm:mb-1">Offered by:</div>
                            <div className="truncate">{offer.offered_by.name}</div>
                            <div className="text-gray-500 truncate">{offer.offered_by.email}</div>
                          </div>
                        )}
                      </div>

                      {/* Dates Card */}
                      <div>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 text-[10px] sm:text-xs">
                          {offer.offered_at && (
                            <div>
                              <div className="font-semibold text-gray-700 mb-0.5 sm:mb-1">Offered:</div>
                              <div className="text-gray-600 truncate">{formatDateTime(offer.offered_at)}</div>
                            </div>
                          )}
                          {offer.start_date && (
                            <div>
                              <div className="font-semibold text-gray-700 mb-0.5 sm:mb-1">Start Date:</div>
                              <div className="text-gray-600 truncate">{formatDate(offer.start_date)}</div>
                            </div>
                          )}
                          {offer.offer_deadline && (
                            <div>
                              <div className="font-semibold text-gray-700 mb-0.5 sm:mb-1">Deadline:</div>
                              <div className="text-gray-600 truncate">{formatDate(offer.offer_deadline)}</div>
                            </div>
                          )}
                          {offer.responded_at && (
                            <div>
                              <div className="font-semibold text-gray-700 mb-0.5 sm:mb-1">Responded:</div>
                              <div className="text-gray-600 truncate">{formatDateTime(offer.responded_at)}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Pagination Controls - Only show when there's data */}
            {pagination && pagination.total_pages > 1 && offers.length > 0 && (
              <div className="bg-gray-50 border-t border-gray-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
                  <div className="text-xs sm:text-sm text-gray-700">
                    <span className="font-medium">
                      Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
                      {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{' '}
                      {pagination.total} offers
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={() => setPage(pagination.current_page - 1)}
                      disabled={pagination.current_page <= 1}
                      className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-1"
                    >
                      <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Previous</span>
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                        let pageNum;
                        if (pagination.total_pages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.current_page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.current_page >= pagination.total_pages - 2) {
                          pageNum = pagination.total_pages - 4 + i;
                        } else {
                          pageNum = pagination.current_page - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-200 ${
                              pagination.current_page === pageNum
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setPage(pagination.current_page + 1)}
                      disabled={pagination.current_page >= pagination.total_pages || offers.length === 0}
                      className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-1"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Simple Page Input (if no pagination info but user wants to paginate) */}
            {(!pagination || pagination.total_pages <= 1) && offers.length > 0 && (
              <div className="bg-gray-50 border-t border-gray-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
                  <div className="text-xs sm:text-sm text-gray-700">
                    <span className="font-medium">
                      {offers.length} {offers.length === 1 ? 'offer' : 'offers'} shown
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-xs sm:text-sm text-gray-700 font-medium">Page:</label>
                    <input
                      type="number"
                      min="1"
                      value={page || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPage(value ? parseInt(value) : null);
                      }}
                      placeholder="1"
                      className="w-16 sm:w-20 px-2 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      onClick={() => {
                        if (page && page > 1) {
                          setPage(page - 1);
                        }
                      }}
                      disabled={!page || page <= 1 || offers.length === 0}
                      className="px-2 py-1.5 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-1"
                    >
                      <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                    <button
                      onClick={() => {
                        // Only go to next page if current page has data
                        if (offers.length > 0) {
                          setPage((page || 1) + 1);
                        }
                      }}
                      disabled={offers.length === 0}
                      className="px-2 py-1.5 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-1"
                    >
                      <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CandidateLayout>
  );
};

export default CandidateOffers;

