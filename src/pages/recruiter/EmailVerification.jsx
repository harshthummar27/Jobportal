import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, CheckCircle, AlertCircle, ArrowLeft, RefreshCw, Clock, Sparkles } from "lucide-react";
import Header from "../../Components/Header";

const EmailVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const email = location.state?.email || "your.email@company.com";
  const type = location.state?.type || "registration";

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerification = async (e) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setError("Please enter the verification code");
      return;
    }

    if (verificationCode.length !== 6) {
      setError("Verification code must be 6 digits");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, verify code with backend
      // Accept any 6-digit code for testing
      if (verificationCode.length === 6) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/recruiter/login", { 
            state: { email, verified: true }
          });
        }, 2000);
      } else {
        setError("Invalid verification code. Please try again.");
      }
    } catch (error) {
      setError("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCountdown(60); // 60 seconds cooldown
      setError("");
    } catch (error) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
    setError("");
  };

  if (success) {
    return (
      <div className="min-h-screen bg-main text-primary overflow-x-hidden">
        <Header />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-accent rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-dark rounded-full opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-purple-accent rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative pt-24 pb-20 lg:pt-32 lg:pb-32">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold text-[#1e2749] mb-4">
                Email Verified!
              </h1>
              
              <p className="text-lg text-[#30343f] mb-8">
                Your email has been successfully verified. Redirecting to login...
              </p>
              
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-main text-primary overflow-x-hidden">
      <Header />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-accent rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-dark rounded-full opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-purple-accent rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative pt-24 pb-20 lg:pt-32 lg:pb-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#e4d9ff] text-[#273469] text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Email Verification
            </div>
            
            <div className="flex items-center justify-center gap-3 mb-6">
              <h1 className="text-2xl lg:text-3xl font-black text-[#1e2749]">
                Verify Your Email
              </h1>
            </div>
            
            <p className="text-lg lg:text-xl text-[#30343f] max-w-2xl mx-auto leading-relaxed">
              We've sent a verification code to your email address
            </p>
          </div>

          {/* Back Button */}
          <div className="mb-8">
            <Link 
              to="/recruiter/register" 
              className="inline-flex items-center gap-2 text-[#30343f] hover:text-[#1e2749] transition-colors duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Registration</span>
            </Link>
          </div>

          {/* Verification Form */}
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#e4d9ff] overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-10">
              {/* Email Display */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-[#f2edff] text-[#273469] px-4 py-2 rounded-lg border border-[#e4d9ff]">
                  <Mail className="h-4 w-4" />
                  <span className="font-medium">{email}</span>
                </div>
                <p className="text-sm text-[#30343f] mt-2">
                  Check your inbox and spam folder for the verification code
                </p>
              </div>

              <form onSubmit={handleVerification} className="space-y-8">
                {/* Verification Code Input */}
                <div>
                  <label className="block text-sm font-semibold text-[#1e2749] mb-3">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={handleCodeChange}
                    className={`w-full px-6 py-4 text-center text-2xl font-mono border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#273469] focus:border-[#273469] transition-all duration-300 text-[#30343f] ${
                      error ? 'border-red-300 bg-red-50' : 'border-[#e4d9ff]'
                    }`}
                    placeholder="000000"
                    maxLength={6}
                    autoComplete="one-time-code"
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isVerifying || verificationCode.length !== 6}
                  className="w-full flex items-center justify-center gap-3 py-4 px-8 rounded-xl font-bold text-lg text-white transition-all duration-300 transform hover:scale-105 active:scale-95 bg-[#273469] hover:bg-[#1e2749] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isVerifying ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Verify Email
                    </>
                  )}
                </button>
              </form>

              {/* Resend Code */}
              <div className="mt-8 text-center">
                <p className="text-sm text-[#30343f] mb-3">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResendCode}
                  disabled={isResending || countdown > 0}
                  className="text-[#273469] hover:text-[#1e2749] font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto transition-colors duration-300"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : countdown > 0 ? (
                    <>
                      <Clock className="h-4 w-4" />
                      Resend in {countdown}s
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Resend Code
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

          {/* Help Section */}
          <div className="mt-16 bg-white rounded-2xl shadow-lg border-2 border-[#e4d9ff] p-6">
            <h3 className="text-xl font-bold text-[#1e2749] mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-[#e4d9ff] rounded-xl flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-[#273469]" />
              </div>
              Need Help?
            </h3>
            <div className="space-y-4 text-sm text-[#30343f]">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#273469] rounded-full mt-2 flex-shrink-0"></div>
                <p>Check your spam or junk mail folder if you don't see the email</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#273469] rounded-full mt-2 flex-shrink-0"></div>
                <p>The verification code expires in 10 minutes</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#273469] rounded-full mt-2 flex-shrink-0"></div>
                <p>Contact support if you continue to have issues</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
