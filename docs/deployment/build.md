# Production Build

Guide for building OpenLearn Frontend for production deployment.

## Build Process Overview

The production build process optimizes the application for performance, security, and deployment.

```mermaid
graph LR
    A[Source Code] --> B[Vite Build]
    B --> C[Code Splitting]
    C --> D[Tree Shaking]
    D --> E[Minification]
    E --> F[Asset Optimization]
    F --> G[Bundle Generation]
    G --> H[Production Ready]
```

## Prerequisites

### System Requirements
- Node.js ≥ 18.0.0
- npm ≥ 8.19.0
- 4GB+ RAM available
- 2GB+ free disk space

### Environment Setup
Ensure production environment variables are configured:

```env
# Required for production
VITE_API_BASE_URL=https://api.openlearn.org.in
VITE_APP_NAME=OpenLearn
```

## Build Commands

### Standard Production Build
```bash
# Install dependencies
npm ci --only=production

# Run production build
npm run build

# Preview build locally (optional)
npm run preview
```

### Build with Analysis
```bash
# Build with bundle analysis
npm run build -- --analyze

# View bundle size report
npm run build:analyze
```

### Clean Build
```bash
# Clean previous builds
npm run clean

# Fresh production build
npm run build
```

## Build Configuration

### Vite Configuration (`vite.config.js`)

```javascript
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  build: {
    target: 'es2015',              // Browser compatibility
    minify: 'esbuild',             // Fast minification
    sourcemap: false,              // Disable source maps in production
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'react-icons', 'framer-motion'],
          'utils': ['./src/utils/dataService.js', './src/utils/progressService.js'],
        },
        // Asset naming for caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 1000     // Chunk size warning limit
  }
})
```

## Build Output Structure

```
dist/
├── assets/                     # Optimized assets
│   ├── index-[hash].js        # Main application bundle
│   ├── react-vendor-[hash].js # React dependencies
│   ├── ui-vendor-[hash].js    # UI library dependencies
│   ├── utils-[hash].js        # Utility functions
│   ├── index-[hash].css       # Compiled styles
│   └── [images]-[hash].[ext]  # Optimized images
├── index.html                 # Main HTML file
└── favicon.png               # Favicon
```

## Build Optimization

### Code Splitting Strategy

```javascript
// Automatic route-based splitting
const LazyDashboard = lazy(() => import('./pages/DashboardPage'));
const LazyAdmin = lazy(() => import('./pages/AdminPage'));

// Component with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/dashboard" element={<LazyDashboard />} />
    <Route path="/admin" element={<LazyAdmin />} />
  </Routes>
</Suspense>
```

### Tree Shaking Optimization

```javascript
// ✅ Tree-shakeable imports
import { User, Settings } from 'lucide-react';

// ❌ Avoid default imports from large libraries
import * as Icons from 'lucide-react';
```

### Asset Optimization

#### Image Optimization
```javascript
// Responsive images
<img 
  src="/hero-image.jpg"
  srcSet="/hero-image-sm.jpg 640w, /hero-image-md.jpg 1024w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt="Hero Image"
  loading="lazy"
/>
```

#### Font Optimization
```css
/* Preload critical fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Font display optimization */
font-family: 'Inter', system-ui, -apple-system, sans-serif;
font-display: swap;
```

## Performance Targets

### Bundle Size Targets
| Bundle | Target Size | Max Size |
|--------|-------------|----------|
| Main Bundle | < 200KB | 300KB |
| React Vendor | < 150KB | 200KB |
| UI Vendor | < 100KB | 150KB |
| Utilities | < 50KB | 100KB |
| **Total** | **< 500KB** | **750KB** |

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s

## Build Verification

### Automated Checks
```bash
# Run build verification script
npm run build:verify

# Check bundle sizes
npm run build:size

# Lighthouse CI (if configured)
npm run lighthouse:ci
```

### Manual Verification Checklist
- [ ] All pages load correctly
- [ ] Authentication flow works
- [ ] API calls succeed
- [ ] Images load properly
- [ ] No console errors
- [ ] Mobile responsiveness maintained
- [ ] Performance metrics within targets

## Environment-Specific Builds

### Staging Build
```bash
# Set staging environment
export NODE_ENV=production
export VITE_API_BASE_URL=https://staging-api.openlearn.org.in

# Build for staging
npm run build
```

### Production Build
```bash
# Set production environment
export NODE_ENV=production
export VITE_API_BASE_URL=https://api.openlearn.org.in
export VITE_ENABLE_ANALYTICS=true

# Build for production
npm run build
```

## Security Considerations

### Content Security Policy (CSP)
```html
<!-- Add to index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline' fonts.googleapis.com; 
               font-src 'self' fonts.gstatic.com; 
               img-src 'self' data: https:;">
```

### Environment Variable Security
```bash
# ✅ Safe for production
VITE_API_BASE_URL=https://api.openlearn.org.in
VITE_APP_NAME=OpenLearn

# ❌ Never include in build
API_SECRET_KEY=secret
DATABASE_PASSWORD=password
```

## Troubleshooting

### Common Build Issues

#### Out of Memory Error
```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 node_modules/.bin/vite build
```

#### Dependency Resolution Issues
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Asset Loading Issues
- Verify base URL configuration
- Check asset path resolution
- Ensure proper MIME types

### Build Performance Issues

#### Slow Build Times
```javascript
// Optimize build performance
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['react', 'react-dom'], // Externalize large deps
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})
```

#### Large Bundle Sizes
- Analyze bundle composition
- Remove unused dependencies
- Implement code splitting
- Optimize images and assets

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
      env:
        VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-files
        path: dist/
```

## Next Steps

After successful build:
- **[Deployment Guide](./deployment.md)** - Deploy to production environments
- **[Performance Monitoring](./performance.md)** - Monitor production performance
- **Monitoring Setup** - Configure error tracking and analytics

## Build Scripts Reference

```json
{
  "scripts": {
    "build": "vite build",
    "build:analyze": "vite build --mode analyze",
    "build:staging": "vite build --mode staging", 
    "build:verify": "npm run build && npm run preview",
    "build:size": "bundlesize",
    "clean": "rm -rf dist node_modules/.vite"
  }
}
```

This build guide ensures your OpenLearn Frontend application is optimized, secure, and ready for production deployment.
