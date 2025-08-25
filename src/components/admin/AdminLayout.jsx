import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, Users, Archive, BookOpen, Award, Layers, Calendar, FileText, Database, Activity, ClipboardList, ChevronDown, Settings, Home, Search } from 'lucide-react';
import PageHead from '../common/PageHead';
import { getUserAvatarUrl } from '../../utils/boringAvatarsUtils';

const AdminLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowUserMenu(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Extract the current tab from the URL path
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/') {
      // Default to cohorts for non-GRAND_PATHFINDER users, users for GRAND_PATHFINDER
      return user?.role === 'GRAND_PATHFINDER' ? 'users' : 'cohorts';
    }
    const tabMatch = path.match(/\/admin\/(.+)/);
    const requestedTab = tabMatch ? tabMatch[1] : 'users';
    
    // If trying to access restricted tabs but not GRAND_PATHFINDER, redirect to cohorts
    if ((requestedTab === 'users' || requestedTab === 'specializations') && user?.role !== 'GRAND_PATHFINDER') {
      return 'cohorts';
    }
    
    return requestedTab;
  };

  const activeTab = getCurrentTab();

  // Define all available tabs
  const allTabs = [
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
    { id: 'cohorts', label: 'Cohorts', icon: Archive, path: '/admin/cohorts' },
    { id: 'leagues', label: 'Leagues', icon: BookOpen, path: '/admin/leagues' },
    { id: 'specializations', label: 'Specializations', icon: Award, path: '/admin/specializations' },
    { id: 'weeks', label: 'Weeks', icon: Calendar, path: '/admin/weeks' },
    { id: 'sections', label: 'Days', icon: FileText, path: '/admin/sections' },
    { id: 'resources', label: 'Resources', icon: Database, path: '/admin/resources' },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList, path: '/admin/assignments' }
  ];

  // Filter tabs based on user role - only GRAND_PATHFINDER can see Users and Specializations tabs
  const tabs = allTabs.filter(tab => {
    if (tab.id === 'users' || tab.id === 'specializations') {
      return user?.role === 'GRAND_PATHFINDER';
    }
    return true; // Show all other tabs for any admin role
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHead 
        title="Admin Panel - OpenLearn"
        description="Manage users, cohorts, leagues, specializations, weeks, sections, resources, and assignments"
      />
      
      {/* Enhanced Admin Header - Dashboard Style */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-200 shadow-sm">
        {/* Accent line with admin colors */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-800 to-gray-600"></div>
        
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
                  {/* Subtle glow on hover with admin theme */}
                  <div className="absolute inset-0 rounded-lg bg-gray-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900 group-hover:text-black transition-colors duration-200">
                    OpenLearn
                  </h1>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-gray-500 font-medium">Admin Panel</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-white">
                      Admin
                    </span>
                  </div>
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
                  placeholder="Search admin features..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500 bg-gray-50 focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Dashboard Link */}
              <Link
                to="/dashboard"
                className="hidden sm:flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100/60 hover:bg-gray-200/60 rounded-lg transition-all duration-300 hover:scale-105 border border-gray-200/50 hover:border-gray-300/60 group"
              >
                <Home className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Dashboard
              </Link>

              {/* Enhanced User Menu */}
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
                        className="h-9 w-9 rounded-full ring-2 ring-gray-200 group-hover:ring-gray-400/50 transition-all duration-300"
                      />
                      {/* Admin status indicator */}
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-gray-800 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-semibold text-gray-900 truncate max-w-[120px] group-hover:text-black transition-colors duration-200">
                        {user?.name || 'Admin'}
                      </p>
                      <p className="text-xs text-gray-500 capitalize group-hover:text-gray-600 transition-colors duration-200">
                        {user?.role?.toLowerCase().replace('_', ' ') || 'Admin'}
                      </p>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-all duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Enhanced Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-fadeIn">
                    {/* Admin theme accent */}
                    <div className="absolute top-0 left-4 right-4 h-0.5 bg-gray-800"></div>
                    
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
                            {user?.name || 'Admin'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email}
                          </p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-white mt-1">
                            {user?.role?.toLowerCase().replace('_', ' ') || 'Admin'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        to="/"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group"
                      >
                        <Home className="h-4 w-4 mr-3" />
                        Home
                      </Link>
                      
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group sm:hidden"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Dashboard
                      </Link>
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

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Admin Panel Title */}
        <div className="mb-8 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-6 border border-gray-200/30">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Admin Panel</h1>
              <p className="text-sm text-gray-600 leading-relaxed">
                Manage users, cohorts, leagues, specializations, weeks, sections, resources, and assignments
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Admin Tabs */}
        <div className="mb-6 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 p-1 shadow-sm">
          <nav className="flex space-x-1" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`${
                    isActive
                      ? 'bg-gray-800 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                  } flex items-center px-4 py-3 rounded-lg font-medium text-sm transition-all duration-300 whitespace-nowrap group relative overflow-hidden`}
                >
                  {/* Active tab background effect */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 opacity-100"></div>
                  )}
                  
                  <Icon size={16} className={`mr-2 relative z-10 ${isActive ? 'text-white' : 'group-hover:scale-110'} transition-all duration-300`} />
                  <span className="relative z-10">{tab.label}</span>
                  
                  {/* Hover effect for inactive tabs */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-lg"></div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Enhanced Tab Content */}
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-xl p-8 border border-gray-200/50">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
