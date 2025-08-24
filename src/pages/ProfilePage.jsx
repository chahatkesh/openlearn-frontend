import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  BookOpen, 
  Trophy,
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
  Activity
} from 'lucide-react';
import { getUserAvatarUrl } from '../utils/avatarService';
import PageHead from '../components/common/PageHead';

const ProfilePage = () => {
  const { user } = useAuth();

  const getRoleColor = (role) => {
    switch (role) {
      case 'CHIEF_PATHFINDER':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'GRAND_PATHFINDER':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PATHFINDER':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PIONEER':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'EXPLORER':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatRole = (role) => {
    return role?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) || 'Member';
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHead 
        title="Profile"
        description="View your OpenLearn profile information"
      />
      
      <div className="max-w-4xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="relative">
                <img 
                  src={getUserAvatarUrl(user)}
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-100"
                />
                <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="mt-4 text-center lg:text-left">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600 mt-1">OpenLearn ID: {user.olid}</p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center lg:justify-start">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                    {formatRole(user.role)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                  {user.emailVerified && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-800 border-green-200">
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-900">{user.enrollments?.length || 0}</p>
                <p className="text-blue-700 text-sm">Enrolled Leagues</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-900">{user.specializations?.length || 0}</p>
                <p className="text-green-700 text-sm">Specializations</p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-900">
                  {new Date(user.createdAt).getFullYear()}
                </p>
                <p className="text-purple-700 text-sm">Member Since</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Personal Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{user.email}</p>
                </div>
              </div>
              
              {user.phoneNumber && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{user.phoneNumber}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Academic Information
            </h2>
            
            <div className="space-y-4">
              {user.institute && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Institute</p>
                    <p className="text-gray-900">{user.institute}</p>
                  </div>
                </div>
              )}
              
              {user.department && (
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="text-gray-900">{user.department}</p>
                  </div>
                </div>
              )}
              
              {user.graduationYear && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Graduation Year</p>
                    <p className="text-gray-900">{user.graduationYear}</p>
                  </div>
                </div>
              )}
              
              {user.studentId && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Student ID</p>
                    <p className="text-gray-900">{user.studentId}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Social Links */}
        {(user.portfolioUrl || user.githubUsername || user.twitterHandle || user.linkedinUrl || user.discordUsername || user.kaggleUsername) && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-blue-600" />
              Social Links
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.portfolioUrl && (
                <a 
                  href={user.portfolioUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Portfolio</p>
                    <p className="text-sm text-gray-500 truncate">{user.portfolioUrl}</p>
                  </div>
                </a>
              )}
              
              {user.githubUsername && (
                <a 
                  href={`https://github.com/${user.githubUsername}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <Github className="w-5 h-5 text-gray-900" />
                  <div>
                    <p className="font-medium text-gray-900">GitHub</p>
                    <p className="text-sm text-gray-500">@{user.githubUsername}</p>
                  </div>
                </a>
              )}
              
              {user.twitterHandle && (
                <a 
                  href={`https://twitter.com/${user.twitterHandle}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <Twitter className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="font-medium text-gray-900">Twitter</p>
                    <p className="text-sm text-gray-500">@{user.twitterHandle}</p>
                  </div>
                </a>
              )}
              
              {user.linkedinUrl && (
                <a 
                  href={user.linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <Linkedin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">LinkedIn</p>
                    <p className="text-sm text-gray-500 truncate">{user.linkedinUrl}</p>
                  </div>
                </a>
              )}
              
              {user.discordUsername && (
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="font-medium text-gray-900">Discord</p>
                    <p className="text-sm text-gray-500">@{user.discordUsername}</p>
                  </div>
                </div>
              )}
              
              {user.kaggleUsername && (
                <a 
                  href={`https://kaggle.com/${user.kaggleUsername}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <Activity className="w-5 h-5 text-cyan-600" />
                  <div>
                    <p className="font-medium text-gray-900">Kaggle</p>
                    <p className="text-sm text-gray-500">@{user.kaggleUsername}</p>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Enrolled Leagues */}
        {user.enrollments && user.enrollments.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-600" />
              Enrolled Leagues ({user.enrollments.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.enrollments.map((enrollment, index) => (
                <div key={index} className="p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">League #{index + 1}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Enrolled: {new Date(enrollment.createdAt || user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
