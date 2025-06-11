import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  Users, 
  FileText, 
  Edit3, 
  Trash2, 
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import AdminService from '../../utils/adminService';

const AssignmentManagement = ({ leagues }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    leagueId: '',
    dueDate: ''
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getAllAssignments();
      setAssignments(data.assignments || []);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError(`Failed to load assignments: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    
    if (!newAssignment.title || !newAssignment.description || !newAssignment.leagueId) {
      setError('Title, description, and league are required');
      return;
    }

    try {
      const assignmentData = {
        ...newAssignment,
        dueDate: newAssignment.dueDate ? new Date(newAssignment.dueDate).toISOString() : null
      };

      await AdminService.createAssignment(assignmentData);
      setNewAssignment({ title: '', description: '', leagueId: '', dueDate: '' });
      setShowCreateForm(false);
      setError(null);
      await fetchAssignments();
    } catch (err) {
      console.error('Error creating assignment:', err);
      setError(`Failed to create assignment: ${err.message}`);
    }
  };

  const handleViewSubmissions = async (assignment) => {
    try {
      const data = await AdminService.getAssignmentByLeague(assignment.league.id);
      setSelectedAssignment(data);
      setShowSubmissions(true);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError(`Failed to load submissions: ${err.message}`);
    }
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setNewAssignment({
      title: assignment.title,
      description: assignment.description,
      leagueId: assignment.league.id,
      dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString().slice(0, 16) : ''
    });
    setShowEditForm(true);
  };

  const handleUpdateAssignment = async (e) => {
    e.preventDefault();
    
    if (!newAssignment.title || !newAssignment.description || !newAssignment.leagueId) {
      setError('Title, description, and league are required');
      return;
    }

    try {
      const assignmentData = {
        ...newAssignment,
        dueDate: newAssignment.dueDate ? new Date(newAssignment.dueDate).toISOString() : null
      };

      await AdminService.updateAssignment(editingAssignment.id, assignmentData);
      setNewAssignment({ title: '', description: '', leagueId: '', dueDate: '' });
      setShowEditForm(false);
      setEditingAssignment(null);
      setError(null);
      await fetchAssignments();
    } catch (err) {
      console.error('Error updating assignment:', err);
      setError(`Failed to update assignment: ${err.message}`);
    }
  };

  const handleDeleteAssignment = async (assignment) => {
    if (!window.confirm(`Are you sure you want to delete the assignment "${assignment.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await AdminService.deleteAssignment(assignment.id);
      setError(null);
      await fetchAssignments();
    } catch (err) {
      console.error('Error deleting assignment:', err);
      setError(`Failed to delete assignment: ${err.message}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return 'none';
    const now = new Date();
    const due = new Date(dueDate);
    const timeDiff = due - now;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return 'overdue';
    if (daysDiff <= 3) return 'urgent';
    if (daysDiff <= 7) return 'soon';
    return 'normal';
  };

  const renderCreateForm = () => (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Assignment</h3>
        
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          {/* ...existing form fields... */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={newAssignment.title}
              onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Assignment title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              League *
            </label>
            <select
              value={newAssignment.leagueId}
              onChange={(e) => setNewAssignment({ ...newAssignment, leagueId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a league</option>
              {leagues.map(league => (
                <option key={league.id} value={league.id}>
                  {league.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={newAssignment.description}
              onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Assignment description and requirements"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date (Optional)
            </label>
            <input
              type="datetime-local"
              value={newAssignment.dueDate}
              onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowCreateForm(false);
                setNewAssignment({ title: '', description: '', leagueId: '', dueDate: '' });
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderEditForm = () => (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Assignment</h3>
        
        <form onSubmit={handleUpdateAssignment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={newAssignment.title}
              onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Assignment title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              League *
            </label>
            <select
              value={newAssignment.leagueId}
              onChange={(e) => setNewAssignment({ ...newAssignment, leagueId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a league</option>
              {leagues.map(league => (
                <option key={league.id} value={league.id}>
                  {league.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={newAssignment.description}
              onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Assignment description and requirements"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date (Optional)
            </label>
            <input
              type="datetime-local"
              value={newAssignment.dueDate}
              onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowEditForm(false);
                setEditingAssignment(null);
                setNewAssignment({ title: '', description: '', leagueId: '', dueDate: '' });
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Update Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderSubmissionsModal = () => (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedAssignment?.title} - Submissions
            </h3>
            <p className="text-sm text-gray-600">
              {selectedAssignment?.league?.name} League
            </p>
          </div>
          <button
            onClick={() => setShowSubmissions(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {selectedAssignment?.submissions?.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions yet</h3>
            <p className="mt-1 text-sm text-gray-500">Students haven't submitted any assignments yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedAssignment?.submissions?.map((submission) => (
              <div key={submission.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{submission.user.name}</h4>
                    <p className="text-sm text-gray-600">{submission.user.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Submitted
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(submission.submittedAt)}
                    </p>
                  </div>
                </div>

                {submission.content && (
                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Content:</h5>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {submission.content}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {submission.fileUrl && (
                    <a
                      href={submission.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md hover:bg-blue-200"
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      File
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                  {submission.githubUrl && (
                    <a
                      href={submission.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md hover:bg-gray-200"
                    >
                      GitHub
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                  {submission.liveUrl && (
                    <a
                      href={submission.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md hover:bg-green-200"
                    >
                      Live Demo
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

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
          <h2 className="text-xl font-semibold text-gray-900">Assignment Management</h2>
          <p className="text-sm text-gray-600">Create and manage assignments for leagues</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Assignment
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Assignments List */}
      {assignments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new assignment.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {assignments.map((assignment) => {
            const dueDateStatus = getDueDateStatus(assignment.dueDate);
            
            return (
              <div key={assignment.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{assignment.league.name} League</p>
                    <p className="text-sm text-gray-700">{assignment.description}</p>
                  </div>
                  
                  <div className="ml-4 text-right">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Users className="w-4 h-4 mr-1" />
                      {assignment._count?.submissions || 0} submissions
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewSubmissions(assignment)}
                        className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleEditAssignment(assignment)}
                        className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAssignment(assignment)}
                        className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center text-sm ${
                      dueDateStatus === 'overdue' ? 'text-red-600' :
                      dueDateStatus === 'urgent' ? 'text-orange-600' :
                      dueDateStatus === 'soon' ? 'text-yellow-600' :
                      'text-gray-600'
                    }`}>
                      <Clock className="w-4 h-4 mr-1" />
                      Due: {formatDate(assignment.dueDate)}
                    </div>
                    
                    {dueDateStatus === 'overdue' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Overdue
                      </span>
                    )}
                    {dueDateStatus === 'urgent' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Due Soon
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Created: {formatDate(assignment.createdAt)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {showCreateForm && renderCreateForm()}
      {showEditForm && renderEditForm()}
      {showSubmissions && renderSubmissionsModal()}
    </div>
  );
};

export default AssignmentManagement;
