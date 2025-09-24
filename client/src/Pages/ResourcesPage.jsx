import React, { useEffect, useRef, useState } from "react";
import {
  Play,
  File,
  GraduationCap,
  HelpCircle,
  Clock,
  Star,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Users,
  BookOpen,
  Loader2,
} from "lucide-react";
import Sidebar from "../Components/Sidebar";
import { useUser } from "@clerk/clerk-react";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const ResourcesPage = () => {
  const { user } = useUser();
  const role = Cookies.get("goal") || "";
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [savedResources, setSavedResources] = useState(new Set());
  const [completedResources, setCompletedResources] = useState(
    new Set([1, 3, 7])
  );
  const [allResources, setallResources] = useState([]);
  const [visibleResources, setVisibleResources] = useState(12);
  const [totalSteps, settotalSteps] = useState(0);
  const [completedSteps, setcompletedSteps] = useState(0);
  const [isLoadingResources, setIsLoadingResources] = useState(true);
  const [isLoadingSteps, setIsLoadingSteps] = useState(true);
  const fetchedRef = useRef(false);
useEffect(() => {
  if (fetchedRef.current) return;
  fetchedRef.current = true;
    setIsLoadingResources(true);
    axios
      .post("http://localhost:4000/api/home/fetch-resources", {
        goal: role,
        userId:user.id
      })
      .then((res) => {
        console.log(res.data.response);
        setallResources(res.data.response);
      })
      .catch((err) => {
        console.log(err.message);
        toast.error("Error while fetching data");
      })
      .finally(() => {
        setIsLoadingResources(false);
      });
  }, [user, location.pathname]);

  useEffect(() => {
    setIsLoadingSteps(true);
    axios
      .post("http://localhost:4000/api/home/fetch-steps", {
        userId: user.id,
      })
      .then((res) => {
        settotalSteps(res.data.Total);
        setcompletedSteps(res.data.current);
      })
      .catch((err) => {
        toast.error("Error while fetching data");
      })
      .finally(() => {
        setIsLoadingSteps(false);
      });
  }, [user, location.pathname]);

  const getTypeIcon = (type) => {
    switch (type) {
      case "video":
        return {
          icon: Play,
          label: "📺 Video",
          color: "text-red-400 bg-red-400/20",
        };
      case "article":
        return {
          icon: File,
          label: "📄 Article",
          color: "text-green-400 bg-green-400/20",
        };
      case "course":
        return {
          icon: GraduationCap,
          label: "🎓 Course",
          color: "text-blue-400 bg-blue-400/20",
        };
      case "quiz":
        return {
          icon: HelpCircle,
          label: "❓ Quiz",
          color: "text-purple-400 bg-purple-400/20",
        };
      default:
        return {
          icon: BookOpen,
          label: "Resource",
          color: "text-gray-400 bg-gray-400/20",
        };
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-600/20 text-green-400 border-green-500/30";
      case "intermediate":
        return "bg-yellow-600/20 text-yellow-400 border-yellow-500/30";
      case "advanced":
        return "bg-red-600/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-600/20 text-gray-400 border-gray-500/30";
    }
  };

  const filteredAndSortedResources = allResources
    .filter((resource) => {
      if (
        selectedDifficulty !== "all" &&
        resource.difficulty !== selectedDifficulty
      )
        return false;
      if (selectedType !== "all" && resource.type !== selectedType)
        return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "duration":
          return a.duration.localeCompare(b.duration);
        case "popularity":
        default:
          return b.students - a.students;
      }
    });

  const visibleResourcesList = filteredAndSortedResources.slice(
    0,
    visibleResources
  );

  const toggleSaveResource = (resourceId) => {
    const newSaved = new Set(savedResources);
    if (newSaved.has(resourceId)) {
      newSaved.delete(resourceId);
    } else {
      newSaved.add(resourceId);
    }
    setSavedResources(newSaved);
  };

  const loadMoreResources = () => {
    setVisibleResources((prev) =>
      Math.min(prev + 8, filteredAndSortedResources.length)
    );
  };

  // Loading Components
  const SuggestedResourceSkeleton = () => (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 animate-pulse">
      <div className="w-12 h-12 bg-gray-700 rounded-xl mb-4"></div>
      <div className="h-5 bg-gray-700 rounded mb-2 w-3/4"></div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-700 rounded w-full"></div>
        <div className="h-3 bg-gray-700 rounded w-2/3"></div>
      </div>
      <div className="flex items-center justify-between">
        <div className="h-3 bg-gray-700 rounded w-16"></div>
        <div className="h-8 bg-gray-700 rounded w-16"></div>
      </div>
    </div>
  );

  const ResourceCardSkeleton = () => (
    <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/60 rounded-2xl border border-blue-700/50 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
          <div className="h-4 bg-gray-700 rounded w-20"></div>
        </div>
        <div className="h-6 bg-gray-700 rounded w-20"></div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="h-6 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="h-3 bg-gray-700 rounded w-12"></div>
        <div className="h-3 bg-gray-700 rounded w-8"></div>
        <div className="h-3 bg-gray-700 rounded w-16"></div>
      </div>
      
      <div className="flex gap-2 mb-6">
        <div className="h-6 bg-gray-700 rounded-full w-16"></div>
        <div className="h-6 bg-gray-700 rounded-full w-20"></div>
        <div className="h-6 bg-gray-700 rounded-full w-12"></div>
      </div>
      
      <div className="h-12 bg-gray-700 rounded-xl"></div>
    </div>
  );

 

  const ResourceCard = ({ resource }) => {
    const typeInfo = getTypeIcon(resource.type);
    const TypeIcon = typeInfo.icon;
    const isCompleted = completedResources.has(resource.id);
    const isSaved = savedResources.has(resource.id);

    return (
      <div
        className={`group relative bg-gradient-to-br from-blue-900/40 to-blue-800/60 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
          isCompleted
            ? "border-green-500/50 shadow-green-500/10"
            : "border-blue-700/50 hover:border-blue-500/50"
        } flex flex-col h-full`}
      >
        <button
          onClick={() => toggleSaveResource(resource.id)}
          className="absolute top-4 right-4 z-10 p-2 bg-gray-800/80 rounded-full hover:bg-gray-700/80 transition-colors"
        >
          {isSaved ? (
            <BookmarkCheck className="text-blue-400" size={20} />
          ) : (
            <Bookmark className="text-gray-400 hover:text-white" size={20} />
          )}
        </button>

        <div className="p-6 space-y-4 flex-1 flex flex-col">
          {/* Type and Difficulty */}
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full ${typeInfo.color}`}
            >
              <TypeIcon size={16} />
              <span className="text-sm font-medium">{typeInfo.label}</span>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                resource.difficulty
              )}`}
            >
              {resource.difficulty}
            </span>
          </div>

          {/* Title and Description */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
              {resource.title}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-2">
              {resource.description}
            </p>
          </div>

          {/* Meta Information */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {resource.duration}
            </span>
            <span className="flex items-center gap-1">
              <Star className="text-yellow-400" size={12} />
              {resource.rating}
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} />
              {resource.students.toLocaleString()}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {resource.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {resource.isPaid && (
              <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">
                Paid
              </span>
            )}
          </div>
          <div className="flex-1" />
          <button
            onClick={() => window.open(resource.link, "_blank")}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 mt-4
            ${
              isCompleted
                ? "bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-600/20"
            }`}
          >
            {isCompleted ? "Review Resource" : "Start Learning"}
          </button>
        </div>
      </div>
    );
  };

  const FilterButton = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
        active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
          : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
      }`}
    >
      {children}
    </button>
  );

  // Suggested resources (first 3 that aren't completed)
  const suggestedResources = allResources
    .filter((resource) => !completedResources.has(resource.id))
    .slice(0, 3);

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
          <div className="bg-white/5 border border-blue-400/10 shadow-xl rounded-2xl px-10 py-10 max-w-3xl w-full text-center backdrop-blur-2xl">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 text-white flex flex-wrap items-center justify-center gap-3 break-words whitespace-normal">
              Resources for your{" "}
              <span className="text-blue-400">{role ? role : "Learner"}</span>{" "}
              roadmap <span>🚀</span>
            </h1>
            
            {isLoadingSteps ? (
              <div className="space-y-4">
                <div className="h-6 bg-gray-700 rounded w-2/3 mx-auto animate-pulse"></div>
                <div className="bg-gray-700 rounded-full h-2 animate-pulse"></div>
              </div>
            ) : (
              <>
                <p className="text-blue-200 text-lg font-medium">
                  {totalSteps > 0
                    ? `You've completed ${completedSteps} out of ${totalSteps} roadmap steps`
                    : "Start your journey with nexusPro"}
                </p>
                {/* Progress Bar */}
                <div className="bg-gray-700 rounded-full h-2 mt-6">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-700"
                    style={{
                      width: `${totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {/* AI Recommendations Section */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 p-8 rounded-2xl border border-purple-500/20">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="text-purple-400" size={28} />
                <h2 className="text-2xl font-semibold">Suggested for You</h2>
              </div>

              {isLoadingResources ? (
                <div className="grid md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <SuggestedResourceSkeleton key={i} />
                  ))}
                </div>
              ) : suggestedResources.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-6">
                  {suggestedResources.map((resource) => {
                    const typeInfo = getTypeIcon(resource.type);
                    const TypeIcon = typeInfo.icon;

                    return (
                      <div
                        key={resource.id}
                        className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-colors"
                      >
                        <div
                          className={`w-12 h-12 ${typeInfo.color} rounded-xl flex items-center justify-center mb-4`}
                        >
                          <TypeIcon size={24} />
                        </div>
                        <h3 className="font-semibold mb-2 text-white">
                          {resource.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {resource.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={12} />
                            {resource.duration}
                          </span>
                          <button
                            onClick={() => window.open(resource.link, "_blank")}
                            className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                          >
                            Start
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No suggested resources available at the moment.</p>
                </div>
              )}
            </div>
          </div>

          {/* Filters and Sorting */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Filters */}
              <div className="flex flex-wrap gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Difficulty
                  </label>
                  <div className="flex gap-2">
                    <FilterButton
                      active={selectedDifficulty === "all"}
                      onClick={() => setSelectedDifficulty("all")}
                    >
                      All
                    </FilterButton>
                    <FilterButton
                      active={selectedDifficulty === "beginner"}
                      onClick={() => setSelectedDifficulty("beginner")}
                    >
                      Beginner
                    </FilterButton>
                    <FilterButton
                      active={selectedDifficulty === "intermediate"}
                      onClick={() => setSelectedDifficulty("intermediate")}
                    >
                      Intermediate
                    </FilterButton>
                    <FilterButton
                      active={selectedDifficulty === "advanced"}
                      onClick={() => setSelectedDifficulty("advanced")}
                    >
                      Advanced
                    </FilterButton>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Type
                  </label>
                  <div className="flex gap-2">
                    <FilterButton
                      active={selectedType === "all"}
                      onClick={() => setSelectedType("all")}
                    >
                      All
                    </FilterButton>
                    <FilterButton
                      active={selectedType === "video"}
                      onClick={() => setSelectedType("video")}
                    >
                      Videos
                    </FilterButton>
                    <FilterButton
                      active={selectedType === "course"}
                      onClick={() => setSelectedType("course")}
                    >
                      Courses
                    </FilterButton>
                    <FilterButton
                      active={selectedType === "article"}
                      onClick={() => setSelectedType("article")}
                    >
                      Articles
                    </FilterButton>
                    <FilterButton
                      active={selectedType === "quiz"}
                      onClick={() => setSelectedType("quiz")}
                    >
                      Quizzes
                    </FilterButton>
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="popularity">Popularity</option>
                  <option value="rating">Rating</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
            </div>
          </div>

          {/* Resources Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                All Resources ({isLoadingResources ? "..." : filteredAndSortedResources.length})
              </h2>
            </div>
            {isLoadingResources ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                  <ResourceCardSkeleton key={i} />
                ))}
              </div>
            ) : visibleResourcesList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {visibleResourcesList.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen size={64} className="mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No Resources Found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your filters to see more resources.
                </p>
              </div>
            )}

            {/* Load More */}
            {!isLoadingResources && visibleResources < filteredAndSortedResources.length && (
              <div className="text-center pt-8">
                <button
                  onClick={loadMoreResources}
                  className="px-8 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
                >
                  Load More Resources
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;