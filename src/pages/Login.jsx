import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, Building2, Users, Shield, Eye, EyeOff, ArrowRight } from "lucide-react";
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
      <div className="min-h-screen bg-[#fafaff] text-[#1e2749] overflow-x-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#e4d9ff] rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-[#30343f] rounded-full opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-[#e4d9ff] rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-6xl">
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#e4d9ff] text-[#273469] text-sm font-medium mb-6">
                <Shield className="h-4 w-4 mr-2" />
                Secure Access Portal
              </div>
              <h1 className="text-6xl lg:text-7xl font-black mb-6 text-[#1e2749] leading-tight">
                Welcome to
                <span className="block text-[#273469]">VettedPool</span>
              </h1>
              <p className="text-xl lg:text-2xl text-[#30343f] max-w-3xl mx-auto leading-relaxed">
                Choose your role to access the platform and continue your journey
              </p>
            </div>

          {/* User Type Selection - Only show when no role is selected */}
          {!selectedRole && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {userTypes.map((userType) => {
                const IconComponent = userType.icon;
                
                return (
                  <button
                    key={userType.id}
                    onClick={() => setSelectedRole(userType.id)}
                    className="relative p-8 rounded-2xl border-2 border-[#e4d9ff] bg-white hover:border-[#273469] hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#273469] mb-6 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-[#1e2749]">
                        {userType.title}
                      </h3>
                      <p className="text-[#30343f] leading-relaxed">
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
              <div className="bg-white rounded-2xl shadow-2xl p-10 border-2 border-[#e4d9ff]">
                {/* Back Button */}
                <div className="mb-8">
                  <button
                    onClick={() => setSelectedRole("")}
                    className="flex items-center gap-2 text-[#30343f] hover:text-[#1e2749] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm font-medium">Back to role selection</span>
                  </button>
                </div>

                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 bg-[#273469]">
                    {React.createElement(userTypes.find(t => t.id === selectedRole)?.icon, {
                      className: "w-10 h-10 text-white"
                    })}
                  </div>
                  <h2 className="text-4xl font-black text-[#1e2749] mb-3">
                    Sign in as {userTypes.find(t => t.id === selectedRole)?.title}
                  </h2>
                  <p className="text-[#30343f] text-lg">
                    {userTypes.find(t => t.id === selectedRole)?.description}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-lg font-bold text-[#1e2749] mb-3">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-6 py-4 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f]"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-lg font-bold text-[#1e2749] mb-3">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full px-6 py-4 pr-14 border-2 border-[#e4d9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] placeholder-[#30343f]"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#30343f] hover:text-[#1e2749] transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex items-center justify-center gap-3 py-4 px-8 rounded-xl font-bold text-lg text-white transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                      isLoading
                        ? 'bg-[#30343f] cursor-not-allowed'
                        : 'bg-[#273469] hover:bg-[#1e2749] shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-6 h-6" />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center">
                  <p className="text-[#30343f]">
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

          {/* Demo Credentials - Show when role is selected */}
          {selectedRole && (
            <div className="max-w-lg mx-auto mt-8">
              <div className="bg-[#f2edff] rounded-xl p-6 border-2 border-[#e4d9ff]">
                <h4 className="text-lg font-bold text-[#1e2749] mb-4 text-center">
                  Demo Credentials for {userTypes.find(t => t.id === selectedRole)?.title}
                </h4>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="w-4 h-4 rounded-full bg-[#273469]"></div>
                    <span className="text-[#30343f] font-medium">
                      {selectedRole === 'candidate' ? 'candidate@email.com' :
                       selectedRole === 'recruiter' ? 'recruiter@company.com' :
                       selectedRole === 'internalteam' ? 'team@vettedpool.com' : 'admin@vettedpool.com'}
                    </span>
                  </div>
                  <p className="text-[#30343f]">
                    Password: Use any password for demo purposes
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Demo Credentials - Show when no role is selected */}
          {!selectedRole && (
            <div className="max-w-4xl mx-auto mt-12">
              <div className="bg-white rounded-2xl p-8 border-2 border-[#e4d9ff] shadow-lg">
                <h3 className="text-2xl font-bold text-[#1e2749] mb-6 text-center">
                  Demo Credentials
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-[#f2edff] rounded-xl">
                      <div className="w-4 h-4 rounded-full bg-[#273469]"></div>
                      <div>
                        <span className="font-bold text-[#1e2749]">Candidate:</span>
                        <span className="text-[#30343f] ml-2">candidate@email.com</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#f2edff] rounded-xl">
                      <div className="w-4 h-4 rounded-full bg-[#273469]"></div>
                      <div>
                        <span className="font-bold text-[#1e2749]">Recruiter:</span>
                        <span className="text-[#30343f] ml-2">recruiter@company.com</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-[#f2edff] rounded-xl">
                      <div className="w-4 h-4 rounded-full bg-[#273469]"></div>
                      <div>
                        <span className="font-bold text-[#1e2749]">Internal Team:</span>
                        <span className="text-[#30343f] ml-2">team@vettedpool.com</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#f2edff] rounded-xl">
                      <div className="w-4 h-4 rounded-full bg-[#273469]"></div>
                      <div>
                        <span className="font-bold text-[#1e2749]">Super Admin:</span>
                        <span className="text-[#30343f] ml-2">admin@vettedpool.com</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-[#30343f] text-center mt-6">
                  Password: Use any password for demo purposes
                </p>
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
