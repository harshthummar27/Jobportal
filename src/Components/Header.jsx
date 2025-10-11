import React from "react";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* {logo  add hear} */}
          <Link to="/">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-800">VettedPool</span>
          </div>
          </Link>

          {/* Login Button */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-4 py-2 rounded-md bg-indigo-200 font-medium hover:bg-indigo-300 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
