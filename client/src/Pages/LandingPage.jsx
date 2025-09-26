import React, { useRef, useState, useEffect } from "react";
import { FaCommentDots, FaShieldAlt, FaQuoteLeft } from "react-icons/fa";
import CTASection from "../Components/CTAsection";
import Header from "../Components/Header";
import HeroSection from "../Components/HeroSection";
import How from "../Components/HowItWorks";
import Features from "../Components/Features";
import Footer from "../Components/Footer";
import { useAuth } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import RiseLoaderWrapper from "../Components/RiseLoader";

const JobSuggestion = ({ title, company }) => (
  <div className="flex justify-between items-center py-3 px-3 -mx-3 rounded-md hover:bg-gray-800 transition-colors duration-200 cursor-pointer group">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
      <p className="text-gray-300">{title}</p>
    </div>
    <span className="text-xs text-gray-500">{company}</span>
  </div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn, isLoaded } = useAuth();

  const [loading, setLoading] = useState(true);
  const featuresRef = useRef(null);
  const howRef = useRef(null);

  const handleFeaturesClick = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleHowClick = () => {
    howRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setLoading(true);
    if (isSignedIn) {
      navigate("/dashboard");
    }
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [isSignedIn, isLoaded, location.pathname, navigate]);

  // ✅ Now we just conditionally render inside the return
  if (!isLoaded || loading) {
    return <RiseLoaderWrapper/>;
  }
  return (
    <div className="bg-[#0a0a0c] text-white font-sans overflow-hidden relative">
      <div
        className="absolute inset-0 bg-cover bg-fixed opacity-10"
        style={{
          backgroundImage: 'url("/images/space.png")',
          backgroundPosition: "center top",
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-blue-900/10"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0"></div>

      <div className="relative z-10 container mx-auto px-6 lg:px-8 py-6">
        <Header handleFeaturesClick={handleFeaturesClick} />
        <HeroSection />
        <How ref={howRef} />
        <Features ref={featuresRef} />
        <section className="grid lg:grid-cols-2 gap-16 py-16 items-start">
          {/* Success Stories */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <FaCommentDots size={28} className="text-blue-400" />
              <h3 className="text-2xl font-semibold text-gray-200">
                Success Stories
              </h3>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-10 max-w-sm">
              {[...Array(8)].map((_, i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/80?u=${i}`}
                  alt={`user ${i}`}
                  className="rounded-full w-16 h-16 object-cover border-2 border-transparent hover:border-blue-500 transition-all duration-300 transform hover:scale-110"
                />
              ))}
            </div>
            <blockquote className="relative p-8 bg-[#1c1c1c] rounded-2xl border border-gray-700/50">
              <FaQuoteLeft className="absolute top-4 left-4 text-4xl text-blue-500/20" />
              <p className="text-gray-300 italic text-lg leading-relaxed pl-8">
                "NexusPro transformed our career planning. The AI roadmap and
                resume analysis provided invaluable insights, making our job
                search smarter and much more effective."
              </p>
              <cite className="block mt-4 text-right text-gray-400">
                - Jane Doe, Senior AI Engineer
              </cite>
            </blockquote>
          </div>

          {/* Job Suggestions */}
          <div className="bg-[#1c1c1c] p-8 rounded-2xl border border-gray-700/50 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <FaShieldAlt size={28} className="text-blue-400" />
              <h3 className="text-2xl font-semibold text-gray-200">
                Smart Job Suggestions
              </h3>
            </div>
            <div className="space-y-3">
              <JobSuggestion title="AI Engineer" company="Innovate Inc." />
              <JobSuggestion
                title="Machine Learning Specialist"
                company="DataDriven Co."
              />
              <JobSuggestion
                title="Frontend Architect"
                company="Creative Solutions"
              />
              <JobSuggestion title="DevOps Engineer" company="CloudConnect" />
              <JobSuggestion title="Data Scientist" company="QuantInsights" />
            </div>
          </div>
        </section>
      </div>
      <CTASection />
      <Footer
        handleFeaturesClick={handleFeaturesClick}
        handleHowClick={handleHowClick}
      />

      {/* Styles */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.2;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
        .animate-spin-slower {
          animation: spin-slow 90s linear infinite reverse;
        }

        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.4),
              0 0 50px rgba(59, 130, 246, 0.2);
          }
          50% {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.6),
              0 0 80px rgba(59, 130, 246, 0.4);
          }
        }
        .animate-glow {
          animation: glow 6s infinite alternate ease-in-out;
        }

        @keyframes float-fade {
          0% {
            transform: translateY(0px) scale(0.9);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-10px) scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: translateY(0px) scale(0.9);
            opacity: 0.6;
          }
        }
        .animate-float-fade {
          animation: float-fade 7s infinite ease-in-out;
          animation-delay: 1.5s;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-delay-200 {
          animation-delay: 0.2s;
        }
        .animate-delay-400 {
          animation-delay: 0.4s;
        }

        .bg-grid-pattern {
          background-image: linear-gradient(
              to right,
              rgba(59, 130, 246, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(59, 130, 246, 0.05) 1px,
              transparent 1px
            );
          background-size: 30px 30px;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
