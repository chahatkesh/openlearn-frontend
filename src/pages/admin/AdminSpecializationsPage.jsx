import React, { useState, useEffect, useCallback } from 'react';
import SpecializationManagement from '../../components/admin/SpecializationManagement';
import AdminService from '../../utils/adminService';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api`;

const AdminSpecializationsPage = () => {
  const [specializations, setSpecializations] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
