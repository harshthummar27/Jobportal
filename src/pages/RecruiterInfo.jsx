import React from "react";
import { Link } from "react-router-dom";
import { Shield, CheckCircle, DollarSign, UserCheck, Clock, ArrowLeft, Sparkles, Users, Briefcase } from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

// Modern Button Component
const Button = ({ children, variant = "primary", size = "md", className = "", ...props }) => {
  const base = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-offset-2 cursor-pointer transform hover:scale-105 active:scale-95";
  const variants = {
    primary: "bg-[#273469] text-white hover:bg-[#1e2749] focus:ring-[#273469] shadow-lg hover:shadow-xl",
    secondary: "bg-[#e4d9ff] text-[#273469] hover:bg-[#fafaff] focus:ring-[#e4d9ff] border-2 border-[#273469]",
    accent: "bg-[#30343f] text-white hover:bg-[#1e2749] focus:ring-[#30343f]",
    outline: "bg-transparent text-[#273469] border-2 border-[#273469] hover:bg-[#273469] hover:text-white focus:ring-[#273469]",
  };
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const RecruiterInfo = () => {
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
              For Recruiters
            </div>
            
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
              <h1 className="text-lg md:text-2xl lg:text-3xl font-black text-[#1e2749] px-4">
                Hello Recruiters!
              </h1>
            </div>
            
            <p className="text-sm md:text-lg lg:text-xl text-[#30343f] max-w-3xl mx-auto leading-relaxed mb-3 md:mb-4 px-4">
              Are you ready to hire pre-interviewed top talent which saves your time by half and at surprisingly <strong className="text-[#273469]">7% of annual package?</strong>
            </p>
            <p className="text-xs md:text-base lg:text-lg text-[#30343f] max-w-2xl mx-auto px-4">
              VettedPool has a pool of candidates who are humanly interviewed and skill-tested just to ensure you get authentic candidates.
            </p>
          </div>

          {/* Back Button */}
          <div className="mb-6 md:mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-[#30343f] hover:text-[#1e2749] transition-colors duration-300"
            >
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
              <span className="font-medium text-sm md:text-base">Back to Home</span>
            </Link>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl border-2 border-[#e4d9ff] overflow-hidden mb-8 md:mb-12">
            <div className="p-4 sm:p-6 md:p-8 lg:p-10">
              <h2 className="text-lg md:text-2xl font-bold text-[#1e2749] mb-6 md:mb-8 flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-[#e4d9ff] rounded-xl flex items-center justify-center">
                  <Shield className="h-4 w-4 md:h-5 md:w-5 text-[#273469]" />
                </div>
                Why Choose VettedPool?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-[#f2edff] p-3 md:p-4 rounded-xl border-l-4 border-green-500">
                  <div className="flex items-start gap-2 md:gap-3">
                    <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-[#1e2749] mb-1 text-sm md:text-base">No Advance Payment</h3>
                      <p className="text-[#30343f] text-xs md:text-sm leading-relaxed">Pay only after placement—no upfront costs.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#f2edff] p-3 md:p-4 rounded-xl border-l-4 border-[#e4d9ff]">
                  <div className="flex items-start gap-2 md:gap-3">
                    <Shield className="h-4 w-4 md:h-5 md:w-5 text-[#273469] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-[#1e2749] mb-1 text-sm md:text-base">45 Days Free Replacement Guarantee</h3>
                      <p className="text-[#30343f] text-xs md:text-sm leading-relaxed">If a candidate leaves within 45 days, we'll replace them for free.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#f2edff] p-3 md:p-4 rounded-xl border-l-4 border-[#e4d9ff]">
                  <div className="flex items-start gap-2 md:gap-3">
                    <UserCheck className="h-4 w-4 md:h-5 md:w-5 text-[#273469] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-[#1e2749] mb-1 text-sm md:text-base">Humanly Vetted</h3>
                      <p className="text-[#30343f] text-xs md:text-sm leading-relaxed">Every candidate is personally interviewed and skill-tested by our technical team.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#f2edff] p-3 md:p-4 rounded-xl border-l-4 border-[#e4d9ff]">
                  <div className="flex items-start gap-2 md:gap-3">
                    <Clock className="h-4 w-4 md:h-5 md:w-5 text-[#273469] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-[#1e2749] mb-1 text-sm md:text-base">Save Time</h3>
                      <p className="text-[#30343f] text-xs md:text-sm leading-relaxed">Reduce your hiring time by half with pre-screened candidates.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl border-2 border-[#e4d9ff] overflow-hidden mb-8 md:mb-12">
            <div className="p-4 sm:p-6 md:p-8 lg:p-10">
              <h2 className="text-lg md:text-2xl font-bold text-[#1e2749] mb-6 md:mb-8 flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-[#e4d9ff] rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-[#273469]" />
                </div>
                Start Recruiting in Just 5 Steps
              </h2>
              <div className="space-y-4 md:space-y-6">
                {[
                  { step: 1, title: "Complete Registration", desc: "Register your company with email verification—no payment required." },
                  { step: 2, title: "Setup Your Profile", desc: "Complete your company profile and hiring preferences." },
                  { step: 3, title: "Accept Agreement", desc: "Review and accept our recruiter service agreement." },
                  { step: 4, title: "Search & Select Candidates", desc: "Use our advanced filters to find the perfect match for your role." },
                  { step: 5, title: "Arrange Interview & Hire", desc: "Schedule interviews with selected candidates and make your hire." },
                ].map((item) => (
                  <div key={item.step} className="bg-[#f2edff] p-3 md:p-4 rounded-xl border-l-4 border-[#e4d9ff]">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#273469] text-white flex items-center justify-center font-bold flex-shrink-0 text-sm md:text-base">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1e2749] mb-1 text-sm md:text-base">{item.title}</h3>
                        <p className="text-[#30343f] text-xs md:text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Commitment Statement */}
          <div className="text-center mb-8 md:mb-12">
            <p className="text-sm md:text-lg font-medium text-[#30343f] px-4">
              At VettedPool, we are committed to our services with transparency.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
            <Link to="/recruiter/register">
              <Button size="md" className="group w-full sm:w-auto">
                <Users className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 group-hover:rotate-12 transition-transform duration-300" />
                Sign Up Now
              </Button>
            </Link>
            <Link to="/recruiter/login">
              <Button size="md" variant="outline" className="group w-full sm:w-auto">
                <Briefcase className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 group-hover:rotate-12 transition-transform duration-300" />
                Already Registered? Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RecruiterInfo;
