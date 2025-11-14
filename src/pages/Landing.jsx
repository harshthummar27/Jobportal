import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Users,
  Briefcase,
  CheckCircle,
  Lock,
  Target,
  ArrowRight,
  Star,
  TrendingUp,
  Clock,
  Award,
  Globe,
  Zap,
  Play,
  ChevronRight,
  Check,
  Sparkles,
  Rocket,
  Heart,
  Eye,
  Brain,
  Code,
  Palette,
  ArrowDown,
  ArrowUp,
  Plus,
  Minus,
  X,
  Menu,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

// Modern Button Component
const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-offset-2 cursor-pointer transform hover:scale-105 active:scale-95";
  const variants = {
    primary:
      "bg-[#273469] text-white hover:bg-[#1e2749] focus:ring-[#273469] shadow-lg hover:shadow-xl",
    secondary:
      "bg-[#e4d9ff] text-[#273469] hover:bg-[#fafaff] focus:ring-[#e4d9ff] border-2 border-[#273469]",
    accent:
      "bg-[#30343f] text-white hover:bg-[#1e2749] focus:ring-[#30343f]",
    outline:
      "bg-transparent text-[#273469] border-2 border-[#273469] hover:bg-[#273469] hover:text-white focus:ring-[#273469]",
  };
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Floating Card Component
const FloatingCard = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Animated Counter
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref} className="font-black text-white text-4xl">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

