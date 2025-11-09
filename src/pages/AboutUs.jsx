import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Target,
  Award,
  Heart,
  Shield,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Globe,
  Lightbulb,
  Handshake,
  Rocket,
} from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const AboutUs = () => {
  const values = [
    {
      icon: Shield,
      title: "Trust & Security",
      description: "We prioritize the security and privacy of all our users' data and information.",
    },
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for excellence in every aspect of our platform and services.",
    },
    {
      icon: Heart,
      title: "User-Centric",
      description: "Our users are at the heart of everything we do and build.",
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "We continuously innovate to provide cutting-edge solutions.",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "5K+", label: "Successful Placements" },
    { number: "500+", label: "Partner Companies" },
    { number: "98%", label: "Satisfaction Rate" },
  ];

  const team = [
    {
      name: "Expert Team",
      description: "Our team consists of industry experts with years of experience in recruitment and technology.",
    },
    {
      name: "Global Reach",
      description: "We connect talent and opportunities across borders and industries.",
    },
    {
      name: "Innovation Driven",
      description: "We leverage the latest technology to streamline the recruitment process.",
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
              About VettedPool
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed px-2">
              Connecting exceptional talent with outstanding opportunities through innovative recruitment solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-[#273469]" />
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-3 sm:mb-4">
                At VettedPool, our mission is to revolutionize the recruitment industry by creating a seamless, 
                transparent, and efficient platform that connects the right talent with the right opportunities.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-6">
                We believe that every candidate deserves a fair chance to showcase their skills, and every 
                employer deserves access to the best talent. Our platform bridges this gap through innovative 
                technology and a commitment to excellence.
              </p>
              <div className="flex items-center gap-2 text-[#273469] font-semibold text-sm sm:text-base mt-4 sm:mt-6">
                <span>Learn more about our services</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#273469]/10 to-[#273469]/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 order-1 lg:order-2">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-[#273469] rounded-lg p-2 sm:p-3 flex-shrink-0">
                    <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Innovation First</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      We leverage cutting-edge technology to simplify and enhance the recruitment process.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-[#273469] rounded-lg p-2 sm:p-3 flex-shrink-0">
                    <Handshake className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Partnership Approach</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      We build long-term relationships with both candidates and employers.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-[#273469] rounded-lg p-2 sm:p-3 flex-shrink-0">
                    <Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Growth Focused</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      We're committed to helping both candidates and companies achieve their goals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Our Core Values</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              The principles that guide everything we do at VettedPool
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <div className="bg-[#273469]/10 rounded-lg p-3 sm:p-4 w-fit mb-3 sm:mb-4">
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-[#273469]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{value.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br from-[#273469] to-[#1e2749] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Our Impact</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl mx-auto px-2">
              Numbers that reflect our commitment to excellence
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center px-2">
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-1 sm:mb-2">{stat.number}</div>
                <div className="text-gray-200 text-xs sm:text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Why Choose VettedPool?</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              What sets us apart in the recruitment industry
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {team.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 sm:p-6 md:p-8 border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="bg-[#273469] rounded-lg p-2 sm:p-3 w-fit mb-3 sm:mb-4">
                  <Award className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{item.name}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-r from-[#273469] to-[#1e2749] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Ready to Get Started?</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Join thousands of candidates and employers who trust VettedPool for their recruitment needs.
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

export default AboutUs;

