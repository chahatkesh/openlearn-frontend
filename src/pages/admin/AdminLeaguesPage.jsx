import React, { useState, useEffect, useCallback } from 'react';
import LeagueManagement from '../../components/features/admin/LeagueManagement';
import AdminService from "../../utils/api/adminService";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api`;

const AdminLeaguesPage = () => {
  const [leagues, setLeagues] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch both leagues and cohorts
      const [leaguesData, cohortsData] = await Promise.all([
        AdminService.getAllLeagues(),
        AdminService.getAllCohorts()
      ]);
      
      setLeagues(leaguesData.leagues || []);
      setCohorts(cohortsData.cohorts || []);
    } catch (err) {
      console.error('Error fetching leagues data:', err);
      setError(`Failed to load leagues: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateLeague = async (league) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/leagues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(league)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setLeagues([...leagues, result.data]);
      } else {
        throw new Error(result.error || 'Failed to create league');
      }
    } catch (err) {
      console.error('Error creating league:', err);
      setError(`Failed to create league: ${err.message}`);
    }
  };

  const handleUpdateLeague = async (leagueId, updatedLeague) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/leagues/${leagueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedLeague)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setLeagues(leagues.map(league => 
          league.id === leagueId ? result.data : league
        ));
      } else {
        throw new Error(result.error || 'Failed to update league');
      }
    } catch (err) {
      console.error('Error updating league:', err);
      setError(`Failed to update league: ${err.message}`);
    }
  };

  const handleDeleteLeague = async (leagueId) => {
    if (!window.confirm('Are you sure you want to delete this league? This action cannot be undone.')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/leagues/${leagueId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setLeagues(leagues.filter(league => league.id !== leagueId));
      } else {
        throw new Error(result.error || 'Failed to delete league');
      }
    } catch (err) {
      console.error('Error deleting league:', err);
      setError(`Failed to delete league: ${err.message}`);
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

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <LeagueManagement
      leagues={leagues}
      cohorts={cohorts}
      onCreateLeague={handleCreateLeague}
      onUpdateLeague={handleUpdateLeague}
      onDeleteLeague={handleDeleteLeague}
      loading={loading}
    />
  );
};

export default AdminLeaguesPage;
