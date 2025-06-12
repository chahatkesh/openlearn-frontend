import React from "react";
import { Lock, ArrowRight, Award, Users, Zap, TrendingUp } from "lucide-react";

const LeagueCard = ({ 
  title, 
  description, 
  poweredBy, 
  certification, 
  isLocked = false, 
  prerequisite = null, 
  accentColor = "#4F46E5",
  gradientFrom = "#667eea",
  gradientTo = "#764ba2"
}) => {
  return (
    <div className={`group relative rounded-2xl p-8 h-full transform transition-all duration-500 hover:scale-105 ${
      isLocked 
        ? 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-md' 
        : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg hover:shadow-2xl'
    }`}
         style={{ 
           opacity: isLocked ? 0.75 : 1,
           backdropFilter: 'blur(10px)'
         }}>
      
      {/* Animated background gradient overlay */}
      {!isLocked && (
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-all duration-500"
          style={{
            background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`
          }}
        />
      )}

      {/* League Status Badge */}
      {isLocked ? (
        <div className="absolute -top-4 right-4 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 px-4 py-2 rounded-full text-xs font-semibold flex items-center shadow-md animate-pulse">
          <Lock size={14} className="mr-2" />
          Locked
        </div>
      ) : (
        <div className="absolute -top-4 right-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-md">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            Open
          </div>
        </div>
      )}

      {/* League Icon & Title */}
      <div className="flex items-center mb-6">
        <h3 className={`text-2xl font-bold transition-colors duration-300 ${
          isLocked ? 'text-gray-500' : 'text-gray-800 group-hover:text-gray-900'
        }`}>
          {title} League
        </h3>
      </div>

      {/* League Description */}
      <p className={`mb-6 leading-relaxed ${
        isLocked ? 'text-gray-500' : 'text-gray-600'
      }`}>
        {description}
      </p>

      {/* Prerequisites */}
      {prerequisite && (
        <div className={`mb-6 p-4 rounded-lg border-l-4 transition-all duration-300 ${
          isLocked 
            ? 'bg-gray-50 border-gray-300' 
            : 'bg-amber-50 border-amber-400 hover:bg-amber-100'
        }`}>
          <p className="text-sm flex items-center">
            <span className="mr-2 text-amber-500 text-lg">⚠️</span>
            <span>
              <strong className={`${
          isLocked 
            ? 'text-gray-500' 
            : 'text-amber-700'
        }`}>Prerequisite:</strong>
              <span className={isLocked ? 'text-gray-600' : 'text-amber-600'}>
                {prerequisite}
              </span>
            </span>
          </p>
        </div>
      )}

      {/* Certification & Club Info */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm group/cert">
          <div 
            className="p-2 rounded-lg mr-3 transition-all duration-300 group-hover/cert:scale-110"
            style={{ backgroundColor: `${accentColor}20` }}
          >
            <Award size={16} style={{ color: accentColor }} />
          </div>
          <span className={`font-medium ${isLocked ? 'text-gray-500' : 'text-gray-700'}`}>
            {certification}
          </span>
        </div>
        <div className="flex items-center text-sm group/club">
          <div 
            className="p-2 rounded-lg mr-3 transition-all duration-300 group-hover/club:scale-110"
            style={{ backgroundColor: `${accentColor}20` }}
          >
            <Users size={16} style={{ color: accentColor }} />
          </div>
          <span className={isLocked ? 'text-gray-500' : 'text-gray-600'}>
            Powered by: <span className="font-medium">{poweredBy}</span>
          </span>
        </div>
      </div>      
    </div>
  );
};

const Cohort = () => {
  return (
    <section id="cohort" className="py-20 pb-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent">
            Cohort 1.0 – Leagues
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Gamify your learning journey by exploring our skill-focused leagues in this cohort.
          </p>
        </div>

        {/* Leagues Display with Enhanced Connection */}
        <div className="relative max-w-6xl mx-auto">
          {/* Enhanced Connection Flow */}
          <div className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-12">
            <div className="flex items-center">
              {/* Progress Line */}
              <div className="w-32 h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-gray-300 rounded-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
              </div>
            </div>
          </div>

          {/* Leagues Grid */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* ML League */}
            <div className="transform transition-all duration-700 hover:scale-105">
              <LeagueCard
                title="ML"
                description="A hands-on, community-driven journey through Machine Learning fundamentals and applications with real-world projects."
                poweredBy="OpenLearn ML Team"
                certification="ML League Certificate"
                prerequisite="Basic Python knowledge required."
                accentColor="#3B82F6"
                gradientFrom="#3B82F6"
                gradientTo="#1D4ED8"
              />
            </div>

            {/* Finance League */}
            <div className="transform transition-all duration-700 hover:scale-105">
              <LeagueCard
                title="Finance"
                description="A comprehensive finance foundation built for students who want to understand money, markets, and modern financial systems."
                poweredBy="FinNest – Finance Club of NITJ"
                certification="Specialisation Certificate in ML + Finance"
                prerequisite="Completion of ML League required."
                isLocked={true}
                accentColor="#777777"
                gradientFrom="#059669"
                gradientTo="#047857"
              />
            </div>
          </div>

          {/* Enhanced Specialisation Tags */}
          <div className="hidden lg:block absolute -bottom-8 right-8 transform">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 py-3 rounded-2xl text-sm font-bold inline-flex items-center shadow-lg animate-pulse">
              <Award size={18} className="mr-2" />
              <span>Specialisation Unlocks Here</span>
              <div className="ml-2 w-2 h-2 bg-white rounded-full animate-ping"></div>
            </div>
          </div>
          
          {/* Mobile Specialisation Tag */}
          <div className="lg:hidden text-center mt-8">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 py-3 rounded-2xl text-sm font-bold inline-flex items-center shadow-lg">
              <Award size={18} className="mr-2" />
              <span>Specialisation Unlocks Here</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </section>
  );
};

export default Cohort;