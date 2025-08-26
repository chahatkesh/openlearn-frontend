import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SpecializationManagement from '../../components/features/admin/SpecializationManagement';
import AdminService from '../../utils/adminService';
import { useAuth } from '../../hooks/useAuth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api`;

const AdminSpecializationsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [specializations, setSpecializations] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user has Grand Pathfinder role
  useEffect(() => {
    if (user && user.role !== 'GRAND_PATHFINDER') {
      navigate('/admin/cohorts', { replace: true });
      return;
    }
  }, [user, navigate]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [specializationsData, cohortsData, leaguesData] = await Promise.all([
        AdminService.getAllSpecializations(),
        AdminService.getAllCohorts(),
        AdminService.getAllLeagues()
      ]);
      
      setSpecializations(specializationsData.specializations || []);
      setCohorts(cohortsData.cohorts || []);
      setLeagues(leaguesData.leagues || []);
    } catch (err) {
      console.error('Error fetching specializations data:', err);
      setError(`Failed to load specializations: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
        setSpecializations(specializations.filter(spec => spec.id !== specializationId));
      } else {
        throw new Error(result.error || 'Failed to delete specialization');
      }
    } catch (err) {
      console.error('Error deleting specialization:', err);
      setError(`Failed to delete specialization: ${err.message}`);
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

  // Additional protection: don't render if user doesn't have proper role
  if (!user || user.role !== 'GRAND_PATHFINDER') {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
          <p className="mt-1 text-sm text-gray-500">
            Only Grand Pathfinders can access Specialization Management.
          </p>
        </div>
      </div>
    );
  }

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

export default AdminSpecializationsPage;
