import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  RotateCcw,
  ExternalLink,
  Edit3,
  Save,
  X,
  Timer
} from 'lucide-react';
import ResourceProgressService from '../../utils/resourceProgressService';

/**
 * ResourceCard Component
 * Comprehensive resource interaction with progress tracking, notes, and time tracking
 */
const ResourceCard = ({ resource, onProgressUpdate, showTimeTracking = true }) => {
  const [progress, setProgress] = useState(resource.progress || null);
  const [isLoading, setIsLoading] = useState(false);
  const [note, setNote] = useState(progress?.personalNote || '');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [timeTracker, setTimeTracker] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showNoteSection, setShowNoteSection] = useState(false);
  const [error, setError] = useState(null);
  
  const timerRef = useRef(null);
  const noteTextareaRef = useRef(null);

  // Initialize elapsed time on mount if tracking is active
  useEffect(() => {
    const existingElapsed = ResourceProgressService.getElapsedTime(resource.id);
    if (existingElapsed !== null) {
      setElapsedTime(existingElapsed);
      startTimer();
    }
  }, [resource.id]);

  // Start the visual timer
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      const elapsed = ResourceProgressService.getElapsedTime(resource.id);
      if (elapsed !== null) {
        setElapsedTime(elapsed);
      } else {
        clearInterval(timerRef.current);
        setElapsedTime(0);
      }
    }, 1000);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Focus note textarea when editing starts
  useEffect(() => {
    if (isEditingNote && noteTextareaRef.current) {
      noteTextareaRef.current.focus();
    }
  }, [isEditingNote]);

  const handleError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const handleSuccess = (message) => {
    // You can implement a toast notification here
    console.log('Success:', message);
  };

  // Open resource and start time tracking
  const handleResourceOpen = () => {
    // Start time tracking
    const tracker = ResourceProgressService.startTimeTracking(resource.id);
    setTimeTracker(tracker);
    startTimer();
    
    // Open resource in new tab
    window.open(resource.url, '_blank', 'noopener,noreferrer');
  };

  // Mark resource as completed
  const markCompleted = async () => {
    if (progress?.isCompleted) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Stop time tracking and get elapsed time
      const timeSpent = timeTracker ? timeTracker.stop() : ResourceProgressService.stopTimeTracking(resource.id);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      const result = await ResourceProgressService.markResourceCompleted(
        resource.id, 
        timeSpent > 0 ? timeSpent : null,
        note.trim() || null
      );
      
      setProgress(result);
      setTimeTracker(null);
      setElapsedTime(0);
      
      // Save to local storage for offline access
      ResourceProgressService.saveProgressToLocalStorage(resource.id, result);
      
      handleSuccess('Resource marked as completed!');
      
      if (onProgressUpdate) {
        onProgressUpdate(resource.id, result);
      }
    } catch (error) {
      handleError('Failed to mark resource as completed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark resource for revision
  const markForRevision = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await ResourceProgressService.markResourceForRevision(
        resource.id,
        note.trim() || null
      );
      
      setProgress(result);
      
      // Save to local storage
      ResourceProgressService.saveProgressToLocalStorage(resource.id, result);
      
      handleSuccess('Resource marked for revision!');
      
      if (onProgressUpdate) {
        onProgressUpdate(resource.id, result);
      }
    } catch (error) {
      handleError('Failed to mark resource for revision: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Update note
  const updateNote = async () => {
    const validation = ResourceProgressService.validatePersonalNote(note);
    if (!validation.isValid) {
      handleError(validation.error);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await ResourceProgressService.updateResourceNote(resource.id, note.trim());
      
      setProgress(result);
      setIsEditingNote(false);
      
      // Save to local storage
      ResourceProgressService.saveProgressToLocalStorage(resource.id, result);
      
      handleSuccess('Note updated successfully!');
      
      if (onProgressUpdate) {
        onProgressUpdate(resource.id, result);
      }
    } catch (error) {
      handleError('Failed to update note: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset progress
  const resetProgress = async () => {
    if (!window.confirm('Are you sure you want to reset progress for this resource?')) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Stop time tracking
      ResourceProgressService.stopTimeTracking(resource.id);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      const result = await ResourceProgressService.resetResourceProgress(resource.id);
      
      setProgress(result);
      setTimeTracker(null);
      setElapsedTime(0);
      
      // Update local storage
      ResourceProgressService.saveProgressToLocalStorage(resource.id, result);
      
      handleSuccess('Resource progress reset successfully!');
      
      if (onProgressUpdate) {
        onProgressUpdate(resource.id, result);
      }
    } catch (error) {
      handleError('Failed to reset progress: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelNoteEdit = () => {
    setNote(progress?.personalNote || '');
    setIsEditingNote(false);
  };

  const statusInfo = ResourceProgressService.getProgressStatusInfo(progress);
  const typeIcon = ResourceProgressService.getResourceTypeIcon(resource.type);
  const formattedTime = ResourceProgressService.formatTimeSpent(progress?.timeSpent || 0);
  const currentElapsedFormatted = ResourceProgressService.formatTimeSpent(elapsedTime);

  return (
    <div className={`resource-card bg-white rounded-lg border-2 transition-all duration-300 hover:shadow-lg ${
      progress?.isCompleted ? 'border-green-200 bg-green-50' : 
      progress?.markedForRevision ? 'border-orange-200 bg-orange-50' : 
      'border-gray-200 hover:border-blue-200'
    }`}>
      
      {/* Resource Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">{typeIcon}</span>
              <h3 className="font-semibold text-gray-900 flex-1">{resource.title}</h3>
              <div className={`px-2 py-1 text-xs rounded-full font-medium ${
                statusInfo.color === 'green' ? 'bg-green-100 text-green-800' :
                statusInfo.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                statusInfo.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {statusInfo.icon} {statusInfo.label}
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                {resource.type}
              </span>
              {progress?.timeSpent > 0 && (
                <span className="flex items-center">
                  <Clock size={12} className="mr-1" />
                  {formattedTime}
                </span>
              )}
              {showTimeTracking && elapsedTime > 0 && (
                <span className="flex items-center text-blue-600">
                  <Timer size={12} className="mr-1" />
                  {currentElapsedFormatted} (current)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Resource Actions */}
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <button 
            onClick={handleResourceOpen}
            className="btn-primary flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isLoading}
          >
            <ExternalLink size={16} className="mr-2" />
            Open Resource
          </button>
          
          <button 
            onClick={markCompleted}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              progress?.isCompleted 
                ? 'bg-green-100 text-green-800 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
            disabled={progress?.isCompleted || isLoading}
          >
            <CheckCircle size={16} className="mr-2" />
            {progress?.isCompleted ? 'Completed' : 'Mark Complete'}
          </button>
          
          <button 
            onClick={markForRevision}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              progress?.markedForRevision 
                ? 'bg-orange-100 text-orange-800' 
                : 'bg-orange-600 text-white hover:bg-orange-700'
            }`}
            disabled={isLoading}
          >
            <AlertTriangle size={16} className="mr-2" />
            {progress?.markedForRevision ? 'Marked for Revision' : 'Mark for Revision'}
          </button>

          {progress && (
            <button 
              onClick={resetProgress}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              disabled={isLoading}
            >
              <RotateCcw size={16} className="mr-2" />
              Reset
            </button>
          )}
        </div>

        {/* Personal Note Section */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FileText size={16} className="mr-1" />
              Personal Note
            </label>
            <button
              onClick={() => setShowNoteSection(!showNoteSection)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {showNoteSection ? 'Hide' : 'Show'}
            </button>
          </div>

          {showNoteSection && (
            <div className="space-y-3">
              {isEditingNote ? (
                <div className="space-y-2">
                  <textarea
                    ref={noteTextareaRef}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add your thoughts, questions, or notes about this resource..."
                    maxLength={1000}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {note.length}/1000 characters
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={updateNote}
                        disabled={isLoading}
                        className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        <Save size={14} className="mr-1" />
                        Save
                      </button>
                      <button
                        onClick={cancelNoteEdit}
                        className="flex items-center px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 transition-colors"
                      >
                        <X size={14} className="mr-1" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {progress?.personalNote ? (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">
                        {progress.personalNote}
                      </p>
                      <button
                        onClick={() => setIsEditingNote(true)}
                        className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-700"
                      >
                        <Edit3 size={14} className="mr-1" />
                        Edit note
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditingNote(true)}
                      className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit3 size={16} className="inline mr-2" />
                      Add a personal note...
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Progress Timestamps */}
        {progress && (progress.completedAt || progress.updatedAt) && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
              {progress.completedAt && (
                <span>
                  Completed: {new Date(progress.completedAt).toLocaleDateString()}
                </span>
              )}
              {progress.updatedAt && (
                <span>
                  Last updated: {new Date(progress.updatedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default ResourceCard;
