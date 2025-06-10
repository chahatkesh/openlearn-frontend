import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import PendingApprovalPage from '../components/dashboard/PendingApprovalPage';
import UserProfileSection from '../components/dashboard/UserProfileSection';
import LearningProgressSection from '../components/dashboard/LearningProgressSection';

const DashboardPage = () => {
  const { user } = useAuth();

  // Show pending approval page if user is not approved
  if (user?.status === 'PENDING') {
    return <PendingApprovalPage user={user} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-black flex items-center">
            <div className="bg-[#FFDE59] w-8 h-8 rounded-full mr-2 flex items-center justify-center text-black font-bold">
              O
            </div>
            OpenLearn
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700">
              Hello, {user?.name || 'User'}
            </div>
            
            {(user?.role === 'GRAND_PATHFINDER' || user?.role === 'CHIEF_PATHFINDER') && (
              <Link
                to="/admin"
                className="flex items-center text-sm text-gray-700 hover:text-black px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.358-.035-.708-.104-1.05A5.001 5.001 0 0010 11z" clipRule="evenodd" />
                </svg>
                Admin Panel
              </Link>
            )}
            
            <Link
              to="/logout"
              className="flex items-center text-sm text-gray-700 hover:text-black px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut size={16} className="mr-1" />
              Logout
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Section - 25% Width (User Profile) */}
          <div className="lg:col-span-1">
            <UserProfileSection user={user} />
          </div>
          
          {/* Right Section - 75% Width (Learning Progress) */}
          <div className="lg:col-span-3">
            <LearningProgressSection user={user} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
