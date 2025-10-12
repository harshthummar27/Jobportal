import React, { useState } from "react";
import { 
  UserX, 
  CheckCircle, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  Calendar,
  Mail,
  Phone
} from "lucide-react";
import { useSearch } from "../../Components/SuperAdminLayout";

const PendingCandidates = () => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const { searchTerm } = useSearch();

  // Mock data - in real app, replace with API call
  const pendingCandidates = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      mobile: "+1 234-567-8901",
      registrationDate: "2024-01-15",
      experience: "5 years",
      skills: ["React", "Node.js", "JavaScript", "TypeScript", "MongoDB"],
      status: "pending",
      location: "San Francisco, CA",
      expectedSalary: "$120,000",
      availability: "Immediate",
      education: "Bachelor's in Computer Science"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      mobile: "+1 234-567-8902",
      registrationDate: "2024-01-14",
      experience: "3 years",
      skills: ["Python", "Django", "PostgreSQL", "Docker", "Kubernetes"],
      status: "pending",
      location: "Austin, TX",
      expectedSalary: "$95,000",
      availability: "2 weeks notice",
      education: "Master's in Software Engineering"
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael.brown@email.com",
      mobile: "+1 234-567-8903",
      registrationDate: "2024-01-13",
      experience: "7 years",
      skills: ["Java", "Spring Boot", "AWS", "Microservices", "Redis"],
      status: "pending",
      location: "Seattle, WA",
      expectedSalary: "$140,000",
      availability: "1 month notice",
      education: "Bachelor's in Information Technology"
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@email.com",
      mobile: "+1 234-567-8904",
      registrationDate: "2024-01-12",
      experience: "4 years",
      skills: ["Vue.js", "PHP", "MySQL", "Laravel", "REST APIs"],
      status: "pending",
      location: "Chicago, IL",
      expectedSalary: "$85,000",
      availability: "Immediate",
      education: "Bachelor's in Computer Science"
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david.wilson@email.com",
      mobile: "+1 234-567-8905",
      registrationDate: "2024-01-11",
      experience: "6 years",
      skills: ["Angular", "C#", ".NET Core", "SQL Server", "Azure"],
      status: "pending",
      location: "New York, NY",
      expectedSalary: "$130,000",
      availability: "3 weeks notice",
      education: "Master's in Computer Science"
    },
    {
      id: 6,
      name: "Lisa Anderson",
      email: "lisa.anderson@email.com",
      mobile: "+1 234-567-8906",
      registrationDate: "2024-01-10",
      experience: "2 years",
      skills: ["React Native", "JavaScript", "Firebase", "Redux", "Git"],
      status: "pending",
      location: "Los Angeles, CA",
      expectedSalary: "$75,000",
      availability: "Immediate",
      education: "Bootcamp Graduate"
    },
    {
      id: 7,
      name: "Robert Taylor",
      email: "robert.taylor@email.com",
      mobile: "+1 234-567-8907",
      registrationDate: "2024-01-09",
      experience: "8 years",
      skills: ["Go", "Kubernetes", "Docker", "PostgreSQL", "GraphQL"],
      status: "pending",
      location: "Denver, CO",
      expectedSalary: "$150,000",
      availability: "1 month notice",
      education: "Bachelor's in Software Engineering"
    },
    {
      id: 8,
      name: "Jennifer Martinez",
      email: "jennifer.martinez@email.com",
      mobile: "+1 234-567-8908",
      registrationDate: "2024-01-08",
      experience: "4 years",
      skills: ["Ruby on Rails", "JavaScript", "PostgreSQL", "Redis", "Sidekiq"],
      status: "pending",
      location: "Portland, OR",
      expectedSalary: "$100,000",
      availability: "2 weeks notice",
      education: "Bachelor's in Computer Science"
    },
    {
      id: 9,
      name: "Christopher Lee",
      email: "christopher.lee@email.com",
      mobile: "+1 234-567-8909",
      registrationDate: "2024-01-07",
      experience: "5 years",
      skills: ["Swift", "iOS Development", "Objective-C", "Core Data", "Xcode"],
      status: "pending",
      location: "Miami, FL",
      expectedSalary: "$110,000",
      availability: "Immediate",
      education: "Bachelor's in Mobile Development"
    },
    {
      id: 10,
      name: "Amanda Garcia",
      email: "amanda.garcia@email.com",
      mobile: "+1 234-567-8910",
      registrationDate: "2024-01-06",
      experience: "3 years",
      skills: ["Android", "Kotlin", "Java", "Firebase", "Material Design"],
      status: "pending",
      location: "Phoenix, AZ",
      expectedSalary: "$90,000",
      availability: "1 month notice",
      education: "Bachelor's in Computer Science"
    },
    {
      id: 11,
      name: "Kevin Thompson",
      email: "kevin.thompson@email.com",
      mobile: "+1 234-567-8911",
      registrationDate: "2024-01-05",
      experience: "6 years",
      skills: ["DevOps", "Jenkins", "Terraform", "AWS", "Linux"],
      status: "pending",
      location: "Boston, MA",
      expectedSalary: "$125,000",
      availability: "2 weeks notice",
      education: "Bachelor's in Information Systems"
    },
    {
      id: 12,
      name: "Rachel White",
      email: "rachel.white@email.com",
      mobile: "+1 234-567-8912",
      registrationDate: "2024-01-04",
      experience: "4 years",
      skills: ["Data Science", "Python", "Pandas", "Machine Learning", "TensorFlow"],
      status: "pending",
      location: "Atlanta, GA",
      expectedSalary: "$105,000",
      availability: "Immediate",
      education: "Master's in Data Science"
    }
  ];

  const filteredCandidates = pendingCandidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.mobile.includes(searchTerm) ||
    candidate.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
    candidate.education.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleApprove = (candidateId) => {
    // In real app, make API call to approve candidate
    console.log("Approving candidate:", candidateId);
    alert(`Candidate ${candidateId} has been approved!`);
  };

  const handleDelete = (candidateId) => {
    // In real app, make API call to delete candidate
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      console.log("Deleting candidate:", candidateId);
      alert(`Candidate ${candidateId} has been deleted!`);
    }
  };

  const handleBulkApprove = () => {
    if (selectedCandidates.length === 0) return;
    
    if (window.confirm(`Are you sure you want to approve ${selectedCandidates.length} candidates?`)) {
      console.log("Bulk approving candidates:", selectedCandidates);
      alert(`${selectedCandidates.length} candidates have been approved!`);
      setSelectedCandidates([]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedCandidates.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedCandidates.length} candidates?`)) {
      console.log("Bulk deleting candidates:", selectedCandidates);
      alert(`${selectedCandidates.length} candidates have been deleted!`);
      setSelectedCandidates([]);
    }
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
                  onClick={handleBulkApprove}
                  className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs rounded-md border border-green-600 hover:bg-green-600 transition-all duration-200 shadow-sm"
                >
                  <CheckCircle className="h-3 w-3" />
                  Approve
                </button>
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
                    Registration Date
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Skills
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
                        <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                          <UserX className="h-3 w-3 text-indigo-600" />
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
                        {candidate.registrationDate}
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
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleApprove(candidate.id)}
                          className="flex items-center gap-0.5 px-1.5 py-0.5 bg-green-500 text-white text-[9px] rounded border border-green-600 hover:bg-green-600 transition-all duration-200 shadow-sm"
                        >
                          <CheckCircle className="h-2.5 w-2.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleDelete(candidate.id)}
                          className="flex items-center gap-0.5 px-1.5 py-0.5 bg-red-500 text-white text-[9px] rounded border border-red-600 hover:bg-red-600 transition-all duration-200 shadow-sm"
                        >
                          <Trash2 className="h-2.5 w-2.5" />
                          Delete
                        </button>
                        <button className="flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-100 text-gray-700 text-[9px] rounded border border-gray-300 hover:bg-gray-200 transition-all duration-200 shadow-sm">
                          <Eye className="h-2.5 w-2.5" />
                          View
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
              <UserX className="mx-auto h-8 w-8 text-gray-400" />
              <h3 className="mt-2 text-xs font-medium text-gray-900">No pending candidates</h3>
              <p className="mt-1 text-[10px] text-gray-500">
                {searchTerm ? "No candidates match your search criteria." : "All candidates have been processed."}
              </p>
            </div>
          )}
        </div>
    </div>
  );
};

export default PendingCandidates;
