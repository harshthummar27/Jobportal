import React, { useState } from "react";
import { 
  UserCheck, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  Calendar,
  Mail,
  Phone,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useSearch } from "../../Components/SuperAdminLayout";

const ApprovedCandidates = () => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const { searchTerm } = useSearch();

  // Mock data - in real app, replace with API call
  const approvedCandidates = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.johnson@email.com",
      mobile: "+1 234-567-8901",
      approvalDate: "2024-01-10",
      experience: "5 years",
      skills: ["React", "Node.js", "JavaScript", "TypeScript", "MongoDB"],
      status: "active",
      profileViews: 45,
      applications: 3,
      location: "San Francisco, CA",
      currentSalary: "$125,000",
      lastActive: "2 hours ago",
      recruiterRating: 4.8,
      interviews: 2
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob.smith@email.com",
      mobile: "+1 234-567-8902",
      approvalDate: "2024-01-09",
      experience: "3 years",
      skills: ["Python", "Django", "PostgreSQL", "Docker", "Kubernetes"],
      status: "active",
      profileViews: 32,
      applications: 2,
      location: "Austin, TX",
      currentSalary: "$95,000",
      lastActive: "1 day ago",
      recruiterRating: 4.5,
      interviews: 1
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol.davis@email.com",
      mobile: "+1 234-567-8903",
      approvalDate: "2024-01-08",
      experience: "7 years",
      skills: ["Java", "Spring Boot", "AWS", "Microservices", "Redis"],
      status: "placed",
      profileViews: 67,
      applications: 5,
      location: "Seattle, WA",
      currentSalary: "$145,000",
      lastActive: "3 days ago",
      recruiterRating: 4.9,
      interviews: 3
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david.wilson@email.com",
      mobile: "+1 234-567-8904",
      approvalDate: "2024-01-07",
      experience: "4 years",
      skills: ["Vue.js", "PHP", "MySQL", "Laravel", "REST APIs"],
      status: "active",
      profileViews: 28,
      applications: 1,
      location: "Chicago, IL",
      currentSalary: "$85,000",
      lastActive: "5 hours ago",
      recruiterRating: 4.2,
      interviews: 0
    },
    {
      id: 5,
      name: "Elena Rodriguez",
      email: "elena.rodriguez@email.com",
      mobile: "+1 234-567-8905",
      approvalDate: "2024-01-06",
      experience: "6 years",
      skills: ["Angular", "C#", ".NET Core", "SQL Server", "Azure"],
      status: "active",
      profileViews: 52,
      applications: 4,
      location: "New York, NY",
      currentSalary: "$135,000",
      lastActive: "1 hour ago",
      recruiterRating: 4.7,
      interviews: 2
    },
    {
      id: 6,
      name: "Frank Miller",
      email: "frank.miller@email.com",
      mobile: "+1 234-567-8906",
      approvalDate: "2024-01-05",
      experience: "2 years",
      skills: ["React Native", "JavaScript", "Firebase", "Redux", "Git"],
      status: "active",
      profileViews: 18,
      applications: 1,
      location: "Los Angeles, CA",
      currentSalary: "$75,000",
      lastActive: "30 minutes ago",
      recruiterRating: 4.0,
      interviews: 0
    },
    {
      id: 7,
      name: "Grace Chen",
      email: "grace.chen@email.com",
      mobile: "+1 234-567-8907",
      approvalDate: "2024-01-04",
      experience: "8 years",
      skills: ["Go", "Kubernetes", "Docker", "PostgreSQL", "GraphQL"],
      status: "placed",
      profileViews: 89,
      applications: 6,
      location: "Denver, CO",
      currentSalary: "$155,000",
      lastActive: "1 week ago",
      recruiterRating: 4.9,
      interviews: 4
    },
    {
      id: 8,
      name: "Henry Kim",
      email: "henry.kim@email.com",
      mobile: "+1 234-567-8908",
      approvalDate: "2024-01-03",
      experience: "4 years",
      skills: ["Ruby on Rails", "JavaScript", "PostgreSQL", "Redis", "Sidekiq"],
      status: "active",
      profileViews: 41,
      applications: 3,
      location: "Portland, OR",
      currentSalary: "$105,000",
      lastActive: "4 hours ago",
      recruiterRating: 4.6,
      interviews: 1
    },
    {
      id: 9,
      name: "Isabella Torres",
      email: "isabella.torres@email.com",
      mobile: "+1 234-567-8909",
      approvalDate: "2024-01-02",
      experience: "5 years",
      skills: ["Swift", "iOS Development", "Objective-C", "Core Data", "Xcode"],
      status: "active",
      profileViews: 36,
      applications: 2,
      location: "Miami, FL",
      currentSalary: "$115,000",
      lastActive: "2 days ago",
      recruiterRating: 4.4,
      interviews: 1
    },
    {
      id: 10,
      name: "James Park",
      email: "james.park@email.com",
      mobile: "+1 234-567-8910",
      approvalDate: "2024-01-01",
      experience: "3 years",
      skills: ["Android", "Kotlin", "Java", "Firebase", "Material Design"],
      status: "active",
      profileViews: 29,
      applications: 2,
      location: "Phoenix, AZ",
      currentSalary: "$90,000",
      lastActive: "6 hours ago",
      recruiterRating: 4.3,
      interviews: 1
    },
    {
      id: 11,
      name: "Katherine Lee",
      email: "katherine.lee@email.com",
      mobile: "+1 234-567-8911",
      approvalDate: "2023-12-30",
      experience: "6 years",
      skills: ["DevOps", "Jenkins", "Terraform", "AWS", "Linux"],
      status: "placed",
      profileViews: 73,
      applications: 5,
      location: "Boston, MA",
      currentSalary: "$130,000",
      lastActive: "2 weeks ago",
      recruiterRating: 4.8,
      interviews: 3
    },
    {
      id: 12,
      name: "Lucas Brown",
      email: "lucas.brown@email.com",
      mobile: "+1 234-567-8912",
      approvalDate: "2023-12-29",
      experience: "4 years",
      skills: ["Data Science", "Python", "Pandas", "Machine Learning", "TensorFlow"],
      status: "active",
      profileViews: 44,
      applications: 3,
      location: "Atlanta, GA",
      currentSalary: "$110,000",
      lastActive: "1 day ago",
      recruiterRating: 4.5,
      interviews: 2
    },
    {
      id: 13,
      name: "Maria Garcia",
      email: "maria.garcia@email.com",
      mobile: "+1 234-567-8913",
      approvalDate: "2023-12-28",
      experience: "7 years",
      skills: ["Full Stack", "React", "Node.js", "PostgreSQL", "AWS"],
      status: "inactive",
      profileViews: 12,
      applications: 0,
      location: "Dallas, TX",
      currentSalary: "$140,000",
      lastActive: "1 month ago",
      recruiterRating: 4.1,
      interviews: 0
    },
    {
      id: 14,
      name: "Nathan Wright",
      email: "nathan.wright@email.com",
      mobile: "+1 234-567-8914",
      approvalDate: "2023-12-27",
      experience: "5 years",
      skills: ["Blockchain", "Solidity", "Web3", "Ethereum", "Smart Contracts"],
      status: "active",
      profileViews: 38,
      applications: 2,
      location: "San Diego, CA",
      currentSalary: "$120,000",
      lastActive: "3 hours ago",
      recruiterRating: 4.7,
      interviews: 1
    },
    {
      id: 15,
      name: "Olivia Taylor",
      email: "olivia.taylor@email.com",
      mobile: "+1 234-567-8915",
      approvalDate: "2023-12-26",
      experience: "3 years",
      skills: ["UI/UX Design", "Figma", "Adobe Creative Suite", "Prototyping", "User Research"],
      status: "active",
      profileViews: 31,
      applications: 2,
      location: "Nashville, TN",
      currentSalary: "$85,000",
      lastActive: "1 day ago",
      recruiterRating: 4.6,
      interviews: 1
    }
  ];

  const filteredCandidates = approvedCandidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.mobile.includes(searchTerm) ||
    candidate.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
    candidate.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCandidate = (candidateId) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(filteredCandidates.map(c => c.id));
    }
  };

  const handleEdit = (candidate) => {
    setEditingCandidate(candidate);
    // In real app, open edit modal or navigate to edit page
    console.log("Editing candidate:", candidate);
  };

  const handleDelete = (candidateId) => {
    // In real app, make API call to delete candidate
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      console.log("Deleting candidate:", candidateId);
      alert(`Candidate ${candidateId} has been deleted!`);
    }
  };

  const handleView = (candidateId) => {
    // In real app, navigate to candidate profile page
    console.log("Viewing candidate:", candidateId);
    alert(`Viewing candidate ${candidateId} profile`);
  };

  const handleBulkDelete = () => {
    if (selectedCandidates.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedCandidates.length} candidates?`)) {
      console.log("Bulk deleting candidates:", selectedCandidates);
      alert(`${selectedCandidates.length} candidates have been deleted!`);
      setSelectedCandidates([]);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      placed: { color: "bg-blue-100 text-blue-800", icon: CheckCircle },
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

        {/* Bulk Actions */}
        {selectedCandidates.length > 0 && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-2 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-indigo-800 font-medium text-sm">
                {selectedCandidates.length} candidate(s) selected
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

        {/* Candidates Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-2 py-2 text-left">
                    <input
                      type="checkbox"
                      checked={selectedCandidates.length === filteredCandidates.length && filteredCandidates.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Candidate Details
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Approval Date
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Skills
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50">
                    <td className="px-2 py-2">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.includes(candidate.id)}
                        onChange={() => handleSelectCandidate(candidate.id)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <UserCheck className="h-3 w-3 text-green-600" />
                        </div>
                        <div className="ml-2">
                          <div className="text-xs font-medium text-gray-900 truncate">{candidate.name}</div>
                          <div className="text-[10px] text-gray-500">ID: {candidate.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="text-[10px] text-gray-900 truncate">
                        {candidate.email}
                      </div>
                      <div className="text-[10px] text-gray-500 truncate">
                        {candidate.mobile}
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="text-[10px] text-gray-900">
                        {candidate.approvalDate}
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="text-[10px] text-gray-900">{candidate.experience}</div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex flex-wrap gap-0.5">
                        {candidate.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="inline-block bg-gray-100 text-gray-800 text-[9px] px-1 py-0.5 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 3 && (
                          <span className="inline-block bg-gray-200 text-gray-600 text-[9px] px-1 py-0.5 rounded">
                            +{candidate.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      {getStatusBadge(candidate.status)}
                    </td>
                    <td className="px-2 py-2">
                      <div className="text-[10px] text-gray-900">
                        <div>Views: {candidate.profileViews}</div>
                        <div className="text-gray-500">Apps: {candidate.applications}</div>
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(candidate)}
                          className="flex items-center gap-0.5 px-1.5 py-0.5 bg-green-500 text-white text-[9px] rounded border border-green-600 hover:bg-green-600 transition-all duration-200 shadow-sm"
                        >
                          <Edit className="h-2.5 w-2.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleView(candidate.id)}
                          className="flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-100 text-gray-700 text-[9px] rounded border border-gray-300 hover:bg-gray-200 transition-all duration-200 shadow-sm"
                        >
                          <Eye className="h-2.5 w-2.5" />
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(candidate.id)}
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
          
          {filteredCandidates.length === 0 && (
            <div className="text-center py-8">
              <UserCheck className="mx-auto h-8 w-8 text-gray-400" />
              <h3 className="mt-2 text-xs font-medium text-gray-900">No approved candidates</h3>
              <p className="mt-1 text-[10px] text-gray-500">
                {searchTerm ? "No candidates match your search criteria." : "No candidates have been approved yet."}
              </p>
            </div>
          )}
        </div>
    </div>
  );
};

export default ApprovedCandidates;
