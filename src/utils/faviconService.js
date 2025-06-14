/**
 * Favicon Service - Handles fetching and caching favicons for URLs
 * 
 * This service provides robust favicon fetching with multiple source fallbacks,
 * intelligent caching, and performance optimizations for the OpenLearn platform.
 * 
 * @see Documentation: docs/development/favicon-service.md
 * @author OpenLearn Development Team
 * @version 1.0.0
 */

class FaviconService {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
  }

  /**
   * Extract domain from URL
   */
  extractDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      console.warn('Invalid URL:', url);
      return null;
    }
  }

  /**
   * Get multiple favicon URL options for a domain
   */
  getFaviconUrls(domain) {
    if (!domain) return [];
    
    return [
      `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
      `https://www.google.com/s2/favicons?domain=${domain}&sz=16`,
      `https://${domain}/favicon.ico`,
      `https://${domain}/favicon.png`,
      `https://${domain}/apple-touch-icon.png`,
      `https://icons.duckduckgo.com/ip3/${domain}.ico`,
      `https://icon.horse/icon/${domain}`
    ];
  }

  /**
   * Test if an image URL loads successfully
   */
  testImageUrl(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => resolve(null);
      img.src = url;
      
      // Timeout after 3 seconds
      setTimeout(() => resolve(null), 3000);
    });
  }

  /**
   * Find the first working favicon URL for a domain
   */
  async findWorkingFavicon(domain) {
    const faviconUrls = this.getFaviconUrls(domain);
    
    for (const url of faviconUrls) {
      const result = await this.testImageUrl(url);
      if (result) {
        return result;
      }
    }
    
    return null;
  }

  /**
   * Get favicon URL for a resource URL with caching
   */
  async getFavicon(resourceUrl) {
    if (!resourceUrl) return null;
    
    const domain = this.extractDomain(resourceUrl);
    if (!domain) return null;

    // Check cache first
    if (this.cache.has(domain)) {
      return this.cache.get(domain);
    }

    // Check if we're already fetching this domain
    if (this.pendingRequests.has(domain)) {
      return this.pendingRequests.get(domain);
    }

    // Start fetching
    const promise = this.findWorkingFavicon(domain);
    this.pendingRequests.set(domain, promise);

    try {
      const faviconUrl = await promise;
      
      // Cache the result (even if null)
      this.cache.set(domain, faviconUrl);
      this.pendingRequests.delete(domain);
      
      return faviconUrl;
    } catch (error) {
      console.warn('Error fetching favicon for domain:', domain, error);
      this.cache.set(domain, null);
      this.pendingRequests.delete(domain);
      return null;
    }
  }

  /**
   * Preload favicons for multiple URLs
   */
  async preloadFavicons(urls) {
    const promises = urls.map(url => this.getFavicon(url));
    await Promise.allSettled(promises);
  }

  /**
   * Clear cache (useful for testing or memory management)
   */
  clearCache() {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  /**
   * Get cache stats for debugging
   */
  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      domains: Array.from(this.cache.keys())
    };
  }

  /**
   * Get fallback icon based on resource type
   */
  getFallbackIcon(resourceType) {
    const baseUrl = '/icons/';
    
    switch (resourceType?.toUpperCase()) {
      case 'VIDEO':
        return `${baseUrl}video.png`;
      case 'ARTICLE':
        return `${baseUrl}article.png`;
      case 'BLOG':
        return `${baseUrl}blog.png`;
      case 'EXTERNAL_LINK':
        return `${baseUrl}link.png`;
      default:
        return `${baseUrl}default.png`;
    }
  }

  /**
   * Get the best icon for a resource (favicon or fallback)
   */
  async getResourceIcon(resourceUrl, resourceType) {
    const favicon = await this.getFavicon(resourceUrl);
    
    if (favicon) {
      return {
        type: 'favicon',
        url: favicon,
        domain: this.extractDomain(resourceUrl)
      };
    }
    
    return {
      type: 'fallback',
      url: this.getFallbackIcon(resourceType),
      domain: null
    };
  }
}

// Create and export a singleton instance
const faviconService = new FaviconService();

export default faviconService;
