import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextProvider';
import MigrationService from '../utils/migrationService';
import EmailVerificationService from '../utils/emailVerificationService';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api/auth`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Fetch user profile
        const response = await fetch(`${API_BASE_URL}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const result = await response.json();
        
        if (result.success) {
          setUser(result.data);
        } else {
          // Try to refresh the token if available
          const refreshResult = await refreshToken();
          
          if (!refreshResult) {
            // Clear invalid tokens
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
        }
      } catch (err) {
        console.error('Error checking auth status:', err);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        setError(result.error);
        return false;
      }
      
      // Store tokens
      localStorage.setItem('accessToken', result.data.accessToken);
      localStorage.setItem('refreshToken', result.data.refreshToken);
      
      // Set user state
      setUser(result.data.user);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
      return false;
    }
  };

  // Signup function
  const signup = async (name, email, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        setError(result.error);
        return false;
      }
      
      // Store tokens
      localStorage.setItem('accessToken', result.data.accessToken);
      localStorage.setItem('refreshToken', result.data.refreshToken);
      
      // Set user state
      setUser(result.data.user);
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      setError('Network error. Please try again.');
      return false;
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      
      if (!storedRefreshToken) return false;
      
      const response = await fetch(`${API_BASE_URL}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        return false;
      }
      
      // Update access token
      localStorage.setItem('accessToken', result.data.accessToken);
      
      // Fetch user profile with new token
      const profileResponse = await fetch(`${API_BASE_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${result.data.accessToken}`
        }
      });
      
      const profileResult = await profileResponse.json();
      
      if (profileResult.success) {
        setUser(profileResult.data);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error refreshing token:', err);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        // Call logout endpoint (optional, as JWT can't be invalidated server-side)
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // Reset user state
      setUser(null);
      
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  // Refresh user data from server
  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        return false;
      }
      
      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setUser(result.data);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error refreshing user data:', err);
      return false;
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Check if user has specific roles
  const hasRole = (requiredRoles) => {
    if (!user) return false;
    
    if (!Array.isArray(requiredRoles)) {
      requiredRoles = [requiredRoles];
    }
    
    return requiredRoles.includes(user.role);
  };

  // Check migration status
  const checkMigrationStatus = async () => {
    try {
      const result = await MigrationService.checkMigrationStatus();
      return result || { requiresMigration: false, isV2User: true };
    } catch (error) {
      console.error('Error checking migration status:', error);
      return { requiresMigration: false, isV2User: true };
    }
  };

  // Check email verification status
  const checkEmailVerificationStatus = async () => {
    try {
      const result = await EmailVerificationService.checkVerificationStatus();
      return result || { emailVerified: true };
    } catch (error) {
      console.error('Error checking email verification status:', error);
      return { emailVerified: true };
    }
  };

  // Get user flow status (migration + verification)
  const getUserFlowStatus = async () => {
    try {      
      const [migrationStatus, verificationStatus] = await Promise.all([
        checkMigrationStatus(),
        checkEmailVerificationStatus()
      ]);
      // Safely extract properties with fallbacks
      const migrationData = migrationStatus || {};
      const verificationData = verificationStatus || {};

      const result = {
        requiresMigration: migrationData.needsMigration || migrationData.requiresMigration || false,
        emailVerified: verificationData.emailVerified || false,
        isV2User: migrationData.isV2User || (migrationData.migratedToV2 === true) || false
      };
      return result;
    } catch (error) {
      console.error('❌ Error getting user flow status:', error);
      return {
        requiresMigration: false,
        emailVerified: true,
        isV2User: true
      };
    }
  };

  // Get user flow status for email verification testing (bypasses migration)
  const getEmailVerificationFlowStatus = async () => {
    try {
      const verificationStatus = await checkEmailVerificationStatus();
      const verificationData = verificationStatus || {};

      return {
        requiresMigration: false, // Bypass migration for testing
        emailVerified: verificationData.emailVerified || false,
        isV2User: true // Assume V2 user for testing
      };
    } catch (error) {
      console.error('Error getting email verification flow status:', error);
      return {
        requiresMigration: false,
        emailVerified: true,
        isV2User: true
      };
    }
  };

  const contextValue = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    refreshToken,
    refreshUser,
    isAuthenticated,
    hasRole,
    checkMigrationStatus,
    checkEmailVerificationStatus,
    getUserFlowStatus,
    getEmailVerificationFlowStatus
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
