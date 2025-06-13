import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, 
  CheckSquare, 
  Square, 
  FileText, 
  ExternalLink, 
  Plus,
  BookOpen,
  Play,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  RotateCcw,
  Loader2,
  ClipboardList,
  Calendar,
  Send
} from 'lucide-react';
import { RiTwitterXFill } from 'react-icons/ri';
import ProgressService from '../../utils/progressService';
import ResourceProgressService from '../../utils/resourceProgressService';
import SocialService from '../../utils/socialService';
import DataService from '../../utils/dataService';
import AssignmentManagement from './AssignmentManagement';
import PageHead from '../common/PageHead';

const LeagueDetailPage = ({ league, onBack }) => {
  const [leagueProgress, setLeagueProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [sectionResources, setSectionResources] = useState({});
  const [resourceProgress, setResourceProgress] = useState({});
  const [processingResources, setProcessingResources] = useState(new Set());
  const [recentlyCompleted, setRecentlyCompleted] = useState(new Set());
  const [showSuccessToast, setShowSuccessToast] = useState(null);
  const [toastType, setToastType] = useState('success'); // 'success' or 'undo'

  // Assignment-related state - no longer needed as handled by AssignmentManagement component

  const fetchLeagueProgress = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await ProgressService.getLeagueProgress(league.id);
      setLeagueProgress(data);
      
      // Initialize expanded state for all weeks
      if (data.progress.weeks) {
        const initialExpanded = {};
        data.progress.weeks.forEach(week => {
          initialExpanded[week.id] = false; // Default to expanded
        });
        setExpandedWeeks(initialExpanded);
        
        // Fetch resources for each section
        for (const week of data.progress.weeks) {
          for (const section of week.sections) {
            await fetchSectionResources(section.id);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching league progress:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [league.id]);

  // Assignment functions - no longer needed as handled by AssignmentManagement component

  // Calculate overall league progress based on actual resource completion
  const calculateOverallProgress = () => {
    if (!leagueProgress?.progress?.weeks) return { percentage: 0, completed: 0, total: 0 };
    
    let totalResources = 0;
    let completedResources = 0;
    
    leagueProgress.progress.weeks.forEach(week => {
      week.sections.forEach(section => {
        const resources = sectionResources[section.id] || [];
        totalResources += resources.length;
        completedResources += resources.filter(r => resourceProgress[r.id]?.isCompleted).length;
      });
    });
    
    const percentage = totalResources > 0 ? Math.round((completedResources / totalResources) * 100) : 0;
    return { percentage, completed: completedResources, total: totalResources };
  };

  const fetchSectionResources = async (sectionId) => {
    try {
      const resourcesData = await ResourceProgressService.getSectionResourcesProgress(sectionId);
      setSectionResources(prev => ({
        ...prev,
        [sectionId]: resourcesData.resources || []
      }));
      
      // Store resource progress
      if (resourcesData.resources) {
        const progress = {};
        resourcesData.resources.forEach(resource => {
          if (resource.progress) {
            progress[resource.id] = resource.progress;
          }
        });
        setResourceProgress(prev => ({ ...prev, ...progress }));
      }
    } catch (err) {
      console.error('Error fetching section resources:', err);
    }
  };

  useEffect(() => {
    fetchLeagueProgress();
    // Assignment functionality now handled by AssignmentManagement component
  }, [fetchLeagueProgress]);

  const toggleWeekExpansion = (weekId) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekId]: !prev[weekId]
    }));
  };

  const handleResourceComplete = async (resourceId, currentStatus = false) => {
    try {
      // Confirmation for unmarking completed resources
      if (currentStatus) {
        const resourceTitle = Object.values(sectionResources)
          .flat()
          .find(r => r.id === resourceId)?.title || 'Resource';
        
        const confirmed = window.confirm(
          `Are you sure you want to mark "${resourceTitle}" as not done?\n\nThis will reset your progress for this resource.`
        );
        
        if (!confirmed) {
          return; // User cancelled
        }
      }
      
      // Add to processing state for loading indicator
      setProcessingResources(prev => new Set([...prev, resourceId]));
      
      if (currentStatus) {
        // Reset resource progress (mark as incomplete)
        await ResourceProgressService.resetResourceProgress(resourceId);
        setResourceProgress(prev => ({
          ...prev,
          [resourceId]: { ...prev[resourceId], isCompleted: false }
        }));
        
        // Show undo toast
        const resourceTitle = Object.values(sectionResources)
          .flat()
          .find(r => r.id === resourceId)?.title || 'Resource';
        setToastType('undo');
        
        // Calculate new progress for toast message  
        const newProgress = calculateOverallProgress();
        setShowSuccessToast(`"${resourceTitle}" marked as not done 🔄 (${newProgress.percentage}% overall)`);
        
        // Hide toast after 3 seconds
        setTimeout(() => {
          setShowSuccessToast(null);
        }, 3000);
      } else {
        // Mark as complete
        await ResourceProgressService.markResourceCompleted(resourceId);
        setResourceProgress(prev => ({
          ...prev,
          [resourceId]: { ...prev[resourceId], isCompleted: true }
        }));
        
        // Add to recently completed for animation
        setRecentlyCompleted(prev => new Set([...prev, resourceId]));
        
        // Show success toast with resource title
        const resourceTitle = Object.values(sectionResources)
          .flat()
          .find(r => r.id === resourceId)?.title || 'Resource';
        setToastType('success');
        
        // Calculate new progress for toast message
        const newProgress = calculateOverallProgress();
        setShowSuccessToast(`"${resourceTitle}" completed! 🎉 (${newProgress.percentage}% overall)`);
        
        // Remove from recently completed after animation
        setTimeout(() => {
          setRecentlyCompleted(prev => {
            const newSet = new Set(prev);
            newSet.delete(resourceId);
            return newSet;
          });
        }, 2000);
        
        // Hide toast after 3 seconds
        setTimeout(() => {
          setShowSuccessToast(null);
        }, 3000);
      }
      
      // Note: We don't need to refresh league progress anymore since we calculate it locally
      // This makes the UI more responsive and reduces API calls
    } catch (err) {
      console.error('Error updating resource completion:', err);
      
      // More specific error messages
      if (currentStatus) {
        alert('Failed to mark resource as incomplete. Please try again.');
      } else {
        alert('Failed to mark resource as complete. Please try again.');
      }
    } finally {
      // Remove from processing state
      setProcessingResources(prev => {
        const newSet = new Set(prev);
        newSet.delete(resourceId);
        return newSet;
      });
    }
  };

  const handleResourceNote = async (resourceId, note) => {
    try {
      await ResourceProgressService.updateResourceNote(resourceId, note);
      setResourceProgress(prev => ({
        ...prev,
        [resourceId]: { ...prev[resourceId], personalNote: note }
      }));
      setEditingNote(null);
      setNoteText('');
    } catch (err) {
      console.error('Error updating resource note:', err);
      alert('Failed to update note. Please try again.');
    }
  };

  const handleShareOnTwitter = (resourceTitle, leagueName) => {
    const message = `📚 Just completed "${resourceTitle}" in ${leagueName} on @OpenLearn! #Learning #Progress #OpenLearn`;
    SocialService.shareOnTwitter(message);
  };

  const getResourceTypeIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'VIDEO':
        return <Play size={16} className="text-red-600" />;
      case 'ARTICLE':
        return <FileText size={16} className="text-blue-600" />;
      case 'EXTERNAL_LINK':
        return <ExternalLink size={16} className="text-green-600" />;
      case 'BLOG':
        return <BookOpen size={16} className="text-purple-600" />;
      default:
        return <FileText size={16} className="text-gray-600" />;
    }
  };
  const getResourceTypeName = (type) => {
    switch (type?.toUpperCase()) {
      case 'VIDEO':
        return 'Video';
      case 'ARTICLE':
        return 'Article';
      case 'EXTERNAL_LINK':
        return 'Link';
      case 'BLOG':
        return 'Blog';
      default:
        return 'File';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button 
            onClick={onBack}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </button>
          <div className="bg-white rounded-lg border border-red-200 shadow-sm p-6">
            <h3 className="text-lg font-medium text-red-700 mb-2">Error Loading League</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#FFDE59] text-gray-900 rounded-lg hover:bg-[#FFD700] transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!leagueProgress) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button 
            onClick={onBack}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </button>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
            <BookOpen size={40} className="mx-auto mb-3 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Data Available</h3>
            <p className="text-gray-600 text-sm">This league doesn't have any content yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 content-scroll">
      <PageHead 
        title={`${leagueProgress.league.name} - OpenLearn`}
        description={`Learn and track your progress in ${leagueProgress.league.name}. Complete resources, submit assignments, and advance your learning journey with OpenLearn.`}
        keywords={`${leagueProgress.league.name}, online learning, programming course, skill development, progress tracking, assignments, OpenLearn`}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Compact Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={onBack}
              className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Dashboard
            </button>              {/* Quick Stats - Updated to use actual resource progress */}
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <span>{calculateOverallProgress().total} resources</span>
                <span className="text-green-600 font-medium">{calculateOverallProgress().completed} completed</span>
                <span className="font-semibold text-gray-900 px-2 py-1 bg-gray-100 rounded">
                  {calculateOverallProgress().percentage}% progress
                </span>
              </div>
          </div>
          
          {/* Compact League Header */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h1 className="text-xl font-semibold text-gray-900 mb-1">{leagueProgress.league.name}</h1>
                  <p className="text-sm text-gray-600">{leagueProgress.league.description}</p>
                </div>
                
                {/* Compact Progress Indicator - Updated to use actual resource progress */}
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{calculateOverallProgress().percentage}%</div>
                    <div className="text-xs text-gray-500">Complete</div>
                  </div>
                  <div className="w-12 h-12 relative">
                    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 A 15.9155 15.9155 0 0 1 18 33.9155"
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 A 15.9155 15.9155 0 0 1 18 33.9155"
                        fill="none"
                        stroke="#FFDE59"
                        strokeWidth="3"
                        strokeDasharray={`${calculateOverallProgress().percentage/2}, 100`}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress Bar - Updated to use actual resource progress */}
            <div className="px-6 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Overall Progress</span>
                <span className="text-xs text-gray-600">
                  {calculateOverallProgress().completed} of {calculateOverallProgress().total} resources
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#FFDE59] to-[#FFD700] h-2 rounded-full transition-all duration-1000 ease-out progress-bar-fill"
                  style={{ width: `${calculateOverallProgress().percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Weeks Content */}
        <div className="space-y-4 content-scroll">
          {leagueProgress.progress.weeks?.map((week) => {
            const isExpanded = expandedWeeks[week.id];
            
            // Calculate week progress
            let totalResources = 0;
            let completedResources = 0;
            
            week.sections.forEach(section => {
              const resources = sectionResources[section.id] || [];
              totalResources += resources.length;
              completedResources += resources.filter(r => resourceProgress[r.id]?.isCompleted).length;
            });
            
            const weekProgress = totalResources > 0 
              ? Math.round((completedResources / totalResources) * 100)
              : 0;

            return (
              <div key={week.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                {/* Compact Week Header */}
                <div 
                  className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100"
                  onClick={() => toggleWeekExpansion(week.id)}
                >
                  <div className="flex items-center space-x-3">
                    {isExpanded ? (
                      <ChevronDown size={18} className="text-gray-400" />
                    ) : (
                      <ChevronRight size={18} className="text-gray-400" />
                    )}
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">{week.name}</h2>
                      <p className="text-sm text-gray-500">
                        {completedResources} of {totalResources} resources completed
                      </p>
                    </div>
                  </div>
                  
                  {/* Compact Progress */}
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900">{weekProgress}%</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#FFDE59] to-[#FFD700] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${weekProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Week Content */}
                {isExpanded && (
                  <div className="px-6 pb-4 content-scroll">
                    <div className="space-y-4">
                      {week.sections.map((section) => {
                        const resources = sectionResources[section.id] || [];
                        const sectionProgress = resources.length > 0 
                          ? Math.round((resources.filter(r => resourceProgress[r.id]?.isCompleted).length / resources.length) * 100)
                          : 0;

                        return (
                          <div key={section.id} className="border mt-4 border-gray-100 rounded-lg">
                            {/* Compact Section Header */}
                            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-t-lg border-b border-gray-100">
                              <div className="flex items-center space-x-3">
                                <h3 className="font-medium text-gray-900">{section.name}</h3>
                                <span className="text-sm text-gray-500">
                                  {resources.filter(r => resourceProgress[r.id]?.isCompleted).length}/{resources.length}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-900">{sectionProgress}%</span>
                                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-gradient-to-r from-[#FFDE59] to-[#FFD700] h-1.5 rounded-full transition-all duration-500"
                                    style={{ width: `${sectionProgress}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>

                            {/* Compact Resources Table */}
                            {resources.length > 0 && (
                              <div>
                                {/* Table Header */}
                                <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-100 border-b border-gray-200 text-xs font-medium text-gray-700 uppercase tracking-wider">
                                  <div className="col-span-1 flex justify-center">Status</div>
                                  <div className="col-span-5">Title</div>
                                  <div className="col-span-2 text-center">Type</div>
                                  <div className="col-span-1 text-center">Link</div>
                                  <div className="col-span-2 text-center">Note</div>
                                  <div className="col-span-1 text-center">Share</div>
                                </div>
                                
                                {/* Table Rows */}
                                <div>
                                  {resources.map((resource) => {
                                  const progress = resourceProgress[resource.id];
                                  const isCompleted = progress?.isCompleted || false;
                                  const hasNote = progress?.personalNote;

                                  return (
                                    <div 
                                      key={resource.id} 
                                      className="grid grid-cols-12 gap-2 items-center px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                    >
                                      {/* Status Column */}
                                      <div className="col-span-1 flex justify-center">
                                        <button
                                          onClick={() => handleResourceComplete(resource.id, isCompleted)}
                                          disabled={processingResources.has(resource.id)}
                                          className={`
                                            flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 hover-lift
                                            ${isCompleted 
                                              ? 'bg-green-500 border-green-500 text-white shadow-sm' 
                                              : 'border-gray-300 hover:border-[#FFDE59] hover:bg-[#FFDE59]/10'
                                            }
                                            ${processingResources.has(resource.id) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                                            ${recentlyCompleted.has(resource.id) ? 'success-pulse' : ''}
                                          `}
                                          title={isCompleted ? 'Mark as not done' : 'Mark as done'}
                                        >
                                          {processingResources.has(resource.id) ? (
                                            <Loader2 size={12} className="animate-spin" />
                                          ) : isCompleted ? (
                                            <Check size={12} className="completion-checkmark" />
                                          ) : null}
                                        </button>
                                      </div>

                                      {/* Title Column */}
                                      <div className="col-span-5">
                                        <span className={`text-sm ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'} truncate block`}>
                                          {resource.title}
                                        </span>
                                      </div>

                                      {/* Type Column */}
                                      <div className="col-span-2 flex justify-center">
                                        <div className="flex items-center space-x-1">
                                          {getResourceTypeIcon(resource.type)}
                                          <span className="text-xs text-gray-600 capitalize">
                                            {getResourceTypeName(resource.type)}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Link Column */}
                                      <div className="col-span-1 flex justify-center">
                                        <button
                                          onClick={() => window.open(resource.url, '_blank')}
                                          className="px-2 py-1 text-xs font-medium bg-[#FFDE59] text-gray-900 rounded hover:bg-[#FFD700] transition-colors cursor-pointer"
                                        >
                                          Open
                                        </button>
                                      </div>

                                      {/* Note Column */}
                                      <div className="col-span-2 flex justify-center">
                                        {editingNote === resource.id ? (
                                          <div className="flex items-center space-x-1 w-full">
                                            <input
                                              type="text"
                                              value={noteText}
                                              onChange={(e) => setNoteText(e.target.value)}
                                              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#FFDE59]"
                                              placeholder="Add note..."
                                              onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                  handleResourceNote(resource.id, noteText);
                                                }
                                              }}
                                            />
                                            <button
                                              onClick={() => handleResourceNote(resource.id, noteText)}
                                              className="text-green-600 hover:text-green-700 flex-shrink-0"
                                            >
                                              <Check size={12} />
                                            </button>
                                          </div>
                                        ) : (
                                          <button
                                            onClick={() => {
                                              setEditingNote(resource.id);
                                              setNoteText(hasNote || '');
                                            }}
                                            className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 rounded hover:bg-gray-100 max-w-full truncate"
                                            title={hasNote ? `Note: ${hasNote}` : 'Add note'}
                                          >
                                            {hasNote ? (
                                              <span className="truncate block max-w-20">{hasNote}</span>
                                            ) : (
                                              '➕ Note'
                                            )}
                                          </button>
                                        )}
                                      </div>

                                      {/* Share Column */}
                                      <div className="col-span-1 flex justify-center">
                                        <button
                                          onClick={() => handleShareOnTwitter(resource.title, leagueProgress.league.name)}
                                          className="text-gray-400 hover:text-black transition-colors p-1"
                                          title="Share on X (formerly Twitter)"
                                        >
                                          <RiTwitterXFill size={14} />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                                </div>
                              </div>
                            )}

                            {/* No Resources Message */}
                            {resources.length === 0 && (
                              <div className="px-4 py-8 text-center text-gray-500">
                                <FileText size={24} className="mx-auto mb-2 text-gray-400" />
                                <p className="text-sm">No resources available for this section.</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* No Weeks Message */}
        {(!leagueProgress.progress.weeks || leagueProgress.progress.weeks.length === 0) && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
            <BookOpen size={40} className="mx-auto mb-3 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Available</h3>
            <p className="text-gray-600">This league doesn't have any weeks or sections yet.</p>
          </div>
        )}

        {/* Assignment Section */}
        <AssignmentManagement 
          leagueId={league.id} 
        />

      </div>
      
      {/* Compact Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className={`${
            toastType === 'success' 
              ? 'bg-green-500' 
              : 'bg-orange-500'
          } text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm`}>
            <div className="flex-shrink-0">
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                {toastType === 'success' ? (
                  <Check size={12} className="text-green-500" />
                ) : (
                  <RotateCcw size={12} className="text-orange-500" />
                )}
              </div>
            </div>
            <p className="text-sm font-medium">{showSuccessToast}</p>
            <button
              onClick={() => setShowSuccessToast(null)}
              className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeagueDetailPage;
