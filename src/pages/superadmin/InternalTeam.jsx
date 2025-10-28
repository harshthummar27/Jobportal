import React, { useState, useEffect } from "react";
import { 
  Shield, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  Calendar,
  Mail,
  Phone,
  Plus,
  User,
  UserCheck,
  XCircle,
  Save,
  X
} from "lucide-react";
import { useSearch } from "../../Components/SuperAdminLayout";

const InternalTeam = () => {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const { searchTerm } = useSearch();

  // Mock data - in real app, replace with API call
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: "John Admin",
      email: "admin@vettedpool.com",
      mobile: "+1 234-567-8901",
      role: "Super Admin",
      department: "Administration",
      joinDate: "2024-01-01",
      status: "active",
      permissions: ["all"],
      lastLogin: "2 hours ago",
      totalActions: 1250,
      location: "San Francisco, CA",
      employeeId: "EMP001"
    },
    {
      id: 2,
      name: "Sarah HR",
      email: "sarah.hr@vettedpool.com",
      mobile: "+1 234-567-8902",
      role: "HR Manager",
      department: "Human Resources",
      joinDate: "2024-01-15",
      status: "active",
      permissions: ["candidates", "recruiters"],
      lastLogin: "1 hour ago",
      totalActions: 890,
      location: "Austin, TX",
      employeeId: "EMP002"
    },
    {
      id: 3,
      name: "Mike Tech",
      email: "mike.tech@vettedpool.com",
      mobile: "+1 234-567-8903",
      role: "Technical Lead",
      department: "Technology",
      joinDate: "2024-02-01",
      status: "active",
      permissions: ["candidates", "interviews"],
      lastLogin: "30 minutes ago",
      totalActions: 650,
      location: "Seattle, WA",
      employeeId: "EMP003"
    },
    {
      id: 4,
      name: "Lisa Support",
      email: "lisa.support@vettedpool.com",
      mobile: "+1 234-567-8904",
      role: "Support Specialist",
      department: "Customer Support",
      joinDate: "2024-02-15",
      status: "inactive",
      permissions: ["support"],
      lastLogin: "1 week ago",
      totalActions: 320,
      location: "Chicago, IL",
      employeeId: "EMP004"
    },
    {
      id: 5,
      name: "David Analytics",
      email: "david.analytics@vettedpool.com",
      mobile: "+1 234-567-8905",
      role: "Data Analyst",
      department: "Analytics",
      joinDate: "2024-02-20",
      status: "active",
      permissions: ["analytics", "candidates"],
      lastLogin: "3 hours ago",
      totalActions: 420,
      location: "New York, NY",
      employeeId: "EMP005"
    },
    {
      id: 6,
      name: "Emily Marketing",
      email: "emily.marketing@vettedpool.com",
      mobile: "+1 234-567-8906",
      role: "Marketing Manager",
      department: "Marketing",
      joinDate: "2024-03-01",
      status: "active",
      permissions: ["analytics"],
      lastLogin: "2 hours ago",
      totalActions: 280,
      location: "Los Angeles, CA",
      employeeId: "EMP006"
    },
    {
      id: 7,
      name: "Robert Finance",
      email: "robert.finance@vettedpool.com",
      mobile: "+1 234-567-8907",
      role: "Finance Manager",
      department: "Finance",
      joinDate: "2024-03-05",
      status: "active",
      permissions: ["analytics"],
      lastLogin: "1 day ago",
      totalActions: 150,
      location: "Denver, CO",
      employeeId: "EMP007"
    },
    {
      id: 8,
      name: "Jennifer Interviewer",
      email: "jennifer.interviewer@vettedpool.com",
      mobile: "+1 234-567-8908",
      role: "Senior Interviewer",
      department: "Human Resources",
      joinDate: "2024-03-10",
      status: "active",
      permissions: ["candidates", "interviews"],
      lastLogin: "4 hours ago",
      totalActions: 580,
      location: "Boston, MA",
      employeeId: "EMP008"
    },
    {
      id: 9,
      name: "Kevin Operations",
      email: "kevin.operations@vettedpool.com",
      mobile: "+1 234-567-8909",
      role: "Operations Manager",
      department: "Operations",
      joinDate: "2024-03-15",
      status: "active",
      permissions: ["candidates", "recruiters", "support"],
      lastLogin: "6 hours ago",
      totalActions: 720,
      location: "Miami, FL",
      employeeId: "EMP009"
    },
    {
      id: 10,
      name: "Amanda Quality",
      email: "amanda.quality@vettedpool.com",
      mobile: "+1 234-567-8910",
      role: "Quality Assurance",
      department: "Technology",
      joinDate: "2024-03-20",
      status: "active",
      permissions: ["candidates", "interviews"],
      lastLogin: "1 hour ago",
      totalActions: 340,
      location: "Phoenix, AZ",
      employeeId: "EMP010"
    },
    {
      id: 11,
      name: "Christopher Legal",
      email: "christopher.legal@vettedpool.com",
      mobile: "+1 234-567-8911",
      role: "Legal Counsel",
      department: "Legal",
      joinDate: "2024-03-25",
      status: "active",
      permissions: ["analytics"],
      lastLogin: "2 days ago",
      totalActions: 95,
      location: "Washington, DC",
      employeeId: "EMP011"
    },
    {
      id: 12,
      name: "Rachel Training",
      email: "rachel.training@vettedpool.com",
      mobile: "+1 234-567-8912",
      role: "Training Coordinator",
      department: "Human Resources",
      joinDate: "2024-04-01",
      status: "inactive",
      permissions: ["candidates"],
      lastLogin: "2 weeks ago",
      totalActions: 180,
      location: "Portland, OR",
      employeeId: "EMP012"
    }
  ]);

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
    mobile_number: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showAddModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddModal]);


  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectMember = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map(m => m.id));
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setNewMember({
      name: member.name,
      email: member.email,
      password: "",
      role: "staff",
      mobile_number: member.mobile
    });
    setError("");
    setShowAddModal(true);
  };

  const handleDelete = (memberId) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
      alert("Team member has been deleted!");
    }
  };

  const handleView = (member) => {
    alert(`Viewing profile for ${member.name}\nRole: ${member.role}\nDepartment: ${member.department}\nEmail: ${member.email}`);
  };

  const handleBulkDelete = () => {
    if (selectedMembers.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedMembers.length} team members?`)) {
      setTeamMembers(prev => prev.filter(member => !selectedMembers.includes(member.id)));
      alert(`${selectedMembers.length} team members have been deleted!`);
      setSelectedMembers([]);
    }
  };

  const handleAddMember = () => {
    setNewMember({
      name: "",
      email: "",
      password: "",
      role: "staff",
      mobile_number: ""
    });
    setEditingMember(null);
    setError("");
    setShowAddModal(true);
  };

  const handleSaveMember = async () => {
    // Validate required fields
    if (!newMember.name || !newMember.email || !newMember.password || !newMember.mobile_number) {
      setError("Please fill in all required fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newMember.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Basic mobile number validation
    if (newMember.mobile_number.length < 10) {
      setError("Please enter a valid mobile number");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newMember.name,
          email: newMember.email,
          password: newMember.password,
          role: newMember.role,
          mobile_number: newMember.mobile_number
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register team member');
      }

      const result = await response.json();
      
      // Add the new member to the local state
      const newId = Math.max(...teamMembers.map(m => m.id)) + 1;
      setTeamMembers(prev => [...prev, {
        id: newId,
        name: newMember.name,
        email: newMember.email,
        mobile: newMember.mobile_number,
        role: "Internal Team",
        department: "Internal",
        joinDate: new Date().toISOString().split('T')[0],
        status: "active",
        permissions: ["candidates"],
        lastLogin: "Never",
        totalActions: 0,
        location: "N/A",
        employeeId: `EMP${String(newId).padStart(3, '0')}`
      }]);

      alert("Team member has been successfully registered!");
      setShowAddModal(false);
      setEditingMember(null);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Failed to register team member. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", icon: UserCheck },
      inactive: { color: "bg-gray-100 text-gray-800", icon: XCircle }
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="w-full max-w-none">
        {/* Add Team Member Button */}
        <div className="mb-6">
          <div className="flex justify-end">
            <button
              onClick={handleAddMember}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-green-500 text-white rounded-md border border-green-600 hover:bg-green-600 transition-all duration-200 shadow-sm text-sm sm:text-base"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Team Member</span>
              <span className="sm:hidden">Add Member</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div className="bg-white rounded-lg shadow-md p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-indigo-600">{teamMembers.length}</p>
              </div>
              <User className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Members</p>
                <p className="text-2xl font-bold text-green-600">
                  {teamMembers.filter(m => m.status === 'active').length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-blue-600">
                  {new Set(teamMembers.map(m => m.department)).size}
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admin Users</p>
                <p className="text-2xl font-bold text-purple-600">
                  {teamMembers.filter(m => m.role === 'Super Admin').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>


        {/* Bulk Actions */}
        {selectedMembers.length > 0 && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-2 mb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-indigo-800 font-medium text-sm">
                {selectedMembers.length} member(s) selected
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs rounded-md border border-red-600 hover:bg-red-600 transition-all duration-200 shadow-sm"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Team Members Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-2 py-2 text-left">
                    <input
                      type="checkbox"
                      checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Team Member
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Contact Info
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Role & Department
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Join Date
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Permissions
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-2 py-2">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member.id)}
                        onChange={() => handleSelectMember(member.id)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 text-indigo-600" />
                        </div>
                        <div className="ml-2 min-w-0">
                          <div className="text-xs font-medium text-gray-900 truncate">{member.name}</div>
                          <div className="text-[10px] text-gray-500">ID: {member.id}</div>
                          <div className="text-[10px] text-gray-500 sm:hidden">{member.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2 hidden sm:table-cell">
                      <div className="text-[10px] text-gray-900 truncate">
                        {member.email}
                      </div>
                      <div className="text-[10px] text-gray-500 truncate">
                        {member.mobile}
                      </div>
                    </td>
                    <td className="px-2 py-2 hidden lg:table-cell">
                      <div className="text-[10px] text-gray-900 font-medium">{member.role}</div>
                      <div className="text-[10px] text-gray-500">{member.department}</div>
                    </td>
                    <td className="px-2 py-2 hidden md:table-cell">
                      <div className="text-[10px] text-gray-900">
                        {member.joinDate}
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      {getStatusBadge(member.status)}
                    </td>
                    <td className="px-2 py-2 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-0.5">
                        {member.permissions.includes("all") ? (
                          <span className="inline-block bg-purple-100 text-purple-800 text-[9px] px-1 py-0.5 rounded">
                            All
                          </span>
                        ) : (
                          member.permissions.slice(0, 2).map((permission, index) => (
                            <span
                              key={index}
                              className="inline-block bg-gray-100 text-gray-800 text-[9px] px-1 py-0.5 rounded"
                            >
                              {permission}
                            </span>
                          ))
                        )}
                        {member.permissions.length > 2 && !member.permissions.includes("all") && (
                          <span className="inline-block bg-gray-200 text-gray-600 text-[9px] px-1 py-0.5 rounded">
                            +{member.permissions.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(member)}
                          className="flex items-center gap-0.5 px-1.5 py-0.5 bg-green-500 text-white text-[9px] rounded border border-green-600 hover:bg-green-600 transition-all duration-200 shadow-sm"
                        >
                          <Edit className="h-2.5 w-2.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleView(member)}
                          className="flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-100 text-gray-700 text-[9px] rounded border border-gray-300 hover:bg-gray-200 transition-all duration-200 shadow-sm"
                        >
                          <Eye className="h-2.5 w-2.5" />
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="flex items-center gap-0.5 px-1.5 py-0.5 bg-red-500 text-white text-[9px] rounded border border-red-600 hover:bg-red-600 transition-all duration-200 shadow-sm"
                        >
                          <Trash2 className="h-2.5 w-2.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredMembers.length === 0 && (
            <div className="text-center py-8">
              <Shield className="mx-auto h-8 w-8 text-gray-400" />
              <h3 className="mt-2 text-xs font-medium text-gray-900">No team members found</h3>
              <p className="mt-1 text-[10px] text-gray-500">
                {searchTerm ? "No team members match your search criteria." : "No team members have been added yet."}
              </p>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingMember ? "Edit Team Member" : "Add New Team Member"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter full name"
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter email address"
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <input
                    type="password"
                    value={newMember.password}
                    onChange={(e) => setNewMember(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter password"
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    value={newMember.mobile_number}
                    onChange={(e) => setNewMember(prev => ({ ...prev, mobile_number: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter mobile number"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> The role is automatically set to "staff" for all new team members.
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md border border-gray-300 hover:bg-gray-200 transition-all duration-200 shadow-sm"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMember}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md border border-green-600 hover:bg-green-600 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Registering...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Register Team Member
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        )}
    </div>
  );
};

export default InternalTeam;
