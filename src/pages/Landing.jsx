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
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer transform hover:scale-105 active:scale-95";
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

const Landing = () => {
  const [isVisible, setIsVisible] = useState({});

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
    <div className="min-h-screen bg-[#fafaff] text-[#1e2749] overflow-x-hidden">
      {/* Header */}
      <Header />
      
      {/* Hero Section - Asymmetrical Design */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#e4d9ff] rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-[#30343f] rounded-full opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-[#e4d9ff] rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div 
              className={`transform transition-all duration-1000 ${
                isVisible.hero ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
              }`}
              data-animate
              id="hero"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#e4d9ff] text-[#273469] text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4 mr-2" />
                Trusted by 500+ Companies
              </div>
              
              <h1 className="text-6xl lg:text-8xl font-black mb-6 text-[#1e2749] leading-tight">
                Vetted
                <span className="block text-[#273469]">Pool</span>
              </h1>
              
              <p className="text-xl lg:text-2xl mb-8 text-[#30343f] leading-relaxed">
                Pre-screened. Pre-interviewed. 
                <span className="text-[#273469] font-semibold"> Prepped for you.</span>
              </p>
              
              <p className="text-lg mb-10 text-[#30343f] leading-relaxed">
                Access thoroughly vetted candidates ready for immediate placement.
                Save time and ensure quality with our comprehensive screening process.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/candidate-info">
                  <Button size="lg" variant="primary" className="group">
                    <Users className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    For Candidates
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link to="/recruiter-info">
                  <Button size="lg" variant="outline" className="group">
                    <Briefcase className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    For Recruiters
                  </Button>
                </Link>
              </div>
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
                <div className="bg-white p-8 rounded-2xl shadow-2xl border-2 border-[#e4d9ff] transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-[#273469] rounded-xl flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#1e2749]">Quality Assured</h3>
                      <p className="text-[#30343f]">Pre-vetted candidates</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#273469] rounded-full"></div>
                      <span className="text-[#30343f]">Technical screening</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#273469] rounded-full"></div>
                      <span className="text-[#30343f]">Background verification</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#273469] rounded-full"></div>
                      <span className="text-[#30343f]">Reference checks</span>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-4 -right-4 bg-[#e4d9ff] p-4 rounded-xl shadow-lg transform -rotate-12 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-[#273469]" />
                    <span className="text-[#273469] font-semibold">Secure</span>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-[#30343f] p-4 rounded-xl shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-white" />
                    <span className="text-white font-semibold">Fast</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Diagonal Layout */}
      <section className="py-20 bg-[#273469] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#273469] to-[#1e2749] transform -skew-y-1"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <FloatingCard delay={100}>
              <div className="text-white">
                <div className="text-5xl font-black mb-2">
                  <AnimatedCounter end={5000} suffix="+" />
                </div>
                <p className="text-[#e4d9ff] font-medium">Vetted Candidates</p>
              </div>
            </FloatingCard>
            <FloatingCard delay={200}>
              <div className="text-white">
                <div className="text-5xl font-black mb-2">
                  <AnimatedCounter end={98} suffix="%" />
                </div>
                <p className="text-[#e4d9ff] font-medium">Success Rate</p>
              </div>
            </FloatingCard>
            <FloatingCard delay={300}>
              <div className="text-white">
                <div className="text-5xl font-black mb-2">
                  <AnimatedCounter end={24} suffix="hrs" />
                </div>
                <p className="text-[#e4d9ff] font-medium">Avg. Placement</p>
              </div>
            </FloatingCard>
            <FloatingCard delay={400}>
              <div className="text-white">
                <div className="text-5xl font-black mb-2">
                  <AnimatedCounter end={150} suffix="+" />
                </div>
                <p className="text-[#e4d9ff] font-medium">Companies</p>
              </div>
            </FloatingCard>
          </div>
        </div>
      </section>

      {/* Features Section - Hexagonal Grid */}
      <section className="py-24 bg-[#fafaff]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-black mb-6 text-[#1e2749]">
              Why Choose
              <span className="block text-[#273469]">VettedPool?</span>
            </h2>
            <p className="text-xl text-[#30343f] max-w-3xl mx-auto">
              A revolutionary platform designed for privacy, quality, and efficiency in recruitment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FloatingCard delay={100}>
              <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-[#e4d9ff] hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
                <div className="w-16 h-16 bg-[#e4d9ff] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Lock className="h-8 w-8 text-[#273469]" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#1e2749]">Complete Anonymity</h3>
                <p className="text-[#30343f] leading-relaxed">
                  Candidates remain anonymous with unique code numbers. No direct contact information shared until both parties agree.
                </p>
              </div>
            </FloatingCard>

            <FloatingCard delay={200}>
              <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-[#e4d9ff] hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
                <div className="w-16 h-16 bg-[#e4d9ff] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-8 w-8 text-[#273469]" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#1e2749]">Pre-Vetted Quality</h3>
                <p className="text-[#30343f] leading-relaxed">
                  Every candidate is pre-interviewed and screened. Access only verified, qualified professionals ready to work.
                </p>
              </div>
            </FloatingCard>

            <FloatingCard delay={300}>
              <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-[#e4d9ff] hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
                <div className="w-16 h-16 bg-[#e4d9ff] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-8 w-8 text-[#273469]" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#1e2749]">Advanced Filtering</h3>
                <p className="text-[#30343f] leading-relaxed">
                  Search by skills, location, experience, visa status, and more. Find exactly who you need, when you need them.
                </p>
              </div>
            </FloatingCard>
          </div>
        </div>
      </section>

      {/* How It Works - Timeline Design */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-black mb-6 text-[#1e2749]">
              How It
              <span className="block text-[#273469]">Works</span>
            </h2>
            <p className="text-xl text-[#30343f] max-w-3xl mx-auto">
              Simple steps to connect the right talent with the right opportunities
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* For Candidates */}
            <FloatingCard delay={200}>
              <div className="relative">
                <div className="bg-[#fafaff] p-8 rounded-2xl border-2 border-[#e4d9ff] shadow-lg">
                   <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-12 bg-[#273469] rounded-2xl flex items-center justify-center">
                       <Users className="h-6 w-6 text-white" />
                     </div>
                     <h3 className="text-3xl font-bold text-[#1e2749]">For Candidates</h3>
                   </div>
                  
                   <div className="space-y-4">
                     {/* Step 1 */}
                     <div className="bg-[#f2edff] p-4 rounded-xl">
                       <div className="flex gap-3">
                         <div className="w-10 h-10 rounded-xl bg-white border border-gray-300 text-[#273469] flex items-center justify-center font-bold text-sm flex-shrink-0">
                           1
                         </div>
                         <div className="flex-1 border-l border-gray-300 pl-3">
                           <h4 className="text-lg font-bold mb-1 text-[#1e2749]">Create Your Profile</h4>
                           <p className="text-[#30343f] text-sm leading-relaxed">
                             Complete registration with your skills, experience, and preferences.
                           </p>
                         </div>
                       </div>
                     </div>
                     
                     {/* Step 2 */}
                     <div className="bg-[#f2edff] p-4 rounded-xl">
                       <div className="flex gap-3">
                         <div className="w-10 h-10 rounded-xl bg-white border border-gray-300 text-[#273469] flex items-center justify-center font-bold text-sm flex-shrink-0">
                           2
                         </div>
                         <div className="flex-1 border-l border-gray-300 pl-3">
                           <h4 className="text-lg font-bold mb-1 text-[#1e2749]">Get Pre-Interviewed</h4>
                           <p className="text-[#30343f] text-sm leading-relaxed">
                             Our team validates your credentials and conducts initial screening.
                           </p>
                         </div>
                       </div>
                     </div>
                     
                     {/* Step 3 */}
                     <div className="bg-[#f2edff] p-4 rounded-xl">
                       <div className="flex gap-3">
                         <div className="w-10 h-10 rounded-xl bg-white border border-gray-300 text-[#273469] flex items-center justify-center font-bold text-sm flex-shrink-0">
                           3
                         </div>
                         <div className="flex-1 border-l border-gray-300 pl-3">
                           <h4 className="text-lg font-bold mb-1 text-[#1e2749]">Receive Opportunities</h4>
                           <p className="text-[#30343f] text-sm leading-relaxed">
                             We connect you with recruiters while keeping your identity protected.
                           </p>
                         </div>
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            </FloatingCard>

            {/* For Recruiters */}
            <FloatingCard delay={400}>
              <div className="relative">
                <div className="bg-[#fafaff] p-8 rounded-2xl border-2 border-[#e4d9ff] shadow-lg">
                   <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-12 bg-[#30343f] rounded-2xl flex items-center justify-center">
                       <Briefcase className="h-6 w-6 text-white" />
                     </div>
                     <h3 className="text-3xl font-bold text-[#1e2749]">For Recruiters</h3>
                   </div>
                  
                   <div className="space-y-4">
                     {/* Step 1 */}
                     <div className="bg-[#f2edff] p-4 rounded-xl">
                       <div className="flex gap-3">
                         <div className="w-10 h-10 rounded-xl bg-white border border-gray-300 text-[#273469] flex items-center justify-center font-bold text-sm flex-shrink-0">
                           1
                         </div>
                         <div className="flex-1 border-l border-gray-300 pl-3">
                           <h4 className="text-lg font-bold mb-1 text-[#1e2749]">Sign Agreement</h4>
                           <p className="text-[#30343f] text-sm leading-relaxed">
                             Complete registration and sign our recruitment agreement.
                           </p>
                         </div>
                       </div>
                     </div>
                     
                     {/* Step 2 */}
                     <div className="bg-[#f2edff] p-4 rounded-xl">
                       <div className="flex gap-3">
                         <div className="w-10 h-10 rounded-xl bg-white border border-gray-300 text-[#273469] flex items-center justify-center font-bold text-sm flex-shrink-0">
                           2
                         </div>
                         <div className="flex-1 border-l border-gray-300 pl-3">
                           <h4 className="text-lg font-bold mb-1 text-[#1e2749]">Search & Filter</h4>
                           <p className="text-[#30343f] text-sm leading-relaxed">
                            Use advanced filters to find pre-vetted candidates that match your needs.
                           </p>
                         </div>
                       </div>
                     </div>
                     
                     {/* Step 3 */}
                     <div className="bg-[#f2edff] p-4 rounded-xl">
                       <div className="flex gap-3">
                         <div className="w-10 h-10 rounded-xl bg-white border border-gray-300 text-[#273469] flex items-center justify-center font-bold text-sm flex-shrink-0">
                           3
                         </div>
                         <div className="flex-1 border-l border-gray-300 pl-3">
                           <h4 className="text-lg font-bold mb-1 text-[#1e2749]">Select Candidates</h4>
                           <p className="text-[#30343f] text-sm leading-relaxed">
                             Choose candidates and we'll coordinate interviews on your behalf.
                           </p>
                         </div>
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            </FloatingCard>
          </div>
        </div>
      </section>

      {/* Testimonials - Card Stack Design */}
      <section className="py-24 bg-[#fafaff]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-black mb-6 text-[#1e2749]">
              What Our Users
              <span className="block text-[#273469]">Say</span>
            </h2>
            <p className="text-xl text-[#30343f] max-w-3xl mx-auto">
              Trusted by thousands of professionals and companies worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FloatingCard delay={100}>
              <div className="bg-white p-8 rounded-2xl border-2 border-[#e4d9ff] shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-[#273469] fill-current" />
                  ))}
                </div>
                <p className="text-[#30343f] mb-6 leading-relaxed italic">
                  "VettedPool has revolutionized our hiring process. The quality of candidates is exceptional, and the time saved is incredible."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#273469] rounded-full flex items-center justify-center mr-4 text-white font-bold">
                    JS
                  </div>
                  <div>
                    <p className="font-semibold text-[#1e2749]">John Smith</p>
                    <p className="text-[#30343f] text-sm">HR Director, TechCorp</p>
                  </div>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard delay={200}>
              <div className="bg-white p-8 rounded-2xl border-2 border-[#e4d9ff] shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-[#273469] fill-current" />
                  ))}
                </div>
                <p className="text-[#30343f] mb-6 leading-relaxed italic">
                  "As a candidate, I love the privacy and quality of opportunities. The pre-screening process is thorough and professional."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#273469] rounded-full flex items-center justify-center mr-4 text-white font-bold">
                    MJ
                  </div>
                  <div>
                    <p className="font-semibold text-[#1e2749]">Maria Johnson</p>
                    <p className="text-[#30343f] text-sm">Software Engineer</p>
                  </div>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard delay={300}>
              <div className="bg-white p-8 rounded-2xl border-2 border-[#e4d9ff] shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-[#273469] fill-current" />
                  ))}
                </div>
                <p className="text-[#30343f] mb-6 leading-relaxed italic">
                  "The platform's filtering capabilities are outstanding. We found the perfect candidate in just 24 hours!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#273469] rounded-full flex items-center justify-center mr-4 text-white font-bold">
                    DW
                  </div>
                  <div>
                    <p className="font-semibold text-[#1e2749]">David Wilson</p>
                    <p className="text-[#30343f] text-sm">CTO, StartupXYZ</p>
                  </div>
                </div>
              </div>
            </FloatingCard>
          </div>
        </div>
      </section>

      {/* CTA Section - Geometric Design */}
      <section className="py-24 bg-[#1e2749] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#e4d9ff] rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-[#e4d9ff] rounded-full opacity-15 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#e4d9ff] rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <FloatingCard delay={100}>
            <div className="bg-white p-12 rounded-3xl shadow-2xl border-4 border-[#e4d9ff]">
              <h2 className="text-5xl lg:text-6xl font-black mb-6 text-[#1e2749]">
                Ready to Get
                <span className="block text-[#273469]">Started?</span>
              </h2>
              <p className="text-xl lg:text-2xl mb-10 text-[#30343f] max-w-3xl mx-auto leading-relaxed">
                Join thousands of professionals and companies who trust VettedPool
                for their recruitment needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/login">
                  <Button size="xl" variant="primary" className="group">
                    <Rocket className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                    Get Started Now
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link to="/candidate-info">
                  <Button size="xl" variant="outline" className="group">
                    <Users className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                    Learn More
                  </Button>
                </Link>
              </div>
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