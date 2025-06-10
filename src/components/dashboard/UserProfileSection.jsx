import React from 'react';
import { User, Mail, Calendar, Award, ExternalLink, Github, Twitter, Linkedin } from 'lucide-react';

const UserProfileSection = ({ user }) => {
  return (
    <div className="space-y-6">
      {/* User Profile Block */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-[#FFDE59] rounded-full p-3">
            <User size={32} className="text-gray-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600 capitalize">{user?.role?.toLowerCase()?.replace('_', ' ')}</p>
          </div>
        </div>
        
        {/* Basic Details */}
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Mail size={16} className="text-gray-400 mr-2" />
            <span className="text-gray-600">{user?.email}</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar size={16} className="text-gray-400 mr-2" />
            <span className="text-gray-600">
              Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Socials & Bio */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
        <div className="space-y-3">
          {user?.twitterHandle ? (
            <a 
              href={`https://twitter.com/${user.twitterHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <Twitter size={16} className="mr-2" />
              @{user.twitterHandle}
              <ExternalLink size={12} className="ml-1" />
            </a>
          ) : (
            <div className="flex items-center text-sm text-gray-400">
              <Twitter size={16} className="mr-2" />
              <span>Not connected</span>
            </div>
          )}
          
          {user?.linkedinUrl ? (
            <a 
              href={user.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <Linkedin size={16} className="mr-2" />
              LinkedIn Profile
              <ExternalLink size={12} className="ml-1" />
            </a>
          ) : (
            <div className="flex items-center text-sm text-gray-400">
              <Linkedin size={16} className="mr-2" />
              <span>Not connected</span>
            </div>
          )}
          
          {user?.githubUsername ? (
            <a 
              href={`https://github.com/${user.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <Github size={16} className="mr-2" />
              @{user.githubUsername}
              <ExternalLink size={12} className="ml-1" />
            </a>
          ) : (
            <div className="flex items-center text-sm text-gray-400">
              <Github size={16} className="mr-2" />
              <span>Not connected</span>
            </div>
          )}
          
          {user?.kaggleUsername ? (
            <a 
              href={`https://kaggle.com/${user.kaggleUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <Award size={16} className="mr-2" />
              Kaggle: {user.kaggleUsername}
              <ExternalLink size={12} className="ml-1" />
            </a>
          ) : (
            <div className="flex items-center text-sm text-gray-400">
              <Award size={16} className="mr-2" />
              <span>Kaggle not connected</span>
            </div>
          )}
        </div>
      </div>

      {/* User Details Panel */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">User ID</span>
            <span className="font-mono text-sm text-gray-900">{user?.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              user?.status === 'ACTIVE' 
                ? 'bg-green-100 text-green-800' 
                : user?.status === 'PENDING'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {user?.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Last Updated</span>
            <span className="text-sm text-gray-900">
              {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Badges</h3>
        <div className="text-center py-8 text-gray-500">
          <Award size={32} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No badges earned yet</p>
          <p className="text-xs text-gray-400 mt-1">Complete leagues to earn badges!</p>
        </div>
      </div>

      {/* Certificates Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificates</h3>
        <div className="text-center py-8 text-gray-500">
          <Award size={32} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No certificates yet</p>
          <p className="text-xs text-gray-400 mt-1">Complete specializations to earn certificates!</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSection;
