# 🔐 GitHub Secrets Setup

## Required Secrets for CI/CD

### 1. Go to Repository Settings
```
Your Repository → Settings → Secrets and variables → Actions → "New repository secret"
```

### 2. Add These 3 Secrets:

#### `VERCEL_TOKEN`
- Go to [Vercel Dashboard](https://vercel.com/account/tokens)
- Click "Create Token"
- Copy the token value

#### `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`
Run in your project directory:
```bash
npx vercel link
cat .vercel/project.json
```
Copy the `orgId` and `projectId` values.

### 3. Create Production Environment
```
Repository → Settings → Environments → "New environment"
```
- Name: `production`
- Add protection rules if needed (optional)

## That's it! 
Your CI/CD will now work automatically when you push code.
