import React, { useState } from "react";
import { 
  Activity, 
  Clock, 
  Calendar, 
  Filter, 
  Search,
  Users,
  UserCheck,
  UserX,
  Calendar as CalendarIcon,
  FileText,
  Shield,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Building2,
  Mail,
  Phone
} from "lucide-react";
import { useSearch } from "../../Components/InternalTeamLayout";

const ActivityLog = () => {
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const { searchTerm } = useSearch();

  // Mock data - in real app, replace with API call
  const [activities] = useState([
    {
      id: 1,
      type: "candidate_selected",
      title: "Candidate Selected by Recruiter",
      description: "Candidate TSC-2024-2847 (Grace Chen) was selected by CloudFirst Technologies for Senior React Developer position",
      timestamp: "2024-01-20T10:30:00Z",
      user: "Sarah HR",
      userRole: "Internal Team",
      candidateId: "TSC-2024-2847",
      candidateName: "Grace Chen",
      recruiter: "CloudFirst Technologies",
      status: "completed",
      priority: "medium",
      metadata: {
        position: "Senior React Developer",
        salary: "$125,000",
        location: "Remote"
      }
    },
    {
      id: 2,
      type: "interview_scheduled",
      title: "Interview Scheduled",
      description: "Technical interview scheduled for Grace Chen with CloudFirst Technologies on January 25th, 2024 at 2:00 PM",
      timestamp: "2024-01-20T11:15:00Z",
      user: "Mike Tech",
      userRole: "Internal Team",
      candidateId: "TSC-2024-2847",
      candidateName: "Grace Chen",
      recruiter: "CloudFirst Technologies",
      status: "completed",
      priority: "high",
      metadata: {
        interviewType: "Technical",
        duration: 60,
        location: "Remote (Zoom)",
        interviewer: "Mike Tech"
      }
    },
    {
      id: 3,
      type: "offer_sent",
      title: "Job Offer Sent",
      description: "Job offer sent to Michael Johnson for Backend Developer position at TechCorp Inc. with salary of $130,000",
      timestamp: "2024-01-19T14:20:00Z",
      user: "Jennifer Interviewer",
      userRole: "Internal Team",
      candidateId: "TSC-2024-2848",
      candidateName: "Michael Johnson",
      recruiter: "TechCorp Inc.",
      status: "completed",
      priority: "high",
      metadata: {
        position: "Backend Developer",
        salary: "$130,000",
        location: "Austin, TX",
        responseDeadline: "2024-01-26"
      }
    },
    {
      id: 4,
      type: "offer_accepted",
      title: "Job Offer Accepted",
      description: "Michael Johnson accepted the job offer for Backend Developer position at TechCorp Inc.",
      timestamp: "2024-01-22T09:45:00Z",
      user: "System",
      userRole: "System",
      candidateId: "TSC-2024-2848",
      candidateName: "Michael Johnson",
      recruiter: "TechCorp Inc.",
      status: "completed",
      priority: "high",
      metadata: {
        position: "Backend Developer",
        salary: "$130,000",
        startDate: "2024-02-01"
      }
    },
    {
      id: 5,
      type: "candidate_blocked",
      title: "Candidate Blocked",
      description: "David Brown blocked for 6 months due to declined 2 job offers that met salary and location requirements",
      timestamp: "2024-01-18T16:30:00Z",
      user: "Sarah HR",
      userRole: "Internal Team",
      candidateId: "TSC-2024-2850",
      candidateName: "David Brown",
      recruiter: "InnovateTech",
      status: "completed",
      priority: "medium",
      metadata: {
        blockingReason: "Declined 2 job offers meeting requirements",
        blockDuration: "6 months",
        blockEndDate: "2024-07-18"
      }
    },
    {
      id: 6,
      type: "communication_sent",
      title: "Communication Sent",
      description: "Follow-up email sent to Emma Davis regarding job offer for Full Stack Developer position",
      timestamp: "2024-01-19T11:45:00Z",
      user: "Mike Tech",
      userRole: "Internal Team",
      candidateId: "TSC-2024-2851",
      candidateName: "Emma Davis",
      recruiter: "StartupXYZ",
      status: "completed",
      priority: "medium",
      metadata: {
        communicationType: "email",
        subject: "Follow-up on Job Offer - Full Stack Developer",
        followUpRequired: true
      }
    },
    {
      id: 7,
      type: "interview_completed",
      title: "Interview Completed",
      description: "Technical interview completed for Sarah Williams with DataFlow Solutions. Interviewer: Jennifer Interviewer",
      timestamp: "2024-01-17T15:20:00Z",
      user: "Jennifer Interviewer",
      userRole: "Internal Team",
      candidateId: "TSC-2024-2849",
      candidateName: "Sarah Williams",
      recruiter: "DataFlow Solutions",
      status: "completed",
      priority: "medium",
      metadata: {
        interviewType: "Technical",
        duration: 90,
        result: "Passed",
        nextStep: "HR Interview"
      }
    },
    {
      id: 8,
      type: "screening_failed",
      title: "Screening Failed",
      description: "Pre-screening failed for Alex Rodriguez due to resume inconsistencies. Experience claims did not match technical assessment results",
      timestamp: "2024-01-16T13:10:00Z",
      user: "Sarah HR",
      userRole: "Internal Team",
      candidateId: "TSC-2024-2852",
      candidateName: "Alex Rodriguez",
      recruiter: "CloudFirst Technologies",
      status: "completed",
      priority: "low",
      metadata: {
        screeningType: "Pre-screening",
        failureReason: "Resume inconsistencies",
        nextAction: "Candidate blocked"
      }
    },
    {
      id: 9,
      type: "placement_success",
      title: "Successful Placement",
      description: "Successful placement: Emma Davis → StartupXYZ for Full Stack Developer position. Salary: $100,000",
      timestamp: "2024-01-15T12:00:00Z",
      user: "System",
      userRole: "System",
      candidateId: "TSC-2024-2851",
      candidateName: "Emma Davis",
      recruiter: "StartupXYZ",
      status: "completed",
      priority: "high",
      metadata: {
        position: "Full Stack Developer",
        salary: "$100,000",
        startDate: "2024-02-01",
        placementFee: "$15,000"
      }
    },
    {
      id: 10,
      type: "candidate_unblocked",
      title: "Candidate Unblocked",
      description: "Lisa Thompson unblocked after 6-month blocking period. Ready for reinstatement and new opportunities",
      timestamp: "2024-01-14T10:00:00Z",
      user: "Sarah HR",
      userRole: "Internal Team",
      candidateId: "TSC-2023-1234",
      candidateName: "Lisa Thompson",
      recruiter: "TechCorp Inc.",
      status: "completed",
      priority: "medium",
      metadata: {
        originalBlockingReason: "Failed technical screening",
        blockDuration: "6 months",
        unblockReason: "Blocking period ended"
      }
    }
  ]);

  const getActivityIcon = (type) => {
    const iconMap = {
      candidate_selected: Users,
      interview_scheduled: CalendarIcon,
      offer_sent: FileText,
      offer_accepted: CheckCircle,
      offer_declined: XCircle,
      candidate_blocked: Shield,
      candidate_unblocked: UserCheck,
      communication_sent: MessageSquare,
      interview_completed: CheckCircle,
      screening_failed: XCircle,
      placement_success: TrendingUp,
      system_update: Activity
    };
    
    return iconMap[type] || Activity;
  };

  const getActivityColor = (type) => {
    const colorMap = {
      candidate_selected: "text-blue-600",
      interview_scheduled: "text-purple-600",
      offer_sent: "text-orange-600",
      offer_accepted: "text-green-600",
      offer_declined: "text-red-600",
      candidate_blocked: "text-red-600",
      candidate_unblocked: "text-green-600",
      communication_sent: "text-indigo-600",
      interview_completed: "text-green-600",
      screening_failed: "text-red-600",
      placement_success: "text-emerald-600",
      system_update: "text-gray-600"
    };
    
    return colorMap[type] || "text-gray-600";
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Completed" },
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pending" },
      failed: { color: "bg-red-100 text-red-800", icon: XCircle, label: "Failed" }
    };
    
    const config = statusConfig[status] || statusConfig.completed;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.recruiter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || activity.type === filterType;
    
    const matchesDate = !filterDate || activity.timestamp.startsWith(filterDate);
    
    return matchesSearch && matchesType && matchesDate;
  });

  const handleSelectActivity = (activityId) => {
    setSelectedActivities(prev => 
      prev.includes(activityId) 
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const handleSelectAll = () => {
    if (selectedActivities.length === filteredActivities.length) {
      setSelectedActivities([]);
    } else {
      setSelectedActivities(filteredActivities.map(a => a.id));
    }
  };

  const getActivityTypeCounts = () => {
    const counts = {};
    activities.forEach(activity => {
      counts[activity.type] = (counts[activity.type] || 0) + 1;
    });
    return counts;
  };

  const activityTypeCounts = getActivityTypeCounts();

  const activityTypes = [
    { value: "all", label: "All Activities" },
    { value: "candidate_selected", label: "Candidate Selected" },
    { value: "interview_scheduled", label: "Interview Scheduled" },
    { value: "offer_sent", label: "Offer Sent" },
    { value: "offer_accepted", label: "Offer Accepted" },
    { value: "candidate_blocked", label: "Candidate Blocked" },
    { value: "communication_sent", label: "Communication Sent" },
    { value: "placement_success", label: "Placement Success" }
  ];

  return (
    <div className="w-full max-w-none">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Activities</p>
              <p className="text-2xl font-bold text-blue-600">{activities.length}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Placements</p>
              <p className="text-2xl font-bold text-green-600">{activityTypeCounts.placement_success || 0}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Interviews</p>
              <p className="text-2xl font-bold text-purple-600">{activityTypeCounts.interview_scheduled || 0}</p>
            </div>
            <CalendarIcon className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Communications</p>
              <p className="text-2xl font-bold text-indigo-600">{activityTypeCounts.communication_sent || 0}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {activityTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label} {type.value !== "all" && `(${activityTypeCounts[type.value] || 0})`}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterType("all");
                setFilterDate("");
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 transition-all duration-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedActivities.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-emerald-800 font-medium text-sm">
              {selectedActivities.length} activity(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white text-sm rounded-md border border-emerald-600 hover:bg-emerald-600 transition-all duration-200 shadow-sm">
                <FileText className="h-4 w-4" />
                Export Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activities List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedActivities.length === filteredActivities.length && filteredActivities.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recruiter
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Priority
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredActivities.map((activity) => {
                const IconComponent = getActivityIcon(activity.type);
                const iconColor = getActivityColor(activity.type);
                
                return (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedActivities.includes(activity.id)}
                        onChange={() => handleSelectActivity(activity.id)}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-start">
                        <div className={`p-2 rounded-full bg-gray-100 flex-shrink-0 mr-3`}>
                          <IconComponent className={`h-4 w-4 ${iconColor}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                          <div className="text-sm text-gray-500 mt-1">{activity.description}</div>
                          {activity.metadata && (
                            <div className="text-xs text-gray-400 mt-1">
                              {Object.entries(activity.metadata).slice(0, 2).map(([key, value]) => (
                                <span key={key} className="mr-3">
                                  {key}: {value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{activity.candidateName}</div>
                      <div className="text-sm text-gray-500">{activity.candidateId}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{activity.recruiter}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{activity.user}</div>
                      <div className="text-sm text-gray-500">{activity.userRole}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{formatTimestamp(activity.timestamp)}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        {getStatusBadge(activity.status)}
                        {getPriorityBadge(activity.priority)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredActivities.length === 0 && (
          <div className="text-center py-8">
            <Activity className="mx-auto h-8 w-8 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No activities found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterType !== "all" || filterDate ? "No activities match your search criteria." : "No activities have been recorded yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
