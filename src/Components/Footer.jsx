import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram } from "lucide-react";
import logo from '../../public/vettedpool-logo.webp';

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-10 lg:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link to="/" className="inline-block mb-3 hover:opacity-90 transition-opacity">
                <img 
                  className="h-9 w-auto object-contain" 
                  src={logo} 
                  alt="VettedPool Logo" 
                />
              </Link>
              <p className="text-sm text-gray-600 leading-relaxed max-w-sm mb-4">
                Connecting exceptional talent with outstanding opportunities through innovative recruitment solutions.
              </p>
              
              {/* Social Media Links */}
              <div className="flex items-center gap-3">
                <a 
                  href="https://linkedin.com/company/vettedpool" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-100 hover:bg-[#273469] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors" />
                </a>
                <a 
                  href="https://twitter.com/vettedpool" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-100 hover:bg-[#273469] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors" />
                </a>
                <a 
                  href="https://facebook.com/vettedpool" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-100 hover:bg-[#273469] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors" />
                </a>
                <a 
                  href="https://instagram.com/vettedpool" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-100 hover:bg-[#273469] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link 
                    to="/" 
                    className="text-sm text-gray-600 hover:text-[#273469] transition-colors font-medium"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about-us" 
                    className="text-sm text-gray-600 hover:text-[#273469] transition-colors font-medium"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/pricing" 
                    className="text-sm text-gray-600 hover:text-[#273469] transition-colors font-medium"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contact-us" 
                    className="text-sm text-gray-600 hover:text-[#273469] transition-colors font-medium"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
                Resources
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link 
                    to="/candidate-info" 
                    className="text-sm text-gray-600 hover:text-[#273469] transition-colors font-medium"
                  >
                    For Candidates
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/recruiter-info" 
                    className="text-sm text-gray-600 hover:text-[#273469] transition-colors font-medium"
                  >
                    For Recruiters
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/login" 
                    className="text-sm text-gray-600 hover:text-[#273469] transition-colors font-medium"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contact-us" 
                    className="text-sm text-gray-600 hover:text-[#273469] transition-colors font-medium"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
                Contact
              </h3>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2.5">
                  <Mail className="h-4 w-4 text-[#273469] flex-shrink-0 mt-0.5" />
                  <a 
                    href="mailto:support@vettedpool.com" 
                    className="text-sm text-gray-600 hover:text-[#273469] transition-colors font-medium break-all"
                  >
                    support@vettedpool.com
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <Phone className="h-4 w-4 text-[#273469] flex-shrink-0 mt-0.5" />
                  <a 
                    href="tel:+15551234567" 
                    className="text-sm text-gray-600 hover:text-[#273469] transition-colors font-medium"
                  >
                    +1 (555) 123-4567
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-[#273469] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 leading-relaxed">
                    123 Business Street<br />
                    New York, NY 10001, USA
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-200 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-sm text-gray-500 text-center sm:text-left">
              &copy; {new Date().getFullYear()} VettedPool. All rights reserved.
            </p>
            <div className="flex items-center gap-5 text-sm">
              <Link 
                to="/terms-and-conditions" 
                className="text-gray-500 hover:text-[#273469] transition-colors font-medium"
              >
                Terms & Conditions
              </Link>
              <Link 
                to="/privacy-policy" 
                className="text-gray-500 hover:text-[#273469] transition-colors font-medium"
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
