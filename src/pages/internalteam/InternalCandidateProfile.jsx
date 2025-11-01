import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Briefcase, DollarSign, Clock, Shield, UserCheck, AlertCircle, Loader2, Calendar } from "lucide-react";

const InternalCandidateProfile = () => {
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
      
      if (data && data.candidate) {
        setCandidate(data.candidate);
      } else if (data && data.success && data.data) {
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
      user_id: candidate.user_id,
      candidate_code: candidate.candidate_code || code,
      full_name: candidate.full_name || candidate.name || 'N/A',
      city: candidate.city,
      state: candidate.state,
      willing_to_relocate: candidate.willing_to_relocate,
      preferred_locations: candidate.preferred_locations || [],
      desired_job_roles: candidate.desired_job_roles || [],
      preferred_industries: candidate.preferred_industries || [],
      employment_types: candidate.employment_types || [],
      total_years_experience: candidate.total_years_experience,
      job_history: candidate.job_history || [],
      skills: candidate.skills || [],
      education: candidate.education || [],
      certifications: candidate.certifications || [],
      resume_file_path: candidate.resume_file_path,
      resume_file_name: candidate.resume_file_name,
      resume_mime_type: candidate.resume_mime_type,
      visa_status: candidate.visa_status,
      relocation_willingness: candidate.relocation_willingness,
      job_seeking_status: candidate.job_seeking_status,
      desired_annual_package: candidate.desired_annual_package,
      availability_date: candidate.availability_date,
      languages_spoken: candidate.languages_spoken || [],
      ethnicity: candidate.ethnicity,
      veteran_status: candidate.veteran_status,
      disability_status: candidate.disability_status,
      references: candidate.references || [],
      blocked_companies: candidate.blocked_companies || [],
      additional_notes: candidate.additional_notes,
      candidate_score: candidate.candidate_score,
      score_notes: candidate.score_notes,
      score_updated_at: candidate.score_updated_at,
      created_at: candidate.created_at ? new Date(candidate.created_at).toLocaleDateString() : null,
      updated_at: candidate.updated_at,
      scored_by: candidate.scored_by,
      contact_email: candidate.contact_email || candidate.email || 'N/A',
      contact_phone: candidate.contact_phone || candidate.mobile_number || 'N/A'
    };
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="bg-green-100 text-green-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-medium">Approved</span>;
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-medium">Pending</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-medium">Rejected</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-medium">Unknown</span>;
    }
  };

  const getVisaStatusBadge = (visaStatus) => {
    switch (visaStatus) {
      case 'us_citizen':
        return <span className="bg-green-100 text-green-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-medium">US Citizen</span>;
      case 'green_card':
        return <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-medium">Green Card</span>;
      case 'h1_b':
        return <span className="bg-orange-100 text-orange-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-medium">H1-B</span>;
      case 'f1_opt':
        return <span className="bg-purple-100 text-purple-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-medium">F1-OPT</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-medium">{visaStatus}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64">
        <div className="text-center">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin mx-auto text-gray-400" />
          <p className="text-xs sm:text-sm text-gray-500 mt-2">Loading candidate details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 mx-auto text-red-400" />
          <p className="text-xs sm:text-sm text-red-600 mt-2 font-medium">Error: {error}</p>
          <button
            onClick={() => navigate('/internal-team/all-candidates')}
            className="mt-3 sm:mt-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium"
          >
            Back to All Candidates
          </button>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64">
        <div className="text-center">
          <UserCheck className="h-8 w-8 sm:h-10 sm:w-10 mx-auto text-gray-300" />
          <p className="text-xs sm:text-sm text-gray-500 mt-2">Candidate not found</p>
          <button
            onClick={() => navigate('/internal-team/all-candidates')}
            className="mt-3 sm:mt-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium"
          >
            Back to All Candidates
          </button>
        </div>
      </div>
    );
  }

  const formattedCandidate = formatCandidateData(candidate);

  return (
    <div className="w-full max-w-none">
      {/* Back Button */}
      <div className="mb-2 sm:mb-3">
        <button
          onClick={() => navigate('/internal-team/all-candidates')}
          className="inline-flex items-center gap-1 sm:gap-1.5 text-gray-600 hover:text-gray-900 transition-colors text-xs sm:text-sm"
        >
          <ArrowLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          Back to All Candidates
        </button>
      </div>

      {/* Candidate Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg lg:text-xl font-bold text-blue-600">{formattedCandidate.candidate_code}</h1>
              {formattedCandidate.full_name && (
                <p className="text-xs sm:text-sm lg:text-base text-gray-900 font-medium">{formattedCandidate.full_name}</p>
              )}
              <div className="flex items-center gap-2 sm:gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-yellow-500" />
                  <span className="text-[10px] sm:text-xs font-medium text-gray-700">Score: {formattedCandidate.candidate_score || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400" />
                  <span className="text-[10px] sm:text-xs text-gray-500">Added: {formattedCandidate.created_at || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {formattedCandidate.visa_status && getVisaStatusBadge(formattedCandidate.visa_status)}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Left Column - Basic Info */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                  {formattedCandidate.city && (
                    <div>
                      <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">City</label>
                      <p className="text-[10px] sm:text-xs text-gray-900">{formattedCandidate.city}</p>
                    </div>
                  )}
                  {formattedCandidate.state && (
                    <div>
                      <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">State</label>
                      <p className="text-[10px] sm:text-xs text-gray-900">{formattedCandidate.state}</p>
                    </div>
                  )}
                  {formattedCandidate.contact_email && (
                    <div>
                      <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Email</label>
                      <p className="text-[10px] sm:text-xs text-gray-900">{formattedCandidate.contact_email}</p>
                    </div>
                  )}
                  {formattedCandidate.contact_phone && (
                    <div>
                      <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Phone</label>
                      <p className="text-[10px] sm:text-xs text-gray-900">{formattedCandidate.contact_phone}</p>
                    </div>
                  )}
                  {formattedCandidate.availability_date && (
                    <div>
                      <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Availability Date</label>
                      <p className="text-[10px] sm:text-xs text-gray-900">{new Date(formattedCandidate.availability_date).toLocaleDateString()}</p>
                    </div>
                  )}
                  {formattedCandidate.job_seeking_status && (
                    <div>
                      <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Job Seeking Status</label>
                      <p className="text-[10px] sm:text-xs text-gray-900">{formattedCandidate.job_seeking_status.replaceAll('_', ' ')}</p>
                    </div>
                  )}
                </div>
              </div>
                  
              {/* Professional Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                  <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  Professional Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                      <div>
                    <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Desired Job Roles</label>
                    <div className="flex flex-wrap gap-1">
                      {formattedCandidate.desired_job_roles && formattedCandidate.desired_job_roles.length > 0 ? (
                        formattedCandidate.desired_job_roles.map((role, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-medium">
                            {role}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] sm:text-xs text-gray-500">N/A</span>
                      )}
                    </div>
                  </div>
                      <div>
                    <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Experience</label>
                    <p className="text-[10px] sm:text-xs text-gray-900">{formattedCandidate.total_years_experience || 0} years</p>
                      </div>
                  {formattedCandidate.desired_annual_package && (
                    <div>
                      <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Desired Salary</label>
                      <p className="text-[10px] sm:text-xs text-gray-900">${parseInt(formattedCandidate.desired_annual_package).toLocaleString()}</p>
                    </div>
                  )}
                  {formattedCandidate.visa_status && (
                    <div>
                      <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Visa Status</label>
                      <p className="text-[10px] sm:text-xs text-gray-900">{formattedCandidate.visa_status.replace('_', ' ')}</p>
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Preferred Industries</label>
                    <div className="flex flex-wrap gap-1">
                      {formattedCandidate.preferred_industries && formattedCandidate.preferred_industries.length > 0 ? (
                        formattedCandidate.preferred_industries.map((ind, index) => (
                          <span key={index} className="bg-gray-100 text-gray-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-medium">{ind}</span>
                        ))
                      ) : (
                        <span className="text-[10px] sm:text-xs text-gray-500">N/A</span>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Employment Types</label>
                    <div className="flex flex-wrap gap-1">
                      {formattedCandidate.employment_types && formattedCandidate.employment_types.length > 0 ? (
                        formattedCandidate.employment_types.map((type, index) => (
                          <span key={index} className="bg-gray-100 text-gray-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-medium">{type}</span>
                        ))
                      ) : (
                        <span className="text-[10px] sm:text-xs text-gray-500">N/A</span>
                      )}
                    </div>
                  </div>
                  {formattedCandidate.willing_to_relocate !== null && (
                    <div>
                      <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Willing To Relocate</label>
                      <p className="text-[10px] sm:text-xs text-gray-900">{formattedCandidate.willing_to_relocate ? 'Yes' : 'No'}</p>
                    </div>
                  )}
                  {formattedCandidate.relocation_willingness && (
                    <div>
                      <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Relocation Willingness</label>
                      <p className="text-[10px] sm:text-xs text-gray-900">{formattedCandidate.relocation_willingness.replaceAll('_', ' ')}</p>
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Preferred Locations</label>
                    <div className="flex flex-wrap gap-1">
                      {formattedCandidate.preferred_locations && formattedCandidate.preferred_locations.length > 0 ? (
                        formattedCandidate.preferred_locations.map((loc, index) => (
                          <span key={index} className="bg-gray-100 text-gray-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-medium">{loc}</span>
                        ))
                      ) : (
                        <span className="text-[10px] sm:text-xs text-gray-500">N/A</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  Skills
                </h2>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {formattedCandidate.skills && formattedCandidate.skills.length > 0 ? (
                    formattedCandidate.skills.map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] sm:text-xs text-gray-500">N/A</span>
                  )}
                </div>
                </div>

              {/* Job History */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Job History</h2>
                {formattedCandidate.job_history && formattedCandidate.job_history.length > 0 ? (
                  <div className="space-y-2 sm:space-y-3">
                    {formattedCandidate.job_history.map((job, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-2 sm:p-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                          <div className="font-medium text-[10px] sm:text-xs text-gray-900">{job.position} @ {job.company}</div>
                          <div className="text-[10px] sm:text-xs text-gray-500">
                            {job.start_date ? new Date(job.start_date).toLocaleDateString() : '—'} - {job.end_date ? new Date(job.end_date).toLocaleDateString() : 'Present'}
                          </div>
                        </div>
                        {job.description && (
                          <p className="text-[10px] sm:text-xs text-gray-700 mt-1 sm:mt-1.5">{job.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] sm:text-xs text-gray-500">No job history available</p>
                )}
              </div>

              {/* Education */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Education</h2>
                {formattedCandidate.education && formattedCandidate.education.length > 0 ? (
                  <div className="space-y-2 sm:space-y-3">
                    {formattedCandidate.education.map((edu, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-2 sm:p-3">
                        <div className="font-medium text-[10px] sm:text-xs text-gray-900">{edu.degree} - {edu.major}</div>
                        <div className="text-[10px] sm:text-xs text-gray-500">{edu.institution}{edu.graduation_year ? `, ${edu.graduation_year}` : ''}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] sm:text-xs text-gray-500">No education information available</p>
                )}
              </div>

              {/* Certifications */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Certifications</h2>
                {formattedCandidate.certifications && formattedCandidate.certifications.length > 0 ? (
                  <div className="space-y-1.5 sm:space-y-2">
                    {formattedCandidate.certifications.map((cert, idx) => {
                      const isObject = cert && typeof cert === 'object' && !Array.isArray(cert);
                      const name = isObject ? (cert.name || cert.title || 'Certification') : cert;
                      const issuer = isObject ? cert.issuer : null;
                      const date = isObject ? (cert.date || cert.issued || cert.issueDate) : null;
                      const expiry = isObject ? (cert.expiryDate || cert.expires || cert.expirationDate) : null;
                      return (
                        <div key={idx} className="flex items-center justify-between border border-gray-200 rounded-md px-2 py-1.5 sm:px-2.5 sm:py-2">
                          <div>
                            <div className="text-[10px] sm:text-xs font-medium text-gray-900">{name}</div>
                            <div className="text-[9px] sm:text-[10px] text-gray-500">
                              {issuer ? `Issuer: ${issuer}` : null}
                              {(issuer && (date || expiry)) ? ' · ' : null}
                              {date ? `Date: ${new Date(date).toLocaleDateString()}` : null}
                              {(date && expiry) ? ' · ' : null}
                              {expiry ? `Expiry: ${new Date(expiry).toLocaleDateString()}` : null}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[10px] sm:text-xs text-gray-500">No certifications available</p>
                )}
              </div>
              </div>

            {/* Right Column - Summary */}
            <div className="space-y-3 sm:space-y-4">
              {/* Candidate Summary */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Candidate Summary</h2>
                <div className="space-y-2 sm:space-y-2.5">
                  {formattedCandidate.candidate_score !== null && formattedCandidate.candidate_score !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-xs text-gray-600">Score</span>
                      <span className="text-[10px] sm:text-xs font-semibold text-gray-900">{formattedCandidate.candidate_score}</span>
                    </div>
                  )}
                  {formattedCandidate.total_years_experience !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-xs text-gray-600">Experience</span>
                      <span className="text-[10px] sm:text-xs font-semibold text-gray-900">{formattedCandidate.total_years_experience} years</span>
                  </div>
                  )}
                  {formattedCandidate.city && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-xs text-gray-600">City</span>
                      <span className="text-[10px] sm:text-xs font-semibold text-gray-900">{formattedCandidate.city}</span>
                    </div>
                  )}
                  {formattedCandidate.skills && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-xs text-gray-600">Skills Count</span>
                      <span className="text-[10px] sm:text-xs font-semibold text-gray-900">{formattedCandidate.skills.length}</span>
                  </div>
                  )}
                  {formattedCandidate.availability_date && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-xs text-gray-600">Availability</span>
                      <span className="text-[10px] sm:text-xs font-semibold text-gray-900">{new Date(formattedCandidate.availability_date).toLocaleDateString()}</span>
                    </div>
                  )}
              </div>
          </div>

              {/* Languages */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Languages</h2>
                {formattedCandidate.languages_spoken && formattedCandidate.languages_spoken.length > 0 ? (
                  <div className="flex flex-wrap gap-1 sm:gap-1.5">
                    {formattedCandidate.languages_spoken.map((lang, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-800 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium">{lang}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] sm:text-xs text-gray-500">N/A</p>
                )}
              </div>

              {/* References */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">References</h2>
                {formattedCandidate.references && formattedCandidate.references.length > 0 ? (
                  <div className="space-y-2 sm:space-y-2.5">
                    {formattedCandidate.references.map((ref, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-2 sm:p-2.5">
                        <div className="font-medium text-[10px] sm:text-xs text-gray-900">{ref.name} - {ref.position}</div>
                        <div className="text-[10px] sm:text-xs text-gray-600">{ref.company}</div>
                        {ref.contact && (
                          <div className="text-[10px] sm:text-xs text-gray-600">{ref.contact}</div>
                        )}
                        {ref.relationship && (
                          <div className="text-[9px] sm:text-[10px] text-gray-500">{ref.relationship}</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] sm:text-xs text-gray-500">No references available</p>
                )}
              </div>

              {/* Blocked Companies */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Blocked Companies</h2>
                {formattedCandidate.blocked_companies && formattedCandidate.blocked_companies.length > 0 ? (
                  <div className="flex flex-wrap gap-1 sm:gap-1.5">
                    {formattedCandidate.blocked_companies.map((comp, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-800 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium">{comp}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] sm:text-xs text-gray-500">None</p>
                )}
              </div>

              {/* Additional Notes */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Additional Notes</h2>
                {formattedCandidate.additional_notes ? (
                  <p className="text-[10px] sm:text-xs text-gray-700">{formattedCandidate.additional_notes}</p>
                ) : (
                  <p className="text-[10px] sm:text-xs text-gray-500">No additional notes</p>
                )}
              </div>

              {/* Resume */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Resume</h2>
                {formattedCandidate.resume_file_path ? (
                  <a
                    href={formattedCandidate.resume_file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-2 py-1.5 sm:px-3 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-[10px] sm:text-xs font-medium"
                  >
                    Download {formattedCandidate.resume_file_name || 'Resume'}
                  </a>
                ) : (
                  <p className="text-[10px] sm:text-xs text-gray-500">No resume available</p>
                )}
              </div>
            </div>
          </div>
        </div>
  );
};

export default InternalCandidateProfile;

