import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Handle scroll-based navbar visibility and styling
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update scroll state for styling
      setIsScrolled(currentScrollY > 20);
      
      // Show navbar when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        // Scrolling up or at the top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and not at the top
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Accelerate', href: '/accelerate' },
    { name: 'Cohorts', href: '/cohorts' },
    { name: 'Community', href: '/community' },
    { name: 'Events', href: '/events' },
  ];

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Backdrop for mobile menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm' 
          : 'bg-white/95 backdrop-blur-md border-b border-gray-100/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-18 lg:h-20">
            
            {/* Logo Section - Enhanced Apple Style */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group relative z-10"
              onClick={() => setIsOpen(false)}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFDE59]/20 to-[#FFD700]/30 rounded-xl blur-sm group-hover:blur-none transition-all duration-300 scale-110"></div>
                <img 
                  src="/favicon.png" 
                  alt="OpenLearn Logo" 
                  className="relative h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-xl transition-all duration-300 group-hover:scale-105"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 group-hover:text-black transition-colors duration-300">
                  OpenLearn
                </h1>
                <div className="h-0.5 bg-gradient-to-r from-[#FFDE59] to-[#FFD700] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-semibold text-gray-900 group-hover:text-black transition-colors duration-300">
                  OpenLearn
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation - Apple Style Pills */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center space-x-1 bg-gray-50/80 backdrop-blur-sm rounded-full p-1.5 border border-gray-200/50">
                {navItems.map((item) => {
                  const isActive = isActivePath(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`relative px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ease-out ${
                        isActive
                          ? 'bg-white text-black shadow-sm ring-1 ring-gray-200/50'
                          : 'text-gray-700 hover:text-black hover:bg-white/50'
                      }`}
                    >
                      <span className="relative z-10">{item.name}</span>
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FFDE59]/10 to-[#FFD700]/10 rounded-full"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Medium screens navigation */}
            <div className="hidden md:flex lg:hidden items-center space-x-1">
              {navItems.slice(0, 4).map((item) => {
                const isActive = isActivePath(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-[#FFDE59]/10 text-black border border-[#FFDE59]/30'
                        : 'text-gray-600 hover:text-black hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Auth Section - Enhanced Apple Style */}
            <div className="flex items-center space-x-3">
              {isAuthenticated() ? (
                <Link
                  to="/dashboard"
                  className="group relative hidden sm:flex items-center space-x-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 bg-black hover:bg-gray-800 text-white overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFDE59]/20 to-[#FFD700]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <LayoutDashboard className="h-4 w-4 relative z-10" />
                  <span className="relative z-10 hidden lg:inline">Dashboard</span>
                  <span className="relative z-10 lg:hidden">Panel</span>
                </Link>
              ) : (
                <div className="hidden sm:flex items-center space-x-2">
                  <Link
                    to="/signin"
                    className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-black transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="group relative px-4 py-2.5 rounded-full text-sm font-medium bg-black hover:bg-gray-800 text-white transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFDE59]/20 to-[#FFD700]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">Sign Up</span>
                  </Link>
                </div>
              )}

              {/* Mobile menu button - Enhanced */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative md:hidden p-2.5 rounded-xl transition-all duration-300 text-gray-600 hover:text-black hover:bg-gray-100/80 focus:outline-none focus:ring-2 focus:ring-[#FFDE59]/50"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                <div className="w-5 h-5 relative">
                  <span className={`absolute block w-5 h-0.5 bg-current transform transition-all duration-300 ${
                    isOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
                  }`}></span>
                  <span className={`absolute block w-5 h-0.5 bg-current transform transition-all duration-300 ${
                    isOpen ? 'opacity-0' : 'opacity-100'
                  }`}></span>
                  <span className={`absolute block w-5 h-0.5 bg-current transform transition-all duration-300 ${
                    isOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'
                  }`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Apple Style Slide Down */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-4 pt-2 pb-6 bg-white/95 backdrop-blur-xl border-t border-gray-200/50">
            
            {/* Mobile Navigation Items */}
            <div className="space-y-1 mb-6">
              {navItems.map((item, index) => {
                const isActive = isActivePath(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`group relative block px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#FFDE59]/10 to-[#FFD700]/10 text-black border border-[#FFDE59]/30'
                        : 'text-gray-700 hover:text-black hover:bg-gray-50'
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.name}</span>
                      {isActive && (
                        <div className="w-2 h-2 bg-gradient-to-r from-[#FFDE59] to-[#FFD700] rounded-full"></div>
                      )}
                    </div>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#FFDE59] to-[#FFD700] rounded-r-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>
            
            {/* Mobile Auth Section */}
            <div className="border-t border-gray-200/50 pt-4 space-y-3">
              {isAuthenticated() ? (
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="group relative flex items-center justify-center space-x-2 w-full px-4 py-3.5 bg-black text-white rounded-xl text-base font-medium overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFDE59]/20 to-[#FFD700]/20 opacity-0 group-active:opacity-100 transition-opacity duration-200"></div>
                  <LayoutDashboard className="h-5 w-5 relative z-10" />
                  <span className="relative z-10">Dashboard</span>
                </Link>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/signin"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-4 py-3.5 text-center text-gray-700 hover:text-black hover:bg-gray-50 rounded-xl text-base font-medium transition-all duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="group relative block w-full px-4 py-3.5 bg-black text-white rounded-xl text-base font-medium text-center overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFDE59]/20 to-[#FFD700]/20 opacity-0 group-active:opacity-100 transition-opacity duration-200"></div>
                    <span className="relative z-10">Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
