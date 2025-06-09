import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'yellow' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-10 w-10',
  };
  
  const colorClasses = {
    yellow: 'border-[#FFDE59]',
    black: 'border-black',
    white: 'border-white',
    gray: 'border-gray-300'
  };
  
  const spinnerSize = sizeClasses[size] || sizeClasses.md;
  const spinnerColor = colorClasses[color] || colorClasses.yellow;
  
  return (
    <div className={`animate-spin rounded-full ${spinnerSize} border-t-2 border-b-2 ${spinnerColor}`}></div>
  );
};

export default LoadingSpinner;
