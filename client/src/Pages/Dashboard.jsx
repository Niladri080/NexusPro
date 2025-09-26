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
  Loader2,
  Star,
} from "lucide-react";
import Footer from "../Components/Footer";
import PostHeader from "../Components/PostHeader";
import axios from "axios";
import { RiseLoader } from "react-spinners";
import RiseLoaderWrapper from "../Components/RiseLoader";
import { useUser } from "@clerk/clerk-react";
import Cookies from 'js-cookie'
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Loading Component
const LoadingSpinner = ({ size = "w-6 h-6" }) => (
  <Loader2 className={`${size} animate-spin text-blue-400`} />
);

// Section Loading Component
const SectionLoader = ({ title, icon: Icon }) => (
  <div className="bg-[#1c1c1c] p-8 rounded-2xl border border-gray-700/50">
    <h4 className="font-semibold text-white text-lg mb-4 flex items-center">
      <Icon className="w-5 h-5 mr-2 text-blue-400" />
      {title}
    </h4>
    <div className="flex items-center justify-center py-8">
      <LoadingSpinner size="w-8 h-8" />
      <span className="ml-3 text-gray-400">Loading...</span>
    </div>
  </div>
);

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

// Modern Job Card Component
const ModernJobCard = ({ job }) => (
  <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-6 rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group backdrop-blur-sm relative overflow-hidden">
    <div className="absolute top-4 right-4 z-10">
      <div
        className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
          job.matchScore >= 90
            ? "bg-green-500/20 text-green-300 border border-green-500/30"
            : job.match >= 80
            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
            : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
        }`}
      >
        {job.matchScore}% match
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
              {job.postedTime}
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
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
        <button onClick={()=>{
          window.open(job.link,"_blank")
        }} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25">
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
        <p className="text-gray-500 text-xs inline">
          {resource.duration} |  ★{resource.rating}
        </p>
      </div>
      <ExternalLink onClick={()=>{
        window.open(resource.link || '#')
      }} className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
    </div>
  </div>
);

// Modern Carousel Component with Loading State
const ModernCarousel = ({ items, title, icon: Icon, loading = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    setCurrentIndex(0);
  }, [items.length]);

  useEffect(() => {
    if (!isAutoPlaying || !items || items.length === 0 || loading) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [items.length, isAutoPlaying, loading]);

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

  if (loading) {
    return (
      <div className="relative group mb-16">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold flex items-center">
            <Icon className="w-7 h-7 mr-3 text-blue-400" />
            {title}
          </h3>
        </div>
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-900/30 p-10 rounded-2xl border border-blue-500/40 backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="w-12 h-12" />
            <span className="ml-4 text-gray-400 text-xl">Loading insights...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="relative group mb-16">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold flex items-center">
            <Icon className="w-7 h-7 mr-3 text-blue-400" />
            {title}
          </h3>
        </div>
        <div className="text-gray-400 text-center py-12">
          No insights available.
        </div>
      </div>
    );
  }

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
                    <a href={item.buttonLink} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 flex items-center space-x-2 text-lg">
                      <span>{item.buttonText}</span>
                      <ArrowRight className="w-5 h-5" />
                    </a>
                    {item.secondaryButton && (
                      <a href={item.secondaryButtonLink} className="border border-gray-500 hover:border-blue-400 text-gray-300 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 text-lg">
                        {item.secondaryButton}
                      </a>
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
  const location = useLocation();
  const { user } = useUser();
  const navigate = useNavigate();
  const hasGoal = Cookies.get("hasGoal") === "true";
  const role = Cookies.get("goal") || "";

  // State for data
  const [aiTip, setaiTip] = useState("Stay curious and keep learning!");
  const [aiSuggestions, setaiSuggestions] = useState([]);
  const [currentAffairs, setcurrentAffairs] = useState([]);
  const [totalSteps, settotalSteps] = useState(0);
  const [completedSteps, setcompletedSteps] = useState(0);
  const [resumeScore, setresumeScore] = useState(0);
  const [hasResume, sethasResume] = useState(false);
  const [learningResources,setlearningResources]=useState([]);
  // Loading states
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [loadingResume, setLoadingResume] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [loadingNews, setLoadingNews] = useState(false);
  const [jobRecommendations,setjobRecommendations]=useState([]);
  // Helper function to safely parse JSON from API responses
  const parseApiResponse = (rawMessage) => {
    try {
      // Remove markdown code blocks
      let cleanedString = rawMessage.replace(/```json\n?|```\n?/g, "").trim();
      
      // Fix common JSON formatting issues
      // Fix missing closing braces before commas (common AI generation error)
      cleanedString = cleanedString.replace(/"\s*\n\s*,/g, '"},');
      
      // Remove any trailing commas before closing brackets/braces
      cleanedString = cleanedString.replace(/,(\s*[}\]])/g, '$1');
      
      // Parse the JSON
      return JSON.parse(cleanedString);
    } catch (error) {
      console.error("JSON parsing failed:", error);
      console.log("Attempted to parse:", rawMessage);
      
      // Try one more aggressive fix for malformed objects
      try {
        let fixedString = rawMessage.replace(/```json\n?|```\n?/g, "").trim();
        
        // More aggressive fix: look for pattern like `"time": "value"\n  ,` and fix it
        fixedString = fixedString.replace(/"([^"]+)"\s*\n\s*,/g, '"$1"},');
        fixedString = fixedString.replace(/,(\s*[}\]])/g, '$1');
        
        return JSON.parse(fixedString);
      } catch (secondError) {
        console.error("Second parsing attempt also failed:", secondError);
        return [];
      }
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/home/get-tip/")
      .then((res) => {
        setaiTip(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);

  useEffect(() => {
    setLoadingInsights(true);
    axios
      .get("http://localhost:4000/api/home/suggestions")
      .then((res) => {
        const parsedSuggestions = parseApiResponse(res.data.message);
        setaiSuggestions(parsedSuggestions);
      })
      .catch((err) => {
        console.error("Error fetching AI suggestions:", err);
        setaiSuggestions([]);
      })
      .finally(() => {
        setLoadingInsights(false);
      });
  }, [user]);

  useEffect(() => {
    setLoadingNews(true);
    axios.get("http://localhost:4000/api/home/current-affairs")
      .then((res) => {
        const parsedAffairs = parseApiResponse(res.data.message);
        setcurrentAffairs(parsedAffairs);
      })
      .catch((err) => {
        console.error("Error fetching current affairs:", err);
        setcurrentAffairs([]);
      })
      .finally(() => {
        setLoadingNews(false);
      });
  }, [user]);

  useEffect(() => {
    if (hasGoal) {
      setLoadingRoadmap(true);
      axios
        .post("http://localhost:4000/api/home/fetch-steps", {
          userId: user.id,
        })
        .then((res) => {
          settotalSteps(res.data.Total);
          setcompletedSteps(res.data.current);
        })
        .catch((err) => {
          console.log("Error occured while fetching data");
        })
        .finally(() => {
          setLoadingRoadmap(false);
        });
    }
  }, [user, location.pathname, hasGoal]);

  useEffect(() => {
    setLoadingResume(true);
    axios
      .post("http://localhost:4000/api/home/fetch-data", {
        userId: user.id,
      })
      .then((res) => {
        sethasResume(res.data.hasResume);
        setresumeScore(res.data.atsScore);
      })
      .catch((err) => {
       console.log("Error occured while fetching data");
      })
      .finally(() => {
        setLoadingResume(false);
      });
  }, [user, location.pathname]);
  useEffect(()=>{
    axios.post("http://localhost:4000/api/home/dash-resource",{
      userId:user.id
    })
    .then(res=>{
      setlearningResources(res.data.resource);
    })
    .catch(err=>{
      toast.error("Error while loading resources");
    })
  },[user, location.pathname])
   useEffect(() => {
    if (!user?.id) return;
    axios.post("http://localhost:4000/api/home/fetch-jobs", { userId: user.id })
      .then((res) => {
        console.log(res.data.jobs[0].job);
        setjobRecommendations(res.data.jobs[0].job);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [user,location.pathname]);
  return (
    <>
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
              Welcome back, <br /> {user.fullName ? user.fullName : "Learner"}
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
              {hasGoal ? (
                loadingRoadmap ? (
                  <SectionLoader title="Loading Roadmap" icon={Target} />
                ) : (
                  <div className="bg-[#1c1c1c] p-8 rounded-2xl border border-gray-700/50">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="font-semibold text-white text-lg">
                          {role ? role : "Successful Person"}
                        </h4>
                        <p className="text-sm text-gray-400 mt-1">
                          Step {completedSteps} of {totalSteps}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          navigate("/my-learning");
                        }}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                      >
                        View Details <ChevronRight className="inline w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/generate-roadmap");
                      }}
                      className="mt-8 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2"
                    >
                      <span>Continue Learning</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )
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
              {loadingResume ? (
                <SectionLoader title="Loading Resume Data" icon={FileText} />
              ) : hasResume ? (
                <div className="bg-[#1c1c1c] p-8 rounded-2xl border border-gray-700/50">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="font-semibold text-white text-lg">
                        Resume Score
                      </h4>
                      <div className="flex items-center space-x-3 mt-2">
                        <div className="text-3xl font-bold text-green-400">
                          {resumeScore}
                        </div>
                        <span className="text-sm text-gray-400">Great job</span>
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
                  <button
                    onClick={() => {
                      navigate("/resume-upload");
                    }}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg text-sm transition-colors"
                  >
                    View Analysis
                  </button>
                </div>
              ) : (
                <div className="bg-[#1c1c1c] p-8 rounded-2xl border border-gray-700/50 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                  <h4 className="font-semibold text-white mb-2">
                    Upload Resume
                  </h4>
                  <p className="text-gray-400 mb-4 text-sm">
                    Get AI-powered feedback and optimization suggestions.
                  </p>
                  <button
                    onClick={() => {
                      navigate("/resume-upload");
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300"
                  >
                    Upload Now
                  </button>
                </div>
              )}
            </section>           
          </div>

          {/* AI Suggestions Carousel */}
          <ModernCarousel
            items={aiSuggestions}
            title="AI-Powered Insights"
            icon={Zap}
            loading={loadingInsights}
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
                {jobRecommendations.length>0 && jobRecommendations.slice(0,4).map((job, idx) => (
                  <ModernJobCard key={idx} job={job} />
                ))}
              {jobRecommendations.length==0 && <p className='text-blue-500 mt-10'>No Recommendations Found</p>  }
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
              <span onClick={()=>{
                navigate("/resources")
              }} className='text-blue-500 mt-10 underline cursor-pointer'>Learn More ↗</span>
              </div>
            </section>
          </div>
          {/* Current Affairs / News */}
          <section className="mb-20">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <Globe className="w-6 h-6 mr-3 text-blue-400" />
              Current Affairs
            </h3>
            {loadingNews ? (
              <div className="bg-[#1c1c1c] p-6 rounded-2xl border border-gray-700/50">
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner size="w-8 h-8" />
                  <span className="ml-3 text-gray-400">Loading news...</span>
                </div>
              </div>
            ) : (
              <div className="bg-[#1c1c1c] p-6 rounded-2xl border border-gray-700/50">
                {currentAffairs.length > 0 ? (
                  currentAffairs.map((news, idx) => (
                    <NewsItem key={idx} news={news} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No current affairs available
                  </div>
                )}
              </div>
            )}
          </section>
          {/* Footer Placeholder */}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;