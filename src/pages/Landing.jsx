import React from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Users,
  Briefcase,
  CheckCircle,
  Lock,
  Target,
} from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

// Simple Tailwind button replacement for Shadcn UI Button
const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer";
  const variants = {
    primary:
      "bg-[#032a6b] text-white hover:bg-indigo-800 focus:ring-indigo-500",
    secondary:
      "bg-white text-indigo-900 hover:bg-indigo-50 focus:ring-indigo-500",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2 text-base",
    lg: "px-6 py-3 text-lg",
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

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <Header />
      {/* Hero Section */}
      <section className="bg-[#073d96] from-indigo-600 to-indigo-500 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">VettedPool</h1>
          <p className="text-2xl font-medium mb-8">
            Pre-screened. Pre-interviewed. Prepped for you.
          </p>
          <p className="text-lg mb-12 max-w-2xl mx-auto opacity-90">
            Access thoroughly vetted candidates ready for immediate placement.
            Save time and ensure quality with our comprehensive screening
            process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/candidate-info">
              <Button size="lg" variant="primary" className="text-lg px-8 py-2">
                <Users className="mr-2 h-5 w-5" /> For Candidates
              </Button>
            </Link>
            <Link to="/recruiter-info">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-2 bg-white text-indigo-600 hover:bg-indigo-50"
              >
                <Briefcase className="mr-2 h-5 w-5" /> For Recruiters
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why TalentSecure?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A revolutionary platform designed for privacy, quality, and
              efficiency in recruitment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow border-gray-900">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">
                Complete Anonymity
              </h3>
              <p className="text-gray-600">
                Candidates remain anonymous with unique code numbers. No direct
                contact information shared until both parties agree.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow border-gray-900">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">
                Pre-Vetted Quality
              </h3>
              <p className="text-gray-600">
                Every candidate is pre-interviewed and screened. Access only
                verified, qualified professionals ready to work.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow border-gray-900">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">
                Advanced Filtering
              </h3>
              <p className="text-gray-600">
                Search by skills, location, experience, visa status, and more.
                Find exactly who you need, when you need them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* For Candidates */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-8 w-8 text-[#06327a]" />
                <h3 className="text-2xl font-bold">For Candidates</h3>
              </div>
              <ul className="space-y-6">
                <li className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#06327a] text-white flex items-center justify-center font-semibold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Create Your Profile</h4>
                    <p className="text-gray-600">
                      Complete registration with your skills, experience, and
                      preferences.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#06327a] text-white flex items-center justify-center font-semibold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Get Pre-Interviewed</h4>
                    <p className="text-gray-600">
                      Our team validates your credentials and conducts initial
                      screening.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#06327a] text-white flex items-center justify-center font-semibold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Receive Opportunities</h4>
                    <p className="text-gray-600">
                      We connect you with recruiters while keeping your identity
                      protected.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* For Recruiters */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="h-8 w-8 text-[#06b5d0]" />
                <h3 className="text-2xl font-bold">For Recruiters</h3>
              </div>
              <ul className="space-y-6">
                <li className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#06b5d0] text-white flex items-center justify-center font-semibold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Sign Agreement</h4>
                    <p className="text-gray-600">
                      Complete registration and sign our recruitment agreement.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#06b5d0] text-white flex items-center justify-center font-semibold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Search & Filter</h4>
                    <p className="text-gray-600">
                      Use advanced filters to find pre-vetted candidates that
                      match your needs.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#06b5d0] text-white flex items-center justify-center font-semibold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Select Candidates</h4>
                    <p className="text-gray-600">
                      Choose candidates and we'll coordinate interviews on your
                      behalf.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#06b5d0] text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals and companies who trust TalentSecure
            for their recruitment needs.
          </p>
          <Link to="/signup">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white hover:bg-indigo-50 text-lg"
            >
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="border-t bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-indigo-600" />
                <span className="text-lg font-bold">TalentSecure</span>
              </div>
              <p className="text-sm text-gray-600">
                Secure, confidential recruitment for the modern workforce.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Candidates</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/signup?role=candidate" className="hover:text-indigo-600">Create Profile</Link></li>
                <li><Link to="#" className="hover:text-indigo-600">How It Works</Link></li>
                <li><Link to="#" className="hover:text-indigo-600">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Recruiters</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/signup?role=recruiter" className="hover:text-indigo-600">Get Access</Link></li>
                <li><Link to="#" className="hover:text-indigo-600">Search Talent</Link></li>
                <li><Link to="#" className="hover:text-indigo-600">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="#" className="hover:text-indigo-600">About Us</Link></li>
                <li><Link to="#" className="hover:text-indigo-600">Contact</Link></li>
                <li><Link to="#" className="hover:text-indigo-600">Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} TalentSecure. All rights reserved.</p>
          </div>
        </div>
      </footer> */}
      <Footer />
    </div>
  );
};

export default Landing;
