# Environment Configuration Guide

## Environment Overview

OpenLearn supports multiple environment configurations to ensure smooth development, testing, and production workflows. This guide covers all aspects of environment setup and management.

## Environment Types

### Development Environment

**Purpose**: Local development with debugging and hot reload
**Configuration**: `.env.development`
**Features**:
- Hot Module Replacement (HMR)
- Debug logging enabled
- Mock data support
- Local API endpoints
- Development-only features enabled

**Setup:**
```bash
# Create development environment file
cp .env.example .env.development

# Example configuration
VITE_NODE_ENV=development
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME="OpenLearn Dev"
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
VITE_ENABLE_MOCK_DATA=true
```

### Staging Environment

**Purpose**: Pre-production testing with production-like data
**Configuration**: `.env.staging`
**Features**:
- Production build with staging APIs
- Limited debug logging
- Real data with staging backend
- Performance monitoring

**Setup:**
```bash
# Staging environment configuration
VITE_NODE_ENV=staging
VITE_API_BASE_URL=https://staging-api.openlearn.com
VITE_APP_NAME="OpenLearn Staging"
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=warn
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
```

### Production Environment

**Purpose**: Live production deployment
**Configuration**: `.env.production`
**Features**:
- Optimized production build
- Error-level logging only
- Full analytics and monitoring
- Security hardening

**Setup:**
```bash
# Production environment configuration
VITE_NODE_ENV=production
VITE_API_BASE_URL=https://api.openlearn.com
VITE_APP_NAME="OpenLearn"
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=error
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_ENABLE_PERFORMANCE_MONITORING=true
```

## Environment Variables

### Core Application Variables

```bash
# Application Identity
VITE_APP_NAME="OpenLearn"                    # Application name
VITE_APP_VERSION="1.0.0"                     # Version number
VITE_APP_DESCRIPTION="Learning Platform"     # App description
VITE_APP_URL="https://openlearn.com"         # Application URL

# Environment Settings
VITE_NODE_ENV=development                     # Environment type
VITE_DEBUG_MODE=true                          # Debug mode toggle
VITE_LOG_LEVEL=debug                          # Logging level
VITE_HOT_RELOAD=true                          # Hot reload (dev only)
```

### API Configuration

```bash
# Backend API
VITE_API_BASE_URL=http://localhost:3000       # API base URL
VITE_API_VERSION=v1                           # API version
VITE_API_TIMEOUT=30000                        # Request timeout (ms)
VITE_API_RETRY_ATTEMPTS=3                     # Retry attempts

# Authentication
VITE_JWT_SECRET_KEY=your_jwt_secret           # JWT secret
VITE_JWT_EXPIRY=24h                          # Token expiry
VITE_REFRESH_TOKEN_EXPIRY=7d                 # Refresh token expiry
VITE_SESSION_TIMEOUT=30                      # Session timeout (minutes)
```

### Third-Party Integrations

```bash
# Twitter API Integration
VITE_TWITTER_API_KEY=your_twitter_api_key
VITE_TWITTER_API_KEY_SECRET=your_twitter_api_secret
VITE_TWITTER_BEARER_TOKEN=your_twitter_bearer_token
VITE_TWITTER_ACCESS_TOKEN=your_twitter_access_token
VITE_TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_secret

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
VITE_MIXPANEL_TOKEN=your_mixpanel_token
VITE_HOTJAR_ID=your_hotjar_id

# Error Reporting (Optional)
VITE_SENTRY_DSN=your_sentry_dsn
VITE_BUGSNAG_API_KEY=your_bugsnag_key
```

### Feature Flags

```bash
# Feature Toggles
VITE_ENABLE_BETA_FEATURES=false              # Beta features
VITE_ENABLE_ANALYTICS=true                   # Analytics tracking
VITE_ENABLE_ERROR_REPORTING=true             # Error reporting
VITE_ENABLE_PERFORMANCE_MONITORING=false    # Performance monitoring
VITE_ENABLE_A_B_TESTING=false               # A/B testing
VITE_ENABLE_SOCIAL_LOGIN=true               # Social authentication
VITE_ENABLE_OFFLINE_MODE=false              # Offline capabilities
VITE_ENABLE_PWA=false                       # Progressive Web App
```

### Development-Specific Variables

```bash
# Development Tools
VITE_ENABLE_MOCK_DATA=true                   # Use mock data
VITE_ENABLE_DEV_TOOLS=true                   # Dev tools
VITE_ENABLE_REDUX_DEV_TOOLS=true            # Redux DevTools
VITE_ENABLE_REACT_DEV_TOOLS=true            # React DevTools
VITE_ENABLE_STORYBOOK=true                  # Storybook integration

# Testing
VITE_ENABLE_TEST_MODE=false                 # Test mode
VITE_TEST_USER_EMAIL=test@openlearn.com     # Test user
VITE_MOCK_API_DELAY=1000                    # Mock API delay (ms)
```

## Environment File Management

### File Structure

```
/
├── .env.example          # Template file (committed to git)
├── .env.development      # Development settings (gitignored)
├── .env.staging          # Staging settings (gitignored)
├── .env.production       # Production settings (gitignored)
├── .env.local           # Local overrides (gitignored)
└── .env.test            # Test environment (gitignored)
```

### Example Template (.env.example)

