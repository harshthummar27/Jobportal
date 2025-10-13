import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Users, Star, Clock, Calendar, MapPin, Briefcase, DollarSign, Eye, MessageSquare, CheckCircle, XCircle, AlertCircle, Download, Share2, Filter, Search } from "lucide-react";
import DashboardHeader from "../../Components/DashboardHeader";

const mockShortlistedCandidates = [
  {
    code: "TSC-2024-20031",
    role: "Senior Software Engineer",
    experience: "5-8 years",
    location: "New York, NY",
    skills: ["React", "Node.js", "AWS", "TypeScript"],
    salary: "$120,000 - $150,000",
    visaStatus: "US Citizen",
    score: 95,
    shortlistedDate: "2024-01-15",
    status: "pending",
    interviewStatus: "pre-interviewed",
    availability: "Immediate",
    notes: "Strong technical background, excellent communication skills",
    priority: "high",
    lastContact: "2024-01-15"
  },
  {
    code: "TSC-2024-20045",
    role: "Product Manager",
    experience: "7-10 years",
    location: "San Francisco, CA",
    skills: ["Product Strategy", "Agile", "Data Analysis"],
    salary: "$140,000 - $180,000",
    visaStatus: "Green Card",
    score: 92,
    shortlistedDate: "2024-01-14",
    status: "interview-scheduled",
    interviewStatus: "passed",
    availability: "2 weeks notice",
    notes: "Scheduled for final interview on Jan 20th",
    priority: "high",
    lastContact: "2024-01-16"
  },
  {
    code: "TSC-2024-20052",
    role: "Data Scientist",
    experience: "4-6 years",
    location: "Austin, TX",
    skills: ["Python", "Machine Learning", "TensorFlow"],
    salary: "$110,000 - $140,000",
    visaStatus: "H1-B",
    score: 88,
    shortlistedDate: "2024-01-13",
    status: "pending",
    interviewStatus: "pre-interviewed",
    availability: "1 month notice",
    notes: "Needs sponsorship, strong ML background",
    priority: "medium",
    lastContact: "2024-01-13"
  },
  {
    code: "TSC-2024-20067",
    role: "UX Designer",
    experience: "3-5 years",
    location: "Seattle, WA",
    skills: ["Figma", "User Research", "Prototyping"],
    salary: "$90,000 - $120,000",
    visaStatus: "US Citizen",
    score: 91,
    shortlistedDate: "2024-01-12",
    status: "interview-scheduled",
    interviewStatus: "passed",
    availability: "Immediate",
    notes: "Portfolio review completed, ready for final round",
    priority: "high",
    lastContact: "2024-01-17"
  },
  {
    code: "TSC-2024-20078",
    role: "DevOps Engineer",
    experience: "6-8 years",
    location: "Chicago, IL",
    skills: ["Docker", "Kubernetes", "AWS"],
    salary: "$130,000 - $160,000",
    visaStatus: "US Citizen",
    score: 89,
    shortlistedDate: "2024-01-11",
    status: "rejected",
    interviewStatus: "pre-interviewed",
    availability: "3 weeks notice",
    notes: "Not a good cultural fit",
    priority: "low",
    lastContact: "2024-01-14"
  }
];

const ShortlistedCandidates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const getStatusClasses = (status) => {
    switch (status) {
      case "interview-scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "hired":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityClasses = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredCandidates = mockShortlistedCandidates.filter(candidate => {
    const matchesSearch = candidate.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || candidate.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleStatusChange = (code, newStatus) => {
    alert(`Status changed to ${newStatus} for ${code}`);
  };

  const handleAddNote = (code) => {
    alert(`Add note for ${code}`);
  };

  const handleScheduleInterview = (code) => {
    alert(`Schedule interview for ${code}`);
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
                <h1 className="text-lg font-semibold text-gray-900">Shortlisted Candidates</h1>
                <p className="text-sm text-gray-600">Manage your selected candidates and track their progress</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/recruiter/search"
                  className="inline-flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  <Search className="h-4 w-4" />
                  Search More
                </Link>
                <Link
                  to="/recruiter/interview-tracking"
                  className="inline-flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  Interviews
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div className="bg-white rounded border border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Total</p>
                  <p className="text-xl font-bold text-indigo-600">{mockShortlistedCandidates.length}</p>
                </div>
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
            
            <div className="bg-white rounded border border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Scheduled</p>
                  <p className="text-xl font-bold text-blue-600">
                    {mockShortlistedCandidates.filter(c => c.status === "interview-scheduled").length}
                  </p>
                </div>
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded border border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Pending</p>
                  <p className="text-xl font-bold text-yellow-600">
                    {mockShortlistedCandidates.filter(c => c.status === "pending").length}
                  </p>
                </div>
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            
            <div className="bg-white rounded border border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">High Priority</p>
                  <p className="text-xl font-bold text-red-600">
                    {mockShortlistedCandidates.filter(c => c.priority === "high").length}
                  </p>
                </div>
                <AlertCircle className="h-5 w-5 text-red-600" />
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
                    placeholder="Search by candidate code, role, or skills..."
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
                  <option value="pending">Pending</option>
                  <option value="interview-scheduled">Interview Scheduled</option>
                  <option value="rejected">Rejected</option>
                  <option value="hired">Hired</option>
                </select>
                
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="border border-gray-200 rounded px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            </div>
          </div>

          {/* Candidates Table */}
          <div className="bg-white rounded border border-gray-200 overflow-hidden">
            <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <h2 className="text-sm font-semibold text-gray-900">Shortlisted Candidates</h2>
                </div>
                <div className="text-xs text-gray-500">
                  {filteredCandidates.length} candidates
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role & Experience</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Last Contact</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCandidates.map((candidate) => (
                    <tr key={candidate.code} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div>
                          <div className="text-xs font-semibold text-indigo-600">{candidate.code}</div>
                          <div className="text-xs text-gray-500">{candidate.shortlistedDate}</div>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div>
                          <div className="text-xs font-medium text-gray-900">{candidate.role}</div>
                          <div className="text-xs text-gray-500">{candidate.experience}</div>
                          <div className="text-xs text-gray-500">{candidate.location}</div>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs font-semibold text-gray-900">{candidate.score}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded border ${getStatusClasses(candidate.status)}`}>
                          {candidate.status.replace("-", " ")}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded border ${getPriorityClasses(candidate.priority)}`}>
                          {candidate.priority}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-xs text-gray-900">{candidate.lastContact}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/recruiter/candidate/${candidate.code}`}
                            className="text-indigo-600 hover:text-indigo-900 p-1 border border-indigo-200 rounded hover:bg-indigo-50 transition-colors"
                            title="View Profile"
                          >
                            <Eye className="h-3 w-3" />
                          </Link>
                          
                          <button
                            onClick={() => handleAddNote(candidate.code)}
                            className="text-gray-600 hover:text-gray-900 p-1 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                            title="Add Note"
                          >
                            <MessageSquare className="h-3 w-3" />
                          </button>
                          
                          <button
                            onClick={() => handleScheduleInterview(candidate.code)}
                            className="text-green-600 hover:text-green-900 p-1 border border-green-200 rounded hover:bg-green-50 transition-colors"
                            title="Schedule Interview"
                          >
                            <Calendar className="h-3 w-3" />
                          </button>
                          
                          <select
                            value={candidate.status}
                            onChange={(e) => handleStatusChange(candidate.code, e.target.value)}
                            className="text-xs border border-gray-200 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="interview-scheduled">Interview Scheduled</option>
                            <option value="rejected">Rejected</option>
                            <option value="hired">Hired</option>
                          </select>
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

export default ShortlistedCandidates;
