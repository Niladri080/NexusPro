import React, { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Calendar,
  TrendingUp,
  Award,
  Zap,
  Loader2,
} from "lucide-react";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useUser } from "@clerk/clerk-react";

const ResumePage = () => {
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasResume, setHasResume] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [resumeData, setresumeData] = useState({});
  const [suggestion, setsuggestion] = useState("");
  const [isLoading, setisLoading] = useState(true);

  // Fetch resume if already available
  useEffect(() => {
    setisLoading(true);
    if (!user) return;
    axios
      .post("http://localhost:4000/api/home/fetch-resume", { userId: user.id })
      .then((res) => {
        if (res.data && res.data.analysis) {
          setresumeData(res.data);
          setsuggestion(res.data.suggestion || "");
          setHasResume(true);
        }
        setisLoading(false);
      })
      .catch(() => {
        setisLoading(false);
        setHasResume(false);
      });
  }, [user]);

  const CircularProgress = ({ progress, size = 120, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const getColor = (score) => {
      if (score >= 80) return "rgb(34, 197, 94)"; // green
      if (score >= 60) return "rgb(234, 179, 8)"; // yellow
      return "rgb(239, 68, 68)"; // red
    };

    return (
      <div className="relative flex flex-col items-center justify-center">
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 block mx-auto"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgb(55, 65, 81)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getColor(progress)}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{progress}</span>
          <span className="text-sm text-gray-400">ATS Score</span>
        </div>
      </div>
    );
  };

  const ScoreCard = ({ title, score, icon: Icon, color }) => (
    <div className="bg-white/5 border border-blue-400/10 p-6 rounded-xl shadow-lg backdrop-blur-xl flex flex-col items-center">
      <div className="flex items-center gap-3 mb-4">
        <Icon className={color} size={24} />
        <h3 className="font-semibold text-gray-200">{title}</h3>
      </div>
      <div className="text-2xl font-bold text-white">{score}%</div>
      <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
        <div
          className={`h-2 rounded-full transition-all duration-700 ${
            score >= 80
              ? "bg-green-500"
              : score >= 60
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );

  const FeedbackSection = ({ title, items, type }) => {
    const getIcon = () => {
      switch (type) {
        case "strength":
          return <CheckCircle className="text-green-400" size={20} />;
        case "improvement":
          return <AlertCircle className="text-yellow-400" size={20} />;
        case "critical":
          return <XCircle className="text-red-400" size={20} />;
        default:
          return null;
      }
    };

    const getBorderColor = () => {
      switch (type) {
        case "strength":
          return "border-green-700/50 bg-green-900/10";
        case "improvement":
          return "border-yellow-700/50 bg-yellow-900/10";
        case "critical":
          return "border-red-700/50 bg-red-900/10";
        default:
          return "border-gray-700/50";
      }
    };

    return (
      <div className={`p-6 rounded-xl border ${getBorderColor()}`}>
        <div className="flex items-center gap-3 mb-4">
          {getIcon()}
          <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
        </div>
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="text-gray-300 flex items-start gap-2">
              <span className="text-gray-500 mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Loading Components
  const LoadingSpinner = ({ size = 32, className = "" }) => (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className="animate-spin text-blue-400" size={size} />
    </div>
  );

  const ScoreCardSkeleton = () => (
    <div className="bg-white/5 border border-blue-400/10 p-6 rounded-xl shadow-lg backdrop-blur-xl flex flex-col items-center animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-6 h-6 bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-700 rounded w-24"></div>
      </div>
      <div className="w-12 h-8 bg-gray-700 rounded mb-2"></div>
      <div className="w-full bg-gray-700 rounded-full h-2"></div>
    </div>
  );

  const FeedbackSectionSkeleton = ({ type }) => {
    const getBorderColor = () => {
      switch (type) {
        case "strength":
          return "border-green-700/50 bg-green-900/10";
        case "improvement":
          return "border-yellow-700/50 bg-yellow-900/10";
        case "critical":
          return "border-red-700/50 bg-red-900/10";
        default:
          return "border-gray-700/50";
      }
    };

    return (
      <div className={`p-6 rounded-xl border ${getBorderColor()} animate-pulse`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-5 h-5 bg-gray-700 rounded-full"></div>
          <div className="h-5 bg-gray-700 rounded w-32"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-gray-500 mt-1">•</span>
              <div className="h-4 bg-gray-700 rounded flex-1"></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const CircularProgressSkeleton = () => (
    <div className="bg-white/5 border border-blue-400/10 p-8 rounded-2xl shadow-xl backdrop-blur-2xl flex flex-col items-center justify-center animate-pulse">
      <div className="h-6 bg-gray-700 rounded w-40 mb-6"></div>
      <div className="w-32 h-32 bg-gray-700 rounded-full mb-4"></div>
      <div className="h-4 bg-gray-700 rounded w-24"></div>
    </div>
  );

  const ResumeInfoSkeleton = () => (
    <div className="bg-white/5 border border-blue-400/10 p-8 rounded-2xl shadow-xl backdrop-blur-2xl animate-pulse">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-700 rounded w-48"></div>
            <div className="flex items-center gap-4">
              <div className="h-4 bg-gray-700 rounded w-32"></div>
              <div className="h-4 bg-gray-700 rounded w-16"></div>
            </div>
          </div>
        </div>
        <div className="w-40 h-10 bg-gray-700 rounded-lg"></div>
      </div>
    </div>
  );

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setIsUploading(true);
    if (!file) {
      return toast.error("File not selected. Try again later");
    }
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("userId", user.id);
    const role = Cookies.get("goal");
    if (role) {
      formData.append("Role", role);
    } else {
      formData.append("Role", "None");
    }
    axios
      .post("http://localhost:4000/api/home/analyze-resume", formData)
      .then((res) => {
        const jsonString = res.data.response
          .replace(/```json\n|```/g, "")
          .trim();
        const parsedSuggestions = JSON.parse(jsonString);
        console.log(parsedSuggestions);
        setresumeData(parsedSuggestions);
        setIsUploading(false);
        setsuggestion(parsedSuggestions.suggestion);
        setHasResume(true);
      })
      .catch((err) => {
        setIsUploading(false);
        toast.error("Error Occured while parsing file. Try again later");
      });
  };

  const handleResubmit = () => {
    setHasResume(false);
    axios
      .post("http://localhost:4000/api/home/resubmit-resume", {
        userId: user.id,
      })
      .then((res) => {
        toast.success("Resume records deleted successfully");
      })
      .catch((err) => {
        toast.error("Something unexpected happened. Try again later");
      });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans overflow-hidden relative">
      <div
        className="absolute inset-0 bg-cover bg-fixed opacity-10"
        style={{
          backgroundImage: 'url("/images/space.png")',
          backgroundPosition: "center top",
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-blue-900/10"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0"></div>

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="lg:ml-72 relative z-10">
        {/* Header - Always visible */}
        <header className="relative flex items-center justify-center py-16 px-4 mb-8">
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute w-[350px] h-[350px] border-2 border-blue-500/20 rounded-full animate-spin-slow"></div>
            <div className="absolute w-[200px] h-[200px] bg-blue-900/40 rounded-full shadow-2xl shadow-blue-500/50 animate-glow"></div>
          </div>
          <div className="bg-white/5 border border-blue-400/10 shadow-xl rounded-2xl px-10 py-10 max-w-2xl w-full text-center backdrop-blur-2xl">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 text-white flex items-center justify-center gap-3">
              Resume Analysis <span>📄</span>
            </h1>
            <p className="text-blue-200 text-lg font-medium">
              Optimize your resume for ATS and recruiters
            </p>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {isLoading ? (
            /* Loading State for Content */
            <div className="max-w-6xl mx-auto space-y-8">
              <LoadingSpinner size={48} className="py-16" />
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-300 mb-2">
                  Loading your resume data...
                </h2>
                <p className="text-gray-500">
                  Please wait while we fetch your information
                </p>
              </div>
            </div>
          ) : !hasResume ? (
            /* Upload State */
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="text-blue-400" size={40} />
                </div>
                <h2 className="text-2xl font-bold mb-4">
                  Upload Your Resume
                </h2>
                <p className="text-gray-400 text-lg">
                  Get instant ATS score and personalized feedback to improve
                  your resume
                </p>
              </div>

              <div className="bg-white/5 border border-blue-400/10 p-12 rounded-2xl shadow-xl mb-8 backdrop-blur-2xl">
                <div className="border-2 border-dashed border-blue-400/20 rounded-xl p-12 text-center hover:border-blue-500 transition-colors duration-300">
                  {isUploading ? (
                    <div className="space-y-4">
                      <LoadingSpinner size={48} />
                      <p className="text-xl font-semibold">
                        Analyzing your resume...
                      </p>
                      <p className="text-gray-400">
                        This may take a few seconds
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <Upload className="text-gray-400 mx-auto" size={48} />
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          Drop your resume here
                        </h3>
                        <p className="text-gray-400 mb-4">
                          or click to browse files
                        </p>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="resume-upload"
                        />
                        <label
                          htmlFor="resume-upload"
                          className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium"
                        >
                          <Upload size={20} />
                          Choose File
                        </label>
                      </div>
                      <p className="text-sm text-gray-500">
                        Supports PDF, DOC, DOCX (Max 5MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-600/10 to-blue-700/10 p-6 rounded-xl border border-blue-700/30">
                  <Zap className="text-blue-400 mb-4" size={32} />
                  <h3 className="text-lg font-semibold mb-2">
                    Instant Analysis
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Get your ATS score and feedback within seconds of
                    uploading
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-600/10 to-green-700/10 p-6 rounded-xl border border-green-700/30">
                  <TrendingUp className="text-green-400 mb-4" size={32} />
                  <h3 className="text-lg font-semibold mb-2">
                    Detailed Feedback
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Receive specific suggestions to improve your resume's
                    performance
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-600/10 to-purple-700/10 p-6 rounded-xl border border-purple-700/30">
                  <Award className="text-purple-400 mb-4" size={32} />
                  <h3 className="text-lg font-semibold mb-2">
                    ATS Optimization
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Ensure your resume passes through Applicant Tracking
                    Systems
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Analysis Results State */
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Resume Info & Actions */}
              <div className="bg-white/5 border border-blue-400/10 p-8 rounded-2xl shadow-xl backdrop-blur-2xl">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <FileText className="text-blue-400" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold mb-1">
                        {resumeData.fileName}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={16} />
                          Uploaded {resumeData.uploadDate}
                        </span>
                        <span>{resumeData.fileSize}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleResubmit}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <RefreshCw size={16} />
                      Resubmit Resume
                    </button>
                  </div>
                </div>
              </div>

              {/* ATS Score & Breakdown */}
              <div className="grid lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                  <div className="bg-white/5 border border-blue-400/10 p-8 rounded-2xl shadow-xl backdrop-blur-2xl flex flex-col items-center justify-center">
                    <h3 className="text-xl font-semibold mb-6 text-gray-200 text-center">
                      Overall ATS Score
                    </h3>
                    <CircularProgress progress={resumeData.atsScore} />
                    <p className="text-gray-400 mt-4 text-center">
                      {resumeData.atsScore >= 80
                        ? "Excellent!"
                        : resumeData.atsScore >= 60
                        ? "Good"
                        : "Needs Improvement"}
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-3 grid md:grid-cols-3 gap-6">
                  <ScoreCard
                    title="Keyword Match"
                    score={resumeData.keywordMatch}
                    icon={Zap}
                    color="text-blue-400"
                  />
                  <ScoreCard
                    title="Format Score"
                    score={resumeData.formatScore}
                    icon={FileText}
                    color="text-green-400"
                  />
                  <ScoreCard
                    title="Content Score"
                    score={resumeData.contentScore}
                    icon={TrendingUp}
                    color="text-purple-400"
                  />
                </div>
              </div>

              {/* Detailed Feedback */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">
                  Detailed Analysis & Feedback
                </h2>

                <div className="grid lg:grid-cols-3 gap-6">
                  <FeedbackSection
                    title="Strengths"
                    items={resumeData.analysis.strengths}
                    type="strength"
                  />
                  <FeedbackSection
                    title="Areas for Improvement"
                    items={resumeData.analysis.improvements}
                    type="improvement"
                  />
                  <FeedbackSection
                    title="Critical Issues"
                    items={resumeData.analysis.critical}
                    type="critical"
                  />
                </div>
              </div>

              {/* AI Suggestions */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 rounded-2xl text-white">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      AI-Powered Suggestions
                    </h3>
                    <p className="text-blue-100 mb-4">{suggestion}</p>
                    <button onClick={() => {
                      toast.info("This feature will be available soon")
                    }} className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                      Get More AI Insights
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePage;