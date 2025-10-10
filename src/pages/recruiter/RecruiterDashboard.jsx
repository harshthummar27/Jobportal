import React from "react";
import { useState } from "react";

import { Link } from "react-router-dom";
import { Search, Users, Star, Clock, FileText, Download } from "lucide-react";

const mockShortlisted = [
  {
    code: "TSC-2024-1547",
    role: "Senior Software Engineer",
    score: 95,
    shortlistedDate: "2024-01-15",
    status: "pending",
  },
  {
    code: "TSC-2024-1823",
    role: "Product Manager",
    score: 92,
    shortlistedDate: "2024-01-14",
    status: "interview-scheduled",
  },
  {
    code: "TSC-2024-2104",
    role: "Data Scientist",
    score: 88,
    shortlistedDate: "2024-01-13",
    status: "pending",
  },
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
      <header className="border-b bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
            <p className="text-gray-500">Manage your candidate selections</p>
          </div>
          <Link
            to="/recruiter/search"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <Search className="h-4 w-4" />
            Search Candidates
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded shadow p-4">
            <p className="text-gray-500">Total Searches</p>
            <h2 className="text-3xl text-blue-600 font-bold">142</h2>
            <p className="text-xs text-gray-400">This month</p>
          </div>
          <div className="bg-white rounded shadow p-4">
            <p className="text-gray-500">Shortlisted</p>
            <h2 className="text-3xl text-purple-600 font-bold">23</h2>
            <p className="text-xs text-gray-400">Active candidates</p>
          </div>
          <div className="bg-white rounded shadow p-4">
            <p className="text-gray-500">Interviews Scheduled</p>
            <h2 className="text-3xl text-green-600 font-bold">8</h2>
            <p className="text-xs text-gray-400">This week</p>
          </div>
          <div className="bg-white rounded shadow p-4">
            <p className="text-gray-500">Successful Hires</p>
            <h2 className="text-3xl text-gray-900 font-bold">5</h2>
            <p className="text-xs text-gray-400">Last 3 months</p>
          </div>
        </div>

        {/* Shortlisted Candidates Table */}
        <div className="bg-white rounded shadow">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-5 w-5 text-blue-600" />
              <h2 className="font-bold text-gray-900">Shortlisted Candidates</h2>
            </div>
            <p className="text-gray-500 text-sm">Candidates you've selected for review</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Candidate Code</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Score</th>
                  <th className="px-4 py-2">Shortlisted Date</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockShortlisted.map((candidate) => (
                  <tr key={candidate.code} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-blue-600 font-medium">{candidate.code}</td>
                    <td className="px-4 py-2">{candidate.role}</td>
                    <td className="px-4 py-2 flex items-center gap-1">
                      <Star className="h-4 w-4 text-purple-600" />
                      <span className="font-semibold">{candidate.score}</span>
                    </td>
                    <td className="px-4 py-2">{candidate.shortlistedDate}</td>
                    <td className="px-4 py-2">
                      <span className={getStatusClasses(candidate.status)}>
                        {candidate.status.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <Link
                        to={`/recruiter/candidate/${candidate.code}`}
                        className="px-3 py-1 border border-gray-300 rounded text-gray-900 hover:bg-gray-100 text-sm"
                      >
                        View
                      </Link>
                      <button className="px-3 py-1 border border-gray-300 rounded text-gray-900 hover:bg-gray-100 text-sm">
                        <Download className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded shadow mt-6 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <h2 className="font-bold text-gray-900">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Shortlisted TSC-2024-1547</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Interview scheduled for TSC-2024-1823</p>
                <p className="text-xs text-gray-400">Yesterday</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Search className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Searched for Software Engineers in NY</p>
                <p className="text-xs text-gray-400">2 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
