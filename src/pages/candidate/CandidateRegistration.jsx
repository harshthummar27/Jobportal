import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle, AlertCircle, Shield, Users, DollarSign, MapPin, ArrowLeft, Sparkles, Briefcase, Building2, X, Plus, ChevronDown } from "lucide-react";
import { toast } from 'react-toastify';
import Header from "../../Components/Header";

const BenefitsGrid = ({ children, className = "" }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      {children}
    </div>
  );
};

const CandidateRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
    mobile_number: "",
    preferred_locations: [],
    desired_job_roles: [],
    employment_types: [],
    us_work_authorized: false,
    total_years_experience: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [isJobRolesOpen, setIsJobRolesOpen] = useState(false);
  const [isEmploymentTypesOpen, setIsEmploymentTypesOpen] = useState(false);
  
  const jobRolesRef = useRef(null);
  const employmentTypesRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (jobRolesRef.current && !jobRolesRef.current.contains(event.target)) {
        setIsJobRolesOpen(false);
      }
      if (employmentTypesRef.current && !employmentTypesRef.current.contains(event.target)) {
        setIsEmploymentTypesOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'us_work_authorized') {
        setFormData(prev => ({
          ...prev,
          us_work_authorized: checked
        }));
      }
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === "" ? "" : parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };
  
  const toggleJobRole = (role) => {
    setFormData(prev => {
      const currentRoles = prev.desired_job_roles || [];
      if (currentRoles.includes(role)) {
        return {
          ...prev,
          desired_job_roles: currentRoles.filter(r => r !== role)
        };
      } else {
        return {
          ...prev,
          desired_job_roles: [...currentRoles, role]
        };
      }
    });
    if (errors.desired_job_roles) {
      setErrors(prev => ({
        ...prev,
        desired_job_roles: ""
      }));
    }
  };
  
  const toggleEmploymentType = (type) => {
    setFormData(prev => {
      const currentTypes = prev.employment_types || [];
      if (currentTypes.includes(type)) {
        return {
          ...prev,
          employment_types: currentTypes.filter(t => t !== type)
        };
      } else {
        return {
          ...prev,
          employment_types: [...currentTypes, type]
        };
      }
    });
    if (errors.employment_types) {
      setErrors(prev => ({
        ...prev,
        employment_types: ""
      }));
    }
  };

  const handleAddLocation = () => {
    if (locationInput.trim() && !formData.preferred_locations.includes(locationInput.trim())) {
      setFormData(prev => ({
        ...prev,
        preferred_locations: [...prev.preferred_locations, locationInput.trim()]
      }));
      setLocationInput("");
      if (errors.preferred_locations) {
        setErrors(prev => ({
          ...prev,
          preferred_locations: ""
        }));
      }
    }
  };

  const handleRemoveLocation = (location) => {
    setFormData(prev => ({
      ...prev,
      preferred_locations: prev.preferred_locations.filter(loc => loc !== location)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.mobile_number.trim()) newErrors.mobile_number = "Mobile number is required";
    if (!formData.preferred_locations || formData.preferred_locations.length === 0) {
      newErrors.preferred_locations = "At least one preferred location is required";
    }
    if (!formData.desired_job_roles || formData.desired_job_roles.length === 0) {
      newErrors.desired_job_roles = "At least one desired job role is required";
    }
    if (!formData.employment_types || formData.employment_types.length === 0) {
      newErrors.employment_types = "At least one employment type is required";
    }
    if (typeof formData.us_work_authorized !== 'boolean') {
      newErrors.us_work_authorized = "US work authorization status is required";
    }
    if (!formData.total_years_experience || formData.total_years_experience === "") {
      newErrors.total_years_experience = "Total years of experience is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const mobileRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (formData.mobile_number && !mobileRegex.test(formData.mobile_number.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.mobile_number = "Please enter a valid mobile number";
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (formData.total_years_experience !== "" && (isNaN(formData.total_years_experience) || formData.total_years_experience < 0)) {
      newErrors.total_years_experience = "Please enter a valid number of years";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        mobile_number: formData.mobile_number,
        preferred_locations: formData.preferred_locations,
        desired_job_roles: formData.desired_job_roles,
        employment_types: formData.employment_types,
        us_work_authorized: formData.us_work_authorized,
        total_years_experience: parseInt(formData.total_years_experience) || 0
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      let data;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        toast.error("Invalid response from server. Please try again.");
        return;
      }

      if (!response.ok) {
        const backendErrors = {};
        let generalError = null;

        if (data.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
          Object.keys(data.errors).forEach((field) => {
            const fieldError = data.errors[field];
            if (Array.isArray(fieldError)) {
              backendErrors[field] = fieldError[0] || fieldError.join(', ');
            } else if (typeof fieldError === 'string') {
              backendErrors[field] = fieldError;
            }
          });
        }

        if (data.message) {
          generalError = data.message;
        } else if (data.error) {
          generalError = data.error;
        } else if (data.errors && typeof data.errors === 'string') {
          generalError = data.errors;
        } else if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          generalError = data.errors[0] || data.errors.join(', ');
        } else if (!Object.keys(backendErrors).length) {
          generalError = 'Registration failed. Please try again.';
        }

        if (Object.keys(backendErrors).length > 0) {
          setErrors(prev => ({ ...prev, ...backendErrors }));
        }

        if (generalError) {
          toast.error("Registration failed. Please try again.");
        } else if (Object.keys(backendErrors).length > 0) {
          toast.error("Please check the form for errors and try again.");
        } else {
          toast.error("Registration failed. Please try again.");
        }
        return;
      }
      
      toast.success("Registration successful! Redirecting to login...");
      
      setTimeout(() => {
        navigate("/candidate/login", { 
          state: { 
            email: formData.email, 
            message: "Registration successful! Please login to continue."
          }
        });
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error("Network error. Please check your internet connection and try again.");
      } else {
        let errorMessage = error.message || "Registration failed. Please try again.";
        
        if (errorMessage.toLowerCase().includes("email")) {
          setErrors(prev => ({ ...prev, email: errorMessage }));
        } else if (errorMessage.toLowerCase().includes("mobile") || errorMessage.toLowerCase().includes("phone")) {
          setErrors(prev => ({ ...prev, mobile_number: errorMessage }));
        } else if (errorMessage.toLowerCase().includes("password")) {
          setErrors(prev => ({ ...prev, password: errorMessage }));
        } else {
          toast.error(errorMessage);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaff] text-[#1e2749] overflow-x-hidden">
      <Header />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#e4d9ff] rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-[#30343f] rounded-full opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-[#e4d9ff] rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative pt-24 pb-20 lg:pt-32 lg:pb-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 rounded-full bg-[#e4d9ff] text-[#273469] text-xs md:text-sm font-medium mb-4 md:mb-6">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              Join VettedPool
            </div>
            
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
              <h1 className="text-lg md:text-xl lg:text-2xl font-black text-[#1e2749] px-4">
                Candidate Registration
              </h1>
            </div>
            
            <p className="text-sm md:text-base lg:text-lg text-[#30343f] max-w-2xl mx-auto leading-relaxed px-4">
              Access exclusive job opportunities with pre-vetted companies and competitive packages
            </p>
          </div>

          <div className="mb-6 md:mb-8">
            <Link 
              to="/candidate-info" 
              className="inline-flex items-center gap-2 text-[#30343f] hover:text-[#1e2749] transition-colors duration-300"
            >
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
              <span className="font-medium text-sm md:text-base">Back to Candidate Info</span>
            </Link>
          </div>

          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl border-2 border-[#e4d9ff] overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8 lg:p-10">
              <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
                <div className="border-b border-[#e4d9ff]/50 pb-6 md:pb-8">
                  <h2 className="text-xl md:text-2xl font-bold text-[#1e2749] mb-6 md:mb-8 flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-[#e4d9ff] rounded-xl flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 md:h-5 md:w-5 text-[#273469]" />
                    </div>
                    <span>Registration Details</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-[#1e2749] mb-2.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#30343f]/60" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469]/20 focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f]/50 text-sm md:text-base bg-white ${
                            errors.name ? 'border-red-300 bg-red-50/50' : 'border-[#e4d9ff] hover:border-[#273469]/30'
                          }`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-2 text-xs md:text-sm text-red-600 flex items-center gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#1e2749] mb-2.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#30343f]/60" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469]/20 focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f]/50 text-sm md:text-base bg-white ${
                            errors.email ? 'border-red-300 bg-red-50/50' : 'border-[#e4d9ff] hover:border-[#273469]/30'
                          }`}
                          placeholder="your.email@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-2 text-xs md:text-sm text-red-600 flex items-center gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#1e2749] mb-2.5">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#30343f]/60" />
                        <input
                          type="tel"
                          name="mobile_number"
                          value={formData.mobile_number}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469]/20 focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f]/50 text-sm md:text-base bg-white ${
                            errors.mobile_number ? 'border-red-300 bg-red-50/50' : 'border-[#e4d9ff] hover:border-[#273469]/30'
                          }`}
                          placeholder="+919999999999"
                        />
                      </div>
                      {errors.mobile_number && (
                        <p className="mt-2 text-xs md:text-sm text-red-600 flex items-center gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>{errors.mobile_number}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#1e2749] mb-6 md:mb-8 flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-[#e4d9ff] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-4 w-4 md:h-5 md:w-5 text-[#273469]" />
                    </div>
                    <span>Job Preferences</span>
                  </h2>
                  
                  <div className="space-y-5 md:space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#1e2749] mb-2.5">
                        Preferred Locations <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#30343f]/60 z-10" />
                        <input
                          type="text"
                          value={locationInput}
                          onChange={(e) => setLocationInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddLocation();
                            }
                          }}
                          className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469]/20 focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f]/50 text-sm md:text-base bg-white ${
                            errors.preferred_locations ? 'border-red-300 bg-red-50/50' : 'border-[#e4d9ff] hover:border-[#273469]/30'
                          }`}
                          placeholder="Enter location and press Enter or click +"
                        />
                        <button
                          type="button"
                          onClick={handleAddLocation}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#273469] hover:text-[#1e2749] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#273469]/20 rounded p-1"
                          aria-label="Add location"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      </div>
                      {formData.preferred_locations.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {formData.preferred_locations.map((location, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e4d9ff]/80 text-[#273469] rounded-lg text-xs md:text-sm font-medium border border-[#e4d9ff]"
                            >
                              <span>{location}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveLocation(location)}
                                className="hover:text-red-600 transition-colors focus:outline-none rounded p-0.5"
                                aria-label={`Remove ${location}`}
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      {errors.preferred_locations && (
                        <p className="mt-2 text-xs md:text-sm text-red-600 flex items-center gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>{errors.preferred_locations}</span>
                        </p>
                      )}
                    </div>

                    <div ref={jobRolesRef} className="relative">
                      <label className="block text-sm font-semibold text-[#1e2749] mb-2.5">
                        Desired Job Roles <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsJobRolesOpen(!isJobRolesOpen)}
                        className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469]/20 focus:border-[#273469] transition-all duration-300 text-[#30343f] text-sm md:text-base text-left flex items-center justify-between bg-white ${
                          errors.desired_job_roles ? 'border-red-300 bg-red-50/50' : 'border-[#e4d9ff] hover:border-[#273469]/30'
                        }`}
                      >
                        <span className="truncate">
                          {(formData.desired_job_roles || []).length > 0
                            ? `${(formData.desired_job_roles || []).length} role(s) selected`
                            : 'Select desired job roles'}
                        </span>
                        <ChevronDown className={`h-5 w-5 text-[#30343f]/70 transition-transform duration-300 flex-shrink-0 ml-2 ${isJobRolesOpen ? 'transform rotate-180' : ''}`} />
                      </button>
                      {isJobRolesOpen && (
                        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-[#e4d9ff] rounded-xl shadow-xl max-h-60 overflow-y-auto">
                          {[
                            "Software Engineer", "Product Manager", "Data Scientist", "Designer",
                            "Marketing Manager", "Sales Representative", "Operations Manager", "Finance Analyst",
                            "HR Specialist", "Customer Success", "DevOps Engineer", "Business Analyst",
                            "Project Manager", "UX Designer", "QA Engineer", "System Administrator"
                          ].map((role) => (
                            <label
                              key={role}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-[#e4d9ff]/20 cursor-pointer border-b border-[#e4d9ff]/30 last:border-b-0 transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={(formData.desired_job_roles || []).includes(role)}
                                onChange={() => toggleJobRole(role)}
                                className="h-4 w-4 text-[#273469] focus:ring-[#273469] border-[#e4d9ff] rounded cursor-pointer"
                              />
                              <span className="text-sm text-[#30343f]">{role}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      {errors.desired_job_roles && (
                        <p className="mt-2 text-xs md:text-sm text-red-600 flex items-center gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>{errors.desired_job_roles}</span>
                        </p>
                      )}
                    </div>

                    <div ref={employmentTypesRef} className="relative">
                      <label className="block text-sm font-semibold text-[#1e2749] mb-2.5">
                        Employment Types <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsEmploymentTypesOpen(!isEmploymentTypesOpen)}
                        className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469]/20 focus:border-[#273469] transition-all duration-300 text-[#30343f] text-sm md:text-base text-left flex items-center justify-between bg-white ${
                          errors.employment_types ? 'border-red-300 bg-red-50/50' : 'border-[#e4d9ff] hover:border-[#273469]/30'
                        }`}
                      >
                        <span className="truncate">
                          {(formData.employment_types || []).length > 0
                            ? `${(formData.employment_types || []).length} type(s) selected`
                            : 'Select employment types'}
                        </span>
                        <ChevronDown className={`h-5 w-5 text-[#30343f]/70 transition-transform duration-300 flex-shrink-0 ml-2 ${isEmploymentTypesOpen ? 'transform rotate-180' : ''}`} />
                      </button>
                      {isEmploymentTypesOpen && (
                        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-[#e4d9ff] rounded-xl shadow-xl max-h-60 overflow-y-auto">
                          {[
                            { value: 'full_time', label: 'Full-time' },
                            { value: 'part_time', label: 'Part-time' },
                            { value: 'contract', label: 'Contract' },
                            { value: 'internship', label: 'Internship' }
                          ].map((type) => (
                            <label
                              key={type.value}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-[#e4d9ff]/20 cursor-pointer border-b border-[#e4d9ff]/30 last:border-b-0 transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={(formData.employment_types || []).includes(type.value)}
                                onChange={() => toggleEmploymentType(type.value)}
                                className="h-4 w-4 text-[#273469] focus:ring-[#273469] border-[#e4d9ff] rounded cursor-pointer"
                              />
                              <span className="text-sm text-[#30343f]">{type.label}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      {errors.employment_types && (
                        <p className="mt-2 text-xs md:text-sm text-red-600 flex items-center gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>{errors.employment_types}</span>
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-[#1e2749] mb-2.5">
                          US Work Authorization <span className="text-red-500">*</span>
                        </label>
                        <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer hover:bg-[#e4d9ff]/10 transition-colors duration-300 border-[#e4d9ff] hover:border-[#273469]/30">
                          <input
                            type="checkbox"
                            name="us_work_authorized"
                            checked={formData.us_work_authorized}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-[#273469] border-[#e4d9ff] rounded focus:ring-[#273469] cursor-pointer"
                          />
                          <span className="text-sm md:text-base text-[#30343f]">
                            I am authorized to work in the United States
                          </span>
                        </label>
                        {errors.us_work_authorized && (
                          <p className="mt-2 text-xs md:text-sm text-red-600 flex items-center gap-1.5">
                            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>{errors.us_work_authorized}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#1e2749] mb-2.5">
                          Total Years of Experience <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#30343f]/60" />
                          <input
                            type="number"
                            name="total_years_experience"
                            value={formData.total_years_experience}
                            onChange={handleInputChange}
                            min="0"
                            className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469]/20 focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f]/50 text-sm md:text-base bg-white ${
                              errors.total_years_experience ? 'border-red-300 bg-red-50/50' : 'border-[#e4d9ff] hover:border-[#273469]/30'
                            }`}
                            placeholder="Enter years of experience"
                          />
                        </div>
                        {errors.total_years_experience && (
                          <p className="mt-2 text-xs md:text-sm text-red-600 flex items-center gap-1.5">
                            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>{errors.total_years_experience}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#1e2749] mb-2.5">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#30343f]/60" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469]/20 focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f]/50 text-sm md:text-base bg-white ${
                            errors.password ? 'border-red-300 bg-red-50/50' : 'border-[#e4d9ff] hover:border-[#273469]/30'
                          }`}
                          placeholder="Create a strong password (min. 8 characters)"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#30343f]/70 hover:text-[#273469] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#273469]/20 rounded p-1"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-2 text-xs md:text-sm text-red-600 flex items-center gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>{errors.password}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#e4d9ff]/50">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-base md:text-lg text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] bg-[#273469] hover:bg-[#1e2749] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-[#273469]/20"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Registering...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        <span>Register as Candidate</span>
                      </>
                    )}
                  </button>

                  <div className="text-center mt-6">
                    <p className="text-sm md:text-base text-[#30343f]">
                      Already have an account?{" "}
                      <Link 
                        to="/candidate/login" 
                        className="text-[#273469] hover:text-[#1e2749] font-semibold transition-colors duration-300 underline-offset-2 hover:underline"
                      >
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-12 md:mt-16">
            <BenefitsGrid>
              <div className="text-center p-4 md:p-6 bg-white rounded-xl md:rounded-2xl shadow-lg border-2 border-[#e4d9ff] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-[#e4d9ff] rounded-xl md:rounded-2xl mb-3 md:mb-4">
                  <Shield className="h-5 w-5 md:h-6 md:w-6 text-[#273469]" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-[#1e2749] mb-2">Privacy Protected</h3>
                <p className="text-[#30343f] leading-relaxed text-xs md:text-sm">Your current company and personal details remain confidential</p>
              </div>
              
              <div className="text-center p-4 md:p-6 bg-white rounded-xl md:rounded-2xl shadow-lg border-2 border-[#e4d9ff] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-[#e4d9ff] rounded-xl md:rounded-2xl mb-3 md:mb-4">
                  <Users className="h-5 w-5 md:h-6 md:w-6 text-[#273469]" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-[#1e2749] mb-2">Pre-vetted Companies</h3>
                <p className="text-[#30343f] leading-relaxed text-xs md:text-sm">Access to verified employers with competitive packages</p>
              </div>
              
              <div className="text-center p-4 md:p-6 bg-white rounded-xl md:rounded-2xl shadow-lg border-2 border-[#e4d9ff] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-[#e4d9ff] rounded-xl md:rounded-2xl mb-3 md:mb-4">
                  <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-[#273469]" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-[#1e2749] mb-2">Better Opportunities</h3>
                <p className="text-[#30343f] leading-relaxed text-xs md:text-sm">Find roles that match your skills and salary expectations</p>
              </div>
            </BenefitsGrid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateRegistration;
