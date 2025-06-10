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
  Twitter,
  Check,
  X,
  RotateCcw,
  Loader2
} from 'lucide-react';
import ProgressService from '../../utils/progressService';
import DataService from '../../utils/dataService';
import ResourceProgressService from '../../utils/resourceProgressService';
import SocialService from '../../utils/socialService';

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
          initialExpanded[week.id] = true; // Default to expanded
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
        setShowSuccessToast(`"${resourceTitle}" marked as not done 🔄`);
        
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
        setShowSuccessToast(`"${resourceTitle}" completed! 🎉`);
        
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
      
      // Refresh league progress to update section completion
      await fetchLeagueProgress();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-700 rounded w-1/4"></div>
            <div className="h-12 bg-gray-700 rounded w-1/2"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button 
            onClick={onBack}
            className="text-orange-400 hover:text-orange-300 mb-6 flex items-center text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </button>
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-300 mb-2">Error Loading League</h3>
            <p className="text-red-200">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!leagueProgress) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button 
            onClick={onBack}
            className="text-orange-400 hover:text-orange-300 mb-6 flex items-center text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </button>
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No Data Available</h3>
            <p className="text-gray-400">This league doesn't have any content yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={onBack}
            className="text-orange-400 hover:text-orange-300 mb-6 flex items-center text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{leagueProgress.league.name}</h1>
              <p className="text-gray-300">{leagueProgress.league.description}</p>
            </div>
            
            {/* Progress Stats */}
            <div className="text-right">
              <div className="text-sm text-gray-400 mb-1">
                {leagueProgress.progress.completedSections} / {leagueProgress.progress.totalSections}
              </div>
              <div className="bg-gray-700 rounded-full h-2 w-32">
                <div 
                  className="bg-orange-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${leagueProgress.progress.progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Weeks Content */}
        <div className="space-y-6">
          {leagueProgress.progress.weeks?.map((week) => {
            const isExpanded = expandedWeeks[week.id];
            
            // Calculate week progress based on total resources completed across all sections
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
              <div key={week.id} className="bg-gray-800 rounded-lg border border-gray-700">
                {/* Week Header */}
                <div 
                  className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-750"
                  onClick={() => toggleWeekExpansion(week.id)}
                >
                  <div className="flex items-center space-x-4">
                    {isExpanded ? (
                      <ChevronDown size={20} className="text-gray-400" />
                    ) : (
                      <ChevronRight size={20} className="text-gray-400" />
                    )}
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {week.name}
                      </h2>
                      <p className="text-gray-400 text-sm">
                        {completedResources} / {totalResources} resources completed
                      </p>
                    </div>
                  </div>
                  
                  {/* Week Progress Bar */}
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-400">{weekProgress}%</div>
                    <div className="bg-gray-700 rounded-full h-2 w-32">
                      <div 
                        className="bg-orange-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${weekProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Week Content */}
                {isExpanded && (
                  <div className="px-6 pb-6">
                    {week.sections.map((section) => {
                      const resources = sectionResources[section.id] || [];
                      const sectionProgress = resources.length > 0 
                        ? Math.round((resources.filter(r => resourceProgress[r.id]?.isCompleted).length / resources.length) * 100)
                        : 0;

                      return (
                        <div key={section.id} className="mb-6">
                          {/* Section Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-medium text-white">
                                {section.name}
                              </h3>
                              <div className="text-sm text-orange-400">
                                {sectionProgress}% ({resources.filter(r => resourceProgress[r.id]?.isCompleted).length} / {resources.length})
                              </div>
                            </div>
                            <div className="bg-gray-700 rounded-full h-2 w-24">
                              <div 
                                className="bg-orange-400 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${sectionProgress}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Resources Table */}
                          {resources.length > 0 && (
                            <div className="bg-gray-850 rounded-lg border border-gray-700 overflow-hidden">
                              {/* Table Header */}
                              <div className="hidden md:grid grid-cols-8 gap-3 p-4 bg-gray-800 border-b border-gray-700 text-sm font-medium text-gray-300">
                                <div className="col-span-1 text-center">Status</div>
                                <div className="col-span-4">Problem</div>
                                <div className="col-span-1 text-center">Blog Link</div> 
                                <div className="col-span-1">Note</div>
                                <div className="col-span-1 text-center">Share</div>
                              </div>

                              {/* Table Rows */}
                              {resources.map((resource) => {
                                const progress = resourceProgress[resource.id];
                                const isCompleted = progress?.isCompleted || false;
                                const hasNote = progress?.personalNote;

                                return (
                                  <div 
                                    key={resource.id} 
                                    className="md:grid md:grid-cols-8 gap-3 p-4 border-b border-gray-700 last:border-b-0 hover:bg-gray-750 transition-colors"
                                  >
                                    {/* Mobile Layout */}
                                    <div className="md:hidden space-y-3">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                          {/* Enhanced Status Button for Mobile */}
                                          <div className="relative group">
                                            <button
                                              onClick={() => handleResourceComplete(resource.id, isCompleted)}
                                              onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                  e.preventDefault();
                                                  handleResourceComplete(resource.id, isCompleted);
                                                }
                                              }}
                                              disabled={processingResources.has(resource.id)}
                                              className={`
                                                status-button relative p-1.5 rounded-md border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-900
                                                ${isCompleted 
                                                  ? 'completed bg-green-500/20 border-green-400 text-green-400 hover:bg-green-500/30' 
                                                  : 'bg-gray-700/50 border-gray-500 text-gray-400 hover:bg-orange-500/20 hover:border-orange-400 hover:text-orange-400'
                                                }
                                                ${processingResources.has(resource.id) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                                                ${recentlyCompleted.has(resource.id) ? 'success-pulse' : ''}
                                              `}
                                              title={isCompleted ? 'Mark as not done' : 'Mark as done'}
                                              aria-label={isCompleted ? 'Mark as not done' : 'Mark as done'}
                                            >
                                              {processingResources.has(resource.id) ? (
                                                <Loader2 size={16} className="animate-spin" />
                                              ) : isCompleted ? (
                                                <div className="flex items-center">
                                                  <Check size={16} className="completion-checkmark" />
                                                  {recentlyCompleted.has(resource.id) && (
                                                    <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
                                                      ✓
                                                    </div>
                                                  )}
                                                </div>
                                              ) : (
                                                <Square size={16} />
                                              )}
                                            </button>
                                            
                                            {/* Undo Button for Completed Items */}
                                            {isCompleted && !processingResources.has(resource.id) && (
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleResourceComplete(resource.id, true);
                                                }}
                                                className="absolute -top-1 -right-1 bg-orange-600 hover:bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 shadow-lg"
                                                title="Mark as not done (this will reset your progress)"
                                              >
                                                <RotateCcw size={10} />
                                              </button>
                                            )}
                                          </div>
                                          
                                          {getResourceTypeIcon(resource.type)}
                                          <span className={`text-sm transition-all duration-300 ${isCompleted ? 'line-through text-gray-500' : 'text-white'}`}>
                                            {resource.title}
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <button
                                            onClick={() => window.open(resource.url, '_blank')}
                                            className="bg-orange-500 text-white px-3 py-1 rounded text-xs hover:bg-orange-600 transition-colors"
                                          >
                                            Click
                                          </button>
                                          <button
                                            onClick={() => handleShareOnTwitter(resource.title, leagueProgress.league.name)}
                                            className="text-blue-400 hover:text-blue-300 transition-colors"
                                            title="Share on Twitter"
                                          >
                                            <Twitter size={16} />
                                          </button>
                                        </div>
                                      </div>
                                      <div className="ml-8">
                                        {editingNote === resource.id ? (
                                          <div className="flex items-center space-x-2">
                                            <input
                                              type="text"
                                              value={noteText}
                                              onChange={(e) => setNoteText(e.target.value)}
                                              className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-orange-400"
                                              placeholder="Add note..."
                                              onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                  handleResourceNote(resource.id, noteText);
                                                }
                                              }}
                                            />
                                            <button
                                              onClick={() => handleResourceNote(resource.id, noteText)}
                                              className="text-green-400 hover:text-green-300"
                                            >
                                              <CheckSquare size={14} />
                                            </button>
                                          </div>
                                        ) : (
                                          <div className="flex items-center space-x-2">
                                            <span className="text-xs text-gray-400">
                                              Note: {hasNote ? hasNote : 'No note'}
                                            </span>
                                            <button
                                              onClick={() => {
                                                setEditingNote(resource.id);
                                                setNoteText(hasNote || '');
                                              }}
                                              className="text-gray-400 hover:text-orange-400 transition-colors"
                                            >
                                              <Plus size={14} />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Desktop Layout */}
                                    <div className="hidden md:contents">
                                      {/* Status */}
                                      <div className="col-span-1 flex justify-center">
                                        <div className="relative group">
                                          <button
                                            onClick={() => handleResourceComplete(resource.id, isCompleted)}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleResourceComplete(resource.id, isCompleted);
                                              }
                                            }}
                                            disabled={processingResources.has(resource.id)}
                                            className={`
                                              status-button relative p-1.5 rounded-md border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-900
                                              ${isCompleted 
                                                ? 'completed bg-green-500/20 border-green-400 text-green-400 hover:bg-green-500/30' 
                                                : 'bg-gray-700/50 border-gray-500 text-gray-400 hover:bg-orange-500/20 hover:border-orange-400 hover:text-orange-400'
                                              }
                                              ${processingResources.has(resource.id) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                                              ${recentlyCompleted.has(resource.id) ? 'success-pulse' : ''}
                                            `}
                                            title={isCompleted ? 'Mark as not done' : 'Mark as done'}
                                            aria-label={isCompleted ? 'Mark as not done' : 'Mark as done'}
                                          >
                                            {processingResources.has(resource.id) ? (
                                              <Loader2 size={16} className="animate-spin" />
                                            ) : isCompleted ? (
                                              <div className="flex items-center">
                                                <Check size={16} className="completion-checkmark" />
                                                {recentlyCompleted.has(resource.id) && (
                                                  <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
                                                    ✓
                                                  </div>
                                                )}
                                              </div>
                                            ) : (
                                              <Square size={16} />
                                            )}
                                          </button>
                                          
                                          {/* Undo Button for Completed Items */}
                                          {isCompleted && !processingResources.has(resource.id) && (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleResourceComplete(resource.id, true);
                                              }}
                                              className="absolute -top-1 -right-1 bg-orange-600 hover:bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 shadow-lg"
                                              title="Mark as not done (this will reset your progress)"
                                            >
                                              <RotateCcw size={10} />
                                            </button>
                                          )}
                                        </div>
                                      </div>

                                      {/* Problem */}
                                      <div className="col-span-4">
                                        <div className="flex items-center space-x-2">
                                          {getResourceTypeIcon(resource.type)}
                                          <span className={`text-sm ${isCompleted ? 'line-through text-gray-500' : 'text-white'}`}>
                                            {resource.title}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Blog Link */}
                                      <div className="col-span-1 flex justify-center">
                                        <button
                                          onClick={() => window.open(resource.url, '_blank')}
                                          className="bg-orange-500 text-white px-3 py-1 rounded text-xs hover:bg-orange-600 transition-colors"
                                        >
                                          Click
                                        </button>
                                      </div>

                                      {/* Note */}
                                      <div className="col-span-1">
                                        {editingNote === resource.id ? (
                                          <div className="flex items-center space-x-2">
                                            <input
                                              type="text"
                                              value={noteText}
                                              onChange={(e) => setNoteText(e.target.value)}
                                              className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-orange-400"
                                              placeholder="Add note..."
                                              onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                  handleResourceNote(resource.id, noteText);
                                                }
                                              }}
                                            />
                                            <button
                                              onClick={() => handleResourceNote(resource.id, noteText)}
                                              className="text-green-400 hover:text-green-300"
                                            >
                                              <CheckSquare size={14} />
                                            </button>
                                          </div>
                                        ) : (
                                          <div className="flex items-center space-x-2">
                                            <span className="text-xs text-gray-400 truncate">
                                              {hasNote ? hasNote : 'No note'}
                                            </span>
                                            <button
                                              onClick={() => {
                                                setEditingNote(resource.id);
                                                setNoteText(hasNote || '');
                                              }}
                                              className="text-gray-400 hover:text-orange-400 transition-colors"
                                            >
                                              <Plus size={14} />
                                            </button>
                                          </div>
                                        )}
                                      </div>

                                      {/* Share on Twitter */}
                                      <div className="col-span-1 flex justify-center">
                                        <button
                                          onClick={() => handleShareOnTwitter(resource.title, leagueProgress.league.name)}
                                          className="text-blue-400 hover:text-blue-300 transition-colors"
                                          title="Share on Twitter"
                                        >
                                          <Twitter size={16} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* No Resources Message */}
                          {resources.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              <FileText size={32} className="mx-auto mb-2 text-gray-600" />
                              <p className="text-sm">No resources available for this section yet.</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* No Weeks Message */}
        {(!leagueProgress.progress.weeks || leagueProgress.progress.weeks.length === 0) && (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No Content Available</h3>
            <p className="text-gray-400">This league doesn't have any weeks or sections yet.</p>
          </div>
        )}
      </div>
      
      {/* Success Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className={`${
            toastType === 'success' 
              ? 'bg-green-500' 
              : 'bg-orange-500'
          } text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm`}>
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                {toastType === 'success' ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <RotateCcw size={16} className="text-orange-500" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{showSuccessToast}</p>
            </div>
            <button
              onClick={() => setShowSuccessToast(null)}
              className={`flex-shrink-0 transition-colors ${
                toastType === 'success'
                  ? 'text-green-200 hover:text-white'
                  : 'text-orange-200 hover:text-white'
              }`}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeagueDetailPage;
