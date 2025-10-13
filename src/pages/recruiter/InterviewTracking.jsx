import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Users, MapPin, Video, Phone, MessageSquare, CheckCircle, XCircle, AlertCircle, Star, Filter, Search, Plus } from "lucide-react";
import DashboardHeader from "../../Components/DashboardHeader";

const mockInterviews = [
  {
    id: "INT-001",
    candidateCode: "TSC-2024-20045",
    candidateRole: "Product Manager",
    interviewer: "John Smith",
    type: "Technical Interview",
    scheduledDate: "2024-01-20",
    scheduledTime: "10:00 AM",
    duration: "60 minutes",
    status: "scheduled",
    location: "Conference Room A",
    meetingLink: "https://zoom.us/j/123456789",
    notes: "Focus on product strategy and leadership skills",
    priority: "high",
    round: "Final Round"
  },
  {
    id: "INT-002",
    candidateCode: "TSC-2024-20067",
    candidateRole: "UX Designer",
    interviewer: "Sarah Johnson",
    type: "Portfolio Review",
    scheduledDate: "2024-01-22",
    scheduledTime: "2:00 PM",
    duration: "45 minutes",
    status: "scheduled",
    location: "Design Studio",
    meetingLink: "https://zoom.us/j/987654321",
    notes: "Review design portfolio and user research experience",
    priority: "high",
    round: "Final Round"
  },
  {
    id: "INT-003",
    candidateCode: "TSC-2024-20031",
    candidateRole: "Senior Software Engineer",
    interviewer: "Mike Chen",
    type: "Technical Interview",
    scheduledDate: "2024-01-18",
    scheduledTime: "3:30 PM",
    duration: "90 minutes",
    status: "completed",
    location: "Conference Room B",
    meetingLink: "",
    notes: "Excellent technical skills, strong problem-solving abilities",
    priority: "high",
    round: "Technical Round",
    result: "passed",
    feedback: "Candidate demonstrated strong technical knowledge and good communication skills. Recommended for final round."
  },
  {
    id: "INT-004",
    candidateCode: "TSC-2024-20052",
    candidateRole: "Data Scientist",
    interviewer: "Lisa Wang",
    type: "Technical Interview",
    scheduledDate: "2024-01-16",
    scheduledTime: "11:00 AM",
    duration: "75 minutes",
    status: "completed",
    location: "Conference Room C",
    meetingLink: "",
    notes: "Focus on ML algorithms and data analysis",
    priority: "medium",
    round: "Technical Round",
    result: "pending",
    feedback: "Good technical knowledge but needs improvement in explaining complex concepts."
  },
  {
    id: "INT-005",
    candidateCode: "TSC-2024-20078",
    candidateRole: "DevOps Engineer",
    interviewer: "David Brown",
    type: "Technical Interview",
    scheduledDate: "2024-01-14",
    scheduledTime: "1:00 PM",
    duration: "60 minutes",
    status: "cancelled",
    location: "Conference Room A",
    meetingLink: "",
    notes: "Candidate cancelled due to personal reasons",
    priority: "low",
    round: "Initial Round",
    result: "cancelled",
    feedback: "Interview cancelled by candidate"
  }
];

