import React from 'react';
import { Crown, Star, Users } from 'lucide-react';
import { FaLinkedinIn, FaXTwitter, FaInstagram } from 'react-icons/fa6';
import { MotionDiv, MotionSection, MotionH2, MotionP } from '../common/MotionWrapper';

// Modern Team Member Card with Enhanced UI/UX
const TeamMemberCard = ({ name, role, linkedin, twitter, instagram, level }) => {
  const getLevelStyles = () => {
    switch (level) {
      case 'grand':
        return {
          container: 'bg-gradient-to-r from-[#FFDE59] via-yellow-300 to-amber-400 p-4 sm:p-6 md:p-8 border-2 border-yellow-400 hover:border-yellow-500 transform hover:-translate-y-1 hover:scale-[1.01] cursor-pointer transition-all duration-300 rounded-2xl',
          image: 'w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 ring-4 ring-black hover:ring-gray-800',
          nameSize: 'text-lg sm:text-xl md:text-2xl font-bold text-black mb-2',
          roleSize: 'text-sm sm:text-base font-semibold text-gray-800 mb-4',
          icon: <Crown size={24} className="text-black drop-shadow-sm" />,
          badge: 'bg-black text-[#FFDE59] px-4 py-2 text-sm font-bold rounded-full shadow-lg',
          socialContainer: 'bg-yellow-100 rounded-xl p-4'
        };
      case 'chief':
        return {
          container: 'bg-white p-3 sm:p-4 md:p-5 shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-[#FFDE59] rounded-xl transform hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300',
          image: 'w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 ring-3 ring-[#FFDE59] hover:ring-yellow-400',
          nameSize: 'text-base sm:text-lg font-bold text-gray-900 mb-1',
          roleSize: 'text-xs sm:text-sm font-medium text-gray-600 mb-3',
          icon: <Star size={18} className="text-[#FFDE59] drop-shadow-sm" />,
          badge: 'bg-[#FFDE59] text-black px-3 py-1 text-xs font-bold rounded-full shadow-md',
          socialContainer: 'bg-gray-50 rounded-lg p-2 sm:p-3 mt-3 sm:mt-4'
        };
      default:
        return {
          container: 'bg-white p-2 sm:p-3 md:p-4 border border-gray-200 hover:border-gray-300 rounded-lg transform hover:-translate-y-1 transition-all duration-300',
          image: 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ring-2 ring-gray-300 hover:ring-[#FFDE59]',
          nameSize: 'text-sm sm:text-base font-semibold text-gray-900 mb-1',
          roleSize: 'text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3',
          icon: <Users size={16} className="text-gray-500" />,
          badge: 'bg-gray-100 text-gray-700 px-2 py-1 text-xs font-medium rounded-full',
          socialContainer: 'bg-gray-50 rounded-lg p-1 sm:p-2 mt-2 sm:mt-3'
        };
    }
  };

  const styles = getLevelStyles();

  // Special horizontal layout for grand pathfinder
  if (level === 'grand') {
    return (
      <MotionDiv 
        className={`rounded-2xl transition-all duration-500 ease-out group ${styles.container}`}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ 
          y: -5,
          transition: { duration: 0.3 }
        }}
      >
        {/* Horizontal Layout for Grand Pathfinder */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Left side - Profile Image */}
          <div className="flex-shrink-0">
            <div className="relative inline-block">
              <img
                src={`/team/${name.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                alt={name}
                className={`${styles.image} rounded-xl object-cover transition-all duration-300 group-hover:brightness-110`}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${name}&background=000000&color=FFDE59&bold=true&size=128`;
                }}
              />
              {/* Online indicator */}
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="flex-1 text-center md:text-left">
            {/* Name and Role */}
            <div className="mb-4">
              <h3 className={`${styles.nameSize} transition-colors duration-300 group-hover:text-opacity-80`}>
                {name}
              </h3>
              <p className={styles.roleSize}>
                {role}
              </p>
            </div>

            {/* Social Links */}
            {(linkedin || twitter || instagram) && (
                <div className="flex justify-center md:justify-start mt-4 sm:mt-6 space-x-3 sm:space-x-4">
                  {linkedin && (
                    <a 
                      href={linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group/social flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl transition-all duration-300 transform hover:scale-110 bg-white hover:bg-blue-600 text-gray-600 hover:text-white shadow-sm border border-gray-200"
                      title="LinkedIn Profile"
                    >
                      <FaLinkedinIn size={16} className="sm:hidden transition-transform duration-300 group-hover/social:scale-110" />
                      <FaLinkedinIn size={20} className="hidden sm:block transition-transform duration-300 group-hover/social:scale-110" />
                    </a>
                  )}
                  {twitter && (
                    <a 
                      href={twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group/social flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl transition-all duration-300 transform hover:scale-110 bg-white hover:bg-black text-gray-600 hover:text-white shadow-sm border border-gray-200"
                      title="X (Twitter) Profile"
                    >
                      <FaXTwitter size={16} className="sm:hidden transition-transform duration-300 group-hover/social:scale-110" />
                      <FaXTwitter size={20} className="hidden sm:block transition-transform duration-300 group-hover/social:scale-110" />
                    </a>
                  )}
                  {instagram && (
                    <a 
                      href={instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group/social flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl transition-all duration-300 transform hover:scale-110 bg-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 text-gray-600 hover:text-white shadow-sm border border-gray-200"
                      title="Instagram Profile"
                    >
                      <FaInstagram size={16} className="sm:hidden transition-transform duration-300 group-hover/social:scale-110" />
                      <FaInstagram size={20} className="hidden sm:block transition-transform duration-300 group-hover/social:scale-110" />
                    </a>
                  )}
                </div>
            )}
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none bg-black"></div>
      </MotionDiv>
    );
  }

  // Regular vertical layout for other team members
  return (
    <MotionDiv 
      className={`rounded-xl transition-all duration-500 ease-out group ${styles.container}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.3 }
      }}
    >
      {/* Profile Section */}
      <div className="text-center my-4">
        <div className="relative inline-block mb-3">
          <img
            src={`/team/${name.toLowerCase().replace(/\s+/g, '-')}.jpg`}
            alt={name}
            className={`${styles.image} rounded-lg mx-auto object-cover transition-all duration-300 group-hover:brightness-110`}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${name}&background=${level === 'grand' ? '000000' : 'FFDE59'}&color=${level === 'grand' ? 'FFDE59' : '000000'}&bold=true&size=128`;
            }}
          />
          {/* Online indicator */}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${level === 'grand' ? 'bg-green-500' : level === 'chief' ? 'bg-blue-500' : 'bg-gray-400'} shadow-lg`}></div>
        </div>
        
        <h3 className={`${styles.nameSize} transition-colors duration-300 group-hover:text-opacity-80`}>
          {name}
        </h3>
        <p className={styles.roleSize}>
          {role}
        </p>
      </div>

      {/* Social Links */}
      {(linkedin || twitter || instagram) && (
        <div className={styles.socialContainer}>
          <div className="flex justify-center space-x-2 sm:space-x-3">
            {linkedin && (
              <a 
                href={linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`group/social flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 transform hover:scale-110 ${
                  level === 'grand'
                    ? 'bg-white hover:bg-blue-600 text-gray-600 hover:text-white shadow-md border border-gray-200'
                    : level === 'chief'
                    ? 'bg-white hover:bg-blue-600 text-gray-600 hover:text-white shadow-md border border-gray-200'
                    : 'bg-white hover:bg-blue-600 text-gray-600 hover:text-white shadow-sm border border-gray-200'
                }`}
                title="LinkedIn Profile"
              >
                <FaLinkedinIn size={level === 'member' ? 12 : 16} className="transition-transform duration-300 group-hover/social:scale-110" />
              </a>
            )}
            {twitter && (
              <a 
                href={twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`group/social flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 transform hover:scale-110 ${
                  level === 'grand'
                    ? 'bg-white hover:bg-black text-gray-600 hover:text-white shadow-md border border-gray-200'
                    : level === 'chief'
                    ? 'bg-white hover:bg-black text-gray-600 hover:text-white shadow-md border border-gray-200'
                    : 'bg-white hover:bg-black text-gray-600 hover:text-white shadow-sm border border-gray-200'
                }`}
                title="X (Twitter) Profile"
              >
                <FaXTwitter size={level === 'member' ? 12 : 16} className="transition-transform duration-300 group-hover/social:scale-110" />
              </a>
            )}
            {instagram && (
              <a 
                href={instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`group/social flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 transform hover:scale-110 ${
                  level === 'grand'
                    ? 'bg-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 text-gray-600 hover:text-white shadow-md border border-gray-200'
                    : level === 'chief'
                    ? 'bg-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 text-gray-600 hover:text-white shadow-md border border-gray-200'
                    : 'bg-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 text-gray-600 hover:text-white shadow-sm border border-gray-200'
                }`}
                title="Instagram Profile"
              >
                <FaInstagram size={level === 'member' ? 12 : 16} className="transition-transform duration-300 group-hover/social:scale-110" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Hover effect overlay */}
      <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none ${
        level === 'grand' ? 'bg-black' : level === 'chief' ? 'bg-[#FFDE59]' : 'bg-gray-900'
      }`}></div>
    </MotionDiv>
  );
};

