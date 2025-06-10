import React, { useState } from 'react';
import { Plus, Edit, Trash2, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';

const SectionManagement = ({ 
  sections, 
  weeks, 
  leagues,
  onCreateSection, 
  onUpdateSection, 
  onDeleteSection,
  onReorderSections,
  selectedLeagueId,
  selectedWeekId,
  onSelectLeague,
  onSelectWeek,
  loading 
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    order: 1,
    weekId: ''
  });
  const [errors, setErrors] = useState({});

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Section name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Section name must be 100 characters or less';
    }
    
    if (!formData.weekId) {
      newErrors.weekId = 'Week selection is required';
    }
    
    if (!formData.order || formData.order < 1) {
      newErrors.order = 'Order must be a positive integer';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (editingSection) {
        await onUpdateSection(editingSection.id, formData);
      } else {
        await onCreateSection(formData);
      }
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      order: 1,
      weekId: selectedWeekId || ''
    });
    setErrors({});
    setShowCreateForm(false);
    setEditingSection(null);
  };

  const handleEdit = (section) => {
    setFormData({
      name: section.name,
      description: section.description || '',
      order: section.order,
      weekId: section.weekId
    });
    setEditingSection(section);
    setShowCreateForm(true);
  };

  const handleDelete = async (sectionId, sectionName) => {
    if (window.confirm(`Are you sure you want to delete section "${sectionName}"? This will also delete all associated resources and progress records.`)) {
      try {
        await onDeleteSection(sectionId);
      } catch (error) {
        console.error('Error deleting section:', error);
      }
    }
  };

  // Filter sections based on selected filters
  const filteredSections = sections.filter(section => {
    if (selectedWeekId && section.weekId !== selectedWeekId) return false;
    if (selectedLeagueId && !section.week?.league?.id === selectedLeagueId) return false;
    return true;
  });

  // Group sections by week
  const sectionsByWeek = filteredSections.reduce((acc, section) => {
    const weekId = section.weekId;
    if (!acc[weekId]) {
      acc[weekId] = {
        week: section.week,
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

  const getFilteredWeeks = () => {
    if (selectedLeagueId) {
      return weeks.filter(week => week.leagueId === selectedLeagueId);
    }
    return weeks;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Section Management</h3>
          <p className="mt-1 text-sm text-gray-600">
            Manage learning sections within weeks. Sections contain educational resources and activities.
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800"
        >
          <Plus size={16} className="mr-2" />
          Create Section
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by League
            </label>
            <select
              value={selectedLeagueId}
              onChange={(e) => onSelectLeague(e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
            >
              <option value="">All Leagues</option>
              {leagues.map((league) => (
                <option key={league.id} value={league.id}>
                  {league.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Week
            </label>
            <select
              value={selectedWeekId}
              onChange={(e) => onSelectWeek(e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
            >
              <option value="">All Weeks</option>
              {getFilteredWeeks().map((week) => (
                <option key={week.id} value={week.id}>
                  {week.name} ({week.league?.name})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            {editingSection ? 'Edit Section' : 'Create New Section'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`block w-full border rounded-md shadow-sm px-3 py-2 focus:ring-black focus:border-black ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Introduction to Machine Learning"
                />
                {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Week *
                </label>
                <select
                  value={formData.weekId}
                  onChange={(e) => setFormData({ ...formData, weekId: e.target.value })}
                  className={`block w-full border rounded-md shadow-sm px-3 py-2 focus:ring-black focus:border-black ${
                    errors.weekId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a week</option>
                  {getFilteredWeeks().map((week) => (
                    <option key={week.id} value={week.id}>
                      {week.name} ({week.league?.name})
                    </option>
                  ))}
                </select>
                {errors.weekId && <p className="text-red-600 text-xs mt-1">{errors.weekId}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-black focus:border-black"
                placeholder="Describe what students will learn in this section..."
              />
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order *
              </label>
              <input
                type="number"
                min="1"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                className={`block w-full border rounded-md shadow-sm px-3 py-2 focus:ring-black focus:border-black ${
                  errors.order ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.order && <p className="text-red-600 text-xs mt-1">{errors.order}</p>}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
              >
                {editingSection ? 'Update Section' : 'Create Section'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sections List */}
      <div className="space-y-6">
        {Object.keys(sectionsByWeek).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900">No sections found</h3>
            <p className="text-sm text-gray-500 mt-1">
              {selectedWeekId || selectedLeagueId 
                ? 'No sections match your current filters.' 
                : 'Get started by creating your first section.'
              }
            </p>
          </div>
        ) : (
          Object.entries(sectionsByWeek).map(([weekId, weekGroup]) => (
            <div key={weekId} className="bg-white border border-gray-200 rounded-lg">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {weekGroup.week?.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {weekGroup.week?.league?.name} • {weekGroup.sections.length} section{weekGroup.sections.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    Order: {weekGroup.week?.order}
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {weekGroup.sections.map((section) => (
                  <div key={section.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex items-center text-gray-400">
                          <GripVertical size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h5 className="text-lg font-medium text-gray-900">
                              {section.name}
                            </h5>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Order {section.order}
                            </span>
                          </div>
                          {section.description && (
                            <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>
                              {section._count?.resources || 0} resource{(section._count?.resources || 0) !== 1 ? 's' : ''}
                            </span>
                            <span>
                              {section._count?.progress || 0} completion{(section._count?.progress || 0) !== 1 ? 's' : ''}
                            </span>
                            <span>Created {new Date(section.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(section)}
                          className="p-2 text-gray-400 hover:text-gray-600"
                          title="Edit Section"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(section.id, section.name)}
                          className="p-2 text-gray-400 hover:text-red-600"
                          title="Delete Section"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats Summary */}
      {filteredSections.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{filteredSections.length}</div>
              <div className="text-sm text-gray-600">Total Sections</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {Object.keys(sectionsByWeek).length}
              </div>
              <div className="text-sm text-gray-600">Weeks with Sections</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {filteredSections.reduce((sum, section) => sum + (section._count?.resources || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Resources</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {filteredSections.reduce((sum, section) => sum + (section._count?.progress || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Completions</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionManagement;
