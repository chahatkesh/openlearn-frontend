import React, { useState, useEffect } from 'react';
import { TrendingUp, BookOpen, Users, Star, ChevronRight, Play, FileText, CheckSquare, Share2 } from 'lucide-react';
import LeagueDetailPage from './LeagueDetailPage';
import ProgressCard from './ProgressCard';
import WelcomeBanner from './WelcomeBanner';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LearningProgressSection = ({ user }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [cohorts, setCohorts] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchCohorts();
    fetchLeagues();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/api/progress/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setDashboardData(result.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    }
  };

  const fetchCohorts = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/api/cohorts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setCohorts(result.data.cohorts || []);
      }
    } catch (err) {
      console.error('Error fetching cohorts:', err);
    }
  };

  const fetchLeagues = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/api/leagues`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setLeagues(result.data.leagues || []);
      }
    } catch (err) {
      console.error('Error fetching leagues:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLeagueClick = (league) => {
    setSelectedLeague(league);
  };

  const scrollToLeagues = () => {
    const leaguesSection = document.getElementById('available-leagues');
    if (leaguesSection) {
      leaguesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEnrollment = async (cohortId, leagueId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/api/progress/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cohortId, leagueId })
      });
      const result = await response.json();
      if (result.success) {
        alert('Enrollment successful! Welcome to your learning journey!');
        fetchDashboardData(); // Refresh dashboard data
      } else {
        alert(`Enrollment failed: ${result.error}`);
      }
    } catch (err) {
      console.error('Enrollment error:', err);
      alert('Enrollment failed. Please try again.');
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
        onBack={() => setSelectedLeague(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="mr-2 text-[#FFDE59]" size={24} />
          Learning Progress
        </h2>
        
        {dashboardData ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{dashboardData.statistics?.totalEnrollments || 0}</div>
              <div className="text-sm text-gray-600">Enrollments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{dashboardData.statistics?.totalCompletedSections || 0}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{dashboardData.statistics?.badgesEarned || 0}</div>
              <div className="text-sm text-gray-600">Badges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#FFDE59]">{dashboardData.statistics?.overallProgress || 0}%</div>
              <div className="text-sm text-gray-600">Overall</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-gray-500">Start your learning journey!</p>
          </div>
        )}
      </div>

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
