import React, { useState, useEffect } from 'react';
import {Info} from 'lucide-react';
import { MotionDiv, MotionSection, MotionH2, MotionP } from '../common/MotionWrapper';
import supporterData from '../../data/supporterData';

// CSS animation keyframes
const animationKeyframes = `
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

@keyframes blob {
  0% { transform: scale(1) translate(0, 0); }
  33% { transform: scale(1.1) translate(20px, -20px); }
  66% { transform: scale(0.9) translate(-20px, 20px); }
  100% { transform: scale(1) translate(0, 0); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-pulse-custom {
  animation: pulse 3s ease-in-out infinite;
}

.animate-blob {
  animation: blob 10s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
`;

// Add the animation keyframes to the document
const addAnimationStyles = () => {
  if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerHTML = animationKeyframes;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }
  return () => {};
};

// Enhanced SupporterCard component with advanced interactivity
const SupporterCard = ({ name, logo, supportType, description = "#" }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <MotionDiv 
      className="bg-white rounded-xl overflow-hidden hover:shadow-sm transition-all duration-500 group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.3 }
      }}
    >
      <div 
        className={`flex items-center justify-center h-32 relative overflow-hidden ${isHovered ? 'bg-[#FFDE59]/10' : 'bg-gray-50'}`}
        style={{
          backgroundImage: isHovered ? 
            "radial-gradient(circle at center, rgba(255,222,89,0.2) 0%, rgba(255,222,89,0.05) 50%, transparent 100%)" : 
            "none",
          backgroundSize: "200% 200%",
          backgroundPosition: "center",
          transition: "all 0.5s ease"
        }}
      >
        {/* Interactive background patterns */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform={`scale(${isHovered ? 1.2 : 1}) rotate(${isHovered ? 5 : 0})`} style={{ transition: 'all 0.8s ease' }}>
              <circle cx="2" cy="2" r="1" fill="#FFDE59" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        
        <div className={`absolute inset-0 bg-gradient-to-br from-[#FFDE59]/10 via-transparent to-[#FFDE59]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isHovered ? 'animate-pulse-custom' : ''}`}></div>
        
        {logo ? (
          <img 
            src={logo} 
            alt={`${name} logo`} 
            className={`w-full object-contain relative z-10 transition-all duration-500 ${isHovered ? 'scale-110 drop-shadow-lg' : ''}`}
            style={{ 
              filter: isHovered ? 'drop-shadow(0 0 8px rgba(255, 222, 89, 0.5))' : 'none',
              transform: isHovered ? 'scale(1.1) translateY(-5px)' : 'scale(1) translateY(0)'
            }}
            onError={(e) => {
              e.target.src = `https://placehold.co/240x120/FFDE59/000000?text=${name[0]}`;
            }}
          />
        ) : (
          <div 
            className={`h-20 w-20 rounded-full bg-[#FFDE59] flex items-center justify-center transition-all duration-500 ${isHovered ? 'shadow-lg shadow-yellow-400/30' : ''}`}
            style={{ 
              transform: isHovered ? 'scale(1.1) translateY(-5px)' : 'scale(1) translateY(0)'
            }}
          >
            <span className="text-3xl font-bold text-black">
              {name[0]}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg leading-tight transition-colors duration-300 text-black">
            {name}
          </h3>
          <span 
            className="inline-flex text-[8px] items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all duration-300" 
            style={{ 
              backgroundColor: isHovered ? '#FFDE59' : '#f0f0f0', 
              color: isHovered ? 'black' : '#333333',
              border: isHovered ? '1px solid #FFDE59' : '1px solid #e5e5e5'
            }}
          >
            {supportType}
          </span>
        </div>
        
        <p className="text-gray-600 transition-colors duration-300" style={{
          color: isHovered ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.6)'
        }}>
          {description}
        </p>
      </div>
    </MotionDiv>
  );
};

const About = () => {
  // Add animation styles on component mount
  useEffect(() => {
    const cleanup = addAnimationStyles();
    return cleanup;
  }, []);
  
  // Get supporters data from external file
  const { supporters } = supporterData;
  
  return (
    <MotionSection 
      id="about" 
      className="py-24 relative overflow-hidden bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full" style={{
          backgroundImage: `
            radial-gradient(circle at 100% 50%, rgba(255, 222, 89, 0.1) 1px, transparent 6px),
            radial-gradient(circle at 20% 80%, rgba(255, 222, 89, 0.08) 2px, transparent 8px),
            radial-gradient(circle at 40% 30%, rgba(255, 222, 89, 0.06) 2px, transparent 10px)
          `,
          backgroundSize: "60px 60px, 90px 90px, 120px 120px",
          backgroundPosition: "0 0, 30px 30px, 60px 60px"
        }}></div>
      </div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="40" height="40" fill="none"/>
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFDE59" strokeWidth="0.5"/>
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* Recognised & Supported By - with enhanced card hover effects */}
        <div className="mb-16 relative">
          {/* Yellow spotlights */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#FFDE59] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#FFDE59] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 md:p-12 shadow-md max-w-6xl mx-auto transform transition-all duration-500">
            <h3 className="text-2xl md:text-4xl font-bold mb-12 text-center relative">
              <span className="relative">
                Recognised & Supported By
                <svg className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3" width="140" height="8" viewBox="0 0 140 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 6C47.3333 2 93.6667 2 138 6" stroke="#FFDE59" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </span>
            </h3>
            
            {/* Supporters Grid with enhanced layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {supporters.map((supporter, index) => (
                <div 
                  key={index} 
                  className="transform transition-all duration-300 hover:-translate-y-1"
                >
                  <SupporterCard {...supporter} />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer note with more coming soon - enhanced with effects */}
        <div className="text-center mt-16 mb-4">
          <div className="inline-flex items-center justify-center px-6 py-3 bg-[#FFDE59]/10 border border-[#FFDE59]/20 text-gray-700 rounded-full shadow-sm hover:shadow-md transition-all">
            <Info size={16} className="mr-2 text-gray-700" />
            <span className="font-medium">More institutional collaborations coming soon...</span>
          </div>
        </div>
      </div>
      
      {/* Enhanced Decorative elements - subtle for white background */}
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#FFDE59] rounded-full opacity-5 blur-3xl"></div>
      <div className="absolute top-1/4 -right-32 w-80 h-80 bg-[#FFDE59] rounded-full opacity-5 blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-[#FFDE59] rounded-full opacity-5 blur-2xl"></div>
    </MotionSection>
  );
};

export default About;