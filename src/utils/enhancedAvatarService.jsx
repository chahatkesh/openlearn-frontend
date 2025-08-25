/**
 * Enhanced Avatar Service
 * Provides multiple avatar generation options with fallbacks
 */
import React, { useState } from 'react';
import BoringAvatar from './boringAvatarsService';
import { generateInitials } from './boringAvatarsUtils';

/**
 * Enhanced Avatar Image Component with multiple service options
 */
export const AvatarImage = ({ 
  user, 
  service = 'boring', // 'boring', 'dicebear', 'gravatar', 'initials'
  style = 'bauhaus', 
  size = 64, 
  className = '',
  fallbackBg = 'bg-blue-500',
  textColor = 'text-white',
  palette = 'default'
}) => {
  const [imageError, setImageError] = useState(false);
  const [externalError, setExternalError] = useState(false);
  
  const initials = generateInitials(user?.name || user?.email || 'Anonymous');
  
  // Fallback to initials if all services fail
  if (imageError && externalError) {
    return (
      <div 
        className={`${className} ${fallbackBg} ${textColor} flex items-center justify-center font-semibold rounded-full`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {initials}
      </div>
    );
  }
  
  // Use Boring Avatars (local generation)
  if (service === 'boring' || externalError) {
    return (
      <div className={className}>
        <BoringAvatar 
          user={user} 
          style={style} 
          size={size} 
          palette={palette}
          className="rounded-full"
        />
      </div>
    );
  }
  
  // External services (with fallback to Boring Avatars)
  let avatarUrl;
  if (service === 'dicebear') {
    const seed = encodeURIComponent((user?.email || user?.name || 'anonymous').toLowerCase().trim());
    avatarUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&size=${size}&backgroundColor=transparent`;
  } else if (service === 'gravatar') {
    // Simple Gravatar implementation (you'd need to hash the email)
    const email = user?.email || 'anonymous@example.com';
    avatarUrl = `https://www.gravatar.com/avatar/${btoa(email.toLowerCase())}?s=${size}&d=identicon`;
  } else if (service === 'ui-avatars') {
    const name = encodeURIComponent(user?.name || 'Anonymous');
    const bg = fallbackBg.replace('bg-', '').replace('-500', '');
    avatarUrl = `https://ui-avatars.com/api/?name=${name}&size=${size}&background=${bg}&color=fff`;
  }
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <img
        src={avatarUrl}
        alt={`Avatar for ${user?.name || 'User'}`}
        className={`${className} rounded-full`}
        style={{ width: size, height: size }}
        onError={() => setExternalError(true)}
        onLoad={() => setImageError(false)}
      />
    </div>
  );
};

/**
 * Smart Avatar component that automatically chooses the best service
 */
export const SmartAvatar = ({ 
  user, 
  size = 64, 
  className = '',
  preferLocal = true 
}) => {
  const service = preferLocal ? 'boring' : 'dicebear';
  
  return (
    <AvatarImage
      user={user}
      service={service}
      size={size}
      className={className}
      style="bauhaus"
      palette="default"
    />
  );
};
