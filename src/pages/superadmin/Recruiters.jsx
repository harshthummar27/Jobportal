import React, { useState } from "react";
import { 
  Building2, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  Calendar,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp
} from "lucide-react";
import { useSearch } from "../../Components/SuperAdminLayout";

const Recruiters = () => {
  const [selectedRecruiters, setSelectedRecruiters] = useState([]);
  const { searchTerm } = useSearch();

  // Mock data - in real app, replace with API call
  const recruiters = [
    {
      id: 1,
      name: "TechCorp Solutions",
      contactPerson: "John Manager",
      email: "john@techcorp.com",
      mobile: "+1 234-567-8901",
      registrationDate: "2024-01-15",
      status: "active",
      totalHires: 12,
      activeContracts: 3,
      totalSpent: 125000,
      lastActivity: "2 hours ago",
      companySize: "500-1000",
      industry: "Technology",
      location: "San Francisco, CA",
      rating: 4.8,
      monthlyBudget: 15000
    },
    {
      id: 2,
      name: "InnovateTech Inc",
      contactPerson: "Sarah Director",
      email: "sarah@innovatetech.com",
      mobile: "+1 234-567-8902",
      registrationDate: "2024-01-14",
      status: "active",
      totalHires: 8,
      activeContracts: 2,
      totalSpent: 85000,
      lastActivity: "1 day ago",
      companySize: "100-500",
      industry: "Fintech",
      location: "Austin, TX",
      rating: 4.6,
      monthlyBudget: 12000
    },
    {
      id: 3,
      name: "StartupX",
      contactPerson: "Mike CEO",
      email: "mike@startupx.com",
      mobile: "+1 234-567-8903",
      registrationDate: "2024-01-13",
      status: "pending",
      totalHires: 0,
      activeContracts: 0,
      totalSpent: 0,
      lastActivity: "3 days ago",
      companySize: "10-50",
      industry: "E-commerce",
      location: "Seattle, WA",
      rating: 0,
      monthlyBudget: 5000
    },
    {
      id: 4,
      name: "Enterprise Solutions",
      contactPerson: "Lisa VP",
      email: "lisa@enterprise.com",
      mobile: "+1 234-567-8904",
      registrationDate: "2024-01-12",
      status: "inactive",
      totalHires: 25,
      activeContracts: 0,
      totalSpent: 250000,
      lastActivity: "1 week ago",
      companySize: "1000+",
      industry: "Consulting",
      location: "New York, NY",
      rating: 4.2,
      monthlyBudget: 0
    },
    {
      id: 5,
      name: "CloudFirst Technologies",
      contactPerson: "David CTO",
      email: "david@cloudfirst.com",
      mobile: "+1 234-567-8905",
      registrationDate: "2024-01-11",
      status: "active",
      totalHires: 15,
      activeContracts: 4,
      totalSpent: 180000,
      lastActivity: "4 hours ago",
      companySize: "200-500",
      industry: "Cloud Computing",
      location: "Denver, CO",
      rating: 4.9,
      monthlyBudget: 20000
    },
    {
      id: 6,
      name: "DataDriven Corp",
      contactPerson: "Emily Data Lead",
      email: "emily@datadriven.com",
      mobile: "+1 234-567-8906",
      registrationDate: "2024-01-10",
      status: "active",
      totalHires: 6,
      activeContracts: 2,
      totalSpent: 75000,
      lastActivity: "6 hours ago",
      companySize: "50-200",
      industry: "Data Analytics",
      location: "Boston, MA",
      rating: 4.7,
      monthlyBudget: 10000
    },
    {
      id: 7,
      name: "MobileFirst Apps",
      contactPerson: "Alex Mobile Dev",
      email: "alex@mobilefirst.com",
      mobile: "+1 234-567-8907",
      registrationDate: "2024-01-09",
      status: "active",
      totalHires: 9,
      activeContracts: 3,
      totalSpent: 95000,
      lastActivity: "1 day ago",
      companySize: "100-300",
      industry: "Mobile Development",
      location: "Los Angeles, CA",
      rating: 4.5,
      monthlyBudget: 13000
    },
    {
      id: 8,
      name: "AI Innovations",
      contactPerson: "Dr. Sarah AI",
      email: "sarah@aiinnovations.com",
      mobile: "+1 234-567-8908",
      registrationDate: "2024-01-08",
      status: "pending",
      totalHires: 0,
      activeContracts: 0,
      totalSpent: 0,
      lastActivity: "2 days ago",
      companySize: "20-100",
      industry: "Artificial Intelligence",
      location: "Palo Alto, CA",
      rating: 0,
      monthlyBudget: 8000
    },
    {
      id: 9,
      name: "Blockchain Ventures",
      contactPerson: "Mike Blockchain",
      email: "mike@blockchainventures.com",
      mobile: "+1 234-567-8909",
      registrationDate: "2024-01-07",
      status: "active",
      totalHires: 4,
      activeContracts: 1,
      totalSpent: 45000,
      lastActivity: "3 hours ago",
      companySize: "30-150",
      industry: "Blockchain",
      location: "Miami, FL",
      rating: 4.3,
      monthlyBudget: 7000
    },
    {
      id: 10,
      name: "HealthTech Solutions",
      contactPerson: "Dr. Lisa Health",
      email: "lisa@healthtech.com",
      mobile: "+1 234-567-8910",
      registrationDate: "2024-01-06",
      status: "active",
      totalHires: 11,
      activeContracts: 2,
      totalSpent: 110000,
      lastActivity: "5 hours ago",
      companySize: "150-400",
      industry: "Healthcare Technology",
      location: "Chicago, IL",
      rating: 4.8,
      monthlyBudget: 16000
    },
    {
      id: 11,
      name: "EduTech Global",
      contactPerson: "Jennifer Education",
      email: "jennifer@edutech.com",
      mobile: "+1 234-567-8911",
      registrationDate: "2024-01-05",
      status: "active",
      totalHires: 7,
      activeContracts: 3,
      totalSpent: 65000,
      lastActivity: "1 day ago",
      companySize: "80-250",
      industry: "Education Technology",
      location: "Portland, OR",
      rating: 4.4,
      monthlyBudget: 9000
    },
    {
      id: 12,
      name: "GreenTech Industries",
      contactPerson: "Robert Green",
      email: "robert@greentech.com",
      mobile: "+1 234-567-8912",
      registrationDate: "2024-01-04",
      status: "inactive",
      totalHires: 3,
      activeContracts: 0,
      totalSpent: 35000,
      lastActivity: "2 weeks ago",
      companySize: "40-120",
      industry: "Clean Technology",
      location: "Phoenix, AZ",
      rating: 3.9,
      monthlyBudget: 0
    },
    {
      id: 13,
      name: "CyberSec Pro",
      contactPerson: "Kevin Security",
      email: "kevin@cybersec.com",
      mobile: "+1 234-567-8913",
      registrationDate: "2024-01-03",
      status: "active",
      totalHires: 13,
      activeContracts: 4,
      totalSpent: 140000,
      lastActivity: "2 hours ago",
      companySize: "200-600",
      industry: "Cybersecurity",
      location: "Washington, DC",
      rating: 4.9,
      monthlyBudget: 18000
    },
    {
      id: 14,
      name: "RetailTech Solutions",
      contactPerson: "Amanda Retail",
      email: "amanda@retailtech.com",
      mobile: "+1 234-567-8914",
      registrationDate: "2024-01-02",
      status: "active",
      totalHires: 5,
      activeContracts: 2,
      totalSpent: 55000,
      lastActivity: "4 hours ago",
      companySize: "60-180",
      industry: "Retail Technology",
      location: "Atlanta, GA",
      rating: 4.6,
      monthlyBudget: 11000
    },
    {
      id: 15,
      name: "GameDev Studios",
      contactPerson: "Chris Gaming",
      email: "chris@gamedev.com",
      mobile: "+1 234-567-8915",
      registrationDate: "2024-01-01",
      status: "pending",
      totalHires: 0,
      activeContracts: 0,
      totalSpent: 0,
      lastActivity: "1 day ago",
      companySize: "25-80",
      industry: "Game Development",
      location: "Austin, TX",
      rating: 0,
      monthlyBudget: 6000
    }
  ];

  const filteredRecruiters = recruiters.filter(recruiter =>
    recruiter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recruiter.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recruiter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recruiter.mobile.includes(searchTerm) ||
    recruiter.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recruiter.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recruiter.companySize.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectRecruiter = (recruiterId) => {
    setSelectedRecruiters(prev => 
      prev.includes(recruiterId) 
        ? prev.filter(id => id !== recruiterId)
        : [...prev, recruiterId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRecruiters.length === filteredRecruiters.length) {
      setSelectedRecruiters([]);
    } else {
      setSelectedRecruiters(filteredRecruiters.map(r => r.id));
    }
  };

  const handleEdit = (recruiter) => {
    // In real app, open edit modal or navigate to edit page
    console.log("Editing recruiter:", recruiter);
    alert(`Editing recruiter: ${recruiter.name}`);
  };

  const handleDelete = (recruiterId) => {
    // In real app, make API call to delete recruiter
    if (window.confirm("Are you sure you want to delete this recruiter?")) {
      console.log("Deleting recruiter:", recruiterId);
      alert(`Recruiter ${recruiterId} has been deleted!`);
    }
  };

  const handleView = (recruiterId) => {
    // In real app, navigate to recruiter profile page
    console.log("Viewing recruiter:", recruiterId);
    alert(`Viewing recruiter ${recruiterId} profile`);
  };

  const handleApprove = (recruiterId) => {
    // In real app, make API call to approve recruiter
    console.log("Approving recruiter:", recruiterId);
    alert(`Recruiter ${recruiterId} has been approved!`);
  };

  const handleBulkDelete = () => {
    if (selectedRecruiters.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedRecruiters.length} recruiters?`)) {
      console.log("Bulk deleting recruiters:", selectedRecruiters);
      alert(`${selectedRecruiters.length} recruiters have been deleted!`);
      setSelectedRecruiters([]);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      pending: { color: "bg-yellow-100 text-yellow-800", icon: XCircle },
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="w-full max-w-none">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-white rounded-lg shadow-md p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Recruiters</p>
                <p className="text-2xl font-bold text-green-600">
                  {recruiters.filter(r => r.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {recruiters.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hires</p>
                <p className="text-2xl font-bold text-blue-600">
                  {recruiters.reduce((sum, r) => sum + r.totalHires, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(recruiters.reduce((sum, r) => sum + r.totalSpent, 0))}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>


        {/* Bulk Actions */}
        {selectedRecruiters.length > 0 && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-2 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-indigo-800 font-medium text-sm">
                {selectedRecruiters.length} recruiter(s) selected
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

        {/* Recruiters Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-2 py-2 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRecruiters.length === filteredRecruiters.length && filteredRecruiters.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Company Details
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Registration Date
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecruiters.map((recruiter) => (
                  <tr key={recruiter.id} className="hover:bg-gray-50">
                    <td className="px-2 py-2">
                      <input
                        type="checkbox"
                        checked={selectedRecruiters.includes(recruiter.id)}
                        onChange={() => handleSelectRecruiter(recruiter.id)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <Building2 className="h-3 w-3 text-purple-600" />
                        </div>
                        <div className="ml-2">
                          <div className="text-xs font-medium text-gray-900 truncate">{recruiter.name}</div>
                          <div className="text-[10px] text-gray-500 truncate">Contact: {recruiter.contactPerson}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="text-[10px] text-gray-900 truncate">
                        {recruiter.email}
                      </div>
                      <div className="text-[10px] text-gray-500 truncate">
                        {recruiter.mobile}
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="text-[10px] text-gray-900">
                        {recruiter.registrationDate}
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="text-[10px] text-gray-900">
                        <div>Hires: {recruiter.totalHires}</div>
                        <div>Active: {recruiter.activeContracts}</div>
                        <div className="text-green-600 font-medium">{formatCurrency(recruiter.totalSpent)}</div>
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      {getStatusBadge(recruiter.status)}
                    </td>
                    <td className="px-2 py-2">
                      <div className="text-[10px] text-gray-500">{recruiter.lastActivity}</div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-1">
                        {recruiter.status === 'pending' && (
                          <button
                            onClick={() => handleApprove(recruiter.id)}
                            className="flex items-center gap-0.5 px-1.5 py-0.5 bg-green-500 text-white text-[9px] rounded border border-green-600 hover:bg-green-600 transition-all duration-200 shadow-sm"
                          >
                            <CheckCircle className="h-2.5 w-2.5" />
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(recruiter)}
                          className="flex items-center gap-0.5 px-1.5 py-0.5 bg-green-500 text-white text-[9px] rounded border border-green-600 hover:bg-green-600 transition-all duration-200 shadow-sm"
                        >
                          <Edit className="h-2.5 w-2.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleView(recruiter.id)}
                          className="flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-100 text-gray-700 text-[9px] rounded border border-gray-300 hover:bg-gray-200 transition-all duration-200 shadow-sm"
                        >
                          <Eye className="h-2.5 w-2.5" />
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(recruiter.id)}
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
          
          {filteredRecruiters.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="mx-auto h-8 w-8 text-gray-400" />
              <h3 className="mt-2 text-xs font-medium text-gray-900">No recruiters found</h3>
              <p className="mt-1 text-[10px] text-gray-500">
                {searchTerm ? "No recruiters match your search criteria." : "No recruiters have been registered yet."}
              </p>
            </div>
          )}
        </div>
    </div>
  );
};

export default Recruiters;
