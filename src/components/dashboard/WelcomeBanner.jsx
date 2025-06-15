import React from 'react';
import { BookOpen, Star, Users, ArrowRight, Sparkles } from 'lucide-react';

const WelcomeBanner = ({ user, onExploreClick }) => {
  return (
    <div className="bg-gradient-to-r from-[#FFDE59] via-[#FFD700] to-[#FFDE59] rounded-xl shadow-lg border border-yellow-200/50 p-6 relative overflow-hidden">
      {/* Decorative Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/15 rounded-full blur-xl"></div>
      </div>
      
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Content */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center justify-center shadow-md border border-white/30">
              <BookOpen size={28} className="text-gray-800" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                Welcome back, {user?.name?.split(' ')[0] || 'Learner'}! 🎉
              </h2>
              <p className="text-gray-800/80 text-sm leading-relaxed">
                Ready to continue your learning journey with specialized leagues?
              </p>
            </div>
          </div>

          {/* Compact Feature Pills */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-4 py-2 border border-white/40">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <BookOpen className="text-white" size={12} />
              </div>
              <span className="text-sm font-medium text-gray-800">Learn at Your Pace</span>
            </div>
            
            <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-4 py-2 border border-white/40">
              <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <Users className="text-white" size={12} />
              </div>
              <span className="text-sm font-medium text-gray-800">Join Leagues</span>
            </div>
            
            <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-4 py-2 border border-white/40">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Star className="text-white" size={12} />
              </div>
              <span className="text-sm font-medium text-gray-800">Earn Achievements</span>
            </div>
          </div>
        </div>

        {/* Right CTA */}
        <div className="lg:flex-shrink-0">
          <button
            onClick={onExploreClick}
            className="group bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 inline-flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-gray-700/50 w-full lg:w-auto justify-center"
          >
            <Sparkles size={18} className="group-hover:scale-110 transition-transform duration-300" />
            <span>Explore Leagues</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
