import React from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, Eye, Database, UserCheck, AlertCircle, CheckCircle, ArrowRight, FileText } from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "1. Introduction",
      content: [
        "VettedPool ('we,' 'our,' or 'us') is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our recruitment platform.",
        "By using VettedPool, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our platform."
      ]
    },
    {
      title: "2. Information We Collect",
      content: [
        "We collect several types of information from and about users of our platform:",
        "• Personal Information: Name, email address, phone number, postal address, and other contact information",
        "• Professional Information: Work history, education, skills, certifications, resume, portfolio, and other professional details",
        "• Account Information: Username, password, and account preferences",
        "• Usage Data: Information about how you access and use our platform, including IP address, browser type, device information, and usage patterns",
        "• Communication Data: Messages, emails, and other communications sent through our platform",
        "• Payment Information: Billing address and payment method details (processed securely through third-party payment processors)"
      ]
    },
    {
      title: "3. How We Collect Information",
      content: [
        "We collect information in the following ways:",
        "• Directly from you when you register for an account, create a profile, or provide information through forms",
        "• Automatically as you navigate through our platform (cookies, log files, and similar technologies)",
        "• From third parties, such as social media platforms (if you choose to connect your account) or background check services",
        "• Through communications with you, including customer support interactions"
      ]
    },
    {
      title: "4. How We Use Your Information",
      content: [
        "We use the information we collect for various purposes, including:",
        "• To provide, maintain, and improve our services",
        "• To match candidates with recruiters and job opportunities",
        "• To process transactions and send related information",
        "• To send you technical notices, updates, and support messages",
        "• To respond to your comments, questions, and requests",
        "• To monitor and analyze trends, usage, and activities",
        "• To detect, prevent, and address technical issues and fraudulent activity",
        "• To personalize your experience and provide content and features relevant to you",
        "• To comply with legal obligations and enforce our Terms and Conditions"
      ]
    },
    {
      title: "5. Information Sharing and Disclosure",
      content: [
        "We may share your information in the following circumstances:",
        "• With Recruiters: Candidate profiles and information may be shared with registered recruiters who are searching for talent",
        "• With Service Providers: We may share information with third-party service providers who perform services on our behalf (e.g., hosting, analytics, payment processing)",
        "• Business Transfers: In connection with any merger, sale, or transfer of assets, your information may be transferred",
        "• Legal Requirements: We may disclose information if required by law or in response to valid requests by public authorities",
        "• With Your Consent: We may share your information with your explicit consent",
        "• Aggregated Data: We may share aggregated, anonymized data that cannot be used to identify you"
      ]
    },
    {
      title: "6. Data Security",
      content: [
        "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:",
        "• Encryption of data in transit and at rest",
        "• Regular security assessments and updates",
        "• Access controls and authentication mechanisms",
        "• Secure data storage and backup procedures",
        "However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security."
      ]
    },
    {
      title: "7. Your Privacy Rights",
      content: [
        "Depending on your location, you may have certain rights regarding your personal information:",
        "• Access: Request access to the personal information we hold about you",
        "• Correction: Request correction of inaccurate or incomplete information",
        "• Deletion: Request deletion of your personal information (subject to legal and contractual obligations)",
        "• Portability: Request transfer of your data to another service",
        "• Objection: Object to certain processing of your information",
        "• Restriction: Request restriction of processing in certain circumstances",
        "• Withdraw Consent: Withdraw consent where processing is based on consent",
        "To exercise these rights, please contact us using the information provided in the Contact section."
      ]
    },
    {
      title: "8. Cookies and Tracking Technologies",
      content: [
        "We use cookies and similar tracking technologies to track activity on our platform and store certain information. Cookies are small data files stored on your device.",
        "Types of cookies we use:",
        "• Essential Cookies: Required for the platform to function properly",
        "• Analytics Cookies: Help us understand how visitors interact with our platform",
        "• Preference Cookies: Remember your settings and preferences",
        "• Marketing Cookies: Used to deliver relevant advertisements",
        "You can control cookies through your browser settings. However, disabling cookies may affect the functionality of our platform."
      ]
    },
    {
      title: "9. Third-Party Links and Services",
      content: [
        "Our platform may contain links to third-party websites or services that are not owned or controlled by VettedPool. We are not responsible for the privacy practices of these third parties.",
        "We encourage you to review the privacy policies of any third-party services you access through our platform. This Privacy Policy applies only to information collected by VettedPool."
      ]
    },
    {
      title: "10. Children's Privacy",
      content: [
        "Our platform is not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18.",
        "If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information. If you believe we have collected information from a child under 18, please contact us immediately."
      ]
    },
    {
      title: "11. International Data Transfers",
      content: [
        "Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country.",
        "By using our platform, you consent to the transfer of your information to countries outside your country of residence. We take appropriate measures to ensure your information receives adequate protection in accordance with this Privacy Policy."
      ]
    },
    {
      title: "12. Data Retention",
      content: [
        "We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.",
        "When we no longer need your information, we will securely delete or anonymize it. Some information may be retained for legal, accounting, or reporting purposes.",
        "You can request deletion of your account and associated data at any time through your account settings or by contacting us."
      ]
    },
    {
      title: "13. Changes to This Privacy Policy",
      content: [
        "We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.",
        "We will notify you of any material changes by posting the new Privacy Policy on this page and updating the 'Last Updated' date. We may also notify you via email or through a notice on our platform.",
        "You are advised to review this Privacy Policy periodically for any changes. Your continued use of the platform after changes become effective constitutes acceptance of the updated Privacy Policy."
      ]
    },
    {
      title: "14. Contact Us",
      content: [
        "If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:",
        "Email: privacy@vettedpool.com",
        "Phone: +1 (555) 123-4567",
        "Address: 123 Business Street, New York, NY 10001, USA",
        "For general inquiries: support@vettedpool.com"
      ]
    }
  ];

  const privacyHighlights = [
    {
      icon: Lock,
      title: "Secure Data Storage",
      description: "Your information is encrypted and stored securely using industry-standard security measures."
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "We are transparent about what data we collect and how we use it."
    },
    {
      icon: UserCheck,
      title: "Your Control",
      description: "You have control over your personal information and can access, update, or delete it at any time."
    },
    {
      icon: Database,
      title: "Minimal Data Collection",
      description: "We only collect the information necessary to provide and improve our services."
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
                <Shield className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Privacy Policy
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed px-2">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
            </p>
            <p className="text-sm sm:text-base text-gray-300 mt-4">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Highlights Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Our Privacy Commitment
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              We are committed to protecting your privacy and being transparent about our data practices
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {privacyHighlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <div className="bg-[#273469]/10 rounded-lg p-3 sm:p-4 w-fit mb-3 sm:mb-4">
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-[#273469]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{highlight.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{highlight.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Privacy Policy Content Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Important Notice */}
          <div className="bg-blue-50 border-l-4 border-[#273469] rounded-lg p-4 sm:p-6 mb-8 sm:mb-10">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-[#273469] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Your Privacy Matters
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  At VettedPool, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
                  disclose, and safeguard your information when you use our recruitment platform. We encourage you to 
                  read this policy carefully to understand our practices regarding your personal information.
                </p>
              </div>
            </div>
          </div>

          {/* Policy Sections */}
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

          {/* Your Rights Section */}
          <div className="mt-10 sm:mt-12 md:mt-16 bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 sm:p-8 md:p-10 border-2 border-[#273469]">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 text-[#273469] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Your Privacy Rights
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 sm:mb-6">
                  You have the right to access, correct, update, or delete your personal information at any time. 
                  You can also object to certain processing of your information or request that we restrict how we 
                  use your data. To exercise these rights, please contact us using the information provided in 
                  the Contact section above.
                </p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  We are committed to responding to your privacy requests in a timely manner and in accordance 
                  with applicable data protection laws.
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
              to="/terms-and-conditions"
              className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 hover:border-[#273469] hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-[#273469] transition-colors">
                  Terms & Conditions
                </h3>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-[#273469] transition-colors" />
              </div>
              <p className="text-sm sm:text-base text-gray-600">
                Review our terms of service and user agreements.
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
                Have questions about privacy? Get in touch with our support team.
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

export default PrivacyPolicy;

