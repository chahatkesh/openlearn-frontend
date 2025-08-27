import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  GripVertical, 
  Play,
  FileText,
  ExternalLink,
  BookOpen,
  Eye,
  ChevronDown,
  ChevronRight,
  X,
  RotateCcw
} from 'lucide-react';

const ResourceManagement = ({
  user,
  resources,
  sections,
  weeks,
  leagues,
  onCreateResource,
  onUpdateResource,
  onDeleteResource,
  // onReorderResources, // Reserved for future drag-and-drop functionality
  selectedLeagueId,
  selectedWeekId,
  selectedSectionId,
  onSelectLeague,
  onSelectWeek,
  onSelectSection,
  loading
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    type: 'VIDEO',
    order: 1,
    sectionId: ''
  });
  const [errors, setErrors] = useState({});
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [expandedSections, setExpandedSections] = useState({});

  // Check if user is Grand Pathfinder (has access to all data without filtering)
  const isGrandPathfinder = user?.role === 'GRAND_PATHFINDER';

  // Resource types with icons and labels
  const resourceTypes = {
    VIDEO: { icon: Play, label: 'Video', color: 'text-red-600', bg: 'bg-red-100' },
    ARTICLE: { icon: FileText, label: 'Article', color: 'text-blue-600', bg: 'bg-blue-100' },
    EXTERNAL_LINK: { icon: ExternalLink, label: 'External Link', color: 'text-green-600', bg: 'bg-green-100' },
    BLOG: { icon: BookOpen, label: 'Blog', color: 'text-purple-600', bg: 'bg-purple-100' }
  };

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    onSelectLeague('');
    onSelectWeek('');
    onSelectSection('');
    setTypeFilter('ALL');
  }, [onSelectLeague, onSelectWeek, onSelectSection]);

  // Initialize form data with selected section
  useEffect(() => {
    if (selectedSectionId && !formData.sectionId) {
      setFormData(prev => ({
        ...prev,
        sectionId: selectedSectionId
      }));
    }
  }, [selectedSectionId, formData.sectionId]);

  // Keyboard shortcuts for filters
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle shortcuts when not in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'r': // Cmd/Ctrl + R to clear filters
            e.preventDefault();
            clearAllFilters();
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [clearAllFilters]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Resource title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be 200 characters or less';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = 'Please enter a valid URL';
      }
    }

    if (!formData.sectionId) {
      newErrors.sectionId = 'Section selection is required';
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
      if (editingResource) {
        await onUpdateResource(editingResource.id, formData);
      } else {
        await onCreateResource(formData);
      }
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      url: '',
      type: 'VIDEO',
      order: 1,
      sectionId: selectedSectionId || ''
    });
    setErrors({});
    setShowCreateForm(false);
    setEditingResource(null);
  };

  const handleEdit = (resource) => {
    setFormData({
      title: resource.title,
      url: resource.url,
      type: resource.type,
      order: resource.order,
      sectionId: resource.sectionId
    });
    setEditingResource(resource);
    setShowCreateForm(true);
  };

  const handleDelete = async (resourceId, resourceTitle) => {
    if (window.confirm(`Are you sure you want to delete resource "${resourceTitle}"? This action cannot be undone.`)) {
      try {
        await onDeleteResource(resourceId);
      } catch (error) {
        console.error('Error deleting resource:', error);
      }
    }
  };

  const toggleSectionExpansion = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (!isGrandPathfinder && selectedLeagueId) count++;
    if (selectedWeekId) count++;
    if (selectedSectionId) count++;
    if (typeFilter !== 'ALL') count++;
    return count;
  };

  // Get filter summary for display
  const getFilterSummary = () => {
    const filters = [];
    if (!isGrandPathfinder && selectedLeagueId) {
      const league = leagues.find(l => l.id === selectedLeagueId);
      filters.push({ type: 'league', label: league?.name || 'Unknown League', value: selectedLeagueId });
    }
    if (selectedWeekId) {
      const week = weeks.find(w => w.id === selectedWeekId);
      filters.push({ type: 'week', label: week?.name || 'Unknown Week', value: selectedWeekId });
    }
    if (selectedSectionId) {
      const section = sections.find(s => s.id === selectedSectionId);
      filters.push({ type: 'section', label: section?.name || 'Unknown Section', value: selectedSectionId });
    }
    if (typeFilter !== 'ALL') {
      filters.push({ type: 'type', label: resourceTypes[typeFilter]?.label || typeFilter, value: typeFilter });
    }
    return filters;
  };

  // Remove specific filter
  const removeFilter = (filterType) => {
    switch (filterType) {
      case 'league':
        onSelectLeague('');
        break;
      case 'week':
        onSelectWeek('');
        break;
      case 'section':
        onSelectSection('');
        break;
      case 'type':
        setTypeFilter('ALL');
        break;
      default:
        break;
    }
  };

  // Filter resources (with real-time filtering based on league hierarchy)
  const filteredResources = resources.filter(resource => {
    // Get the section to check league and week hierarchy
    const section = sections.find(s => s.id === resource.sectionId);
    if (!section) return false;
    
    const week = weeks.find(w => w.id === section.weekId);
    if (!week) return false;
    
    // Filter by league (if selected, only show resources in that league)
    // Skip league filtering for Grand Pathfinder users
    if (!isGrandPathfinder && selectedLeagueId && week.leagueId !== selectedLeagueId) return false;
    
    // Filter by week (if selected, only show resources in that week)
    if (selectedWeekId && section.weekId !== selectedWeekId) return false;
    
    // Filter by section (if selected, only show resources in that section)
    if (selectedSectionId && resource.sectionId !== selectedSectionId) return false;
    
    // Filter by type
    if (typeFilter !== 'ALL' && resource.type !== typeFilter) return false;
    
    return true;
  });

  // Group resources by section (sorted by order within sections)
  const resourcesBySection = filteredResources.reduce((acc, resource) => {
    const sectionId = resource.sectionId;
    if (!acc[sectionId]) {
      acc[sectionId] = [];
    }
    acc[sectionId].push(resource);
    return acc;
  }, {});

  // Sort resources within each section by order
  Object.keys(resourcesBySection).forEach(sectionId => {
    resourcesBySection[sectionId].sort((a, b) => a.order - b.order);
  });

  // Get resource type icon
  const getResourceTypeIcon = (type) => {
    const typeInfo = resourceTypes[type] || resourceTypes.ARTICLE;
    const IconComponent = typeInfo.icon;
    return <IconComponent className={`h-4 w-4 ${typeInfo.color}`} />;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Resource Management</h3>
          <p className="mt-1 text-sm text-gray-600">
            Manage learning resources (videos, articles, external links, and blogs)
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800"
        >
          <Plus size={16} className="mr-2" />
          Create Resource
        </button>
      </div>

      {/* Simple Compact Filters */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* Filter Controls */}
        <div className="p-4">
          <div className={`grid grid-cols-1 gap-4 ${isGrandPathfinder ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
            {!isGrandPathfinder && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  League
                </label>
                <select
                  value={selectedLeagueId}
                  onChange={(e) => onSelectLeague(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">All Leagues</option>
                  {leagues.map((league) => (
                    <option key={league.id} value={league.id}>
                      {league.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Week
              </label>
              <select
                value={selectedWeekId}
                onChange={(e) => onSelectWeek(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                disabled={!isGrandPathfinder && !selectedLeagueId}
              >
                <option value="">All Weeks</option>
                {weeks
                  .filter(week => isGrandPathfinder || !selectedLeagueId || week.leagueId === selectedLeagueId)
                  .map((week) => (
                    <option key={week.id} value={week.id}>
                      {week.name}
                    </option>
                  ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section
              </label>
              <select
                value={selectedSectionId}
                onChange={(e) => onSelectSection(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                disabled={!selectedWeekId}
              >
                <option value="">All Sections</option>
                {sections
                  .filter(section => !selectedWeekId || section.weekId === selectedWeekId)
                  .map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.name}
                    </option>
                  ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resource Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="ALL">All Types</option>
                {Object.entries(resourceTypes).map(([type, info]) => (
                  <option key={type} value={type}>
                    {info.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Actions */}
          {getActiveFilterCount() > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2 flex-wrap gap-2">
                <span className="text-xs font-medium text-gray-500">Active filters:</span>
                {getFilterSummary().map((filter, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {filter.label}
                    <button
                      onClick={() => removeFilter(filter.type)}
                      className="ml-1.5 inline-flex items-center justify-center w-3 h-3 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      <X className="h-2 w-2" />
                    </button>
                  </span>
                ))}
              </div>
              <button
                onClick={clearAllFilters}
                title="Clear all filters (⌘R)"
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="px-4 py-3 bg-gray-50 rounded-b-lg border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              <span className="font-medium">{filteredResources.length}</span> resource{filteredResources.length !== 1 ? 's' : ''} found
              {getActiveFilterCount() > 0 && (
                <span className="text-xs text-gray-500 ml-2">
                  (filtered from {resources.length} total)
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            {editingResource ? 'Edit Resource' : 'Create New Resource'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`block w-full border rounded-md shadow-sm px-3 py-2 focus:ring-black focus:border-black ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter resource title..."
                  maxLength={200}
                />
                {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title}</p>}
                <p className="text-xs text-gray-500 mt-1">{formData.title.length}/200 characters</p>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL *
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className={`block w-full border rounded-md shadow-sm px-3 py-2 focus:ring-black focus:border-black ${
                    errors.url ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="https://example.com"
                />
                {errors.url && <p className="text-red-600 text-xs mt-1">{errors.url}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                >
                  {Object.entries(resourceTypes).map(([type, info]) => (
                    <option key={type} value={type}>
                      {info.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section *
                </label>
                <select
                  value={formData.sectionId}
                  onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
                  className={`block w-full border rounded-md shadow-sm focus:ring-black focus:border-black ${
                    errors.sectionId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a section</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.week?.league?.name} - {section.week?.name} - {section.name}
                    </option>
                  ))}
                </select>
                {errors.sectionId && <p className="text-red-600 text-xs mt-1">{errors.sectionId}</p>}
              </div>

              <div>
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
                {editingResource ? 'Update Resource' : 'Create Resource'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Resources Display */}
      <div className="space-y-4">
        {Object.keys(resourcesBySection).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BookOpen className="mx-auto h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No resources found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedSectionId ? 'No resources in the selected section.' : 'No resources match your current filters.'}
            </p>
            {selectedSectionId && (
              <div className="mt-6">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
                >
                  <Plus size={16} className="mr-2" />
                  Create First Resource
                </button>
              </div>
            )}
          </div>
        ) : (
          Object.entries(resourcesBySection).map(([sectionId, sectionResources]) => {
            const section = sections.find(s => s.id === sectionId);
            const isExpanded = expandedSections[sectionId] !== false; // Default to expanded
            
            return (
              <div key={sectionId} className="bg-white border border-gray-200 rounded-lg">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleSectionExpansion(sectionId)}
                >
                  <div className="flex items-center space-x-3">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {section?.week?.league?.name} - {section?.week?.name} - {section?.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {sectionResources.length} resource{sectionResources.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {Object.entries(
                      sectionResources.reduce((acc, resource) => {
                        acc[resource.type] = (acc[resource.type] || 0) + 1;
                        return acc;
                      }, {})
                    ).map(([type, count]) => {
                      const typeInfo = resourceTypes[type];
                      const IconComponent = typeInfo.icon;
                      return (
                        <span
                          key={type}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${typeInfo.bg} ${typeInfo.color}`}
                          title={`${count} ${typeInfo.label}${count !== 1 ? 's' : ''}`}
                        >
                          <IconComponent className="h-3 w-3 mr-1" />
                          {count}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-200">
                    <div className="divide-y divide-gray-200">
                      {sectionResources.map((resource) => (
                          <div key={resource.id} className="p-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 flex-1">
                                <div className="flex items-center space-x-2">
                                  <GripVertical className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm font-medium text-gray-500 w-8">
                                    #{resource.order}
                                  </span>
                                </div>
                                <div className={`p-2 rounded-full ${resourceTypes[resource.type].bg}`}>
                                  {getResourceTypeIcon(resource.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="text-sm font-medium text-gray-900 truncate">
                                    {resource.title}
                                  </h5>
                                  <div className="flex items-center space-x-4 mt-1">
                                    <span className={`text-xs px-2 py-1 rounded-full ${resourceTypes[resource.type].bg} ${resourceTypes[resource.type].color}`}>
                                      {resourceTypes[resource.type].label}
                                    </span>
                                    <a
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-600 hover:text-blue-800 truncate max-w-xs"
                                      title={resource.url}
                                    >
                                      {resource.url}
                                    </a>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => window.open(resource.url, '_blank')}
                                  className="p-2 text-gray-400 hover:text-blue-600"
                                  title="View Resource"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  onClick={() => handleEdit(resource)}
                                  className="p-2 text-gray-400 hover:text-gray-600"
                                  title="Edit Resource"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDelete(resource.id, resource.title)}
                                  className="p-2 text-gray-400 hover:text-red-600"
                                  title="Delete Resource"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Stats Summary */}
      {filteredResources.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Resource Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{filteredResources.length}</div>
              <div className="text-sm text-gray-500">Total Resources</div>
            </div>
            {Object.entries(resourceTypes).map(([type, info]) => {
              const count = filteredResources.filter(r => r.type === type).length;
              return (
                <div key={type} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-sm text-gray-500">{info.label}s</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceManagement;
