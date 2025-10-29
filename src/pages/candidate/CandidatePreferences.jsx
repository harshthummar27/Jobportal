import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Settings, 
  Bell, 
  Shield, 
  Eye, 
  EyeOff, 
  Building, 
  MapPin, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Save,
  X,
  Plus,
  Users,
  FileText,
  Globe
} from "lucide-react";
import Header from "../../Components/Header";

const CandidatePreferences = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const [preferences, setPreferences] = useState({
    // Job Search Settings
    jobSeekingStatus: "Actively looking",
    desiredJobRoles: [],
    preferredIndustries: [],
    employmentTypes: [],
    desiredSalary: "",
    salaryNegotiable: true,
    
    // Location Preferences
    currentLocation: "",
    willingToRelocate: false,
    preferredLocations: [],
    remoteWorkPreference: "Hybrid",
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    jobAlerts: true,
    companyUpdates: true,
    weeklyDigest: true,
    
    // Privacy Settings
    profileVisibility: "Visible to recruiters",
    hideCurrentEmployer: true,
    hideContactInfo: true,
    allowDirectContact: false,
    
    // Company Blacklist
    blockedCompanies: [],
    
    // Availability
    availabilityStatus: "Available",
    noticePeriod: "2 weeks",
    startDate: "",
    
    // Additional Preferences
    companySize: [],
    workEnvironment: [],
    benefits: [],
    additionalNotes: ""
  });

  const [currentBlockedCompany, setCurrentBlockedCompany] = useState("");
  const [currentPreferredLocation, setCurrentPreferredLocation] = useState("");

  const jobSeekingStatuses = [
    "Actively looking",
    "Open to better offers", 
    "Not actively looking",
    "Not available"
  ];

  const employmentTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Freelance"
  ];

  const remoteWorkOptions = [
    "Remote only",
    "Hybrid",
    "On-site only",
    "Flexible"
  ];

  const availabilityStatuses = [
    "Available immediately",
    "Available in 2 weeks",
    "Available in 1 month",
    "Available in 2+ months",
    "Not available"
  ];

  const noticePeriods = [
    "Immediate",
    "1 week",
    "2 weeks",
    "1 month",
    "2 months",
    "3+ months"
  ];

  const companySizes = [
    "Startup (1-50)",
    "Small (51-200)",
    "Medium (201-1000)",
    "Large (1000+)",
    "Enterprise (5000+)"
  ];

  const workEnvironments = [
    "Fast-paced",
    "Collaborative",
    "Independent",
    "Creative",
    "Structured",
    "Flexible"
  ];

  const benefits = [
    "Health Insurance",
    "Dental Insurance",
    "Vision Insurance",
    "401(k) Matching",
    "Stock Options",
    "Flexible PTO",
    "Remote Work",
    "Professional Development",
    "Gym Membership",
    "Commuter Benefits"
  ];

  useEffect(() => {
    // Load existing preferences from localStorage or API
    const savedPreferences = localStorage.getItem('candidatePreferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'employmentTypes' || name === 'preferredIndustries' || name === 'desiredJobRoles' || 
          name === 'companySize' || name === 'workEnvironment' || name === 'benefits') {
        setPreferences(prev => ({
          ...prev,
          [name]: checked 
            ? [...prev[name], value]
            : prev[name].filter(item => item !== value)
        }));
      } else {
        setPreferences(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      setPreferences(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear errors when user makes changes
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const addBlockedCompany = () => {
    if (currentBlockedCompany && !preferences.blockedCompanies.includes(currentBlockedCompany)) {
      setPreferences(prev => ({
        ...prev,
        blockedCompanies: [...prev.blockedCompanies, currentBlockedCompany]
      }));
      setCurrentBlockedCompany("");
    }
  };

  const removeBlockedCompany = (company) => {
    setPreferences(prev => ({
      ...prev,
      blockedCompanies: prev.blockedCompanies.filter(c => c !== company)
    }));
  };

  const addPreferredLocation = () => {
    if (currentPreferredLocation && !preferences.preferredLocations.includes(currentPreferredLocation)) {
      setPreferences(prev => ({
        ...prev,
        preferredLocations: [...prev.preferredLocations, currentPreferredLocation]
      }));
      setCurrentPreferredLocation("");
    }
  };

  const removePreferredLocation = (location) => {
    setPreferences(prev => ({
      ...prev,
      preferredLocations: prev.preferredLocations.filter(l => l !== location)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save to localStorage (in real app, save to backend)
      localStorage.setItem('candidatePreferences', JSON.stringify(preferences));
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Save error:", error);
      setErrors({ submit: "Failed to save preferences. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Job Preferences</h1>
          <p className="text-gray-600">Manage your job search settings and preferences</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Job Search Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Settings className="h-5 w-5 text-indigo-600" />
              Job Search Settings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Seeking Status
                </label>
                <select
                  name="jobSeekingStatus"
                  value={preferences.jobSeekingStatus}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {jobSeekingStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desired Salary (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="desiredSalary"
                    value={preferences.desiredSalary}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="80000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Types
                </label>
                <div className="space-y-2">
                  {employmentTypes.map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="employmentTypes"
                        value={type}
                        checked={preferences.employmentTypes.includes(type)}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remote Work Preference
                </label>
                <select
                  name="remoteWorkPreference"
                  value={preferences.remoteWorkPreference}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {remoteWorkOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="salaryNegotiable"
                  checked={preferences.salaryNegotiable}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Salary is negotiable</span>
              </label>
            </div>
          </div>

          {/* Location Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-indigo-600" />
              Location Preferences
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Location
                </label>
                <input
                  type="text"
                  name="currentLocation"
                  value={preferences.currentLocation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="City, State"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Locations
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentPreferredLocation}
                    onChange={(e) => setCurrentPreferredLocation(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPreferredLocation())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Add preferred location"
                  />
                  <button
                    type="button"
                    onClick={addPreferredLocation}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {preferences.preferredLocations.map((location) => (
                    <span
                      key={location}
                      className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                    >
                      {location}
                      <button
                        type="button"
                        onClick={() => removePreferredLocation(location)}
                        className="hover:text-indigo-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="willingToRelocate"
                  checked={preferences.willingToRelocate}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">I'm willing to relocate</span>
              </label>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Bell className="h-5 w-5 text-indigo-600" />
              Notification Settings
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive job alerts and updates via email</p>
                </div>
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={preferences.emailNotifications}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">SMS Notifications</h3>
                  <p className="text-sm text-gray-500">Receive urgent updates via text message</p>
                </div>
                <input
                  type="checkbox"
                  name="smsNotifications"
                  checked={preferences.smsNotifications}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Job Alerts</h3>
                  <p className="text-sm text-gray-500">Get notified about new job matches</p>
                </div>
                <input
                  type="checkbox"
                  name="jobAlerts"
                  checked={preferences.jobAlerts}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Company Updates</h3>
                  <p className="text-sm text-gray-500">Receive updates from companies you're interested in</p>
                </div>
                <input
                  type="checkbox"
                  name="companyUpdates"
                  checked={preferences.companyUpdates}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Weekly Digest</h3>
                  <p className="text-sm text-gray-500">Get a weekly summary of job opportunities</p>
                </div>
                <input
                  type="checkbox"
                  name="weeklyDigest"
                  checked={preferences.weeklyDigest}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-600" />
              Privacy Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Visibility
                </label>
                <select
                  name="profileVisibility"
                  value={preferences.profileVisibility}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Visible to recruiters">Visible to recruiters</option>
                  <option value="Hidden from recruiters">Hidden from recruiters</option>
                  <option value="Visible to selected companies">Visible to selected companies</option>
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Hide Current Employer</h3>
                    <p className="text-sm text-gray-500">Keep your current company confidential</p>
                  </div>
                  <input
                    type="checkbox"
                    name="hideCurrentEmployer"
                    checked={preferences.hideCurrentEmployer}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Hide Contact Information</h3>
                    <p className="text-sm text-gray-500">Keep your email and phone private</p>
                  </div>
                  <input
                    type="checkbox"
                    name="hideContactInfo"
                    checked={preferences.hideContactInfo}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Allow Direct Contact</h3>
                    <p className="text-sm text-gray-500">Let recruiters contact you directly</p>
                  </div>
                  <input
                    type="checkbox"
                    name="allowDirectContact"
                    checked={preferences.allowDirectContact}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Company Blacklist */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Building className="h-5 w-5 text-indigo-600" />
              Company Blacklist
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blocked Companies
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Add companies that should not be able to view your profile
              </p>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={currentBlockedCompany}
                  onChange={(e) => setCurrentBlockedCompany(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBlockedCompany())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Company name"
                />
                <button
                  type="button"
                  onClick={addBlockedCompany}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {preferences.blockedCompanies.map((company) => (
                  <span
                    key={company}
                    className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                  >
                    {company}
                    <button
                      type="button"
                      onClick={() => removeBlockedCompany(company)}
                      className="hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-600" />
              Availability
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability Status
                </label>
                <select
                  name="availabilityStatus"
                  value={preferences.availabilityStatus}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {availabilityStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notice Period
                </label>
                <select
                  name="noticePeriod"
                  value={preferences.noticePeriod}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {noticePeriods.map((period) => (
                    <option key={period} value={period}>
                      {period}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Additional Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              Additional Preferences
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Company Size
                </label>
                <div className="space-y-2">
                  {companySizes.map((size) => (
                    <label key={size} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="companySize"
                        value={size}
                        checked={preferences.companySize.includes(size)}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Environment
                </label>
                <div className="space-y-2">
                  {workEnvironments.map((env) => (
                    <label key={env} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="workEnvironment"
                        value={env}
                        checked={preferences.workEnvironment.includes(env)}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{env}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Important Benefits
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {benefits.map((benefit) => (
                  <label key={benefit} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="benefits"
                      value={benefit}
                      checked={preferences.benefits.includes(benefit)}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                name="additionalNotes"
                value={preferences.additionalNotes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Any additional preferences or requirements..."
              />
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {errors.submit}
              </p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-600 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Preferences saved successfully!
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Preferences
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidatePreferences;
