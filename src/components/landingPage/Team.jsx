import React from 'react';
import { FaLinkedinIn, FaXTwitter, FaInstagram } from 'react-icons/fa6';
import { Users, ArrowRight } from 'lucide-react';
import { MotionDiv, MotionSection } from '../common/MotionWrapper';
import SectionHeader from '../common/SectionHeader';
import teamData from '../../data/teamData';
import { useNavigate } from 'react-router-dom';

// Apple-Style Team Member Card
const TeamMemberCard = ({ name, description, linkedin, twitter, instagram }) => {
  return (
    <MotionDiv 
      className="group relative h-full bg-white rounded-3xl overflow-hidden shadow-sm transition-all duration-500 ease-out border border-gray-100/50 flex flex-col"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
      }}
    >
      {/* Large Profile Image */}
      <MotionDiv 
        className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
        initial={{ opacity: 0, scale: 1.1 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <img
          src={`/team/${name.toLowerCase().replace(/\s+/g, '-')}.jpg`}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${name}&background=FFDE59&color=000000&bold=true&size=400`;
          }}
        />
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </MotionDiv>

      {/* Content Section */}
      <MotionDiv 
        className="p-6 flex flex-col flex-grow"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Name */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">
            {name}
          </h3>
        </div>

        {/* Description */}
        <MotionDiv
          className="flex-grow"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div 
            className="text-gray-600 leading-relaxed text-sm mb-4"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </MotionDiv>

        {/* Social Links */}
        {(linkedin || twitter || instagram) && (
          <div 
            className="flex gap-3 pt-3 border-t border-gray-100 mt-auto"
            style={{ pointerEvents: 'auto', zIndex: 10, position: 'relative' }}
          >
            {linkedin && linkedin.trim() && (
              <a 
                href={linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md border border-blue-100 cursor-pointer"
                title="LinkedIn Profile"
                style={{ pointerEvents: 'auto' }}
                onClick={() => window.open(linkedin, '_blank')}
              >
                <FaLinkedinIn className="w-4 h-4 pointer-events-none" />
              </a>
            )}
            {twitter && twitter.trim() && (
              <a 
                href={twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md border border-gray-200 cursor-pointer"
                title="Twitter Profile"
                style={{ pointerEvents: 'auto' }}
                onClick={() => window.open(twitter, '_blank')}
              >
                <FaXTwitter className="w-4 h-4 pointer-events-none" />
              </a>
            )}
            {instagram && instagram.trim() && (
              <a 
                href={instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-600 hover:text-pink-700 transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md border border-pink-100 cursor-pointer"
                title="Instagram Profile"
                style={{ pointerEvents: 'auto' }}
                onClick={() => window.open(instagram, '_blank')}
              >
                <FaInstagram className="w-4 h-4 pointer-events-none" />
              </a>
            )}
          </div>
        )}
      </MotionDiv>

      {/* Subtle border highlight on hover */}
      <div className="absolute inset-0 rounded-3xl ring-1 ring-gray-200/50 group-hover:ring-[#FFDE59]/30 transition-all duration-500"></div>
    </MotionDiv>
  );
};

// Community Card Component
const CommunityCard = ({ onClick }) => {
  return (
    <MotionDiv 
      className="group relative bg-gradient-to-br from-[#FFDE59] to-[#FFD93D] rounded-3xl overflow-hidden shadow-sm transition-all duration-500 ease-out border border-[#FFDE59]/50 cursor-pointer"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
      }}
      onClick={onClick}
    >
      {/* Simplified Layout */}
      <div className="p-6 md:p-8 text-center">
        {/* Content Section */}
        <MotionDiv 
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Title */}
          <h3 className="text-xl md:text-2xl font-semibold text-black mb-2 tracking-tight">
            Find Your Pathfinders
          </h3>

          {/* Description */}
          <p className="text-black/80 leading-relaxed text-sm md:text-base mb-4">
            To find all your pathfinders of every league, <strong>Click</strong> and discover your learning community!
          </p>

          {/* Call to Action */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 text-[#B8860B] font-medium text-sm group-hover:text-[#8B6914] transition-colors duration-300">
              <span>Join Community</span>
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </MotionDiv>
      </div>

      {/* Subtle border highlight on hover */}
      <div className="absolute inset-0 rounded-3xl ring-1 ring-[#FFDE59]/50 group-hover:ring-[#FFDE59]/80 transition-all duration-500"></div>
    </MotionDiv>
  );
};

const Team = () => {
  const navigate = useNavigate();

  const handleCommunityClick = () => {
    navigate('/community');
  };

  return (
    <MotionSection 
      className="py-20 lg:py-32 bg-gray-50/50"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <SectionHeader 
          title="Meet the Team"
          description="Meet the hearts and minds who believe in <strong>your potential</strong>. We're not just building a platform - we're nurturing a community where every learner's journey matters, every question sparks growth, and every achievement is celebrated together."
        />

        {/* Team Grid - 4-column layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {teamData.team.map((member, index) => (
            <MotionDiv
              key={member.name}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.15, 
                ease: [0.25, 0.46, 0.45, 0.94] 
              }}
            >
              <TeamMemberCard {...member} />
            </MotionDiv>
          ))}
        </div>
          
        {/* Community Card - Full Width */}
        <div className="mt-8 lg:mt-12 max-w-7xl mx-auto">
          <MotionDiv
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ 
              duration: 0.8, 
              delay: teamData.team.length * 0.15, 
              ease: [0.25, 0.46, 0.45, 0.94] 
            }}
          >
            <CommunityCard onClick={handleCommunityClick} />
          </MotionDiv>
        </div>
      </div>
    </MotionSection>
  );
};

export default Team;
