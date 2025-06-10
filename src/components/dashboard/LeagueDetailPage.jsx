import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, 
  CheckSquare, 
  Square, 
  FileText, 
  Share2, 
  ExternalLink, 
  Plus,
  BookOpen,
  Clock,
  Award,
  Edit3,
  Flag,
  Play,
  Globe,
  Bookmark
} from 'lucide-react';
import ProgressService from '../../utils/progressService';
import SocialService from '../../utils/socialService';

const LeagueDetailPage = ({ league, onBack }) => {
  const [leagueProgress, setLeagueProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState('');

  const fetchLeagueProgress = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await ProgressService.getLeagueProgress(league.id);
      setLeagueProgress(data);
    } catch (err) {
      console.error('Error fetching league progress:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [league.id]);

  useEffect(() => {
    fetchLeagueProgress();
  }, [fetchLeagueProgress]);

  const handleSectionComplete = async (sectionId, personalNote = '') => {
    try {
      await ProgressService.completeSection(sectionId, personalNote, false);
      
      // Refresh league progress
      await fetchLeagueProgress();
      
      // Find section details for sharing
      const section = findSectionById(sectionId);
      if (section) {
        // Check if this completion earned a badge
        if (leagueProgress?.badge && !leagueProgress.badge.earnedAt) {
          // Show badge earned notification
          alert(`🎉 Congratulations! You've earned the "${leagueProgress.badge.name}" badge!`);
        }
        
        // Auto-share section completion
        SocialService.shareSection(sectionId, {
          name: section.name,
          leagueName: league.name
        });
        
        // Show confirmation modal
        if (confirm('🎉 Section completed! Share your progress on social media?')) {
          // Already shared above, this is just for user confirmation
        }
      }
    } catch (err) {
      console.error('Error completing section:', err);
      alert('Failed to mark section as complete. Please try again.');
    }
  };

  const handleNoteUpdate = async (sectionId, note) => {
    try {
      await ProgressService.updateSectionProgress(sectionId, note, false);
      await fetchLeagueProgress();
      setEditingNote(null);
      setNoteText('');
    } catch (err) {
      console.error('Error updating note:', err);
      alert('Failed to update note. Please try again.');
    }
  };

  const handleShareProgress = () => {
    const shareData = {
      leagueName: league.name,
      sectionsCount: leagueProgress?.progress?.totalSections || 0,
      completedSections: leagueProgress?.progress?.completedSections || 0,
      progressPercentage: leagueProgress?.progress?.progressPercentage || 0
    };
    
    SocialService.showShareModal('league', shareData);
  };

  const findSectionById = (sectionId) => {
    if (!leagueProgress?.progress?.weeks) return null;
    
    for (const week of leagueProgress.progress.weeks) {
      const section = week.sections.find(s => s.id === sectionId);
      if (section) return section;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="animate-pulse space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <button 
            onClick={onBack}
            className="text-[#FFDE59] hover:text-[#FFD700] mb-4 flex items-center text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </button>
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">
              <ExternalLink size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading League</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchLeagueProgress}
              className="bg-[#FFDE59] text-gray-900 px-4 py-2 rounded-lg hover:bg-[#FFD700] transition-colors"
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
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <button 
            onClick={onBack}
            className="text-[#FFDE59] hover:text-[#FFD700] mb-4 flex items-center text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </button>
          <div className="text-center py-8">
            <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">League Not Found</h3>
            <p className="text-gray-600">This league may not be available or you may not be enrolled.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <button 
          onClick={onBack}
          className="text-[#FFDE59] hover:text-[#FFD700] mb-4 flex items-center text-sm font-medium"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </button>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{leagueProgress.league.name}</h1>
            <p className="text-gray-600 mb-4">{leagueProgress.league.description}</p>
            
            {/* Progress Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#FFDE59]">
                  {leagueProgress.progress.progressPercentage}%
                </div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {leagueProgress.progress.completedSections}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {leagueProgress.progress.totalSections - leagueProgress.progress.completedSections}
                </div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {leagueProgress.progress.weeks?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Weeks</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">League Progress</span>
                <span className="text-sm text-gray-600">
                  {leagueProgress.progress.completedSections} of {leagueProgress.progress.totalSections} sections
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-[#FFDE59] to-[#FFD700] h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${leagueProgress.progress.progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Badge Display */}
          {leagueProgress.badge && (
            <div className="ml-6 text-center">
              <div className="w-16 h-16 bg-[#FFDE59] rounded-full flex items-center justify-center mb-2">
                <Award className="text-gray-900" size={24} />
              </div>
              <div className="text-sm font-medium text-gray-900">{leagueProgress.badge.name}</div>
              {leagueProgress.badge.earnedAt && (
                <div className="text-xs text-green-600">Earned!</div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4 mt-4">
          <button
            onClick={handleShareProgress}
            className="flex items-center text-sm text-gray-600 hover:text-[#FFDE59] transition-colors"
          >
            <Share2 size={16} className="mr-1" />
            Share Progress
          </button>
          <span className="text-gray-300">•</span>
          <span className="text-sm text-gray-600">
            Enrolled {new Date(leagueProgress.enrollment.enrolledAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Weeks and Sections */}
      <div className="space-y-6">
        {leagueProgress.progress.weeks?.map((week) => (
          <div key={week.id} className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{week.name}</h2>
                  <p className="text-gray-600 text-sm">
                    {week.sections.filter(s => s.progress?.isCompleted).length} of {week.sections.length} sections completed
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#FFDE59]">
                    {Math.round((week.sections.filter(s => s.progress?.isCompleted).length / week.sections.length) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Week Progress</div>
                </div>
              </div>

              {/* Week Progress Bar */}
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#FFDE59] h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(week.sections.filter(s => s.progress?.isCompleted).length / week.sections.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-4">
                {week.sections.map((section) => (
                  <div 
                    key={section.id} 
                    className={`border rounded-lg p-4 ${
                      section.progress?.isCompleted 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 hover:border-[#FFDE59]'
                    } transition-colors`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <button
                            onClick={() => {
                              if (!section.progress?.isCompleted) {
                                handleSectionComplete(section.id, section.progress?.personalNote || '');
                              }
                            }}
                            disabled={section.progress?.isCompleted}
                            className={`mr-3 ${
                              section.progress?.isCompleted 
                                ? 'text-green-600' 
                                : 'text-gray-400 hover:text-[#FFDE59]'
                            } transition-colors`}
                          >
                            {section.progress?.isCompleted ? (
                              <CheckSquare size={20} />
                            ) : (
                              <Square size={20} />
                            )}
                          </button>
                          <h3 className={`font-medium ${
                            section.progress?.isCompleted ? 'text-green-900' : 'text-gray-900'
                          }`}>
                            {section.name}
                          </h3>
                          {section.progress?.isCompleted && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Completed
                            </span>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3">
                          {section.resourceCount} {section.resourceCount === 1 ? 'resource' : 'resources'}
                        </div>

                        {/* Personal Note */}
                        <div className="mb-3">
                          {editingNote === section.id ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Add your personal note..."
                                className="flex-1 text-sm border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#FFDE59] focus:border-transparent"
                                autoFocus
                              />
                              <button
                                onClick={() => handleNoteUpdate(section.id, noteText)}
                                className="bg-[#FFDE59] text-gray-900 px-3 py-2 rounded text-sm hover:bg-[#FFD700] transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingNote(null);
                                  setNoteText('');
                                }}
                                className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <FileText size={14} className="text-gray-400" />
                              {section.progress?.personalNote ? (
                                <span className="text-sm text-gray-700 italic">
                                  "{section.progress.personalNote}"
                                </span>
                              ) : (
                                <span className="text-sm text-gray-500">No notes yet</span>
                              )}
                              <button
                                onClick={() => {
                                  setEditingNote(section.id);
                                  setNoteText(section.progress?.personalNote || '');
                                }}
                                className="text-gray-400 hover:text-[#FFDE59] transition-colors"
                              >
                                <Edit3 size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Section Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        {section.progress?.markedForRevision && (
                          <Flag size={16} className="text-orange-500" title="Marked for revision" />
                        )}
                        
                        {!section.progress?.isCompleted && (
                          <button
                            onClick={() => handleSectionComplete(section.id, section.progress?.personalNote || '')}
                            className="bg-[#FFDE59] text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#FFD700] transition-colors"
                          >
                            Mark Complete
                          </button>
                        )}
                        
                        {section.progress?.isCompleted && (
                          <button
                            onClick={() => {
                              SocialService.shareSection(section.id, {
                                name: section.name,
                                leagueName: leagueProgress.league.name
                              });
                            }}
                            className="text-gray-500 hover:text-[#FFDE59] transition-colors"
                            title="Share completion"
                          >
                            <Share2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No weeks message */}
      {(!leagueProgress.progress.weeks || leagueProgress.progress.weeks.length === 0) && (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Available</h3>
          <p className="text-gray-600">This league doesn't have any weeks or sections yet.</p>
        </div>
      )}
    </div>
  );
};

export default LeagueDetailPage;
