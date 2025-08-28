import React, { useState, useEffect } from 'react';
import { X, Plus, ChevronDown, ChevronRight, Edit, Trash2, ExternalLink } from 'lucide-react';


const ResourceManagement = ({
  resources,
  sections,
  weeks,
  leagues,
  onCreateResource,
  onUpdateResource,
  onDeleteResource,
  selectedLeagueId,
  selectedWeekId,
  selectedSectionId,
  onSelectLeague,
  onSelectWeek,
  resourceTypes,
  isGrandPathfinder,
  loading
}) => {


  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [expandedModules, setExpandedModules] = useState(new Set());
  const [expandedTopics, setExpandedTopics] = useState(new Set());
  const [resourceForm, setResourceForm] = useState({
    title: '',
    url: '',
    type: 'VIDEO',
    order: '',
    sectionId: ''
  });
  const [typeFilter] = useState('ALL');

  // If sections change while the form is open
  useEffect(() => {
    if (sections.length > 0 && selectedSectionId) {
      setResourceForm(prev => ({
        ...prev,
        sectionId: selectedSectionId
      }));
    }
  }, [sections, selectedSectionId]);

  useEffect(() => {
    // When switching sections, update the form's sectionId
    if (selectedSectionId) {
      setResourceForm(prev => ({
        ...prev,
        sectionId: selectedSectionId
      }));
    }
  }, [selectedSectionId]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setResourceForm({
      ...resourceForm,
      [name]: name === 'order' ? parseInt(value, 10) || '' : value
    });
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    onCreateResource(resourceForm);
    resetForm();
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onUpdateResource(editingResource.id, resourceForm);
    resetForm();
  };

  const resetForm = () => {
    setResourceForm({
      title: '',
      url: '',
      type: 'VIDEO',
      order: '',
      sectionId: selectedSectionId || ''
    });
    setShowCreateForm(false);
    setEditingResource(null);
  };

  const startCreate = (sectionId = null) => {
    // If sectionId is provided, create resource for that specific topic
    const targetSectionId = sectionId || selectedSectionId || (sections.length > 0 ? sections[0].id : '');
    
    // Find the highest order in the target section's resources and add 1
    const currentSectionResources = resources.filter(resource => resource.sectionId === targetSectionId);
    const nextOrder = currentSectionResources.length > 0 
      ? Math.max(...currentSectionResources.map(resource => resource.order)) + 1 
      : 1;
    
    setResourceForm({
      title: '',
      url: '',
      type: 'VIDEO',
      order: nextOrder,
      sectionId: targetSectionId
    });
    setEditingResource(null);
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

  const toggleTopic = (sectionId) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedTopics(newExpanded);
  };

  const handleEdit = (resource) => {
    setResourceForm({
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

  // Filter resources based on current selections
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

  // Get resource type icon with fallback for missing resourceTypes
  const getResourceTypeIcon = (type) => {
    // Provide default resourceTypes if not passed as prop
    const defaultResourceTypes = {
      VIDEO: { icon: '🎥', label: 'Video', color: 'text-red-600' },
      ARTICLE: { icon: '📄', label: 'Article', color: 'text-blue-600' },
      EXTERNAL_LINK: { icon: '🔗', label: 'External Link', color: 'text-green-600' },
      BLOG: { icon: '📝', label: 'Blog', color: 'text-purple-600' }
    };
    
    const types = resourceTypes || defaultResourceTypes;
    const typeInfo = types[type] || types.ARTICLE || { icon: '📄', label: 'Article', color: 'text-gray-600' };
    
    // If icon is a string (emoji), render it directly
    if (typeof typeInfo.icon === 'string') {
      return <span className={`text-lg ${typeInfo.color}`}>{typeInfo.icon}</span>;
    }
    
    // If icon is a component, render it
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

  // Filter weeks based on current selections
  const filteredWeeks = weeks.filter(week => {
    // Filter by league (if selected, only show weeks in that league)
    // Skip league filtering for Grand Pathfinder users
    if (!isGrandPathfinder && selectedLeagueId && week.leagueId !== selectedLeagueId) return false;
    
    // Filter by week (if selected, only show that specific week)
    if (selectedWeekId && week.id !== selectedWeekId) return false;
    
    return true;
  });

  // Filter sections based on current selections
  const filteredSections = sections.filter(section => {
    const week = weeks.find(w => w.id === section.weekId);
    if (!week) return false;
    
    // Filter by league (if selected, only show sections in weeks from that league)
    // Skip league filtering for Grand Pathfinder users
    if (!isGrandPathfinder && selectedLeagueId && week.leagueId !== selectedLeagueId) return false;
    
    // Filter by week (if selected, only show sections in that week)
    if (selectedWeekId && section.weekId !== selectedWeekId) return false;
    
    return true;
  });

  // Group filtered weeks by league for Apple-style organization
  const weeksByLeague = filteredWeeks.reduce((acc, week) => {
    const leagueId = week.leagueId;
    if (!acc[leagueId]) {
      acc[leagueId] = [];
    }
    acc[leagueId].push(week);
    return acc;
  }, {});

  // Group filtered sections by week
  const sectionsByWeek = filteredSections.reduce((acc, section) => {
    const weekId = section.weekId;
    if (!acc[weekId]) {
      acc[weekId] = [];
    }
    acc[weekId].push(section);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200/50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 tracking-tight">
                  Resource Management
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
                  Organize and manage your learning resources within topics
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
                    disabled={!isGrandPathfinder && !selectedLeagueId}
                  >
                    <option value="">All Modules</option>
                    {weeks
                      .filter(week => isGrandPathfinder || !selectedLeagueId || week.leagueId === selectedLeagueId)
                      .map(week => (
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

        {/* Create Resource Form Modal */}
        {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-gray-200/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingResource ? 'Edit Resource' : 'Add New Resource'}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={editingResource ? handleEditSubmit : handleCreateSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Resource Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={resourceForm.title}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 backdrop-blur-sm"
                    placeholder="Enter resource title..."
                    maxLength={200}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">{resourceForm.title.length}/200 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Resource URL
                  </label>
                  <input
                    type="url"
                    name="url"
                    value={resourceForm.url}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 backdrop-blur-sm"
                    placeholder="https://example.com/resource"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Resource Type
                    </label>
                    <select
                      name="type"
                      value={resourceForm.type}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 backdrop-blur-sm"
                    >
                      {Object.entries(resourceTypes || {
                        VIDEO: { label: 'Video' },
                        ARTICLE: { label: 'Article' },
                        EXTERNAL_LINK: { label: 'External Link' },
                        BLOG: { label: 'Blog' }
                      }).map(([type, info]) => (
                        <option key={type} value={type}>
                          {info.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      name="order"
                      min="1"
                      value={resourceForm.order}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 backdrop-blur-sm"
                      placeholder="1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Topic (Section)
                  </label>
                  <select
                    name="sectionId"
                    value={resourceForm.sectionId}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 backdrop-blur-sm"
                    required
                  >
                    <option value="">Select a topic</option>
                    {sections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.week?.league?.name} - {section.week?.name} - {section.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
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
                    {editingResource ? 'Update Resource' : 'Create Resource'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Leagues (for non-Grand Pathfinder users) or Direct Week View */}
      <div className="space-y-8">
        {isGrandPathfinder ? (
          // Direct week view for Grand Pathfinder
          <div className="space-y-6">
            {filteredWeeks.map(week => {
              const weekSections = sectionsByWeek[week.id] || [];
              const isModuleExpanded = expandedModules.has(week.id);
              
              return (
                <div
                  key={week.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-gray-200/50 overflow-hidden"
                >
                  {/* Module Header */}
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors"
                    onClick={() => toggleModule(week.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-2xl">
                          {isModuleExpanded ? (
                            <ChevronDown className="h-6 w-6 text-blue-600" />
                          ) : (
                            <ChevronRight className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            Module: {week.name}
                          </h3>
                          <p className="text-gray-600">
                            {weekSections.length} topic{weekSections.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {weekSections.reduce((total, section) => {
                            return total + (resourcesBySection[section.id]?.length || 0);
                          }, 0)} resources
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Topics within Module */}
                  {isModuleExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50/30">
                      <div className="p-6 space-y-4">
                        {weekSections.length === 0 ? (
                          <p className="text-center text-gray-500 py-8">
                            No topics found in this module
                          </p>
                        ) : (
                          weekSections.map(section => {
                            const sectionResources = resourcesBySection[section.id] || [];
                            const isTopicExpanded = expandedTopics.has(section.id);
                            
                            return (
                              <div
                                key={section.id}
                                className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 overflow-hidden"
                              >
                                {/* Topic Header */}
                                <div
                                  className="p-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                                  onClick={() => toggleTopic(section.id)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <div className="p-2 bg-green-100 rounded-xl">
                                        {isTopicExpanded ? (
                                          <ChevronDown className="h-4 w-4 text-green-600" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4 text-green-600" />
                                        )}
                                      </div>
                                      <div>
                                        <h4 className="font-semibold text-gray-900">
                                          {section.name}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                          {sectionResources.length} resource{sectionResources.length !== 1 ? 's' : ''}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        startCreate(section.id);
                                      }}
                                      className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 text-sm font-medium flex items-center space-x-2"
                                    >
                                      <Plus className="h-4 w-4" />
                                      <span>Add Resource</span>
                                    </button>
                                  </div>
                                </div>

                                {/* Resources within Topic */}
                                {isTopicExpanded && (
                                  <div className="border-t border-gray-100 bg-white/30 p-4">
                                    {sectionResources.length === 0 ? (
                                      <div className="text-center py-8">
                                        <p className="text-gray-500 mb-4">No resources in this topic</p>
                                        <button
                                          onClick={() => startCreate(section.id)}
                                          className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 text-sm font-medium"
                                        >
                                          <Plus className="h-4 w-4 mr-2" />
                                          Add First Resource
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="space-y-3">
                                        {sectionResources.map(resource => (
                                          <div
                                            key={resource.id}
                                            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 hover:border-gray-300/50 transition-all duration-200"
                                          >
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center space-x-3 flex-1">
                                                <div className="flex-shrink-0">
                                                  {getResourceTypeIcon(resource.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                  <h5 className="font-medium text-gray-900 truncate">
                                                    {resource.title}
                                                  </h5>
                                                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                    <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs">
                                                      {(resourceTypes || {})[resource.type]?.label || resource.type}
                                                    </span>
                                                    <span>Order: {resource.order}</span>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="flex items-center space-x-2">
                                                <a
                                                  href={resource.url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                                  title="Open resource"
                                                >
                                                  <ExternalLink className="h-4 w-4" />
                                                </a>
                                                <button
                                                  onClick={() => handleEdit(resource)}
                                                  className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                                  title="Edit resource"
                                                >
                                                  <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                  onClick={() => handleDelete(resource.id, resource.title)}
                                                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                                  title="Delete resource"
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // League-based view for other users
          <div className="space-y-8">
            {leagues.map(league => {
              const leagueWeeks = weeksByLeague[league.id] || [];
              
              return (
                <div key={league.id} className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">{league.name}</h2>
                    <p className="text-gray-600 mt-2">{leagueWeeks.length} modules</p>
                  </div>
                  
                  {leagueWeeks.map(week => {
                    const weekSections = sectionsByWeek[week.id] || [];
                    const isModuleExpanded = expandedModules.has(week.id);
                    
                    return (
                      <div
                        key={week.id}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-gray-200/50 overflow-hidden"
                      >
                        {/* Module Header */}
                        <div
                          className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors"
                          onClick={() => toggleModule(week.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="p-3 bg-blue-100 rounded-2xl">
                                {isModuleExpanded ? (
                                  <ChevronDown className="h-6 w-6 text-blue-600" />
                                ) : (
                                  <ChevronRight className="h-6 w-6 text-blue-600" />
                                )}
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                  Module: {week.name}
                                </h3>
                                <p className="text-gray-600">
                                  {weekSections.length} topic{weekSections.length !== 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">
                                {weekSections.reduce((total, section) => {
                                  return total + (resourcesBySection[section.id]?.length || 0);
                                }, 0)} resources
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Topics within Module - Same as Grand Pathfinder view */}
                        {isModuleExpanded && (
                          <div className="border-t border-gray-100 bg-gray-50/30">
                            <div className="p-6 space-y-4">
                              {weekSections.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">
                                  No topics found in this module
                                </p>
                              ) : (
                                weekSections.map(section => {
                                  const sectionResources = resourcesBySection[section.id] || [];
                                  const isTopicExpanded = expandedTopics.has(section.id);
                                  
                                  return (
                                    <div
                                      key={section.id}
                                      className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 overflow-hidden"
                                    >
                                      {/* Topic Header */}
                                      <div
                                        className="p-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                                        onClick={() => toggleTopic(section.id)}
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-green-100 rounded-xl">
                                              {isTopicExpanded ? (
                                                <ChevronDown className="h-4 w-4 text-green-600" />
                                              ) : (
                                                <ChevronRight className="h-4 w-4 text-green-600" />
                                              )}
                                            </div>
                                            <div>
                                              <h4 className="font-semibold text-gray-900">
                                                {section.name}
                                              </h4>
                                              <p className="text-sm text-gray-600">
                                                {sectionResources.length} resource{sectionResources.length !== 1 ? 's' : ''}
                                              </p>
                                            </div>
                                          </div>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              startCreate(section.id);
                                            }}
                                            className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 text-sm font-medium flex items-center space-x-2"
                                          >
                                            <Plus className="h-4 w-4" />
                                            <span>Add Resource</span>
                                          </button>
                                        </div>
                                      </div>

                                      {/* Resources within Topic */}
                                      {isTopicExpanded && (
                                        <div className="border-t border-gray-100 bg-white/30 p-4">
                                          {sectionResources.length === 0 ? (
                                            <div className="text-center py-8">
                                              <p className="text-gray-500 mb-4">No resources in this topic</p>
                                              <button
                                                onClick={() => startCreate(section.id)}
                                                className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 text-sm font-medium"
                                              >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add First Resource
                                              </button>
                                            </div>
                                          ) : (
                                            <div className="space-y-3">
                                              {sectionResources.map(resource => (
                                                <div
                                                  key={resource.id}
                                                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 hover:border-gray-300/50 transition-all duration-200"
                                                >
                                                  <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3 flex-1">
                                                      <div className="flex-shrink-0">
                                                        {getResourceTypeIcon(resource.type)}
                                                      </div>
                                                      <div className="flex-1 min-w-0">
                                                        <h5 className="font-medium text-gray-900 truncate">
                                                          {resource.title}
                                                        </h5>
                                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                          <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs">
                                                            {(resourceTypes || {})[resource.type]?.label || resource.type}
                                                          </span>
                                                          <span>Order: {resource.order}</span>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                      <a
                                                        href={resource.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                                        title="Open resource"
                                                      >
                                                        <ExternalLink className="h-4 w-4" />
                                                      </a>
                                                      <button
                                                        onClick={() => handleEdit(resource)}
                                                        className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                                        title="Edit resource"
                                                      >
                                                        <Edit className="h-4 w-4" />
                                                      </button>
                                                      <button
                                                        onClick={() => handleDelete(resource.id, resource.title)}
                                                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                                        title="Delete resource"
                                                      >
                                                        <Trash2 className="h-4 w-4" />
                                                      </button>
                                                    </div>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {(!isGrandPathfinder && leagues.length === 0) || (isGrandPathfinder && weeks.length === 0) ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {!isGrandPathfinder ? 'No leagues found' : 'No modules found'}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Create some {!isGrandPathfinder ? 'leagues and weeks' : 'modules'} first to manage resources
            </p>
          </div>
        ) : null}
      </div>
    </div>
  </div>
);
};

export default ResourceManagement;
