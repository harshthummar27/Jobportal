import React, { useState, useEffect, useCallback } from "react";
import { 
  Mail, 
  User,
  Building,
  MessageSquare,
  Calendar,
  Loader2,
  AlertCircle,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Trash2,
  CheckSquare
} from "lucide-react";
import { toast } from 'react-toastify';

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [viewingInquiry, setViewingInquiry] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInquiries, setSelectedInquiries] = useState([]);
  const [deletingInquiry, setDeletingInquiry] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(25);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);

  // Fetch inquiries from API
  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError("");

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: perPage.toString(),
      });

      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/contact-messages?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.message || data.error || `HTTP error! status: ${response.status}`;
        throw new Error(errorMsg);
      }

      if (data.success && data.data) {
        setInquiries(data.data);
        if (data.meta) {
          setTotal(data.meta.total || 0);
          setLastPage(data.meta.last_page || 1);
          setFrom(data.meta.from || 0);
          setTo(data.meta.to || 0);
          setCurrentPage(data.meta.current_page || 1);
        }
      } else if (Array.isArray(data)) {
        // Handle case where API returns array directly
        setInquiries(data);
        setTotal(data.length);
        setLastPage(1);
        setFrom(1);
        setTo(data.length);
      } else {
        const errorMsg = data.message || 'Failed to fetch inquiries';
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      const errorMessage = error.message || 'Failed to fetch inquiries';
      setFetchError(errorMessage);
      setInquiries([]);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, searchTerm]);

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedInquiries([]);
  };

  // Handle select inquiry
  const handleSelectInquiry = (inquiryId) => {
    setSelectedInquiries(prev => 
      prev.includes(inquiryId) 
        ? prev.filter(id => id !== inquiryId)
        : [...prev, inquiryId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedInquiries.length === inquiries.length) {
      setSelectedInquiries([]);
    } else {
      setSelectedInquiries(inquiries.map(i => i.id));
    }
  };

  // Extract error message from API response
  const extractErrorMessage = (error, responseData) => {
    if (responseData?.message) {
      return responseData.message;
    }
    if (responseData?.error) {
      return responseData.error;
    }
    if (typeof responseData === 'string') {
      return responseData;
    }
    if (responseData?.errors) {
      const errors = responseData.errors;
      const errorMessages = Object.entries(errors).map(([field, messages]) => {
        if (Array.isArray(messages)) {
          return `${field}: ${messages.join(', ')}`;
        }
        return `${field}: ${messages}`;
      });
      return errorMessages.join('\n');
    }
    return error.message || 'An error occurred. Please try again.';
  };

  // Handle delete inquiry
  const handleDelete = (inquiry) => {
    setDeletingInquiry(inquiry);
    setShowDeleteModal(true);
  };

  // Confirm delete single inquiry
  const confirmDelete = async () => {
    if (!deletingInquiry) return;

    setIsDeleting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/contact-messages/${deletingInquiry.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMsg = extractErrorMessage(new Error(result.message || 'Failed to delete inquiry'), result);
        throw new Error(errorMsg);
      }

      toast.success(result.message || 'Inquiry deleted successfully!');
      setShowDeleteModal(false);
      setDeletingInquiry(null);
      
      // Refetch data after delete
      fetchInquiries();
    } catch (error) {
      console.error('Delete error:', error);
      const errorMsg = error.message || 'Failed to delete inquiry. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedInquiries.length === 0) return;
    setShowBulkDeleteModal(true);
  };

  // Confirm bulk delete
  const confirmBulkDelete = async () => {
    if (selectedInquiries.length === 0) return;
    
    setIsDeleting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/contact-messages/bulk-delete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: selectedInquiries
        })
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMsg = extractErrorMessage(new Error(result.message || 'Failed to delete inquiries'), result);
        throw new Error(errorMsg);
      }

      toast.success(result.message || `${selectedInquiries.length} inquiry(ies) deleted successfully!`);
      setSelectedInquiries([]);
      setShowBulkDeleteModal(false);
      
      // Refetch data after bulk delete
      fetchInquiries();
    } catch (error) {
      console.error('Bulk delete error:', error);
      const errorMsg = error.message || 'Failed to delete inquiries. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchInquiries();
  };

  // Handle view inquiry
  const handleView = (inquiry) => {
    setViewingInquiry(inquiry);
    setShowViewModal(true);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="w-full max-w-none space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Contact Inquiries</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">View and manage all contact form submissions</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-5">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, subject, or message..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm sm:text-base"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* Error Message */}
      {fetchError && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-semibold text-sm sm:text-base mb-1">Error Loading Data</h3>
              <p className="text-red-700 text-xs sm:text-sm">{fetchError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedInquiries.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl shadow-lg border border-indigo-600 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <CheckSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm sm:text-base">
                  {selectedInquiries.length} inquiry{selectedInquiries.length > 1 ? 'ies' : 'y'} selected
                </p>
                <p className="text-indigo-100 text-xs sm:text-sm">Choose an action to perform</p>
              </div>
            </div>
            <button
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Selected</span>
            </button>
          </div>
        </div>
      )}

      {/* Inquiries Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Mobile Card View */}
        <div className="sm:hidden">
          {loading ? (
            <div className="divide-y divide-gray-100">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="p-4 bg-white">
                  {/* Header Skeleton */}
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                        animationDelay: `${idx * 0.1}s`,
                      }}
                    ></div>
                    <div 
                      className="w-10 h-10 rounded-lg"
                      style={{
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                        animationDelay: `${idx * 0.1 + 0.05}s`,
                      }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <div 
                        className="h-4 rounded mb-1"
                        style={{
                          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 1.5s infinite',
                          animationDelay: `${idx * 0.1 + 0.1}s`,
                        }}
                      ></div>
                      <div 
                        className="h-3 rounded w-32"
                        style={{
                          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 1.5s infinite',
                          animationDelay: `${idx * 0.1 + 0.15}s`,
                        }}
                      ></div>
                    </div>
                  </div>
                  {/* Data Fields Skeleton */}
                  <div className="grid grid-cols-1 gap-3 mb-4">
                    {[...Array(4)].map((_, fieldIdx) => (
                      <div key={fieldIdx} className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                        <div 
                          className="h-3 rounded w-20 mb-1"
                          style={{
                            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 1.5s infinite',
                            animationDelay: `${idx * 0.1 + fieldIdx * 0.05}s`,
                          }}
                        ></div>
                        <div 
                          className="h-3 rounded"
                          style={{
                            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 1.5s infinite',
                            animationDelay: `${idx * 0.1 + fieldIdx * 0.05 + 0.05}s`,
                          }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  {/* Action Buttons Skeleton */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                    {[...Array(2)].map((_, btnIdx) => (
                      <div 
                        key={btnIdx}
                        className="flex-1 h-8 rounded-lg"
                        style={{
                          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 1.5s infinite',
                          animationDelay: `${idx * 0.1 + btnIdx * 0.05}s`,
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : inquiries.length === 0 ? (
            <div className="px-2 py-6 text-center">
              <Mail className="mx-auto h-6 w-6 text-gray-400" />
              <h3 className="mt-1.5 text-[10px] font-medium text-gray-900">No inquiries found</h3>
              <p className="mt-0.5 text-[9px] text-gray-500">
                {searchTerm ? "Try adjusting your search terms." : "No contact inquiries have been submitted yet."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="p-4 bg-white hover:bg-gray-50 transition-colors duration-200">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="checkbox"
                      checked={selectedInquiries.includes(inquiry.id)}
                      onChange={() => handleSelectInquiry(inquiry.id)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 flex-shrink-0"
                    />
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">{inquiry.name || "N/A"}</div>
                      <div className="text-xs text-gray-500 truncate">{inquiry.email || "N/A"}</div>
                    </div>
                  </div>

                  {/* Data Fields */}
                  <div className="grid grid-cols-1 gap-3 mb-4">
                    {inquiry.company && (
                      <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                        <span className="text-xs font-medium text-gray-600 block mb-1">Company</span>
                        <div className="text-xs text-gray-900">{inquiry.company}</div>
                      </div>
                    )}
                    <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                      <span className="text-xs font-medium text-gray-600 block mb-1">Subject</span>
                      <div className="text-xs text-gray-900 break-words">{inquiry.subject || "N/A"}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                      <span className="text-xs font-medium text-gray-600 block mb-1">Message</span>
                      <div className="text-xs text-gray-900 break-words line-clamp-2">
                        {inquiry.message || "N/A"}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                      <span className="text-xs font-medium text-gray-600 block mb-1">Date</span>
                      <div className="text-xs text-gray-900">{formatDate(inquiry.created_at)}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleView(inquiry)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(inquiry)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedInquiries.length === inquiries.length && inquiries.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span>Contact Info</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Message Preview
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <>
                  {[...Array(8)].map((_, rowIdx) => (
                    <tr key={rowIdx}>
                      {[...Array(5)].map((_, colIdx) => (
                        <td key={colIdx} className="px-4 py-3">
                          <div 
                            className={`h-4 rounded ${
                              colIdx === 0 ? 'w-40' : 
                              colIdx === 1 ? 'w-48' : 
                              colIdx === 2 ? 'w-64' : 
                              colIdx === 3 ? 'w-32' : 
                              'w-24'
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
                </>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-2 py-6 sm:py-8 text-center">
                    <Mail className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                    <h3 className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-medium text-gray-900">No inquiries found</h3>
                    <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] text-gray-500">
                      {searchTerm ? "Try adjusting your search terms." : "No contact inquiries have been submitted yet."}
                    </p>
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-indigo-50/50 transition-colors duration-200 border-b border-gray-100">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedInquiries.includes(inquiry.id)}
                          onChange={() => handleSelectInquiry(inquiry.id)}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                          <Mail className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-900 truncate">{inquiry.name || "N/A"}</div>
                          <div className="text-xs text-gray-500 truncate">{inquiry.email || "N/A"}</div>
                          {inquiry.company && (
                            <div className="text-xs text-gray-400 truncate mt-0.5">
                              <Building className="h-3 w-3 inline mr-1" />
                              {inquiry.company}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 font-medium truncate max-w-xs">
                        {inquiry.subject || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600 truncate max-w-md">
                        {inquiry.message || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600">
                        {formatDate(inquiry.created_at)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(inquiry)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(inquiry)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!loading && total > 0 && (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-t-2 border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-700 text-center sm:text-left order-2 sm:order-1">
              <span className="font-medium">Showing <span className="text-indigo-600 font-semibold">{from}</span> to <span className="text-indigo-600 font-semibold">{to}</span> of <span className="text-indigo-600 font-semibold">{total}</span> results</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end order-1 sm:order-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex-1 sm:flex-initial min-w-[100px] sm:min-w-0"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(lastPage, 5) }, (_, i) => {
                  let pageNum;
                  if (lastPage <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= lastPage - 2) {
                    pageNum = lastPage - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1.5 text-sm border rounded-lg font-medium transition-all duration-200 ${
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-600 shadow-md"
                          : "border-gray-300 hover:bg-white hover:shadow-sm text-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex-1 sm:flex-initial min-w-[100px] sm:min-w-0"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && viewingInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-2 sm:p-3 md:p-4">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-2xl w-full max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between p-2 sm:p-3 lg:p-4 border-b border-gray-200">
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 flex items-center gap-1.5 sm:gap-2">
                <Mail className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-indigo-600" />
                Inquiry Details
              </h3>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setViewingInquiry(null);
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors duration-200 p-0.5 sm:p-1 hover:bg-gray-100 rounded-full"
                aria-label="Close modal"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
            
            <div className="p-2 sm:p-3 lg:p-4 space-y-3 sm:space-y-4 lg:space-y-6">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 lg:gap-4 pb-3 sm:pb-4 lg:pb-5 border-b border-gray-200">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-0.5 sm:mb-1">{viewingInquiry.name || "N/A"}</h4>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500">{viewingInquiry.email || "N/A"}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                <div className="bg-gray-50 rounded-md p-2 sm:p-3 lg:p-4 border border-gray-200 hover:shadow-sm transition-shadow duration-200">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-md flex items-center justify-center">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                    </div>
                    <span className="text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-700">Email Address</span>
                  </div>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-gray-900 font-medium break-words">{viewingInquiry.email || "N/A"}</p>
                </div>

                {viewingInquiry.company && (
                  <div className="bg-gray-50 rounded-md p-2 sm:p-3 lg:p-4 border border-gray-200 hover:shadow-sm transition-shadow duration-200">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-md flex items-center justify-center">
                        <Building className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                      </div>
                      <span className="text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-700">Company</span>
                    </div>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-gray-900 font-medium">{viewingInquiry.company}</p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-md p-2 sm:p-3 lg:p-4 border border-gray-200 hover:shadow-sm transition-shadow duration-200 sm:col-span-2">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-md flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                    </div>
                    <span className="text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-700">Subject</span>
                  </div>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-gray-900 font-medium">{viewingInquiry.subject || "N/A"}</p>
                </div>

                <div className="bg-gray-50 rounded-md p-2 sm:p-3 lg:p-4 border border-gray-200 hover:shadow-sm transition-shadow duration-200 sm:col-span-2">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-md flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    </div>
                    <span className="text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-700">Message</span>
                  </div>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-gray-900 font-medium whitespace-pre-wrap break-words">
                    {viewingInquiry.message || "N/A"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-md p-2 sm:p-3 lg:p-4 border border-gray-200 hover:shadow-sm transition-shadow duration-200">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-md flex items-center justify-center">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    </div>
                    <span className="text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-700">Submitted At</span>
                  </div>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-gray-900 font-medium">
                    {formatDate(viewingInquiry.created_at)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-2 sm:p-3 lg:p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setViewingInquiry(null);
                }}
                className="w-full sm:w-auto px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm font-medium text-[10px] sm:text-xs lg:text-sm"
              >
                Close
              </button>
              {viewingInquiry.email && (
                <a
                  href={`mailto:${viewingInquiry.email}?subject=Re: ${encodeURIComponent(viewingInquiry.subject || 'Inquiry')}`}
                  className="w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 bg-indigo-600 text-white rounded-md border border-indigo-700 hover:bg-indigo-700 transition-all duration-200 shadow-sm font-medium text-[10px] sm:text-xs lg:text-sm"
                >
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                  Reply via Email
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-2 sm:p-3 md:p-4">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-md w-full">
            <div className="p-3 sm:p-4 lg:p-5">
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-3 sm:mb-4 bg-red-100 rounded-full">
                <AlertCircle className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-red-600" />
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 text-center mb-1.5 sm:mb-2">
                Delete Inquiry?
              </h3>
              <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 text-center mb-3 sm:mb-4 lg:mb-6">
                Are you sure you want to delete the inquiry from <span className="font-semibold text-gray-900">{deletingInquiry.name}</span>? This action cannot be undone.
              </p>
              <div className="bg-gray-50 rounded-md p-2 sm:p-3 lg:p-4 mb-3 sm:mb-4 lg:mb-6">
                <p className="text-[9px] sm:text-[10px] lg:text-xs text-gray-600 text-center">
                  <span className="font-medium">Email:</span> {deletingInquiry.email}
                </p>
                {deletingInquiry.subject && (
                  <p className="text-[9px] sm:text-[10px] lg:text-xs text-gray-600 text-center mt-1">
                    <span className="font-medium">Subject:</span> {deletingInquiry.subject}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-2 sm:p-3 lg:p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingInquiry(null);
                }}
                className="w-full sm:w-auto px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm font-medium text-[10px] sm:text-xs lg:text-sm"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 bg-red-600 text-white rounded-md border border-red-700 hover:bg-red-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-medium text-[10px] sm:text-xs lg:text-sm"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                    <span>Delete Inquiry</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteModal && selectedInquiries.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-2 sm:p-3 md:p-4">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-md w-full">
            <div className="p-3 sm:p-4 lg:p-5">
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-3 sm:mb-4 bg-red-100 rounded-full">
                <AlertCircle className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-red-600" />
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 text-center mb-1.5 sm:mb-2">
                Delete Inquiries?
              </h3>
              <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 text-center mb-3 sm:mb-4 lg:mb-6">
                Are you sure you want to delete <span className="font-semibold text-gray-900">{selectedInquiries.length}</span> inquiry(ies)? This action cannot be undone.
              </p>
              <div className="bg-gray-50 rounded-md p-2 sm:p-3 lg:p-4 mb-3 sm:mb-4 lg:mb-6">
                <p className="text-[9px] sm:text-[10px] lg:text-xs text-gray-600 text-center">
                  <span className="font-medium">Selected Inquiries:</span> {selectedInquiries.length} inquiry(ies)
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-2 sm:p-3 lg:p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowBulkDeleteModal(false);
                }}
                className="w-full sm:w-auto px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm font-medium text-[10px] sm:text-xs lg:text-sm"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmBulkDelete}
                className="w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 bg-red-600 text-white rounded-md border border-red-700 hover:bg-red-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-medium text-[10px] sm:text-xs lg:text-sm"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                    <span>Delete Inquiries</span>
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

export default Inquiries;

