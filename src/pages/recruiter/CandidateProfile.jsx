import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Briefcase, DollarSign, Clock, Shield, UserCheck, Award, Download, Share2, Users, Eye } from "lucide-react";
import DashboardHeader from "../../Components/DashboardHeader";

const CandidateProfile = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const candidate = {
    code: code || "TSC-2024-1547",
    role: "Senior Software Engineer",
    experience: "5-8 years",
    location: "New York, NY",
    willingToRelocate: true,
    skills: ["React", "TypeScript", "Node.js", "AWS", "Docker", "PostgreSQL", "GraphQL", "CI/CD", "Kubernetes", "Microservices"],
    salary: "$120,000 - $150,000",
    visaStatus: "US Citizen",
    score: 95,
    status: "pre-interviewed",
    employmentType: ["Full-time", "Contract"],
    availability: "2 weeks notice",
    languages: ["English (Native)", "Spanish (Professional)"],
    ethnicity: "Not Specified",
    veteranStatus: "No",
    disabilityStatus: "No",
    preferredLocation: "New York, NY",
    currentEmployer: "Tech Corp Inc.",
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "MIT",
        year: "2015",
      },
    ],
    certifications: ["AWS Certified Solutions Architect", "Certified Kubernetes Administrator", "React Developer Certification"],
    workHistory: [
      {
        role: "Senior Software Engineer",
        duration: "2020 - Present",
        company: "Tech Corp Inc.",
        description:
          "Led development of microservices architecture serving 10M+ users. Improved system performance by 40%. Managed team of 5 developers and implemented CI/CD pipelines.",
      },
      {
        role: "Software Engineer",
        duration: "2017 - 2020",
        company: "StartupXYZ",
        description: "Built scalable web applications using React and Node.js. Mentored junior developers and contributed to open-source projects.",
      },
      {
        role: "Junior Developer",
        duration: "2015 - 2017",
        company: "WebDev Solutions",
        description: "Developed frontend features and participated in agile development processes. Gained experience in full-stack development.",
      },
    ],
  };

  const handleShortlist = () => {
    alert(`${candidate.code} has been shortlisted.`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader />
      
      <div className="pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </button>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{candidate.code}</h1>
                <p className="text-lg text-gray-600 mt-1">{candidate.role}</p>
              </div>
              <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-bold text-yellow-700 text-xl">{candidate.score}</span>
                <span className="text-sm text-gray-600">Score</span>
              </div>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overview */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Profile Overview</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Experience</p>
                        <p className="text-gray-900">{candidate.experience}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Location</p>
                        <p className="text-gray-900">{candidate.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Desired Salary</p>
                        <p className="text-gray-900">{candidate.salary}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Visa Status</p>
                        <p className="text-gray-900">{candidate.visaStatus}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Availability</p>
                        <p className="text-gray-900">{candidate.availability}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Willing to Relocate</p>
                        <p className="text-gray-900">{candidate.willingToRelocate ? "Yes" : "No"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Technical Skills</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-sm font-medium border border-indigo-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Work Experience */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
                </div>
                <div className="space-y-6">
                  {candidate.workHistory.map((job, index) => (
                    <div key={index} className="border-l-4 border-indigo-500 pl-6 pb-6 last:pb-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900 text-lg">{job.role}</h4>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{job.duration}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 font-medium">{job.company}</p>
                      <p className="text-gray-700 leading-relaxed">{job.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Education</h2>
                </div>
                <div className="space-y-4">
                  {candidate.education.map((edu, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-1">{edu.degree}</h4>
                      <p className="text-sm text-gray-600">
                        {edu.institution} • {edu.year}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
          </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Actions</h2>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={handleShortlist}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg"
                  >
                    Shortlist Candidate
                  </button>
                  
                  <button className="w-full border border-gray-200 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" />
                    Download Resume
                  </button>
                  
                  <button className="w-full border border-gray-200 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Share Profile
                  </button>
                </div>
              </div>

              {/* Languages */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Award className="h-5 w-5 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Languages</h2>
                </div>
                <div className="space-y-2">
                  {candidate.languages.map((lang, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-700 font-medium">{lang}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Award className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Certifications</h2>
                </div>
                <div className="space-y-2">
                  {candidate.certifications.map((cert, index) => (
                    <div key={index} className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-lg">
                      <p className="text-sm font-medium">{cert}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Eye className="h-5 w-5 text-gray-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Additional Info</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Ethnicity</span>
                    <span className="text-sm text-gray-900">{candidate.ethnicity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Veteran Status</span>
                    <span className="text-sm text-gray-900">{candidate.veteranStatus}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Disability Status</span>
                    <span className="text-sm text-gray-900">{candidate.disabilityStatus}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
