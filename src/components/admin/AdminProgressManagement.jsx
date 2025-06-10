import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  UserPlus,
  TrendingUp,
  Award,
  Calendar,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import ProgressService from '../../utils/progressService';

/**
 * Admin Progress Management Component
 * Allows Pathfinders+ to view and manage user progress across the platform
 */
const AdminProgressManagement = ({ user }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    cohortId: '',
    leagueId: '',
    userId: '',
    search: ''
  });
  const [pagination, setPagination] = useState({});
  const [cohorts, setCohorts] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());

  useEffect(() => {
    if (ProgressService.canViewOthersProgress(user)) {
      fetchEnrollments();
      fetchCohorts();
      fetchLeagues();
    }
  }, [user, filters.page, filters.limit, filters.cohortId, filters.leagueId, filters.userId]);

  const fetchEnrollments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await ProgressService.getAllEnrollments(filters);
      setEnrollments(data.enrollments || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error('Error fetching enrollments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCohorts = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cohorts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setCohorts(result.data.cohorts || []);
      }
    } catch (err) {
      console.error('Error fetching cohorts:', err);
    }
  };

  const fetchLeagues = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/leagues`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setLeagues(result.data.leagues || []);
      }
    } catch (err) {
      console.error('Error fetching leagues:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
      page: 1
    }));
  };

  const handleEnrollUser = async (userId, cohortId, leagueId) => {
    try {
      await ProgressService.enrollUser(cohortId, leagueId, userId);
      alert('User enrolled successfully!');
      fetchEnrollments();
    } catch (err) {
      console.error('Error enrolling user:', err);
      alert(`Enrollment failed: ${err.message}`);
    }
  };

  const handleViewUserProgress = async (userId) => {
    try {
      const data = await ProgressService.getUserDashboard(userId);
      setSelectedEnrollment(data);
    } catch (err) {
      console.error('Error fetching user progress:', err);
      alert(`Failed to load user progress: ${err.message}`);
    }
  };

  const toggleRowExpansion = (enrollmentId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(enrollmentId)) {
      newExpanded.delete(enrollmentId);
    } else {
      newExpanded.add(enrollmentId);
    }
    setExpandedRows(newExpanded);
  };

  const exportData = () => {
    const csvContent = [
      ['User Name', 'Email', 'Cohort', 'League', 'Progress %', 'Completed Sections', 'Total Sections', 'Enrolled Date'].join(','),
      ...enrollments.map(enrollment => [
        enrollment.user.name,
        enrollment.user.email,
        enrollment.cohort.name,
        enrollment.league.name,
        enrollment.progress.progressPercentage,
        enrollment.progress.completedSections,
        enrollment.progress.totalSections,
        new Date(enrollment.enrolledAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `openlearn-progress-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!ProgressService.canViewOthersProgress(user)) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8">
          <Users size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
          <p className="text-gray-600">You don't have permission to view admin progress management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="mr-2 text-[#FFDE59]" size={24} />
            Progress Management
          </h1>
          <button
            onClick={exportData}
            className="flex items-center bg-[#FFDE59] text-gray-900 px-4 py-2 rounded-lg hover:bg-[#FFD700] transition-colors"
          >
            <Download size={16} className="mr-2" />
            Export Data
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-transparent"
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* Cohort Filter */}
          <select
            value={filters.cohortId}
            onChange={(e) => handleFilterChange('cohortId', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-transparent"
          >
            <option value="">All Cohorts</option>
            {cohorts.map(cohort => (
              <option key={cohort.id} value={cohort.id}>{cohort.name}</option>
            ))}
          </select>

          {/* League Filter */}
          <select
            value={filters.leagueId}
            onChange={(e) => handleFilterChange('leagueId', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-transparent"
          >
            <option value="">All Leagues</option>
            {leagues.map(league => (
              <option key={league.id} value={league.id}>{league.name}</option>
            ))}
          </select>

          {/* Items per page */}
          <select
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-transparent"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{pagination.total || 0}</div>
            <div className="text-sm text-gray-600">Total Enrollments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {enrollments.filter(e => e.progress.progressPercentage > 0).length}
            </div>
            <div className="text-sm text-gray-600">Active Learners</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {enrollments.filter(e => e.progress.progressPercentage === 100).length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#FFDE59]">
              {enrollments.length > 0 
                ? Math.round(enrollments.reduce((sum, e) => sum + e.progress.progressPercentage, 0) / enrollments.length)
                : 0}%
            </div>
            <div className="text-sm text-gray-600">Avg Progress</div>
          </div>
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFDE59] mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading enrollments...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchEnrollments}
              className="bg-[#FFDE59] text-gray-900 px-4 py-2 rounded-lg hover:bg-[#FFD700] transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="p-8 text-center">
            <Users size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No enrollments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cohort/League
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrolled
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enrollments.map((enrollment) => (
                  <React.Fragment key={enrollment.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-[#FFDE59] rounded-full flex items-center justify-center text-gray-900 font-bold mr-3">
                            {enrollment.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {enrollment.user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {enrollment.user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {enrollment.cohort.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {enrollment.league.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 mr-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{enrollment.progress.progressPercentage}%</span>
                              <span className="text-gray-500">
                                {enrollment.progress.completedSections}/{enrollment.progress.totalSections}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-[#FFDE59] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${enrollment.progress.progressPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                          {enrollment.progress.progressPercentage === 100 && (
                            <Award className="text-green-500" size={20} />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {new Date(enrollment.enrolledAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleRowExpansion(enrollment.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {expandedRows.has(enrollment.id) ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </button>
                          <button
                            onClick={() => handleViewUserProgress(enrollment.userId)}
                            className="text-[#FFDE59] hover:text-[#FFD700]"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Row Details */}
                    {expandedRows.has(enrollment.id) && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 bg-gray-50">
                          <div className="text-sm text-gray-600">
                            <p><span className="font-medium">User Role:</span> {enrollment.user.role}</p>
                            <p><span className="font-medium">Last Updated:</span> {new Date(enrollment.updatedAt).toLocaleDateString()}</p>
                            <div className="mt-2">
                              <span className="font-medium">Progress Status: </span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                enrollment.progress.progressPercentage === 100 
                                  ? 'bg-green-100 text-green-800'
                                  : enrollment.progress.progressPercentage > 0 
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                              }`}>
                                {enrollment.progress.progressPercentage === 100 ? 'Completed' :
                                 enrollment.progress.progressPercentage > 0 ? 'In Progress' : 'Not Started'}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} results
              </div>
              <div className="flex space-x-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handleFilterChange('page', page)}
                    className={`px-3 py-2 text-sm rounded-lg ${
                      page === pagination.page 
                        ? 'bg-[#FFDE59] text-gray-900' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Progress Modal */}
      {selectedEnrollment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-90vh overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedEnrollment.user.name}'s Progress
                </h3>
                <button
                  onClick={() => setSelectedEnrollment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              {/* User Progress Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#FFDE59]">
                      {selectedEnrollment.statistics.overallProgress}%
                    </div>
                    <div className="text-sm text-gray-600">Overall Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {selectedEnrollment.statistics.totalEnrollments}
                    </div>
                    <div className="text-sm text-gray-600">Enrollments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {selectedEnrollment.statistics.badgesEarned}
                    </div>
                    <div className="text-sm text-gray-600">Badges</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {selectedEnrollment.statistics.completedSections}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                </div>

                {/* User Enrollments */}
                {selectedEnrollment.enrollments && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">League Enrollments</h4>
                    {selectedEnrollment.enrollments.map((enrollment) => (
                      <div key={enrollment.league.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{enrollment.league.name}</div>
                          <div className="text-sm text-gray-600">{enrollment.cohort.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-[#FFDE59]">
                            {enrollment.progress.progressPercentage}%
                          </div>
                          <div className="text-sm text-gray-600">
                            {enrollment.progress.completedSections}/{enrollment.progress.totalSections}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProgressManagement;
