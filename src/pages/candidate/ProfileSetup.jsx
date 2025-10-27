import React, { useState, useEffect, useRef } from "react";
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
  Users,
  Sparkles
} from "lucide-react";
import { toast } from 'react-toastify';
import Header from "../../Components/Header";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [resumeFile, setResumeFile] = useState(null);
  const [resumePreview, setResumePreview] = useState(null);

  // Scroll to top when component mounts and check authentication
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please log in to access this page.");
      navigate("/candidate/login");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    // Location
    city: "",
    state: "",
    willingToRelocate: false,
    preferredLocations: [],
    
    // Job Preferences
    desiredJobRoles: [],
    preferredIndustries: [],
    employmentTypes: [],
    
    // Work Experience
    totalYearsExperience: "",
    jobHistory: [],
    currentEmployer: "",
    
    // Skills
    skills: [],
    
    // Education
    education: [],
    
    // Certifications
    certifications: [],
    
    // Resume
    resumeFilePath: "",
    resumeFileName: "",
    resumeMimeType: "",
    
    // Visa Status
    visaStatus: "",
    
    // Relocation
    relocationWillingness: "",
    
    // Job Seeking Status
    jobSeekingStatus: "",
    
    // Salary
    desiredAnnualPackage: "",
    
    // Availability
    availabilityDate: "",
    
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
    duration: ""
  });

  const [currentEducation, setCurrentEducation] = useState({
    degree: "",
    institution: "",
    year: ""
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
    contact: ""
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
    "us_citizen",
    "permanent_resident",
    "h1_b",
    "opt_cpt",
    "other"
  ];

  const jobSeekingStatuses = [
    "actively_looking",
    "open_to_better_offers",
    "not_actively_looking"
  ];

  const relocationOptions = [
    "Yes",
    "If employer covers relocation costs",
    "No"
  ];

  const availabilityOptions = [
    "2024-01-01",
    "2024-02-01", 
    "2024-03-01",
    "2024-04-01",
    "2024-05-01"
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
      setFormData(prev => ({ 
        ...prev, 
        resumeFilePath: `/uploads/${file.name}`,
        resumeFileName: file.name,
        resumeMimeType: file.type
      }));
      setErrors(prev => ({ ...prev, resume: "" }));
    }
  };

  const removeResume = () => {
    setResumeFile(null);
    setResumePreview(null);
    setFormData(prev => ({ 
      ...prev, 
      resumeFilePath: "",
      resumeFileName: "",
      resumeMimeType: ""
    }));
  };

  const addJobHistory = () => {
    if (currentJob.company && currentJob.position && currentJob.duration) {
      setFormData(prev => ({
        ...prev,
        jobHistory: [...prev.jobHistory, { ...currentJob }]
      }));
      setCurrentJob({
        company: "",
        position: "",
        duration: ""
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
    if (currentEducation.degree && currentEducation.institution && currentEducation.year) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, { ...currentEducation }]
      }));
      setCurrentEducation({
        degree: "",
        institution: "",
        year: ""
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
    if (currentReference.name && currentReference.contact) {
      setFormData(prev => ({
        ...prev,
        references: [...prev.references, { ...currentReference }]
      }));
      setCurrentReference({
        name: "",
        position: "",
        contact: ""
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
    if (currentPreferredLocation && !(formData.preferredLocations || []).includes(currentPreferredLocation)) {
      setFormData(prev => ({
        ...prev,
        preferredLocations: [...(prev.preferredLocations || []), currentPreferredLocation]
      }));
      setCurrentPreferredLocation("");
    }
  };

  const removePreferredLocation = (location) => {
    setFormData(prev => ({
      ...prev,
      preferredLocations: (prev.preferredLocations || []).filter(l => l !== location)
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.state.trim()) newErrors.state = "State is required";
    }

    if (step === 2) {
      if ((formData.desiredJobRoles || []).length === 0) newErrors.desiredJobRoles = "At least one job role is required";
      if ((formData.preferredIndustries || []).length === 0) newErrors.preferredIndustries = "At least one industry is required";
      if ((formData.employmentTypes || []).length === 0) newErrors.employmentTypes = "At least one employment type is required";
    }

    if (step === 3) {
      if (!formData.totalYearsExperience) newErrors.totalYearsExperience = "Total years of experience is required";
      if (!formData.visaStatus) newErrors.visaStatus = "Visa status is required";
      if (!formData.jobSeekingStatus) newErrors.jobSeekingStatus = "Job seeking status is required";
    }

    if (step === 4) {
      // Step 4 is optional details, no required validation
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < 4) {
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
    
    // Only validate step 3 (the last required step) when submitting
    if (!validateStep(3)) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Prepare the data in the format expected by the API
      const profileData = {
        city: formData.city,
        state: formData.state,
        willing_to_relocate: formData.willingToRelocate,
        preferred_locations: formData.preferredLocations || [],
        desired_job_roles: formData.desiredJobRoles || [],
        preferred_industries: formData.preferredIndustries || [],
        employment_types: formData.employmentTypes || [],
        total_years_experience: formData.totalYearsExperience,
        job_history: formData.jobHistory || [],
        current_employer: formData.currentEmployer,
        skills: formData.skills || [],
        education: formData.education || [],
        certifications: formData.certifications || [],
        resume_file_path: formData.resumeFilePath,
        resume_file_name: formData.resumeFileName,
        resume_mime_type: formData.resumeMimeType,
        visa_status: formData.visaStatus,
        relocation_willingness: formData.relocationWillingness,
        job_seeking_status: formData.jobSeekingStatus,
        desired_annual_package: formData.desiredAnnualPackage ? parseInt(formData.desiredAnnualPackage) : null,
        availability_date: formData.availabilityDate,
        languages_spoken: formData.languagesSpoken || [],
        ethnicity: formData.ethnicity,
        veteran_status: formData.veteranStatus,
        disability_status: formData.disabilityStatus,
        references: formData.references || [],
        blocked_companies: formData.blockedCompanies || [],
        additional_notes: formData.additionalNotes
      };

      // Make API call to create profile
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile creation failed');
      }

      const result = data;
      
      // Generate unique candidate code (if not provided by API)
      const candidateCode = result.candidateCode || `TSC-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`;
      
      // Mark profile as complete in localStorage
      localStorage.setItem("candidateProfileComplete", "true");
      localStorage.setItem("candidateProfileData", JSON.stringify({ ...profileData, candidateCode }));
      
      // Show success message
      toast.success("Profile setup completed successfully! Welcome to VettedPool.");
      
      // Navigate to dashboard
      navigate("/candidate/dashboard", { 
        state: { 
          profileComplete: true,
          candidateCode,
          profileData: profileData,
          resumeFile
        }
      });
    } catch (error) {
      console.error("Profile creation error:", error);
      
      // Handle specific error messages
      if (error.message.includes("token") || error.message.includes("unauthorized")) {
        toast.error("Session expired. Please log in again.");
        navigate("/candidate/login");
      } else if (error.message.includes("validation") || error.message.includes("required")) {
        toast.error("Please check your form data and try again.");
      } else {
        toast.error(error.message || "Failed to create profile. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-4 md:mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-[#1e2749] mb-2 flex items-center justify-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-[#e4d9ff] rounded-xl flex items-center justify-center">
            <MapPin className="h-4 w-4 md:h-5 md:w-5 text-[#273469]" />
          </div>
          Location & Basic Info
        </h2>
        <p className="text-sm md:text-base text-[#30343f]">Where you are located and basic preferences</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base ${
                errors.city ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
              }`}
              placeholder="Mumbai"
            />
          </div>
          {errors.city && (
            <p className="mt-1 text-xs md:text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
              {errors.city}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className={`w-full px-3 md:px-4 py-2 md:py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base ${
              errors.state ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
            }`}
            placeholder="Maharashtra"
          />
          {errors.state && (
            <p className="mt-1 text-xs md:text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
              {errors.state}
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
          className="h-3 w-3 md:h-4 md:w-4 text-[#273469] focus:ring-[#273469] border-[#e4d9ff] rounded"
        />
        <label className="text-xs md:text-sm text-gray-700">I'm willing to relocate</label>
      </div>

      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
          Preferred Locations
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={currentPreferredLocation}
            onChange={(e) => setCurrentPreferredLocation(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPreferredLocation())}
            className="flex-1 px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
            placeholder="Add preferred location"
          />
          <button
            type="button"
            onClick={addPreferredLocation}
            className="px-3 md:px-4 py-2 bg-[#273469] text-white rounded-xl hover:bg-[#1e2749] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <Plus className="h-3 w-3 md:h-4 md:w-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.preferredLocations || []).map((location) => (
            <span
              key={location}
              className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm"
            >
              {location}
              <button
                type="button"
                onClick={() => removePreferredLocation(location)}
                className="hover:text-indigo-600"
              >
                <X className="h-2 w-2 md:h-3 md:w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            Relocation Willingness
          </label>
          <select
            name="relocationWillingness"
            value={formData.relocationWillingness}
            onChange={handleInputChange}
            className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] text-sm md:text-base"
          >
            <option value="">Select option</option>
            {relocationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            Availability Date
          </label>
          <select
            name="availabilityDate"
            value={formData.availabilityDate}
            onChange={handleInputChange}
            className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] text-sm md:text-base"
          >
            <option value="">Select availability</option>
            {availabilityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-4 md:mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-[#1e2749] mb-2 flex items-center justify-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-[#e4d9ff] rounded-xl flex items-center justify-center">
            <Briefcase className="h-4 w-4 md:h-5 md:w-5 text-[#273469]" />
          </div>
          Job Preferences
        </h2>
        <p className="text-sm md:text-base text-[#30343f]">What kind of opportunities are you looking for?</p>
      </div>

      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
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
                checked={(formData.desiredJobRoles || []).includes(role)}
                onChange={handleInputChange}
                className="h-3 w-3 md:h-4 md:w-4 text-[#273469] focus:ring-[#273469] border-[#e4d9ff] rounded"
              />
              <span className="text-xs md:text-sm text-gray-700">{role}</span>
            </label>
          ))}
        </div>
        {errors.desiredJobRoles && (
          <p className="mt-1 text-xs md:text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
            {errors.desiredJobRoles}
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
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
                checked={(formData.preferredIndustries || []).includes(industry)}
                onChange={handleInputChange}
                className="h-3 w-3 md:h-4 md:w-4 text-[#273469] focus:ring-[#273469] border-[#e4d9ff] rounded"
              />
              <span className="text-xs md:text-sm text-gray-700">{industry}</span>
            </label>
          ))}
        </div>
        {errors.preferredIndustries && (
          <p className="mt-1 text-xs md:text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
            {errors.preferredIndustries}
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
          Employment Types *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {employmentTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                name="employmentTypes"
                value={type}
                checked={(formData.employmentTypes || []).includes(type)}
                onChange={handleInputChange}
                className="h-3 w-3 md:h-4 md:w-4 text-[#273469] focus:ring-[#273469] border-[#e4d9ff] rounded"
              />
              <span className="text-xs md:text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
        {errors.employmentTypes && (
          <p className="mt-1 text-xs md:text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
            {errors.employmentTypes}
          </p>
        )}
      </div>
    </div>
  );


  const renderStep3 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-4 md:mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-[#1e2749] mb-2 flex items-center justify-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-[#e4d9ff] rounded-xl flex items-center justify-center">
            <Award className="h-4 w-4 md:h-5 md:w-5 text-[#273469]" />
          </div>
          Professional Experience
        </h2>
        <p className="text-sm md:text-base text-[#30343f]">Your work experience and professional status</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            Total Years of Experience *
          </label>
          <select
            name="totalYearsExperience"
            value={formData.totalYearsExperience}
            onChange={handleInputChange}
            className={`w-full px-3 md:px-4 py-2 md:py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] text-sm md:text-base ${
              errors.totalYearsExperience ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
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
            <p className="mt-1 text-xs md:text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
              {errors.totalYearsExperience}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            Current Employer
          </label>
          <input
            type="text"
            name="currentEmployer"
            value={formData.currentEmployer}
            onChange={handleInputChange}
            className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
            placeholder="Tech Corp"
          />
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            Visa Status *
          </label>
          <select
            name="visaStatus"
            value={formData.visaStatus}
            onChange={handleInputChange}
            className={`w-full px-3 md:px-4 py-2 md:py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] text-sm md:text-base ${
              errors.visaStatus ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
            }`}
          >
            <option value="">Select visa status</option>
            {visaStatuses.map((status) => (
              <option key={status} value={status}>
                {status.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
          {errors.visaStatus && (
            <p className="mt-1 text-xs md:text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
              {errors.visaStatus}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            Job Seeking Status *
          </label>
          <select
            name="jobSeekingStatus"
            value={formData.jobSeekingStatus}
            onChange={handleInputChange}
            className={`w-full px-3 md:px-4 py-2 md:py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] text-sm md:text-base ${
              errors.jobSeekingStatus ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
            }`}
          >
            <option value="">Select status</option>
            {jobSeekingStatuses.map((status) => (
              <option key={status} value={status}>
                {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
          {errors.jobSeekingStatus && (
            <p className="mt-1 text-xs md:text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
              {errors.jobSeekingStatus}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            Desired Annual Package (USD)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
            <input
              type="number"
              name="desiredAnnualPackage"
              value={formData.desiredAnnualPackage}
              onChange={handleInputChange}
              className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
              placeholder="800000"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            Ethnicity
          </label>
          <input
            type="text"
            name="ethnicity"
            value={formData.ethnicity}
            onChange={handleInputChange}
            className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
            placeholder="Asian"
          />
        </div>
      </div>

      {/* Job History */}
      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
          Job History
        </label>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Company"
              value={currentJob.company}
              onChange={(e) => setCurrentJob(prev => ({ ...prev, company: e.target.value }))}
              className="px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
            />
            <input
              type="text"
              placeholder="Position"
              value={currentJob.position}
              onChange={(e) => setCurrentJob(prev => ({ ...prev, position: e.target.value }))}
              className="px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
            />
            <input
              type="text"
              placeholder="Duration (e.g., 2 years)"
              value={currentJob.duration}
              onChange={(e) => setCurrentJob(prev => ({ ...prev, duration: e.target.value }))}
              className="px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
            />
          </div>
          <button
            type="button"
            onClick={addJobHistory}
            className="px-3 md:px-4 py-2 bg-[#273469] text-white rounded-xl hover:bg-[#1e2749] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <Plus className="h-3 w-3 md:h-4 md:w-4 inline mr-1" />
            Add Job
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {formData.jobHistory.map((job, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div>
                <span className="font-medium">{job.position}</span> at <span className="font-medium">{job.company}</span> - {job.duration}
              </div>
              <button
                type="button"
                onClick={() => removeJobHistory(index)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
          Skills
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={currentSkill}
            onChange={(e) => setCurrentSkill(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
            className="flex-1 px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
            placeholder="Add skill"
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-3 md:px-4 py-2 bg-[#273469] text-white rounded-xl hover:bg-[#1e2749] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <Plus className="h-3 w-3 md:h-4 md:w-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.skills || []).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="hover:text-indigo-600"
              >
                <X className="h-2 w-2 md:h-3 md:w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-4 md:mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-[#1e2749] mb-2 flex items-center justify-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-[#e4d9ff] rounded-xl flex items-center justify-center">
            <FileText className="h-4 w-4 md:h-5 md:w-5 text-[#273469]" />
          </div>
          Additional Details & Documents
        </h2>
        <p className="text-sm md:text-base text-[#30343f]">Complete your profile with education, certifications, and documents</p>
      </div>

      {/* Education */}
      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
          Education
        </label>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Degree"
              value={currentEducation.degree}
              onChange={(e) => setCurrentEducation(prev => ({ ...prev, degree: e.target.value }))}
              className="px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
            />
            <input
              type="text"
              placeholder="Institution"
              value={currentEducation.institution}
              onChange={(e) => setCurrentEducation(prev => ({ ...prev, institution: e.target.value }))}
              className="px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
            />
            <input
              type="text"
              placeholder="Year"
              value={currentEducation.year}
              onChange={(e) => setCurrentEducation(prev => ({ ...prev, year: e.target.value }))}
              className="px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
            />
          </div>
          <button
            type="button"
            onClick={addEducation}
            className="px-3 md:px-4 py-2 bg-[#273469] text-white rounded-xl hover:bg-[#1e2749] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <Plus className="h-3 w-3 md:h-4 md:w-4 inline mr-1" />
            Add Education
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {formData.education.map((edu, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div>
                <span className="font-medium">{edu.degree}</span> from <span className="font-medium">{edu.institution}</span> ({edu.year})
              </div>
              <button
                type="button"
                onClick={() => removeEducation(index)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
          Certifications
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={currentCertification.name}
            onChange={(e) => setCurrentCertification(prev => ({ ...prev, name: e.target.value }))}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCertification())}
            className="flex-1 px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
            placeholder="Add certification"
          />
          <button
            type="button"
            onClick={addCertification}
            className="px-3 md:px-4 py-2 bg-[#273469] text-white rounded-xl hover:bg-[#1e2749] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <Plus className="h-3 w-3 md:h-4 md:w-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.certifications || []).map((cert, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm"
            >
              {cert.name}
              <button
                type="button"
                onClick={() => removeCertification(index)}
                className="hover:text-green-600"
              >
                <X className="h-2 w-2 md:h-3 md:w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
          Languages Spoken
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={currentLanguage}
            onChange={(e) => setCurrentLanguage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
            className="flex-1 px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
            placeholder="Add language"
          />
          <button
            type="button"
            onClick={addLanguage}
            className="px-3 md:px-4 py-2 bg-[#273469] text-white rounded-xl hover:bg-[#1e2749] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <Plus className="h-3 w-3 md:h-4 md:w-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.languagesSpoken || []).map((language) => (
            <span
              key={language}
              className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm"
            >
              {language}
              <button
                type="button"
                onClick={() => removeLanguage(language)}
                className="hover:text-blue-600"
              >
                <X className="h-2 w-2 md:h-3 md:w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* References */}
      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
          References
        </label>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Name"
              value={currentReference.name}
              onChange={(e) => setCurrentReference(prev => ({ ...prev, name: e.target.value }))}
              className="px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
            />
            <input
              type="text"
              placeholder="Position"
              value={currentReference.position}
              onChange={(e) => setCurrentReference(prev => ({ ...prev, position: e.target.value }))}
              className="px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
            />
            <input
              type="text"
              placeholder="Contact (email/phone)"
              value={currentReference.contact}
              onChange={(e) => setCurrentReference(prev => ({ ...prev, contact: e.target.value }))}
              className="px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
            />
          </div>
          <button
            type="button"
            onClick={addReference}
            className="px-3 md:px-4 py-2 bg-[#273469] text-white rounded-xl hover:bg-[#1e2749] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <Plus className="h-3 w-3 md:h-4 md:w-4 inline mr-1" />
            Add Reference
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {formData.references.map((ref, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div>
                <span className="font-medium">{ref.name}</span> - {ref.position} ({ref.contact})
              </div>
              <button
                type="button"
                onClick={() => removeReference(index)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Resume Upload */}
      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
          Resume Upload
        </label>
        <div className="flex items-center gap-3 md:gap-4">
          {resumeFile ? (
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
              <span className="text-xs md:text-sm text-gray-700">{resumeFile.name}</span>
              <button
                type="button"
                onClick={removeResume}
                className="text-red-600 hover:text-red-800"
              >
                <X className="h-3 w-3 md:h-4 md:w-4" />
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
                className="cursor-pointer bg-white border-2 border-[#e4d9ff] rounded-xl px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium text-[#30343f] hover:bg-[#fafaff] transition-all duration-300 flex items-center gap-2"
              >
                <Upload className="h-3 w-3 md:h-4 md:w-4" />
                Upload Resume (PDF, DOC, DOCX)
              </label>
              <p className="text-xs text-gray-500 mt-1">Maximum file size: 10MB</p>
            </div>
          )}
        </div>
        {errors.resume && (
          <p className="mt-1 text-xs md:text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
            {errors.resume}
          </p>
        )}
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
          Additional Notes
        </label>
        <textarea
          name="additionalNotes"
          value={formData.additionalNotes}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
          placeholder="Open to remote work"
        />
      </div>

      {/* Optional Information */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Optional Information</h4>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="veteranStatus"
            checked={formData.veteranStatus}
            onChange={handleInputChange}
            className="h-3 w-3 md:h-4 md:w-4 text-[#273469] focus:ring-[#273469] border-[#e4d9ff] rounded"
          />
          <label className="text-xs md:text-sm text-gray-700">I am a veteran</label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="disabilityStatus"
            checked={formData.disabilityStatus}
            onChange={handleInputChange}
            className="h-3 w-3 md:h-4 md:w-4 text-[#273469] focus:ring-[#273469] border-[#e4d9ff] rounded"
          />
          <label className="text-xs md:text-sm text-gray-700">I have a disability</label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafaff] text-[#1e2749] overflow-x-hidden">
      <Header />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#e4d9ff] rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-[#30343f] rounded-full opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-[#e4d9ff] rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative pt-24 pb-20 lg:pt-32 lg:pb-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 rounded-full bg-[#e4d9ff] text-[#273469] text-xs md:text-sm font-medium mb-4 md:mb-6">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              Complete Your Profile
            </div>
            
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
              <h1 className="text-lg md:text-xl lg:text-2xl font-black text-[#1e2749] px-4">
                Profile Setup
              </h1>
            </div>
            
            <p className="text-sm md:text-base lg:text-lg text-[#30343f] max-w-2xl mx-auto leading-relaxed px-4">
              Set up your candidate profile to access exclusive opportunities with pre-vetted companies
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <span className="text-xs md:text-sm font-semibold text-[#1e2749]">Step {currentStep} of 4</span>
              <span className="text-xs md:text-sm text-[#30343f]">{Math.round((currentStep / 4) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-[#e4d9ff] rounded-full h-2 md:h-3">
              <div 
                className="bg-gradient-to-r from-[#273469] to-[#1e2749] h-2 md:h-3 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl border-2 border-[#e4d9ff] overflow-hidden">
            <div className="p-3 sm:p-4 md:p-6 lg:p-8">
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
                <div className="flex justify-between mt-6 md:mt-8">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 border-2 border-[#e4d9ff] text-[#30343f] rounded-xl hover:bg-[#e4d9ff] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-sm md:text-base"
                  >
                    <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
                    Previous
                  </button>

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-[#273469] text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold hover:bg-[#1e2749] transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-sm md:text-base"
                    >
                      Next
                      <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 rotate-180" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="bg-[#273469] text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold hover:bg-[#1e2749] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:transform-none text-sm md:text-base"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-white"></div>
                          Creating Profile...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />
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
          <div className="mt-6 md:mt-8 text-center">
            <Link
              to="/candidate/verification"
              className="inline-flex items-center gap-2 text-[#30343f] hover:text-[#1e2749] transition-colors duration-300 font-medium text-sm md:text-base"
            >
              <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
              Back to Email Verification
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
