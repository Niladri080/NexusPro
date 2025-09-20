import React from "react";
import { Bell } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";

const PostHeader = () => {
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
    case "/learning":
      selected = "Learning";
      break;
    case "/profile":
      selected = "Profile";
      break;
    default:
      selected = ""; // No highlight if none match
  }

  return (
    <header className="flex justify-between items-center py-6 mb-12">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-wider text-blue-400">
          nexusPro
        </h1>
      </div>
      <nav className="hidden md:flex items-center space-x-8">
        <a
          onClick={() => navigate("/dashboard")}
          className={`hover:text-white transition-colors text-lg font-medium cursor-pointer ${
            selected === "Dashboard" ? "text-blue-600" : "text-gray-300"
          }`}
        >
          Dashboard
        </a>
        <a
          onClick={() => navigate("/jobs")}
          className={`hover:text-white transition-colors text-lg font-medium cursor-pointer ${
            selected === "Jobs" ? "text-blue-600" : "text-gray-300"
          }`}
        >
          Jobs
        </a>
        <a
          onClick={() => navigate("/my-learning")}
          className={`hover:text-white transition-colors text-lg font-medium cursor-pointer ${
            selected === "Learning" ? "text-blue-600" : "text-gray-300"
          }`}
        >
          My Learning
        </a>
        <a
          onClick={() => navigate("/profile")}
          className={`hover:text-white transition-colors text-lg font-medium cursor-pointer ${
            selected === "Profile" ? "text-blue-600" : "text-gray-300"
          }`}
        >
          Profile
        </a>
      </nav>
      <div className="flex items-center space-x-4">
        <Bell className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
        <SignedIn>
          <UserButton appearance={{
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
        }}/>
        </SignedIn>
      </div>
    </header>
  );
};

export default PostHeader;
