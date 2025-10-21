import React, { useState } from "react";
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Send,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  User,
  Building2
} from "lucide-react";
import { useSearch } from "../../Components/InternalTeamLayout";

const Communication = () => {
  const [selectedCommunications, setSelectedCommunications] = useState([]);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCommunication, setSelectedCommunication] = useState(null);
  const { searchTerm } = useSearch();

  // Mock data - in real app, replace with API call
  const [communications, setCommunications] = useState([
    {
      id: 1,
      candidateId: "TSC-2024-2847",
      candidateName: "Grace Chen",
      candidateEmail: "grace.chen@email.com",
      candidatePhone: "+1 234-567-8901",
      recruiter: "CloudFirst Technologies",
      recruiterContact: "john.recruiter@cloudfirst.com",
      communicationType: "email",
      subject: "Interview Scheduling - Senior React Developer Position",
      message: "Hi Grace, I hope this email finds you well. We have received your application for the Senior React Developer position at CloudFirst Technologies. We would like to schedule a technical interview with you. Please let us know your availability for the next week.",
      sentDate: "2024-01-15",
      sentTime: "10:30 AM",
      status: "sent",
      responseReceived: false,
      responseDate: null,
      internalTeamMember: "Sarah HR",
      priority: "high",
      followUpRequired: true,
      followUpDate: "2024-01-18"
    },
    {
      id: 2,
      candidateId: "TSC-2024-2848",
      candidateName: "Michael Johnson",
      candidateEmail: "michael.j@email.com",
      candidatePhone: "+1 234-567-8902",
      recruiter: "TechCorp Inc.",
      recruiterContact: "sarah.tech@techcorp.com",
      communicationType: "phone",
      subject: "Phone Call - Backend Developer Position Discussion",
      message: "Called Michael to discuss the Backend Developer position. He expressed strong interest and is available for interviews next week. Discussed salary expectations and location preferences.",
      sentDate: "2024-01-14",
      sentTime: "2:15 PM",
      status: "completed",
      responseReceived: true,
      responseDate: "2024-01-14",
      internalTeamMember: "Mike Tech",
      priority: "medium",
      followUpRequired: false,
      followUpDate: null
    },
    {
      id: 3,
      candidateId: "TSC-2024-2849",
      candidateName: "Sarah Williams",
      candidateEmail: "sarah.w@email.com",
      candidatePhone: "+1 234-567-8903",
      recruiter: "DataFlow Solutions",
      recruiterContact: "mike.data@dataflow.com",
      communicationType: "email",
      subject: "Job Offer - Data Scientist Position",
      message: "Dear Sarah, We are pleased to offer you the Data Scientist position at DataFlow Solutions. The offer includes a salary of $115,000, comprehensive benefits, and the opportunity to work with cutting-edge machine learning technologies. Please respond by January 25th, 2024.",
      sentDate: "2024-01-18",
      sentTime: "9:00 AM",
      status: "sent",
      responseReceived: false,
      responseDate: null,
      internalTeamMember: "Jennifer Interviewer",
      priority: "high",
      followUpRequired: true,
      followUpDate: "2024-01-22"
    },
    {
      id: 4,
      candidateId: "TSC-2024-2850",
      candidateName: "David Brown",
      candidateEmail: "david.brown@email.com",
      candidatePhone: "+1 234-567-8904",
      recruiter: "InnovateTech",
      recruiterContact: "lisa.innovate@innovatetech.com",
      communicationType: "email",
      subject: "Interview Feedback - Java Developer Position",
      message: "Hi David, Thank you for taking the time to interview with us for the Java Developer position. We have completed our evaluation and unfortunately, we will not be moving forward with your application at this time. We appreciate your interest in InnovateTech.",
      sentDate: "2024-01-17",
      sentTime: "4:30 PM",
      status: "sent",
      responseReceived: true,
      responseDate: "2024-01-18",
      internalTeamMember: "Sarah HR",
      priority: "low",
      followUpRequired: false,
      followUpDate: null
    },
    {
      id: 5,
      candidateId: "TSC-2024-2851",
      candidateName: "Emma Davis",
      candidateEmail: "emma.davis@email.com",
      candidatePhone: "+1 234-567-8905",
      recruiter: "StartupXYZ",
      recruiterContact: "tom.startup@startupxyz.com",
      communicationType: "phone",
      subject: "Follow-up Call - Full Stack Developer Position",
      message: "Called Emma to follow up on the job offer. She mentioned she is still considering the offer and will provide a response by the end of the week. She had some questions about the remote work policy and benefits package.",
      sentDate: "2024-01-19",
      sentTime: "11:45 AM",
      status: "completed",
      responseReceived: true,
      responseDate: "2024-01-19",
      internalTeamMember: "Mike Tech",
      priority: "medium",
      followUpRequired: true,
      followUpDate: "2024-01-24"
    }
  ]);

  const [newCommunication, setNewCommunication] = useState({
    candidateId: "",
    candidateName: "",
    candidateEmail: "",
    candidatePhone: "",
    recruiter: "",
    recruiterContact: "",
    communicationType: "email",
    subject: "",
    message: "",
    priority: "medium",
    followUpRequired: false,
    followUpDate: ""
  });

  const filteredCommunications = communications.filter(communication =>
    communication.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    communication.candidateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    communication.recruiter.toLowerCase().includes(searchTerm.toLowerCase()) ||
    communication.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    communication.internalTeamMember.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCommunication = (communicationId) => {
    setSelectedCommunications(prev => 
      prev.includes(communicationId) 
        ? prev.filter(id => id !== communicationId)
        : [...prev, communicationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCommunications.length === filteredCommunications.length) {
      setSelectedCommunications([]);
    } else {
      setSelectedCommunications(filteredCommunications.map(c => c.id));
    }
  };

  const handleComposeMessage = () => {
    setNewCommunication({
      candidateId: "",
      candidateName: "",
      candidateEmail: "",
      candidatePhone: "",
      recruiter: "",
      recruiterContact: "",
      communicationType: "email",
      subject: "",
      message: "",
      priority: "medium",
      followUpRequired: false,
      followUpDate: ""
    });
    setShowComposeModal(true);
  };

  const handleViewCommunication = (communication) => {
    setSelectedCommunication(communication);
    setShowViewModal(true);
  };

  const handleSendMessage = () => {
    if (!newCommunication.candidateName || !newCommunication.subject || !newCommunication.message) {
      alert("Please fill in all required fields");
      return;
    }

    const newId = Math.max(...communications.map(c => c.id)) + 1;
    const now = new Date();
    const sentDate = now.toISOString().split('T')[0];
    const sentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setCommunications(prev => [...prev, {
      ...newCommunication,
      id: newId,
      sentDate,
      sentTime,
      status: "sent",
      responseReceived: false,
      responseDate: null,
      internalTeamMember: "Sarah HR" // Current user
    }]);

    setShowComposeModal(false);
  };

  const handleUpdateStatus = (communicationId, newStatus) => {
    setCommunications(prev => prev.map(communication => 
      communication.id === communicationId 
        ? { 
            ...communication, 
            status: newStatus,
            responseReceived: newStatus === 'completed',
            responseDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : null
          }
        : communication
    ));
  };

  const handleDeleteCommunication = (communicationId) => {
    if (window.confirm("Are you sure you want to delete this communication?")) {
      setCommunications(prev => prev.filter(communication => communication.id !== communicationId));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      sent: { color: "bg-blue-100 text-blue-800", icon: Send, label: "Sent" },
      completed: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Completed" },
      failed: { color: "bg-red-100 text-red-800", icon: XCircle, label: "Failed" },
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pending" }
    };
    
    const config = statusConfig[status] || statusConfig.sent;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { color: "bg-red-100 text-red-800", label: "High" },
      medium: { color: "bg-yellow-100 text-yellow-800", label: "Medium" },
      low: { color: "bg-green-100 text-green-800", label: "Low" }
    };
    
    const config = priorityConfig[priority] || priorityConfig.medium;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getCommunicationIcon = (type) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4 text-blue-600" />;
      case 'phone':
        return <Phone className="h-4 w-4 text-green-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusCounts = () => {
    return {
      sent: communications.filter(c => c.status === 'sent').length,
      completed: communications.filter(c => c.status === 'completed').length,
      pending: communications.filter(c => c.status === 'pending').length,
      total: communications.length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="w-full max-w-none">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sent</p>
              <p className="text-2xl font-bold text-blue-600">{statusCounts.sent}</p>
            </div>
            <Send className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
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
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-600">{statusCounts.total}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Compose Button */}
      <div className="mb-6">
        <div className="flex justify-end">
          <button
            onClick={handleComposeMessage}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-md border border-emerald-600 hover:bg-emerald-600 transition-all duration-200 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Compose Message
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedCommunications.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-emerald-800 font-medium text-sm">
              {selectedCommunications.length} communication(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white text-sm rounded-md border border-emerald-600 hover:bg-emerald-600 transition-all duration-200 shadow-sm">
                <Send className="h-4 w-4" />
                Mark as Completed
              </button>
              <button className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-sm rounded-md border border-blue-600 hover:bg-blue-600 transition-all duration-200 shadow-sm">
                <Edit className="h-4 w-4" />
                Bulk Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Communications Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCommunications.length === filteredCommunications.length && filteredCommunications.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Communication
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recruiter
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Priority
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCommunications.map((communication) => (
                <tr key={communication.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCommunications.includes(communication.id)}
                      onChange={() => handleSelectCommunication(communication.id)}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{communication.candidateName}</div>
                        <div className="text-sm text-gray-500">{communication.candidateId}</div>
                        <div className="text-sm text-gray-500">{communication.candidateEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center mb-1">
                      {getCommunicationIcon(communication.communicationType)}
                      <span className="ml-2 text-sm font-medium text-gray-900">{communication.subject}</span>
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{communication.message}</div>
                    {communication.followUpRequired && (
                      <div className="text-xs text-orange-600 mt-1">Follow-up required: {communication.followUpDate}</div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">{communication.recruiter}</div>
                    <div className="text-sm text-gray-500">{communication.recruiterContact}</div>
                    <div className="text-sm text-gray-500">By: {communication.internalTeamMember}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">{communication.sentDate}</div>
                    <div className="text-sm text-gray-500">{communication.sentTime}</div>
                    {communication.responseReceived && communication.responseDate && (
                      <div className="text-xs text-green-600">Response: {communication.responseDate}</div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      {getStatusBadge(communication.status)}
                      {getPriorityBadge(communication.priority)}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      {communication.status === 'sent' && (
                        <button
                          onClick={() => handleUpdateStatus(communication.id, 'completed')}
                          className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs rounded border border-green-600 hover:bg-green-600 transition-all duration-200 shadow-sm"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => handleViewCommunication(communication)}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-300 hover:bg-gray-200 transition-all duration-200 shadow-sm"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </button>
                      <button className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs rounded border border-blue-600 hover:bg-blue-600 transition-all duration-200 shadow-sm">
                        <Edit className="h-3 w-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCommunication(communication.id)}
                        className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs rounded border border-red-600 hover:bg-red-600 transition-all duration-200 shadow-sm"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredCommunications.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="mx-auto h-8 w-8 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No communications found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "No communications match your search criteria." : "No communications have been sent yet."}
            </p>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Compose Message</h3>
              <button
                onClick={() => setShowComposeModal(false)}
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
                      value={newCommunication.candidateId}
                      onChange={(e) => setNewCommunication(prev => ({ ...prev, candidateId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="TSC-2024-XXXX"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Name</label>
                    <input
                      type="text"
                      value={newCommunication.candidateName}
                      onChange={(e) => setNewCommunication(prev => ({ ...prev, candidateName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Enter candidate name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={newCommunication.candidateEmail}
                      onChange={(e) => setNewCommunication(prev => ({ ...prev, candidateEmail: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="candidate@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={newCommunication.candidatePhone}
                      onChange={(e) => setNewCommunication(prev => ({ ...prev, candidatePhone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="+1 234-567-8900"
                    />
                  </div>
                </div>

                {/* Message Details */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Message Details</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recruiter</label>
                    <input
                      type="text"
                      value={newCommunication.recruiter}
                      onChange={(e) => setNewCommunication(prev => ({ ...prev, recruiter: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Company name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recruiter Contact</label>
                    <input
                      type="email"
                      value={newCommunication.recruiterContact}
                      onChange={(e) => setNewCommunication(prev => ({ ...prev, recruiterContact: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="recruiter@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Communication Type</label>
                    <select
                      value={newCommunication.communicationType}
                      onChange={(e) => setNewCommunication(prev => ({ ...prev, communicationType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone Call</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                    <input
                      type="text"
                      value={newCommunication.subject}
                      onChange={(e) => setNewCommunication(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Message subject"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={newCommunication.priority}
                      onChange={(e) => setNewCommunication(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea
                      rows={6}
                      value={newCommunication.message}
                      onChange={(e) => setNewCommunication(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Enter your message..."
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newCommunication.followUpRequired}
                      onChange={(e) => setNewCommunication(prev => ({ ...prev, followUpRequired: e.target.checked }))}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">Follow-up required</label>
                  </div>
                  
                  {newCommunication.followUpRequired && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                      <input
                        type="date"
                        value={newCommunication.followUpDate}
                        onChange={(e) => setNewCommunication(prev => ({ ...prev, followUpDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowComposeModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md border border-gray-300 hover:bg-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-emerald-500 text-white rounded-md border border-emerald-600 hover:bg-emerald-600 transition-all duration-200"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Communication Modal */}
      {showViewModal && selectedCommunication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Communication Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
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
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="space-y-2 text-sm">
                      <div><strong>Name:</strong> {selectedCommunication.candidateName}</div>
                      <div><strong>ID:</strong> {selectedCommunication.candidateId}</div>
                      <div><strong>Email:</strong> {selectedCommunication.candidateEmail}</div>
                      <div><strong>Phone:</strong> {selectedCommunication.candidatePhone}</div>
                    </div>
                  </div>
                </div>

                {/* Communication Details */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Communication Details</h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="space-y-2 text-sm">
                      <div><strong>Type:</strong> {selectedCommunication.communicationType}</div>
                      <div><strong>Recruiter:</strong> {selectedCommunication.recruiter}</div>
                      <div><strong>Contact:</strong> {selectedCommunication.recruiterContact}</div>
                      <div><strong>Sent By:</strong> {selectedCommunication.internalTeamMember}</div>
                      <div><strong>Date:</strong> {selectedCommunication.sentDate} at {selectedCommunication.sentTime}</div>
                      <div><strong>Status:</strong> {selectedCommunication.status}</div>
                      <div><strong>Priority:</strong> {selectedCommunication.priority}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-900 mb-2">Subject</h4>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium">{selectedCommunication.subject}</p>
                </div>
                
                <h4 className="text-md font-medium text-gray-900 mb-2">Message</h4>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm whitespace-pre-wrap">{selectedCommunication.message}</p>
                </div>
                
                {selectedCommunication.followUpRequired && (
                  <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
                      <div className="text-sm text-orange-800">
                        <p className="font-medium">Follow-up Required</p>
                        <p>Follow-up date: {selectedCommunication.followUpDate}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md border border-gray-300 hover:bg-gray-200 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Communication;
