import React from 'react';
import { BookOpen, Star, Users, ArrowRight } from 'lucide-react';

const WelcomeBanner = ({ user, onExploreClick }) => {
  return (
    <div className="bg-gradient-to-br from-[#FFDE59]/80 via-[#FFD700]/70 to-[#FFC700]/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-8 text-center relative overflow-hidden">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      
      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg border border-white/40 transform transition-all duration-300 hover:scale-105">
          <BookOpen size={32} className="text-gray-800" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
          Welcome to OpenLearn, {user?.name?.split(' ')[0] || 'Learner'}! 🎉
        </h2>
        
        <p className="text-gray-800/90 mb-8 leading-relaxed text-lg font-medium">
          You're all set to begin your learning journey! OpenLearn offers specialized leagues 
          designed to help you master new skills and advance your career.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="text-white" size={20} />
            </div>
            <h4 className="font-bold text-gray-900 mb-2 text-lg">Learn at Your Pace</h4>
            <p className="text-sm text-gray-700 leading-relaxed">Progress through structured content designed for real-world application</p>
          </div>
          
          <div className="group bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <Users className="text-white" size={20} />
            </div>
            <h4 className="font-bold text-gray-900 mb-2 text-lg">Join Communities</h4>
            <p className="text-sm text-gray-700 leading-relaxed">Connect with fellow learners in cohorts and leagues</p>
          </div>
          
          <div className="group bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <Star className="text-white" size={20} />
            </div>
            <h4 className="font-bold text-gray-900 mb-2 text-lg">Earn Achievements</h4>
            <p className="text-sm text-gray-700 leading-relaxed">Get badges and certificates as you complete learning milestones</p>
          </div>
        </div>

        <button
          onClick={onExploreClick}
          className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 inline-flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-gray-700/50"
        >
          <span className="text-lg">Explore Available Leagues</span>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};

export default WelcomeBanner;
