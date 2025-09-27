import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  TrendingUp,
  Target,
  BookOpen,
  FileText,
  Briefcase,
  Clock,
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
  Search,
  FileX,
} from "lucide-react";
import Footer from "../Components/Footer";
import PostHeader from "../Components/PostHeader";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import Cookies from 'js-cookie'
import { useLocation, useNavigate } from "react-router-dom";

const LoadingSpinner = ({ size = "w-6 h-6" }) => (
  <Loader2 className={`${size} animate-spin text-blue-400`} />
);

const SectionLoader = ({ title, icon: Icon }) => (
  <div className="bg-[#1c1c1c] p-4 sm:p-6 lg:p-8 rounded-2xl border border-gray-700/50">
    <h4 className="font-semibold text-white text-base sm:text-lg mb-4 flex items-center">
      <Icon className="w-5 h-5 mr-2 text-blue-400" />
      {title}
    </h4>
    <div className="flex items-center justify-center py-6 sm:py-8">
      <LoadingSpinner size="w-6 h-6 sm:w-8 sm:h-8" />
      <span className="ml-3 text-gray-400 text-sm sm:text-base">Loading...</span>
    </div>
  </div>
);

// Empty State Component for Jobs
const EmptyJobsState = () => {
  const navigate = useNavigate();
  return (
    <div className="col-span-full bg-[#1c1c1c] p-6 sm:p-8 lg:p-12 rounded-2xl border border-gray-700/50 text-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-blue-500/10 rounded-full flex items-center justify-center">
        <Search className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
      </div>
      <h4 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">No Jobs Found</h4>
      <p className="text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
        We couldn't find any job recommendations at the moment. Try updating your profile or location to get better matches.
      </p>
      <button
        onClick={() =>{
          navigate("/jobs")
        } }
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base"
      >
        Update Job Profile
      </button>
    </div>
  );
};

const EmptyResourcesState = () => (
  <div className="bg-[#1c1c1c] p-6 sm:p-8 rounded-2xl border border-gray-700/50 text-center">
    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-blue-500/10 rounded-full flex items-center justify-center">
      <FileX className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
    </div>
    <h4 className="text-base sm:text-lg font-semibold text-white mb-2">No Resources Available</h4>
    <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">
      Learning resources will appear here once you set up your career goals.
    </p>
    <button
      onClick={() => window.location.href = "/generate-roadmap"}
      className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-all duration-300"
    >
      Set Goals
    </button>
  </div>
);

// Job Loading Component
const JobLoadingCard = () => (
  <div className="bg-[#1c1c1c] p-4 sm:p-6 rounded-2xl border border-gray-700/50">
    <div className="animate-pulse">
      <div className="flex items-start space-x-3 sm:space-x-4 mb-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gray-700"></div>
        <div className="flex-1">
          <div className="h-4 sm:h-5 bg-gray-700 rounded mb-2"></div>
          <div className="h-3 sm:h-4 bg-gray-800 rounded mb-2 w-3/4"></div>
          <div className="h-2 sm:h-3 bg-gray-800 rounded w-1/2"></div>
        </div>
      </div>
      <div className="h-3 sm:h-4 bg-gray-800 rounded mb-4"></div>
      <div className="flex space-x-2 mb-4">
        <div className="h-5 sm:h-6 bg-gray-800 rounded w-12 sm:w-16"></div>
        <div className="h-5 sm:h-6 bg-gray-800 rounded w-16 sm:w-20"></div>
        <div className="h-5 sm:h-6 bg-gray-800 rounded w-10 sm:w-14"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-6 sm:h-8 bg-gray-800 rounded w-12 sm:w-16"></div>
        <div className="h-8 sm:h-10 bg-gray-700 rounded w-20 sm:w-24"></div>
      </div>
    </div>
  </div>
);

