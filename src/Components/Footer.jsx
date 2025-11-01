import React from "react";
import { Link } from "react-router-dom";
import logo from '../../public/vettedpool-logo.webp';

const Footer = () => {
  return (
    <footer className="border-t border-gray-100 bg-white py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Brand Section */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
              <img 
                className="h-5 w-auto sm:h-6 md:h-7 max-w-[120px] sm:max-w-[140px] md:max-w-[160px] object-contain" 
                src={logo} 
                alt="VettedPool Logo" 
              />
            </Link>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-5">
            Secure, confidential recruitment for the modern workforce.
          </p>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-100 pt-3 sm:pt-4 text-center text-xs sm:text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} VettedPool. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
