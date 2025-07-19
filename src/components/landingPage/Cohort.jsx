import React, { useState, useEffect } from "react";
import { ArrowRight, Award, Users, BookOpen, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { MotionDiv, MotionSection, MotionH2, MotionP } from '../common/MotionWrapper';
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.openlearn.org.in';

// Fetch cohorts structure from API
const fetchCohortsStructure = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/public/cohorts-structure`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'API request failed');
    }

    return result;
  } catch (error) {
    console.error('Error fetching cohorts structure:', error);
    throw error;
  }
};

const LeagueCard = ({ league, accentColor }) => {
  const weeks = league.weeks || [];
  
  return (
    <MotionDiv 
      className="group relative rounded-2xl p-6 md:p-8 h-full bg-white border-2 border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ 
        y: -5,
        borderColor: '#FFDE59',
        transition: { duration: 0.3 }
      }}
    >
      {/* League Status Badge */}
      <div className="absolute -top-3 right-4 bg-[#FFDE59] text-black px-4 py-2 rounded-full text-xs font-bold">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-black rounded-full mr-2 animate-pulse"></div>
          Ongoing
        </div>
      </div>

      {/* League Icon & Title */}
      <MotionDiv 
        className="mb-6"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center mb-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
            style={{ backgroundColor: `${accentColor}15` }}
          >
            <BookOpen size={24} style={{ color: accentColor }} />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
              {league.name}
            </h3>
          </div>
        </div>
      </MotionDiv>

      {/* League Description */}
      <MotionP 
        className="mb-6 leading-relaxed text-gray-600 text-sm md:text-base"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {league.description}
      </MotionP>

      {/* Week Count Badge */}
      <MotionDiv 
        className="mb-6 inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gray-50 text-gray-700 border border-gray-200"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Calendar size={16} className="mr-2" />
        {weeks.length} Week{weeks.length !== 1 ? 's' : ''}
      </MotionDiv>

      {/* Weeks List */}
      {weeks.length > 0 && (
        <MotionDiv 
          className="space-y-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.5, 
            delay: 0.5,
            staggerChildren: 0.1
          }}
        >
          <h4 className="text-sm font-semibold mb-3 text-gray-700">
            What's Going to be Covered:
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            {weeks
              .sort((a, b) => a.order - b.order)
              .slice(0, 3) // Show only first 5 weeks to prevent overflow
              .map((week, index) => (
                <MotionDiv 
                  key={week.id}
                  className="flex items-start text-sm group/week text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileHover={{ x: 3 }}
                >
                  <CheckCircle size={14} className="mt-1 mr-3 flex-shrink-0 text-[#FFDE59]" />
                  <div className="flex-1">
                    <span className="font-medium">
                      {week.name}
                    </span>
                  </div>
                </MotionDiv>
              ))}
            {weeks.length > 3 && (
              <div className="text-xs text-gray-500 italic">
                +{weeks.length - 3} more weeks...
              </div>
            )}
          </div>
        </MotionDiv>
      )}

      {/* League Stats */}
      <MotionDiv 
        className="flex items-center justify-between pt-4 border-t border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-center text-sm">
          <Users size={16} className="mr-2 text-gray-500" />
          <span className="text-gray-600 font-medium">Community</span>
        </div>
        <div className="flex items-center text-sm">
          <Award size={16} className="mr-2 text-[#FFDE59]" />
          <span className="text-gray-700 font-medium">Certificate</span>
        </div>
      </MotionDiv>
    </MotionDiv>
  );
};

const Cohort = () => {
  const [cohortsData, setCohortsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔄 Cohort component mounted - starting data fetch...');
    
    const loadCohortsData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('📡 Fetching cohorts data from API...');
        
        const response = await fetchCohortsStructure();
        console.log('✅ API Response received:', response);
        
        if (response && response.data && response.data.length > 0) {
          console.log('📊 Setting cohorts data:', response.data[0]);
          setCohortsData(response);
        } else {
          console.warn('⚠️ No cohort data found in response');
          setError('No cohort data available');
        }
      } catch (err) {
        console.error('❌ Failed to fetch cohorts data:', err);
        setError(err.message || 'Failed to load cohort data');
      } finally {
        setLoading(false);
        console.log('🏁 Loading complete');
      }
    };

    loadCohortsData();
  }, []);

  console.log('🎯 Render state - Loading:', loading, 'Error:', error, 'Data:', !!cohortsData);

  // Loading state
  if (loading) {
    console.log('⏳ Rendering loading state...');
    return (
      <MotionSection 
        id="cohort" 
        className="py-16 md:py-20 lg:py-24 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 border-4 border-[#FFDE59] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Learning Paths</h3>
            <p className="text-gray-600">Fetching the latest learning opportunities for you...</p>
          </div>
        </div>
      </MotionSection>
    );
  }

  // Error state
  if (error) {
    console.log('❌ Rendering error state:', error);
    return (
      <MotionSection 
        id="cohort" 
        className="py-16 md:py-20 lg:py-24 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-2xl p-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle size={32} className="text-red-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 mb-6">
              We couldn't load the learning paths. Please try again.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </MotionSection>
    );
  }

  // Get the first cohort
  const cohort = cohortsData?.data?.[0];
  console.log('🏆 Cohort data to render:', cohort);
  
  if (!cohort) {
    console.log('📭 No cohort found - rendering empty state');
    return (
      <MotionSection 
        id="cohort" 
        className="py-16 md:py-20 lg:py-24 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-md mx-auto bg-gray-50 border border-gray-200 rounded-2xl p-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <BookOpen size={32} className="text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Active Cohorts</h3>
            <p className="text-gray-600">
              We're preparing exciting learning opportunities. Check back soon!
            </p>
          </div>
        </div>
      </MotionSection>
    );
  }

  const leagues = cohort.leagues || [];
  const totalWeeks = cohortsData?.meta?.totalWeeks || 0;
  
  console.log('🎮 Rendering cohort with', leagues.length, 'leagues and', totalWeeks, 'total weeks');

  // Define colors for different leagues
  const getLeagueColors = (leagueName) => {
    const name = leagueName.toLowerCase();
    if (name.includes('ml') || name.includes('machine learning')) {
      return "#3B82F6"; // Blue
    } else if (name.includes('finance')) {
      return "#059669"; // Green
    } else {
      return "#7C3AED"; // Purple
    }
  };

  return (
    <MotionSection 
      id="cohort" 
      className="py-16 md:py-20 lg:py-24 bg-white relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            duration: 0.6,
            staggerChildren: 0.2
          }
        }
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#000000" strokeWidth="1"/>
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FFDE59] rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-900 rounded-full opacity-5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header Section */}
        <MotionDiv 
          className="text-center mb-16 md:mb-20 max-w-4xl mx-auto"
          variants={{
            hidden: { opacity: 1, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.6,
                ease: "easeOut"
              }
            }
          }}
        >
          <MotionH2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900"
          >
            {cohort.name} – Learning Leagues
          </MotionH2>
          
          <MotionP 
            className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto"
          >
            {cohort.description}
          </MotionP>

          {/* Enhanced Stats */}
          <MotionDiv className="flex items-center justify-center flex-wrap gap-4 md:gap-6">
            <div className="flex cursor-pointer items-center space-x-2 bg-gray-50 hover:bg-[#FFDE59] transition-colors duration-300 px-4 md:px-6 py-3 rounded-full border border-gray-200 group">
              <BookOpen size={18} className="text-gray-700 group-hover:text-black transition-colors duration-300" />
              <span className="font-semibold text-gray-800 group-hover:text-black transition-colors duration-300">
                {leagues.length} Learning League{leagues.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex cursor-pointer items-center space-x-2 bg-gray-50 hover:bg-[#FFDE59] transition-colors duration-300 px-4 md:px-6 py-3 rounded-full border border-gray-200 group">
              <Award size={18} className="text-gray-700 group-hover:text-black transition-colors duration-300" />
              <span className="font-semibold text-gray-800 group-hover:text-black transition-colors duration-300">
                Certificates Available
              </span>
            </div>
          </MotionDiv>
        </MotionDiv>

        {/* Leagues Display */}
        <MotionDiv className="relative max-w-7xl mx-auto">
          {/* Leagues Grid */}
          <MotionDiv 
            className={`grid gap-8 md:gap-12 ${
              leagues.length === 1 
                ? 'max-w-2xl mx-auto' 
                : leagues.length === 2 
                ? 'lg:grid-cols-2 lg:gap-16' 
                : 'lg:grid-cols-2 xl:grid-cols-3'
            }`}
          >
            {leagues.map((league, index) => {
              const accentColor = getLeagueColors(league.name);
              
              return (
                <MotionDiv 
                  key={league.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <LeagueCard 
                    league={league} 
                    accentColor={accentColor}
                  />
                </MotionDiv>
              );
            })}
          </MotionDiv>
        </MotionDiv>

        {/* Bottom CTA Section */}
        <MotionDiv 
          className="text-center mt-16 md:mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border border-gray-200 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Your Learning Journey?
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              Join thousands of learners and start building skills that matter.
            </p>
            <button 
      className="bg-[#FFDE59] hover:bg-yellow-400 text-black font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
      onClick={() => {
        navigate('/signin');
      }}
    >
      Get Started Today
    </button>
          </div>
        </MotionDiv>
      </div>
    </MotionSection>
  );
};

export default Cohort;
