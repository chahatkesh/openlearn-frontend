import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  GraduationCap, 
  Phone, 
  IdCard, 
  Building, 
  Calendar,
  Globe,
  Users,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { FaDiscord, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import MigrationService from '../utils/migrationService';
import EmailVerificationService from '../utils/emailVerificationService';
import PageHead from '../components/common/PageHead';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { MotionDiv, MotionSection } from '../components/common/MotionWrapper';

const MigrationPage = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    institute: '',
    department: '',
    graduationYear: '',
    phoneNumber: '',
    studentId: '',
    discordUsername: '',
    portfolioUrl: '',
    // Social handles for enhanced signup
    twitterHandle: '',
    linkedinUrl: '',
    githubUsername: ''
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [customInstitute, setCustomInstitute] = useState('');
  const [customDepartment, setCustomDepartment] = useState('');

  // Check if migration is needed
  useEffect(() => {
    const checkMigrationNeeded = async () => {
      try {
        const status = await MigrationService.checkMigrationStatus();
        if (!status.requiresMigration) {
          navigate('/email-verification');
        }
      } catch (error) {
        console.error('Error checking migration status:', error);
      }
    };

    if (user) {
      checkMigrationNeeded();
    }
  }, [user, navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Prepare migration data
      const migrationData = {
        ...formData,
        institute: formData.institute === 'Other' ? customInstitute : formData.institute,
        department: formData.department === 'Other' ? customDepartment : formData.department,
        graduationYear: parseInt(formData.graduationYear)
      };

      // Validate data
      const validation = MigrationService.validateMigrationData(migrationData);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        setLoading(false);
        return;
      }
      
      // Refresh user data
      await refreshUser();
      
      // Wait a moment for the backend to update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check email verification status to determine next step
      try {
        const verificationStatus = await EmailVerificationService.checkVerificationStatus();        
        if (verificationStatus.emailVerified) {
          await refreshUser();
          navigate('/dashboard');
        } else {
          // Old User Flow: Email needs verification
          navigate('/email-verification');
        }
      } catch (error) {
        console.error('Error checking email verification status:', error);
        // Default to email verification if check fails
        navigate('/email-verification');
      }
      
    } catch (error) {
      setErrors({ general: error.message || 'Migration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setStep(prev => Math.min(prev + 1, 2));
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageHead 
        title="Complete Your Profile"
        description="Complete your OpenLearn profile migration to V2 with additional details"
        keywords="profile migration, user details, account upgrade"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50 py-12">
        <div className="max-w-3xl mx-auto px-6">
          {/* Header */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFDE59] rounded-full mb-6">
              <User size={24} className="text-black" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Complete Your Profile
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're upgrading to OpenLearn V2! Please provide some additional details to enhance your learning experience.
            </p>
            
            {/* Progress Bar */}
            <div className="flex items-center justify-center mt-8 space-x-4">
              <div className={`flex items-center ${step >= 1 ? 'text-[#FFDE59]' : 'text-gray-300'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= 1 ? 'bg-[#FFDE59] text-black' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > 1 ? <CheckCircle size={16} /> : '1'}
                </div>
                <span className="ml-2 text-sm font-medium">Academic Details</span>
              </div>
              
              <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-[#FFDE59]' : 'bg-gray-200'}`} />
              
              <div className={`flex items-center ${step >= 2 ? 'text-[#FFDE59]' : 'text-gray-300'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= 2 ? 'bg-[#FFDE59] text-black' : 'bg-gray-200 text-gray-500'
                }`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Social & Contact</span>
              </div>
            </div>
          </MotionDiv>

          {/* Form */}
          <MotionSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
          >
            {/* Error Message */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                <p className="text-red-700">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Academic Details */}
              {step === 1 && (
                <MotionDiv
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Institute */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Building size={16} className="inline mr-2" />
                      Institute *
                    </label>
                    <select
                      value={formData.institute}
                      onChange={(e) => handleInputChange('institute', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] outline-none transition-colors ${
                        errors.institute ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select your institute</option>
                      {MigrationService.getInstitutes().map(institute => (
                        <option key={institute} value={institute}>{institute}</option>
                      ))}
                    </select>
                    
                    {formData.institute === 'Other' && (
                      <input
                        type="text"
                        placeholder="Enter your institute name"
                        value={customInstitute}
                        onChange={(e) => setCustomInstitute(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] outline-none mt-2"
                      />
                    )}
                    
                    {errors.institute && (
                      <p className="text-red-600 text-sm mt-1">{errors.institute}</p>
                    )}
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <GraduationCap size={16} className="inline mr-2" />
                      Department *
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] outline-none transition-colors ${
                        errors.department ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select your department</option>
                      {MigrationService.getDepartments().map(department => (
                        <option key={department} value={department}>{department}</option>
                      ))}
                    </select>
                    
                    {formData.department === 'Other' && (
                      <input
                        type="text"
                        placeholder="Enter your department name"
                        value={customDepartment}
                        onChange={(e) => setCustomDepartment(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] outline-none mt-2"
                      />
                    )}
                    
                    {errors.department && (
                      <p className="text-red-600 text-sm mt-1">{errors.department}</p>
                    )}
                  </div>

                  {/* Graduation Year */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar size={16} className="inline mr-2" />
                      Graduation Year *
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 2025"
                      value={formData.graduationYear}
                      onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                      min={new Date().getFullYear()}
                      max={new Date().getFullYear() + 10}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] outline-none transition-colors ${
                        errors.graduationYear ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.graduationYear && (
                      <p className="text-red-600 text-sm mt-1">{errors.graduationYear}</p>
                    )}
                  </div>

                  {/* Student ID */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <IdCard size={16} className="inline mr-2" />
                      Student ID *
                    </label>
                    <input
                      type="text"
                      placeholder="Your student roll number"
                      value={formData.studentId}
                      onChange={(e) => handleInputChange('studentId', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] outline-none transition-colors ${
                        errors.studentId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.studentId && (
                      <p className="text-red-600 text-sm mt-1">{errors.studentId}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Phone size={16} className="inline mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 9876543210"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] outline-none transition-colors ${
                        errors.phoneNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-600 text-sm mt-1">{errors.phoneNumber}</p>
                    )}
                  </div>

                  {/* Next Button */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFDE59] text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors duration-200"
                    >
                      Next Step
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </MotionDiv>
              )}

              {/* Step 2: Social & Contact */}
              {step === 2 && (
                <MotionDiv
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Discord Username */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaDiscord size={16} className="inline mr-2 text-indigo-600" />
                      Discord Username
                    </label>
                    <input
                      type="text"
                      placeholder="your_discord_username"
                      value={formData.discordUsername}
                      onChange={(e) => handleInputChange('discordUsername', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] outline-none transition-colors"
                    />
                  </div>

                  {/* Portfolio URL */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Globe size={16} className="inline mr-2" />
                      Portfolio URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://yourportfolio.com"
                      value={formData.portfolioUrl}
                      onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] outline-none transition-colors ${
                        errors.portfolioUrl ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.portfolioUrl && (
                      <p className="text-red-600 text-sm mt-1">{errors.portfolioUrl}</p>
                    )}
                  </div>

                  {/* Social Handles Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Users size={20} className="mr-2" />
                      Social Handles (Optional)
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Connect your social profiles to showcase your work and connect with the community.
                    </p>
                    
                    <div className="space-y-4">
                      {/* Twitter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FaTwitter size={16} className="inline mr-2 text-blue-500" />
                          Twitter Handle
                        </label>
                        <input
                          type="text"
                          placeholder="@your_handle"
                          value={formData.twitterHandle}
                          onChange={(e) => handleInputChange('twitterHandle', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] outline-none"
                        />
                      </div>

                      {/* LinkedIn */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FaLinkedin size={16} className="inline mr-2 text-blue-700" />
                          LinkedIn Profile
                        </label>
                        <input
                          type="url"
                          placeholder="https://linkedin.com/in/yourprofile"
                          value={formData.linkedinUrl}
                          onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] outline-none"
                        />
                      </div>

                      {/* GitHub */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FaGithub size={16} className="inline mr-2 text-gray-900" />
                          GitHub Username
                        </label>
                        <input
                          type="text"
                          placeholder="your_github_username"
                          value={formData.githubUsername}
                          onChange={(e) => handleInputChange('githubUsername', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Previous
                    </button>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-[#FFDE59] text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Completing Profile...
                        </>
                      ) : (
                        <>
                          Complete Profile
                          <CheckCircle size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </MotionDiv>
              )}
            </form>
          </MotionSection>
        </div>
      </div>
    </>
  );
};

export default MigrationPage;
