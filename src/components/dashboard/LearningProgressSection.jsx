import React, { useState, useEffect } from 'react';
import { TrendingUp, BookOpen, Users, Star, ChevronRight, Play, FileText, CheckSquare, Share2 } from 'lucide-react';
import LeagueDetailPage from './LeagueDetailPage';
import ProgressCard from './ProgressCard';
import WelcomeBanner from './WelcomeBanner';
import ProgressDashboard from './ProgressDashboard';
import ProgressService from '../../utils/progressService';
import DataService from '../../utils/dataService';

const LearningProgressSection = ({ user }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [cohorts, setCohorts] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchDashboardData();
    fetchCohorts();
    fetchLeagues();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await ProgressService.getUserDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    }
  };

  const fetchCohorts = async () => {
    try {
      const data = await DataService.getCohorts();
      setCohorts(data.cohorts || []);
    } catch (err) {
      console.error('Error fetching cohorts:', err);
    }
  };

  const fetchLeagues = async () => {
    try {
      const data = await DataService.getLeagues();
      setLeagues(data.leagues || []);
    } catch (err) {
      console.error('Error fetching leagues:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollment = async (cohortId, leagueId) => {
    try {
      await ProgressService.enrollUser(cohortId, leagueId);
      alert('Enrollment successful! Welcome to your learning journey!');
      await fetchDashboardData(); // Refresh dashboard data
      setRefreshTrigger(prev => prev + 1); // Trigger refresh in ProgressDashboard
    } catch (err) {
      console.error('Enrollment error:', err);
      alert(`Enrollment failed: ${err.message}`);
    }
  };

  const handleLeagueClick = (league) => {
    setSelectedLeague(league);
  };

  // Trigger refresh when returning from league detail
  const handleBackFromLeague = () => {
    setSelectedLeague(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const scrollToLeagues = () => {
    const leaguesSection = document.getElementById('available-leagues');
    if (leaguesSection) {
      leaguesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  // If viewing league details
  if (selectedLeague) {
    return (
      <LeagueDetailPage 
        league={selectedLeague} 
        onBack={handleBackFromLeague}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Progress Dashboard */}
      <ProgressDashboard user={user} refreshTrigger={refreshTrigger} />

      {/* Welcome Banner for New Users */}
      {(!dashboardData?.enrollments || dashboardData.enrollments.length === 0) && (
        <WelcomeBanner user={user} onExploreClick={scrollToLeagues} />
      )}

      {/* Current Enrollments */}
      {dashboardData?.enrollments?.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Active Leagues</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardData.enrollments.map((enrollment) => (
              <ProgressCard
                key={enrollment.league.id}
                enrollment={enrollment}
                onClick={handleLeagueClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Available Cohorts & Leagues */}
      <div id="available-leagues" className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="mr-2 text-[#FFDE59]" size={20} />
          Available Cohorts & Leagues
        </h3>
        
        {cohorts.length > 0 ? (
          <div className="space-y-6">
            {cohorts.map((cohort) => (
              <div key={cohort.id} className="border-l-4 border-[#FFDE59] pl-4">
                <h4 className="font-semibold text-gray-900 mb-2">{cohort.name}</h4>
                <p className="text-gray-600 text-sm mb-3">{cohort.description}</p>
                
                {/* Leagues under this cohort */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {leagues.map((league) => (
                    <div 
                      key={league.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-[#FFDE59] transition-colors cursor-pointer"
                      onClick={() => handleLeagueClick(league)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 mb-1">{league.name}</h5>
                          <p className="text-sm text-gray-600 mb-2">{league.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{league.weeksCount} weeks</span>
                            <span>{league.sectionsCount} sections</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEnrollment(cohort.id, league.id);
                          }}
                          className="bg-[#FFDE59] text-gray-900 px-3 py-1 rounded text-sm font-medium hover:bg-[#FFD700] transition-colors"
                        >
                          Enroll
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BookOpen size={32} className="mx-auto mb-2 text-gray-300" />
            <p>No cohorts available at the moment</p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

export default LearningProgressSection;
