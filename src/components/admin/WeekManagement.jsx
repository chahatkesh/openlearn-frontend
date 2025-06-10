import React, { useState, useEffect } from 'react';

const WeekManagement = ({
  weeks,
  leagues,
  onCreateWeek,
  onUpdateWeek,
  onDeleteWeek,
  selectedLeagueId,
  onSelectLeague,
  loading
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingWeek, setEditingWeek] = useState(null);
  const [weekForm, setWeekForm] = useState({
    name: '',
    description: '',
    order: '',
    leagueId: ''
  });

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
      description: '',
      order: '',
      leagueId: selectedLeagueId || (leagues.length > 0 ? leagues[0].id : '')
    });
    setShowCreateForm(false);
    setEditingWeek(null);
  };

  const startEdit = (week) => {
    setWeekForm({
      name: week.name,
      description: week.description || '',
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
      description: '',
      order: nextOrder,
      leagueId: selectedLeagueId || (leagues.length > 0 ? leagues[0].id : '')
    });
    setEditingWeek(null);
    setShowCreateForm(true);
  };

  // Filter weeks by selected league if applicable
  const filteredWeeks = selectedLeagueId 
    ? weeks.filter(week => week.leagueId === selectedLeagueId)
    : weeks;

  // Sort weeks by order
  const sortedWeeks = [...filteredWeeks].sort((a, b) => a.order - b.order);
  
  if (leagues.length === 0 && !loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        No leagues found. Please create a league first before adding weeks.
      </div>
    );
  }

  return (
    <div>
      {/* League filter */}
      <div className="mb-6">
        <label htmlFor="leagueFilter" className="block text-sm font-medium text-gray-700 mb-1">
          Filter by League
        </label>
        <select
          id="leagueFilter"
          value={selectedLeagueId || ''}
          onChange={handleLeagueChange}
          className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
        >
          <option value="">All Leagues</option>
          {leagues.map(league => (
            <option key={league.id} value={league.id}>
              {league.name}
            </option>
          ))}
        </select>
      </div>

      {/* Form for creating or editing weeks */}
      {(showCreateForm || editingWeek) && (
        <div className="bg-gray-50 p-6 mb-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingWeek ? 'Edit Week' : 'Create New Week'}
          </h3>
          <form onSubmit={editingWeek ? handleEditSubmit : handleCreateSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Week Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={weekForm.name}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                required
                placeholder="e.g. Week 1: Introduction to Machine Learning"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={weekForm.description}
                onChange={handleFormChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="Describe the content and objectives of this week"
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
                  Order
                </label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={weekForm.order}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  min="1"
                  step="1"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Position of this week within the league (must be unique)
                </p>
              </div>
              <div className="mb-4">
                <label htmlFor="leagueId" className="block text-sm font-medium text-gray-700 mb-1">
                  League
                </label>
                <select
                  id="leagueId"
                  name="leagueId"
                  value={weekForm.leagueId}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
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
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                {editingWeek ? 'Save Changes' : 'Create Week'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Button to show create form */}
      {!showCreateForm && !editingWeek && (
        <div className="mb-6 flex justify-end">
          <button 
            onClick={startCreate}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Create New Week
          </button>
        </div>
      )}

      {/* Weeks table */}
      {sortedWeeks.length > 0 && !editingWeek && !showCreateForm ? (
        <div className="bg-white shadow overflow-hidden rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  League
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sections
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedWeeks.map((week) => {
                const league = leagues.find(l => l.id === week.leagueId) || { name: 'Unknown League' };
                return (
                  <tr key={week.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {week.order}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium">{week.name}</div>
                      {week.description && (
                        <div className="text-gray-500 text-xs mt-1 max-w-md truncate">{week.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {league.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {week._count?.sections || 0} sections
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => startEdit(week)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteWeek(week.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        !showCreateForm && !editingWeek && !loading && (
          <div className="text-center py-8 text-gray-500 bg-white shadow rounded-md">
            No weeks found for {selectedLeagueId ? 'this league' : 'any league'}
            <div className="mt-4">
              <button 
                onClick={startCreate}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                Create First Week
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default WeekManagement;
