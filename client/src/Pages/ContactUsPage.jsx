import React, { useState, useEffect } from "react";
import {
  Star,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  User,
  MessageSquare,
  Building,
  Calendar,
  CheckCircle,
  ArrowRight,
  Headphones,
  BookOpen,
  Users,
} from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../Components/Loader";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import PostHeader from "../Components/PostHeader";
// Sparkle component matching the original theme
const Sparkle = ({ delay = 0, size = "w-1 h-1" }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setPosition({
      x: Math.random() * 100,
      y: Math.random() * 100,
    });
  }, []);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", 
    });
  }, []);
  return (
    <div
      className={`absolute ${size} bg-white rounded-full opacity-0 animate-sparkle pointer-events-none`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        animationDelay: `${delay}s`,
      }}
    />
  );
};

// Contact Info Card
const ContactInfoCard = ({ icon: Icon, title, info, description }) => (
  <div className="bg-[#1c1c1c] p-6 rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 group relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    <div className="relative z-10">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-purple-600/30 transition-all duration-300">
          <Icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-200 group-hover:text-white transition-colors duration-300">
            {title}
          </h3>
          <p className="text-blue-400 font-medium">{info}</p>
        </div>
      </div>
      <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
        {description}
      </p>
    </div>
  </div>
);

// FAQ Item
const FAQItem = ({ question, answer, isOpen, onToggle }) => (
  <div className="bg-[#1c1c1c] rounded-2xl border border-gray-700/50 overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-800/50 transition-colors duration-300"
    >
      <span className="text-lg font-medium text-white">{question}</span>
      <div
        className={`transform transition-transform duration-300 ${
          isOpen ? "rotate-45" : ""
        }`}
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <div className="w-4 h-0.5 bg-blue-400"></div>
          <div className="w-0.5 h-4 bg-blue-400 absolute"></div>
        </div>
      </div>
    </button>
    {isOpen && (
      <div className="px-6 pb-6 text-gray-400 leading-relaxed animate-fade-in">
        {answer}
      </div>
    )}
  </div>
);

// Support Option Card
const SupportOption = ({
  icon: Icon,
  title,
  description,
  action,
  buttonText,
}) => (
  <div className="bg-[#1c1c1c] p-8 rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-500/20 group relative overflow-hidden text-center">
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    <div className="relative z-10">
      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-purple-600/30 transition-all duration-300">
        <Icon className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
      </div>

      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
        {title}
      </h3>

      <p className="text-gray-400 mb-6 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
        {description}
      </p>

      <button
        onClick={action}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25 flex items-center gap-2 mx-auto"
      >
        {buttonText} <ArrowRight size={16} />
      </button>
    </div>
  </div>
);

