import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Building, Phone, CheckCircle, AlertCircle, ArrowLeft, Sparkles, Users, Briefcase } from "lucide-react";
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
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    companySize: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    agreeToPrivacy: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!formData.companySize) newErrors.companySize = "Company size is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    // Password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms agreement
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }
    if (!formData.agreeToPrivacy) {
      newErrors.agreeToPrivacy = "You must agree to the privacy policy";
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
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, make API call to register recruiter
      console.log("Registration data:", formData);
      
      // Navigate to email verification
      navigate("/recruiter/verification", { 
        state: { email: formData.email, type: "registration" }
      });
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ submit: "Registration failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const companySizes = [
    "1-10 employees",
    "11-50 employees", 
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1000+ employees"
  ];

  return (
    <div className="min-h-screen bg-main text-primary overflow-x-hidden">
      <Header />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-accent rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-dark rounded-full opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-purple-accent rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative pt-24 pb-20 lg:pt-32 lg:pb-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 rounded-full bg-purple-accent text-primary-color text-xs md:text-sm font-medium mb-4 md:mb-6">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              Join VettedPool
            </div>
            
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
              {/* <div className="w-12 h-12 bg-[#273469] rounded-2xl flex items-center justify-center">
                <Building className="h-6 w-6 text-white" />
              </div> */}
              <h1 className="text-lg md:text-xl lg:text-2xl font-black text-primary px-4">
                Recruiter Registration
              </h1>
            </div>
            
            <p className="text-sm md:text-base lg:text-lg text-secondary max-w-2xl mx-auto leading-relaxed px-4">
              Access pre-vetted candidates and streamline your hiring process with our professional network
            </p>
          </div>

          {/* Back Button */}
          <div className="mb-4 md:mb-5">
            <Link 
              to="/recruiter-info" 
              className="inline-flex items-center gap-2 text-[#30343f] hover:text-[#1e2749] transition-colors duration-300"
            >
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
              <span className="font-medium text-sm md:text-base">Back to Recruiter Info</span>
            </Link>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl border-2 border-[#e4d9ff] overflow-hidden">
            <div className="p-3 sm:p-6 md:p-8 lg:p-10">
              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                {/* Personal Information */}
                <div className="space-y-6 md:space-y-8">
                  <div className="border-b border-[#e4d9ff] pb-6 md:pb-8">
                    <h2 className="text-lg md:text-2xl font-bold text-[#1e2749] mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-[#e4d9ff] rounded-xl flex items-center justify-center">
                        <User className="h-4 w-4 md:h-5 md:w-5 text-[#273469]" />
                      </div>
                      Personal Information
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="block text-xs md:text-sm font-semibold text-[#1e2749] mb-2 md:mb-3">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full px-4 md:px-6 py-3 md:py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base ${
                            errors.firstName ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
                          }`}
                          placeholder="Enter your first name"
                        />
                        {errors.firstName && (
                          <p className="mt-2 text-xs md:text-sm text-red-600 flex items-center gap-2">
                            <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
                            {errors.firstName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs md:text-sm font-semibold text-[#1e2749] mb-2 md:mb-3">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full px-4 md:px-6 py-3 md:py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base ${
                            errors.lastName ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
                          }`}
                          placeholder="Enter your last name"
                        />
                        {errors.lastName && (
                          <p className="mt-2 text-xs md:text-sm text-red-600 flex items-center gap-2">
                            <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
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
                            className={`w-full pl-10 md:pl-12 pr-4 md:pr-6 py-3 md:py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base ${
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
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-[#30343f]" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`w-full pl-10 md:pl-12 pr-4 md:pr-6 py-3 md:py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base ${
                              errors.phone ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
                            }`}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-2 text-xs md:text-sm text-red-600 flex items-center gap-2">
                            <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="border-b border-[#e4d9ff] pb-6 md:pb-8">
                    <h2 className="text-lg md:text-2xl font-bold text-[#1e2749] mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-[#e4d9ff] rounded-xl flex items-center justify-center">
                        <Building className="h-4 w-4 md:h-5 md:w-5 text-[#273469]" />
                      </div>
                      Company Information
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      <div className="sm:col-span-2">
                        <label className="block text-xs md:text-sm font-semibold text-[#1e2749] mb-2 md:mb-3">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          className={`w-full px-4 md:px-6 py-3 md:py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base ${
                            errors.companyName ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
                          }`}
                          placeholder="Enter your company name"
                        />
                        {errors.companyName && (
                          <p className="mt-2 text-xs md:text-sm text-red-600 flex items-center gap-2">
                            <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
                            {errors.companyName}
                          </p>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs md:text-sm font-semibold text-[#1e2749] mb-2 md:mb-3">
                          Company Size *
                        </label>
                        <select
                          name="companySize"
                          value={formData.companySize}
                          onChange={handleInputChange}
                          className={`w-full px-4 md:px-6 py-3 md:py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] text-sm md:text-base ${
                            errors.companySize ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
                          }`}
                        >
                          <option value="">Select company size</option>
                          {companySizes.map((size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                        {errors.companySize && (
                          <p className="mt-2 text-xs md:text-sm text-red-600 flex items-center gap-2">
                            <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
                            {errors.companySize}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Security */}
                  <div>
                    <h2 className="text-lg md:text-2xl font-bold text-[#1e2749] mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-[#e4d9ff] rounded-xl flex items-center justify-center">
                        <Lock className="h-4 w-4 md:h-5 md:w-5 text-[#273469]" />
                      </div>
                      Security
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
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
                            className={`w-full pl-10 md:pl-12 pr-12 md:pr-14 py-3 md:py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base ${
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

                      <div>
                        <label className="block text-xs md:text-sm font-semibold text-[#1e2749] mb-2 md:mb-3">
                          Confirm Password *
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-[#30343f]" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`w-full pl-10 md:pl-12 pr-12 md:pr-14 py-3 md:py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base ${
                              errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
                            }`}
                            placeholder="Confirm your password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-[#30343f] hover:text-[#1e2749] transition-colors duration-300"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4 md:h-5 md:w-5" /> : <Eye className="h-4 w-4 md:h-5 md:w-5" />}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="mt-2 text-xs md:text-sm text-red-600 flex items-center gap-2">
                            <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-start gap-3 md:gap-4">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 md:h-5 md:w-5 text-[#273469] focus:ring-[#273469] border-[#e4d9ff] rounded"
                    />
                    <label className="text-xs md:text-sm text-[#30343f] leading-relaxed">
                      I agree to the{" "}
                      <Link to="/terms" className="text-[#273469] hover:text-[#1e2749] font-semibold transition-colors duration-300">
                        Terms and Conditions
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-[#273469] hover:text-[#1e2749] font-semibold transition-colors duration-300">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-xs md:text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
                      {errors.agreeToTerms}
                    </p>
                  )}

                  <div className="flex items-start gap-3 md:gap-4">
                    <input
                      type="checkbox"
                      name="agreeToPrivacy"
                      checked={formData.agreeToPrivacy}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 md:h-5 md:w-5 text-[#273469] focus:ring-[#273469] border-[#e4d9ff] rounded"
                    />
                    <label className="text-xs md:text-sm text-[#30343f] leading-relaxed">
                      I consent to receive communications about candidate matches and platform updates
                    </label>
                  </div>
                  {errors.agreeToPrivacy && (
                    <p className="text-xs md:text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
                      {errors.agreeToPrivacy}
                    </p>
                  )}
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 md:p-4">
                    <p className="text-xs md:text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
                      {errors.submit}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 md:gap-3 py-3 md:py-4 px-6 md:px-8 rounded-xl font-bold text-sm md:text-lg text-white transition-all duration-300 transform hover:scale-105 active:scale-95 bg-[#273469] hover:bg-[#1e2749] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5" />
                      Create Recruiter Account
                    </>
                  )}
                </button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-xs md:text-sm text-[#30343f]">
                    Already have an account?{" "}
                    <Link to="/recruiter/login" className="text-[#273469] hover:text-[#1e2749] font-semibold transition-colors duration-300">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Benefits */}
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
        </div>
      </div>
    </div>
  );
};

export default RecruiterRegistration;
