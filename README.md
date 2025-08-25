# OpenLearn Frontend

Modern React-based learning management system with gamification and role-based education.

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.8-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

## 🎯 Overview

OpenLearn is an educational platform designed for NIT Jalandhar that combines structured learning with gamification elements. Students progress through leagues, earn achievements, and compete in a collaborative learning environment.

## ✨ Key Features

- **🏆 Learning Leagues**: Competitive learning tracks (ML, Finance, Quantum Computing, Soft Skills, IoT, CP)
- **📊 Progress Tracking**: Real-time learning progress with completion analytics
- **🎖️ Achievement System**: Badges and milestones for learning accomplishments
- **👥 Role-Based Access**: Progressive roles from Pioneer to Grand Pathfinder
- **📱 Responsive Design**: Mobile-first design optimized for all devices
- **🔐 Secure Authentication**: JWT-based auth with role-based permissions
- **⚡ Modern Stack**: React 19, Vite, Tailwind CSS for optimal performance

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18.0.0
- npm ≥ 8.19.0

### Installation

```bash
# Clone the repository
git clone https://github.com/openlearnnitj/openlearn-frontend.git
cd openlearn-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint for code quality |
| `npm run lint:fix` | Fix ESLint issues automatically |

## 📁 Project Structure

```
src/
├── components/         # React components
│   ├── auth/          # Authentication components
│   ├── dashboard/     # User dashboard
│   ├── admin/         # Admin panel
│   ├── landingPage/   # Public pages
│   └── common/        # Shared components
├── pages/             # Route-based pages
├── context/           # React Context providers
├── hooks/             # Custom React hooks
├── utils/             # Utility functions and services
└── data/              # Static data definitions
```

## 🔧 Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.0 | Frontend framework |
| **Vite** | 6.3.5 | Build tool and dev server |
| **Tailwind CSS** | 4.1.8 | Utility-first CSS |
| **React Router** | 7.6.2 | Client-side routing |
| **Framer Motion** | 12.18.1 | Animations |
| **Lucide React** | Latest | Icon library |

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) directory:

- **[📖 Complete Documentation](./docs/README.md)** - Full documentation index
- **[🚀 Quick Start Guide](./docs/getting-started/quick-start.md)** - Get started in minutes
- **[💻 Installation Guide](./docs/getting-started/installation.md)** - Detailed setup
- **[🏗️ System Architecture](./docs/architecture/overview.md)** - Technical overview
- **[🔌 API Reference](./docs/api/authentication.md)** - API documentation
- **[🛠️ Development Guide](./docs/development/setup.md)** - Development workflow

## 🔐 Environment Variables

Required environment variables:

```env
VITE_API_BASE_URL=your_backend_api_url
```

See [Environment Configuration](./docs/getting-started/environment.md) for complete details.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/development/contributing.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **📖 Documentation**: [docs/README.md](./docs/README.md)
- **🐛 Issues**: [GitHub Issues](https://github.com/openlearnnitj/openlearn-frontend/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/openlearnnitj/openlearn-frontend/discussions)

---

**Built with ❤️ by the OpenLearn Team at NIT Jalandhar**
