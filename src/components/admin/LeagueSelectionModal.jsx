import React, { useState, useEffect } from 'react';
import { X, Check, Settings, Users, BarChart3, FileEdit, Info } from 'lucide-react';

const LeagueSelectionModal = ({ 
  user, 
  targetRole, 
  leagues = [],
  loading = false,
  onConfirm, 
  onCancel
}) => {
  const [selectedLeagues, setSelectedLeagues] = useState([]);
  const [permissions, setPermissions] = useState({
    canManageUsers: false,
    canViewAnalytics: true,
    canCreateContent: false
  });

  // Reset state when modal opens
  useEffect(() => {
    if (user) {
      setSelectedLeagues([]);
      setPermissions({
        canManageUsers: false,
        canViewAnalytics: true,
        canCreateContent: false
      });
    }
  }, [user]);

  const handleLeagueToggle = (leagueId) => {
    setSelectedLeagues(prev => 
      prev.includes(leagueId) 
        ? prev.filter(id => id !== leagueId)
        : [...prev, leagueId]
    );
  };

  const handlePermissionChange = (permission, value) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: value
    }));
  };

  const handleConfirm = () => {
    const leagueAssignments = selectedLeagues.map(leagueId => ({
      leagueId,
      permissions: { ...permissions }
    }));
    
    console.log('League assignments being sent:', leagueAssignments);
    onConfirm(user.id, targetRole, leagueAssignments);
  };

  const isValidSelection = () => {
    // For pathfinder roles, at least one league should be selected
    if ((targetRole === 'PATHFINDER' || targetRole === 'CHIEF_PATHFINDER') && selectedLeagues.length === 0) {
      return false;
    }
    // At least one permission should be granted
    return Object.values(permissions).some(perm => perm === true);
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Promote to {targetRole === 'PATHFINDER' ? 'Pathfinder' : 'Chief Pathfinder'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {user?.name} ({user?.email})
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Role Info */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">Role Assignment</h3>
                <p className="text-sm text-blue-700 mt-1">
                  {targetRole === 'PATHFINDER' 
                    ? 'Pathfinders have access to assigned leagues and can perform actions based on granted permissions.'
                    : 'Chief Pathfinders have elevated access within assigned leagues and can manage other pathfinders.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* League Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Select Leagues</h3>
            <p className="text-sm text-gray-600 mb-4">
              Choose which leagues this {targetRole.toLowerCase()} will have access to:
            </p>
            
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {!Array.isArray(leagues) || leagues.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  {!Array.isArray(leagues) ? 'Loading leagues...' : 'No leagues available'}
                </p>
              ) : (
                leagues.map(league => (
                  <label key={league.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedLeagues.includes(league.id)}
                      onChange={() => handleLeagueToggle(league.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{league.name}</p>
                      {league.description && (
                        <p className="text-sm text-gray-500">{league.description}</p>
                      )}
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Permissions */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Permissions</h3>
            <p className="text-sm text-gray-600 mb-4">
              Set the permissions for all selected leagues:
            </p>
            
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={permissions.canManageUsers}
                  onChange={(e) => handlePermissionChange('canManageUsers', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Users className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Manage Users</p>
                  <p className="text-sm text-gray-600">Can manage users within assigned leagues</p>
                </div>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={permissions.canViewAnalytics}
                  onChange={(e) => handlePermissionChange('canViewAnalytics', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">View Analytics</p>
                  <p className="text-sm text-gray-600">Can view analytics for assigned leagues</p>
                </div>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={permissions.canCreateContent}
                  onChange={(e) => handlePermissionChange('canCreateContent', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <FileEdit className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Create Content</p>
                  <p className="text-sm text-gray-600">Can create/edit content in assigned leagues</p>
                </div>
              </label>
            </div>
          </div>

          {/* Preview */}
          {selectedLeagues.length > 0 && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Assignment Preview</h4>
              <p className="text-sm text-green-700">
                <strong>{user?.name}</strong> will be promoted to <strong>{targetRole}</strong> with access to{' '}
                <strong>{selectedLeagues.length}</strong> league{selectedLeagues.length !== 1 ? 's' : ''} and{' '}
                <strong>{Object.values(permissions).filter(Boolean).length}</strong> permission{Object.values(permissions).filter(Boolean).length !== 1 ? 's' : ''}.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {!isValidSelection() && (
              <p className="text-red-600">
                Please select at least one league and one permission.
              </p>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!isValidSelection() || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              <span>Promote & Assign</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeagueSelectionModal;
