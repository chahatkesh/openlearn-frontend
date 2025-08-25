# Environment Configuration

Configure your development environment for OpenLearn Frontend.

## Environment Variables

OpenLearn Frontend uses environment variables for configuration. All client-side environment variables must be prefixed with `VITE_`.

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API endpoint | `http://localhost:3000` |

### Optional Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `VITE_APP_NAME` | Application name | `OpenLearn` | `OpenLearn Dev` |
| `VITE_ENABLE_ANALYTICS` | Enable analytics | `false` | `true` |
| `VITE_APP_VERSION` | App version display | Auto-detected | `1.0.0` |

## Environment Files

### Development Environment (`.env`)

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# App Configuration
VITE_APP_NAME=OpenLearn Development
VITE_ENABLE_ANALYTICS=false

# Development Features
VITE_DEBUG_MODE=true
```

### Production Environment (`.env.production`)

```env
# API Configuration
VITE_API_BASE_URL=https://api.openlearn.org.in

# App Configuration
VITE_APP_NAME=OpenLearn
VITE_ENABLE_ANALYTICS=true

# Production Settings
VITE_DEBUG_MODE=false
```

### Environment Template (`.env.example`)

The repository includes a `.env.example` file with all available variables:

```bash
cp .env.example .env
```

## Configuration by Environment

### Local Development

For local development, ensure your backend is running on the specified port:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Staging Environment

For staging deployments:

```env
VITE_API_BASE_URL=https://staging-api.openlearn.org.in
VITE_APP_NAME=OpenLearn Staging
```

### Production Environment

For production deployments:

```env
VITE_API_BASE_URL=https://api.openlearn.org.in
VITE_APP_NAME=OpenLearn
VITE_ENABLE_ANALYTICS=true
```

## Deployment Platforms

### Vercel

Vercel automatically loads environment variables from your dashboard. Set them in:
- **Project Settings** → **Environment Variables**

### Netlify

For Netlify deployments, add environment variables in:
- **Site Settings** → **Environment Variables**

### Docker

For Docker deployments, use environment variables in your Docker compose:

```yaml
version: '3'
services:
  frontend:
    build: .
    environment:
      - VITE_API_BASE_URL=http://localhost:3000
    ports:
      - "3000:3000"
```

## Security Considerations

### Environment Variable Security

⚠️ **Important**: Environment variables prefixed with `VITE_` are exposed to the client-side code and will be visible in the browser.

**Do NOT include sensitive information** such as:
- API keys
- Database credentials
- Private tokens
- Secrets

### Safe Practices

✅ **Safe for VITE_ variables**:
- API endpoints
- Feature flags
- Public configuration
- App metadata

❌ **Never include**:
- Private API keys
- Database passwords
- JWT secrets
- Internal service URLs

## Validation

### Environment Variable Validation

The application validates required environment variables on startup. Missing required variables will cause the application to fail with clear error messages.

### Testing Configuration

To test your environment configuration:

```bash
# Check if variables are loaded correctly
npm run dev

# Look for console messages about missing variables
```

## Troubleshooting

### Common Issues

#### Variables Not Loading
- Ensure variables start with `VITE_`
- Restart development server after changes
- Check file is named `.env` (not `.env.txt`)

#### API Connection Issues
- Verify `VITE_API_BASE_URL` is correct
- Check if backend is running
- Ensure no trailing slashes in URL

#### Build Issues
- Ensure all required variables are set
- Check production environment variables
- Verify no undefined variables in code

## Next Steps

- **[Development Setup](../development/setup.md)** - Set up your development workflow
- **[System Overview](../architecture/overview.md)** - Understand the system architecture
- **[API Reference](../api/authentication.md)** - Learn about API integration
