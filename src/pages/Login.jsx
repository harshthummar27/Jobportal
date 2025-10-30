import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, Building2, Users, Shield, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from 'react-toastify';
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const Login = () => {
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Auto-select role based on URL path
  useEffect(() => {
    if (location.pathname === "/candidate/login") {
      setSelectedRole("candidate");
    } else if (location.pathname === "/recruiter/login") {
      setSelectedRole("recruiter");
    }
  }, [location.pathname]);

  // Pre-fill email and role from registration if available
  useEffect(() => {
    const locationState = location.state;
    if (locationState?.email) {
      setEmail(locationState.email);
    }
    if (locationState?.role) {
      setSelectedRole(locationState.role);
    }
    if (locationState?.message) {

    }
  }, [location.state]);

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
      id: "staff",
      title: "Staff",
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

  // Normalize roles from various API shapes/values to app-consistent ids
  const normalizeRole = (role) => {
    if (!role || typeof role !== "string") return "";
    const r = role.toLowerCase().replace(/\s+/g, "_").replace(/-/g, "_");
    switch (r) {
      case "super_admin":
        return "superadmin";
      case "candidate":
        return "candidate";
      case "recruiter":
        return "recruiter";
      case "staff":
        return "staff";
      default:
        return r;
    }
  };

  const getRedirectPath = (role) => {
    switch (role) {
      case "candidate":
        return "/candidate/dashboard";
      case "recruiter":
        return "/recruiter/dashboard";
      case "staff":
        return "/internal-team/dashboard";
      case "superadmin":
        return "/superadmin/dashboard";
      default:
        return "/candidate/dashboard";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedRole || !email || !password) {
      toast.warning("Please select a user type and fill all fields");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare login data
      const loginData = {
        email,
        password,
        role: selectedRole
      };

      // Make API call to login
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Get and normalize the actual user role from the API response
      const actualUserRole = normalizeRole(data?.user?.role || data?.role);
      const chosenRole = normalizeRole(selectedRole);

      // Check if the chosen role matches the actual user role
      if (chosenRole !== actualUserRole) {
        toast.error("Role mismatch. Please select the correct role and try again.");
        setIsLoading(false);
        return;
      }

      // Store user data in localStorage only if roles match
      const userData = {
        email,
        role: actualUserRole,
        loginTime: new Date().toISOString(),
        token: data.token || data.access_token,
        user: data.user || data,
        has_profile: data.has_profile || false
      };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("has_profile", data.has_profile || false);
      
      // Show success message
      toast.success(`Welcome back! You've successfully logged in as ${userTypes.find(t => t.id === actualUserRole)?.title || actualUserRole}.`);
      
      // Navigate to dashboard based on role
      navigate(getRedirectPath(actualUserRole));
    } catch (error) {
      console.error("Login error:", error);
      
      // Handle specific error messages
      if (error.message.includes("email") || error.message.includes("Email")) {
        toast.error("Invalid email address. Please check and try again.");
      } else if (error.message.includes("password") || error.message.includes("Password")) {
        toast.error("Invalid password. Please check and try again.");
      } else if (error.message.includes("credentials")) {
        toast.error("Invalid credentials. Please check your email and password.");
      } else if (error.message.includes("not found") || error.message.includes("doesn't exist")) {
        toast.error("Account not found. Please check your email or sign up.");
      } else {
        toast.error(error.message || "Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-main text-primary overflow-x-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-accent rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-dark rounded-full opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-purple-accent rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative flex items-center justify-center min-h-screen p-4 pt-24">
          <div className="w-full max-w-6xl">
            {/* Header Section */}
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center px-3 py-2 md:px-4 md:py-4 rounded-full bg-purple-accent text-primary-color text-xs md:text-sm font-medium mb-3 md:mb-4">
                <Shield className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                Secure Access Portal
              </div>
              <h1 className="text-xl md:text-2xl lg:text-5xl font-black mb-2 text-primary leading-tight">
                Welcome to
                <span className=" text-primary-color">VettedPool</span>
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-secondary max-w-3xl mx-auto leading-relaxed px-4">
                Choose your role to access the platform and continue your journey
              </p>
            </div>

          {/* User Type Selection - Only show when no role is selected */}
          {!selectedRole && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
              {userTypes.map((userType) => {
                const IconComponent = userType.icon;
                
                return (
                  <button
                    key={userType.id}
                    onClick={() => setSelectedRole(userType.id)}
                    className="relative p-4 md:p-8 rounded-xl md:rounded-2xl border-2 border-[#e4d9ff] bg-white hover:border-[#273469] hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-[#273469] mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-[#1e2749]">
                        {userType.title}
                      </h3>
                      <p className="text-sm md:text-base text-[#30343f] leading-relaxed">
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
            <div className="max-w-lg mx-auto">
              <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl p-6 md:p-10 border-2 border-[#e4d9ff]">
                {/* Back Button */}
                <div className="mb-6 md:mb-8">
                  <button
                    onClick={() => setSelectedRole("")}
                    className="flex items-center gap-2 text-[#30343f] hover:text-[#1e2749] transition-colors"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-xs md:text-sm font-medium">Back to role selection</span>
                  </button>
                </div>

                <div className="text-center mb-6 md:mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl mb-4 md:mb-6 bg-[#273469]">
                    {React.createElement(userTypes.find(t => t.id === selectedRole)?.icon, {
                      className: "w-8 h-8 md:w-10 md:h-10 text-white"
                    })}
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black text-[#1e2749] mb-2 md:mb-3">
                    Sign in as {userTypes.find(t => t.id === selectedRole)?.title}
                  </h2>
                  <p className="text-[#30343f] text-base md:text-lg">
                    {userTypes.find(t => t.id === selectedRole)?.description}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-base md:text-lg font-bold text-[#1e2749] mb-2 md:mb-3">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 md:px-6 py-3 md:py-4 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-base md:text-lg font-bold text-[#1e2749] mb-2 md:mb-3">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full px-4 md:px-6 py-3 md:py-4 pr-12 md:pr-14 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f] text-sm md:text-base"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-[#30343f] hover:text-[#1e2749] transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5 md:w-6 md:h-6" /> : <Eye className="w-5 h-5 md:w-6 md:h-6" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex items-center justify-center gap-2 md:gap-3 py-3 md:py-4 px-6 md:px-8 rounded-xl font-bold text-base md:text-lg text-white transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                      isLoading
                        ? 'bg-[#30343f] cursor-not-allowed'
                        : 'bg-[#273469] hover:bg-[#1e2749] shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer */}
                <div className="mt-6 md:mt-8 text-center">
                  <p className="text-sm md:text-base text-[#30343f]">
                    Don't have an account?{" "}
                    <Link
                      to={selectedRole === "candidate" ? "/candidate/register" : 
                           selectedRole === "recruiter" ? "/recruiter/register" : 
                           "/signup"}
                      className="text-[#273469] hover:text-[#1e2749] font-bold hover:underline transition-colors"
                    >
                      Sign up here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
