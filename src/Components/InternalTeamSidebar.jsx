import React, { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users,
  UserCheck,
  Bell, 
  Calendar, 
  FileText, 
  Shield, 
  UserX, 
  Activity,
  ChevronRight,
  X
} from "lucide-react";

const InternalTeamSidebar = ({ isCollapsed, setIsCollapsed, onMobileClose, isMobile, mobileSidebarOpen }) => {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState({});

  const menuItems = [
    {
      name: "Dashboard",
      path: "/internal-team/dashboard",
      icon: LayoutDashboard,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100"
    },
    {
      name: "View Candidate",
      icon: Users,
      color: "text-teal-600",
      bgColor: "bg-teal-100",
      children: [
        { name: "All Candidates", path: "/internal-team/all-candidates" },
        { name: "Pending Candidates", path: "/internal-team/pending-candidates" },
        { name: "Approved Candidates", path: "/internal-team/approved-candidates" },
        { name: "Declined Candidates", path: "/internal-team/declined-candidates" }
      ]
    },
    {
      name: "View Recruiter",
      icon: UserCheck,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      children: [
        { name: "All Recruiters", path: "/internal-team/all-recruiters" },
        { name: "Pending Recruiters", path: "/internal-team/pending-recruiters" },
        { name: "Approved Recruiters", path: "/internal-team/approved-recruiters" },
        { name: "Declined Recruiters", path: "/internal-team/declined-recruiters" }
      ]
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
    }
  ];

  const isActive = (path) => location.pathname === path;

  const isGroupActive = (children = []) => children.some((c) => isActive(c.path));

  const computedExpanded = useMemo(() => {
    const next = { ...expandedGroups };
    menuItems.forEach((item) => {
      if (item.children && isGroupActive(item.children)) {
        next[item.name] = true;
      }
    });
    return next;
  }, [expandedGroups, location.pathname]);

  const toggleGroup = (name) => {
    setExpandedGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

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
          <div className="flex items-center">
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

      {/* Desktop header removed */}

      {/* Navigation Menu */}
      <nav className={`space-y-2 transition-all duration-300 ${isCollapsed && !isMobile ? 'p-2' : 'p-4'}`}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const hasChildren = !!item.children;
          const active = hasChildren ? isGroupActive(item.children) : isActive(item.path);
          const expanded = hasChildren ? !!computedExpanded[item.name] : false;

          if (hasChildren) {
            return (
              <div key={item.name}>
                <button
                  type="button"
                  onClick={() => toggleGroup(item.name)}
                  className={`
                    w-full flex items-center rounded-lg transition-all duration-200 group relative
                    ${active 
                      ? `${item.bgColor} ${item.color} shadow-sm` 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                    ${isCollapsed && !isMobile ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'}
                  `}
                  title={isCollapsed && !isMobile ? item.name : ''}
                >
                  <div className={`
                    flex-shrink-0 rounded-md transition-colors
                    ${active ? item.bgColor : 'group-hover:bg-gray-200'}
                    ${isCollapsed && !isMobile ? 'p-1.5' : 'p-1.5'}
                  `}>
                    {IconComponent && (
                      <IconComponent className={`h-4 w-4 ${active ? item.color : 'text-gray-500 group-hover:text-gray-700'}`} />
                    )}
                  </div>

                  {(!isCollapsed || isMobile) && (
                    <>
                      <span className={`
                        font-medium text-sm truncate transition-colors
                        ${active ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}
                      `}>
                        {item.name}
                      </span>
                      <ChevronRight className={`h-4 w-4 ml-auto text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                    </>
                  )}

                  {isCollapsed && !isMobile && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </button>

                {expanded && (!isCollapsed || isMobile) && (
                  <div className="mt-1 ml-8 space-y-1">
                    {item.children.map((child) => {
                      const childActive = isActive(child.path);
                      return (
                        <Link
                          key={child.path}
                          to={child.path}
                          onClick={isMobile ? onMobileClose : undefined}
                          className={`
                            flex items-center rounded-lg transition-all duration-200 group relative
                            ${childActive 
                              ? 'bg-gray-100 text-gray-900 shadow-sm' 
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                            gap-3 px-3 py-2
                          `}
                          title={child.name}
                        >
                          <div className={`flex-shrink-0 rounded-full ${childActive ? 'bg-gray-300' : 'bg-gray-200'} h-1.5 w-1.5`} />
                          <span className={`text-sm ${childActive ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>{child.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={isMobile ? onMobileClose : undefined}
              className={`
                flex items-center rounded-lg transition-all duration-200 group relative
                ${active 
                  ? `${item.bgColor} ${item.color} shadow-sm` 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                ${isCollapsed && !isMobile ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'}
              `}
              title={isCollapsed && !isMobile ? item.name : ''}
            >
              <div className={`
                flex-shrink-0 rounded-md transition-colors
                ${active ? item.bgColor : 'group-hover:bg-gray-200'}
                ${isCollapsed && !isMobile ? 'p-1.5' : 'p-1.5'}
              `}>
                {IconComponent && (
                  <IconComponent className={`h-4 w-4 ${active ? item.color : 'text-gray-500 group-hover:text-gray-700'}`} />
                )}
              </div>
              
              {(!isCollapsed || isMobile) && (
                <span className={`
                  font-medium text-sm truncate transition-colors
                  ${active ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}
                `}>
                  {item.name}
                </span>
              )}

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
