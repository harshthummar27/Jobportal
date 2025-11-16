import React from "react";
import { Link } from "react-router-dom";
import { FileText, Shield, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const TermsAndConditions = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: [
        "By accessing and using VettedPool's platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
        "These Terms and Conditions apply to all users of the platform, including candidates, recruiters, and any other visitors to our website."
      ]
    },
    {
      title: "2. Description of Service",
      content: [
        "VettedPool is a recruitment platform that connects qualified candidates with recruiters and employers. We provide a marketplace where candidates can showcase their profiles and recruiters can discover and connect with potential candidates.",
        "We reserve the right to modify, suspend, or discontinue any part of the service at any time, with or without notice."
      ]
    },
    {
      title: "3. User Accounts and Registration",
      content: [
        "To use certain features of our platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process.",
        "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
        "You must notify us immediately of any unauthorized use of your account or any other breach of security."
      ]
    },
    {
      title: "4. User Responsibilities",
      content: [
        "Candidates are responsible for ensuring that all information provided in their profiles is accurate, truthful, and up-to-date.",
        "Recruiters are responsible for conducting their own due diligence on candidates and making informed hiring decisions.",
        "Users must not use the platform for any illegal or unauthorized purpose, including but not limited to fraud, harassment, or violation of any applicable laws.",
        "Users must not attempt to gain unauthorized access to any part of the platform or interfere with its operation."
      ]
    },
    {
      title: "5. Privacy and Data Protection",
      content: [
        "We are committed to protecting your privacy. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.",
        "By using our platform, you consent to the collection, use, and disclosure of your information as described in our Privacy Policy.",
        "We implement appropriate security measures to protect your data, but cannot guarantee absolute security."
      ]
    },
    {
      title: "6. Intellectual Property",
      content: [
        "All content on the VettedPool platform, including but not limited to text, graphics, logos, images, and software, is the property of VettedPool or its content suppliers and is protected by copyright and other intellectual property laws.",
        "Users retain ownership of the content they submit to the platform but grant VettedPool a license to use, display, and distribute such content for the purpose of operating the platform.",
        "You may not reproduce, distribute, modify, or create derivative works from any content on the platform without our express written permission."
      ]
    },
    {
      title: "7. Fees and Payment",
      content: [
        "Some features of the platform may require payment. All fees are clearly displayed before you commit to a purchase.",
        "Fees are non-refundable unless otherwise stated or required by law.",
        "We reserve the right to change our pricing at any time, but will provide notice of any changes to existing subscribers.",
        "Payment processing is handled by third-party payment processors, and you agree to their terms and conditions."
      ]
    },
    {
      title: "8. Prohibited Activities",
      content: [
        "Users are strictly prohibited from:",
        "• Posting false, misleading, or fraudulent information",
        "• Harassing, threatening, or abusing other users",
        "• Violating any applicable laws or regulations",
        "• Attempting to reverse engineer or hack the platform",
        "• Using automated systems to access the platform without permission",
        "• Impersonating another person or entity",
        "• Spamming or sending unsolicited communications"
      ]
    },
    {
      title: "9. Termination",
      content: [
        "We reserve the right to suspend or terminate your account at any time, with or without cause or notice, for any reason including violation of these Terms.",
        "You may terminate your account at any time by contacting us or using the account deletion feature in your settings.",
        "Upon termination, your right to use the platform will immediately cease, and we may delete your account and all associated data."
      ]
    },
    {
      title: "10. Disclaimers and Limitation of Liability",
      content: [
        "VettedPool provides the platform 'as is' and 'as available' without warranties of any kind, either express or implied.",
        "We do not guarantee that the platform will be uninterrupted, secure, or error-free.",
        "We are not responsible for the accuracy, completeness, or reliability of any information provided by users.",
        "To the maximum extent permitted by law, VettedPool shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the platform."
      ]
    },
    {
      title: "11. Indemnification",
      content: [
        "You agree to indemnify and hold harmless VettedPool, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising out of your use of the platform, violation of these Terms, or infringement of any rights of another party."
      ]
    },
    {
      title: "12. Dispute Resolution",
      content: [
        "Any disputes arising out of or relating to these Terms or the platform shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.",
        "You agree to waive any right to a jury trial and to participate in a class action lawsuit.",
        "These Terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions."
      ]
    },
    {
      title: "13. Changes to Terms",
      content: [
        "We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the updated Terms on the platform and updating the 'Last Updated' date.",
        "Your continued use of the platform after such changes constitutes your acceptance of the new Terms.",
        "If you do not agree to the modified Terms, you must stop using the platform."
      ]
    },
    {
      title: "14. Contact Information",
      content: [
        "If you have any questions about these Terms and Conditions, please contact us at:",
        "Email: support@vettedpool.com",
        "Phone: +1 (555) 123-4567",
        "Address: 123 Business Street, New York, NY 10001, USA"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 md:pt-24 md:pb-16 lg:pt-28 lg:pb-20 bg-gradient-to-br from-[#273469] via-[#1e2749] to-[#273469] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="bg-white/10 rounded-full p-3 sm:p-4">
                <FileText className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Terms & Conditions
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed px-2">
              Please read these terms carefully before using our platform. By using VettedPool, you agree to be bound by these terms.
            </p>
            <p className="text-sm sm:text-base text-gray-300 mt-4">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Important Notice */}
          <div className="bg-blue-50 border-l-4 border-[#273469] rounded-lg p-4 sm:p-6 mb-8 sm:mb-10">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-[#273469] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Important Notice
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  These Terms and Conditions govern your use of the VettedPool platform. By accessing or using our services, 
                  you acknowledge that you have read, understood, and agree to be bound by these terms. If you do not agree 
                  with any part of these terms, you must not use our platform.
                </p>
              </div>
            </div>
          </div>

          {/* Terms Sections */}
          <div className="space-y-6 sm:space-y-8 md:space-y-10">
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-[#273469] flex-shrink-0" />
                  {section.title}
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {section.content.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="text-sm sm:text-base text-gray-700 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Agreement Section */}
          <div className="mt-10 sm:mt-12 md:mt-16 bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 sm:p-8 md:p-10 border-2 border-[#273469]">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 text-[#273469] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Agreement to Terms
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 sm:mb-6">
                  By using VettedPool, you acknowledge that you have read these Terms and Conditions, understand them, 
                  and agree to be bound by them. You also agree to comply with all applicable laws and regulations when 
                  using our platform.
                </p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  If you have any questions or concerns about these terms, please contact us before using the platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Related Information
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              Learn more about our policies and practices
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Link
              to="/privacy-policy"
              className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 hover:border-[#273469] hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-[#273469] transition-colors">
                  Privacy Policy
                </h3>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-[#273469] transition-colors" />
              </div>
              <p className="text-sm sm:text-base text-gray-600">
                Learn how we collect, use, and protect your personal information.
              </p>
            </Link>
            <Link
              to="/contact-us"
              className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 hover:border-[#273469] hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-[#273469] transition-colors">
                  Contact Support
                </h3>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-[#273469] transition-colors" />
              </div>
              <p className="text-sm sm:text-base text-gray-600">
                Have questions about these terms? Get in touch with our support team.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-r from-[#273469] to-[#1e2749] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Join thousands of candidates and recruiters who trust VettedPool. Create your account today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/candidate/register"
              className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-[#273469] font-semibold rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base"
            >
              Join as Candidate
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <Link
              to="/recruiter/register"
              className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-sm sm:text-base"
            >
              Join as Recruiter
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;

