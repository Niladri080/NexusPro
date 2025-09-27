import React, { useState } from "react";
import { Bell, Menu, X } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";

const PostHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Dynamically select based on path
  let selected;
  switch (location.pathname) {
    case "/dashboard":
      selected = "Dashboard";
      break;
    case "/jobs":
      selected = "Jobs";
      break;
    case "/my-learning":
      selected = "Learning";
      break;
    case "/forum":
      selected = "Forum";
      break;
    default:
      selected = ""; // No highlight if none match
  }

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false); // Close menu after navigation
  };

  return (
    <>
      <header className="flex justify-between items-center py-6 mb-12">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-wider text-blue-400">
            nexusPro
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a
            onClick={() => handleNavigation("/dashboard")}
            className={`hover:text-white transition-colors text-lg font-medium cursor-pointer ${
              selected === "Dashboard" ? "text-blue-600" : "text-gray-300"
            }`}
          >
            Dashboard
          </a>
          <a
            onClick={() => handleNavigation("/jobs")}
            className={`hover:text-white transition-colors text-lg font-medium cursor-pointer ${
              selected === "Jobs" ? "text-blue-600" : "text-gray-300"
            }`}
          >
            Jobs
          </a>
          <a
            onClick={() => handleNavigation("/my-learning")}
            className={`hover:text-white transition-colors text-lg font-medium cursor-pointer ${
              selected === "Learning" ? "text-blue-600" : "text-gray-300"
            }`}
          >
            My Learning
          </a>
          <a
            onClick={() => handleNavigation("/forum")}
            className={`hover:text-white transition-colors text-lg font-medium cursor-pointer ${
              selected === "Forum" ? "text-blue-600" : "text-gray-300"
            }`}
          >
            Community
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-blue-400 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* User Button */}
          <SignedIn>
            <UserButton 
              appearance={{
                elements: {
                  rootBox: {
                    width: "38px",
                    height: "38px",
                  },
                  avatarBox: {
                    width: "38px",
                    height: "38px",
                  },
                },
              }}
            />
          </SignedIn>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}>
          <div className="fixed top-0 right-0 h-full w-64 bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col p-6 space-y-6">
              {/* Close button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-4">
                <a
                  onClick={() => handleNavigation("/dashboard")}
                  className={`hover:text-white transition-colors text-lg font-medium cursor-pointer py-2 px-4 rounded ${
                    selected === "Dashboard" 
                      ? "text-blue-400 bg-blue-900/20" 
                      : "text-gray-300"
                  }`}
                >
                  Dashboard
                </a>
                <a
                  onClick={() => handleNavigation("/jobs")}
                  className={`hover:text-white transition-colors text-lg font-medium cursor-pointer py-2 px-4 rounded ${
                    selected === "Jobs" 
                      ? "text-blue-400 bg-blue-900/20" 
                      : "text-gray-300"
                  }`}
                >
                  Jobs
                </a>
                <a
                  onClick={() => handleNavigation("/my-learning")}
                  className={`hover:text-white transition-colors text-lg font-medium cursor-pointer py-2 px-4 rounded ${
                    selected === "Learning" 
                      ? "text-blue-400 bg-blue-900/20" 
                      : "text-gray-300"
                  }`}
                >
                  My Learning
                </a>
                <a
                  onClick={() => handleNavigation("/forum")}
                  className={`hover:text-white transition-colors text-lg font-medium cursor-pointer py-2 px-4 rounded ${
                    selected === "Forum" 
                      ? "text-blue-400 bg-blue-900/20" 
                      : "text-gray-300"
                  }`}
                >
                  Community
                </a>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostHeader;