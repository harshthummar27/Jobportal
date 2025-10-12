import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email && password) {
      let role = "candidate";
      let redirectPath = "/candidate/dashboard";

      // Determine role based on email
      if (email.includes("recruiter")) {
        role = "recruiter";
        redirectPath = "/recruiter/search";
      } else if (email.includes("admin") || email.includes("superadmin")) {
        role = "superadmin";
        redirectPath = "/superadmin/dashboard";
      }

      const userData = {
        email,
        role,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      alert("Welcome back! You've successfully logged in.");

      navigate(redirectPath);
    } else {
      alert("Please fill all fields");
    }
  };

  return (
    <>
      <Header />
    <div className=" bg-gradient-to-r from-indigo-50 to-indigo-100 flex items-center justify-center p-3">
      <div className="w-full max-w-md">
        {/* Header */}
        {/* <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-blue-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 11c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zM2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z"
              />
            </svg>
            <span className="text-3xl font-bold text-blue-700">TalentSecure</span>
          </Link>
        </div> */}

        {/* Card */}
        <div className="bg-white rounded-xl shadow-xl p-8 ">
          <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-black font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-black font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 text-gray-700 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200"
            >
              Sign In
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-indigo-600 hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
              <p className="font-medium mb-1">Demo Login Roles:</p>
              <p>• <strong>admin@vettedpool.com</strong> - Super Admin</p>
              <p>• <strong>recruiter@company.com</strong> - Recruiter</p>
              <p>• <strong>candidate@email.com</strong> - Candidate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Login;
