import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * ResourceLoadingIndicator - A specialized loading component for resource calculations
 * This shows in individual league cards while resource data is being calculated
 */
const ResourceLoadingIndicator = ({ 
  isLoading = false, 
  completedCount = 0, 
  totalCount = 0, 
  compact = false 
}) => {
  if (!isLoading) return null;

  if (compact) {
    return (
      <div className="inline-flex items-center space-x-1">
        <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
        <span className="text-xs text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <div className="rounded-lg p-3 text-center">
      <div className="flex items-center justify-center space-x-2">
        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
        <span className="text-sm font-medium text-blue-700">
          {Math.round((completedCount / totalCount) * 100)}% Fetching dashboard data...
        </span>
      </div>
    </div>
  );
};

// StatisticLoader component for individual stats in cards
export const StatisticLoader = ({ color = 'gray' }) => (
  <div className="inline-flex items-center">
    <div className={`w-3 h-3 animate-spin rounded-full border border-${color}-300 border-t-${color}-600`}></div>
    <span className="ml-1 text-gray-400">...</span>
  </div>
);

// Resource Progress Badge - shows in cards when resources are still calculating
export const ResourceProgressBadge = ({ isCalculating, completedCount, totalCount }) => {
  if (!isCalculating) return null;
  
  return (
    <div className="absolute top-2 right-2 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200">
      <div className="flex items-center space-x-1">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>
          {totalCount > 0 ? `${completedCount+1}/${totalCount}` : 'Loading...'}
        </span>
      </div>
    </div>
  );
};

export default ResourceLoadingIndicator;
