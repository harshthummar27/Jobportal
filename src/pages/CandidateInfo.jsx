import React from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  FileText,
  UserCheck,
  DollarSign,
  MapPin,
  Clock,
  XCircle,
  ArrowLeft,
  Sparkles,
  Users,
  Briefcase,
} from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

// Modern Button Component
const Button = ({ children, variant = "primary", size = "md", className = "", ...props }) => {
  const base = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer transform hover:scale-105 active:scale-95";
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

const CandidateInfo = () => {
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
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#e4d9ff] text-[#273469] text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              For Candidates
            </div>
            
            <div className="flex items-center justify-center gap-3 mb-6">
              {/* <div className="w-12 h-12 bg-[#273469] rounded-2xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div> */}
              <h1 className="text-2xl lg:text-3xl font-black text-[#1e2749]">
                Let's Find Better Job Opportunities Together
              </h1>
            </div>
            
            <p className="text-lg lg:text-xl text-[#30343f] max-w-3xl mx-auto leading-relaxed mb-4">
              If you are looking for a better package and want to change a toxic working environment,
              we could be your secret job search partner.
            </p>
            <p className="text-base lg:text-lg text-[#30343f] max-w-2xl mx-auto">
              VettedPool always seeks top talent — just clear our interviews and new jobs may await
              at your doorstep.
            </p>
          </div>

          {/* Back Button */}
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-[#30343f] hover:text-[#1e2749] transition-colors duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </div>

          {/* Important Info */}
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#e4d9ff] overflow-hidden mb-12">
            <div className="p-6 sm:p-8 lg:p-10">
              <h2 className="text-2xl font-bold text-[#1e2749] mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#e4d9ff] rounded-xl flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-[#273469]" />
                </div>
                Important Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: <CheckCircle className="h-5 w-5 text-green-600" />,
                    title: "Privacy Protected",
                    text: "You can choose to hide your current company from recruiters during registration.",
                  },
                  {
                    icon: <UserCheck className="h-5 w-5 text-[#273469]" />,
                    title: "Interview Process",
                    text: "Our technical team will reach out for your interview after registration.",
                  },
                  {
                    icon: <FileText className="h-5 w-5 text-[#273469]" />,
                    title: "Profile Visibility",
                    text: "Once you pass our screening, your profile becomes visible to recruiters.",
                  },
                  {
                    icon: <DollarSign className="h-5 w-5 text-yellow-500" />,
                    title: "Salary Expectations",
                    text: "Set your minimum salary — offers below it will be auto-declined.",
                  },
                  {
                    icon: <MapPin className="h-5 w-5 text-[#273469]" />,
                    title: "Job Preferences",
                    text: "Clearly specify preferred locations, relocation choices, and salary expectations.",
                  },
                  {
                    icon: <Clock className="h-5 w-5 text-yellow-500" />,
                    title: "6-Month Hold Policy",
                    text: "Rejecting a valid offer may lead to a 6-month hold on your profile.",
                  },
                  {
                    icon: <XCircle className="h-5 w-5 text-red-600" />,
                    title: "Commitment Required",
                    text: "Accepting and then backing out of a job within 4 months leads to removal.",
                  },
                  {
                    icon: <Shield className="h-5 w-5 text-[#273469]" />,
                    title: "Background Verification",
                    text: "Registration implies consent for third-party background checks.",
                  },
                  {
                    icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
                    title: "Legal Warning",
                    text: "Providing false experience details may lead to legal actions.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#f2edff] p-4 rounded-xl border-l-4 border-[#e4d9ff]">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1e2749] mb-1">{item.title}</h3>
                        <p className="text-[#30343f] text-sm leading-relaxed">{item.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/candidate/register">
              <Button size="lg" className="group">
                <Users className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                Sign Up Now
              </Button>
            </Link>
            <Link to="/candidate/login">
              <Button size="lg" variant="outline" className="group">
                <Briefcase className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
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

export default CandidateInfo;
