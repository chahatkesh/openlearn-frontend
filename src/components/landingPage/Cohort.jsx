import React, { useState, useEffect } from "react";
import { ArrowRight, Award, Users, BookOpen, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { MotionDiv, MotionSection, MotionH2, MotionP } from '../common/MotionWrapper';

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

const LeagueCard = ({ league }) => {
  const weeks = league.weeks || [];
  return (
    <MotionDiv 
      className="group relative rounded-2xl p-8 h-full bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg hover:shadow-2xl"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.05, 
        y: -10,
        transition: { duration: 0.3 }
      }}
    >
      {/* League Status Badge */}
      <div className="absolute -top-4 right-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-md">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
          Ongoing
        </div>
      </div>

      {/* League Icon & Title */}
      <MotionDiv 
        className="flex items-center mb-6"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-2xl font-bold transition-colors duration-300 text-gray-800 group-hover:text-gray-900">
          {league.name}
        </h3>
      </MotionDiv>

      {/* League Description */}
      <MotionP 
        className="mb-6 leading-relaxed text-gray-600"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {league.description}
      </MotionP>

      {/* Week Count Badge */}
      <MotionDiv 
        className="mb-6 inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200"
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
            Whats going on:
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {weeks
              .sort((a, b) => a.order - b.order)
              .map((week, index) => (
                <MotionDiv 
                  key={week.id}
                  className="flex items-start text-sm group/week text-gray-600"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileHover={{ x: 5 }}
                >
                  <div className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-blue-400" />
                  <div className="flex-1">
                    <span className="font-medium text-gray-700">
                      {week.name}
                    </span>
                  </div>
                </MotionDiv>
              ))}
          </div>
        </MotionDiv>
      )}

      {/* League Stats */}
      <MotionDiv 
        className="flex items-center justify-between pt-4 border-t border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-center text-sm">
          <Users size={16} className="mr-2 text-gray-500" />
          <span className="text-gray-600">Join League</span>
        </div>
        <div className="flex items-center text-sm">
          <Award size={16} className="mr-2 text-blue-500" />
          <span className="text-blue-600">Certificate</span>
        </div>
      </MotionDiv>
    </MotionDiv>
  );
};

const Cohort = () => {
  const [cohortsData, setCohortsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        className="py-20 pb-24 bg-gradient-to-br from-slate-50 via-white to-blue-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading learning paths...</span>
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
        className="py-20 pb-24 bg-gradient-to-br from-slate-50 via-white to-blue-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-red-600">
            <AlertCircle size={24} />
            <span>Failed to load learning paths: {error}</span>
          </div>
          <div className="mt-4">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
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
        className="py-20 pb-24 bg-gradient-to-br from-slate-50 via-white to-blue-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container mx-auto px-6 text-center">
          <div className="text-gray-600">No active cohorts available at the moment.</div>
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
      className="py-20 pb-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden"
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
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-100 to-blue-100 rounded-full opacity-50 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <MotionDiv 
          className="text-center mb-20 max-w-4xl mx-auto"
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
            className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent"
          >
            {cohort.name} – Learning Leagues
          </MotionH2>
          
          <MotionP 
            className="text-xl text-gray-600 mb-8 leading-relaxed"
          >
            {cohort.description}
          </MotionP>

          {/* Stats */}
          <MotionDiv className="flex items-center justify-center flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
              <BookOpen size={16} className="text-blue-500" />
              <span className="font-medium">{leagues.length} League{leagues.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
              <Calendar size={16} className="text-green-500" />
              <span className="font-medium">{totalWeeks} Total Weeks</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
              <CheckCircle size={16} className="text-purple-500" />
              <span className="font-medium">Certificates Available</span>
            </div>
          </MotionDiv>
        </MotionDiv>

        {/* Leagues Display */}
        <MotionDiv className="relative max-w-7xl mx-auto">
          {/* Leagues Grid */}
          <MotionDiv 
            className={`grid gap-12 ${
              leagues.length === 1 
                ? 'max-w-2xl mx-auto' 
                : leagues.length === 2 
                ? 'lg:grid-cols-2 lg:gap-20' 
                : 'lg:grid-cols-2 xl:grid-cols-3'
            }`}
          >
            {leagues.map((league, index) => {
              const accentColor = getLeagueColors(league.name);
              
              return (
                <MotionDiv 
                  key={league.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
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
      </div>
    </MotionSection>
  );
};

export default Cohort;
