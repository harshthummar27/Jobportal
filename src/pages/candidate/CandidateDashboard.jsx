import { Link } from "react-router-dom";
import React from "react";
import { User, Briefcase, Settings, FileText, CheckCircle, Clock } from "lucide-react";
import DashboardHeader from "../../Components/DashboardHeader";

const CandidateDashboard = () => {
  // Mock data - in real app, replace with API call
  const profile = {
    candidateCode: "TSC-2024-1547",
    status: "pre-interviewed",
    completeness: 85,
    activeApplications: 3,
    totalViews: 12
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="border-b bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Candidate Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="px-2 py-1 border rounded text-sm">{profile.candidateCode}</span>
            <button className="p-2 rounded hover:bg-gray-100">
              <Settings className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
      </header> */}
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Status Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Profile Status</h3>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold text-gray-900">Active</span>
            </div>
          </div>

          <div className="bg-white shadow rounded p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Profile Completeness</h3>
            <div className="text-2xl font-bold text-gray-900">{profile.completeness}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${profile.completeness}%` }}></div>
            </div>
          </div>

          <div className="bg-white shadow rounded p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Active Opportunities</h3>
            <div className="text-2xl font-bold text-gray-900">{profile.activeApplications}</div>
          </div>

          <div className="bg-white shadow rounded p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Profile Views</h3>
            <div className="text-2xl font-bold text-gray-900">{profile.totalViews}</div>
            <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="md:col-span-2 bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Recent Activity</h3>
            <p className="text-gray-500 mb-4">Your latest profile interactions</p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Profile Viewed</h4>
                  <p className="text-sm text-gray-500">A recruiter viewed your profile</p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-purple-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Pre-Interview Passed</h4>
                  <p className="text-sm text-gray-500">You've been verified and approved</p>
                  <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Profile Updated</h4>
                  <p className="text-sm text-gray-500">You updated your work experience</p>
                  <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Interview Status */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white shadow rounded p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  to="/candidate/profile"
                  className="flex items-center gap-2 border px-3 py-2 rounded hover:bg-gray-100"
                >
                  <User className="h-4 w-4" />
                  Edit Profile
                </Link>
                <Link
                  to="/candidate/preferences"
                  className="flex items-center gap-2 border px-3 py-2 rounded hover:bg-gray-100"
                >
                  <Settings className="h-4 w-4" />
                  Job Preferences
                </Link>
                <button className="flex items-center gap-2 border px-3 py-2 rounded w-full hover:bg-gray-100">
                  <FileText className="h-4 w-4" />
                  Upload Resume
                </button>
              </div>
            </div>

            {/* Interview Status */}
            <div className="bg-white shadow rounded p-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-2">
                <Clock className="h-5 w-5" />
                Interview Status
              </h3>
              <span className="inline-block bg-green-500 text-white px-2 py-1 rounded text-sm">Pre-Interviewed</span>
              <p className="text-sm text-gray-500 mt-2">
                You've passed our initial screening. Recruiters can now view your profile.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
