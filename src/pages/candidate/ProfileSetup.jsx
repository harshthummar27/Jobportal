import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileSetup = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    state: "",
    willingToRelocate: false,
    hideCurrentCompany: false,
    currentCompany: "",
    yearsExperience: "",
    desiredRole: "",
    skills: [],
    visaStatus: "",
    desiredSalary: "",
    joiningAvailability: "",
    openToContractRoles: false,
    willingToJoinStartup: false,
    needsSponsorship: false,
    highestDegree: "",
    certifications: "",
  });

  const [currentSkill, setCurrentSkill] = useState("");

  const handleAddSkill = () => {
    if (currentSkill && !formData.skills.includes(currentSkill)) {
      setFormData({ ...formData, skills: [...formData.skills, currentSkill] });
      setCurrentSkill("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });
  };

  const handleNext = () => step < totalSteps && setStep(step + 1);
  const handleBack = () => step > 1 && setStep(step - 1);

  const handleSubmit = () => {
    localStorage.setItem("candidateProfile", JSON.stringify(formData));
    navigate("/signup-success?role=candidate");
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Complete Your Profile</h1>
        <p className="text-gray-500 mb-4">
          Step {step} of {totalSteps}
        </p>
        <div className="w-full bg-gray-200 h-2 rounded">
          <div className="bg-blue-500 h-2 rounded" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Card */}
        <div className="bg-white shadow rounded mt-6 p-6 space-y-6">
          {/* Step Title */}
          <h2 className="text-xl font-semibold text-gray-800">
            {step === 1 && "Basic Information"}
            {step === 2 && "Location & Preferences"}
            {step === 3 && "Experience & Skills"}
            {step === 4 && "Additional Details"}
          </h2>
          <p className="text-gray-500">
            {step === 1 && "Let's start with your basic details"}
            {step === 2 && "Where are you located and where would you like to work?"}
            {step === 3 && "Tell us about your professional background"}
            {step === 4 && "Final details to complete your profile"}
          </p>

          {/* Step Content */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-black font-medium">Full Name *</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="mt-1 block w-full text-gray-800 border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-black font-medium">Phone Number *</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full border text-gray-800 border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-black font-medium">City *</label>
                  <input
                    type="text"
                    placeholder="New York"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="mt-1 block w-full border text-gray-700 border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-black font-medium">State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="mt-1 block w-full text-gray-700 border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Select state</option>
                    <option value="ny">New York</option>
                    <option value="ca">California</option>
                    <option value="tx">Texas</option>
                    <option value="fl">Florida</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.willingToRelocate}
                  onChange={(e) => setFormData({ ...formData, willingToRelocate: e.target.checked })}
                  className="h-4 w-4"
                />
                <label className="text-gray-700">I'm willing to relocate</label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-black font-medium">Desired Job Role *</label>
                <input
                  type="text"
                  placeholder="Software Engineer"
                  value={formData.desiredRole}
                  onChange={(e) => setFormData({ ...formData, desiredRole: e.target.value })}
                  className="mt-1 block w-full text-gray-700 border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-black font-medium">Skills</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    placeholder="Add skill"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                    className="border border-gray-300 text-gray-700 rounded px-3 py-2 flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      onClick={() => handleRemoveSkill(skill)}
                      className="bg-gray-200 text-gray-700 px-2 py-1 rounded cursor-pointer"
                    >
                      {skill} ×
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-black font-medium">Visa Status *</label>
                <select
                  value={formData.visaStatus}
                  onChange={(e) => setFormData({ ...formData, visaStatus: e.target.value })}
                  className="mt-1 block text-gray-700 w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Select visa status</option>
                  <option value="citizen">US Citizen</option>
                  <option value="permanent">Permanent Resident</option>
                  <option value="h1b">H1-B</option>
                  <option value="opt">OPT/CPT</option>
                </select>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="px-4 py-2 text-white rounded disabled:opacity-50"
            >
              Back
            </button>
            {step < totalSteps ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Complete Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
