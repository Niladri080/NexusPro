import React, { useEffect, useState } from "react";
import {
  Home,
  Brain,
  MapPin,
  FileText,
  BookOpen,
  Menu,
  X,
  CheckCircle,
  Clock,
  Upload,
  Trophy,
  Flame,
  Target,
  TrendingUp,
  Award,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { useUser } from "@clerk/clerk-react";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
const MyLearningPage = () => {
  const location = useLocation();
  const { user } = useUser();
  const navigate = useNavigate();
  const role = Cookies.get("goal") || "";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const [roadmapProgress, setroadmapProgress] = useState(0);
  const [hasRoadmap, sethasRoadmap] = useState(false);
  const [resumeScore, setresumeScore] = useState(0);
  const [hasResume, sethasResume] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roadmapSteps, setroadmapSteps] = useState([]);
  const [currentIndex, setcurrentIndex] = useState(-1);
  useEffect(() => {
    axios
      .post("http://localhost:4000/api/home/fetch-roadmap", {
        userId: user.id,
      })
      .then((res) => {
        setroadmapSteps(res.data.roadmap);
        setcurrentIndex(res.data.currentIndex);
      })
      .catch((err) => {
        toast.error("Error ocurred while fetching data");
      });
  }, [location.pathname, user]);

  useEffect(() => {
    setLoading(true);
    axios
      .post("http://localhost:4000/api/home/fetch-data", {
        userId: user.id,
      })
      .then((res) => {
        sethasRoadmap(res.data.hasRoadmap);
        sethasResume(res.data.hasResume);
        setroadmapProgress(res.data.percentage);
        setresumeScore(res.data.atsScore);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Error occured while fetching data");
        setLoading(false);
      });
  }, [user, location.pathname]);
  const userData = {
    name: "Alex Johnson",
    chosenCareerPath: "AI Engineer",
    roadmapProgress: 70,
    resumeScore: 78,
    completedLessons: 24,
    totalLessons: 40,
    streak: 12,
    badges: 5,
    weeklyGoal: 85,
  };

  const statistics = [
    {
      icon: Flame,
      title: "Day Streak",
      value: userData.streak,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
    },
    {
      icon: Target,
      title: "Weekly Goal",
      value: `${userData.weeklyGoal}%`,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      icon: TrendingUp,
      title: "Lessons Completed",
      value: `${userData.completedLessons}/${userData.totalLessons}`,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
  ];

  const CircularProgress = ({ progress, size = 100 }) => {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgb(55, 65, 81)"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgb(59, 130, 246)"
            strokeWidth="6"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{progress}</span>
        </div>
      </div>
    );
  };

  const nextStat = () => {
    setCurrentStatIndex((prev) => (prev + 1) % statistics.length);
  };

  const prevStat = () => {
    setCurrentStatIndex(
      (prev) => (prev - 1 + statistics.length) % statistics.length
    );
  };

  const currentStat = statistics[currentStatIndex];
  const StatIcon = currentStat.icon;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans overflow-hidden relative">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-fixed opacity-10"
        style={{
          backgroundImage: 'url("/images/space.png")',
          backgroundPosition: "center top",
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-blue-900/10"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0"></div>

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="lg:ml-72 relative z-10">
        {/* Header */}
        <header className="relative flex items-center justify-center py-16 px-4 mb-8">
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute w-[350px] h-[350px] border-2 border-blue-500/20 rounded-full animate-spin-slow"></div>
            <div className="absolute w-[200px] h-[200px] bg-blue-900/40 rounded-full shadow-2xl shadow-blue-500/50 animate-glow"></div>
          </div>
          <div className="bg-white/5 border border-blue-400/10 shadow-xl rounded-2xl px-10 py-10 max-w-2xl w-full text-center backdrop-blur-2xl">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 text-white flex items-center justify-center gap-3">
              Welcome back,{" "}
              <span className="text-blue-400">
                {user?.fullName || "Learner"}
              </span>
              ! <span>👋</span>
            </h1>
            <p className="text-blue-200 text-lg font-medium">
              Continue your journey to become an{" "}
              <span className="font-semibold text-white">
                {role ? role : "Successfull Person"}
              </span>
            </p>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 space-y-12">
          {/* Career Path Section */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-blue-600/20 px-6 py-3 rounded-full border border-blue-500/30">
              <Award className="text-blue-400" size={24} />
              <span className="text-xl font-semibold">
                {role
                  ? "Your Chosen Path: " + role
                  : "You have not choosen a path"}
              </span>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Roadmap Progress */}
            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/60 p-8 rounded-2xl border border-blue-700/50 shadow-xl backdrop-blur-md">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-6 text-gray-200">
                  Roadmap Progress
                </h3>
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-[100px]">
                    <RefreshCw
                      className="animate-spin text-blue-400"
                      size={48}
                    />
                    <span className="mt-2 text-blue-300">Loading...</span>
                  </div>
                ) : hasRoadmap ? (
                  <CircularProgress progress={roadmapProgress} />
                ) : (
                  <p className="text-gray-400 mt-4">
                    Choose your Roadmap first
                  </p>
                )}
                <p className="text-gray-400 mt-4">
                  {hasRoadmap && "Keep going! You're doing great."}
                </p>
                {!hasRoadmap && !loading && (
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 mt-8">
                    Build Roadmap
                  </button>
                )}
              </div>
            </div>

            {/* Resume Score */}
            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/60 p-8 rounded-2xl border border-blue-700/50 shadow-xl backdrop-blur-md">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-6 text-gray-200">
                  Resume Score
                </h3>
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-[100px]">
                    <RefreshCw
                      className="animate-spin text-blue-400"
                      size={48}
                    />
                    <span className="mt-2 text-blue-300">Loading...</span>
                  </div>
                ) : hasResume ? (
                  <CircularProgress progress={resumeScore} />
                ) : (
                  <p className="text-gray-400 mt-4">
                    Upload Your resume to get the score
                  </p>
                )}
                <button className="mt-8 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto">
                  <Upload size={16} />
                  {hasResume ? "Update Resume" : "Upload Resume"}
                </button>
              </div>
            </div>

            {/* Statistics Carousel */}
            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/60 p-8 rounded-2xl border border-blue-700/50 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={prevStat}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <h3 className="text-lg font-semibold text-gray-200">
                  Your Stats
                </h3>
                <button
                  onClick={nextStat}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="text-center">
                <div
                  className={`w-16 h-16 ${currentStat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <StatIcon className={currentStat.color} size={28} />
                </div>
                <div className="text-3xl font-bold mb-2">
                  {currentStat.value}
                </div>
                <div className="text-gray-400">{currentStat.title}</div>
              </div>
            </div>
          </div>

          {/* Current Roadmap Steps */}
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/60 p-8 rounded-2xl border border-blue-700/50 shadow-xl backdrop-blur-md">
            <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3">
              <MapPin className="text-blue-400" />
              Your Learning Path
            </h2>

            <div className="space-y-4">
              {roadmapSteps.slice(0, 4).map((step, index) => (
                <div
                  key={step.id}
                  className={`p-6 rounded-xl border transition-all duration-300 ${
                    step.completed
                      ? "bg-green-900/20 border-green-700/50"
                      : step.current
                      ? "bg-blue-900/30 border-blue-700/50 shadow-lg shadow-blue-600/10"
                      : "bg-gray-700/30 border-gray-600/50"
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      {step.completed ? (
                        <CheckCircle className="text-green-400" size={28} />
                      ) : step.current ? (
                        <div className="w-7 h-7 bg-blue-500 rounded-full animate-pulse flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      ) : (
                        <Clock className="text-gray-500" size={24} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">
                        {step.title}
                      </h3>
                      <p className="text-gray-400">{step.duration}</p>
                    </div>
                    {currentIndex == index && (
                      <button
                        onClick={() => window.open(step.link || "#", "_blank")}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                      >
                        Continue Learning
                        <ArrowRight size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => {
                  navigate("/generate-roadmap");
                }}
                className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                View Complete Roadmap
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <h3 className="text-xl font-semibold mb-2">Daily Challenge</h3>
              <p className="text-blue-100 mb-4">
                Complete today's quiz challenge to maintain your streak!
              </p>
              <button
                onClick={() => {
                  navigate("/my-learning/daiy-quiz")
                }}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Start Challenge
              </button>
            </div>

            <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <h3 className="text-xl font-semibold mb-2">AI Mentor Chat</h3>
              <p className="text-blue-100 mb-4">
                Get personalized guidance from your AI career mentor
              </p>
              <button
                onClick={() => {
                  toast.info("This feature will be available soon");
                }}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Chat Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyLearningPage;
