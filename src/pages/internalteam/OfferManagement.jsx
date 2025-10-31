import React, { useState } from "react";
import { 
  FileText, 
  DollarSign, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Building2,
  Mail,
  Phone,
  Eye,
  Edit,
  Trash2,
  Plus,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { toast } from 'react-toastify';
import { useSearch } from "../../Components/InternalTeamLayout";

const OfferManagement = () => {
  const [selectedOffers, setSelectedOffers] = useState([]);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { searchTerm } = useSearch();

  // Initialize with empty array - data will be fetched from API
  const [offers, setOffers] = useState([]);

  const [newOffer, setNewOffer] = useState({
    candidate_code: "",
    candidate_selection_id: "",
    job_title: "",
    job_description: "",
    offered_salary: "",
    location: "",
    benefits: [],
    start_date: "",
    offer_deadline: "",
    offer_notes: ""
  });

  // Get today's date in YYYY-MM-DD format for min date
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const filteredOffers = offers.filter(offer =>
    (offer.candidateName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (offer.candidateId?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (offer.recruiter?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (offer.position?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleSelectOffer = (offerId) => {
    setSelectedOffers(prev => 
      prev.includes(offerId) 
        ? prev.filter(id => id !== offerId)
        : [...prev, offerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOffers.length === filteredOffers.length) {
      setSelectedOffers([]);
    } else {
      setSelectedOffers(filteredOffers.map(o => o.id));
    }
  };

  const handleCreateOffer = () => {
    setNewOffer({
      candidate_code: "",
      candidate_selection_id: "",
      job_title: "",
      job_description: "",
      offered_salary: "",
      location: "",
      benefits: [],
      start_date: "",
      offer_deadline: "",
      offer_notes: ""
    });
    setErrors({});
    setShowOfferModal(true);
  };

  const handleEditOffer = (offer) => {
    setSelectedOffer(offer);
    setNewOffer(offer);
    setShowEditModal(true);
  };

  const validateOffer = () => {
    const newErrors = {};

    if (!newOffer.candidate_code?.trim()) {
      newErrors.candidate_code = "Candidate code is required";
    }

    if (!newOffer.candidate_selection_id?.toString().trim()) {
      newErrors.candidate_selection_id = "Candidate selection ID is required";
    } else if (isNaN(Number(newOffer.candidate_selection_id))) {
      newErrors.candidate_selection_id = "Candidate selection ID must be a valid number";
    }

    if (!newOffer.job_title?.trim()) {
      newErrors.job_title = "Job title is required";
    }

    if (!newOffer.job_description?.trim()) {
      newErrors.job_description = "Job description is required";
    }

    if (!newOffer.offered_salary?.toString().trim()) {
      newErrors.offered_salary = "Offered salary is required";
    } else if (isNaN(Number(newOffer.offered_salary)) || Number(newOffer.offered_salary) <= 0) {
      newErrors.offered_salary = "Offered salary must be a valid positive number";
    }

    if (!newOffer.location?.trim()) {
      newErrors.location = "Location is required";
    }

    if (!newOffer.benefits || newOffer.benefits.length === 0) {
      newErrors.benefits = "At least one benefit is required";
    }

    if (!newOffer.start_date) {
      newErrors.start_date = "Start date is required";
    } else {
      const startDate = new Date(newOffer.start_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDate < today) {
        newErrors.start_date = "Start date cannot be in the past";
      }
    }

    if (!newOffer.offer_deadline) {
      newErrors.offer_deadline = "Offer deadline is required";
    } else {
      const deadline = new Date(newOffer.offer_deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadline < today) {
        newErrors.offer_deadline = "Offer deadline cannot be in the past";
      }
    }

    if (!newOffer.offer_notes?.trim()) {
      newErrors.offer_notes = "Offer notes is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveOffer = async () => {
    if (!validateOffer()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Get authentication token
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        setIsLoading(false);
        return;
      }

      // Prepare API data
      const offerData = {
        candidate_code: newOffer.candidate_code.trim(),
        candidate_selection_id: Number(newOffer.candidate_selection_id),
        job_title: newOffer.job_title.trim(),
        job_description: newOffer.job_description.trim(),
        offered_salary: Number(newOffer.offered_salary),
        location: newOffer.location.trim(),
        benefits: newOffer.benefits,
        start_date: newOffer.start_date,
        offer_deadline: newOffer.offer_deadline,
        offer_notes: newOffer.offer_notes.trim()
      };

      // Make API call
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/internal/offers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(offerData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("API Error Response:", data);
        console.error("Response Status:", response.status);
        
        // Handle specific error messages from API
        let errorMessage = data.message || data.error || 'Failed to create offer';
        
        // If API returns field-specific errors
        if (data.errors) {
          const fieldErrors = {};
          Object.keys(data.errors).forEach(key => {
            fieldErrors[key] = Array.isArray(data.errors[key]) 
              ? data.errors[key][0] 
              : data.errors[key];
          });
          setErrors(fieldErrors);
          toast.error("Please correct the errors in the form");
        } else {
          toast.error(errorMessage);
        }
        
        setIsLoading(false);
        return;
      }

      console.log("Offer created successfully:", data);
      
      // Show success toast
      toast.success("Offer created successfully!");
      
      // Close modal and reset form
      setShowOfferModal(false);
      setNewOffer({
        candidate_code: "",
        candidate_selection_id: "",
        job_title: "",
        job_description: "",
        offered_salary: "",
        location: "",
        benefits: [],
        start_date: "",
        offer_deadline: "",
        offer_notes: ""
      });
      setErrors({});
      
      // TODO: Refresh offers list from API
      // You may want to fetch the updated list of offers here
      
    } catch (error) {
      console.error("Error creating offer:", error);
      toast.error(error.message || "Failed to create offer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = (offerId, newStatus) => {
    setOffers(prev => prev.map(offer => 
      offer.id === offerId 
        ? { 
            ...offer, 
            status: newStatus,
            responseDate: newStatus !== 'pending' ? new Date().toISOString().split('T')[0] : null,
            declineCount: newStatus === 'declined' ? offer.declineCount + 1 : offer.declineCount
          }
        : offer
    ));
  };

  const handleDeleteOffer = (offerId) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      setOffers(prev => prev.filter(offer => offer.id !== offerId));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pending" },
      accepted: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Accepted" },
      declined: { color: "bg-red-100 text-red-800", icon: XCircle, label: "Declined" },
      expired: { color: "bg-gray-100 text-gray-800", icon: AlertCircle, label: "Expired" }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  const getStatusCounts = () => {
    return {
      pending: offers.filter(o => o.status === 'pending').length,
      accepted: offers.filter(o => o.status === 'accepted').length,
      declined: offers.filter(o => o.status === 'declined').length,
      expired: offers.filter(o => o.status === 'expired').length,
      total: offers.length
    };
  };

  const statusCounts = getStatusCounts();

  const getSalaryComparison = (offered, expected) => {
    const offeredNum = offered ? parseInt(offered.replace(/[$,]/g, '')) : 0;
    const expectedNum = expected ? parseInt(expected.replace(/[$,]/g, '')) : 0;
    
    if (offeredNum >= expectedNum) {
      return { icon: TrendingUp, color: "text-green-600", text: "Meets/Exceeds" };
    } else {
      return { icon: TrendingDown, color: "text-red-600", text: "Below Expected" };
    }
  };

  const getLocationMatch = (offered, preferred) => {
    if (!offered || !preferred) {
      return { match: false, color: "text-yellow-600" };
    }
    return offered.toLowerCase() === preferred.toLowerCase() ? 
      { match: true, color: "text-green-600" } : 
      { match: false, color: "text-yellow-600" };
  };

  const benefitOptions = [
    "Health Insurance", "401k", "Stock Options", "Flexible Hours", 
    "Remote Work", "Learning Budget", "Gym Membership", "Commuter Benefits", 
    "Equity", "Dental Insurance", "Vision Insurance", "Life Insurance"
  ];

  return (
    <div className="w-full max-w-none">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Accepted</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.accepted}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Declined</p>
              <p className="text-2xl font-bold text-red-600">{statusCounts.declined}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-gray-600">{statusCounts.expired}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-blue-600">{statusCounts.total}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Add Offer Button */}
      <div className="mb-6">
        <div className="flex justify-end">
          <button
            onClick={handleCreateOffer}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-md border border-emerald-600 hover:bg-emerald-600 transition-all duration-200 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Create Offer
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOffers.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-emerald-800 font-medium text-sm">
              {selectedOffers.length} offer(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white text-sm rounded-md border border-emerald-600 hover:bg-emerald-600 transition-all duration-200 shadow-sm">
                <Mail className="h-4 w-4" />
                Send Reminders
              </button>
              <button className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-sm rounded-md border border-blue-600 hover:bg-blue-600 transition-all duration-200 shadow-sm">
                <Edit className="h-4 w-4" />
                Bulk Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1400px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOffers.length === filteredOffers.length && filteredOffers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position & Company
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salary Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timeline
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOffers.map((offer) => {
                const salaryComparison = getSalaryComparison(offer.offeredSalary, offer.candidateExpectedSalary);
                const locationMatch = getLocationMatch(offer.location, offer.candidatePreferredLocation);
                const SalaryIcon = salaryComparison.icon;
                
                return (
                  <tr key={offer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOffers.includes(offer.id)}
                        onChange={() => handleSelectOffer(offer.id)}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{offer.candidateName}</div>
                          <div className="text-sm text-gray-500">{offer.candidateId}</div>
                          <div className="text-sm text-gray-500">{offer.candidateEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{offer.position}</div>
                      <div className="text-sm text-gray-500">{offer.recruiter}</div>
                      <div className="text-sm text-gray-500">{offer.recruiterContact}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 font-medium">{offer.offeredSalary}</div>
                      <div className="text-sm text-gray-500">Expected: {offer.candidateExpectedSalary}</div>
                      <div className={`text-xs flex items-center ${salaryComparison.color}`}>
                        <SalaryIcon className="h-3 w-3 mr-1" />
                        {salaryComparison.text}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{offer.location}</div>
                      <div className="text-sm text-gray-500">Preferred: {offer.candidatePreferredLocation}</div>
                      <div className={`text-xs ${locationMatch.color}`}>
                        {locationMatch.match ? "✓ Location Match" : "⚠ Location Mismatch"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">Offered: {offer.offerDate}</div>
                      <div className="text-sm text-gray-500">Deadline: {offer.responseDeadline}</div>
                      {offer.responseDate && (
                        <div className="text-sm text-gray-500">Response: {offer.responseDate}</div>
                      )}
                      {offer.declineCount > 0 && (
                        <div className="text-xs text-red-600">Declines: {offer.declineCount}/2</div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(offer.status)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        {offer.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(offer.id, 'accepted')}
                              className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs rounded border border-green-600 hover:bg-green-600 transition-all duration-200 shadow-sm"
                            >
                              <CheckCircle className="h-3 w-3" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(offer.id, 'declined')}
                              className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs rounded border border-red-600 hover:bg-red-600 transition-all duration-200 shadow-sm"
                            >
                              <XCircle className="h-3 w-3" />
                              Decline
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleEditOffer(offer)}
                          className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs rounded border border-blue-600 hover:bg-blue-600 transition-all duration-200 shadow-sm"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </button>
                        <button className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-300 hover:bg-gray-200 transition-all duration-200 shadow-sm">
                          <Eye className="h-3 w-3" />
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteOffer(offer.id)}
                          className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs rounded border border-red-600 hover:bg-red-600 transition-all duration-200 shadow-sm"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredOffers.length === 0 && (
          <div className="text-center py-8">
            <FileText className="mx-auto h-8 w-8 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No offers found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "No offers match your search criteria." : "No offers have been created yet."}
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Offer Modal */}
      {(showOfferModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {showEditModal ? "Edit Offer" : "Create New Offer"}
              </h3>
              <button
                onClick={() => {
                  setShowOfferModal(false);
                  setShowEditModal(false);
                  setSelectedOffer(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Candidate Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Candidate Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Candidate Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newOffer.candidate_code}
                      onChange={(e) => {
                        setNewOffer(prev => ({ ...prev, candidate_code: e.target.value }));
                        if (errors.candidate_code) {
                          setErrors(prev => ({ ...prev, candidate_code: "" }));
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-transparent ${
                        errors.candidate_code ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="CAND138087"
                    />
                    {errors.candidate_code && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.candidate_code}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Candidate Selection ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={newOffer.candidate_selection_id}
                      onChange={(e) => {
                        setNewOffer(prev => ({ ...prev, candidate_selection_id: e.target.value }));
                        if (errors.candidate_selection_id) {
                          setErrors(prev => ({ ...prev, candidate_selection_id: "" }));
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-transparent ${
                        errors.candidate_selection_id ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="1"
                      min="1"
                    />
                    {errors.candidate_selection_id && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.candidate_selection_id}
                      </p>
                    )}
                  </div>
                </div>

                {/* Offer Details */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Offer Details</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newOffer.job_title}
                      onChange={(e) => {
                        setNewOffer(prev => ({ ...prev, job_title: e.target.value }));
                        if (errors.job_title) {
                          setErrors(prev => ({ ...prev, job_title: "" }));
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-transparent ${
                        errors.job_title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Senior Software Engineer"
                    />
                    {errors.job_title && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.job_title}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={newOffer.job_description}
                      onChange={(e) => {
                        setNewOffer(prev => ({ ...prev, job_description: e.target.value }));
                        if (errors.job_description) {
                          setErrors(prev => ({ ...prev, job_description: "" }));
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-transparent resize-none ${
                        errors.job_description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Lead development team and work on high-impact projects..."
                    />
                    {errors.job_description && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.job_description}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Offered Salary <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={newOffer.offered_salary}
                        onChange={(e) => {
                          setNewOffer(prev => ({ ...prev, offered_salary: e.target.value }));
                          if (errors.offered_salary) {
                            setErrors(prev => ({ ...prev, offered_salary: "" }));
                          }
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-transparent ${
                          errors.offered_salary ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="1200000"
                        min="0"
                      />
                      {errors.offered_salary && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.offered_salary}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newOffer.location}
                        onChange={(e) => {
                          setNewOffer(prev => ({ ...prev, location: e.target.value }));
                          if (errors.location) {
                            setErrors(prev => ({ ...prev, location: "" }));
                          }
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-transparent ${
                          errors.location ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Mumbai, India"
                      />
                      {errors.location && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.location}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={newOffer.start_date}
                        onChange={(e) => {
                          setNewOffer(prev => ({ ...prev, start_date: e.target.value }));
                          if (errors.start_date) {
                            setErrors(prev => ({ ...prev, start_date: "" }));
                          }
                        }}
                        min={getTodayDate()}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-transparent ${
                          errors.start_date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.start_date && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.start_date}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Offer Deadline <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={newOffer.offer_deadline}
                        onChange={(e) => {
                          setNewOffer(prev => ({ ...prev, offer_deadline: e.target.value }));
                          if (errors.offer_deadline) {
                            setErrors(prev => ({ ...prev, offer_deadline: "" }));
                          }
                        }}
                        min={getTodayDate()}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-transparent ${
                          errors.offer_deadline ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.offer_deadline && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.offer_deadline}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Benefits <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {benefitOptions.map(benefit => (
                        <label key={benefit} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newOffer.benefits.includes(benefit)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewOffer(prev => ({ ...prev, benefits: [...prev.benefits, benefit] }));
                              } else {
                                setNewOffer(prev => ({ ...prev, benefits: prev.benefits.filter(b => b !== benefit) }));
                              }
                              if (errors.benefits) {
                                setErrors(prev => ({ ...prev, benefits: "" }));
                              }
                            }}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{benefit}</span>
                        </label>
                      ))}
                    </div>
                    {errors.benefits && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.benefits}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Offer Notes <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={newOffer.offer_notes}
                      onChange={(e) => {
                        setNewOffer(prev => ({ ...prev, offer_notes: e.target.value }));
                        if (errors.offer_notes) {
                          setErrors(prev => ({ ...prev, offer_notes: "" }));
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-transparent resize-none ${
                        errors.offer_notes ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Great opportunity to grow with a leading tech company"
                    />
                    {errors.offer_notes && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.offer_notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 p-6 border-t">
              <button
                type="button"
                onClick={() => {
                  setShowOfferModal(false);
                  setShowEditModal(false);
                  setSelectedOffer(null);
                  setErrors({});
                }}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md border border-gray-300 hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveOffer}
                disabled={isLoading}
                className="px-4 py-2 bg-emerald-500 text-white rounded-md border border-emerald-600 hover:bg-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  showEditModal ? "Update Offer" : "Create Offer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferManagement;
