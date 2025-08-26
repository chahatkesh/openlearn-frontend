# Installation Guide

## System Requirements

### Minimum Requirements

- **Operating System**: Windows 10, macOS 10.15, or Linux (Ubuntu 18.04+)
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space for dependencies and build artifacts
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Recommended Requirements

- **Node.js**: Version 20.x (LTS)
- **npm**: Version 10.x
- **RAM**: 16GB for optimal development experience
- **Storage**: 10GB free space
- **Code Editor**: VS Code with recommended extensions

## Installation Methods

### Method 1: Standard Installation (Recommended)

**Step 1: Install Node.js**
```bash
# Check if Node.js is installed
node --version
npm --version

# If not installed, download from https://nodejs.org/
# Or use a version manager (recommended)
```

**Step 2: Install Node Version Manager (Optional but Recommended)**
```bash
# For macOS/Linux - install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or source the profile
source ~/.bashrc

# Install and use Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# For Windows - install nvm-windows
# Download from: https://github.com/coreybutler/nvm-windows
```

**Step 3: Clone and Setup Project**
```bash
# Clone the repository
git clone https://github.com/openlearn/openlearn-frontend.git

# Navigate to project directory
cd openlearn-frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.development

# Start development server
npm run dev
```

### Method 2: Docker Installation

**Step 1: Install Docker**
```bash
# Install Docker Desktop
# Download from: https://www.docker.com/products/docker-desktop

# Verify installation
docker --version
docker-compose --version
```

**Step 2: Run with Docker**
```bash
# Clone repository
git clone https://github.com/openlearn/openlearn-frontend.git
cd openlearn-frontend

# Build and run with Docker Compose
docker-compose up --build

# Access application at http://localhost:3000
```

**Docker Configuration:**
```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

### Method 3: Package Manager Installation

**Using Yarn:**
```bash
# Install Yarn
npm install -g yarn

# Clone and setup
git clone https://github.com/openlearn/openlearn-frontend.git
cd openlearn-frontend

# Install dependencies
yarn install

# Start development
yarn dev
```

**Using pnpm:**
```bash
# Install pnpm
npm install -g pnpm

# Clone and setup
git clone https://github.com/openlearn/openlearn-frontend.git
cd openlearn-frontend

# Install dependencies
pnpm install

# Start development
pnpm dev
```

## Environment Configuration

### Development Environment Setup

**Create Environment File:**
```bash
# Copy the example environment file
cp .env.example .env.development

# Edit the file with your settings
nano .env.development
```

**Environment Variables:**
```bash
# .env.development
# API Configuration
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME="OpenLearn"
VITE_APP_VERSION="1.0.0"

# Authentication
VITE_JWT_SECRET_KEY=your_jwt_secret_for_development

# Social Media Integration (Optional for development)
VITE_TWITTER_API_KEY=your_twitter_api_key
VITE_TWITTER_API_KEY_SECRET=your_twitter_api_secret
VITE_TWITTER_BEARER_TOKEN=your_twitter_bearer_token
VITE_TWITTER_ACCESS_TOKEN=your_twitter_access_token
VITE_TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_secret

# Development Settings
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug

# Feature Flags
VITE_ENABLE_BETA_FEATURES=true
VITE_ENABLE_ANALYTICS=false
```

### Production Environment Setup

**Production Environment File:**
```bash
# .env.production
VITE_API_BASE_URL=https://api.openlearn.com
VITE_APP_NAME="OpenLearn"
VITE_APP_VERSION="1.0.0"

# Security
VITE_JWT_SECRET_KEY=your_secure_production_jwt_secret

# Social Media
VITE_TWITTER_API_KEY=your_production_twitter_api_key
VITE_TWITTER_API_KEY_SECRET=your_production_twitter_api_secret
VITE_TWITTER_BEARER_TOKEN=your_production_twitter_bearer_token

# Production Settings
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=error

# Feature Flags
VITE_ENABLE_BETA_FEATURES=false
VITE_ENABLE_ANALYTICS=true
```

## IDE Setup

### VS Code Configuration

**Install VS Code:**
```bash
# Download from https://code.visualstudio.com/
# Or install via package manager

# macOS with Homebrew
brew install --cask visual-studio-code

# Windows with Chocolatey
choco install vscode

# Linux (Ubuntu/Debian)
sudo snap install code --classic
```

**Recommended Extensions:**
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-react-native",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-git-extension"
  ]
}
```

**VS Code Settings:**
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "files.associations": {
    "*.jsx": "javascriptreact"
  },
  "tailwindCSS.includeLanguages": {
    "javascript": "javascript",
    "html": "HTML"
  },
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

### WebStorm Configuration

**Install WebStorm:**
```bash
# Download from https://www.jetbrains.com/webstorm/
# 30-day free trial, then paid license required
```

**Recommended Plugins:**
- Tailwind CSS
- ESLint
- Prettier
- GitToolBox
- React snippets

## Verification

### Installation Verification

**Check Node.js and npm:**
```bash
# Check versions
node --version    # Should be 18.0.0 or higher
npm --version     # Should be 8.0.0 or higher

# Check npm global packages
npm list -g --depth=0
```

**Verify Project Setup:**
```bash
# Navigate to project directory
cd openlearn-frontend

# Check if dependencies are installed
npm list --depth=0

# Verify scripts are available
npm run

# Check for any vulnerabilities
npm audit

# Run development server
npm run dev
```

**Expected Output:**
```bash
> openlearn-frontend@1.0.0 dev
> vite

  VITE v5.0.0  ready in 1.2s

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### Browser Verification

**Access the Application:**
1. Open browser to `http://localhost:5173`
2. Verify landing page loads correctly
3. Check browser console for any errors
4. Test basic navigation

**Expected Browser Console Output:**
```
[OpenLearn] Application started in development mode
[OpenLearn] API Base URL: http://localhost:3000
[OpenLearn] Debug mode: enabled
```

## Troubleshooting

### Common Installation Issues

**Node.js Version Conflicts:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Use specific Node.js version
nvm use 20.10.0
```

**Permission Issues (macOS/Linux):**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

**Port Already in Use:**
```bash
# Find process using port 5173
lsof -ti:5173

# Kill the process
kill -9 $(lsof -ti:5173)

# Or use different port
npm run dev -- --port 3001
```

**Build Issues:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm ci

# Try building again
npm run build
```

### Platform-Specific Issues

**Windows Specific:**
```bash
# Enable long paths (as Administrator)
git config --system core.longpaths true

# Use PowerShell instead of Command Prompt
# Install Windows Subsystem for Linux (WSL) for better compatibility
```

**macOS Specific:**
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Update Homebrew
brew update && brew upgrade
```

**Linux Specific:**
```bash
# Install required build tools
sudo apt-get update
sudo apt-get install build-essential

# For CentOS/RHEL
sudo yum groupinstall "Development Tools"
```

### Getting Help

**Documentation:**
- [Official Documentation](./docs/)
- [API Documentation](./docs/api/)
- [Development Guide](./docs/development/)

**Community Support:**
- GitHub Issues: Report bugs and feature requests
- Discord: Real-time community support
- Email: support@openlearn.com

**Debug Information:**
```bash
# Generate debug information
npm run debug:info

# This will output:
# - Node.js version
# - npm version
# - Operating system
# - Project dependencies
# - Environment variables (sanitized)
```

This installation guide ensures a smooth setup process for the OpenLearn platform across different operating systems and development environments.
