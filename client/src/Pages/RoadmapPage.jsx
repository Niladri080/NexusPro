import React, { useState, useEffect, useRef } from "react";
import { CheckCircle, Clock, Target, Sparkles, ArrowRight, Menu } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
const API_URL = import.meta.env.VITE_API_URL;
const RoadmapPage = () => {
  const roadmapSectionRef = useRef(null);
  const loadingRef = useRef(null);
  const startJourneyRef = useRef(null);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }, 150);
  };

  const scrollToRoadmapSection = () => {
    setTimeout(() => {
      if (roadmapSectionRef.current) {
        roadmapSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 200);
  };

  const scrollToLoadingSection = () => {
    setTimeout(() => {
      if (loadingRef.current) {
        loadingRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };

  const scrollToStartJourney = () => {
    setTimeout(() => {
      if (startJourneyRef.current) {
        startJourneyRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 300);
  };

  const { user } = useUser();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [customGoal, setCustomGoal] = useState("");
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmapData, setRoadmapData] = useState({});
  const [sentRoad, setSentRoad] = useState([]);
  const [hasGoal, setHasGoal] = useState(false);
  const [role, setRole] = useState("");
  const [load, setLoad] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [shouldScrollToRoadmap, setShouldScrollToRoadmap] = useState(false);
  const [shouldScrollToStartJourney, setShouldScrollToStartJourney] = useState(false);

  // Handle scrolling when roadmap becomes visible
  useEffect(() => {
    if (shouldScrollToRoadmap && showRoadmap && !isGenerating) {
      scrollToRoadmapSection();
      setShouldScrollToRoadmap(false);
    }
  }, [shouldScrollToRoadmap, showRoadmap, isGenerating]);

  // Handle scrolling to Start Journey button for new roadmaps
  useEffect(() => {
    if (shouldScrollToStartJourney && showRoadmap && !isGenerating && !hasGoal) {
      scrollToStartJourney();
      setShouldScrollToStartJourney(false);
    }
  }, [shouldScrollToStartJourney, showRoadmap, isGenerating, hasGoal]);

  // Handle scrolling when loading starts
  useEffect(() => {
    if (isGenerating) {
      scrollToLoadingSection();
    }
  }, [isGenerating]);

  // On mount / when location or user changes, fetch existing roadmap if cookie present
  useEffect(() => {
    if (!user) {
      setIsGenerating(false);
      setShowRoadmap(false);
      return;
    }
    const goalExists = Cookies.get("hasGoal") === "true";
    const savedRole = Cookies.get("goal") || "";
    setHasGoal(goalExists);
    setRole(savedRole);
    if (goalExists && savedRole) {
      setIsGenerating(true);
      axios
        .post(`${API_URL}/api/home/fetch-roadmap`, {
          userId: user.id,
        })
        .then((res) => {
          setRoadmapData({ [savedRole]: res.data.roadmap });
          setSentRoad(res.data.roadmap);
          setSelectedGoal({ id: savedRole, title: savedRole });

          // Set completed steps from backend
          const completed = {};
          let currentIdx = 0;
          for (let i = 0; i < res.data.roadmap.length; i++) {
            if (res.data.roadmap[i].completed) {
              completed[res.data.roadmap[i].id] = true;
              currentIdx = i + 1;
            }
          }
          setCompletedSteps(completed);
          setCurrentStepIndex(res.data.currentIndex || currentIdx || 0);

          setIsGenerating(false);
          setShowRoadmap(true);
          setShouldScrollToRoadmap(true);
        })
        .catch((err) => {
          Cookies.remove("hasGoal");
          Cookies.remove("goal");
          setIsGenerating(false);
          setShowRoadmap(false);
          setSelectedGoal(null);
          setRoadmapData({});
          setSentRoad([]);
          setCompletedSteps({});
          setCurrentStepIndex(0);
        });
    }
  }, [location.pathname, user, load]);

  const careerGoals = [
    {
      id: "software-engineer",
      title: "Software Engineer",
      emoji: "💻",
      description: "Build software systems & applications",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "full-stack-developer",
      title: "Full Stack Developer",
      emoji: "🌐",
      description: "Work on frontend & backend web development",
      color: "from-green-500 to-green-600",
    },
    {
      id: "data-scientist",
      title: "Data Scientist",
      emoji: "📊",
      description: "Analyze data and build predictive models",
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "ai-ml-engineer",
      title: "AI/ML Engineer",
      emoji: "🤖",
      description: "Build AI & machine learning solutions",
      color: "from-red-500 to-red-600",
    },
    {
      id: "product-manager",
      title: "Product Manager",
      emoji: "📋",
      description: "Manage product lifecycle & strategy",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      id: "ui-ux-designer",
      title: "UI/UX Designer",
      emoji: "🎨",
      description: "Design user interfaces & experiences",
      color: "from-pink-500 to-pink-600",
    },
    {
      id: "cybersecurity-analyst",
      title: "Cybersecurity Analyst",
      emoji: "🔒",
      description: "Protect systems & networks",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      id: "cloud-engineer",
      title: "Cloud Engineer",
      emoji: "☁️",
      description: "Work with cloud infrastructure & services",
      color: "from-cyan-500 to-cyan-600",
    },
  ];

  const CareerGoalCard = ({ goal, isSelected, onClick }) => (
    <div
      onClick={onClick}
      className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
        isSelected
          ? "border-blue-500 bg-blue-600/20 shadow-lg shadow-blue-600/20"
          : "border-gray-700 bg-white/5 hover:border-gray-600 backdrop-blur-xl"
      }`}
    >
      <div
        className={`w-16 h-16 rounded-xl bg-gradient-to-r ${goal.color} p-4 mb-4 shadow-lg flex items-center justify-center`}
      >
        <span className="text-3xl">{goal.emoji}</span>
      </div>
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
        {goal.title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed">{goal.description}</p>
      {isSelected && (
        <div className="absolute top-3 right-3">
          <CheckCircle className="text-blue-400" size={24} />
        </div>
      )}
    </div>
  );

  // currentRoadmap getter
  const currentRoadmap =
    selectedGoal && roadmapData[selectedGoal.id] ? roadmapData[selectedGoal.id] : [];

  // Mark step as completed
  const handleMarkCompleted = async (stepId, idx) => {
    try {
      await axios.post(`${API_URL}/api/home/mark-as-complete`, {
        userId: user.id,
        stepId,
      });
      setCompletedSteps((prev) => ({ ...prev, [stepId]: true }));
      toast.success("Step marked as completed!");
      if (idx + 1 < currentRoadmap.length) {
        setCurrentStepIndex(idx + 1);
      }
    } catch (err) {
      toast.error("Could not mark as completed. Please try again.");
    }
  };

  const RoadmapStep = ({ step, index, isLast }) => {
    const isCurrent = index === currentStepIndex;
    const isCompleted = !!completedSteps[step.id];

    return (
      <div className="flex gap-6 group">
        {/* Timeline */}
        <div className="flex flex-col items-center">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
              isCompleted ? "bg-green-500" : isCurrent ? "bg-blue-500" : "bg-gray-600"
            }`}
          >
            {isCompleted ? <CheckCircle size={20} /> : step.id}
          </div>
          {!isLast && (
            <div
              className={`w-0.5 h-16 mt-2 ${isCompleted ? "bg-green-400" : "bg-gray-600"}`}
            ></div>
          )}
        </div>
        {/* Content */}
        <div className="flex-1 pb-8">
          <div
            className={`p-6 rounded-xl border transition-all duration-300 group-hover:shadow-lg ${
              isCompleted
                ? "bg-green-900/20 border-green-700/50"
                : isCurrent
                ? "bg-blue-900/20 border-blue-700/50 shadow-lg shadow-blue-600/10"
                : "bg-gray-700/30 border-gray-600/50"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">{step.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock size={16} />
                {step.duration}
              </div>
            </div>
            <p className="text-gray-300 mb-4">{step.description}</p>

            {/* Action Buttons */}
            {hasGoal && isCurrent && !isCompleted && (
              <div className="flex items-center gap-4 mt-4">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => window.open(step.link || "#", "_blank")}
                >
                  Start Learning
                </button>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => handleMarkCompleted(step.id, index)}
                    className="accent-blue-600 w-5 h-5"
                  />
                  <span className="text-white font-medium">Mark as Completed</span>
                </label>
              </div>
            )}

            {isCompleted && (
              <button
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mt-4"
                onClick={() => window.open(step.link || "#", "_blank")}
              >
                Visit Resource
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const deleteJourney = () => {
    axios
      .post(`${API_URL}/api/home/delete-roadmap`, {
        userId: user.id,
      })
      .then((res) => {
        Cookies.remove("hasGoal");
        Cookies.remove("goal");
        setLoad((prev) => !prev);
        setShowRoadmap(false);
        setRoadmapData({});
        setSelectedGoal(null);
        setSentRoad([]);
        setCompletedSteps({});
        setCurrentStepIndex(0);
        scrollToTop();
        toast.success("Your path deleted successfully");
      })
      .catch((err) => {
        toast.error("Error occurred while changing path");
      });
  };

  const handleStartJourney = () => {
    const roleName = selectedGoal?.title;
    const roadmap = sentRoad;
    axios
      .post(`${API_URL}/api/home/save-roadmap`, {
        role: roleName,
        roadmap,
        user: user,
      })
      .then(() => {
        Cookies.set("hasGoal", "true", { expires: 3650 });
        Cookies.set("goal", roleName, { expires: 3650 });
        setRole(roleName);
        setHasGoal(true);
        setLoad((prev) => !prev);
        scrollToTop();
      })
      .catch((err) => console.log(err.message));
  };

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
    setCustomGoal("");
    setShowRoadmap(false);
    setIsGenerating(true);
    setCompletedSteps({});
    setCurrentStepIndex(0);
    const input = goal.title + " " + goal.description;

    axios
      .post(`${API_URL}/api/home/roadmap`, { description: input })
      .then((res) => {
        const jsonString = res.data.message.replace(/```json\n|```/g, "").trim();
        const parsedRoadmap = JSON.parse(jsonString);
        setSentRoad(parsedRoadmap.roadmap);
        setRoadmapData((prev) => ({
          ...prev,
          [goal.id]: parsedRoadmap.roadmap,
        }));
        setIsGenerating(false);
        setShowRoadmap(true);
        setShouldScrollToStartJourney(true);
      })
      .catch((err) => setIsGenerating(false));
  };

  const handleCustomGoalSubmit = () => {
    if (!customGoal.trim()) return;

    const customGoalObj = {
      id: "custom",
      title: customGoal,
      description: "Custom career path",
    };
    setSelectedGoal(customGoalObj);
    setShowRoadmap(false);
    setIsGenerating(true);
    setCompletedSteps({});
    setCurrentStepIndex(0);

    axios
      .post(`${API_URL}/api/home/roadmap`, {
        description: customGoal,
      })
      .then((res) => {
        const jsonString = res.data.message.replace(/```json\n|```/g, "").trim();
        const parsedRoadmap = JSON.parse(jsonString);
        setSentRoad(parsedRoadmap.roadmap);
        setRoadmapData((prev) => ({
          ...prev,
          [customGoalObj.id]: parsedRoadmap.roadmap,
        }));
        setIsGenerating(false);
        setShowRoadmap(true);
        setShouldScrollToStartJourney(true);
      })
      .catch((err) => setIsGenerating(false));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans relative">
      <div
        className="absolute inset-0 bg-cover bg-fixed opacity-10"
        style={{
          backgroundImage: 'url("/images/space.png")',
          backgroundPosition: "center top",
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-blue-900/10"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0"></div>
      <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden fixed top-4 left-4 z-30 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all duration-300"
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

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
              {!hasGoal && "What's your career goal?"}
              {hasGoal && "Welcome to your roadmap"}{" "}
              <span className="text-blue-400">
                {!hasGoal && "Let's build your roadmap"}
                {hasGoal && role ? role : ""}
              </span>{" "}
              {!hasGoal && <span>🚀</span>}
            </h1>
            {!hasGoal && (
              <p className="text-blue-200 text-lg font-medium">
                Choose from popular paths or write your own.
              </p>
            )}
          </div>
        </header>

        {/* Main content */}
        <div className="p-8 max-w-7xl mx-auto">
          {!hasGoal && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3">
                <Target className="text-blue-400" />
                Popular Career Paths
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {careerGoals.map((goal) => (
                  <CareerGoalCard
                    key={goal.id}
                    goal={goal}
                    isSelected={selectedGoal?.id === goal.id}
                    onClick={() => handleGoalSelect(goal)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Custom goal */}
          {!hasGoal && (
            <>
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-gray-700"></div>
                <span className="text-gray-400 bg-[#0a0a0c] px-4">
                  Can't find one? Describe your career goal here.
                </span>
                <div className="flex-1 h-px bg-gray-700"></div>
              </div>
              <div className="mb-12 max-w-2xl mx-auto">
                <div className="bg-white/5 border border-blue-400/10 p-8 rounded-2xl shadow-xl backdrop-blur-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="text-purple-400" size={24} />
                    <h3 className="text-xl font-semibold">Custom Career Goal</h3>
                  </div>
                  <div className="space-y-4">
                    <textarea
                      value={customGoal}
                      onChange={(e) => setCustomGoal(e.target.value)}
                      placeholder="Describe your career goal..."
                      className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24"
                    />
                    <button
                      onClick={handleCustomGoalSubmit}
                      disabled={!customGoal.trim()}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      <Sparkles size={20} />
                      Generate My Roadmap
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Loading */}
          {isGenerating && (
            <div ref={loadingRef} className="text-center py-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600/20 rounded-full border border-blue-500/30">
                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg font-semibold">
                  Generating your personalized roadmap...
                </span>
              </div>
            </div>
          )}

          {/* Display roadmap */}
          {showRoadmap && selectedGoal && (
            <div ref={roadmapSectionRef} className="space-y-8 animate-fade-in">
              <div className="text-center">
                {!hasGoal && (
                  <div className="inline-flex items-center gap-3 bg-green-600/20 px-6 py-3 rounded-full border border-green-500/30 mb-6">
                    <CheckCircle className="text-green-400" size={24} />
                    <span className="text-lg font-semibold">Your roadmap is ready!</span>
                  </div>
                )}
                <h2 className="text-3xl font-bold mb-4">Roadmap for {selectedGoal.title}</h2>
                <p className="text-gray-400 text-lg">
                  Follow these steps to achieve your career goal. Each step builds on the previous one.
                </p>
              </div>
              <div className="max-w-4xl mx-auto bg-white/5 border border-blue-400/10 p-8 rounded-2xl shadow-xl backdrop-blur-2xl">
                <div className="space-y-2">
                  {currentRoadmap.map((step, index) => (
                    <RoadmapStep key={step.id} step={step} index={index} isLast={index === currentRoadmap.length - 1} />
                  ))}
                </div>
                <div className="text-center mt-8 pt-8 border-t border-gray-700" ref={startJourneyRef}>
                  {!hasGoal && (
                    <button
                      onClick={handleStartJourney}
                      className="flex items-center gap-2 mx-auto px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                    >
                      Start Your Journey
                      <ArrowRight size={20} />
                    </button>
                  )}
                  {hasGoal && (
                    <button
                      onClick={deleteJourney}
                      className="flex items-center gap-2 mx-auto px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium cursor-pointer"
                    >
                      Choose Another Path
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default RoadmapPage;

