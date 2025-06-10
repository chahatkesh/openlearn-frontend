import React, { useState } from 'react';

const CohortManagement = ({ 
  cohorts, 
  onCreateCohort,
  onUpdateCohort,
  onDeleteCohort,
  loading
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCohort, setEditingCohort] = useState(null);
  const [cohortForm, setCohortForm] = useState({
    name: '',
    description: '',
    isActive: true
  });

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCohortForm({
      ...cohortForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    onCreateCohort(cohortForm);
    setCohortForm({ name: '', description: '', isActive: true });
    setShowCreateForm(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onUpdateCohort(editingCohort.id, cohortForm);
    setCohortForm({ name: '', description: '', isActive: true });
    setEditingCohort(null);
  };

  const startEdit = (cohort) => {
    setCohortForm({
      name: cohort.name,
      description: cohort.description,
      isActive: cohort.isActive
    });
    setEditingCohort(cohort);
    setShowCreateForm(false);
  };

  const cancelEdit = () => {
    setEditingCohort(null);
    setCohortForm({ name: '', description: '', isActive: true });
  };

  const startCreate = () => {
    setEditingCohort(null);
    setCohortForm({ name: '', description: '', isActive: true });
    setShowCreateForm(true);
  };

  if (cohorts.length === 0 && !loading && !showCreateForm && !editingCohort) {
    return (
      <div className="text-center py-8 text-gray-500">
        No cohorts found
        <div className="mt-4">
          <button 
            onClick={startCreate}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Create New Cohort
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Form for creating or editing cohorts */}
      {(showCreateForm || editingCohort) && (
        <div className="bg-gray-50 p-6 mb-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingCohort ? 'Edit Cohort' : 'Create New Cohort'}
          </h3>
          <form onSubmit={editingCohort ? handleEditSubmit : handleCreateSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Cohort Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={cohortForm.name}
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
                value={cohortForm.description}
                onChange={handleFormChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              ></textarea>
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={cohortForm.isActive}
                onChange={handleFormChange}
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Active Cohort
              </label>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={editingCohort ? cancelEdit : () => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                {editingCohort ? 'Save Changes' : 'Create Cohort'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Button to show create form */}
      {!showCreateForm && !editingCohort && (
        <div className="mb-6 flex justify-end">
          <button 
            onClick={startCreate}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Create New Cohort
          </button>
        </div>
      )}

      {/* Cohort grid */}
      {cohorts.length > 0 && !editingCohort && !showCreateForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cohorts.map(cohort => (
            <div key={cohort.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{cohort.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    cohort.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {cohort.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{cohort.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{cohort._count?.enrollments || 0} students</span>
                  <span>{cohort._count?.specializations || 0} specializations</span>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 flex justify-end">
                <button 
                  onClick={() => startEdit(cohort)} 
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium mr-4"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDeleteCohort(cohort.id)}
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

export default CohortManagement;
