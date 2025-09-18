import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = ({ handleFeaturesClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  let selected;// Determine selected based on current path
  switch (location.pathname){
    case "/":
      selected="Home"
      break;
    case "/about-us":
      selected="About"
      break;
    case "/contact-us":
      selected="Contact"
      break;
  }

  return (
    <header className="flex justify-between items-center mb-16">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-wider text-blue-400">
          nexusPro
        </h1>
      </div>
      <nav className="hidden md:flex items-center space-x-10 text-gray-300">
        <a
          onClick={() => {
            navigate("/");
          }}
          className={`hover:text-white transition-colors text-lg font-medium cursor-pointer ${
            selected === "Home" ? "text-blue-600" : "text-gray-300"
          }`}
        >
          Home
        </a>
        <a
          onClick={() => {
            navigate("/about-us");
          }}
          className={`hover:text-white transition-colors text-lg font-medium cursor-pointer ${
            selected === "About" ? "text-blue-600" : "text-gray-300"
          }`}
        >
          About Us
        </a>
        <a
          onClick={() => {
            navigate("/contact-us");
          }}
          className={`hover:text-white transition-colors text-lg font-medium cursor-pointer ${
            selected === "Contact" ? "text-blue-600" : "text-gray-300"
          }`}
        >
          Contact Us
        </a>
      </nav>
      <div className="flex items-center space-x-6">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105"
            redirectUrl="/"
          />
        </SignedOut>
      </div>
    </header>
  );
};
export default Header;
