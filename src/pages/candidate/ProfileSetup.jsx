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
  Sparkles,
  ChevronDown
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
  const hasCheckedProfile = useRef(false);

  // Scroll to top when component mounts and check authentication
  useEffect(() => {
    // Prevent duplicate checks (especially in React Strict Mode)
    if (hasCheckedProfile.current) return;
    
    window.scrollTo(0, 0);
    
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      hasCheckedProfile.current = true;
      toast.error("Please log in to access this page.");
      navigate("/candidate/login");
      return;
    }
    
    // Check if user already has a profile
    const hasProfile = localStorage.getItem('has_profile');
    const profileComplete = localStorage.getItem('candidateProfileComplete');
    if (hasProfile === 'true') {
      hasCheckedProfile.current = true;
      toast.info("You already have a profile. Redirecting to dashboard...");
      navigate("/candidate/dashboard");
      return;
    }
    
    hasCheckedProfile.current = true;
  }, [navigate]);

  const [formData, setFormData] = useState({
    // Location
    city: "",
    state: "",
    willing_to_relocate: false,
    preferred_locations: [],
    
    // Personal Information
    gender: "",
    
    // Job Preferences
    desired_job_roles: [],
    preferred_industries: [],
    employment_types: [],
    
    // Work Experience
    total_years_experience: "",
    job_history: [],
    current_employer: "",
    
    // Skills
    skills: [],
    
    // Education
    education: [],
    
    // Certifications
    certifications: [],
    
    // Resume
    resume_file_path: "",
    resume_file_name: "",
    resume_mime_type: "",
    
    // Visa Status
    visa_status: "",
    
    // Relocation
    relocation_willingness: "",
    
    // Job Seeking Status
    job_seeking_status: "",
    
    // Salary
    desired_annual_package: "",
    
    // Availability
    availability_date: "",
    
    // Languages
    languages_spoken: [],
    
    // Optional Information
    ethnicity: "",
    veteran_status: false,
    disability_status: false,
    
    // References
    references: [],
    
    // Company Blacklist
    blocked_companies: [],
    
    // Additional Notes
    additional_notes: ""
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
    "h1b",
    "opt_cpt",
    "other"
  ];

  // Visa status display labels mapping
  const visaStatusLabels = {
    "us_citizen": "US Citizen",
    "permanent_resident": "Permanent Resident",
    "h1b": "H1B",
    "opt_cpt": "OPT/CPT",
    "other": "Other"
  };

  const jobSeekingStatuses = [
    "actively_looking",
    "open_to_offers",
    "not_looking"
  ];

  // Job seeking status display labels mapping
  const jobSeekingStatusLabels = {
    "actively_looking": "Actively Looking",
    "open_to_offers": "Open to Offers",
    "not_looking": "Not Looking"
  };

  const relocationOptions = [
    "by_self",
    "if_employer_covers",
    "not_willing"
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'employment_types' || name === 'preferred_industries' || name === 'desired_job_roles') {
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
        resume_file_path: `/uploads/${file.name}`,
        resume_file_name: file.name,
        resume_mime_type: file.type
      }));
      setErrors(prev => ({ ...prev, resume: "" }));
    }
  };

  const removeResume = () => {
    setResumeFile(null);
    setResumePreview(null);
    setFormData(prev => ({ 
      ...prev, 
      resume_file_path: "",
      resume_file_name: "",
      resume_mime_type: ""
    }));
  };

  const addJobHistory = () => {
    if (currentJob.company && currentJob.position && currentJob.duration) {
      setFormData(prev => ({
        ...prev,
        job_history: [...prev.job_history, { ...currentJob }]
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
      job_history: prev.job_history.filter((_, i) => i !== index)
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
    if (currentLanguage && !formData.languages_spoken.includes(currentLanguage)) {
      setFormData(prev => ({
        ...prev,
        languages_spoken: [...prev.languages_spoken, currentLanguage]
      }));
      setCurrentLanguage("");
    }
  };

  const removeLanguage = (language) => {
    setFormData(prev => ({
      ...prev,
      languages_spoken: prev.languages_spoken.filter(l => l !== language)
    }));
  };

  const addPreferredLocation = () => {
    if (currentPreferredLocation && !(formData.preferred_locations || []).includes(currentPreferredLocation)) {
      setFormData(prev => ({
        ...prev,
        preferred_locations: [...(prev.preferred_locations || []), currentPreferredLocation]
      }));
      setCurrentPreferredLocation("");
    }
  };

  const removePreferredLocation = (location) => {
    setFormData(prev => ({
      ...prev,
      preferred_locations: (prev.preferred_locations || []).filter(l => l !== location)
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.state.trim()) newErrors.state = "State is required";
      if (!formData.gender.trim()) newErrors.gender = "Gender is required";
      if ((formData.preferred_locations || []).length === 0) newErrors.preferred_locations = "At least one preferred location is required";
    }

    if (step === 2) {
      if ((formData.desired_job_roles || []).length === 0) newErrors.desired_job_roles = "At least one job role is required";
      if ((formData.preferred_industries || []).length === 0) newErrors.preferred_industries = "At least one industry is required";
      if ((formData.employment_types || []).length === 0) newErrors.employment_types = "At least one employment type is required";
    }

    if (step === 3) {
      if (!formData.total_years_experience) newErrors.total_years_experience = "Total years of experience is required";
      if (!formData.visa_status) newErrors.visa_status = "Visa status is required";
      if (!formData.job_seeking_status) newErrors.job_seeking_status = "Job seeking status is required";
      if (!formData.relocation_willingness) newErrors.relocation_willingness = "Relocation willingness is required";
      if (!formData.desired_annual_package) newErrors.desired_annual_package = "Desired annual package is required";
      if ((formData.job_history || []).length === 0) newErrors.job_history = "At least one job history entry is required";
      if ((formData.skills || []).length === 0) newErrors.skills = "At least one skill is required";
    }

    if (step === 4) {
      if ((formData.education || []).length === 0) newErrors.education = "At least one education entry is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    } else {
      // Scroll to first error field
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        setTimeout(() => {
          const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            errorElement.focus();
          }
        }, 100);
      }
    }
  };
  
  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all steps including step 4 when submitting
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      // Scroll to first error field
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        setTimeout(() => {
          const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            errorElement.focus();
          }
        }, 100);
      }
      return;
    }

    setIsLoading(true);
    
    try {
      // Prepare the data in the format expected by the API
      const profileData = {
        city: formData.city,
        state: formData.state,
        gender: formData.gender,
        willing_to_relocate: formData.willing_to_relocate,
        preferred_locations: formData.preferred_locations || [],
        desired_job_roles: formData.desired_job_roles || [],
        preferred_industries: formData.preferred_industries || [],
        employment_types: formData.employment_types || [],
        total_years_experience: parseInt(formData.total_years_experience),
        job_history: formData.job_history || [],
        current_employer: formData.current_employer,
        skills: formData.skills || [],
        education: formData.education || [],
        certifications: formData.certifications || [],
        resume_file_path: formData.resume_file_path,
        resume_file_name: formData.resume_file_name,
        resume_mime_type: formData.resume_mime_type,
        visa_status: formData.visa_status,
        relocation_willingness: formData.relocation_willingness,
        job_seeking_status: formData.job_seeking_status,
        desired_annual_package: formData.desired_annual_package ? parseFloat(formData.desired_annual_package) : null,
        availability_date: formData.availability_date,
        languages_spoken: formData.languages_spoken || [],
        ethnicity: formData.ethnicity,
        veteran_status: formData.veteran_status,
        disability_status: formData.disability_status,
        references: formData.references || [],
        blocked_companies: formData.blocked_companies || [],
        additional_notes: formData.additional_notes
      };

      // Make API call to create profile
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(profileData)
      });

      // Parse response JSON
      let data;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        throw new Error("Invalid response from server. Please try again.");
      }

      if (!response.ok) {
        console.error("API Error Response:", data);
        console.error("Response Status:", response.status);
        
        // Handle validation errors from backend
        const newErrors = {};
        let hasFieldErrors = false;
        
        // Check if backend returns errors object with field-specific errors
        if (data.errors && typeof data.errors === 'object') {
          // Map each field error to form errors
          Object.keys(data.errors).forEach(field => {
            const fieldErrors = data.errors[field];
            // Handle array of error messages (take first one) or single string
            if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
              newErrors[field] = fieldErrors[0];
            } else if (typeof fieldErrors === 'string') {
              newErrors[field] = fieldErrors;
            } else if (fieldErrors) {
              newErrors[field] = String(fieldErrors);
            }
            hasFieldErrors = true;
          });
          
          // Set field-specific errors
          if (hasFieldErrors) {
            setErrors(prev => ({ ...prev, ...newErrors }));
            
            // Navigate to the appropriate step based on which field has error
            const fieldToStepMap = {
              city: 1,
              state: 1,
              gender: 1,
              willing_to_relocate: 1,
              preferred_locations: 1,
              relocation_willingness: 1,
              availability_date: 1,
              desired_job_roles: 2,
              preferred_industries: 2,
              employment_types: 2,
              total_years_experience: 3,
              job_history: 3,
              current_employer: 3,
              skills: 3,
              visa_status: 3,
              job_seeking_status: 3,
              desired_annual_package: 3,
              ethnicity: 3,
              education: 4,
              certifications: 4,
              languages_spoken: 4,
              references: 4,
              resume_file_path: 4,
              resume_file_name: 4,
              resume_mime_type: 4,
              additional_notes: 4,
              veteran_status: 4,
              disability_status: 4
            };
            
            // Find the first step that has an error
            const errorStep = Object.keys(newErrors).reduce((minStep, field) => {
              const step = fieldToStepMap[field] || 1;
              return step < minStep ? step : minStep;
            }, 4);
            
            setCurrentStep(errorStep);
            
            // Scroll to top after setting step
            setTimeout(() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
            
            // Show general error message
            toast.error("Failed to create profile. Please try again.");
            
            setIsLoading(false);
            return;
          }
        }
        
        // Handle general error messages
        const errorMessage = data.message || data.error || 'Profile creation failed';
        
        // Check for authentication errors
        if (errorMessage.toLowerCase().includes("token") || errorMessage.toLowerCase().includes("unauthorized") || response.status === 401) {
          toast.error("Session expired. Please log in again.");
          navigate("/candidate/login");
          setIsLoading(false);
          return;
        }
        
        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }

      console.log("Profile creation response:", data);
      
      const result = data;
      
      // Generate unique candidate code (if not provided by API)
      const candidateCode = result.candidateCode || `TSC-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`;
      
      // Mark profile as complete in localStorage
      localStorage.setItem("candidateProfileComplete", "true");
      localStorage.setItem("has_profile", "true");
      localStorage.setItem("candidateProfileData", JSON.stringify({ ...profileData, candidateCode }));
      
      // Show success message
      toast.success("Profile setup completed successfully! Welcome to VettedPool.");
      
      // Navigate to dashboard
      navigate("/candidate/dashboard", { 
        state: { 
          profileComplete: true,
          candidateCode,
          profileData: profileData,
          resumeFile,
          fromProfileSetup: true
        }
      });
    } catch (error) {
      console.error("Profile creation error:", error);
      
      // Handle network errors or other exceptions
      if (error.message) {
        // Check if it's a JSON parse error or network error
        if (error.message.includes('JSON') || error.message.includes('Failed to fetch')) {
          toast.error("Network error. Please check your connection and try again.");
        } else {
          toast.error(error.message || "Failed to create profile. Please try again.");
        }
      } else {
        toast.error("Failed to create profile. Please try again.");
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
            City <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base ${
                errors.city ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
              }`}
              placeholder="Mumbai"
            />
          </div>
          {errors.city && (
            <p className="mt-1 text-xs md:text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
              Please enter your city
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className={`w-full px-3 md:px-4 py-2 md:py-3 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base ${
              errors.state ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
            }`}
            placeholder="Maharashtra"
          />
          {errors.state && (
            <p className="mt-1 text-xs md:text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
              Please enter your state
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
          Gender <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400 pointer-events-none z-10" />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className={`w-full pl-9 md:pl-10 pr-9 md:pr-10 py-2 md:py-3 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] text-sm md:text-base appearance-none bg-white cursor-pointer ${
              errors.gender ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
            }`}
          >
            <option value="">Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400 pointer-events-none" />
        </div>
        {errors.gender && (
          <p className="mt-1 text-xs md:text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
            Please select your gender
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="willing_to_relocate"
          checked={formData.willing_to_relocate}
          onChange={handleInputChange}
          className="h-3 w-3 md:h-4 md:w-4 text-[#273469] focus:ring-[#273469] border-[#e4d9ff] rounded"
        />
        <label className="text-xs md:text-sm text-gray-700">I'm willing to relocate</label>
      </div>

      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
          Preferred Locations <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={currentPreferredLocation}
            onChange={(e) => setCurrentPreferredLocation(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPreferredLocation())}
            className="flex-1 px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
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
          {(formData.preferred_locations || []).map((location) => (
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
        {errors.preferred_locations && (
          <p className="mt-1 text-xs md:text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
            Please add at least one preferred location
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            Relocation Willingness <span className="text-red-500">*</span>
          </label>
          <select
            name="relocation_willingness"
            value={formData.relocation_willingness}
            onChange={handleInputChange}
            className={`w-full px-3 md:px-4 py-2 md:py-3 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] text-sm md:text-base ${
              errors.relocation_willingness ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
            }`}
          >
            <option value="">Select your relocation preference</option>
            {relocationOptions.map((option) => (
              <option key={option} value={option}>
                {option === "by_self" ? "Yes, I can relocate by myself" :
                 option === "if_employer_covers" ? "Yes, if employer covers relocation costs" :
                 "Not willing to relocate"}
              </option>
            ))}
          </select>
          {errors.relocation_willingness && (
            <p className="mt-1 text-xs md:text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
              Please select your relocation preference
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            Availability Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
            <input
              type="date"
              name="availability_date"
              value={formData.availability_date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] text-sm md:text-base"
              style={{
                colorScheme: 'light'
              }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Only future dates are selectable
          </p>
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
          Desired Job Roles <span className="text-red-500">*</span>
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
                name="desired_job_roles"
                value={role}
                checked={(formData.desired_job_roles || []).includes(role)}
                onChange={handleInputChange}
                className="h-3 w-3 md:h-4 md:w-4 text-[#273469] focus:ring-[#273469] border-[#e4d9ff] rounded"
              />
              <span className="text-xs md:text-sm text-gray-700">{role}</span>
            </label>
          ))}
        </div>
        {errors.desired_job_roles && (
          <p className="mt-1 text-xs md:text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
            Please select at least one job role
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
          Preferred Industries <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            "Technology", "Healthcare", "Finance", "Manufacturing", "Retail", "Education",
            "Consulting", "Real Estate", "Media & Entertainment", "Government", "Non-profit", "Other"
          ].map((industry) => (
            <label key={industry} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                name="preferred_industries"
                value={industry}
                checked={(formData.preferred_industries || []).includes(industry)}
                onChange={handleInputChange}
                className="h-3 w-3 md:h-4 md:w-4 text-[#273469] focus:ring-[#273469] border-[#e4d9ff] rounded"
              />
              <span className="text-xs md:text-sm text-gray-700">{industry}</span>
            </label>
          ))}
        </div>
        {errors.preferred_industries && (
          <p className="mt-1 text-xs md:text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
            Please select at least one industry
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
          Employment Types <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {employmentTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                name="employment_types"
                value={type}
                checked={(formData.employment_types || []).includes(type)}
                onChange={handleInputChange}
                className="h-3 w-3 md:h-4 md:w-4 text-[#273469] focus:ring-[#273469] border-[#e4d9ff] rounded"
              />
              <span className="text-xs md:text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
        {errors.employment_types && (
          <p className="mt-1 text-xs md:text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
            Please select at least one employment type
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
            Total Years of Experience <span className="text-red-500">*</span>
          </label>
          <select
            name="total_years_experience"
            value={formData.total_years_experience}
            onChange={handleInputChange}
            className={`w-full px-3 md:px-4 py-2 md:py-3 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] text-sm md:text-base ${
              errors.total_years_experience ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
            }`}
          >
            <option value="">Select experience</option>
            <option value="0">0 years</option>
            <option value="1">1 year</option>
            <option value="2">2 years</option>
            <option value="3">3 years</option>
            <option value="4">4 years</option>
            <option value="5">5 years</option>
            <option value="6">6 years</option>
            <option value="7">7 years</option>
            <option value="8">8 years</option>
            <option value="9">9 years</option>
            <option value="10">10 years</option>
            <option value="15">15 years</option>
            <option value="20">20 years</option>
            <option value="25">25 years</option>
            <option value="30">30 years</option>
          </select>
          {errors.total_years_experience && (
            <p className="mt-1 text-xs md:text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
              Please select your years of experience
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            Current Employer
          </label>
          <input
            type="text"
            name="current_employer"
            value={formData.current_employer}
            onChange={handleInputChange}
            className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
            placeholder="Tech Corp"
          />
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            Visa Status <span className="text-red-500">*</span>
          </label>
          <select
            name="visa_status"
            value={formData.visa_status}
            onChange={handleInputChange}
            className={`w-full px-3 md:px-4 py-2 md:py-3 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] text-sm md:text-base ${
              errors.visa_status ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
            }`}
          >
            <option value="">Select visa status</option>
            {visaStatuses.map((status) => (
              <option key={status} value={status}>
                {visaStatusLabels[status]}
              </option>
            ))}
          </select>
          {errors.visa_status && (
            <p className="mt-1 text-xs md:text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
              Please select your visa status
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            Job Seeking Status <span className="text-red-500">*</span>
          </label>
          <select
            name="job_seeking_status"
            value={formData.job_seeking_status}
            onChange={handleInputChange}
            className={`w-full px-3 md:px-4 py-2 md:py-3 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] text-sm md:text-base ${
              errors.job_seeking_status ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
            }`}
          >
            <option value="">Select status</option>
            {jobSeekingStatuses.map((status) => (
              <option key={status} value={status}>
                {jobSeekingStatusLabels[status]}
              </option>
            ))}
          </select>
          {errors.job_seeking_status && (
            <p className="mt-1 text-xs md:text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
              Please select your job seeking status
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            Desired Annual Package (USD) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
            <input
              type="number"
              name="desired_annual_package"
              value={formData.desired_annual_package}
              onChange={handleInputChange}
              className={`w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base ${
                errors.desired_annual_package ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
              }`}
              placeholder="800000"
            />
          </div>
          {errors.desired_annual_package && (
            <p className="mt-1 text-xs md:text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
              Please enter your desired annual package
            </p>
          )}
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
            className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
            placeholder="Asian"
          />
        </div>
      </div>

      {/* Job History */}
      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
          Job History <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Company"
              value={currentJob.company}
              onChange={(e) => setCurrentJob(prev => ({ ...prev, company: e.target.value }))}
              className="px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
            />
            <input
              type="text"
              placeholder="Position"
              value={currentJob.position}
              onChange={(e) => setCurrentJob(prev => ({ ...prev, position: e.target.value }))}
              className="px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
            />
            <input
              type="text"
              placeholder="Duration (e.g., 2 years)"
              value={currentJob.duration}
              onChange={(e) => setCurrentJob(prev => ({ ...prev, duration: e.target.value }))}
              className="px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
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
          {formData.job_history.map((job, index) => (
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
        {errors.job_history && (
          <p className="mt-1 text-xs md:text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
            Please add at least one job history entry
          </p>
        )}
      </div>

      {/* Skills */}
      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
          Skills <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={currentSkill}
            onChange={(e) => setCurrentSkill(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
            className="flex-1 px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
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
        {errors.skills && (
          <p className="mt-1 text-xs md:text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
            Please add at least one skill
          </p>
        )}
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
          Education <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Degree"
              value={currentEducation.degree}
              onChange={(e) => setCurrentEducation(prev => ({ ...prev, degree: e.target.value }))}
              className="px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
            />
            <input
              type="text"
              placeholder="Institution"
              value={currentEducation.institution}
              onChange={(e) => setCurrentEducation(prev => ({ ...prev, institution: e.target.value }))}
              className="px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
            />
            <input
              type="text"
              placeholder="Year"
              value={currentEducation.year}
              onChange={(e) => setCurrentEducation(prev => ({ ...prev, year: e.target.value }))}
              className="px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
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
        {errors.education && (
          <p className="mt-1 text-xs md:text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
            Please add at least one education entry
          </p>
        )}
      </div>

      {/* Certifications */}
      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
          Certifications
        </label>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Certification Name"
              value={currentCertification.name}
              onChange={(e) => setCurrentCertification(prev => ({ ...prev, name: e.target.value }))}
              className="px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
            />
            <input
              type="text"
              placeholder="Issuer"
              value={currentCertification.issuer}
              onChange={(e) => setCurrentCertification(prev => ({ ...prev, issuer: e.target.value }))}
              className="px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="date"
              placeholder="Date Received"
              value={currentCertification.date}
              onChange={(e) => setCurrentCertification(prev => ({ ...prev, date: e.target.value }))}
              className="px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
              style={{ colorScheme: 'light' }}
            />
            <input
              type="date"
              placeholder="Expiry Date (Optional)"
              value={currentCertification.expiryDate}
              onChange={(e) => setCurrentCertification(prev => ({ ...prev, expiryDate: e.target.value }))}
              className="px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
              style={{ colorScheme: 'light' }}
            />
          </div>
          <button
            type="button"
            onClick={addCertification}
            className="px-3 md:px-4 py-2 bg-[#273469] text-white rounded-xl hover:bg-[#1e2749] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <Plus className="h-3 w-3 md:h-4 md:w-4 inline mr-1" />
            Add Certification
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {(formData.certifications || []).map((cert, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="text-sm">
                <span className="font-medium">{cert.name}</span>
                {cert.issuer && <span> by {cert.issuer}</span>}
                {(cert.date || cert.expiryDate) && (
                  <span className="text-gray-600">
                    {cert.date && ` (Received: ${new Date(cert.date).toLocaleDateString()}`}
                    {cert.expiryDate && (cert.date ? `, Expires: ${new Date(cert.expiryDate).toLocaleDateString()}` : ` (Expires: ${new Date(cert.expiryDate).toLocaleDateString()}`)}
                    {(cert.date || cert.expiryDate) && ')'}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeCertification(index)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
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
            className="flex-1 px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
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
          {(formData.languages_spoken || []).map((language) => (
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
              className="px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
            />
            <input
              type="text"
              placeholder="Position"
              value={currentReference.position}
              onChange={(e) => setCurrentReference(prev => ({ ...prev, position: e.target.value }))}
              className="px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
            />
            <input
              type="text"
              placeholder="Contact (email/phone)"
              value={currentReference.contact}
              onChange={(e) => setCurrentReference(prev => ({ ...prev, contact: e.target.value }))}
              className="px-3 py-2 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
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
          name="additional_notes"
          value={formData.additional_notes}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
          placeholder="Open to remote work"
        />
      </div>

      {/* Optional Information */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Optional Information</h4>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="veteran_status"
            checked={formData.veteran_status}
            onChange={handleInputChange}
            className="h-3 w-3 md:h-4 md:w-4 text-[#273469] focus:ring-[#273469] border-[#e4d9ff] rounded"
          />
          <label className="text-xs md:text-sm text-gray-700">I am a veteran</label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="disability_status"
            checked={formData.disability_status}
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

          {/* Back Button - COMMENTED OUT: Email verification not used for now */}
          {/* <div className="mt-6 md:mt-8 text-center">
            <Link
              to="/candidate/verification"
              className="inline-flex items-center gap-2 text-[#30343f] hover:text-[#1e2749] transition-colors duration-300 font-medium text-sm md:text-base"
            >
              <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
              Back to Email Verification
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
