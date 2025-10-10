import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const CandidateProfile = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const candidate = {
    code: code || "TSC-2024-1547",
    role: "Senior Software Engineer",
    experience: "8 years",
    location: "New York, NY",
    willingToRelocate: true,
    skills: ["React", "TypeScript", "Node.js", "AWS", "Docker", "PostgreSQL", "GraphQL", "CI/CD"],
    salary: "$140,000",
    visaStatus: "US Citizen",
    score: 95,
    status: "pre-interviewed",
    employmentType: ["Full-time", "Contract"],
    availability: "2 weeks notice",
    languages: ["English (Native)", "Spanish (Professional)"],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "MIT",
        year: "2015",
      },
    ],
    certifications: ["AWS Certified Solutions Architect", "Certified Kubernetes Administrator"],
    workHistory: [
      {
        role: "Senior Software Engineer",
        duration: "2020 - Present",
        description:
          "Led development of microservices architecture serving 10M+ users. Improved system performance by 40%.",
      },
      {
        role: "Software Engineer",
        duration: "2017 - 2020",
        description: "Built scalable web applications using React and Node.js. Mentored junior developers.",
      },
      {
        role: "Junior Developer",
        duration: "2015 - 2017",
        description: "Developed frontend features and participated in agile development processes.",
      },
    ],
  };

  const handleShortlist = () => {
    alert(`${candidate.code} has been shortlisted.`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-700 hover:text-black mb-2"
          >
            ← Back to Search
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{candidate.code}</h1>
              <p className="text-xl text-gray-600 mt-1">{candidate.role}</p>
            </div>
            <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-lg">
              <span className="font-bold text-yellow-600 text-xl">{candidate.score}</span>
              <span className="text-sm text-gray-600">Score</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Profile Overview</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <p><span className="font-semibold">Experience:</span> {candidate.experience}</p>
                <p><span className="font-semibold">Location:</span> {candidate.location}</p>
                <p><span className="font-semibold">Desired Salary:</span> {candidate.salary}</p>
                <p><span className="font-semibold">Visa Status:</span> {candidate.visaStatus}</p>
                <p><span className="font-semibold">Availability:</span> {candidate.availability}</p>
                <p><span className="font-semibold">Willing to Relocate:</span> {candidate.willingToRelocate ? "Yes" : "No"}</p>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Technical Skills</h2>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Work Experience */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Work Experience</h2>
              {candidate.workHistory.map((job, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 mb-4">
                  <h4 className="font-semibold">{job.role}</h4>
                  <p className="text-sm text-gray-500 mb-1">{job.duration}</p>
                  <p className="text-gray-700">{job.description}</p>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Education</h2>
              {candidate.education.map((edu, index) => (
                <div key={index} className="mb-2">
                  <h4 className="font-semibold">{edu.degree}</h4>
                  <p className="text-sm text-gray-600">
                    {edu.institution} • {edu.year}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Actions</h2>
              <button
                onClick={handleShortlist}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mb-2"
              >
                Shortlist Candidate
              </button>
              <button className="w-full border border-gray-300 py-2 rounded-lg mb-2 hover:bg-gray-100">
                Download Resume
              </button>
              <button className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-100">
                Share Profile
              </button>
            </div>

            {/* Languages */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Languages</h2>
              {candidate.languages.map((lang, index) => (
                <p key={index} className="text-gray-700">{lang}</p>
              ))}
            </div>

            {/* Certifications */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Certifications</h2>
              {candidate.certifications.map((cert, index) => (
                <p key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md mb-2">
                  {cert}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
