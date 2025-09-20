import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = ({ handleFeaturesClick }) => {
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
        <SignedOut>
          <button
            onClick={() => navigate("/sign-in")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105"
          >
            Sign In
          </button>
        </SignedOut>
      </div>
    </header>
  );
};
export default Header;
{
  /* <header className="border-b border-gray-800 bg-[#0f0f11]/90 backdrop-blur-sm sticky top-0 z-20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-blue-400">nexusPro</h1>
                </div>
                <nav className="hidden md:flex items-center space-x-6 text-gray-300 text-sm">
                  <a href="#" className="text-blue-400 font-medium">Dashboard</a>
                  <a href="#" className="hover:text-white transition-colors">Roadmap</a>
                  <a href="#" className="hover:text-white transition-colors">Jobs</a>
                  <a href="#" className="hover:text-white transition-colors">Learning</a>
                </nav>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none w-64"
                  />
                </div>
                <button className="relative p-2 text-gray-400 hover:text-blue-400 transition-colors">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></span>
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors">
                  <Settings size={20} />
                </button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </header> */
}
