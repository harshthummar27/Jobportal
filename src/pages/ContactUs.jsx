import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  User,
  Building,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { toast } from "react-toastify";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Thank you! Your message has been sent successfully.");
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: ["support@vettedpool.com", "info@vettedpool.com"],
      link: "mailto:support@vettedpool.com",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+1 (555) 123-4567", "Mon-Fri 9AM-6PM EST"],
      link: "tel:+15551234567",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["123 Business Street", "New York, NY 10001, USA"],
      link: null,
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: ["Monday - Friday: 9:00 AM - 6:00 PM", "Saturday: 10:00 AM - 4:00 PM", "Sunday: Closed"],
      link: null,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 md:pt-24 md:pb-16 lg:pt-28 lg:pb-20 bg-gradient-to-br from-[#273469] via-[#1e2749] to-[#273469] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Get in Touch
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed px-2">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div>
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Send us a Message
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#273469] transition-all ${
                        errors.name
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-white"
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#273469] transition-all ${
                        errors.email
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-white"
                      }`}
                      placeholder="Enter your email address"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Company Field */}
                <div>
                  <label htmlFor="company" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                    Company (Optional)
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#273469] transition-all bg-white"
                      placeholder="Enter your company name"
                    />
                  </div>
                </div>

                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 sm:py-3 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#273469] transition-all ${
                      errors.subject
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 bg-white"
                    }`}
                    placeholder="What is this regarding?"
                  />
                  {errors.subject && (
                    <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#273469] transition-all resize-none ${
                        errors.message
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-white"
                      }`}
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                  {errors.message && (
                    <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 bg-[#273469] text-white font-semibold rounded-lg hover:bg-[#1e2749] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Contact Information
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Reach out to us through any of these channels.
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-[#273469]/10 rounded-lg p-3 flex-shrink-0">
                          <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-[#273469]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                            {info.title}
                          </h3>
                          <div className="space-y-1">
                            {info.details.map((detail, idx) => (
                              <p
                                key={idx}
                                className={`text-sm sm:text-base text-gray-600 ${
                                  info.link ? "hover:text-[#273469] transition-colors" : ""
                                }`}
                              >
                                {info.link && idx === 0 ? (
                                  <a
                                    href={info.link}
                                    className="hover:underline"
                                  >
                                    {detail}
                                  </a>
                                ) : (
                                  detail
                                )}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Additional Info */}
              <div className="mt-6 sm:mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">
                      Quick Response Guarantee
                    </h3>
                    <p className="text-sm sm:text-base text-blue-700">
                      We typically respond to all inquiries within 24 hours during business days. 
                      For urgent matters, please call us directly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {[
              {
                question: "How quickly will I receive a response?",
                answer: "We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.",
              },
              {
                question: "What information should I include in my message?",
                answer: "Please include your name, contact information, and a detailed description of your inquiry or issue. The more information you provide, the better we can assist you.",
              },
              {
                question: "Can I schedule a meeting or demo?",
                answer: "Yes! Please mention in your message that you'd like to schedule a meeting or demo, and we'll coordinate a time that works for you.",
              },
              {
                question: "Do you offer phone support?",
                answer: "Yes, we offer phone support during our business hours (Monday-Friday, 9 AM - 6 PM EST). You can reach us at +1 (555) 123-4567.",
              },
              {
                question: "Is there a way to contact specific departments?",
                answer: "You can reach our general support team, and they will direct your inquiry to the appropriate department. For sales inquiries, mention 'Sales' in your subject line.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm"
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                  {faq.question}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
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
            </Link>
            <Link
              to="/recruiter/register"
              className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-sm sm:text-base"
            >
              Join as Recruiter
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactUs;

