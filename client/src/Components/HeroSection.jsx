import React from 'react';
const HeroSection=()=>{
  return (
    <main className="text-center py-20 lg:py-32 relative">
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute w-[400px] h-[400px] border-2 border-blue-500/20 rounded-full animate-spin-slow"></div>
            <div className="absolute w-[500px] h-[500px] border border-blue-500/10 rounded-full animate-spin-slower"></div>
            <div className="absolute w-[250px] h-[250px] bg-blue-900/40 rounded-full shadow-2xl shadow-blue-500/50 animate-glow"></div>
            <div className="absolute w-[150px] h-[150px] bg-blue-500/60 rounded-full blur-xl animate-float-fade"></div>
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fade-in-up">
            nexusPro. Your <br /> Professional Orbit.
          </h1>
          <p className="max-w-xl mx-auto text-gray-300 mb-10 text-lg animate-fade-in-up animate-delay-200">
            Navigate your career with precision. We provide AI-driven intelligence to help you land your next role and achieve your professional goals.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-full transition-transform transform hover:scale-105 shadow-lg shadow-blue-500/30 animate-fade-in-up animate-delay-400">
            Launch Your Career
          </button>
        </main>
  )
}
export default HeroSection;
