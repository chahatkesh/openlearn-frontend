import React from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  ExternalLink, 
  Twitter, 
  Linkedin,
  Github,
  BarChart3,
  Sparkles,
  Shield,
  Crown,
  Star,
  Settings,
  Trophy
} from 'lucide-react';

const UserProfileSection = ({ user }) => {
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
    <div className="h-full bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30 overflow-hidden">
      {/* Main Content */}
      <div className="h-full p-6 space-y-6 overflow-y-auto">
        
        {/* Profile Header */}
        <div className="relative text-center">
          {/* Avatar with enhanced design */}
          <div className="relative mx-auto w-20 h-20 mb-4">
            <div className={`w-full h-full rounded-full bg-gradient-to-r ${roleInfo.gradient} p-0.5 shadow-lg`}>
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <User size={28} className={roleInfo.textColor} />
              </div>
            </div>
            {/* Status Indicator */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-sm">
              <div className="w-full h-full rounded-full bg-green-500 animate-pulse"></div>
            </div>
          </div>

          {/* User Name & Email */}
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-sm text-gray-600">{user?.email}</p>
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
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="text-center">
              <Trophy size={16} className="mx-auto mb-1 text-amber-500" />
              <div className="text-lg font-bold text-gray-900">0</div>
              <div className="text-xs text-gray-600">Badges</div>
            </div>
          </div>
          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="text-center">
              <BarChart3 size={16} className="mx-auto mb-1 text-blue-500" />
              <div className="text-lg font-bold text-gray-900">0</div>
              <div className="text-xs text-gray-600">Leagues</div>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Account Status</span>
            <Settings size={14} className="text-gray-400" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Status</span>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
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
              <span className="text-xs text-gray-600">Member since</span>
              <span className="text-xs text-gray-900 font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  year: 'numeric' 
                }) : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Social Connections */}
        <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Social Connections</h3>
          
          <div className="space-y-2">
            {/* Twitter */}
            {user?.twitterHandle ? (
              <a 
                href={`https://twitter.com/${user.twitterHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between group p-2.5 rounded-lg bg-white/40 hover:bg-blue-50/80 border border-white/30 hover:border-blue-200 transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Twitter size={14} className="text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-blue-700 font-medium">@{user.twitterHandle}</span>
                </div>
                <ExternalLink size={12} className="text-gray-400 group-hover:text-blue-600" />
              </a>
            ) : (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50/50 border border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Twitter size={14} className="text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-500">Twitter</span>
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
                className="flex items-center justify-between group p-2.5 rounded-lg bg-white/40 hover:bg-blue-50/80 border border-white/30 hover:border-blue-200 transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Linkedin size={14} className="text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-blue-700 font-medium">LinkedIn</span>
                </div>
                <ExternalLink size={12} className="text-gray-400 group-hover:text-blue-600" />
              </a>
            ) : (
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
                className="flex items-center justify-between group p-2.5 rounded-lg bg-white/40 hover:bg-gray-50/80 border border-white/30 hover:border-gray-200 transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <Github size={14} className="text-gray-700" />
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-gray-800 font-medium">@{user.githubUsername}</span>
                </div>
                <ExternalLink size={12} className="text-gray-400 group-hover:text-gray-600" />
              </a>
            ) : (
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

            {/* Kaggle */}
            {user?.kaggleUsername ? (
              <a 
                href={`https://kaggle.com/${user.kaggleUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between group p-2.5 rounded-lg bg-white/40 hover:bg-cyan-50/80 border border-white/30 hover:border-cyan-200 transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-100 flex items-center justify-center group-hover:bg-cyan-200 transition-colors">
                    <BarChart3 size={14} className="text-cyan-600" />
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-cyan-700 font-medium">{user.kaggleUsername}</span>
                </div>
                <ExternalLink size={12} className="text-gray-400 group-hover:text-cyan-600" />
              </a>
            ) : (
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

        {/* Bottom spacer for smooth scrolling */}
        <div className="h-4"></div>
      </div>
    </div>
  );
};

export default UserProfileSection;
