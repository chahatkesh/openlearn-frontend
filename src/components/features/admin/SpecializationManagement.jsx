import React, { useState, useEffect } from 'react';

const SpecializationManagement = ({
  specializations,
  cohorts,
  leagues,
  onCreateSpecialization,
  onUpdateSpecialization,
  onDeleteSpecialization,
  loading
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSpecialization, setEditingSpecialization] = useState(null);
  const [specForm, setSpecForm] = useState({
    name: '',
    description: '',
    cohortId: '',
    leagues: []
  });
  const [selectedLeagues, setSelectedLeagues] = useState([]);

  // If cohorts change while the form is open
  useEffect(() => {
    if (cohorts && cohorts.length > 0 && !specForm.cohortId) {
      setSpecForm(prev => ({
        ...prev,
        cohortId: cohorts[0].id
      }));
    }
  }, [cohorts, specForm.cohortId]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSpecForm({
      ...specForm,
      [name]: value
    });
  };

  const handleLeagueSelection = (leagueId, isChecked) => {
    if (isChecked) {
      const newLeague = {
        leagueId,
        order: selectedLeagues.length + 1
      };
      setSelectedLeagues([...selectedLeagues, newLeague]);
    } else {
      const updatedLeagues = selectedLeagues
        .filter(league => league.leagueId !== leagueId)
        .map((league, index) => ({
          ...league,
          order: index + 1
        }));
      setSelectedLeagues(updatedLeagues);
    }
  };

  const moveLeague = (leagueId, direction) => {
    const leagueIndex = selectedLeagues.findIndex(league => league.leagueId === leagueId);
    if (
      (direction === 'up' && leagueIndex === 0) || 
      (direction === 'down' && leagueIndex === selectedLeagues.length - 1)
    ) {
      return;
    }

    const newLeagues = [...selectedLeagues];
    const swapIndex = direction === 'up' ? leagueIndex - 1 : leagueIndex + 1;
    
    // Swap the items
    [newLeagues[leagueIndex], newLeagues[swapIndex]] = [newLeagues[swapIndex], newLeagues[leagueIndex]];
    
    // Update order properties
    const updatedLeagues = newLeagues.map((league, index) => ({
      ...league,
      order: index + 1
    }));
    
    setSelectedLeagues(updatedLeagues);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const specializationData = {
      ...specForm,
      leagues: selectedLeagues
    };
    onCreateSpecialization(specializationData);
    resetForm();
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const specializationData = {
      ...specForm,
      leagues: selectedLeagues
    };
    onUpdateSpecialization(editingSpecialization.id, specializationData);
    resetForm();
  };

  const resetForm = () => {
    setSpecForm({
      name: '',
      description: '',
      cohortId: cohorts[0]?.id || ''
    });
    setSelectedLeagues([]);
    setShowCreateForm(false);
    setEditingSpecialization(null);
  };

  const startEdit = (specialization) => {
    setSpecForm({
      name: specialization.name,
      description: specialization.description,
      cohortId: specialization.cohortId
    });

    // Set up the selected leagues from the specialization
    const specLeagues = specialization.leagues?.map(leagueItem => ({
      leagueId: leagueItem.leagueId || leagueItem.league.id,
      order: leagueItem.order
    })) || [];
    
    setSelectedLeagues(specLeagues);
    setEditingSpecialization(specialization);
    setShowCreateForm(false);
  };

  const startCreate = () => {
    resetForm();
    setShowCreateForm(true);
  };

  if (specializations.length === 0 && !loading && !showCreateForm && !editingSpecialization) {
    return (
      <div className="text-center py-8 text-gray-500">
        No specializations found
        <div className="mt-4">
          <button 
            onClick={startCreate}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Create New Specialization
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Form for creating or editing specializations */}
      {(showCreateForm || editingSpecialization) && (
        <div className="bg-gray-50 p-6 mb-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingSpecialization ? 'Edit Specialization' : 'Create New Specialization'}
          </h3>
          <form onSubmit={editingSpecialization ? handleEditSubmit : handleCreateSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Specialization Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={specForm.name}
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
                value={specForm.description}
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
                value={specForm.cohortId}
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
            
            {/* League selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Leagues
              </label>
              <div className="border border-gray-300 rounded-md p-4 bg-white">
                <div className="mb-4">
                  {leagues.length === 0 ? (
                    <p className="text-sm text-gray-500">No leagues available. Create leagues first.</p>
                  ) : (
                    leagues.map(league => (
                      <div key={league.id} className="flex items-center py-2 border-b border-gray-100 last:border-b-0">
                        <input
                          type="checkbox"
                          id={`league-${league.id}`}
                          checked={selectedLeagues.some(l => l.leagueId === league.id)}
                          onChange={(e) => handleLeagueSelection(league.id, e.target.checked)}
                          className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                        />
                        <label htmlFor={`league-${league.id}`} className="ml-2 block text-sm text-gray-700">
                          {league.name}
                        </label>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Display selected leagues with ordering controls */}
                {selectedLeagues.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Leagues (Order)</h4>
                    <ul>
                      {selectedLeagues
                        .sort((a, b) => a.order - b.order)
                        .map((selectedLeague) => {
                          const league = leagues.find(l => l.id === selectedLeague.leagueId);
                          return (
                            <li key={selectedLeague.leagueId} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                              <span className="text-sm">
                                {selectedLeague.order}. {league?.name || 'Unknown League'}
                              </span>
                              <div className="space-x-2">
                                <button
                                  type="button"
                                  onClick={() => moveLeague(selectedLeague.leagueId, 'up')}
                                  className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
                                  disabled={selectedLeague.order === 1}
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveLeague(selectedLeague.leagueId, 'down')}
                                  className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
                                  disabled={selectedLeague.order === selectedLeagues.length}
                                >
                                  ↓
                                </button>
                              </div>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                )}
              </div>
              {selectedLeagues.length === 0 && (
                <p className="mt-2 text-xs text-red-500">Please select at least one league for this specialization.</p>
              )}
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
                disabled={selectedLeagues.length === 0}
              >
                {editingSpecialization ? 'Save Changes' : 'Create Specialization'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Button to show create form */}
      {!showCreateForm && !editingSpecialization && (
        <div className="mb-6 flex justify-end">
          <button 
            onClick={startCreate}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Create New Specialization
          </button>
        </div>
      )}

      {/* Specialization grid */}
      {specializations.length > 0 && !editingSpecialization && !showCreateForm && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {specializations.map(spec => (
            <div key={spec.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{spec.name}</h3>
                <p className="text-gray-600 mb-4">{spec.description}</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium text-gray-700">Cohort:</span>
                  <span className="text-sm text-gray-600">{spec.cohort?.name || 'Not assigned'}</span>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Leagues:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {spec.leagues?.map(leagueItem => (
                      <li key={leagueItem.id}>
                        {leagueItem.order}. {leagueItem.league?.name || 'Unknown League'}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{spec._count?.userSpecializations || 0} enrollments</span>
                  <span>{spec._count?.leagues || spec.leagues?.length || 0} leagues</span>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 flex justify-end">
                <button 
                  onClick={() => startEdit(spec)} 
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium mr-4"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDeleteSpecialization(spec.id)}
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

export default SpecializationManagement;
