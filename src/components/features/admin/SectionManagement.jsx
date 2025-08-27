import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Edit, Trash2, GripVertical, ChevronDown, ChevronRight, Calendar, BookOpen, Hash, Target, Filter, X } from 'lucide-react';

// Modal component that renders to document.body
const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[10000]"
      onClick={handleOverlayClick}
    >
      {children}
    </div>,
    document.body
  );
};

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
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    order: 1,
    weekId: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [toast, setToast] = useState(null);

  // Toast function
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Topic name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Topic name must be 100 characters or less';
    }
    
    if (!formData.weekId) {
      newErrors.weekId = 'Module selection is required';
    }
    
    if (!formData.order || formData.order < 1) {
      newErrors.order = 'Order must be a positive integer';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      
      const validationResult = validateForm();
      if (!validationResult) {
        return;
      }
      
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        if (editingSection) {
          if (typeof onUpdateSection !== 'function') {
            throw new Error('Update function not available');
          }
          await onUpdateSection(editingSection.id, formData);
          showToast('Learning topic updated successfully!', 'success');
        } else {
          if (typeof onCreateSection !== 'function') {
            throw new Error('Create function not available');
          }
          await onCreateSection(formData);
          showToast('Learning topic created successfully!', 'success');
        }
        // Only reset form and close modal on success
        setFormData({
          name: '',
          order: 1,
          weekId: selectedWeekId || ''
        });
        setErrors({});
        setSubmitError(null);
        setIsSubmitting(false);
        setShowCreateForm(false);
        setEditingSection(null);
      } catch (error) {
        console.error('Error submitting form:', error);
        
        // Prevent error from bubbling up to global error handlers
        e?.preventDefault();
        e?.stopPropagation();
        
        // Extract error message from backend response
        let errorMessage = 'An error occurred while saving. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.details) {
        errorMessage = error.response.data.details;
      } else if (error.response?.data?.errors) {
        // Handle validation errors array
        const errors = error.response.data.errors;
        if (Array.isArray(errors) && errors.length > 0) {
          errorMessage = errors.map(err => err.message || err).join(', ');
        } else if (typeof errors === 'object') {
          errorMessage = Object.values(errors).flat().join(', ');
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Handle network errors
      if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      // Handle specific HTTP status codes
      if (error.response?.status === 400) {
        errorMessage = errorMessage || 'Invalid data provided. Please check your input.';
      } else if (error.response?.status === 401) {
        errorMessage = 'You are not authorized to perform this action.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to perform this action.';
      } else if (error.response?.status === 404) {
        errorMessage = 'The requested resource was not found.';
      } else if (error.response?.status === 409) {
        errorMessage = errorMessage || 'A conflict occurred. This item may already exist.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }        
        setSubmitError(errorMessage);
        // Do NOT close modal on error - let user see the error and retry
      } finally {
        setIsSubmitting(false);
      }
    } catch (outerError) {
      console.error('Unexpected error in form submission:', outerError);
      setSubmitError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
      // Do NOT close modal on error
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      order: 1,
      weekId: selectedWeekId || ''
    });
    setErrors({});
    setSubmitError(null);
    setIsSubmitting(false);
    setShowCreateForm(false);
    setEditingSection(null);
  };

  const handleModalClose = () => {
    // Prevent closing modal during submission
    if (isSubmitting) {
      return;
    }
    resetForm();
  };

  const handleEdit = (section) => {
    setFormData({
      name: section.name,
      order: section.order,
      weekId: section.weekId
    });
    setEditingSection(section);
    setShowCreateForm(true);
  };

  const handleDelete = async (sectionId, sectionName) => {
    if (window.confirm(`Are you sure you want to delete topic "${sectionName}"? This will also delete all associated resources and progress records.`)) {
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

  // Group sections by module
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
    <div className="space-y-8">
      {/* Modern Header with Stats */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-gray-900 rounded-xl">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Learning Topics</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Manage learning content and organize educational resources by modules.
            </p>
            
            {/* Quick Stats */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">{filteredSections.length} Days</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">{Object.keys(sectionsByWeek).length} Weeks</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600">
                  {filteredSections.reduce((sum, section) => sum + (section._count?.resources || 0), 0)} Resources
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedLeagueId || selectedWeekId
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {(selectedLeagueId || selectedWeekId) && (
                <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {(selectedLeagueId ? 1 : 0) + (selectedWeekId ? 1 : 0)}
                </span>
              )}
            </button>
            
            {/* Create Button */}
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Topic
            </button>
          </div>
        </div>
      </div>

      {/* Improved Filters */}
      {showFilters && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filter Topics</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 inline mr-2" />
                League
              </label>
              <select
                value={selectedLeagueId}
                onChange={(e) => onSelectLeague(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Module
              </label>
              <select
                value={selectedWeekId}
                onChange={(e) => onSelectWeek(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Modules</option>
                {getFilteredWeeks().map((week) => (
                  <option key={week.id} value={week.id}>
                    {week.name} {week.league?.name && `(${week.league.name})`}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Active Filters */}
          {(selectedLeagueId || selectedWeekId) && (
            <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">Active filters:</span>
              {selectedLeagueId && (
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-lg">
                  {leagues.find(l => l.id === selectedLeagueId)?.name}
                  <button 
                    onClick={() => onSelectLeague('')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedWeekId && (
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-lg">
                  {weeks.find(w => w.id === selectedWeekId)?.name}
                  <button 
                    onClick={() => onSelectWeek('')}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal for Create/Edit Form */}
      <Modal isOpen={showCreateForm} onClose={handleModalClose}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 sticky top-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-900 rounded-lg">
                    {editingSection ? <Edit className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4 text-white" />}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingSection ? 'Edit Learning Topic' : 'Create New Learning Topic'}
                  </h3>
                </div>
                <button
                  onClick={handleModalClose}
                  disabled={isSubmitting}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="p-6">
                  {/* Submit Error Display */}
                  {submitError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
                            <X className="h-3 w-3 text-white" />
                          </div>
                        </div>
                        <div className="ml-3 flex-1">
                          <h3 className="text-sm font-medium text-red-800 mb-1">Unable to save</h3>
                          <p className="text-red-700 text-sm leading-relaxed">{submitError}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSubmitError(null)}
                          className="ml-3 flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
                          title="Dismiss error"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topic Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (submitError) setSubmitError(null); // Clear submit error when user starts typing
                      }}
                      className={`block w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-200 ${
                        errors.name 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent'
                      }`}
                      placeholder="e.g., Introduction to Machine Learning"
                      autoFocus
                      disabled={isSubmitting}
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-2">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Hash className="w-4 h-4 inline mr-1" />
                      Order *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.order}
                      onChange={(e) => {
                        setFormData({ ...formData, order: parseInt(e.target.value) || 1 });
                        if (submitError) setSubmitError(null);
                      }}
                      className={`block w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-200 ${
                        errors.order 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent'
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.order && <p className="text-red-600 text-sm mt-2">{errors.order}</p>}
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Module *
                  </label>
                  <select
                    value={formData.weekId}
                    onChange={(e) => {
                      setFormData({ ...formData, weekId: e.target.value });
                      if (submitError) setSubmitError(null);
                    }}
                    className={`block w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-200 ${
                      errors.weekId 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent'
                    }`}
                    disabled={isSubmitting}
                  >
                    <option value="">Select a module</option>
                    {getFilteredWeeks().map((week) => (
                      <option key={week.id} value={week.id}>
                        {week.name} {week.league?.name && `(${week.league.name})`}
                      </option>
                    ))}
                  </select>
                  {errors.weekId && <p className="text-red-600 text-sm mt-2">{errors.weekId}</p>}
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 sticky bottom-0">
              <div className="flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleModalClose}
                  disabled={isSubmitting}
                  className="px-6 py-2 text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-2 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {editingSection ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      {editingSection ? <Edit className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                      {editingSection ? 'Update Topic' : 'Create Topic'}
                    </>
                  )}
                </button>
              </div>
            </div>
            </form>
          </div>
      </Modal>

      {/* Modern Sections Table */}
      <div className="space-y-6">
        {Object.keys(sectionsByWeek).length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Learning Topics Found</h3>
              <p className="text-gray-600 mb-6">
                {selectedWeekId || selectedLeagueId 
                  ? 'No days match your current filters. Try adjusting your search criteria.' 
                  : 'Get started by creating your first learning topic to organize educational content.'
                }
              </p>
              {!showCreateForm && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Topic
                </button>
              )}
            </div>
          </div>
        ) : (
          Object.entries(sectionsByWeek).map(([weekId, weekGroup]) => (
            <div key={weekId} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              {/* Week Header */}
              <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-900 rounded-lg">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {weekGroup.week?.name}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {weekGroup.week?.league?.name}
                      </span>
                      <span className="flex items-center">
                        <Target className="w-4 h-4 mr-1" />
                        {weekGroup.sections.length} Topic{weekGroup.sections.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sections Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="w-2/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <GripVertical className="w-4 h-4" />
                          <span>Day</span>
                        </div>
                      </th>
                      <th className="w-20 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="w-28 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resources
                      </th>
                      <th className="w-24 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="w-24 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {weekGroup.sections.map((section) => (
                      <tr key={section.id} className="hover:bg-gray-50 transition-colors duration-200 group">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="text-gray-300 group-hover:text-gray-400 transition-colors">
                              <GripVertical className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors truncate">
                                {section.name}
                              </h5>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            #{section.order}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center text-sm text-gray-500">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            <span className="whitespace-nowrap">
                              {section._count?.resources || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-500">
                          <span className="whitespace-nowrap">
                            {new Date(section.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric' 
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              onClick={() => handleEdit(section)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="Edit Topic"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(section.id, section.name)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                              title="Delete Day"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-[10001]">
          <div className={`flex items-center p-4 rounded-xl shadow-lg transition-all duration-300 ${
            toast.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex-shrink-0">
              {toast.type === 'success' ? (
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <X className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionManagement;
