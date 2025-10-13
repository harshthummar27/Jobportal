import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Building2, Users, Shield, Eye, EyeOff, ArrowRight } from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const Login = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const userTypes = [
    {
      id: "candidate",
      title: "Candidate",
      description: "Find your dream job",
      icon: User,
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700"
    },
    {
      id: "recruiter",
      title: "Recruiter",
      description: "Hire top talent",
      icon: Building2,
      color: "from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700"
    },
    {
      id: "internalteam",
      title: "Internal Team",
      description: "Manage operations",
      icon: Users,
      color: "from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700"
    },
    {
      id: "superadmin",
      title: "Super Admin",
      description: "System administration",
      icon: Shield,
      color: "from-red-500 to-red-600",
      hoverColor: "hover:from-red-600 hover:to-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-700"
    }
  ];

  const getRedirectPath = (role) => {
    switch (role) {
      case "candidate":
        return "/candidate/dashboard";
      case "recruiter":
        return "/recruiter/dashboard";
      case "internalteam":
        return "/superadmin/internal-team";
      case "superadmin":
        return "/superadmin/dashboard";
      default:
        return "/candidate/dashboard";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedRole || !email || !password) {
      alert("Please select a user type and fill all fields");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const userData = {
        email,
        role: selectedRole,
        loginTime: new Date().toISOString()
      };

      localStorage.setItem("user", JSON.stringify(userData));
      alert(`Welcome back! You've successfully logged in as ${userTypes.find(t => t.id === selectedRole)?.title}.`);

      navigate(getRedirectPath(selectedRole));
    } catch (error) {
      alert("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome to <span className="text-indigo-600">VettedPool</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose your role to access the platform and continue your journey
            </p>
          </div>

          {/* User Type Selection - Only show when no role is selected */}
          {!selectedRole && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {userTypes.map((userType) => {
                const IconComponent = userType.icon;
                
                return (
                  <button
                    key={userType.id}
                    onClick={() => setSelectedRole(userType.id)}
                    className="relative p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 hover:shadow-md transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="text-center">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${userType.bgColor} ${userType.textColor}`}>
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">
                        {userType.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {userType.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Login Form - Show when role is selected */}
          {selectedRole && (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                {/* Back Button */}
                <div className="mb-6">
                  <button
                    onClick={() => setSelectedRole("")}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm font-medium">Back to role selection</span>
                  </button>
                </div>

                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-gradient-to-r ${
                    userTypes.find(t => t.id === selectedRole)?.color
                  } text-white`}>
                    {React.createElement(userTypes.find(t => t.id === selectedRole)?.icon, {
                      className: "w-8 h-8"
                    })}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Sign in as {userTypes.find(t => t.id === selectedRole)?.title}
                  </h2>
                  <p className="text-gray-600">
                    {userTypes.find(t => t.id === selectedRole)?.description}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                      isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : `bg-gradient-to-r ${userTypes.find(t => t.id === selectedRole)?.color} ${userTypes.find(t => t.id === selectedRole)?.hoverColor} shadow-lg hover:shadow-xl`
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors"
                    >
                      Sign up here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Demo Credentials - Show when role is selected */}
          {selectedRole && (
            <div className="max-w-md mx-auto mt-6">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 text-center">
                  Demo Credentials for {userTypes.find(t => t.id === selectedRole)?.title}
                </h4>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${
                      selectedRole === 'candidate' ? 'bg-blue-500' :
                      selectedRole === 'recruiter' ? 'bg-purple-500' :
                      selectedRole === 'internalteam' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700">
                      {selectedRole === 'candidate' ? 'candidate@email.com' :
                       selectedRole === 'recruiter' ? 'recruiter@company.com' :
                       selectedRole === 'internalteam' ? 'team@vettedpool.com' : 'admin@vettedpool.com'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Password: Use any password for demo purposes
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Demo Credentials - Show when no role is selected */}
          {!selectedRole && (
            <div className="max-w-2xl mx-auto mt-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Demo Credentials
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">Candidate:</span>
                      <span className="text-gray-600">candidate@email.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="font-medium">Recruiter:</span>
                      <span className="text-gray-600">recruiter@company.com</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Internal Team:</span>
                      <span className="text-gray-600">team@vettedpool.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="font-medium">Super Admin:</span>
                      <span className="text-gray-600">admin@vettedpool.com</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-4">
                  Password: Use any password for demo purposes
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
