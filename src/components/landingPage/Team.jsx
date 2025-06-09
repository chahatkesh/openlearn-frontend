import React, { useState } from 'react';
import { Linkedin, Twitter, X } from 'lucide-react';

// InfoCard component for hover details
const InfoCard = ({ role, branch, batch, linkedin, twitter, onClose, position }) => {
  // Position styles based on the calculated position
  const cardStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`,
  };
  
  return (
    <div 
      className="fixed z-50 bg-white rounded-md shadow-xl p-3 w-[200px] animate-fadeIn"
      style={cardStyle}
    >
      <button 
        className="absolute top-1 right-1 text-gray-400 hover:text-gray-600" 
        onClick={onClose}
      >
        <X size={12} />
      </button>
      
      <div>
        <h4 className="font-medium text-xs mb-2">{role}</h4>
        
        {/* Branch & Batch in single row */}
        {(branch || batch) && (
          <div className="flex items-center mb-2 gap-2 flex-wrap">
            {branch && (
              <span className="inline-block text-[10px] bg-gray-100 px-2 py-0.5 rounded-full">
                {branch}
              </span>
            )}
            {batch && (
              <span className="inline-block text-[10px] bg-yellow-50 px-2 py-0.5 rounded-full">
                {batch}
              </span>
            )}
          </div>
        )}
        
        {/* Social Links */}
        <div className="flex space-x-3 mt-2 border-t pt-2 border-gray-100">
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer" 
              className="text-gray-600 hover:text-blue-700 transition-colors">
              <Linkedin size={14} />
            </a>
          )}
          {twitter && (
            <a href={twitter} target="_blank" rel="noopener noreferrer" 
              className="text-gray-600 hover:text-blue-500 transition-colors">
              <Twitter size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// PathfinderNode component for each team member
const PathfinderNode = ({ name, role, branch, batch, imageUrl, linkedin, twitter, tier, isChief }) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [infoPosition, setInfoPosition] = useState({ x: 0, y: 0 });
  
  const handleMouseEnter = (e) => {
    // Calculate position for info card
    const rect = e.currentTarget.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    
    // Default position (centered below the node)
    let xPosition = rect.left + (rect.width / 2) - 110; // Center the 220px wide card
    
    // Make sure the card doesn't go offscreen
    if (xPosition < 10) xPosition = 10; // Keep 10px margin from left edge
    if (xPosition + 220 > windowWidth - 10) xPosition = windowWidth - 230; // Keep 10px margin from right edge
    
    setInfoPosition({
      x: xPosition,
      y: rect.bottom + window.scrollY + 10, // Position below the node with 10px gap
    });
    setIsInfoVisible(true);
  };
  
  return (
    <div className="relative">
      <div 
        className="flex flex-col items-center justify-center"
        style={{ width: '72px', height: tier === 1 ? '90px' : '85px' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsInfoVisible(false)}
        onClick={handleMouseEnter}
        onTouchStart={(e) => {
          e.preventDefault();
          handleMouseEnter(e);
        }}
      >
        {/* Profile Image - Fixed Size */}
        <div 
          className={`rounded-full overflow-hidden mb-2 border-2 transition-all duration-200
            ${tier === 1 ? 'border-yellow-500' : isChief ? 'border-yellow-400' : 'border-gray-200'}
            hover:border-yellow-400 hover:scale-105`}
          style={{ width: tier === 1 ? '60px' : '54px', height: tier === 1 ? '60px' : '54px' }}
        >
          <img
            src={imageUrl || `https://placehold.co/100x100/FFDE59/000000?text=${name.charAt(0)}`}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = `https://placehold.co/100x100/FFDE59/000000?text=${name.charAt(0)}`;
            }}
          />
        </div>
        
        {/* Name - Fixed Size, 12px */}
        <h3 className="font-medium text-[12px] text-center leading-none mb-0.5 max-w-[70px] mx-auto truncate">{name}</h3>
        
        {/* Role - Fixed Size, 11px */}
        <p className="text-[11px] text-gray-500 text-center leading-none max-w-[70px] mx-auto truncate">{role.replace('Pathfinder', '')}</p>
      </div>
      
      {/* Info Card on Hover */}
      {isInfoVisible && (
        <InfoCard 
          role={role}
          branch={branch}
          batch={batch}
          linkedin={linkedin}
          twitter={twitter}
          onClose={() => setIsInfoVisible(false)}
          position={infoPosition}
        />
      )}
    </div>
  );
};