const InterviewTracking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const getStatusClasses = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "rescheduled":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getResultClasses = (result) => {
    switch (result) {
      case "passed":
        return "bg-green-100 text-green-800 border-green-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredInterviews = mockInterviews.filter(interview => {
    const matchesSearch = interview.candidateCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.candidateRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.interviewer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || interview.status === statusFilter;
    const matchesType = typeFilter === "all" || interview.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleReschedule = (id) => {
    alert(`Reschedule interview ${id}`);
  };

  const handleCancel = (id) => {
    alert(`Cancel interview ${id}`);
  };

  const handleAddFeedback = (id) => {
    alert(`Add feedback for interview ${id}`);
  };

  const handleJoinMeeting = (meetingLink) => {
    if (meetingLink) {
      window.open(meetingLink, '_blank');
    } else {
      alert('No meeting link available');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader />
      
      <div className="pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Interview Tracking</h1>
                <p className="text-sm text-gray-600">Manage and track all candidate interviews</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/recruiter/shortlisted"
                  className="inline-flex items-center gap-1 bg-purple-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  <Users className="h-4 w-4" />
                  Shortlisted
                </Link>
                <button className="inline-flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-green-700 transition-colors">
                  <Plus className="h-4 w-4" />
                  Schedule
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div className="bg-white rounded border border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Total</p>
                  <p className="text-xl font-bold text-indigo-600">{mockInterviews.length}</p>
                </div>
                <Calendar className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
            
            <div className="bg-white rounded border border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Scheduled</p>
                  <p className="text-xl font-bold text-blue-600">
                    {mockInterviews.filter(i => i.status === "scheduled").length}
                  </p>
                </div>
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded border border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Completed</p>
                  <p className="text-xl font-bold text-green-600">
                    {mockInterviews.filter(i => i.status === "completed").length}
                  </p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white rounded border border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Passed</p>
                  <p className="text-xl font-bold text-emerald-600">
                    {mockInterviews.filter(i => i.result === "passed").length}
                  </p>
                </div>
                <Star className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded border border-gray-200 p-3 mb-4">
            <div className="flex flex-col lg:flex-row gap-2">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by candidate code, role, or interviewer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-200 rounded px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="rescheduled">Rescheduled</option>
                </select>
                
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="border border-gray-200 rounded px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">All Types</option>
                  <option value="Technical Interview">Technical Interview</option>
                  <option value="Portfolio Review">Portfolio Review</option>
                  <option value="HR Interview">HR Interview</option>
                  <option value="Final Round">Final Round</option>
                </select>
              </div>
            </div>
          </div>

          {/* Interviews Table */}
          <div className="bg-white rounded border border-gray-200 overflow-hidden">
            <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <h2 className="text-sm font-semibold text-gray-900">Interview Schedule</h2>
                </div>
                <div className="text-xs text-gray-500">
                  {filteredInterviews.length} interviews
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Interview Details</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Interviewer</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Result</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInterviews.map((interview) => (
                    <tr key={interview.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div>
                          <div className="text-xs font-semibold text-indigo-600">{interview.id}</div>
                          <div className="text-xs text-gray-500">{interview.type}</div>
                          <div className="text-xs text-gray-500">{interview.round}</div>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div>
                          <div className="text-xs font-medium text-gray-900">{interview.candidateCode}</div>
                          <div className="text-xs text-gray-500">{interview.candidateRole}</div>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-xs text-gray-900">{interview.interviewer}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div>
                          <div className="text-xs text-gray-900">{interview.scheduledDate}</div>
                          <div className="text-xs text-gray-500">{interview.scheduledTime}</div>
                          <div className="text-xs text-gray-500">{interview.duration}</div>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded border ${getStatusClasses(interview.status)}`}>
                          {interview.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {interview.result && (
                          <span className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded border ${getResultClasses(interview.result)}`}>
                            {interview.result}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
                        <div className="flex items-center gap-1">
                          {interview.status === "scheduled" && interview.meetingLink && (
                            <button
                              onClick={() => handleJoinMeeting(interview.meetingLink)}
                              className="text-green-600 hover:text-green-900 p-1 border border-green-200 rounded hover:bg-green-50 transition-colors"
                              title="Join Meeting"
                            >
                              <Video className="h-3 w-3" />
                            </button>
                          )}
                          
                          {interview.status === "completed" && (
                            <button
                              onClick={() => handleAddFeedback(interview.id)}
                              className="text-blue-600 hover:text-blue-900 p-1 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                              title="Add Feedback"
                            >
                              <MessageSquare className="h-3 w-3" />
                            </button>
                          )}
                          
                          {interview.status === "scheduled" && (
                            <>
                              <button
                                onClick={() => handleReschedule(interview.id)}
                                className="text-yellow-600 hover:text-yellow-900 p-1 border border-yellow-200 rounded hover:bg-yellow-50 transition-colors"
                                title="Reschedule"
                              >
                                <Clock className="h-3 w-3" />
                              </button>
                              
                              <button
                                onClick={() => handleCancel(interview.id)}
                                className="text-red-600 hover:text-red-900 p-1 border border-red-200 rounded hover:bg-red-50 transition-colors"
                                title="Cancel"
                              >
                                <XCircle className="h-3 w-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewTracking;
