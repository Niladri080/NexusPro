import React from 'react';
import {FaArrowRight, FaLightbulb } from 'react-icons/fa';
const CTASection = () => {
    return (
        <section id="cta" className="py-24 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 opacity-50 rounded-full blur-3xl animate-pulse-glow"></div>
    
            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#1c1c1c] to-black/50 border border-blue-500/20 shadow-2xl shadow-blue-500/10 rounded-2xl">
                    <div className="p-12 text-center space-y-8">
                        {/* Icon */}
                        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center animate-float shadow-lg shadow-blue-500/30">
                            <FaLightbulb className="w-10 h-10 text-white" />
                        </div>
        
                        {/* Heading */}
                        <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                            Ready to Take the{" "}
                            <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                                First Step?
                            </span>
                        </h2>
        
                        {/* Description */}
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Join thousands of professionals who have transformed their careers with AI-powered guidance. Your dream job is waiting.
                        </p>
        
                        {/* CTA Button */}
                        <div className="flex flex-col gap-4 justify-center items-center pt-4">
                            <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:opacity-90 transition-opacity text-xl font-semibold px-12 py-5 rounded-lg group shadow-lg shadow-blue-500/30">
                                Get Started Free
                                <FaArrowRight className="ml-2 w-5 h-5 inline-block group-hover:translate-x-1 transition-transform" />
                            </button>
                            <div className="text-sm text-gray-500">
                                No credit card required • Start in 2 minutes
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default CTASection