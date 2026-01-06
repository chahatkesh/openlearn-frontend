import React from 'react';
import { BookOpen, ArrowRight, Sparkles, Target, TrendingUp } from 'lucide-react';

const WelcomeBanner = ({ user, onExploreClick }) => {
  return (
    <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-gray-200/50 p-8 sm:p-12 lg:p-16">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FFDE59]/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-50 to-transparent rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Welcome, {user?.name?.split(' ')[0] || 'Learner'}!
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Start your learning journey by joining a league. Track progress, complete resources, and level up your skills.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
          <div className="text-center p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Structured Learning</h3>
            <p className="text-sm text-gray-600">Organized content across modules and topics</p>
          </div>
          
          <div className="text-center p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-3">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Track Progress</h3>
            <p className="text-sm text-gray-600">Monitor completion and achievements</p>
          </div>
          
          <div className="text-center p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Level Up</h3>
            <p className="text-sm text-gray-600">Earn badges and climb the leaderboard</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={onExploreClick}
            className="group inline-flex items-center gap-3 bg-black hover:bg-gray-800 text-white px-8 py-4 sm:px-10 sm:py-5 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span>Browse Available Leagues</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          <p className="mt-4 text-sm text-gray-500">
            Get started in seconds • No credit card required
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
