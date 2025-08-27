import React from 'react';
import { BookOpen, Star, Users, ArrowRight, Sparkles } from 'lucide-react';

const WelcomeBanner = ({ user, onExploreClick }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#FFDE59]/90 via-[#FFD700]/80 to-[#FFDE59]/90 rounded-2xl sm:rounded-3xl border border-[#FFDE59]/40 p-8 sm:p-10 lg:p-12">
      {/* Apple-style subtle pattern overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-6 right-6 w-40 h-40 bg-white/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-6 left-6 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12">
        {/* Left Content */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-5">
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-center shadow-lg border border-white/40">
              <BookOpen size={32} className="text-black" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-black tracking-tight leading-tight">
                Welcome back, {user?.name?.split(' ')[0] || 'Learner'}! 
              </h2>
              <p className="text-black/70 text-base sm:text-lg leading-relaxed font-light mt-2">
                Ready to continue your learning journey with specialized leagues?
              </p>
            </div>
          </div>

          {/* Apple-style Feature Pills */}
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <div className="flex items-center gap-3 bg-white/40 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/50 transition-all duration-300 hover:bg-white/50">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <BookOpen className="text-white" size={16} />
              </div>
              <span className="text-sm sm:text-base font-medium text-black">Learn at Your Pace</span>
            </div>
            
            <div className="flex items-center gap-3 bg-white/40 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/50 transition-all duration-300 hover:bg-white/50">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Users className="text-white" size={16} />
              </div>
              <span className="text-sm sm:text-base font-medium text-black">Join Leagues</span>
            </div>
            
            <div className="flex items-center gap-3 bg-white/40 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/50 transition-all duration-300 hover:bg-white/50">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Star className="text-white" size={16} />
              </div>
              <span className="text-sm sm:text-base font-medium text-black">Earn Achievements</span>
            </div>
          </div>
        </div>

        {/* Right CTA - Apple Style */}
        <div className="lg:flex-shrink-0">
          <button
            onClick={onExploreClick}
            className="group bg-black hover:bg-gray-800 text-white px-8 py-4 sm:px-10 sm:py-5 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 inline-flex items-center gap-4 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 w-full lg:w-auto justify-center"
          >
            <Sparkles size={20} className="group-hover:scale-110 transition-transform duration-300" />
            <span>Explore Leagues</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
