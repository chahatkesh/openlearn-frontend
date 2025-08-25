import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LogOut, 
  Users, 
  Archive, 
  BookOpen, 
  Award, 
  Calendar, 
  FileText, 
  Database, 
  ClipboardList, 
  Home, 
  X, 
  Menu,
  ArrowLeft,
  Settings
} from 'lucide-react';
import PageHead from '../common/PageHead';
import { getUserAvatarUrl } from '../../utils/boringAvatarsUtils';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Close sidebar when clicking outside (only on mobile)
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only handle click outside on mobile devices
      if (window.innerWidth >= 1024) return; // lg breakpoint
      
      // Don't close if clicking on the menu button or inside the sidebar
      const sidebar = document.querySelector('[data-sidebar]');
      const menuButton = document.querySelector('[data-menu-button]');
      
      if (
        sidebar && 
        !sidebar.contains(event.target) && 
        menuButton && 
        !menuButton.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isSidebarOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSidebarOpen]);

  // Close mobile menu when switching to desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  // Define all available navigation items
  const allNavigationItems = [
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
    { id: 'cohorts', label: 'Cohorts', icon: Archive, path: '/admin/cohorts' },
    { id: 'leagues', label: 'Leagues', icon: BookOpen, path: '/admin/leagues' },
    { id: 'specializations', label: 'Specializations', icon: Award, path: '/admin/specializations' },
    { id: 'weeks', label: 'Weeks', icon: Calendar, path: '/admin/weeks' },
    { id: 'sections', label: 'Days', icon: FileText, path: '/admin/sections' },
    { id: 'resources', label: 'Resources', icon: Database, path: '/admin/resources' },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList, path: '/admin/assignments' }
  ];

  // Filter navigation items based on user role with specific permissions per role
  const navigationItems = allNavigationItems.filter(item => {
    const userRole = user?.role;
    
    switch (userRole) {
      case 'GRAND_PATHFINDER':
        // Grand Pathfinder can see all routes
        return true;
        
      case 'CHIEF_PATHFINDER':
        // Chief Pathfinder can see: Leagues, Weeks, Days, Resources, Assignments
        return ['leagues', 'weeks', 'sections', 'resources', 'assignments'].includes(item.id);
        
      case 'PATHFINDER':
        // Pathfinder can see: Weeks, Days, Resources
        return ['weeks', 'sections', 'resources'].includes(item.id);
        
      default:
        // For backward compatibility, show all items for other admin roles (ADMIN)
        return true;
    }
  });

  const getCurrentPage = () => {
    const path = location.pathname;
    for (const item of navigationItems) {
      if (path === item.path || path.startsWith(item.path + '/')) {
        return item.label;
      }
    }
    return 'Admin Dashboard';
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
    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
    const Icon = item.icon;

    return (
      <Link
        to={item.path}
        onClick={onClick}
        className={`group relative flex items-center px-4 py-3 mx-2 rounded-xl transition-all duration-300 ease-out ${
          isActive
            ? 'bg-gradient-to-r from-gray-800/20 to-gray-700/20 text-gray-900 border border-gray-800/30 backdrop-blur-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 hover:backdrop-blur-sm'
        }`}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-gray-800 to-gray-600 rounded-r-full" />
        )}
        <Icon 
          className={`w-5 h-5 mr-3 transition-all duration-300 ${
            isActive ? 'text-gray-800 scale-110' : 'text-gray-500 group-hover:text-gray-700'
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
        description={`${currentPage} - OpenLearn Admin Dashboard`}
      />
      
      {/* Sidebar */}
      <div 
        data-sidebar
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl border-r border-gray-200/50 transform transition-transform duration-300 ease-out flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src="/favicon.png" 
                alt="OpenLearn Logo" 
                className="h-10 w-10 rounded-xl transition-all duration-200"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">OpenLearn</h1>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-500">Admin Panel</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-white">
                  Admin
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsSidebarOpen(false);
            }}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-2 flex-1">
          <div className="mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 mb-3">
              Admin Dashboard
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
          
          {/* Dashboard Link */}
          <Link
            to="/dashboard"
            className="flex items-center px-4 py-3 mx-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 hover:backdrop-blur-sm transition-all duration-300"
            onClick={() => setIsSidebarOpen(false)}
          >
            <Home className="w-5 h-5 mr-3 text-gray-500" />
            <span className="font-medium text-gray-700">Dashboard</span>
          </Link>

          {/* Home Link */}
          <Link
            to="/"
            className="flex items-center px-4 py-3 mx-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 hover:backdrop-blur-sm transition-all duration-300"
            onClick={() => setIsSidebarOpen(false)}
          >
            <ArrowLeft className="w-5 h-5 mr-3 text-gray-500" />
            <span className="font-medium text-gray-700">Back to Home</span>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 mx-2 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50/80 hover:backdrop-blur-sm transition-all duration-300"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left Side */}
            <div className="flex items-center space-x-4">
              <button
                data-menu-button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSidebarOpen(true);
                }}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentPage}</h1>
                <p className="text-sm text-gray-500">Manage users, cohorts, leagues, and content</p>
              </div>
            </div>

            {/* Right Side - User profile info */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="text-right">
                <h2 className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || 'Admin'}
                </h2>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-white mt-1">
                  {user?.role?.toLowerCase().replace('_', ' ') || 'Admin'}
                </span>
              </div>
              <img
                src={getUserAvatarUrl(user, 'avataaars', 40)}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-gray-800/50"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-3 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={(e) => {
            e.stopPropagation();
            setIsSidebarOpen(false);
          }}
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
              You'll need to sign in again to access the admin panel and continue managing the platform.
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

export default AdminLayout;
