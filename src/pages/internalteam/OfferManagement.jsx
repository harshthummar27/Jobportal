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
import { useSearch } from "../../Components/InternalTeamLayout";

const OfferManagement = () => {
  const [selectedOffers, setSelectedOffers] = useState([]);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const { searchTerm } = useSearch();

  // Mock data - in real app, replace with API call
  const [offers, setOffers] = useState([
    {
      id: 1,
      candidateId: "TSC-2024-2847",
      candidateName: "Grace Chen",
      candidateEmail: "grace.chen@email.com",
      candidatePhone: "+1 234-567-8901",
      recruiter: "CloudFirst Technologies",
      recruiterContact: "john.recruiter@cloudfirst.com",
      position: "Senior React Developer",
      offeredSalary: "$125,000",
      candidateExpectedSalary: "$120,000",
      location: "Remote",
      candidatePreferredLocation: "Remote",
      offerDate: "2024-01-20",
      responseDeadline: "2024-01-27",
      status: "pending",
      responseDate: null,
      declineCount: 0,
      notes: "Strong technical skills, good cultural fit",
      benefits: ["Health Insurance", "401k", "Flexible Hours", "Remote Work"],
      startDate: "2024-02-15"
    },
    {
      id: 2,
      candidateId: "TSC-2024-2848",
      candidateName: "Michael Johnson",
      candidateEmail: "michael.j@email.com",
      candidatePhone: "+1 234-567-8902",
      recruiter: "TechCorp Inc.",
      recruiterContact: "sarah.tech@techcorp.com",
      position: "Backend Developer",
      offeredSalary: "$130,000",
      candidateExpectedSalary: "$130,000",
      location: "Austin, TX",
      candidatePreferredLocation: "Austin, TX",
      offerDate: "2024-01-19",
      responseDeadline: "2024-01-26",
      status: "accepted",
      responseDate: "2024-01-22",
      declineCount: 0,
      notes: "Perfect match for requirements",
      benefits: ["Health Insurance", "401k", "Stock Options", "Gym Membership"],
      startDate: "2024-02-01"
    },
    {
      id: 3,
      candidateId: "TSC-2024-2849",
      candidateName: "Sarah Williams",
      candidateEmail: "sarah.w@email.com",
      candidatePhone: "+1 234-567-8903",
      recruiter: "DataFlow Solutions",
      recruiterContact: "mike.data@dataflow.com",
      position: "Data Scientist",
      offeredSalary: "$115,000",
      candidateExpectedSalary: "$110,000",
      location: "Seattle, WA",
      candidatePreferredLocation: "Seattle, WA",
      offerDate: "2024-01-18",
      responseDeadline: "2024-01-25",
      status: "declined",
      responseDate: "2024-01-23",
      declineCount: 1,
      notes: "Salary below expectations",
      benefits: ["Health Insurance", "401k", "Learning Budget"],
      startDate: "2024-02-10"
    },
    {
      id: 4,
      candidateId: "TSC-2024-2850",
      candidateName: "David Brown",
      candidateEmail: "david.brown@email.com",
      candidatePhone: "+1 234-567-8904",
      recruiter: "InnovateTech",
      recruiterContact: "lisa.innovate@innovatetech.com",
      position: "Java Developer",
      offeredSalary: "$120,000",
      candidateExpectedSalary: "$125,000",
      location: "New York, NY",
      candidatePreferredLocation: "New York, NY",
      offerDate: "2024-01-17",
      responseDeadline: "2024-01-24",
      status: "declined",
      responseDate: "2024-01-21",
      declineCount: 2,
      notes: "Second decline - candidate may be removed",
      benefits: ["Health Insurance", "401k", "Commuter Benefits"],
      startDate: "2024-02-05"
    },
    {
      id: 5,
      candidateId: "TSC-2024-2851",
      candidateName: "Emma Davis",
      candidateEmail: "emma.davis@email.com",
      candidatePhone: "+1 234-567-8905",
      recruiter: "StartupXYZ",
      recruiterContact: "tom.startup@startupxyz.com",
      position: "Full Stack Developer",
      offeredSalary: "$100,000",
      candidateExpectedSalary: "$95,000",
      location: "Los Angeles, CA",
      candidatePreferredLocation: "Los Angeles, CA",
      offerDate: "2024-01-16",
      responseDeadline: "2024-01-23",
      status: "expired",
      responseDate: null,
      declineCount: 0,
      notes: "No response within deadline",
      benefits: ["Health Insurance", "401k", "Equity"],
      startDate: "2024-02-01"
    }
  ]);

  const [newOffer, setNewOffer] = useState({
    candidateId: "",
    candidateName: "",
    candidateEmail: "",
    candidatePhone: "",
    recruiter: "",
    recruiterContact: "",
    position: "",
    offeredSalary: "",
    candidateExpectedSalary: "",
    location: "",
    candidatePreferredLocation: "",
    responseDeadline: "",
    notes: "",
    benefits: [],
    startDate: ""
  });

  const filteredOffers = offers.filter(offer =>
    offer.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.candidateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.recruiter.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.position.toLowerCase().includes(searchTerm.toLowerCase())
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
      candidateId: "",
      candidateName: "",
      candidateEmail: "",
      candidatePhone: "",
      recruiter: "",
      recruiterContact: "",
      position: "",
      offeredSalary: "",
      candidateExpectedSalary: "",
      location: "",
      candidatePreferredLocation: "",
      responseDeadline: "",
      notes: "",
      benefits: [],
      startDate: ""
    });
    setShowOfferModal(true);
  };

  const handleEditOffer = (offer) => {
    setSelectedOffer(offer);
    setNewOffer(offer);
    setShowEditModal(true);
  };

  const handleSaveOffer = () => {
    if (selectedOffer) {
      // Update existing offer
      setOffers(prev => prev.map(offer => 
        offer.id === selectedOffer.id 
          ? { ...newOffer, id: selectedOffer.id, offerDate: selectedOffer.offerDate }
          : offer
      ));
      setShowEditModal(false);
    } else {
      // Add new offer
      const newId = Math.max(...offers.map(o => o.id)) + 1;
      setOffers(prev => [...prev, {
        ...newOffer,
        id: newId,
        status: "pending",
        offerDate: new Date().toISOString().split('T')[0],
        responseDate: null,
        declineCount: 0
      }]);
      setShowOfferModal(false);
    }
    setSelectedOffer(null);
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
    const offeredNum = parseInt(offered.replace(/[$,]/g, ''));
    const expectedNum = parseInt(expected.replace(/[$,]/g, ''));
    
    if (offeredNum >= expectedNum) {
      return { icon: TrendingUp, color: "text-green-600", text: "Meets/Exceeds" };
    } else {
      return { icon: TrendingDown, color: "text-red-600", text: "Below Expected" };
    }
  };

  const getLocationMatch = (offered, preferred) => {
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Candidate ID</label>
                    <input
                      type="text"
                      value={newOffer.candidateId}
                      onChange={(e) => setNewOffer(prev => ({ ...prev, candidateId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="TSC-2024-XXXX"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Name</label>
                    <input
                      type="text"
                      value={newOffer.candidateName}
                      onChange={(e) => setNewOffer(prev => ({ ...prev, candidateName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Enter candidate name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={newOffer.candidateEmail}
                      onChange={(e) => setNewOffer(prev => ({ ...prev, candidateEmail: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="candidate@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={newOffer.candidatePhone}
                      onChange={(e) => setNewOffer(prev => ({ ...prev, candidatePhone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="+1 234-567-8900"
                    />
                  </div>
                </div>

                {/* Offer Details */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Offer Details</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <input
                      type="text"
                      value={newOffer.position}
                      onChange={(e) => setNewOffer(prev => ({ ...prev, position: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Job position"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recruiter</label>
                    <input
                      type="text"
                      value={newOffer.recruiter}
                      onChange={(e) => setNewOffer(prev => ({ ...prev, recruiter: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Company name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recruiter Contact</label>
                    <input
                      type="email"
                      value={newOffer.recruiterContact}
                      onChange={(e) => setNewOffer(prev => ({ ...prev, recruiterContact: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="recruiter@example.com"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Offered Salary</label>
                      <input
                        type="text"
                        value={newOffer.offeredSalary}
                        onChange={(e) => setNewOffer(prev => ({ ...prev, offeredSalary: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="$120,000"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expected Salary</label>
                      <input
                        type="text"
                        value={newOffer.candidateExpectedSalary}
                        onChange={(e) => setNewOffer(prev => ({ ...prev, candidateExpectedSalary: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="$120,000"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={newOffer.location}
                        onChange={(e) => setNewOffer(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Remote, City, State"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Location</label>
                      <input
                        type="text"
                        value={newOffer.candidatePreferredLocation}
                        onChange={(e) => setNewOffer(prev => ({ ...prev, candidatePreferredLocation: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Remote, City, State"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Response Deadline</label>
                      <input
                        type="date"
                        value={newOffer.responseDeadline}
                        onChange={(e) => setNewOffer(prev => ({ ...prev, responseDeadline: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={newOffer.startDate}
                        onChange={(e) => setNewOffer(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
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
                            }}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{benefit}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      rows={3}
                      value={newOffer.notes}
                      onChange={(e) => setNewOffer(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Additional notes about the offer..."
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 p-6 border-t">
              <button
                onClick={() => {
                  setShowOfferModal(false);
                  setShowEditModal(false);
                  setSelectedOffer(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md border border-gray-300 hover:bg-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOffer}
                className="px-4 py-2 bg-emerald-500 text-white rounded-md border border-emerald-600 hover:bg-emerald-600 transition-all duration-200"
              >
                {showEditModal ? "Update Offer" : "Create Offer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferManagement;
