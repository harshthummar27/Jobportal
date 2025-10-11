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
} from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

// Simple reusable Tailwind Button
const Button = ({ children, variant = "primary", size = "md", className = "", ...props }) => {
  const base = "inline-flex items-center justify-center font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    outline: "border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500",
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

// Simple Card wrapper
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow border ${className}`}>{children}</div>
);

const CandidateInfo = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      {/* <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold">VettedPool</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
          </div>
        </div>
      </header> */}
      <Header />
      {/* Main Section */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Intro */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Let's Find Better Job Opportunities for You Together
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            If you are looking for a better package and want to change a toxic working environment,
            we could be your secret job search partner.
          </p>
          <p className="text-lg text-gray-800">
            VettedPool always seeks top talent — just clear our interviews and new jobs may await
            at your doorstep.
          </p>
        </div>

        {/* Important Info */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            Important Information
          </h2>
          <div className="space-y-4">
            {[
              {
                icon: <CheckCircle className="h-5 w-5 text-green-600 mt-1" />,
                text: (
                  <>
                    <strong>Privacy Protected:</strong> You can choose to hide your current company
                    from recruiters during registration.
                  </>
                ),
              },
              {
                icon: <UserCheck className="h-5 w-5 text-indigo-600 mt-1" />,
                text: (
                  <>
                    <strong>Interview Process:</strong> Our technical team will reach out for your
                    interview after registration.
                  </>
                ),
              },
              {
                icon: <FileText className="h-5 w-5 text-indigo-600 mt-1" />,
                text: (
                  <>
                    <strong>Profile Visibility:</strong> Once you pass our screening, your profile
                    becomes visible to recruiters.
                  </>
                ),
              },
              {
                icon: <DollarSign className="h-5 w-5 text-yellow-500 mt-1" />,
                text: (
                  <>
                    <strong>Salary Expectations:</strong> Set your minimum salary — offers below it
                    will be auto-declined.
                  </>
                ),
              },
              {
                icon: <MapPin className="h-5 w-5 text-indigo-600 mt-1" />,
                text: (
                  <>
                    <strong>Job Preferences:</strong> Clearly specify preferred locations,
                    relocation choices, and salary expectations.
                  </>
                ),
              },
              {
                icon: <Clock className="h-5 w-5 text-yellow-500 mt-1" />,
                text: (
                  <>
                    <strong>6-Month Hold Policy:</strong> Rejecting a valid offer may lead to a
                    6-month hold on your profile.
                  </>
                ),
              },
              {
                icon: <XCircle className="h-5 w-5 text-red-600 mt-1" />,
                text: (
                  <>
                    <strong>Commitment Required:</strong> Accepting and then backing out of a job
                    within 4 months leads to removal.
                  </>
                ),
              },
              {
                icon: <Shield className="h-5 w-5 text-indigo-600 mt-1" />,
                text: (
                  <>
                    <strong>Background Verification:</strong> Registration implies consent for
                    third-party background checks.
                  </>
                ),
              },
              {
                icon: <AlertTriangle className="h-5 w-5 text-red-600 mt-1" />,
                text: (
                  <>
                    <strong>Legal Warning:</strong> Providing false experience details may lead to
                    legal actions.
                  </>
                ),
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                {item.icon}
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup?role=candidate">
            <Button size="lg">Sign Up Now</Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline">
              Already Registered? Login
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CandidateInfo;
