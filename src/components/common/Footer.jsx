import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Instagram, MapPin } from 'lucide-react';
import { RiTwitterXFill, RiMailFill } from 'react-icons/ri';
import { MotionDiv, MotionFooter, MotionA } from './MotionWrapper';

const Footer = () => {
  // Animation variants
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const socialVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <MotionFooter 
      className="bg-black text-white py-14 relative overflow-hidden"
      variants={containerVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
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
          <MotionDiv className="mb-8 md:mb-0 md:w-5/12" variants={itemVariant}>
            <div className="flex items-center mb-4">
              <div className="mr-3">
                <button 
                  onClick={scrollToTop}
                  className="block hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#FFDE59] focus:ring-opacity-50 rounded"
                  aria-label="Scroll to top"
                >
                  <img 
                    src="/logo.jpg" 
                    alt="OpenLearn Logo" 
                    className="h-12 w-auto cursor-pointer"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNGRkRFNTkiIC8+PHRleHQgeD0iMTAiIHk9IjI0IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJibGFjayI+T0w8L3RleHQ+PC9zdmc+";
                    }}
                  />
                </button>
              </div>
              <div>
                <Link to="/" className="text-white font-bold text-2xl hover:text-[#FFDE59] transition-colors">
                  OpenLearn
                </Link>
                <p className="text-gray-400 text-sm">
                  Learn Together, Build Together
                </p>
              </div>
            </div>
            <p className="text-gray-300 text-sm max-w-md mb-6">
              OpenLearn is a student-run community created by students, for students. 
              It's a space where we learn together, share knowledge, and grow as a community - but we don't stop at learning. 
              Our ultimate aim is to build real products from what we learn.
            </p>
            
            {/* Contact Details */}
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-400">
                <span className="mr-2 font-semibold text-[#FFDE59]">Email:</span>
                <a href="mailto:info@openlearn.org.in" className="text-[#FFDE59]">info@openlearn.org.in</a>
              </div>
            </div>
          </MotionDiv>

          {/* Middle column for spacing on larger screens */}
          <div className="hidden md:block md:w-1/12"></div>

          {/* Community & Social */}
          <MotionDiv className="md:w-6/12" variants={itemVariant}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Community Column */}
              <MotionDiv variants={itemVariant}>
                <h3 className="text-lg font-semibold mb-6 text-white relative inline-block">
                  Quick Links
                  <span className="absolute left-0 bottom-0 w-1/2 h-0.5 bg-[#FFDE59]"></span>
                </h3>
                <ul className="space-y-3">
                  <li>
                    <MotionDiv whileHover={{ x: 2 }}>
                      <Link to="/cohorts" className="text-gray-400 hover:text-[#FFDE59] transition-colors text-sm">
                        Cohorts
                      </Link>
                    </MotionDiv>
                  </li>
                  <li>
                    <MotionDiv whileHover={{ x: 2 }}>
                      <Link to="/community" className="text-gray-400 hover:text-[#FFDE59] transition-colors text-sm">
                        Community
                      </Link>
                    </MotionDiv>
                  </li>
                  <li>
                    <MotionDiv whileHover={{ x: 2 }}>
                      <Link to="/gallery" className="text-gray-400 hover:text-[#FFDE59] transition-colors text-sm">
                        Gallery
                      </Link>
                    </MotionDiv>
                  </li>
                  <li>
                    <MotionDiv whileHover={{ x: 2 }}>
                      <Link to="/updates" className="text-gray-400 hover:text-[#FFDE59] transition-colors text-sm">
                        Platform Updates
                      </Link>
                    </MotionDiv>
                  </li>
                </ul>
              </MotionDiv>
              
              {/* Connect Column */}
              <MotionDiv variants={itemVariant}>
                <h3 className="text-lg font-semibold mb-6 text-white relative inline-block">
                  Connect
                  <span className="absolute left-0 bottom-0 w-1/2 h-0.5 bg-[#FFDE59]"></span>
                </h3>
                <div className="flex flex-wrap gap-3 mb-6">
                  <MotionA 
                    href="https://www.linkedin.com/company/openlearn-nitj" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#0077b5] transition-colors"
                    aria-label="LinkedIn"
                    variants={socialVariant}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Linkedin size={16} />
                  </MotionA>
                  <MotionA 
                    href="https://x.com/OpenLearn_NITJ" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-600 transition-colors"
                    aria-label="X (formerly Twitter)"
                    variants={socialVariant}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RiTwitterXFill size={16} />
                  </MotionA>
                  <MotionA 
                    href="https://www.instagram.com/openlearn.org.in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#E1306C] transition-colors"
                    aria-label="Instagram"
                    variants={socialVariant}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Instagram size={16} />
                  </MotionA>
                  <MotionA 
                    href="mailto:info@openlearn.org.in" 
                    className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#ffde59] transition-colors"
                    aria-label="Email"
                    variants={socialVariant}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RiMailFill size={16} />
                  </MotionA>
                </div>                
              </MotionDiv>
            </div>
          </MotionDiv>
        </div>

        {/* Copyright */}
        <MotionDiv 
          className="pt-6 border-t border-gray-800"
          variants={itemVariant}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs text-gray-500 mb-4 sm:mb-0">
              © {new Date().getFullYear()} OpenLearn | All rights reserved.
            </p>
            <div className="flex space-x-6">
              <MotionDiv whileHover={{ y: -1 }}>
                <Link to="/privacy" className="text-xs text-gray-500 hover:text-[#FFDE59] transition-colors">
                  Privacy Policy
                </Link>
              </MotionDiv>
              <MotionDiv whileHover={{ y: -1 }}>
                <Link to="/terms" className="text-xs text-gray-500 hover:text-[#FFDE59] transition-colors">
                  Terms of Service
                </Link>
              </MotionDiv>
              <MotionDiv whileHover={{ y: -1 }}>
                <Link to="/updates" className="text-xs text-gray-500 hover:text-[#FFDE59] transition-colors">
                  Updates
                </Link>
              </MotionDiv>
            </div>
          </div>
        </MotionDiv>
      </div>
    </MotionFooter>
  );
};

export default Footer;
