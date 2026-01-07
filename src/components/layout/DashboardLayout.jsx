import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LogOut, 
  X, 
  Menu,
  ArrowLeft,
  Shield,
  MoreVertical,
  Maximize
} from 'lucide-react';
import { 
  RiDashboardLine, 
  RiTrophyLine, 
  RiBarChartBoxLine, 
  RiUserLine 
} from 'react-icons/ri';
import { getUserAvatarUrl } from '../../utils/helpers/boringAvatarsUtils';
import AdminService from "../../utils/api/adminService";
import PageHead from '../common/PageHead';

const DashboardLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const navigationItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      description: 'Track your progress and continue learning',
      icon: RiDashboardLine, 
      exact: true 
    },
    { 
      path: '/dashboard/leagues', 
      label: 'Leagues', 
      description: 'Browse and join learning leagues',
      icon: RiTrophyLine 
    },
    { 
      path: '/dashboard/leaderboard', 
      label: 'Leaderboard', 
      description: 'See top performers and rankings',
      icon: RiBarChartBoxLine 
    },
    { 
      path: '/dashboard/profile', 
      label: 'Profile', 
      description: 'View and edit your profile',
      icon: RiUserLine 
    }
  ];

  const getCurrentPage = () => {
    for (const item of navigationItems) {
      if (item.exact && location.pathname === item.path) {
        return { label: item.label, description: item.description };
      }
      if (!item.exact) {
        if (item.path === '/dashboard/leagues') {
          // Special case for leagues: show "Leagues" for both /dashboard/leagues and /dashboard/league/:id
          if (location.pathname.startsWith('/dashboard/leagues') || 
              location.pathname.startsWith('/dashboard/league')) {
            return { label: item.label, description: item.description };
          }
        } else if (location.pathname.startsWith(item.path)) {
          return { label: item.label, description: item.description };
        }
      }
    }
    return { label: 'Dashboard', description: 'Track your progress and continue learning' };
  };

  const currentPage = getCurrentPage();

  const NavItem = ({ item, onClick }) => {
    let isActive;
    
    if (item.exact) {
      isActive = location.pathname === item.path;
    } else if (item.path === '/dashboard/leagues') {
      // Special case for leagues: activate for both /dashboard/leagues and /dashboard/league/:id
      isActive = location.pathname.startsWith('/dashboard/leagues') || 
                location.pathname.startsWith('/dashboard/league');
    } else {
      isActive = location.pathname.startsWith(item.path);
    }
    
    const Icon = item.icon;

    return (
      <Link
        to={item.path}
        onClick={onClick}
        className={`group relative flex items-center px-4 py-3 mx-2 rounded-xl transition-all duration-300 ease-out ${
          isActive
            ? 'bg-[#FFDE59]/20 text-gray-900 border border-[#FFDE59]/30 backdrop-blur-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 hover:backdrop-blur-sm'
        }`}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-[#FFDE59] rounded-r-full" />
        )}
        <Icon 
          className={`w-5 h-5 mr-3 transition-all duration-300 ${
            isActive ? 'text-black scale-110' : 'text-gray-500 group-hover:text-gray-700'
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
        title={currentPage.label}
        description={`${currentPage.label} - OpenLearn Dashboard`}
      />
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl border-r border-gray-200/50 transform transition-transform duration-300 ease-out flex flex-col ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        {/* Logo Section */}
        <div className="flex items-center justify-between px-6 h-[73px] border-b border-gray-200/50">
          <Link 
            to="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
            onClick={() => setIsSidebarOpen(false)}
          >
            <div className="relative">
              <img 
                src="/favicon.png" 
                alt="OpenLearn Logo" 
                className="h-10 w-10 rounded-xl transition-all duration-200"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">OpenLearn</h1>
            </div>
          </Link>
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

        {/* Bottom Section - User Profile */}
        <div className="p-4 border-t border-gray-200/50">
          {/* Admin Button for Pathfinders */}
          {AdminService.isAdmin(user) && (
            <Link
              to="/admin"
              className="flex items-center px-4 py-3 mx-2 mb-3 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-blue-50/80 hover:backdrop-blur-sm transition-all duration-300"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Shield className="w-5 h-5 mr-3" />
              <span className="font-medium">Admin Panel</span>
            </Link>
          )}
          
          {/* User Profile Card */}
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl">
            <img
              src={getUserAvatarUrl(user)}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-gray-200/50"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {user?.name || user?.displayName || 'User'}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              {/* Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200/50 py-2 z-50">
                  <Link
                    to="/logout"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setIsSidebarOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Sign Out</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 bg-white/95 border-b border-gray-100">
          <div className="flex items-center justify-between px-6 h-[73px]">
            {/* Left Side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentPage.label}</h1>
                <p className="hidden sm:block text-sm text-gray-500">{currentPage.description}</p>
              </div>
            </div>

            {/* Right Side - Fullscreen */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Toggle Fullscreen"
              >
                <Maximize className="w-5 h-5" />
              </button>
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
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
