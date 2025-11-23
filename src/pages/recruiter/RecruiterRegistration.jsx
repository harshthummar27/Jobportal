import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Building, Phone, CheckCircle, AlertCircle, ArrowLeft, Sparkles, Users, Briefcase, FileText, KeyRound, RotateCcw, Clock } from "lucide-react";
import { toast } from 'react-toastify';
import Header from "../../Components/Header";

// Mobile Slider Component
const MobileSlider = ({ children, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const sliderRef = useRef(null);
  const autoPlayRef = useRef(null);
  
  const items = React.Children.toArray(children);
  const totalItems = items.length;

  // Auto-play functionality
  useEffect(() => {
    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalItems);
      }, 4000); // Change slide every 4 seconds
    };

    const stopAutoPlay = () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };

    startAutoPlay();

    // Pause auto-play on hover/touch
    const sliderElement = sliderRef.current;
    if (sliderElement) {
      sliderElement.addEventListener('mouseenter', stopAutoPlay);
      sliderElement.addEventListener('mouseleave', startAutoPlay);
      sliderElement.addEventListener('touchstart', stopAutoPlay);
      sliderElement.addEventListener('touchend', () => {
        setTimeout(startAutoPlay, 2000); // Resume after 2 seconds
      });
    }

    return () => {
      stopAutoPlay();
      if (sliderElement) {
        sliderElement.removeEventListener('mouseenter', stopAutoPlay);
        sliderElement.removeEventListener('mouseleave', startAutoPlay);
        sliderElement.removeEventListener('touchstart', stopAutoPlay);
        sliderElement.removeEventListener('touchend', startAutoPlay);
      }
    };
  }, [totalItems]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Desktop Grid View */}
      <div className="hidden md:grid md:grid-cols-3 gap-6">
        {children}
      </div>

      {/* Mobile Slider View */}
      <div className="md:hidden">
        <div 
          ref={sliderRef}
          className="relative overflow-hidden rounded-2xl"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {items.map((item, index) => (
              <div key={index} className="w-full flex-shrink-0 px-4">
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Dots - Bottom */}
        <div className="flex justify-center mt-6 space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-primary scale-125' 
                  : 'bg-purple-accent hover:bg-primary hover:scale-110'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const RecruiterRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile_number: "",
    company_name: "",
    company_website: "",
    company_size: "",
    industry: "",
    company_description: "",
    contact_person_name: "",
    contact_person_title: "",
    contact_email: "",
    contact_phone: "",
    office_address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    agreement_accepted: false,
    agreement_terms: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [otpExpiresAt, setOtpExpiresAt] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  
  const otpInputRefs = useRef([]);

  const totalSteps = 5;

  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, [currentStep]);

  // OTP expiry countdown
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

  // Resend cooldown countdown
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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    setErrors(prev => {
      if (prev[name]) {
        return {
          ...prev,
          [name]: ""
        };
      }
      return prev;
    });
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (!formData.mobile_number.trim()) newErrors.mobile_number = "Mobile number is required";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
          newErrors.email = "Please enter a valid email address";
        }

        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (formData.mobile_number && !phoneRegex.test(formData.mobile_number.replace(/[\s\-\(\)]/g, ''))) {
          newErrors.mobile_number = "Please enter a valid mobile number";
        }

        if (formData.password && formData.password.length < 8) {
          newErrors.password = "Password must be at least 8 characters long";
        }
        break;

      case 2:
        if (!formData.company_name.trim()) newErrors.company_name = "Company name is required";

        if (formData.company_website && formData.company_website.trim()) {
          const urlRegex = /^https?:\/\/.+/;
          if (!urlRegex.test(formData.company_website)) {
            newErrors.company_website = "Please enter a valid website URL (starting with http:// or https://)";
          }
        }
        break;

      case 3:
        if (!formData.contact_person_name.trim()) newErrors.contact_person_name = "Contact person name is required";
        if (!formData.contact_email.trim()) newErrors.contact_email = "Contact email is required";
        if (!formData.contact_phone.trim()) newErrors.contact_phone = "Contact phone is required";

        // Contact email validation
        const contactEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.contact_email && !contactEmailRegex.test(formData.contact_email)) {
          newErrors.contact_email = "Please enter a valid contact email address";
        }

        // Contact phone validation
        const contactPhoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (formData.contact_phone && !contactPhoneRegex.test(formData.contact_phone.replace(/[\s\-\(\)]/g, ''))) {
          newErrors.contact_phone = "Please enter a valid contact phone number";
        }
        break;

      case 4:
        break;

      case 5:
        if (!formData.agreement_accepted) {
          newErrors.agreement_accepted = "You must accept the terms and conditions to continue";
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.mobile_number.trim()) newErrors.mobile_number = "Mobile number is required";
    if (!formData.company_name.trim()) newErrors.company_name = "Company name is required";
    if (!formData.contact_person_name.trim()) newErrors.contact_person_name = "Contact person name is required";
    if (!formData.contact_email.trim()) newErrors.contact_email = "Contact email is required";
    if (!formData.contact_phone.trim()) newErrors.contact_phone = "Contact phone is required";
    if (!formData.agreement_accepted) newErrors.agreement_accepted = "You must accept the terms and conditions";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (formData.contact_email && !emailRegex.test(formData.contact_email)) {
      newErrors.contact_email = "Please enter a valid contact email address";
    }

    // Mobile number validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (formData.mobile_number && !phoneRegex.test(formData.mobile_number.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.mobile_number = "Please enter a valid mobile number";
    }
    if (formData.contact_phone && !phoneRegex.test(formData.contact_phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.contact_phone = "Please enter a valid contact phone number";
    }

    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    // Website URL validation (if provided)
    if (formData.company_website && formData.company_website.trim()) {
      const urlRegex = /^https?:\/\/.+/;
      if (!urlRegex.test(formData.company_website)) {
        newErrors.company_website = "Please enter a valid website URL (starting with http:// or https://)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        mobile_number: formData.mobile_number,
        company_name: formData.company_name,
        company_website: formData.company_website || null,
        company_size: formData.company_size || null,
        industry: formData.industry || null,
        company_description: formData.company_description || null,
        contact_person_name: formData.contact_person_name,
        contact_person_title: formData.contact_person_title || null,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        office_address: formData.office_address || null,
        city: formData.city || null,
        state: formData.state || null,
        country: formData.country || null,
        postal_code: formData.postal_code || null,
        agreement_accepted: formData.agreement_accepted,
        agreement_terms: formData.agreement_accepted ? "I agree to the terms and conditions." : ""
      };

      const requiredFields = ['name', 'email', 'password', 'mobile_number', 'company_name', 'contact_person_name', 'contact_email', 'contact_phone'];
      const emptyFields = requiredFields.filter(field => !registrationData[field] || registrationData[field].trim() === '');
      
      if (emptyFields.length > 0) {
        setErrors(prev => ({
          ...prev,
          submit: `Please fill in all required fields: ${emptyFields.join(', ')}`
        }));
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recruiter/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      let data;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        throw new Error("Invalid response from server. Please try again.");
      }

      if (!response.ok) {
        const newErrors = {};
        let hasFieldErrors = false;
        
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
            hasFieldErrors = true;
          });
          
          if (hasFieldErrors) {
            setErrors(prev => ({ ...prev, ...newErrors }));
            
            const fieldToStepMap = {
              name: 1,
              email: 1,
              password: 1,
              mobile_number: 1,
              company_name: 2,
              company_website: 2,
              company_size: 2,
              industry: 2,
              company_description: 2,
              contact_person_name: 3,
              contact_person_title: 3,
              contact_email: 3,
              contact_phone: 3,
              office_address: 4,
              city: 4,
              state: 4,
              country: 4,
              postal_code: 4,
              agreement_accepted: 5
            };
            
            const errorStep = Object.keys(newErrors).reduce((minStep, field) => {
              const step = fieldToStepMap[field] || 1;
              return step < minStep ? step : minStep;
            }, 5);
            
            setCurrentStep(errorStep);
            toast.error("Registration failed. Please try again.");
            setIsLoading(false);
            return;
          }
        }
        
        const errorMessage = data.message || data.error || 'Registration failed';
        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }

      if (data && data.message && typeof data.message === 'string' && data.message.includes("OTP")) {
        setOtpExpiresAt(data.expires_at || null);
        setShowOtpVerification(true);
        setOtp("");
        setOtpError("");
        setResendCooldown(60);
        toast.success("OTP sent to your email/mobile. Please verify to complete registration.");
        setTimeout(() => {
          if (otpInputRefs.current && otpInputRefs.current[0]) {
            otpInputRefs.current[0].focus();
          }
        }, 100);
      } else {
        toast.success("Registration successful! Please login to continue.");
        navigate("/recruiter/login", { 
          state: { 
            email: formData.email, 
            message: "Registration successful! Please login to continue.",
            role: "recruiter"
          }
        });
      }
    } catch (error) {
      if (error.message) {
        if (error.message.includes('JSON') || error.message.includes('Failed to fetch')) {
          toast.error("Network error. Please check your connection and try again.");
        } else {
          const newErrors = {};
          if (error.message.toLowerCase().includes("email")) {
            newErrors.email = "Email already exists. Please use a different email.";
          }
          if (error.message.toLowerCase().includes("mobile") || error.message.toLowerCase().includes("phone")) {
            newErrors.mobile_number = "Mobile number already exists. Please use a different number.";
          }
          
          if (Object.keys(newErrors).length > 0) {
            setErrors(prev => ({ ...prev, ...newErrors }));
            toast.error("Please correct the errors and try again.");
          } else {
            toast.error(error.message || "Registration failed. Please try again.");
          }
        }
      } else {
        toast.error("Registration failed. Please try again.");
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
    
    if (!showOtpVerification) {
      return;
    }
    
    if (!otp || otp.length !== 4 || !/^\d{4}$/.test(otp)) {
      setOtpError("Please enter a valid 4-digit OTP");
      return;
    }

    if (!formData.email) {
      setOtpError("Email is required for verification");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recruiter/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
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
        navigate("/recruiter/login", { 
          state: { 
            email: formData.email, 
            message: "Registration successful! Please login to continue.",
            role: "recruiter"
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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recruiter/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
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

  const companySizes = [
    "1-10",
    "11-50", 
    "51-100",
    "101-500",
    "501-1000",
    "1000+"
  ];

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Retail",
    "Consulting",
    "Real Estate",
    "Media & Entertainment",
    "Government",
    "Non-profit",
    "Other"
  ];


  const Step1 = () => (
    <div className="space-y-4 md:space-y-6">
      <div className="mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-bold text-[#1e2749] mb-2 flex items-center gap-2">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-[#e4d9ff] rounded-lg flex items-center justify-center">
            <User className="h-3 w-3 md:h-4 md:w-4 text-[#273469]" />
          </div>
          Personal Information
        </h2>
        <p className="text-sm text-[#30343f]">Tell us about yourself</p>
      </div>
      
      <div className="space-y-4 md:space-y-5">
        <div>
          <label className="block text-xs md:text-sm font-semibold text-[#1e2749] mb-2 md:mb-3">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-4 md:px-6 py-3 md:py-4 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base ${
              errors.name ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
            }`}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="mt-2 text-xs md:text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs md:text-sm font-semibold text-[#1e2749] mb-2 md:mb-3">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-[#30343f]" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full pl-10 md:pl-12 pr-4 md:pr-6 py-3 md:py-4 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base ${
                errors.email ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
              }`}
              placeholder="your.email@company.com"
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-xs md:text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs md:text-sm font-semibold text-[#1e2749] mb-2 md:mb-3">
            Mobile Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-[#30343f]" />
            <input
              type="tel"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleInputChange}
              className={`w-full pl-10 md:pl-12 pr-4 md:pr-6 py-3 md:py-4 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base ${
                errors.mobile_number ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
              }`}
              placeholder="Enter your mobile number"
            />
          </div>
          {errors.mobile_number && (
            <p className="mt-2 text-xs md:text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
              {errors.mobile_number}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs md:text-sm font-semibold text-[#1e2749] mb-2 md:mb-3">
            Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-[#30343f]" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full pl-10 md:pl-12 pr-12 md:pr-14 py-3 md:py-4 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base ${
                errors.password ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
              }`}
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-[#30343f] hover:text-[#1e2749] transition-colors duration-300"
            >
              {showPassword ? <EyeOff className="h-4 w-4 md:h-5 md:w-5" /> : <Eye className="h-4 w-4 md:h-5 md:w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-xs md:text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
              {errors.password}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-4 md:space-y-6">
      <div className="mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-bold text-[#1e2749] mb-2 flex items-center gap-2">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-[#e4d9ff] rounded-lg flex items-center justify-center">
            <Building className="h-3 w-3 md:h-4 md:w-4 text-[#273469]" />
          </div>
          Company Information
        </h2>
        <p className="text-sm text-[#30343f]">Tell us about your company</p>
      </div>
      
      <div className="space-y-4 md:space-y-5">
        <div>
          <label className="block text-xs md:text-sm font-semibold text-[#1e2749] mb-2 md:mb-3">
            Company Name *
          </label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleInputChange}
            className={`w-full px-4 md:px-6 py-3 md:py-4 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base ${
              errors.company_name ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
            }`}
            placeholder="Enter your company name"
          />
          {errors.company_name && (
            <p className="mt-2 text-xs md:text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
              {errors.company_name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs md:text-sm font-semibold text-[#1e2749] mb-2 md:mb-3">
            Company Website
          </label>
          <input
            type="url"
            name="company_website"
            value={formData.company_website}
            onChange={handleInputChange}
            className={`w-full px-4 md:px-6 py-3 md:py-4 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base ${
              errors.company_website ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
            }`}
            placeholder="https://yourcompany.com"
          />
          {errors.company_website && (
            <p className="mt-2 text-xs md:text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
              {errors.company_website}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-xs md:text-sm font-semibold text-[#1e2749] mb-2 md:mb-3">
              Company Size
            </label>
            <select
              name="company_size"
              value={formData.company_size}
              onChange={handleInputChange}
              className={`w-full px-4 md:px-6 py-3 md:py-4 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] text-sm md:text-base ${
                errors.company_size ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
              }`}
            >
              <option value="">Select company size</option>
              {companySizes.map((size) => (
                <option key={size} value={size}>
                  {size} employees
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-semibold text-[#1e2749] mb-2 md:mb-3">
              Industry
            </label>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              className={`w-full px-4 md:px-6 py-3 md:py-4 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] text-sm md:text-base ${
                errors.industry ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
              }`}
            >
              <option value="">Select industry</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-semibold text-[#1e2749] mb-2 md:mb-3">
            Company Description
          </label>
          <textarea
            name="company_description"
            value={formData.company_description}
            onChange={handleInputChange}
            rows={3}
            className={`w-full px-4 md:px-6 py-3 md:py-4 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base resize-none ${
              errors.company_description ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
            }`}
            placeholder="Brief description of your company"
          />
        </div>
      </div>
    </div>
  );

  const Step3 = () => (
    <div className="space-y-4 md:space-y-6">
      <div className="mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-bold text-[#1e2749] mb-2 flex items-center gap-2">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-[#e4d9ff] rounded-lg flex items-center justify-center">
            <Users className="h-3 w-3 md:h-4 md:w-4 text-[#273469]" />
          </div>
          Contact Information
        </h2>
        <p className="text-sm text-[#30343f]">Primary contact details</p>
      </div>
      
      <div className="space-y-4 md:space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-xs md:text-sm font-semibold text-[#1e2749] mb-2 md:mb-3">
              Contact Person Name *
            </label>
            <input
              type="text"
              name="contact_person_name"
              value={formData.contact_person_name}
              onChange={handleInputChange}
              className={`w-full px-4 md:px-6 py-3 md:py-4 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base ${
                errors.contact_person_name ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
              }`}
              placeholder="Contact person's full name"
            />
            {errors.contact_person_name && (
              <p className="mt-2 text-xs md:text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
                {errors.contact_person_name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs md:text-sm font-semibold text-[#1e2749] mb-2 md:mb-3">
              Contact Person Title
            </label>
            <input
              type="text"
              name="contact_person_title"
              value={formData.contact_person_title}
              onChange={handleInputChange}
              className={`w-full px-4 md:px-6 py-3 md:py-4 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base ${
                errors.contact_person_title ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
              }`}
              placeholder="e.g., HR Manager, CEO"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-xs md:text-sm font-semibold text-[#1e2749] mb-2 md:mb-3">
              Contact Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-[#30343f]" />
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleInputChange}
                className={`w-full pl-10 md:pl-12 pr-4 md:pr-6 py-3 md:py-4 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base ${
                  errors.contact_email ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
                }`}
                placeholder="contact@company.com"
              />
            </div>
            {errors.contact_email && (
              <p className="mt-2 text-xs md:text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
                {errors.contact_email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs md:text-sm font-semibold text-[#1e2749] mb-2 md:mb-3">
              Contact Phone *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-[#30343f]" />
              <input
                type="tel"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleInputChange}
                className={`w-full pl-10 md:pl-12 pr-4 md:pr-6 py-3 md:py-4 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base ${
                  errors.contact_phone ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
                }`}
                placeholder="Enter your mobile number"
              />
            </div>
            {errors.contact_phone && (
              <p className="mt-2 text-xs md:text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
                {errors.contact_phone}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const Step4 = () => (
    <div className="space-y-4 md:space-y-6">
      <div className="mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-bold text-[#1e2749] mb-2 flex items-center gap-2">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-[#e4d9ff] rounded-lg flex items-center justify-center">
            <Briefcase className="h-3 w-3 md:h-4 md:w-4 text-[#273469]" />
          </div>
          Office Address
        </h2>
        <p className="text-sm text-[#30343f]">Company office location (optional)</p>
      </div>
      
      <div className="space-y-4 md:space-y-5">
        <div>
          <label className="block text-xs md:text-sm font-semibold text-[#1e2749] mb-2 md:mb-3">
            Office Address
          </label>
          <textarea
            name="office_address"
            value={formData.office_address}
            onChange={handleInputChange}
            rows={2}
            className={`w-full px-4 md:px-6 py-3 md:py-4 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base resize-none ${
              errors.office_address ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
            }`}
            placeholder="Enter office address"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-xs md:text-sm font-semibold text-[#1e2749] mb-2 md:mb-3">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`w-full px-4 md:px-6 py-3 md:py-4 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base ${
                errors.city ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
              }`}
              placeholder="Enter city"
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm font-semibold text-[#1e2749] mb-2 md:mb-3">
              State
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className={`w-full px-4 md:px-6 py-3 md:py-4 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base ${
                errors.state ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
              }`}
              placeholder="Enter state"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-xs md:text-sm font-semibold text-[#1e2749] mb-2 md:mb-3">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className={`w-full px-4 md:px-6 py-3 md:py-4 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base ${
                errors.country ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
              }`}
              placeholder="Enter country"
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm font-semibold text-[#1e2749] mb-2 md:mb-3">
              Postal Code
            </label>
            <input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleInputChange}
              className={`w-full px-4 md:px-6 py-3 md:py-4 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base ${
                errors.postal_code ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
              }`}
              placeholder="Enter postal code"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const Step5 = () => (
    <div className="space-y-4 md:space-y-6">
      <div className="mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-bold text-[#1e2749] mb-2 flex items-center gap-2">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-[#e4d9ff] rounded-lg flex items-center justify-center">
            <FileText className="h-3 w-3 md:h-4 md:w-4 text-[#273469]" />
          </div>
          Terms & Agreement
        </h2>
        <p className="text-sm text-[#30343f]">Please review and accept our terms</p>
      </div>
      
      <div className="space-y-4 md:space-y-5">
        <div className="bg-[#f8f9ff] border-2 border-[#e4d9ff] rounded-xl p-4 md:p-6">
          <h3 className="text-lg font-bold text-[#1e2749] mb-3">Terms and Conditions</h3>
          <div className="text-sm text-[#30343f] space-y-3">
            <p>By registering as a recruiter on VettedPool, you agree to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use the platform only for legitimate recruitment purposes</li>
              <li>Maintain confidentiality of candidate information</li>
              <li>Provide accurate company and contact information</li>
              <li>Comply with all applicable employment laws and regulations</li>
              <li>Respect candidate privacy and data protection requirements</li>
              <li>Not share login credentials with unauthorized persons</li>
            </ul>
            <p className="font-semibold">By checking the box below, you confirm that you have read, understood, and agree to these terms and conditions.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              name="agreement_accepted"
              checked={formData.agreement_accepted}
              onChange={handleInputChange}
              className="mt-1 w-4 h-4 text-[#273469] border-2 border-[#e4d9ff] rounded focus:ring-[#273469] focus:ring-1"
            />
            <label className="text-sm text-[#30343f] leading-relaxed">
              I have read and agree to the <span className="text-[#273469] font-semibold">Terms and Conditions</span> and <span className="text-[#273469] font-semibold">Privacy Policy</span>
            </label>
          </div>
          {errors.agreement_accepted && (
            <p className="text-xs md:text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
              {errors.agreement_accepted}
            </p>
          )}
        </div>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-[#fafaff] text-[#1e2749] overflow-x-hidden">
      <Header />
      
      <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
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
                Recruiter Registration
              </h1>
            </div>
            
            <p className="text-sm md:text-base lg:text-lg text-[#30343f] max-w-2xl mx-auto leading-relaxed px-4">
              Access pre-vetted candidates and streamline your hiring process with our professional network
            </p>
          </div>

          <div className="mb-6 md:mb-8">
            <Link
              to="/recruiter-info"
              className="inline-flex items-center gap-2 text-[#30343f] hover:text-[#1e2749] transition-colors duration-300 font-medium text-sm md:text-base"
            >
              <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
              Back to Recruiter Info
            </Link>
          </div>

          {!showOtpVerification && (
            <>
              <div className="mb-6 md:mb-8">
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <span className="text-xs md:text-sm font-semibold text-[#1e2749]">Step {currentStep} of {totalSteps}</span>
                  <span className="text-xs md:text-sm text-[#30343f]">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
                </div>
                <div className="w-full bg-[#e4d9ff] rounded-full h-2 md:h-3">
                  <div 
                    className="bg-gradient-to-r from-[#273469] to-[#1e2749] h-2 md:h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  ></div>
                </div>
              </div>

          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl border-2 border-[#e4d9ff] overflow-hidden">
            <div className="p-3 sm:p-4 md:p-6 lg:p-8">
              <form onSubmit={handleSubmit}>
                {currentStep === 1 && Step1()}
                {currentStep === 2 && Step2()}
                {currentStep === 3 && Step3()}
                {currentStep === 4 && Step4()}
                {currentStep === 5 && Step5()}

                {errors.submit && (
                  <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {errors.submit}
                    </p>
                  </div>
                )}

                <div className="flex justify-between mt-6 md:mt-8">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 border-2 border-[#e4d9ff] text-[#30343f] rounded-xl hover:bg-[#e4d9ff] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-sm md:text-base"
                  >
                    <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
                    Previous
                  </button>

                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-[#273469] text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold hover:bg-[#1e2749] transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-sm md:text-base"
                    >
                      Next
                      <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 rotate-180" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#273469] text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold hover:bg-[#1e2749] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:transform-none text-sm md:text-base"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-white"></div>
                          Registering...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />
                          Register as Recruiter
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

              <div className="mt-12 md:mt-16">
                <MobileSlider>
                  <div className="text-center p-4 md:p-6 bg-white rounded-xl md:rounded-2xl shadow-lg border-2 border-[#e4d9ff] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                    <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-[#e4d9ff] rounded-xl md:rounded-2xl mb-3 md:mb-4">
                      <User className="h-5 w-5 md:h-6 md:w-6 text-[#273469]" />
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-[#1e2749] mb-2">Pre-vetted Candidates</h3>
                    <p className="text-[#30343f] leading-relaxed text-xs md:text-sm">Access to thoroughly screened and qualified professionals</p>
                  </div>
                  
                  <div className="text-center p-4 md:p-6 bg-white rounded-xl md:rounded-2xl shadow-lg border-2 border-[#e4d9ff] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                    <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-[#e4d9ff] rounded-xl md:rounded-2xl mb-3 md:mb-4">
                      <Building className="h-5 w-5 md:h-6 md:w-6 text-[#273469]" />
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-[#1e2749] mb-2">Streamlined Process</h3>
                    <p className="text-[#30343f] leading-relaxed text-xs md:text-sm">Reduce time-to-hire with our efficient matching system</p>
                  </div>
                  
                  <div className="text-center p-4 md:p-6 bg-white rounded-xl md:rounded-2xl shadow-lg border-2 border-[#e4d9ff] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                    <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-[#e4d9ff] rounded-xl md:rounded-2xl mb-3 md:mb-4">
                      <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-[#273469]" />
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-[#1e2749] mb-2">Quality Guarantee</h3>
                    <p className="text-[#30343f] leading-relaxed text-xs md:text-sm">All candidates are verified and ready for immediate placement</p>
                  </div>
                </MobileSlider>
              </div>
            </>
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

            <form onSubmit={handleVerifyOtp} className="space-y-6" onKeyDown={(e) => {
              if (e.key === 'Enter' && otp.length !== 4) {
                e.preventDefault();
              }
            }}>
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
                      onKeyDown={(e) => {
                        handleOtpKeyDown(index, e);
                        if (e.key === 'Enter' && otp.length !== 4) {
                          e.preventDefault();
                        }
                      }}
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

export default RecruiterRegistration;
