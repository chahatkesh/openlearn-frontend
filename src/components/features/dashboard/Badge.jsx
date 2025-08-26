import React from 'react';
import { Award, Share2, Calendar, ExternalLink } from 'lucide-react';
import ProgressService from '../../../utils/progressService';

/**
 * Badge Component
 * Displays earned badges with sharing functionality
 */
const Badge = ({ badge, size = 'md', showDetails = true, onClick = null }) => {
  const handleShare = (e) => {
    e.stopPropagation();
    const shareMessage = ProgressService.generateShareMessage('badge', {
      badgeName: badge.name,
      leagueName: badge.league?.name || 'OpenLearn'
    });
    ProgressService.shareOnTwitter(shareMessage);
  };

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  return (
    <div 
      className={`group relative ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center p-4 bg-gradient-to-br from-[#FFDE59]/20 to-[#FFD700]/30 rounded-lg border-2 border-[#FFDE59]/30 hover:border-[#FFDE59] transition-all duration-300 hover:shadow-lg">
        
        {/* Badge Icon */}
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-[#FFDE59] to-[#FFD700] rounded-full flex items-center justify-center shadow-lg mr-4 group-hover:scale-110 transition-transform duration-300`}>
          {badge.imageUrl ? (
            <img 
              src={badge.imageUrl} 
              alt={badge.name}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <Award className="text-gray-900" size={iconSizes[size]} />
          )}
          
          {/* Badge Glow Effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFDE59] to-[#FFD700] opacity-30 blur-md group-hover:opacity-50 transition-opacity duration-300"></div>
        </div>

        {/* Badge Details */}
        {showDetails && (
          <div className="flex-1 min-w-0">
            <h4 className={`font-bold text-gray-900 truncate ${textSizes[size]}`}>
              {badge.name}
            </h4>
            
            {badge.description && (
              <p className={`text-gray-600 mt-1 line-clamp-2 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
                {badge.description}
              </p>
            )}

            {badge.league && (
              <div className={`flex items-center mt-2 text-gray-500 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
                <ExternalLink size={12} className="mr-1" />
                <span className="truncate">{badge.league.name}</span>
              </div>
            )}

            {badge.earnedAt && (
              <div className={`flex items-center mt-1 text-green-600 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
                <Calendar size={12} className="mr-1" />
                <span>Earned {new Date(badge.earnedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-2 ml-2">
          {badge.earnedAt && (
            <button
              onClick={handleShare}
              className="text-gray-400 hover:text-[#FFDE59] transition-colors p-2 rounded-full hover:bg-[#FFDE59]/10"
              title="Share achievement"
            >
              <Share2 size={16} />
            </button>
          )}
          
          {/* Badge Status Indicator */}
          {badge.earnedAt ? (
            <div className="w-3 h-3 bg-green-500 rounded-full shadow-inner"></div>
          ) : (
            <div className="w-3 h-3 bg-gray-300 rounded-full shadow-inner"></div>
          )}
        </div>
      </div>

      {/* Earned Badge Overlay */}
      {badge.earnedAt && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
          ✓
        </div>
      )}

      {/* Hover Tooltip */}
      {!showDetails && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          {badge.name}
          {badge.earnedAt && (
            <div className="text-xs text-gray-300">
              Earned {new Date(badge.earnedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Badge Collection Component
 * Displays a collection of badges in a grid
 */
export const BadgeCollection = ({ badges, title = "Achievements", emptyMessage = "No badges earned yet" }) => {
  if (!badges || badges.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="mr-2 text-[#FFDE59]" size={20} />
          {title}
        </h3>
        <div className="text-center py-8">
          <Award size={48} className="mx-auto mb-4 text-gray-300" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Badges Yet</h4>
          <p className="text-gray-600">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Award className="mr-2 text-[#FFDE59]" size={20} />
        {title}
        <span className="ml-2 bg-[#FFDE59] text-gray-900 text-xs font-bold px-2 py-1 rounded-full">
          {badges.length}
        </span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {badges.map((badge) => (
          <Badge 
            key={badge.id} 
            badge={badge} 
            size="md" 
            showDetails={true}
          />
        ))}
      </div>
    </div>
  );
};

export default Badge;
