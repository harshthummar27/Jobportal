import React from "react";
import { Link } from "react-router-dom";
import { Shield, CheckCircle, DollarSign, UserCheck, Clock } from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const Button = ({ children, variant = "primary", size = "md", className = "", ...props }) => {
  const base = "inline-flex items-center justify-center font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    outline: "bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500",
    ghost: "text-gray-700 hover:text-indigo-600",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const RecruiterInfo = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">VettedPool</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
          </div>
        </div>
      </header> */}
      <Header />
      <div className="container  mx-auto px-4 py-12 max-w-5xl">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Hello Recruiters!</h1>
          <p className="text-xl text-gray-600 mb-4">
            Are you ready to hire pre-interviewed top talent which saves your time by half and at surprisingly <strong className="text-indigo-600">7% of annual package?</strong>
          </p>
          <p className="text-lg text-gray-900">
            VettedPool has a pool of candidates who are humanly interviewed and skill-tested just to ensure you get authentic candidates.
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-white text-black rounded-xl shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Why Choose VettedPool?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <p><strong>No Advance Payment:</strong> Pay only after placement—no upfront costs.</p>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" />
              <p><strong>45 Days Free Replacement Guarantee:</strong> If a candidate leaves within 45 days, we'll replace them for free.</p>
            </div>
            <div className="flex items-start gap-3">
              <UserCheck className="h-5 w-5 text-indigo-500 mt-1 flex-shrink-0" />
              <p><strong>Humanly Vetted:</strong> Every candidate is personally interviewed and skill-tested by our technical team.</p>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" />
              <p><strong>Save Time:</strong> Reduce your hiring time by half with pre-screened candidates.</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow p-6 mb-8 text-black">
          <h2 className="text-2xl font-bold mb-6">Start Recruiting in Just 5 Steps</h2>
          <div className="space-y-4">
            {[
              { step: 1, title: "Complete Registration", desc: "Register your company with email verification—no payment required." },
              { step: 2, title: "Setup Your Profile", desc: "Complete your company profile and hiring preferences." },
              { step: 3, title: "Accept Agreement", desc: "Review and accept our recruiter service agreement." },
              { step: 4, title: "Search & Select Candidates", desc: "Use our advanced filters to find the perfect match for your role." },
              { step: 5, title: "Arrange Interview & Hire", desc: "Schedule interviews with selected candidates and make your hire." },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-[#06327a] text-white flex items-center justify-center font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-lg font-medium text-gray-900">
            At VettedPool, we are committed to our services with transparency.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/recruiter/register">
            <Button size="lg">Sign Up Now</Button>
          </Link>
          <Link to="/recruiter/login">
            <Button size="lg" variant="outline">Already Registered? Login</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RecruiterInfo;