const ContactUsPage = () => {
  const [loading, setloading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });

  const [openFAQ, setOpenFAQ] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    setloading(true);
    e.preventDefault();
    axios
      .post("http://localhost:4000/sendEmail", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setloading(false);
        toast.success(res.data.message);
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
        setFormData({
          name: "",
          email: "",
          company: "",
          subject: "",
          message: "",
        });
      })
      .catch((err) => {
        setloading(false);
        toast.error("Something went wrong.Try again later");
        console.log(err);
      });
  };

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      info: "nilmandal098@gmail.com",
      description:
        "Get in touch with our team. We typically respond within 24 hours.",
    },
    {
      icon: Phone,
      title: "Call Us",
      info: "+91 7439301473",
      description:
        "Speak directly with our support team during business hours.",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      info: "San Francisco, CA",
      description:
        "123 Innovation Street, SOMA District, San Francisco, CA 94105",
    },
    {
      icon: Clock,
      title: "Business Hours",
      info: "Mon-Fri 9AM-6PM PST",
      description:
        "We're here to help during regular business hours and respond to emails 24/7.",
    },
  ];

  const faqs = [
    {
      question: "How does nexusPro's AI career guidance work?",
      answer:
        "Our AI analyzes your skills, experience, goals, and market trends to create personalized career roadmaps. It considers your industry, target roles, and learning preferences to recommend specific courses, certifications, and development activities.",
    },
    {
      question: "Is my personal information secure?",
      answer:
        "Absolutely. We use enterprise-grade security measures including end-to-end encryption, secure data storage, and strict privacy policies. We never share your personal information with third parties without your explicit consent.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel your subscription at any time with no penalties. You'll continue to have access to your account until the end of your current billing period, and you can always reactivate later.",
    },
    {
      question: "Do you offer enterprise solutions?",
      answer:
        "Yes, we offer comprehensive enterprise solutions for organizations looking to upskill their workforce. This includes bulk licenses, custom integrations, analytics dashboards, and dedicated support.",
    },
    {
      question: "How accurate are the job recommendations?",
      answer:
        "Our job recommendations have a 89% relevance rating based on user feedback. We continuously improve our algorithms using machine learning and real-time market data to ensure recommendations align with your skills and career goals.",
    },
  ];

  const supportOptions = [
    {
      icon: Headphones,
      title: "Live Support",
      description:
        "Chat with our support team in real-time for immediate assistance with your account or technical issues.",
      buttonText: "Start Chat",
      action: () => console.log("Start chat"),
    },
    {
      icon: BookOpen,
      title: "Knowledge Base",
      description:
        "Browse our comprehensive guides, tutorials, and documentation to find answers to common questions.",
      buttonText: "View Guides",
      action: () => console.log("View guides"),
    },
    {
      icon: Users,
      title: "Community Forum",
      description:
        "Connect with other professionals, share experiences, and get advice from our active user community.",
      buttonText: "Join Forum",
      action: () => console.log("Join forum"),
    },
  ];

  return (
    <div className="bg-[#0a0a0c] text-white font-sans overflow-hidden relative min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-fixed opacity-10"
        style={{
          backgroundImage: 'url("/images/space.png")',
          backgroundPosition: "center top",
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-blue-900/10"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0"></div>
      {/* Animated sparkles */}
      {Array.from({ length: 25 }).map((_, i) => (
        <Sparkle
          key={i}
          delay={i * 0.2}
          size={Math.random() > 0.8 ? "w-2 h-2" : "w-1 h-1"}
        />
      ))}

      <div className="relative z-10 container mx-auto px-6 lg:px-8 py-6">
        <SignedIn><PostHeader/></SignedIn>
        <SignedOut><Header/></SignedOut>
        <section className="text-center py-20 lg:py-32 relative mb-20">
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute w-[400px] h-[400px] border-2 border-blue-500/20 rounded-full animate-spin-slow"></div>
            <div className="absolute w-[500px] h-[500px] border border-blue-500/10 rounded-full animate-spin-slower"></div>
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fade-in-up">
            Get in <span className="text-blue-400">Touch</span>
          </h1>
          <p className="max-w-3xl mx-auto text-gray-300 mb-10 text-xl leading-relaxed animate-fade-in-up animate-delay-200">
            Have questions about nexusPro? Want to explore enterprise solutions?
            Or just want to say hello? We'd love to hear from you. Our team is
            here to help you succeed.
          </p>
        </section>

        {/* Contact Form and Info Section */}
        <section className="grid lg:grid-cols-2 gap-16 mb-20">
          {/* Contact Form */}
          <div className="bg-[#1c1c1c] p-8 rounded-3xl border border-gray-700/50">
            <h2 className="text-3xl font-bold mb-8">
              Send us a <span className="text-blue-400">Message</span>
            </h2>

            {isSubmitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-500 mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-400">
                  We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={20}
                    />
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                    />
                  </div>

                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={20}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                    />
                  </div>
                </div>

                <div className="relative">
                  <Building
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    size={20}
                  />
                  <input
                    type="text"
                    name="company"
                    placeholder="Company (Optional)"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative">
                    <Star
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={20}
                    />
                    <input
                      type="text"
                      name="subject"
                      placeholder="Enter Subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                    />
                  </div>
                </div>

                <div className="relative">
                  <MessageSquare
                    className="absolute left-3 top-4 text-gray-500"
                    size={20}
                  />
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors duration-300 resize-none h-32"
                  ></textarea>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                     <Loader/>
                    </>
                  ) : (
                    <>
                      Send Message <Send size={18} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-8">
                Contact <span className="text-blue-400">Information</span>
              </h2>
              <div className="grid gap-6">
                {contactInfo.map((info, index) => (
                  <ContactInfoCard key={index} {...info} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Support Options */}
        <section className="py-16 mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Other Ways to Get <span className="text-blue-400">Help</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choose the support option that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {supportOptions.map((option, index) => (
              <SupportOption key={index} {...option} />
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Frequently Asked <span className="text-blue-400">Questions</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Quick answers to common questions about nexusPro
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                onToggle={() => toggleFAQ(index)}
              />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center">
          <div className="bg-[#1c1c1c] p-12 rounded-3xl border border-gray-700/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10"></div>

            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Start Your{" "}
                <span className="text-blue-400">Journey</span>?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Don't wait to transform your career. Join nexusPro today and
                take the first step towards your professional goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30">
                  Start Free Trial
                </button>
                <button className="border border-gray-600 hover:border-blue-500 text-gray-300 hover:text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300">
                  <Calendar className="inline mr-2" size={20} />
                  Book Demo
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* Footer */}
      <Footer />
      {/* Custom Styles */}
      <style jsx>{`
        @keyframes sparkle {
          0%,
          100% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 0.8;
            transform: scale(1);
          }
        }
        .animate-sparkle {
          animation: sparkle 4s ease-in-out infinite alternate;
        }

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
        .animate-fade-in-up.animate-delay-200 {
          animation-delay: 0.2s;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ContactUsPage;
