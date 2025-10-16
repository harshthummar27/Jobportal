import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  User, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Upload,
  X,
  Plus,
  Globe,
  Phone,
  Mail,
  Award,
  Shield,
  DollarSign,
  Calendar,
  Languages,
  Users
} from "lucide-react";
import Header from "../../Components/Header";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [resumeFile, setResumeFile] = useState(null);
  const [resumePreview, setResumePreview] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    // Basic Information (Hidden from recruiters)
    fullName: "",
    contactEmail: "",
    phone: "",
    
    // Current Location
    city: "",
    state: "",
    country: "",
    willingToRelocate: false,
    preferredLocations: [],
    
    // Job Preferences
    desiredJobRoles: [],
    preferredIndustries: [],
    employmentTypes: [],
    
    // Work Experience
    totalYearsExperience: "",
    currentEmployer: "",
    hideCurrentEmployer: true,
    jobHistory: [],
    
    // Skills
    skills: [],
    
    // Education
    education: [],
    
    // Certifications
    certifications: [],
    
    // Resume
    resumeUploaded: false,
    
    // Visa Status
    visaStatus: "",
    
    // Relocation
    relocationWillingness: "",
    
    // Job Seeking Status
    jobSeekingStatus: "",
    
    // Salary
    desiredAnnualPackage: "",
    
    // Availability
    availabilityToJoin: "",
    
    // Languages
    languagesSpoken: [],
    
    // Optional Information
    ethnicity: "",
    veteranStatus: false,
    disabilityStatus: false,
    
    // References
    references: [],
    
    // Company Blacklist
    blockedCompanies: [],
    
    // Additional Notes
    additionalNotes: ""
  });

  const [currentJob, setCurrentJob] = useState({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    current: false,
    description: ""
  });

  const [currentEducation, setCurrentEducation] = useState({
    degree: "",
    institution: "",
    major: "",
    graduationYear: "",
    gpa: ""
  });

  const [currentCertification, setCurrentCertification] = useState({
    name: "",
    issuer: "",
    date: "",
    expiryDate: ""
  });

  const [currentReference, setCurrentReference] = useState({
    name: "",
    position: "",
    company: "",
    email: "",
    phone: ""
  });

  const [currentSkill, setCurrentSkill] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState("");
  const [currentPreferredLocation, setCurrentPreferredLocation] = useState("");

  const employmentTypes = [
    "Full-time",
    "Part-time", 
    "Contract",
    "Internship",
    "Freelance"
  ];

  const visaStatuses = [
    "US Citizen",
    "Permanent Resident",
    "H1-B",
    "OPT/CPT",
    "Other"
  ];

  const jobSeekingStatuses = [
    "Actively looking",
    "Open to better offers",
    "Not actively looking"
  ];

  const relocationOptions = [
    "By self",
    "If employer covers relocation costs",
    "Not willing to relocate"
  ];

  const availabilityOptions = [
    "Immediately",
    "2 weeks notice",
    "1 month notice",
    "2 months notice",
    "3+ months notice"
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'employmentTypes' || name === 'preferredIndustries' || name === 'desiredJobRoles') {
        setFormData(prev => ({
          ...prev,
          [name]: checked 
            ? [...prev[name], value]
            : prev[name].filter(item => item !== value)
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
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

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setErrors(prev => ({ ...prev, resume: "File size must be less than 10MB" }));
        return;
      }
      
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, resume: "Only PDF, DOC, and DOCX files are allowed" }));
        return;
      }
      
      setResumeFile(file);
      setFormData(prev => ({ ...prev, resumeUploaded: true }));
      setErrors(prev => ({ ...prev, resume: "" }));
    }
  };

  const removeResume = () => {
    setResumeFile(null);
    setResumePreview(null);
    setFormData(prev => ({ ...prev, resumeUploaded: false }));
  };

  const addJobHistory = () => {
    if (currentJob.company && currentJob.position && currentJob.startDate) {
      setFormData(prev => ({
        ...prev,
        jobHistory: [...prev.jobHistory, { ...currentJob }]
      }));
      setCurrentJob({
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        description: ""
      });
    }
  };

  const removeJobHistory = (index) => {
    setFormData(prev => ({
      ...prev,
      jobHistory: prev.jobHistory.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    if (currentEducation.degree && currentEducation.institution && currentEducation.graduationYear) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, { ...currentEducation }]
      }));
      setCurrentEducation({
        degree: "",
        institution: "",
        major: "",
        graduationYear: "",
        gpa: ""
      });
    }
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addCertification = () => {
    if (currentCertification.name && currentCertification.issuer) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, { ...currentCertification }]
      }));
      setCurrentCertification({
        name: "",
        issuer: "",
        date: "",
        expiryDate: ""
      });
    }
  };

  const removeCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const addReference = () => {
    if (currentReference.name && currentReference.email) {
      setFormData(prev => ({
        ...prev,
        references: [...prev.references, { ...currentReference }]
      }));
      setCurrentReference({
        name: "",
        position: "",
        company: "",
        email: "",
        phone: ""
      });
    }
  };

  const removeReference = (index) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (currentSkill && !formData.skills.includes(currentSkill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill]
      }));
      setCurrentSkill("");
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addLanguage = () => {
    if (currentLanguage && !formData.languagesSpoken.includes(currentLanguage)) {
      setFormData(prev => ({
        ...prev,
        languagesSpoken: [...prev.languagesSpoken, currentLanguage]
      }));
      setCurrentLanguage("");
    }
  };

  const removeLanguage = (language) => {
    setFormData(prev => ({
      ...prev,
      languagesSpoken: prev.languagesSpoken.filter(l => l !== language)
    }));
  };

  const addPreferredLocation = () => {
    if (currentPreferredLocation && !formData.preferredLocations.includes(currentPreferredLocation)) {
      setFormData(prev => ({
        ...prev,
        preferredLocations: [...prev.preferredLocations, currentPreferredLocation]
      }));
      setCurrentPreferredLocation("");
    }
  };

  const removePreferredLocation = (location) => {
    setFormData(prev => ({
      ...prev,
      preferredLocations: prev.preferredLocations.filter(l => l !== location)
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
      if (!formData.contactEmail.trim()) newErrors.contactEmail = "Contact email is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
        newErrors.contactEmail = "Please enter a valid email address";
      }
    }

    if (step === 2) {
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.state.trim()) newErrors.state = "State is required";
      if (!formData.country.trim()) newErrors.country = "Country is required";
    }

    if (step === 3) {
      if (formData.desiredJobRoles.length === 0) newErrors.desiredJobRoles = "At least one job role is required";
      if (formData.preferredIndustries.length === 0) newErrors.preferredIndustries = "At least one industry is required";
      if (formData.employmentTypes.length === 0) newErrors.employmentTypes = "At least one employment type is required";
    }

    if (step === 4) {
      if (!formData.totalYearsExperience) newErrors.totalYearsExperience = "Total years of experience is required";
      if (!formData.visaStatus) newErrors.visaStatus = "Visa status is required";
      if (!formData.jobSeekingStatus) newErrors.jobSeekingStatus = "Job seeking status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(4)) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate unique candidate code
      const candidateCode = `TSC-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`;
      
      // In real app, save profile data
      console.log("Profile data:", { ...formData, candidateCode });
      
      // Navigate to dashboard
      navigate("/candidate/dashboard", { 
        state: { 
          profileComplete: true,
          candidateCode,
          profileData: formData,
          resumeFile
        }
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
      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-sm sm:text-base text-gray-600">Your personal details (hidden from recruiters)</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.fullName}
            </p>
          )}
        </div>

              <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Email *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                errors.contactEmail ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="your.email@example.com"
                />
              </div>
          {errors.contactEmail && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.contactEmail}
            </p>
          )}
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
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              Privacy Protected
            </h4>
            <p className="text-sm text-blue-700">
              Your full name, contact email, and phone number will be hidden from recruiters. 
              Only your candidate code and professional details will be visible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Location & Preferences</h2>
        <p className="text-sm sm:text-base text-gray-600">Where you are and where you'd like to work</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                errors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
                    placeholder="New York"
                  />
                </div>
          {errors.city && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.city}
            </p>
          )}
        </div>

                <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <input
            type="text"
            name="state"
                    value={formData.state}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
              errors.state ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="NY"
          />
          {errors.state && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.state}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country *
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
              errors.country ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="United States"
          />
          {errors.country && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.country}
            </p>
          )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
          name="willingToRelocate"
                  checked={formData.willingToRelocate}
          onChange={handleInputChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label className="text-sm text-gray-700">I'm willing to relocate</label>
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
          {formData.preferredLocations.map((location) => (
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
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Job Preferences</h2>
        <p className="text-sm sm:text-base text-gray-600">What kind of opportunities are you looking for?</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Desired Job Roles *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            "Software Engineer", "Product Manager", "Data Scientist", "Designer",
            "Marketing Manager", "Sales Representative", "Operations Manager", "Finance Analyst",
            "HR Specialist", "Customer Success", "DevOps Engineer", "Business Analyst",
            "Project Manager", "UX Designer", "QA Engineer", "System Administrator"
          ].map((role) => (
            <label key={role} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                name="desiredJobRoles"
                value={role}
                checked={formData.desiredJobRoles.includes(role)}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{role}</span>
            </label>
          ))}
        </div>
        {errors.desiredJobRoles && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.desiredJobRoles}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Industries *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            "Technology", "Healthcare", "Finance", "Manufacturing", "Retail", "Education",
            "Consulting", "Real Estate", "Media & Entertainment", "Government", "Non-profit", "Other"
          ].map((industry) => (
            <label key={industry} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                name="preferredIndustries"
                value={industry}
                checked={formData.preferredIndustries.includes(industry)}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{industry}</span>
            </label>
          ))}
        </div>
        {errors.preferredIndustries && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.preferredIndustries}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Employment Types *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {employmentTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                name="employmentTypes"
                value={type}
                checked={formData.employmentTypes.includes(type)}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
        {errors.employmentTypes && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.employmentTypes}
          </p>
        )}
              </div>
            </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Experience & Details</h2>
        <p className="text-sm sm:text-base text-gray-600">Your professional background and preferences</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Years of Experience *
          </label>
          <select
            name="totalYearsExperience"
            value={formData.totalYearsExperience}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
              errors.totalYearsExperience ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select experience</option>
            <option value="0-1">0-1 years</option>
            <option value="1-3">1-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5-10">5-10 years</option>
            <option value="10+">10+ years</option>
          </select>
          {errors.totalYearsExperience && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.totalYearsExperience}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Visa Status *
          </label>
          <select
            name="visaStatus"
            value={formData.visaStatus}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
              errors.visaStatus ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select visa status</option>
            {visaStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {errors.visaStatus && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.visaStatus}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Seeking Status *
          </label>
          <select
            name="jobSeekingStatus"
            value={formData.jobSeekingStatus}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
              errors.jobSeekingStatus ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select status</option>
            {jobSeekingStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {errors.jobSeekingStatus && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.jobSeekingStatus}
            </p>
          )}
        </div>

              <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Desired Annual Package (USD)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
              type="number"
              name="desiredAnnualPackage"
              value={formData.desiredAnnualPackage}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="80000"
                />
              </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Availability to Join
          </label>
          <select
            name="availabilityToJoin"
            value={formData.availabilityToJoin}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="">Select availability</option>
            {availabilityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Relocation Willingness
          </label>
          <select
            name="relocationWillingness"
            value={formData.relocationWillingness}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="">Select option</option>
            {relocationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Skills */}
              <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills
        </label>
        <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Add skill"
                  />
                  <button
                    type="button"
            onClick={addSkill}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
            <Plus className="h-4 w-4" />
                  </button>
                </div>
        <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
              className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="hover:text-indigo-600"
              >
                <X className="h-3 w-3" />
              </button>
                    </span>
                  ))}
                </div>
              </div>

      {/* Resume Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Resume Upload
        </label>
        <div className="flex items-center gap-4">
          {resumeFile ? (
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-700">{resumeFile.name}</span>
              <button
                type="button"
                onClick={removeResume}
                className="text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="w-full">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Resume (PDF, DOC, DOCX)
              </label>
              <p className="text-xs text-gray-500 mt-1">Maximum file size: 10MB</p>
            </div>
          )}
        </div>
        {errors.resume && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.resume}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header />
      
      <div className="pt-8 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-3">
              <User className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Complete Your Profile
            </h4>
            <p className="text-base sm:text-sm text-gray-600">
              Set up your candidate profile to access exclusive opportunities
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of 4</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / 4) * 100)}% Complete</span>
              </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8">
              <form onSubmit={handleSubmit}>
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}

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

                  {currentStep < 4 ? (
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
                          Creating Profile...
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
          <div className="mt-6 text-center">
            <Link
              to="/candidate/verification"
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

export default ProfileSetup;
