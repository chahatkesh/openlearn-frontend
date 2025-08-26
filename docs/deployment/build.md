# Build and Deployment Guide

## Build Configuration

### Vite Build System

**Production Build Configuration:**
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  build: {
    target: 'es2015',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'react-icons', 'framer-motion'],
          'utils': ['./src/utils/api/dataService.js', './src/utils/api/progressService.js'],
        }
      }
    },
    // Increase chunk size warning limit to 1000kb
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})
```

### Environment Configuration

**Environment Variables:**
```bash
# .env.production
VITE_API_BASE_URL=https://api.openlearn.com
VITE_TWITTER_API_KEY=your_production_api_key
VITE_TWITTER_API_KEY_SECRET=your_production_api_secret
VITE_TWITTER_BEARER_TOKEN=your_production_bearer_token
VITE_TWITTER_ACCESS_TOKEN=your_production_access_token
VITE_TWITTER_ACCESS_TOKEN_SECRET=your_production_access_secret
```

```bash
# .env.staging
VITE_API_BASE_URL=https://staging-api.openlearn.com
VITE_TWITTER_API_KEY=your_staging_api_key
# ... staging credentials
```

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000
# Development credentials (optional)
```

## Build Process

### Development Build

**Local Development:**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Development server features:
# - Hot Module Replacement (HMR)
# - Fast rebuilds with Vite
# - Source maps for debugging
# - Automatic browser refresh
```

### Production Build

**Build Commands:**
```bash
# Clean previous builds
npm run clean

# Type check (if using TypeScript)
npm run type-check

# Lint code for quality
npm run lint

# Fix linting issues
npm run lint:fix

# Security audit
npm run security:audit

# Build for production
npm run build

# Preview production build locally
npm run preview
```

**Build Output Structure:**
```
dist/
├── index.html                 # Main HTML file
├── assets/                    # Static assets
│   ├── index-[hash].js        # Main application bundle
│   ├── react-vendor-[hash].js # React libraries chunk
│   ├── ui-vendor-[hash].js    # UI libraries chunk
│   ├── utils-[hash].js        # Utility functions chunk
│   └── index-[hash].css       # Compiled CSS
├── favicon.png                # Favicon
├── logo.jpg                   # Application logo
└── [other static assets]      # Images, fonts, etc.
```

### Build Optimization

**Bundle Analysis:**
```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.js for analysis
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    // ... other plugins
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true
    })
  ]
});

# Build and analyze
npm run build
# Opens stats.html with bundle visualization
```

**Performance Metrics:**
- **Total Bundle Size**: ~800KB (gzipped)
- **React Vendor Chunk**: ~140KB (gzipped)
- **UI Vendor Chunk**: ~120KB (gzipped)
- **Utils Chunk**: ~80KB (gzipped)
- **Main App Chunk**: ~460KB (gzipped)

## Deployment Platforms

### Vercel Deployment

**Vercel Configuration:**
```json
{
  "name": "openlearn-frontend",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "@api-base-url",
    "VITE_TWITTER_API_KEY": "@twitter-api-key"
  }
}
```

**Deployment Steps:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Set environment variables
vercel env add VITE_API_BASE_URL production
vercel env add VITE_TWITTER_API_KEY production
```

### Netlify Deployment

**Netlify Configuration:**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  VITE_API_BASE_URL = "https://api.openlearn.com"

[context.staging.environment]
  VITE_API_BASE_URL = "https://staging-api.openlearn.com"
```

**Deployment Process:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to draft
netlify deploy

# Deploy to production
netlify deploy --prod

# Set environment variables
netlify env:set VITE_API_BASE_URL "https://api.openlearn.com"
```

### AWS S3 + CloudFront

**Build and Deploy Script:**
```bash
#!/bin/bash
# deploy-aws.sh

set -e

# Build the application
echo "Building application..."
npm run build

# Upload to S3
echo "Uploading to S3..."
aws s3 sync dist/ s3://openlearn-frontend-bucket --delete

# Invalidate CloudFront cache
echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/*"

echo "Deployment complete!"
```

