import React, { useEffect, useState } from "react";
import RecruiterLayout from "../../Components/RecruiterLayout";
import { Loader2 } from "lucide-react";

const Field = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="text-sm font-medium text-gray-900 break-all">{value ?? '—'}</span>
  </div>
);

const BoolBadge = ({ value, trueText = 'Yes', falseText = 'No' }) => (
  <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${value ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
    {value ? trueText : falseText}
  </span>
);

const RecruiterProfile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <RecruiterLayout>
      <div className="w-full max-w-none">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-4">
          <div className="mb-4">
            <h1 className="text-lg font-semibold text-gray-900">My Profile</h1>
            <p className="text-sm text-gray-600">View your company, contact and verification details</p>
          </div>

          {loading && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto" />
              <p className="text-sm text-gray-600 mt-2">Loading profile...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 rounded border border-red-200 p-4 text-sm text-red-700">{error}</div>
          )}

          {!loading && !error && profile && (
            <div className="space-y-6">
              {/* Overview */}
              <div className="bg-white rounded border border-gray-200 p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Field label="Company" value={profile.company_name} />
                  <Field label="Contact Person" value={profile.contact_person_name} />
                  <Field label="Email" value={profile.contact_email} />
                  <Field label="Phone" value={profile.contact_phone} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Company Information */}
                <div className="lg:col-span-2 bg-white rounded border border-gray-200 p-4 space-y-4">
                  <h2 className="text-sm font-semibold text-gray-800">Company Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Company Website" value={profile.company_website} />
                    <Field label="Company Size" value={profile.company_size} />
                    <Field label="Industry" value={profile.industry} />
                    <Field label="City" value={profile.city} />
                    <Field label="State" value={profile.state} />
                    <Field label="Country" value={profile.country} />
                    <Field label="Postal Code" value={profile.postal_code} />
                  </div>
                  <div>
                    <Field label="Office Address" value={profile.office_address} />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Company Description</span>
                    <p className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{profile.company_description ?? '—'}</p>
                  </div>
                </div>

                {/* Verification (from verification_status) */}
                <div className="bg-white rounded border border-gray-200 p-4 space-y-4">
                  <h2 className="text-sm font-semibold text-gray-800">Verification</h2>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Email Verified</span>
                      <BoolBadge value={Boolean(verification?.email_verified)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Agreement Accepted</span>
                      <BoolBadge value={Boolean(verification?.agreement_accepted)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Fully Verified</span>
                      <BoolBadge value={Boolean(verification?.fully_verified)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Can Access Candidates</span>
                      <BoolBadge value={Boolean(verification?.can_access_candidates)} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Agreement Details */}
              <div className="bg-white rounded border border-gray-200 p-4 space-y-4">
                <h2 className="text-sm font-semibold text-gray-800">Agreement Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <span className="text-xs text-gray-500">Agreement Accepted</span>
                    <div className="mt-1"><BoolBadge value={Boolean(profile.agreement_accepted)} /></div>
                  </div>
                  <Field label="Agreement Version" value={profile.agreement_version} />
                  <Field label="Agreement Accepted At" value={profile.agreement_accepted_at} />
                  <Field label="Email Verified At" value={profile.email_verified_at} />
                </div>
                <div>
                  <span className="text-xs text-gray-500">Agreement Terms</span>
                  <p className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{profile.agreement_terms ?? '—'}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded border border-gray-200 p-4 space-y-4">
                <h2 className="text-sm font-semibold text-gray-800">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Contact Person" value={profile.contact_person_name} />
                  <Field label="Title" value={profile.contact_person_title} />
                  <Field label="Email" value={profile.contact_email} />
                  <Field label="Phone" value={profile.contact_phone} />
                </div>
              </div>

              {/* Account Status and Meta */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded border border-gray-200 p-4 space-y-3">
                  <h2 className="text-sm font-semibold text-gray-800">Account Status</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Email Verified (Profile)</span>
                      <BoolBadge value={Boolean(profile.email_verified)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Active</span>
                      <BoolBadge value={Boolean(profile.is_active)} />
                    </div>
                    <Field label="Created At" value={profile.created_at} />
                    <Field label="Updated At" value={profile.updated_at} />
                  </div>
                </div>

                <div className="bg-white rounded border border-gray-200 p-4 space-y-3">
                  <h2 className="text-sm font-semibold text-gray-800">System & Meta</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Profile ID" value={profile.id} />
                    <Field label="User ID" value={profile.user_id} />
                    <Field label="Verification Token" value={profile.verification_token ?? '—'} />
                    <Field label="Preferences" value={typeof profile.preferences === 'object' ? JSON.stringify(profile.preferences) : (profile.preferences ?? '—')} />
                  </div>
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


