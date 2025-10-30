import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  ChevronRight,
  X
} from "lucide-react";

const RecruiterSidebar = ({ isCollapsed, setIsCollapsed, onMobileClose, isMobile, mobileSidebarOpen }) => {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/recruiter/dashboard",
      icon: LayoutDashboard,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    },
    {
      name: "Shortlisted Candidates",
      path: "/recruiter/shortlisted",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      name: "My Profile",
      path: "/recruiter/profile",
      icon: UserCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100"
    },
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
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RC</span>
            </div>
            <span className="text-lg font-semibold text-gray-800">Recruiter</span>
          </div>
          <button
            onClick={onMobileClose}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {!isMobile && (
        <div className={`border-b border-gray-200 transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-4'}`}>
          <div className={`flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className={`bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'w-8 h-8' : 'w-10 h-10'}`}>
              <span className={`text-white font-bold transition-all duration-300 ${isCollapsed ? 'text-sm' : 'text-lg'}`}>RC</span>
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-xs text-gray-500 truncate">Recruiter Console</p>
              </div>
            )}
          </div>
        </div>
      )}

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

export default RecruiterSidebar;


