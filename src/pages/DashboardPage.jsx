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
