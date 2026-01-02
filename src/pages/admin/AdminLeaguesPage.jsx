import React, { useState, useEffect, useCallback } from 'react';
import LeagueManagement from '../../components/features/admin/LeagueManagement';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import SuccessModal from '../../components/common/SuccessModal';
import AdminService from "../../utils/api/adminService";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api`;

const AdminLeaguesPage = () => {
  const [leagues, setLeagues] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showFirstConfirmation, setShowFirstConfirmation] = useState(false);
  const [showSecondConfirmation, setShowSecondConfirmation] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [leagueToDelete, setLeagueToDelete] = useState(null);
  const [deletionStats, setDeletionStats] = useState(null);

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

  const handleDeleteLeague = (leagueId) => {
    // Find the league to get its details
    const league = leagues.find(l => l.id === leagueId);
    if (!league) return;
    
    setLeagueToDelete(league);
    setShowFirstConfirmation(true);
  };

  const handleFirstConfirm = () => {
    setShowFirstConfirmation(false);
    setShowSecondConfirmation(true);
  };

  const handleFinalConfirm = async () => {
    setShowSecondConfirmation(false);
    
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/leagues/${leagueToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setLeagues(leagues.filter(league => league.id !== leagueToDelete.id));
        setDeletionStats(result.deletionStats);
        setShowSuccessModal(true);
      } else {
        throw new Error(result.error || 'Failed to delete league');
      }
    } catch (err) {
      console.error('Error deleting league:', err);
      setError(`Failed to delete league: ${err.message}`);
    } finally {
      setLeagueToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowFirstConfirmation(false);
    setShowSecondConfirmation(false);
    setLeagueToDelete(null);
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
    <>
      <LeagueManagement
        leagues={leagues}
        cohorts={cohorts}
        onCreateLeague={handleCreateLeague}
        onUpdateLeague={handleUpdateLeague}
        onDeleteLeague={handleDeleteLeague}
        loading={loading}
      />

      {/* First Confirmation Modal */}
      <ConfirmationModal
        isOpen={showFirstConfirmation}
        onClose={handleCancelDelete}
        onConfirm={handleFirstConfirm}
        title="Delete League?"
        type="warning"
        confirmText="Continue"
        cancelText="Cancel"
      >
        {leagueToDelete && (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                You are about to delete: <span className="text-yellow-700">"{leagueToDelete.name}"</span>
              </p>
              <p className="text-sm text-gray-700 mb-3">
                This will permanently delete:
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
                  <span className="font-medium">{leagueToDelete._count?.weeks || 0}</span>
                  <span className="ml-1">modules/weeks</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
                  <span className="font-medium">{leagueToDelete._count?.enrollments || 0}</span>
                  <span className="ml-1">student enrollments</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
                  All badges and specializations
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
                  All related data
                </li>
              </ul>
            </div>
            <p className="text-sm text-center font-semibold text-red-600">
              ⚠️ This action CANNOT be undone!
            </p>
          </div>
        )}
      </ConfirmationModal>

      {/* Second Confirmation Modal */}
      <ConfirmationModal
        isOpen={showSecondConfirmation}
        onClose={handleCancelDelete}
        onConfirm={handleFinalConfirm}
        title="FINAL CONFIRMATION"
        type="danger"
        confirmText="Yes, Delete Everything"
        cancelText="Cancel"
      >
        {leagueToDelete && (
          <div className="space-y-4">
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
              <p className="text-sm font-bold text-red-900 text-center mb-2">
                🛑 IRREVERSIBLE ACTION
              </p>
              <p className="text-sm text-gray-800 text-center">
                You are about to permanently delete <br />
                <span className="font-bold text-red-700">"{leagueToDelete.name}"</span>
                <br />
                and ALL its associated data.
              </p>
            </div>
            <p className="text-sm text-center text-gray-700">
              Are you <span className="font-bold">ABSOLUTELY SURE</span> you want to proceed?
            </p>
            <p className="text-xs text-center text-gray-500">
              This will affect {leagueToDelete._count?.enrollments || 0} students and cannot be recovered.
            </p>
          </div>
        )}
      </ConfirmationModal>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="League Deleted Successfully"
        message="All associated data has been permanently removed."
      >
        {deletionStats && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-900 mb-3 text-center">
              Deletion Summary:
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center">
                <div className="font-bold text-lg text-green-700">{deletionStats.weeks}</div>
                <div className="text-gray-600">Weeks</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-green-700">{deletionStats.enrollments}</div>
                <div className="text-gray-600">Enrollments</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-green-700">{deletionStats.badges}</div>
                <div className="text-gray-600">Badges</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-green-700">{deletionStats.specializations}</div>
                <div className="text-gray-600">Specializations</div>
              </div>
              <div className="text-center col-span-2">
                <div className="font-bold text-lg text-green-700">{deletionStats.pathfinderScopes}</div>
                <div className="text-gray-600">Pathfinder Scopes</div>
              </div>
            </div>
          </div>
        )}
      </SuccessModal>
    </>
  );
};

export default AdminLeaguesPage;