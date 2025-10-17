import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  Download, 
  Eye,
  Clock,
  Shield,
  Users,
  DollarSign,
  Calendar,
  Sparkles
} from "lucide-react";
import Header from "../../Components/Header";

const RecruiterContract = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreements, setAgreements] = useState({
    termsAndConditions: false,
    privacyPolicy: false,
    dataProtection: false,
    candidatePrivacy: false,
    feeStructure: false,
    confidentiality: false,
    compliance: false
  });
  const [hasReadContract, setHasReadContract] = useState(false);
  const [showFullContract, setShowFullContract] = useState(false);

  const profileData = location.state?.profileData || {};
  const logoFile = location.state?.logoFile || null;

  const contractTerms = [
    {
      id: "termsAndConditions",
      title: "Terms and Conditions",
      description: "General terms of service and platform usage",
      required: true
    },
    {
      id: "privacyPolicy", 
      title: "Privacy Policy",
      description: "How we collect, use, and protect your data",
      required: true
    },
    {
      id: "dataProtection",
      title: "Data Protection Agreement",
      description: "GDPR compliance and data handling procedures",
      required: true
    },
    {
      id: "candidatePrivacy",
      title: "Candidate Privacy Protection",
      description: "Commitment to protecting candidate information",
      required: true
    },
    {
      id: "feeStructure",
      title: "Fee Structure Agreement",
      description: "Understanding of our pricing and payment terms",
      required: true
    },
    {
      id: "confidentiality",
      title: "Confidentiality Agreement",
      description: "Non-disclosure of proprietary information",
      required: true
    },
    {
      id: "compliance",
      title: "Compliance and Ethics",
      description: "Adherence to recruitment best practices and regulations",
      required: true
    }
  ];

  const handleAgreementChange = (id) => {
    setAgreements(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    
    // Clear error when user makes selection
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ""
      }));
    }
  };

  const validateAgreements = () => {
    const newErrors = {};
    
    contractTerms.forEach(term => {
      if (term.required && !agreements[term.id]) {
        newErrors[term.id] = "This agreement is required";
      }
    });

    if (!hasReadContract) {
      newErrors.contract = "You must read the full contract before proceeding";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAgreements()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, save contract agreements
      console.log("Contract agreements:", agreements);
      console.log("Profile data:", profileData);
      
      // Navigate to dashboard
      navigate("/recruiter/dashboard", { 
        state: { 
          profileComplete: true,
          contractSigned: true,
          profileData,
          logoFile
        }
      });
    } catch (error) {
      console.error("Contract submission error:", error);
      setErrors({ submit: "Failed to process agreement. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const allRequiredAgreed = contractTerms.every(term => 
    !term.required || agreements[term.id]
  );

  return (
    <div className="min-h-screen bg-[#fafaff] text-[#1e2749] overflow-x-hidden">
      <Header />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#e4d9ff] rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-[#30343f] rounded-full opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-[#e4d9ff] rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative pt-20 md:pt-24 pb-16 md:pb-20 lg:pt-32 lg:pb-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-[#e4d9ff] text-[#273469] text-xs md:text-sm font-medium mb-4 md:mb-6">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4 mr-1.5 md:mr-2" />
              Final Step
            </div>
            
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
              <h1 className="text-lg md:text-xl lg:text-2xl font-black text-[#1e2749] px-4">
                Recruiter Agreement
              </h1>
            </div>
            
            <p className="text-sm md:text-base lg:text-lg text-[#30343f] max-w-2xl mx-auto leading-relaxed px-4">
              Review and accept our terms to access the pre-vetted candidate network
            </p>
          </div>

          {/* Contract Overview */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl border-2 border-[#e4d9ff] overflow-hidden mb-6 md:mb-8">
            <div className="p-4 md:p-6 lg:p-8">
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-6">
                <div className="text-center p-3 md:p-6 bg-[#f2edff] rounded-lg md:rounded-xl border-2 border-[#e4d9ff] hover:shadow-lg transition-all duration-300">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-[#e4d9ff] rounded-lg md:rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                    <Shield className="h-4 w-4 md:h-6 md:w-6 text-[#273469]" />
                  </div>
                  <h3 className="font-semibold text-[#1e2749] mb-1 md:mb-2 text-xs md:text-sm">Secure Platform</h3>
                  <p className="text-xs md:text-sm text-[#30343f]">Enterprise-grade security</p>
                </div>
                
                <div className="text-center p-3 md:p-6 bg-[#f2edff] rounded-lg md:rounded-xl border-2 border-[#e4d9ff] hover:shadow-lg transition-all duration-300">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-[#e4d9ff] rounded-lg md:rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                    <Users className="h-4 w-4 md:h-6 md:w-6 text-[#273469]" />
                  </div>
                  <h3 className="font-semibold text-[#1e2749] mb-1 md:mb-2 text-xs md:text-sm">Pre-vetted Candidates</h3>
                  <p className="text-xs md:text-sm text-[#30343f]">Quality guaranteed</p>
                </div>
                
                <div className="text-center p-3 md:p-6 bg-[#f2edff] rounded-lg md:rounded-xl border-2 border-[#e4d9ff] hover:shadow-lg transition-all duration-300">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-[#e4d9ff] rounded-lg md:rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                    <DollarSign className="h-4 w-4 md:h-6 md:w-6 text-[#273469]" />
                  </div>
                  <h3 className="font-semibold text-[#1e2749] mb-1 md:mb-2 text-xs md:text-sm">Transparent Pricing</h3>
                  <p className="text-xs md:text-sm text-[#30343f]">No hidden fees</p>
                </div>
                
                <div className="text-center p-3 md:p-6 bg-[#f2edff] rounded-lg md:rounded-xl border-2 border-[#e4d9ff] hover:shadow-lg transition-all duration-300">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-[#e4d9ff] rounded-lg md:rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                    <Calendar className="h-4 w-4 md:h-6 md:w-6 text-[#273469]" />
                  </div>
                  <h3 className="font-semibold text-[#1e2749] mb-1 md:mb-2 text-xs md:text-sm">24/7 Support</h3>
                  <p className="text-xs md:text-sm text-[#30343f]">Always available</p>
                </div>
              </div>

              {/* Contract Preview */}
              <div className="border-2 border-[#e4d9ff] rounded-lg md:rounded-xl p-4 md:p-6 bg-[#fafaff]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <h3 className="text-base md:text-lg font-semibold text-[#1e2749]">Recruiter Service Agreement</h3>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => setShowFullContract(!showFullContract)}
                      className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm bg-[#273469] text-white rounded-lg md:rounded-xl hover:bg-[#1e2749] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                    >
                      <Eye className="h-3 w-3 md:h-4 md:w-4" />
                      {showFullContract ? "Hide" : "View"} Full Contract
                    </button>
                    <button className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm bg-white border-2 border-[#e4d9ff] text-[#30343f] rounded-lg md:rounded-xl hover:bg-[#fafaff] transition-all duration-300">
                      <Download className="h-3 w-3 md:h-4 md:w-4" />
                      Download PDF
                    </button>
                  </div>
                </div>

                {showFullContract ? (
                  <div className="space-y-3 md:space-y-4 text-xs md:text-sm text-[#30343f] max-h-80 md:max-h-96 overflow-y-auto">
                    <div>
                      <h4 className="font-semibold text-[#1e2749] mb-1 md:mb-2 text-sm md:text-base">1. Service Overview</h4>
                      <p>VettedPool provides access to pre-screened, qualified candidates through our secure platform. As a recruiter, you agree to use our services in accordance with these terms.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-[#1e2749] mb-1 md:mb-2 text-sm md:text-base">2. Candidate Privacy</h4>
                      <p>All candidate information is anonymized. You may not attempt to identify candidates through external means or share candidate information with unauthorized parties.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-[#1e2749] mb-1 md:mb-2 text-sm md:text-base">3. Fee Structure</h4>
                      <p>Fees are based on successful placements. No upfront costs. Payment terms are 30 days net from successful candidate placement.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-[#1e2749] mb-1 md:mb-2 text-sm md:text-base">4. Data Protection</h4>
                      <p>We comply with GDPR and other data protection regulations. Your data is encrypted and stored securely.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-[#1e2749] mb-1 md:mb-2 text-sm md:text-base">5. Confidentiality</h4>
                      <p>You agree to maintain confidentiality of all proprietary information and candidate data accessed through our platform.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-[#1e2749] mb-1 md:mb-2 text-sm md:text-base">6. Compliance</h4>
                      <p>You must comply with all applicable recruitment laws and regulations in your jurisdiction.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-[#1e2749] mb-1 md:mb-2 text-sm md:text-base">7. Termination</h4>
                      <p>Either party may terminate this agreement with 30 days written notice. Outstanding fees remain due.</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs md:text-sm text-[#30343f]">
                    <p className="mb-2">This agreement covers:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Access to pre-vetted candidate profiles</li>
                      <li>Candidate privacy protection requirements</li>
                      <li>Fee structure and payment terms</li>
                      <li>Data protection and confidentiality obligations</li>
                      <li>Compliance with recruitment regulations</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Agreement Form */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl border-2 border-[#e4d9ff] overflow-hidden">
            <div className="p-4 md:p-6 lg:p-8 xl:p-10">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="space-y-3 md:space-y-4">
                  {contractTerms.map((term) => (
                    <div key={term.id} className="border-2 border-[#e4d9ff] rounded-lg md:rounded-xl p-4 md:p-6 bg-[#fafaff] hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start gap-3 md:gap-4">
                        <input
                          type="checkbox"
                          id={term.id}
                          checked={agreements[term.id]}
                          onChange={() => handleAgreementChange(term.id)}
                          className="mt-1 h-4 w-4 md:h-5 md:w-5 text-[#273469] focus:ring-[#273469] border-[#e4d9ff] rounded"
                        />
                        <div className="flex-1">
                          <label htmlFor={term.id} className="block">
                            <div className="flex items-center gap-2 mb-1 md:mb-2">
                              <span className="font-semibold text-[#1e2749] text-sm md:text-base">{term.title}</span>
                              {term.required && (
                                <span className="text-red-500 text-xs md:text-sm">*</span>
                              )}
                            </div>
                            <p className="text-xs md:text-sm text-[#30343f]">{term.description}</p>
                          </label>
                          {errors[term.id] && (
                            <p className="mt-1 md:mt-2 text-xs md:text-sm text-red-600 flex items-center gap-1 md:gap-2">
                              <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
                              {errors[term.id]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Contract Reading Confirmation */}
                <div className="border-2 border-[#e4d9ff] rounded-lg md:rounded-xl p-4 md:p-6 bg-[#f2edff]">
                  <div className="flex items-start gap-3 md:gap-4">
                    <input
                      type="checkbox"
                      id="contractRead"
                      checked={hasReadContract}
                      onChange={(e) => setHasReadContract(e.target.checked)}
                      className="mt-1 h-4 w-4 md:h-5 md:w-5 text-[#273469] focus:ring-[#273469] border-[#e4d9ff] rounded"
                    />
                    <div className="flex-1">
                      <label htmlFor="contractRead" className="block">
                        <span className="font-semibold text-[#1e2749] text-sm md:text-base">
                          I have read and understood the complete Recruiter Service Agreement *
                        </span>
                        {errors.contract && (
                          <p className="mt-1 md:mt-2 text-xs md:text-sm text-red-600 flex items-center gap-1 md:gap-2">
                            <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
                            {errors.contract}
                          </p>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4">
                    <p className="text-xs md:text-sm text-red-600 flex items-center gap-1 md:gap-2">
                      <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
                      {errors.submit}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !allRequiredAgreed || !hasReadContract}
                  className="w-full bg-[#273469] text-white py-3 md:py-4 px-4 md:px-6 rounded-lg md:rounded-xl font-semibold text-sm md:text-lg hover:bg-[#1e2749] focus:ring-4 focus:ring-[#273469] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white"></div>
                      Processing Agreement...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5" />
                      Accept Agreement & Access Platform
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Important Notes */}
          <div className="mt-6 md:mt-8 bg-[#f2edff] border-2 border-[#e4d9ff] rounded-lg md:rounded-xl p-4 md:p-6">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-[#e4d9ff] rounded-lg md:rounded-xl flex items-center justify-center">
                  <span className="text-[#273469] text-xs md:text-sm font-bold">!</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm md:text-base font-semibold text-[#1e2749] mb-2 md:mb-3">
                  Important Information
                </h4>
                <ul className="text-xs md:text-sm text-[#30343f] space-y-1 md:space-y-2">
                  <li>• This agreement is legally binding once accepted</li>
                  <li>• You can request changes or clarifications before signing</li>
                  <li>• All candidate information remains confidential and anonymized</li>
                  <li>• Contact our legal team if you have any questions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-6 md:mt-8 text-center">
            <Link
              to="/recruiter/profile-setup"
              className="inline-flex items-center gap-2 text-[#30343f] hover:text-[#1e2749] transition-colors duration-300 font-medium text-sm md:text-base"
            >
              <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
              Back to Profile Setup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterContract;
