import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import { 
  CheckCircle, 
  AlertCircle, 
  Eye,
  Download
} from "lucide-react";
import Header from "../../Components/Header";

const RecruiterContract = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTerms, setIsLoadingTerms] = useState(true);
  const [errors, setErrors] = useState({});
  const [hasReadContract, setHasReadContract] = useState(false);
  const [showFullContract, setShowFullContract] = useState(false);
  const [agreementData, setAgreementData] = useState({
    agreement_terms: "",
    agreement_version: "",
    last_updated: ""
  });

  const profileData = location.state?.profileData || {};
  const logoFile = location.state?.logoFile || null;

  // Fetch agreement terms on component mount
  useEffect(() => {
    const fetchAgreementTerms = async () => {
      try {
        setIsLoadingTerms(true);
        
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('User not authenticated');
        }
        
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recruiter/agreement`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch agreement terms');
        }

        const data = await response.json();
        setAgreementData(data);
      } catch (error) {
        console.error('Error fetching agreement terms:', error);
        setErrors({ api: 'Failed to load agreement terms. Please refresh the page.' });
      } finally {
        setIsLoadingTerms(false);
      }
    };

    fetchAgreementTerms();
  }, []);

  const validateAgreement = () => {
    const newErrors = {};
    
    if (!hasReadContract) {
      newErrors.contract = "You must read the full contract before proceeding";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAgreement()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }
      
      // Prepare the request payload
      const requestPayload = {
        agreement_terms: agreementData.agreement_terms,
        agreement_version: agreementData.agreement_version
      };
      
      console.log("Sending agreement acceptance request:", requestPayload);
      console.log("API URL:", `${import.meta.env.VITE_API_BASE_URL}/api/recruiter/accept-agreement`);
      
      // Call API to accept agreement
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recruiter/accept-agreement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestPayload),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorMessage = 'Failed to accept agreement';
        try {
          const errorData = await response.json();
          console.log("Error response data:", errorData);
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          // If response is not JSON (e.g., HTML error page), get text content
          try {
            const errorText = await response.text();
            console.log("Error response text:", errorText);
            console.log("Full error response:", errorText.substring(0, 500)); // First 500 chars
            errorMessage = `Server error (${response.status}): ${response.statusText}. Check console for details.`;
          } catch (textError) {
            console.log("Could not read error response text:", textError);
            errorMessage = `Server error (${response.status}): ${response.statusText}`;
          }
        }
        throw new Error(errorMessage);
      }

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        throw new Error('Invalid response format from server');
      }
      console.log("Agreement accepted successfully:", result);
      
      // Mark agreement as accepted in localStorage
      localStorage.setItem("recruiterAgreementAccepted", "true");
      localStorage.setItem("recruiterProfileData", JSON.stringify(result.recruiter_profile));
      
      // Show success message
      toast.success("Agreement accepted successfully! Welcome to the platform.");
      
      // Navigate to recruiter dashboard
      navigate("/recruiter/dashboard", { 
        state: { 
          profileComplete: true,
          contractSigned: true,
          profileData,
          logoFile,
          agreementAccepted: true,
          recruiterProfile: result.recruiter_profile,
          canAccessCandidates: result.can_access_candidates
        }
      });
    } catch (error) {
      console.error("Contract submission error:", error);
      setErrors({ submit: error.message || "Failed to process agreement. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-main text-primary overflow-x-hidden">
      <Header />
      
      <div className="pt-20 md:pt-24 pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-4">
              Recruiter Agreement
            </h1>
            <p className="text-secondary max-w-2xl mx-auto">
              Review and accept our terms to access the pre-vetted candidate network
            </p>
          </div>

          {/* Contract Display */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recruiter Service Agreement</h3>
                  {agreementData.agreement_version && (
                    <p className="text-sm text-gray-600 mt-1">
                      Version {agreementData.agreement_version} • Last updated: {new Date(agreementData.last_updated).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFullContract(!showFullContract)}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-dark transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    {showFullContract ? "Hide" : "View"} Full Contract
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </button>
                </div>
              </div>

              {isLoadingTerms ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-3 text-sm text-gray-600">Loading agreement terms...</span>
                </div>
              ) : errors.api ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {errors.api}
                  </p>
                </div>
              ) : showFullContract ? (
                <div className="text-sm text-gray-700 max-h-80 overflow-y-auto whitespace-pre-line">
                  {agreementData.agreement_terms || "No agreement terms available."}
                </div>
              ) : (
                <div className="text-sm text-gray-700">
                  <p className="mb-2">This agreement covers:</p>
                  <div className="whitespace-pre-line">
                    {agreementData.agreement_terms ? 
                      agreementData.agreement_terms.split('\n').slice(0, 5).join('\n') + '\n\n...' : 
                      "No agreement terms available."
                    }
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Agreement Form */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contract Reading Confirmation */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="contractRead"
                      checked={hasReadContract}
                      onChange={(e) => setHasReadContract(e.target.checked)}
                      className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <label htmlFor="contractRead" className="block">
                        <span className="font-medium text-gray-900">
                          I have read and understood the complete Recruiter Service Agreement{agreementData.agreement_version ? ` (Version ${agreementData.agreement_version})` : ''} *
                        </span>
                        {errors.contract && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
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
                  disabled={isLoading || !hasReadContract || isLoadingTerms}
                  className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-dark focus:ring-4 focus:ring-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing Agreement...
                    </>
                  ) : isLoadingTerms ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Loading Agreement Terms...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Accept Agreement & Search Candidates
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Important Notes */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-bold">!</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  Important Information
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• This agreement is legally binding once accepted</li>
                  <li>• All candidate information remains confidential and anonymized</li>
                  <li>• Contact our support team if you have any questions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterContract;
