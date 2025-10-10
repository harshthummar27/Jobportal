import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Briefcase, DollarSign, Star, Filter } from "lucide-react";

const mockCandidates = [
  {
    code: "20031",
    firstName: "Andrew",
    role: "Senior Software Engineer",
    experience: "5 years",
    location: "New York, NY",
    skills: ["React", "Node.js", "AWS"],
    salary: "$120,000",
    visaStatus: "US Citizen",
    needsSponsorship: false,
    degree: "Bachelor's in Computer Science",
    certifications: "AWS Certified",
    score: 95,
  },
  {
    code: "20045",
    firstName: "Sarah",
    role: "Product Manager",
    experience: "7 years",
    location: "San Francisco, CA",
    skills: ["Product Strategy", "Agile", "Data Analysis"],
    salary: "$140,000",
    visaStatus: "Green Card",
    needsSponsorship: false,
    degree: "MBA",
    certifications: "PMP",
    score: 92,
  },
  {
    code: "20052",
    firstName: "Michael",
    role: "Data Scientist",
    experience: "4 years",
    location: "Austin, TX",
    skills: ["Python", "Machine Learning", "TensorFlow"],
    salary: "$110,000",
    visaStatus: "H1-B",
    needsSponsorship: true,
    degree: "Master's in Data Science",
    certifications: "Google Cloud Certified",
    score: 88,
  },
];

const CandidateSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [filters, setFilters] = useState({
    location: "",
    minExperience: "",
    maxExperience: "",
    visaStatus: "",
    sponsorship: "",
    degree: "",
    certifications: "",
    minSalary: "",
    maxSalary: "",
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
      <header className="border-b bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Search Candidates</h1>
            <p className="text-gray-500">Find pre-vetted professionals for your team</p>
          </div>
          {selectedCandidates.length > 0 && (
            <button
              onClick={handleProceedToContract}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Proceed to Contract ({selectedCandidates.length} selected)
            </button>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by role, skills, or candidate code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Search
            </button>
          </div>

          {/* Filters */}
          <div className="mt-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>

            {showFilters && (
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <input
                  type="text"
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="border border-gray-300 px-3 py-2 rounded w-full"
                />
                <input
                  type="number"
                  placeholder="Min Experience"
                  value={filters.minExperience}
                  onChange={(e) => setFilters({ ...filters, minExperience: e.target.value })}
                  className="border border-gray-300 px-3 py-2 rounded w-full"
                />
                <input
                  type="number"
                  placeholder="Max Experience"
                  value={filters.maxExperience}
                  onChange={(e) => setFilters({ ...filters, maxExperience: e.target.value })}
                  className="border border-gray-300 px-3 py-2 rounded w-full"
                />
                <input
                  type="text"
                  placeholder="Visa Status"
                  value={filters.visaStatus}
                  onChange={(e) => setFilters({ ...filters, visaStatus: e.target.value })}
                  className="border border-gray-300 px-3 py-2 rounded w-full"
                />
                <input
                  type="text"
                  placeholder="Needs Sponsorship (yes/no)"
                  value={filters.sponsorship}
                  onChange={(e) => setFilters({ ...filters, sponsorship: e.target.value })}
                  className="border border-gray-300 px-3 py-2 rounded w-full"
                />
                <input
                  type="text"
                  placeholder="Degree"
                  value={filters.degree}
                  onChange={(e) => setFilters({ ...filters, degree: e.target.value })}
                  className="border border-gray-300 px-3 py-2 rounded w-full"
                />
                <input
                  type="text"
                  placeholder="Certifications"
                  value={filters.certifications}
                  onChange={(e) => setFilters({ ...filters, certifications: e.target.value })}
                  className="border border-gray-300 px-3 py-2 rounded w-full"
                />
                <input
                  type="number"
                  placeholder="Min Salary"
                  value={filters.minSalary}
                  onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })}
                  className="border border-gray-300 px-3 py-2 rounded w-full"
                />
                <input
                  type="number"
                  placeholder="Max Salary"
                  value={filters.maxSalary}
                  onChange={(e) => setFilters({ ...filters, maxSalary: e.target.value })}
                  className="border border-gray-300 px-3 py-2 rounded w-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* Candidate Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCandidates.map((candidate) => (
            <div
              key={candidate.code}
              className={`bg-white rounded shadow p-4 hover:shadow-lg transition ${
                selectedCandidates.includes(candidate.code) ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-blue-600 font-bold text-lg">
                    {candidate.firstName} {candidate.code}
                  </h2>
                  <p className="text-gray-900 font-semibold">{candidate.role}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-semibold">{candidate.score}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-gray-500" />
                  <span>{candidate.experience}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{candidate.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span>{candidate.salary}+</span>
                </div>
                <p className="text-gray-500">Degree: {candidate.degree}</p>
                {candidate.certifications && (
                  <p className="text-gray-500">Certs: {candidate.certifications}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {candidate.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-xs">
                    {candidate.visaStatus}
                  </span>
                  {candidate.needsSponsorship && (
                    <span className="border border-gray-400 text-gray-800 px-2 py-1 rounded text-xs">
                      Needs Sponsorship
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  className={`flex-1 px-4 py-2 rounded ${
                    selectedCandidates.includes(candidate.code)
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 text-gray-900"
                  }`}
                  onClick={() => handleSelectCandidate(candidate.code)}
                >
                  {selectedCandidates.includes(candidate.code) ? "Selected" : "Select"}
                </button>
                <Link
                  to={`/recruiter/candidate/${candidate.code}`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-900 text-center hover:bg-gray-100"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateSearch;
