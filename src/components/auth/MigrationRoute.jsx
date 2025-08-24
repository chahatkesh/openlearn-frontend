import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingScreen from '../common/LoadingScreen';

/**
 * MigrationRoute - Handles V2 migration flow
 * Checks if user needs migration and redirects accordingly
 * Supports email verification testing mode via URL parameter
 */
const MigrationRoute = () => {
  const { user, loading, isAuthenticated, getUserFlowStatus, getEmailVerificationFlowStatus } = useAuth();
  const [flowStatus, setFlowStatus] = useState(null);
  const [checkingFlow, setCheckingFlow] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkUserFlow = async () => {
      if (!isAuthenticated()) {
        setCheckingFlow(false);
        return;
      }

      try {
        // Check if this is email verification testing mode
        const urlParams = new URLSearchParams(location.search);
        const testEmailOnly = urlParams.get('test-email') === 'true';

        let status;
        if (testEmailOnly) {
          status = await getEmailVerificationFlowStatus();
        } else {
          status = await getUserFlowStatus();
        }
        
        console.log('🔍 User flow status:', status);
        setFlowStatus(status);
      } catch (error) {
        console.error('❌ Error checking user flow:', error);
        // Default to allowing access if check fails
        setFlowStatus({
          requiresMigration: false,
          emailVerified: true,
          isV2User: true
        });
      } finally {
        setCheckingFlow(false);
      }
    };

    if (!loading && user) {
      checkUserFlow();
    } else if (!loading) {
      setCheckingFlow(false);
    }
  }, [user, loading, isAuthenticated, getUserFlowStatus, getEmailVerificationFlowStatus, location.search]);

  // Show loading while checking authentication or flow status
  if (loading || checkingFlow) {
    return <LoadingScreen message="Checking account status..." />;
  }

  // If not authenticated, redirect to signin
  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }

  // Skip migration checks for migration and verification pages
  const skipFlowPaths = ['/migration', '/email-verification'];
  if (skipFlowPaths.includes(location.pathname)) {
    return <Outlet />;
  }

  // If flowStatus is still null, keep loading
  if (!flowStatus) {
    return <LoadingScreen message="Checking account status..." />;
  }

  // If migration is required, redirect to migration page
  if (flowStatus.requiresMigration) {
    return <Navigate to="/migration" replace />;
  }

  // If email verification is required, redirect to verification page
  if (!flowStatus.emailVerified) {
    return <Navigate to="/email-verification" replace />;
  }

  // User has completed migration and verification, allow access
  return <Outlet />;
};

export default MigrationRoute;
