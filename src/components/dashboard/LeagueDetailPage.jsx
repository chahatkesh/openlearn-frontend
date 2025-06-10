import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckSquare, Square, FileText, Share2, ExternalLink, Plus } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LeagueDetailPage = ({ league, onBack }) => {
  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [resources, setResources] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeeks();
  }, [league.id]);

  useEffect(() => {
    if (selectedWeek) {
      fetchSections(selectedWeek.id);
    }
  }, [selectedWeek]);

  useEffect(() => {
    if (selectedSection) {
      fetchResources(selectedSection.id);
    }
  }, [selectedSection]);

  const fetchWeeks = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/api/weeks/league/${league.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setWeeks(result.data.weeks || []);
        if (result.data.weeks?.[0]) {
          setSelectedWeek(result.data.weeks[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching weeks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async (weekId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/api/weeks/${weekId}/sections`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setSections(result.data.sections || []);
        if (result.data.sections?.[0]) {
          setSelectedSection(result.data.sections[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching sections:', err);
    }
  };

  const fetchResources = async (sectionId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/api/sections/${sectionId}/resources`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setResources(result.data.resources || []);
      }
    } catch (err) {
      console.error('Error fetching resources:', err);
    }
  };

  const markSectionComplete = async (sectionId, personalNote = '') => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/api/progress/sections/${sectionId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ personalNote, markedForRevision: false })
      });
      const result = await response.json();
      if (result.success) {
        setUserProgress(prev => ({
          ...prev,
          [sectionId]: { ...prev[sectionId], isCompleted: true, personalNote }
        }));
      }
    } catch (err) {
      console.error('Error marking section complete:', err);
    }
  };

  const generateShareLink = async (sectionId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/api/social/twitter/section/${sectionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        window.open(result.data.shareUrl, '_blank');
      }
    } catch (err) {
      console.error('Error generating share link:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFDE59]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <button 
          onClick={onBack}
          className="text-[#FFDE59] hover:text-[#FFD700] mb-4 flex items-center text-sm font-medium"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{league.name}</h1>
        <p className="text-gray-600">{league.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Week Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Weeks</h3>
            <div className="space-y-2">
              {weeks.map((week) => (
                <button
                  key={week.id}
                  onClick={() => setSelectedWeek(week)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedWeek?.id === week.id
                      ? 'bg-[#FFDE59] text-gray-900'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="font-medium text-sm">{week.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{week.sectionsCount || 0} sections</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {selectedWeek && (
            <div className="space-y-6">
              {/* Week Header */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedWeek.name}</h2>
                <p className="text-gray-600">{selectedWeek.description}</p>
              </div>

              {/* Sections */}
              {sections.map((section) => (
                <div key={section.id} className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{section.name}</h3>
                      <button
                        onClick={() => setSelectedSection(section)}
                        className="text-[#FFDE59] hover:text-[#FFD700] text-sm font-medium"
                      >
                        {selectedSection?.id === section.id ? 'Hide Resources' : 'Show Resources'}
                      </button>
                    </div>
                    <p className="text-gray-600 mb-4">{section.description}</p>

                    {/* Resources Table */}
                    {selectedSection?.id === section.id && (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 font-medium text-gray-900">Complete</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-900">Topic</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-900">Resource</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-900">Notes</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {resources.map((resource) => (
                              <tr key={resource.id} className="border-b border-gray-100">
                                <td className="py-3 px-4">
                                  <button
                                    onClick={() => {
                                      if (!userProgress[section.id]?.isCompleted) {
                                        markSectionComplete(section.id);
                                      }
                                    }}
                                    className="text-[#FFDE59] hover:text-[#FFD700]"
                                  >
                                    {userProgress[section.id]?.isCompleted ? (
                                      <CheckSquare size={20} />
                                    ) : (
                                      <Square size={20} />
                                    )}
                                  </button>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="font-medium text-gray-900">{resource.title}</div>
                                  <div className="text-sm text-gray-500">{resource.type}</div>
                                </td>
                                <td className="py-3 px-4">
                                  <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 flex items-center"
                                  >
                                    <ExternalLink size={16} className="mr-1" />
                                    Open Resource
                                  </a>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center space-x-2">
                                    <FileText size={16} className="text-gray-400" />
                                    <input
                                      type="text"
                                      placeholder="Add your notes..."
                                      className="text-sm border-none focus:ring-0 p-1 rounded"
                                      value={userProgress[section.id]?.personalNote || ''}
                                      onChange={(e) => {
                                        setUserProgress(prev => ({
                                          ...prev,
                                          [section.id]: { 
                                            ...prev[section.id], 
                                            personalNote: e.target.value 
                                          }
                                        }));
                                      }}
                                    />
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <button
                                    onClick={() => generateShareLink(section.id)}
                                    className="text-gray-400 hover:text-[#FFDE59]"
                                    title="Share on Twitter"
                                  >
                                    <Share2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {resources.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <FileText size={32} className="mx-auto mb-2 text-gray-300" />
                            <p>No resources available for this section</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Section Progress */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {userProgress[section.id]?.isCompleted && (
                          <span className="text-green-600 text-sm font-medium flex items-center">
                            <CheckSquare size={16} className="mr-1" />
                            Completed
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => markSectionComplete(section.id, userProgress[section.id]?.personalNote)}
                        disabled={userProgress[section.id]?.isCompleted}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          userProgress[section.id]?.isCompleted
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-[#FFDE59] text-gray-900 hover:bg-[#FFD700]'
                        }`}
                      >
                        {userProgress[section.id]?.isCompleted ? 'Completed' : 'Mark Complete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {sections.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                  <FileText size={32} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-gray-500">No sections available for this week</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeagueDetailPage;
