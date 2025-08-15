// Twitter API Service for fetching tweet data
// Note: This is for future use when you want to fetch tweet data server-side
// For security reasons, API keys should be stored in environment variables

const TWITTER_API_CONFIG = {
  // All credentials are loaded from environment variables for security
  apiKey: import.meta.env.VITE_TWITTER_API_KEY,
  apiKeySecret: import.meta.env.VITE_TWITTER_API_KEY_SECRET,
  bearerToken: import.meta.env.VITE_TWITTER_BEARER_TOKEN,
  accessToken: import.meta.env.VITE_TWITTER_ACCESS_TOKEN,
  accessTokenSecret: import.meta.env.VITE_TWITTER_ACCESS_TOKEN_SECRET
};

/**
 * Validate that all required Twitter API credentials are available
 * @returns {boolean} - Whether all credentials are present
 */
export const validateTwitterConfig = () => {
  const requiredKeys = ['bearerToken']; // bearerToken is minimum required for read-only access
  const missingKeys = requiredKeys.filter(key => !TWITTER_API_CONFIG[key]);
  
  if (missingKeys.length > 0) {
    console.warn('Missing Twitter API credentials:', missingKeys.join(', '));
    return false;
  }
  
  return true;
};

/**
 * Extract tweet ID from various Twitter URL formats
 * @param {string} url - Twitter URL
 * @returns {string|null} - Tweet ID or null if not found
 */
export const extractTweetId = (url) => {
  const patterns = [
    /twitter\.com\/\w+\/status\/(\d+)/,
    /x\.com\/\w+\/status\/(\d+)/,
    /status\/(\d+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
};

/**
 * Fetch tweet data from Twitter API (server-side only)
 * Note: This would typically be called from a backend service
 * @param {string} tweetId - The tweet ID
 * @returns {Promise<Object>} - Tweet data
 */
export const fetchTweetData = async (tweetId) => {
  try {
    const response = await fetch(`https://api.twitter.com/2/tweets/${tweetId}?expansions=author_id&user.fields=name,username,profile_image_url`, {
      headers: {
        'Authorization': `Bearer ${TWITTER_API_CONFIG.bearerToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tweet data:', error);
    throw error;
  }
};

/**
 * Batch fetch multiple tweets
 * @param {string[]} tweetIds - Array of tweet IDs
 * @returns {Promise<Object[]>} - Array of tweet data
 */
export const fetchMultipleTweets = async (tweetIds) => {
  try {
    const ids = tweetIds.join(',');
    const response = await fetch(`https://api.twitter.com/2/tweets?ids=${ids}&expansions=author_id&user.fields=name,username,profile_image_url&tweet.fields=created_at,public_metrics`, {
      headers: {
        'Authorization': `Bearer ${TWITTER_API_CONFIG.bearerToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching multiple tweets:', error);
    throw error;
  }
};

/**
 * Generate Twitter embed URL for a tweet
 * @param {string} tweetId - The tweet ID
 * @param {Object} options - Embed options
 * @returns {string} - Embed URL
 */
export const generateEmbedUrl = (tweetId, options = {}) => {
  const baseUrl = 'https://platform.twitter.com/embed/Tweet.html';
  const params = new URLSearchParams({
    id: tweetId,
    theme: options.theme || 'light',
    ...options
  });
  
  return `${baseUrl}?${params.toString()}`;
};

/**
 * Validate tweet URL format
 * @param {string} url - Twitter URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
export const isValidTweetUrl = (url) => {
  return extractTweetId(url) !== null;
};

export default {
  extractTweetId,
  fetchTweetData,
  fetchMultipleTweets,
  generateEmbedUrl,
  isValidTweetUrl,
  validateTwitterConfig,
  TWITTER_API_CONFIG
};
