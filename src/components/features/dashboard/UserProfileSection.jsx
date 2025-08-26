import React, { useState, useEffect } from 'react';
import { 
  User,
  ExternalLink, 
  Linkedin,
  Github,
  BarChart3,
  Sparkles,
  Shield,
  Crown,
  Star,
  Trophy,
  X,
  Award,
  CheckCircle,
  Lock,
  Edit3,
  Save,
  AlertCircle
} from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';
import ProgressService from '../../../utils/api/progressService';
import BadgeService from '../../../utils/api/badgeService';
import SocialService from '../../../utils/social/socialService';
import { getUserAvatarUrl } from '../../../utils/helpers/boringAvatarsUtils';
import { useAuth } from '../../../hooks/useAuth';
import ModalPortal from '../../ui/ModalPortal';

// BadgesModal Component
const BadgesModal = ({ isOpen, onClose, user, userBadges }) => {
  const [allBadges, setAllBadges] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAllBadges();
    }
  }, [isOpen]);

  const fetchAllBadges = async () => {
    setLoading(true);
    try {
      const response = await BadgeService.getAllBadges();
      setAllBadges(response.badges || []);
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get role-based automatic badges based on hierarchy
  const getRoleBadges = (userRole) => {
    const roleBadges = [];
    
    // Pioneer - base level (everyone has this)
    if (userRole === 'PIONEER' || userRole === 'LUMINARY' || userRole === 'PATHFINDER' || userRole === 'CHIEF_PATHFINDER' || userRole === 'GRAND_PATHFINDER') {
      roleBadges.push({
        id: 'role-pioneer',
        name: 'Pioneer',
        description: 'Starting your learning journey',
        icon: Star,
        color: 'from-blue-400 to-blue-600',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        earned: true,
        automatic: true
      });
    }

    // Luminary - includes Pioneer
    if (userRole === 'LUMINARY' || userRole === 'PATHFINDER' || userRole === 'CHIEF_PATHFINDER' || userRole === 'GRAND_PATHFINDER') {
      roleBadges.push({
        id: 'role-luminary',
        name: 'Luminary',
        description: 'Illuminating the path for others',
        icon: Sparkles,
        color: 'from-purple-400 to-purple-600',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
        earned: true,
        automatic: true
      });
    }

    // Pathfinder - includes Pioneer and Luminary
    if (userRole === 'PATHFINDER' || userRole === 'CHIEF_PATHFINDER' || userRole === 'GRAND_PATHFINDER') {
      roleBadges.push({
        id: 'role-pathfinder',
        name: 'Pathfinder',
        description: 'Guiding others on their learning path',
        icon: Shield,
        color: 'from-green-400 to-green-600',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        earned: true,
        automatic: true
      });
    }

    // Chief Pathfinder - includes Pioneer, Luminary, and Pathfinder
    if (userRole === 'CHIEF_PATHFINDER' || userRole === 'GRAND_PATHFINDER') {
      roleBadges.push({
        id: 'role-chief-pathfinder',
        name: 'Chief Pathfinder',
        description: 'Leading and managing learning initiatives',
        icon: Crown,
        color: 'from-orange-400 to-orange-600',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-700',
        earned: true,
        automatic: true
      });
    }

    // Grand Pathfinder - includes all previous roles
    if (userRole === 'GRAND_PATHFINDER') {
      roleBadges.push({
        id: 'role-grand-pathfinder',
        name: 'Grand Pathfinder',
        description: 'Ultimate leadership in the learning community',
        icon: Crown,
        color: 'from-red-400 to-red-600',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        earned: true,
        automatic: true
      });
    }

    return roleBadges;
  };

  const roleBadges = getRoleBadges(user?.role);
  const earnedBadgeIds = new Set(userBadges?.map(b => b.badge?.id || b.id) || []);

  return (
    <ModalPortal isOpen={isOpen}>
      <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-[9999] p-4">
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl border border-yellow-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-yellow-200 bg-white/50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Badges</h2>
            <p className="text-sm text-gray-600">Your achievements and recognitions</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-yellow-200 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)] modal-scroll">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading badges...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Role-based Automatic Badges */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award size={20} className="text-yellow-600" />
                  Role Badges
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {roleBadges.map((badge) => {
                    const IconComponent = badge.icon;
                    return (
                      <div
                        key={badge.id}
                        className={`relative p-4 rounded-xl border-2 ${badge.bgColor} border-white shadow-sm hover:shadow-md transition-all duration-200`}
                      >
                        <div className="text-center">
                          <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${badge.color} p-0.5 shadow-lg`}>
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                              <IconComponent size={24} className={badge.textColor} />
                            </div>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">{badge.name}</h4>
                          <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                          <div className="flex items-center justify-center gap-1">
                            <CheckCircle size={14} className="text-green-500" />
                            <span className="text-xs text-green-600 font-medium">Earned</span>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Star size={12} className="text-white" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Admin-assigned and Achievement Badges */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Trophy size={20} className="text-yellow-600" />
                  Achievement Badges
                </h3>
                {allBadges.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allBadges.map((badge) => {
                      const isEarned = earnedBadgeIds.has(badge.id);
                      return (
                        <div
                          key={badge.id}
                          className={`relative p-4 rounded-xl border-2 shadow-sm transition-all duration-200 ${
                            isEarned 
                              ? 'bg-green-50 border-green-200 hover:shadow-md' 
                              : 'bg-gray-50 border-gray-200 opacity-60'
                          }`}
                        >
                          <div className="text-center">
                            <div className={`w-16 h-16 mx-auto mb-3 rounded-full p-0.5 shadow-lg ${
                              isEarned 
                                ? 'bg-gradient-to-r from-green-400 to-green-600' 
                                : 'bg-gradient-to-r from-gray-300 to-gray-400'
                            }`}>
                              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                {badge.imageUrl ? (
                                  <img 
                                    src={badge.imageUrl} 
                                    alt={badge.name}
                                    className="w-8 h-8 object-cover rounded-full"
                                  />
                                ) : (
                                  <Trophy size={24} className={isEarned ? 'text-green-600' : 'text-gray-400'} />
                                )}
                              </div>
                            </div>
                            <h4 className={`font-semibold mb-1 ${isEarned ? 'text-gray-900' : 'text-gray-500'}`}>
                              {badge.name}
                            </h4>
                            <p className={`text-xs mb-2 ${isEarned ? 'text-gray-600' : 'text-gray-400'}`}>
                              {badge.description || 'Achievement badge'}
                            </p>
                            <div className="flex items-center justify-center gap-1">
                              {isEarned ? (
                                <>
                                  <CheckCircle size={14} className="text-green-500" />
                                  <span className="text-xs text-green-600 font-medium">Earned</span>
                                </>
                              ) : (
                                <>
                                  <Lock size={14} className="text-gray-400" />
                                  <span className="text-xs text-gray-500 font-medium">Locked</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white/50 rounded-xl border border-yellow-200">
                    <Trophy size={48} className="mx-auto text-gray-300 mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">No Achievement Badges Yet</h4>
                    <p className="text-sm text-gray-600">Complete challenges and reach milestones to earn badges!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </ModalPortal>
  );
};

const UserProfileSection = ({ user, dashboardData = null, isMobile = false }) => {
  const { refreshUser } = useAuth();
  const [userStats, setUserStats] = useState({
    badgesCount: 0,
    leaguesCount: 0
  });
  const [loading, setLoading] = useState(false);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [userBadges, setUserBadges] = useState([]);
  const [isSocialEditModalOpen, setIsSocialEditModalOpen] = useState(false);

  // Helper function to count role badges based on hierarchy
  const getRoleBadgesCount = (userRole) => {
    let count = 0;
    
    // Pioneer - base level (everyone has this)
    if (userRole === 'PIONEER' || userRole === 'LUMINARY' || userRole === 'PATHFINDER' || userRole === 'CHIEF_PATHFINDER' || userRole === 'GRAND_PATHFINDER') {
      count++;
    }

    // Luminary - includes Pioneer
    if (userRole === 'LUMINARY' || userRole === 'PATHFINDER' || userRole === 'CHIEF_PATHFINDER' || userRole === 'GRAND_PATHFINDER') {
      count++;
    }

    // Pathfinder - includes Pioneer and Luminary
    if (userRole === 'PATHFINDER' || userRole === 'CHIEF_PATHFINDER' || userRole === 'GRAND_PATHFINDER') {
      count++;
    }

    // Chief Pathfinder - includes all previous
    if (userRole === 'CHIEF_PATHFINDER' || userRole === 'GRAND_PATHFINDER') {
      count++;
    }

    // Grand Pathfinder - includes all previous
    if (userRole === 'GRAND_PATHFINDER') {
      count++;
    }

    return count;
  };

  // Fetch dashboard data if not provided
  useEffect(() => {
    const fetchUserStats = async () => {
      if (dashboardData) {
        // Use provided dashboard data
        const stats = ProgressService.calculateProgressStats(dashboardData);
        const roleBadgesCount = getRoleBadgesCount(user?.role);
        setUserStats({
          badgesCount: stats.badgesEarned + roleBadgesCount,
          leaguesCount: stats.totalEnrollments
        });
      } else {
        // Fetch data independently
        setLoading(true);
        try {
          const [dashboardResponse, badgesResponse] = await Promise.all([
            ProgressService.getUserDashboard(),
            BadgeService.getMyBadges()
          ]);
          
          const stats = ProgressService.calculateProgressStats(dashboardResponse);
          const roleBadgesCount = getRoleBadgesCount(user?.role);
          const achievementBadgesCount = badgesResponse.badges?.length || 0;
          setUserStats({
            badgesCount: achievementBadgesCount + roleBadgesCount,
            leaguesCount: stats.totalEnrollments
          });
          setUserBadges(badgesResponse.badges || []);
        } catch (error) {
          console.error('Error fetching user stats:', error);
          // Keep default values but still count role badges
          const roleBadgesCount = getRoleBadgesCount(user?.role);
          setUserStats({
            badgesCount: roleBadgesCount,
            leaguesCount: 0
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserStats();
  }, [dashboardData, user?.role]);
  // Get role display info with enhanced styling
  const getRoleInfo = (role) => {
    switch (role) {
      case 'PIONEER':
        return { 
          icon: Star, 
          label: 'Pioneer', 
          gradient: 'from-blue-400 to-blue-600',
          bgGradient: 'from-blue-50 to-blue-100',
          textColor: 'text-blue-700'
        };
      case 'LUMINARY':
        return { 
          icon: Sparkles, 
          label: 'Luminary', 
          gradient: 'from-purple-400 to-purple-600',
          bgGradient: 'from-purple-50 to-purple-100',
          textColor: 'text-purple-700'
        };
      case 'PATHFINDER':
        return { 
          icon: Shield, 
          label: 'Pathfinder', 
          gradient: 'from-green-400 to-green-600',
          bgGradient: 'from-green-50 to-green-100',
          textColor: 'text-green-700'
        };
      case 'CHIEF_PATHFINDER':
        return { 
          icon: Crown, 
          label: 'Chief Pathfinder', 
          gradient: 'from-orange-400 to-orange-600',
          bgGradient: 'from-orange-50 to-orange-100',
          textColor: 'text-orange-700'
        };
      case 'GRAND_PATHFINDER':
        return { 
          icon: Crown, 
          label: 'Grand Pathfinder', 
          gradient: 'from-red-400 to-red-600',
          bgGradient: 'from-red-50 to-red-100',
          textColor: 'text-red-700'
        };
      default:
        return { 
          icon: User, 
          label: 'Member', 
          gradient: 'from-gray-400 to-gray-600',
          bgGradient: 'from-gray-50 to-gray-100',
          textColor: 'text-gray-700'
        };
    }
  };

  const roleInfo = getRoleInfo(user?.role);
  const RoleIcon = roleInfo.icon;

  return (
    <div className="bg-transparent">
      {/* Main Content */}
      <div className={`${isMobile ? 'p-4 space-y-4' : 'p-6 space-y-6'}`}>
        
        {/* Profile Header */}
        <div className="relative text-center">
          {/* Avatar with enhanced design */}
          <div className={`relative mx-auto ${isMobile ? 'w-16 h-16 mb-3' : 'w-20 h-20 mb-4'}`}>
            <div className={`w-full h-full rounded-full bg-gradient-to-r ${roleInfo.gradient} p-0.5 shadow-lg`}>
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img
                  src={getUserAvatarUrl(user, 'avataaars', isMobile ? 64 : 80)}
                  alt={`${user?.name || 'User'} avatar`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to User icon if avatar fails to load
                    e.target.style.display = 'none';
                    const fallbackDiv = e.target.nextSibling;
                    if (fallbackDiv) {
                      fallbackDiv.style.display = 'flex';
                    }
                  }}
                  onLoad={(e) => {
                    // Hide fallback when image loads successfully
                    const fallbackDiv = e.target.nextSibling;
                    if (fallbackDiv) {
                      fallbackDiv.style.display = 'none';
                    }
                  }}
                />
                {/* Fallback icon display */}
                <div className={`absolute inset-0 flex items-center justify-center ${roleInfo.textColor}`} style={{ display: 'none' }}>
                  <User size={isMobile ? 24 : 28} />
                </div>
              </div>
            </div>
            {/* Status Indicator */}
            <div className={`absolute -bottom-1 -right-1 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'} bg-green-500 rounded-full border-2 border-white shadow-sm`}>
              <div className="w-full h-full rounded-full bg-green-500 animate-pulse"></div>
            </div>
          </div>

          {/* User Name & Email */}
          <div className="space-y-1">
            <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-900`}>{user?.name}</h2>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>{user?.email}</p>
          </div>

          {/* Role Badge */}
          <div className={`inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-gradient-to-r ${roleInfo.bgGradient} border border-white/50 shadow-sm backdrop-blur-sm`}>
            <RoleIcon size={14} className={roleInfo.textColor} />
            <span className={`text-sm font-medium ${roleInfo.textColor}`}>
              {roleInfo.label}
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className={`grid grid-cols-2 ${isMobile ? 'gap-2' : 'gap-3'}`}>
          <button 
            onClick={() => setIsBadgesModalOpen(true)}
            className={`bg-white/40 backdrop-blur-sm rounded-xl ${isMobile ? 'p-3' : 'p-4'} border border-white/20 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer`}
          >
            <div className="text-center">
              <Trophy size={16} className="mx-auto mb-1 text-amber-500" />
              <div className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-900`}>
                {loading ? '...' : userStats.badgesCount}
              </div>
              <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-600`}>Badges</div>
            </div>
          </button>
          <div className={`bg-white/40 backdrop-blur-sm rounded-xl ${isMobile ? 'p-3' : 'p-4'} border border-white/20 shadow-sm hover:shadow-md transition-all duration-200`}>
            <div className="text-center">
              <BarChart3 size={16} className="mx-auto mb-1 text-blue-500" />
              <div className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-900`}>
                {loading ? '...' : userStats.leaguesCount}
              </div>
              <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-600`}>Leagues</div>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className={`bg-white/30 backdrop-blur-sm rounded-xl ${isMobile ? 'p-3' : 'p-4'} border border-white/20 shadow-sm space-y-3`}>
          <div className="flex items-center justify-between">
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-700`}>Account Status</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-600`}>Status</span>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${isMobile ? 'text-xs' : 'text-xs'} font-medium ${
                user?.status === 'ACTIVE' 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : user?.status === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  user?.status === 'ACTIVE' ? 'bg-green-500' : 
                  user?.status === 'PENDING' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                {user?.status?.toLowerCase()}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-600`}>Member since</span>
              <span className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-900 font-medium`}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  year: 'numeric' 
                }) : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Social Connections - Condensed for mobile */}
        <div className={`bg-white/30 backdrop-blur-sm rounded-xl ${isMobile ? 'p-3' : 'p-4'} border border-white/20 shadow-sm space-y-3`}>
          <div className="flex items-center justify-between">
            <h3 className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-700`}>Social Connections</h3>
            <button
              onClick={() => setIsSocialEditModalOpen(true)}
              className="p-1.5 hover:bg-white/50 rounded-lg transition-colors group"
              title="Edit social connections"
            >
              <Edit3 size={isMobile ? 12 : 14} className="text-gray-500 group-hover:text-gray-700" />
            </button>
          </div>
          
          <div className={`${isMobile ? 'space-y-1' : 'space-y-2'}`}>
            {/* Twitter */}
            {user?.twitterHandle ? (
              <a 
                href={`https://twitter.com/${user.twitterHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-between group ${isMobile ? 'p-2' : 'p-2.5'} rounded-lg bg-white/40 hover:bg-blue-50/80 border border-white/30 hover:border-blue-200 transition-all duration-200 hover:scale-[1.02]`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`${isMobile ? 'w-6 h-6' : 'w-7 h-7'} rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors`}>
                    <FaXTwitter size={isMobile ? 12 : 14} className="text-blue-600" />
                  </div>
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 group-hover:text-blue-700 font-medium truncate`}>{user.twitterHandle}</span>
                </div>
                <ExternalLink size={12} className="text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
              </a>
            ) : !isMobile && (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50/50 border border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                    <FaXTwitter size={14} className="text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-500">X (Twitter)</span>
                </div>
                <span className="text-xs text-gray-400">Not connected</span>
              </div>
            )}

            {/* LinkedIn */}
            {user?.linkedinUrl ? (
              <a 
                href={user.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-between group ${isMobile ? 'p-2' : 'p-2.5'} rounded-lg bg-white/40 hover:bg-blue-50/80 border border-white/30 hover:border-blue-200 transition-all duration-200 hover:scale-[1.02]`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`${isMobile ? 'w-6 h-6' : 'w-7 h-7'} rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors`}>
                    <Linkedin size={isMobile ? 12 : 14} className="text-blue-600" />
                  </div>
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 group-hover:text-blue-700 font-medium`}>LinkedIn</span>
                </div>
                <ExternalLink size={12} className="text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
              </a>
            ) : !isMobile && (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50/50 border border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Linkedin size={14} className="text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-500">LinkedIn</span>
                </div>
                <span className="text-xs text-gray-400">Not connected</span>
              </div>
            )}

            {/* GitHub */}
            {user?.githubUsername ? (
              <a 
                href={`https://github.com/${user.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-between group ${isMobile ? 'p-2' : 'p-2.5'} rounded-lg bg-white/40 hover:bg-gray-50/80 border border-white/30 hover:border-gray-200 transition-all duration-200 hover:scale-[1.02]`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`${isMobile ? 'w-6 h-6' : 'w-7 h-7'} rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors`}>
                    <Github size={isMobile ? 12 : 14} className="text-gray-700" />
                  </div>
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 group-hover:text-gray-800 font-medium truncate`}>@{user.githubUsername}</span>
                </div>
                <ExternalLink size={12} className="text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
              </a>
            ) : !isMobile && (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50/50 border border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Github size={14} className="text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-500">GitHub</span>
                </div>
                <span className="text-xs text-gray-400">Not connected</span>
              </div>
            )}

            {/* Kaggle - Show only if connected or on desktop */}
            {user?.kaggleUsername ? (
              <a 
                href={`https://kaggle.com/${user.kaggleUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-between group ${isMobile ? 'p-2' : 'p-2.5'} rounded-lg bg-white/40 hover:bg-cyan-50/80 border border-white/30 hover:border-cyan-200 transition-all duration-200 hover:scale-[1.02]`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`${isMobile ? 'w-6 h-6' : 'w-7 h-7'} rounded-lg bg-cyan-100 flex items-center justify-center group-hover:bg-cyan-200 transition-colors`}>
                    <BarChart3 size={isMobile ? 12 : 14} className="text-cyan-600" />
                  </div>
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 group-hover:text-cyan-700 font-medium truncate`}>{user.kaggleUsername}</span>
                </div>
                <ExternalLink size={12} className="text-gray-400 group-hover:text-cyan-600 flex-shrink-0" />
              </a>
            ) : !isMobile && (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50/50 border border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                    <BarChart3 size={14} className="text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-500">Kaggle</span>
                </div>
                <span className="text-xs text-gray-400">Not connected</span>
              </div>
            )}
          </div>
        </div>

        {/* Badges Section - Clickable to open modal - Condensed for mobile */}
        <div className={`bg-white/30 backdrop-blur-sm rounded-xl ${isMobile ? 'p-3' : 'p-4'} border border-white/20 shadow-sm space-y-3 cursor-pointer`} onClick={() => setIsBadgesModalOpen(true)}>
          <div className="flex items-center justify-between">
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-700`}>My Badges</span>
            <span className={`${isMobile ? 'text-xs' : 'text-xs'} font-semibold text-gray-500`}>{loading ? '...' : userStats.badgesCount}</span>
          </div>
          
          <div className={`flex flex-wrap ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
            {/* Display up to 4 badges in a compact view */}
            {userStats.badgesCount > 0 ? (
              <>
                {(() => {
                  const roleBadges = [];
                  const userRole = user?.role;
                  
                  // Add role badges based on hierarchy
                  if (userRole === 'PIONEER' || userRole === 'LUMINARY' || userRole === 'PATHFINDER' || userRole === 'CHIEF_PATHFINDER' || userRole === 'GRAND_PATHFINDER') {
                    roleBadges.push({ id: 'pioneer', icon: Star, color: 'text-blue-600' });
                  }
                  if (userRole === 'LUMINARY' || userRole === 'PATHFINDER' || userRole === 'CHIEF_PATHFINDER' || userRole === 'GRAND_PATHFINDER') {
                    roleBadges.push({ id: 'luminary', icon: Sparkles, color: 'text-purple-600' });
                  }
                  if (userRole === 'PATHFINDER' || userRole === 'CHIEF_PATHFINDER' || userRole === 'GRAND_PATHFINDER') {
                    roleBadges.push({ id: 'pathfinder', icon: Shield, color: 'text-green-600' });
                  }
                  if (userRole === 'CHIEF_PATHFINDER' || userRole === 'GRAND_PATHFINDER') {
                    roleBadges.push({ id: 'chief-pathfinder', icon: Crown, color: 'text-orange-600' });
                  }
                  if (userRole === 'GRAND_PATHFINDER') {
                    roleBadges.push({ id: 'grand-pathfinder', icon: Crown, color: 'text-red-600' });
                  }
                  
                  let displayedBadges = 0;
                  const maxDisplay = isMobile ? 3 : 4;
                  
                  return (
                    <>
                      {/* Role badges */}
                      {roleBadges.slice(0, maxDisplay).map((roleBadge) => {
                        const IconComponent = roleBadge.icon;
                        displayedBadges++;
                        return (
                          <div key={roleBadge.id} className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center`}>
                            <IconComponent size={isMobile ? 12 : 16} className={roleBadge.color} />
                          </div>
                        );
                      })}
                      
                      {/* Achievement badges */}
                      {userBadges.slice(0, maxDisplay - displayedBadges).map((badge, index) => {
                        displayedBadges++;
                        return (
                          <div key={`achievement-${index}`} className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-full overflow-hidden border-2 border-white shadow-sm`}>
                            {badge.badge?.imageUrl ? (
                              <img 
                                src={badge.badge.imageUrl} 
                                alt={badge.badge.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-amber-100 flex items-center justify-center">
                                <Trophy size={isMobile ? 12 : 16} className="text-amber-600" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                      
                      {/* Show +N if there are more badges */}
                      {userStats.badgesCount > maxDisplay && (
                        <div className={`flex items-center justify-center ${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-full bg-gray-100 border-2 border-white shadow-sm`}>
                          <span className={`${isMobile ? 'text-xs' : 'text-xs'} font-semibold text-gray-500`}>
                            +{userStats.badgesCount - maxDisplay}
                          </span>
                        </div>
                      )}
                    </>
                  );
                })()}
              </>
            ) : (
              <span className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-500`}>No badges earned yet</span>
            )}
          </div>
        </div>

        {/* Bottom spacer for smooth scrolling */}
        <div className={`${isMobile ? 'h-2' : 'h-4'}`}></div>
      </div>

      {/* Badges Modal */}
      <BadgesModal 
        isOpen={isBadgesModalOpen} 
        onClose={() => setIsBadgesModalOpen(false)} 
        user={user} 
        userBadges={userBadges}
      />

      {/* Social Edit Modal */}
      <SocialEditModal 
        isOpen={isSocialEditModalOpen} 
        onClose={() => setIsSocialEditModalOpen(false)} 
        user={user}
        onSave={async (socialData) => {
          try {
            // Update social handles via API
            await SocialService.updateSocialHandles(socialData);
            
            // Refresh user data to reflect the changes
            await refreshUser();
          } catch (error) {
            console.error('Error updating social handles:', error);
            throw error; // Re-throw to let the modal handle the error display
          }
        }}
      />
    </div>
  );
};

