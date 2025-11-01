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

      // Static pagination params
      const params = new URLSearchParams({
        page: '1',
        per_page: '25'
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

      setOffers(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error('Error fetching offered candidates:', error);
      setError(error.message || 'Failed to fetch offered candidates');
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfferedCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortDirection, offerStatus]);

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
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(parseFloat(amount));
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
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-left text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Candidate</th>
                        <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-left text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Job Details</th>
                        <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-left text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Offer Details</th>
                        <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-left text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                        <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-left text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Dates</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {offers.map((offer) => (
                        <tr key={offer.offer_id} className="hover:bg-gray-50 transition-colors duration-150">
                          {/* Candidate Info */}
                          <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 align-top">
                            <div className="flex items-start gap-2 sm:gap-3">
                              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-indigo-100">
                                <User className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-[10px] sm:text-xs font-semibold text-gray-900 mb-0.5 sm:mb-1 truncate">{offer.candidate?.name || 'N/A'}</div>
                                <div className="text-[10px] sm:text-xs text-gray-500 font-medium mb-0.5 sm:mb-1 truncate">{offer.candidate?.candidate_code || 'N/A'}</div>
                                <div className="text-[10px] sm:text-xs text-gray-600 truncate mb-0.5 sm:mb-1">{offer.candidate?.email || 'N/A'}</div>
                                <div className="text-[10px] sm:text-xs text-gray-600 mb-0.5 sm:mb-1 truncate">{offer.candidate?.mobile_number || 'N/A'}</div>
                                {offer.candidate?.city && offer.candidate?.state && (
                                  <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1 truncate">{offer.candidate.city}, {offer.candidate.state}</div>
                                )}
                                {offer.candidate?.total_years_experience !== null && (
                                  <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">{offer.candidate.total_years_experience} years exp.</div>
                                )}
                                {offer.candidate?.visa_status && (
                                  <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1 truncate">Visa: {offer.candidate.visa_status}</div>
                                )}
                                {offer.candidate?.candidate_score !== null && (
                                  <div className="text-[10px] sm:text-xs text-gray-500 truncate">Score: {offer.candidate.candidate_score}</div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Job Details */}
                          <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 align-top">
                            <div>
                              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                                <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                                <div className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">{offer.job_title || 'N/A'}</div>
                              </div>
                              <div className="text-[10px] sm:text-xs text-gray-600 mb-2 sm:mb-3 leading-relaxed line-clamp-3">{offer.job_description || 'N/A'}</div>
                              {offer.location && (
                                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1.5 sm:mb-2">
                                  <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                                  <span className="text-[10px] sm:text-xs truncate">{offer.location}</span>
                                </div>
                              )}
                              {offer.benefits && offer.benefits.length > 0 && (
                                <div className="mt-2 sm:mt-3">
                                  <div className="text-[10px] sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2">Benefits:</div>
                                  <div className="flex flex-wrap gap-1 sm:gap-1.5">
                                    {offer.benefits.map((benefit, idx) => (
                                      <span key={idx} className="text-[10px] sm:text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md font-medium border border-blue-100 truncate">
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
                            <div className="space-y-2 sm:space-y-3">
                              {offer.offered_salary && (
                                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                                  <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                                  <span className="text-[10px] sm:text-xs font-bold text-gray-900 truncate">{formatCurrency(offer.offered_salary)}</span>
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
                              {offer.candidate_status && (
                                <div className="pt-2 sm:pt-3 border-t border-gray-100">
                                  <div className="text-[10px] sm:text-xs font-semibold text-gray-700 mb-0.5 sm:mb-1">Candidate Status:</div>
                                  <div className="text-[10px] sm:text-xs font-semibold text-gray-900 mb-0.5 sm:mb-1 truncate">{offer.candidate_status.status_display || offer.candidate_status.status || 'N/A'}</div>
                                  {offer.candidate_status.notes && (
                                    <div className="text-[10px] sm:text-xs text-gray-500 mt-1.5 sm:mt-2 leading-relaxed line-clamp-2">{offer.candidate_status.notes}</div>
                                  )}
                                  {offer.candidate_status.status_date && (
                                    <div className="text-[10px] sm:text-xs text-gray-500 mt-1.5 sm:mt-2">{formatDateTime(offer.candidate_status.status_date)}</div>
                                  )}
                                </div>
                              )}
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
                              {offer.selection_id && (
                                <div className="text-gray-400 mt-2 sm:mt-3 pt-1.5 sm:pt-2 border-t border-gray-100 truncate">ID: {offer.selection_id}</div>
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
                    <div key={offer.offer_id} className="p-3 sm:p-4 lg:p-5 hover:bg-gray-50 transition-colors duration-150">
                      {/* Candidate Info Card */}
                      <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200">
                        <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-indigo-100">
                            <User className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[10px] sm:text-xs font-semibold text-gray-900 mb-0.5 sm:mb-1 truncate">{offer.candidate?.name || 'N/A'}</div>
                            <div className="text-[10px] sm:text-xs text-gray-500 font-medium mb-0.5 sm:mb-1 truncate">{offer.candidate?.candidate_code || 'N/A'}</div>
                            <div className="text-[10px] sm:text-xs text-gray-600 truncate">{offer.candidate?.email || 'N/A'}</div>
                            <div className="text-[10px] sm:text-xs text-gray-600 truncate">{offer.candidate?.mobile_number || 'N/A'}</div>
                          </div>
                          <div>{getStatusBadge(offer.offer_status)}</div>
                        </div>
                        {offer.candidate?.city && offer.candidate?.state && (
                          <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1 truncate">{offer.candidate.city}, {offer.candidate.state}</div>
                        )}
                        {offer.candidate?.total_years_experience !== null && (
                          <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">{offer.candidate.total_years_experience} years exp.</div>
                        )}
                        {offer.candidate?.visa_status && (
                          <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1 truncate">Visa: {offer.candidate.visa_status}</div>
                        )}
                        {offer.candidate?.candidate_score !== null && (
                          <div className="text-[10px] sm:text-xs text-gray-500 truncate">Score: {offer.candidate.candidate_score}</div>
                        )}
                      </div>

                      {/* Job Details Card */}
                      <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                          <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                          <div className="text-[10px] sm:text-xs font-semibold text-gray-900 truncate">{offer.job_title || 'N/A'}</div>
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-600 mb-1.5 sm:mb-2 leading-relaxed line-clamp-2">{offer.job_description || 'N/A'}</div>
                        {offer.location && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2 sm:mb-3">
                            <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                            <span className="text-[10px] sm:text-xs truncate">{offer.location}</span>
                          </div>
                        )}
                        {offer.benefits && offer.benefits.length > 0 && (
                          <div>
                            <div className="text-[10px] sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2">Benefits:</div>
                            <div className="flex flex-wrap gap-1 sm:gap-1.5">
                              {offer.benefits.map((benefit, idx) => (
                                <span key={idx} className="text-[10px] sm:text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md font-medium border border-blue-100 truncate">
                                  {benefit}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Offer Details Card */}
                      <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200">
                        <div className="space-y-2 sm:space-y-3">
                          {offer.offered_salary && (
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                              <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                              <span className="text-[10px] sm:text-xs font-bold text-gray-900 truncate">{formatCurrency(offer.offered_salary)}</span>
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
                      </div>

                      {/* Status & Dates Card */}
                      <div>
                        {offer.candidate_status && (
                          <div className="mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-gray-200">
                            <div className="text-[10px] sm:text-xs font-semibold text-gray-700 mb-0.5 sm:mb-1">Candidate Status:</div>
                            <div className="text-[10px] sm:text-xs font-semibold text-gray-900 mb-0.5 sm:mb-1 truncate">{offer.candidate_status.status_display || offer.candidate_status.status || 'N/A'}</div>
                            {offer.candidate_status.notes && (
                              <div className="text-[10px] sm:text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{offer.candidate_status.notes}</div>
                            )}
                            {offer.candidate_status.status_date && (
                              <div className="text-[10px] sm:text-xs text-gray-500 mt-1">{formatDateTime(offer.candidate_status.status_date)}</div>
                            )}
                          </div>
                        )}
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
                        {offer.selection_id && (
                          <div className="text-[10px] sm:text-xs text-gray-400 mt-2 sm:mt-3 pt-1.5 sm:pt-2 border-t border-gray-100 truncate">Selection ID: {offer.selection_id}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default OfferedCandidates;


