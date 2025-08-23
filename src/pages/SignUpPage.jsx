import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, Users } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import AuthError from '../components/auth/AuthError';
import AuthLayout from '../components/auth/AuthLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PageHead from '../components/common/PageHead';

const SignUpPage = () => {
  const [step, setStep] = useState(1);
  
  // Basic info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Social handles
  const [socialHandles, setSocialHandles] = useState({
    githubUsername: '',
    linkedinUrl: '',
    twitterHandle: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { signup, error, user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // For now, just use basic signup - social handles will be handled in migration
    const success = await signup(name, email, password);
    
    setIsLoading(false);
    
    if (success) {
      navigate('/migration');
    }
  };

  const handleSocialChange = (field, value) => {
    setSocialHandles(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (step === 1 && name && email && password.length >= 8) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Show loading screen while checking authentication status
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageHead 
        title="Sign Up"
        description="Create your OpenLearn account and start your gamified learning journey at NIT Jalandhar. Join cohorts, earn badges, and compete with fellow students in an innovative educational experience."
        keywords="sign up, create account, student registration, join OpenLearn, NIT Jalandhar registration"
      />
      
      <AuthLayout 
        title="Create an Account" 
        subtitle="Join the OpenLearn community today"
      >
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8 space-x-4">
          <div className={`flex items-center ${step >= 1 ? 'text-[#FFDE59]' : 'text-gray-300'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step >= 1 ? 'bg-[#FFDE59] text-black' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <span className="ml-2 text-sm font-medium hidden sm:inline">Basic Info</span>
          </div>
          
          <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-[#FFDE59]' : 'bg-gray-200'}`} />
          
          <div className={`flex items-center ${step >= 2 ? 'text-[#FFDE59]' : 'text-gray-300'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step >= 2 ? 'bg-[#FFDE59] text-black' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <span className="ml-2 text-sm font-medium hidden sm:inline">Social Profiles</span>
          </div>
        </div>

        <AuthError message={error} />

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] outline-none"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] outline-none"
                    placeholder="••••••••"
                    minLength="8"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!name || !email || password.length < 8}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-[#FFDE59] text-black font-medium rounded-md hover:bg-yellow-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Social Profiles */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="text-center mb-6">
                <Users size={24} className="mx-auto text-[#FFDE59] mb-2" />
                <h3 className="text-lg font-semibold text-gray-900">Connect Your Profiles</h3>
                <p className="text-sm text-gray-600">
                  Link your social profiles to showcase your work and connect with the community (optional)
                </p>
              </div>

              <div>
                <label htmlFor="githubUsername" className="block text-sm font-medium text-gray-700 mb-1">
                  <FaGithub size={16} className="inline mr-2 text-gray-900" />
                  GitHub Username
                </label>
                <input
                  id="githubUsername"
                  name="githubUsername"
                  type="text"
                  value={socialHandles.githubUsername}
                  onChange={(e) => handleSocialChange('githubUsername', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] outline-none"
                  placeholder="your_github_username"
                />
              </div>

              <div>
                <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  <FaLinkedin size={16} className="inline mr-2 text-blue-700" />
                  LinkedIn Profile
                </label>
                <input
                  id="linkedinUrl"
                  name="linkedinUrl"
                  type="url"
                  value={socialHandles.linkedinUrl}
                  onChange={(e) => handleSocialChange('linkedinUrl', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] outline-none"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div>
                <label htmlFor="twitterHandle" className="block text-sm font-medium text-gray-700 mb-1">
                  <FaTwitter size={16} className="inline mr-2 text-blue-500" />
                  Twitter Handle
                </label>
                <input
                  id="twitterHandle"
                  name="twitterHandle"
                  type="text"
                  value={socialHandles.twitterHandle}
                  onChange={(e) => handleSocialChange('twitterHandle', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] outline-none"
                  placeholder="@your_handle"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Note:</strong> You can add or update these social profiles later in your dashboard after completing the registration process.
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  Previous
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white transition-all duration-200 hover:-translate-y-1 active:translate-y-0 active:scale-95"
                  style={{ backgroundColor: '#000000' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#1F2937'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#000000'}
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" color="white" />
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="font-medium text-black hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </AuthLayout>
    </>
  );
};

export default SignUpPage;
