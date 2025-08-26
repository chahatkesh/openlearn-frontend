import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Eye, 
  TrendingUp,
  Search,
  Filter,
  Download,
  UserPlus,
  UserMinus,
  Share2
} from 'lucide-react';
import BadgeService from '../../utils/api/badgeService';
import DataService from '../../utils/api/dataService';
import { BadgeCollection } from './Badge';

/**
 * Badge Management Component for Admins
 * Allows creation, editing, awarding, and management of badges
 */
const BadgeManagement = ({ user }) => {
  const [badges, setBadges] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBadge, setEditingBadge] = useState(null);
  const [showAwardModal, setShowAwardModal] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    league: 'all',
    status: 'all'
  });

  useEffect(() => {
    if (BadgeService.canManageBadges(user) || BadgeService.canAwardBadges(user)) {
      fetchBadges();
      fetchLeagues();
      if (BadgeService.canManageBadges(user)) {
        fetchAnalytics();
      }
    }
  }, [user]);

  const fetchBadges = async () => {
    setLoading(true);
    try {
      const data = await BadgeService.getAllBadges();
      setBadges(data.badges || []);
    } catch (err) {
      console.error('Error fetching badges:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeagues = async () => {
    try {
      const data = await DataService.getLeagues();
      setLeagues(data.leagues || []);
    } catch (err) {
      console.error('Error fetching leagues:', err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const data = await BadgeService.getBadgeAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const handleCreateBadge = async (badgeData) => {
    try {
      await BadgeService.createBadge(badgeData);
      setShowCreateForm(false);
      fetchBadges();
      alert('Badge created successfully!');
    } catch (err) {
      alert(`Failed to create badge: ${err.message}`);
    }
  };

  const handleUpdateBadge = async (badgeId, updateData) => {
    try {
      await BadgeService.updateBadge(badgeId, updateData);
      setEditingBadge(null);
      fetchBadges();
      alert('Badge updated successfully!');
    } catch (err) {
      alert(`Failed to update badge: ${err.message}`);
    }
  };

  const handleAwardBadge = async (badgeId, userId, reason) => {
    try {
      await BadgeService.awardBadge(badgeId, userId, reason);
      setShowAwardModal(null);
      fetchBadges();
      fetchAnalytics();
      alert('Badge awarded successfully!');
    } catch (err) {
      alert(`Failed to award badge: ${err.message}`);
    }
  };

  // Note: handleRevokeBadge function prepared for future badge revocation UI
  // const handleRevokeBadge = async (badgeId, userId, reason) => { ... }

  const handleDeleteBadge = async (badgeId) => {
    if (confirm('Are you sure you want to delete this badge? This action cannot be undone.')) {
      try {
        await BadgeService.deleteBadge(badgeId);
        fetchBadges();
        fetchAnalytics();
        alert('Badge deleted successfully!');
      } catch (err) {
        alert(`Failed to delete badge: ${err.message}`);
      }
    }
  };

  const filteredBadges = BadgeService.filterBadges(badges, filters);
  const sortedBadges = BadgeService.sortBadges(filteredBadges, 'name', 'asc');

  if (!BadgeService.canManageBadges(user) && !BadgeService.canAwardBadges(user)) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8">
          <Award size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
          <p className="text-gray-600">You don't have permission to manage badges.</p>
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
            <Award className="mr-2 text-[#FFDE59]" size={24} />
            Badge Management
          </h1>
          
          <div className="flex items-center space-x-4">
            {BadgeService.canManageBadges(user) && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center bg-[#FFDE59] text-gray-900 px-4 py-2 rounded-lg hover:bg-[#FFD700] transition-colors"
              >
                <Plus size={16} className="mr-2" />
                Create Badge
              </button>
            )}
          </div>
        </div>

        {/* Analytics Overview */}
        {analytics && BadgeService.canManageBadges(user) && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{analytics.overview.totalBadges}</div>
              <div className="text-sm text-gray-600">Total Badges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analytics.overview.totalAwarded}</div>
              <div className="text-sm text-gray-600">Total Awarded</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analytics.overview.uniqueEarners}</div>
              <div className="text-sm text-gray-600">Unique Earners</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#FFDE59]">{analytics.overview.averageBadgesPerUser}</div>
              <div className="text-sm text-gray-600">Avg per User</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search badges..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-transparent"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>

          <select
            value={filters.league}
            onChange={(e) => setFilters(prev => ({ ...prev, league: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-transparent"
          >
            <option value="all">All Leagues</option>
            {leagues.map(league => (
              <option key={league.id} value={league.id}>{league.name}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-transparent"
          >
            <option value="all">All Badges</option>
            <option value="earned">Earned</option>
            <option value="available">Available</option>
          </select>
        </div>
      </div>

      {/* Badges Grid */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFDE59] mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading badges...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchBadges}
            className="bg-[#FFDE59] text-gray-900 px-4 py-2 rounded-lg hover:bg-[#FFD700] transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : sortedBadges.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <Award size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No badges found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedBadges.map((badge) => (
            <div key={badge.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#FFDE59] rounded-full flex items-center justify-center mr-3">
                    <Award className="text-gray-900" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{badge.name}</h3>
                    <p className="text-sm text-gray-600">{badge.league?.name}</p>
                  </div>
                </div>
                
                {badge.earnedByUser && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Earned
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-4">{badge.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <Users size={14} className="mr-1" />
                  {badge.totalEarners} earned
                </span>
                <span>{new Date(badge.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {BadgeService.canAwardBadges(user) && (
                    <button
                      onClick={() => setShowAwardModal(badge)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Award badge"
                    >
                      <UserPlus size={16} />
                    </button>
                  )}
                  
                  {BadgeService.canManageBadges(user) && (
                    <>
                      <button
                        onClick={() => setEditingBadge(badge)}
                        className="text-yellow-600 hover:text-yellow-800 p-1"
                        title="Edit badge"
                      >
                        <Edit size={16} />
                      </button>
                      
                      {BadgeService.canDeleteBadges(user) && badge.totalEarners === 0 && (
                        <button
                          onClick={() => handleDeleteBadge(badge.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete badge"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </>
                  )}
                </div>

                <button
                  className="text-gray-400 hover:text-[#FFDE59] p-1"
                  title="Share badge"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Badge Modal */}
      {showCreateForm && (
        <CreateBadgeModal
          leagues={leagues}
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateBadge}
        />
      )}

      {/* Edit Badge Modal */}
      {editingBadge && (
        <EditBadgeModal
          badge={editingBadge}
          onClose={() => setEditingBadge(null)}
          onSubmit={(updateData) => handleUpdateBadge(editingBadge.id, updateData)}
        />
      )}

      {/* Award Badge Modal */}
      {showAwardModal && (
        <AwardBadgeModal
          badge={showAwardModal}
          onClose={() => setShowAwardModal(null)}
          onSubmit={(userId, reason) => handleAwardBadge(showAwardModal.id, userId, reason)}
        />
      )}
    </div>
  );
};

/* Modal Components */

const CreateBadgeModal = ({ leagues, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    leagueId: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Badge</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Badge Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-transparent"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                League *
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-transparent"
                value={formData.leagueId}
                onChange={(e) => setFormData(prev => ({ ...prev, leagueId: e.target.value }))}
              >
                <option value="">Select a league</option>
                {leagues.map(league => (
                  <option key={league.id} value={league.id}>{league.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-transparent"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-transparent"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-[#FFDE59] text-gray-900 py-2 rounded-lg hover:bg-[#FFD700] transition-colors"
              >
                Create Badge
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const EditBadgeModal = ({ badge, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: badge.name || '',
    description: badge.description || '',
    imageUrl: badge.imageUrl || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Badge</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Badge Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-transparent"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-transparent"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-transparent"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-[#FFDE59] text-gray-900 py-2 rounded-lg hover:bg-[#FFD700] transition-colors"
              >
                Update Badge
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const AwardBadgeModal = ({ badge, onClose, onSubmit }) => {
  const [userId, setUserId] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(userId, reason);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Award Badge: {badge.name}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User ID *
              </label>
              <input
                type="text"
                required
                placeholder="Enter user ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-transparent"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason (Optional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-transparent"
                rows={3}
                placeholder="Reason for awarding this badge..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-[#FFDE59] text-gray-900 py-2 rounded-lg hover:bg-[#FFD700] transition-colors"
              >
                Award Badge
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BadgeManagement;
