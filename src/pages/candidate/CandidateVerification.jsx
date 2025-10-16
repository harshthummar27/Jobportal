import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, CheckCircle, AlertCircle, ArrowLeft, RefreshCw, Clock } from "lucide-react";
import Header from "../../Components/Header";

const CandidateVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const email = location.state?.email || "your.email@example.com";
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
      if (verificationCode === "123456") { // Demo code
        setSuccess(true);
        setTimeout(() => {
          navigate("/candidate/profile-setup", { 
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <Header />
        
        <div className="pt-16 pb-8">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Email Verified!
              </h1>
              
              <p className="text-base sm:text-lg text-gray-600 mb-8">
                Your email has been successfully verified. Redirecting to profile setup...
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header />
      
      <div className="pt-8 pb-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-3">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h4>
            <p className="text-base sm:text-sm text-gray-600">
              We've sent a verification code to your email address
            </p>
          </div>

          {/* Verification Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Email Display */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg">
                  <Mail className="h-4 w-4" />
                  <span className="font-medium">{email}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Check your inbox and spam folder for the verification code
                </p>
              </div>

              <form onSubmit={handleVerification} className="space-y-6">
                {/* Verification Code Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={handleCodeChange}
                    className={`w-full px-4 py-4 text-center text-2xl font-mono border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                      error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="000000"
                    maxLength={6}
                    autoComplete="one-time-code"
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isVerifying || verificationCode.length !== 6}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResendCode}
                  disabled={isResending || countdown > 0}
                  className="text-indigo-600 hover:text-indigo-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
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

              {/* Demo Code Notice */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-bold">!</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      Demo Mode
                    </h4>
                    <p className="text-sm text-blue-700">
                      For testing purposes, use the verification code: <span className="font-mono font-bold">123456</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-6 text-center">
            <Link
              to="/candidate/register"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Registration
            </Link>
          </div>

          {/* Help Section */}
          <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Need Help?
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>Check your spam or junk mail folder if you don't see the email</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>The verification code expires in 10 minutes</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>Contact support if you continue to have issues</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateVerification;
