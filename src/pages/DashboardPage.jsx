import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-black">
            OpenLearn
          </Link>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700">
              Hello, {user?.name || 'User'}
            </div>
            {(user?.role === 'GRAND_PATHFINDER' || user?.role === 'CHIEF_PATHFINDER') && (
              <Link
                to="/admin"
                className="flex items-center text-sm text-gray-700 hover:text-black mr-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.358-.035-.708-.104-1.05A5.001 5.001 0 0010 11z" clipRule="evenodd" />
                </svg>
                Admin Panel
              </Link>
            )}
            <Link
              to="/logout"
              className="flex items-center text-sm text-gray-700 hover:text-black"
            >
              <LogOut size={16} className="mr-1" />
              Logout
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-6">
            <div className="bg-[#FFDE59] p-3 rounded-full">
              <User size={24} />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">Welcome to your Dashboard</h1>
              <p className="text-gray-500">
                You're logged in as {user?.email} with role: {user?.role || 'user'}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{user?.name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium">{user?.email || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium">{user?.role || 'Standard User'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}</p>
              </div>
            </div>
          </div>

          {(user?.role === 'GRAND_PATHFINDER' || user?.role === 'CHIEF_PATHFINDER') && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-md font-medium text-blue-800">
                    {user?.role === 'GRAND_PATHFINDER' ? 'Grand Pathfinder' : 'Chief Pathfinder'} Access
                  </h3>
                  <p className="text-sm text-blue-600">You have administrator privileges with access to the admin panel</p>
                </div>
              </div>
              <div className="mt-3">
                <Link 
                  to="/admin" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Go to Admin Panel
                </Link>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Your Learning Journey</h2>
            <div className="bg-[#FFDE59] bg-opacity-10 rounded-lg p-6 text-center">
              <p className="text-lg text-gray-700 mb-4">Ready to start learning with OpenLearn?</p>
              <button 
                className="px-4 py-2 text-white rounded-md shadow-sm"
                style={{ backgroundColor: '#000000' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1F2937'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#000000'}
              >
                Explore Courses
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
