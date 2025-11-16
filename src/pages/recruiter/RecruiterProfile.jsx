import React, { useEffect, useState } from "react";
import RecruiterLayout from "../../Components/RecruiterLayout";
import { Loader2, Edit, Save, X } from "lucide-react";
import { toast } from 'react-toastify';

const Field = ({ label, value, isEditMode, editValue, onChange, type = "text" }) => (
  <div className="flex flex-col">
    <span className="text-[10px] sm:text-xs text-gray-500">{label}</span>
    {isEditMode ? (
      <input
        type={type}
        value={editValue ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="mt-0.5 px-2 py-1 text-[10px] sm:text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
        placeholder={label}
      />
    ) : (
      <span className="text-[10px] sm:text-xs font-semibold text-gray-900 break-all">{value ?? '—'}</span>
    )}
  </div>
);

const BoolBadge = ({ value, trueText = 'Yes', falseText = 'No' }) => (
  <span className={`inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-0.5 text-[10px] sm:text-xs font-medium rounded-full border ${value ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
    {value ? trueText : falseText}
  </span>
);

const formatDateTime = (dateString) => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    return dateString;
  }
};

const RecruiterProfile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(`${baseURL}/api/recruiter/profile`, {
          method: 'GET',
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Accept': 'application/json',
          },
        });
        if (!res.ok) throw new Error(`Failed to load profile (${res.status})`);
        const json = await res.json();
        setData(json);
        
        if (json.recruiter_profile) {
          localStorage.setItem('recruiterProfileData', JSON.stringify(json.recruiter_profile));
          window.dispatchEvent(new CustomEvent('recruiterProfileUpdated'));
        }
      } catch (e) {
        setError(e?.message || 'Unable to fetch recruiter profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const profile = data?.recruiter_profile;
  const verification = data?.verification_status;

  const initializeEditForm = () => {
    if (profile) {
      setEditFormData({
        company_name: profile.company_name || "",
        contact_person_name: profile.contact_person_name || "",
        contact_phone: profile.contact_phone || "",
        company_website: profile.company_website || "",
        company_size: profile.company_size || "",
        industry: profile.industry || "",
        city: profile.city || "",
        state: profile.state || "",
        country: profile.country || "",
        postal_code: profile.postal_code || "",
        office_address: profile.office_address || "",
        company_description: profile.company_description || "",
        contact_person_title: profile.contact_person_title || ""
      });
    }
  };

  const handleEditToggle = () => {
    if (!isEditMode) {
      initializeEditForm();
    }
    setIsEditMode(!isEditMode);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditFormData({});
  };

  const handleEditInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateProfileData = async (updatedData) => {
    try {
      setIsUpdating(true);
      setError(null);

      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const apiEndpoint = `${baseURL}/api/recruiter/profile`;

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(updatedData),
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
        const newErrors = {};
        
        if (data.errors && typeof data.errors === 'object') {
          Object.keys(data.errors).forEach(field => {
            const fieldErrors = data.errors[field];
            if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
              newErrors[field] = fieldErrors[0];
            } else if (typeof fieldErrors === 'string') {
              newErrors[field] = fieldErrors;
            } else if (fieldErrors) {
              newErrors[field] = String(fieldErrors);
            }
          });
        }
        
        const errorMessage = data.message || data.error || 'Profile update failed';
        
        if (errorMessage.toLowerCase().includes("token") || 
            errorMessage.toLowerCase().includes("unauthorized") || 
            response.status === 401) {
          toast.error("Session expired. Please log in again.");
          setIsUpdating(false);
          return { success: false, errors: newErrors };
        }
        
        toast.error(errorMessage);
        setIsUpdating(false);
        return { success: false, errors: newErrors };
      }

      const updatedProfile = data.recruiter_profile || data.data || data;
      setData(prev => ({ ...prev, recruiter_profile: updatedProfile }));
      
      localStorage.setItem('recruiterProfileData', JSON.stringify(updatedProfile));
      window.dispatchEvent(new CustomEvent('recruiterProfileUpdated'));

      toast.success("Profile updated successfully!");
      setIsUpdating(false);
      return { success: true, data: updatedProfile };

    } catch (error) {
      console.error("Profile update error:", error);
      
      if (error.message) {
        if (error.message.includes('JSON') || error.message.includes('Failed to fetch')) {
          toast.error("Network error. Please check your connection and try again.");
        } else {
          toast.error(error.message || "Failed to update profile. Please try again.");
        }
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
      
      setIsUpdating(false);
      return { success: false, errors: {} };
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updateData = {
        company_name: editFormData.company_name || "",
        contact_person_name: editFormData.contact_person_name || "",
        contact_phone: editFormData.contact_phone || "",
        company_website: editFormData.company_website || "",
        company_size: editFormData.company_size || "",
        industry: editFormData.industry || "",
        city: editFormData.city || "",
        state: editFormData.state || "",
        country: editFormData.country || "",
        postal_code: editFormData.postal_code || "",
        office_address: editFormData.office_address || "",
        company_description: editFormData.company_description || "",
        contact_person_title: editFormData.contact_person_title || ""
      };

      const result = await updateProfileData(updateData);
      if (result.success) {
        setIsEditMode(false);
        setEditFormData({});
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    }
  };

  return (
    <RecruiterLayout>
      <div className="w-full max-w-none">
        <div className="mx-auto">
          <div className="mb-3">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 hidden sm:block">View your company, contact and verification details</p>
              </div>
              <div className="flex items-center gap-2">
                {!isEditMode ? (
                  <button
                    onClick={handleEditToggle}
                    className="p-1.5 sm:p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 flex-shrink-0"
                    title="Edit Profile"
                  >
                    <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isUpdating}
                      className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 text-[10px] sm:text-xs font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Save Changes"
                    >
                      <Save className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className="hidden sm:inline">Save</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isUpdating}
                      className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 text-[10px] sm:text-xs font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Cancel"
                    >
                      <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className="hidden sm:inline">Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {loading && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-gray-400 mx-auto mb-2 sm:mb-3" />
              <p className="text-xs sm:text-sm text-gray-600 font-medium">Loading profile...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 rounded-lg border border-red-200 p-3 sm:p-4 mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {!loading && !error && profile && (
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                  <Field 
                    label="Company" 
                    value={profile.company_name} 
                    isEditMode={isEditMode}
                    editValue={editFormData.company_name}
                    onChange={(value) => handleEditInputChange('company_name', value)}
                  />
                  <Field 
                    label="Contact Person" 
                    value={profile.contact_person_name} 
                    isEditMode={isEditMode}
                    editValue={editFormData.contact_person_name}
                    onChange={(value) => handleEditInputChange('contact_person_name', value)}
                  />
                  <Field 
                    label="Email" 
                    value={profile.contact_email} 
                  />
                  <Field 
                    label="Phone" 
                    value={profile.contact_phone} 
                    isEditMode={isEditMode}
                    editValue={editFormData.contact_phone}
                    onChange={(value) => handleEditInputChange('contact_phone', value)}
                    type="tel"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3">
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 space-y-2 sm:space-y-3">
                  <h2 className="text-xs sm:text-sm font-semibold text-gray-800">Company Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <Field 
                      label="Company Website" 
                      value={profile.company_website} 
                      isEditMode={isEditMode}
                      editValue={editFormData.company_website}
                      onChange={(value) => handleEditInputChange('company_website', value)}
                      type="url"
                    />
                    <Field 
                      label="Company Size" 
                      value={profile.company_size} 
                      isEditMode={isEditMode}
                      editValue={editFormData.company_size}
                      onChange={(value) => handleEditInputChange('company_size', value)}
                    />
                    <Field 
                      label="Industry" 
                      value={profile.industry} 
                      isEditMode={isEditMode}
                      editValue={editFormData.industry}
                      onChange={(value) => handleEditInputChange('industry', value)}
                    />
                    <Field 
                      label="City" 
                      value={profile.city} 
                      isEditMode={isEditMode}
                      editValue={editFormData.city}
                      onChange={(value) => handleEditInputChange('city', value)}
                    />
                    <Field 
                      label="State" 
                      value={profile.state} 
                      isEditMode={isEditMode}
                      editValue={editFormData.state}
                      onChange={(value) => handleEditInputChange('state', value)}
                    />
                    <Field 
                      label="Country" 
                      value={profile.country} 
                      isEditMode={isEditMode}
                      editValue={editFormData.country}
                      onChange={(value) => handleEditInputChange('country', value)}
                    />
                    <Field 
                      label="Postal Code" 
                      value={profile.postal_code} 
                      isEditMode={isEditMode}
                      editValue={editFormData.postal_code}
                      onChange={(value) => handleEditInputChange('postal_code', value)}
                    />
                  </div>
                  <div>
                    <Field 
                      label="Office Address" 
                      value={profile.office_address} 
                      isEditMode={isEditMode}
                      editValue={editFormData.office_address}
                      onChange={(value) => handleEditInputChange('office_address', value)}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-xs text-gray-500">Company Description</span>
                    {isEditMode ? (
                      <textarea
                        value={editFormData.company_description || ""}
                        onChange={(e) => handleEditInputChange('company_description', e.target.value)}
                        className="w-full mt-0.5 px-2 py-1 text-[10px] sm:text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        rows="3"
                        placeholder="Company Description"
                      />
                    ) : (
                      <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-gray-800 whitespace-pre-wrap">{profile.company_description ?? '—'}</p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 space-y-2 sm:space-y-3">
                  <h2 className="text-xs sm:text-sm font-semibold text-gray-800">Verification</h2>
                  <div className="grid grid-cols-1 gap-2 sm:gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-xs text-gray-500">Email Verified</span>
                      <BoolBadge value={Boolean(verification?.email_verified)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-xs text-gray-500">Agreement Accepted</span>
                      <BoolBadge value={Boolean(verification?.agreement_accepted)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-xs text-gray-500">Fully Verified</span>
                      <BoolBadge value={Boolean(verification?.fully_verified)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-xs text-gray-500">Can Access Candidates</span>
                      <BoolBadge value={Boolean(verification?.can_access_candidates)} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 space-y-2 sm:space-y-3">
                <h2 className="text-xs sm:text-sm font-semibold text-gray-800">Agreement Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                  <div>
                    <span className="text-[10px] sm:text-xs text-gray-500">Agreement Accepted</span>
                    <div className="mt-0.5 sm:mt-1"><BoolBadge value={Boolean(profile.agreement_accepted)} /></div>
                  </div>
                  <Field label="Agreement Version" value={profile.agreement_version} />
                  <Field label="Agreement Accepted At" value={formatDateTime(profile.agreement_accepted_at)} />
                  <Field label="Email Verified At" value={formatDateTime(profile.email_verified_at)} />
                </div>
                <div>
                  <span className="text-[10px] sm:text-xs text-gray-500">Agreement Terms</span>
                  <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-gray-800 whitespace-pre-wrap">{profile.agreement_terms ?? '—'}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 space-y-2 sm:space-y-3">
                <h2 className="text-xs sm:text-sm font-semibold text-gray-800">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <Field 
                    label="Contact Person" 
                    value={profile.contact_person_name} 
                    isEditMode={isEditMode}
                    editValue={editFormData.contact_person_name}
                    onChange={(value) => handleEditInputChange('contact_person_name', value)}
                  />
                  <Field 
                    label="Title" 
                    value={profile.contact_person_title} 
                    isEditMode={isEditMode}
                    editValue={editFormData.contact_person_title}
                    onChange={(value) => handleEditInputChange('contact_person_title', value)}
                  />
                  <Field 
                    label="Email" 
                    value={profile.contact_email} 
                  />
                  <Field 
                    label="Phone" 
                    value={profile.contact_phone} 
                    isEditMode={isEditMode}
                    editValue={editFormData.contact_phone}
                    onChange={(value) => handleEditInputChange('contact_phone', value)}
                    type="tel"
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 space-y-2 sm:space-y-2.5">
                <h2 className="text-xs sm:text-sm font-semibold text-gray-800">Account Status</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs text-gray-500">Email Verified (Profile)</span>
                    <BoolBadge value={Boolean(profile.email_verified)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs text-gray-500">Active</span>
                    <BoolBadge value={Boolean(profile.is_active)} />
                  </div>
                  <Field label="Created At" value={formatDateTime(profile.created_at)} />
                  <Field label="Updated At" value={formatDateTime(profile.updated_at)} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterProfile;


