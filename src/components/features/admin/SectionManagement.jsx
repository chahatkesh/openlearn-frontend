import React, { useState, useEffect } from 'react';

const SectionManagement = ({
  sections,
  weeks,
  leagues,
  onCreateSection,
  onUpdateSection,
  onDeleteSection,
  selectedLeagueId,
  selectedWeekId,
  onSelectLeague,
  onSelectWeek,
  user,
  loading
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [expandedModules, setExpandedModules] = useState(new Set());
  const [sectionForm, setSectionForm] = useState({
    name: '',
    order: '',
    weekId: ''
  });

  // Check if user is Grand Pathfinder (has access to all data)
  const isGrandPathfinder = user?.role === 'GRAND_PATHFINDER';

  // If weeks change while the form is open
  useEffect(() => {
    if (weeks.length > 0) {
      const weekId = selectedWeekId || weeks[0].id;
      setSectionForm(prev => ({
        ...prev,
        weekId
      }));
    }
  }, [weeks, selectedWeekId]);

  useEffect(() => {
    // When switching weeks, update the form's weekId
    if (selectedWeekId) {
      setSectionForm(prev => ({
        ...prev,
        weekId: selectedWeekId
      }));
    }
  }, [selectedWeekId]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSectionForm({
      ...sectionForm,
      [name]: name === 'order' ? parseInt(value, 10) || '' : value
    });
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    onCreateSection(sectionForm);
    resetForm();
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onUpdateSection(editingSection.id, sectionForm);
    resetForm();
  };

  const resetForm = () => {
    setSectionForm({
      name: '',
      order: '',
      weekId: selectedWeekId || (weeks.length > 0 ? weeks[0].id : '')
    });
    setShowCreateForm(false);
    setEditingSection(null);
  };

  const startEdit = (section) => {
    setSectionForm({
      name: section.name,
      order: section.order,
      weekId: section.weekId
    });
    setEditingSection(section);
    setShowCreateForm(false);
  };

  const startCreate = (weekId = null) => {
    // If weekId is provided, create topic for that specific module
    const targetWeekId = weekId || selectedWeekId || (weeks.length > 0 ? weeks[0].id : '');
    
    // Find the highest order in the target week's sections and add 1
    const currentWeekSections = sections.filter(section => section.weekId === targetWeekId);
    const nextOrder = currentWeekSections.length > 0 
      ? Math.max(...currentWeekSections.map(section => section.order)) + 1 
      : 1;
    
    setSectionForm({
      name: '',
      order: nextOrder,
      weekId: targetWeekId
    });
    setEditingSection(null);
    setShowCreateForm(true);
  };

  const toggleModule = (weekId) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(weekId)) {
      newExpanded.delete(weekId);
    } else {
      newExpanded.add(weekId);
    }
    setExpandedModules(newExpanded);
  };

  // Filter sections by selected league and week if applicable (skip for Grand Pathfinder)
  const filteredSections = sections.filter(section => {
    if (!isGrandPathfinder && selectedLeagueId && section.week?.leagueId !== selectedLeagueId) return false;
    if (selectedWeekId && section.weekId !== selectedWeekId) return false;
    return true;
  });

  // Sort sections by order
  const sortedSections = [...filteredSections].sort((a, b) => a.order - b.order);

  // Group sections by module
  const sectionsByWeek = sortedSections.reduce((acc, section) => {
    const weekId = section.weekId;
    if (!acc[weekId]) {
      const week = weeks.find(w => w.id === weekId);
      acc[weekId] = {
        week: week || { id: weekId, name: 'Unknown Module', leagueId: null },
        sections: []
      };
    }
    acc[weekId].sections.push(section);
    return acc;
  }, {});

  // Sort sections within each week by order
  Object.values(sectionsByWeek).forEach(weekGroup => {
    weekGroup.sections.sort((a, b) => a.order - b.order);
  });

  // Get filtered weeks for dropdowns
  const getFilteredWeeks = () => {
    if (!isGrandPathfinder && selectedLeagueId) {
      return weeks.filter(week => week.leagueId === selectedLeagueId);
    }
    return weeks;
  };

  // Auto-expand modules based on filters
  useEffect(() => {
    if (selectedWeekId) {
      // Only expand the specifically selected module
      setExpandedModules(new Set([selectedWeekId]));
    } else {
      // Keep all modules collapsed by default
      setExpandedModules(new Set());
    }
  }, [selectedWeekId]);
  
  if (weeks.length === 0 && !loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        No modules found. Please create a module first before adding topics.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200/50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 tracking-tight">
                  Topic Management
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
                  Organize and manage your learning topics within modules
                </p>
              </div>
              
              {/* Filters Row */}
              <div className="flex flex-col sm:flex-row gap-4 lg:items-end">
                {/* League Filter - Hide for Grand Pathfinder */}
                {!isGrandPathfinder && (
                  <div className="flex-shrink-0 w-full sm:w-auto">
                    <label htmlFor="leagueFilter" className="block text-xs font-medium text-gray-700 mb-2">
                      Filter by League
                    </label>
                    <select
                      id="leagueFilter"
                      value={selectedLeagueId || ''}
                      onChange={(e) => onSelectLeague(e.target.value)}
                      className="w-full sm:w-64 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-all duration-200"
                    >
                      <option value="">All Leagues</option>
                      {leagues.map(league => (
                        <option key={league.id} value={league.id}>
                          {league.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                {/* Week Filter */}
                <div className="flex-shrink-0 w-full sm:w-auto">
                  <label htmlFor="weekFilter" className="block text-xs font-medium text-gray-700 mb-2">
                    Filter by Module
                  </label>
                  <select
                    id="weekFilter"
                    value={selectedWeekId || ''}
                    onChange={(e) => onSelectWeek(e.target.value)}
                    className="w-full sm:w-64 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-all duration-200"
                  >
                    <option value="">All Modules</option>
                    {getFilteredWeeks().map(week => (
                      <option key={week.id} value={week.id}>
                        {week.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form for creating or editing topics */}
        {(showCreateForm || editingSection) && (
          <div className="mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight">
                  {editingSection ? 'Edit Topic' : 'Create New Topic'}
                </h3>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={editingSection ? handleEditSubmit : handleCreateSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Topic Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={sectionForm.name}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-all duration-200"
                    required
                    placeholder="e.g. Introduction to Neural Networks"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                      Order
                    </label>
                    <input
                      type="number"
                      id="order"
                      name="order"
                      value={sectionForm.order}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-all duration-200"
                      min="1"
                      step="1"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      Position within the module (must be unique)
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="weekId" className="block text-sm font-medium text-gray-700 mb-2">
                      Module
                    </label>
                    <select
                      id="weekId"
                      name="weekId"
                      value={sectionForm.weekId}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-all duration-200"
                      required
                    >
                      <option value="" disabled>Select a module</option>
                      {getFilteredWeeks().map(week => (
                        <option key={week.id} value={week.id}>
                          {week.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-sm font-medium bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200"
                  >
                    {editingSection ? 'Save Changes' : 'Create Topic'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Module-wise Topics Organization */}
        {Object.keys(sectionsByWeek).length > 0 && !editingSection && !showCreateForm ? (
          <div className="space-y-6">
            {getFilteredWeeks().map((week) => {
              const weekSections = sectionsByWeek[week.id];
              const league = leagues.find(l => l.id === week.leagueId) || { name: 'Unknown League' };
              const isExpanded = expandedModules.has(week.id);
              const topicsCount = weekSections?.sections?.length || 0;

              return (
                <div key={week.id} className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden">
                  {/* Module Header */}
                  <div className="bg-gradient-to-r from-gray-50/80 to-white p-6 border-b border-gray-100/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleModule(week.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        >
                          <svg 
                            className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        <div className="flex items-center gap-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{week.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                {league.name}
                              </span>
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {topicsCount} topic{topicsCount !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Add Topic Button for this Module */}
                      <button
                        onClick={() => startCreate(week.id)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Topic
                      </button>
                    </div>
                  </div>

                  {/* Topics List - Collapsible */}
                  {isExpanded && (
                    <div className="p-6">
                      {weekSections && weekSections.sections.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {weekSections.sections.map((section) => (
                            <div key={section.id} className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                      #{section.order}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {section._count?.resources || 0} resource{section._count?.resources !== 1 ? 's' : ''}
                                    </span>
                                  </div>
                                  <h4 className="text-sm font-semibold text-gray-900 leading-tight mb-1 line-clamp-2">
                                    {section.name}
                                  </h4>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => startEdit(section)}
                                  className="flex-1 inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all duration-200"
                                >
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit
                                </button>
                                <button
                                  onClick={() => onDeleteSection(section.id)}
                                  className="px-2 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all duration-200"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-500 mb-3">No topics in this module yet</p>
                          <button
                            onClick={() => startCreate(week.id)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all duration-200"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add First Topic
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          !showCreateForm && !editingSection && !loading && (
            <div className="text-center py-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-gray-200/50 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No modules found
                </h3>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  {selectedLeagueId
                    ? 'No modules found for this league. Create modules first to organize topics.'
                    : 'No modules found. Create modules first to organize your topics.'
                  }
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SectionManagement;
