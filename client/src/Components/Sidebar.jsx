import React from "react";
import { Home, Brain, MapPin, FileText, BookOpen, X, ArrowLeft, ArrowBigDownDashIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const NavigationItem = ({ icon: Icon, label, active = false, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-4 px-6 py-4 rounded-xl cursor-pointer transition-all duration-300 ${
      active
        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
    }`}
  >
    <Icon size={22} />
    <span className="font-medium">{label}</span>
  </div>
);

const Sidebar = ({ setSidebarOpen, sidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/5 border-r border-blue-400/10 backdrop-blur-2xl shadow-lg shadow-blue-500/10 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-8 border-b border-blue-400/10">
          <h1 className="text-2xl font-bold text-blue-400">nexusPro</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="p-6 space-y-3 flex-1 flex flex-col">
          <NavigationItem
            onClick={() => navigate("/my-learning")}
            icon={Brain}
            label="My Learning"
            active={location.pathname === "/my-learning"}
          />
          <NavigationItem
            onClick={() => navigate("/generate-roadmap")}
            icon={MapPin}
            label="Roadmap"
            active={location.pathname === "/generate-roadmap"}
          />
          <NavigationItem
            onClick={() => navigate("/resume-upload")}
            icon={FileText}
            label="Resume"
            active={location.pathname === "/resume-upload"}
          />
          <NavigationItem
            onClick={() => navigate("/resources")}
            icon={BookOpen}
            label="Resources"
            active={location.pathname === "/resources"}
          />
        </nav>
        <div className="p-6 border-t border-blue-400/10 mt-auto">
          <button
            onClick={() => navigate("/dashboard")}
            className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-300
              ${
                location.pathname === "/dashboard"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-blue-500/10 text-blue-400 hover:bg-blue-600/20 hover:text-white"
              }
            `}
          >
            <ArrowLeft size={22} />
            Return to dashboard
          </button>
        </div>
      </div>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
