import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle, AlertCircle, Shield, Users, DollarSign, MapPin, ArrowLeft, Sparkles, Briefcase, Building2, X, Plus, ChevronDown, KeyRound, RotateCcw, Clock } from "lucide-react";
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
    total_years_experience: "",
    visa_status: "",
    require_visa_sponsorship: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [isJobRolesOpen, setIsJobRolesOpen] = useState(false);
  const [isEmploymentTypesOpen, setIsEmploymentTypesOpen] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [showOtherJobRoleInput, setShowOtherJobRoleInput] = useState(false);
  const [otherJobRoleInput, setOtherJobRoleInput] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [otpExpiresAt, setOtpExpiresAt] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  
  const jobRolesRef = useRef(null);
  const employmentTypesRef = useRef(null);
  const otpInputRefs = useRef([]);
  
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

  useEffect(() => {
    if (!otpExpiresAt) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(otpExpiresAt).getTime();
      const remaining = Math.max(0, Math.floor((expiry - now) / 1000));
      
      setTimeRemaining(remaining);
      
      if (remaining === 0) {
        clearInterval(interval);
        setTimeRemaining(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [otpExpiresAt]);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'us_work_authorized') {
        setFormData(prev => ({
          ...prev,
          us_work_authorized: checked
        }));
      } else if (name === 'require_visa_sponsorship') {
        setFormData(prev => ({
          ...prev,
          require_visa_sponsorship: checked
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
    if (role === "Other") {
      setShowOtherJobRoleInput(true);
      setIsJobRolesOpen(false);
      return;
    }
    
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

  const handleAddOtherJobRole = () => {
    if (otherJobRoleInput.trim() && !formData.desired_job_roles.includes(otherJobRoleInput.trim())) {
      setFormData(prev => ({
        ...prev,
        desired_job_roles: [...prev.desired_job_roles, otherJobRoleInput.trim()]
      }));
      setOtherJobRoleInput("");
      setShowOtherJobRoleInput(false);
      if (errors.desired_job_roles) {
        setErrors(prev => ({
          ...prev,
          desired_job_roles: ""
        }));
      }
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
    if (!formData.total_years_experience || formData.total_years_experience === "") {
      newErrors.total_years_experience = "Total years of experience is required";
    }
    if (!formData.visa_status || formData.visa_status === "") {
      newErrors.visa_status = "Visa status is required";
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
        total_years_experience: parseInt(formData.total_years_experience) || 0,
        visa_status: formData.visa_status,
        require_visa_sponsorship: formData.require_visa_sponsorship
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
        toast.error("Invalid response from server. Please try again.");
        return;
      }

      if (!response.ok) {
        const backendErrors = {};
        if (data.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
          Object.keys(data.errors).forEach((field) => {
            const fieldError = data.errors[field];
            backendErrors[field] = Array.isArray(fieldError) ? fieldError[0] : fieldError;
          });
        }
        if (Object.keys(backendErrors).length > 0) {
          setErrors(prev => ({ ...prev, ...backendErrors }));
        }
        toast.error(data.message || "Registration failed. Please try again.");
        return;
      }
      
      if (data.message && data.message.includes("OTP")) {
        setOtpExpiresAt(data.expires_at || null);
        setShowOtpVerification(true);
        setOtp("");
        setOtpError("");
        setResendCooldown(60);
        toast.success("OTP sent to your email/mobile. Please verify to complete registration.");
        setTimeout(() => {
          if (otpInputRefs.current[0]) {
            otpInputRefs.current[0].focus();
          }
        }, 100);
      } else {
        toast.success("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/candidate/login", { 
            state: { 
              email: formData.email, 
              message: "Registration successful! Please login to continue."
            }
          });
        }, 1500);
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error("Network error. Please check your internet connection and try again.");
      } else {
        const errorMessage = error.message || "Registration failed. Please try again.";
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

  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = otp.split('');
    newOtp[index] = value;
    setOtp(newOtp.join('').slice(0, 4));
    setOtpError("");
    if (value && index < 3 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && otpInputRefs.current[index - 1]) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{4}$/.test(pastedData)) {
      setOtp(pastedData);
      setOtpError("");
      if (otpInputRefs.current[3]) {
        otpInputRefs.current[3].focus();
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 4) {
      setOtpError("Please enter a valid 4-digit OTP");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: otp
        }),
      });

      let data;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        toast.error("Invalid response from server. Please try again.");
        return;
      }

      if (!response.ok) {
        const otpErrorMsg = data.errors?.otp 
          ? (Array.isArray(data.errors.otp) ? data.errors.otp[0] : data.errors.otp)
          : data.message || "Invalid or expired OTP";
        setOtpError(otpErrorMsg);
        toast.error("OTP verification failed. Please check and try again.");
        return;
      }

      toast.success("Registration completed successfully! Redirecting to login...");
      
      setTimeout(() => {
        navigate("/candidate/login", { 
          state: { 
            email: formData.email, 
            message: "Registration successful! Please login to continue."
          }
        });
      }, 1500);
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error("Network error. Please check your internet connection and try again.");
      } else {
        toast.error("OTP verification failed. Please try again.");
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    setIsResendingOtp(true);
    setOtpError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email
        }),
      });

      let data;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        toast.error("Invalid response from server. Please try again.");
        return;
      }

      if (!response.ok) {
        toast.error(data.message || data.error || "Failed to resend OTP. Please try again.");
        return;
      }

      setOtpExpiresAt(data.expires_at || null);
      setOtp("");
      setResendCooldown(60);
      toast.success("OTP resent successfully. Please check your email/mobile.");
      setTimeout(() => {
        if (otpInputRefs.current[0]) {
          otpInputRefs.current[0].focus();
        }
      }, 100);
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error("Network error. Please check your internet connection and try again.");
      } else {
        toast.error("Failed to resend OTP. Please try again.");
      }
    } finally {
      setIsResendingOtp(false);
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

          {!showOtpVerification && (
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
                          placeholder="Enter your mobile number"
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
                      {formData.desired_job_roles && formData.desired_job_roles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {formData.desired_job_roles.map((role, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e4d9ff]/80 text-[#273469] rounded-lg text-xs md:text-sm font-medium border border-[#e4d9ff]"
                            >
                              <span>{role}</span>
                              <button
                                type="button"
                                onClick={() => toggleJobRole(role)}
                                className="hover:text-red-600 transition-colors focus:outline-none rounded p-0.5"
                                aria-label={`Remove ${role}`}
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
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
                              className="flex items-center gap-3 px-4 py-3 hover:bg-[#e4d9ff]/20 cursor-pointer border-b border-[#e4d9ff]/30 transition-colors"
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
                          <label
                            className="flex items-center gap-3 px-4 py-3 hover:bg-[#e4d9ff]/20 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={false}
                              onChange={() => toggleJobRole("Other")}
                              className="h-4 w-4 text-[#273469] focus:ring-[#273469] border-[#e4d9ff] rounded cursor-pointer"
                            />
                            <span className="text-sm text-[#30343f]">Other</span>
                          </label>
                        </div>
                      )}
                      {showOtherJobRoleInput && (
                        <div className="mt-3 p-4 bg-[#e4d9ff]/10 border-2 border-[#e4d9ff] rounded-xl">
                          <label className="block text-sm font-semibold text-[#1e2749] mb-2.5">
                            Enter Custom Job Role
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={otherJobRoleInput}
                              onChange={(e) => setOtherJobRoleInput(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddOtherJobRole();
                                }
                              }}
                              className="flex-1 px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469]/20 focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f]/50 text-sm md:text-base bg-white border-[#e4d9ff] hover:border-[#273469]/30"
                              placeholder="Enter custom job role"
                            />
                            <button
                              type="button"
                              onClick={handleAddOtherJobRole}
                              disabled={!otherJobRoleInput.trim()}
                              className="px-4 py-3 bg-[#273469] text-white rounded-xl hover:bg-[#1e2749] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#273469]/20"
                            >
                              <Plus className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowOtherJobRoleInput(false);
                                setOtherJobRoleInput("");
                              }}
                              className="px-4 py-3 bg-gray-200 text-[#30343f] rounded-xl hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400/20"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
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
                          US Work Authorization
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
                          Visa Sponsorship
                        </label>
                        <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer hover:bg-[#e4d9ff]/10 transition-colors duration-300 border-[#e4d9ff] hover:border-[#273469]/30">
                          <input
                            type="checkbox"
                            name="require_visa_sponsorship"
                            checked={formData.require_visa_sponsorship}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-[#273469] border-[#e4d9ff] rounded focus:ring-[#273469] cursor-pointer"
                          />
                          <span className="text-sm md:text-base text-[#30343f]">
                            Do you require visa sponsorship now & in future
                          </span>
                        </label>
                        {errors.require_visa_sponsorship && (
                          <p className="mt-2 text-xs md:text-sm text-red-600 flex items-center gap-1.5">
                            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>{errors.require_visa_sponsorship}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
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

                      <div>
                        <label className="block text-sm font-semibold text-[#1e2749] mb-2.5">
                          Visa Status <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#30343f]/60 z-10" />
                          <select
                            name="visa_status"
                            value={formData.visa_status}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469]/20 focus:border-[#273469] transition-all duration-300 text-[#30343f] text-sm md:text-base bg-white appearance-none cursor-pointer ${
                              errors.visa_status ? 'border-red-300 bg-red-50/50' : 'border-[#e4d9ff] hover:border-[#273469]/30'
                            }`}
                          >
                            <option value="">Select visa status</option>
                            <option value="us_citizen">US Citizen</option>
                            <option value="permanent_resident">Permanent Resident</option>
                            <option value="h1b">H1B</option>
                            <option value="opt_cpt">OPT/CPT</option>
                            <option value="other">Other</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#30343f]/70 pointer-events-none" />
                        </div>
                        {errors.visa_status && (
                          <p className="mt-2 text-xs md:text-sm text-red-600 flex items-center gap-1.5">
                            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>{errors.visa_status}</span>
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
          )}

          {!showOtpVerification && (
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
          )}
        </div>
      </div>

      {showOtpVerification && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#e4d9ff] max-w-md w-full p-6 md:p-8 animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#e4d9ff] rounded-2xl mb-4">
                <KeyRound className="h-8 w-8 text-[#273469]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1e2749] mb-2">
                Verify Your Email
              </h2>
              <p className="text-sm md:text-base text-[#30343f]">
                We've sent a 4-digit OTP to
              </p>
              <p className="text-sm md:text-base font-semibold text-[#273469] mt-1">
                {formData.email}
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#1e2749] mb-3 text-center">
                  Enter OTP Code
                </label>
                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3].map((index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[index] || ""}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      className={`w-14 h-14 md:w-16 md:h-16 text-center text-xl md:text-2xl font-bold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469]/20 focus:border-[#273469] transition-all duration-300 ${
                        otpError
                          ? 'border-red-300 bg-red-50/50'
                          : 'border-[#e4d9ff] hover:border-[#273469]/30'
                      }`}
                    />
                  ))}
                </div>
                {otpError && (
                  <p className="mt-3 text-sm text-red-600 flex items-center justify-center gap-1.5">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{otpError}</span>
                  </p>
                )}
              </div>

              {timeRemaining !== null && timeRemaining > 0 && (
                <div className="flex items-center justify-center gap-2 text-sm text-[#30343f]">
                  <Clock className="h-4 w-4" />
                  <span>OTP expires in <span className="font-semibold text-[#273469]">{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span></span>
                </div>
              )}

              {timeRemaining === 0 && (
                <div className="text-center">
                  <p className="text-sm text-red-600 mb-2">OTP has expired</p>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResendingOtp || resendCooldown > 0}
                    className="text-sm text-[#273469] hover:text-[#1e2749] font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                  >
                    <RotateCcw className={`h-4 w-4 ${isResendingOtp ? 'animate-spin' : ''}`} />
                    {isResendingOtp
                      ? "Resending..."
                      : resendCooldown > 0
                      ? `Resend OTP (${resendCooldown}s)`
                      : "Resend OTP"}
                  </button>
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isVerifyingOtp || otp.length !== 4}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl font-bold text-base text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] bg-[#273469] hover:bg-[#1e2749] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-[#273469]/20"
                >
                  {isVerifyingOtp ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Verify OTP</span>
                    </>
                  )}
                </button>

                {resendCooldown === 0 && timeRemaining !== 0 && (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResendingOtp}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl font-medium text-sm text-[#273469] hover:text-[#1e2749] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RotateCcw className={`h-4 w-4 ${isResendingOtp ? 'animate-spin' : ''}`} />
                    {isResendingOtp ? "Resending..." : "Didn't receive OTP? Resend"}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowOtpVerification(false);
                    setOtp("");
                    setOtpError("");
                    setOtpExpiresAt(null);
                    setTimeRemaining(null);
                    setResendCooldown(0);
                  }}
                  className="w-full py-2.5 px-6 rounded-xl font-medium text-sm text-[#30343f] hover:text-[#1e2749] transition-colors duration-300"
                >
                  Back to Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateRegistration;
