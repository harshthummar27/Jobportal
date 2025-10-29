import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Briefcase, DollarSign, Clock, Shield, UserCheck, AlertCircle, Loader2, Calendar, Mail, Phone } from "lucide-react";
import Header from "../../Components/Header";

const CandidateProfile = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch candidate details from API
  const fetchCandidateDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/candidates/${code}`, {
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
      
      if (data.success) {
        setCandidate(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch candidate details');
      }
    } catch (error) {
      console.error('Error fetching candidate details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch candidate details on component mount
  useEffect(() => {
    if (code) {
      fetchCandidateDetails();
    }
  }, [code]);

  // Format candidate data for display
  const formatCandidateData = (candidate) => {
    if (!candidate) return null;
    
    return {
      id: candidate.id,
      candidate_code: candidate.candidate_code || code,
      full_name: candidate.candidate_profile?.full_name || candidate.name || 'N/A',
      email: candidate.email || 'N/A',
      phone: candidate.candidate_profile?.contact_phone || candidate.mobile_number || 'N/A',
      desired_job_roles: candidate.candidate_profile?.desired_job_roles || ['N/A'],
      total_years_experience: candidate.candidate_profile?.total_years_experience || 0,
      city: candidate.candidate_profile?.city || 'N/A',
      state: candidate.candidate_profile?.state || 'N/A',
      country: candidate.candidate_profile?.country || 'N/A',
      desired_annual_package: candidate.candidate_profile?.desired_annual_package || 'N/A',
      visa_status: candidate.candidate_profile?.visa_status || 'N/A',
      candidate_score: candidate.candidate_profile?.candidate_score || 0,
      skills: candidate.candidate_profile?.skills || [],
      availability: candidate.candidate_profile?.availability || 'N/A',
      created_at: candidate.created_at ? new Date(candidate.created_at).toLocaleDateString() : 'N/A'
    };
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Approved</span>;
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">Pending</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">Rejected</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">Unknown</span>;
    }
  };

  const getVisaStatusBadge = (visaStatus) => {
    switch (visaStatus) {
      case 'us_citizen':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">US Citizen</span>;
      case 'green_card':
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Green Card</span>;
      case 'h1_b':
        return <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">H1-B</span>;
      case 'f1_opt':
        return <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">F1-OPT</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">{visaStatus}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                <p className="text-gray-500 mt-2">Loading candidate details...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-red-400" />
                <p className="text-red-600 mt-2 font-medium">Error: {error}</p>
                <button
                  onClick={() => navigate('/recruiter/dashboard')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <UserCheck className="h-12 w-12 mx-auto text-gray-300" />
                <p className="text-gray-500 mt-2">Candidate not found</p>
                <button
                  onClick={() => navigate('/recruiter/dashboard')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formattedCandidate = formatCandidateData(candidate);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <RecruiterDashboardHeader />
      
      <div className="pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/recruiter/dashboard')}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
          </div>

          {/* Candidate Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserCheck className="h-8 w-8 text-blue-600" />
                </div>
              <div>
                  <h1 className="text-2xl font-bold text-gray-900">{formattedCandidate.full_name}</h1>
                  <p className="text-lg text-blue-600 font-semibold">{formattedCandidate.candidate_code}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">Score: {formattedCandidate.candidate_score}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Added: {formattedCandidate.created_at}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(candidate.status)}
                {getVisaStatusBadge(formattedCandidate.visa_status)}
              </div>
            </div>
          </div>

            {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Basic Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <p className="text-sm text-gray-900">{formattedCandidate.email}</p>
                  </div>
                      <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                    <p className="text-sm text-gray-900">{formattedCandidate.phone}</p>
                    </div>
                      <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
                    <p className="text-sm text-gray-900">{formattedCandidate.city}, {formattedCandidate.state}, {formattedCandidate.country}</p>
                    </div>
                      <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Availability</label>
                    <p className="text-sm text-gray-900">{formattedCandidate.availability}</p>
                      </div>
                    </div>
                  </div>
                  
              {/* Professional Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Professional Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Desired Job Roles</label>
                    <div className="flex flex-wrap gap-1">
                      {formattedCandidate.desired_job_roles.map((role, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                      <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Experience</label>
                    <p className="text-sm text-gray-900">{formattedCandidate.total_years_experience} years</p>
                      </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Desired Salary</label>
                    <p className="text-sm text-gray-900">
                      {formattedCandidate.desired_annual_package !== 'N/A' 
                        ? `$${parseInt(formattedCandidate.desired_annual_package).toLocaleString()}`
                        : 'Not specified'
                      }
                    </p>
                    </div>
                      <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Visa Status</label>
                    <p className="text-sm text-gray-900">{formattedCandidate.visa_status.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-blue-600" />
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {formattedCandidate.skills.map((skill, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
                </div>
              </div>

            {/* Right Column - Summary */}
            <div className="space-y-6">
              {/* Candidate Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Candidate Summary</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Score</span>
                    <span className="text-sm font-semibold text-gray-900">{formattedCandidate.candidate_score}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Experience</span>
                    <span className="text-sm font-semibold text-gray-900">{formattedCandidate.total_years_experience} years</span>
                </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Location</span>
                    <span className="text-sm font-semibold text-gray-900">{formattedCandidate.city}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Skills Count</span>
                    <span className="text-sm font-semibold text-gray-900">{formattedCandidate.skills.length}</span>
                </div>
              </div>
          </div>

              {/* Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
                <div className="space-y-3">
                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                    Select Candidate
                  </button>
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Schedule Interview
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                    Download Resume
                  </button>
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