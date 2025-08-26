import React, { useState, useEffect } from 'react';

const LeagueManagement = ({
  leagues,
  cohorts,
  onCreateLeague,
  onUpdateLeague,
  onDeleteLeague,
  loading
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingLeague, setEditingLeague] = useState(null);
  const [leagueForm, setLeagueForm] = useState({
    name: '',
    description: '',
    cohortId: ''
  });

  // If cohorts change while the form is open
  useEffect(() => {
    if (cohorts && cohorts.length > 0 && !leagueForm.cohortId) {
      setLeagueForm(prev => ({
        ...prev,
        cohortId: cohorts[0].id
      }));
    }
  }, [cohorts, leagueForm.cohortId]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setLeagueForm({
      ...leagueForm,
      [name]: value
    });
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    onCreateLeague(leagueForm);
    setLeagueForm({ name: '', description: '', cohortId: cohorts[0]?.id || '' });
    setShowCreateForm(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onUpdateLeague(editingLeague.id, leagueForm);
    setLeagueForm({ name: '', description: '', cohortId: cohorts[0]?.id || '' });
    setEditingLeague(null);
  };

  const startEdit = (league) => {
    setLeagueForm({
      name: league.name,
      description: league.description,
      cohortId: league.cohortId || ''
    });
    setEditingLeague(league);
    setShowCreateForm(false);
  };

  const cancelEdit = () => {
    setEditingLeague(null);
    setLeagueForm({ name: '', description: '', cohortId: cohorts[0]?.id || '' });
  };

  const startCreate = () => {
    setEditingLeague(null);
    setLeagueForm({ name: '', description: '', cohortId: cohorts[0]?.id || '' });
    setShowCreateForm(true);
  };

  if (leagues.length === 0 && !loading && !showCreateForm && !editingLeague) {
    return (
      <div className="text-center py-8 text-gray-500">
        No leagues found
        <div className="mt-4">
          <button 
            onClick={startCreate}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Create New League
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Form for creating or editing leagues */}
      {(showCreateForm || editingLeague) && (
        <div className="bg-gray-50 p-6 mb-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingLeague ? 'Edit League' : 'Create New League'}
          </h3>
          <form onSubmit={editingLeague ? handleEditSubmit : handleCreateSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                League Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={leagueForm.name}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={leagueForm.description}
                onChange={handleFormChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              ></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="cohortId" className="block text-sm font-medium text-gray-700 mb-1">
                Cohort
              </label>
              <select
                id="cohortId"
                name="cohortId"
                value={leagueForm.cohortId}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                required
              >
                <option value="" disabled>Select a cohort</option>
                {cohorts.map(cohort => (
                  <option key={cohort.id} value={cohort.id}>
                    {cohort.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={editingLeague ? cancelEdit : () => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                {editingLeague ? 'Save Changes' : 'Create League'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Button to show create form */}
      {!showCreateForm && !editingLeague && (
        <div className="mb-6 flex justify-end">
          <button 
            onClick={startCreate}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Create New League
          </button>
        </div>
      )}

      {/* League grid */}
      {leagues.length > 0 && !editingLeague && !showCreateForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leagues.map(league => (
            <div key={league.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{league.name}</h3>
                <p className="text-gray-600 mb-4">{league.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{league._count?.weeks || 0} weeks</span>
                  <span>{league._count?.enrollments || 0} students</span>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 flex justify-end">
                <button 
                  onClick={() => startEdit(league)} 
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium mr-4"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDeleteLeague(league.id)}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeagueManagement;
