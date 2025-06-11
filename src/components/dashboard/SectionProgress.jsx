import React, { useState, useEffect, useCallback } from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  BarChart3,
  Target,
  RefreshCw,
  Filter,
  Search,
  Eye,
  EyeOff
} from 'lucide-react';
import ResourceCard from './ResourceCard';
import ResourceProgressService from '../../utils/resourceProgressService';

/**
 * Enhanced Section Progress Component
 * Comprehensive section-level resource progress tracking with analytics
 */
const SectionProgress = ({ sectionId, onSectionComplete }) => {
  const [sectionData, setSectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, completed, revision, not-started
  const [searchTerm, setSearchTerm] = useState('');
  const [showStatistics, setShowStatistics] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (sectionId) {
      fetchSectionProgress();
    }
  }, [sectionId, fetchSectionProgress]);

  const fetchSectionProgress = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await ResourceProgressService.getSectionResourcesProgress(sectionId);
      setSectionData(data);
    } catch (err) {
      setError('Failed to fetch section progress: ' + err.message);
      console.error('Failed to fetch section progress:', err);
    } finally {
      setLoading(false);
    }
  }, [sectionId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSectionProgress();
    setRefreshing(false);
  };

  const handleResourceProgressUpdate = (resourceId, progressData) => {
    if (!sectionData) return;

    // Update the specific resource's progress
    const updatedResources = sectionData.resources.map(resource => 
      resource.id === resourceId 
        ? { ...resource, progress: progressData }
        : resource
    );

    // Recalculate statistics
    const newStatistics = ResourceProgressService.calculateSectionStatistics(updatedResources);

    setSectionData({
      ...sectionData,
      resources: updatedResources,
      statistics: newStatistics
    });

    // Check if section is now complete
    if (newStatistics.completionPercentage === 100 && onSectionComplete) {
      onSectionComplete(sectionId, newStatistics);
    }
  };

  const handleBulkComplete = async () => {
    const incompleteResources = filteredResources.filter(r => !r.progress?.isCompleted);
    
    if (incompleteResources.length === 0) {
      alert('All visible resources are already completed!');
      return;
    }

    if (!window.confirm(`Mark ${incompleteResources.length} resources as completed?`)) {
      return;
    }

    setRefreshing(true);
    try {
      const resourceIds = incompleteResources.map(r => r.id);
      const result = await ResourceProgressService.markMultipleResourcesCompleted(resourceIds);
      
      if (result.successful > 0) {
        await fetchSectionProgress();
        alert(`Successfully marked ${result.successful} resources as completed!`);
      }
      
      if (result.failed > 0) {
        alert(`Failed to mark ${result.failed} resources. Please try again.`);
      }
    } catch (error) {
      alert('Bulk operation failed: ' + error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const handleBulkReset = async () => {
    const resourcesWithProgress = filteredResources.filter(r => r.progress);
    
    if (resourcesWithProgress.length === 0) {
      alert('No resources have progress to reset!');
      return;
    }

    if (!window.confirm(`Reset progress for ${resourcesWithProgress.length} resources?`)) {
      return;
    }

    setRefreshing(true);
    try {
      const resourceIds = resourcesWithProgress.map(r => r.id);
      const result = await ResourceProgressService.resetMultipleResourcesProgress(resourceIds);
      
      if (result.successful > 0) {
        await fetchSectionProgress();
        alert(`Successfully reset ${result.successful} resources!`);
      }
      
      if (result.failed > 0) {
        alert(`Failed to reset ${result.failed} resources. Please try again.`);
      }
    } catch (error) {
      alert('Bulk reset failed: ' + error.message);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading section progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Section</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button 
          onClick={fetchSectionProgress}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!sectionData) {
    return (
      <div className="text-center py-12">
        <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-600">No section data available</p>
      </div>
    );
  }

  // Filter resources based on current filter and search term
  const filteredResources = sectionData.resources.filter(resource => {
    // Apply status filter
    const statusMatch = (() => {
      switch (filter) {
        case 'completed':
          return resource.progress?.isCompleted;
        case 'revision':
          return resource.progress?.markedForRevision;
        case 'not-started':
          return !resource.progress || (!resource.progress.isCompleted && !resource.progress.markedForRevision);
        default:
          return true;
      }
    })();

    // Apply search filter
    const searchMatch = !searchTerm || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.type.toLowerCase().includes(searchTerm.toLowerCase());

    return statusMatch && searchMatch;
  });

  const { statistics } = sectionData;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <BookOpen className="mr-3 text-blue-600" size={28} />
              {sectionData.section.name}
            </h2>
            <p className="text-gray-600 mt-1">{sectionData.section.description}</p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <span>{sectionData.section.week?.name}</span>
              <span className="mx-2">•</span>
              <span>{sectionData.section.week?.league?.name}</span>
            </div>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <RefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} size={16} />
            Refresh
          </button>
        </div>

        {/* Statistics Dashboard */}
        {showStatistics && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {statistics.totalResources}
              </div>
              <div className="text-sm text-gray-600">Total Resources</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {statistics.completedResources}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {statistics.markedForRevision}
              </div>
              <div className="text-sm text-gray-600">For Revision</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {statistics.completionPercentage}%
              </div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {ResourceProgressService.formatTimeSpent(statistics.totalTimeSpent)}
              </div>
              <div className="text-sm text-gray-600">Time Spent</div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Section Progress</span>
            <span>{statistics.completionPercentage}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${statistics.completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Resources</option>
                <option value="completed">Completed</option>
                <option value="revision">For Revision</option>
                <option value="not-started">Not Started</option>
              </select>
            </div>

            {/* Statistics Toggle */}
            <button
              onClick={() => setShowStatistics(!showStatistics)}
              className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {showStatistics ? <EyeOff size={16} /> : <Eye size={16} />}
              <span className="ml-2 text-sm">Stats</span>
            </button>
          </div>

          {/* Bulk Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleBulkComplete}
              disabled={refreshing}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <CheckCircle size={14} className="mr-1" />
              Complete All
            </button>
            
            <button
              onClick={handleBulkReset}
              disabled={refreshing}
              className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              <RefreshCw size={14} className="mr-1" />
              Reset All
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-3 text-sm text-gray-600">
          Showing {filteredResources.length} of {sectionData.resources.length} resources
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      </div>

      {/* Resources List */}
      <div className="space-y-4">
        {filteredResources.length > 0 ? (
          filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onProgressUpdate={handleResourceProgressUpdate}
              showTimeTracking={true}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Resources Found</h3>
            <p className="text-gray-600">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'This section doesn\'t have any resources yet.'
              }
            </p>
            {(searchTerm || filter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
                className="mt-4 text-blue-600 hover:text-blue-700"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Section Completion Celebration */}
      {statistics.completionPercentage === 100 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-lg font-bold text-green-800 mb-2">Section Completed!</h3>
          <p className="text-green-700">
            Congratulations! You've completed all resources in "{sectionData.section.name}".
          </p>
          <div className="mt-4 text-sm text-green-600">
            Total time spent: {ResourceProgressService.formatTimeSpent(statistics.totalTimeSpent)}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionProgress;
