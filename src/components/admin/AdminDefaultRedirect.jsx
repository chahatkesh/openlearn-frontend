import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * AdminDefaultRedirect Component
 * Redirects admin users to appropriate default page based on their role
 */
const AdminDefaultRedirect = () => {
  const { user } = useAuth();
  
  // GRAND_PATHFINDER can access users, others go to cohorts
  const defaultPath = user?.role === 'GRAND_PATHFINDER' ? '/admin/users' : '/admin/cohorts';
  
  return <Navigate to={defaultPath} replace />;
};

export default AdminDefaultRedirect;
