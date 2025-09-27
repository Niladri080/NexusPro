import React, { useState, useEffect } from 'react';
import { Star, Target, Users, Award, Lightbulb, Heart, Zap, Globe, Search, Twitter, Linkedin, Facebook, ArrowRight, CheckCircle } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import PostHeader from '../Components/PostHeader';
import { useNavigate } from 'react-router-dom';

const Sparkle = ({ delay = 0, size = 'w-1 h-1' }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    setPosition({
      x: Math.random() * 100,
      y: Math.random() * 100
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

// Team Member Card
const TeamMember = ({ name, role, image, bio, expertise }) => (
  <div className="bg-[#1c1c1c] p-8 rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-500/20 group relative overflow-hidden w-[350px]">
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    <div className="relative z-10 text-center">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-3 border-gray-600 group-hover:border-blue-500 transition-colors duration-300">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
        {name}
      </h3>
      
      <p className="text-blue-400 font-medium mb-4">{role}</p>
      
      <p className="text-gray-400 text-sm leading-relaxed mb-4 group-hover:text-gray-300 transition-colors duration-300">
        {bio}
      </p>
      
      <div className="flex flex-wrap gap-2 justify-center">
        {expertise.map((skill, index) => (
          <span key={index} className="text-xs bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full">
            {skill}
          </span>
        ))}
      </div>
    </div>
  </div>
);

// Value Card Component
const ValueCard = ({ icon: Icon, title, description }) => (
  <div className="bg-[#1c1c1c] p-6 rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 group relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
          <Icon size={28} />
        </div>
        <h3 className="text-lg font-semibold text-gray-200 group-hover:text-white transition-colors duration-300">
          {title}
        </h3>
      </div>
      <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
        {description}
      </p>
    </div>
  </div>
);



const AboutUsPage = () => {
  const navigate=useNavigate()
  const teamMembers = [
    {
      name: "Niladri Mandal",
      role: "CEO & Engineer",
      image: "/images/Niladri.jpg",
      bio: "Full Stack Web Developer with great interest in Machine Learning. Passionate about democratizing career growth through technology.",
      expertise: ["AI Strategy", "Product Management", "Full Stack Dev"]
    },
  ];

  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description: "We're committed to democratizing career success by making professional development accessible to everyone, regardless of background."
    },
    {
      icon: Lightbulb,
      title: "Innovation First",
      description: "We leverage cutting-edge AI technology to create personalized experiences that adapt and evolve with each user's unique journey."
    },
    {
      icon: Heart,
      title: "Human-Centered",
      description: "While we use advanced technology, we never forget that careers are deeply personal. Every feature is designed with empathy and understanding."
    },
    {
      icon: Zap,
      title: "Results-Focused",
      description: "We measure our success by the career breakthroughs of our users. Every algorithm and feature is optimized for real-world impact."
    }
  ];

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
      {/* Animated sparkles */}
      {Array.from({ length: 25 }).map((_, i) => (
        <Sparkle key={i} delay={i * 0.2} size={Math.random() > 0.8 ? 'w-2 h-2' : 'w-1 h-1'} />
      ))}

      <div className="relative z-10 container mx-auto px-6 lg:px-8 py-6">
        <SignedIn><PostHeader/></SignedIn>
        <SignedOut><Header/></SignedOut>
        <section className="text-center py-20 lg:py-32 relative mb-20">
          {/* Orbital Glow Effect */}
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute w-[400px] h-[400px] border-2 border-blue-500/20 rounded-full animate-spin-slow"></div>
            <div className="absolute w-[500px] h-[500px] border border-blue-500/10 rounded-full animate-spin-slower"></div>
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fade-in-up">
            About <span className="text-blue-400">nexusPro</span>
          </h1>
          <p className="max-w-3xl mx-auto text-gray-300 mb-10 text-xl leading-relaxed animate-fade-in-up animate-delay-200">
            We're revolutionizing career development by combining artificial intelligence with human insight to create personalized pathways to professional success. Our mission is to make career growth accessible, strategic, and achievable for everyone.
          </p>
        </section>
        {/* Our Story Section */}
        <section className="py-16 mb-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8">
                Our <span className="text-blue-400">Story</span>
              </h2>
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p>
                  NexusPro was born from a simple observation: the most successful professionals aren't just talented—they're strategic about their career development. Yet most people navigate their careers without a clear roadmap or personalized guidance.
                </p>
                <p>
                  Founded in 2025 by a team of former tech executives and AI researchers, we set out to democratize access to the kind of career intelligence that was previously available only to executives and those with extensive professional networks.
                </p>
                <p>
                  Today, we're proud to help thousands of professionals across industries discover their potential, develop their skills strategically, and land roles that align with their aspirations and values.
                </p>
              </div>
              <div className="mt-8">
                <button onClick={()=>{
            navigate("/sign-in")
          }} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 flex items-center gap-2">
                  Join Our Mission <ArrowRight size={20} />
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-[#1c1c1c] p-8 rounded-3xl border border-gray-700/50">
                <h3 className="text-2xl font-bold mb-6 text-center">What Drives Us</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <CheckCircle className="text-blue-400 flex-shrink-0" size={24} />
                    <p className="text-gray-300">Belief that everyone deserves access to career success</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <CheckCircle className="text-blue-400 flex-shrink-0" size={24} />
                    <p className="text-gray-300">Commitment to using AI ethically and transparently</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <CheckCircle className="text-blue-400 flex-shrink-0" size={24} />
                    <p className="text-gray-300">Focus on measurable, real-world career outcomes</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <CheckCircle className="text-blue-400 flex-shrink-0" size={24} />
                    <p className="text-gray-300">Dedication to continuous learning and improvement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-16 mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Our <span className="text-blue-400">Values</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do and every decision we make
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <ValueCard key={index} {...value} />
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Meet Our <span className="text-blue-400">Team</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Passionate experts from diverse backgrounds united by a shared mission to transform careers
            </p>
          </div>
          
          <div className="flex items-center justify-center">
            {teamMembers.map((member, index) => (
              <TeamMember key={index} {...member} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center">
          <div className="bg-[#1c1c1c] p-12 rounded-3xl border border-gray-700/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Transform Your <span className="text-blue-400">Career</span>?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who've already discovered their career potential with nexusPro.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={()=>{
            navigate("/sign-in")
          }} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30">
                  Get Started Free
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* Footer */}
     <Footer/>
      {/* Custom Styles */}
      <style jsx>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 0.8; transform: scale(1); }
        }
        .animate-sparkle {
          animation: sparkle 4s ease-in-out infinite alternate;
        }

        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.1); opacity: 0.2; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
        .animate-spin-slower {
          animation: spin-slow 90s linear infinite reverse;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-in-up.animate-delay-200 { 
          animation-delay: 0.2s; 
        }
      `}</style>
    </div>
  );
};

export default AboutUsPage;