/**
 * Avatar Utility Functions
 * Pure JavaScript functions for avatar generation
 */

/**
 * Generate avatar URL using DiceBear API
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
  'big-ears',      // Big ears avatars
  'bottts',        // Robot avatars
  'croodles',      // Doodle-style avatars
  'fun-emoji',     // Emoji-style avatars
  'identicon',     // Geometric avatars
  'initials',      // Letter-based avatars
  'lorelei',       // Female avatars
  'miniavs',       // Minimal avatars
  'open-peeps',    // Open source people avatars
  'personas',      // Persona-based avatars
  'pixel-art',     // Pixel art avatars
];

/**
 * Generate initials from a name
 * @param {string} name - Full name
 * @returns {string} Initials (max 2 characters)
 */
export const generateInitials = (name) => {
  if (!name) return 'AN';
  
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};
