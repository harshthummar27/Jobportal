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
  Calendar
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header />
      
      <div className="pt-8 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-2">
              <FileText className="h-7 w-7 text-white" />
            </div>
            <h4 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Recruiter Agreement
            </h4>
            <p className="text-sm text-gray-600">
              Review and accept our terms to access the candidate network
            </p>
          </div>

          {/* Contract Overview */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Secure Platform</h3>
                  <p className="text-sm text-gray-600">Enterprise-grade security</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Pre-vetted Candidates</h3>
                  <p className="text-sm text-gray-600">Quality guaranteed</p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Transparent Pricing</h3>
                  <p className="text-sm text-gray-600">No hidden fees</p>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">24/7 Support</h3>
                  <p className="text-sm text-gray-600">Always available</p>
                </div>
              </div>

              {/* Contract Preview */}
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recruiter Service Agreement</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowFullContract(!showFullContract)}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4" />
                      {showFullContract ? "Hide" : "View"} Full Contract
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Download className="h-4 w-4" />
                      Download PDF
                    </button>
                  </div>
                </div>

                {showFullContract ? (
                  <div className="space-y-4 text-sm text-gray-700 max-h-96 overflow-y-auto">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">1. Service Overview</h4>
                      <p>VettedPool provides access to pre-screened, qualified candidates through our secure platform. As a recruiter, you agree to use our services in accordance with these terms.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">2. Candidate Privacy</h4>
                      <p>All candidate information is anonymized. You may not attempt to identify candidates through external means or share candidate information with unauthorized parties.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">3. Fee Structure</h4>
                      <p>Fees are based on successful placements. No upfront costs. Payment terms are 30 days net from successful candidate placement.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">4. Data Protection</h4>
                      <p>We comply with GDPR and other data protection regulations. Your data is encrypted and stored securely.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">5. Confidentiality</h4>
                      <p>You agree to maintain confidentiality of all proprietary information and candidate data accessed through our platform.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">6. Compliance</h4>
                      <p>You must comply with all applicable recruitment laws and regulations in your jurisdiction.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">7. Termination</h4>
                      <p>Either party may terminate this agreement with 30 days written notice. Outstanding fees remain due.</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
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
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  {contractTerms.map((term) => (
                    <div key={term.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id={term.id}
                          checked={agreements[term.id]}
                          onChange={() => handleAgreementChange(term.id)}
                          className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <label htmlFor={term.id} className="block">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">{term.title}</span>
                              {term.required && (
                                <span className="text-red-500 text-sm">*</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{term.description}</p>
                          </label>
                          {errors[term.id] && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="h-4 w-4" />
                              {errors[term.id]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Contract Reading Confirmation */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="contractRead"
                      checked={hasReadContract}
                      onChange={(e) => setHasReadContract(e.target.checked)}
                      className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <label htmlFor="contractRead" className="block">
                        <span className="font-medium text-gray-900">
                          I have read and understood the complete Recruiter Service Agreement *
                        </span>
                        {errors.contract && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.contract}
                          </p>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {errors.submit}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !allRequiredAgreed || !hasReadContract}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing Agreement...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Accept Agreement & Access Platform
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Important Notes */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-bold">!</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  Important Information
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• This agreement is legally binding once accepted</li>
                  <li>• You can request changes or clarifications before signing</li>
                  <li>• All candidate information remains confidential and anonymized</li>
                  <li>• Contact our legal team if you have any questions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <Link
              to="/recruiter/profile-setup"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Profile Setup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterContract;
