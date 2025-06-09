import React from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <LoadingSpinner size="lg" color="yellow" />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingScreen;
