import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Users, Star, Clock, FileText, Download, TrendingUp, UserCheck, Calendar, DollarSign } from "lucide-react";
import DashboardHeader from "../../Components/DashboardHeader";

const mockShortlisted = [
  {
    code: "TSC-2024-1547",
    role: "Senior Software Engineer",
    score: 95,
    shortlistedDate: "2024-01-15",
    status: "pending",
    experience: "5-8 years",
    location: "New York, NY",
    skills: ["React", "Node.js", "AWS"],
    salary: "$120,000 - $150,000",
    visaStatus: "US Citizen",
    interviewStatus: "pre-interviewed"
  },
  {
    code: "TSC-2024-1823",
    role: "Product Manager",
    score: 92,
    shortlistedDate: "2024-01-14",
    status: "interview-scheduled",
    experience: "7-10 years",
    location: "San Francisco, CA",
    skills: ["Product Strategy", "Agile", "Data Analysis"],
    salary: "$140,000 - $180,000",
    visaStatus: "Green Card",
    interviewStatus: "passed"
  },
  {
    code: "TSC-2024-2104",
    role: "Data Scientist",
    score: 88,
    shortlistedDate: "2024-01-13",
    status: "pending",
    experience: "4-6 years",
    location: "Austin, TX",
    skills: ["Python", "Machine Learning", "TensorFlow"],
    salary: "$110,000 - $140,000",
    visaStatus: "H1-B",
    interviewStatus: "pre-interviewed"
  },
  {
    code: "TSC-2024-2156",
    role: "UX Designer",
    score: 91,
    shortlistedDate: "2024-01-12",
    status: "interview-scheduled",
    experience: "3-5 years",
    location: "Seattle, WA",
    skills: ["Figma", "User Research", "Prototyping"],
    salary: "$90,000 - $120,000",
    visaStatus: "US Citizen",
    interviewStatus: "passed"
  },
  {
    code: "TSC-2024-2201",
    role: "DevOps Engineer",
    score: 89,
    shortlistedDate: "2024-01-11",
    status: "pending",
    experience: "6-8 years",
    location: "Chicago, IL",
    skills: ["Docker", "Kubernetes", "AWS"],
    salary: "$130,000 - $160,000",
    visaStatus: "US Citizen",
    interviewStatus: "pre-interviewed"
  }
];

const RecruiterDashboard = () => {
  const [activeTab, setActiveTab] = useState("shortlisted");

  const getStatusClasses = (status) =>
    status === "interview-scheduled"
      ? "bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
      : "bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader />
      
      <div className="pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back!</h1>
                <p className="text-gray-600 mt-1">Manage your candidate selections and track your hiring progress</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/recruiter/search"
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-lg"
                >
                  <Search className="h-5 w-5" />
                  Search Candidates
                </Link>
                <Link
                  to="/recruiter/shortlisted"
                  className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-200 shadow-lg"
                >
                  <Users className="h-5 w-5" />
                  Shortlisted
                </Link>
                <Link
                  to="/recruiter/selection-dashboard"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 shadow-lg"
                >
                  <TrendingUp className="h-5 w-5" />
                  Analytics
                </Link>
              </div>
            </div>
          </div>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Searches</p>
                  <p className="text-3xl font-bold text-indigo-600 mt-1">142</p>
                  <p className="text-xs text-gray-500 mt-1">This month</p>
                </div>
                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Search className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Shortlisted</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">23</p>
                  <p className="text-xs text-gray-500 mt-1">Active candidates</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Interviews</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">8</p>
                  <p className="text-xs text-gray-500 mt-1">This week</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Successful Hires</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-1">5</p>
                  <p className="text-xs text-gray-500 mt-1">Last 3 months</p>
                </div>
                <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Shortlisted Candidates Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Shortlisted Candidates</h2>
                    <p className="text-sm text-gray-600">Candidates you've selected for review</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {mockShortlisted.length} candidates
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role & Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {mockShortlisted.map((candidate) => (
                    <tr key={candidate.code} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-semibold text-indigo-600">{candidate.code}</div>
                          <div className="text-xs text-gray-500">{candidate.shortlistedDate}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{candidate.role}</div>
                          <div className="text-xs text-gray-500">{candidate.experience}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-semibold text-gray-900">{candidate.score}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{candidate.location}</div>
                        <div className="text-xs text-gray-500">{candidate.visaStatus}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          candidate.status === "interview-scheduled" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {candidate.status.replace("-", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/recruiter/candidate/${candidate.code}`}
                            className="text-indigo-600 hover:text-indigo-900 px-3 py-1 border border-indigo-200 rounded-md hover:bg-indigo-50 transition-colors"
                          >
                            View
                          </Link>
                          <button className="text-gray-600 hover:text-gray-900 p-1 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                  <p className="text-sm text-gray-600">Your latest hiring activities</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Shortlisted TSC-2024-1547</p>
                    <p className="text-xs text-gray-600 mt-1">Senior Software Engineer - New York, NY</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Interview scheduled for TSC-2024-1823</p>
                    <p className="text-xs text-gray-600 mt-1">Product Manager - San Francisco, CA</p>
                    <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Search className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Searched for Software Engineers in NY</p>
                    <p className="text-xs text-gray-600 mt-1">Found 12 matching candidates</p>
                    <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
