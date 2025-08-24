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
  Activity,
  Shield,
  Clock,
  Star,
  Globe
} from 'lucide-react';
import { getUserAvatarUrl } from '../utils/avatarService';
import PageHead from '../components/common/PageHead';

const ProfilePage = () => {
  const { user } = useAuth();

  const getRoleColor = (role) => {
    switch (role) {
      case 'CHIEF_PATHFINDER':
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-400';
      case 'GRAND_PATHFINDER':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400';
      case 'PATHFINDER':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400';
      case 'PIONEER':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 border-yellow-300';
      case 'EXPLORER':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-gray-300';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100/80 text-green-800 border-green-200';
      case 'INACTIVE':
        return 'bg-gray-100/80 text-gray-800 border-gray-200';
      case 'SUSPENDED':
        return 'bg-red-100/80 text-red-800 border-red-200';
      default:
        return 'bg-gray-100/80 text-gray-800 border-gray-200';
    }
  };

  const formatRole = (role) => {
    return role?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) || 'Member';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const InfoCard = ({ title, children, className = "" }) => (
    <div className={`bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300 ${className}`}>
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );

  const StatCard = ({value, label, color = "yellow" }) => {
    const colorClasses = {
      yellow: "from-yellow-50 to-yellow-100/50 border-yellow-200/50 text-yellow-700",
      blue: "from-blue-50 to-blue-100/50 border-blue-200/50 text-blue-700",
      green: "from-green-50 to-green-100/50 border-green-200/50 text-green-700",
      purple: "from-purple-50 to-purple-100/50 border-purple-200/50 text-purple-700"
    };

    return (
      <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl border backdrop-blur-sm p-4 sm:p-6 text-center hover:scale-105 transition-all duration-300`}>
        <p className="text-lg sm:text-2xl font-bold mb-1">{value}</p>
        <p className="text-xs sm:text-sm font-medium opacity-80">{label}</p>
      </div>
    );
  };

  const SocialLink = ({ icon: Icon, label, url, username, color = "gray" }) => {
    const colorClasses = {
      gray: "hover:bg-gray-50/80 border-gray-200/50",
      blue: "hover:bg-blue-50/80 border-blue-200/50",
      green: "hover:bg-green-50/80 border-green-200/50",
      purple: "hover:bg-purple-50/80 border-purple-200/50"
    };

    const content = (
      <div className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 ${colorClasses[color]} hover:scale-105`}>
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm sm:text-base">{label}</p>
          <p className="text-xs sm:text-sm text-gray-600 truncate">{username}</p>
        </div>
        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
      </div>
    );

    return url ? (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    ) : (
      <div className="opacity-75">
        {content}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <PageHead 
        title="Profile"
        description="View your OpenLearn profile information and achievements"
      />
      
      <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-8">
        {/* Hero Section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-gray-200/50 overflow-hidden">
          {/* Background Pattern */}
          <div className="relative bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 px-4 sm:px-8 pt-4 sm:pt-8 pb-16 sm:pb-24 overflow-hidden">
            {/* Animated Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/30 via-transparent to-amber-100/40"></div>
            
            {/* Geometric Pattern Layer */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-200/40 rounded-full blur-xl transform -translate-x-16 -translate-y-16"></div>
              <div className="absolute top-1/4 right-0 w-24 h-24 bg-amber-200/35 rounded-full blur-lg transform translate-x-12"></div>
              <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-orange-200/30 rounded-full blur-2xl transform translate-y-20"></div>
              <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-yellow-300/25 rounded-full blur-lg transform -translate-x-10 -translate-y-10"></div>
            </div>
            
            {/* Dynamic Mesh Gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-yellow-100/20 to-amber-100/25"></div>
            
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-15" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(251, 191, 36, 0.3) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}></div>
            
            {/* Glass Morphism Effect */}
            <div className="absolute inset-0 backdrop-blur-[0.5px] bg-gradient-to-br from-white/20 via-transparent to-yellow-100/20"></div>
            
            {/* Floating Particles Effect */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400/40 rounded-full animate-pulse"></div>
              <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-amber-400/50 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-orange-400/45 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>
            
            {/* Profile Header */}
            <div className="relative flex flex-col lg:flex-row items-center lg:items-start gap-4 sm:gap-6">
              <div className="relative">
                <img 
                  src={getUserAvatarUrl(user)}
                  alt={user.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl object-cover border-2 sm:border-4 border-white/80 backdrop-blur-sm shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-white/95 rounded-lg sm:rounded-xl flex items-center justify-center backdrop-blur-sm shadow-md">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
                </div>
              </div>
              
              <div className="text-center lg:text-left text-gray-900">
                <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-gray-900 drop-shadow-sm">{user.name}</h1>
                <p className="text-gray-700 text-sm sm:text-lg mb-3 sm:mb-4 font-medium">OpenLearn ID: {user.olid}</p>
                
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start">
                  <span className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold border backdrop-blur-sm ${getRoleColor(user.role)}`}>
                    {formatRole(user.role)}
                  </span>
                  <span className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold border backdrop-blur-sm ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                  {user.emailVerified && (
                    <span className="px-3 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold bg-green-500 text-white border border-green-400 backdrop-blur-sm">
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="relative -mt-12 sm:-mt-16 px-4 sm:px-8 pb-4 sm:pb-8">
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <StatCard 
                value={user.enrollments?.length || 0} 
                label="Enrolled Leagues"
                color="purple"
              />
              <StatCard 
                value={new Date(user.createdAt).getFullYear()} 
                label="Member Since"
                color="green"
              />
              <StatCard 
                value={user.migratedToV2 ? "V2" : "V1"} 
                label="Platform Version"
                color="blue"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Personal Information */}
          <InfoCard title="Personal Information">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Email Address</p>
                  <p className="text-sm sm:text-base text-gray-900 font-medium mt-1">{user.email}</p>
                </div>
              </div>
              
              {user.phoneNumber && (
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Phone Number</p>
                    <p className="text-sm sm:text-base text-gray-900 font-medium mt-1">{user.phoneNumber}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Member Since</p>
                  <p className="text-sm sm:text-base text-gray-900 font-medium mt-1">{formatDate(user.createdAt)}</p>
                </div>
              </div>

              {user.updatedAt && (
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Last Updated</p>
                    <p className="text-sm sm:text-base text-gray-900 font-medium mt-1">{formatDate(user.updatedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </InfoCard>

          {/* Academic Information */}
          <InfoCard title="Academic Information">
            <div className="space-y-4 sm:space-y-6">
              {user.institute && (
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Institute</p>
                    <p className="text-sm sm:text-base text-gray-900 font-medium mt-1">{user.institute}</p>
                  </div>
                </div>
              )}
              
              {user.department && (
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Department</p>
                    <p className="text-sm sm:text-base text-gray-900 font-medium mt-1">{user.department}</p>
                  </div>
                </div>
              )}
              
              {user.graduationYear && (
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Graduation Year</p>
                    <p className="text-sm sm:text-base text-gray-900 font-medium mt-1">{user.graduationYear}</p>
                  </div>
                </div>
              )}
              
              {user.studentId && (
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Student ID</p>
                    <p className="text-sm sm:text-base text-gray-900 font-medium mt-1">{user.studentId}</p>
                  </div>
                </div>
              )}
            </div>
          </InfoCard>
        </div>

        {/* Social Links */}
        {(user.portfolioUrl || user.githubUsername || user.twitterHandle || user.linkedinUrl || user.discordUsername || user.kaggleUsername) && (
          <InfoCard icon={Globe} title="Social Links & Profiles" className="col-span-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {user.portfolioUrl && (
                <SocialLink 
                  icon={Globe} 
                  label="Portfolio" 
                  url={user.portfolioUrl}
                  username={user.portfolioUrl}
                  color="blue"
                />
              )}
              
              {user.githubUsername && (
                <SocialLink 
                  icon={Github} 
                  label="GitHub" 
                  url={`https://github.com/${user.githubUsername}`}
                  username={`@${user.githubUsername}`}
                  color="gray"
                />
              )}
              
              {user.twitterHandle && (
                <SocialLink 
                  icon={Twitter} 
                  label="Twitter" 
                  url={`https://twitter.com/${user.twitterHandle.replace('@', '')}`}
                  username={user.twitterHandle}
                  color="blue"
                />
              )}
              
              {user.linkedinUrl && (
                <SocialLink 
                  icon={Linkedin} 
                  label="LinkedIn" 
                  url={user.linkedinUrl}
                  username={user.linkedinUrl.split('/').pop()}
                  color="blue"
                />
              )}
              
              {user.discordUsername && (
                <SocialLink 
                  icon={Activity} 
                  label="Discord" 
                  username={user.discordUsername}
                  color="purple"
                />
              )}
              
              {user.kaggleUsername && (
                <SocialLink 
                  icon={Activity} 
                  label="Kaggle" 
                  url={`https://kaggle.com/${user.kaggleUsername}`}
                  username={`@${user.kaggleUsername}`}
                  color="green"
                />
              )}
            </div>
          </InfoCard>
        )}

        {/* Enrolled Leagues */}
        {user.enrollments && user.enrollments.length > 0 && (
          <InfoCard icon={Trophy} title={`Enrolled Leagues (${user.enrollments.length})`} className="col-span-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {user.enrollments.map((enrollment, index) => (
                <div key={enrollment.id || index} className="group relative bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-xl border border-yellow-200/50 p-4 sm:p-6 hover:scale-105 transition-all duration-300">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2">
                    {enrollment.league?.name || `League ${index + 1}`}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                    Cohort: {enrollment.cohort?.name || 'Not specified'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Enrolled: {formatDate(enrollment.enrolledAt || enrollment.createdAt || user.createdAt)}
                  </p>
                  
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 to-yellow-500/0 group-hover:from-yellow-400/5 group-hover:to-yellow-500/10 rounded-xl transition-all duration-300"></div>
                </div>
              ))}
            </div>
          </InfoCard>
        )}

        {/* Migration Status */}
        {user.migratedToV2 && (
          <div className="bg-gradient-to-r w-full from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-green-900">Account Migrated</h3>
                <p className="text-green-700 text-sm">Your account has been migrated to OpenLearn V2</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
