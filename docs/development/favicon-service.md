# Favicon Service

## Overview

The Favicon Service is a comprehensive solution for fetching and displaying website favicons in the OpenLearn resources interface. It enhances the user experience by providing visual recognition of resource sources through website icons.

## Architecture

### Service Location
- **Path**: `src/utils/faviconService.js`
- **Type**: Singleton service
- **Dependencies**: None (vanilla JavaScript)

### Integration Points
- **LeagueDetailPage**: Resources table favicon display
- **ResourceIcon Component**: Favicon rendering with fallbacks
- **Note Modal**: Enhanced resource preview

## Features

### 🔄 Multi-Source Favicon Fetching
The service attempts to fetch favicons from multiple sources in order of reliability:

1. **Google Favicon Service** (Primary)
   - `https://www.google.com/s2/favicons?domain={domain}&sz=32`
   - `https://www.google.com/s2/favicons?domain={domain}&sz=16`

2. **Direct Website Sources**
   - `https://{domain}/favicon.ico`
   - `https://{domain}/favicon.png`
   - `https://{domain}/apple-touch-icon.png`

3. **Alternative Services**
   - `https://icons.duckduckgo.com/ip3/{domain}.ico`
   - `https://icon.horse/icon/{domain}`

### 🚀 Performance Optimizations

#### Intelligent Caching
```javascript
// Cache structure
cache: Map<domain, faviconUrl | null>
pendingRequests: Map<domain, Promise>
```

#### Request Deduplication
- Multiple requests for the same domain are batched
- Prevents redundant network calls
- Improves loading performance

#### Timeout Handling
- 3-second timeout per favicon request
- Prevents hanging requests
- Graceful degradation to fallbacks

### 🎨 Fallback System

When favicons are unavailable, the service provides type-based fallback icons:

| Resource Type | Icon | Color |
|---------------|------|-------|
| VIDEO | Play (▶️) | Red |
| ARTICLE | Document (📄) | Blue |
| BLOG | Book (📚) | Purple |
| EXTERNAL_LINK | External Link (🔗) | Green |
| DEFAULT | File (📁) | Gray |

## Usage

### Basic Implementation

```javascript
import FaviconService from '../utils/faviconService';

// Get favicon for a URL
const faviconUrl = await FaviconService.getFavicon('https://example.com');

// Get complete icon data with fallback
const iconData = await FaviconService.getResourceIcon(
  'https://example.com', 
  'ARTICLE'
);
```

### React Component Integration

```jsx
const ResourceIcon = ({ resource }) => {
  const [faviconData, setFaviconData] = useState(null);
  
  useEffect(() => {
    FaviconService.getResourceIcon(resource.url, resource.type)
      .then(setFaviconData);
  }, [resource]);
  
  if (faviconData?.type === 'favicon') {
    return <img src={faviconData.url} alt="favicon" />;
  }
  
  return <TypeIcon type={resource.type} />;
};
```

### Bulk Preloading

```javascript
// Preload favicons for multiple URLs
const urls = resources.map(r => r.url);
await FaviconService.preloadFavicons(urls);
```

## API Reference

### Core Methods

#### `getFavicon(url: string): Promise<string | null>`
Fetches favicon URL for a given resource URL.

**Parameters:**
- `url`: The resource URL to get favicon for

**Returns:**
- Promise resolving to favicon URL or null if not found

#### `getResourceIcon(url: string, type: string): Promise<IconData>`
Gets the best available icon (favicon or fallback) for a resource.

**Parameters:**
- `url`: The resource URL
- `type`: Resource type (VIDEO, ARTICLE, etc.)

**Returns:**
- Promise resolving to IconData object:
  ```javascript
  {
    type: 'favicon' | 'fallback',
    url: string,
    domain: string | null
  }
  ```

#### `preloadFavicons(urls: string[]): Promise<void>`
Preloads favicons for multiple URLs to improve performance.

**Parameters:**
- `urls`: Array of URLs to preload favicons for

### Utility Methods

#### `extractDomain(url: string): string | null`
Extracts domain from a URL.

#### `clearCache(): void`
Clears the favicon cache (useful for testing).

#### `getCacheStats(): object`
Returns cache statistics for debugging.

## Configuration

### Timeout Settings
```javascript
// Default timeout: 3000ms
// Configurable in testImageUrl method
```

### Cache Management
```javascript
// Automatic cache management
// No manual configuration required
// Cache persists for session duration
```

## Error Handling

### Network Failures
- Graceful fallback to next favicon source
- No user-visible errors
- Automatic retry mechanism

### Invalid URLs
- Domain extraction failure handling
- Fallback to type-based icons
- Console warnings for debugging

### Image Load Failures
- Automatic fallback cascade
- Error event handling on img elements
- Seamless user experience

## Performance Considerations

### Memory Usage
- Favicon URLs cached as strings (minimal memory impact)
- Automatic cleanup of pending requests
- No image data caching (relies on browser cache)

### Network Impact
- Minimal: Only fetches small favicon files
- Batched requests prevent network flooding
- Timeout prevents hanging connections

### UI Performance
- Non-blocking async operations
- Progressive enhancement
- Skeleton loading states

## Integration with Resources Table

### Visual Enhancements
1. **Resource Recognition**: Users instantly identify familiar websites
2. **Professional Appearance**: Modern, polished interface
3. **Visual Hierarchy**: Clear distinction between resource types
4. **Loading States**: Smooth skeleton animations

### UX Improvements
1. **Reduced Cognitive Load**: Visual cues over text parsing
2. **Faster Scanning**: Quick visual identification
3. **Brand Familiarity**: Leverages user's website recognition
4. **Enhanced Trust**: Professional appearance builds confidence

## Maintenance

### Monitoring
- Console warnings for failed favicon fetches
- Cache statistics available via `getCacheStats()`
- Network request monitoring in DevTools

### Updates
- Service is version-independent
- Fallback icons can be updated in `/public/icons/`
- Favicon sources can be modified in `getFaviconUrls()`

### Testing
```javascript
// Clear cache for testing
FaviconService.clearCache();

// Check cache stats
console.log(FaviconService.getCacheStats());
```

## Browser Compatibility

### Requirements
- Modern browsers with Image API
- Promise support
- URL constructor support

### Fallbacks
- Graceful degradation to type icons
- No JavaScript errors in unsupported browsers
- Progressive enhancement approach

## Security Considerations

### CORS Handling
- Uses public favicon services (Google, DuckDuckGo)
- No authentication required
- Cross-origin requests handled gracefully

### Privacy
- No user data sent to favicon services
- Only domain names used in requests
- No tracking or analytics

### Content Security Policy
- Compatible with standard CSP headers
- Uses HTTPS endpoints only
- No inline scripts or styles

## Future Enhancements

### Potential Improvements
1. **Local Icon Storage**: Cache favicons locally for offline use
2. **Custom Icon Override**: Allow manual icon assignment
3. **Icon Quality Detection**: Prefer higher quality favicons
4. **Batch API Integration**: Use bulk favicon APIs when available
5. **Service Worker Caching**: Implement SW-based caching strategy

### Scalability
- Current implementation scales to hundreds of resources
- Cache can be extended with size limits
- Database integration possible for persistent caching
