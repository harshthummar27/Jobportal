import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Building, 
  MapPin, 
  Globe, 
  Phone, 
  Mail, 
  Users, 
  Briefcase, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Upload,
  X
} from "lucide-react";
import Header from "../../Components/Header";

const RecruiterProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    // Company Details
    companyName: "",
    companyWebsite: "",
    companyDescription: "",
    industry: "",
    companySize: "",
    foundedYear: "",
    headquarters: "",
    
    // Contact Information
    primaryContact: "",
    jobTitle: "",
    department: "",
    phone: "",
    email: "",
    linkedinProfile: "",
    
    // Hiring Preferences
    typicalHiringVolume: "",
    averageTimeToHire: "",
    preferredCommunication: "",
    budgetRange: "",
    
    // Additional Info
    specializations: [],
    targetRoles: [],
    notes: ""
  });

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Manufacturing",
    "Retail",
    "Education",
    "Consulting",
    "Real Estate",
    "Media & Entertainment",
    "Government",
    "Non-profit",
    "Other"
  ];

  const communicationMethods = [
    "Email",
    "Phone",
    "LinkedIn",
    "In-person meetings",
    "Video calls"
  ];

  const budgetRanges = [
    "Under $10,000",
    "$10,000 - $25,000",
    "$25,000 - $50,000",
    "$50,000 - $100,000",
    "$100,000 - $250,000",
    "$250,000+"
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'specializations' || name === 'targetRoles') {
        setFormData(prev => ({
          ...prev,
          [name]: checked 
            ? [...prev[name], value]
            : prev[name].filter(item => item !== value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, logo: "File size must be less than 5MB" }));
        return;
      }
      
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target.result);
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, logo: "" }));
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
      if (!formData.industry) newErrors.industry = "Industry is required";
      if (!formData.companySize) newErrors.companySize = "Company size is required";
      if (!formData.headquarters.trim()) newErrors.headquarters = "Headquarters location is required";
      if (!formData.companyDescription.trim()) newErrors.companyDescription = "Company description is required";
    }

    if (step === 2) {
      if (!formData.primaryContact.trim()) newErrors.primaryContact = "Primary contact name is required";
      if (!formData.jobTitle.trim()) newErrors.jobTitle = "Job title is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (step === 3) {
      if (!formData.typicalHiringVolume) newErrors.typicalHiringVolume = "Hiring volume is required";
      if (!formData.budgetRange) newErrors.budgetRange = "Budget range is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      // Scroll to top when changing steps
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    // Scroll to top when changing steps
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, save profile data
      console.log("Profile data:", formData);
      
      // Navigate to contract page
      navigate("/recruiter/contract", { 
        state: { profileData: formData, logoFile }
      });
    } catch (error) {
      console.error("Profile save error:", error);
      setErrors({ submit: "Failed to save profile. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Information</h2>
        <p className="text-gray-600">Tell us about your company</p>
      </div>

      {/* Company Logo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Logo
        </label>
        <div className="flex items-center gap-4">
          {logoPreview ? (
            <div className="relative">
              <img
                src={logoPreview}
                alt="Company logo"
                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={removeLogo}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <Upload className="h-6 w-6 text-gray-400" />
            </div>
          )}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
              id="logo-upload"
            />
            <label
              htmlFor="logo-upload"
              className="cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Upload Logo
            </label>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
          </div>
        </div>
        {errors.logo && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.logo}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name *
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
              errors.companyName ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter company name"
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.companyName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industry *
          </label>
          <select
            name="industry"
            value={formData.industry}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
              errors.industry ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select industry</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
          {errors.industry && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.industry}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Size *
          </label>
          <select
            name="companySize"
            value={formData.companySize}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
              errors.companySize ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select company size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="501-1000">501-1000 employees</option>
            <option value="1000+">1000+ employees</option>
          </select>
          {errors.companySize && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.companySize}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="url"
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="https://company.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Founded Year
          </label>
          <input
            type="number"
            name="foundedYear"
            value={formData.foundedYear}
            onChange={handleInputChange}
            min="1800"
            max={new Date().getFullYear()}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="2020"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Headquarters *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="headquarters"
              value={formData.headquarters}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                errors.headquarters ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="City, State, Country"
            />
          </div>
          {errors.headquarters && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.headquarters}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Description *
          </label>
          <textarea
            name="companyDescription"
            value={formData.companyDescription}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
              errors.companyDescription ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Describe your company, mission, and what makes you unique..."
          />
          {errors.companyDescription && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.companyDescription}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
        <p className="text-gray-600">Your primary contact details</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Contact Name *
          </label>
          <input
            type="text"
            name="primaryContact"
            value={formData.primaryContact}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
              errors.primaryContact ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Your full name"
          />
          {errors.primaryContact && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.primaryContact}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title *
          </label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
              errors.jobTitle ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="e.g., HR Manager, Talent Acquisition"
          />
          {errors.jobTitle && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.jobTitle}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="e.g., Human Resources, Engineering"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="your.email@company.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.email}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn Profile
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="url"
              name="linkedinProfile"
              value={formData.linkedinProfile}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Hiring Preferences</h2>
        <p className="text-gray-600">Help us understand your hiring needs</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Typical Hiring Volume *
          </label>
          <select
            name="typicalHiringVolume"
            value={formData.typicalHiringVolume}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
              errors.typicalHiringVolume ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select hiring volume</option>
            <option value="1-5">1-5 hires per month</option>
            <option value="6-15">6-15 hires per month</option>
            <option value="16-30">16-30 hires per month</option>
            <option value="31-50">31-50 hires per month</option>
            <option value="50+">50+ hires per month</option>
          </select>
          {errors.typicalHiringVolume && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.typicalHiringVolume}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Average Time to Hire
          </label>
          <select
            name="averageTimeToHire"
            value={formData.averageTimeToHire}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="">Select time to hire</option>
            <option value="1-2 weeks">1-2 weeks</option>
            <option value="2-4 weeks">2-4 weeks</option>
            <option value="1-2 months">1-2 months</option>
            <option value="2-3 months">2-3 months</option>
            <option value="3+ months">3+ months</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget Range *
          </label>
          <select
            name="budgetRange"
            value={formData.budgetRange}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
              errors.budgetRange ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select budget range</option>
            {budgetRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
          {errors.budgetRange && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.budgetRange}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Communication
          </label>
          <select
            name="preferredCommunication"
            value={formData.preferredCommunication}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="">Select communication method</option>
            {communicationMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Roles (Select all that apply)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              "Software Engineer", "Product Manager", "Data Scientist", "Designer",
              "Marketing Manager", "Sales Representative", "Operations Manager", "Finance Analyst",
              "HR Specialist", "Customer Success", "DevOps Engineer", "Business Analyst"
            ].map((role) => (
              <label key={role} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  name="targetRoles"
                  value={role}
                  checked={formData.targetRoles.includes(role)}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{role}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="Any additional information about your hiring needs, company culture, or specific requirements..."
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header />
      
      <div className="pt-8 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-2">
              <Building className="h-7 w-7 text-white" />
            </div>
            <h4 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Complete Your Profile
            </h4>
            <p className="text-sm text-gray-600">
              Set up your recruiter profile to get started
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of 3</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / 3) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-10">
              <form onSubmit={handleSubmit}>
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}

                {/* Submit Error */}
                {errors.submit && (
                  <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {errors.submit}
                    </p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </button>

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
                    >
                      Next
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Complete Profile
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <Link
              to="/recruiter/verification"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Email Verification
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfile;
