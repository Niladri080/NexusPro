import React, { useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header = ({ handleFeaturesClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  let selected; // Determine selected based on current path
  switch (location.pathname) {
    case "/":
      selected = "Home";
      break;
    case "/about-us":
      selected = "About";
      break;
    case "/contact-us":
      selected = "Contact";
      break;
  }

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false); // Close menu after navigation
  };

  return (
    <>
      <header className="flex justify-between items-center mb-16">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-wider text-blue-400">
            nexusPro
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10 text-gray-300">
          <a
            onClick={() => handleNavigation("/")}
            className={`hover:text-white transition-colors text-lg font-medium cursor-pointer ${
              selected === "Home" ? "text-blue-600" : "text-gray-300"
            }`}
          >
            Home
          </a>
          <a
            onClick={() => handleNavigation("/about-us")}
            className={`hover:text-white transition-colors text-lg font-medium cursor-pointer ${
              selected === "About" ? "text-blue-600" : "text-gray-300"
            }`}
          >
            About Us
          </a>
          <a
            onClick={() => handleNavigation("/contact-us")}
            className={`hover:text-white transition-colors text-lg font-medium cursor-pointer ${
              selected === "Contact" ? "text-blue-600" : "text-gray-300"
            }`}
          >
            Contact Us
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

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-6">
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
            <SignedOut>
              <button
                onClick={() => navigate("/sign-in")}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105"
              >
                Sign In
              </button>
            </SignedOut>
          </div>

          {/* Mobile Auth Buttons */}
          <div className="md:hidden">
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    rootBox: {
                      width: "32px",
                      height: "32px",
                    },
                    avatarBox: {
                      width: "32px",
                      height: "32px",
                    },
                  },
                }}
              />
            </SignedIn>
          </div>
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
                  onClick={() => handleNavigation("/")}
                  className={`hover:text-white transition-colors text-lg font-medium cursor-pointer py-3 px-4 rounded ${
                    selected === "Home" 
                      ? "text-blue-400 bg-blue-900/20" 
                      : "text-gray-300"
                  }`}
                >
                  Home
                </a>
                <a
                  onClick={() => handleNavigation("/about-us")}
                  className={`hover:text-white transition-colors text-lg font-medium cursor-pointer py-3 px-4 rounded ${
                    selected === "About" 
                      ? "text-blue-400 bg-blue-900/20" 
                      : "text-gray-300"
                  }`}
                >
                  About Us
                </a>
                <a
                  onClick={() => handleNavigation("/contact-us")}
                  className={`hover:text-white transition-colors text-lg font-medium cursor-pointer py-3 px-4 rounded ${
                    selected === "Contact" 
                      ? "text-blue-400 bg-blue-900/20" 
                      : "text-gray-300"
                  }`}
                >
                  Contact Us
                </a>
              </nav>

              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-gray-700">
                <SignedOut>
                  <button
                    onClick={() => handleNavigation("/sign-in")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-3 px-4 rounded-md transition-all duration-300"
                  >
                    Sign In
                  </button>
                </SignedOut>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;