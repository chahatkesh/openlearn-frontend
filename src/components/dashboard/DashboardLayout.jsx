import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LogOut, 
  Settings, 
  ChevronDown, 
  Home, 
  X, 
  User,
  LayoutDashboard,
  TrendingUp,
  Menu
} from 'lucide-react';
import UserProfileSection from './UserProfileSection';
import ProgressService from '../../utils/progressService';
import OptimizedDashboardService from '../../utils/optimizedDashboardService';
import { getUserAvatarUrl } from '../../utils/avatarService.jsx';
import PageHead from '../common/PageHead';

const DashboardLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [dashboardData, setDashboardData] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Navigation items with proper routing
  const navigationItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      description: 'Overview and progress'
    },
    {
      id: 'leaderboard',
      name: 'Leaderboard',
      icon: TrendingUp,
      path: '/dashboard/leaderboard',
      description: 'Community rankings'
    },
    {
      id: 'profile',
      name: 'My Profile',
      icon: User,
      path: '/dashboard/profile',
      description: 'Personal information'
    }
  ];

  // Get current active page
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'dashboard';
    if (path.includes('/leaderboard')) return 'leaderboard';
    if (path.includes('/profile')) return 'profile';
    if (path.includes('/league/')) return 'dashboard'; // League detail page goes to dashboard
    return 'dashboard';
  };

  const activePage = getCurrentPage();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
      setShowMobileSidebar(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // OPTIMIZATION: Fetch dashboard data at the top level with background prefetching
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // First load essential data quickly
        const data = await ProgressService.getUserDashboard();
        setDashboardData(data);
        
        // Then prefetch additional data in background for faster subsequent loads
        OptimizedDashboardService.prefetchUserData();
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    if (user?.status !== 'PENDING') {
      fetchDashboardData();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHead 
        title="Dashboard - OpenLearn"
        description="Access your personalized OpenLearn dashboard. Track learning progress, browse leagues, view leaderboard, and manage your learning journey."
        keywords="student dashboard, learning progress, leagues, leaderboard, OpenLearn"
      />

      {/* Modern Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 border-b border-gray-200 shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FFDE59] to-[#FFD700]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMobileSidebar(!showMobileSidebar);
                }}
                className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>

              {/* Logo */}
              <Link to="/dashboard" className="flex items-center group">
                <div className="relative">
                  <img 
                    className="h-10 w-10 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-200" 
                    src="/favicon.png" 
                    alt="OpenLearn Logo" 
                  />
                  <div className="absolute inset-0 rounded-lg bg-[#FFDE59]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </div>
                <div className="ml-3 hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900 group-hover:text-black transition-colors duration-200">
                    OpenLearn
                  </h1>
                  <p className="text-xs text-gray-500 font-medium">Dashboard</p>
                </div>
              </Link>
            </div>

            {/* Header Right Section */}
            <div className="flex items-center space-x-4">
              {/* Admin Panel Link */}
              {(user?.role === 'GRAND_PATHFINDER' || user?.role === 'CHIEF_PATHFINDER') && (
                <Link
                  to="/admin"
                  className="hidden sm:flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100/60 hover:bg-[#FFDE59]/15 rounded-lg transition-all duration-300 hover:scale-105 border border-gray-200/50 hover:border-[#FFDE59]/40 group"
                >
                  <Settings className="h-4 w-4 mr-2 group-hover:rotate-45 transition-transform duration-300" />
                  <span className="hidden lg:inline">Admin Panel</span>
                  <span className="lg:hidden">Admin</span>
                </Link>
              )}

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100/70 transition-all duration-300 group"
                >
                  <div className="relative">
                    <img
                      src={getUserAvatarUrl(user, 'avataaars', 40)}
                      alt={`${user?.name} avatar`}
                      className="h-9 w-9 rounded-full ring-2 ring-gray-200 group-hover:ring-[#FFDE59]/50 transition-all duration-300"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-semibold text-gray-900 truncate max-w-[120px] group-hover:text-black transition-colors duration-200">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 capitalize group-hover:text-gray-600 transition-colors duration-200">
                      {user?.role?.toLowerCase().replace('_', ' ') || 'Student'}
                    </p>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-all duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-fadeIn">
                    <div className="absolute top-0 left-4 right-4 h-0.5 bg-[#FFDE59]"></div>
                    
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <img
                          src={getUserAvatarUrl(user, 'avataaars', 48)}
                          alt={`${user?.name} avatar`}
                          className="h-12 w-12 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {user?.name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email}
                          </p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#FFDE59]/20 text-gray-800 mt-1">
                            {user?.role?.toLowerCase().replace('_', ' ') || 'Student'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        to="/"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#FFDE59]/10 hover:text-gray-900 transition-all duration-200"
                      >
                        <Home className="h-4 w-4 mr-3" />
                        Home
                      </Link>
                      
                      {(user?.role === 'GRAND_PATHFINDER' || user?.role === 'CHIEF_PATHFINDER') && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#FFDE59]/10 hover:text-gray-900 transition-all duration-200 sm:hidden"
                        >
                          <Settings className="h-4 w-4 mr-3" />
                          Admin Panel
                        </Link>
                      )}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 pt-1">
                      <Link
                        to="/logout"
                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign out
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-80 bg-white border-r border-gray-200 flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={getUserAvatarUrl(user, 'avataaars', 56)}
                  alt={`${user?.name} avatar`}
                  className="h-14 w-14 rounded-full ring-3 ring-[#FFDE59]/30"
                />
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-gray-900 truncate">
                  {user?.name || 'User'}
                </h2>
                <p className="text-sm text-gray-500 truncate">
                  {user?.email}
                </p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#FFDE59]/20 text-gray-800 mt-1">
                  {user?.role?.toLowerCase().replace('_', ' ') || 'Student'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-[#FFDE59] text-gray-900 shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}`}>
                      {item.name}
                    </p>
                    <p className={`text-xs ${isActive ? 'text-gray-700' : 'text-gray-500 group-hover:text-gray-600'}`}>
                      {item.description}
                    </p>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer - User Stats */}
          <div className="p-4 border-t border-gray-100">
            <div className="bg-gradient-to-r from-[#FFDE59]/10 to-[#FFD700]/10 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Quick Stats</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Enrolled Leagues</span>
                  <span className="font-medium text-gray-900">{dashboardData?.enrollments?.length || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Total Progress</span>
                  <span className="font-medium text-gray-900">
                    {dashboardData?.overallProgress?.percentage || 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {showMobileSidebar && (
          <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMobileSidebar(false)} />
            
            {/* Mobile Sidebar Content */}
            <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-out flex flex-col">
              {/* Mobile Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-[#FFDE59]/10 to-[#FFD700]/10">
                <div className="flex items-center space-x-3">
                  <img
                    src={getUserAvatarUrl(user, 'avataaars', 40)}
                    alt={`${user?.name} avatar`}
                    className="h-10 w-10 rounded-full ring-2 ring-[#FFDE59]/30"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 truncate max-w-[180px]">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role?.toLowerCase().replace('_', ' ') || 'Student'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMobileSidebar(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 p-4 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      onClick={() => setShowMobileSidebar(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                        isActive 
                          ? 'bg-[#FFDE59] text-gray-900 shadow-sm' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}`}>
                          {item.name}
                        </p>
                        <p className={`text-xs ${isActive ? 'text-gray-700' : 'text-gray-500 group-hover:text-gray-600'}`}>
                          {item.description}
                        </p>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Sidebar Footer */}
              <div className="border-t border-gray-100 p-4 space-y-2">
                <Link
                  to="/"
                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-[#FFDE59]/10 hover:text-gray-900 transition-all duration-200 rounded-lg"
                  onClick={() => setShowMobileSidebar(false)}
                >
                  <Home className="h-4 w-4 mr-3" />
                  Home
                </Link>
                
                {(user?.role === 'GRAND_PATHFINDER' || user?.role === 'CHIEF_PATHFINDER') && (
                  <Link
                    to="/admin"
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-[#FFDE59]/10 hover:text-gray-900 transition-all duration-200 rounded-lg"
                    onClick={() => setShowMobileSidebar(false)}
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Admin Panel
                  </Link>
                )}
                
                <Link
                  to="/logout"
                  className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 rounded-lg"
                  onClick={() => setShowMobileSidebar(false)}
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign out
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
