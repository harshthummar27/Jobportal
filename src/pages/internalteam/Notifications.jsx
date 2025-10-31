import React, { useState, useEffect } from "react";
import { 
  Bell, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Building2, 
  MapPin, 
  DollarSign,
  Calendar,
  Eye,
  EyeOff,
  Filter,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Mail
} from "lucide-react";
import { useSearch } from "../../Components/InternalTeamLayout";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, read, high_priority
  const [expandedNotifications, setExpandedNotifications] = useState(new Set());
  const { searchTerm } = useSearch();

  // Fetch notifications from API
  const fetchNotifications = async (page = 1, perPage = 20, unreadOnly = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`https://vettedpool.com/backend/api/internal/notifications?page=${page}&per_page=${perPage}&unread_only=${unreadOnly}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.notifications && data.notifications.data) {
        setNotifications(data.notifications.data);
        setCurrentPage(data.notifications.current_page);
        setTotalPages(data.notifications.last_page);
        setTotalNotifications(data.notifications.total);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to fetch notifications. Please try again.');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://vettedpool.com/backend/api/internal/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, is_read: true, read_at: new Date().toISOString() }
              : notification
          )
        );
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Removed markAsProcessed per requirement to remove approve/processed actions

  // Filter notifications based on search term and filter
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = !searchTerm || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.candidate_selection?.candidate_profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.candidate_selection?.recruiter?.recruiter_profile?.company_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.is_read) ||
      (filter === 'read' && notification.is_read) ||
      (filter === 'high_priority' && notification.priority === 'high');

    return matchesSearch && matchesFilter;
  });

  // Handle notification selection
  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    const unreadIds = filteredNotifications.filter(n => !n.is_read).map(n => n.id);
    if (selectedNotifications.length === unreadIds.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(unreadIds);
    }
  };

  const handleMarkSelectedAsRead = async () => {
    if (selectedNotifications.length === 0) return;
    try {
      await Promise.all(selectedNotifications.map(id => markAsRead(id)));
      setSelectedNotifications([]);
    } catch (e) {
      // individual markAsRead already logs errors
    }
  };

  // Toggle notification expansion
  const toggleExpanded = (notificationId) => {
    setExpandedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    const config = {
      high: { color: "bg-red-100 text-red-800", icon: AlertCircle, label: "High Priority" },
      normal: { color: "bg-gray-100 text-gray-800", icon: Bell, label: "Normal" }
    };
    
    const { color, icon: Icon, label } = config[priority] || config.normal;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        <Icon className="h-3 w-3" />
        {label}
      </span>
    );
  };

  // Get read status badge
  const getReadStatusBadge = (isRead) => {
    return isRead ? (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3" />
        Read
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Clock className="h-3 w-3" />
        Unread
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status counts
  const getStatusCounts = () => {
    return {
      total: notifications.length,
      unread: notifications.filter(n => !n.is_read).length,
      read: notifications.filter(n => n.is_read).length,
      highPriority: notifications.filter(n => n.priority === 'high').length
    };
  };

  const statusCounts = getStatusCounts();

  useEffect(() => {
    fetchNotifications(currentPage, 20, filter === 'unread');
  }, [currentPage, filter]);

  if (loading) {
    return (
      <div className="w-full max-w-none">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin text-emerald-600" />
            <span className="text-gray-600">Loading notifications...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-none">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Notifications</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchNotifications(currentPage, 20, filter === 'unread')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Notifications</p>
              <p className="text-2xl font-bold text-blue-600">{statusCounts.total}</p>
            </div>
            <Bell className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-yellow-600">{statusCounts.unread}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Read</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.read}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-red-600">{statusCounts.highPriority}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">All Notifications</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
                <option value="high_priority">High Priority</option>
              </select>
            </div>
            
            <button
              onClick={() => fetchNotifications(currentPage, 20, filter === 'unread')}
              className="flex items-center gap-1 px-3 py-2 bg-emerald-500 text-white text-sm rounded-md hover:bg-emerald-600 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          {selectedNotifications.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {selectedNotifications.length} selected
              </span>
              <button onClick={handleMarkSelectedAsRead} className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors">
                Mark as Read
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-500">
              {searchTerm ? "No notifications match your search criteria." : "No notifications available."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => {
              const isExpanded = expandedNotifications.has(notification.id);
              const candidateSelection = notification.candidate_selection;
              const candidateProfile = candidateSelection?.candidate_profile;
              const recruiterProfile = candidateSelection?.recruiter?.recruiter_profile;
              const displayTitle = candidateSelection && candidateProfile
                ? `Recruiter ${candidateSelection?.recruiter?.name || ''} selected candidate ${candidateProfile?.candidate_code || ''}`
                : notification.title;
              
              // LinkedIn-style styling: unread = blue background, read = white background
              const isUnread = !notification.is_read;
              
              return (
                <div
                  key={notification.id}
                  className={`p-3 md:p-4 transition-colors relative ${
                    isUnread 
                      ? 'bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500' 
                      : 'bg-white hover:bg-gray-50 border-l-4 border-transparent'
                  }`}
                >
                  {/* Unread indicator dot (like LinkedIn) */}
                  {isUnread && (
                    <div className="absolute left-2 top-6 w-[6px] h-[6px] bg-blue-600 rounded-full"></div>
                  )}
                  
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Mobile (smaller) layout: two lines */}
                      <div className="block md:hidden">
                        <div className="flex items-center gap-2 mb-1">
                          {isUnread && (
                            <input
                              type="checkbox"
                              checked={selectedNotifications.includes(notification.id)}
                              onChange={() => handleSelectNotification(notification.id)}
                              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                          )}
                          <h3 className={`text-sm flex items-center gap-2 ${
                            isUnread 
                              ? 'font-bold text-gray-900' 
                              : 'font-semibold text-gray-700'
                          }`}>
                            {displayTitle}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
                          {getPriorityBadge(notification.priority)}
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="h-4 w-4" />
                            {formatDate(notification.created_at)}
                          </span>
                        </div>
                      </div>

                      {/* Desktop layout: single line */}
                      <div className="hidden md:flex items-center gap-2 mb-1">
                        {isUnread && (
                          <input
                            type="checkbox"
                            checked={selectedNotifications.includes(notification.id)}
                            onChange={() => handleSelectNotification(notification.id)}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        )}
                        <h3 className={`text-base flex items-center gap-2 ${
                          isUnread 
                            ? 'font-bold text-gray-900' 
                            : 'font-semibold text-gray-700'
                        }`}>
                          {displayTitle}
                        </h3>
                        {getPriorityBadge(notification.priority)}
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {formatDate(notification.created_at)}
                        </span>
                      </div>

                      {isExpanded && (
                        <div className="mt-2">

                          {/* Candidate and Recruiter Info */}
                          {candidateSelection && (
                            <div className={`rounded-lg p-4 md:p-3 mb-2 ${
                              isUnread ? 'bg-blue-100/50 border-2 md:border border-blue-200' : 'bg-gray-50'
                            }`}>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-3">
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-1 md:mb-2 flex items-center gap-2 text-xs md:text-sm">
                                    <User className="h-4 w-4" />
                                    Candidate Details
                                  </h4>
                                  {candidateProfile && (
                                    <div className="space-y-1 text-[11px] md:text-xs">
                                      <p><strong>Name:</strong> {candidateProfile.full_name}</p>
                                      <p><strong>Code:</strong> {candidateProfile.candidate_code}</p>
                                      <p><strong>Email:</strong> {candidateProfile.contact_email}</p>
                                      <p><strong>Phone:</strong> {candidateProfile.contact_phone}</p>
                                      <p><strong>Location:</strong> {candidateProfile.city}, {candidateProfile.state}</p>
                                    </div>
                                  )}
                                </div>
                                
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-1 md:mb-2 flex items-center gap-2 text-xs md:text-sm">
                                    <Building2 className="h-4 w-4" />
                                    Recruiter Details
                                  </h4>
                                  {recruiterProfile && (
                                    <div className="space-y-1 text-[11px] md:text-xs">
                                      <p><strong>Company:</strong> {recruiterProfile.company_name}</p>
                                      <p><strong>Contact:</strong> {candidateSelection.recruiter.name}</p>
                                      <p><strong>Email:</strong> {candidateSelection.recruiter.email}</p>
                                      <p><strong>Phone:</strong> {candidateSelection.recruiter.mobile_number}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="mt-2 pt-2 border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 text-[11px] md:text-xs">
                                  <div>
                                    <p><strong>Job Title:</strong> {candidateSelection.job_title}</p>
                                    <p><strong>Location:</strong> {candidateSelection.location}</p>
                                  </div>
                                  <div>
                                    <p><strong>Salary Range:</strong> ${candidateSelection.offered_salary_min} - ${candidateSelection.offered_salary_max}</p>
                                    <p><strong>Priority:</strong> {candidateSelection.is_priority ? 'Yes' : 'No'}</p>
                                  </div>
                                  <div>
                                    <p><strong>Status:</strong> {candidateSelection.selection_status}</p>
                                    <p><strong>Notes:</strong> {candidateSelection.notes || 'None'}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Action Buttons (expanded) */}
                          <div className="flex items-center gap-2">
                            {!notification.is_read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                                Mark as Read
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <button
                        onClick={() => toggleExpanded(notification.id)}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200 transition-colors"
                      >
                        {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {isExpanded ? 'Collapse' : 'Expand'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-md p-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalNotifications)} of {totalNotifications} notifications
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              
              <span className="px-3 py-2 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;

