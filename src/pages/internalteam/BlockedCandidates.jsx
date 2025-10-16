import React, { useState } from "react";
import { 
  UserX, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Users,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Building2,
  RotateCcw
} from "lucide-react";
import { useSearch } from "../../Components/InternalTeamLayout";

const BlockedCandidates = () => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [showUnblockModal, setShowUnblockModal] = useState(false);
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
      blockingReason: "Failed technical screening - insufficient coding skills",
      blockedDate: "2024-01-15",
      blockEndDate: "2024-07-15",
      status: "blocked",
      interviewer: "Mike Tech",
      notes: "Struggled with basic React concepts and system design questions",
      daysRemaining: 45,
      canUnblock: false
    },
    {
      id: 2,
      candidateId: "TSC-2024-2848",
      name: "Michael Johnson",
      email: "michael.j@email.com",
      phone: "+1 234-567-8902",
      location: "Austin, TX",
      recruiter: "TechCorp Inc.",
      blockingReason: "Failed behavioral interview - poor communication skills",
      blockedDate: "2024-01-14",
      blockEndDate: "2024-07-14",
      status: "blocked",
      interviewer: "Sarah HR",
      notes: "Unable to articulate technical concepts clearly",
      daysRemaining: 44,
      canUnblock: false
    },
    {
      id: 3,
      candidateId: "TSC-2024-2849",
      name: "Sarah Williams",
      email: "sarah.w@email.com",
      phone: "+1 234-567-8903",
      location: "Seattle, WA",
      recruiter: "DataFlow Solutions",
      blockingReason: "Declined 2 job offers that met salary and location requirements",
      blockedDate: "2024-01-13",
      blockEndDate: "2024-07-13",
      status: "blocked",
      interviewer: "Jennifer Interviewer",
      notes: "Declined offers from DataFlow ($115k, Seattle) and TechCorp ($120k, Seattle)",
      daysRemaining: 43,
      canUnblock: false
    },
    {
      id: 4,
      candidateId: "TSC-2024-2850",
      name: "David Brown",
      email: "david.brown@email.com",
      phone: "+1 234-567-8904",
      location: "New York, NY",
      recruiter: "InnovateTech",
      blockingReason: "Failed pre-screening - resume inconsistencies",
      blockedDate: "2024-01-12",
      blockEndDate: "2024-07-12",
      status: "blocked",
      interviewer: "Sarah HR",
      notes: "Experience claims did not match technical assessment results",
      daysRemaining: 42,
      canUnblock: false
    },
    {
      id: 5,
      candidateId: "TSC-2024-2851",
      name: "Emma Davis",
      email: "emma.davis@email.com",
      phone: "+1 234-567-8905",
      location: "Los Angeles, CA",
      recruiter: "StartupXYZ",
      blockingReason: "Failed technical screening - insufficient problem-solving skills",
      blockedDate: "2023-12-15",
      blockEndDate: "2024-06-15",
      status: "ready_for_unblock",
      interviewer: "Mike Tech",
      notes: "Blocking period has ended, ready for reinstatement",
      daysRemaining: 0,
      canUnblock: true
    },
    {
      id: 6,
      candidateId: "TSC-2024-2852",
      name: "Alex Rodriguez",
      email: "alex.r@email.com",
      phone: "+1 234-567-8906",
      location: "Miami, FL",
      recruiter: "CloudFirst Technologies",
      blockingReason: "Declined 2 job offers that met salary and location requirements",
      blockedDate: "2023-12-10",
      blockEndDate: "2024-06-10",
      status: "ready_for_unblock",
      interviewer: "Jennifer Interviewer",
      notes: "Blocking period has ended, ready for reinstatement",
      daysRemaining: 0,
      canUnblock: true
    }
  ]);

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

  const handleUnblockCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setShowUnblockModal(true);
  };

  const handleConfirmUnblock = () => {
    setCandidates(prev => prev.map(candidate => 
      candidate.id === selectedCandidate.id 
        ? { 
            ...candidate, 
            status: "active",
            blockingReason: null,
            blockedDate: null,
            blockEndDate: null,
            daysRemaining: 0,
            canUnblock: false
          }
        : candidate
    ));
    setShowUnblockModal(false);
    setSelectedCandidate(null);
  };

  const handleBulkUnblock = () => {
    if (selectedCandidates.length === 0) return;
    
    if (window.confirm(`Are you sure you want to unblock ${selectedCandidates.length} candidates?`)) {
      setCandidates(prev => prev.map(candidate => 
        selectedCandidates.includes(candidate.id) && candidate.canUnblock
          ? { 
              ...candidate, 
              status: "active",
              blockingReason: null,
              blockedDate: null,
              blockEndDate: null,
              daysRemaining: 0,
              canUnblock: false
            }
          : candidate
      ));
      setSelectedCandidates([]);
    }
  };

  const getStatusBadge = (status, daysRemaining) => {
    if (status === "ready_for_unblock") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3" />
          Ready for Unblock
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <UserX className="h-3 w-3" />
        Blocked ({daysRemaining} days left)
      </span>
    );
  };

  const getStatusCounts = () => {
    return {
      blocked: candidates.filter(c => c.status === 'blocked').length,
      ready_for_unblock: candidates.filter(c => c.status === 'ready_for_unblock').length,
      total: candidates.length
    };
  };

  const statusCounts = getStatusCounts();

  const getDaysRemainingColor = (daysRemaining) => {
    if (daysRemaining <= 0) return "text-green-600";
    if (daysRemaining <= 30) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="w-full max-w-none">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Currently Blocked</p>
              <p className="text-2xl font-bold text-red-600">{statusCounts.blocked}</p>
            </div>
            <UserX className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ready for Unblock</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.ready_for_unblock}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Blocked</p>
              <p className="text-2xl font-bold text-gray-600">{statusCounts.total}</p>
            </div>
            <Users className="h-8 w-8 text-gray-600" />
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
              <button
                onClick={handleBulkUnblock}
                className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-sm rounded-md border border-green-600 hover:bg-green-600 transition-all duration-200 shadow-sm"
              >
                <RotateCcw className="h-4 w-4" />
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
                  Blocking Details
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
              {filteredCandidates.map((candidate) => (
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
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <UserX className="h-5 w-5 text-red-600" />
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
                    <div className="text-sm text-gray-900 font-medium">{candidate.blockingReason}</div>
                    <div className="text-sm text-gray-500">Interviewer: {candidate.interviewer}</div>
                    <div className="text-sm text-gray-500">{candidate.notes}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">Blocked: {candidate.blockedDate}</div>
                    <div className="text-sm text-gray-500">Ends: {candidate.blockEndDate}</div>
                    <div className={`text-sm font-medium ${getDaysRemainingColor(candidate.daysRemaining)}`}>
                      {candidate.daysRemaining <= 0 ? 'Ready for unblock' : `${candidate.daysRemaining} days remaining`}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(candidate.status, candidate.daysRemaining)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      {candidate.canUnblock && (
                        <button
                          onClick={() => handleUnblockCandidate(candidate)}
                          className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs rounded border border-green-600 hover:bg-green-600 transition-all duration-200 shadow-sm"
                        >
                          <RotateCcw className="h-3 w-3" />
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
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredCandidates.length === 0 && (
          <div className="text-center py-8">
            <UserX className="mx-auto h-8 w-8 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No blocked candidates found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "No blocked candidates match your search criteria." : "No candidates are currently blocked."}
            </p>
          </div>
        )}
      </div>

      {/* Unblock Confirmation Modal */}
      {showUnblockModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Unblock Candidate</h3>
              <button
                onClick={() => setShowUnblockModal(false)}
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
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Blocking Information</h5>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>Reason:</strong> {selectedCandidate.blockingReason}</div>
                    <div><strong>Blocked Date:</strong> {selectedCandidate.blockedDate}</div>
                    <div><strong>Block End Date:</strong> {selectedCandidate.blockEndDate}</div>
                    <div><strong>Interviewer:</strong> {selectedCandidate.interviewer}</div>
                    <div><strong>Notes:</strong> {selectedCandidate.notes}</div>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm text-green-800">
                      <p className="font-medium">Ready for Unblock</p>
                      <p>This candidate's blocking period has ended. They will be reinstated and become visible to recruiters again.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowUnblockModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md border border-gray-300 hover:bg-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUnblock}
                className="px-4 py-2 bg-green-500 text-white rounded-md border border-green-600 hover:bg-green-600 transition-all duration-200"
              >
                Confirm Unblock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockedCandidates;
