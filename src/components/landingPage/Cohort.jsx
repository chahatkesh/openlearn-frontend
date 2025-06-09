import React from "react";
import { Lock, ArrowRight, Award, Users } from "lucide-react";

const LeagueCard = ({ 
  title, 
  description, 
  poweredBy, 
  certification, 
  isLocked = false, 
  prerequisite = null, 
  accentColor = "#4F46E5", // Default blue color
  iconColor = "#FFDE59" // Using the theme color
}) => {
  return (
    <div className={`rounded-lg p-6 border-2 border-${isLocked ? 'gray-300' : 'black'} h-full relative transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}
         style={{ opacity: isLocked ? 0.8 : 1 }}>
      {/* League Status */}
      {isLocked && (
        <div className="absolute -top-3 right-3 bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium flex items-center">
          <Lock size={14} className="mr-1" /> Locked
        </div>
      )}
      {!isLocked && (
        <div className="absolute -top-3 right-3 bg-black text-white px-3 py-1 rounded-full text-xs font-medium">
          Open
        </div>
      )}

      {/* League Title */}
      <h3 className="text-xl font-bold mb-3 flex items-center" style={{ color: isLocked ? "#6B7280" : "#000000" }}>
        <span 
          className="inline-flex items-center justify-center rounded-full w-8 h-8 mr-2" 
          style={{ backgroundColor: isLocked ? "#D1D5DB" : iconColor }}>
          {title.includes("ML") ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="black" strokeWidth="2"/>
              <path d="M12 8V16M8 12H16" stroke="black" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </span>
        {title} League
      </h3>

      {/* League Description */}
      <p className="mb-5 text-gray-600">{description}</p>

      {/* Prerequisites */}
      {prerequisite && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-100">
          <p className="text-sm text-gray-600 flex items-center">
            <span className="mr-1 text-gray-400">⚠️</span>
            <strong>Prerequisite:</strong> {prerequisite}
          </p>
        </div>
      )}

      {/* Certification & Club Info */}
      <div className="flex flex-col space-y-2 mt-auto">
        <div className="flex items-center text-sm">
          <Award size={16} className="mr-2" style={{ color: accentColor }} />
          <span className="font-medium">{certification}</span>
        </div>
        <div className="flex items-center text-sm">
          <Users size={16} className="mr-2" style={{ color: accentColor }} />
          <span className="text-gray-600">Powered by: {poweredBy}</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        className={`mt-5 w-full py-2 rounded-md font-medium text-sm transition-all duration-300 ${
          isLocked 
            ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
            : "bg-black text-white hover:bg-gray-800 active:scale-95"
        }`}
        disabled={isLocked}
      >
        {isLocked ? "Complete Prerequisites" : "Join League"}
      </button>
    </div>
  );
};

const Cohort = () => {
  return (
    <section id="cohort" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Cohort 1.0 – Leagues</h2>
          <p className="text-lg text-gray-600 mb-6">
            Gamify your learning journey by exploring our skill-focused leagues in this cohort.
          </p>
          <p className="text-gray-600">
            Each league represents a structured learning track designed to build your skills progressively. 
            Complete leagues to earn certificates and unlock advanced specializations in your learning journey.
          </p>
        </div>

        {/* Leagues Display with Connection */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-1/2 left-1/2 w-24 h-2 -translate-y-1/2 -translate-x-full ml-8">
            <div className="w-full h-full bg-gray-200 rounded-full relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1/2 bg-black"></div>
              <div className="absolute top-0 left-1/2 h-full w-1/2 bg-dashed-pattern"></div>
            </div>
            <ArrowRight size={20} className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 text-black" />
          </div>

          {/* Leagues Grid */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            {/* ML League */}
            <LeagueCard
              title="ML"
              description="A hands-on, community-driven journey through Machine Learning fundamentals and applications."
              poweredBy="OpenLearn ML Team"
              certification="ML League Certificate"
              prerequisite="Basic Python knowledge required."
              accentColor="#4F46E5" // Blue
              iconColor="#FFDE59" // Theme yellow
            />

            {/* Finance League */}
            <LeagueCard
              title="Finance"
              description="A finance foundation built for students who want to understand money, markets, and finance."
              poweredBy="FinNest – Finance Club of NITJ"
              certification="Specialisation Certificate in ML + Finance"
              prerequisite="Completion of ML League required."
              isLocked={true}
              accentColor="#047857" // Green
              iconColor="#FFDE59" // Theme yellow
            />
          </div>

          {/* Specialisation Tag */}
          <div className="hidden md:block absolute bottom-0 right-0 transform translate-y-full mt-4">
            <div className="bg-[#FFDE59] text-black px-4 py-2 rounded-full text-sm font-medium inline-flex items-center">
              <Award size={16} className="mr-2" />
              Specialisation Unlocks Here
            </div>
          </div>
          
          {/* Mobile Specialisation Tag */}
          <div className="md:hidden text-center mt-6">
            <div className="bg-[#FFDE59] text-black px-4 py-2 rounded-full text-sm font-medium inline-flex items-center">
              <Award size={16} className="mr-2" />
              Specialisation Unlocks Here
            </div>
          </div>
        </div>

        {/* League Completion Flow (Visual Aid) */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#FFDE59]">
              <span className="text-black font-bold text-xl">1</span>
            </div>
            <div className="hidden md:block w-16 border-t-2 border-dashed border-gray-300"></div>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-200">
              <span className="text-gray-600 font-bold text-xl">2</span>
            </div>
            <div className="hidden md:block w-16 border-t-2 border-dashed border-gray-300"></div>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100">
              <Award size={24} className="text-black" />
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-center mt-3 text-sm">
            <div className="text-center md:w-48">Complete ML League</div>
            <div className="text-center md:w-48 mt-4 md:mt-0">Complete Finance League</div>
            <div className="text-center md:w-48 mt-4 md:mt-0">Earn Specialisation</div>
          </div>
        </div>

        {/* Additional CSS for dashed pattern */}
        <style jsx>{`
          .bg-dashed-pattern {
            background-image: repeating-linear-gradient(90deg, #000, #000 5px, transparent 5px, transparent 10px);
          }
        `}</style>
      </div>
    </section>
  );
};

export default Cohort;