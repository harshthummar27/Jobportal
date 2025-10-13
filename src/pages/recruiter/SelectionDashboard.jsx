import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Users, Calendar, TrendingUp, CheckCircle, XCircle, Clock, Star, AlertCircle, BarChart3, PieChart, Activity, Target, Award, MessageSquare } from "lucide-react";
import DashboardHeader from "../../Components/DashboardHeader";

const SelectionDashboard = () => {
  const [timeRange, setTimeRange] = useState("30days");

  // Mock data for analytics
  const analyticsData = {
    totalCandidates: 156,
    shortlisted: 23,
    interviewed: 18,
    hired: 5,
    rejected: 13,
    pending: 5,
    averageScore: 89.2,
    successRate: 27.8,
    timeToHire: 12.5
  };

  const recentActivity = [
    {
      id: 1,
      type: "hired",
      candidate: "TSC-2024-20045",
      role: "Product Manager",
      timestamp: "2 hours ago",
      description: "Successfully hired for Senior Product Manager position"
    },
    {
      id: 2,
      type: "interview",
      candidate: "TSC-2024-20067",
      role: "UX Designer",
      timestamp: "4 hours ago",
      description: "Final interview completed - awaiting decision"
    },
    {
      id: 3,
      type: "shortlisted",
      candidate: "TSC-2024-20089",
      role: "Full Stack Developer",
      timestamp: "1 day ago",
      description: "Added to shortlist for React Developer role"
    },
    {
      id: 4,
      type: "rejected",
      candidate: "TSC-2024-20078",
      role: "DevOps Engineer",
      timestamp: "2 days ago",
      description: "Not selected after technical interview"
    }
  ];

  const topPerformers = [
    {
      code: "TSC-2024-20045",
      role: "Product Manager",
      score: 95,
      status: "hired",
      interviewCount: 3
    },
    {
      code: "TSC-2024-20067",
      role: "UX Designer",
      score: 91,
      status: "interview-scheduled",
      interviewCount: 2
    },
    {
      code: "TSC-2024-20031",
      role: "Senior Software Engineer",
      score: 95,
      status: "interview-scheduled",
      interviewCount: 2
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "hired":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "interview":
        return <Calendar className="h-5 w-5 text-blue-600" />;
      case "shortlisted":
        return <Users className="h-5 w-5 text-purple-600" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getActivityBgColor = (type) => {
    switch (type) {
      case "hired":
        return "bg-green-50 border-green-200";
      case "interview":
        return "bg-blue-50 border-blue-200";
      case "shortlisted":
        return "bg-purple-50 border-purple-200";
      case "rejected":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader />
      
      <div className="pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Selection Dashboard</h1>
                <p className="text-gray-600 mt-1">Track your hiring performance and candidate pipeline</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="7days">Last 7 days</option>
                  <option value="30days">Last 30 days</option>
                  <option value="90days">Last 90 days</option>
                  <option value="1year">Last year</option>
                </select>
                <Link
                  to="/recruiter/shortlisted"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                >
                  <Users className="h-4 w-4" />
                  Manage Candidates
                </Link>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                  <p className="text-3xl font-bold text-indigo-600 mt-1">{analyticsData.totalCandidates}</p>
                  <p className="text-xs text-gray-500 mt-1">This month</p>
                </div>
                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{analyticsData.successRate}%</p>
                  <p className="text-xs text-gray-500 mt-1">Hire rate</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Score</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-1">{analyticsData.averageScore}</p>
                  <p className="text-xs text-gray-500 mt-1">Candidate quality</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Time to Hire</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">{analyticsData.timeToHire}</p>
                  <p className="text-xs text-gray-500 mt-1">Days average</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Pipeline Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Hiring Pipeline</h2>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="h-8 w-8 text-indigo-600" />
                    </div>
                    <p className="text-2xl font-bold text-indigo-600">{analyticsData.totalCandidates}</p>
                    <p className="text-sm text-gray-600">Total</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{analyticsData.shortlisted}</p>
                    <p className="text-sm text-gray-600">Shortlisted</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Calendar className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{analyticsData.interviewed}</p>
                    <p className="text-sm text-gray-600">Interviewed</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">{analyticsData.hired}</p>
                    <p className="text-sm text-gray-600">Hired</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <p className="text-2xl font-bold text-red-600">{analyticsData.rejected}</p>
                    <p className="text-sm text-gray-600">Rejected</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <PieChart className="h-5 w-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Top Performers</h2>
                </div>
                
                <div className="space-y-4">
                  {topPerformers.map((candidate, index) => (
                    <div key={candidate.code} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-indigo-600">#{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{candidate.code}</p>
                        <p className="text-xs text-gray-600">{candidate.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-yellow-600">{candidate.score}</p>
                        <p className="text-xs text-gray-500">{candidate.interviewCount} interviews</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                  <p className="text-sm text-gray-600">Latest updates in your hiring process</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className={`flex items-start gap-4 p-4 rounded-lg border ${getActivityBgColor(activity.type)}`}>
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{activity.candidate} - {activity.role}</p>
                      <p className="text-sm text-gray-700 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionDashboard;
