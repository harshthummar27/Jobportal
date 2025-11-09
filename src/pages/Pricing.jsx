import React from "react";
import { Link } from "react-router-dom";
import {
  Check,
  ArrowRight,
  FileText,
  Shield,
  DollarSign,
  Percent,
  Calculator,
  Info,
  AlertCircle,
} from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 md:pt-24 md:pb-16 lg:pt-28 lg:pb-20 bg-gradient-to-br from-[#273469] via-[#1e2749] to-[#273469] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Simple & Transparent Pricing
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed px-2">
              Pay only when you successfully place a candidate. No upfront costs, no monthly fees.
            </p>
          </div>
        </div>
      </section>

      {/* Recruiter Pricing Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-[#273469]/10 rounded-full px-4 py-2 mb-4">
              <DollarSign className="h-5 w-5 text-[#273469]" />
              <span className="text-sm sm:text-base font-semibold text-[#273469]">For Recruiters</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Success-Based Pricing
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              We only succeed when you do. Our fee is based on successful placements.
            </p>
          </div>

          {/* Fee Structure Card */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#273469]/10 to-[#273469]/5 rounded-2xl p-6 sm:p-8 md:p-10 border-2 border-[#273469]/20 shadow-xl">
              <div className="text-center mb-8 sm:mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-[#273469] rounded-full mb-4 sm:mb-6">
                  <Percent className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                </div>
                <div className="mb-4">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#273469]">7</span>
                    <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#273469]">%</span>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 mt-2">
                    Commission Fee
                  </p>
                </div>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                  Charged only on successful candidate placements
                </p>
              </div>

              {/* Fee Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Calculator className="h-6 w-6 text-[#273469]" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">How It Works</h3>
                  </div>
                  <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>No upfront costs or monthly fees</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Pay only when candidate is successfully placed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Fee calculated on candidate's annual salary</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Transparent billing with detailed invoices</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Info className="h-6 w-6 text-[#273469]" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Fee Calculation</h3>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">Example:</p>
                      <p className="text-sm sm:text-base text-gray-700">
                        <span className="font-semibold">Annual Salary:</span> $100,000
                      </p>
                      <p className="text-sm sm:text-base text-gray-700">
                        <span className="font-semibold">Commission (7%):</span> $7,000
                      </p>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Fee is calculated on the gross annual salary offered to the candidate.
                    </p>
                  </div>
                </div>
              </div>

              {/* What's Included */}
              <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 border border-gray-200 mb-8">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                  <Shield className="h-6 w-6 text-[#273469]" />
                  What's Included
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    "Unlimited job postings",
                    "Access to candidate database",
                    "Candidate profile matching",
                    "Interview scheduling tools",
                    "Application management",
                    "Candidate communication",
                    "Placement tracking",
                    "Dedicated support",
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <Link
                  to="/recruiter/register"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-[#273469] text-white font-semibold rounded-lg hover:bg-[#1e2749] transition-colors text-base sm:text-lg"
                >
                  Get Started as Recruiter
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terms and Conditions Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-[#273469]/10 rounded-full px-4 py-2 mb-4">
              <FileText className="h-5 w-5 text-[#273469]" />
              <span className="text-sm sm:text-base font-semibold text-[#273469]">Terms & Conditions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Pricing Terms & Conditions
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              Please read our terms and conditions carefully
            </p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-200 shadow-sm">
            <div className="space-y-6 sm:space-y-8">
              {/* Section 1 */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-[#273469]" />
                  1. Commission Fee Structure
                </h3>
                <div className="space-y-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                  <p>
                    VettedPool charges a commission fee of 7% of the candidate's annual gross salary upon successful placement. 
                    This fee is calculated based on the final agreed-upon salary between the recruiter and the candidate.
                  </p>
                  <p>
                    The commission fee is only charged when:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>The candidate accepts the job offer</li>
                    <li>The candidate starts employment</li>
                    <li>The placement is confirmed by both parties</li>
                  </ul>
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-[#273469]" />
                  2. Payment Terms
                </h3>
                <div className="space-y-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                  <p>
                    Payment of the commission fee is due within 30 days of the candidate's start date. 
                    Invoices will be sent via email to the registered recruiter account.
                  </p>
                  <p>
                    Accepted payment methods include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Bank transfer (ACH/Wire)</li>
                    <li>Credit card (Visa, MasterCard, American Express)</li>
                    <li>Check (for Enterprise accounts)</li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-[#273469]" />
                  3. Successful Placement Definition
                </h3>
                <div className="space-y-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                  <p>
                    A placement is considered successful when:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>The candidate accepts the job offer in writing</li>
                    <li>The candidate commences employment on the agreed start date</li>
                    <li>The candidate remains employed for a minimum of 90 days (guarantee period)</li>
                  </ul>
                  <p>
                    If the candidate leaves within the 90-day guarantee period, a replacement candidate will be provided 
                    at no additional charge, or a partial refund may be issued at VettedPool's discretion.
                  </p>
                </div>
              </div>

              {/* Section 4 */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-[#273469]" />
                  4. No Upfront Costs
                </h3>
                <div className="space-y-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                  <p>
                    VettedPool operates on a success-based model. There are no upfront costs, registration fees, 
                    or monthly subscription charges. You only pay when you successfully place a candidate.
                  </p>
                  <p>
                    All platform features, including job posting, candidate search, and communication tools, 
                    are available at no cost until a successful placement is made.
                  </p>
                </div>
              </div>

              {/* Section 5 */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-[#273469]" />
                  5. Fee Calculation
                </h3>
                <div className="space-y-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                  <p>
                    The commission fee is calculated as 7% of the candidate's first-year gross annual salary. 
                    This includes base salary but excludes bonuses, commissions, benefits, or other compensation.
                  </p>
                  <p>
                    For contract or temporary placements, the fee is calculated on the total contract value 
                    or estimated annual equivalent, whichever is applicable.
                  </p>
                </div>
              </div>

              {/* Section 6 */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-[#273469]" />
                  6. Refund Policy
                </h3>
                <div className="space-y-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                  <p>
                    If a placed candidate leaves within 90 days of their start date, VettedPool will:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide a replacement candidate at no additional charge, or</li>
                    <li>Issue a partial refund based on the remaining guarantee period</li>
                  </ul>
                  <p>
                    Refund requests must be submitted within 7 days of the candidate's departure and are subject 
                    to verification and approval by VettedPool.
                  </p>
                </div>
              </div>

              {/* Section 7 */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-[#273469]" />
                  7. Account Requirements
                </h3>
                <div className="space-y-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                  <p>
                    To use VettedPool's recruitment services, you must:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Create a verified recruiter account</li>
                    <li>Provide accurate company and contact information</li>
                    <li>Agree to these terms and conditions</li>
                    <li>Maintain an active account in good standing</li>
                  </ul>
                </div>
              </div>

              {/* Section 8 */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-[#273469]" />
                  8. Changes to Pricing
                </h3>
                <div className="space-y-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                  <p>
                    VettedPool reserves the right to modify the commission fee structure with 30 days' written notice. 
                    Any changes will apply to new placements made after the effective date of the change.
                  </p>
                  <p>
                    Existing placements and agreements will be honored at the rate in effect at the time of placement.
                  </p>
                </div>
              </div>

              {/* Section 9 */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-[#273469]" />
                  9. Disputes and Resolution
                </h3>
                <div className="space-y-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                  <p>
                    Any disputes regarding fees or placements should be reported to VettedPool's support team 
                    within 14 days of the issue arising. We are committed to resolving disputes fairly and promptly.
                  </p>
                  <p>
                    If a resolution cannot be reached, disputes will be subject to binding arbitration in accordance 
                    with the laws of the jurisdiction where VettedPool operates.
                  </p>
                </div>
              </div>

              {/* Section 10 */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-[#273469]" />
                  10. Contact Information
                </h3>
                <div className="space-y-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                  <p>
                    For questions about pricing, fees, or these terms and conditions, please contact us:
                  </p>
                  <ul className="list-none space-y-2 ml-4">
                    <li>Email: support@vettedpool.com</li>
                    <li>Phone: Available in your recruiter dashboard</li>
                    <li>Support Hours: Monday - Friday, 9 AM - 6 PM EST</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Last Updated */}
            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-500 text-center">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-r from-[#273469] to-[#1e2749] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Ready to Start Recruiting?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Join our platform and start finding the perfect candidates today. No upfront costs, pay only when you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/recruiter/register"
              className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-[#273469] font-semibold rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base"
            >
              Create Recruiter Account
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <Link
              to="/contact-us"
              className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-sm sm:text-base"
            >
              Contact Sales
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;

