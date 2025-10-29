import React from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Calendar, 
  FileText,
  Shield,
  MessageSquare,
  Activity,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  Bell
} from "lucide-react";

const InternalTeamDashboard = () => {
  // Mock data - in real app, replace with API calls
  const stats = {
    pendingSelections: 23,
    activeInterviews: 15,
    offersPending: 8,
    blockedCandidates: 12,
    totalCommunications: 156,
    completedInterviews: 89,
    successfulPlacements: 45,
    averageResponseTime: 2.5
  };

  const recentActivities = [
    {
      id: 1,
      type: "candidate_selected",
      message: "Candidate TSC-2024-2847 selected by CloudFirst Technologies",
      time: "30 minutes ago",
      icon: Users,
      color: "text-blue-600"
    },
    {
      id: 2,
      type: "interview_scheduled",
      message: "Interview scheduled for Grace Chen with TechCorp Inc.",
      time: "1 hour ago",
      icon: Calendar,
      color: "text-purple-600"
    },
    {
      id: 3,
      type: "offer_sent",
      message: "Job offer sent to Michael Johnson for Senior Developer role",
      time: "2 hours ago",
      icon: FileText,
      color: "text-orange-600"
    },
    {
      id: 4,
      type: "candidate_blocked",
      message: "Candidate blocked for 6 months due to failed screening",
      time: "3 hours ago",
      icon: Shield,
      color: "text-red-600"
    },
    {
      id: 5,
      type: "communication_sent",
      message: "Follow-up email sent to 5 candidates regarding interview availability",
      time: "4 hours ago",
      icon: MessageSquare,
      color: "text-indigo-600"
    },
    {
      id: 6,
      type: "interview_completed",
      message: "Technical interview completed for Sarah Williams",
      time: "5 hours ago",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      id: 7,
      type: "offer_declined",
      message: "Job offer declined by David Brown - 1st decline",
      time: "6 hours ago",
      icon: AlertCircle,
      color: "text-yellow-600"
    },
    {
      id: 8,
      type: "placement_success",
      message: "Successful placement: Emma Davis → DataFlow Solutions",
      time: "1 day ago",
      icon: TrendingUp,
      color: "text-green-600"
    }
  ];

  const StatCard = ({ title, value, icon: Icon, color, bgColor, change, subtitle }) => (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1 truncate">{title}</p>
          <p className="text-xl lg:text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1 truncate">{subtitle}</p>
          )}
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
          title="Pending Selections"
          value={stats.pendingSelections}
          icon={Users}
          color="text-blue-600"
          bgColor="bg-blue-100"
          change="+5 new today"
          subtitle="Awaiting contact"
        />
        <StatCard
          title="Active Interviews"
          value={stats.activeInterviews}
          icon={Calendar}
          color="text-purple-600"
          bgColor="bg-purple-100"
          change="3 scheduled today"
          subtitle="In progress"
        />
        <StatCard
          title="Offers Pending"
          value={stats.offersPending}
          icon={FileText}
          color="text-orange-600"
          bgColor="bg-orange-100"
          change="2 responses expected"
          subtitle="Awaiting response"
        />
        <StatCard
          title="Blocked Candidates"
          value={stats.blockedCandidates}
          icon={Shield}
          color="text-red-600"
          bgColor="bg-red-100"
          change="1 expires tomorrow"
          subtitle="6-month blocks"
        />
      </div>

      {/* Additional Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        <StatCard
          title="Total Communications"
          value={stats.totalCommunications}
          icon={MessageSquare}
          color="text-indigo-600"
          bgColor="bg-indigo-100"
          change="+12 this week"
          subtitle="This month"
        />
        <StatCard
          title="Completed Interviews"
          value={stats.completedInterviews}
          icon={CheckCircle}
          color="text-green-600"
          bgColor="bg-green-100"
          change="+8 this week"
          subtitle="This month"
        />
        <StatCard
          title="Successful Placements"
          value={stats.successfulPlacements}
          icon={TrendingUp}
          color="text-emerald-600"
          bgColor="bg-emerald-100"
          change="+3 this week"
          subtitle="This month"
        />
        <StatCard
          title="Avg. Response Time"
          value={`${stats.averageResponseTime} hrs`}
          icon={Clock}
          color="text-cyan-600"
          bgColor="bg-cyan-100"
          change="-0.5 hrs improvement"
          subtitle="To candidate contact"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            to="/internal-team/notifications"
            className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Bell className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">Notifications</p>
              <p className="text-sm text-gray-500 truncate">View all notifications</p>
            </div>
          </Link>
          
          <Link
            to="/internal-team/interview-scheduling"
            className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Calendar className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">Schedule Interviews</p>
              <p className="text-sm text-gray-500 truncate">{stats.activeInterviews} active interviews</p>
            </div>
          </Link>
          
          <Link
            to="/internal-team/offer-management"
            className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="h-6 w-6 text-orange-600 mr-3 flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">Manage Offers</p>
              <p className="text-sm text-gray-500 truncate">{stats.offersPending} offers pending</p>
            </div>
          </Link>
          
          <Link
            to="/internal-team/screening-blocking"
            className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Shield className="h-6 w-6 text-red-600 mr-3 flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">Screening & Blocking</p>
              <p className="text-sm text-gray-500 truncate">{stats.blockedCandidates} blocked candidates</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <Link 
            to="/internal-team/activity-log" 
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
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
                    <Clock className="h-4 w-4 mr-1" />
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

export default InternalTeamDashboard;
