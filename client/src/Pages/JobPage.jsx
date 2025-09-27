import { useState, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Building,
  Heart,
  Share,
  Star,
  ChevronDown,
  Briefcase,
  Monitor,
  Loader2
} from "lucide-react";
import PostHeader from "../Components/PostHeader";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';
import { useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
const JobCard = ({ job, onLike, onShare }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), Math.random() * 500);
    return () => clearTimeout(timer);
  }, []);


  const handleShare = () => {
    // Create shareable job data
    const jobTitle = job.title || 'Job Opportunity';
    const companyName = job.company || 'Company';
    const location = job.location || 'Location not specified';
    const salary = job.salary || 'Salary not disclosed';
    
    // Create share text
    const shareText = `🚀 ${jobTitle} at ${companyName}
📍 ${location}
💰 ${salary}
🔗 Apply now: ${job.link || 'Link not available'}

Found this opportunity on NexusPro! #Jobs #Career`;

    // Create share URL (you can customize this based on your routing)
    const shareUrl = job.link || `${window.location.origin}/jobs`;
    
    if (navigator.share) {
      // Use native Web Share API if available (mobile devices)
      navigator.share({
        title: `${jobTitle} - ${companyName}`,
        text: `Check out this job opportunity: ${jobTitle} at ${companyName} in ${location}`,
        url: shareUrl
      }).then(() => {
        console.log('Job shared successfully');
      }).catch((error) => {
        console.error('Error sharing:', error);
        // Fallback to clipboard
        copyToClipboard(shareText);
      });
    } else {
      // Fallback: Copy to clipboard
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          toast.success('Job details copied to clipboard!');
        })
        .catch((error) => {
          console.error('Error copying to clipboard:', error);
          // Final fallback: create a temporary textarea
          fallbackCopyToClipboard(text);
        });
    } else {
      fallbackCopyToClipboard(text);
    }
  };

  const fallbackCopyToClipboard = (text) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        toast.success('Job details copied to clipboard!');
      } else {
        toast.error('Unable to copy. Please copy the job link manually.');
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
      toast.error('Unable to copy. Please copy the job link manually.');
    }
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
              onClick={handleShare}
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-blue-400 transition-all duration-300"
              title="Share this job"
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
          {job.skills && job.skills.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20"
            >
              {skill}
            </span>
          ))}
          {job.skills && job.skills.length > 4 && (
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
          <button 
            onClick={() => {
              window.open(job.link || '#', '_blank');
            }} 
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

// Updated handleShare function in main component (remove the old one)
const handleShare = (jobId) => {
  // This can be used for analytics tracking
  console.log(`Shared job ${jobId}`);
  // You can add analytics tracking here if needed
};
const FilterDropdown = ({ title, options, selected, onSelect, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative filter-dropdown z-[9999]">
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-[#1c1c1c] border border-gray-700/50 rounded-lg text-gray-300 hover:border-blue-500/50 transition-all duration-300"
      >
        <Icon className="text-blue-400 w-4 h-4" />
        <span className="text-sm">{selected || title}</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {/* Dropdown Menu - Opens upward */}
      {isOpen && (
        <div
          className="absolute bottom-full left-0 mb-2 w-48 bg-[#1c1c1c] border border-gray-700/50 rounded-lg shadow-xl animate-fade-in-up max-h-60 overflow-y-auto z-[9999]"
          style={{
            transform: 'translateY(0)',
            position: 'absolute',
            zIndex: 99999
          }}
        >
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

const LoadingSpinner = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-4" />
    <p className="text-gray-400 text-lg">{message}</p>
    <p className="text-gray-400 text-sm mt-2">This may take a minute</p>
  </div>
);

const JobPage = () => {
  const { user } = useUser();
  const loca=useLocation();
  const role = Cookies.get("goal") ? Cookies.get("goal") : "Technical Employee";
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    salary: "",
    type: "",
  });
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const [remote, setRemote] = useState(false);
  const [jobType, setJobType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Ref for job results section
  const jobResultsRef = useRef(null);

  const handleLike = (jobId) => {
    console.log(`Liked job ${jobId}`);
  };

  const handleShare = (jobId) => {
    console.log(`Shared job ${jobId}`);
  };

  // Smooth scroll function
  const scrollToJobResults = () => {
    if (jobResultsRef.current) {
      jobResultsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  // Initial job fetch
  useEffect(() => {
    if (!user?.id) return; 
    setIsInitialLoading(true);
    axios.post(`${API_URL}/api/home/fetch-jobs`, { userId: user.id })
      .then((res) => {
        if (res.data.success){
          console.log(res.data.jobs[0].job);
          setJobs(res.data.jobs[0].job);
          // Scroll to job results after initial load with a delay
          setTimeout(() => {
            scrollToJobResults();
          }, 500);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsInitialLoading(false);
      });
  }, [user,loca.pathname]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error("Please login first");
      return;
    }
    setIsLoading(true);
    axios.post(`${API_URL}/api/home/get-jobs`, {
      location: location.toLowerCase(),
      userId: user.id,
      role: role,
      remote: remote,
      jobType: jobType ? jobType.toLowerCase() : null
    })
      .then((res) => {
        setJobs(res.data.response);
        // Scroll to job results after search with a delay
        setTimeout(() => {
          scrollToJobResults();
        }, 300);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Filter jobs based on search term and filters
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

    // Improved salary filtering
    const matchesSalary = !filters.salary || (() => {
      if (filters.salary === "Not Disclosed") {
        return !job.salary || job.salary === "Not Disclosed" || job.salary.toLowerCase().includes("not disclosed");
      }
      
      // Extract numeric value from filter (e.g., "5k+" -> 5)
      const filterAmount = parseInt(filters.salary.replace('k+', ''));
      
      // Extract numeric value from job salary
      const jobSalaryStr = job.salary?.toLowerCase() || '';
      
      // Handle various salary formats
      if (jobSalaryStr.includes('k') || jobSalaryStr.includes('thousand')) {
        // Extract numbers from job salary (e.g., "50k", "25-30k", "₹50,000")
        const salaryNumbers = jobSalaryStr.match(/(\d+)/g);
        if (salaryNumbers && salaryNumbers.length > 0) {
          // Take the first number as the minimum salary
          const jobMinSalary = parseInt(salaryNumbers[0]);
          return jobMinSalary >= filterAmount;
        }
      }
      
      // Handle lakh format (e.g., "5 lpa", "3.5 lakh")
      if (jobSalaryStr.includes('lpa') || jobSalaryStr.includes('lakh')) {
        const salaryNumbers = jobSalaryStr.match(/(\d+\.?\d*)/g);
        if (salaryNumbers && salaryNumbers.length > 0) {
          const jobMinSalary = parseFloat(salaryNumbers[0]) * 100; // Convert lakh to thousands
          return jobMinSalary >= filterAmount;
        }
      }
      
      // Handle direct number format (e.g., "50000", "25000-30000")
      const salaryNumbers = jobSalaryStr.match(/(\d+)/g);
      if (salaryNumbers && salaryNumbers.length > 0) {
        const jobMinSalary = parseInt(salaryNumbers[0]);
        // If the number is greater than 1000, assume it's in absolute value, convert to thousands
        if (jobMinSalary > 1000) {
          return (jobMinSalary / 1000) >= filterAmount;
        }
        // If less than 1000, assume it's already in thousands
        return jobMinSalary >= filterAmount;
      }
      
      // If we can't parse the salary, include it (don't filter out)
      return true;
    })();
    
    const matchesType = !filters.type || job.type?.toLowerCase().includes(filters.type.toLowerCase());

    return matchesSearch && matchesSalary && matchesType;
  });

  const popularLocations = ['Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune'];

  const handleQuickLocation = (selectedLocation) => {
    setLocation(selectedLocation);
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white font-sans overflow-hidden relative">
        <div
          className="absolute inset-0 bg-cover bg-fixed opacity-10"
          style={{
            backgroundImage: 'url("/images/space.png")',
            backgroundPosition: "center top",
            backgroundSize: "cover",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-blue-900/10"></div>
        <div className="relative z-10 container mx-auto px-6 lg:px-8 py-6">
          <PostHeader />
          <LoadingSpinner message="Loading your personalized job recommendations..." />
        </div>
      </div>
    );
  }

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

        {/* Job Search Form */}
        <div className="w-full max-w-lg mx-auto mb-12">
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
                disabled={isLoading}
                className="w-full bg-gradient-to-r bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <div className="flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                  <span>{isLoading ? 'Searching...' : 'Search Jobs'}</span>
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

        {/* Search and Filter Section */}
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
              <div className="flex flex-wrap gap-3 relative z-[50]">
                <FilterDropdown
                  title="Salary"
                  options={[
                    "Not Disclosed", 
                    "5k+", "10k+", "15k+", "20k+", "25k+", "30k+", "35k+", "40k+", "45k+", "50k+", 
                    "55k+", "60k+", "65k+", "70k+", "75k+", "80k+", "85k+", "90k+", "95k+", "100k+"
                  ]}
                  selected={filters.salary}
                  onSelect={(value) =>
                    setFilters((prev) => ({ ...prev, salary: value }))
                  }
                  icon={DollarSign}
                />
                <FilterDropdown
                  title="Job Type"
                  options={["Full-time", "Part-time", "Contract", "Freelance","Internship"]}
                  selected={filters.type}
                  onSelect={(value) => setFilters((prev) => ({ ...prev, type: value }))}
                  icon={Briefcase}
                />
                
                {/* Remove Filters Button */}
                {(filters.salary || filters.type || searchTerm) && (
                  <button
                    onClick={() => {
                      setFilters({ salary: "", type: "" });
                      setSearchTerm("");
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                  >
                    <span className="text-sm font-medium">Remove Filters</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Job Results Section - Added ref for scroll target */}
        <section ref={jobResultsRef} className="container mx-auto px-6 lg:px-8 pb-16 relative z-10 scroll-mt-8">
          {isLoading ? (
            <LoadingSpinner message="Finding the perfect jobs for you..." />
          ) : (
            <div className="grid gap-6">
              {filteredJobs.length === 0 ? (
                <div className="text-center animate-fade-in-up">
                  <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-blue-400">
                    No Jobs Found
                  </h2>
                  <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Try adjusting your search or filters to find more opportunities.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4 animate-fade-in-up">
                    <p className="text-gray-400">
                      Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
                      {searchTerm && ` matching "${searchTerm}"`}
                    </p>
                  </div>
                  {filteredJobs.map((job, index) => (
                    <JobCard
                      key={job.id || index}
                      job={job}
                      onLike={handleLike}
                      onShare={handleShare}
                    />
                  ))}
                </>
              )}
            </div>
          )}
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

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-slower {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.6);
          }
        }

        @keyframes float-fade {
          0%, 100% {
            transform: translateY(0px);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-20px);
            opacity: 1;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-spin-slower {
          animation: spin-slower 30s linear infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .animate-float-fade {
          animation: float-fade 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default JobPage;