import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import PageHead from '../components/common/PageHead';

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <PageHead 
        title="Logout"
        description="Logout from your OpenLearn account securely. Thank you for using our gamified learning platform. See you again soon!"
        keywords="logout, sign out, session end, secure logout"
      />
      
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-[#FFDE59] rounded-full p-3">
            <LogOut size={28} className="text-black" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2">Ready to leave?</h1>
        <p className="text-gray-600 text-center mb-8">
          You'll be securely logged out from your OpenLearn account.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={handleLogout}
            className="w-full flex justify-center items-center py-2 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            Yes, log me out
          </button>
          
          <Link
            to="/dashboard"
            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 text-black font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <p className="text-xs text-gray-500 text-center mt-6">
          You'll be automatically redirected to the home page in a few seconds.
        </p>
      </div>
    </div>
  );
};

export default LogoutPage;
