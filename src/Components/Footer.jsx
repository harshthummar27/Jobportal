import React from "react";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-gray-300 bg-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Brand Section */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-indigo-600" />
            <span className="text-base font-bold text-gray-800">
              VettedPool
            </span>
          </div>
          <p className="text-xs text-gray-600 mb-4">
            Secure, confidential recruitment for the modern workforce.
          </p>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-100 pt-4 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} VettedPool. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
