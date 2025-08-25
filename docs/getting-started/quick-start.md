# Quick Start Guide

Get OpenLearn Frontend up and running in minutes.

## Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.19.0 or higher
- **Git**: For version control

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/openlearnnitj/openlearn-frontend.git
cd openlearn-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=OpenLearn
```

### 4. Start Development Server

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |
| `npm run lint:fix` | Fix ESLint issues automatically |

## Project Structure

```
src/
├── components/        # React components
│   ├── auth/         # Authentication components
│   ├── dashboard/    # Dashboard components
│   ├── admin/        # Admin panel components
│   └── common/       # Shared components
├── pages/            # Page components
├── context/          # React Context providers
├── hooks/            # Custom React hooks
├── utils/            # Utility functions and services
└── data/             # Static data definitions
```

## What's Next?

- **[Installation Guide](./installation.md)** - Detailed setup instructions
- **[Environment Configuration](./environment.md)** - Configure your environment
- **[Development Setup](../development/setup.md)** - Set up your development workflow
- **[System Overview](../architecture/overview.md)** - Understand the architecture