// Resource Loading Component
const ResourceLoadingCard = () => (
  <div className="bg-[#1c1c1c] p-3 sm:p-4 rounded-xl border border-gray-700/50">
    <div className="animate-pulse">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gray-700"></div>
        <div className="flex-1">
          <div className="h-3 sm:h-4 bg-gray-700 rounded mb-1"></div>
          <div className="h-2 sm:h-3 bg-gray-800 rounded w-2/3"></div>
        </div>
        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-800 rounded"></div>
      </div>
    </div>
  </div>
);

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

const ModernJobCard = ({ job }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-4 sm:p-5 lg:p-6 rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group backdrop-blur-sm relative overflow-hidden">
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
        <div
          className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
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
        <div className="flex items-start space-x-3 sm:space-x-4 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all duration-300 flex-shrink-0">
            <Building className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-sm sm:text-base lg:text-lg group-hover:text-blue-300 transition-colors line-clamp-2">
              {job.title}
            </h3>
            <p className="text-gray-400 font-medium text-xs sm:text-sm truncate">{job.company}</p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 sm:mt-2 text-xs text-gray-500 space-y-1 sm:space-y-0">
              <span className="flex items-center">
                <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{job.location}</span>
              </span>
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{job.postedTime}</span>
              </span>
            </div>
          </div>
        </div>
        <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 lg:mb-6 leading-relaxed line-clamp-3">
          {job.description}
        </p>
        {job.skills && (
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4 lg:mb-6">
            {job.skills.slice(0, window.innerWidth < 640 ? 2 : 3).map((skill, index) => (
              <span
                key={index}
                className="text-xs bg-gray-800 text-gray-300 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-gray-700 truncate max-w-[120px] sm:max-w-none"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > (window.innerWidth < 640 ? 2 : 3) && (
              <span className="text-xs text-gray-500 flex items-center">
                +{job.skills.length - (window.innerWidth < 640 ? 2 : 3)} more
              </span>
            )}
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          <button className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all duration-300 flex-shrink-0">
            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <button onClick={()=>{
            window.open(job.link,"_blank")
          }} className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25 text-xs sm:text-sm flex-shrink-0">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

const ResourceCard = ({ resource }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#1c1c1c] p-3 sm:p-4 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group cursor-pointer">
      <div className="flex items-start space-x-3 mb-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          {resource.type === "video" ? (
            <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
          ) : resource.type === "article" ? (
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
          ) : (
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white text-sm sm:text-base group-hover:text-blue-300 transition-colors line-clamp-2 leading-tight mb-1">
            {resource.title}
          </h4>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs text-gray-500">
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
              {resource.duration}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center">
              <Star className="w-3 h-3 mr-1 flex-shrink-0 text-yellow-400" />
              {resource.rating}
            </span>
          </div>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            window.open(resource.link || '#', '_blank');
          }} 
          className="p-1.5 sm:p-2 text-gray-500 group-hover:text-blue-400 transition-colors hover:bg-blue-400/10 rounded-lg flex-shrink-0"
        >
          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};

// Modern Carousel Component with Better Responsive Design
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
      <div className="relative group mb-8 sm:mb-12 lg:mb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 lg:mb-8 gap-4">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 mr-2 sm:mr-3 text-blue-400" />
            {title}
          </h3>
        </div>
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-900/30 p-6 sm:p-8 lg:p-10 rounded-2xl border border-blue-500/40 backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-center py-12 sm:py-16 lg:py-20">
            <LoadingSpinner size="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
            <span className="ml-3 sm:ml-4 text-gray-400 text-base sm:text-lg lg:text-xl">Loading insights...</span>
          </div>
        </div>
      </div>
    );
  }
  
  if (!items || items.length === 0) {
    return (
      <div className="relative group mb-8 sm:mb-12 lg:mb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 lg:mb-8 gap-4">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 mr-2 sm:mr-3 text-blue-400" />
            {title}
          </h3>
        </div>
        <div className="text-gray-400 text-center py-8 sm:py-12">
          No insights available.
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative group mb-8 sm:mb-12 lg:mb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 lg:mb-8 gap-4">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 mr-2 sm:mr-3 text-blue-400" />
          {title}
        </h3>
        <div className="flex items-center justify-center sm:justify-end space-x-3 sm:space-x-4">
          <div className="flex space-x-1 sm:space-x-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-blue-500 w-4 sm:w-6"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
              />
            ))}
          </div>
          <div className="flex space-x-1 sm:space-x-2">
            <button
              onClick={prevSlide}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </button>
            <button
              onClick={nextSlide}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all duration-300"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {items.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <div className="bg-gradient-to-br from-blue-900/30 to-blue-900/30 p-6 sm:p-8 lg:p-10 rounded-2xl border border-blue-500/40 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-500/10 to-blue-500/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-blue-500/10 to-blue-500/10 rounded-full blur-xl"/>
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6 sm:mb-8">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="text-blue-300 text-lg sm:text-xl font-medium">
                        {item.category}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-200 text-base sm:text-lg lg:text-xl leading-relaxed mb-6 sm:mb-8 max-w-none lg:max-w-3xl">
                    {item.description}
                  </p>

                  {item.stats && (
                    <div className="grid grid-cols-2 sm:flex sm:items-center sm:space-x-8 gap-4 sm:gap-0 mb-6 sm:mb-8">
                      {item.stats.map((stat, statIndex) => (
                        <div key={statIndex} className="text-center">
                          <div className="text-2xl sm:text-3xl font-bold text-white">
                            {stat.value}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-400 mt-1">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
                    <a href={item.buttonLink} className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2 text-base sm:text-lg">
                      <span>{item.buttonText}</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                    {item.secondaryButton && (
                      <a href={item.secondaryButtonLink} className="border border-gray-500 hover:border-blue-400 text-gray-300 hover:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 text-center text-base sm:text-lg">
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

const NewsItem = ({ news }) => (
  <div className="flex items-start space-x-3 p-3 hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer group">
    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors line-clamp-2">
        {news.title}
      </h4>
      <p className="text-xs text-gray-500 mt-1 truncate">
        {news.source} • {news.time}
      </p>
    </div>
  </div>
);

const Dashboard = () => {
  const API_BASE = import.meta.env.VITE_API_URL;
  const location = useLocation();
  const { user } = useUser();
  const navigate = useNavigate();
  const hasGoal = Cookies.get("hasGoal") === "true";
  const role = Cookies.get("goal") || "";
  const [aiTip, setaiTip] = useState("Stay curious and keep learning!");
  const [aiSuggestions, setaiSuggestions] = useState([]);
  const [currentAffairs, setcurrentAffairs] = useState([]);
  const [totalSteps, settotalSteps] = useState(0);
  const [completedSteps, setcompletedSteps] = useState(0);
  const [resumeScore, setresumeScore] = useState(0);
  const [hasResume, sethasResume] = useState(false);
  const [learningResources,setlearningResources]=useState([]);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [loadingResume, setLoadingResume] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [loadingNews, setLoadingNews] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingResources, setLoadingResources] = useState(false);
  const [jobRecommendations,setjobRecommendations]=useState([]);

  const parseApiResponse = (rawMessage) => {
    try {
      let cleanedString = rawMessage.replace(/```json\n?|```\n?/g, "").trim();
      cleanedString = cleanedString.replace(/"\s*\n\s*,/g, '"},');
      cleanedString = cleanedString.replace(/,(\s*[}\]])/g, '$1');
      return JSON.parse(cleanedString);
    } catch (error) {
      console.error("JSON parsing failed:", error);
      console.log("Attempted to parse:", rawMessage);
      try {
        let fixedString = rawMessage.replace(/```json\n?|```\n?/g, "").trim();
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
      .get(`${API_BASE}/api/home/get-tip/`)
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
      .get(`${API_BASE}/api/home/suggestions`)
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
    axios.get(`${API_BASE}/api/home/current-affairs`)
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
        .post(`${API_BASE}/api/home/fetch-steps`, {
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
      .post(`${API_BASE}/api/home/fetch-data`, {
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
    setLoadingResources(true);
    axios.post(`${API_BASE}/api/home/dash-resource`,{
      userId:user.id
    })
    .then(res=>{
      if (res.data.success){
        setlearningResources(res.data.resource);
      }
    })
    .catch(err=>{
      console.log("Error while loading resources");
      setlearningResources([]);
    })
    .finally(() => {
      setLoadingResources(false);
    });
  },[user, location.pathname])

  useEffect(() => {
    if (!user?.id) return;
    setLoadingJobs(true);
    axios.post(`${API_BASE}/api/home/fetch-jobs`, { userId: user.id })
      .then((res) => {
        if (res.data.success){
          setjobRecommendations(res.data.jobs[0].job);
        }
      })
      .catch((err) => {
        console.log(err);
        setjobRecommendations([]);
      })
      .finally(() => {
        setLoadingJobs(false);
      });
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

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <PostHeader />
          <main className="text-center py-12 sm:py-16 lg:py-20 xl:py-32 relative mb-12 sm:mb-16 lg:mb-20">
            <div className="absolute inset-0 flex items-center justify-center -z-10">
              <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
              <div className="absolute w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] lg:w-[400px] lg:h-[400px] border-2 border-blue-500/20 rounded-full animate-spin-slow"></div>
              <div className="absolute w-[360px] h-[360px] sm:w-[420px] sm:h-[420px] lg:w-[500px] lg:h-[500px] border border-blue-500/10 rounded-full animate-spin-slower"></div>
              <div className="absolute w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] lg:w-[250px] lg:h-[250px] bg-blue-900/40 rounded-full shadow-2xl shadow-blue-500/50 animate-glow"></div>
              <div className="absolute w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] lg:w-[150px] lg:h-[150px] bg-blue-500/60 rounded-full blur-xl animate-float-fade"></div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-7xl font-extrabold leading-tight mb-4 sm:mb-6 animate-fade-in-up px-4">
              Welcome back, <br className="hidden sm:block" /> 
              <span className="text-blue-400">{user.fullName ? user.fullName : "Learner"}</span>
            </h1>
          </main>

          {/* Welcome Section */}
          <section className="mb-12 sm:mb-16 lg:mb-20">
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/20 p-6 sm:p-8 rounded-2xl border border-blue-500/30 backdrop-blur-sm">
              <p className="text-blue-300 text-base sm:text-lg flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                <Lightbulb className="w-5 h-5 sm:mr-2 flex-shrink-0" />
                <span className="font-medium">AI Tip:</span> <span>{aiTip}</span>
              </p>
            </div>
          </section>

          {/* Main Grid Layout */}
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
            {/* Roadmap Section */}
            <section>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-400" />
                Your Career Roadmap
              </h3>
              {hasGoal ? (
                loadingRoadmap ? (
                  <SectionLoader title="Loading Roadmap" icon={Target} />
                ) : (
                  <div className="bg-[#1c1c1c] p-6 sm:p-8 rounded-2xl border border-gray-700/50">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="font-semibold text-white text-base sm:text-lg">
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
                        className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm font-medium flex items-center"
                      >
                        View Details <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/generate-roadmap");
                      }}
                      className="mt-6 sm:mt-8 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2 text-sm sm:text-base"
                    >
                      <span>Continue Learning</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )
              ) : (
                <div className="bg-[#1c1c1c] p-6 sm:p-8 rounded-2xl border border-gray-700/50 text-center">
                  <Target className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-blue-400" />
                  <h4 className="font-semibold text-white mb-2 text-base sm:text-lg">
                    Create Your Career Roadmap
                  </h4>
                  <p className="text-gray-400 mb-4 text-sm">
                    Get a personalized learning path based on your goals and
                    current skills.
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
                    Build Roadmap
                  </button>
                </div>
              )}
            </section>

            {/* Resume Section */}
            <section>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-400" />
                Resume Analysis
              </h3>
              {loadingResume ? (
                <SectionLoader title="Loading Resume Data" icon={FileText} />
              ) : hasResume ? (
                <div className="bg-[#1c1c1c] p-6 sm:p-8 rounded-2xl border border-gray-700/50">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="font-semibold text-white text-base sm:text-lg">
                        Resume Score
                      </h4>
                      <div className="flex items-center space-x-3 mt-2">
                        <div className="text-2xl sm:text-3xl font-bold text-green-400">
                          {resumeScore}
                        </div>
                        <span className="text-xs sm:text-sm text-gray-400">Great job</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 mb-6">
                    Your resume is performing well! Consider adding more
                    quantified achievements.
                  </p>
                  <button
                    onClick={() => {
                      navigate("/resume-upload");
                    }}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 sm:py-3 rounded-lg text-xs sm:text-sm transition-colors"
                  >
                    View Analysis
                  </button>
                </div>
              ) : (
                <div className="bg-[#1c1c1c] p-6 sm:p-8 rounded-2xl border border-gray-700/50 text-center">
                  <Upload className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-blue-400" />
                  <h4 className="font-semibold text-white mb-2 text-base sm:text-lg">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
            {/* Job Recommendations - Full width on mobile, 2 columns on large screens */}
            <section className="lg:col-span-2 order-2 lg:order-1">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-400" />
                Job Recommendations
              </h3>
              {loadingJobs ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <JobLoadingCard key={idx} />
                  ))}
                </div>
              ) : jobRecommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {jobRecommendations.slice(0, 4).map((job, idx) => (
                    <ModernJobCard key={idx} job={job} />
                  ))}
                </div>
              ) : (
                <EmptyJobsState />
              )}
            </section>

            {/* Learning Resources */}
            <section className="order-1 lg:order-2">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-400" />
                Learning Resources
              </h3>
              {loadingResources ? (
                <div className="space-y-3 sm:space-y-4">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <ResourceLoadingCard key={idx} />
                  ))}
                </div>
              ) : learningResources.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {learningResources.slice(0, 6).map((resource, idx) => (
                    <ResourceCard key={idx} resource={resource} />
                  ))}
                  <div className="mt-4 sm:mt-6">
                    <button 
                      onClick={()=>{
                        navigate("/resources")
                      }} 
                      className="text-blue-400 hover:text-blue-300 underline cursor-pointer text-sm sm:text-base inline-flex items-center group transition-colors"
                    >
                      <span>Learn More</span>
                      <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              ) : (
                <EmptyResourcesState />
              )}
            </section>
          </div>
          
          {/* Current Affairs / News */}
          <section className="mb-12 sm:mb-16 lg:mb-20">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
              <Globe className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-400" />
              Current Affairs
            </h3>
            {loadingNews ? (
              <div className="bg-[#1c1c1c] p-4 sm:p-6 rounded-2xl border border-gray-700/50">
                <div className="flex items-center justify-center py-8 sm:py-12">
                  <LoadingSpinner size="w-6 h-6 sm:w-8 sm:h-8" />
                  <span className="ml-3 text-gray-400 text-sm sm:text-base">Loading news...</span>
                </div>
              </div>
            ) : (
              <div className="bg-[#1c1c1c] p-4 sm:p-6 rounded-2xl border border-gray-700/50">
                {currentAffairs.length > 0 ? (
                  <div className="space-y-1">
                    {currentAffairs.map((news, idx) => (
                      <NewsItem key={idx} news={news} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8 text-gray-400 text-sm sm:text-base">
                    No current affairs available
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;