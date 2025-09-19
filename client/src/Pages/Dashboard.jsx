import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  TrendingUp,
  Target,
  BookOpen,
  FileText,
  Briefcase,
  Calendar,
  Clock,
  Award,
  MapPin,
  Upload,
  CheckCircle,
  ArrowRight,
  BarChart3,
  PlayCircle,
  Bookmark,
  ExternalLink,
  Lightbulb,
  Zap,
  Globe,
  Users,
  Building,
  ChevronLeft,
} from "lucide-react";
import Footer from "../Components/Footer";
import PostHeader from "../Components/PostHeader";

// Sparkle component matching the landing page theme
const Sparkle = ({ delay = 0, size = "w-1 h-1" }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setPosition({
      x: Math.random() * 100,
      y: Math.random() * 100,
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

// Header Component

// Progress Bar Component
const AnimatedProgressBar = ({
  progress,
  label,
  color = "blue",
  showPercentage = true,
}) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <span className="text-gray-300 font-medium">{label}</span>
      {showPercentage && (
        <span className="text-gray-400 text-sm">{progress}%</span>
      )}
    </div>
    <div className="relative">
      <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
        <div
          className={`bg-gradient-to-r from-${color}-500 to-${color}-400 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-${color}-500/30`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  </div>
);

// Modern Job Card Component
const ModernJobCard = ({ job }) => (
  <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-6 rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group backdrop-blur-sm relative overflow-hidden">
    <div className="absolute top-4 right-4 z-10">
      <div
        className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
          job.match >= 90
            ? "bg-green-500/20 text-green-300 border border-green-500/30"
            : job.match >= 80
            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
            : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
        }`}
      >
        {job.match}% match
      </div>
    </div>

    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    <div className="relative z-10">
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all duration-300">
          <Building className="w-7 h-7 text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-white text-lg group-hover:text-blue-300 transition-colors">
            {job.title}
          </h3>
          <p className="text-gray-400 font-medium">{job.company}</p>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {job.location}
            </span>
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {job.posted}
            </span>
          </div>
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-2">
        {job.description}
      </p>

      {job.skills && (
        <div className="flex flex-wrap gap-2 mb-6">
          {job.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full border border-gray-700"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="text-xs text-gray-500">
              +{job.skills.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all duration-300">
            <Bookmark className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all duration-300">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25">
          Apply Now
        </button>
      </div>
    </div>
  </div>
);

// Learning Resource Card
const ResourceCard = ({ resource }) => (
  <div className="bg-[#1c1c1c] p-4 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group cursor-pointer">
    <div className="flex items-center space-x-3 mb-3">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
        {resource.type === "video" ? (
          <PlayCircle className="w-4 h-4 text-blue-400" />
        ) : resource.type === "article" ? (
          <FileText className="w-4 h-4 text-blue-400" />
        ) : (
          <BookOpen className="w-4 h-4 text-blue-400" />
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-white text-sm group-hover:text-blue-300 transition-colors">
          {resource.title}
        </h4>
        <p className="text-gray-500 text-xs">
          {resource.duration} • {resource.source}
        </p>
      </div>
      <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
    </div>
  </div>
);

// Modern Carousel Component
const ModernCarousel = ({ items, title, icon: Icon }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [items.length, isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative group mb-16">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-3xl font-bold flex items-center">
          <Icon className="w-7 h-7 mr-3 text-blue-400" />
          {title}
        </h3>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-blue-500 w-6"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
              />
            ))}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <div className="bg-gradient-to-br from-blue-900/30 to-blue-900/30 p-10 rounded-2xl border border-blue-500/40 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-blue-500/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-blue-500/10 rounded-full blur-xl" />

                <div className="relative z-10">
                  <div className="flex items-center space-x-6 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-800 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="text-blue-300 text-xl font-medium">
                        {item.category}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-200 text-xl leading-relaxed mb-8 max-w-3xl">
                    {item.description}
                  </p>

                  {item.stats && (
                    <div className="flex items-center space-x-8 mb-8">
                      {item.stats.map((stat, statIndex) => (
                        <div key={statIndex} className="text-center">
                          <div className="text-3xl font-bold text-white">
                            {stat.value}
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center space-x-6">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 flex items-center space-x-2 text-lg">
                      <span>{item.buttonText}</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    {item.secondaryButton && (
                      <button className="border border-gray-500 hover:border-blue-400 text-gray-300 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 text-lg">
                        {item.secondaryButton}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// News Item Component
const NewsItem = ({ news }) => (
  <div className="flex items-start space-x-3 p-3 hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer group">
    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
    <div className="flex-1">
      <h4 className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
        {news.title}
      </h4>
      <p className="text-xs text-gray-500 mt-1">
        {news.source} • {news.time}
      </p>
    </div>
  </div>
);

const Dashboard = () => {
  const [user] = useState({
    name: "Sarah Chen",
    hasRoadmap: false,
    hasResume: false,
    completionRate: 75,
  });

  const aiTip =
    "Focus on cloud computing skills - they're seeing 40% more demand this month!";

  const roadmapProgress = {
    currentStep: "Complete AWS Certification",
    progress: 68,
    totalSteps: 12,
    completedSteps: 8,
  };

  const aiSuggestions = [
    {
      icon: TrendingUp,
      title: "Market Trending Skills",
      category: "Skills Intelligence",
      description:
        "TypeScript usage increased 25% in job postings this month. Adding it to your skillset could increase your job match rate significantly.",
      buttonText: "Start Learning",
      secondaryButton: "View Trends",
      stats: [
        { value: "+25%", label: "Demand" },
        { value: "92%", label: "Match Rate" },
        { value: "$125k", label: "Avg Salary" },
      ],
    },
    {
      icon: Calendar,
      title: "AI/ML Hackathon by Google",
      category: "Networking Opportunity",
      description:
        "Join 1000+ developers in Google's largest AI hackathon. Perfect opportunity to showcase your skills, learn cutting-edge technologies, and connect with industry leaders.",
      buttonText: "Register Now",
      secondaryButton: "Learn More",
      stats: [
        { value: "1000+", label: "Participants" },
        { value: "$50k", label: "Prize Pool" },
        { value: "3 days", label: "Duration" },
      ],
    },
    {
      icon: Award,
      title: "Azure Data Engineer Certification",
      category: "Career Advancement",
      description:
        "This certification aligns perfectly with your career goals and current skillset. 89% of certified professionals report salary increases within 6 months.",
      buttonText: "View Path",
      secondaryButton: "Book Exam",
      stats: [
        { value: "89%", label: "Success Rate" },
        { value: "+$15k", label: "Avg Increase" },
        { value: "4 weeks", label: "Prep Time" },
      ],
    },
    {
      icon: Users,
      title: "Senior Developer Community",
      category: "Professional Network",
      description:
        "Connect with 5000+ senior developers in our exclusive community. Share experiences, get mentorship, and discover hidden job opportunities.",
      buttonText: "Join Community",
      secondaryButton: "Preview",
      stats: [
        { value: "5000+", label: "Members" },
        { value: "150", label: "Companies" },
        { value: "Daily", label: "New Posts" },
      ],
    },
  ];

  const jobRecommendations = [
    {
      title: "Senior Frontend Developer",
      company: "TechFlow Inc.",
      location: "San Francisco",
      posted: "2 days ago",
      match: 92,
      description:
        "Looking for an experienced developer to lead our React team and build scalable user interfaces using modern technologies and best practices.",
      skills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"],
    },
    {
      title: "Full Stack Engineer",
      company: "StartupXYZ",
      location: "Remote",
      posted: "1 week ago",
      match: 87,
      description:
        "Join our fast-growing startup as a full-stack engineer working with React, Node.js, and AWS to build revolutionary products.",
      skills: ["React", "Node.js", "AWS", "Docker", "PostgreSQL"],
    },
    {
      title: "Product Engineer",
      company: "InnovateLabs",
      location: "New York",
      posted: "3 days ago",
      match: 84,
      description:
        "Bridge the gap between product and engineering in our mission to revolutionize fintech with cutting-edge technology solutions.",
      skills: ["Python", "React", "Kubernetes", "Microservices"],
    },
  ];

  const learningResources = [
    {
      title: "Advanced React Patterns",
      type: "video",
      duration: "45 min",
      source: "TechEd",
    },
    {
      title: "System Design Interview Guide",
      type: "article",
      duration: "15 min read",
      source: "DevBlog",
    },
    {
      title: "AWS Solutions Architect Practice",
      type: "course",
      duration: "2 hours",
      source: "CloudGuru",
    },
    {
      title: "JavaScript Performance Optimization",
      type: "video",
      duration: "30 min",
      source: "WebDev",
    },
    {
      title: "Mock Interview Questions",
      type: "practice",
      duration: "60 min",
      source: "InterviewAce",
    },
  ];

  const currentAffairs = [
    {
      title: "OpenAI announces GPT-5 with enhanced coding capabilities",
      source: "TechCrunch",
      time: "2h ago",
    },
    {
      title: "Remote work trends: 70% of developers prefer hybrid model",
      source: "DevSurvey",
      time: "5h ago",
    },
    {
      title: "Google launches new ML certification program",
      source: "Google Cloud",
      time: "1d ago",
    },
    {
      title: "Startup funding reaches new high in AI sector",
      source: "VentureBeat",
      time: "2d ago",
    },
  ];

  return (
    <div className="bg-[#0a0a0c] text-white font-sans overflow-hidden relative min-h-screen">
      {/* Background elements matching landing page */}
      <div
        className="absolute inset-0 bg-cover bg-fixed opacity-10"
        style={{
          backgroundImage: 'url("/images/space.png")',
          backgroundPosition: "center top",
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-blue-900/10"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0"></div>

      {/* Sparkles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <Sparkle
          key={i}
          delay={i * 0.3}
          size={Math.random() > 0.9 ? "w-2 h-2" : "w-1 h-1"}
        />
      ))}

      <div className="relative z-10 container mx-auto px-6 lg:px-8 py-6">
        <PostHeader />
        <main className="text-center py-20 lg:py-32 relative mb-20">
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute w-[400px] h-[400px] border-2 border-blue-500/20 rounded-full animate-spin-slow"></div>
            <div className="absolute w-[500px] h-[500px] border border-blue-500/10 rounded-full animate-spin-slower"></div>
            <div className="absolute w-[250px] h-[250px] bg-blue-900/40 rounded-full shadow-2xl shadow-blue-500/50 animate-glow"></div>
            <div className="absolute w-[150px] h-[150px] bg-blue-500/60 rounded-full blur-xl animate-float-fade"></div>
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fade-in-up">
            Welcome back <br /> {user.name}.
          </h1>
        </main>
        {/* Welcome Section */}
        <section className="mb-25">
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/20 p-8 rounded-2xl border border-blue-500/30 backdrop-blur-sm">
            <p className="text-blue-300 text-lg">
              <Lightbulb className="inline w-5 h-5 mr-2" />
              AI Tip: {aiTip}
            </p>
          </div>
        </section>

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          {/* Roadmap Section */}
          <section>
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <Target className="w-6 h-6 mr-3 text-blue-400" />
              Your Career Roadmap
            </h3>
            {user.hasRoadmap ? (
              <div className="bg-[#1c1c1c] p-8 rounded-2xl border border-gray-700/50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="font-semibold text-white text-lg">
                      {roadmapProgress.currentStep}
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Step {roadmapProgress.completedSteps} of{" "}
                      {roadmapProgress.totalSteps}
                    </p>
                  </div>
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                    View Details <ChevronRight className="inline w-4 h-4" />
                  </button>
                </div>
                <AnimatedProgressBar
                  progress={roadmapProgress.progress}
                  label="Overall Progress"
                />
                <button className="mt-8 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2">
                  <span>Continue Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="bg-[#1c1c1c] p-8 rounded-2xl border border-gray-700/50 text-center">
                <Target className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                <h4 className="font-semibold text-white mb-2">
                  Create Your Career Roadmap
                </h4>
                <p className="text-gray-400 mb-4 text-sm">
                  Get a personalized learning path based on your goals and
                  current skills.
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
                  Build Roadmap
                </button>
              </div>
            )}
          </section>

          {/* Resume Section */}
          <section>
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-blue-400" />
              Resume Analysis
            </h3>
            {user.hasResume ? (
              <div className="bg-[#1c1c1c] p-8 rounded-2xl border border-gray-700/50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="font-semibold text-white text-lg">
                      Resume Score
                    </h4>
                    <div className="flex items-center space-x-3 mt-2">
                      <div className="text-3xl font-bold text-green-400">
                        85%
                      </div>
                      <span className="text-sm text-gray-400">Good</span>
                    </div>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-6">
                  Your resume is performing well! Consider adding more
                  quantified achievements.
                </p>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg text-sm transition-colors">
                  View Analysis
                </button>
              </div>
            ) : (
              <div className="bg-[#1c1c1c] p-8 rounded-2xl border border-gray-700/50 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                <h4 className="font-semibold text-white mb-2">Upload Resume</h4>
                <p className="text-gray-400 mb-4 text-sm">
                  Get AI-powered feedback and optimization suggestions.
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300">
                  Upload Now
                </button>
              </div>
            )}
          </section>

          {/* Weekly Progress */}
          <section>
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-3 text-blue-400" />
              This Week
            </h3>
            <div className="bg-[#1c1c1c] p-8 rounded-2xl border border-gray-700/50 space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Study Hours</span>
                <span className="text-white font-semibold text-lg">12.5h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Tasks Completed</span>
                <span className="text-white font-semibold text-lg">8/12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Applications Sent</span>
                <span className="text-white font-semibold text-lg">3</span>
              </div>
              <div className="pt-4 border-t border-gray-700">
                <div className="flex items-center justify-center space-x-2 text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+20% from last week</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* AI Suggestions Carousel */}
        <ModernCarousel
          items={aiSuggestions}
          title="AI-Powered Insights"
          icon={Zap}
        />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          {/* Job Recommendations - Takes 2 columns */}
          <section className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <Briefcase className="w-6 h-6 mr-3 text-blue-400" />
              Job Recommendations
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {jobRecommendations.map((job, idx) => (
                <ModernJobCard key={idx} job={job} />
              ))}
            </div>
          </section>

          {/* Learning Resources */}
          <section>
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-blue-400" />
              Learning Resources
            </h3>
            <div className="space-y-4">
              {learningResources.map((resource, idx) => (
                <ResourceCard key={idx} resource={resource} />
              ))}
            </div>
          </section>
        </div>

        {/* Current Affairs / News */}
        <section className="mb-20">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <Globe className="w-6 h-6 mr-3 text-blue-400" />
            Current Affairs
          </h3>
          <div className="bg-[#1c1c1c] p-6 rounded-2xl border border-gray-700/50">
            {currentAffairs.map((news, idx) => (
              <NewsItem key={idx} news={news} />
            ))}
          </div>
        </section>

        {/* Footer Placeholder */}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
