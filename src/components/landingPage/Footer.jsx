import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Instagram, MapPin } from 'lucide-react';
import { RiTwitterXFill } from 'react-icons/ri';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-14 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: "radial-gradient(circle, #FFDE59 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}></div>
      </div>
      
      {/* Yellow accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#FFDE59]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="flex flex-col md:flex-row justify-between mb-10">
          {/* Logo Section - Enhanced */}
          <div className="mb-8 md:mb-0 md:w-5/12">
            <div className="flex items-center mb-4">
              <div className="mr-3">
                <img 
                  src="/logo.jpg" 
                  alt="OpenLearn Logo" 
                  className="h-12 w-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNGRkRFNTkiIC8+PHRleHQgeD0iMTAiIHk9IjI0IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJibGFjayI+T0w8L3RleHQ+PC9zdmc+";
                  }}
                />
              </div>
              <div>
                <Link to="/" className="text-white font-bold text-2xl hover:text-[#FFDE59] transition-colors">
                  OpenLearn
                </Link>
                <p className="text-gray-400 text-sm">
                  Gamified Learning for NITJ Innovators
                </p>
              </div>
            </div>
            <p className="text-gray-300 text-sm max-w-md mb-6">
              OpenLearn is a student-led cohort-based learning platform at NIT Jalandhar that transforms educational experiences through gamification and collaborative competition.
            </p>
            
            {/* Contact Details */}
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-400">
                <MapPin size={14} className="mr-2 text-[#FFDE59]" />
                <span>NIT Jalandhar, Punjab, India</span>
              </div>
            </div>
          </div>

          {/* Middle column for spacing on larger screens */}
          <div className="hidden md:block md:w-1/12"></div>

          {/* Community & Social */}
          <div className="md:w-6/12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Community Column */}
              <div>
                <h3 className="text-lg font-semibold mb-6 text-white relative inline-block">
                  Community
                  <span className="absolute left-0 bottom-0 w-1/2 h-0.5 bg-[#FFDE59]"></span>
                </h3>
                <ul className="space-y-3">
                  <li><a href="#join-cohort" className="text-gray-400 hover:text-[#FFDE59] transition-colors text-sm">Join Cohort 1.0</a></li>
                  <li><a href="#cohort" className="text-gray-400 hover:text-[#FFDE59] transition-colors text-sm">Explore Leagues</a></li>
                  <li><Link to="/updates" className="text-gray-400 hover:text-[#FFDE59] transition-colors text-sm">Platform Updates</Link></li>
                </ul>
              </div>
              
              {/* Connect Column */}
              <div>
                <h3 className="text-lg font-semibold mb-6 text-white relative inline-block">
                  Connect
                  <span className="absolute left-0 bottom-0 w-1/2 h-0.5 bg-[#FFDE59]"></span>
                </h3>
                <div className="flex flex-wrap gap-3 mb-6">
                  <a 
                    href="https://www.linkedin.com/company/openlearn-nitj" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#0077b5] transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={16} />
                  </a>
                  <a 
                    href="https://x.com/OpenLearn_NITJ" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-black transition-colors"
                    aria-label="X (formerly Twitter)"
                  >
                    <RiTwitterXFill size={16} />
                  </a>
                  <a 
                    href="https://www.instagram.com/openlearn_nitj" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#E1306C] transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram size={16} />
                  </a>
                </div>                
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs text-gray-500 mb-4 sm:mb-0">
              © {new Date().getFullYear()} OpenLearn | All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-xs text-gray-500 hover:text-[#FFDE59] transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-xs text-gray-500 hover:text-[#FFDE59] transition-colors">
                Terms of Service
              </Link>
              <Link to="/updates" className="text-xs text-gray-500 hover:text-[#FFDE59] transition-colors">
                Updates
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;