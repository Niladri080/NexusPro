import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  Target,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const RoadmapPage = () => {
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

  // Load saved goal on mount
  useEffect(() => {
    if (!user) return; // wait for user to be available

    const goalExists = Cookies.get("hasGoal") === "true";
    const savedRole = Cookies.get("goal") || "";
    setHasGoal(goalExists);
    setRole(savedRole);

    if (goalExists && savedRole) {
      setIsGenerating(true);
      axios
        .post("http://localhost:4000/api/home/fetch-roadmap", {
          userId: user.id,
        })
        .then((res) => {
          setRoadmapData({ [savedRole]: res.data.roadmap });
          setSentRoad(res.data.roadmap);
          setSelectedGoal({ id: savedRole, title: savedRole });
          setShowRoadmap(true);
          setIsGenerating(false);
        })
        .catch((err) => {
          console.log(err.message);
          setIsGenerating(false);
        });
    }
  }, [location.pathname, user]);

  const careerGoals = [
    { id: "software-engineer", title: "Software Engineer", emoji: "💻", description: "Build software systems & applications", color: "from-blue-500 to-blue-600" },
    { id: "full-stack-developer", title: "Full Stack Developer", emoji: "🌐", description: "Work on frontend & backend web development", color: "from-green-500 to-green-600" },
    { id: "data-scientist", title: "Data Scientist", emoji: "📊", description: "Analyze data and build predictive models", color: "from-purple-500 to-purple-600" },
    { id: "ai-ml-engineer", title: "AI/ML Engineer", emoji: "🤖", description: "Build AI & machine learning solutions", color: "from-red-500 to-red-600" },
    { id: "product-manager", title: "Product Manager", emoji: "📋", description: "Manage product lifecycle & strategy", color: "from-yellow-500 to-yellow-600" },
    { id: "ui-ux-designer", title: "UI/UX Designer", emoji: "🎨", description: "Design user interfaces & experiences", color: "from-pink-500 to-pink-600" },
    { id: "cybersecurity-analyst", title: "Cybersecurity Analyst", emoji: "🔒", description: "Protect systems & networks", color: "from-indigo-500 to-indigo-600" },
    { id: "cloud-engineer", title: "Cloud Engineer", emoji: "☁️", description: "Work with cloud infrastructure & services", color: "from-cyan-500 to-cyan-600" },
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
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">{goal.title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{goal.description}</p>
      {isSelected && (
        <div className="absolute top-3 right-3">
          <CheckCircle className="text-blue-400" size={24} />
        </div>
      )}
    </div>
  );

  const RoadmapStep = ({ step, index, isLast }) => (
    <div className="flex gap-6 group">
      <div className="flex flex-col items-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg bg-gray-600`}>
          {step.completed ? <CheckCircle size={20} /> : step.id}
        </div>
        {!isLast && (
          <div className={`w-0.5 h-16 mt-2 ${step.completed ? "bg-green-400" : "bg-gray-600"}`}></div>
        )}
      </div>
      <div className="flex-1 pb-8">
        <div className={`p-6 rounded-xl border transition-all duration-300 group-hover:shadow-lg ${step.completed ? "bg-green-900/20 border-green-700/50" : "bg-gray-700/30 border-gray-600/50"}`}>
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-white">{step.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock size={16} />
              {step.duration}
            </div>
          </div>
          <p className="text-gray-300 mb-4">{step.description}</p>
        </div>
      </div>
    </div>
  );

  const handleStartJourney = () => {
    const roleName = selectedGoal.title;
    const roadmap = sentRoad;
    axios
      .post("http://localhost:4000/api/home/save-roadmap", {
        role: roleName,
        roadmap,
        user,
      })
      .then(() => {
        Cookies.set("hasGoal", "true");
        Cookies.set("goal", roleName);
        setHasGoal(true);
      })
      .catch((err) => console.log(err.message));
  };

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
    setCustomGoal("");
    setShowRoadmap(false);
    setIsGenerating(true);
    const input = goal.title + " " + goal.description;

    axios
      .post("http://localhost:4000/api/home/roadmap", { description: input })
      .then((res) => {
        const jsonString = res.data.message.replace(/```json\n|```/g, "").trim();
        const parsedRoadmap = JSON.parse(jsonString);
        setSentRoad(parsedRoadmap.roadmap);
        setRoadmapData((prev) => ({ ...prev, [goal.id]: parsedRoadmap.roadmap }));
        setIsGenerating(false);
        setShowRoadmap(true);
      })
      .catch((err) => setIsGenerating(false));
  };

  const handleCustomGoalSubmit = () => {
    if (!customGoal.trim()) return;

    const customGoalObj = { id: "custom", title: customGoal, description: "Custom career path" };
    setSelectedGoal(customGoalObj);
    setShowRoadmap(false);
    setIsGenerating(true);

    axios
      .post("http://localhost:4000/api/home/roadmap", { description: customGoal })
      .then((res) => {
        const jsonString = res.data.message.replace(/```json\n|```/g, "").trim();
        const parsedRoadmap = JSON.parse(jsonString);
        setSentRoad(parsedRoadmap.roadmap);
        setRoadmapData((prev) => ({ ...prev, [customGoalObj.id]: parsedRoadmap.roadmap }));
        setIsGenerating(false);
        setShowRoadmap(true);
      })
      .catch((err) => setIsGenerating(false));
  };

  const currentRoadmap = selectedGoal && roadmapData[selectedGoal.id] ? roadmapData[selectedGoal.id] : [];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans overflow-hidden relative">
      <div className="absolute inset-0 bg-cover bg-fixed opacity-10" style={{ backgroundImage: 'url("/images/space.png")', backgroundPosition: "center top" }}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-blue-900/10"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0"></div>
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
              <span className="text-blue-400">{!hasGoal && "Let's build your roadmap"}{hasGoal && role ? role : ""}</span>{" "}
              {!hasGoal && <span>🚀</span>}
            </h1>
            {!hasGoal && <p className="text-blue-200 text-lg font-medium">Choose from popular paths or write your own.</p>}
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
                  <CareerGoalCard key={goal.id} goal={goal} isSelected={selectedGoal?.id === goal.id} onClick={() => handleGoalSelect(goal)} />
                ))}
              </div>
            </div>
          )}

          {/* Custom goal */}
          {!hasGoal && (
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
          )}

          {/* Loading */}
          {isGenerating && (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600/20 rounded-full border border-blue-500/30">
                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg font-semibold">Generating your personalized roadmap...</span>
              </div>
            </div>
          )}

          {/* Display roadmap */}
          {showRoadmap && selectedGoal && (
            <div className="space-y-8 animate-fade-in">
              {!hasGoal && <div className="text-center">
                <div className="inline-flex items-center gap-3 bg-green-600/20 px-6 py-3 rounded-full border border-green-500/30 mb-6">
                  <CheckCircle className="text-green-400" size={24} />
                  <span className="text-lg font-semibold">Your roadmap is ready!</span>
                </div>
                <h2 className="text-3xl font-bold mb-4">Roadmap to become a {selectedGoal.title}</h2>
                <p className="text-gray-400 text-lg">Follow these steps to achieve your career goal. Each step builds on the previous one.</p>
              </div>}
              <div className="max-w-4xl mx-auto bg-white/5 border border-blue-400/10 p-8 rounded-2xl shadow-xl backdrop-blur-2xl">
                <div className="space-y-2">
                  {currentRoadmap.map((step, index) => (
                    <RoadmapStep key={step.id} step={step} index={index} isLast={index === currentRoadmap.length - 1} />
                  ))}
                </div>
                <div className="text-center mt-8 pt-8 border-t border-gray-700">
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
