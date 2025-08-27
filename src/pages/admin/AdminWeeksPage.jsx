import React, { useState, useEffect, useCallback, useContext } from 'react';
import WeekManagement from '../../components/features/admin/WeekManagement';
import AdminService from "../../utils/api/adminService";
import { AuthContext } from '../../context/AuthContextProvider';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api`;

const AdminWeeksPage = () => {
  const { user } = useContext(AuthContext);
  const [weeks, setWeeks] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeagueId, setSelectedLeagueId] = useState('');
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Grand Pathfinder has access to all data
      const isGrandPathfinder = user?.role === 'GRAND_PATHFINDER';
      
      let weeksData, leaguesData;
      
      if (isGrandPathfinder) {
        // Fetch all data for Grand Pathfinder
        const [allWeeksData, allLeaguesData] = await Promise.all([
          AdminService.getAllWeeks(),
          AdminService.getAllLeagues()
        ]);
        
        weeksData = allWeeksData;
        leaguesData = allLeaguesData;
      } else {
        // Get user's pathfinder scopes to determine accessible leagues
        const accessibleLeagueIds = user?.pathfinderScopes?.map(scope => scope.leagueId) || [];
        
        if (accessibleLeagueIds.length > 0) {
        // Fetch weeks for each accessible league
        const weeksPromises = accessibleLeagueIds.map(leagueId => 
          AdminService.getWeeksByLeague(leagueId)
        );
        const weeksResults = await Promise.all(weeksPromises);
        
        // Combine all weeks from accessible leagues
        const allWeeks = weeksResults.flatMap(result => result.weeks || []);
        weeksData = { weeks: allWeeks };
        
        // Fetch all leagues but filter to only accessible ones
        const allLeaguesData = await AdminService.getAllLeagues();
        const accessibleLeagues = allLeaguesData.leagues?.filter(league => 
          accessibleLeagueIds.includes(league.id)
        ) || [];
        leaguesData = { leagues: accessibleLeagues };
        } else {
          // If no pathfinder scopes, return empty data
          weeksData = { weeks: [] };
          leaguesData = { leagues: [] };
        }
      }
      
      setWeeks(weeksData.weeks || []);
      setLeagues(leaguesData.leagues || []);
    } catch (err) {
      console.error('Error fetching weeks data:', err);
      setError(`Failed to load weeks: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [fetchData, user]);

  const handleCreateWeek = async (week) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/weeks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(week)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setWeeks([...weeks, result.data]);
      } else {
        throw new Error(result.error || 'Failed to create week');
      }
    } catch (err) {
      console.error('Error creating week:', err);
      setError(`Failed to create week: ${err.message}`);
    }
  };

  const handleUpdateWeek = async (weekId, updatedWeek) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/weeks/${weekId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedWeek)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setWeeks(weeks.map(week => 
          week.id === weekId ? result.data : week
        ));
      } else {
        throw new Error(result.error || 'Failed to update week');
      }
    } catch (err) {
      console.error('Error updating week:', err);
      setError(`Failed to update week: ${err.message}`);
    }
  };

  const handleDeleteWeek = async (weekId) => {
    if (!window.confirm('Are you sure you want to delete this week? This action cannot be undone.')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/weeks/${weekId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setWeeks(weeks.filter(week => week.id !== weekId));
      } else {
        throw new Error(result.error || 'Failed to delete week');
      }
    } catch (err) {
      console.error('Error deleting week:', err);
      setError(`Failed to delete week: ${err.message}`);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !user) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <WeekManagement
      user={user}
      weeks={weeks}
      leagues={leagues}
      onCreateWeek={handleCreateWeek}
      onUpdateWeek={handleUpdateWeek}
      onDeleteWeek={handleDeleteWeek}
      loading={loading}
      selectedLeagueId={selectedLeagueId}
      setSelectedLeagueId={setSelectedLeagueId}
    />
  );
};

export default AdminWeeksPage;