// FAQ Item Component
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border-2 border-[#e4d9ff] shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 md:px-8 md:py-5 flex items-center justify-between text-left group"
      >
        <h3 className="text-base md:text-lg font-bold text-[#1e2749] pr-4 group-hover:text-[#273469] transition-colors">
          {question}
        </h3>
        <div className={`flex-shrink-0 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="h-5 w-5 md:h-6 md:w-6 text-[#273469]" />
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-4 md:px-8 md:pb-5">
          <p className="text-[#30343f] text-sm md:text-base leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

// Testimonials Slider Component - Auto-play with dots only, no arrows
const TestimonialsSlider = ({ children, className = "" }) => {
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
      {/* Slider Container */}
      <div 
        ref={sliderRef}
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-500 ease-in-out"
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
      <div className="flex justify-center mt-8 md:mt-10 space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-[#273469] scale-125' 
                : 'bg-[#e4d9ff] hover:bg-[#273469] hover:scale-110'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

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
      <div className="hidden md:grid md:grid-cols-3 gap-8">
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
                  ? 'bg-[#273469] scale-125' 
                  : 'bg-[#e4d9ff] hover:bg-[#273469] hover:scale-110'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Landing = () => {
  const [isVisible, setIsVisible] = useState({});
  
  // Initialize auth state synchronously from localStorage to prevent flash
  const checkAuthSync = () => {
    try {
      const token = localStorage.getItem('token');
      return !!token;
    } catch (error) {
      return false;
    }
  };
  
  const [isLoggedIn, setIsLoggedIn] = useState(checkAuthSync());

  // Update auth status when storage changes (for logout from other tabs)
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    
    // Listen for storage changes (for logout from other tabs)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-main text-primary overflow-x-hidden">
      {/* Header */}
      <Header />
      
      {/* Hero Section - Asymmetrical Design */}
      <section className="relative pt-20 pb-16 md:pt-24 md:pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-5 md:top-20 md:left-10 w-16 h-16 md:w-32 md:h-32 bg-purple-accent rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-20 right-10 md:top-40 md:right-20 w-12 h-12 md:w-24 md:h-24 bg-dark rounded-full opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-10 left-1/4 md:bottom-20 w-10 h-10 md:w-20 md:h-20 bg-purple-accent rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Side - Content */}
            <div 
              className={`transform transition-all duration-1000 ${
                isVisible.hero ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
              }`}
              data-animate
              id="hero"
            >
              <div className="inline-flex items-center px-3 py-2 md:px-4 rounded-full bg-[#e4d9ff] text-[#273469] text-xs md:text-sm font-medium mb-4 md:mb-6">
                <Sparkles className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                Trusted by 500+ Companies
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-black mb-4 md:mb-6 text-[#1e2749] leading-tight">
                Vetted
                <span className="block text-[#273469]">Pool</span>
              </h1>
              
              <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-[#30343f] leading-relaxed">
                Pre-screened. Pre-interviewed. 
                <span className="text-[#273469] font-semibold"> Prepped for you.</span>
              </p>
              
              <p className="text-base md:text-lg mb-8 md:mb-10 text-[#30343f] leading-relaxed">
                Access thoroughly vetted candidates ready for immediate placement.
                Save time and ensure quality with our comprehensive screening process.
              </p>
              
              {!isLoggedIn && (
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <Link to="/candidate-info" className="w-full sm:w-auto">
                    <Button size="lg" variant="primary" className="group w-full sm:w-auto">
                      <Users className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 group-hover:rotate-12 transition-transform duration-300" />
                      For Candidates
                      <ArrowRight className="ml-2 md:ml-3 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                  <Link to="/recruiter-info" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="group w-full sm:w-auto">
                      <Briefcase className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 group-hover:rotate-12 transition-transform duration-300" />
                      For Recruiters
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Right Side - Visual Elements */}
            <div 
              className={`transform transition-all duration-1000 delay-300 ${
                isVisible.hero ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
              }`}
              data-animate
            >
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl border-2 border-[#e4d9ff] transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#273469] rounded-xl flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-[#1e2749]">Quality Assured</h3>
                      <p className="text-sm md:text-base text-[#30343f]">Pre-vetted candidates</p>
                    </div>
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-2 h-2 bg-[#273469] rounded-full"></div>
                      <span className="text-sm md:text-base text-[#30343f]">Humanly screened candidates only</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-2 h-2 bg-[#273469] rounded-full"></div>
                      <span className="text-sm md:text-base text-[#30343f]">Transparent and simple platform</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-2 h-2 bg-[#273469] rounded-full"></div>
                      <span className="text-sm md:text-base text-[#30343f]">No demos no time wasting</span>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 bg-[#e4d9ff] p-3 md:p-4 rounded-xl shadow-lg transform -rotate-12 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-1 md:gap-2">
                    <Lock className="h-4 w-4 md:h-5 md:w-5 text-[#273469]" />
                    <span className="text-[#273469] font-semibold text-sm md:text-base">Secure</span>
                  </div>
                </div>

                <div className="absolute -bottom-2 -left-2 md:-bottom-4 md:-left-4 bg-[#30343f] p-3 md:p-4 rounded-xl shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-1 md:gap-2">
                    <Zap className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    <span className="text-white font-semibold text-sm md:text-base">Fast</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Diagonal Layout */}
      <section className="py-16 md:py-20 bg-[#273469] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#273469] to-[#1e2749] transform -skew-y-1"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
            <FloatingCard delay={100}>
              <div className="text-white">
                <div className="text-3xl md:text-5xl font-black mb-1 md:mb-2">
                  <AnimatedCounter end={5000} suffix="+" />
                </div>
                <p className="text-[#e4d9ff] font-medium text-sm md:text-base">Vetted Candidates</p>
              </div>
            </FloatingCard>
            <FloatingCard delay={200}>
              <div className="text-white">
                <div className="text-3xl md:text-5xl font-black mb-1 md:mb-2">
                  <AnimatedCounter end={98} suffix="%" />
                </div>
                <p className="text-[#e4d9ff] font-medium text-sm md:text-base">Success Rate</p>
              </div>
            </FloatingCard>
            <FloatingCard delay={300}>
              <div className="text-white">
                <div className="text-3xl md:text-5xl font-black mb-1 md:mb-2">
                  <AnimatedCounter end={24} suffix="hrs" />
                </div>
                <p className="text-[#e4d9ff] font-medium text-sm md:text-base">Avg. Placement</p>
              </div>
            </FloatingCard>
            <FloatingCard delay={400}>
              <div className="text-white">
                <div className="text-3xl md:text-5xl font-black mb-1 md:mb-2">
                  <AnimatedCounter end={150} suffix="+" />
                </div>
                <p className="text-[#e4d9ff] font-medium text-sm md:text-base">Companies</p>
              </div>
            </FloatingCard>
          </div>
        </div>
      </section>

      {/* Features Section - Hexagonal Grid with Mobile Slider */}
      <section className="py-12 md:py-18 bg-[#fafaff]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-15">
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-black mb-3 md:mb-4 text-[#1e2749]">
              Why Choose
              <span className=" text-[#273469]"> VettedPool?</span>
            </h2>
            <p className="text-sm md:text-base text-[#30343f] max-w-3xl mx-auto">
              A revolutionary platform designed for privacy, quality, and efficiency in recruitment.
            </p>
          </div>

          <MobileSlider>
            <FloatingCard delay={100}>
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border-2 border-[#e4d9ff] hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 group h-full">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#e4d9ff] rounded-2xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Lock className="h-6 w-6 md:h-7 md:w-7 text-[#273469]" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2 text-[#1e2749]">Complete Anonymity</h3>
                <p className="text-[#30343f] text-sm md:text-base leading-relaxed">
                  Candidates remain anonymous with unique code numbers. No direct contact information shared until both parties agree.
                </p>
              </div>
            </FloatingCard>

            <FloatingCard delay={200}>
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-2 border-[#e4d9ff] hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 group h-full">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#e4d9ff] rounded-2xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-6 w-6 md:h-7 md:w-7 text-[#273469]" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2 text-[#1e2749]">Pre-Vetted Quality</h3>
                <p className="text-[#30343f] text-sm md:text-base leading-relaxed">
                  Every candidate is pre-interviewed and screened. Access only verified, qualified professionals ready to work.
                </p>
              </div>
            </FloatingCard>

            <FloatingCard delay={300}>
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-2 border-[#e4d9ff] hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 group h-full">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#e4d9ff] rounded-2xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-6 w-6 md:h-7 md:w-7 text-[#273469]" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2 text-[#1e2749]">Advanced Filtering</h3>
                <p className="text-[#30343f] text-sm md:text-base leading-relaxed">
                  Search by skills, location, experience, visa status, and more. Find exactly who you need, when you need them.
                </p>
              </div>
            </FloatingCard>
          </MobileSlider>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-18 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-15">
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-black mb-3 md:mb-4 text-[#1e2749]">
              Benefits for
              <span className=" text-[#273469]"> Everyone</span>
            </h2>
            <p className="text-sm md:text-base text-[#30343f] max-w-3xl mx-auto">
              Discover what makes VettedPool the preferred choice for candidates and recruiters alike
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Candidates Benefits */}
            <FloatingCard delay={200}>
              <div className="bg-[#fafaff] p-6 md:p-8 rounded-2xl border-2 border-[#e4d9ff] shadow-lg h-full">
                <div className="flex items-center gap-3 md:gap-4 mb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-[#273469] rounded-2xl flex items-center justify-center">
                    <Users className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#1e2749]">For Candidates</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-[#273469] flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-[#1e2749] mb-1 text-sm md:text-base">Complete Privacy</h4>
                      <p className="text-[#30343f] text-xs md:text-sm">Your identity stays protected until you're ready to connect</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-[#273469] flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-[#1e2749] mb-1 text-sm md:text-base">Quality Opportunities</h4>
                      <p className="text-[#30343f] text-xs md:text-sm">Access to pre-screened, verified job opportunities</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-[#273469] flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-[#1e2749] mb-1 text-sm md:text-base">No Spam</h4>
                      <p className="text-[#30343f] text-xs md:text-sm">Only relevant matches from verified recruiters</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-[#273469] flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-[#1e2749] mb-1 text-sm md:text-base">Professional Support</h4>
                      <p className="text-[#30343f] text-xs md:text-sm">Dedicated team to help you throughout the process</p>
                    </div>
                  </div>
                </div>
              </div>
            </FloatingCard>

            {/* Recruiters Benefits */}
            <FloatingCard delay={400}>
              <div className="bg-[#fafaff] p-6 md:p-8 rounded-2xl border-2 border-[#e4d9ff] shadow-lg h-full">
                <div className="flex items-center gap-3 md:gap-4 mb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-[#30343f] rounded-2xl flex items-center justify-center">
                    <Briefcase className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#1e2749]">For Recruiters</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-[#273469] flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-[#1e2749] mb-1 text-sm md:text-base">Pre-Screened Talent</h4>
                      <p className="text-[#30343f] text-xs md:text-sm">Save time with candidates already verified and qualified</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-[#273469] flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-[#1e2749] mb-1 text-sm md:text-base">Reduced Costs</h4>
                      <p className="text-[#30343f] text-xs md:text-sm">Lower recruitment expenses with our streamlined process</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-[#273469] flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-[#1e2749] mb-1 text-sm md:text-base">Faster Placements</h4>
                      <p className="text-[#30343f] text-xs md:text-sm">Average placement time of just 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-[#273469] flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-[#1e2749] mb-1 text-sm md:text-base">Advanced Matching</h4>
                      <p className="text-[#30343f] text-xs md:text-sm">Powerful filters to find the perfect candidate match</p>
                    </div>
                  </div>
                </div>
              </div>
            </FloatingCard>
          </div>
        </div>
      </section>

      {/* How It Works - Matching Benefits Style */}
      <section className="py-12 md:py-18 bg-[#fafaff]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-15">
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-black mb-3 md:mb-4 text-[#1e2749]">
              How It
              <span className=" text-[#273469]"> Works</span>
            </h2>
            <p className="text-sm md:text-base text-[#30343f] max-w-3xl mx-auto">
              Simple steps to connect the right talent with the right opportunities
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* For Candidates */}
            <FloatingCard delay={200}>
              <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-[#e4d9ff] shadow-lg h-full">
                <div className="flex items-center gap-3 md:gap-4 mb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-[#273469] rounded-2xl flex items-center justify-center">
                    <Users className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#1e2749]">For Candidates</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#273469] text-white flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1e2749] mb-1 text-sm md:text-base">Create Your Profile</h4>
                      <p className="text-[#30343f] text-xs md:text-sm">Complete registration with your skills, experience, and preferences.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#273469] text-white flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1e2749] mb-1 text-sm md:text-base">Get Pre-Interviewed</h4>
                      <p className="text-[#30343f] text-xs md:text-sm">Our team validates your credentials and conducts initial screening.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#273469] text-white flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1e2749] mb-1 text-sm md:text-base">Receive Opportunities</h4>
                      <p className="text-[#30343f] text-xs md:text-sm">We connect you with recruiters while keeping your identity protected.</p>
                    </div>
                  </div>
                </div>
              </div>
            </FloatingCard>

            {/* For Recruiters */}
            <FloatingCard delay={400}>
              <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-[#e4d9ff] shadow-lg h-full">
                <div className="flex items-center gap-3 md:gap-4 mb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-[#30343f] rounded-2xl flex items-center justify-center">
                    <Briefcase className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#1e2749]">For Recruiters</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#30343f] text-white flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1e2749] mb-1 text-sm md:text-base">Sign Agreement</h4>
                      <p className="text-[#30343f] text-xs md:text-sm">Complete registration and sign our recruitment agreement.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#30343f] text-white flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1e2749] mb-1 text-sm md:text-base">Search & Filter</h4>
                      <p className="text-[#30343f] text-xs md:text-sm">Use advanced filters to find pre-vetted candidates that match your needs.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#30343f] text-white flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1e2749] mb-1 text-sm md:text-base">Select Candidates</h4>
                      <p className="text-[#30343f] text-xs md:text-sm">Choose candidates and we will arrange interviews with you.</p>
                    </div>
                  </div>
                </div>
              </div>
            </FloatingCard>
          </div>
        </div>
      </section>

      {/* Testimonials - Card Stack Design with Mobile Slider */}
      <section className="py-12 md:py-18 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-15">
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-black mb-3 md:mb-4 text-[#1e2749]">
              What Our Users
              <span className="text-[#273469]"> Say</span>
            </h2>
            <p className="text-sm md:text-base text-[#30343f] max-w-3xl mx-auto">
              Trusted by thousands of professionals and companies worldwide
            </p>
          </div>

          <TestimonialsSlider>
            <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-[#e4d9ff]  transition-all duration-500 transform hover:-translate-y-1 h-full">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 md:h-5 md:w-5 text-[#273469] fill-current" />
                ))}
              </div>
              <p className="text-[#30343f] mb-6 leading-relaxed italic text-sm md:text-base">
                "VettedPool has revolutionized our hiring process. The quality of candidates is exceptional, and the time saved is incredible."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#273469] rounded-full flex items-center justify-center mr-3 md:mr-4 text-white font-bold text-sm md:text-base">
                  JS
                </div>
                <div>
                  <p className="font-semibold text-[#1e2749] text-sm md:text-base">John Smith</p>
                  <p className="text-[#30343f] text-xs md:text-sm">HR Director, TechCorp</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-[#e4d9ff] transition-all duration-500 transform hover:-translate-y-2 h-full">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 md:h-5 md:w-5 text-[#273469] fill-current" />
                ))}
              </div>
              <p className="text-[#30343f] mb-6 leading-relaxed italic text-sm md:text-base">
                "As a candidate, I love the privacy and quality of opportunities. The pre-screening process is thorough and professional."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#273469] rounded-full flex items-center justify-center mr-3 md:mr-4 text-white font-bold text-sm md:text-base">
                  MJ
                </div>
                <div>
                  <p className="font-semibold text-[#1e2749] text-sm md:text-base">Maria Johnson</p>
                  <p className="text-[#30343f] text-xs md:text-sm">Software Engineer</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-[#e4d9ff] transition-all duration-500 transform hover:-translate-y-2 h-full">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 md:h-5 md:w-5 text-[#273469] fill-current" />
                ))}
              </div>
              <p className="text-[#30343f] mb-6 leading-relaxed italic text-sm md:text-base">
                "The platform's filtering capabilities are outstanding. We found the perfect candidate in just 24 hours!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#273469] rounded-full flex items-center justify-center mr-3 md:mr-4 text-white font-bold text-sm md:text-base">
                  DW
                </div>
                <div>
                  <p className="font-semibold text-[#1e2749] text-sm md:text-base">David Wilson</p>
                  <p className="text-[#30343f] text-xs md:text-sm">CTO, StartupXYZ</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-[#e4d9ff]  transition-all duration-500 transform hover:-translate-y-1 h-full">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 md:h-5 md:w-5 text-[#273469] fill-current" />
                ))}
              </div>
              <p className="text-[#30343f] mb-6 leading-relaxed italic text-sm md:text-base">
                "The anonymous system protected my privacy perfectly while I was still actively working. Found my dream job without any awkwardness with my current employer."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#273469] rounded-full flex items-center justify-center mr-3 md:mr-4 text-white font-bold text-sm md:text-base">
                  SK
                </div>
                <div>
                  <p className="font-semibold text-[#1e2749] text-sm md:text-base">Sarah Kim</p>
                  <p className="text-[#30343f] text-xs md:text-sm">Senior Developer</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-[#e4d9ff]  transition-all duration-500 transform hover:-translate-y-1 h-full">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 md:h-5 md:w-5 text-[#273469] fill-current" />
                ))}
              </div>
              <p className="text-[#30343f] mb-6 leading-relaxed italic text-sm md:text-base">
                "As a startup founder, I needed quality talent fast. VettedPool delivered exactly that - skilled professionals who were ready to contribute from day one."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#273469] rounded-full flex items-center justify-center mr-3 md:mr-4 text-white font-bold text-sm md:text-base">
                  RC
                </div>
                <div>
                  <p className="font-semibold text-[#1e2749] text-sm md:text-base">Robert Chen</p>
                  <p className="text-[#30343f] text-xs md:text-sm">Founder, InnovateLab</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-[#e4d9ff] transition-all duration-500 transform hover:-translate-y-1 h-full">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 md:h-5 md:w-5 text-[#273469] fill-current" />
                ))}
              </div>
              <p className="text-[#30343f] mb-6 leading-relaxed italic text-sm md:text-base">
                "The pre-screening process is incredibly thorough. Every candidate we've hired through VettedPool has exceeded our expectations."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#273469] rounded-full flex items-center justify-center mr-3 md:mr-4 text-white font-bold text-sm md:text-base">
                  EL
                </div>
                <div>
                  <p className="font-semibold text-[#1e2749] text-sm md:text-base">Emily Lopez</p>
                  <p className="text-[#30343f] text-xs md:text-sm">VP of Talent, GrowthCorp</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-[#e4d9ff] transition-all duration-500 transform hover:-translate-y-1 h-full">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 md:h-5 md:w-5 text-[#273469] fill-current" />
                ))}
              </div>
              <p className="text-[#30343f] mb-6 leading-relaxed italic text-sm md:text-base">
                "I've tried multiple platforms, but VettedPool's quality assurance and privacy features are unmatched. Highly recommend!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#273469] rounded-full flex items-center justify-center mr-3 md:mr-4 text-white font-bold text-sm md:text-base">
                  AM
                </div>
                <div>
                  <p className="font-semibold text-[#1e2749] text-sm md:text-base">Alex Martinez</p>
                  <p className="text-[#30343f] text-xs md:text-sm">Product Manager</p>
                </div>
              </div>
            </div>
          </TestimonialsSlider>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-18 bg-[#fafaff]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-15">
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-black mb-3 md:mb-4 text-[#1e2749]">
              Frequently Asked
              <span className=" text-[#273469]"> Questions</span>
            </h2>
            <p className="text-sm md:text-base text-[#30343f] max-w-3xl mx-auto">
              Everything you need to know about VettedPool
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "How does the anonymous system work?",
                answer: "Candidates are assigned unique code numbers instead of sharing their personal information. Recruiters can see skills, experience, and qualifications, but contact details are only shared after both parties express mutual interest."
              },
              {
                question: "What makes candidates 'pre-vetted'?",
                answer: "Every candidate goes through our comprehensive screening process including technical assessments, background verification, reference checks, and initial interviews before being added to the pool."
              },
              {
                question: "How long does the placement process take?",
                answer: "On average, successful placements happen within 24 hours after a recruiter selects a candidate. The pre-screening process saves significant time compared to traditional recruitment methods."
              },
              {
                question: "Is there a fee for candidates?",
                answer: "No, candidates can join and use VettedPool completely free. We only charge recruiters for access to the platform and successful placements."
              },
              {
                question: "What industries do you serve?",
                answer: "VettedPool serves a wide range of industries including technology, finance, healthcare, engineering, marketing, and more. Our platform is designed to accommodate professionals from various sectors."
              },
              {
                question: "How do you ensure candidate quality?",
                answer: "We have a rigorous multi-stage verification process that includes skill assessments, portfolio reviews, technical interviews. Only candidates who pass all stages are added to our pool."
              }
            ].map((faq, index) => (
              <FloatingCard key={index} delay={100 * (index + 1)}>
                <FAQItem question={faq.question} answer={faq.answer} />
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Geometric Design */}
      <section className="py-12 md:py-18 bg-[#1e2749] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-5 left-5 md:top-10 md:left-10 w-16 h-16 md:w-32 md:h-32 bg-[#e4d9ff] rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute bottom-5 right-5 md:bottom-10 md:right-10 w-12 h-12 md:w-24 md:h-24 bg-[#e4d9ff] rounded-full opacity-15 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-8 h-8 md:w-16 md:h-16 bg-[#e4d9ff] rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <FloatingCard delay={100}>
            <div className="bg-white p-6 md:p-12 rounded-2xl md:rounded-3xl shadow-2xl border-2 md:border-4 border-[#e4d9ff]">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 text-[#1e2749] leading-tight">
                Ready to Get
                <span className="block text-[#273469]">Started?</span>
              </h2>
              <p className="text-base md:text-xl lg:text-2xl mb-6 md:mb-10 text-[#30343f] max-w-3xl mx-auto leading-relaxed">
                Join thousands of professionals and companies who trust VettedPool
                for their recruitment needs.
              </p>
              {!isLoggedIn && (
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
                  <Link to="/login" className="w-full sm:w-auto">
                    <Button size="lg" variant="primary" className="group w-full sm:w-auto">
                      <Rocket className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6 group-hover:rotate-12 transition-transform duration-300" />
                      Get Started Now
                      <ArrowRight className="ml-2 md:ml-3 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                  <Link to="/about-us" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="group w-full sm:w-auto">
                      <Users className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6 group-hover:rotate-12 transition-transform duration-300" />
                      Learn More
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </FloatingCard>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
