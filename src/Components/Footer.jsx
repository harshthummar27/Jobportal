import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import logo from '../../public/vettedpool-logo.webp';

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8 sm:py-10 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
            {/* Brand Section */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link to="/" className="inline-block mb-4 hover:opacity-90 transition-opacity">
                <img 
                  className="h-8 w-auto sm:h-10 object-contain" 
                  src={logo} 
                  alt="VettedPool Logo" 
                />
              </Link>
              <p className="text-sm text-gray-600 leading-relaxed max-w-sm">
                Connecting exceptional talent with outstanding opportunities through innovative recruitment solutions.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/" 
                    className="text-sm text-gray-600 hover:text-[#273469] transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about-us" 
                    className="text-sm text-gray-600 hover:text-[#273469] transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/pricing" 
                    className="text-sm text-gray-600 hover:text-[#273469] transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contact-us" 
                    className="text-sm text-gray-600 hover:text-[#273469] transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/candidate-info" 
                    className="text-sm text-gray-600 hover:text-[#273469] transition-colors"
                  >
                    For Candidates
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/recruiter-info" 
                    className="text-sm text-gray-600 hover:text-[#273469] transition-colors"
                  >
                    For Recruiters
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/login" 
                    className="text-sm text-gray-600 hover:text-[#273469] transition-colors"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contact-us" 
                    className="text-sm text-gray-600 hover:text-[#273469] transition-colors"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                Contact
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-[#273469] flex-shrink-0 mt-0.5" />
                  <a 
                    href="mailto:support@vettedpool.com" 
                    className="text-sm text-gray-600 hover:text-[#273469] transition-colors"
                  >
                    support@vettedpool.com
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-[#273469] flex-shrink-0 mt-0.5" />
                  <a 
                    href="tel:+15551234567" 
                    className="text-sm text-gray-600 hover:text-[#273469] transition-colors"
                  >
                    +1 (555) 123-4567
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-[#273469] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">
                    123 Business Street<br />
                    New York, NY 10001, USA
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-200 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
              &copy; {new Date().getFullYear()} VettedPool. All rights reserved.
            </p>
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <Link 
                to="/pricing" 
                className="text-gray-500 hover:text-[#273469] transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link 
                to="/contact-us" 
                className="text-gray-500 hover:text-[#273469] transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
