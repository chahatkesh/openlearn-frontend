import React, { useState, useEffect, useCallback, useContext } from 'react';
import ResourceManagement from '../../components/features/admin/ResourceManagement';
import AdminService from "../../utils/api/adminService";
import { AuthContext } from '../../context/AuthContextProvider';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api`;

const AdminResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [sections, setSections] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState('');
  const [selectedWeekId, setSelectedWeekId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  // Resource types definition
  const resourceTypes = {
    VIDEO: { 
      icon: '🎥', 
      label: 'Video', 
      color: 'text-red-600', 
      bg: 'bg-red-50' 
    },
    ARTICLE: { 
      icon: '📄', 
      label: 'Article', 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    EXTERNAL_LINK: { 
      icon: '🔗', 
      label: 'External Link', 
      color: 'text-green-600', 
      bg: 'bg-green-50' 
    },
    BLOG: { 
      icon: '📝', 
      label: 'Blog', 
      color: 'text-purple-600', 
      bg: 'bg-purple-50' 
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Grand Pathfinder has access to all data
      const isGrandPathfinder = user?.role === 'GRAND_PATHFINDER';
      
      let resourcesData, sectionsData, weeksData, leaguesData;
      
      if (isGrandPathfinder) {
        // Grand Pathfinder can access all data
        [resourcesData, sectionsData, weeksData, leaguesData] = await Promise.all([
          AdminService.getAllResources(),
          AdminService.getAllSectionsComplete(),
          AdminService.getAllWeeks(),
          AdminService.getAllLeagues()
        ]);
      } else {
        // Get user's pathfinder scopes to determine accessible leagues
        const accessibleLeagueIds = user?.pathfinderScopes?.map(scope => scope.leagueId) || [];
        
        if (accessibleLeagueIds.length > 0) {
          // Fetch weeks for each accessible league
          const weeksPromises = accessibleLeagueIds.map(leagueId => 
            AdminService.getWeeksByLeague(leagueId)
          );
          const weeksResults = await Promise.all(weeksPromises);
          
          // Combine all weeks from accessible leagues
          const allWeeks = weeksResults.flatMap(result => result.weeks || []);
          weeksData = { weeks: allWeeks };
          
          // Get accessible week IDs for filtering sections and resources
          const accessibleWeekIds = allWeeks.map(week => week.id);
          
          // Fetch all sections but filter to only accessible ones
          const allSectionsData = await AdminService.getAllSectionsComplete();
          const accessibleSections = allSectionsData.sections?.filter(section => 
            accessibleWeekIds.includes(section.weekId)
          ) || [];
          sectionsData = { sections: accessibleSections };
          
          // Get accessible section IDs for filtering resources
          const accessibleSectionIds = accessibleSections.map(section => section.id);
          
          // Fetch all resources but filter to only accessible ones
          const allResourcesData = await AdminService.getAllResources();
          const accessibleResources = allResourcesData.resources?.filter(resource => 
            accessibleSectionIds.includes(resource.sectionId)
          ) || [];
          resourcesData = { resources: accessibleResources };
          
          // Fetch all leagues but filter to only accessible ones
          const allLeaguesData = await AdminService.getAllLeagues();
          const accessibleLeagues = allLeaguesData.leagues?.filter(league => 
            accessibleLeagueIds.includes(league.id)
          ) || [];
          leaguesData = { leagues: accessibleLeagues };
        } else {
          // If no pathfinder scopes, return empty data
          resourcesData = { resources: [] };
          sectionsData = { sections: [] };
          weeksData = { weeks: [] };
          leaguesData = { leagues: [] };
        }
      }
      
      setResources(resourcesData.resources || []);
      setSections(sectionsData.sections || []);
      setWeeks(weeksData.weeks || []);
      setLeagues(leaguesData.leagues || []);
    } catch (err) {
      console.error('Error fetching resources data:', err);
      setError(`Failed to load resources: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [fetchData, user]);

  const handleSelectLeague = (leagueId) => {
    setSelectedLeagueId(leagueId);
    // Reset dependent filters when league changes
    setSelectedWeekId('');
    // Keep section filter but don't reset it since we're not using it for filtering
  };

  const handleSelectWeek = (weekId) => {
    setSelectedWeekId(weekId);
    // Don't reset section since we're not using section filtering
  };

  const handleCreateResource = async (resource) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/sections/${resource.sectionId}/resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: resource.title,
          url: resource.url,
          type: resource.type,
          order: resource.order
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Add the new resource to the list
        setResources([...resources, result.data]);
      } else {
        throw new Error(result.error || 'Failed to create resource');
      }
    } catch (err) {
      console.error('Error creating resource:', err);
      setError(`Failed to create resource: ${err.message}`);
    }
  };

  const handleUpdateResource = async (resourceId, updatedResource) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/resources/${resourceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedResource)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update the resource in the list
        setResources(resources.map(resource => 
          resource.id === resourceId ? result.data : resource
        ));
      } else {
        throw new Error(result.error || 'Failed to update resource');
      }
    } catch (err) {
      console.error('Error updating resource:', err);
      setError(`Failed to update resource: ${err.message}`);
    }
  };

  const handleDeleteResource = async (resourceId) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/resources/${resourceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Remove the resource from the list
        setResources(resources.filter(resource => resource.id !== resourceId));
      } else {
        throw new Error(result.error || 'Failed to delete resource');
      }
    } catch (err) {
      console.error('Error deleting resource:', err);
      setError(`Failed to delete resource: ${err.message}`);
    }
  };

  const handleReorderResources = async (sectionId, resourceOrders) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/sections/${sectionId}/resources/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ resourceOrders })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update the resources in the list with new orders
        const updatedResourcesMap = new Map(result.data.map(r => [r.id, r]));
        setResources(resources.map(resource => 
          updatedResourcesMap.has(resource.id) ? updatedResourcesMap.get(resource.id) : resource
        ));
      } else {
        throw new Error(result.error || 'Failed to reorder resources');
      }
    } catch (err) {
      console.error('Error reordering resources:', err);
      setError(`Failed to reorder resources: ${err.message}`);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !user) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <ResourceManagement
      user={user}
      resources={resources}
      sections={sections}
      weeks={weeks}
      leagues={leagues}
      resourceTypes={resourceTypes}
      isGrandPathfinder={user?.role === 'GRAND_PATHFINDER'}
      onCreateResource={handleCreateResource}
      onUpdateResource={handleUpdateResource}
      onDeleteResource={handleDeleteResource}
      onReorderResources={handleReorderResources}
      selectedLeagueId={selectedLeagueId}
      selectedWeekId={selectedWeekId}
      onSelectLeague={handleSelectLeague}
      onSelectWeek={handleSelectWeek}
      loading={loading}
    />
  );
};

export default AdminResourcesPage;
