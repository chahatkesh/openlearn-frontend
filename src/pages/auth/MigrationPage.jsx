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
  Loader2,
  LogOut
} from 'lucide-react';
import { FaDiscord, FaLinkedin, FaGithub } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { useAuth } from '../../hooks/useAuth';
import MigrationService from '../../utils/auth/migrationService';
import EmailVerificationService from '../../utils/auth/emailVerificationService';
import SocialService from '../../utils/social/socialService';
import { PageHead } from "../../components/common";
import { AuthLayout, AuthError } from '../../components/features/authentication';

const MigrationPage = () => {
  const navigate = useNavigate();
  const { user, refreshUser, logout } = useAuth();
  
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
    // Special handling for phone number to restrict to 10 digits
    if (field === 'phoneNumber') {
      // Remove all non-digit characters
      const phoneDigits = value.replace(/\D/g, '');
      // Limit to 10 digits
      const limitedPhone = phoneDigits.slice(0, 10);
      setFormData(prev => ({ ...prev, [field]: limitedPhone }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate step 1 (Academic Details)
  const validateStep1 = () => {
    const errors = {};
    
    // Institute validation
    if (!formData.institute.trim()) {
      errors.institute = 'Institute is required';
    } else if (formData.institute === 'Other' && !customInstitute.trim()) {
      errors.institute = 'Please enter your institute name';
    }
    
    // Department validation
    if (!formData.department.trim()) {
      errors.department = 'Department is required';
    } else if (formData.department === 'Other' && !customDepartment.trim()) {
      errors.department = 'Please enter your department name';
    }
    
    // Graduation year validation
    if (!formData.graduationYear) {
      errors.graduationYear = 'Graduation year is required';
    } else {
      const year = parseInt(formData.graduationYear);
      if (year < 2000 || year > 2029) {
        errors.graduationYear = 'Please enter a valid graduation year (2000-2029)';
      }
    }
    
    // Student ID validation
    if (!formData.studentId.trim()) {
      errors.studentId = 'Student ID is required';
    }
    
    // Phone number validation - must be exactly 10 digits
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else {
      // Remove any non-digit characters for validation
      const phoneDigits = formData.phoneNumber.replace(/\D/g, '');
      if (phoneDigits.length !== 10) {
        errors.phoneNumber = 'Phone number must be exactly 10 digits';
      } else if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
        errors.phoneNumber = 'Please enter a valid Indian mobile number';
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  // Check if step 1 is complete and valid
  const isStep1Valid = () => {
    // Check all required fields are filled
    const hasInstitute = formData.institute.trim() && 
      (formData.institute !== 'Other' || customInstitute.trim());
    
    const hasDepartment = formData.department.trim() && 
      (formData.department !== 'Other' || customDepartment.trim());
    
    const hasGraduationYear = formData.graduationYear && 
      parseInt(formData.graduationYear) >= 2000 && 
      parseInt(formData.graduationYear) <= 2029;
    
    const hasStudentId = formData.studentId.trim();
    
    const hasValidPhone = formData.phoneNumber.trim() && 
      formData.phoneNumber.replace(/\D/g, '').length === 10 &&
      /^[6-9]\d{9}$/.test(formData.phoneNumber.replace(/\D/g, ''));
    
    return hasInstitute && hasDepartment && hasGraduationYear && hasStudentId && hasValidPhone;
  };

  // Validate social handles
  const validateSocialHandles = (socialData) => {
    const errors = {};

    // X (formerly Twitter) handle validation
    if (!socialData.twitterHandle || !socialData.twitterHandle.trim()) {
      errors.twitterHandle = 'Twitter handle is required';
    } else if (!socialData.twitterHandle.startsWith('@')) {
      errors.twitterHandle = 'Twitter handle must start with @';
    }

    // LinkedIn URL validation
    if (!socialData.linkedinUrl || !socialData.linkedinUrl.trim()) {
      errors.linkedinUrl = 'LinkedIn profile is required';
    } else {
      try {
        const url = new URL(socialData.linkedinUrl);
        if (!url.hostname.includes('linkedin.com')) {
          errors.linkedinUrl = 'Please enter a valid LinkedIn profile URL';
        }
      } catch {
        errors.linkedinUrl = 'Please enter a valid LinkedIn profile URL';
      }
    }

    // GitHub username validation
    if (!socialData.githubUsername || !socialData.githubUsername.trim()) {
      errors.githubUsername = 'GitHub username is required';
    } else {
      const githubRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
      if (!githubRegex.test(socialData.githubUsername.trim())) {
        errors.githubUsername = 'Please enter a valid GitHub username';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Prepare migration data (excluding social handles)
      const migrationData = {
        institute: formData.institute === 'Other' ? customInstitute : formData.institute,
        department: formData.department === 'Other' ? customDepartment : formData.department,
        graduationYear: parseInt(formData.graduationYear),
        phoneNumber: formData.phoneNumber,
        studentId: formData.studentId,
        discordUsername: formData.discordUsername,
        portfolioUrl: formData.portfolioUrl
      };

      // Validate migration data
      const validation = MigrationService.validateMigrationData(migrationData);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        setLoading(false);
        return;
      }

      // Validate social handles separately
      const socialValidation = validateSocialHandles({
        twitterHandle: formData.twitterHandle,
        linkedinUrl: formData.linkedinUrl,
        githubUsername: formData.githubUsername
      });

      if (!socialValidation.isValid) {
        setErrors(prev => ({ ...prev, ...socialValidation.errors }));
        setLoading(false);
        return;
      }

      // Perform the actual migration
      console.log('🔄 Starting migration with data:', migrationData);
      await MigrationService.migrateToV2(migrationData);
      console.log('✅ Migration completed successfully');

      // Update social handles separately if they exist
      const socialHandles = {
        twitterHandle: formData.twitterHandle,
        linkedinUrl: formData.linkedinUrl,
        githubUsername: formData.githubUsername
      };

      // Only update social handles if at least one is provided
      if (socialHandles.twitterHandle || socialHandles.linkedinUrl || socialHandles.githubUsername) {
        console.log('🔄 Updating social handles:', socialHandles);
        try {
          await SocialService.updateSocialHandles(socialHandles);
          console.log('✅ Social handles updated successfully');
        } catch (socialError) {
          console.warn('⚠️ Failed to update social handles, but migration succeeded:', socialError);
          // Don't fail the entire migration if social update fails
        }
      }
      
      // Refresh user data after migration and social update
      await refreshUser();
      
      // Wait a moment for the backend to update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check email verification status to determine next step
      try {
        const verificationStatus = await EmailVerificationService.checkVerificationStatus();
        console.log('📧 Email verification status:', verificationStatus);
        
        if (verificationStatus.emailVerified) {
          console.log('✅ Email already verified, redirecting to dashboard');
          await refreshUser();
          navigate('/dashboard');
        } else {
          console.log('📧 Email needs verification, redirecting to email verification');
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
    if (step === 1) {
      const validation = validateStep1();
      if (!validation.isValid) {
        setErrors(prev => ({ ...prev, ...validation.errors }));
        return;
      }
      // Clear any previous errors for step 1
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.institute;
        delete newErrors.department;
        delete newErrors.graduationYear;
        delete newErrors.studentId;
        delete newErrors.phoneNumber;
        return newErrors;
      });
    }
    setStep(prev => Math.min(prev + 1, 2));
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  if (!user) {
    return (
      <AuthLayout title="Loading Profile" subtitle="Please wait...">
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-black" />
        </div>
      </AuthLayout>
    );
  }

  return (
    <>
      <PageHead 
        title="Complete Your Profile"
        description="Complete your OpenLearn profile migration to V2 with additional details"
        keywords="profile migration, user details, account upgrade"
      />
      
      <AuthLayout 
        title="Complete Your Profile" 
        subtitle="We're upgrading to OpenLearn V2!"
      >
        {/* Error Message */}
        {errors.general && (
          <AuthError message={errors.general} />
        )}

        {/* Wrong Email? Logout Option */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-700 mb-2">
              Signed in as: <span className="font-medium text-gray-900">{user?.email}</span>
            </p>
            <button
              type="button"
              onClick={async () => {
                try {
                  await logout();
                  navigate('/auth/signin');
                } catch (error) {
                  console.error('Logout error:', error);
                }
              }}
              className="text-sm text-red-600 hover:text-red-800 underline transition-colors duration-200 flex items-center gap-1 mx-auto"
            >
              <LogOut size={14} />
              Wrong email? Sign out and try again
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-3 sm:space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-black' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                step >= 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > 1 ? <CheckCircle size={16} /> : '1'}
              </div>
              <span className="ml-2 text-xs sm:text-sm font-medium hidden sm:block">Academic Details</span>
            </div>
            
            <div className={`w-8 sm:w-12 h-0.5 transition-colors ${step >= 2 ? 'bg-black' : 'bg-gray-200'}`} />
            
            <div className={`flex items-center ${step >= 2 ? 'text-black' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                step >= 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <span className="ml-2 text-xs sm:text-sm font-medium hidden sm:block">Social & Contact</span>
            </div>
          </div>
          <div className="flex justify-center mt-3 sm:hidden">
            <span className="text-xs text-gray-600">
              Step {step} of 2: {step === 1 ? 'Academic Details' : 'Social & Contact'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Step 1: Academic Details */}
          {step === 1 && (
            <div className="space-y-5 sm:space-y-6">
              {/* Institute */}
              <div className="space-y-2">
                <label className="block text-sm sm:text-base font-medium text-gray-800">
                  <Building size={16} className="inline mr-2" />
                  Institute *
                </label>
                <select
                  value={formData.institute}
                  onChange={(e) => handleInputChange('institute', e.target.value)}
                  className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-xl sm:rounded-2xl bg-gray-50/50 placeholder-gray-400 focus:ring-2 focus:ring-black/10 focus:border-black focus:bg-white transition-all duration-200 outline-none ${
                    errors.institute ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
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
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-xl sm:rounded-2xl bg-gray-50/50 placeholder-gray-400 focus:ring-2 focus:ring-black/10 focus:border-black focus:bg-white transition-all duration-200 outline-none mt-2"
                  />
                )}
                
                {errors.institute && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1 font-medium">{errors.institute}</p>
                )}
              </div>

              {/* Department */}
              <div className="space-y-2">
                <label className="block text-sm sm:text-base font-medium text-gray-800">
                  <GraduationCap size={16} className="inline mr-2" />
                  Department *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-xl sm:rounded-2xl bg-gray-50/50 placeholder-gray-400 focus:ring-2 focus:ring-black/10 focus:border-black focus:bg-white transition-all duration-200 outline-none ${
                    errors.department ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
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
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-xl sm:rounded-2xl bg-gray-50/50 placeholder-gray-400 focus:ring-2 focus:ring-black/10 focus:border-black focus:bg-white transition-all duration-200 outline-none mt-2"
                  />
                )}
                
                {errors.department && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1 font-medium">{errors.department}</p>
                )}
              </div>

              {/* Graduation Year */}
              <div className="space-y-2">
                <label className="block text-sm sm:text-base font-medium text-gray-800">
                  <Calendar size={16} className="inline mr-2" />
                  Graduation Year *
                </label>
                <input
                  type="number"
                  placeholder="e.g., 2025"
                  value={formData.graduationYear}
                  onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                  min={2000}
                  max={2029}
                  className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-xl sm:rounded-2xl bg-gray-50/50 placeholder-gray-400 focus:ring-2 focus:ring-black/10 focus:border-black focus:bg-white transition-all duration-200 outline-none ${
                    errors.graduationYear ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
                  }`}
                />
                {errors.graduationYear && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1 font-medium">{errors.graduationYear}</p>
                )}
              </div>

              {/* Student ID */}
              <div className="space-y-2">
                <label className="block text-sm sm:text-base font-medium text-gray-800">
                  <IdCard size={16} className="inline mr-2" />
                  Student ID *
                </label>
                <input
                  type="text"
                  placeholder="Your student roll number"
                  value={formData.studentId}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                  className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-xl sm:rounded-2xl bg-gray-50/50 placeholder-gray-400 focus:ring-2 focus:ring-black/10 focus:border-black focus:bg-white transition-all duration-200 outline-none ${
                    errors.studentId ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
                  }`}
                />
                {errors.studentId && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1 font-medium">{errors.studentId}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="block text-sm sm:text-base font-medium text-gray-800">
                  <Phone size={16} className="inline mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  maxLength="10"
                  className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-xl sm:rounded-2xl bg-gray-50/50 placeholder-gray-400 focus:ring-2 focus:ring-black/10 focus:border-black focus:bg-white transition-all duration-200 outline-none ${
                    errors.phoneNumber ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
                  }`}
                />
                <p className="text-xs text-gray-500 mt-1">Enter 10-digit mobile number (without +91)</p>
                {errors.phoneNumber && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1 font-medium">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Next Button */}
              <div className="flex justify-end pt-6">
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStep1Valid()}
                  className={`inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 font-medium rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                    isStep1Valid() 
                      ? 'bg-black text-white hover:bg-gray-800 focus:ring-black/20 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next Step
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Social & Contact */}
          {step === 2 && (
            <div className="space-y-5 sm:space-y-6">
                  {/* Required Social Handles Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Users size={20} className="mr-2" />
                      Required Social Handles
                    </h3>
                    <div className="space-y-4">
                      {/* Twitter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FaXTwitter size={16} className="inline mr-2 text-black" />
                          X (formerly Twitter) Handle <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="@your_handle"
                          value={formData.twitterHandle}
                          onChange={(e) => handleInputChange('twitterHandle', e.target.value)}
                          required
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] outline-none ${
                            errors.twitterHandle ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                        {errors.twitterHandle && (
                          <p className="text-red-600 text-sm mt-1">{errors.twitterHandle}</p>
                        )}
                      </div>

                      {/* LinkedIn */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FaLinkedin size={16} className="inline mr-2 text-blue-700" />
                          LinkedIn Profile <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="url"
                          placeholder="https://linkedin.com/in/yourprofile"
                          value={formData.linkedinUrl}
                          onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                          required
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] outline-none ${
                            errors.linkedinUrl ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                        {errors.linkedinUrl && (
                          <p className="text-red-600 text-sm mt-1">{errors.linkedinUrl}</p>
                        )}
                      </div>

                      {/* GitHub */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FaGithub size={16} className="inline mr-2 text-gray-900" />
                          GitHub Username <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="your_github_username"
                          value={formData.githubUsername}
                          onChange={(e) => handleInputChange('githubUsername', e.target.value)}
                          required
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] outline-none ${
                            errors.githubUsername ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                        {errors.githubUsername && (
                          <p className="text-red-600 text-sm mt-1">{errors.githubUsername}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Optional Information Section */}
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Globe size={20} className="mr-2" />
                      Optional Information
                    </h3>
                    <div className="space-y-4">
                      {/* Discord Username */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FaDiscord size={16} className="inline mr-2 text-indigo-600" />
                          Discord Username <span className="text-gray-500 text-sm">(Optional)</span>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Globe size={16} className="inline mr-2" />
                          Portfolio URL <span className="text-gray-500 text-sm">(Optional)</span>
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
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Previous
                    </button>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm sm:text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin mr-2" />
                          Completing Profile...
                        </>
                      ) : (
                        <>
                          Complete Profile
                          <CheckCircle size={18} className="ml-2" />
                        </>
                      )}
                    </button>
                  </div>
            </div>
          )}
        </form>
      </AuthLayout>
    </>
  );
};

export default MigrationPage;
