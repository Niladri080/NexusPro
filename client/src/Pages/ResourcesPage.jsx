import React, { useState } from "react";
import {
  Menu,
  X,
  Play,
  File,
  GraduationCap,
  HelpCircle,
  CheckCircle,
  Clock,
  Star,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  TrendingUp,
  Users,
  BookOpen,
} from "lucide-react";
import Sidebar from "../Components/Sidebar";

const ResourcesPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [savedResources, setSavedResources] = useState(new Set());
  const [completedResources, setCompletedResources] = useState(
    new Set([1, 3, 7])
  );
  const [visibleResources, setVisibleResources] = useState(12);

  // Sample user data
  const userData = {
    careerPath: "AI/ML Engineer",
    completedSteps: 3,
    totalSteps: 8,
  };

  // Sample resources data
  const allResources = [
    {
      id: 1,
      title: "Python for Machine Learning - Complete Course",
      type: "course",
      difficulty: "beginner",
      description:
        "Learn Python fundamentals with hands-on ML projects and real-world applications.",
      duration: "12 hours",
      rating: 4.8,
      students: 45000,
      tags: ["Python", "ML", "Free"],
      isPaid: false,
      thumbnail:
        "https://via.placeholder.com/400x200/3B82F6/ffffff?text=Python+ML",
    },
    {
      id: 2,
      title: "Understanding Neural Networks Architecture",
      type: "article",
      difficulty: "intermediate",
      description:
        "Deep dive into neural network architectures and their practical implementations.",
      duration: "15 min read",
      rating: 4.6,
      students: 12000,
      tags: ["Neural Networks", "Deep Learning", "Free"],
      isPaid: false,
    },
    {
      id: 3,
      title: "Machine Learning Interview Questions",
      type: "quiz",
      difficulty: "intermediate",
      description:
        "Practice common ML interview questions with detailed explanations and solutions.",
      duration: "30 questions",
      rating: 4.9,
      students: 8500,
      tags: ["Interview", "Practice", "Free"],
      isPaid: false,
    },
    {
      id: 4,
      title: "Advanced TensorFlow Techniques",
      type: "video",
      difficulty: "advanced",
      description:
        "Master advanced TensorFlow features for building production-ready ML models.",
      duration: "3.5 hours",
      rating: 4.7,
      students: 15000,
      tags: ["TensorFlow", "Advanced", "Paid"],
      isPaid: true,
    },
    {
      id: 5,
      title: "Data Preprocessing Best Practices",
      type: "course",
      difficulty: "intermediate",
      description:
        "Essential techniques for cleaning, transforming, and preparing data for ML models.",
      duration: "8 hours",
      rating: 4.5,
      students: 22000,
      tags: ["Data Science", "Preprocessing", "Free"],
      isPaid: false,
    },
    {
      id: 6,
      title: "Computer Vision Fundamentals",
      type: "video",
      difficulty: "beginner",
      description:
        "Introduction to computer vision concepts and OpenCV library basics.",
      duration: "2 hours",
      rating: 4.4,
      students: 18000,
      tags: ["Computer Vision", "OpenCV", "Free"],
      isPaid: false,
    },
    {
      id: 7,
      title: "MLOps Deployment Strategies",
      type: "article",
      difficulty: "advanced",
      description:
        "Learn how to deploy and monitor ML models in production environments.",
      duration: "20 min read",
      rating: 4.8,
      students: 9500,
      tags: ["MLOps", "Deployment", "Free"],
      isPaid: false,
    },
    {
      id: 8,
      title: "Natural Language Processing with BERT",
      type: "course",
      difficulty: "advanced",
      description:
        "Comprehensive guide to implementing BERT for various NLP tasks and applications.",
      duration: "15 hours",
      rating: 4.9,
      students: 11000,
      tags: ["NLP", "BERT", "Paid"],
      isPaid: true,
    },
    {
      id: 9,
      title: "Statistics for Data Science Quiz",
      type: "quiz",
      difficulty: "beginner",
      description:
        "Test your knowledge of essential statistical concepts used in data science.",
      duration: "25 questions",
      rating: 4.3,
      students: 16000,
      tags: ["Statistics", "Basics", "Free"],
      isPaid: false,
    },
    {
      id: 10,
      title: "Deep Learning Model Optimization",
      type: "video",
      difficulty: "advanced",
      description:
        "Techniques for optimizing deep learning models for better performance and efficiency.",
      duration: "4 hours",
      rating: 4.6,
      students: 7500,
      tags: ["Deep Learning", "Optimization", "Paid"],
      isPaid: true,
    },
    {
      id: 11,
      title: "Pandas Data Manipulation Guide",
      type: "article",
      difficulty: "beginner",
      description:
        "Complete guide to data manipulation using Pandas library with practical examples.",
      duration: "12 min read",
      rating: 4.5,
      students: 28000,
      tags: ["Pandas", "Data Analysis", "Free"],
      isPaid: false,
    },
    {
      id: 12,
      title: "Reinforcement Learning Algorithms",
      type: "course",
      difficulty: "advanced",
      description:
        "Explore various RL algorithms and their applications in real-world scenarios.",
      duration: "18 hours",
      rating: 4.7,
      students: 6000,
      tags: ["Reinforcement Learning", "Algorithms", "Paid"],
      isPaid: true,
    },
  ];

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

          {/* Spacer to push button to bottom */}
          <div className="flex-1" />

          {/* Action Button */}
          <button
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
              <span className="text-blue-400">{userData.careerPath}</span>{" "}
              roadmap <span>🚀</span>
            </h1>
            <p className="text-blue-200 text-lg font-medium">
              You've completed {userData.completedSteps} out of{" "}
              {userData.totalSteps} roadmap steps
            </p>
            {/* Progress Bar */}
            <div className="bg-gray-700 rounded-full h-2 mt-6">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-700"
                style={{
                  width: `${
                    (userData.completedSteps / userData.totalSteps) * 100
                  }%`,
                }}
              ></div>
            </div>
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
                        <button className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                          Start
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
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
                All Resources ({filteredAndSortedResources.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleResourcesList.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>

            {/* Load More */}
            {visibleResources < filteredAndSortedResources.length && (
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
