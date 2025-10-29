import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Bell, 
  Calendar, 
  FileText, 
  Shield, 
  UserX, 
  MessageSquare, 
  Activity,
  ChevronRight,
  X
} from "lucide-react";

const InternalTeamSidebar = ({ isCollapsed, setIsCollapsed, onMobileClose, isMobile, mobileSidebarOpen }) => {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/internal-team/dashboard",
      icon: LayoutDashboard,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100"
    },
    {
      name: "Notifications",
      path: "/internal-team/notifications",
      icon: Bell,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      name: "Interview Scheduling",
      path: "/internal-team/interview-scheduling",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      name: "Offer Management",
      path: "/internal-team/offer-management",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      name: "Screening & Blocking",
      path: "/internal-team/screening-blocking",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      name: "Blocked Candidates",
      path: "/internal-team/blocked-candidates",
      icon: UserX,
      color: "text-gray-600",
      bgColor: "bg-gray-100"
    },
    {
      name: "Communication",
      path: "/internal-team/communication",
      icon: MessageSquare,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    },
    {
      name: "Activity Log",
      path: "/internal-team/activity-log",
      icon: Activity,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100"
    }
  ];

  const isActive = (path) => location.pathname === path;

  const sidebarClasses = `
    ${isMobile 
      ? 'fixed top-12 left-0 z-50 w-64 h-[calc(100vh-3rem)] bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out'
      : 'bg-white border-r border-gray-200 shadow-sm h-full'
    }
    ${isMobile && !mobileSidebarOpen ? '-translate-x-full' : ''}
    ${!isMobile && isCollapsed ? 'w-16' : 'w-64'}
    transition-all duration-300 ease-in-out
  `;

  return (
    <div className={sidebarClasses}>
      {/* Mobile Close Button */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IT</span>
            </div>
            <span className="text-lg font-semibold text-gray-800">Internal Team</span>
          </div>
          <button
            onClick={onMobileClose}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <div className={`border-b border-gray-200 transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-4'}`}>
          <div className={`flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className={`bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'w-8 h-8' : 'w-10 h-10'}`}>
              <span className={`text-white font-bold transition-all duration-300 ${isCollapsed ? 'text-sm' : 'text-lg'}`}>IT</span>
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                {/* <h2 className="text-lg font-semibold text-gray-800 truncate">Internal Team</h2> */}
                <p className="text-xs text-gray-500 truncate">Candidate Management</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className={`space-y-2 transition-all duration-300 ${isCollapsed && !isMobile ? 'p-2' : 'p-4'}`}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={isMobile ? onMobileClose : undefined}
              className={`
                flex items-center rounded-lg transition-all duration-200 group relative
                ${active 
                  ? `${item.bgColor} ${item.color} shadow-sm` 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
                ${isCollapsed && !isMobile ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'}
              `}
              title={isCollapsed && !isMobile ? item.name : ''}
            >
              <div className={`
                flex-shrink-0 rounded-md transition-colors
                ${active ? item.bgColor : 'group-hover:bg-gray-200'}
                ${isCollapsed && !isMobile ? 'p-1.5' : 'p-1.5'}
              `}>
                <IconComponent className={`h-4 w-4 ${active ? item.color : 'text-gray-500 group-hover:text-gray-700'}`} />
              </div>
              
              {(!isCollapsed || isMobile) && (
                <>
                  <span className={`
                    font-medium text-sm truncate transition-colors
                    ${active ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}
                  `}>
                    {item.name}
                  </span>
                  
                  {active && (
                    <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                  )}
                </>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && !isMobile && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

    </div>
  );
};

export default InternalTeamSidebar;
