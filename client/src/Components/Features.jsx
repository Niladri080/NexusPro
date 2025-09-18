import React from "react";
import {
  FaFileAlt,
  FaBullseye,
  FaMapMarkedAlt,
  FaChartLine,
} from "react-icons/fa";

const FeatureCard = ({ icon: Icon, title, description, gradient }) => (
  <div className="group relative bg-[#1c1c1c] p-8 rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 ease-out transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/25 overflow-hidden">
    <div
      className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
    />
    <div className="relative z-10">
      <div
        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/30`}
      >
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);
const Features=React.forwardRef((props,ref)=>{
  const features = [
    {
      title: "Personalized Roadmaps",
      description:
        "AI-generated learning paths tailored to your goals and skills.",
      icon: FaMapMarkedAlt,
      gradient: "from-blue-600 to-blue-500",
    },
    {
      title: "Progress Tracking",
      description:
        "Monitor your skill development and track milestones on your journey.",
      icon: FaChartLine,
      gradient: "from-blue-600 to-blue-500",
    },
    {
      title: "Resume Score & AI Feedback",
      description: "Get instant resume analysis with actionable suggestions.",
      icon: FaFileAlt,
      gradient: "from-blue-600 to-blue-500",
    },
    {
      title: "Smart Job Matching",
      description:
        "Discover roles that match your skills and align with your career goals.",
      icon: FaBullseye,
      gradient: "from-blue-600 to-blue-500",
    },
  ];
  return (<section ref={ref} className="py-20">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-blue-400">
                Powerful Features
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Everything you need to accelerate your professional growth.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </section>)
})
export default Features;