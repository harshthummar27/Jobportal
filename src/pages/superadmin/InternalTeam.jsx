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
    <div className="w-full max-w-none">
        {/* Add Team Member Button */}
        <div className="mb-6">
          <div className="flex justify-end">
            <button
              onClick={handleAddMember}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-green-500 text-white rounded-md border border-green-600 hover:bg-green-600 transition-all duration-200 shadow-sm text-sm sm:text-base"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Team Member</span>
              <span className="sm:hidden">Add Member</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-lg shadow-md p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-indigo-600">{total}</p>
              </div>
              <User className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Members</p>
                <p className="text-2xl font-bold text-green-600">
                  {teamMembers.filter(m => m.status?.toLowerCase() === 'approve').length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Showing</p>
                <p className="text-2xl font-bold text-blue-600">
                  {from}-{to} of {total}
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>


        {/* Bulk Actions */}
        {selectedMembers.length > 0 && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-2 mb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-indigo-800 font-medium text-sm">
                {selectedMembers.length} member(s) selected
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleBulkDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs rounded-md border border-red-600 hover:bg-red-600 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-800 text-sm">Error: {fetchError}</p>
          </div>
        )}

        {/* Team Members Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-2 py-2 text-left">
                    <input
                      type="checkbox"
                      checked={selectedMembers.length === teamMembers.length && teamMembers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("name")}>
                    <div className="flex items-center gap-1">
                      Team Member
                      {sortBy === "name" && (
                        <span className="text-indigo-600">{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("email")}>
                    <div className="flex items-center gap-1">
                      Email
                      {sortBy === "email" && (
                        <span className="text-indigo-600">{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Mobile Number
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("role")}>
                    <div className="flex items-center gap-1">
                      Role
                      {sortBy === "role" && (
                        <span className="text-indigo-600">{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Created At
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-2 py-8 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                        <span className="text-sm text-gray-600">Loading staff members...</span>
                      </div>
                    </td>
                  </tr>
                ) : teamMembers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-2 py-8 text-center">
                      <Shield className="mx-auto h-8 w-8 text-gray-400" />
                      <h3 className="mt-2 text-xs font-medium text-gray-900">No staff members found</h3>
                      <p className="mt-1 text-[10px] text-gray-500">
                        No staff members have been added yet.
                      </p>
                    </td>
                  </tr>
                ) : (
                  teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-2 py-2">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member.id)}
                          onChange={() => handleSelectMember(member.id)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                            <User className="h-3 w-3 text-indigo-600" />
                          </div>
                          <div className="ml-2 min-w-0">
                            <div className="text-xs font-medium text-gray-900 truncate">{member.name}</div>
                            <div className="text-[10px] text-gray-500">ID: {member.id}</div>
                            <div className="text-[10px] text-gray-500 sm:hidden">{member.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2 hidden sm:table-cell">
                        <div className="text-[10px] text-gray-900 truncate">
                          {member.email}
                        </div>
                      </td>
                      <td className="px-2 py-2 hidden md:table-cell">
                        <div className="text-[10px] text-gray-500 truncate">
                          {member.mobile_number}
                        </div>
                      </td>
                      <td className="px-2 py-2 hidden lg:table-cell">
                        <div className="text-[10px] text-gray-900 font-medium">{member.role}</div>
                      </td>
                      <td className="px-2 py-2 hidden md:table-cell">
                        <div className="text-[10px] text-gray-900">
                          {formatDate(member.created_at)}
                        </div>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(member)}
                            className="flex items-center gap-0.5 px-1.5 py-0.5 bg-green-500 text-white text-[9px] rounded border border-green-600 hover:bg-green-600 transition-all duration-200 shadow-sm"
                          >
                            <Edit className="h-2.5 w-2.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleView(member)}
                            className="flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-100 text-gray-700 text-[9px] rounded border border-gray-300 hover:bg-gray-200 transition-all duration-200 shadow-sm"
                          >
                            <Eye className="h-2.5 w-2.5" />
                            View
                          </button>
                        <button
                          onClick={() => handleDelete(member)}
                          className="flex items-center gap-0.5 px-1.5 py-0.5 bg-red-500 text-white text-[9px] rounded border border-red-600 hover:bg-red-600 transition-all duration-200 shadow-sm"
                        >
                          <Trash2 className="h-2.5 w-2.5" />
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
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <span>Showing {from} to {to} of {total} results</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="h-3 w-3" />
                  Previous
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
                        className={`px-2 py-1 text-xs border rounded-md ${
                          currentPage === pageNum
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "border-gray-300 hover:bg-gray-100"
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
                  className="px-2 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-3 sm:p-4 md:p-6">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 max-w-2xl w-full max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 sm:p-5 md:p-6 border-b border-gray-200">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                {editingMember ? (
                  <>
                    <Edit className="h-5 w-5 text-indigo-600" />
                    Edit Team Member
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 text-green-600" />
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
                className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors duration-200 p-1 hover:bg-gray-100 rounded-full"
                aria-label="Close modal"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
            
            <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5">
              {/* Only show general error if there are no field-specific errors */}
              {error && Object.keys(errors).length === 0 && (
                <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-800 text-sm sm:text-base">{error}</p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div className="md:col-span-1">
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
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
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 transition-all duration-200 text-sm sm:text-base ${
                      errors.name ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                    placeholder="Enter full name"
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </p>
                  )}
                </div>
                
                <div className="md:col-span-1">
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
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
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 transition-all duration-200 text-sm sm:text-base ${
                      errors.email ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                    placeholder="Enter email address"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
                
                {!editingMember && (
                  <div className="md:col-span-1">
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
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
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 transition-all duration-200 text-sm sm:text-base ${
                        errors.password ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                      }`}
                      placeholder="Enter password"
                      disabled={isLoading}
                    />
                    {errors.password && (
                      <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.password}
                      </p>
                    )}
                  </div>
                )}
                
                <div className="md:col-span-1">
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
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
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 transition-all duration-200 text-sm sm:text-base ${
                      errors.mobile_number ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                    placeholder="Enter mobile number"
                    disabled={isLoading}
                  />
                  {errors.mobile_number && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.mobile_number}
                    </p>
                  )}
                </div>
              </div>
              
              {!editingMember && (
                <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-3 sm:p-4">
                  <p className="text-blue-800 text-sm sm:text-base">
                    <strong>Note:</strong> The role is automatically set to "staff" for all new team members.
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 p-4 sm:p-5 md:p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingMember(null);
                  setError("");
                  setErrors({});
                }}
                className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm font-medium text-sm sm:text-base"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMember}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-lg border border-indigo-700 hover:bg-indigo-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    <span>{editingMember ? "Updating..." : "Registering..."}</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 sm:h-5 sm:w-5" />
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
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-3 sm:p-4 md:p-6">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 max-w-2xl w-full max-h-[95vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 sm:p-5 md:p-6 border-b border-gray-200">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
                  Staff Member Details
                </h3>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setViewingMember(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors duration-200 p-1 hover:bg-gray-100 rounded-full"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
              
              <div className="p-4 sm:p-5 md:p-6 space-y-6">
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 pb-5 sm:pb-6 border-b border-gray-200">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <User className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{viewingMember.name}</h4>
                    <p className="text-sm sm:text-base text-gray-500">ID: {viewingMember.id}</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Mail className="h-5 w-5 text-indigo-600" />
                      </div>
                      <span className="text-sm sm:text-base font-semibold text-gray-700">Email Address</span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-900 font-medium break-words">{viewingMember.email || "N/A"}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Phone className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="text-sm sm:text-base font-semibold text-gray-700">Mobile Number</span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-900 font-medium">{viewingMember.mobile_number || "N/A"}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-5 w-5 text-purple-600" />
                      </div>
                      <span className="text-sm sm:text-base font-semibold text-gray-700">Role</span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-900 font-medium capitalize">{viewingMember.role || "N/A"}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="text-sm sm:text-base font-semibold text-gray-700">Created At</span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-900 font-medium">
                      {formatDate(viewingMember.created_at)}
                    </p>
                  </div>

                  {viewingMember.email_verified_at && (
                    <div className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow duration-200 sm:col-span-2">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <span className="text-sm sm:text-base font-semibold text-gray-700">Email Verified At</span>
                      </div>
                      <p className="text-sm sm:text-base text-gray-900 font-medium">
                        {formatDate(viewingMember.email_verified_at)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 p-4 sm:p-5 md:p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setViewingMember(null);
                  }}
                  className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm font-medium text-sm sm:text-base"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setViewingMember(null);
                    handleEdit(viewingMember);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-lg border border-indigo-700 hover:bg-indigo-700 transition-all duration-200 shadow-sm font-medium text-sm sm:text-base"
                >
                  <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                  Edit Member
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && deletingMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-3 sm:p-4 md:p-6">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full">
              <div className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center mb-2">
                  Delete Staff Member?
                </h3>
                <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
                  Are you sure you want to delete <span className="font-semibold text-gray-900">{deletingMember.name}</span>? This action cannot be undone.
                </p>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-6">
                  <p className="text-xs sm:text-sm text-gray-600 text-center">
                    <span className="font-medium">Email:</span> {deletingMember.email}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 p-4 sm:p-5 md:p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingMember(null);
                  }}
                  className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm font-medium text-sm sm:text-base"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-red-600 text-white rounded-lg border border-red-700 hover:bg-red-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
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
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-3 sm:p-4 md:p-6">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full">
              <div className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center mb-2">
                  Delete Team Members?
                </h3>
                <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
                  Are you sure you want to delete <span className="font-semibold text-gray-900">{selectedMembers.length}</span> team member(s)? This action cannot be undone.
                </p>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-6">
                  <p className="text-xs sm:text-sm text-gray-600 text-center">
                    <span className="font-medium">Selected Members:</span> {selectedMembers.length} member(s)
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 p-4 sm:p-5 md:p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    setShowBulkDeleteModal(false);
                  }}
                  className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm font-medium text-sm sm:text-base"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBulkDelete}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-red-600 text-white rounded-lg border border-red-700 hover:bg-red-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
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
