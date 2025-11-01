import React, { useState, useEffect } from "react";
import { 
  Bell, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Building2, 
  Calendar,
  Eye,
  EyeOff,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  User,
  Plus,
  XCircle
} from "lucide-react";
import { toast } from 'react-toastify';
import { useSearch } from "../../Components/InternalTeamLayout";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [totalUnread, setTotalUnread] = useState(0);
  const [totalRead, setTotalRead] = useState(0);
  const [totalHighPriority, setTotalHighPriority] = useState(0);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, read, high_priority
  const [expandedNotifications, setExpandedNotifications] = useState(new Set());
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedNotificationForOffer, setSelectedNotificationForOffer] = useState(null);
  const [isCreatingOffer, setIsCreatingOffer] = useState(false);
  const [offerErrors, setOfferErrors] = useState({});
  const { searchTerm } = useSearch();

  const [newOffer, setNewOffer] = useState({
    candidate_code: "",
    candidate_selection_id: "",
    job_title: "",
    job_description: "",
    offered_salary: "",
    location: "",
    benefits: [],
    start_date: "",
    offer_deadline: "",
    offer_notes: ""
  });

  const benefitOptions = [
    "Health Insurance", "401k", "Stock Options", "Flexible Hours", 
    "Remote Work", "Learning Budget", "Gym Membership", "Commuter Benefits", 
    "Equity", "Dental Insurance", "Vision Insurance", "Life Insurance"
  ];

  // API Base URL from environment variable
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // Get today's date in YYYY-MM-DD format for min date
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Fetch notification statistics efficiently
  const fetchNotificationStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch total count
      const totalResponse = await fetch(`${baseURL}/api/internal/notifications?page=1&per_page=1`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!totalResponse.ok) {
        return;
      }

      const totalData = await totalResponse.json();
      
      if (totalData.notifications) {
        const total = totalData.notifications.total || 0;
        setTotalNotifications(total);
        
        // Fetch unread count
        const unreadResponse = await fetch(`${baseURL}/api/internal/notifications?page=1&per_page=1&unread_only=true`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (unreadResponse.ok) {
          const unreadData = await unreadResponse.json();
          const unreadTotal = unreadData.notifications?.total || 0;
          setTotalUnread(unreadTotal);
          setTotalRead(total - unreadTotal);
        }
      }
    } catch (err) {
      console.error('Error fetching notification stats:', err);
    }
  };

  // Fetch high priority count (called separately to avoid blocking)
  const fetchHighPriorityCount = async () => {
    try {
      const token = localStorage.getItem('token');
      let highPriorityCount = 0;
      let currentPage = 1;
      let hasMore = true;

      // Fetch all pages to count high priority notifications
      while (hasMore) {
        const response = await fetch(`${baseURL}/api/internal/notifications?page=${currentPage}&per_page=100`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) break;

        const data = await response.json();
        
        if (data.notifications && data.notifications.data) {
          const pageHighPriority = data.notifications.data.filter(n => n.priority === 'high').length;
          highPriorityCount += pageHighPriority;
          
          hasMore = currentPage < (data.notifications.last_page || 1);
          currentPage++;
        } else {
          hasMore = false;
        }
      }

      setTotalHighPriority(highPriorityCount);
    } catch (err) {
      console.error('Error fetching high priority count:', err);
    }
  };

  // Fetch notifications from API
  const fetchNotifications = async (page = 1, perPage = 20, unreadOnly = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseURL}/api/internal/notifications?page=${page}&per_page=${perPage}&unread_only=${unreadOnly}`, {
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
      const response = await fetch(`${baseURL}/api/internal/notifications/${notificationId}/read`, {
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
        // Update stats after marking as read
        setTotalUnread(prev => Math.max(0, prev - 1));
        setTotalRead(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

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
      const count = selectedNotifications.length;
      await Promise.all(selectedNotifications.map(id => markAsRead(id)));
      setSelectedNotifications([]);
      // Update stats after marking multiple as read
      setTotalUnread(prev => Math.max(0, prev - count));
      setTotalRead(prev => prev + count);
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

  // Handle create offer button click
  const handleCreateOfferClick = (notification) => {
    const candidateSelection = notification.candidate_selection;
    const candidateProfile = candidateSelection?.candidate_profile;
    
    // Pre-fill form with data from notification
    setNewOffer({
      candidate_code: candidateProfile?.candidate_code || "",
      candidate_selection_id: candidateSelection?.id || "",
      job_title: candidateSelection?.job_title || "",
      job_description: candidateSelection?.job_description || "",
      offered_salary: candidateSelection?.offered_salary_max || candidateSelection?.offered_salary_min || "",
      location: candidateSelection?.location || "",
      benefits: [],
      start_date: "",
      offer_deadline: "",
      offer_notes: candidateSelection?.notes || ""
    });
    setSelectedNotificationForOffer(notification);
    setOfferErrors({});
    setShowOfferModal(true);
  };

  // Validate offer form
  const validateOffer = () => {
    const newErrors = {};

    if (!newOffer.job_title?.trim()) {
      newErrors.job_title = "Job title is required";
    }

    if (!newOffer.job_description?.trim()) {
      newErrors.job_description = "Job description is required";
    }

    if (!newOffer.offered_salary?.toString().trim()) {
      newErrors.offered_salary = "Offered salary is required";
    } else if (isNaN(Number(newOffer.offered_salary)) || Number(newOffer.offered_salary) <= 0) {
      newErrors.offered_salary = "Offered salary must be a valid positive number";
    }

    if (!newOffer.location?.trim()) {
      newErrors.location = "Location is required";
    }

    if (!newOffer.benefits || newOffer.benefits.length === 0) {
      newErrors.benefits = "At least one benefit is required";
    }

    if (!newOffer.start_date) {
      newErrors.start_date = "Start date is required";
    } else {
      const startDate = new Date(newOffer.start_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDate < today) {
        newErrors.start_date = "Start date cannot be in the past";
      }
    }

    if (!newOffer.offer_deadline) {
      newErrors.offer_deadline = "Offer deadline is required";
    } else {
      const deadline = new Date(newOffer.offer_deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadline < today) {
        newErrors.offer_deadline = "Offer deadline cannot be in the past";
      }
    }

    if (!newOffer.offer_notes?.trim()) {
      newErrors.offer_notes = "Offer notes is required";
    }

    setOfferErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save offer
  const handleSaveOffer = async () => {
    if (!validateOffer()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsCreatingOffer(true);
    setOfferErrors({});

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        setIsCreatingOffer(false);
        return;
      }

      // Prepare API data
      const offerData = {
        candidate_code: newOffer.candidate_code.trim(),
        candidate_selection_id: Number(newOffer.candidate_selection_id),
        job_title: newOffer.job_title.trim(),
        job_description: newOffer.job_description.trim(),
        offered_salary: Number(newOffer.offered_salary),
        location: newOffer.location.trim(),
        benefits: newOffer.benefits,
        start_date: newOffer.start_date,
        offer_deadline: newOffer.offer_deadline,
        offer_notes: newOffer.offer_notes.trim()
      };

      // Make API call
      const response = await fetch(`${baseURL}/api/internal/offers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(offerData),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = data.message || data.error || 'Failed to create offer';
        
        // If API returns field-specific errors
        if (data.errors) {
          const fieldErrors = {};
          Object.keys(data.errors).forEach(key => {
            fieldErrors[key] = Array.isArray(data.errors[key]) 
              ? data.errors[key][0] 
              : data.errors[key];
          });
          setOfferErrors(fieldErrors);
          toast.error("Please correct the errors in the form");
        } else {
          toast.error(errorMessage);
        }
        
        setIsCreatingOffer(false);
        return;
      }
      
      // Show success toast
      toast.success("Offer created successfully!");
      
      // Close modal and reset form
      setShowOfferModal(false);
      setNewOffer({
        candidate_code: "",
        candidate_selection_id: "",
        job_title: "",
        job_description: "",
        offered_salary: "",
        location: "",
        benefits: [],
        start_date: "",
        offer_deadline: "",
        offer_notes: ""
      });
      setOfferErrors({});
      setSelectedNotificationForOffer(null);
      
    } catch (error) {
      console.error("Error creating offer:", error);
      toast.error(error.message || "Failed to create offer. Please try again.");
    } finally {
      setIsCreatingOffer(false);
    }
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

  const statusCounts = {
    total: totalNotifications,
    unread: totalUnread,
    read: totalRead,
    highPriority: totalHighPriority
  };

  // Initial load - fetch stats once
  useEffect(() => {
    fetchNotificationStats();
    fetchHighPriorityCount();
  }, []);

  // Fetch notifications when page or filter changes
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
            onClick={() => {
              fetchNotifications(currentPage, 20, filter === 'unread');
              fetchNotificationStats();
              fetchHighPriorityCount();
            }}
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
              onClick={() => {
                fetchNotifications(currentPage, 20, filter === 'unread');
                fetchNotificationStats();
                fetchHighPriorityCount();
              }}
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
                            {candidateSelection && (
                              <button
                                onClick={() => handleCreateOfferClick(notification)}
                                className="flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white text-xs rounded-md hover:bg-emerald-600 transition-colors"
                              >
                                <Plus className="h-4 w-4" />
                                Create Offer
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

      {/* Create Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Create New Offer
              </h3>
              <button
                onClick={() => {
                  setShowOfferModal(false);
                  setSelectedNotificationForOffer(null);
                  setOfferErrors({});
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Offer Details */}
                <div className="space-y-4 md:col-span-2">
                  <h4 className="text-md font-medium text-gray-900">Offer Details</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newOffer.job_title}
                      onChange={(e) => {
                        setNewOffer(prev => ({ ...prev, job_title: e.target.value }));
                        if (offerErrors.job_title) {
                          setOfferErrors(prev => ({ ...prev, job_title: "" }));
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-transparent ${
                        offerErrors.job_title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Senior Software Engineer"
                    />
                    {offerErrors.job_title && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {offerErrors.job_title}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={newOffer.job_description}
                      onChange={(e) => {
                        setNewOffer(prev => ({ ...prev, job_description: e.target.value }));
                        if (offerErrors.job_description) {
                          setOfferErrors(prev => ({ ...prev, job_description: "" }));
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-transparent resize-none ${
                        offerErrors.job_description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Lead development team and work on high-impact projects..."
                    />
                    {offerErrors.job_description && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {offerErrors.job_description}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Offered Salary <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={newOffer.offered_salary}
                        onChange={(e) => {
                          setNewOffer(prev => ({ ...prev, offered_salary: e.target.value }));
                          if (offerErrors.offered_salary) {
                            setOfferErrors(prev => ({ ...prev, offered_salary: "" }));
                          }
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-transparent ${
                          offerErrors.offered_salary ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="1200000"
                        min="0"
                      />
                      {offerErrors.offered_salary && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {offerErrors.offered_salary}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newOffer.location}
                        onChange={(e) => {
                          setNewOffer(prev => ({ ...prev, location: e.target.value }));
                          if (offerErrors.location) {
                            setOfferErrors(prev => ({ ...prev, location: "" }));
                          }
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-transparent ${
                          offerErrors.location ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Mumbai, India"
                      />
                      {offerErrors.location && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {offerErrors.location}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={newOffer.start_date}
                        onChange={(e) => {
                          setNewOffer(prev => ({ ...prev, start_date: e.target.value }));
                          if (offerErrors.start_date) {
                            setOfferErrors(prev => ({ ...prev, start_date: "" }));
                          }
                        }}
                        min={getTodayDate()}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-transparent ${
                          offerErrors.start_date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {offerErrors.start_date && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {offerErrors.start_date}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Offer Deadline <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={newOffer.offer_deadline}
                        onChange={(e) => {
                          setNewOffer(prev => ({ ...prev, offer_deadline: e.target.value }));
                          if (offerErrors.offer_deadline) {
                            setOfferErrors(prev => ({ ...prev, offer_deadline: "" }));
                          }
                        }}
                        min={getTodayDate()}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-transparent ${
                          offerErrors.offer_deadline ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {offerErrors.offer_deadline && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {offerErrors.offer_deadline}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Benefits <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {benefitOptions.map(benefit => (
                        <label key={benefit} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newOffer.benefits.includes(benefit)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewOffer(prev => ({ ...prev, benefits: [...prev.benefits, benefit] }));
                              } else {
                                setNewOffer(prev => ({ ...prev, benefits: prev.benefits.filter(b => b !== benefit) }));
                              }
                              if (offerErrors.benefits) {
                                setOfferErrors(prev => ({ ...prev, benefits: "" }));
                              }
                            }}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{benefit}</span>
                        </label>
                      ))}
                    </div>
                    {offerErrors.benefits && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {offerErrors.benefits}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Offer Notes <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={newOffer.offer_notes}
                      onChange={(e) => {
                        setNewOffer(prev => ({ ...prev, offer_notes: e.target.value }));
                        if (offerErrors.offer_notes) {
                          setOfferErrors(prev => ({ ...prev, offer_notes: "" }));
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-transparent resize-none ${
                        offerErrors.offer_notes ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Great opportunity to grow with a leading tech company"
                    />
                    {offerErrors.offer_notes && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {offerErrors.offer_notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 p-6 border-t">
              <button
                type="button"
                onClick={() => {
                  setShowOfferModal(false);
                  setSelectedNotificationForOffer(null);
                  setOfferErrors({});
                }}
                disabled={isCreatingOffer}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md border border-gray-300 hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveOffer}
                disabled={isCreatingOffer}
                className="px-4 py-2 bg-emerald-500 text-white rounded-md border border-emerald-600 hover:bg-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isCreatingOffer ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  "Create Offer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;

