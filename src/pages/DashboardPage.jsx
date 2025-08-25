import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Settings, ChevronDown, Search, Home } from 'lucide-react';
import PendingApprovalPage from '../components/dashboard/PendingApprovalPage';
import UserProfileSection from '../components/dashboard/UserProfileSection';
import LearningProgressSection from '../components/dashboard/LearningProgressSection';
import ProgressService from '../utils/progressService';
import PageHead from '../components/common/PageHead';
import { getUserAvatarUrl } from '../utils/boringAvatarsUtils';

const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowUserMenu(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Fetch dashboard data at the top level
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await ProgressService.getUserDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    if (user?.status !== 'PENDING') {
      fetchDashboardData();
    }
  }, [user]);

  // Show pending approval page if user is not approved
  if (user?.status === 'PENDING') {
    return <PendingApprovalPage user={user} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHead 
        title="Dashboard"
        description="Access your personalized OpenLearn dashboard. Track learning progress, view achievements, manage assignments, and compete in leagues with fellow NIT Jalandhar students."
        keywords="student dashboard, learning progress, achievements, assignments, league competition, personal learning"
      />
      
      {/* Simplified Header with Clean Design */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-200 shadow-sm">
        {/* Simple gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FFDE59] to-[#FFD700]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <div className="relative">
                  <img 
                    className="h-10 w-10 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-200" 
                    src="/favicon.png" 
                    alt="OpenLearn Logo" 
                  />
                  {/* Subtle glow on hover */}
                  <div className="absolute inset-0 rounded-lg bg-[#FFDE59]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900 group-hover:text-black transition-colors duration-200">
                    OpenLearn
                  </h1>
                  <p className="text-xs text-gray-500 font-medium">Dashboard</p>
                </div>
              </Link>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search leagues, assignments..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFDE59]/50 focus:border-[#FFDE59] bg-gray-50 focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            {/* Simplified Right Section */}
            <div className="flex items-center space-x-4">
              {/* Enhanced Admin Panel Link */}
              {(user?.role === 'GRAND_PATHFINDER' || user?.role === 'CHIEF_PATHFINDER') && (
                <Link
                  to="/admin"
                  className="hidden sm:flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100/60 hover:bg-[#FFDE59]/15 rounded-lg transition-all duration-300 hover:scale-105 border border-gray-200/50 hover:border-[#FFDE59]/40 group"
                >
                  <Settings className="h-4 w-4 mr-2 group-hover:rotate-45 transition-transform duration-300" />
                  Admin Panel
                </Link>
              )}

              {/* Simplified User Menu */}
              <div className="relative">
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
                    <div className="hidden sm:block text-left">
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

                {/* Simplified Dropdown Menu */}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[calc(100vh-120px)]">
          {/* Left Section - 25% Width (User Profile) */}
          <div className="lg:col-span-1 h-full">
            <div className="sticky top-24 h-[calc(100vh-140px)] overflow-y-auto dashboard-scroll">
              <UserProfileSection user={user} dashboardData={dashboardData} />
            </div>
          </div>
          
          {/* Right Section - 75% Width (Learning Progress) */}
          <div className="lg:col-span-3 h-full">
            <div className="h-[calc(100vh-140px)] overflow-y-auto dashboard-scroll">
              <LearningProgressSection user={user} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
