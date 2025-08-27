import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award,
  ExternalLink,
  Github,
  Linkedin,
  Activity,
  Shield,
  Clock,
  Globe
} from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';
import { MdOutlineVerified, MdEdit, MdClose, MdSave } from "react-icons/md";
import { SiKaggle, SiGithub, SiLinkedin, SiX } from "react-icons/si";
import { getUserAvatarUrl } from '../../utils/helpers/boringAvatarsUtils';
import { PageHead } from "../../components/common";
import SocialService from '../../utils/social/socialService';
import { MotionDiv, MotionButton, MotionSpan } from '../../components/common/MotionWrapper';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [isEditingSocial, setIsEditingSocial] = useState(false);
  const [socialData, setSocialData] = useState({
    portfolioUrl: user?.portfolioUrl || '',
    githubUsername: user?.githubUsername || '',
    twitterHandle: user?.twitterHandle || '',
    linkedinUrl: user?.linkedinUrl || '',
    discordUsername: user?.discordUsername || '',
    kaggleUsername: user?.kaggleUsername || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Update social data when user changes (important for async user loading)
  // Only update if not currently editing to prevent losing focus
  useEffect(() => {
    if (user && !isEditingSocial) {
      setSocialData({
        portfolioUrl: user.portfolioUrl || '',
        githubUsername: user.githubUsername || '',
        twitterHandle: user.twitterHandle || '',
        linkedinUrl: user.linkedinUrl || '',
        discordUsername: user.discordUsername || '',
        kaggleUsername: user.kaggleUsername || ''
      });
    }
  }, [user, isEditingSocial]);

  // Memoized handlers to prevent unnecessary re-renders
  const handlePortfolioChange = useCallback((e) => {
    setSocialData(prev => ({ ...prev, portfolioUrl: e.target.value }));
  }, []);

  const handleGithubChange = useCallback((e) => {
    setSocialData(prev => ({ ...prev, githubUsername: e.target.value }));
  }, []);

  const handleTwitterChange = useCallback((e) => {
    setSocialData(prev => ({ ...prev, twitterHandle: e.target.value }));
  }, []);

  const handleLinkedinChange = useCallback((e) => {
    setSocialData(prev => ({ ...prev, linkedinUrl: e.target.value }));
  }, []);

  const handleDiscordChange = useCallback((e) => {
    setSocialData(prev => ({ ...prev, discordUsername: e.target.value }));
  }, []);

  const handleKaggleChange = useCallback((e) => {
    setSocialData(prev => ({ ...prev, kaggleUsername: e.target.value }));
  }, []);

  const formatRole = (role) => {
    return role?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) || 'Member';
  };

  const handleSaveSocial = async () => {
    try {
      setIsSaving(true);
      setSaveMessage('');
      
      // Clean the data - remove empty strings and normalize Twitter handle
      const cleanData = {};
      Object.keys(socialData).forEach(key => {
        if (socialData[key] && socialData[key].trim()) {
          if (key === 'twitterHandle') {
            // Clean Twitter handle - remove @ if present, then add it back
            const handle = socialData[key].trim().replace(/^@/, '');
            cleanData[key] = handle ? `@${handle}` : null;
          } else {
            cleanData[key] = socialData[key].trim();
          }
        } else {
          // Include null values for empty fields to clear them in the API
          cleanData[key] = null;
        }
      });

      await SocialService.updateSocialHandles(cleanData);
      
      // Refresh user data from server to get the latest state
      await refreshUser();
      setSaveMessage('Social profiles updated successfully!');
      setIsEditingSocial(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error updating social profiles:', error);
      
      // More specific error messages
      if (error.message.includes('token')) {
        setSaveMessage('Session expired. Please login again.');
      } else if (error.message.includes('Network')) {
        setSaveMessage('Network error. Please check your connection.');
      } else {
        setSaveMessage(`Failed to update: ${error.message}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset to original values
    setSocialData({
      portfolioUrl: user?.portfolioUrl || '',
      githubUsername: user?.githubUsername || '',
      twitterHandle: user?.twitterHandle || '',
      linkedinUrl: user?.linkedinUrl || '',
      discordUsername: user?.discordUsername || '',
      kaggleUsername: user?.kaggleUsername || ''
    });
    setIsEditingSocial(false);
    setSaveMessage('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const InfoCard = ({ title, children, className = "" }) => (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-gray-200/30 overflow-hidden transition-all duration-300 ${className}`}>
      <div className="p-5 sm:p-6 lg:p-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-black mb-6 sm:mb-8 tracking-tight leading-tight">{title}</h2>
        {children}
      </div>
    </div>
  );

  const StatCard = ({value, label, color = "amber" }) => {
    const colorClasses = {
      amber: "from-amber-50 to-amber-100/50 border-amber-200/30 text-amber-700",
      blue: "from-blue-50 to-blue-100/50 border-blue-200/30 text-blue-700",
      green: "from-green-50 to-green-100/50 border-green-200/30 text-green-700",
      purple: "from-purple-50 to-purple-100/50 border-purple-200/30 text-purple-700"
    };

    return (
      <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl sm:rounded-3xl border backdrop-blur-sm p-5 sm:p-6 text-center transition-all duration-300 hover:-translate-y-1`}>
        <p className="text-2xl sm:text-3xl font-semibold mb-2">{value}</p>
        <p className="text-sm sm:text-base font-medium opacity-80">{label}</p>
      </div>
    );
  };

  const SocialLink = ({ icon: Icon, label, url, username, color = "gray" }) => {
    const colorClasses = {
      gray: "hover:bg-gray-50/80 border-gray-200/30",
      blue: "hover:bg-blue-50/80 border-blue-200/30",
      green: "hover:bg-green-50/80 border-green-200/30",
      purple: "hover:bg-purple-50/80 border-purple-200/30",
      black: "hover:bg-gray-50/80 border-gray-200/30"
    };

    const content = (
      <div className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${colorClasses[color]} hover:-translate-y-1`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-base sm:text-lg">{label}</p>
          <p className="text-sm sm:text-base text-gray-600 truncate">{username}</p>
        </div>
        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
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
      <div className="min-h-screen bg-gray-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <PageHead 
        title="Profile"
        description="View your OpenLearn profile information and achievements"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8 pb-12 lg:pb-16">
        
        <div className="space-y-6 sm:space-y-8 lg:space-y-10">
          
          {/* Hero Section - Apple Style Enhanced */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-gray-200/30 overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-10">
              
              {/* Profile Header */}
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 sm:gap-8 mb-8 sm:mb-10">
                <div className="relative">
                  <img 
                    src={getUserAvatarUrl(user)}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover border border-gray-200/30"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-white/95 rounded-xl flex items-center justify-center backdrop-blur-sm border border-gray-200/30">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                  </div>
                </div>
                
                <div className="text-center lg:text-left flex-1">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-2 sm:mb-3">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-black tracking-tight leading-tight">{user.name}</h2>
                    {user.emailVerified && (
                      <MdOutlineVerified className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-green-600 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-6 font-medium">OpenLearn ID: {user.olid}</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {/* Mobile: Show only Role */}
                <div className="sm:hidden">
                  <StatCard 
                    value={formatRole(user.role)} 
                    label="Role"
                    color="amber"
                  />
                </div>
                
                {/* Desktop: Show all stats */}
                <div className="hidden sm:contents">
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
                    value={formatRole(user.role)} 
                    label="Role"
                    color="amber"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            
            {/* Personal Information */}
            <InfoCard title="Personal Information">
              <div className="space-y-6 sm:space-y-8">
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm sm:text-base font-semibold text-gray-500 uppercase tracking-wide mb-1">Email Address</p>
                    <p className="text-base sm:text-lg text-gray-900 font-medium">{user.email}</p>
                  </div>
                </div>
                
                {user.phoneNumber && (
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm sm:text-base font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone Number</p>
                      <p className="text-base sm:text-lg text-gray-900 font-medium">{user.phoneNumber}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm sm:text-base font-semibold text-gray-500 uppercase tracking-wide mb-1">Member Since</p>
                    <p className="text-base sm:text-lg text-gray-900 font-medium">{formatDate(user.createdAt)}</p>
                  </div>
                </div>

                {user.updatedAt && (
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm sm:text-base font-semibold text-gray-500 uppercase tracking-wide mb-1">Last Updated</p>
                      <p className="text-base sm:text-lg text-gray-900 font-medium">{formatDate(user.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </InfoCard>

            {/* Academic Information */}
            <InfoCard title="Academic Information">
              <div className="space-y-6 sm:space-y-8">
                {user.institute && (
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm sm:text-base font-semibold text-gray-500 uppercase tracking-wide mb-1">Institute</p>
                      <p className="text-base sm:text-lg text-gray-900 font-medium">{user.institute}</p>
                    </div>
                  </div>
                )}
                
                {user.department && (
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                      <Award className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm sm:text-base font-semibold text-gray-500 uppercase tracking-wide mb-1">Department</p>
                      <p className="text-base sm:text-lg text-gray-900 font-medium">{user.department}</p>
                    </div>
                  </div>
                )}
                
                {user.graduationYear && (
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm sm:text-base font-semibold text-gray-500 uppercase tracking-wide mb-1">Graduation Year</p>
                      <p className="text-base sm:text-lg text-gray-900 font-medium">{user.graduationYear}</p>
                    </div>
                  </div>
                )}
                
                {user.studentId && (
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                      <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm sm:text-base font-semibold text-gray-500 uppercase tracking-wide mb-1">Student ID</p>
                      <p className="text-base sm:text-lg text-gray-900 font-medium">{user.studentId}</p>
                    </div>
                  </div>
                )}
              </div>
            </InfoCard>
          </div>

          {/* Social Links */}
          {(user.portfolioUrl || user.githubUsername || user.twitterHandle || user.linkedinUrl || user.discordUsername || user.kaggleUsername || isEditingSocial) && (
            <InfoCard title="Social Links & Profiles">
              {/* Header with Edit Button */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium text-gray-700">Add your profiles</h3>
                  {saveMessage && (
                    <MotionSpan 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`text-xs px-2 py-1 rounded-full ${
                        saveMessage.includes('success') 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {saveMessage}
                    </MotionSpan>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {isEditingSocial ? (
                    <>
                      <MotionButton
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCancelEdit}
                        className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200"
                      >
                        <MdClose className="w-3 h-3" />
                        <span>Cancel</span>
                      </MotionButton>
                      <MotionButton
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveSocial}
                        disabled={isSaving}
                        className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-all duration-200"
                      >
                        {isSaving ? (
                          <>
                            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <MdSave className="w-3 h-3" />
                            <span>Save</span>
                          </>
                        )}
                      </MotionButton>
                    </>
                  ) : (
                    <MotionButton
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditingSocial(true)}
                      className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
                    >
                      <MdEdit className="w-3 h-3" />
                      <span>Edit Social</span>
                    </MotionButton>
                  )}
                </div>
              </div>

              {isEditingSocial ? (
                <div className="space-y-4">
                    {/* Portfolio URL */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Portfolio URL
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          key="portfolio-input"
                          type="url"
                          value={socialData.portfolioUrl}
                          onChange={handlePortfolioChange}
                          placeholder="https://yourportfolio.com"
                          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* GitHub Username */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        GitHub Username
                      </label>
                      <div className="relative">
                        <SiGithub className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          key="github-input"
                          type="text"
                          value={socialData.githubUsername}
                          onChange={handleGithubChange}
                          placeholder="yourusername"
                          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Twitter Handle */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        X (Twitter) Handle
                      </label>
                      <div className="relative">
                        <SiX className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          key="twitter-input"
                          type="text"
                          value={socialData.twitterHandle}
                          onChange={handleTwitterChange}
                          placeholder="@yourusername"
                          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* LinkedIn URL */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        LinkedIn URL
                      </label>
                      <div className="relative">
                        <SiLinkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          key="linkedin-input"
                          type="url"
                          value={socialData.linkedinUrl}
                          onChange={handleLinkedinChange}
                          placeholder="https://linkedin.com/in/yourusername"
                          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Discord Username */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Discord Username
                      </label>
                      <div className="relative">
                        <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          key="discord-input"
                          type="text"
                          value={socialData.discordUsername}
                          onChange={handleDiscordChange}
                          placeholder="yourusername#1234"
                          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Kaggle Username */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Kaggle Username
                      </label>
                      <div className="relative">
                        <SiKaggle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          key="kaggle-input"
                          type="text"
                          value={socialData.kaggleUsername}
                          onChange={handleKaggleChange}
                          placeholder="yourusername"
                          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                        icon={FaXTwitter} 
                        label="X (formerly Twitter)" 
                        url={`https://x.com/${user.twitterHandle.replace('@', '')}`}
                        username={user.twitterHandle}
                        color="black"
                      />
                    )}
                    
                    {user.linkedinUrl && (
                      <SocialLink 
                        icon={Linkedin} 
                        label="LinkedIn" 
                        url={user.linkedinUrl}
                        username={user.linkedinUrl.includes('/in/') 
                          ? user.linkedinUrl.split('/in/')[1]?.split('/')[0] || 'LinkedIn Profile'
                          : 'LinkedIn Profile'
                        }
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
                )}
            </InfoCard>
          )}

          {/* Enrolled Leagues */}
          {user.enrollments && user.enrollments.length > 0 && (
            <InfoCard title={`Enrolled Leagues (${user.enrollments.length})`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {user.enrollments.map((enrollment, index) => (
                  <div key={enrollment.id || index} className="group relative bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl sm:rounded-3xl border border-amber-200/30 p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1">
                    <h3 className="font-semibold text-gray-900 text-lg sm:text-xl mb-3">
                      {enrollment.league?.name || `League ${index + 1}`}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3">
                      Cohort: {enrollment.cohort?.name || 'Not specified'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Enrolled: {formatDate(enrollment.enrolledAt || enrollment.createdAt || user.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </InfoCard>
          )}

          {/* Migration Status */}
          {user.migratedToV2 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 text-lg sm:text-xl">Account Migrated</h3>
                  <p className="text-green-700 text-sm sm:text-base">Your account has been migrated to OpenLearn V2</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;