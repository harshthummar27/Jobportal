import React, { useState } from "react";
import { 
  Shield, 
  UserX, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Calendar,
  Users,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Building2
} from "lucide-react";
import { useSearch } from "../../Components/InternalTeamLayout";

const ScreeningBlocking = () => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const { searchTerm } = useSearch();

  // Mock data - in real app, replace with API call
  const [candidates, setCandidates] = useState([
    {
      id: 1,
      candidateId: "TSC-2024-2847",
      name: "Grace Chen",
      email: "grace.chen@email.com",
      phone: "+1 234-567-8901",
      location: "San Francisco, CA",
      recruiter: "CloudFirst Technologies",
      screeningDate: "2024-01-15",
      screeningResult: "failed",
      blockingReason: "Failed technical screening - insufficient coding skills",
      blockedDate: "2024-01-15",
      blockEndDate: "2024-07-15",
      status: "blocked",
      interviewer: "Mike Tech",
      notes: "Struggled with basic React concepts and system design questions",
      previousOffers: 0,
      totalDeclines: 0
    },
    {
      id: 2,
      candidateId: "TSC-2024-2848",
      name: "Michael Johnson",
      email: "michael.j@email.com",
      phone: "+1 234-567-8902",
      location: "Austin, TX",
      recruiter: "TechCorp Inc.",
      screeningDate: "2024-01-14",
      screeningResult: "failed",
      blockingReason: "Failed behavioral interview - poor communication skills",
      blockedDate: "2024-01-14",
      blockEndDate: "2024-07-14",
      status: "blocked",
      interviewer: "Sarah HR",
      notes: "Unable to articulate technical concepts clearly",
      previousOffers: 0,
      totalDeclines: 0
    },
    {
      id: 3,
      candidateId: "TSC-2024-2849",
      name: "Sarah Williams",
      email: "sarah.w@email.com",
      phone: "+1 234-567-8903",
      location: "Seattle, WA",
      recruiter: "DataFlow Solutions",
      screeningDate: "2024-01-13",
      screeningResult: "failed",
      blockingReason: "Declined 2 job offers that met salary and location requirements",
      blockedDate: "2024-01-13",
      blockEndDate: "2024-07-13",
      status: "blocked",
      interviewer: "Jennifer Interviewer",
      notes: "Declined offers from DataFlow ($115k, Seattle) and TechCorp ($120k, Seattle)",
      previousOffers: 2,
      totalDeclines: 2
    },
    {
      id: 4,
      candidateId: "TSC-2024-2850",
      name: "David Brown",
      email: "david.brown@email.com",
      phone: "+1 234-567-8904",
      location: "New York, NY",
      recruiter: "InnovateTech",
      screeningDate: "2024-01-12",
      screeningResult: "failed",
      blockingReason: "Failed pre-screening - resume inconsistencies",
      blockedDate: "2024-01-12",
      blockEndDate: "2024-07-12",
      status: "blocked",
      interviewer: "Sarah HR",
      notes: "Experience claims did not match technical assessment results",
      previousOffers: 0,
      totalDeclines: 0
    },
    {
      id: 5,
      candidateId: "TSC-2024-2851",
      name: "Emma Davis",
      email: "emma.davis@email.com",
      phone: "+1 234-567-8905",
      location: "Los Angeles, CA",
      recruiter: "StartupXYZ",
      screeningDate: "2024-01-11",
      screeningResult: "pending",
      blockingReason: null,
      blockedDate: null,
      blockEndDate: null,
      status: "under_review",
      interviewer: "Mike Tech",
      notes: "Screening in progress - awaiting final assessment",
      previousOffers: 0,
      totalDeclines: 0
    },
    {
      id: 6,
      candidateId: "TSC-2024-2852",
      name: "Alex Rodriguez",
      email: "alex.r@email.com",
      phone: "+1 234-567-8906",
      location: "Miami, FL",
      recruiter: "CloudFirst Technologies",
      screeningDate: "2024-01-10",
      screeningResult: "passed",
      blockingReason: null,
      blockedDate: null,
      blockEndDate: null,
      status: "active",
      interviewer: "Jennifer Interviewer",
      notes: "Passed all screening rounds, ready for interviews",
      previousOffers: 0,
      totalDeclines: 0
    }
  ]);

  const [newBlock, setNewBlock] = useState({
    blockingReason: "",
    notes: "",
    blockDuration: 6
  });

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.candidateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.recruiter.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.blockingReason?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCandidate = (candidateId) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(filteredCandidates.map(c => c.id));
    }
  };

  const handleBlockCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setNewBlock({
      blockingReason: "",
      notes: "",
      blockDuration: 6
    });
    setShowBlockModal(true);
  };

  const handleUnblockCandidate = (candidateId) => {
    if (window.confirm("Are you sure you want to unblock this candidate?")) {
      setCandidates(prev => prev.map(candidate => 
        candidate.id === candidateId 
          ? { 
              ...candidate, 
              status: "active",
              blockingReason: null,
              blockedDate: null,
              blockEndDate: null
            }
          : candidate
      ));
    }
  };

  const handleSaveBlock = () => {
    if (!newBlock.blockingReason) {
      alert("Please provide a blocking reason");
      return;
    }

    const blockEndDate = new Date();
    blockEndDate.setMonth(blockEndDate.getMonth() + newBlock.blockDuration);

    setCandidates(prev => prev.map(candidate => 
      candidate.id === selectedCandidate.id 
        ? { 
            ...candidate, 
            status: "blocked",
            blockingReason: newBlock.blockingReason,
            blockedDate: new Date().toISOString().split('T')[0],
            blockEndDate: blockEndDate.toISOString().split('T')[0],
            notes: newBlock.notes
          }
        : candidate
    ));

    setShowBlockModal(false);
    setSelectedCandidate(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Active" },
      blocked: { color: "bg-red-100 text-red-800", icon: UserX, label: "Blocked" },
      under_review: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Under Review" }
    };
    
    const config = statusConfig[status] || statusConfig.active;
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
      active: candidates.filter(c => c.status === 'active').length,
      blocked: candidates.filter(c => c.status === 'blocked').length,
      under_review: candidates.filter(c => c.status === 'under_review').length,
      total: candidates.length
    };
  };

  const statusCounts = getStatusCounts();

  const getDaysUntilUnblock = (blockEndDate) => {
    if (!blockEndDate) return null;
    const today = new Date();
    const endDate = new Date(blockEndDate);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const blockingReasons = [
    "Failed technical screening",
    "Failed behavioral interview", 
    "Failed pre-screening assessment",
    "Declined 2+ job offers meeting requirements",
    "Resume inconsistencies",
    "Poor communication skills",
    "Insufficient technical skills",
    "Cultural fit issues",
    "Other (specify in notes)"
  ];

  return (
    <div className="w-full max-w-none">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Candidates</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.active}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Blocked Candidates</p>
              <p className="text-2xl font-bold text-red-600">{statusCounts.blocked}</p>
            </div>
            <UserX className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Under Review</p>
              <p className="text-2xl font-bold text-yellow-600">{statusCounts.under_review}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Candidates</p>
              <p className="text-2xl font-bold text-blue-600">{statusCounts.total}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedCandidates.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-emerald-800 font-medium text-sm">
              {selectedCandidates.length} candidate(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-sm rounded-md border border-red-600 hover:bg-red-600 transition-all duration-200 shadow-sm">
                <UserX className="h-4 w-4" />
                Bulk Block
              </button>
              <button className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-sm rounded-md border border-green-600 hover:bg-green-600 transition-all duration-200 shadow-sm">
                <CheckCircle className="h-4 w-4" />
                Bulk Unblock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Candidates Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCandidates.length === filteredCandidates.length && filteredCandidates.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recruiter
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Screening Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blocking Information
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
              {filteredCandidates.map((candidate) => {
                const daysUntilUnblock = getDaysUntilUnblock(candidate.blockEndDate);
                
                return (
                  <tr key={candidate.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.includes(candidate.id)}
                        onChange={() => handleSelectCandidate(candidate.id)}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                          <div className="text-sm text-gray-500">{candidate.candidateId}</div>
                          <div className="text-sm text-gray-500">{candidate.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{candidate.recruiter}</div>
                      <div className="text-sm text-gray-500">{candidate.email}</div>
                      <div className="text-sm text-gray-500">{candidate.phone}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">Date: {candidate.screeningDate}</div>
                      <div className="text-sm text-gray-500">Result: {candidate.screeningResult}</div>
                      <div className="text-sm text-gray-500">Interviewer: {candidate.interviewer}</div>
                    </td>
                    <td className="px-4 py-4">
                      {candidate.status === 'blocked' ? (
                        <div>
                          <div className="text-sm text-gray-900 font-medium">{candidate.blockingReason}</div>
                          <div className="text-sm text-gray-500">Blocked: {candidate.blockedDate}</div>
                          <div className="text-sm text-gray-500">Ends: {candidate.blockEndDate}</div>
                          {daysUntilUnblock !== null && (
                            <div className={`text-xs ${daysUntilUnblock <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {daysUntilUnblock <= 0 ? 'Ready for unblock' : `${daysUntilUnblock} days remaining`}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">Not blocked</div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(candidate.status)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        {candidate.status === 'active' && (
                          <button
                            onClick={() => handleBlockCandidate(candidate)}
                            className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs rounded border border-red-600 hover:bg-red-600 transition-all duration-200 shadow-sm"
                          >
                            <UserX className="h-3 w-3" />
                            Block
                          </button>
                        )}
                        {candidate.status === 'blocked' && daysUntilUnblock <= 0 && (
                          <button
                            onClick={() => handleUnblockCandidate(candidate.id)}
                            className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs rounded border border-green-600 hover:bg-green-600 transition-all duration-200 shadow-sm"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Unblock
                          </button>
                        )}
                        <button className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-300 hover:bg-gray-200 transition-all duration-200 shadow-sm">
                          <Eye className="h-3 w-3" />
                          View
                        </button>
                        <button className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs rounded border border-blue-600 hover:bg-blue-600 transition-all duration-200 shadow-sm">
                          <Edit className="h-3 w-3" />
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredCandidates.length === 0 && (
          <div className="text-center py-8">
            <Shield className="mx-auto h-8 w-8 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "No candidates match your search criteria." : "No candidates available for screening."}
            </p>
          </div>
        )}
      </div>

      {/* Block Candidate Modal */}
      {showBlockModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Block Candidate</h3>
              <button
                onClick={() => setShowBlockModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <h4 className="text-md font-medium text-gray-900 mb-2">{selectedCandidate.name}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div><strong>ID:</strong> {selectedCandidate.candidateId}</div>
                  <div><strong>Email:</strong> {selectedCandidate.email}</div>
                  <div><strong>Location:</strong> {selectedCandidate.location}</div>
                  <div><strong>Recruiter:</strong> {selectedCandidate.recruiter}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blocking Reason *</label>
                  <select
                    value={newBlock.blockingReason}
                    onChange={(e) => setNewBlock(prev => ({ ...prev, blockingReason: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Select a reason</option>
                    {blockingReasons.map(reason => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Block Duration (months)</label>
                  <select
                    value={newBlock.blockDuration}
                    onChange={(e) => setNewBlock(prev => ({ ...prev, blockDuration: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value={3}>3 months</option>
                    <option value={6}>6 months</option>
                    <option value={12}>12 months</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    rows={4}
                    value={newBlock.notes}
                    onChange={(e) => setNewBlock(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Provide additional details about the blocking reason..."
                  />
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium">Important:</p>
                      <p>Blocked candidates will be hidden from recruiters and excluded from searches for {newBlock.blockDuration} months. They can reapply after the blocking period ends.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowBlockModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md border border-gray-300 hover:bg-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBlock}
                className="px-4 py-2 bg-red-500 text-white rounded-md border border-red-600 hover:bg-red-600 transition-all duration-200"
              >
                Block Candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreeningBlocking;