const Team = () => {
  // Team data - organized hierarchically
  const grandPathfinder = {
    name: "Vatsal Khanna",
    role: "Grand Pathfinder",
    linkedin: "https://www.linkedin.com/in/vatsalkhanna/",
    twitter: "https://x.com/vatsalkhanna55",
    instagram: "https://www.instagram.com/vatsalkhanna5/",
  };

  const departments = [
    {
      name: "Finance",
      chief: {
        name: "Rhythm Goyal",
        role: "Chief Finance Pathfinder",
        linkedin: "https://www.linkedin.com/in/rhythm-goyal-a14a53263/",
        twitter: "https://x.com/RhythmGoyal90",
      },
      team: [
        {
          name: "Pratham Andotra",
          role: "Finance Pathfinder",
          linkedin: "https://www.linkedin.com/in/prathamandotra/",
          twitter: "https://x.com/thisisPrathamA",
        },
        {
          name: "Tanveer Singh",
          role: "Finance Pathfinder",
          linkedin: "https://www.linkedin.com/in/tanveer-singh-a4160126b/",
          twitter: "",
        }
      ]
    },
    {
      name: "AI",
      chief: {
        name: "Ratinderdeep Singh",
        role: "Chief AI Pathfinder",
        linkedin: "https://www.linkedin.com/in/ratinderdeepsingh/",
        twitter: "https://x.com/Ratinder_999",
      },
      team: [
        {
          name: "Adesh Anurag",
          role: "AI Pathfinder",
          linkedin: "https://www.linkedin.com/in/adesh-anurag-176a44254/",
          twitter: "https://x.com/adexxhhh",
        },
        {
          name: "Kunal",
          role: "AI Pathfinder",
          linkedin: "",
          twitter: "",
        },
        {
          name: "Achintya",
          role: "AI Pathfinder",
          linkedin: "https://www.linkedin.com/in/achintyasharma47/",
          twitter: "",
        },
      ]
    },
    {
      name: "Creative",
      chief: {
        name: "Chahat Kesharwani",
        role: "Chief Creative Pathfinder",
        linkedin: "https://linkedin.com/in/chahatkesharwani",
        twitter: "https://x.com/chahatkesh",
        instagram: "https://instagram.com/chahat.kesharwanii",
      },
      team: [
        {
          name: "Rishi Ahuja",
          role: "Creative Pathfinder",
          linkedin: "https://www.linkedin.com/in/rishi-ahuja-b1a224310/",
          twitter: "https://x.com/Rishi2220",
        },
        {
          name: "Samaira Wahi",
          role: "Creative Pathfinder",
          linkedin: "https://www.linkedin.com/in/samaira-wahi-91678a349/",
          twitter: "",
        },
      ]
    }
  ];

  return (
    <MotionSection 
      id="team" 
      className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-3 sm:px-4 max-w-6xl relative z-10">
        {/* Header Section */}
        <MotionDiv 
          className="text-center mb-12 sm:mb-16 md:mb-20 max-w-4xl mx-auto px-2"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <MotionH2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Meet the Pathfinders
          </MotionH2>
          
          <MotionP 
            className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
          Visionary leaders and dedicated team members driving OpenLearn's mission forward with passion and expertise.
          </MotionP>
        </MotionDiv>

        {/* Compact Hierarchy Layout */}
        <MotionDiv 
          className="space-y-8 sm:space-y-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {/* Level 1: Grand Pathfinder */}
          <MotionDiv 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <MotionDiv 
              className="flex items-center justify-center space-x-2 mb-4 sm:mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <Crown size={18} className="text-[#FFDE59] sm:hidden" />
              <Crown size={20} className="text-[#FFDE59] hidden sm:block" />
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Grand Pathfinder</h3>
            </MotionDiv>
            <div className="flex justify-center">
              <div className="w-full max-w-sm sm:max-w-md">
                <TeamMemberCard {...grandPathfinder} level="grand" />
              </div>
            </div>
          </MotionDiv>

          {/* Level 2: Chief Pathfinders */}
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <div className="flex items-center justify-center space-x-2 mb-4 sm:mb-6">
              <Star size={16} className="text-[#FFDE59] sm:hidden" />
              <Star size={18} className="text-[#FFDE59] hidden sm:block" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Chief Pathfinders</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {departments.map((dept, index) => (
                <TeamMemberCard key={index} {...dept.chief} level="chief" />
              ))}
            </div>
          </MotionDiv>

          {/* Level 3: Pathfinders */}
          <MotionDiv 
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.8 }}
          >
            <div className="flex items-center justify-center space-x-2 mb-4 sm:mb-6">
              <Users size={16} className="text-[#FFDE59] sm:hidden" />
              <Users size={18} className="text-[#FFDE59] hidden sm:block" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Pathfinders</h3>
            </div>
            
            {(() => {
              // Flatten all team members from all departments
              const allTeamMembers = departments.reduce((acc, dept) => {
                return [...acc, ...dept.team];
              }, []);
              
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-6xl mx-auto">
                  {allTeamMembers.map((member, index) => (
                    <TeamMemberCard key={index} {...member} level="member" />
                  ))}
                </div>
              );
            })()}
          </MotionDiv>
        </MotionDiv>
      </div>
    </MotionSection>
  );
};

export default Team;