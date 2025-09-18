import React from 'react';
import { FaRoute,FaTrophy, FaBullseye } from 'react-icons/fa';
const StepCard = ({ step, title, description, icon: Icon, index }) => (
  <div className="group relative text-center">
    {/* Connecting line for desktop view */}
    {index < 2 && (
      <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-blue-500/30 group-hover:bg-blue-500/60 transition-all duration-300" />
    )}
    
    <div className="relative bg-[#1c1c1c] p-8 rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white text-xl font-bold mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/30">
        {step}
      </div>
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-500/10 flex items-center justify-center transition-all duration-300">
        <Icon className="w-10 h-10 text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all duration-300" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);
const How=React.forwardRef((props,ref)=>{
const howItWorksSteps = [
    { step: "01", title: "Choose Your Goal", description: "Tell our AI about your dream role and current skills to start your unique journey.", icon: FaBullseye },
    { step: "02", title: "Get Your AI Roadmap", description: "Receive a personalized learning path with courses and skill-building activities.", icon: FaRoute },
    { step: "03", title: "Achieve and Advance", description: "Track your progress, get resume feedback, and land your dream job with our support.", icon: FaTrophy },
  ];
  return (
    <section ref={ref} className="py-20">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-blue-400">How It Works</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Transform your career in three simple, AI-powered steps.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {howItWorksSteps.map((step, index) => <StepCard key={index} {...step} index={index} />)}
          </div>
        </section>
  )
})
export default How;