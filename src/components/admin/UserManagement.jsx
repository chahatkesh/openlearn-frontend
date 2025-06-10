import React, { useState } from 'react';

const UserManagement = ({ 
  users, 
  onApproveUser, 
  onUpdateRole, 
  onUpdateStatus,
  loading
}) => {
  const [selectedRole, setSelectedRole] = useState({});
  
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
    }
  };
  
  if (users.length === 0 && !loading) {
    return <div className="text-center py-8 text-gray-500">No users found</div>;
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                  <select 
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    value={selectedRole[user.id] || user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={user.status !== 'ACTIVE'}
                  >
                    <option value="PIONEER">PIONEER</option>
                    <option value="PATHFINDER">PATHFINDER</option>
                    <option value="CHIEF_PATHFINDER">CHIEF_PATHFINDER</option>
                    <option value="GRAND_PATHFINDER">GRAND_PATHFINDER</option>
                    <option value="LUMINARY">LUMINARY</option>
                  </select>
                  {selectedRole[user.id] && selectedRole[user.id] !== user.role && (
                    <button 
                      onClick={() => handleUpdateRole(user.id)}
                      className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                    >
                      Update
                    </button>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                    user.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {user.status === 'PENDING' && (
                  <button 
                    onClick={() => onApproveUser(user.id)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Approve
                  </button>
                )}
                <button 
                  onClick={() => onUpdateStatus(
                    user.id, 
                    user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
                  )}
                  className={`${
                    user.status === 'ACTIVE' ? 'text-red-600 hover:text-red-900' : 
                    'text-green-600 hover:text-green-900'
                  }`}
                >
                  {user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