```bash
# ===========================================
# OpenLearn Environment Configuration
# ===========================================

# Application Settings
VITE_APP_NAME="OpenLearn"
VITE_APP_VERSION="1.0.0"
VITE_NODE_ENV=development

# API Configuration
VITE_API_BASE_URL=http://localhost:3000
VITE_API_VERSION=v1

# Authentication
VITE_JWT_SECRET_KEY=your_jwt_secret_here

# Twitter Integration (Optional)
VITE_TWITTER_API_KEY=your_twitter_api_key
VITE_TWITTER_API_KEY_SECRET=your_twitter_api_secret
VITE_TWITTER_BEARER_TOKEN=your_twitter_bearer_token

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=false
VITE_DEBUG_MODE=true

# Development Settings
VITE_LOG_LEVEL=debug
VITE_ENABLE_MOCK_DATA=true
```

### Security Best Practices

**Environment File Security:**
```bash
# Always add environment files to .gitignore
echo ".env*" >> .gitignore
echo "!.env.example" >> .gitignore

# Set proper file permissions
chmod 600 .env.*

# Use different secrets for each environment
# Never commit actual secrets to version control
```

**Secret Management:**
```bash
# Use secret management tools in production
# Examples: AWS Secrets Manager, Azure Key Vault, HashiCorp Vault

# For CI/CD, use encrypted environment variables
# GitHub: Repository Settings > Secrets
# GitLab: Settings > CI/CD > Variables
```

## Environment Loading

### Vite Environment Loading Order

Vite loads environment variables in the following order (later files override earlier ones):

1. `.env`                 # Loaded in all cases
2. `.env.local`           # Loaded in all cases, ignored by git
3. `.env.[mode]`          # Loaded based on NODE_ENV
4. `.env.[mode].local`    # Loaded based on NODE_ENV, ignored by git

### Custom Environment Loading

```javascript
// src/config/environment.js
const getEnvironmentConfig = () => {
  const env = import.meta.env.MODE || 'development';
  
  const baseConfig = {
    appName: import.meta.env.VITE_APP_NAME || 'OpenLearn',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
    debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
  };

  const environmentConfigs = {
    development: {
      ...baseConfig,
      logLevel: 'debug',
      enableMockData: true,
      enableDevTools: true,
    },
    staging: {
      ...baseConfig,
      logLevel: 'warn',
      enableMockData: false,
      enableDevTools: false,
    },
    production: {
      ...baseConfig,
      logLevel: 'error',
      enableMockData: false,
      enableDevTools: false,
    }
  };

  return environmentConfigs[env] || environmentConfigs.development;
};

export default getEnvironmentConfig();
```

### Environment Validation

```javascript
// src/utils/environmentValidator.js
const requiredVariables = [
  'VITE_API_BASE_URL',
  'VITE_APP_NAME',
  'VITE_NODE_ENV'
];

const optionalVariables = [
  'VITE_TWITTER_API_KEY',
  'VITE_GOOGLE_ANALYTICS_ID',
  'VITE_SENTRY_DSN'
];

export const validateEnvironment = () => {
  const missing = requiredVariables.filter(
    varName => !import.meta.env[varName]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }

  // Log missing optional variables in development
  if (import.meta.env.DEV) {
    const missingOptional = optionalVariables.filter(
      varName => !import.meta.env[varName]
    );
    
    if (missingOptional.length > 0) {
      console.warn(
        `Missing optional environment variables: ${missingOptional.join(', ')}`
      );
    }
  }
};

// Call on app initialization
validateEnvironment();
```

## Platform-Specific Configuration

### Development Environment

**Local Development Setup:**
```bash
# macOS/Linux
export NODE_ENV=development
npm run dev

# Windows (PowerShell)
$env:NODE_ENV="development"
npm run dev

# Windows (Command Prompt)
set NODE_ENV=development
npm run dev
```

**Development-Specific Features:**
```javascript
// src/config/development.js
export const developmentConfig = {
  enableHMR: true,
  enableSourceMaps: true,
  enableVerboseLogging: true,
  mockApiDelay: 500,
  bypassAuthentication: false, // For testing
  enableTestData: true,
  devServerPort: 5173,
  openBrowser: true
};
```

### CI/CD Environment Variables

**GitHub Actions:**
```yaml
# .github/workflows/deploy.yml
env:
  VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
  VITE_TWITTER_API_KEY: ${{ secrets.TWITTER_API_KEY }}
  VITE_NODE_ENV: production
```

**GitLab CI:**
```yaml
# .gitlab-ci.yml
variables:
  VITE_NODE_ENV: "production"
  VITE_API_BASE_URL: $API_BASE_URL
  VITE_TWITTER_API_KEY: $TWITTER_API_KEY
```

### Docker Environment

**Docker Compose:**
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: .
    environment:
      - VITE_NODE_ENV=development
      - VITE_API_BASE_URL=http://backend:3001
      - VITE_DEBUG_MODE=true
    env_file:
      - .env.development
```

**Dockerfile with Environment:**
```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy environment file
COPY .env.production .env

# Build with environment variables
RUN npm run build

# Runtime environment variables
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD ["npm", "start"]
```

## Troubleshooting

### Common Environment Issues

**Environment Variables Not Loading:**
```bash
# Check if variable is properly prefixed with VITE_
# ✅ Correct
VITE_API_URL=http://localhost:3000

# ❌ Incorrect (won't be loaded by Vite)
API_URL=http://localhost:3000

# Verify variables are loaded
console.log(import.meta.env.VITE_API_URL);
```

**Mode-Specific Loading Issues:**
```bash
# Check current mode
echo $NODE_ENV

# Force specific mode
npm run dev -- --mode staging

# Verify file naming
# ✅ Correct
.env.development
.env.staging
.env.production

# ❌ Incorrect
.env.dev
.env.stage
.env.prod
```

**Permission Issues:**
```bash
# Fix file permissions
chmod 644 .env.*

# Fix directory permissions
chmod 755 ./
```

This comprehensive environment configuration guide ensures proper setup and management of OpenLearn across all deployment stages and development workflows.
