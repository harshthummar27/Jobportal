import { Link, useSearchParams } from "react-router-dom";
import React from "react";
import { CheckCircle, Shield } from "lucide-react";

const SignupSuccess = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Shield className="h-10 w-10 text-blue-600" />
            <span className="text-3xl font-bold text-blue-700">VettedPool</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl text-center font-bold mb-4">Congratulations!</h2>

          {/* Message */}
          <div className="text-center space-y-3">
            {role === "candidate" ? (
              <>
                <p className="text-gray-500">
                  Your registration has been submitted successfully!
                </p>
                <p className="text-gray-800 font-medium">
                  Our technical team will reach out to you soon for the interview process.
                </p>
                <p className="text-sm text-gray-500">
                  Once you clear our screening and interviews, your profile will be visible to recruiters.
                </p>
              </>
            ) : (
              <>
                <p className="text-gray-500">
                  Your recruiter account has been created successfully!
                </p>
                <p className="text-gray-800 font-medium">
                  Your portal access will be granted within 24 hours.
                </p>
                <p className="text-sm text-gray-500">
                  In some cases, verification may be necessary. You will receive login credentials via email.
                </p>
              </>
            )}
          </div>

          {/* Back to Home Button */}
          <div className="mt-6">
            <Link
              to="/"
              className="block w-full bg-white border border-gray-300 text-black font-medium py-2 rounded-lg text-center hover:bg-blue-50 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupSuccess;
