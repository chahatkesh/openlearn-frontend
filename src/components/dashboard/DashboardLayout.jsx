import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LogOut, 
  Home, 
  X, 
  User,
  TrendingUp,
  Menu,
  Trophy,
  ArrowLeft
} from 'lucide-react';
import { getUserAvatarUrl } from '../../utils/avatarService.jsx';
import PageHead from '../common/PageHead';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navigationItems = [
    { 
      path: '/dashboard', 
      label: 'Overview', 
      icon: Home, 
      exact: true 
    },
    { 
      path: '/dashboard/leagues', 
      label: 'Leagues', 
      icon: Trophy 
    },
    { 
      path: '/dashboard/leaderboard', 
      label: 'Leaderboard', 
      icon: TrendingUp 
    },
    { 
      path: '/dashboard/profile', 
      label: 'Profile', 
      icon: User 
    }
  ];

  const getCurrentPage = () => {
    for (const item of navigationItems) {
      if (item.exact && location.pathname === item.path) {
        return item.label;
      }
      if (!item.exact && location.pathname.startsWith(item.path)) {
        return item.label;
      }
    }
    return 'Dashboard';
  };

  const currentPage = getCurrentPage();

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const NavItem = ({ item, onClick }) => {
    const isActive = item.exact 
      ? location.pathname === item.path 
      : location.pathname.startsWith(item.path);
    const Icon = item.icon;

    return (
      <Link
        to={item.path}
        onClick={onClick}
        className={`group relative flex items-center px-4 py-3 mx-2 rounded-xl transition-all duration-300 ease-out ${
          isActive
            ? 'bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 text-gray-900 shadow-lg shadow-yellow-500/10 border border-yellow-400/30 backdrop-blur-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 hover:backdrop-blur-sm hover:shadow-md'
        }`}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-r-full" />
        )}
        <Icon 
          className={`w-5 h-5 mr-3 transition-all duration-300 ${
            isActive ? 'text-yellow-600 scale-110' : 'text-gray-500 group-hover:text-gray-700'
          }`} 
        />
        <span className={`font-medium transition-all duration-300 ${
          isActive ? 'text-gray-900 font-semibold' : 'text-gray-700'
        }`}>
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <PageHead 
        title={currentPage}
        description={`${currentPage} - OpenLearn Dashboard`}
      />
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl border-r border-gray-200/50 shadow-xl transform transition-transform duration-300 ease-out flex flex-col ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        {/* Logo Section */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">OpenLearn</h1>
              <p className="text-sm text-gray-500">Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-2 flex-1">
          <div className="mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 mb-3">
              Dashboard
            </p>
          </div>
          {navigationItems.map((item) => (
            <NavItem 
              key={item.path} 
              item={item} 
              onClick={() => setIsSidebarOpen(false)} 
            />
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200/50 space-y-2">
          <div className="mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 mb-3">
              Quick Actions
            </p>
          </div>
          
          {/* Home Link */}
          <Link
            to="/"
            className="flex items-center px-4 py-3 mx-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 hover:backdrop-blur-sm hover:shadow-md transition-all duration-300"
            onClick={() => setIsSidebarOpen(false)}
          >
            <ArrowLeft className="w-5 h-5 mr-3 text-gray-500" />
            <span className="font-medium text-gray-700">Back to Home</span>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 mx-2 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50/80 hover:backdrop-blur-sm hover:shadow-md transition-all duration-300"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left Side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentPage}</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.name?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'User'}!</p>
              </div>
            </div>

            {/* Right Side - User profile info */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="text-right">
                <h2 className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || user?.displayName || 'User'}
                </h2>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
              <img
                src={getUserAvatarUrl(user)}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-yellow-400/50 shadow-sm"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6 max-w-md w-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Sign Out</h3>
                <p className="text-sm text-gray-500">Are you sure you want to sign out?</p>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-6">
              You'll need to sign in again to access your dashboard and continue your learning journey.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={cancelLogout}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
