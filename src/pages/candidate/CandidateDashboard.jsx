import React, { useState, useEffect } from "react";
import { User, Briefcase, AlertCircle, RefreshCw, Loader2, Clock, FileCheck, XCircle, X, CheckCircle2, Mail, Send, Ban } from "lucide-react";
import { toast } from 'react-toastify';
import CandidateLayout from "../../Components/CandidateLayout";

const CandidateDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard stats from API
  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const apiEndpoint = `${baseURL}/api/profile/dashboard/stats`;

      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard statistics');
      }

      if (data.success && data.stats) {
        setDashboardStats(data.stats);
      } else {
        throw new Error(data.message || 'Invalid response format');
      }

    } catch (error) {
      console.error("Dashboard stats fetch error:", error);
      
      if (error.message.includes("token") || error.message.includes("unauthorized")) {
        toast.error("Session expired. Please log in again.");
        setError("Session expired");
      } else if (error.message.includes("network") || error.message.includes("fetch")) {
        toast.error("Network error. Please check your connection.");
        setError("Network error");
      } else {
        toast.error(error.message || "Failed to load dashboard statistics");
        setError(error.message || "Failed to load dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load dashboard stats on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please log in to access this page.");
      setIsLoading(false);
      return;
    }

    fetchDashboardStats();
  }, []);

  // Handle refresh button click
  const handleRefresh = () => {
    fetchDashboardStats();
  };

  return (
    <CandidateLayout>
      <div className="w-full max-w-none">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-4">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Your job search overview and statistics</p>
              </div>
              <button 
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
                title="Refresh Dashboard"
              >
                <RefreshCw className={`h-4 w-4 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Error: {error}</span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600 mb-3" />
              <p className="text-gray-500 text-sm font-medium">Loading dashboard statistics...</p>
            </div>
          ) : dashboardStats ? (
            <>
              {/* Offers Statistics */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Offers</h2>
                    <p className="text-sm text-gray-600">Your job offer statistics</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FileCheck className="h-4 w-4 text-gray-600" />
                      <span className="text-xs font-medium text-gray-600">Total</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.offers?.total || 0}</p>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-xs font-medium text-yellow-700">Pending</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-900">{dashboardStats.offers?.pending || 0}</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-xs font-medium text-green-700">Accepted</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900">{dashboardStats.offers?.accepted || 0}</p>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-xs font-medium text-red-700">Declined</span>
                    </div>
                    <p className="text-2xl font-bold text-red-900">{dashboardStats.offers?.declined || 0}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <X className="h-4 w-4 text-gray-600" />
                      <span className="text-xs font-medium text-gray-600">Withdrawn</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.offers?.withdrawn || 0}</p>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span className="text-xs font-medium text-orange-700">Expired</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-900">{dashboardStats.offers?.expired || 0}</p>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-indigo-600" />
                      <span className="text-xs font-medium text-indigo-700">Pending Response</span>
                    </div>
                    <p className="text-2xl font-bold text-indigo-900">{dashboardStats.offers?.pending_response || 0}</p>
                  </div>
                </div>
              </div>

              {/* Selections Statistics */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Selections</h2>
                    <p className="text-sm text-gray-600">Your candidate selection statistics</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FileCheck className="h-4 w-4 text-gray-600" />
                      <span className="text-xs font-medium text-gray-600">Total</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.selections?.total || 0}</p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Send className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-700">Shortlisted</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">{dashboardStats.selections?.shortlisted || 0}</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-xs font-medium text-green-700">Selected</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900">{dashboardStats.selections?.selected || 0}</p>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-indigo-600" />
                      <span className="text-xs font-medium text-indigo-700">Contacted</span>
                    </div>
                    <p className="text-2xl font-bold text-indigo-900">{dashboardStats.selections?.contacted || 0}</p>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Ban className="h-4 w-4 text-red-600" />
                      <span className="text-xs font-medium text-red-700">Rejected</span>
                    </div>
                    <p className="text-2xl font-bold text-red-900">{dashboardStats.selections?.rejected || 0}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm font-medium">No dashboard statistics available</p>
            </div>
          )}
        </div>
      </div>
    </CandidateLayout>
  );
};

export default CandidateDashboard;
