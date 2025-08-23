import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  ArrowLeft,
  FileText, 
  ExternalLink,
  BookOpen,
  Play,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  RotateCcw,
  Loader2,
  Edit,
  Save,
  Star
} from 'lucide-react';
import { RiTwitterXFill } from 'react-icons/ri';
import ProgressService from '../../utils/progressService';
import ResourceProgressService from '../../utils/resourceProgressService';
import SocialService from '../../utils/socialService';
import FaviconService from '../../utils/faviconService'; // @see docs/development/favicon-service.md
import AssignmentManagement from './AssignmentManagement';
import PageHead from '../common/PageHead';
import { 
  LeagueDetailSkeleton,
  ProgressiveLoadingSkeleton 
} from '../common/SkeletonLoader';
import ProgressIndicator, { 
  SectionLoadingIndicator 
} from '../common/ProgressIndicator';

// Resource Icon Component with Favicon
const ResourceIcon = ({ resource, showDomain = false, favicons = {}, loadingFavicons = new Set(), setFavicons = () => {} }) => {
  const faviconData = favicons[resource.id];
  const isLoading = loadingFavicons.has(resource.id);

  // Helper function for resource type icons
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

  // Helper function for resource type names
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

  if (isLoading) {
    return (
      <div className="flex items-center space-x-1">
        <div className="w-4 h-4 bg-gray-200 rounded-sm animate-pulse"></div>
        {showDomain && (
          <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
        )}
      </div>
    );
  }

  if (faviconData?.type === 'favicon') {
    return (
      <div className="flex items-center space-x-1">
        <img 
          src={faviconData.url} 
          alt={`${faviconData.domain} favicon`}
          className="w-4 h-4 rounded-sm object-cover"
          onError={() => {
            // Fallback to type icon on error
            setFavicons(prev => ({
              ...prev,
              [resource.id]: { type: 'fallback', url: null }
            }));
          }}
        />
        {showDomain && faviconData.domain && (
          <span className="text-xs text-gray-500 truncate max-w-20">
            {faviconData.domain}
          </span>
        )}
      </div>
    );
  }

  // Fallback to type-based icons
  return (
    <div className="flex items-center space-x-1">
      {getResourceTypeIcon(resource.type)}
      {showDomain && (
        <span className="text-xs text-gray-500">
          {getResourceTypeName(resource.type)}
        </span>
      )}
    </div>
  );
};

