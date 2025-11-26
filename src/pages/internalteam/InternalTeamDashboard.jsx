import React, { useState, useEffect } from "react";
import { 
  Bell, 
  Users, 
  UserCheck, 
  Briefcase,
  AlertCircle, 
  RefreshCw, 
  Loader2, 
  Clock, 
  FileCheck, 
  XCircle, 
  X,
  CheckCircle2, 
  Mail, 
  TrendingUp
} from "lucide-react";
import { toast } from 'react-toastify';

const InternalTeamDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard stats from API
  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const apiEndpoint = `${baseURL}/api/internal/dashboard/stats`;

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
    <div className="w-full max-w-none">
      <div className="mx-auto">
          {/* Page Header */}
          <div className="mb-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 hidden sm:block">Internal team overview and statistics</p>
              </div>
              <button 
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-1.5 sm:p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 flex-shrink-0"
                title="Refresh Dashboard"
              >
                <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm font-medium">Error: {error}</span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin mx-auto text-indigo-600 mb-2 sm:mb-3" />
              <p className="text-xs sm:text-sm text-gray-500 font-medium">Loading dashboard statistics...</p>
            </div>
          ) : dashboardStats ? (
            <>
              {/* Notifications Statistics */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Notifications</h2>
                    <p className="text-xs text-gray-600 hidden sm:block">Notification statistics</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3 lg:p-4 border border-gray-200">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <FileCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs font-medium text-gray-600 truncate">Total</span>
                    </div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{dashboardStats.notifications?.total || 0}</p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-2 sm:p-3 lg:p-4 border border-blue-200">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs font-medium text-blue-700 truncate">Unread</span>
                    </div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">{dashboardStats.notifications?.unread || 0}</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-2 sm:p-3 lg:p-4 border border-green-200">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs font-medium text-green-700 truncate">Read</span>
                    </div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900">{dashboardStats.notifications?.read || 0}</p>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-2 sm:p-3 lg:p-4 border border-orange-200">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-600 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs font-medium text-orange-700 truncate">High Priority</span>
                    </div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-900">{dashboardStats.notifications?.high_priority || 0}</p>
                  </div>
                </div>
              </div>

              {/* Recruiters Statistics */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Recruiters</h2>
                    <p className="text-xs text-gray-600 hidden sm:block">Recruiter statistics</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3 lg:p-4 border border-gray-200">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <FileCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs font-medium text-gray-600 truncate">Total</span>
                    </div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{dashboardStats.recruiters?.total || 0}</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-2 sm:p-3 lg:p-4 border border-green-200">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs font-medium text-green-700 truncate">Approved</span>
                    </div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900">{dashboardStats.recruiters?.approved || 0}</p>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-2 sm:p-3 lg:p-4 border border-yellow-200">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-600 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs font-medium text-yellow-700 truncate">Pending</span>
                    </div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-900">{dashboardStats.recruiters?.pending || 0}</p>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-2 sm:p-3 lg:p-4 border border-red-200">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs font-medium text-red-700 truncate">Declined</span>
                    </div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-900">{dashboardStats.recruiters?.declined || 0}</p>
                  </div>
                </div>
              </div>

              {/* Candidates Statistics */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Candidates</h2>
                    <p className="text-xs text-gray-600 hidden sm:block">Candidate statistics</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3 lg:p-4 border border-gray-200">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <FileCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs font-medium text-gray-600 truncate">Total</span>
                    </div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{dashboardStats.candidates?.total || 0}</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-2 sm:p-3 lg:p-4 border border-green-200">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs font-medium text-green-700 truncate">Approved</span>
                    </div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900">{dashboardStats.candidates?.approved || 0}</p>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-2 sm:p-3 lg:p-4 border border-yellow-200">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-600 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs font-medium text-yellow-700 truncate">Pending</span>
                    </div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-900">{dashboardStats.candidates?.pending || 0}</p>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-2 sm:p-3 lg:p-4 border border-red-200">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs font-medium text-red-700 truncate">Declined</span>
                    </div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-900">{dashboardStats.candidates?.declined || 0}</p>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-2 sm:p-3 lg:p-4 border border-orange-200">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-600 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs font-medium text-orange-700 truncate">Pending Offers</span>
                    </div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-900">{dashboardStats.candidates?.with_pending_offers || 0}</p>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-lg p-2 sm:p-3 lg:p-4 border border-indigo-200">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-600 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs font-medium text-indigo-700 truncate">Accepted Offers</span>
                    </div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-indigo-900">{dashboardStats.candidates?.with_accepted_offers || 0}</p>
                  </div>
                </div>
              </div>

              {/* Offers Statistics */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Offers</h2>
                    <p className="text-xs text-gray-600 hidden sm:block">Job offer statistics</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3 lg:p-4 border border-gray-200">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <FileCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs font-medium text-gray-600 truncate">Total</span>
                    </div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{dashboardStats.offers?.total || 0}</p>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-2 sm:p-3 lg:p-4 border border-yellow-200">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-600 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs font-medium text-yellow-700 truncate">Pending</span>
                    </div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-900">{dashboardStats.offers?.pending || 0}</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-2 sm:p-3 lg:p-4 border border-green-200">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs font-medium text-green-700 truncate">Accepted</span>
                    </div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900">{dashboardStats.offers?.accepted || 0}</p>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-2 sm:p-3 lg:p-4 border border-red-200">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs font-medium text-red-700 truncate">Declined</span>
                    </div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-900">{dashboardStats.offers?.declined || 0}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3 lg:p-4 border border-gray-200">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs font-medium text-gray-600 truncate">Withdrawn</span>
                    </div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{dashboardStats.offers?.withdrawn || 0}</p>
                  </div>
                </div>
              </div>

              {/* Staff Statistics */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Staff</h2>
                    <p className="text-xs text-gray-600 hidden sm:block">Internal team staff statistics</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3 lg:p-4 border border-gray-200">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <FileCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs font-medium text-gray-600 truncate">Total</span>
                    </div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{dashboardStats.staff?.total || 0}</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-2 sm:p-3 lg:p-4 border border-green-200">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs font-medium text-green-700 truncate">Active</span>
                    </div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900">{dashboardStats.staff?.active || 0}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
              <AlertCircle className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-gray-300 mb-2 sm:mb-3" />
              <p className="text-xs sm:text-sm text-gray-500 font-medium">No dashboard statistics available</p>
            </div>
          )}
        </div>
      </div>
  );
};

export default InternalTeamDashboard;
