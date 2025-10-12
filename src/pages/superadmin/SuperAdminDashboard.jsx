import React from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Building2, 
  TrendingUp, 
  Calendar,
  Shield,
  Settings
} from "lucide-react";
// SuperAdminLayout is now provided at the route level

const SuperAdminDashboard = () => {
  // Mock data - in real app, replace with API calls
  const stats = {
    allCandidates: 2847,
    pendingCandidates: 156,
    approvedCandidates: 2691,
    allRecruiters: 342,
    internalTeam: 18,
    totalUsers: 3197,
    recentRegistrations: 47,
    activeRecruiters: 298,
    totalRevenue: 1250000,
    monthlyRevenue: 125000,
    successfulPlacements: 892,
    averageTimeToHire: 18
  };

  const recentActivities = [
    {
      id: 1,
      type: "candidate_approved",
      message: "Candidate TSC-2024-2847 has been approved by Sarah HR",
      time: "2 hours ago",
      icon: UserCheck,
      color: "text-green-600"
    },
    {
      id: 2,
      type: "recruiter_registered",
      message: "New recruiter from CloudFirst Technologies registered",
      time: "4 hours ago",
      icon: Building2,
      color: "text-blue-600"
    },
    {
      id: 3,
      type: "candidate_pending",
      message: "23 new candidate registrations pending approval",
      time: "6 hours ago",
      icon: Users,
      color: "text-yellow-600"
    },
    {
      id: 4,
      type: "internal_team",
      message: "Internal team member Amanda Quality added",
      time: "1 day ago",
      icon: Shield,
      color: "text-purple-600"
    },
    {
      id: 5,
      type: "placement_success",
      message: "Successful placement: Grace Chen → CyberSec Pro",
      time: "1 day ago",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      id: 6,
      type: "recruiter_approved",
      message: "Recruiter AI Innovations has been approved",
      time: "2 days ago",
      icon: Building2,
      color: "text-blue-600"
    },
    {
      id: 7,
      type: "candidate_rejected",
      message: "Candidate application rejected due to incomplete profile",
      time: "2 days ago",
      icon: UserX,
      color: "text-red-600"
    },
    {
      id: 8,
      type: "system_update",
      message: "System maintenance completed successfully",
      time: "3 days ago",
      icon: Settings,
      color: "text-gray-600"
    },
    {
      id: 9,
      type: "revenue_milestone",
      message: "Monthly revenue target achieved: $125,000",
      time: "3 days ago",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      id: 10,
      type: "bulk_approval",
      message: "Bulk approval: 15 candidates approved by Mike Tech",
      time: "4 days ago",
      icon: UserCheck,
      color: "text-green-600"
    }
  ];

  const StatCard = ({ title, value, icon: Icon, color, bgColor, change }) => (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1 truncate">{title}</p>
          <p className="text-xl lg:text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
          {change && (
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{change}</span>
            </p>
          )}
        </div>
        <div className={`p-2 rounded-full ${bgColor} flex-shrink-0`}>
          <Icon className={`h-4 w-4 lg:h-5 lg:w-5 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-none">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
          <StatCard
            title="All Candidates"
            value={stats.allCandidates}
            icon={Users}
            color="text-blue-600"
            bgColor="bg-blue-100"
            change="+18% from last month"
          />
          <StatCard
            title="Pending Candidates"
            value={stats.pendingCandidates}
            icon={UserX}
            color="text-yellow-600"
            bgColor="bg-yellow-100"
            change="+12 new today"
          />
          <StatCard
            title="Approved Candidates"
            value={stats.approvedCandidates}
            icon={UserCheck}
            color="text-green-600"
            bgColor="bg-green-100"
            change="+47 this week"
          />
          <StatCard
            title="All Recruiters"
            value={stats.allRecruiters}
            icon={Building2}
            color="text-purple-600"
            bgColor="bg-purple-100"
            change="+8 new this week"
          />
        </div>

        {/* Additional Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
          <StatCard
            title="Total Revenue"
            value={`$${(stats.totalRevenue / 1000000).toFixed(1)}M`}
            icon={TrendingUp}
            color="text-green-600"
            bgColor="bg-green-100"
            change="+15% from last month"
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${(stats.monthlyRevenue / 1000).toFixed(0)}K`}
            icon={Calendar}
            color="text-indigo-600"
            bgColor="bg-indigo-100"
            change="Target achieved"
          />
          <StatCard
            title="Successful Placements"
            value={stats.successfulPlacements}
            icon={UserCheck}
            color="text-emerald-600"
            bgColor="bg-emerald-100"
            change="+32 this month"
          />
          <StatCard
            title="Avg. Time to Hire"
            value={`${stats.averageTimeToHire} days`}
            icon={Calendar}
            color="text-orange-600"
            bgColor="bg-orange-100"
            change="-2 days improvement"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link
              to="/superadmin/pending-candidates"
              className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <UserX className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">Pending Candidates</p>
                <p className="text-sm text-gray-500 truncate">{stats.pendingCandidates} awaiting approval</p>
              </div>
            </Link>
            
            <Link
              to="/superadmin/approved-candidates"
              className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <UserCheck className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">Approved Candidates</p>
                <p className="text-sm text-gray-500 truncate">Manage approved candidates</p>
              </div>
            </Link>
            
            <Link
              to="/superadmin/recruiters"
              className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Building2 className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">Manage Recruiters</p>
                <p className="text-sm text-gray-500 truncate">{stats.allRecruiters} total recruiters</p>
              </div>
            </Link>
            
            <Link
              to="/superadmin/internal-team"
              className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Shield className="h-6 w-6 text-indigo-600 mr-3 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">Internal Team</p>
                <p className="text-sm text-gray-500 truncate">{stats.internalTeam} team members</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <Link 
              to="/superadmin/activity" 
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              View all activity
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <IconComponent className={`h-5 w-5 ${activity.color}`} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
    </div>
  );
};

export default SuperAdminDashboard;