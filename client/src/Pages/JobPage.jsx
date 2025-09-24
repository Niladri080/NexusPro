import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Building,
  Heart,
  Share,
  Star,
  ChevronDown,
  Settings,
  Briefcase,
  GraduationCap,
   Monitor
} from "lucide-react";
import PostHeader from "../Components/PostHeader";

const JobCard = ({ job, onLike, onShare }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), Math.random() * 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(job.id);
  };

  return (
    <div
      className={`transform transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="bg-[#1c1c1c] border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-gray-600/30 group-hover:scale-110 transition-transform duration-300">
              <Building className="text-blue-400 text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-200 group-hover:text-blue-400 transition-colors duration-300">
                {job.title}
              </h3>
              <p className="text-gray-400">{job.company}</p>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < job.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-500 ml-1">
                  ({job.reviews})
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleLike}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isLiked
                  ? "bg-red-500/20 text-red-400 scale-110"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-red-400"
              }`}
            >
              <Heart className="w-4 h-4" />
            </button>
            <button
              onClick={() => onShare(job.id)}
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-blue-400 transition-all duration-300"
            >
              <Share className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin className="text-blue-400 w-4 h-4" />
            <span className="text-sm">{job.location}</span>
            {job.remote && (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                Remote
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-300">
              <DollarSign className="text-green-400 w-4 h-4" />
              <span className="text-sm">{job.salary}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="text-orange-400 w-4 h-4" />
              <span className="text-sm">{job.type}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="px-3 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-full">
              +{job.skills.length - 4} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`px-3 py-1 rounded-full text-xs ${
                job.matchScore >= 90
                  ? "bg-green-500/20 text-green-400"
                  : job.matchScore >= 70
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {job.matchScore}% Match
            </div>
            <span className="text-xs text-gray-500">{job.postedTime}</span>
          </div>
          <button className="px-6 py-2  bg-blue-500  text-white rounded-lg hover:from-blue-700 ion-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

const FilterDropdown = ({ title, options, selected, onSelect, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-[#1c1c1c] border border-gray-700/50 rounded-lg text-gray-300 hover:border-blue-500/50 transition-all duration-300"
      >
        <Icon className="text-blue-400 w-4 h-4" />
        <span className="text-sm">{selected || title}</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-[#1c1c1c] border border-gray-700/50 rounded-lg shadow-xl z-10 animate-fade-in-up">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700/50 hover:text-blue-400 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const JobPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    salary: "",
    type: "",
    experience: "",
  });
  const [sortBy, setSortBy] = useState("Best Match");
  const [location,setLocation]=useState("");
  const jobs = [
    {
      id: 1,
      title: "Senior AI Engineer",
      company: "TechFlow AI",
      location: "San Francisco, CA",
      remote: true,
      salary: "$140k - $200k",
      type: "Full-time",
      rating: 5,
      reviews: 234,
      matchScore: 95,
      postedTime: "2 hours ago",
      description:
        "Join our cutting-edge AI team to develop next-generation machine learning solutions. Work with state-of-the-art technologies and shape the future of artificial intelligence.",
      skills: [
        "Python",
        "TensorFlow",
        "PyTorch",
        "Machine Learning",
        "Deep Learning",
        "NLP",
      ],
    },
    {
      id: 2,
      title: "Full Stack Developer",
      company: "Innovate Solutions",
      location: "New York, NY",
      remote: false,
      salary: "$110k - $150k",
      type: "Full-time",
      rating: 4,
      reviews: 189,
      matchScore: 87,
      postedTime: "5 hours ago",
      description:
        "Build scalable web applications using modern technologies. Work in a collaborative environment with talented developers and designers.",
      skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS", "GraphQL"],
    },
    {
      id: 3,
      title: "Data Scientist",
      company: "DataInsights Corp",
      location: "Austin, TX",
      remote: true,
      salary: "$125k - $170k",
      type: "Full-time",
      rating: 5,
      reviews: 156,
      matchScore: 92,
      postedTime: "1 day ago",
      description:
        "Analyze complex datasets to drive business decisions. Use statistical methods and machine learning to uncover insights from large-scale data.",
      skills: [
        "Python",
        "R",
        "SQL",
        "Tableau",
        "Statistics",
        "Machine Learning",
      ],
    },
    {
      id: 4,
      title: "Frontend Developer",
      company: "Creative Labs",
      location: "Los Angeles, CA",
      remote: true,
      salary: "$95k - $130k",
      type: "Full-time",
      rating: 4,
      reviews: 98,
      matchScore: 78,
      postedTime: "2 days ago",
      description:
        "Create beautiful and responsive user interfaces. Work with designers to bring creative visions to life using modern frontend technologies.",
      skills: [
        "React",
        "Vue.js",
        "CSS3",
        "JavaScript",
        "Figma",
        "Tailwind CSS",
      ],
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: "CloudTech Systems",
      location: "Seattle, WA",
      remote: false,
      salary: "$120k - $160k",
      type: "Full-time",
      rating: 4,
      reviews: 143,
      matchScore: 85,
      postedTime: "3 days ago",
      description:
        "Manage cloud infrastructure and deployment pipelines. Ensure reliable and scalable systems using modern DevOps practices.",
      skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform", "Linux"],
    },
    {
      id: 6,
      title: "UX Designer",
      company: "Design Studio Pro",
      location: "Miami, FL",
      remote: true,
      salary: "$85k - $115k",
      type: "Contract",
      rating: 5,
      reviews: 67,
      matchScore: 72,
      postedTime: "4 days ago",
      description:
        "Design user-centered digital experiences. Conduct user research and create wireframes and prototypes for web and mobile applications.",
      skills: [
        "Figma",
        "Sketch",
        "Adobe XD",
        "User Research",
        "Prototyping",
        "Design Systems",
      ],
    },
  ];

  const handleLike = (jobId) => {
    console.log(`Liked job ${jobId}`);
  };

  const handleShare = (jobId) => {
    console.log(`Shared job ${jobId}`);
  };
  const [remote, setRemote] = useState(false);
  const [jobType, setJobType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
  };

  const popularLocations = ['Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune'];

  const handleQuickLocation = (selectedLocation) => {
    setLocation(selectedLocation);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans overflow-hidden relative">
      {/* Background Effects */}
      <div
        className="absolute inset-0 bg-cover bg-fixed opacity-10"
        style={{
          backgroundImage: 'url("/images/space.png")',
          backgroundPosition: "center top",
          backgroundSize: "cover",
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-blue-900/10"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0"></div>
      <div className="relative z-10 container mx-auto px-6 lg:px-8 py-6">
        {/* Header */}
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
            Job Opportunities
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Smart AI-powered recommendations tailored to your skills, interests,
            and career goals.
          </p>
        </main>
        <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Find Your Dream Job</h2>
        <p className="text-gray-400">Search for opportunities in your preferred location</p>
      </div>
      <div className="backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Job Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter city (e.g., Bengaluru, Mumbai)"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 hover:border-gray-600/50"
              />
            </div>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
            <div className="flex items-start space-x-3">
              <div className="flex items-center h-5">
                <input
                  id="remote"
                  type="checkbox"
                  checked={remote}
                  onChange={(e) => setRemote(e.target.checked)}
                  className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 focus:ring-offset-0 transition-colors cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="remote" className="flex items-center cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <Monitor className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300 font-medium">Include Remote Jobs</span>
                  </div>
                </label>
                <p className="text-gray-500 text-sm mt-1">Find opportunities you can work from anywhere</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Job Type (Optional)
            </label>
            <select 
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 hover:border-gray-600/50 cursor-pointer"
            >
              <option value="">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="freelance">Freelance</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900">
            <div className="flex items-center justify-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Search Jobs</span>
            </div>
          </button>
          <div className="space-y-3">
            <p className="text-sm text-gray-400">Popular locations:</p>
            <div className="flex flex-wrap gap-2">
              {popularLocations.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => handleQuickLocation(loc)}
                  className="px-3 py-1.5 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white text-sm rounded-lg transition-all duration-200 border border-gray-600/30 hover:border-gray-500/50 hover:scale-105"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
        <section className="container mx-auto px-6 lg:px-8 py-8">
          <div className="bg-[#1c1c1c]/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for jobs, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#0a0a0c] border border-gray-700/50 rounded-lg text-gray-300 placeholder-gray-500 focus:border-blue-500/50 focus:outline-none transition-colors duration-300"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <FilterDropdown
                  title="Location"
                  options={[
                    "Remote",
                    "San Francisco",
                    "New York",
                    "Austin",
                    "Seattle",
                    "Los Angeles",
                  ]}
                  selected={filters.location}
                  onSelect={(value) =>
                    setFilters({ ...filters, location: value })
                  }
                  icon={MapPin}
                />
                <FilterDropdown
                  title="Salary"
                  options={["$50k+", "$75k+", "$100k+", "$125k+", "$150k+"]}
                  selected={filters.salary}
                  onSelect={(value) =>
                    setFilters({ ...filters, salary: value })
                  }
                  icon={DollarSign}
                />
                <FilterDropdown
                  title="Job Type"
                  options={["Full-time", "Part-time", "Contract", "Freelance"]}
                  selected={filters.type}
                  onSelect={(value) => setFilters({ ...filters, type: value })}
                  icon={Briefcase}
                />
                <FilterDropdown
                  title="Experience"
                  options={[
                    "Entry Level",
                    "Mid Level",
                    "Senior Level",
                    "Lead/Principal",
                  ]}
                  selected={filters.experience}
                  onSelect={(value) =>
                    setFilters({ ...filters, experience: value })
                  }
                  icon={GraduationCap}
                />
              </div>

              {/* Sort */}
              <FilterDropdown
                title="Sort by"
                options={[
                  "Best Match",
                  "Most Recent",
                  "Salary High-Low",
                  "Company Rating",
                ]}
                selected={sortBy}
                onSelect={setSortBy}
                icon={Settings}
              />
            </div>
          </div>
        </section>

        {/* Job Results */}
        <section className="container mx-auto px-6 lg:px-8 pb-16">
          <div className="grid gap-6">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onLike={handleLike}
                onShare={handleShare}
              />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-gradient-to-r bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
              Load More Jobs
            </button>
          </div>
        </section>
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .bg-grid-pattern {
          background-image: linear-gradient(
              to right,
              rgba(59, 130, 246, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(59, 130, 246, 0.05) 1px,
              transparent 1px
            );
          background-size: 30px 30px;
        }
      `}</style>
    </div>
  );
};

export default JobPage;
