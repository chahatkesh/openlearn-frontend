import React, { useState } from 'react';
import { Users, UserCheck, UserX, Filter } from 'lucide-react';

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

  // Filter users based on status and role, and exclude GRAND_PATHFINDER users
  const filteredUsers = users.filter(user => {
    // Never show GRAND_PATHFINDER users in the list
    if (user.role === 'GRAND_PATHFINDER') return false;
    if (statusFilter !== 'ALL' && user.status !== statusFilter) return false;
    if (roleFilter !== 'ALL' && user.role !== roleFilter) return false;
    return true;
  });

  // Get user counts by status (excluding GRAND_PATHFINDER users)
  const eligibleUsers = users.filter(u => u.role !== 'GRAND_PATHFINDER');
  const userCounts = {
    total: eligibleUsers.length,
    active: eligibleUsers.filter(u => u.status === 'ACTIVE').length,
    pending: eligibleUsers.filter(u => u.status === 'PENDING').length,
    suspended: eligibleUsers.filter(u => u.status === 'SUSPENDED').length
  };
  
  if (eligibleUsers.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
        <p className="mt-1 text-sm text-gray-500">No users have been registered yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="bg-white">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">User Management</h3>
            <p className="mt-1 text-sm text-gray-600">
              Manage user roles, status, and permissions
            </p>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {userCounts.active} Active
              </span>
            </div>
            <div className="flex items-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {userCounts.pending} Pending
              </span>
            </div>
            <div className="flex items-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {userCounts.suspended} Suspended
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm border-gray-300 rounded-md focus:ring-black focus:border-black"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="text-sm border-gray-300 rounded-md focus:ring-black focus:border-black"
              >
                <option value="ALL">All Roles</option>
                <option value="PIONEER">Pioneer</option>
                <option value="PATHFINDER">Pathfinder</option>
                <option value="CHIEF_PATHFINDER">Chief Pathfinder</option>
                <option value="LUMINARY">Luminary</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              Showing {filteredUsers.length} of {eligibleUsers.length} users
            </div>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <select 
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-black focus:border-black"
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
                          className="ml-2 text-xs text-blue-600 hover:text-blue-800 px-2 py-1 border border-blue-200 rounded hover:bg-blue-50"
                        >
                          Update
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs leading-5 font-semibold rounded-full 
                      ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                        user.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {user.status === 'PENDING' && (
                        <button 
                          onClick={() => onApproveUser(user.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <UserCheck className="h-3 w-3 mr-1" />
                          Approve
                        </button>
                      )}
                      {user.status !== 'PENDING' && (
                        <button 
                          onClick={() => onUpdateStatus(
                            user.id, 
                            user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
                          )}
                          className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            user.status === 'ACTIVE' 
                              ? 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                              : 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500'
                          }`}
                        >
                          {user.status === 'ACTIVE' ? (
                            <>
                              <UserX className="h-3 w-3 mr-1" />
                              Suspend
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-3 w-3 mr-1" />
                              Activate
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
