import React, { useState, useEffect } from 'react';

const WeekManagement = ({
  weeks,
  leagues,
  onCreateWeek,
  onUpdateWeek,
  onDeleteWeek,
  selectedLeagueId,
  onSelectLeague,
  user, // Add user prop for role checking
  loading
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingWeek, setEditingWeek] = useState(null);
  const [weekForm, setWeekForm] = useState({
    name: '',
    order: '',
    leagueId: ''
  });

  // Check if user is Grand Pathfinder (has access to all data)
  const isGrandPathfinder = user?.role === 'GRAND_PATHFINDER';

  // If leagues change while the form is open
  useEffect(() => {
    if (leagues.length > 0) {
      const leagueId = selectedLeagueId || leagues[0].id;
      setWeekForm(prev => ({
        ...prev,
        leagueId
      }));
    }
  }, [leagues, selectedLeagueId]);

  useEffect(() => {
    // When switching leagues, update the form's leagueId
    if (selectedLeagueId) {
      setWeekForm(prev => ({
        ...prev,
        leagueId: selectedLeagueId
      }));
    }
  }, [selectedLeagueId]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setWeekForm({
      ...weekForm,
      [name]: name === 'order' ? parseInt(value, 10) || '' : value
    });
  };

  const handleLeagueChange = (e) => {
    const leagueId = e.target.value;
    setWeekForm({
      ...weekForm,
      leagueId
    });
    if (onSelectLeague) {
      onSelectLeague(leagueId);
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    onCreateWeek(weekForm);
    resetForm();
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onUpdateWeek(editingWeek.id, weekForm);
    resetForm();
  };

  const resetForm = () => {
    setWeekForm({
      name: '',
      order: '',
      leagueId: selectedLeagueId || (leagues.length > 0 ? leagues[0].id : '')
    });
    setShowCreateForm(false);
    setEditingWeek(null);
  };

  const startEdit = (week) => {
    setWeekForm({
      name: week.name,
      order: week.order,
      leagueId: week.leagueId
    });
    setEditingWeek(week);
    setShowCreateForm(false);
  };

  const startCreate = () => {
    // Find the highest order in the current weeks and add 1
    const nextOrder = weeks.length > 0 
      ? Math.max(...weeks.map(week => week.order)) + 1 
      : 1;
    
    setWeekForm({
      name: '',
      order: nextOrder,
      leagueId: selectedLeagueId || (leagues.length > 0 ? leagues[0].id : '')
    });
    setEditingWeek(null);
    setShowCreateForm(true);
  };

  // Filter weeks by selected league if applicable (skip for Grand Pathfinder)
  const filteredWeeks = (!isGrandPathfinder && selectedLeagueId) 
    ? weeks.filter(week => week.leagueId === selectedLeagueId)
    : weeks;

  // Sort weeks by order
  const sortedWeeks = [...filteredWeeks].sort((a, b) => a.order - b.order);
  
  if (leagues.length === 0 && !loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        No leagues found. Please create a league first before adding modules.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 tracking-tight">
                  Module Management
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
                  Organize and manage your learning modules across different leagues
                </p>
              </div>
              
              {/* League Filter - Hide for Grand Pathfinder */}
              {!isGrandPathfinder && (
                <div className="flex-shrink-0 w-full sm:w-auto">
                  <label htmlFor="leagueFilter" className="block text-xs font-medium text-gray-700 mb-2">
                    Filter by League
                  </label>
                  <select
                    id="leagueFilter"
                    value={selectedLeagueId || ''}
                    onChange={handleLeagueChange}
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
            </div>
          </div>
        </div>

        {/* Form for creating or editing modules */}
        {(showCreateForm || editingWeek) && (
          <div className="mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight">
                  {editingWeek ? 'Edit Module' : 'Create New Module'}
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
              
              <form onSubmit={editingWeek ? handleEditSubmit : handleCreateSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Module Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={weekForm.name}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-all duration-200"
                    required
                    placeholder="e.g. Module 1: Introduction to Machine Learning"
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
                      value={weekForm.order}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-all duration-200"
                      min="1"
                      step="1"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      Position within the league (must be unique)
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="leagueId" className="block text-sm font-medium text-gray-700 mb-2">
                      League
                    </label>
                    <select
                      id="leagueId"
                      name="leagueId"
                      value={weekForm.leagueId}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-all duration-200"
                      required
                    >
                      <option value="" disabled>Select a league</option>
                      {leagues.map(league => (
                        <option key={league.id} value={league.id}>
                          {league.name}
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
                    {editingWeek ? 'Save Changes' : 'Create Module'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Button */}
        {!showCreateForm && !editingWeek && (
          <div className="mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight">
                    Your Modules
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {sortedWeeks.length} module{sortedWeeks.length !== 1 ? 's' : ''} configured
                  </p>
                </div>
                <button 
                  onClick={startCreate}
                  className="inline-flex items-center px-6 py-2.5 text-sm font-medium bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Module
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modules Grid/List */}
        {sortedWeeks.length > 0 && !editingWeek && !showCreateForm ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedWeeks.map((week) => {
              const league = leagues.find(l => l.id === week.leagueId) || { name: 'Unknown League' };
              return (
                <div key={week.id} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:border-gray-300/50 transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-800">
                          #{week.order}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700">
                          {league.name}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 leading-tight mb-2 line-clamp-2">
                        {week.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {week._count?.sections || 0} topic{week._count?.sections !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => startEdit(week)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteWeek(week.id)}
                      className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          !showCreateForm && !editingWeek && !loading && (
            <div className="text-center py-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-gray-200/50 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No modules found
                </h3>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  {selectedLeagueId 
                    ? 'No modules found for this league. Create your first module to get started.' 
                    : 'No modules found for any league. Create your first module to get started.'
                  }
                </p>
                <button 
                  onClick={startCreate}
                  className="inline-flex items-center px-6 py-2.5 text-sm font-medium bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create First Module
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default WeekManagement;
