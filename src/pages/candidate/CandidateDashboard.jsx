import { Link } from "react-router-dom";
import React from "react";
import { User, Briefcase, Settings, FileText, CheckCircle, Clock, Eye, TrendingUp, Calendar, Bell } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <DashboardHeader />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 mt-7">Candidate Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's your job search overview</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                {profile.candidateCode}
              </span>
              <button className="p-2 rounded-lg hover:bg-white/50 transition-colors">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Profile Status</h3>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold text-gray-900">Active</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Profile Complete</h3>
                <div className="text-2xl font-bold text-gray-900">{profile.completeness}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300" style={{ width: `${profile.completeness}%` }}></div>
                </div>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Active Opportunities</h3>
                <div className="text-2xl font-bold text-gray-900">{profile.activeApplications}</div>
                <p className="text-sm text-gray-500 mt-1">In progress</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Profile Views</h3>
                <div className="text-2xl font-bold text-gray-900">{profile.totalViews}</div>
                <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Recent Activity</h3>
            <p className="text-gray-500 mb-6">Your latest profile interactions</p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Profile Viewed</h4>
                  <p className="text-sm text-gray-500">A recruiter from TechCorp viewed your profile</p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Pre-Interview Passed</h4>
                  <p className="text-sm text-gray-500">You've been verified and approved for recruiter visibility</p>
                  <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Profile Updated</h4>
                  <p className="text-sm text-gray-500">You updated your work experience and skills</p>
                  <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Interview Status */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/candidate/profile-setup"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <User className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm font-medium">Edit Profile</span>
                </Link>
                <Link
                  to="/candidate/preferences"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm font-medium">Job Preferences</span>
                </Link>
                <button className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg w-full hover:bg-gray-50 transition-colors">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm font-medium">Upload Resume</span>
                </button>
              </div>
            </div>

            {/* Interview Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                <Clock className="h-5 w-5 text-indigo-600" />
                Interview Status
              </h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Pre-Interviewed
                </span>
              </div>
              <p className="text-sm text-gray-500">
                You've passed our initial screening. Recruiters can now view your profile and contact you for opportunities.
              </p>
            </div>

            {/* Profile Tips */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Profile Tips</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Keep your skills updated regularly</p>
                <p>• Add recent projects and achievements</p>
                <p>• Set realistic salary expectations</p>
                <p>• Enable notifications for new opportunities</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
