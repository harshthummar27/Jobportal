import React from "react";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Grid Section */}
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-indigo-600" />
              <span className="text-lg font-bold text-gray-800">
                VettedPool
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Secure, confidential recruitment for the modern workforce.
            </p>
          </div>

          {/* For Candidates */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-800">
              For Candidates
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link
                  to="/signup?role=candidate"
                  className="hover:text-indigo-600 transition"
                >
                  Create Profile
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-indigo-600 transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-indigo-600 transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* For Recruiters */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-800">
              For Recruiters
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link
                  to="/signup?role=recruiter"
                  className="hover:text-indigo-600 transition"
                >
                  Get Access
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-indigo-600 transition">
                  Search Talent
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-indigo-600 transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Info */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-800">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link to="#" className="hover:text-indigo-600 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-indigo-600 transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-indigo-600 transition">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} VettedPool. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
