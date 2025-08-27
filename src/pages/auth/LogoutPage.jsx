import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { PageHead } from "../../components/common";

const LogoutPage = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is not authenticated, redirect to home
    if (!isAuthenticated()) {
      navigate('/', { replace: true });
    }
    
    // Automatically redirect to home after 5 seconds
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);
  
  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center hero-pattern" style={{ backgroundColor: '#FFDE59' }}>
      <PageHead 
        title="Logout"
        description="Logout from your OpenLearn account securely. Thank you for using our gamified learning platform. See you again soon!"
        keywords="logout, sign out, session end, secure logout"
      />
      
      {/* Apple-style container */}
      <div className="bg-white/95 backdrop-blur-xl p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 w-full max-w-sm sm:max-w-md mx-4 sm:mx-6">
        
        {/* Icon section */}
        <div className="flex items-center justify-center mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
            <LogOut size={28} className="text-red-600" />
          </div>
        </div>
        
        {/* Content */}
        <div className="text-center space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-2 sm:mb-3">
              Ready to leave?
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              You'll be securely logged out from your OpenLearn account.
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="space-y-3 sm:space-y-4 pt-2">
            <button
              onClick={handleLogout}
              className="w-full flex justify-center items-center py-3 sm:py-4 px-4 bg-red-600 text-white font-medium rounded-xl sm:rounded-2xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500/20 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
            >
              Yes, log me out
            </button>
            
            <Link
              to="/dashboard"
              className="w-full flex justify-center items-center py-3 sm:py-4 px-4 border border-gray-200 text-gray-700 font-medium rounded-xl sm:rounded-2xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500/20 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
            >
              Cancel
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          
          {/* Auto redirect notice */}
          <div className="pt-4 sm:pt-6 border-t border-gray-100">
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              You'll be automatically redirected to the home page in a few seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
