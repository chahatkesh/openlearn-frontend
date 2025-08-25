import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * AdminDefaultRedirect Component
 * Redirects admin users to appropriate default page based on their role
 */
const AdminDefaultRedirect = () => {
  const { user } = useAuth();
  
  // Role-based default paths
  const getDefaultPath = () => {
    switch (user?.role) {
      case 'GRAND_PATHFINDER':
        return '/admin/users'; // Grand Pathfinder can access users
      case 'CHIEF_PATHFINDER':
        return '/admin/leagues'; // Chief Pathfinder defaults to leagues
      case 'PATHFINDER':
        return '/admin/weeks'; // Pathfinder defaults to weeks
      default:
        return '/admin/users'; // Default for other admin roles
    }
  };
  
  return <Navigate to={getDefaultPath()} replace />;
};

export default AdminDefaultRedirect;
