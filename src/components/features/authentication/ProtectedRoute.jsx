import React from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { LoadingScreen } from '../../ui';

export const ProtectedRoute = ({ 
  requiredRoles = [],
  redirectPath = '/signin'
}) => {
  const { isAuthenticated, hasRole, user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return <LoadingScreen message="Verifying authentication..." />;
  }

  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to={redirectPath} replace />;
  }

  // Check if user has required role (if specified)
  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    // User is authenticated but doesn't have the required role
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="bg-yellow-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-3V9m9 3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page.
          </p>
          <div className="bg-gray-100 p-4 rounded-md mb-4">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Current role:</span> {user?.role || 'None'}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              <span className="font-medium">Required role:</span> {requiredRoles.join(' or ')}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link 
              to="/dashboard"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link 
              to="/"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If user is authenticated and has required role (or no role required), render the child routes
  return <Outlet />;
};
