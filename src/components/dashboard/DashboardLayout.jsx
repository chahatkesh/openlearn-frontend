import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, Settings, ChevronDown, Home, X, User } from 'lucide-react';
import UserProfileSection from './UserProfileSection';
import ProgressService from '../../utils/progressService';
import OptimizedDashboardService from '../../utils/optimizedDashboardService';
import { getUserAvatarUrl } from '../../utils/avatarService.jsx';

const DashboardLayout = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

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
      {/* Simplified Header with Clean Design */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-200 shadow-sm">
        {/* Simple gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FFDE59] to-[#FFD700]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center group">
                <div className="relative">
                  <img 
                    className="h-10 w-10 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-200" 
                    src="/favicon.png" 
                    alt="OpenLearn Logo" 
                  />
                  {/* Subtle glow on hover */}
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

            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Profile Button - Shows sidebar */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMobileSidebar(!showMobileSidebar);
                }}
                className="flex md:hidden items-center justify-center w-10 h-10 rounded-lg bg-gray-100/60 hover:bg-[#FFDE59]/15 transition-all duration-300 group"
              >
                <User className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
              </button>

              {/* Enhanced Admin Panel Link */}
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

              {/* Desktop User Menu */}
              <div className="hidden md:block relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100/70 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={getUserAvatarUrl(user, 'avataaars', 40)}
                        alt={`${user?.name} avatar`}
                        className="h-9 w-9 rounded-full ring-2 ring-gray-200 group-hover:ring-[#FFDE59]/50 transition-all duration-300"
                      />
                      {/* Simplified status indicator */}
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
                  </div>
                </button>

                {/* Desktop Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-fadeIn">
                    {/* Simple decorative accent */}
                    <div className="absolute top-0 left-4 right-4 h-0.5 bg-[#FFDE59]"></div>
                    
                    {/* User Info Section */}
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
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#FFDE59]/10 hover:text-gray-900 transition-all duration-200 group"
                      >
                        <Home className="h-4 w-4 mr-3" />
                        Home
                      </Link>
                      
                      {(user?.role === 'GRAND_PATHFINDER' || user?.role === 'CHIEF_PATHFINDER') && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#FFDE59]/10 hover:text-gray-900 transition-all duration-200 group sm:hidden"
                        >
                          <Settings className="h-4 w-4 mr-3" />
                          Admin Panel
                        </Link>
                      )}
                    </div>

                    {/* Logout Section */}
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

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div className="md:hidden fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMobileSidebar(false)} />
          
          {/* Sidebar */}
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-out">
            {/* Sidebar Header */}
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

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <UserProfileSection user={user} dashboardData={dashboardData} isMobile={true} />
            </div>

            {/* Sidebar Footer */}
            <div className="border-t border-gray-100 p-4 space-y-2">
              <Link
                to="/"
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-[#FFDE59]/10 hover:text-gray-900 transition-all duration-200 rounded-lg group"
                onClick={() => setShowMobileSidebar(false)}
              >
                <Home className="h-4 w-4 mr-3" />
                Home
              </Link>
              
              {(user?.role === 'GRAND_PATHFINDER' || user?.role === 'CHIEF_PATHFINDER') && (
                <Link
                  to="/admin"
                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-[#FFDE59]/10 hover:text-gray-900 transition-all duration-200 rounded-lg group"
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

      {/* Main Content - Clean Responsive Layout */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Layout: Sidebar + Content */}
          <div className="hidden md:flex gap-6 p-6">
            {/* Desktop Sidebar - Clean fixed width */}
            <div className="w-80 flex-shrink-0">
              <div className="sticky top-24 max-h-[calc(100vh-140px)] overflow-y-auto dashboard-scroll">
                <UserProfileSection user={user} dashboardData={dashboardData} isMobile={false} />
              </div>
            </div>
            
            {/* Desktop Main Content - Flexible width */}
            <div className="flex-1 min-w-0">
              <div className="max-h-[calc(100vh-140px)] overflow-y-auto dashboard-scroll">
                <Outlet />
              </div>
            </div>
          </div>

          {/* Mobile Layout: Clean Full Width */}
          <div className="md:hidden">
            <div className="px-4 py-6">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
