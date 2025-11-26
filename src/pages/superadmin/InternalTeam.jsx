import React, { useState, useEffect, useCallback } from "react";
import { 
  Shield, 
  Edit, 
  Trash2, 
  Eye, 
  Plus,
  User,
  UserCheck,
  XCircle,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from 'react-toastify';

const InternalTeam = () => {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [deletingMember, setDeletingMember] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewingMember, setViewingMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(25);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);

  // Sorting state
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
    mobile_number: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  // Fetch staff members from API
  const fetchStaffMembers = useCallback(async () => {
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
        sort_by: sortBy,
        sort_direction: sortDirection
      });

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/staff?${params}`, {
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
        setTeamMembers(data.data);
        if (data.meta) {
          setTotal(data.meta.total);
          setLastPage(data.meta.last_page);
          setFrom(data.meta.from || 0);
          setTo(data.meta.to || 0);
          setCurrentPage(data.meta.current_page);
        }
      } else {
        const errorMsg = data.message || 'Failed to fetch staff members';
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Error fetching staff members:', error);
      const errorMessage = error.message || 'Failed to fetch staff members';
      setFetchError(errorMessage);
      setTeamMembers([]);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy, sortDirection, perPage]);

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchStaffMembers();
  }, [fetchStaffMembers]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showAddModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddModal]);

  const handleSelectMember = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === teamMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(teamMembers.map(m => m.id));
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setNewMember({
      name: member.name,
      email: member.email,
      password: "",
      role: "staff",
      mobile_number: member.mobile_number || ""
    });
    setError("");
    setErrors({});
    setShowAddModal(true);
  };

  const handleDelete = (member) => {
    setDeletingMember(member);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingMember) return;

    setIsDeleting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/staff/delete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: deletingMember.id
        })
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMsg = extractErrorMessage(new Error(result.message || 'Failed to delete staff member'), result);
        throw new Error(errorMsg);
      }

      toast.success(result.message || 'Staff member deleted successfully!');
      setShowDeleteModal(false);
      setDeletingMember(null);
      
      // Refetch data after delete
      fetchStaffMembers();
    } catch (error) {
      console.error('Delete error:', error);
      const errorMsg = error.message || 'Failed to delete staff member. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleView = (member) => {
    setViewingMember(member);
    setShowViewModal(true);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedMembers([]);
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
    setSelectedMembers([]);
  };

  const handleBulkDelete = () => {
    if (selectedMembers.length === 0) return;
    setShowBulkDeleteModal(true);
  };

  const confirmBulkDelete = async () => {
    if (selectedMembers.length === 0) return;
    
    setIsDeleting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Delete each selected member
      const deletePromises = selectedMembers.map(async (memberId) => {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/staff/delete`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: memberId
          })
        });

        const result = await response.json();

        if (!response.ok) {
          const errorMsg = extractErrorMessage(new Error(result.message || 'Failed to delete staff member'), result);
          throw new Error(errorMsg);
        }

        return result;
      });

      await Promise.all(deletePromises);

      toast.success(`${selectedMembers.length} team member(s) deleted successfully!`);
      setSelectedMembers([]);
      setShowBulkDeleteModal(false);
      
      // Refetch data after bulk delete
      fetchStaffMembers();
    } catch (error) {
      console.error('Bulk delete error:', error);
      const errorMsg = error.message || 'Failed to delete team members. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddMember = () => {
    setNewMember({
      name: "",
      email: "",
      password: "",
      role: "staff",
      mobile_number: ""
    });
    setEditingMember(null);
    setError("");
    setErrors({});
    setShowAddModal(true);
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
      // Handle validation errors
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

  // Extract and set field-specific errors from backend response
  const extractFieldErrors = (responseData) => {
    const fieldErrors = {};
    
    if (responseData?.errors && typeof responseData.errors === 'object' && !Array.isArray(responseData.errors)) {
      // Handle validation errors object from backend
      Object.keys(responseData.errors).forEach((field) => {
        const fieldError = responseData.errors[field];
        // Handle array of errors for a field (take first one)
        if (Array.isArray(fieldError) && fieldError.length > 0) {
          fieldErrors[field] = fieldError[0];
        } else if (typeof fieldError === 'string') {
          fieldErrors[field] = fieldError;
        } else if (fieldError) {
          fieldErrors[field] = String(fieldError);
        }
      });
    }
    
    return fieldErrors;
  };

  const handleSaveMember = async () => {
    // Validate required fields
    const isEditMode = !!editingMember;
    
    if (!newMember.name || !newMember.email || !newMember.mobile_number) {
      const errorMsg = "Please fill in all required fields";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Password is only required for new members
    if (!isEditMode && !newMember.password) {
      const errorMsg = "Password is required for new members";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newMember.email)) {
      const errorMsg = "Please enter a valid email address";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Basic mobile number validation
    if (newMember.mobile_number.length < 10) {
      const errorMsg = "Please enter a valid mobile number";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setIsLoading(true);
    setError("");
    setErrors({});
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      let response;
      let result;

      if (isEditMode) {
        // Update existing staff member
        response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/staff/update`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: editingMember.id,
            name: newMember.name,
            email: newMember.email,
            mobile_number: newMember.mobile_number
          })
        });

        result = await response.json();

        if (!response.ok) {
          // Extract field-specific errors
          const fieldErrors = extractFieldErrors(result);
          if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            setError(""); // Clear general error when we have field-specific errors
            toast.error('Please correct the errors and try again.');
          } else {
            // Only set general error if no field-specific errors
            const generalError = result.message || result.error || 'Failed to update staff member. Please try again.';
            setError(generalError);
            toast.error(generalError);
          }
          return;
        }

        toast.success(result.message || 'Staff member updated successfully!');
      } else {
        // Create new staff member
        response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/register`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newMember.name,
            email: newMember.email,
            password: newMember.password,
            role: newMember.role,
            mobile_number: newMember.mobile_number
          })
        });

        // Try to parse JSON response
        let data;
        try {
          const text = await response.text();
          data = text ? JSON.parse(text) : {};
          result = data;
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          setError("Invalid response from server. Please try again.");
          toast.error("Invalid response from server. Please try again.");
          return;
        }

        if (!response.ok) {
          // Extract field-specific errors
          const fieldErrors = extractFieldErrors(result);
          if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            setError(""); // Clear general error when we have field-specific errors
            toast.error('Please correct the errors and try again.');
          } else {
            // Only set general error if no field-specific errors
            const generalError = result.message || result.error || 'Failed to register team member. Please try again.';
            setError(generalError);
            toast.error(generalError);
          }
          return;
        }

        toast.success(result.message || 'Team member registered successfully!');
      }

      setShowAddModal(false);
      setEditingMember(null);
      setErrors({});
      
      // Reset form
      setNewMember({
        name: "",
        email: "",
        password: "",
        role: "staff",
        mobile_number: ""
      });
      
      // Refetch data to show the updated/new member
      fetchStaffMembers();
    } catch (error) {
      console.error(isEditMode ? 'Update error:' : 'Registration error:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError("Network error. Please check your internet connection and try again.");
        toast.error("Network error. Please check your internet connection and try again.");
      } else {
        // Try to map error to specific fields
        const errorMessage = error.message || (isEditMode ? 'Failed to update staff member. Please try again.' : 'Failed to register team member. Please try again.');
        const newErrors = {};
        
        if (errorMessage.toLowerCase().includes("email")) {
          newErrors.email = errorMessage;
        } else if (errorMessage.toLowerCase().includes("mobile") || errorMessage.toLowerCase().includes("phone")) {
          newErrors.mobile_number = errorMessage;
        } else if (errorMessage.toLowerCase().includes("password")) {
          newErrors.password = errorMessage;
        } else if (errorMessage.toLowerCase().includes("name")) {
          newErrors.name = errorMessage;
        } else {
          setError(errorMessage);
        }
        
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          toast.error("Please correct the errors and try again.");
        } else {
          toast.error(errorMessage);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };


  const getStatusBadge = (status) => {
    const statusConfig = {
      approve: { color: "bg-green-100 text-green-800", icon: UserCheck, label: "Approved" },
      active: { color: "bg-green-100 text-green-800", icon: UserCheck, label: "Active" },
      pending: { color: "bg-yellow-100 text-yellow-800", icon: XCircle, label: "Pending" },
      inactive: { color: "bg-gray-100 text-gray-800", icon: XCircle, label: "Inactive" }
    };
    
    const config = statusConfig[status?.toLowerCase()] || statusConfig.inactive;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="w-full max-w-none space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Team Management</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage your internal team members</p>
          </div>
          <button
            onClick={handleAddMember}
            className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base font-medium"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Add Team Member</span>
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedMembers.length > 0 && (
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl shadow-lg border border-indigo-600 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm sm:text-base">
                    {selectedMembers.length} member{selectedMembers.length > 1 ? 's' : ''} selected
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

        {/* Team Members Table */}
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
                        className="w-10 h-10 rounded-lg"
                        style={{
                          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 1.5s infinite',
                          animationDelay: `${idx * 0.1}s`,
                        }}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <div 
                          className="h-4 rounded mb-1"
                          style={{
                            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 1.5s infinite',
                            animationDelay: `${idx * 0.1 + 0.05}s`,
                          }}
                        ></div>
                        <div 
                          className="h-3 rounded w-16"
                          style={{
                            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 1.5s infinite',
                            animationDelay: `${idx * 0.1 + 0.1}s`,
                          }}
                        ></div>
                      </div>
                    </div>
                    {/* Data Fields Skeleton */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[...Array(4)].map((_, fieldIdx) => (
                        <div key={fieldIdx} className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                          <div 
                            className="h-3 rounded w-16 mb-1"
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
                      {[...Array(3)].map((_, btnIdx) => (
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
            ) : teamMembers.length === 0 ? (
              <div className="px-2 py-6 text-center">
                <Shield className="mx-auto h-6 w-6 text-gray-400" />
                <h3 className="mt-1.5 text-[10px] font-medium text-gray-900">No staff members found</h3>
                <p className="mt-0.5 text-[9px] text-gray-500">
                  No staff members have been added yet.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {teamMembers.map((member) => (
                  <div key={member.id} className="p-4 bg-white hover:bg-gray-50 transition-colors duration-200">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">{member.name}</div>
                        <div className="text-xs text-gray-500">ID: {member.id}</div>
                      </div>
                    </div>

                    {/* All Data Fields */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                        <span className="text-xs font-medium text-gray-600 block mb-1">Email</span>
                        <div className="text-xs text-gray-900 break-words">{member.email || "N/A"}</div>
                      </div>
                      {member.mobile_number && (
                        <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                          <span className="text-xs font-medium text-gray-600 block mb-1">Mobile</span>
                          <div className="text-xs text-gray-900">{member.mobile_number}</div>
                        </div>
                      )}
                      <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                        <span className="text-xs font-medium text-gray-600 block mb-1">Role</span>
                        <div className="text-xs text-gray-900 capitalize">{member.role || "N/A"}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                        <span className="text-xs font-medium text-gray-600 block mb-1">Created</span>
                        <div className="text-xs text-gray-900">{formatDate(member.created_at)}</div>
                      </div>
                    </div>

                    {/* Action Buttons at Bottom */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleEdit(member)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleView(member)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 text-xs rounded-lg border border-gray-300 hover:bg-gray-200 transition-all duration-200 shadow-sm font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(member)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => handleSort("name")}>
                    <div className="flex items-center gap-2">
                      Team Member
                      {sortBy === "name" && (
                        <span className="text-indigo-600 text-sm font-bold">{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => handleSort("email")}>
                    <div className="flex items-center gap-2">
                      Email
                      {sortBy === "email" && (
                        <span className="text-indigo-600 text-sm font-bold">{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Mobile Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => handleSort("role")}>
                    <div className="flex items-center gap-2">
                      Role
                      {sortBy === "role" && (
                        <span className="text-indigo-600 text-sm font-bold">{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Created At
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
                  </>
                ) : teamMembers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-2 py-6 sm:py-8 text-center">
                      <Shield className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                      <h3 className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-medium text-gray-900">No staff members found</h3>
                      <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] text-gray-500">
                        No staff members have been added yet.
                      </p>
                    </td>
                  </tr>
                ) : (
                  teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-indigo-50/50 transition-colors duration-200 border-b border-gray-100">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate">{member.name}</div>
                            <div className="text-xs text-gray-500">ID: {member.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900 truncate">
                          {member.email}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-600 truncate">
                          {member.mobile_number || "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {member.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-600">
                          {formatDate(member.created_at)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(member)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleView(member)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-lg border border-gray-300 hover:bg-gray-200 transition-all duration-200 shadow-sm font-medium"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(member)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
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

        {/* Add/Edit Modal */}
        {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-2 sm:p-3 md:p-4">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-2xl w-full max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between p-2 sm:p-3 lg:p-4 border-b border-gray-200">
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 flex items-center gap-1.5 sm:gap-2">
                {editingMember ? (
                  <>
                    <Edit className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-indigo-600" />
                    Edit Team Member
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-green-600" />
                    Add New Team Member
                  </>
                )}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingMember(null);
                  setError("");
                  setErrors({});
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors duration-200 p-0.5 sm:p-1 hover:bg-gray-100 rounded-full"
                aria-label="Close modal"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
            
            <div className="p-2 sm:p-3 lg:p-4 space-y-3 sm:space-y-4">
              {/* Only show general error if there are no field-specific errors */}
              {error && Object.keys(errors).length === 0 && (
                <div className="bg-red-50 border-l-4 border-red-400 rounded-md p-2 sm:p-3">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600 flex-shrink-0" />
                    <p className="text-red-800 text-[10px] sm:text-xs lg:text-sm">{error}</p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                <div className="md:col-span-1">
                  <label className="block text-[10px] sm:text-xs lg:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => {
                      setNewMember(prev => ({ ...prev, name: e.target.value }));
                      if (errors.name) {
                        setErrors(prev => ({ ...prev, name: "" }));
                      }
                    }}
                    className={`w-full px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-2.5 border rounded-md focus:ring-2 transition-all duration-200 text-[10px] sm:text-xs lg:text-sm ${
                      errors.name ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                    placeholder="Enter full name"
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] lg:text-xs text-red-600 flex items-center gap-0.5 sm:gap-1">
                      <AlertCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      {errors.name}
                    </p>
                  )}
                </div>
                
                <div className="md:col-span-1">
                  <label className="block text-[10px] sm:text-xs lg:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => {
                      setNewMember(prev => ({ ...prev, email: e.target.value }));
                      if (errors.email) {
                        setErrors(prev => ({ ...prev, email: "" }));
                      }
                    }}
                    className={`w-full px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-2.5 border rounded-md focus:ring-2 transition-all duration-200 text-[10px] sm:text-xs lg:text-sm ${
                      errors.email ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                    placeholder="Enter email address"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] lg:text-xs text-red-600 flex items-center gap-0.5 sm:gap-1">
                      <AlertCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
                
                {!editingMember && (
                  <div className="md:col-span-1">
                    <label className="block text-[10px] sm:text-xs lg:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={newMember.password}
                      onChange={(e) => {
                        setNewMember(prev => ({ ...prev, password: e.target.value }));
                        if (errors.password) {
                          setErrors(prev => ({ ...prev, password: "" }));
                        }
                      }}
                      className={`w-full px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-2.5 border rounded-md focus:ring-2 transition-all duration-200 text-[10px] sm:text-xs lg:text-sm ${
                        errors.password ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                      }`}
                      placeholder="Enter password"
                      disabled={isLoading}
                    />
                    {errors.password && (
                      <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] lg:text-xs text-red-600 flex items-center gap-0.5 sm:gap-1">
                        <AlertCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        {errors.password}
                      </p>
                    )}
                  </div>
                )}
                
                <div className="md:col-span-1">
                  <label className="block text-[10px] sm:text-xs lg:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={newMember.mobile_number}
                    onChange={(e) => {
                      setNewMember(prev => ({ ...prev, mobile_number: e.target.value }));
                      if (errors.mobile_number) {
                        setErrors(prev => ({ ...prev, mobile_number: "" }));
                      }
                    }}
                    className={`w-full px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-2.5 border rounded-md focus:ring-2 transition-all duration-200 text-[10px] sm:text-xs lg:text-sm ${
                      errors.mobile_number ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                    placeholder="Enter mobile number"
                    disabled={isLoading}
                  />
                  {errors.mobile_number && (
                    <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] lg:text-xs text-red-600 flex items-center gap-0.5 sm:gap-1">
                      <AlertCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      {errors.mobile_number}
                    </p>
                  )}
                </div>
              </div>
              
              {!editingMember && (
                <div className="bg-blue-50 border-l-4 border-blue-400 rounded-md p-2 sm:p-3">
                  <p className="text-blue-800 text-[10px] sm:text-xs lg:text-sm">
                    <strong>Note:</strong> The role is automatically set to "staff" for all new team members.
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-2 sm:p-3 lg:p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingMember(null);
                  setError("");
                  setErrors({});
                }}
                className="w-full sm:w-auto px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm font-medium text-[10px] sm:text-xs lg:text-sm"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMember}
                className="w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 bg-indigo-600 text-white rounded-md border border-indigo-700 hover:bg-indigo-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-medium text-[10px] sm:text-xs lg:text-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 animate-spin" />
                    <span>{editingMember ? "Updating..." : "Registering..."}</span>
                  </>
                ) : (
                  <>
                    <Save className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                    <span>{editingMember ? "Update Member" : "Register Member"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        )}

        {/* View Modal */}
        {showViewModal && viewingMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-2 sm:p-3 md:p-4">
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-2xl w-full max-h-[95vh] overflow-y-auto">
              <div className="flex items-center justify-between p-2 sm:p-3 lg:p-4 border-b border-gray-200">
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 flex items-center gap-1.5 sm:gap-2">
                  <User className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-indigo-600" />
                  Staff Member Details
                </h3>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setViewingMember(null);
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
                    <h4 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-0.5 sm:mb-1">{viewingMember.name}</h4>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500">ID: {viewingMember.id}</p>
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
                    <p className="text-[10px] sm:text-xs lg:text-sm text-gray-900 font-medium break-words">{viewingMember.email || "N/A"}</p>
                  </div>

                  <div className="bg-gray-50 rounded-md p-2 sm:p-3 lg:p-4 border border-gray-200 hover:shadow-sm transition-shadow duration-200">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-md flex items-center justify-center">
                        <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                      </div>
                      <span className="text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-700">Mobile Number</span>
                    </div>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-gray-900 font-medium">{viewingMember.mobile_number || "N/A"}</p>
                  </div>

                  <div className="bg-gray-50 rounded-md p-2 sm:p-3 lg:p-4 border border-gray-200 hover:shadow-sm transition-shadow duration-200">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-md flex items-center justify-center">
                        <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                      </div>
                      <span className="text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-700">Role</span>
                    </div>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-gray-900 font-medium capitalize">{viewingMember.role || "N/A"}</p>
                  </div>

                  <div className="bg-gray-50 rounded-md p-2 sm:p-3 lg:p-4 border border-gray-200 hover:shadow-sm transition-shadow duration-200">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-md flex items-center justify-center">
                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      </div>
                      <span className="text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-700">Created At</span>
                    </div>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-gray-900 font-medium">
                      {formatDate(viewingMember.created_at)}
                    </p>
                  </div>

                  {viewingMember.email_verified_at && (
                    <div className="bg-gray-50 rounded-md p-2 sm:p-3 lg:p-4 border border-gray-200 hover:shadow-sm transition-shadow duration-200 sm:col-span-2">
                      <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-md flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                        </div>
                        <span className="text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-700">Email Verified At</span>
                      </div>
                      <p className="text-[10px] sm:text-xs lg:text-sm text-gray-900 font-medium">
                        {formatDate(viewingMember.email_verified_at)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-2 sm:p-3 lg:p-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setViewingMember(null);
                  }}
                  className="w-full sm:w-auto px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm font-medium text-[10px] sm:text-xs lg:text-sm"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setViewingMember(null);
                    handleEdit(viewingMember);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 bg-indigo-600 text-white rounded-md border border-indigo-700 hover:bg-indigo-700 transition-all duration-200 shadow-sm font-medium text-[10px] sm:text-xs lg:text-sm"
                >
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                  Edit Member
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && deletingMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-2 sm:p-3 md:p-4">
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-md w-full">
              <div className="p-3 sm:p-4 lg:p-5">
                <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-3 sm:mb-4 bg-red-100 rounded-full">
                  <AlertCircle className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-red-600" />
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 text-center mb-1.5 sm:mb-2">
                  Delete Staff Member?
                </h3>
                <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 text-center mb-3 sm:mb-4 lg:mb-6">
                  Are you sure you want to delete <span className="font-semibold text-gray-900">{deletingMember.name}</span>? This action cannot be undone.
                </p>
                <div className="bg-gray-50 rounded-md p-2 sm:p-3 lg:p-4 mb-3 sm:mb-4 lg:mb-6">
                  <p className="text-[9px] sm:text-[10px] lg:text-xs text-gray-600 text-center">
                    <span className="font-medium">Email:</span> {deletingMember.email}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-2 sm:p-3 lg:p-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingMember(null);
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
                      <span>Delete Member</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Delete Confirmation Modal */}
        {showBulkDeleteModal && selectedMembers.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-2 sm:p-3 md:p-4">
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-md w-full">
              <div className="p-3 sm:p-4 lg:p-5">
                <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-3 sm:mb-4 bg-red-100 rounded-full">
                  <AlertCircle className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-red-600" />
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 text-center mb-1.5 sm:mb-2">
                  Delete Team Members?
                </h3>
                <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 text-center mb-3 sm:mb-4 lg:mb-6">
                  Are you sure you want to delete <span className="font-semibold text-gray-900">{selectedMembers.length}</span> team member(s)? This action cannot be undone.
                </p>
                <div className="bg-gray-50 rounded-md p-2 sm:p-3 lg:p-4 mb-3 sm:mb-4 lg:mb-6">
                  <p className="text-[9px] sm:text-[10px] lg:text-xs text-gray-600 text-center">
                    <span className="font-medium">Selected Members:</span> {selectedMembers.length} member(s)
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
                      <span>Delete Members</span>
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

export default InternalTeam;
