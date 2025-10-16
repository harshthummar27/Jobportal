import React, { useState } from "react";
import { 
  Users, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  Building2, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  MoreVertical,
  Eye,
  MessageSquare,
  UserCheck
} from "lucide-react";
import { useSearch } from "../../Components/InternalTeamLayout";

const CandidateSelections = () => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [showContactModal, setShowContactModal] = useState(false);
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
      recruiterContact: "john.recruiter@cloudfirst.com",
      selectedDate: "2024-01-15",
      status: "pending_contact",
      skills: ["React", "Node.js", "TypeScript"],
      experience: "5 years",
      expectedSalary: "$120,000",
      preferredLocation: "Remote",
      lastContact: null,
      notes: "Strong technical background, looking for senior role"
    },
    {
      id: 2,
      candidateId: "TSC-2024-2848",
      name: "Michael Johnson",
      email: "michael.j@email.com",
      phone: "+1 234-567-8902",
      location: "Austin, TX",
      recruiter: "TechCorp Inc.",
      recruiterContact: "sarah.tech@techcorp.com",
      selectedDate: "2024-01-14",
      status: "contacted",
      skills: ["Python", "Django", "AWS"],
      experience: "7 years",
      expectedSalary: "$130,000",
      preferredLocation: "Austin, TX",
      lastContact: "2024-01-15",
      notes: "Interested in backend development role"
    },
    {
      id: 3,
      candidateId: "TSC-2024-2849",
      name: "Sarah Williams",
      email: "sarah.w@email.com",
      phone: "+1 234-567-8903",
      location: "Seattle, WA",
      recruiter: "DataFlow Solutions",
      recruiterContact: "mike.data@dataflow.com",
      selectedDate: "2024-01-13",
      status: "interview_scheduled",
      skills: ["Data Science", "Machine Learning", "Python"],
      experience: "4 years",
      expectedSalary: "$110,000",
      preferredLocation: "Seattle, WA",
      lastContact: "2024-01-14",
      notes: "Data scientist with ML expertise"
    },
    {
      id: 4,
      candidateId: "TSC-2024-2850",
      name: "David Brown",
      email: "david.brown@email.com",
      phone: "+1 234-567-8904",
      location: "New York, NY",
      recruiter: "InnovateTech",
      recruiterContact: "lisa.innovate@innovatetech.com",
      selectedDate: "2024-01-12",
      status: "interview_completed",
      skills: ["Java", "Spring Boot", "Microservices"],
      experience: "6 years",
      expectedSalary: "$125,000",
      preferredLocation: "New York, NY",
      lastContact: "2024-01-13",
      notes: "Completed technical interview, awaiting feedback"
    },
    {
      id: 5,
      candidateId: "TSC-2024-2851",
      name: "Emma Davis",
      email: "emma.davis@email.com",
      phone: "+1 234-567-8905",
      location: "Los Angeles, CA",
      recruiter: "StartupXYZ",
      recruiterContact: "tom.startup@startupxyz.com",
      selectedDate: "2024-01-11",
      status: "offer_sent",
      skills: ["Vue.js", "Node.js", "MongoDB"],
      experience: "3 years",
      expectedSalary: "$95,000",
      preferredLocation: "Los Angeles, CA",
      lastContact: "2024-01-12",
      notes: "Offer sent, waiting for response"
    }
  ]);

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.candidateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.recruiter.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const handleContactCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setShowContactModal(true);
  };

  const handleUpdateStatus = (candidateId, newStatus) => {
    setCandidates(prev => prev.map(candidate => 
      candidate.id === candidateId 
        ? { ...candidate, status: newStatus, lastContact: new Date().toISOString().split('T')[0] }
        : candidate
    ));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending_contact: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pending Contact" },
      contacted: { color: "bg-blue-100 text-blue-800", icon: MessageSquare, label: "Contacted" },
      interview_scheduled: { color: "bg-purple-100 text-purple-800", icon: Calendar, label: "Interview Scheduled" },
      interview_completed: { color: "bg-indigo-100 text-indigo-800", icon: CheckCircle, label: "Interview Completed" },
      offer_sent: { color: "bg-orange-100 text-orange-800", icon: AlertCircle, label: "Offer Sent" }
    };
    
    const config = statusConfig[status] || statusConfig.pending_contact;
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
      pending: candidates.filter(c => c.status === 'pending_contact').length,
      contacted: candidates.filter(c => c.status === 'contacted').length,
      scheduled: candidates.filter(c => c.status === 'interview_scheduled').length,
      completed: candidates.filter(c => c.status === 'interview_completed').length,
      offered: candidates.filter(c => c.status === 'offer_sent').length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="w-full max-w-none">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Contact</p>
              <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Contacted</p>
              <p className="text-2xl font-bold text-blue-600">{statusCounts.contacted}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-purple-600">{statusCounts.scheduled}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-indigo-600">{statusCounts.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Offers Sent</p>
              <p className="text-2xl font-bold text-orange-600">{statusCounts.offered}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-600" />
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
              <button className="flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white text-sm rounded-md border border-emerald-600 hover:bg-emerald-600 transition-all duration-200 shadow-sm">
                <MessageSquare className="h-4 w-4" />
                Bulk Contact
              </button>
              <button className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-sm rounded-md border border-blue-600 hover:bg-blue-600 transition-all duration-200 shadow-sm">
                <Calendar className="h-4 w-4" />
                Schedule Interviews
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Candidates Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
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
                  Skills
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Selected Date
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
                    <div className="text-sm text-gray-500">{candidate.recruiterContact}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 2).map((skill, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 2 && (
                        <span className="inline-block bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">
                          +{candidate.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(candidate.status)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">{candidate.selectedDate}</div>
                    {candidate.lastContact && (
                      <div className="text-sm text-gray-500">Last contact: {candidate.lastContact}</div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleContactCandidate(candidate)}
                        className="flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white text-xs rounded border border-emerald-600 hover:bg-emerald-600 transition-all duration-200 shadow-sm"
                      >
                        <MessageSquare className="h-3 w-3" />
                        Contact
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(candidate.id, 'interview_scheduled')}
                        className="flex items-center gap-1 px-2 py-1 bg-purple-500 text-white text-xs rounded border border-purple-600 hover:bg-purple-600 transition-all duration-200 shadow-sm"
                      >
                        <Calendar className="h-3 w-3" />
                        Schedule
                      </button>
                      <button className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-300 hover:bg-gray-200 transition-all duration-200 shadow-sm">
                        <Eye className="h-3 w-3" />
                        View
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
            <Users className="mx-auto h-8 w-8 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "No candidates match your search criteria." : "No candidates have been selected yet."}
            </p>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      {showContactModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Contact Candidate</h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <h4 className="text-md font-medium text-gray-900 mb-2">{selectedCandidate.name}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div><strong>Email:</strong> {selectedCandidate.email}</div>
                  <div><strong>Phone:</strong> {selectedCandidate.phone}</div>
                  <div><strong>Location:</strong> {selectedCandidate.location}</div>
                  <div><strong>Expected Salary:</strong> {selectedCandidate.expectedSalary}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Method</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                    <option value="email">Email</option>
                    <option value="phone">Phone Call</option>
                    <option value="both">Both Email & Phone</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter your message to the candidate..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Next Action</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                    <option value="schedule_interview">Schedule Interview</option>
                    <option value="send_offer">Send Job Offer</option>
                    <option value="follow_up">Follow Up Later</option>
                    <option value="no_action">No Specific Action</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowContactModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md border border-gray-300 hover:bg-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleUpdateStatus(selectedCandidate.id, 'contacted');
                  setShowContactModal(false);
                }}
                className="px-4 py-2 bg-emerald-500 text-white rounded-md border border-emerald-600 hover:bg-emerald-600 transition-all duration-200"
              >
                Send Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateSelections;
