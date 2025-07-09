# 📊 SonarCloud Setup (Optional)

SonarCloud provides advanced code quality and security analysis. It's currently **disabled** in your CI/CD pipeline.

## What SonarCloud Does:
- 🐛 **Bug Detection**: Finds potential runtime errors
- 🔒 **Security Analysis**: Identifies vulnerabilities  
- 📈 **Code Quality**: Measures maintainability
- 📋 **Code Coverage**: Tracks test coverage
- 🔄 **PR Integration**: Comments on new issues in pull requests

## How to Enable (Optional):

### 1. Set Up SonarCloud Account
- Go to [sonarcloud.io](https://sonarcloud.io)
- Sign in with GitHub
- Import your `openlearn-frontend` repository

### 2. Get Your Token
- In SonarCloud: Account → Security → Generate Token
- Copy the token value

### 3. Add GitHub Secret
```
Repository → Settings → Secrets and variables → Actions
Add: SONAR_TOKEN = your-token-here
```

### 4. Enable in CI/CD
In `.github/workflows/code-quality.yml`:
```yaml
if: false # Change this to: if: true
```

### 5. Add Configuration (Optional)
Create `sonar-project.properties`:
```properties
sonar.projectKey=your-org_openlearn-frontend
sonar.organization=your-org
sonar.sources=src
sonar.exclusions=**/*.test.js,**/*.spec.js,**/node_modules/**
```

## Free Tier Includes:
- ✅ Public repositories (unlimited)
- ✅ Pull request analysis
- ✅ Quality gates
- ✅ 14-day history

## Current Status: **Disabled**
Your CI/CD works perfectly without SonarCloud. Enable it only if you want advanced code quality insights.
