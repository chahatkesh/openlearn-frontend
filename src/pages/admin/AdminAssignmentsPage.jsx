import React, { useState, useEffect, useCallback, useContext } from 'react';
import AssignmentManagement from '../../components/features/admin/AssignmentManagement';
import AdminService from "../../utils/api/adminService";
import { AuthContext } from '../../context/AuthContextProvider';

const AdminAssignmentsPage = () => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Grand Pathfinder has access to all data
      const isGrandPathfinder = user?.role === 'GRAND_PATHFINDER';
      
      // Fetch all leagues first
      const allLeaguesData = await AdminService.getAllLeagues();
      
      let filteredLeagues;
      
      if (isGrandPathfinder) {
        // Grand Pathfinder can access all leagues
        filteredLeagues = allLeaguesData.leagues || [];
      } else {
        // Get user's pathfinder scopes to determine accessible leagues
        const accessibleLeagueIds = user?.pathfinderScopes?.map(scope => scope.leagueId) || [];
        
        if (accessibleLeagueIds.length > 0) {
          // Filter to only accessible leagues
          filteredLeagues = allLeaguesData.leagues?.filter(league => 
            accessibleLeagueIds.includes(league.id)
          ) || [];
        } else {
          // If no pathfinder scopes, show no leagues
          filteredLeagues = [];
        }
      }
      
      setLeagues(filteredLeagues);
    } catch (err) {
      console.error('Error fetching assignments data:', err);
      setError(`Failed to load assignments: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [fetchData, user]);

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
    <AssignmentManagement user={user} leagues={leagues} />
  );
};

export default AdminAssignmentsPage;