// Separate NoteModal component to prevent re-creation on every render
const NoteModal = React.memo(({ 
  showNoteModal, 
  selectedResource, 
  resourceProgress, 
  noteText, 
  setNoteText, 
  closeNoteModal, 
  saveNote, 
  openResourceWithType, 
  getResourceTypeName,
  textareaRef,
  favicons,
  loadingFavicons,
  setFavicons
}) => {
  if (!showNoteModal || !selectedResource) return null;

  const progress = resourceProgress[selectedResource.id];
  const currentNote = progress?.personalNote || '';

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeNoteModal();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      saveNote();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Edit size={20} className="text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Resource Note</h3>
          </div>
          <button
            onClick={closeNoteModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Resource:</h4>
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <ResourceIcon 
                resource={selectedResource} 
                favicons={favicons}
                loadingFavicons={loadingFavicons}
                setFavicons={setFavicons}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{selectedResource.title}</p>
                <p className="text-xs text-gray-500">{getResourceTypeName(selectedResource.type)}</p>
              </div>
              <button
                onClick={() => openResourceWithType(selectedResource)}
                className="px-2 py-1 text-xs bg-[#FFDE59] text-gray-900 rounded hover:bg-[#FFD700] transition-colors flex items-center space-x-1"
              >
                <ExternalLink size={12} />
                <span>View</span>
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Personal Note
            </label>
            <textarea
              ref={textareaRef}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value.slice(0, 500))}
              placeholder="Add your thoughts, key learnings, or reminders about this resource..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDE59] focus:border-transparent resize-none"
              rows={4}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              <p className={`text-xs ${noteText.length > 450 ? 'text-red-500' : 'text-gray-500'}`}>
                {noteText.length}/500 characters
              </p>
              {noteText.length > 450 && (
                <p className="text-xs text-red-500">Character limit approaching</p>
              )}
            </div>
          </div>

          {currentNote && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Current note:</p>
              <p className="text-sm text-gray-800">{currentNote?.slice(0, 50) || "No content"}...</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={closeNoteModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveNote}
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-[#FFDE59] rounded-lg hover:bg-[#FFD700] transition-colors flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Save Note</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

NoteModal.displayName = 'NoteModal';

const LeagueDetailPage = ({ league, onBack }) => {
  const [leagueProgress, setLeagueProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [favicons, setFavicons] = useState({});
  const [loadingFavicons, setLoadingFavicons] = useState(new Set());
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [sectionResources, setSectionResources] = useState({});
  const [resourceProgress, setResourceProgress] = useState({});
  const [processingResources, setProcessingResources] = useState(new Set());
  const [recentlyCompleted, setRecentlyCompleted] = useState(new Set());
  const [showSuccessToast, setShowSuccessToast] = useState(null);
  const [toastType, setToastType] = useState('success'); // 'success' or 'undo'
  
  // OPTIMIZATION 9: Progressive loading states
  const [resourcesLoading, setResourcesLoading] = useState(false);
  
  // ENHANCEMENT: Enhanced loading states for better UX
  const [sectionsLoadingProgress, setSectionsLoadingProgress] = useState({});
  
  // Ref for textarea to maintain focus
  const textareaRef = useRef(null);

  // Focus textarea when modal opens
  useEffect(() => {
    if (showNoteModal && textareaRef.current) {
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [showNoteModal]);

  // Local ResourceIcon component with access to component state
  const LocalResourceIcon = ({ resource, showDomain = false }) => (
    <ResourceIcon 
      resource={resource} 
      showDomain={showDomain}
      favicons={favicons}
      loadingFavicons={loadingFavicons}
      setFavicons={setFavicons}
    />
  );

    // Fetch favicon for a resource
  const fetchResourceFavicon = async (resourceId, resourceUrl, resourceType) => {
    setLoadingFavicons(prev => new Set([...prev, resourceId]));
    
    try {
      const iconData = await FaviconService.getResourceIcon(resourceUrl, resourceType);
      
      setFavicons(prev => ({
        ...prev,
        [resourceId]: iconData
      }));
    } catch (error) {
      console.warn('Failed to fetch favicon for resource:', resourceId, error);
    } finally {
      setLoadingFavicons(prev => {
        const newSet = new Set(prev);
        newSet.delete(resourceId);
        return newSet;
      });
    }
  };

  // OPTIMIZATION 7: Optimized favicon preloading with debouncing
  const preloadFavicons = useCallback(async () => {
    if (!leagueProgress?.progress?.weeks) return;

    const allResources = [];
    const resourceUrls = [];
    
    leagueProgress.progress.weeks.forEach(week => {
      week.sections?.forEach(section => {
        const resources = sectionResources[section.id] || [];
        resources.forEach(resource => {
          allResources.push(resource);
          resourceUrls.push(resource.url);
        });
      });
    });

    // OPTIMIZATION: Load favicons in background with lower priority
    try {
      // Use requestIdleCallback for non-blocking execution
      if (window.requestIdleCallback) {
        window.requestIdleCallback(async () => {
          await FaviconService.preloadFavicons(resourceUrls);
          
          // Fetch favicons for all resources in batches
          const batchSize = 5;
          for (let i = 0; i < allResources.length; i += batchSize) {
            const batch = allResources.slice(i, i + batchSize);
            const faviconPromises = batch.map(resource => 
              fetchResourceFavicon(resource.id, resource.url, resource.type)
            );
            await Promise.allSettled(faviconPromises);
          }
        });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(async () => {
          await FaviconService.preloadFavicons(resourceUrls);
          const faviconPromises = allResources.map(resource => 
            fetchResourceFavicon(resource.id, resource.url, resource.type)
          );
          await Promise.allSettled(faviconPromises);
        }, 1000);
      }
    } catch (error) {
      console.warn('Error preloading favicons:', error);
    }
  }, [leagueProgress, sectionResources]);

  // Resource Icon Component with Favicon
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
          initialExpanded[week.id] = false; // Default to collapsed for faster initial load
        });
        setExpandedWeeks(initialExpanded);
        
        // OPTIMIZATION 1: Parallel loading of ALL section resources
        const allSectionIds = data.progress.weeks.flatMap(week => 
          week.sections.map(section => section.id)
        );
        
        // Set loading to false early to show basic progress data immediately
        setLoading(false);
        setResourcesLoading(true);
        
        // Load resources in parallel batches for better performance
        const batchSize = 5; // Load 5 sections at a time
        for (let i = 0; i < allSectionIds.length; i += batchSize) {
          const batch = allSectionIds.slice(i, i + batchSize);
          const promises = batch.map(sectionId => fetchSectionResources(sectionId));
          await Promise.all(promises);
        }
        
        setResourcesLoading(false);
      }
    } catch (err) {
      console.error('Error fetching league progress:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [league.id]);

  // OPTIMIZATION 8: Non-blocking favicon loading
  useEffect(() => {
    if (Object.keys(sectionResources).length > 0) {
      // Delay favicon loading to not block initial render
      setTimeout(() => {
        preloadFavicons();
      }, 2000);
    }
  }, [sectionResources, preloadFavicons]);

  // Assignment functions - no longer needed as handled by AssignmentManagement component

  // Calculate overall league progress based on actual resource completion
  // OPTIMIZATION 2: Memoized progress calculation for better performance
  const calculateOverallProgress = useMemo(() => {
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
  }, [leagueProgress, sectionResources, resourceProgress]);

  const fetchSectionResources = async (sectionId) => {
    try {
      // Track section loading progress
      setSectionsLoadingProgress(prev => ({ ...prev, [sectionId]: 0 }));
      
      const resourcesData = await ResourceProgressService.getSectionResourcesProgress(sectionId);
      
      // Update progress
      setSectionsLoadingProgress(prev => ({ ...prev, [sectionId]: 50 }));
      
      // OPTIMIZATION 3: Batch state updates for better performance
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
      
      // Complete progress tracking
      setSectionsLoadingProgress(prev => ({ ...prev, [sectionId]: 100 }));
      
      // Clean up progress after a delay
      setTimeout(() => {
        setSectionsLoadingProgress(prev => {
          const newState = { ...prev };
          delete newState[sectionId];
          return newState;
        });
      }, 1000);
      
    } catch (err) {
      console.error('Error fetching section resources:', err);
      // Clean up progress on error
      setSectionsLoadingProgress(prev => {
        const newState = { ...prev };
        delete newState[sectionId];
        return newState;
      });
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
    
    // OPTIMIZATION 6: Lazy load resources when week is expanded
    const week = leagueProgress?.progress?.weeks?.find(w => w.id === weekId);
    if (week && !expandedWeeks[weekId]) {
      // Load resources for sections in this week if not already loaded
      week.sections.forEach(section => {
        if (!sectionResources[section.id]) {
          fetchSectionResources(section.id);
        }
      });
    }
  };

  const handleResourceComplete = async (resourceId, currentStatus = false) => {
    // Store the original state for potential rollback
    const originalState = resourceProgress[resourceId];
    
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
        setShowSuccessToast(`"${resourceTitle}" marked as not done`);
        
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
    } catch (err) {
      console.error('❌ Error updating resource completion:', err);
      
      // Revert the optimistic UI update
      setResourceProgress(prev => ({
        ...prev,
        [resourceId]: originalState || { isCompleted: currentStatus }
      }));
      
      // More specific error messages based on the action attempted
      const resourceTitle = Object.values(sectionResources)
        .flat()
        .find(r => r.id === resourceId)?.title || 'Resource';
        
      const errorMessage = err.message || 'Unknown error occurred';
      
      if (currentStatus) {
        alert(`Failed to mark "${resourceTitle}" as incomplete. The resource is still marked as complete. Please try again.\n\nError: ${errorMessage}`);
      } else {
        alert(`Failed to mark "${resourceTitle}" as complete. Please try again.\n\nError: ${errorMessage}`);
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

  const handleResourceRevision = async (resourceId, currentRevisionStatus = false) => {
    try {
      // Add to processing state for loading indicator
      setProcessingResources(prev => new Set([...prev, resourceId]));
      
      const resourceTitle = Object.values(sectionResources)
        .flat()
        .find(r => r.id === resourceId)?.title || 'Resource';
      
      if (currentRevisionStatus) {
        // Unmark for revision
        await ResourceProgressService.resetResourceProgress(resourceId);
        setResourceProgress(prev => ({
          ...prev,
          [resourceId]: { ...prev[resourceId], markedForRevision: false }
        }));
        
        setToastType('undo');
        setShowSuccessToast(`"${resourceTitle}" unmarked for revision 🔄`);
      } else {
        // Mark for revision
        await ResourceProgressService.markResourceForRevision(resourceId);
        setResourceProgress(prev => ({
          ...prev,
          [resourceId]: { ...prev[resourceId], markedForRevision: true }
        }));
        
        setToastType('success');
        setShowSuccessToast(`"${resourceTitle}" marked for revision! 📝`);
      }
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowSuccessToast(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error updating resource revision status:', err);
      
      // Revert the optimistic UI update
      setResourceProgress(prev => ({
        ...prev,
        [resourceId]: { ...prev[resourceId], markedForRevision: currentRevisionStatus }
      }));
      
      const resourceTitle = Object.values(sectionResources)
        .flat()
        .find(r => r.id === resourceId)?.title || 'Resource';
      
      if (currentRevisionStatus) {
        alert(`Failed to unmark "${resourceTitle}" for revision. Please try again.`);
      } else {
        alert(`Failed to mark "${resourceTitle}" for revision. Please try again.`);
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
    } catch (err) {
      console.error('Error updating resource note:', err);
      alert('Failed to update note. Please try again.');
    }
  };

  const handleShareOnTwitter = (resourceTitle, leagueName) => {
    const message = `📚 Just completed "${resourceTitle}" in ${leagueName} on @OpenLearn_nitj! #Learning #Progress #OpenLearn`;
    SocialService.shareOnTwitter(message);
  };

  const getResourceTypeColor = (type) => {
    switch (type?.toUpperCase()) {
      case 'VIDEO':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'ARTICLE':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'EXTERNAL_LINK':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'BLOG':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
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

  const openNoteModal = (resource) => {
    setSelectedResource(resource);
    const progress = resourceProgress[resource.id];
    setNoteText(progress?.personalNote || '');
    setShowNoteModal(true);
  };

  const closeNoteModal = () => {
    setShowNoteModal(false);
    setSelectedResource(null);
    setNoteText('');
  };

  const saveNote = async () => {
    if (selectedResource) {
      await handleResourceNote(selectedResource.id, noteText);
      closeNoteModal();
    }
  };

  const openResourceWithType = (resource) => {
    window.open(resource.url, '_blank');
  };

  if (loading) {
    return <LeagueDetailSkeleton />;
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
            </button>              {/* Quick Stats - OPTIMIZATION 4: Show immediate basic stats */}
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <span>{calculateOverallProgress.total || 0} resources</span>
                <span className="text-green-600 font-medium">{calculateOverallProgress.completed || 0} completed</span>
                <span className="font-semibold text-gray-900 px-2 py-1 bg-gray-100 rounded">
                  {calculateOverallProgress.percentage || 0}% progress
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
                
                {/* Compact Progress Indicator - OPTIMIZATION 5: Optimistic progress display */}
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{calculateOverallProgress.percentage || 0}%</div>
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
                        strokeDasharray={`${(calculateOverallProgress.percentage || 0)/2}, 100`}
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
                  {calculateOverallProgress.completed || 0} of {calculateOverallProgress.total || 0} resources
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#FFDE59] to-[#FFD700] h-2 rounded-full transition-all duration-1000 ease-out progress-bar-fill"
                  style={{ width: `${calculateOverallProgress.percentage || 0}%` }}
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
                        return (
                          <div key={section.id} className="border mt-4 border-gray-100 rounded-lg">
                            {/* Compact Section Header */}
                            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-t-lg border-b border-gray-100">
                              <div className="flex items-center space-x-3">
                                <h3 className="font-medium text-gray-900">{section.name}</h3>
                              </div>
                            </div>
                            {/* OPTIMIZATION 10: Progressive loading with skeleton */}
                            {resources.length > 0 ? (
                              <div>
                                {/* Table Header */}
                                <div className="grid grid-cols-16 gap-2 px-4 py-2 bg-gray-100 border-b border-gray-200 text-xs font-medium text-gray-700 uppercase tracking-wider">
                                  <div className="col-span-1 flex justify-center">Status</div>
                                  <div className="col-span-7 text-center">Title</div>
                                  <div className="col-span-2 text-center">Resource</div>
                                  <div className="col-span-3 text-center">Note</div>
                                  <div className="col-span-2 text-center">Revision</div>
                                  <div className="col-span-1 text-center">Share</div>
                                </div>
                                
                                {/* Table Rows */}
                                <div>
                                  {resources.map((resource) => {
                                  const progress = resourceProgress[resource.id];
                                  const isCompleted = progress?.isCompleted || false;
                                  const hasNote = progress?.personalNote;
                                  const isMarkedForRevision = progress?.markedForRevision || false;

                                  return (
                                    <div 
                                      key={resource.id} 
                                      className="grid grid-cols-16 gap-2 items-center px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
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
                                            <Loader2 size={12} />
                                          ) : isCompleted ? (
                                            <Check size={12} className="completion-checkmark" />
                                          ) : null}
                                        </button>
                                      </div>

                                      {/* Title Column */}
                                      <div className="col-span-7">
                                        <span className={`text-sm ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'} truncate block`}>
                                          {resource.title}
                                        </span>
                                      </div>

                                      {/* Resource Column */}
                                      <div className="col-span-2 flex items-center justify-center space-x-2">
                                        <button onClick={() => openResourceWithType(resource)} 
                                          className={`flex items-center space-x-2 px-2 py-1 rounded-full border text-xs font-medium ${getResourceTypeColor(resource.type)}`}
                                          title={favicons[resource.id]?.domain ? `Source: ${favicons[resource.id].domain}` : `Resource type: ${getResourceTypeName(resource.type)}`}
                                        >
                                          <LocalResourceIcon resource={resource} />
                                          <span>{getResourceTypeName(resource.type)}</span>
                                        </button>
                                      </div>

                                      {/* Note Column */}
                                      <div className="col-span-3 flex justify-center">
                                        <button
                                          onClick={() => openNoteModal(resource)}
                                          className={`px-3 py-1 text-xs rounded-full flex items-center space-x-1 max-w-full transition-all duration-200 ${
                                            hasNote 
                                              ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100' 
                                              : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                                          }`}
                                          title={hasNote ? `Note: ${hasNote}` : 'Add note'}
                                        >
                                          <Edit size={12} />
                                          {hasNote ? (
                                            <span className="truncate block max-w-20 font-medium">{hasNote}</span>
                                          ) : (
                                            <span>Add Note</span>
                                          )}
                                        </button>
                                      </div>

                                      {/* Revision Column */}
                                      <div className="col-span-2 flex justify-center">
                                        <button
                                          onClick={() => handleResourceRevision(resource.id, isMarkedForRevision)}
                                          disabled={processingResources.has(resource.id)}
                                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                                            isMarkedForRevision 
                                              ? 'bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100' 
                                              : 'bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100 hover:text-orange-500'
                                          }`}
                                          title={isMarkedForRevision ? 'Unmark for revision' : 'Mark for revision'}
                                        >
                                          <Star 
                                            size={14} 
                                            className={isMarkedForRevision ? 'fill-current' : ''} 
                                          />
                                        </button>
                                      </div>

                                      {/* Share Column */}
                                      <div className="col-span-1 flex justify-center">
                                        <button
                                          onClick={() => handleShareOnTwitter(resource.title, leagueProgress.league.name)}
                                          className="text-gray-400 hover:text-black transition-colors p-2 rounded-full hover:bg-gray-100"
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
                            ) : resourcesLoading ? (
                              <SectionLoadingIndicator 
                                sectionName={section.name}
                                isLoading={true}
                                progress={sectionsLoadingProgress[section.id] || 0}
                              />
                            ) : (
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

      {/* Note Modal */}
      <NoteModal 
        showNoteModal={showNoteModal}
        selectedResource={selectedResource}
        resourceProgress={resourceProgress}
        noteText={noteText}
        setNoteText={setNoteText}
        closeNoteModal={closeNoteModal}
        saveNote={saveNote}
        openResourceWithType={openResourceWithType}
        getResourceTypeName={getResourceTypeName}
        textareaRef={textareaRef}
        favicons={favicons}
        loadingFavicons={loadingFavicons}
        setFavicons={setFavicons}
      />

      {/* Enhanced Background Progress Indicators */}
      <ProgressIndicator 
        isLoading={resourcesLoading}
        message="Loading resources..."
        position="bottom-right"
        showMessage={true}
      />
    </div>
  );
};

export default LeagueDetailPage;