// SocialEditModal Component
const SocialEditModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    twitterHandle: user?.twitterHandle || '',
    linkedinUrl: user?.linkedinUrl || '',
    githubUsername: user?.githubUsername || '',
    kaggleUsername: user?.kaggleUsername || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        twitterHandle: user?.twitterHandle || '',
        linkedinUrl: user?.linkedinUrl || '',
        githubUsername: user?.githubUsername || '',
        kaggleUsername: user?.kaggleUsername || ''
      });
      setError('');
    }
  }, [isOpen, user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Call the onSave callback with updated data
      if (onSave) {
        await onSave(formData);
      }
      
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update social connections. Please try again.');
      console.error('Error updating social connections:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalPortal isOpen={isOpen}>
      <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Social Connections</h2>
            <p className="text-sm text-gray-600">Update your social media profiles</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle size={16} className="text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Twitter Handle */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaXTwitter size={16} className="text-blue-600" />
              X (Twitter) Handle
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
              <input
                type="text"
                value={formData.twitterHandle}
                onChange={(e) => handleInputChange('twitterHandle', e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="username"
              />
            </div>
          </div>

          {/* LinkedIn URL */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Linkedin size={16} className="text-blue-600" />
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          {/* GitHub Username */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Github size={16} className="text-gray-700" />
              GitHub Username
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
              <input
                type="text"
                value={formData.githubUsername}
                onChange={(e) => handleInputChange('githubUsername', e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="username"
              />
            </div>
          </div>

          {/* Kaggle Username */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <BarChart3 size={16} className="text-cyan-600" />
              Kaggle Username
            </label>
            <input
              type="text"
              value={formData.kaggleUsername}
              onChange={(e) => handleInputChange('kaggleUsername', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="username"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
    </ModalPortal>
  );
};

export default UserProfileSection;
