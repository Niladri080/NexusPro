import {
  FaTwitter,
  FaLinkedin,
  FaFacebook,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Footer=({handleFeaturesClick,handleHowClick})=>{
    const navigate=useNavigate();
  return (
    <footer className="bg-[#101012] border-t border-blue-500/20 pt-16 pb-8 relative z-10">
    <div className="container mx-auto px-6 lg:px-8">
        {/* Top section with columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

            {/* Column 1: Brand & Tagline */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">

                    <h1 className="text-2xl font-bold text-blue-400">nexusPro</h1>
                </div>
                <p className="text-gray-400 text-sm">
                    Empowering your professional journey with AI-driven intelligence and personalized career roadmaps.
                </p>
            </div>

            {/* Column 2: Product Links */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Product</h3>
                <ul className="space-y-3">
                    <li><a onClick={handleFeaturesClick} className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer">Features</a></li>
                    <li><a onClick={handleHowClick} className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer">How It Works</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Pricing</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Roadmap</a></li>
                </ul>
            </div>

            {/* Column 3: Company Links */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Company</h3>
                <ul className="space-y-3">
                    <li><a onClick={()=>{
                        navigate("/about-us")
                    }} className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer">About Us</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Careers</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Contact</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                </ul>
            </div>

            {/* Column 4: Newsletter Signup */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
                <p className="text-gray-400 text-sm">Get the latest career insights and product updates.</p>
                <form className="flex items-center">
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="bg-gray-800 border border-gray-700 w-full px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                        type="submit" 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition-colors"
                    >
                        Go
                    </button>
                </form>
            </div>
        </div>

        {/* Bottom section with copyright and socials */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4">
            <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Nexus Pro. All Rights Reserved.
            </p>
            <div className="flex items-center space-x-5 text-gray-400 text-2xl">
                <a href="#" className="hover:text-blue-400 transition-colors"><FaTwitter /></a>
                <a href="#" className="hover:text-blue-400 transition-colors"><FaLinkedin /></a>
                <a href="#" className="hover:text-blue-400 transition-colors"><FaFacebook /></a>
            </div>
        </div>
    </div>
</footer>
  )
}
export default Footer;