import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard,
  Shield
} from "lucide-react";

const SuperAdminSidebar = ({ isCollapsed, setIsCollapsed, onMobileClose, isMobile, mobileSidebarOpen }) => {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/superadmin/dashboard",
      icon: LayoutDashboard,
      description: "Overview and statistics"
    },
    {
      name: "Internal Team",
      path: "/superadmin/internal-team",
      icon: Shield,
      description: "Manage team members"
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`
      fixed top-12 left-0 h-[calc(100vh-3rem)] bg-white/95 backdrop-blur-sm shadow-xl border-r border-gray-200/50 transition-all duration-300 ease-in-out z-50
      ${isMobile 
        ? (mobileSidebarOpen ? 'w-[50vw] sm:w-[28vw] md:w-[25vw] translate-x-0' : 'w-[30vw] sm:w-[28vw] md:w-[25vw] -translate-x-full')
        : (isCollapsed ? 'w-16' : 'w-64')
      }
      ${!isMobile ? 'lg:translate-x-0' : ''}
    `}>
        {/* Navigation */}
        <nav className={`flex-1 py-2 sm:py-3 md:py-6 space-y-1 sm:space-y-2 ${(isCollapsed && !isMobile) ? 'px-1 sm:px-2' : 'px-2 sm:px-3 md:px-4'}`}>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);
            const isCollapsedMode = (isCollapsed && !isMobile);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onMobileClose}
                className={`
                  flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-3 rounded-lg transition-all duration-200 group relative touch-manipulation
                  ${active 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                  ${isCollapsedMode ? 'justify-center px-1 sm:px-2' : ''}
                `}
                title={isCollapsedMode ? item.name : ''}
              >
                <div className={`p-0.5 sm:p-1 rounded-md ${active ? 'bg-indigo-100' : 'group-hover:bg-gray-100'}`}>
                  <IconComponent className={`
                    h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0
                    ${active ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-700'}
                  `} />
                </div>
                {!isCollapsedMode && (
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-medium truncate">{item.name}</div>
                    <div className="text-xs text-gray-500 truncate hidden sm:block">{item.description}</div>
                  </div>
                )}
                {active && !isCollapsedMode && (
                  <div className="absolute right-0 top-2 bottom-2 w-1 bg-indigo-600 rounded-l-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

      </div>
  );
};

export default SuperAdminSidebar;
