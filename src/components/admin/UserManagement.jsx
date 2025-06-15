import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Search, 
  Eye, 
  Linkedin,
  Github,
  BarChart3,
  ExternalLink,
  Calendar,
  Mail,
  Shield,
  Star,
  Crown,
  Sparkles,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';
import { getUserAvatarUrl } from '../../utils/avatarService.jsx';

const UserManagement = ({ 
  users, 
  onApproveUser, 
  onUpdateRole, 
  onUpdateStatus,
  loading
}) => {
  const [selectedRole, setSelectedRole] = useState({});
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [userDetailModal, setUserDetailModal] = useState(null);
  
  const handleRoleChange = (userId, role) => {
    setSelectedRole({
      ...selectedRole,
      [userId]: role
    });
  };
  
  const handleUpdateRole = (userId) => {
    const newRole = selectedRole[userId];
    if (newRole) {
      onUpdateRole(userId, newRole);
      // Clear the selected role after update
      setSelectedRole({
        ...selectedRole,
        [userId]: undefined
      });
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  // Enhanced filter and search logic
  const filteredAndSortedUsers = users
    .filter(user => {
      // Never show GRAND_PATHFINDER users in the list
      if (user.role === 'GRAND_PATHFINDER') return false;
      if (statusFilter !== 'ALL' && user.status !== statusFilter) return false;
      if (roleFilter !== 'ALL' && user.role !== roleFilter) return false;
      
      // Search functionality
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.twitterHandle?.toLowerCase().includes(searchLower) ||
          user.githubUsername?.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'name') {
        aValue = a.name || '';
        bValue = b.name || '';
      } else if (sortBy === 'createdAt') {
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Use filtered and sorted users
  const filteredUsers = filteredAndSortedUsers;

  // Get user counts by status (excluding GRAND_PATHFINDER users)
  const eligibleUsers = users.filter(u => u.role !== 'GRAND_PATHFINDER');
  const userCounts = {
    total: eligibleUsers.length,
    active: eligibleUsers.filter(u => u.status === 'ACTIVE').length,
    pending: eligibleUsers.filter(u => u.status === 'PENDING').length,
    suspended: eligibleUsers.filter(u => u.status === 'SUSPENDED').length
  };

  // Role display helper
  const getRoleInfo = (role) => {
    switch (role) {
      case 'PIONEER':
        return { icon: Star, label: 'Pioneer', color: 'text-blue-600 bg-blue-50 border-blue-200' };
      case 'LUMINARY':
        return { icon: Sparkles, label: 'Luminary', color: 'text-purple-600 bg-purple-50 border-purple-200' };
      case 'PATHFINDER':
        return { icon: Shield, label: 'Pathfinder', color: 'text-green-600 bg-green-50 border-green-200' };
      case 'CHIEF_PATHFINDER':
        return { icon: Crown, label: 'Chief Pathfinder', color: 'text-orange-600 bg-orange-50 border-orange-200' };
      case 'GRAND_PATHFINDER':
        return { icon: Crown, label: 'Grand Pathfinder', color: 'text-red-600 bg-red-50 border-red-200' };
      default:
        return { icon: Users, label: role, color: 'text-gray-600 bg-gray-50 border-gray-200' };
    }
  };
  
  if (eligibleUsers.length === 0 && !loading) {
    return (
      <div className="text-center py-16">
        <Users className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
        <p className="text-gray-500">No users have been registered yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">User Management</h3>
              <p className="text-gray-600">
                Manage user roles, status, and permissions across the platform
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">{userCounts.active} Active</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-yellow-700">{userCounts.pending} Pending</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg border border-red-200">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-red-700">{userCounts.suspended} Suspended</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                <Users size={14} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{userCounts.total} Total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Filters and Search */}
        <div className="p-4 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name, email, or social handles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-text text-sm"
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm cursor-pointer transition-colors"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
              
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm cursor-pointer transition-colors"
              >
                <option value="ALL">All Roles</option>
                <option value="PIONEER">Pioneer</option>
                <option value="PATHFINDER">Pathfinder</option>
                <option value="CHIEF_PATHFINDER">Chief Pathfinder</option>
                <option value="LUMINARY">Luminary</option>
              </select>
              
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                  setRoleFilter('ALL');
                }}
                className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer text-sm font-medium"
              >
                Clear
              </button>
            </div>
          </div>
          
          <div className="mt-3">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{filteredUsers.length}</span> of <span className="font-medium">{eligibleUsers.length}</span> users
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header with Sorting */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    User Details
                    <ChevronDown size={14} className={`transition-transform ${sortBy === 'name' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role & Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Social Profiles
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-1">
                    Joined
                    <ChevronDown size={14} className={`transition-transform ${sortBy === 'createdAt' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400 mr-3" />
                      <span className="text-gray-500">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p>No users found matching your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const roleInfo = getRoleInfo(user.role);
                  const RoleIcon = roleInfo.icon;
                  
                  return (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                      {/* User Details */}
                      <td className="px-6 py-4">
                        <div className="flex items-center cursor-pointer" onClick={() => setUserDetailModal(user)}>
                          <div className="flex-shrink-0 h-12 w-12 relative">
                            <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                              <img
                                src={getUserAvatarUrl(user, 'avataaars', 48)}
                                alt={`${user.name} avatar`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  const fallbackDiv = e.target.nextSibling;
                                  if (fallbackDiv) {
                                    fallbackDiv.style.display = 'flex';
                                  }
                                }}
                                onLoad={(e) => {
                                  const fallbackDiv = e.target.nextSibling;
                                  if (fallbackDiv) {
                                    fallbackDiv.style.display = 'none';
                                  }
                                }}
                              />
                              <div className="absolute inset-0 bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700 rounded-full" style={{ display: 'none' }}>
                                {user.name?.charAt(0).toUpperCase() || 'U'}
                              </div>
                            </div>
                            {/* Online Status Indicator */}
                            <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${user.status === 'ACTIVE' ? 'bg-green-400' : 'bg-gray-400'} shadow-sm`}></div>
                          </div>
                          <div className="ml-4 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-gray-900 truncate hover:text-blue-600 transition-colors">
                                {user.name}
                              </p>
                              {user.status === 'ACTIVE' && (
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Mail size={12} className="text-gray-400" />
                              <p className="text-sm text-gray-600 truncate">{user.email}</p>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role & Status */}
                      <td className="px-6 py-4">
                        <div className="space-y-3">
                          {/* Role Selector */}
                          <div className="flex items-center gap-2">
                            <select 
                              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-colors bg-white"
                              value={selectedRole[user.id] || user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              disabled={user.status !== 'ACTIVE'}
                            >
                              <option value="PIONEER">Pioneer</option>
                              <option value="PATHFINDER">Pathfinder</option>
                              <option value="CHIEF_PATHFINDER">Chief Pathfinder</option>
                              <option value="LUMINARY">Luminary</option>
                            </select>
                            {selectedRole[user.id] && selectedRole[user.id] !== user.role && (
                              <button 
                                onClick={() => handleUpdateRole(user.id)}
                                className="px-3 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer font-medium shadow-sm"
                              >
                                Update
                              </button>
                            )}
                          </div>
                          
                          {/* Status Badge */}
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${
                              user.status === 'ACTIVE' 
                                ? 'bg-green-50 text-green-700 border-green-200' 
                                : user.status === 'PENDING'
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                              <RoleIcon size={12} />
                              {user.status}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Social Profiles */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {user.twitterHandle && (
                            <a
                              href={`https://twitter.com/${user.twitterHandle}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 hover:text-blue-700 transition-colors cursor-pointer group/social"
                              title={`@${user.twitterHandle}`}
                            >
                              <FaXTwitter size={14} className="group-hover/social:scale-110 transition-transform" />
                            </a>
                          )}
                          
                          {user.linkedinUrl && (
                            <a
                              href={user.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 hover:text-blue-700 transition-colors cursor-pointer group/social"
                              title="LinkedIn Profile"
                            >
                              <Linkedin size={14} className="group-hover/social:scale-110 transition-transform" />
                            </a>
                          )}
                          
                          {user.githubUsername && (
                            <a
                              href={`https://github.com/${user.githubUsername}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-700 transition-colors cursor-pointer group/social"
                              title={`@${user.githubUsername}`}
                            >
                              <Github size={14} className="group-hover/social:scale-110 transition-transform" />
                            </a>
                          )}
                          
                          {user.kaggleUsername && (
                            <a
                              href={`https://kaggle.com/${user.kaggleUsername}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-lg bg-cyan-50 hover:bg-cyan-100 flex items-center justify-center text-cyan-600 hover:text-cyan-700 transition-colors cursor-pointer group/social"
                              title={`Kaggle: ${user.kaggleUsername}`}
                            >
                              <BarChart3 size={14} className="group-hover/social:scale-110 transition-transform" />
                            </a>
                          )}
                          
                          {/* No social profiles indicator */}
                          {!user.twitterHandle && !user.linkedinUrl && !user.githubUsername && !user.kaggleUsername && (
                            <span className="text-xs text-gray-400 italic">No profiles</span>
                          )}
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={14} className="text-gray-400" />
                          <span>
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }) : 'N/A'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {user.status === 'PENDING' && (
                            <button 
                              onClick={() => onApproveUser(user.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors cursor-pointer shadow-sm"
                            >
                              <UserCheck size={12} />
                              Approve
                            </button>
                          )}
                          
                          {user.status !== 'PENDING' && (
                            <button 
                              onClick={() => onUpdateStatus(
                                user.id, 
                                user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
                              )}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer shadow-sm ${
                                user.status === 'ACTIVE' 
                                  ? 'text-white bg-red-600 hover:bg-red-700' 
                                  : 'text-white bg-green-600 hover:bg-green-700'
                              }`}
                            >
                              {user.status === 'ACTIVE' ? (
                                <>
                                  <UserX size={12} />
                                  Suspend
                                </>
                              ) : (
                                <>
                                  <UserCheck size={12} />
                                  Activate
                                </>
                              )}
                            </button>
                          )}
                          
                          {/* More Actions Dropdown */}
                          <div className="relative">
                            <button
                              onClick={() => setUserDetailModal(user)}
                              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {userDetailModal && (
        <UserDetailModal 
          user={userDetailModal} 
          onClose={() => setUserDetailModal(null)}
          onUpdateStatus={onUpdateStatus}
          onApproveUser={onApproveUser}
        />
      )}
    </div>
  );
};

// User Detail Modal Component
const UserDetailModal = ({ user, onClose, onUpdateStatus, onApproveUser }) => {
  const getRoleInfo = (role) => {
    switch (role) {
      case 'PIONEER':
        return { icon: Star, label: 'Pioneer', color: 'text-blue-600 bg-blue-50 border-blue-200' };
      case 'LUMINARY':
        return { icon: Sparkles, label: 'Luminary', color: 'text-purple-600 bg-purple-50 border-purple-200' };
      case 'PATHFINDER':
        return { icon: Shield, label: 'Pathfinder', color: 'text-green-600 bg-green-50 border-green-200' };
      case 'CHIEF_PATHFINDER':
        return { icon: Crown, label: 'Chief Pathfinder', color: 'text-orange-600 bg-orange-50 border-orange-200' };
      case 'GRAND_PATHFINDER':
        return { icon: Crown, label: 'Grand Pathfinder', color: 'text-red-600 bg-red-50 border-red-200' };
      default:
        return { icon: Users, label: role, color: 'text-gray-600 bg-gray-50 border-gray-200' };
    }
  };

  const roleInfo = getRoleInfo(user.role);
  const RoleIcon = roleInfo.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
              <img
                src={getUserAvatarUrl(user, 'avataaars', 64)}
                alt={`${user.name} avatar`}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <span className="sr-only">Close</span>
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* User Status & Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${
                    user.status === 'ACTIVE' 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : user.status === 'PENDING'
                      ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      user.status === 'ACTIVE' ? 'bg-green-500' : 
                      user.status === 'PENDING' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    {user.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Role</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${roleInfo.color}`}>
                    <RoleIcon size={12} />
                    {roleInfo.label}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Member since</span>
                  <span className="text-sm font-medium text-gray-900">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    }) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Media Profiles */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Social Profiles</h3>
              
              <div className="space-y-3">
                {user.twitterHandle ? (
                  <a
                    href={`https://twitter.com/${user.twitterHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                        <FaXTwitter size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">X (Twitter)</p>
                        <p className="text-xs text-gray-600">@{user.twitterHandle}</p>
                      </div>
                    </div>
                    <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-600" />
                  </a>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-300 flex items-center justify-center">
                        <FaXTwitter size={16} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">X (Twitter)</p>
                        <p className="text-xs text-gray-500">Not connected</p>
                      </div>
                    </div>
                  </div>
                )}

                {user.linkedinUrl ? (
                  <a
                    href={user.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Linkedin size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">LinkedIn</p>
                        <p className="text-xs text-gray-600">Professional profile</p>
                      </div>
                    </div>
                    <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-600" />
                  </a>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-300 flex items-center justify-center">
                        <Linkedin size={16} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">LinkedIn</p>
                        <p className="text-xs text-gray-500">Not connected</p>
                      </div>
                    </div>
                  </div>
                )}

                {user.githubUsername ? (
                  <a
                    href={`https://github.com/${user.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                        <Github size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">GitHub</p>
                        <p className="text-xs text-gray-600">@{user.githubUsername}</p>
                      </div>
                    </div>
                    <ExternalLink size={16} className="text-gray-400 group-hover:text-gray-600" />
                  </a>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-300 flex items-center justify-center">
                        <Github size={16} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">GitHub</p>
                        <p className="text-xs text-gray-500">Not connected</p>
                      </div>
                    </div>
                  </div>
                )}

                {user.kaggleUsername ? (
                  <a
                    href={`https://kaggle.com/${user.kaggleUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
                        <BarChart3 size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Kaggle</p>
                        <p className="text-xs text-gray-600">{user.kaggleUsername}</p>
                      </div>
                    </div>
                    <ExternalLink size={16} className="text-gray-400 group-hover:text-cyan-600" />
                  </a>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-300 flex items-center justify-center">
                        <BarChart3 size={16} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Kaggle</p>
                        <p className="text-xs text-gray-500">Not connected</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            {user.status === 'PENDING' && (
              <button 
                onClick={() => {
                  onApproveUser?.(user.id);
                  onClose();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors cursor-pointer"
              >
                <UserCheck size={16} />
                Approve User
              </button>
            )}
            
            {user.status !== 'PENDING' && (
              <button 
                onClick={() => {
                  onUpdateStatus?.(user.id, user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE');
                  onClose();
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  user.status === 'ACTIVE' 
                    ? 'text-white bg-red-600 hover:bg-red-700' 
                    : 'text-white bg-green-600 hover:bg-green-700'
                }`}
              >
                {user.status === 'ACTIVE' ? (
                  <>
                    <UserX size={16} />
                    Suspend User
                  </>
                ) : (
                  <>
                    <UserCheck size={16} />
                    Activate User
                  </>
                )}
              </button>
            )}
            
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
