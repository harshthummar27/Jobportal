import React, { useState } from "react";
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Video, 
  Phone, 
  Building2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Edit, 
  Trash2,
  Eye,
  User,
  Mail
} from "lucide-react";
import { useSearch } from "../../Components/InternalTeamLayout";

const InterviewScheduling = () => {
  const [selectedInterviews, setSelectedInterviews] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const { searchTerm } = useSearch();

  // Mock data - in real app, replace with API call
  const [interviews, setInterviews] = useState([
    {
      id: 1,
      candidateId: "TSC-2024-2847",
      candidateName: "Grace Chen",
      candidateEmail: "grace.chen@email.com",
      candidatePhone: "+1 234-567-8901",
      recruiter: "CloudFirst Technologies",
      recruiterContact: "john.recruiter@cloudfirst.com",
      position: "Senior React Developer",
      interviewType: "Technical",
      scheduledDate: "2024-01-20",
      scheduledTime: "10:00 AM",
      duration: 60,
      location: "Remote (Zoom)",
      interviewer: "Mike Tech",
      interviewerEmail: "mike.tech@vettedpool.com",
      status: "scheduled",
      notes: "Focus on React, Node.js, and system design",
      meetingLink: "https://zoom.us/j/123456789",
      createdAt: "2024-01-15"
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
      interviewType: "Technical",
      scheduledDate: "2024-01-19",
      scheduledTime: "2:00 PM",
      duration: 90,
      location: "Office - TechCorp HQ",
      interviewer: "Sarah HR",
      interviewerEmail: "sarah.hr@vettedpool.com",
      status: "completed",
      notes: "Strong Python skills, good system design knowledge",
      meetingLink: null,
      createdAt: "2024-01-14",
      completedAt: "2024-01-19"
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
      interviewType: "Technical + HR",
      scheduledDate: "2024-01-22",
      scheduledTime: "11:00 AM",
      duration: 120,
      location: "Remote (Teams)",
      interviewer: "Jennifer Interviewer",
      interviewerEmail: "jennifer.interviewer@vettedpool.com",
      status: "scheduled",
      notes: "ML algorithms, data analysis, and cultural fit",
      meetingLink: "https://teams.microsoft.com/l/meetup-join/...",
      createdAt: "2024-01-16"
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
      interviewType: "HR",
      scheduledDate: "2024-01-18",
      scheduledTime: "3:00 PM",
      duration: 45,
      location: "Remote (Zoom)",
      interviewer: "Sarah HR",
      interviewerEmail: "sarah.hr@vettedpool.com",
      status: "cancelled",
      notes: "Candidate cancelled due to personal reasons",
      meetingLink: null,
      createdAt: "2024-01-13",
      cancelledAt: "2024-01-17"
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
      interviewType: "Technical",
      scheduledDate: "2024-01-21",
      scheduledTime: "1:00 PM",
      duration: 75,
      location: "Remote (Google Meet)",
      interviewer: "Mike Tech",
      interviewerEmail: "mike.tech@vettedpool.com",
      status: "scheduled",
      notes: "Vue.js, Node.js, and database design",
      meetingLink: "https://meet.google.com/abc-defg-hij",
      createdAt: "2024-01-17"
    }
  ]);

  const [newInterview, setNewInterview] = useState({
    candidateId: "",
    candidateName: "",
    candidateEmail: "",
    candidatePhone: "",
    recruiter: "",
    recruiterContact: "",
    position: "",
    interviewType: "Technical",
    scheduledDate: "",
    scheduledTime: "",
    duration: 60,
    location: "Remote (Zoom)",
    interviewer: "",
    interviewerEmail: "",
    notes: ""
  });

  const filteredInterviews = interviews.filter(interview =>
    interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.candidateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.recruiter.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.interviewer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectInterview = (interviewId) => {
    setSelectedInterviews(prev => 
      prev.includes(interviewId) 
        ? prev.filter(id => id !== interviewId)
        : [...prev, interviewId]
    );
  };

  const handleSelectAll = () => {
    if (selectedInterviews.length === filteredInterviews.length) {
      setSelectedInterviews([]);
    } else {
      setSelectedInterviews(filteredInterviews.map(i => i.id));
    }
  };

  const handleScheduleInterview = () => {
    setNewInterview({
      candidateId: "",
      candidateName: "",
      candidateEmail: "",
      candidatePhone: "",
      recruiter: "",
      recruiterContact: "",
      position: "",
      interviewType: "Technical",
      scheduledDate: "",
      scheduledTime: "",
      duration: 60,
      location: "Remote (Zoom)",
      interviewer: "",
      interviewerEmail: "",
      notes: ""
    });
    setShowScheduleModal(true);
  };

  const handleEditInterview = (interview) => {
    setSelectedInterview(interview);
    setNewInterview(interview);
    setShowEditModal(true);
  };

  const handleSaveInterview = () => {
    if (selectedInterview) {
      // Update existing interview
      setInterviews(prev => prev.map(interview => 
        interview.id === selectedInterview.id 
          ? { ...newInterview, id: selectedInterview.id, createdAt: selectedInterview.createdAt }
          : interview
      ));
      setShowEditModal(false);
    } else {
      // Add new interview
      const newId = Math.max(...interviews.map(i => i.id)) + 1;
      setInterviews(prev => [...prev, {
        ...newInterview,
        id: newId,
        status: "scheduled",
        createdAt: new Date().toISOString().split('T')[0]
      }]);
      setShowScheduleModal(false);
    }
    setSelectedInterview(null);
  };

  const handleUpdateStatus = (interviewId, newStatus) => {
    setInterviews(prev => prev.map(interview => 
      interview.id === interviewId 
        ? { 
            ...interview, 
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : null,
            cancelledAt: newStatus === 'cancelled' ? new Date().toISOString().split('T')[0] : null
          }
        : interview
    ));
  };

  const handleDeleteInterview = (interviewId) => {
    if (window.confirm("Are you sure you want to delete this interview?")) {
      setInterviews(prev => prev.filter(interview => interview.id !== interviewId));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { color: "bg-blue-100 text-blue-800", icon: Calendar, label: "Scheduled" },
      completed: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Completed" },
      cancelled: { color: "bg-red-100 text-red-800", icon: XCircle, label: "Cancelled" },
      rescheduled: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle, label: "Rescheduled" }
    };
    
    const config = statusConfig[status] || statusConfig.scheduled;
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
      scheduled: interviews.filter(i => i.status === 'scheduled').length,
      completed: interviews.filter(i => i.status === 'completed').length,
      cancelled: interviews.filter(i => i.status === 'cancelled').length,
      total: interviews.length
    };
  };

  const statusCounts = getStatusCounts();

  const interviewTypes = ["Technical", "HR", "Technical + HR", "Final Round"];
  const locations = ["Remote (Zoom)", "Remote (Teams)", "Remote (Google Meet)", "Office", "Phone Call"];
  const interviewers = ["Mike Tech", "Sarah HR", "Jennifer Interviewer", "David Analytics"];

  return (
    <div className="w-full max-w-none">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-blue-600">{statusCounts.scheduled}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
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
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">{statusCounts.cancelled}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-600">{statusCounts.total}</p>
            </div>
            <Users className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Add Interview Button */}
      <div className="mb-6">
        <div className="flex justify-end">
          <button
            onClick={handleScheduleInterview}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-md border border-emerald-600 hover:bg-emerald-600 transition-all duration-200 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Schedule Interview
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedInterviews.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-emerald-800 font-medium text-sm">
              {selectedInterviews.length} interview(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white text-sm rounded-md border border-emerald-600 hover:bg-emerald-600 transition-all duration-200 shadow-sm">
                <Mail className="h-4 w-4" />
                Send Reminders
              </button>
              <button className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-sm rounded-md border border-blue-600 hover:bg-blue-600 transition-all duration-200 shadow-sm">
                <Calendar className="h-4 w-4" />
                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interviews Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedInterviews.length === filteredInterviews.length && filteredInterviews.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position & Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interviewer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
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
              {filteredInterviews.map((interview) => (
                <tr key={interview.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedInterviews.includes(interview.id)}
                      onChange={() => handleSelectInterview(interview.id)}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{interview.candidateName}</div>
                        <div className="text-sm text-gray-500">{interview.candidateId}</div>
                        <div className="text-sm text-gray-500">{interview.candidateEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">{interview.position}</div>
                    <div className="text-sm text-gray-500">{interview.interviewType}</div>
                    <div className="text-sm text-gray-500">{interview.duration} minutes</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">{interview.scheduledDate}</div>
                    <div className="text-sm text-gray-500">{interview.scheduledTime}</div>
                    {interview.status === 'completed' && interview.completedAt && (
                      <div className="text-xs text-green-600">Completed: {interview.completedAt}</div>
                    )}
                    {interview.status === 'cancelled' && interview.cancelledAt && (
                      <div className="text-xs text-red-600">Cancelled: {interview.cancelledAt}</div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">{interview.interviewer}</div>
                    <div className="text-sm text-gray-500">{interview.interviewerEmail}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      {interview.location.includes('Remote') ? (
                        <Video className="h-4 w-4 mr-1 text-blue-500" />
                      ) : interview.location.includes('Phone') ? (
                        <Phone className="h-4 w-4 mr-1 text-green-500" />
                      ) : (
                        <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                      )}
                      {interview.location}
                    </div>
                    {interview.meetingLink && (
                      <a 
                        href={interview.meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Join Meeting
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(interview.status)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      {interview.status === 'scheduled' && (
                        <button
                          onClick={() => handleUpdateStatus(interview.id, 'completed')}
                          className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs rounded border border-green-600 hover:bg-green-600 transition-all duration-200 shadow-sm"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => handleEditInterview(interview)}
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
                        onClick={() => handleDeleteInterview(interview.id)}
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
        
        {filteredInterviews.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="mx-auto h-8 w-8 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No interviews found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "No interviews match your search criteria." : "No interviews have been scheduled yet."}
            </p>
          </div>
        )}
      </div>

      {/* Schedule/Edit Modal */}
      {(showScheduleModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {showEditModal ? "Edit Interview" : "Schedule New Interview"}
              </h3>
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setShowEditModal(false);
                  setSelectedInterview(null);
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
                      value={newInterview.candidateId}
                      onChange={(e) => setNewInterview(prev => ({ ...prev, candidateId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="TSC-2024-XXXX"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Name</label>
                    <input
                      type="text"
                      value={newInterview.candidateName}
                      onChange={(e) => setNewInterview(prev => ({ ...prev, candidateName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Enter candidate name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={newInterview.candidateEmail}
                      onChange={(e) => setNewInterview(prev => ({ ...prev, candidateEmail: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="candidate@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={newInterview.candidatePhone}
                      onChange={(e) => setNewInterview(prev => ({ ...prev, candidatePhone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="+1 234-567-8900"
                    />
                  </div>
                </div>

                {/* Interview Details */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Interview Details</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <input
                      type="text"
                      value={newInterview.position}
                      onChange={(e) => setNewInterview(prev => ({ ...prev, position: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Job position"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interview Type</label>
                    <select
                      value={newInterview.interviewType}
                      onChange={(e) => setNewInterview(prev => ({ ...prev, interviewType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      {interviewTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={newInterview.scheduledDate}
                        onChange={(e) => setNewInterview(prev => ({ ...prev, scheduledDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input
                        type="time"
                        value={newInterview.scheduledTime}
                        onChange={(e) => setNewInterview(prev => ({ ...prev, scheduledTime: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      value={newInterview.duration}
                      onChange={(e) => setNewInterview(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      min="15"
                      max="180"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <select
                      value={newInterview.location}
                      onChange={(e) => setNewInterview(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer</label>
                    <select
                      value={newInterview.interviewer}
                      onChange={(e) => setNewInterview(prev => ({ ...prev, interviewer: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="">Select interviewer</option>
                      {interviewers.map(interviewer => (
                        <option key={interviewer} value={interviewer}>{interviewer}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      rows={3}
                      value={newInterview.notes}
                      onChange={(e) => setNewInterview(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Interview notes, focus areas, etc."
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 p-6 border-t">
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setShowEditModal(false);
                  setSelectedInterview(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md border border-gray-300 hover:bg-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveInterview}
                className="px-4 py-2 bg-emerald-500 text-white rounded-md border border-emerald-600 hover:bg-emerald-600 transition-all duration-200"
              >
                {showEditModal ? "Update Interview" : "Schedule Interview"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewScheduling;
