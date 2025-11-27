import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Star, Briefcase, UserCheck, AlertCircle, Loader2, Calendar, Edit, Save, X } from "lucide-react";
import { toast } from 'react-toastify';

const InternalCandidateProfile = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [updateErrors, setUpdateErrors] = useState({});
  const [newSkill, setNewSkill] = useState({ name: '', experience: '' });

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

  useEffect(() => {
    if (code) {
      fetchCandidateDetails();
    }
  }, [code]);

  const formatCandidateData = (candidate) => {
    if (!candidate) return null;
    return {
      id: candidate.id,
      user_id: candidate.user_id,
      candidate_code: candidate.candidate_code || code,
      full_name: candidate.full_name || candidate.name || 'N/A',
      gender: candidate.gender,
      city: candidate.city,
      state: candidate.state,
      willing_to_relocate: candidate.willing_to_relocate,
      preferred_locations: candidate.preferred_locations || [],
      desired_job_roles: candidate.desired_job_roles || [],
      preferred_industries: candidate.preferred_industries || [],
      employment_types: candidate.employment_types || [],
      total_years_experience: candidate.total_years_experience,
      job_history: candidate.job_history || [],
      current_employer: candidate.current_employer,
      willing_to_join_startup: candidate.willing_to_join_startup,
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
      additional_notes: candidate.additional_notes,
      created_at: candidate.created_at ? new Date(candidate.created_at).toLocaleDateString() : null,
      updated_at: candidate.updated_at,
      contact_email: candidate.contact_email || candidate.email || 'N/A',
      contact_phone: candidate.contact_phone || candidate.mobile_number || 'N/A'
    };
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

  // Helper function to handle array field changes (add/remove)
  const handleArrayFieldChange = (field, action, value, index = null) => {
    setEditFormData(prev => {
      const currentArray = prev[field] || [];
      if (action === 'add' && value && !currentArray.includes(value)) {
        return { ...prev, [field]: [...currentArray, value] };
      } else if (action === 'remove' && index !== null) {
        return { ...prev, [field]: currentArray.filter((_, i) => i !== index) };
      }
      return prev;
    });
  };

  // Helper function to get display value for array items
  const getArrayItemDisplay = (item) => {
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item !== null) {
      return item.name || item.title || item || '';
    }
    return String(item || '');
  };

  // Helper function to handle nested object array changes (for skills, job_history, education, etc.)
  const handleNestedArrayChange = (field, action, index = null, updatedItem = null) => {
    setEditFormData(prev => {
      const currentArray = prev[field] || [];
      if (action === 'add') {
        return { ...prev, [field]: [...currentArray, updatedItem || {}] };
      } else if (action === 'remove' && index !== null) {
        return { ...prev, [field]: currentArray.filter((_, i) => i !== index) };
      } else if (action === 'update' && index !== null && updatedItem) {
        const newArray = [...currentArray];
        newArray[index] = { ...newArray[index], ...updatedItem };
        return { ...prev, [field]: newArray };
      }
      return prev;
    });
  };

  // Handle adding a new skill
  const handleAddSkill = () => {
    if (newSkill.name && newSkill.name.trim()) {
      const skillObj = {
        name: newSkill.name.trim(),
        experience: newSkill.experience.trim() || '0',
        years_experience: newSkill.experience.trim() || '0'
      };
      handleNestedArrayChange('skills', 'add', null, skillObj);
      setNewSkill({ name: '', experience: '' });
    }
  };

  // Handle updating a skill
  const handleUpdateSkill = (index, field, value) => {
    const currentSkills = editFormData.skills || [];
    const updatedSkill = { ...currentSkills[index], [field]: value };
    if (field === 'experience') {
      updatedSkill.years_experience = value;
    }
    handleNestedArrayChange('skills', 'update', index, updatedSkill);
  };

  // Handle updating nested object fields (for job_history, education, certifications, references)
  const handleUpdateNestedField = (field, index, nestedField, value) => {
    const currentArray = editFormData[field] || [];
    const updatedItem = { ...currentArray[index], [nestedField]: value };
    handleNestedArrayChange(field, 'update', index, updatedItem);
  };

  // Handle adding new nested item
  const handleAddNestedItem = (field, defaultItem = {}) => {
    handleNestedArrayChange(field, 'add', null, defaultItem);
  };

  const initializeEditForm = () => {
    if (candidate) {
      setEditFormData({
        full_name: candidate.full_name || candidate.name || "",
        city: candidate.city || "",
        state: candidate.state || "",
        gender: candidate.gender || "",
        willing_to_relocate: candidate.willing_to_relocate !== null ? candidate.willing_to_relocate : false,
        willing_to_join_startup: candidate.willing_to_join_startup !== null ? candidate.willing_to_join_startup : false,
        preferred_locations: candidate.preferred_locations || [],
        desired_job_roles: candidate.desired_job_roles || [],
        preferred_industries: candidate.preferred_industries || [],
        employment_types: candidate.employment_types || [],
        total_years_experience: candidate.total_years_experience || "",
        job_history: candidate.job_history || [],
        current_employer: candidate.current_employer || "",
        skills: candidate.skills || [],
        education: candidate.education || [],
        certifications: candidate.certifications || [],
        visa_status: candidate.visa_status || "",
        relocation_willingness: candidate.relocation_willingness || "",
        job_seeking_status: candidate.job_seeking_status || "",
        desired_annual_package: candidate.desired_annual_package || "",
        availability_date: candidate.availability_date ? candidate.availability_date.split('T')[0] : "",
        languages_spoken: candidate.languages_spoken || [],
        ethnicity: candidate.ethnicity || "",
        veteran_status: candidate.veteran_status || false,
        disability_status: candidate.disability_status || false,
        references: candidate.references || [],
        additional_notes: candidate.additional_notes || "",
        contact_email: candidate.contact_email || candidate.email || "",
        contact_phone: candidate.contact_phone || candidate.mobile_number || ""
      });
      setUpdateErrors({});
    }
  };

  const handleEditToggle = () => {
    if (!isEditMode) {
      initializeEditForm();
    } else {
      setEditFormData({});
      setUpdateErrors({});
    }
    setIsEditMode(!isEditMode);
  };

  const updateCandidateProfile = async () => {
    try {
      setIsUpdating(true);
      setUpdateErrors({});
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const updateData = {
        candidate_code: code || candidate?.candidate_code,
        full_name: editFormData.full_name || null,
        city: editFormData.city || null,
        state: editFormData.state || null,
        gender: editFormData.gender || null,
        willing_to_relocate: editFormData.willing_to_relocate !== undefined ? editFormData.willing_to_relocate : null,
        willing_to_join_startup: editFormData.willing_to_join_startup !== undefined ? editFormData.willing_to_join_startup : null,
        preferred_locations: editFormData.preferred_locations || [],
        desired_job_roles: editFormData.desired_job_roles || [],
        preferred_industries: editFormData.preferred_industries || [],
        employment_types: editFormData.employment_types || [],
        total_years_experience: editFormData.total_years_experience ? parseInt(editFormData.total_years_experience) : null,
        job_history: editFormData.job_history || [],
        current_employer: editFormData.current_employer || null,
        skills: editFormData.skills || [],
        education: editFormData.education || [],
        certifications: editFormData.certifications || [],
        visa_status: editFormData.visa_status || null,
        relocation_willingness: editFormData.relocation_willingness || null,
        job_seeking_status: editFormData.job_seeking_status || null,
        desired_annual_package: editFormData.desired_annual_package ? parseFloat(editFormData.desired_annual_package) : null,
        availability_date: editFormData.availability_date || null,
        languages_spoken: editFormData.languages_spoken || [],
        ethnicity: editFormData.ethnicity || null,
        veteran_status: editFormData.veteran_status !== undefined ? editFormData.veteran_status : false,
        disability_status: editFormData.disability_status !== undefined ? editFormData.disability_status : false,
        references: editFormData.references || [],
        additional_notes: editFormData.additional_notes || null,
        contact_email: editFormData.contact_email || null,
        contact_phone: editFormData.contact_phone || null
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/internal/candidates/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      let data;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        throw new Error("Invalid response from server. Please try again.");
      }

      if (!response.ok) {
        if (response.status === 422 && data.errors) {
          const fieldErrors = {};
          Object.keys(data.errors).forEach(key => {
            fieldErrors[key] = Array.isArray(data.errors[key]) 
              ? data.errors[key][0] 
              : data.errors[key];
          });
          setUpdateErrors(fieldErrors);
          toast.error("Please correct the errors in the form");
          return;
        }
        
        const errorMessage = data.message || data.error || `Failed to update candidate profile (${response.status})`;
        throw new Error(errorMessage);
      }

      toast.success(data.message || 'Candidate profile updated successfully!');
      setIsEditMode(false);
      setEditFormData({});
      setUpdateErrors({});
      await fetchCandidateDetails();
    } catch (error) {
      console.error('Error updating candidate profile:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error("Network error. Please check your internet connection and try again.");
      } else {
        toast.error(error.message || "Failed to update candidate profile. Please try again.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBackNavigation = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/internal-team/all-candidates');
      }
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
            onClick={handleBackNavigation}
            className="mt-3 sm:mt-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium"
          >
            Back
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
            onClick={handleBackNavigation}
            className="mt-3 sm:mt-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium"
          >
            Back
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
          onClick={handleBackNavigation}
          className="inline-flex items-center gap-1 sm:gap-1.5 text-gray-600 hover:text-gray-900 transition-colors text-xs sm:text-sm"
        >
          <ArrowLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          Back
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
              <p className="text-base sm:text-lg lg:text-xl text-blue-600 font-bold">{formattedCandidate.candidate_code}</p>
              <div className="flex items-center gap-2 sm:gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400" />
                  <span className="text-[10px] sm:text-xs text-gray-500">Added: {formattedCandidate.created_at || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {formattedCandidate.visa_status && getVisaStatusBadge(formattedCandidate.visa_status)}
            {!isEditMode ? (
              <button
                onClick={handleEditToggle}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-[10px] sm:text-xs font-medium"
              >
                <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Edit Profile
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEditToggle}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-[10px] sm:text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  Cancel
                </button>
                <button
                  onClick={updateCandidateProfile}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-[10px] sm:text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Left Column - Basic Info */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5 lg:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {isEditMode ? (
                    <>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Full Name</label>
                        <input
                          type="text"
                          value={editFormData.full_name || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, full_name: e.target.value }))}
                          className={`w-full px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${updateErrors.full_name ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                        />
                        {updateErrors.full_name && (
                          <p className="mt-0.5 text-[9px] sm:text-[10px] text-red-600">{updateErrors.full_name}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Gender</label>
                        <select
                          value={editFormData.gender || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, gender: e.target.value }))}
                          className={`w-full px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors ${updateErrors.gender ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer_not_to_say">Prefer Not to Say</option>
                        </select>
                        {updateErrors.gender && (
                          <p className="mt-1 text-xs text-red-600">{updateErrors.gender}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">City</label>
                        <input
                          type="text"
                          value={editFormData.city || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, city: e.target.value }))}
                          className={`w-full px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${updateErrors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                        />
                        {updateErrors.city && (
                          <p className="mt-0.5 text-[9px] sm:text-[10px] text-red-600">{updateErrors.city}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">State</label>
                        <input
                          type="text"
                          value={editFormData.state || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, state: e.target.value }))}
                          className={`w-full px-2 py-1.5 sm:px-2.5 sm:py-2 text-[10px] sm:text-xs border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${updateErrors.state ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                        />
                        {updateErrors.state && (
                          <p className="mt-0.5 text-[9px] sm:text-[10px] text-red-600">{updateErrors.state}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Email</label>
                        <input
                          type="email"
                          value={editFormData.contact_email || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                          className={`w-full px-2 py-1.5 sm:px-2.5 sm:py-2 text-[10px] sm:text-xs border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${updateErrors.contact_email ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                        />
                        {updateErrors.contact_email && (
                          <p className="mt-0.5 text-[9px] sm:text-[10px] text-red-600">{updateErrors.contact_email}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Phone</label>
                        <input
                          type="tel"
                          value={editFormData.contact_phone || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                          className={`w-full px-2 py-1.5 sm:px-2.5 sm:py-2 text-[10px] sm:text-xs border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${updateErrors.contact_phone ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                        />
                        {updateErrors.contact_phone && (
                          <p className="mt-0.5 text-[9px] sm:text-[10px] text-red-600">{updateErrors.contact_phone}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Availability Date</label>
                        <input
                          type="date"
                          value={editFormData.availability_date || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, availability_date: e.target.value }))}
                          className={`w-full px-2 py-1.5 sm:px-2.5 sm:py-2 text-[10px] sm:text-xs border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${updateErrors.availability_date ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                        />
                        {updateErrors.availability_date && (
                          <p className="mt-0.5 text-[9px] sm:text-[10px] text-red-600">{updateErrors.availability_date}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Job Seeking Status</label>
                        <select
                          value={editFormData.job_seeking_status || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, job_seeking_status: e.target.value }))}
                          className={`w-full px-2 py-1.5 sm:px-2.5 sm:py-2 text-[10px] sm:text-xs border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white ${updateErrors.job_seeking_status ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                        >
                          <option value="">Select Status</option>
                          <option value="actively_looking">Actively Looking</option>
                          <option value="open_to_offers">Open to Offers</option>
                          <option value="not_looking">Not Looking</option>
                        </select>
                        {updateErrors.job_seeking_status && (
                          <p className="mt-0.5 text-[9px] sm:text-[10px] text-red-600">{updateErrors.job_seeking_status}</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {formattedCandidate.full_name && (
                        <div>
                          <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Full Name</label>
                          <p className="text-[10px] sm:text-xs text-gray-900">{formattedCandidate.full_name}</p>
                        </div>
                      )}
                      {formattedCandidate.gender && (
                        <div>
                          <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Gender</label>
                          <p className="text-[10px] sm:text-xs text-gray-900">
                            {formattedCandidate.gender
                              .replaceAll('_', ' ')
                              .split(' ')
                              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                              .join(' ')}
                          </p>
                        </div>
                      )}
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
                    </>
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
                  <div className="md:col-span-2">
                    <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Desired Job Roles</label>
                    {isEditMode ? (
                      <div className="space-y-1.5">
                        <div className="flex gap-1">
                          <input
                            type="text"
                            placeholder="Add job role (press Enter)"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const value = e.target.value.trim();
                                if (value) {
                                  handleArrayFieldChange('desired_job_roles', 'add', value);
                                  e.target.value = '';
                                }
                              }
                            }}
                            className={`flex-1 px-2 py-1.5 sm:px-2.5 sm:py-2 text-[10px] sm:text-xs border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${updateErrors.desired_job_roles ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                          />
                        </div>
                        {updateErrors.desired_job_roles && (
                          <p className="text-[9px] sm:text-[10px] text-red-600">{updateErrors.desired_job_roles}</p>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {(editFormData.desired_job_roles || []).map((role, index) => (
                            <span key={index} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-medium">
                              {getArrayItemDisplay(role)}
                              <button
                                type="button"
                                onClick={() => handleArrayFieldChange('desired_job_roles', 'remove', null, index)}
                                className="hover:text-red-600 transition-colors"
                              >
                                <X className="h-2.5 w-2.5" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {formattedCandidate.desired_job_roles && formattedCandidate.desired_job_roles.length > 0 ? (
                          formattedCandidate.desired_job_roles.map((role, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-medium">
                              {getArrayItemDisplay(role)}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] sm:text-xs text-gray-500 italic">Not specified</span>
                        )}
                      </div>
                    )}
                  </div>
                      <div>
                    <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Experience</label>
                    {isEditMode ? (
                      <>
                        <input
                          type="number"
                          value={editFormData.total_years_experience || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, total_years_experience: e.target.value }))}
                          className={`w-full px-2 py-1.5 sm:px-2.5 sm:py-2 text-[10px] sm:text-xs border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${updateErrors.total_years_experience ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                          min="0"
                        />
                        {updateErrors.total_years_experience && (
                          <p className="mt-0.5 text-[9px] sm:text-[10px] text-red-600">{updateErrors.total_years_experience}</p>
                        )}
                      </>
                    ) : (
                      <p className="text-[10px] sm:text-xs text-gray-900">{formattedCandidate.total_years_experience || 0} years</p>
                    )}
                      </div>
                  {isEditMode ? (
                    <div>
                      <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Desired Salary</label>
                      <input
                        type="number"
                        value={editFormData.desired_annual_package || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, desired_annual_package: e.target.value }))}
                        className={`w-full px-2 py-1.5 sm:px-2.5 sm:py-2 text-[10px] sm:text-xs border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${updateErrors.desired_annual_package ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                        min="0"
                        step="1000"
                      />
                      {updateErrors.desired_annual_package && (
                        <p className="mt-0.5 text-[9px] sm:text-[10px] text-red-600">{updateErrors.desired_annual_package}</p>
                      )}
                    </div>
                  ) : formattedCandidate.desired_annual_package && (
                    <div>
                      <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Desired Salary</label>
                      <p className="text-[10px] sm:text-xs text-gray-900">${parseInt(formattedCandidate.desired_annual_package).toLocaleString()}</p>
                    </div>
                  )}
                  {isEditMode ? (
                    <div>
                      <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Visa Status</label>
                      <select
                        value={editFormData.visa_status || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, visa_status: e.target.value }))}
                        className={`w-full px-2 py-1.5 sm:px-2.5 sm:py-2 text-[10px] sm:text-xs border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white ${updateErrors.visa_status ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                      >
                        <option value="">Select Visa Status</option>
                        <option value="us_citizen">US Citizen</option>
                        <option value="permanent_resident">Permanent Resident</option>
                        <option value="h1b">H1B</option>
                        <option value="opt_cpt">OPT/CPT</option>
                        <option value="other">Other</option>
                      </select>
                      {updateErrors.visa_status && (
                        <p className="mt-0.5 text-[9px] sm:text-[10px] text-red-600">{updateErrors.visa_status}</p>
                      )}
                    </div>
                  ) : formattedCandidate.visa_status && (
                    <div>
                      <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Visa Status</label>
                      <p className="text-[10px] sm:text-xs text-gray-900">{formattedCandidate.visa_status.replace('_', ' ')}</p>
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Preferred Industries</label>
                    {isEditMode ? (
                      <div className="space-y-1.5">
                        <div className="flex gap-1">
                          <input
                            type="text"
                            placeholder="Add industry (press Enter)"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const value = e.target.value.trim();
                                if (value) {
                                  handleArrayFieldChange('preferred_industries', 'add', value);
                                  e.target.value = '';
                                }
                              }
                            }}
                            className={`flex-1 px-2 py-1.5 sm:px-2.5 sm:py-2 text-[10px] sm:text-xs border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${updateErrors.preferred_industries ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                          />
                        </div>
                        {updateErrors.preferred_industries && (
                          <p className="text-[9px] sm:text-[10px] text-red-600">{updateErrors.preferred_industries}</p>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {(editFormData.preferred_industries || []).map((ind, index) => (
                            <span key={index} className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-medium">
                              {getArrayItemDisplay(ind)}
                              <button
                                type="button"
                                onClick={() => handleArrayFieldChange('preferred_industries', 'remove', null, index)}
                                className="hover:text-red-600 transition-colors"
                              >
                                <X className="h-2.5 w-2.5" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {formattedCandidate.preferred_industries && formattedCandidate.preferred_industries.length > 0 ? (
                          formattedCandidate.preferred_industries.map((ind, index) => (
                            <span key={index} className="bg-gray-100 text-gray-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-medium">{getArrayItemDisplay(ind)}</span>
                          ))
                        ) : (
                          <span className="text-[10px] sm:text-xs text-gray-500 italic">Not specified</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Employment Types</label>
                    {isEditMode ? (
                      <div className="space-y-1.5">
                        <div className="flex gap-1">
                          <input
                            type="text"
                            placeholder="Add employment type (press Enter)"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const value = e.target.value.trim();
                                if (value) {
                                  handleArrayFieldChange('employment_types', 'add', value);
                                  e.target.value = '';
                                }
                              }
                            }}
                            className={`flex-1 px-2 py-1.5 sm:px-2.5 sm:py-2 text-[10px] sm:text-xs border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${updateErrors.employment_types ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                          />
                        </div>
                        {updateErrors.employment_types && (
                          <p className="text-[9px] sm:text-[10px] text-red-600">{updateErrors.employment_types}</p>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {(editFormData.employment_types || []).map((type, index) => (
                            <span key={index} className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-medium">
                              {getArrayItemDisplay(type)}
                              <button
                                type="button"
                                onClick={() => handleArrayFieldChange('employment_types', 'remove', null, index)}
                                className="hover:text-red-600 transition-colors"
                              >
                                <X className="h-2.5 w-2.5" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {formattedCandidate.employment_types && formattedCandidate.employment_types.length > 0 ? (
                          formattedCandidate.employment_types.map((type, index) => (
                            <span key={index} className="bg-gray-100 text-gray-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-medium">{getArrayItemDisplay(type)}</span>
                          ))
                        ) : (
                          <span className="text-[10px] sm:text-xs text-gray-500 italic">Not specified</span>
                        )}
                      </div>
                    )}
                  </div>
                  {isEditMode ? (
                    <>
                      <div>
                        <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Willing To Relocate</label>
                        <select
                          value={editFormData.willing_to_relocate !== null && editFormData.willing_to_relocate !== undefined ? (editFormData.willing_to_relocate ? 'yes' : 'no') : ''}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, willing_to_relocate: e.target.value === 'yes' }))}
                          className={`w-full px-2 py-1.5 sm:px-2.5 sm:py-2 text-[10px] sm:text-xs border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white ${updateErrors.willing_to_relocate ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                        {updateErrors.willing_to_relocate && (
                          <p className="mt-0.5 text-[9px] sm:text-[10px] text-red-600">{updateErrors.willing_to_relocate}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Relocation Willingness</label>
                        <select
                          value={editFormData.relocation_willingness || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, relocation_willingness: e.target.value }))}
                          className={`w-full px-2 py-1.5 sm:px-2.5 sm:py-2 text-[10px] sm:text-xs border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white ${updateErrors.relocation_willingness ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                        >
                          <option value="">Select</option>
                          <option value="by_self">By Self</option>
                          <option value="if_employer_covers">If Employer Covers</option>
                          <option value="not_willing">Not Willing</option>
                        </select>
                        {updateErrors.relocation_willingness && (
                          <p className="mt-0.5 text-[9px] sm:text-[10px] text-red-600">{updateErrors.relocation_willingness}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Willing to Join Startup</label>
                        <select
                          value={editFormData.willing_to_join_startup !== null && editFormData.willing_to_join_startup !== undefined ? (editFormData.willing_to_join_startup ? 'yes' : 'no') : ''}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, willing_to_join_startup: e.target.value === 'yes' }))}
                          className={`w-full px-2 py-1.5 sm:px-2.5 sm:py-2 text-[10px] sm:text-xs border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white ${updateErrors.willing_to_join_startup ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                        {updateErrors.willing_to_join_startup && (
                          <p className="mt-0.5 text-[9px] sm:text-[10px] text-red-600">{updateErrors.willing_to_join_startup}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Current Employer</label>
                        <input
                          type="text"
                          value={editFormData.current_employer || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, current_employer: e.target.value }))}
                          className={`w-full px-2 py-1.5 sm:px-2.5 sm:py-2 text-[10px] sm:text-xs border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${updateErrors.current_employer ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                        />
                        {updateErrors.current_employer && (
                          <p className="mt-0.5 text-[9px] sm:text-[10px] text-red-600">{updateErrors.current_employer}</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
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
                      {formattedCandidate.willing_to_join_startup !== null && (
                        <div>
                          <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Willing to Join Startup</label>
                          <p className="text-[10px] sm:text-xs text-gray-900">{formattedCandidate.willing_to_join_startup ? 'Yes' : 'No'}</p>
                        </div>
                      )}
                      {formattedCandidate.current_employer && (
                        <div>
                          <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Current Employer</label>
                          <p className="text-[10px] sm:text-xs text-gray-900">{formattedCandidate.current_employer}</p>
                        </div>
                      )}
                    </>
                  )}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Preferred Locations</label>
                    {isEditMode ? (
                      <div className="space-y-1.5">
                        <div className="flex gap-1">
                          <input
                            type="text"
                            placeholder="Add location (press Enter)"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const value = e.target.value.trim();
                                if (value) {
                                  handleArrayFieldChange('preferred_locations', 'add', value);
                                  e.target.value = '';
                                }
                              }
                            }}
                            className={`flex-1 px-2 py-1.5 sm:px-2.5 sm:py-2 text-[10px] sm:text-xs border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${updateErrors.preferred_locations ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                          />
                        </div>
                        {updateErrors.preferred_locations && (
                          <p className="text-[9px] sm:text-[10px] text-red-600">{updateErrors.preferred_locations}</p>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {(editFormData.preferred_locations || []).map((loc, index) => (
                            <span key={index} className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-medium">
                              {getArrayItemDisplay(loc)}
                              <button
                                type="button"
                                onClick={() => handleArrayFieldChange('preferred_locations', 'remove', null, index)}
                                className="hover:text-red-600 transition-colors"
                              >
                                <X className="h-2.5 w-2.5" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {formattedCandidate.preferred_locations && formattedCandidate.preferred_locations.length > 0 ? (
                          formattedCandidate.preferred_locations.map((loc, index) => (
                            <span key={index} className="bg-gray-100 text-gray-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-medium">{getArrayItemDisplay(loc)}</span>
                          ))
                        ) : (
                          <span className="text-[10px] sm:text-xs text-gray-500 italic">Not specified</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  Skills
                </h2>
                {isEditMode ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Skill name"
                        value={newSkill.name}
                        onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                        className="flex-1 px-2 py-1.5 sm:px-2.5 sm:py-2 text-[10px] sm:text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Years"
                        value={newSkill.experience}
                        onChange={(e) => setNewSkill(prev => ({ ...prev, experience: e.target.value }))}
                        className="w-20 px-2 py-1.5 sm:px-2.5 sm:py-2 text-[10px] sm:text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-[10px] sm:text-xs font-medium"
                      >
                        Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(editFormData.skills || []).map((skill, idx) => {
                        const skillName = typeof skill === 'object' ? (skill.name || skill.skill || '') : String(skill || '');
                        const experience = typeof skill === 'object' ? (skill.experience || skill.years_experience || '') : '';
                        return (
                          <div key={idx} className="flex items-center gap-2 p-2 border border-gray-200 rounded-md">
                            <input
                              type="text"
                              value={skillName}
                              onChange={(e) => handleUpdateSkill(idx, 'name', e.target.value)}
                              className="flex-1 px-2 py-1 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                              type="number"
                              value={experience}
                              onChange={(e) => handleUpdateSkill(idx, 'experience', e.target.value)}
                              className="w-20 px-2 py-1 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              min="0"
                              placeholder="Years"
                            />
                            <button
                              type="button"
                              onClick={() => handleNestedArrayChange('skills', 'remove', idx)}
                              className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <>
                    {formattedCandidate.skills && formattedCandidate.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {formattedCandidate.skills.map((skill, idx) => {
                          let skillName = '';
                          let experience = '';
                          
                          if (typeof skill === 'object' && skill !== null) {
                            skillName = skill.name || skill.skill || '';
                            const expValue = skill.experience || skill.years_experience || '';
                            experience = typeof expValue === 'object' ? '' : String(expValue || '');
                          } else {
                            skillName = String(skill || '');
                          }
                          
                          skillName = String(skillName || '');
                          
                          const displayText = (() => {
                            if (!experience || !experience.trim()) return skillName;
                          
                            const expTrim = experience.trim();
                            const hasYearWord = /\byears?\b/i.test(expTrim); // checks for "year" or "years"
                          
                            // If DB already gives "1 year" / "2 years", use as-is
                            if (hasYearWord) {
                              return `${skillName} (${expTrim})`;
                            }
                          
                            // If DB gives just "1" / "2", then add "year/years"
                            const isOne = expTrim === '1';
                            return `${skillName} (${expTrim} ${isOne ? 'year' : 'years'})`;
                          })();
                          
                          
                          return (
                            <span key={idx} className="bg-gray-100 text-gray-800 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium">
                              {displayText}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-[10px] sm:text-xs text-gray-500 italic">No skills information available</p>
                    )}
                  </>
                )}
              </div>

              {/* Job History */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <h2 className="text-sm sm:text-base font-semibold text-gray-900">Job History</h2>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => handleAddNestedItem('job_history', { position: '', company: '', start_date: '', end_date: '', description: '' })}
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      + Add Job
                    </button>
                  )}
                </div>
                {isEditMode ? (
                  <div className="space-y-3">
                    {(editFormData.job_history || []).map((job, idx) => {
                      const formatDateForInput = (dateString) => {
                        if (!dateString) return '';
                        try {
                          const date = new Date(dateString);
                          if (isNaN(date.getTime())) return '';
                          return date.toISOString().split('T')[0];
                        } catch (e) {
                          return '';
                        }
                      };
                      return (
                        <div key={idx} className="border border-gray-300 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-700">Job #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleNestedArrayChange('job_history', 'remove', idx)}
                              className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">Position/Title</label>
                              <input
                                type="text"
                                value={job.position || job.title || ''}
                                onChange={(e) => handleUpdateNestedField('job_history', idx, 'position', e.target.value)}
                                className="w-full px-2 py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter Position"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">Company</label>
                              <input
                                type="text"
                                value={job.company || job.company_name || ''}
                                onChange={(e) => handleUpdateNestedField('job_history', idx, 'company', e.target.value)}
                                className="w-full px-2 py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Company name"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">Start Date</label>
                              <input
                                type="date"
                                value={formatDateForInput(job.start_date)}
                                onChange={(e) => handleUpdateNestedField('job_history', idx, 'start_date', e.target.value)}
                                className="w-full px-2 py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">End Date</label>
                              <input
                                type="date"
                                value={formatDateForInput(job.end_date)}
                                onChange={(e) => handleUpdateNestedField('job_history', idx, 'end_date', e.target.value)}
                                className="w-full px-2 py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">Description</label>
                            <textarea
                              value={job.description || job.job_description || ''}
                              onChange={(e) => handleUpdateNestedField('job_history', idx, 'description', e.target.value)}
                              rows={2}
                              className="w-full px-2 py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                              placeholder="Job description"
                            />
                          </div>
                        </div>
                      );
                    })}
                    {(!editFormData.job_history || editFormData.job_history.length === 0) && (
                      <p className="text-[10px] sm:text-xs text-gray-500 italic text-center py-2">No job history entries. Click "Add Job" to add one.</p>
                    )}
                  </div>
                ) : (
                  <>
                    {formattedCandidate.job_history && formattedCandidate.job_history.length > 0 ? (
                      <div className="space-y-2 sm:space-y-3">
                        {formattedCandidate.job_history.map((job, idx) => {
                      const formatDate = (dateString) => {
                        if (!dateString) return null;
                        try {
                          const date = new Date(dateString);
                          return isNaN(date.getTime()) ? null : date.toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          });
                        } catch (e) {
                          return null;
                        }
                      };

                      const position = job.position || job.title || '';
                      const company = job.company || job.company_name || '';
                      const startDate = formatDate(job.start_date);
                      const endDate = formatDate(job.end_date);
                      const hasStartDate = startDate !== null;
                      const hasEndDate = endDate !== null;
                      const hasEndDateValue = job.end_date !== null && job.end_date !== undefined && job.end_date !== '';
                      const description = job.description || job.job_description || '';
                      const hasAnyData = position || company || hasStartDate || hasEndDate || description;

                      if (!hasAnyData) {
                        return (
                          <div key={idx} className="border border-gray-200 rounded-lg p-2 sm:p-3 bg-gray-50">
                            <p className="text-[10px] sm:text-xs text-gray-500 italic">Job history information not available for this entry</p>
                          </div>
                        );
                      }

                      return (
                        <div key={idx} className="border border-gray-200 rounded-lg p-2 sm:p-3 bg-white">
                          {(position || company) ? (
                            <div className="font-medium text-[10px] sm:text-xs text-gray-900 mb-1 sm:mb-2">
                              {position ? position : 'Position not specified'} {company ? `at ${company}` : ''}
                            </div>
                          ) : null}
                          <div className="text-[10px] sm:text-xs text-gray-500 space-y-1">
                            {hasStartDate || hasEndDateValue ? (
                              <div className="flex flex-wrap items-center gap-2">
                                {hasStartDate && (
                                  <>
                                    <span>
                                      <span className="font-medium">Start:</span> {startDate}
                                    </span>
                                    <span>•</span>
                                  </>
                                )}
                                {hasEndDate ? (
                                  <span>
                                    <span className="font-medium">End:</span> {endDate}
                                  </span>
                                ) : hasStartDate && !hasEndDateValue ? (
                                  <span>
                                    <span className="font-medium">End:</span> <span className="text-green-600 font-semibold">Present</span>
                                  </span>
                                ) : null}
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">Date information not available</span>
                            )}
                          </div>
                          {description && (
                            <p className="text-[10px] sm:text-xs text-gray-700 mt-1 sm:mt-2">{description}</p>
                          )}
                        </div>
                      );
                        })}
                      </div>
                    ) : (
                      <p className="text-[10px] sm:text-xs text-gray-500 italic">No job history information available</p>
                    )}
                  </>
                )}
              </div>

              {/* Education */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <h2 className="text-sm sm:text-base font-semibold text-gray-900">Education</h2>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => handleAddNestedItem('education', { degree: '', major: '', institution: '', location: '', start_date: '', end_date: '', graduation_date: '', gpa: '', gpa_scale: '', honors: '', description: '', field_of_study: '', certification: '' })}
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      + Add Education
                    </button>
                  )}
                </div>
                {isEditMode ? (
                  <div className="space-y-3">
                    {(editFormData.education || []).map((edu, idx) => {
                      const formatDateForInput = (dateString) => {
                        if (!dateString) return '';
                        try {
                          const date = new Date(dateString);
                          if (isNaN(date.getTime())) return '';
                          return date.toISOString().split('T')[0];
                        } catch (e) {
                          return '';
                        }
                      };
                      return (
                        <div key={idx} className="border border-gray-300 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-700">Education #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleNestedArrayChange('education', 'remove', idx)}
                              className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">Degree</label>
                              <input
                                type="text"
                                value={edu.degree || ''}
                                onChange={(e) => handleUpdateNestedField('education', idx, 'degree', e.target.value)}
                                className="w-full px-2 py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., M.Tech"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">Major</label>
                              <input
                                type="text"
                                value={edu.major || ''}
                                onChange={(e) => handleUpdateNestedField('education', idx, 'major', e.target.value)}
                                className="w-full px-2 py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Field of study"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">Institution</label>
                              <input
                                type="text"
                                value={edu.institution || ''}
                                onChange={(e) => handleUpdateNestedField('education', idx, 'institution', e.target.value)}
                                className="w-full px-2 py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Institution name"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">Location</label>
                              <input
                                type="text"
                                value={edu.location || ''}
                                onChange={(e) => handleUpdateNestedField('education', idx, 'location', e.target.value)}
                                className="w-full px-2 py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="City, State"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">Start Date</label>
                              <input
                                type="date"
                                value={formatDateForInput(edu.start_date)}
                                onChange={(e) => handleUpdateNestedField('education', idx, 'start_date', e.target.value)}
                                className="w-full px-2 py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">End Date</label>
                              <input
                                type="date"
                                value={formatDateForInput(edu.end_date)}
                                onChange={(e) => handleUpdateNestedField('education', idx, 'end_date', e.target.value)}
                                className="w-full px-2 py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">GPA</label>
                              <input
                                type="text"
                                value={edu.gpa || ''}
                                onChange={(e) => handleUpdateNestedField('education', idx, 'gpa', e.target.value)}
                                className="w-full px-2 py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., 3.5"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">GPA Scale</label>
                              <input
                                type="text"
                                value={edu.gpa_scale || ''}
                                onChange={(e) => handleUpdateNestedField('education', idx, 'gpa_scale', e.target.value)}
                                className="w-full px-2 py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., 4.0"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">Description</label>
                            <textarea
                              value={edu.description || ''}
                              onChange={(e) => handleUpdateNestedField('education', idx, 'description', e.target.value)}
                              rows={2}
                              className="w-full px-2 py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                              placeholder="Additional details"
                            />
                          </div>
                        </div>
                      );
                    })}
                    {(!editFormData.education || editFormData.education.length === 0) && (
                      <p className="text-[10px] sm:text-xs text-gray-500 italic text-center py-2">No education entries. Click "Add Education" to add one.</p>
                    )}
                  </div>
                ) : (
                  <>
                    {formattedCandidate.education && formattedCandidate.education.length > 0 ? (
                      <div className="space-y-2 sm:space-y-3">
                        {formattedCandidate.education.map((edu, idx) => {
                      const formatDate = (dateString) => {
                        if (!dateString) return null;
                        try {
                          const date = new Date(dateString);
                          return isNaN(date.getTime()) ? null : date.toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          });
                        } catch (e) {
                          return null;
                        }
                      };

                      const startDate = formatDate(edu.start_date);
                      const endDate = formatDate(edu.end_date);
                      const graduationDate = formatDate(edu.graduation_date);

                      return (
                        <div key={idx} className="border border-gray-200 rounded-lg p-2 sm:p-3 bg-gray-50">
                          <div className="mb-2">
                            {edu.degree && (
                              <div className="font-semibold text-[10px] sm:text-xs text-gray-900">
                                {edu.degree}
                                {edu.major && ` - ${edu.major}`}
                              </div>
                            )}
                            {!edu.degree && edu.major && (
                              <div className="font-semibold text-[10px] sm:text-xs text-gray-900">
                                {edu.major}
                              </div>
                            )}
                          </div>

                          {edu.institution && (
                            <div className="mb-1 sm:mb-2">
                              <div className="flex items-start gap-2">
                                <span className="text-[9px] sm:text-[10px] font-medium text-gray-600 min-w-[60px] sm:min-w-[80px]">Institution:</span>
                                <span className="text-[10px] sm:text-xs text-gray-900 flex-1">{edu.institution}</span>
                              </div>
                            </div>
                          )}

                          {edu.location && (
                            <div className="mb-1 sm:mb-2">
                              <div className="flex items-start gap-2">
                                <span className="text-[9px] sm:text-[10px] font-medium text-gray-600 min-w-[60px] sm:min-w-[80px]">Location:</span>
                                <span className="text-[10px] sm:text-xs text-gray-900 flex-1">{edu.location}</span>
                              </div>
                            </div>
                          )}

                          <div className="mb-1 sm:mb-2 space-y-0.5 sm:space-y-1">
                            {startDate && (
                              <div className="flex items-start gap-2">
                                <span className="text-[9px] sm:text-[10px] font-medium text-gray-600 min-w-[60px] sm:min-w-[80px]">Start Date:</span>
                                <span className="text-[10px] sm:text-xs text-gray-900 flex-1">{startDate}</span>
                              </div>
                            )}
                            {endDate && (
                              <div className="flex items-start gap-2">
                                <span className="text-[9px] sm:text-[10px] font-medium text-gray-600 min-w-[60px] sm:min-w-[80px]">End Date:</span>
                                <span className="text-[10px] sm:text-xs text-gray-900 flex-1">{endDate}</span>
                              </div>
                            )}
                            {graduationDate && (
                              <div className="flex items-start gap-2">
                                <span className="text-[9px] sm:text-[10px] font-medium text-gray-600 min-w-[60px] sm:min-w-[80px]">Graduation:</span>
                                <span className="text-[10px] sm:text-xs text-gray-900 flex-1">{graduationDate}</span>
                              </div>
                            )}
                            {edu.graduation_year && !graduationDate && (
                              <div className="flex items-start gap-2">
                                <span className="text-[9px] sm:text-[10px] font-medium text-gray-600 min-w-[60px] sm:min-w-[80px]">Graduation Year:</span>
                                <span className="text-[10px] sm:text-xs text-gray-900 flex-1">{edu.graduation_year}</span>
                              </div>
                            )}
                          </div>

                          {edu.gpa !== null && edu.gpa !== undefined && (
                            <div className="mb-1 sm:mb-2">
                              <div className="flex items-start gap-2">
                                <span className="text-[9px] sm:text-[10px] font-medium text-gray-600 min-w-[60px] sm:min-w-[80px]">GPA:</span>
                                <span className="text-[10px] sm:text-xs text-gray-900 flex-1">
                                  {edu.gpa}
                                  {edu.gpa_scale && ` / ${edu.gpa_scale}`}
                                </span>
                              </div>
                            </div>
                          )}

                          {edu.honors && (
                            <div className="mb-1 sm:mb-2">
                              <div className="flex items-start gap-2">
                                <span className="text-[9px] sm:text-[10px] font-medium text-gray-600 min-w-[60px] sm:min-w-[80px]">Honors:</span>
                                <span className="text-[10px] sm:text-xs text-gray-900 flex-1">{edu.honors}</span>
                              </div>
                            </div>
                          )}

                          {edu.description && (
                            <div className="mb-1 sm:mb-2">
                              <div className="flex items-start gap-2">
                                <span className="text-[9px] sm:text-[10px] font-medium text-gray-600 min-w-[60px] sm:min-w-[80px]">Description:</span>
                                <span className="text-[10px] sm:text-xs text-gray-700 flex-1">{edu.description}</span>
                              </div>
                            </div>
                          )}

                          {edu.field_of_study && (
                            <div className="mb-1 sm:mb-2">
                              <div className="flex items-start gap-2">
                                <span className="text-[9px] sm:text-[10px] font-medium text-gray-600 min-w-[60px] sm:min-w-[80px]">Field:</span>
                                <span className="text-[10px] sm:text-xs text-gray-900 flex-1">{edu.field_of_study}</span>
                              </div>
                            </div>
                          )}

                          {edu.certification && (
                            <div className="mb-1 sm:mb-2">
                              <div className="flex items-start gap-2">
                                <span className="text-[9px] sm:text-[10px] font-medium text-gray-600 min-w-[60px] sm:min-w-[80px]">Certification:</span>
                                <span className="text-[10px] sm:text-xs text-gray-900 flex-1">{edu.certification}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                        })}
                      </div>
                    ) : (
                      <p className="text-[10px] sm:text-xs text-gray-500 italic">No education information available</p>
                    )}
                  </>
                )}
              </div>

              {/* Certifications */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <h2 className="text-sm sm:text-base font-semibold text-gray-900">Certifications</h2>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => handleAddNestedItem('certifications', { name: '', issuer: '', date: '', expiryDate: '' })}
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      + Add Certification
                    </button>
                  )}
                </div>
                {isEditMode ? (
                  <div className="space-y-3">
                    {(editFormData.certifications || []).map((cert, idx) => {
                      const formatDateForInput = (dateString) => {
                        if (!dateString) return '';
                        try {
                          const date = new Date(dateString);
                          if (isNaN(date.getTime())) return '';
                          return date.toISOString().split('T')[0];
                        } catch (e) {
                          return '';
                        }
                      };
                      const certName = typeof cert === 'object' ? (cert.name || cert.title || '') : String(cert || '');
                      const issuer = typeof cert === 'object' ? (cert.issuer || '') : '';
                      const date = typeof cert === 'object' ? (cert.date || cert.issued || cert.issueDate || '') : '';
                      const expiry = typeof cert === 'object' ? (cert.expiryDate || cert.expires || cert.expirationDate || '') : '';
                      return (
                        <div key={idx} className="border border-gray-300 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-700">Certification #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleNestedArrayChange('certifications', 'remove', idx)}
                              className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">Name</label>
                              <input
                                type="text"
                                value={certName}
                                onChange={(e) => handleUpdateNestedField('certifications', idx, 'name', e.target.value)}
                                className="w-full px-2 py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Certification name"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">Issuer</label>
                              <input
                                type="text"
                                value={issuer}
                                onChange={(e) => handleUpdateNestedField('certifications', idx, 'issuer', e.target.value)}
                                className="w-full px-2 py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Issuing organization"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">Issue Date</label>
                              <input
                                type="date"
                                value={formatDateForInput(date)}
                                onChange={(e) => {
                                  const field = cert.date ? 'date' : (cert.issued ? 'issued' : 'issueDate');
                                  handleUpdateNestedField('certifications', idx, field, e.target.value);
                                }}
                                className="w-full px-2 py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">Expiry Date</label>
                              <input
                                type="date"
                                value={formatDateForInput(expiry)}
                                onChange={(e) => {
                                  const field = cert.expiryDate ? 'expiryDate' : (cert.expires ? 'expires' : 'expirationDate');
                                  handleUpdateNestedField('certifications', idx, field, e.target.value);
                                }}
                                className="w-full px-2 py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {(!editFormData.certifications || editFormData.certifications.length === 0) && (
                      <p className="text-[10px] sm:text-xs text-gray-500 italic text-center py-2">No certifications. Click "Add Certification" to add one.</p>
                    )}
                  </div>
                ) : (
                  <>
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
                      <p className="text-[10px] sm:text-xs text-gray-500 italic">No certifications available</p>
                    )}
                  </>
                )}
              </div>
              </div>

            {/* Right Column - Summary */}
            <div className="space-y-3 sm:space-y-4">
              {/* Languages */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Languages</h2>
                {isEditMode ? (
                  <div className="space-y-1.5">
                    <div className="flex gap-1">
                      <input
                        type="text"
                        placeholder="Add language (press Enter)"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const value = e.target.value.trim();
                            if (value) {
                              handleArrayFieldChange('languages_spoken', 'add', value);
                              e.target.value = '';
                            }
                          }
                        }}
                        className={`flex-1 px-2 py-1.5 sm:px-2.5 sm:py-2 text-[10px] sm:text-xs border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${updateErrors.languages_spoken ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                      />
                    </div>
                    {updateErrors.languages_spoken && (
                      <p className="text-[9px] sm:text-[10px] text-red-600">{updateErrors.languages_spoken}</p>
                    )}
                    <div className="flex flex-wrap gap-1 sm:gap-1.5">
                      {(editFormData.languages_spoken || []).map((lang, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium">
                          {getArrayItemDisplay(lang)}
                          <button
                            type="button"
                            onClick={() => handleArrayFieldChange('languages_spoken', 'remove', null, idx)}
                            className="hover:text-red-600 transition-colors"
                          >
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {formattedCandidate.languages_spoken && formattedCandidate.languages_spoken.length > 0 ? (
                      <div className="flex flex-wrap gap-1 sm:gap-1.5">
                        {formattedCandidate.languages_spoken.map((lang, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-800 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium">{getArrayItemDisplay(lang)}</span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10px] sm:text-xs text-gray-500 italic">Not specified</span>
                    )}
                  </>
                )}
              </div>

              {/* Demographics */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Demographics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                  {isEditMode ? (
                    <>
                      <div>
                        <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Ethnicity</label>
                        <input
                          type="text"
                          value={editFormData.ethnicity || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, ethnicity: e.target.value }))}
                          className={`w-full px-2 py-1.5 sm:px-2.5 sm:py-2 text-[10px] sm:text-xs border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${updateErrors.ethnicity ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                          placeholder="Enter ethnicity"
                        />
                        {updateErrors.ethnicity && (
                          <p className="mt-0.5 text-[9px] sm:text-[10px] text-red-600">{updateErrors.ethnicity}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Veteran Status</label>
                        <select
                          value={editFormData.veteran_status !== null && editFormData.veteran_status !== undefined ? (editFormData.veteran_status ? 'yes' : 'no') : ''}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, veteran_status: e.target.value === 'yes' }))}
                          className={`w-full px-2 py-1.5 sm:px-2.5 sm:py-2 text-[10px] sm:text-xs border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white ${updateErrors.veteran_status ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                        {updateErrors.veteran_status && (
                          <p className="mt-0.5 text-[9px] sm:text-[10px] text-red-600">{updateErrors.veteran_status}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Disability Status</label>
                        <select
                          value={editFormData.disability_status !== null && editFormData.disability_status !== undefined ? (editFormData.disability_status ? 'yes' : 'no') : ''}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, disability_status: e.target.value === 'yes' }))}
                          className={`w-full px-2 py-1.5 sm:px-2.5 sm:py-2 text-[10px] sm:text-xs border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white ${updateErrors.disability_status ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                        {updateErrors.disability_status && (
                          <p className="mt-0.5 text-[9px] sm:text-[10px] text-red-600">{updateErrors.disability_status}</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {formattedCandidate.ethnicity && (
                        <div>
                          <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Ethnicity</label>
                          <p className="text-[10px] sm:text-xs text-gray-900">{formattedCandidate.ethnicity}</p>
                        </div>
                      )}
                      {formattedCandidate.veteran_status !== null && formattedCandidate.veteran_status !== undefined && (
                        <div>
                          <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Veteran Status</label>
                          <p className="text-[10px] sm:text-xs text-gray-900">{formattedCandidate.veteran_status ? 'Yes' : 'No'}</p>
                        </div>
                      )}
                      {formattedCandidate.disability_status !== null && formattedCandidate.disability_status !== undefined && (
                        <div>
                          <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-0.5 sm:mb-1">Disability Status</label>
                          <p className="text-[10px] sm:text-xs text-gray-900">{formattedCandidate.disability_status ? 'Yes' : 'No'}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* References */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <h2 className="text-sm sm:text-base font-semibold text-gray-900">References</h2>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => handleAddNestedItem('references', { name: '', position: '', company: '', contact: '', relationship: '' })}
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      + Add Reference
                    </button>
                  )}
                </div>
                {isEditMode ? (
                  <div className="space-y-3">
                    {(editFormData.references || []).map((ref, idx) => (
                      <div key={idx} className="border border-gray-300 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-700">Reference #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleNestedArrayChange('references', 'remove', idx)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">Name</label>
                            <input
                              type="text"
                              value={ref.name || ''}
                              onChange={(e) => handleUpdateNestedField('references', idx, 'name', e.target.value)}
                              className="w-full px-2 py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Reference name"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">Position</label>
                            <input
                              type="text"
                              value={ref.position || ''}
                              onChange={(e) => handleUpdateNestedField('references', idx, 'position', e.target.value)}
                              className="w-full px-2 py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Job position"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">Company</label>
                            <input
                              type="text"
                              value={ref.company || ''}
                              onChange={(e) => handleUpdateNestedField('references', idx, 'company', e.target.value)}
                              className="w-full px-2 py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Company name"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">Contact</label>
                            <input
                              type="text"
                              value={ref.contact || ''}
                              onChange={(e) => handleUpdateNestedField('references', idx, 'contact', e.target.value)}
                              className="w-full px-2 py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Phone/Email"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">Relationship</label>
                            <input
                              type="text"
                              value={ref.relationship || ''}
                              onChange={(e) => handleUpdateNestedField('references', idx, 'relationship', e.target.value)}
                              className="w-full px-2 py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="e.g., Former Manager, Colleague"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!editFormData.references || editFormData.references.length === 0) && (
                      <p className="text-[10px] sm:text-xs text-gray-500 italic text-center py-2">No references. Click "Add Reference" to add one.</p>
                    )}
                  </div>
                ) : (
                  <>
                    {formattedCandidate.references && formattedCandidate.references.length > 0 ? (
                      <div className="space-y-2 sm:space-y-2.5">
                        {formattedCandidate.references.map((ref, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-lg p-2 sm:p-2.5">
                            <div className="font-medium text-[10px] sm:text-xs text-gray-900">
                              {ref.name || 'N/A'}{ref.position ? ` - ${ref.position}` : ''}
                            </div>
                            {ref.company && (
                              <div className="text-[10px] sm:text-xs text-gray-600">{ref.company}</div>
                            )}
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
                      <p className="text-[10px] sm:text-xs text-gray-500 italic">No references available</p>
                    )}
                  </>
                )}
              </div>

              {/* Additional Notes */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Additional Notes</h2>
                {isEditMode ? (
                  <>
                    <textarea
                      value={editFormData.additional_notes || ""}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, additional_notes: e.target.value }))}
                      rows={4}
                      className={`w-full px-2 py-1.5 sm:px-2.5 sm:py-2 text-[10px] sm:text-xs border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none ${updateErrors.additional_notes ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                      placeholder="Enter additional notes about the candidate..."
                    />
                    {updateErrors.additional_notes && (
                      <p className="mt-0.5 text-[9px] sm:text-[10px] text-red-600">{updateErrors.additional_notes}</p>
                    )}
                  </>
                ) : formattedCandidate.additional_notes ? (
                  <p className="text-[10px] sm:text-xs text-gray-700">{formattedCandidate.additional_notes}</p>
                ) : null}
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
                ) : null}
              </div>
            </div>
          </div>
        </div>
  );
};

export default InternalCandidateProfile;

