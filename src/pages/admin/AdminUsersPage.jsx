import React, { useState, useEffect, useCallback } from 'react';
import UserManagement from '../../components/admin/UserManagement';
import AdminService from '../../utils/adminService';

const AdminUsersPage = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const usersData = await AdminService.getAllUsers();
      setAllUsers(usersData.users || []);
    } catch (err) {
      console.error('Error fetching users data:', err);
      setError(`Failed to load users: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleApproveUser = async (userId) => {
    if (!window.confirm('Are you sure you want to approve this user?')) {
      return;
    }

    try {
      await AdminService.approveUser(userId);
      // Update the user status in the list
      setAllUsers(allUsers.map(user => 
        user.id === userId ? { ...user, status: 'ACTIVE' } : user
      ));
    } catch (err) {
      console.error('Error approving user:', err);
      setError(`Failed to approve user: ${err.message}`);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }

    try {
      await AdminService.updateUserRole(userId, newRole);
      // Update the user in the list
      setAllUsers(allUsers.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      console.error('Error updating user role:', err);
      setError(`Failed to update user role: ${err.message}`);
    }
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    const action = newStatus === 'SUSPENDED' ? 'suspend' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    try {
      await AdminService.updateUserStatus(userId, newStatus);
      // Update the user in the list
      setAllUsers(allUsers.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
    } catch (err) {
      console.error('Error updating user status:', err);
      setError(`Failed to update user status: ${err.message}`);
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

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <UserManagement
      users={allUsers}
      onApproveUser={handleApproveUser}
      onUpdateRole={handleUpdateRole}
      onUpdateStatus={handleUpdateStatus}
      loading={loading}
    />
  );
};

export default AdminUsersPage;
