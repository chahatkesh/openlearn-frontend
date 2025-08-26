import React, { useState, useEffect, useCallback } from 'react';
import CohortManagement from '../../components/features/admin/CohortManagement';
import AdminService from '../../utils/adminService';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api`;

const AdminCohortsPage = () => {
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCohorts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const cohortsData = await AdminService.getAllCohorts();
      setCohorts(cohortsData.cohorts || []);
    } catch (err) {
      console.error('Error fetching cohorts data:', err);
      setError(`Failed to load cohorts: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCohorts();
  }, [fetchCohorts]);

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
    <CohortManagement
      cohorts={cohorts}
      onCreateCohort={handleCreateCohort}
      onUpdateCohort={handleUpdateCohort}
      onDeleteCohort={handleDeleteCohort}
      loading={loading}
    />
  );
};

export default AdminCohortsPage;
