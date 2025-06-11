/**
 * Avatar Service
 * Provides avatar generation using free API services
 */

/**
 * Generate avatar URL using DiceBear API
 * DiceBear is a free service that generates avatar images based on a seed string
 * @param {string} seed - The seed string (usually user name or email)
 * @param {string} style - Avatar style (avataaars, micah, adventurer, etc.)
 * @param {number} size - Size of the avatar in pixels
 * @returns {string} Avatar image URL
 */
export const generateAvatarUrl = (seed, style = 'avataaars', size = 64) => {
  if (!seed) {
    seed = 'default-user';
  }
  
  // Clean the seed to make it URL-safe
  const cleanSeed = encodeURIComponent(seed.toLowerCase().trim());
  
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${cleanSeed}&size=${size}&backgroundColor=transparent`;
};

/**
 * Generate avatar URL with fallback
 * @param {Object} user - User object containing name, email, etc.
 * @param {string} style - Avatar style
 * @param {number} size - Size of the avatar
 * @returns {string} Avatar image URL
 */
export const getUserAvatarUrl = (user, style = 'avataaars', size = 64) => {
  if (!user) {
    return generateAvatarUrl('anonymous-user', style, size);
  }
  
  // Use email as primary seed for consistency, fallback to name
  const seed = user.email || user.name || user.id || 'anonymous-user';
  return generateAvatarUrl(seed, style, size);
};

/**
 * Get different avatar styles available
 * @returns {Array} Available avatar styles
 */
export const getAvailableStyles = () => [
  'avataaars',     // Cartoon-style avatars (similar to Bitmoji)
  'micah',         // Simple illustrated avatars
  'adventurer',    // Adventure-themed avatars
  'big-smile',     // Smiling face avatars
  'bottts',        // Robot-style avatars
  'croodles',      // Hand-drawn style avatars
  'fun-emoji',     // Emoji-style avatars
  'icons',         // Simple icon-style avatars
  'initials',      // Letter-based avatars
  'lorelei',       // Portrait-style avatars
  'miniavs',       // Minimalist avatars
  'open-peeps',    // Diverse illustrated avatars
  'personas',      // Professional-looking avatars
  'pixel-art',     // 8-bit style avatars
];

/**
 * Avatar component that handles loading and error states
 */
export const AvatarImage = ({ user, size = 64, style = 'avataaars', className = '', fallbackInitials = null }) => {
  const avatarUrl = getUserAvatarUrl(user, style, size);
  const initials = fallbackInitials || (user?.name ? user.name.charAt(0).toUpperCase() : 'U');
  
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <img
        src={avatarUrl}
        alt={`${user?.name || 'User'} avatar`}
        className="w-full h-full rounded-full object-cover"
        onError={(e) => {
          // Fallback to initials if avatar fails to load
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
      {/* Fallback initials display */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white font-bold"
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

export default {
  generateAvatarUrl,
  getUserAvatarUrl,
  getAvailableStyles,
  AvatarImage
};