const Team = () => {
  // Team data - organized hierarchically
  const pathfinders = {
    grand: {
      name: "Vatsal Khanna",
      role: "Grand Pathfinder",
      branch: "ECE",
      batch: "2027",
      imageUrl: "https://example.com/vatsal.jpg",
      linkedin: "https://linkedin.com/in/vatsal-khanna",
      twitter: "https://twitter.com/vatsalkhanna",
    },
    chiefs: [
      {
        name: "Rhythm Goyal",
        role: "Chief Finance Pathfinder",
        branch: "ECE",
        batch: "2026",
        imageUrl: "https://example.com/rhythm.jpg",
        linkedin: "https://linkedin.com/in/rhythmgoyal",
        twitter: "https://twitter.com/rhythmgoyal",
        domain: "Finance",
        team: [
          {
            name: "Pratham",
            role: "Finance Pathfinder",
            imageUrl: "https://example.com/pratham.jpg",
            linkedin: "https://linkedin.com/in/pratham",
            twitter: "https://twitter.com/pratham",
          },
          {
            name: "Tanveer",
            role: "Finance Pathfinder",
            imageUrl: "https://example.com/tanveer.jpg",
            linkedin: "https://linkedin.com/in/tanveer",
            twitter: "https://twitter.com/tanveer",
          }
        ]
      },
      {
        name: "Ratinderdeep Singh",
        role: "Chief AI Pathfinder",
        branch: "ECE",
        batch: "2027",
        imageUrl: "https://example.com/ratinder.jpg",
        linkedin: "https://linkedin.com/in/ratinderdeep",
        twitter: "https://twitter.com/ratinderdeep",
        domain: "AI",
        team: [
          {
            name: "Adesh",
            role: "AI Pathfinder",
            imageUrl: "https://example.com/adesh.jpg",
            linkedin: "https://linkedin.com/in/adesh",
            twitter: "https://twitter.com/adesh",
          },
          {
            name: "Kunal",
            role: "AI Pathfinder",
            imageUrl: "https://example.com/kunal.jpg",
            linkedin: "https://linkedin.com/in/kunal",
            twitter: "https://twitter.com/kunal",
          }
        ]
      },
      {
        name: "Chahat Kesharwani",
        role: "Chief Creative Pathfinder",
        branch: "ICE",
        batch: "2027",
        imageUrl: "https://example.com/chahat.jpg",
        linkedin: "https://linkedin.com/in/chahatkesharwani",
        twitter: "https://twitter.com/chahatkesharwani",
        domain: "Creative",
        team: [
          {
            name: "Rishi",
            role: "Creative Pathfinder",
            imageUrl: "https://example.com/rishi.jpg",
            linkedin: "https://linkedin.com/in/rishi",
            twitter: "https://twitter.com/rishi",
          },
          {
            name: "Achintya",
            role: "Creative Pathfinder",
            imageUrl: "https://example.com/achintya.jpg",
            linkedin: "https://linkedin.com/in/achintya",
            twitter: "https://twitter.com/achintya",
          }
        ]
      }
    ]
  };

  return (
    <section id="team" className="py-16 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Meet the Pathfinders</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            The minds and hearts behind OpenLearn – from visionary leads to hands-on community champions.
          </p>
          <div className="text-center text-yellow-600 text-sm mt-2">
            <p className="hidden md:block">Hover over each pathfinder to learn more</p>
            <p className="block md:hidden">Tap on a pathfinder to see details</p>
          </div>
        </div>

        {/* Organization Tree Structure - Simplified & Perfect */}
        <div className="max-w-3xl mx-auto relative">
          {/* SVG Tree Structure - Perfect lines and connections */}
          <div className="absolute inset-0 w-full h-full pointer-events-none hidden md:block">
            <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="xMidYMin slice">
              {/* Vertical line from Grand to middle Chief */}
              <line x1="400" y1="70" x2="400" y2="150" stroke="#FBBF24" strokeWidth="2" />
              
              {/* Horizontal line connecting all chiefs */}
              <line x1="200" y1="150" x2="600" y2="150" stroke="#FBBF24" strokeWidth="2" />
              
              {/* Vertical lines from horizontal to each Chief */}
              <line x1="200" y1="150" x2="200" y2="170" stroke="#FBBF24" strokeWidth="2" />
              <line x1="400" y1="150" x2="400" y2="170" stroke="#FBBF24" strokeWidth="2" />
              <line x1="600" y1="150" x2="600" y2="170" stroke="#FBBF24" strokeWidth="2" />
              
              {/* Vertical lines from Chiefs to their teams */}
              <line x1="200" y1="230" x2="200" y2="280" stroke="#D1D5DB" strokeWidth="2" />
              <line x1="400" y1="230" x2="400" y2="280" stroke="#D1D5DB" strokeWidth="2" />
              <line x1="600" y1="230" x2="600" y2="280" stroke="#D1D5DB" strokeWidth="2" />
              
              {/* Horizontal lines for each team */}
              <line x1="150" y1="280" x2="250" y2="280" stroke="#D1D5DB" strokeWidth="2" />
              <line x1="350" y1="280" x2="450" y2="280" stroke="#D1D5DB" strokeWidth="2" />
              <line x1="550" y1="280" x2="650" y2="280" stroke="#D1D5DB" strokeWidth="2" />
              
              {/* Vertical connections to each team member */}
              <line x1="150" y1="280" x2="150" y2="300" stroke="#D1D5DB" strokeWidth="2" />
              <line x1="250" y1="280" x2="250" y2="300" stroke="#D1D5DB" strokeWidth="2" />
              <line x1="350" y1="280" x2="350" y2="300" stroke="#D1D5DB" strokeWidth="2" />
              <line x1="450" y1="280" x2="450" y2="300" stroke="#D1D5DB" strokeWidth="2" />
              <line x1="550" y1="280" x2="550" y2="300" stroke="#D1D5DB" strokeWidth="2" />
              <line x1="650" y1="280" x2="650" y2="300" stroke="#D1D5DB" strokeWidth="2" />
            </svg>
          </div>
          
          {/* Tier 1: Grand Pathfinder (Center-Top) */}
          <div className="flex justify-center mb-24 relative">
            <div className="relative z-10">
              <PathfinderNode 
                {...pathfinders.grand}
                tier={1}
                isChief={true}
              />
            </div>
            
            {/* Mobile only: vertical connector line */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0.5 h-8 bg-yellow-400 md:hidden"></div>
          </div>

          {/* Tier 2: Chief Pathfinders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-0 mb-24 relative">
            {pathfinders.chiefs.map((chief, index) => (
              <div key={index} className="flex flex-col items-center relative">
                {/* Mobile only: vertical connector line */}
                {index === 1 && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-yellow-400 md:hidden"></div>
                )}
                
                {/* Chief Node */}
                <div className="relative z-10">
                  <PathfinderNode 
                    {...chief}
                    tier={2}
                    isChief={true}
                  />
                </div>
                
                {/* Domain Badge */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-yellow-50 border border-yellow-100 px-2 py-0.5 rounded-full text-[10px] text-yellow-700 whitespace-nowrap">
                  {chief.domain}
                </div>
                
                {/* Mobile only: vertical connector line */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0.5 h-8 bg-gray-300 md:hidden"></div>
              </div>
            ))}
          </div>
          
          {/* Tier 3: Team Members */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0">
            {pathfinders.chiefs.map((chief, chiefIndex) => (
              <div key={chiefIndex} className="flex flex-col items-center">
                {/* Team Members Row - Perfect symmetry */}
                <div className="grid grid-cols-2 gap-x-10 gap-y-4">
                  {chief.team.map((member, memberIndex) => (
                    <div key={memberIndex} className="relative flex justify-center">
                      <PathfinderNode 
                        {...member}
                        tier={3}
                        isChief={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-200 rounded-full -translate-y-1/2 translate-x-1/2 opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-yellow-200 rounded-full translate-y-1/2 -translate-x-1/2 opacity-10"></div>
    </section>
  );
};

export default Team;