import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Users, Archive, BookOpen, Award, Layers, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import UserManagement from '../components/admin/UserManagement';
import CohortManagement from '../components/admin/CohortManagement';
import LeagueManagement from '../components/admin/LeagueManagement';
import SpecializationManagement from '../components/admin/SpecializationManagement';
import WeekManagement from '../components/admin/WeekManagement';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api`;

const AdminPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending-users');
  const [pendingUsers, setPendingUsers] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Initial data fetch based on active tab
    fetchTabData(activeTab);
  }, [activeTab]);

  const fetchTabData = async (tab) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }
      
      // Define primary endpoint based on active tab
      let endpoint = '';
      
      switch(tab) {
        case 'pending-users':
          endpoint = `${API_BASE_URL}/admin/pending-users`;
          break;
        case 'cohorts':
          endpoint = `${API_BASE_URL}/cohorts`;
          break;
        case 'leagues':
          endpoint = `${API_BASE_URL}/leagues`;
          break;
        case 'specializations':
          endpoint = `${API_BASE_URL}/specializations`;
          break;
        case 'weeks':
          endpoint = `${API_BASE_URL}/weeks`;
          break;
        default:
          endpoint = `${API_BASE_URL}/admin/pending-users`;
      }
      
      // Main data fetch for the active tab
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data');
      }
      
      // Update state based on the tab
      switch(tab) {
        case 'pending-users':
          setPendingUsers(result.data.users || []);
          break;
        case 'cohorts':
          setCohorts(result.data.cohorts || []);
          break;
        case 'leagues':
          setLeagues(result.data.leagues || []);
          // For leagues, also fetch cohorts if not already loaded
          if (cohorts.length === 0) {
            await fetchCohorts();
          }
          break;
        case 'specializations':
          setSpecializations(result.data.specializations || []);
          // For specializations, also fetch cohorts and leagues if not already loaded
          if (cohorts.length === 0) {
            await fetchCohorts();
          }
          if (leagues.length === 0) {
            await fetchLeagues();
          }
          break;
        case 'weeks':
          setWeeks(result.data.weeks || []);
          // For weeks, also fetch leagues if not already loaded
          if (leagues.length === 0) {
            await fetchLeagues();
          }
          break;
      }
    } catch (err) {
      console.error(`Error fetching ${tab} data:`, err);
      setError(`Failed to load ${tab.replace('-', ' ')}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper functions to fetch related data
  const fetchCohorts = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/cohorts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
      
      const response = await fetch(`${API_BASE_URL}/leagues`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setLeagues(result.data.leagues || []);
      }
    } catch (err) {
      console.error('Error fetching leagues:', err);
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/admin/approve-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Remove the approved user from the list
        setPendingUsers(pendingUsers.filter(user => user.id !== userId));
      } else {
        throw new Error(result.error || 'Failed to approve user');
      }
    } catch (err) {
      console.error('Error approving user:', err);
      setError(`Failed to approve user: ${err.message}`);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/admin/update-role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, newRole })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update the user in the list
        setPendingUsers(pendingUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
      } else {
        throw new Error(result.error || 'Failed to update user role');
      }
    } catch (err) {
      console.error('Error updating user role:', err);
      setError(`Failed to update user role: ${err.message}`);
    }
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/admin/update-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, newStatus })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update the user in the list
        setPendingUsers(pendingUsers.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        ));
      } else {
        throw new Error(result.error || 'Failed to update user status');
      }
    } catch (err) {
      console.error('Error updating user status:', err);
      setError(`Failed to update user status: ${err.message}`);
    }
  };

  // Tab content components
  const renderPendingUsers = () => {
    return (
      <UserManagement
        users={pendingUsers}
        onApproveUser={handleApproveUser}
        onUpdateRole={handleUpdateRole}
        onUpdateStatus={handleUpdateStatus}
        loading={loading}
      />
    );
  };

  const handleCreateCohort = async (cohort) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/cohorts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cohort)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Add the new cohort to the list
        setCohorts([...cohorts, result.data]);
      } else {
        throw new Error(result.error || 'Failed to create cohort');
      }
    } catch (err) {
      console.error('Error creating cohort:', err);
      setError(`Failed to create cohort: ${err.message}`);
    }
  };

  const handleUpdateCohort = async (cohortId, updatedCohort) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/cohorts/${cohortId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedCohort)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update the cohort in the list
        setCohorts(cohorts.map(cohort => 
          cohort.id === cohortId ? result.data : cohort
        ));
      } else {
        throw new Error(result.error || 'Failed to update cohort');
      }
    } catch (err) {
      console.error('Error updating cohort:', err);
      setError(`Failed to update cohort: ${err.message}`);
    }
  };

  const handleDeleteCohort = async (cohortId) => {
    if (!window.confirm('Are you sure you want to delete this cohort? This action cannot be undone.')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/cohorts/${cohortId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Remove the cohort from the list
        setCohorts(cohorts.filter(cohort => cohort.id !== cohortId));
      } else {
        throw new Error(result.error || 'Failed to delete cohort');
      }
    } catch (err) {
      console.error('Error deleting cohort:', err);
      setError(`Failed to delete cohort: ${err.message}`);
    }
  };

  const renderCohorts = () => {
    return (
      <CohortManagement
        cohorts={cohorts}
        onCreateCohort={handleCreateCohort}
        onUpdateCohort={handleUpdateCohort}
        onDeleteCohort={handleDeleteCohort}
        loading={loading}
      />
    );
  };

  // League handler functions
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
        // Add the new league to the list
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
        // Update the league in the list
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
        // Remove the league from the list
        setLeagues(leagues.filter(league => league.id !== leagueId));
      } else {
        throw new Error(result.error || 'Failed to delete league');
      }
    } catch (err) {
      console.error('Error deleting league:', err);
      setError(`Failed to delete league: ${err.message}`);
    }
  };

  const renderLeagues = () => {
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

  // Specialization handler functions
  const handleCreateSpecialization = async (specialization) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/specializations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(specialization)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Add the new specialization to the list
        setSpecializations([...specializations, result.data]);
      } else {
        throw new Error(result.error || 'Failed to create specialization');
      }
    } catch (err) {
      console.error('Error creating specialization:', err);
      setError(`Failed to create specialization: ${err.message}`);
    }
  };

  const handleUpdateSpecialization = async (specializationId, updatedSpecialization) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/specializations/${specializationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedSpecialization)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update the specialization in the list
        setSpecializations(specializations.map(spec => 
          spec.id === specializationId ? result.data : spec
        ));
      } else {
        throw new Error(result.error || 'Failed to update specialization');
      }
    } catch (err) {
      console.error('Error updating specialization:', err);
      setError(`Failed to update specialization: ${err.message}`);
    }
  };

  const handleDeleteSpecialization = async (specializationId) => {
    if (!window.confirm('Are you sure you want to delete this specialization? This action cannot be undone.')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/specializations/${specializationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Remove the specialization from the list
        setSpecializations(specializations.filter(spec => spec.id !== specializationId));
      } else {
        throw new Error(result.error || 'Failed to delete specialization');
      }
    } catch (err) {
      console.error('Error deleting specialization:', err);
      setError(`Failed to delete specialization: ${err.message}`);
    }
  };

  const renderSpecializations = () => {
    return (
      <SpecializationManagement
        specializations={specializations}
        cohorts={cohorts}
        leagues={leagues}
        onCreateSpecialization={handleCreateSpecialization}
        onUpdateSpecialization={handleUpdateSpecialization}
        onDeleteSpecialization={handleDeleteSpecialization}
        loading={loading}
      />
    );
  };

  // Week handler functions
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
        // Add the new week to the list
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
        // Update the week in the list
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
        // Remove the week from the list
        setWeeks(weeks.filter(week => week.id !== weekId));
      } else {
        throw new Error(result.error || 'Failed to delete week');
      }
    } catch (err) {
      console.error('Error deleting week:', err);
      setError(`Failed to delete week: ${err.message}`);
    }
  };

  const handleSelectLeague = (leagueId) => {
    setSelectedLeagueId(leagueId);
  };

  const renderWeeks = () => {
    return (
      <WeekManagement
        weeks={weeks}
        leagues={leagues}
        onCreateWeek={handleCreateWeek}
        onUpdateWeek={handleUpdateWeek}
        onDeleteWeek={handleDeleteWeek}
        selectedLeagueId={selectedLeagueId}
        onSelectLeague={handleSelectLeague}
        loading={loading}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-black">
              OpenLearn
            </Link>
            <span className="ml-4 px-3 py-1 bg-black text-white text-xs font-semibold rounded-full">
              Admin
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700">
              Hello, {user?.name || 'Admin'} ({user?.role || 'ADMIN'})
            </div>
            <Link
              to="/dashboard"
              className="flex items-center text-sm text-gray-700 hover:text-black"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
            <Link
              to="/logout"
              className="flex items-center text-sm text-gray-700 hover:text-black"
            >
              <LogOut size={16} className="mr-1" />
              Logout
            </Link>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Panel Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage users, cohorts, leagues, and specializations
          </p>
        </div>

        {/* Admin Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              className={`${
                activeTab === 'pending-users'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              onClick={() => setActiveTab('pending-users')}
            >
              <Users size={16} className="mr-2" />
              Pending Users
            </button>
            <button
              className={`${
                activeTab === 'cohorts'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              onClick={() => setActiveTab('cohorts')}
            >
              <Archive size={16} className="mr-2" />
              Cohorts
            </button>
            <button
              className={`${
                activeTab === 'leagues'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              onClick={() => setActiveTab('leagues')}
            >
              <BookOpen size={16} className="mr-2" />
              Leagues
            </button>
            <button
              className={`${
                activeTab === 'specializations'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              onClick={() => setActiveTab('specializations')}
            >
              <Award size={16} className="mr-2" />
              Specializations
            </button>
            <button
              className={`${
                activeTab === 'weeks'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              onClick={() => setActiveTab('weeks')}
            >
              <Calendar size={16} className="mr-2" />
              Weeks
            </button>
          </nav>
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
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
        )}

        {/* Loading indicator */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            {activeTab === 'pending-users' && renderPendingUsers()}
            {activeTab === 'cohorts' && renderCohorts()}
            {activeTab === 'leagues' && renderLeagues()}
            {activeTab === 'specializations' && renderSpecializations()}
            {activeTab === 'weeks' && renderWeeks()}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
