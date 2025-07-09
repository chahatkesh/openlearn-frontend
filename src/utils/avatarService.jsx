/**
 * Avatar Service Component
 * Provides React components for avatar rendering
 */
import React, { useState } from 'react';
import { generateAvatarUrl, getUserAvatarUrl, getAvailableStyles, generateInitials } from './avatarUtils';

// Re-export utility functions for convenience
export { generateAvatarUrl, getUserAvatarUrl, getAvailableStyles, generateInitials };

/**
 * Avatar Image Component with fallback
 * @param {Object} props - Component props
 * @param {Object} props.user - User object
 * @param {string} props.style - Avatar style
 * @param {number} props.size - Avatar size
 * @param {string} props.className - CSS class names
 * @returns {JSX.Element} Avatar component
 */
export const AvatarImage = ({ 
  user, 
  style = 'avataaars', 
  size = 64, 
  className = '',
  fallbackBg = 'bg-blue-500',
  textColor = 'text-white'
}) => {
  const [imageError, setImageError] = useState(false);
  const avatarUrl = getUserAvatarUrl(user, style, size);
  const initials = generateInitials(user?.name || user?.email || 'Anonymous');

  if (imageError) {
    return (
      <div 
        className={`${className} ${fallbackBg} ${textColor} flex items-center justify-center font-semibold rounded-full`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <img
        src={avatarUrl}
        alt={`Avatar for ${user?.name || 'User'}`}
        className={`${className} rounded-full`}
        style={{ width: size, height: size }}
        onError={() => setImageError(true)}
      />
      <div 
        className={`absolute inset-0 ${fallbackBg} ${textColor} flex items-center justify-center font-semibold rounded-full`}
        style={{ 
          fontSize: size * 0.4,
          display: 'none' // Initially hidden, shown if image fails
        }}
      >
        {initials}
      </div>
    </div>
  );
};