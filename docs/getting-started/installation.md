# Installation Guide

Comprehensive guide for setting up OpenLearn Frontend in different environments.

## System Requirements

### Minimum Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **Node.js**: 18.0.0 or higher
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 1GB free space

### Recommended Development Tools
- **Code Editor**: VS Code with recommended extensions
- **Terminal**: Modern terminal with shell support
- **Browser**: Latest Chrome, Firefox, or Safari for development

## Installation Methods

### Method 1: Standard Installation

```bash
# 1. Clone the repository
git clone https://github.com/openlearnnitj/openlearn-frontend.git
cd openlearn-frontend

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env

# 4. Start development
npm run dev
```

### Method 2: Development with specific Node version

```bash
# Using nvm (Node Version Manager)
nvm install 18
nvm use 18

# Then follow standard installation
npm install
npm run dev
```

## VS Code Setup

### Recommended Extensions

Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Workspace Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript", "javascriptreact"],
  "tailwindCSS.includeLanguages": {
    "javascript": "javascript",
    "javascriptreact": "javascriptreact"
  }
}
```

## Troubleshooting

### Common Issues

#### Node.js Version Issues
```bash
# Check your Node.js version
node --version

# Should be 18.0.0 or higher
# If not, install the correct version
```

#### Port Already in Use
```bash
# If port 5173 is busy, Vite will suggest an alternative
# Or specify a custom port:
npm run dev -- --port 3000
```

#### Installation Failures
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Environment Variables Not Loading
- Ensure `.env` file is in the project root
- Variables must start with `VITE_`
- Restart development server after changes

### Getting Help

If you encounter issues:

1. Check the [troubleshooting section](#troubleshooting)
2. Search existing GitHub issues
3. Create a new issue with:
   - Operating system and version
   - Node.js version
   - Error messages and stack traces
   - Steps to reproduce

## Next Steps

After successful installation:

- **[Environment Configuration](./environment.md)** - Set up your environment variables
- **[Development Setup](../development/setup.md)** - Configure your development workflow
- **[System Overview](../architecture/overview.md)** - Learn about the system architecture
