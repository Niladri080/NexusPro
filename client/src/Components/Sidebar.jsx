import React from "react";
import { Home, Brain, MapPin, FileText, BookOpen, X, ArrowLeft, Menu } from "lucide-react";
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

// Mobile Toggle Button Component (place this in your main content area)
export const SidebarToggle = ({ setSidebarOpen }) => (
  <button
    onClick={() => setSidebarOpen(true)}
    className="lg:hidden fixed top-4 left-4 z-30 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all duration-300"
    aria-label="Open sidebar"
  >
    <Menu size={24} />
  </button>
);

const Sidebar = ({ setSidebarOpen, sidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/5 border-r border-blue-400/10 backdrop-blur-2xl shadow-lg shadow-blue-500/10 flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-blue-400/10">
          <h1 className="text-2xl font-bold text-blue-400">nexusPro</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-3 flex-1 flex flex-col">
          <NavigationItem
            onClick={() => handleNavigation("/my-learning")}
            icon={Brain}
            label="My Learning"
            active={location.pathname === "/my-learning"}
          />
          <NavigationItem
            onClick={() => handleNavigation("/generate-roadmap")}
            icon={MapPin}
            label="Roadmap"
            active={location.pathname === "/generate-roadmap"}
          />
          <NavigationItem
            onClick={() => handleNavigation("/resume-upload")}
            icon={FileText}
            label="Resume"
            active={location.pathname === "/resume-upload"}
          />
          <NavigationItem
            onClick={() => handleNavigation("/resources")}
            icon={BookOpen}
            label="Resources"
            active={location.pathname === "/resources"}
          />
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-blue-400/10 mt-auto">
          <button
            onClick={() => handleNavigation("/dashboard")}
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

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;

/* 
Usage in your main component:

import Sidebar, { SidebarToggle } from './Sidebar';

function YourMainComponent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
      <SidebarToggle setSidebarOpen={setSidebarOpen} />
      
      <div className="lg:ml-72 p-4">
        Your main content here
      </div>
    </div>
  );
}
*/