**S3 Bucket Policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::openlearn-frontend-bucket/*"
    }
  ]
}
```

## CI/CD Pipeline

### GitHub Actions

**Production Deployment Workflow:**
```yaml
# .github/workflows/deploy-production.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run lint
      run: npm run lint
      
    - name: Run type check
      run: npm run type-check
      
    - name: Security audit
      run: npm run security:audit
      
    - name: Build application
      run: npm run build
      env:
        VITE_API_BASE_URL: ${{ secrets.PRODUCTION_API_URL }}
        VITE_TWITTER_API_KEY: ${{ secrets.TWITTER_API_KEY }}
        VITE_TWITTER_API_KEY_SECRET: ${{ secrets.TWITTER_API_SECRET }}
        VITE_TWITTER_BEARER_TOKEN: ${{ secrets.TWITTER_BEARER_TOKEN }}
        
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
        working-directory: ./
```

**Staging Deployment Workflow:**
```yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging

on:
  push:
    branches: [develop]
  pull_request:
    branches: [main]

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm run test
      
    - name: Build application
      run: npm run build
      env:
        VITE_API_BASE_URL: ${{ secrets.STAGING_API_URL }}
        
    - name: Deploy to staging
      run: |
        # Deploy to staging environment
        npm run deploy:staging
```

### Docker Deployment

**Dockerfile:**
```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

**Nginx Configuration:**
```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    sendfile on;
    keepalive_timeout 65;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # Cache static assets
        location /assets/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    }
}
```

**Docker Compose for Development:**
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:80"
    environment:
      - VITE_API_BASE_URL=http://backend:3001
    depends_on:
      - backend
    networks:
      - openlearn-network

  backend:
    image: openlearn-backend:latest
    ports:
      - "3001:3001"
    networks:
      - openlearn-network

networks:
  openlearn-network:
    driver: bridge
```

## Performance Optimization

### Build Performance

**Optimization Strategies:**
```javascript
// vite.config.js optimizations
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split node_modules into separate chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('lucide-react') || id.includes('framer-motion')) {
              return 'ui-vendor';
            }
            return 'vendor';
          }
          
          // Split large feature modules
          if (id.includes('/src/pages/admin/')) {
            return 'admin';
          }
          if (id.includes('/src/components/features/dashboard/')) {
            return 'dashboard';
          }
        }
      }
    }
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion'
    ]
  }
});
```

### Runtime Performance

**Asset Optimization:**
```bash
# Image optimization script
#!/bin/bash

echo "Optimizing images..."

# Optimize PNG images
find public -name "*.png" -exec pngquant --quality=65-90 --ext .png --force {} \;

# Optimize JPEG images  
find public -name "*.jpg" -exec jpegoptim --max=85 --strip-all {} \;

# Generate WebP versions
find public -name "*.png" -o -name "*.jpg" | while read img; do
  cwebp -q 85 "$img" -o "${img%.*}.webp"
done

echo "Image optimization complete!"
```

**Bundle Size Monitoring:**
```json
{
  "scripts": {
    "build:analyze": "npm run build && npx vite-bundle-analyzer dist",
    "size-limit": "npx size-limit",
    "lighthouse": "npx lighthouse-ci autorun"
  },
  "size-limit": [
    {
      "path": "dist/assets/index-*.js",
      "limit": "500 KB"
    },
    {
      "path": "dist/assets/react-vendor-*.js", 
      "limit": "150 KB"
    }
  ]
}
```

## Environment Management

### Multi-Environment Setup

**Environment-Specific Builds:**
```bash
# Build for different environments
npm run build:dev     # Development build
npm run build:staging # Staging build  
npm run build:prod    # Production build
```

**Package.json Scripts:**
```json
{
  "scripts": {
    "build:dev": "cross-env NODE_ENV=development vite build --mode development",
    "build:staging": "cross-env NODE_ENV=staging vite build --mode staging", 
    "build:prod": "cross-env NODE_ENV=production vite build --mode production",
    "deploy:staging": "npm run build:staging && vercel deploy",
    "deploy:prod": "npm run build:prod && vercel deploy --prod"
  }
}
```

### Feature Flags

**Feature Flag Implementation:**
```javascript
// src/utils/featureFlags.js
const featureFlags = {
  development: {
    NEW_DASHBOARD: true,
    BETA_ASSIGNMENTS: true,
    DEBUG_MODE: true
  },
  staging: {
    NEW_DASHBOARD: true,
    BETA_ASSIGNMENTS: false,
    DEBUG_MODE: false
  },
  production: {
    NEW_DASHBOARD: false,
    BETA_ASSIGNMENTS: false,
    DEBUG_MODE: false
  }
};

export const isFeatureEnabled = (flagName) => {
  const env = import.meta.env.MODE || 'development';
  return featureFlags[env]?.[flagName] || false;
};

// Usage in components
const Dashboard = () => {
  const showNewDashboard = isFeatureEnabled('NEW_DASHBOARD');
  
  return showNewDashboard ? <NewDashboard /> : <LegacyDashboard />;
};
```

This comprehensive build and deployment guide ensures reliable, optimized deployment of the OpenLearn platform across multiple environments with proper CI/CD automation and performance monitoring.
