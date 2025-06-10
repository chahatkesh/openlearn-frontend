import React from 'react';
import { BookOpen, Star, Users, ArrowRight } from 'lucide-react';

const WelcomeBanner = ({ user, onExploreClick }) => {
  return (
    <div className="bg-gradient-to-r from-[#FFDE59] to-[#FFD700] rounded-lg shadow-sm p-8 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
          <BookOpen size={32} className="text-gray-800" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Welcome to OpenLearn, {user?.name?.split(' ')[0] || 'Learner'}! 🎉
        </h2>
        
        <p className="text-gray-800 mb-6 leading-relaxed">
          You're all set to begin your learning journey! OpenLearn offers specialized leagues 
          designed to help you master new skills and advance your career.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white bg-opacity-30 rounded-lg p-4">
            <BookOpen className="text-gray-800 mx-auto mb-2" size={24} />
            <h4 className="font-semibold text-gray-900 mb-1">Learn at Your Pace</h4>
            <p className="text-sm text-gray-800">Progress through structured content designed for real-world application</p>
          </div>
          
          <div className="bg-white bg-opacity-30 rounded-lg p-4">
            <Users className="text-gray-800 mx-auto mb-2" size={24} />
            <h4 className="font-semibold text-gray-900 mb-1">Join Communities</h4>
            <p className="text-sm text-gray-800">Connect with fellow learners in cohorts and leagues</p>
          </div>
          
          <div className="bg-white bg-opacity-30 rounded-lg p-4">
            <Star className="text-gray-800 mx-auto mb-2" size={24} />
            <h4 className="font-semibold text-gray-900 mb-1">Earn Achievements</h4>
            <p className="text-sm text-gray-800">Get badges and certificates as you complete learning milestones</p>
          </div>
        </div>

        <button
          onClick={onExploreClick}
          className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors inline-flex items-center space-x-2"
        >
          <span>Explore Available Leagues</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default WelcomeBanner;
