import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Briefcase, DollarSign, Star, Filter, Users, Clock, Shield, Award, UserCheck, Eye } from "lucide-react";
import DashboardHeader from "../../Components/DashboardHeader";

const mockCandidates = [
  {
    code: "TSC-2024-20031",
    role: "Senior Software Engineer",
    experience: "5-8 years",
    location: "New York, NY",
    skills: ["React", "Node.js", "AWS", "TypeScript", "Docker"],
    salary: "$120,000 - $150,000",
    visaStatus: "US Citizen",
    needsSponsorship: false,
    degree: "Bachelor's in Computer Science",
    certifications: ["AWS Certified", "React Certified"],
    score: 95,
    interviewStatus: "pre-interviewed",
    ethnicity: "Not Specified",
    veteranStatus: "No",
    disabilityStatus: "No",
    availability: "Immediate",
    preferredLocation: "New York, NY",
    currentEmployer: "Tech Corp Inc."
  },
  {
    code: "TSC-2024-20045",
    role: "Product Manager",
    experience: "7-10 years",
    location: "San Francisco, CA",
    skills: ["Product Strategy", "Agile", "Data Analysis", "Figma", "SQL"],
    salary: "$140,000 - $180,000",
    visaStatus: "Green Card",
    needsSponsorship: false,
    degree: "MBA",
    certifications: ["PMP", "Scrum Master"],
    score: 92,
    interviewStatus: "passed",
    ethnicity: "Not Specified",
    veteranStatus: "No",
    disabilityStatus: "No",
    availability: "2 weeks notice",
    preferredLocation: "San Francisco, CA",
    currentEmployer: "StartupXYZ"
  },
  {
    code: "TSC-2024-20052",
    role: "Data Scientist",
    experience: "4-6 years",
    location: "Austin, TX",
    skills: ["Python", "Machine Learning", "TensorFlow", "Pandas", "Scikit-learn"],
    salary: "$110,000 - $140,000",
    visaStatus: "H1-B",
    needsSponsorship: true,
    degree: "Master's in Data Science",
    certifications: ["Google Cloud Certified", "AWS ML"],
    score: 88,
    interviewStatus: "pre-interviewed",
    ethnicity: "Not Specified",
    veteranStatus: "No",
    disabilityStatus: "No",
    availability: "1 month notice",
    preferredLocation: "Austin, TX",
    currentEmployer: "DataTech Solutions"
  },
  {
    code: "TSC-2024-20067",
    role: "UX Designer",
    experience: "3-5 years",
    location: "Seattle, WA",
    skills: ["Figma", "User Research", "Prototyping", "Adobe XD", "Sketch"],
    salary: "$90,000 - $120,000",
    visaStatus: "US Citizen",
    needsSponsorship: false,
    degree: "Bachelor's in Design",
    certifications: ["Google UX Design", "Adobe Certified"],
    score: 91,
    interviewStatus: "passed",
    ethnicity: "Not Specified",
    veteranStatus: "Yes",
    disabilityStatus: "No",
    availability: "Immediate",
    preferredLocation: "Seattle, WA",
    currentEmployer: "Design Studio Pro"
  },
  {
    code: "TSC-2024-20078",
    role: "DevOps Engineer",
    experience: "6-8 years",
    location: "Chicago, IL",
    skills: ["Docker", "Kubernetes", "AWS", "Jenkins", "Terraform"],
    salary: "$130,000 - $160,000",
    visaStatus: "US Citizen",
    needsSponsorship: false,
    degree: "Bachelor's in Computer Science",
    certifications: ["AWS DevOps", "Kubernetes Certified"],
    score: 89,
    interviewStatus: "pre-interviewed",
    ethnicity: "Not Specified",
    veteranStatus: "No",
    disabilityStatus: "Yes",
    availability: "3 weeks notice",
    preferredLocation: "Chicago, IL",
    currentEmployer: "CloudTech Inc."
  },
  {
    code: "TSC-2024-20089",
    role: "Full Stack Developer",
    experience: "4-7 years",
    location: "Boston, MA",
    skills: ["React", "Node.js", "Python", "PostgreSQL", "MongoDB"],
    salary: "$115,000 - $145,000",
    visaStatus: "Green Card",
    needsSponsorship: false,
    degree: "Bachelor's in Software Engineering",
    certifications: ["MongoDB Certified", "React Developer"],
    score: 87,
    interviewStatus: "pre-interviewed",
    ethnicity: "Not Specified",
    veteranStatus: "No",
    disabilityStatus: "No",
    availability: "2 weeks notice",
    preferredLocation: "Boston, MA",
    currentEmployer: "WebDev Solutions"
  }
];

const CandidateSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [filters, setFilters] = useState({
    jobRole: "",
    location: "",
    skills: "",
    minExperience: "",
    maxExperience: "",
    desiredSalary: "",
    interviewStatus: "",
    visaStatus: "",
    ethnicity: "",
    veteranStatus: "",
    disabilityStatus: "",
    minScore: "",
    maxScore: "",
  });

  const handleSelectCandidate = (code) => {
    setSelectedCandidates((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code]
    );
  };

  const handleProceedToContract = () => {
    alert(`Contract page for candidates: ${selectedCandidates.join(", ")}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader />
      
      <div className="pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Search Candidates</h1>
                <p className="text-sm text-gray-600">Find pre-vetted professionals for your team</p>
              </div>
              {selectedCandidates.length > 0 && (
                <button
                  onClick={handleProceedToContract}
                  className="inline-flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <Users className="h-4 w-4" />
                  Proceed to Contract ({selectedCandidates.length})
                </button>
              )}
            </div>
          </div>
          {/* Search Bar */}
          <div className="bg-white rounded border border-gray-200 p-3 mb-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by role, skills, or candidate code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <button className="bg-indigo-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-indigo-700 transition-colors">
                Search
              </button>
            </div>

            {/* Filters */}
            <div className="mt-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-1 border border-gray-200 px-2 py-1 rounded text-sm hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-3 w-3" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>

              {showFilters && (
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Job Role</label>
                    <input
                      type="text"
                      placeholder="Software Engineer"
                      value={filters.jobRole}
                      onChange={(e) => setFilters({ ...filters, jobRole: e.target.value })}
                      className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      placeholder="New York, NY"
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Skills</label>
                    <input
                      type="text"
                      placeholder="React, Python"
                      value={filters.skills}
                      onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                      className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Min Exp</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={filters.minExperience}
                      onChange={(e) => setFilters({ ...filters, minExperience: e.target.value })}
                      className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Max Exp</label>
                    <input
                      type="number"
                      placeholder="10"
                      value={filters.maxExperience}
                      onChange={(e) => setFilters({ ...filters, maxExperience: e.target.value })}
                      className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Salary</label>
                    <input
                      type="text"
                      placeholder="$100k - $150k"
                      value={filters.desiredSalary}
                      onChange={(e) => setFilters({ ...filters, desiredSalary: e.target.value })}
                      className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Interview</label>
                    <select
                      value={filters.interviewStatus}
                      onChange={(e) => setFilters({ ...filters, interviewStatus: e.target.value })}
                      className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">All</option>
                      <option value="pre-interviewed">Pre-interviewed</option>
                      <option value="passed">Passed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Visa</label>
                    <select
                      value={filters.visaStatus}
                      onChange={(e) => setFilters({ ...filters, visaStatus: e.target.value })}
                      className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">All</option>
                      <option value="US Citizen">US Citizen</option>
                      <option value="Green Card">Green Card</option>
                      <option value="H1-B">H1-B</option>
                      <option value="F1-OPT">F1-OPT</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Ethnicity</label>
                    <select
                      value={filters.ethnicity}
                      onChange={(e) => setFilters({ ...filters, ethnicity: e.target.value })}
                      className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">All</option>
                      <option value="Not Specified">Not Specified</option>
                      <option value="Asian">Asian</option>
                      <option value="Black">Black</option>
                      <option value="Hispanic">Hispanic</option>
                      <option value="White">White</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Veteran</label>
                    <select
                      value={filters.veteranStatus}
                      onChange={(e) => setFilters({ ...filters, veteranStatus: e.target.value })}
                      className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">All</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Disability</label>
                    <select
                      value={filters.disabilityStatus}
                      onChange={(e) => setFilters({ ...filters, disabilityStatus: e.target.value })}
                      className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">All</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Min Score</label>
                    <input
                      type="number"
                      placeholder="80"
                      value={filters.minScore}
                      onChange={(e) => setFilters({ ...filters, minScore: e.target.value })}
                      className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Max Score</label>
                    <input
                      type="number"
                      placeholder="100"
                      value={filters.maxScore}
                      onChange={(e) => setFilters({ ...filters, maxScore: e.target.value })}
                      className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Candidate Grid - Optimized for Maximum Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {mockCandidates.map((candidate) => (
              <div
                key={candidate.code}
                className={`bg-white rounded border border-gray-200 p-3 hover:shadow-sm transition-all duration-200 ${
                  selectedCandidates.includes(candidate.code) ? "ring-1 ring-indigo-500 border-indigo-200" : ""
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-indigo-600 font-bold text-sm">{candidate.code}</h3>
                    <p className="text-gray-900 font-semibold text-xs">{candidate.role}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 px-1 py-0.5 rounded">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span className="font-semibold text-yellow-700 text-xs">{candidate.score}</span>
                  </div>
                </div>

                {/* Candidate Info - Compact */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700">{candidate.experience}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700">{candidate.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700">{candidate.salary}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700">{candidate.availability}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700">{candidate.visaStatus}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <UserCheck className="h-3 w-3 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700 capitalize">{candidate.interviewStatus.replace("-", " ")}</span>
                  </div>
                </div>

                {/* Skills - Compact */}
                <div className="mt-2">
                  <p className="text-xs font-medium text-gray-600 mb-1">Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="bg-indigo-50 text-indigo-700 px-1 py-0.5 rounded text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {candidate.skills.length > 3 && (
                      <span className="bg-gray-100 text-gray-600 px-1 py-0.5 rounded text-xs">
                        +{candidate.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Badges - Compact */}
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="bg-green-100 text-green-800 px-1 py-0.5 rounded text-xs font-medium">
                    {candidate.visaStatus}
                  </span>
                  {candidate.veteranStatus === "Yes" && (
                    <span className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs font-medium">
                      Veteran
                    </span>
                  )}
                  {candidate.disabilityStatus === "Yes" && (
                    <span className="bg-purple-100 text-purple-800 px-1 py-0.5 rounded text-xs font-medium">
                      Disability
                    </span>
                  )}
                </div>

                {/* Actions - Compact */}
                <div className="flex gap-1 mt-3">
                  <button
                    className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                      selectedCandidates.includes(candidate.code)
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                    }`}
                    onClick={() => handleSelectCandidate(candidate.code)}
                  >
                    {selectedCandidates.includes(candidate.code) ? "Selected" : "Select"}
                  </button>
                  <Link
                    to={`/recruiter/candidate/${candidate.code}`}
                    className="flex-1 px-2 py-1 border border-gray-200 rounded text-gray-700 text-center hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 text-xs"
                  >
                    <Eye className="h-3 w-3" />
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateSearch;
